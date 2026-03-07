import type { PromptDef, SkillId } from "./showcase-types";

const OPENERS = [
  "Ready.",
  "Rendered cleanly.",
  "Preview prepared."
];

const CLOSERS = [
  "The PNG preview is below.",
  "Review the image below and iterate from there.",
  "The card is attached below for a quick check."
];

const REPLIES_BY_SKILL: Record<SkillId, string[]> = {
  "json-render-table": [
    "I kept Region, Revenue, QoQ, Owner, and Health in fixed columns so the rows compare cleanly.",
    "The table holds North America, EMEA, and APAC in consistent widths with readable health badges.",
    "I preserved a compact frame and stable column sizing for a status update image."
  ],
  "json-render-ticket-table": [
    "I used the standard six ticket columns and rendered INC-412 through INC-414 with deterministic widths.",
    "The incident board keeps Priority and Status as badges while the Topic column stays readable.",
    "The snapshot separates Blocked, In Progress, and Done states with assignee and update time preserved."
  ],
  "json-render-info-cards": [
    "I rendered a compact KPI row for Monthly ARR, activation, and churn with delta badges.",
    "The card set is tuned for quick scanning: value first, then delta and label context.",
    "The output keeps a clear KPI hierarchy and concise spacing for dashboard-style sharing."
  ],
  "json-render-announcement-cards": [
    "I built the announcement card with one dominant headline and a single CTA.",
    "The image keeps the Launch Week badge, headline block, and concise support line.",
    "The promo card uses clean hierarchy so the message and CTA read at a glance."
  ],
  "json-render-flow-summary": [
    "I rendered Detect, Mitigate, and Review as a stage flow with explicit status badges.",
    "The timeline snapshot keeps Done, In Progress, and Blocked states clearly separated.",
    "The layout preserves stage order and concise copy for fast status communication."
  ]
};

function pickRandom(items: readonly string[]): string {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function buildAgentReply(prompt: PromptDef): string {
  const opener = pickRandom(OPENERS);
  const body = pickRandom(REPLIES_BY_SKILL[prompt.skillId]);
  const closer = pickRandom(CLOSERS);
  return `${opener} ${body} ${closer}`;
}
