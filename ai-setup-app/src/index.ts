import { calculateLayout } from "./ui/layout.ts";
import { theme } from "./theme/vague.ts";
import { AgentsPane } from "./ui/agentsPane.ts";
import { SkillsPane } from "./ui/skillsPane.ts";
import { TokensModelPane } from "./ui/tokensModelPane.ts";
import { PtyPane, type TabViewInfo } from "./ui/ptyPane.ts";
import { TerminalEmbed } from "./pty/terminalEmbed.ts";
import { EventRouter } from "./engine/eventRouter.ts";
import { OpencodeMonitor } from "./engine/opencodeMonitor.ts";
import { ClaudeMonitor } from "./engine/claudeMonitor.ts";
import type { AgentInfo, ToolCallInfo, TokenUsageInfo, ModelInfo, AgentEvent } from "./types/events.ts";

interface SessionTab {
  id: string;
  title: string;
  engine: "opencode" | "claude" | "idle";
  terminal: TerminalEmbed | null;
  commandInput: string;
  opencodeMonitor: OpencodeMonitor | null;
  claudeMonitor: ClaudeMonitor | null;
  agents: AgentInfo[];
  tools: ToolCallInfo[];
  tokens: Partial<TokenUsageInfo>;
  model: ModelInfo;
}

class AiDeckApp {
  public agentsPane: AgentsPane;
  public skillsPane: SkillsPane;
  public tokensModelPane: TokensModelPane;
  public ptyPane: PtyPane;

  private tabs: SessionTab[] = [];
  public activeTabIndex: number = 0;

  private activePane: 1 | 2 | 3 | 4 = 4;
  private mode: "cli" | "nav" = "cli";
  private lastEscTime: number = 0;

  private ptyRenderTimer: NodeJS.Timeout | null = null;
  private panesRenderTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.agentsPane = new AgentsPane();
    this.skillsPane = new SkillsPane();
    this.tokensModelPane = new TokensModelPane();
    this.ptyPane = new PtyPane();

    // Initialize with Tab 1
    this.tabs.push(this.createTabObject("opencode", "idle"));

    this.setupTerminal();
    process.stdout.write("\x1b[2J"); // initial screen clear
    this.renderFull();
  }

  private createTabObject(title: string, engine: "opencode" | "claude" | "idle"): SessionTab {
    return {
      id: Math.random().toString(36).substring(2, 9),
      title,
      engine,
      terminal: null,
      commandInput: "",
      opencodeMonitor: null,
      claudeMonitor: null,
      agents: [],
      tools: [],
      tokens: { inputTokens: 0, outputTokens: 0, totalTokens: 0, contextWindow: 200000, costEstimate: 0 },
      model: { modelId: "", provider: "" },
    };
  }

  private setupTerminal(): void {
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");

    // Enter alternate screen buffer & hide cursor
    process.stdout.write("\x1b[?1049h\x1b[?25l");

    process.stdin.on("data", (chunk: string) => {
      this.handleInput(chunk);
    });

    process.stdout.on("resize", () => {
      this.handleResize();
    });

    const cleanupFn = () => this.cleanup();
    process.on("exit", cleanupFn);
    process.on("SIGINT", cleanupFn);
    process.on("SIGTERM", cleanupFn);
  }

  private handleResize(): void {
    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);

    for (const tab of this.tabs) {
      if (tab.terminal && tab.terminal.isRunning()) {
        tab.terminal.resize(layout.chat.width - 2, layout.chat.height - 2);
      }
    }
    process.stdout.write("\x1b[2J");
    this.renderFull();
  }

  private cleanup(): void {
    for (const tab of this.tabs) {
      this.stopTabEngine(tab);
    }
    process.stdout.write("\x1b[?25h\x1b[?1049l");
  }

  // --- Targeted Anti-Glitch Rendering Pipeline ---

  public queuePtyRender(): void {
    if (this.ptyRenderTimer) return;
    this.ptyRenderTimer = setTimeout(() => {
      this.ptyRenderTimer = null;
      this.renderPtyOnly();
    }, 33); // 30 FPS smooth terminal stream
  }

  public queuePanesRender(): void {
    if (this.panesRenderTimer) return;
    this.panesRenderTimer = setTimeout(() => {
      this.panesRenderTimer = null;
      this.renderPanesOnly();
    }, 50); // 20 FPS for side panels
  }

  private renderPtyOnly(): void {
    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);
    const activeTab = this.tabs[this.activeTabIndex];
    if (!activeTab || !activeTab.terminal || !activeTab.terminal.isRunning()) return;

    const buffer: string[] = ["\x1b[?2026h"]; // Begin synchronized update
    const lines = activeTab.terminal.getVisibleLines();
    const innerHeight = layout.chat.height - 2;
    const borderColor = this.activePane === 4 ? theme.borderActive : theme.borderInactive;
    const v = "│";

    for (let i = 0; i < innerHeight; i++) {
      const cy = layout.chat.y + 1 + i;
      const lineContent = lines[i] || "";
      buffer.push(`\x1b[${cy};${layout.chat.x}H${borderColor}${v}${theme.reset}`);
      buffer.push(lineContent + "\x1b[K");
      buffer.push(`\x1b[${cy};${layout.chat.x + layout.chat.width - 1}H${borderColor}${v}${theme.reset}`);
    }

    buffer.push("\x1b[?2026l"); // End synchronized update
    process.stdout.write(buffer.join(""));
  }

  private renderPanesOnly(): void {
    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);

    const buffer: string[] = ["\x1b[?2026h"]; // Begin synchronized update
    this.agentsPane.render(layout.agents, this.activePane === 1, buffer);
    this.skillsPane.render(layout.skills, this.activePane === 2, buffer);
    this.tokensModelPane.render(layout.tokensModel, this.activePane === 3, buffer);
    buffer.push("\x1b[?2026l"); // End synchronized update
    process.stdout.write(buffer.join(""));
  }

  public renderFull(): void {
    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);

    const buffer: string[] = ["\x1b[?2026h", "\x1b[H"];

    // Render Left Panes
    this.agentsPane.render(layout.agents, this.activePane === 1, buffer);
    this.skillsPane.render(layout.skills, this.activePane === 2, buffer);
    this.tokensModelPane.render(layout.tokensModel, this.activePane === 3, buffer);

    // Prepare Tabs View Info
    const tabsView: TabViewInfo[] = this.tabs.map((t) => ({
      id: t.id,
      title: t.title,
      engine: t.engine,
      isRunning: t.terminal !== null && t.terminal.isRunning(),
    }));

    const activeTab = this.tabs[this.activeTabIndex];
    const activeTerminal = activeTab ? activeTab.terminal : null;
    const activeInput = activeTab ? activeTab.commandInput : "";

    // Render Right Multi-Tab PTY Pane
    this.ptyPane.render(
      layout.chat,
      this.activePane === 4,
      tabsView,
      this.activeTabIndex,
      activeTerminal,
      activeInput,
      buffer
    );

    // Footer Bar
    const footerText = `${theme.fgDim}Tugmalar: ${theme.blue}[Alt+1..${this.tabs.length}]${theme.fg} Tablar  ${theme.blue}[Alt+N]${theme.fg} Yangi Tab  ${theme.blue}[Esc]${theme.fg} Nav [1..4]  ${theme.blue}[Space]${theme.fg} Skill On/Off  ${theme.blue}[PgUp/PgDn]${theme.fg} Scroll  ${theme.blue}[Ctrl+C]${theme.fg} Chiqish${theme.reset}`;
    buffer.push(`\x1b[${rows};1H${footerText}\x1b[K`);

    buffer.push("\x1b[?2026l"); // End synchronized update
    process.stdout.write(buffer.join(""));
  }

  // --- Input Handling ---

  private handleInput(chunk: string): void {
    // 1. Tab switching: Alt+1..9
    if (/^\x1b[1-9]$/.test(chunk)) {
      const tabNum = parseInt(chunk[1], 10) - 1;
      if (tabNum >= 0 && tabNum < this.tabs.length) {
        this.switchTab(tabNum);
        return;
      }
    }

    // 2. Tab management: Alt+N / Ctrl+N
    if (chunk === "\x1bn" || chunk === "\x0e" || chunk === "\x14") {
      this.addNewTab();
      return;
    }

    // 3. Tab close: Alt+W / Ctrl+W
    if (chunk === "\x1bw" || chunk === "\x17") {
      this.closeActiveTab();
      return;
    }

    // 4. Double Escape (<350ms): Stop CLI in current tab
    if (chunk === "\x1b") {
      const now = Date.now();
      if (now - this.lastEscTime < 350) {
        const activeTab = this.tabs[this.activeTabIndex];
        if (activeTab) {
          this.stopTabEngine(activeTab);
          this.lastEscTime = 0;
          this.mode = "cli";
          this.activePane = 4;
          this.renderFull();
          return;
        }
      }
      this.lastEscTime = now;

      // Single Esc: Toggle Nav/CLI mode
      if (this.mode === "cli") {
        this.mode = "nav";
      } else {
        this.mode = "cli";
        this.activePane = 4;
      }
      this.renderFull();
      return;
    }

    // 5. Global Ctrl+C (\x03)
    if (chunk === "\x03") {
      const activeTab = this.tabs[this.activeTabIndex];
      if (activeTab && activeTab.terminal && activeTab.terminal.isRunning()) {
        activeTab.terminal.write("\x03");
        return;
      } else {
        this.cleanup();
        process.exit(0);
      }
    }

    // 6. Navigation mode
    if (this.mode === "nav") {
      this.handleNavInput(chunk);
      return;
    }

    // 7. CLI mode
    this.handleCliInput(chunk);
  }

  private handleNavInput(chunk: string): void {
    if (chunk === "q" || chunk === "Q") {
      this.cleanup();
      process.exit(0);
    }

    if (chunk === "n" || chunk === "t") {
      this.addNewTab();
      return;
    }

    if (chunk === "w" || chunk === "x") {
      this.closeActiveTab();
      return;
    }

    if (chunk === "]" || chunk === "\t") {
      const nextIdx = (this.activeTabIndex + 1) % this.tabs.length;
      this.switchTab(nextIdx);
      return;
    }

    if (chunk === "[") {
      const prevIdx = (this.activeTabIndex - 1 + this.tabs.length) % this.tabs.length;
      this.switchTab(prevIdx);
      return;
    }

    if (chunk === "1") {
      this.activePane = 1;
      this.renderFull();
      return;
    }
    if (chunk === "2") {
      this.activePane = 2;
      this.renderFull();
      return;
    }
    if (chunk === "3") {
      this.activePane = 3;
      this.renderFull();
      return;
    }
    if (chunk === "4" || chunk === "i" || chunk === "I") {
      this.activePane = 4;
      this.mode = "cli";
      this.renderFull();
      return;
    }

    // Space key: Toggle skill On/Off when on panel 2
    if (chunk === " " && this.activePane === 2) {
      this.skillsPane.toggleCurrent();
      this.renderPanesOnly();
      return;
    }

    // Arrow keys & Scrolling per pane
    if (chunk === "\x1b[A" || chunk === "k") {
      if (this.activePane === 1) {
        this.agentsPane.moveUp();
        this.renderPanesOnly();
      } else if (this.activePane === 2) {
        this.skillsPane.moveUp();
        this.renderPanesOnly();
      } else if (this.activePane === 4) {
        const activeTab = this.tabs[this.activeTabIndex];
        if (activeTab && activeTab.terminal) {
          activeTab.terminal.scroll(1);
          this.renderPtyOnly();
        }
      }
      return;
    }
    if (chunk === "\x1b[B" || chunk === "j") {
      if (this.activePane === 1) {
        this.agentsPane.moveDown();
        this.renderPanesOnly();
      } else if (this.activePane === 2) {
        this.skillsPane.moveDown();
        this.renderPanesOnly();
      } else if (this.activePane === 4) {
        const activeTab = this.tabs[this.activeTabIndex];
        if (activeTab && activeTab.terminal) {
          activeTab.terminal.scroll(-1);
          this.renderPtyOnly();
        }
      }
      return;
    }

    // PageUp / PageDown in nav mode
    if (chunk === "\x1b[5~" || chunk === "\x15") {
      // PageUp / Ctrl+u
      if (this.activePane === 4) {
        const activeTab = this.tabs[this.activeTabIndex];
        if (activeTab && activeTab.terminal) {
          activeTab.terminal.scroll(10);
          this.renderPtyOnly();
        }
      }
      return;
    }
    if (chunk === "\x1b[6~" || chunk === "\x04") {
      // PageDown / Ctrl+d
      if (this.activePane === 4) {
        const activeTab = this.tabs[this.activeTabIndex];
        if (activeTab && activeTab.terminal) {
          activeTab.terminal.scroll(-10);
          this.renderPtyOnly();
        }
      }
      return;
    }

    if (chunk === "G" && this.activePane === 4) {
      const activeTab = this.tabs[this.activeTabIndex];
      if (activeTab && activeTab.terminal) {
        activeTab.terminal.scrollToBottom();
        this.renderPtyOnly();
      }
      return;
    }
    if (chunk === "g" && this.activePane === 4) {
      const activeTab = this.tabs[this.activeTabIndex];
      if (activeTab && activeTab.terminal) {
        activeTab.terminal.scrollToTop();
        this.renderPtyOnly();
      }
      return;
    }
  }

  private handleCliInput(chunk: string): void {
    const activeTab = this.tabs[this.activeTabIndex];
    if (!activeTab) return;

    const isRunning = activeTab.terminal !== null && activeTab.terminal.isRunning();

    if (isRunning && activeTab.terminal) {
      // CLI mode scrolling: PageUp / PageDown / Shift+Up / Shift+Down
      if (chunk === "\x1b[5~") {
        activeTab.terminal.scroll(10);
        this.renderPtyOnly();
        return;
      }
      if (chunk === "\x1b[6~") {
        activeTab.terminal.scroll(-10);
        this.renderPtyOnly();
        return;
      }
      if (chunk === "\x1b[1;2A") {
        activeTab.terminal.scroll(2);
        this.renderPtyOnly();
        return;
      }
      if (chunk === "\x1b[1;2B") {
        activeTab.terminal.scroll(-2);
        this.renderPtyOnly();
        return;
      }

      // Forward regular input directly to PTY (typing jumps to live bottom)
      activeTab.terminal.write(chunk);
      return;
    }

    // Idle state: typing engine command (e.g. "opencode" or "claude")
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];
      if (ch === "\r" || ch === "\n") {
        const cmd = activeTab.commandInput.trim().toLowerCase();
        activeTab.commandInput = "";

        if (cmd === "opencode") {
          this.launchOpencode(activeTab);
        } else if (cmd === "claude") {
          this.launchClaude(activeTab);
        } else if (cmd === "exit" || cmd === "quit") {
          this.closeActiveTab();
        }
        this.renderFull();
        return;
      } else if (ch === "\x7f" || ch === "\b") {
        activeTab.commandInput = activeTab.commandInput.slice(0, -1);
      } else if (ch >= " " && ch !== "\x7f") {
        activeTab.commandInput += ch;
      }
    }
    this.renderFull();
  }

  private addNewTab(): void {
    const newIdx = this.tabs.length;
    const newTab = this.createTabObject(`tab-${newIdx + 1}`, "idle");
    this.tabs.push(newTab);
    this.switchTab(newIdx);
  }

  private closeActiveTab(): void {
    if (this.tabs.length <= 1) {
      const current = this.tabs[0];
      this.stopTabEngine(current);
      current.title = "tab-1";
      this.renderFull();
      return;
    }

    const currentTab = this.tabs[this.activeTabIndex];
    this.stopTabEngine(currentTab);
    this.tabs.splice(this.activeTabIndex, 1);
    this.activeTabIndex = Math.min(this.activeTabIndex, this.tabs.length - 1);
    this.restoreTabState(this.tabs[this.activeTabIndex]);
    this.renderFull();
  }

  private switchTab(newIndex: number): void {
    if (newIndex === this.activeTabIndex && this.tabs[newIndex]) return;

    // Save state of current tab
    const cur = this.tabs[this.activeTabIndex];
    if (cur) {
      cur.agents = [...this.agentsPane.agents];
      cur.tokens = { ...this.tokensModelPane.tokenUsage };
      cur.model = { ...this.tokensModelPane.model };
    }

    this.activeTabIndex = newIndex;
    this.restoreTabState(this.tabs[newIndex]);
    this.renderFull();
  }

  private restoreTabState(tab: SessionTab): void {
    if (!tab) return;
    this.agentsPane.agents = [...tab.agents];
    this.tokensModelPane.tokenUsage = {
      inputTokens: tab.tokens.inputTokens || 0,
      outputTokens: tab.tokens.outputTokens || 0,
      reasoningTokens: tab.tokens.reasoningTokens || 0,
      cacheRead: tab.tokens.cacheRead || 0,
      cacheWrite: tab.tokens.cacheWrite || 0,
      totalTokens: tab.tokens.totalTokens || 0,
      contextWindow: tab.tokens.contextWindow || 200000,
      costEstimate: tab.tokens.costEstimate || 0,
    };
    this.tokensModelPane.model = { ...tab.model };
  }

  public dispatchTabEvent(tabIndex: number, event: AgentEvent): void {
    const tab = this.tabs[tabIndex];
    if (!tab) return;

    // Persist into tab
    switch (event.type) {
      case "agent:update": {
        const idx = tab.agents.findIndex((a) => a.id === event.agent.id);
        if (idx >= 0) tab.agents[idx] = event.agent;
        else tab.agents.push(event.agent);
        break;
      }
      case "tool:start": {
        this.skillsPane.markToolUsed(event.tool);
        break;
      }
      case "model:update": {
        tab.model = { ...tab.model, ...event.model };
        break;
      }
      case "tokens:update": {
        tab.tokens = { ...tab.tokens, ...event.usage };
        break;
      }
    }

    // If active tab, update UI immediately
    if (tabIndex === this.activeTabIndex) {
      switch (event.type) {
        case "agent:update":
          this.agentsPane.updateAgent(event.agent);
          break;
        case "tool:start":
          this.skillsPane.markToolUsed(event.tool);
          break;
        case "model:update":
          this.tokensModelPane.updateModel(event.model);
          break;
        case "tokens:update":
          this.tokensModelPane.updateTokens(event.usage);
          break;
      }
      this.queuePanesRender();
    }
  }

  private async launchOpencode(tab: SessionTab): Promise<void> {
    this.stopTabEngine(tab);
    tab.engine = "opencode";
    tab.title = "opencode";
    this.mode = "cli";
    this.activePane = 4;

    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);

    this.renderFull();

    try {
      const tabIndex = this.tabs.indexOf(tab);
      const tabRouter = {
        dispatch: (e: AgentEvent) => this.dispatchTabEvent(tabIndex, e),
        clearAll: () => {},
      } as EventRouter;

      const port = 4096 + tabIndex;
      tab.opencodeMonitor = new OpencodeMonitor(tabRouter, port);
      const serverUrl = await tab.opencodeMonitor.startServer();
      const ptyCmd = tab.opencodeMonitor.getPtyCommand(serverUrl);

      const ptyCols = Math.max(20, layout.chat.width - 2);
      const ptyRows = Math.max(5, layout.chat.height - 2);

      tab.terminal = new TerminalEmbed(ptyCols, ptyRows);
      tab.terminal.start(ptyCmd.command, ptyCmd.args, {
        cols: ptyCols,
        rows: ptyRows,
        onData: () => this.queuePtyRender(),
        onExit: () => {
          this.stopTabEngine(tab);
          this.renderFull();
        },
      });

      this.renderFull();
    } catch {
      this.stopTabEngine(tab);
      this.renderFull();
    }
  }

  private async launchClaude(tab: SessionTab): Promise<void> {
    this.stopTabEngine(tab);
    tab.engine = "claude";
    tab.title = "claude";
    this.mode = "cli";
    this.activePane = 4;

    const cols = process.stdout.columns || 120;
    const rows = process.stdout.rows || 36;
    const layout = calculateLayout(cols, rows);

    this.renderFull();

    try {
      const tabIndex = this.tabs.indexOf(tab);
      const tabRouter = {
        dispatch: (e: AgentEvent) => this.dispatchTabEvent(tabIndex, e),
        clearAll: () => {},
      } as EventRouter;

      tab.claudeMonitor = new ClaudeMonitor(tabRouter);
      tab.claudeMonitor.startMonitoring();
      const ptyCmd = tab.claudeMonitor.getPtyCommand();

      const ptyCols = Math.max(20, layout.chat.width - 2);
      const ptyRows = Math.max(5, layout.chat.height - 2);

      tab.terminal = new TerminalEmbed(ptyCols, ptyRows);
      tab.terminal.start(ptyCmd.command, ptyCmd.args, {
        cols: ptyCols,
        rows: ptyRows,
        onData: () => this.queuePtyRender(),
        onExit: () => {
          this.stopTabEngine(tab);
          this.renderFull();
        },
      });

      this.renderFull();
    } catch {
      this.stopTabEngine(tab);
      this.renderFull();
    }
  }

  private stopTabEngine(tab: SessionTab): void {
    if (tab.terminal) {
      tab.terminal.kill();
      tab.terminal = null;
    }
    if (tab.opencodeMonitor) {
      tab.opencodeMonitor.stop();
      tab.opencodeMonitor = null;
    }
    if (tab.claudeMonitor) {
      tab.claudeMonitor.stop();
      tab.claudeMonitor = null;
    }
    tab.engine = "idle";
  }
}

new AiDeckApp();
