import { BracketsCurly, ChatsCircle, TerminalWindow } from "@phosphor-icons/react/ssr";

import styles from "./Features.module.css";

const OUTPUT_PATH = "landingpage/public/showcase/dark/any-ui-you-want-1x4-tight-half.png";
const CHAT_PROMPT = 'Render "Any UI You Want" as a dark four-column PNG card for a launch recap.';

const JSON_SPEC_PREVIEW = `{
  "root": {
    "type": "Row",
    "props": { "width": "100%", "height": "100%", "gap": 0 },
    "children": [
      { "type": "Heading", "props": { "text": "Any" } },
      { "type": "Heading", "props": { "text": "UI" } },
      { "type": "Heading", "props": { "text": "You" } },
      { "type": "Heading", "props": { "text": "Want" } }
    ]
  }
}`;

const RENDER_COMMAND =
  `json-render -m "$(cat examples/any-ui-you-want.json)" -c config.json -o ${OUTPUT_PATH} --size 3200x520`;

const WORKFLOW_STEPS = [
  {
    index: "01",
    title: "Ask for the artifact.",
    icon: ChatsCircle,
    frame: CHAT_PROMPT,
    frameClassName: "bubble"
  },
  {
    index: "02",
    title: "Route it to JSON.",
    icon: BracketsCurly,
    frame: JSON_SPEC_PREVIEW,
    frameClassName: "jsonPreview"
  },
  {
    index: "03",
    title: "Render the PNG.",
    icon: TerminalWindow,
    frame: RENDER_COMMAND,
    frameClassName: "renderCommand"
  }
];

export function Features() {
  return (
    <section id="skills" className={styles.section}>
      <div className={styles.head}>
        <p className={styles.kicker}>How it works</p>
        <h2 className={styles.title}>Prompt in. PNG out.</h2>
        <p className={styles.subtitle}>
          The skill keeps the route short enough to remember and stable enough to reuse.
        </p>
      </div>

      <article className={styles.workflowBoard}>
        <div className={styles.boardLead}>
          <p className={styles.boardSummary}>One reliable route.</p>
          <code className={styles.outputPath}>{OUTPUT_PATH}</code>
        </div>

        <ol className={styles.stageList}>
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.index} className={styles.stageRow}>
                <div className={styles.stageMeta}>
                  <span className={styles.stageIndex}>{step.index}</span>
                  <h3 className={styles.stageTitle}>
                    <Icon className={styles.stageIcon} aria-hidden="true" weight="duotone" />
                    {step.title}
                  </h3>
                </div>

                <div className={styles[step.frameClassName]}>{step.frame}</div>
              </li>
            );
          })}
        </ol>
      </article>
    </section>
  );
}
