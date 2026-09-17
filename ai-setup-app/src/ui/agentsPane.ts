import { drawBox, type Rect } from "./layout.ts";
import { theme } from "../theme/vague.ts";
import type { AgentInfo } from "../types/events.ts";

export class AgentsPane {
  public agents: AgentInfo[] = [];
  public selectedIndex: number = 0;
  public scrollOffset: number = 0;

  public updateAgent(agent: AgentInfo): void {
    // Clean redundant suffix from task (e.g. "(@explore subagent)")
    let cleanTask = agent.task || "";
    cleanTask = cleanTask.replace(/\s*\(@[a-zA-Z0-9_-]+\s+subagent\)/gi, "").trim();

    // Deduplicate by cleanTask and name
    const idx = this.agents.findIndex(
      (a) =>
        a.id === agent.id ||
        (cleanTask && a.name === agent.name && a.task === cleanTask)
    );

    const updatedInfo: AgentInfo = {
      ...agent,
      task: cleanTask,
    };

    if (idx >= 0) {
      this.agents[idx] = updatedInfo;
    } else {
      this.agents.push(updatedInfo);
    }
  }

  public clear(): void {
    this.agents = [];
    this.selectedIndex = 0;
    this.scrollOffset = 0;
  }

  public moveUp(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      if (this.selectedIndex < this.scrollOffset) {
        this.scrollOffset = this.selectedIndex;
      }
    }
  }

  public moveDown(): void {
    if (this.selectedIndex < this.agents.length - 1) {
      this.selectedIndex++;
    }
  }

  public render(rect: Rect, isActive: boolean, buffer: string[]): void {
    const title = isActive
      ? "[1] AGENTS / SUBAGENTS  [↑/↓: Ko'rish]"
      : "[1] AGENTS / SUBAGENTS";

    drawBox(rect, title, isActive, buffer);

    const innerWidth = rect.width - 2;
    const innerHeight = rect.height - 2;
    if (innerWidth <= 0 || innerHeight <= 0) return;

    // Adjust scroll window
    if (this.selectedIndex >= this.scrollOffset + innerHeight) {
      this.scrollOffset = this.selectedIndex - innerHeight + 1;
    }
    if (this.selectedIndex < this.scrollOffset) {
      this.scrollOffset = this.selectedIndex;
    }

    // Clear inner area
    const emptyRow = " ".repeat(innerWidth);
    for (let i = 0; i < innerHeight; i++) {
      buffer.push(`\x1b[${rect.y + 1 + i};${rect.x + 1}H${emptyRow}`);
    }

    if (this.agents.length === 0) {
      buffer.push(
        `\x1b[${rect.y + 2};${rect.x + 3}H${theme.fgDim}○ Faol agentlar yo'q (CLI subagent yaratganda bu yerda chiqadi)${theme.reset}`
      );
      return;
    }

    const visible = this.agents.slice(this.scrollOffset, this.scrollOffset + innerHeight);

    for (let i = 0; i < visible.length; i++) {
      const agent = visible[i];
      const actualIndex = this.scrollOffset + i;
      const isSelected = actualIndex === this.selectedIndex && isActive;
      const cy = rect.y + 1 + i;

      let statusBadge = "";
      if (agent.status === "active" || agent.status === "running") {
        statusBadge = `${theme.green}● Ishlamoqda${theme.reset}`;
      } else if (agent.status === "completed") {
        statusBadge = `${theme.fgDim}✓ Tugadi${theme.reset}`;
      } else if (agent.status === "failed") {
        statusBadge = `${theme.red}✗ Xato${theme.reset}`;
      } else {
        statusBadge = `${theme.fgDim}○ Kutmoqda${theme.reset}`;
      }

      const cursor = isSelected ? `${theme.blue}❯${theme.reset} ` : "  ";
      const nameColor = isSelected ? theme.blue + theme.bold : theme.cyan;
      const maxTaskLen = Math.max(10, innerWidth - agent.name.length - 24);
      const taskStr = agent.task
        ? ` ${theme.fgDim}— ${agent.task.slice(0, maxTaskLen)}${theme.reset}`
        : "";

      const line = `${cursor}${nameColor}${agent.name}${theme.reset} [${statusBadge}]${taskStr}`;
      buffer.push(`\x1b[${cy};${rect.x + 2}H${line}`);
    }
  }
}
