import type { PromptDef, SkillDef, SkillId } from "./showcase-types";

export const SKILLS: SkillDef[] = [
  {
    id: "json-render-table",
    name: "JSON Render Table",
    description: "Compact generic data tables as PNG snapshots.",
    imageByMode: {
      light: "/showcase/light/json-render-table.png",
      dark: "/showcase/dark/json-render-table.png"
    }
  },
  {
    id: "json-render-ticket-table",
    name: "Ticket Table",
    description: "Issue and incident board snapshots with stable columns.",
    imageByMode: {
      light: "/showcase/light/json-render-ticket-table.png",
      dark: "/showcase/dark/json-render-ticket-table.png"
    }
  },
  {
    id: "json-render-info-cards",
    name: "Info Cards",
    description: "KPI, comparison, and daily summary cards.",
    imageByMode: {
      light: "/showcase/light/json-render-info-cards.png",
      dark: "/showcase/dark/json-render-info-cards.png"
    }
  },
  {
    id: "json-render-announcement-cards",
    name: "Announcement Cards",
    description: "Launch and hero visuals for communication.",
    imageByMode: {
      light: "/showcase/light/json-render-announcement-cards.png",
      dark: "/showcase/dark/json-render-announcement-cards.png"
    }
  },
  {
    id: "json-render-flow-summary",
    name: "Flow Summary",
    description: "Timeline and step-based process summaries.",
    imageByMode: {
      light: "/showcase/light/json-render-flow-summary.png",
      dark: "/showcase/dark/json-render-flow-summary.png"
    }
  }
];

export const SKILL_IDS = SKILLS.map((skill) => skill.id);

export const DEFAULT_ENABLED_SKILLS: Record<SkillId, boolean> = SKILL_IDS.reduce(
  (acc, skillId) => {
    acc[skillId] = true;
    return acc;
  },
  {} as Record<SkillId, boolean>
);

export const PROMPTS: PromptDef[] = [
  {
    id: "table-1",
    skillId: "json-render-table",
    text: "Please render this regional revenue sheet as a compact table PNG with Region, Revenue, QoQ, Owner, and Health columns."
  },
  {
    id: "table-2",
    skillId: "json-render-table",
    text: "Make a clean table snapshot for North America ($2.4M), EMEA ($1.6M), and APAC ($1.1M) with QoQ and health badges."
  },
  {
    id: "table-3",
    skillId: "json-render-table",
    text: "Turn this partner revenue update into a fixed-width table image where health stays readable as Strong/Watch badges."
  },
  {
    id: "ticket-1",
    skillId: "json-render-ticket-table",
    text: "Render a ticket status table with ID, Priority, Status, Assignee, Updated, and Topic columns for INC-412 to INC-414."
  },
  {
    id: "ticket-2",
    skillId: "json-render-ticket-table",
    text: "Create a compact incident snapshot showing INC-412 (Blocked), INC-413 (In Progress), and INC-414 (Done)."
  },
  {
    id: "ticket-3",
    skillId: "json-render-ticket-table",
    text: "Build a triage table PNG for Luna, Diego, and Ari with deterministic widths so the topic column stays legible."
  },
  {
    id: "info-1",
    skillId: "json-render-info-cards",
    text: "Generate a KPI overview card image for Monthly ARR, Activation, and Churn in one concise row."
  },
  {
    id: "info-2",
    skillId: "json-render-info-cards",
    text: "Create a compact KPI card set with $4.8M ARR, 68.2% Activation, and 1.9% Churn plus delta badges."
  },
  {
    id: "info-3",
    skillId: "json-render-info-cards",
    text: "Render a single-row KPI snapshot with three cards and clear positive/negative deltas for quick updates."
  },
  {
    id: "announce-1",
    skillId: "json-render-announcement-cards",
    text: "Generate a launch-week announcement hero card with a bold headline, short body copy, and a \"Try the Showcase\" CTA."
  },
  {
    id: "announce-2",
    skillId: "json-render-announcement-cards",
    text: "Build a release promo card PNG that says \"New Skills for json-render-cli\" with one clear button and strong hierarchy."
  },
  {
    id: "announce-3",
    skillId: "json-render-announcement-cards",
    text: "Create a gradient announcement card with a Launch Week badge, one headline block, and concise supporting copy."
  },
  {
    id: "flow-1",
    skillId: "json-render-flow-summary",
    text: "Render a three-stage flow summary image with DONE, IN PROGRESS, and BLOCKED states."
  },
  {
    id: "flow-2",
    skillId: "json-render-flow-summary",
    text: "Generate a timeline snapshot with Detect, Mitigate, and Review cards to show current stage progress."
  },
  {
    id: "flow-3",
    skillId: "json-render-flow-summary",
    text: "Create an incident lifecycle summary from detection to mitigation to review with clear stage status badges."
  }
];
