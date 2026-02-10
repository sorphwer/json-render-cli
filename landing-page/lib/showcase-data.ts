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
    text: "Render this partner metrics sheet into a compact table PNG with fixed column widths and edge-to-edge framing."
  },
  {
    id: "table-2",
    skillId: "json-render-table",
    text: "Build a generic table snapshot for quarterly revenue rows, with clear headers and status badges."
  },
  {
    id: "table-3",
    skillId: "json-render-table",
    text: "Turn the attached benchmark rows into a clean table screenshot optimized for Slack updates."
  },
  {
    id: "ticket-1",
    skillId: "json-render-ticket-table",
    text: "Generate a ticket status table image with ID, priority, status, assignee, updated time, and topic columns."
  },
  {
    id: "ticket-2",
    skillId: "json-render-ticket-table",
    text: "Create a compact incident board snapshot from these 12 tickets, keeping the topic column readable."
  },
  {
    id: "ticket-3",
    skillId: "json-render-ticket-table",
    text: "Render a release bug triage table PNG with deterministic widths for daily standup diffs."
  },
  {
    id: "info-1",
    skillId: "json-render-info-cards",
    text: "Produce a KPI overview card set for ARR, churn, NPS, and activation rate in one concise image."
  },
  {
    id: "info-2",
    skillId: "json-render-info-cards",
    text: "Create a daily summary card image with headline metric, deltas, and three key takeaways."
  },
  {
    id: "info-3",
    skillId: "json-render-info-cards",
    text: "Render a side-by-side metric comparison card for Team A vs Team B performance this week."
  },
  {
    id: "announce-1",
    skillId: "json-render-announcement-cards",
    text: "Generate a launch announcement hero card with bold headline, short body copy, and a single CTA."
  },
  {
    id: "announce-2",
    skillId: "json-render-announcement-cards",
    text: "Build a feature release promo card PNG for social sharing with a clean visual hierarchy."
  },
  {
    id: "announce-3",
    skillId: "json-render-announcement-cards",
    text: "Create a profile spotlight announcement card for our new maintainer with one focal badge."
  },
  {
    id: "flow-1",
    skillId: "json-render-flow-summary",
    text: "Render a delivery pipeline timeline with DONE, IN PROGRESS, and BLOCKED stages in a single image."
  },
  {
    id: "flow-2",
    skillId: "json-render-flow-summary",
    text: "Generate a weekly project flow summary card showing stage owners and target dates."
  },
  {
    id: "flow-3",
    skillId: "json-render-flow-summary",
    text: "Create an incident lifecycle snapshot image from detection to mitigation to postmortem."
  }
];
