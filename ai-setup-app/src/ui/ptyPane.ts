import { type Rect } from "./layout.ts";
import { theme } from "../theme/vague.ts";
import { TerminalEmbed } from "../pty/terminalEmbed.ts";

export interface TabViewInfo {
  id: string;
  title: string;
  engine: "opencode" | "claude" | "idle";
  isRunning: boolean;
}

export class PtyPane {
  public cursorVisible: boolean = true;

  public render(
    rect: Rect,
    isActive: boolean,
    tabs: TabViewInfo[],
    activeTabIndex: number,
    terminal: TerminalEmbed | null,
    commandInput: string,
    buffer: string[]
  ): void {
    const { x, y, width, height } = rect;
    if (width < 4 || height < 3) return;

    const borderColor = isActive ? theme.borderActive : theme.borderInactive;
    const innerWidth = width - 2;
    const innerHeight = height - 2;

    const tl = "╭";
    const tr = "╮";
    const bl = "╰";
    const br = "╯";
    const h = "─";
    const v = "│";

    // 1. Build Top Line with Tabs
    let tabStr = "";
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const isSelected = i === activeTabIndex;
      const runningIcon = tab.isRunning ? "● " : "";
      const label = `${i + 1}:${tab.title}`;

      if (isSelected) {
        tabStr += ` ${theme.blue}${theme.bold}[${runningIcon}${label}]${theme.reset} `;
      } else {
        tabStr += ` ${theme.fgDim}[${runningIcon}${label}]${theme.reset} `;
      }
    }

    tabStr += ` ${theme.cyan}[+ Tab (Alt+N)]${theme.reset} `;

    // If scrolled, add scroll badge
    if (terminal && terminal.scrollOffset > 0) {
      tabStr += `${theme.yellow}[📜 -${terminal.scrollOffset} | G: Pastga]${theme.reset} `;
    }

    // Measure raw length without ANSI
    const rawTabStr = tabStr.replace(/\x1b\[[0-9;]*m/g, "");
    let topHeader = tl + h;
    topHeader += tabStr;
    const remainingBorder = innerWidth - 1 - rawTabStr.length;
    if (remainingBorder > 0) {
      topHeader += `${borderColor}${h.repeat(remainingBorder)}${theme.reset}`;
    }
    topHeader += `${borderColor}${tr}${theme.reset}`;

    buffer.push(`\x1b[${y};${x}H${topHeader}`);

    // 2. Render Body
    const isRunning = terminal !== null && terminal.isRunning();

    if (isRunning && terminal) {
      const lines = terminal.getVisibleLines();
      for (let i = 0; i < innerHeight; i++) {
        const cy = y + 1 + i;
        const lineContent = lines[i] || "";

        buffer.push(`\x1b[${cy};${x}H${borderColor}${v}${theme.reset}`);
        buffer.push(lineContent + "\x1b[K");
        buffer.push(`\x1b[${cy};${x + width - 1}H${borderColor}${v}${theme.reset}`);
      }
    } else {
      // Idle state in current tab
      for (let i = 0; i < innerHeight; i++) {
        const cy = y + 1 + i;
        buffer.push(
          `\x1b[${cy};${x}H${borderColor}${v}${theme.reset}${" ".repeat(innerWidth)}${borderColor}${v}${theme.reset}`
        );
      }

      const startY = y + 3;
      const padX = x + 3;

      buffer.push(
        `\x1b[${startY};${padX}H${theme.cyan}${theme.bold}AI Engine Tanlang:${theme.reset}`
      );
      buffer.push(
        `\x1b[${startY + 2};${padX}H${theme.fg}1. ${theme.blue}${theme.bold}opencode${theme.reset}  ${theme.fgDim}— OpenCode CLI (mini rejim)${theme.reset}`
      );
      buffer.push(
        `\x1b[${startY + 3};${padX}H${theme.fg}2. ${theme.purple}${theme.bold}claude${theme.reset}    ${theme.fgDim}— Claude Code (interaktiv rejim)${theme.reset}`
      );

      buffer.push(
        `\x1b[${startY + 5};${padX}H${theme.fgDim}Buyruqni yozib [Enter] bosing: (Yangi tab: Alt+N, O'tish: Alt+1..9)${theme.reset}`
      );

      // Input box at bottom of panel
      const inputY = y + innerHeight - 1;
      buffer.push(
        `\x1b[${inputY - 1};${x + 1}H${theme.borderInactive}${"─".repeat(innerWidth)}${theme.reset}`
      );

      const promptSymbol = `${theme.blue}❯${theme.reset} `;
      const cursor = this.cursorVisible ? `${theme.bold}█${theme.reset}` : " ";
      buffer.push(
        `\x1b[${inputY};${padX}H${promptSymbol}${theme.fg}${commandInput}${cursor}${theme.reset}`
      );
    }

    // 3. Bottom Line
    const bottomLine = bl + h.repeat(innerWidth) + br;
    buffer.push(`\x1b[${y + height - 1};${x}H${borderColor}${bottomLine}${theme.reset}`);
  }
}
