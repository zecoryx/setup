import { randomUUID } from "crypto";
import { EventRouter } from "./eventRouter.ts";
import {
  getSessionMessages,
  listSubagents,
} from "@anthropic-ai/claude-agent-sdk";

export class ClaudeMonitor {
  private eventRouter: EventRouter;
  private sessionId: string;
  private isRunning: boolean = false;
  private pollTimer: NodeJS.Timeout | null = null;
  private seenMessageIds: Set<string> = new Set();
  private seenToolIds: Set<string> = new Set();

  constructor(eventRouter: EventRouter) {
    this.eventRouter = eventRouter;
    this.sessionId = randomUUID();
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getPtyCommand(): { command: string; args: string[] } {
    return {
      command: "claude",
      args: ["--session-id", this.sessionId],
    };
  }

  public startMonitoring(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.eventRouter.dispatch({
      type: "model:update",
      model: {
        modelId: "claude-3-5-sonnet",
        provider: "anthropic",
      },
    });

    this.eventRouter.dispatch({
      type: "agent:update",
      agent: {
        id: "main",
        name: "@claude",
        status: "active",
        task: "Claude Code asosiy agent faol",
        updatedAt: new Date(),
      },
    });

    // Start polling session state
    this.pollTimer = setInterval(() => {
      this.pollState();
    }, 1500);
  }

  private async pollState(): Promise<void> {
    if (!this.isRunning) return;

    const nowStr = new Date().toTimeString().split(" ")[0] || "";

    try {
      // 1. Check subagents
      const subagents = await listSubagents({ sessionId: this.sessionId }).catch(() => []);
      if (Array.isArray(subagents)) {
        for (const sub of subagents) {
          this.eventRouter.dispatch({
            type: "agent:update",
            agent: {
              id: sub.id || sub.name,
              name: `@${sub.name || "subagent"}`,
              status: sub.status === "completed" ? "completed" : "running",
              task: sub.task || sub.description || "Subagent vazifasi",
              updatedAt: new Date(),
            },
          });
        }
      }

      // 2. Check session messages & tool calls
      const messages = await getSessionMessages(this.sessionId).catch(() => []);
      if (Array.isArray(messages)) {
        for (const msg of messages) {
          const msgId = msg.id || JSON.stringify(msg).slice(0, 30);
          if (this.seenMessageIds.has(msgId)) continue;
          this.seenMessageIds.add(msgId);

          if (msg.model) {
            this.eventRouter.dispatch({
              type: "model:update",
              model: {
                modelId: msg.model,
                provider: "anthropic",
              },
            });
          }

          // Content blocks
          if (Array.isArray(msg.content)) {
            for (const block of msg.content) {
              if (block.type === "tool_use") {
                const toolId = block.id || `${block.name}-${Date.now()}`;
                if (!this.seenToolIds.has(toolId)) {
                  this.seenToolIds.add(toolId);
                  const detail = block.input
                    ? JSON.stringify(block.input).slice(0, 40)
                    : "";
                  this.eventRouter.dispatch({
                    type: "tool:start",
                    tool: {
                      id: toolId,
                      name: block.name || "tool",
                      detail,
                      status: "running",
                      timestamp: nowStr,
                    },
                  });
                }
              } else if (block.type === "tool_result") {
                const toolId = block.tool_use_id;
                if (toolId) {
                  this.eventRouter.dispatch({
                    type: "tool:update",
                    tool: {
                      id: toolId,
                      status: block.is_error ? "failed" : "completed",
                    },
                  });
                }
              }
            }
          }

          // Token usage
          if (msg.usage) {
            const inTokens = msg.usage.input_tokens || 0;
            const outTokens = msg.usage.output_tokens || 0;
            const cacheRead = msg.usage.cache_read_input_tokens || 0;
            const cacheWrite = msg.usage.cache_creation_input_tokens || 0;
            this.eventRouter.dispatch({
              type: "tokens:update",
              usage: {
                inputTokens: inTokens,
                outputTokens: outTokens,
                cacheRead,
                cacheWrite,
                totalTokens: inTokens + outTokens,
                contextWindow: 200000,
              },
            });
          }
        }
      }
    } catch {
      // Quiet poll failure
    }
  }

  public stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.isRunning = false;
  }
}
