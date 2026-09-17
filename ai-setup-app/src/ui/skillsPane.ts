import { drawBox, type Rect } from "./layout.ts";
import { theme } from "../theme/vague.ts";
import type { ToolCallInfo } from "../types/events.ts";

export interface SkillItem {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  lastUsed?: string;
  active?: boolean;
}

export class SkillsPane {
  public skills: SkillItem[] = [
    {
      id: "websearch",
      name: "Web Search & Fetch",
      desc: "Internetdan qidiruv (Exa / Google)",
      enabled: true,
    },
    {
      id: "filesystem",
      name: "File System (Read/Edit)",
      desc: "Fayllarni o'qish, yaratish va tahrirlash",
      enabled: true,
    },
    {
      id: "bash",
      name: "Bash Runner",
      desc: "Terminal buyruqlari, test va build",
      enabled: true,
    },
    {
      id: "diagnostics",
      name: "Code Diagnostics / LSP",
      desc: "Kod tahlili, sintaksis va xatolar",
      enabled: true,
    },
    {
      id: "git",
      name: "Git Assistant",
      desc: "Diff, commit, status va versiyalar",
      enabled: true,
    },
    {
      id: "subagents",
      name: "Subagent Delegation",
      desc: "Vazifalarni parallel agentlarga taqsimlash",
      enabled: true,
    },
    {
      id: "database",
      name: "Database Tools",
      desc: "PostgreSQL, SQL va bazalar",
      enabled: true,
    },
    {
      id: "mcp",
      name: "MCP External Gateways",
      desc: "Tashqi MCP serverlari va integratsiyalar",
      enabled: true,
    },
  ];

  public selectedIndex: number = 0;
  public scrollOffset: number = 0;

  // Called when AI runs a tool to highlight that skill
  public markToolUsed(tool: ToolCallInfo): void {
    const tName = tool.name.toLowerCase();
    let targetId = "mcp";

    if (tName.includes("web") || tName.includes("search") || tName.includes("exa")) {
      targetId = "websearch";
    } else if (tName.includes("read") || tName.includes("edit") || tName.includes("write") || tName.includes("glob") || tName.includes("grep")) {
      targetId = "filesystem";
    } else if (tName.includes("bash") || tName.includes("shell") || tName.includes("exec")) {
      targetId = "bash";
    } else if (tName.includes("task") || tName.includes("agent") || tName.includes("subtask")) {
      targetId = "subagents";
    } else if (tName.includes("git")) {
      targetId = "git";
    } else if (tName.includes("db") || tName.includes("sql") || tName.includes("database")) {
      targetId = "database";
    }

    const item = this.skills.find((s) => s.id === targetId);
    if (item) {
      item.lastUsed = tool.timestamp || new Date().toTimeString().split(" ")[0];
      item.active = tool.status === "running";
    }
  }

  public toggleCurrent(): void {
    if (this.skills[this.selectedIndex]) {
      this.skills[this.selectedIndex].enabled = !this.skills[this.selectedIndex].enabled;
    }
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
    if (this.selectedIndex < this.skills.length - 1) {
      this.selectedIndex++;
    }
  }

  public render(rect: Rect, isActive: boolean, buffer: string[]): void {
    const title = isActive
      ? "[2] SKILLS / MCP TOOLS  [Space: On/Off]"
      : "[2] SKILLS / MCP TOOLS";

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

    const visibleItems = this.skills.slice(this.scrollOffset, this.scrollOffset + innerHeight);

    for (let i = 0; i < visibleItems.length; i++) {
      const item = visibleItems[i];
      const actualIndex = this.scrollOffset + i;
      const isSelected = actualIndex === this.selectedIndex && isActive;
      const cy = rect.y + 1 + i;

      const cursor = isSelected ? `${theme.blue}❯${theme.reset} ` : "  ";
      const checkbox = item.enabled
        ? `${theme.green}[x]${theme.reset}`
        : `${theme.fgDim}[ ]${theme.reset}`;

      const nameColor = isSelected
        ? theme.blue + theme.bold
        : item.enabled
        ? theme.fg
        : theme.fgDim;

      let statusBadge = "";
      if (item.active) {
        statusBadge = ` ${theme.yellow}(● ishlamoqda)${theme.reset}`;
      } else if (item.lastUsed) {
        statusBadge = ` ${theme.fgDim}[✓ ${item.lastUsed}]${theme.reset}`;
      }

      const maxDescLen = Math.max(6, innerWidth - item.name.length - 18 - (statusBadge ? 12 : 0));
      const descStr = item.desc ? ` — ${theme.fgDim}${item.desc.slice(0, maxDescLen)}${theme.reset}` : "";

      const line = `${cursor}${checkbox} ${nameColor}${item.name}${theme.reset}${statusBadge}${descStr}`;
      buffer.push(`\x1b[${cy};${rect.x + 2}H${line}`);
    }
  }
}
