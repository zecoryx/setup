import { spawn, ChildProcess } from "child_process";
import { createOpencodeClient } from "@opencode-ai/sdk";
import { EventRouter } from "./eventRouter.ts";

export class OpencodeMonitor {
  private eventRouter: EventRouter;
  private port: number;
  private serveProcess: ChildProcess | null = null;
  private client: any = null;
  private isRunning: boolean = false;
  private abortController: AbortController | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private seenToolIds: Set<string> = new Set();
  private lastActiveSessionId: string = "";

  constructor(eventRouter: EventRouter, port: number = 4096) {
    this.eventRouter = eventRouter;
    this.port = port;
  }

  public async startServer(cwd?: string): Promise<string> {
    if (this.isRunning) {
      return `http://127.0.0.1:${this.port}`;
    }

    const serverUrl = `http://127.0.0.1:${this.port}`;

    this.eventRouter.dispatch({
      type: "status",
      message: `OpenCode serve ishga tushirilmoqda (: ${this.port})...`,
    });

    // Check if server is already running on this port
    const alreadyUp = await this.checkServerReady(serverUrl, 500);
    if (!alreadyUp) {
      this.serveProcess = spawn(
        "opencode",
        ["serve", "--port", String(this.port), "--hostname", "127.0.0.1"],
        {
          cwd: cwd || process.cwd(),
          env: { ...process.env },
          stdio: ["ignore", "pipe", "pipe"],
        }
      );

      this.serveProcess.on("error", (err) => {
        this.eventRouter.dispatch({
          type: "status",
          message: `OpenCode server xatosi: ${err.message}`,
        });
      });

      // Wait for server to become ready (up to 6 seconds)
      const ready = await this.waitForServer(serverUrl, 6000);
      if (!ready) {
        throw new Error(`OpenCode server ${serverUrl} da vaqtida ishga tushmadi`);
      }
    }

    this.isRunning = true;
    this.initSdk(serverUrl);
    this.startActivePolling(serverUrl);
    return serverUrl;
  }

  public getPtyCommand(serverUrl: string): { command: string; args: string[] } {
    return {
      command: "opencode",
      args: ["attach", serverUrl, "--mini"],
    };
  }

  private async checkServerReady(url: string, timeoutMs: number): Promise<boolean> {
    try {
      const res = await fetch(`${url}/health`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      return res.ok || res.status === 404;
    } catch {
      return false;
    }
  }

  private async waitForServer(url: string, maxWaitMs: number): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      if (await this.checkServerReady(url, 500)) {
        return true;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  }

  private async initSdk(serverUrl: string): Promise<void> {
    this.abortController = new AbortController();
    try {
      this.client = createOpencodeClient({ baseUrl: serverUrl });

      // Initial main agent
      this.eventRouter.dispatch({
        type: "agent:update",
        agent: {
          id: "main",
          name: "@opencode",
          status: "active",
          task: "OpenCode asosiy agent faol",
          updatedAt: new Date(),
        },
      });

      // Fetch initial config for default model if available
      try {
        const configRes = await fetch(`${serverUrl}/config`, {
          signal: AbortSignal.timeout(1000),
        });
        if (configRes.ok) {
          const configJson = (await configRes.json()) as any;
          if (configJson?.model) {
            const parts = String(configJson.model).split("/");
            this.eventRouter.dispatch({
              type: "model:update",
              model: {
                modelId: parts.slice(1).join("/") || parts[0],
                provider: parts.length > 1 ? parts[0] : "opencode",
              },
            });
          }
        }
      } catch {
        // quiet fallback
      }

      // Subscribe to SSE events & consume async generator
      const res = await this.client.event.subscribe({
        signal: this.abortController.signal,
      });

      if (res && res.stream) {
        (async () => {
          try {
            for await (const evt of res.stream) {
              this.handleEvent(evt);
            }
          } catch {
            // Stream finished or aborted
          }
        })();
      }
    } catch (err: any) {
      this.eventRouter.dispatch({
        type: "status",
        message: `SDK ulash xatosi: ${err?.message || err}`,
      });
    }
  }

  private startActivePolling(serverUrl: string): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      this.pollState(serverUrl);
    }, 1000);
    // immediate first poll
    this.pollState(serverUrl);
  }

  private async pollState(serverUrl: string): Promise<void> {
    if (!this.isRunning) return;

    try {
      const res = await fetch(`${serverUrl}/session`, {
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) return;

      const sessions = (await res.json()) as any[];
      if (!Array.isArray(sessions) || sessions.length === 0) return;

      // Sort sessions by updated descending
      sessions.sort((a, b) => (b.time?.updated || 0) - (a.time?.updated || 0));

      // Find active root session (no parentID)
      const activeSession = sessions.find((s) => !s.parentID) || sessions[0];
      if (!activeSession) return;
      this.lastActiveSessionId = activeSession.id;

      // 1. Update Model
      if (activeSession.model) {
        this.eventRouter.dispatch({
          type: "model:update",
          model: {
            modelId: activeSession.model.id || "default",
            provider: activeSession.model.providerID || "opencode",
          },
        });
      }

      // 2. Update Real Tokens & Cost
      if (activeSession.tokens) {
        const inTokens = activeSession.tokens.input || 0;
        const outTokens = activeSession.tokens.output || 0;
        const reasonTokens = activeSession.tokens.reasoning || 0;
        const cacheRead = activeSession.tokens.cache?.read || 0;
        const cacheWrite = activeSession.tokens.cache?.write || 0;
        this.eventRouter.dispatch({
          type: "tokens:update",
          usage: {
            inputTokens: inTokens,
            outputTokens: outTokens,
            reasoningTokens: reasonTokens,
            cacheRead,
            cacheWrite,
            totalTokens: inTokens + outTokens,
            costEstimate: activeSession.cost || 0,
          },
        });
      }

      // 3. Update Main Agent
      const agentName = activeSession.agent ? `@${activeSession.agent}` : "@opencode";
      this.eventRouter.dispatch({
        type: "agent:update",
        agent: {
          id: "main",
          name: agentName,
          status: "active",
          task: activeSession.title || "OpenCode sessiyasi",
          updatedAt: new Date(activeSession.time?.updated || Date.now()),
        },
      });

      // 4. Update Subagents (sessions with parentID matching activeSession)
      for (const s of sessions) {
        if (s.parentID && (s.parentID === activeSession.id || !activeSession.id)) {
          const subName = s.agent ? `@${s.agent}` : `@${s.title || "subagent"}`;
          const isDone = s.time?.updated && Date.now() - s.time.updated > 5000;
          this.eventRouter.dispatch({
            type: "agent:update",
            agent: {
              id: s.id,
              name: subName,
              status: isDone ? "completed" : "running",
              task: s.title || "Yordamchi agent vazifasi",
              updatedAt: new Date(s.time?.updated || Date.now()),
            },
          });
        }
      }

      // 5. Fetch messages to extract all real tools (Exa Web Search, bash, read, edit, etc.)
      const msgRes = await fetch(`${serverUrl}/session/${activeSession.id}/message`, {
        signal: AbortSignal.timeout(1500),
      });
      if (msgRes.ok) {
        const messages = (await msgRes.json()) as any[];
        if (Array.isArray(messages)) {
          const nowStr = new Date().toTimeString().split(" ")[0] || "";
          for (const msg of messages) {
            if (!Array.isArray(msg.parts)) continue;
            for (const pt of msg.parts) {
              if (pt.tool) {
                const toolId = pt.callID || pt.id || `${pt.tool}-${Date.now()}`;
                const toolTitle = pt.state?.title || "";
                const toolInput = pt.state?.input;
                let detail = toolTitle;
                if (!detail && toolInput) {
                  if (typeof toolInput === "string") detail = toolInput;
                  else if (toolInput.query) detail = String(toolInput.query);
                  else if (toolInput.command) detail = String(toolInput.command);
                  else if (toolInput.path) detail = String(toolInput.path);
                }

                // Check if this tool is a subagent spawner
                if (pt.tool === "task" || pt.tool === "subtask") {
                  const input = pt.state?.input || {};
                  const subagentName = input.agent || input.subagent_type || "researcher";
                  this.eventRouter.dispatch({
                    type: "agent:update",
                    agent: {
                      id: toolId,
                      name: `@${subagentName}`,
                      status: pt.state?.status === "completed" ? "completed" : "running",
                      task: detail || "Parallel agent vazifasi",
                      updatedAt: new Date(),
                    },
                  });
                } else {
                  // Regular tool (websearch, bash, edit, etc.)
                  const status =
                    pt.state?.status === "completed"
                      ? "completed"
                      : pt.state?.status === "error"
                      ? "failed"
                      : "running";

                  this.eventRouter.dispatch({
                    type: "tool:start",
                    tool: {
                      id: toolId,
                      name: pt.tool,
                      detail: detail ? detail.slice(0, 60) : "",
                      status,
                      timestamp: nowStr,
                    },
                  });
                }
              }

              // Step finish tokens
              if (pt.type === "step-finish" && pt.tokens) {
                const inTokens = pt.tokens.input || 0;
                const outTokens = pt.tokens.output || 0;
                const reasonTokens = pt.tokens.reasoning || 0;
                const cacheRead = pt.tokens.cache?.read || 0;
                const cacheWrite = pt.tokens.cache?.write || 0;
                this.eventRouter.dispatch({
                  type: "tokens:update",
                  usage: {
                    inputTokens: inTokens,
                    outputTokens: outTokens,
                    reasoningTokens: reasonTokens,
                    cacheRead,
                    cacheWrite,
                    totalTokens: inTokens + outTokens,
                    costEstimate: pt.cost || 0,
                  },
                });
              }
            }
          }
        }
      }
    } catch {
      // Quiet poll failure
    }
  }

  private handleEvent(data: any): void {
    if (!data) return;
    const nowStr = new Date().toTimeString().split(" ")[0] || "";

    const eventType = data.type || "";

    // 1. Message Updated
    if (eventType === "message.updated" && data.properties?.info) {
      const info = data.properties.info;
      if (info.modelID) {
        this.eventRouter.dispatch({
          type: "model:update",
          model: {
            modelId: info.modelID,
            provider: info.providerID || "opencode",
          },
        });
      }

      if (info.tokens) {
        const inTokens = info.tokens.input || 0;
        const outTokens = info.tokens.output || 0;
        const reasonTokens = info.tokens.reasoning || 0;
        const cacheRead = info.tokens.cache?.read || 0;
        const cacheWrite = info.tokens.cache?.write || 0;
        this.eventRouter.dispatch({
          type: "tokens:update",
          usage: {
            inputTokens: inTokens,
            outputTokens: outTokens,
            reasoningTokens: reasonTokens,
            cacheRead,
            cacheWrite,
            totalTokens: inTokens + outTokens,
            costEstimate: info.cost || 0,
          },
        });
      }
      return;
    }

    // 2. Message Part Updated
    if (eventType === "message.part.updated" && data.properties?.part) {
      const part = data.properties.part;

      if (part.type === "subtask") {
        this.eventRouter.dispatch({
          type: "agent:update",
          agent: {
            id: part.id || `subtask-${Date.now()}`,
            name: `@${part.agent || "subagent"}`,
            status: "running",
            task: part.description || (part.prompt ? String(part.prompt).slice(0, 50) : "Subtask"),
            updatedAt: new Date(),
          },
        });
        return;
      }

      if (part.type === "agent" && part.name) {
        this.eventRouter.dispatch({
          type: "agent:update",
          agent: {
            id: `agent-${part.name}`,
            name: `@${part.name}`,
            status: "running",
            task: "Agent ishga tushirildi",
            updatedAt: new Date(),
          },
        });
        return;
      }

      if (part.type === "step-finish" && part.tokens) {
        const inTokens = part.tokens.input || 0;
        const outTokens = part.tokens.output || 0;
        const reasonTokens = part.tokens.reasoning || 0;
        const cacheRead = part.tokens.cache?.read || 0;
        const cacheWrite = part.tokens.cache?.write || 0;
        this.eventRouter.dispatch({
          type: "tokens:update",
          usage: {
            inputTokens: inTokens,
            outputTokens: outTokens,
            reasoningTokens: reasonTokens,
            cacheRead,
            cacheWrite,
            totalTokens: inTokens + outTokens,
            costEstimate: part.cost || 0,
          },
        });
        return;
      }

      if (part.type === "tool" && part.tool) {
        const toolName = part.tool;
        const toolId = part.callID || part.id || `${toolName}-${Date.now()}`;
        const toolState = part.state || {};
        const status =
          toolState.status === "completed"
            ? "completed"
            : toolState.status === "error"
            ? "failed"
            : "running";

        if (toolName === "task" || toolName === "subtask") {
          const input = toolState.input || {};
          const subagentName = input.agent || input.subagent_type || input.name || "researcher";
          const desc =
            input.description || input.prompt || toolState.title || "Parallel agent vazifasi";

          this.eventRouter.dispatch({
            type: "agent:update",
            agent: {
              id: toolId,
              name: `@${subagentName}`,
              status,
              task: typeof desc === "string" ? desc.slice(0, 50) : "Agent vazifasi",
              updatedAt: new Date(),
            },
          });
          return;
        }

        let detail = toolState.title || "";
        if (!detail && toolState.input) {
          const inp = toolState.input;
          if (typeof inp === "string") detail = inp;
          else if (inp.query) detail = String(inp.query);
          else if (inp.command) detail = String(inp.command);
          else if (inp.path) detail = String(inp.path);
        }

        this.eventRouter.dispatch({
          type: "tool:start",
          tool: {
            id: toolId,
            name: toolName,
            detail: detail ? detail.slice(0, 60) : "",
            status,
            timestamp: nowStr,
          },
        });
        return;
      }
    }

    // 3. Sub-Sessions
    if ((eventType === "session.created" || eventType === "session.updated") && data.properties?.info) {
      const session = data.properties.info;
      if (session.parentID) {
        const title = session.title || "Subagent";
        this.eventRouter.dispatch({
          type: "agent:update",
          agent: {
            id: session.id,
            name: `@${(session.agent || title).replace(/^@/, "")}`,
            status: "running",
            task: title,
            updatedAt: new Date(),
          },
        });
      }
      return;
    }
  }

  public stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.serveProcess) {
      try {
        this.serveProcess.kill("SIGTERM");
      } catch {
        // ignore
      }
      this.serveProcess = null;
    }
    this.isRunning = false;
  }
}
