import type { PromptDef, SkillId } from "./showcase-types";

const OPENERS = [
  "Done.",
  "Rendered.",
  "All set."
];

const CLOSERS = [
  "Preview is attached below.",
  "Image is attached so you can review quickly.",
  "Attached the snapshot for a quick check."
];

const REPLIES_BY_SKILL: Record<SkillId, string[]> = {
  "json-render-table": [
    "I kept Region, Revenue, QoQ, Owner, and Health in fixed columns so the three rows compare cleanly.",
    "The table includes North America, EMEA, and APAC with consistent widths and readable health badges.",
    "I preserved the compact table framing and stable column widths for a Slack-ready update image."
  ],
  "json-render-ticket-table": [
    "I used the standard six ticket columns and rendered INC-412 to INC-414 with deterministic widths.",
    "The incident board keeps Priority and Status as badges, with the Topic column left readable.",
    "The snapshot shows Blocked, In Progress, and Done states with assignee and updated time preserved."
  ],
  "json-render-info-cards": [
    "I rendered a compact KPI row for Monthly ARR, Activation, and Churn with delta badges.",
    "The card set is optimized for quick scanning: value first, then delta and label context.",
    "The output keeps a clear KPI hierarchy and concise spacing for dashboard-style sharing."
  ],
  "json-render-announcement-cards": [
    "I built the launch-style hero card with one dominant headline and a single CTA button.",
    "The announcement image keeps the Launch Week badge, headline block, and concise supporting line.",
    "The promo card uses a clean visual hierarchy so the message and CTA read at a glance."
  ],
  "json-render-flow-summary": [
    "I rendered Detect, Mitigate, and Review as a stage flow with explicit status badges.",
    "The timeline snapshot keeps DONE, IN PROGRESS, and BLOCKED states clearly separated.",
    "The layout preserves stage order and concise per-stage copy for fast status communication."
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
