import type { AgentEvent } from "../types/events.ts";
import { AgentsPane } from "../ui/agentsPane.ts";
import { SkillsPane } from "../ui/skillsPane.ts";
import { TokensModelPane } from "../ui/tokensModelPane.ts";

export class EventRouter {
  private agentsPane: AgentsPane;
  private skillsPane: SkillsPane;
  private tokensModelPane: TokensModelPane;
  private onRequestRender: () => void;

  constructor(
    agentsPane: AgentsPane,
    skillsPane: SkillsPane,
    tokensModelPane: TokensModelPane,
    onRequestRender: () => void
  ) {
    this.agentsPane = agentsPane;
    this.skillsPane = skillsPane;
    this.tokensModelPane = tokensModelPane;
    this.onRequestRender = onRequestRender;
  }

  public dispatch(event: AgentEvent): void {
    switch (event.type) {
      case "agent:update":
        this.agentsPane.updateAgent(event.agent);
        break;
      case "agent:clear":
        this.agentsPane.clear();
        break;
      case "tool:start":
        this.skillsPane.addOrUpdateTool(event.tool);
        break;
      case "tool:update":
        this.skillsPane.updateToolPartial(event.tool);
        break;
      case "tool:clear":
        this.skillsPane.clear();
        break;
      case "model:update":
        this.tokensModelPane.updateModel(event.model);
        break;
      case "tokens:update":
        this.tokensModelPane.updateTokens(event.usage);
        break;
      case "tokens:clear":
        this.tokensModelPane.clear();
        break;
      case "status":
        // status update
        break;
    }
    this.onRequestRender();
  }

  public clearAll(): void {
    this.agentsPane.clear();
    this.skillsPane.clear();
    this.tokensModelPane.clear();
    this.onRequestRender();
  }
}
