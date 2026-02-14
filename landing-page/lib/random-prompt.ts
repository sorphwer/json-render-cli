import type { PromptDef, SkillId } from "./showcase-types";

export function getEnabledSkillIds(enabledSkills: Record<SkillId, boolean>): SkillId[] {
  return (Object.keys(enabledSkills) as SkillId[]).filter((skillId) => enabledSkills[skillId]);
}

export function buildPromptPool(
  prompts: PromptDef[],
  enabledSkills: Record<SkillId, boolean>
): PromptDef[] {
  const enabledSet = new Set(getEnabledSkillIds(enabledSkills));
  return prompts.filter((prompt) => enabledSet.has(prompt.skillId));
}

export function pickRandomPrompt(
  promptPool: PromptDef[],
  lastPromptId?: string
): PromptDef | null {
  if (promptPool.length === 0) {
    return null;
  }

  if (promptPool.length === 1) {
    return promptPool[0];
  }

  const candidates =
    typeof lastPromptId === "string"
      ? promptPool.filter((prompt) => prompt.id !== lastPromptId)
      : promptPool;

  const source = candidates.length > 0 ? candidates : promptPool;
  const randomIndex = Math.floor(Math.random() * source.length);
  return source[randomIndex];
}
