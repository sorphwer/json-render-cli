export type SkillId =
  | "json-render-table"
  | "json-render-ticket-table"
  | "json-render-info-cards"
  | "json-render-announcement-cards"
  | "json-render-flow-summary";

export type ImageMode = "light" | "dark";

export interface SkillDef {
  id: SkillId;
  name: string;
  description: string;
  imageByMode: Record<ImageMode, string>;
}

export interface PromptDef {
  id: string;
  skillId: SkillId;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent" | "thinking";
  promptId?: string;
  skillId?: SkillId;
  text?: string;
}
