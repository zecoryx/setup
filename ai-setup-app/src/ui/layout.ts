import { theme } from "../theme/vague.ts";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppLayout {
  agents: Rect;       // [1]
  skills: Rect;       // [2]
  tokensModel: Rect;  // [3]
  chat: Rect;         // [4] PTY Terminal with Tabs
  footer: Rect;
}

export function calculateLayout(cols: number, rows: number): AppLayout {
  const footerHeight = 1;
  const contentHeight = Math.max(10, rows - footerHeight);

  // 58% left monitoring, 42% right PTY
  const leftWidth = Math.max(30, Math.floor(cols * 0.58));
  const rightWidth = Math.max(30, cols - leftWidth);

  // Tokens & Model: compact fixed height 7
  const tokensHeight = 7;
  const remHeight = Math.max(6, contentHeight - tokensHeight);

  // [1] Agents 50%, [2] Skills 50%
  const agentsHeight = Math.floor(remHeight * 0.5);
  const skillsHeight = remHeight - agentsHeight;

  return {
    agents: { x: 1, y: 1, width: leftWidth, height: agentsHeight },
    skills: { x: 1, y: 1 + agentsHeight, width: leftWidth, height: skillsHeight },
    tokensModel: { x: 1, y: 1 + agentsHeight + skillsHeight, width: leftWidth, height: tokensHeight },
    chat: { x: leftWidth + 1, y: 1, width: rightWidth, height: contentHeight },
    footer: { x: 1, y: rows, width: cols, height: 1 },
  };
}

export function drawBox(
  rect: Rect,
  title: string,
  isActive: boolean,
  buffer: string[]
): void {
  const { x, y, width, height } = rect;
  if (width < 4 || height < 3) return;

  const borderColor = isActive ? theme.borderActive : theme.borderInactive;

  const tl = "╭";
  const tr = "╮";
  const bl = "╰";
  const br = "╯";
  const h = "─";
  const v = "│";

  // Top line with title
  const cleanTitle = title ? ` ${title} ` : "";
  const innerWidth = width - 2;
  let topHeader = tl;
  if (cleanTitle.length > 0 && cleanTitle.length <= innerWidth) {
    topHeader += cleanTitle + h.repeat(innerWidth - cleanTitle.length);
  } else {
    topHeader += h.repeat(innerWidth);
  }
  topHeader += tr;

  buffer.push(`\x1b[${y};${x}H${borderColor}${topHeader}${theme.reset}`);

  // Sides
  for (let r = 1; r < height - 1; r++) {
    const cy = y + r;
    buffer.push(`\x1b[${cy};${x}H${borderColor}${v}${theme.reset}`);
    buffer.push(`\x1b[${cy};${x + width - 1}H${borderColor}${v}${theme.reset}`);
  }

  // Bottom line
  const bottomLine = bl + h.repeat(innerWidth) + br;
  buffer.push(`\x1b[${y + height - 1};${x}H${borderColor}${bottomLine}${theme.reset}`);
}
