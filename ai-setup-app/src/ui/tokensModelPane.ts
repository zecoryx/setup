import { drawBox, type Rect } from "./layout.ts";
import { theme } from "../theme/vague.ts";
import type { TokenUsageInfo, ModelInfo } from "../types/events.ts";

export class TokensModelPane {
  public model: ModelInfo = {
    modelId: "",
    provider: "",
  };

  public tokenUsage: TokenUsageInfo = {
    inputTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    contextWindow: 200000,
    costEstimate: 0,
  };

  public updateModel(model: ModelInfo): void {
    this.model = { ...this.model, ...model };
  }

  public updateTokens(usage: Partial<TokenUsageInfo>): void {
    this.tokenUsage = { ...this.tokenUsage, ...usage };
    if (!this.tokenUsage.totalTokens) {
      this.tokenUsage.totalTokens =
        (this.tokenUsage.inputTokens || 0) + (this.tokenUsage.outputTokens || 0);
    }
  }

  public clear(): void {
    this.model = { modelId: "", provider: "" };
    this.tokenUsage = {
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      contextWindow: 200000,
      costEstimate: 0,
    };
  }

  public render(rect: Rect, isActive: boolean, buffer: string[]): void {
    drawBox(rect, "[3] TOKENS & MODEL", isActive, buffer);

    const innerWidth = rect.width - 2;
    const innerHeight = rect.height - 2;
    if (innerWidth <= 0 || innerHeight <= 0) return;

    // Clear inner area
    const emptyRow = " ".repeat(innerWidth);
    for (let i = 0; i < innerHeight; i++) {
      buffer.push(`\x1b[${rect.y + 1 + i};${rect.x + 1}H${emptyRow}`);
    }

    let cy = rect.y + 1;
    const padX = rect.x + 2;

    // 1. Model Header
    const modelName = this.model.modelId || "Aniqlanmagan (CLI kutilmoqda)";
    const providerName = this.model.provider ? ` (${this.model.provider})` : "";
    const modelBadge = this.model.modelId
      ? `${theme.green}● Faol${theme.reset}`
      : `${theme.fgDim}○ Kutmoqda${theme.reset}`;

    buffer.push(
      `\x1b[${cy++};${padX}H${theme.bold}🤖 Model:${theme.reset} ${theme.cyan}${theme.bold}${modelName}${theme.reset}${theme.fgDim}${providerName}${theme.reset}  [${modelBadge}]`
    );

    // Separator
    if (cy <= rect.y + innerHeight) {
      buffer.push(
        `\x1b[${cy++};${rect.x + 1}H${theme.borderInactive}${"─".repeat(innerWidth)}${theme.reset}`
      );
    }

    // 2. Token Metrics
    const total = this.tokenUsage.totalTokens || 0;
    const ctx = this.tokenUsage.contextWindow || 200000;
    const percent = Math.min(100, Math.round((total / ctx) * 100));

    // Progress bar
    const barWidth = Math.min(22, Math.max(10, innerWidth - 32));
    const filledChars = Math.round((percent / 100) * barWidth);
    const progressBar =
      theme.cyan +
      "█".repeat(filledChars) +
      theme.fgDim +
      "░".repeat(Math.max(0, barWidth - filledChars)) +
      theme.reset;

    if (cy <= rect.y + innerHeight) {
      const totalStr = `${total.toLocaleString()} / ${ctx.toLocaleString()} (${percent}%)`;
      buffer.push(
        `\x1b[${cy++};${padX}H${theme.bold}📊 Kontekst:${theme.reset} ${theme.yellow}${totalStr}${theme.reset}  [${progressBar}]`
      );
    }

    // Breakdown: Input / Output / Reasoning
    if (cy <= rect.y + innerHeight) {
      const inStr = `${theme.fgDim}Kirish:${theme.reset} ${theme.blue}${this.tokenUsage.inputTokens.toLocaleString()}${theme.reset}`;
      const outStr = `${theme.fgDim}Chiqish:${theme.reset} ${theme.green}${this.tokenUsage.outputTokens.toLocaleString()}${theme.reset}`;
      const reasonStr = this.tokenUsage.reasoningTokens
        ? `  ${theme.fgDim}Fikrlash:${theme.reset} ${theme.purple}${this.tokenUsage.reasoningTokens.toLocaleString()}${theme.reset}`
        : "";
      buffer.push(`\x1b[${cy++};${padX}H  ${inStr}   ${outStr}${reasonStr}`);
    }

    // Cache metrics (if any)
    if (cy <= rect.y + innerHeight) {
      const cacheRead = this.tokenUsage.cacheRead || 0;
      const cacheWrite = this.tokenUsage.cacheWrite || 0;
      const cacheStr =
        cacheRead > 0 || cacheWrite > 0
          ? `  ${theme.fgDim}Kesh O'qish:${theme.reset} ${theme.cyan}${cacheRead.toLocaleString()}${theme.reset}  ${theme.fgDim}Yozish:${theme.reset} ${theme.fg}${cacheWrite.toLocaleString()}${theme.reset}`
          : `  ${theme.fgDim}Kesh:${theme.reset} ${theme.fgDim}yo'q${theme.reset}`;
      buffer.push(`\x1b[${cy++};${padX}H${cacheStr}`);
    }
  }
}
