export interface AgentInfo {
  id: string;
  name: string;
  status: 'active' | 'running' | 'idle' | 'completed' | 'failed';
  task?: string;
  updatedAt: Date;
}

export interface ToolCallInfo {
  id: string;
  name: string;
  detail?: string;
  status: 'running' | 'completed' | 'failed';
  timestamp: string;
  durationMs?: number;
}

export interface ModelInfo {
  modelId: string;
  provider?: string;
}

export interface TokenUsageInfo {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens?: number;
  cacheRead?: number;
  cacheWrite?: number;
  totalTokens: number;
  contextWindow?: number;
  costEstimate?: number;
}

export type AgentEvent =
  | { type: 'agent:update'; agent: AgentInfo }
  | { type: 'agent:clear' }
  | { type: 'tool:start'; tool: ToolCallInfo }
  | { type: 'tool:update'; tool: Partial<ToolCallInfo> & { id: string } }
  | { type: 'tool:clear' }
  | { type: 'model:update'; model: ModelInfo }
  | { type: 'tokens:update'; usage: Partial<TokenUsageInfo> }
  | { type: 'tokens:clear' }
  | { type: 'status'; message: string };
