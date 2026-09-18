import { drawBox, type Rect } from "./layout.ts";
import { theme } from "../theme/vague.ts";
import type { ThinkingInfo, TokenUsageInfo } from "../types/events.ts";

export class ThinkingPane {
  public items: ThinkingInfo[] = [];
  public tokenUsage: TokenUsageInfo = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    contextWindow: 200000,
    costEstimate: 0,
  };
  public scrollOffset: number = 0;

  public addThinking(message: string): void {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] || "";
    this.items.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      message,
    });
  }

  public updateTokens(usage: TokenUsageInfo): void {
    this.tokenUsage = { ...this.tokenUsage, ...usage };
  }

  public clear(): void {
    this.items = [];
    this.tokenUsage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      contextWindow: 200000,
      costEstimate: 0,
    };
    this.scrollOffset = 0;
  }

  public scroll(delta: number): void {
    this.scrollOffset = Math.max(0, this.scrollOffset + delta);
  }

  public render(rect: Rect, isActive: boolean, buffer: string[]): void {
    drawBox(rect, "[3] THINKING / TOKENS", isActive, buffer);

    const innerWidth = rect.width - 2;
    const innerHeight = rect.height - 2;
    if (innerWidth <= 0 || innerHeight <= 0) return;

    // Clear inner area
    const emptyRow = " ".repeat(innerWidth);
    for (let i = 0; i < innerHeight; i++) {
      buffer.push(`\x1b[${rect.y + 1 + i};${rect.x + 1}H${emptyRow}`);
    }

    // 1. Token metrics
    const ctx = this.tokenUsage.contextWindow || 200000;
    const total = this.tokenUsage.totalTokens || 0;
    const percent = Math.min(100, Math.round((total / ctx) * 100));
    const tokenStr = `${Math.round(total / 1000)}k / ${Math.round(ctx / 1000)}k (${percent}%)`;
    const costStr = this.tokenUsage.costEstimate
      ? `  |  $${this.tokenUsage.costEstimate.toFixed(3)}`
      : "";

    const barWidth = Math.min(20, Math.max(8, innerWidth - 30));
    const filledChars = Math.round((percent / 100) * barWidth);
    const progressBar =
      theme.cyan + "█".repeat(filledChars) +
      theme.fgDim + "░".repeat(barWidth - filledChars) +
      theme.reset;

    const tokenLine = ` 📊 Tokens: ${theme.yellow}${tokenStr}${theme.reset}${costStr}  [${progressBar}]`;
    buffer.push(`\x1b[${rect.y + 1};${rect.x + 1}H${tokenLine}`);

    // Separator
    buffer.push(
      `\x1b[${rect.y + 2};${rect.x + 1}H${theme.borderInactive}${"─".repeat(innerWidth)}${theme.reset}`
    );

    // 2. Thinking logs
    const logStartY = rect.y + 3;
    const availableLines = innerHeight - 2;

    if (this.items.length === 0) {
      buffer.push(
        `\x1b[${logStartY + 1};${rect.x + 3}H${theme.fgDim}💭 AI fikrlash va tahlil jarayoni bu yerda chiqadi...${theme.reset}`
      );
      return;
    }

    const startIdx = Math.max(0, this.items.length - availableLines - this.scrollOffset);
    const visible = this.items.slice(startIdx, startIdx + availableLines);

    for (let i = 0; i < visible.length; i++) {
      const item = visible[i];
      const cy = logStartY + i;
      const timeTag = `${theme.fgDim}[${item.timestamp}]${theme.reset} `;
      const prefix = `${theme.purple}💭${theme.reset} `;
      const maxMsgLen = Math.max(10, innerWidth - item.timestamp.length - 8);
      const msg = item.message.slice(0, maxMsgLen);

      buffer.push(`\x1b[${cy};${rect.x + 2}H${prefix}${timeTag}${theme.fg}${msg}${theme.reset}`);
    }
  }
}
