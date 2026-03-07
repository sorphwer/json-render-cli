import { BracketsCurly, ChatsCircle, CheckCircle, TerminalWindow } from "@phosphor-icons/react/ssr";

import styles from "./Features.module.css";

const OUTPUT_PATH = "landingpage/public/showcase/dark/any-ui-you-want-1x4-tight-half.png";
const CHAT_PROMPT = 'Render "Any UI You Want" as a dark four-column PNG card for a launch recap.';
const AGENT_REPLY = "I drafted the JSON spec first, then ran one render command.";

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

export function Features() {
  return (
    <section id="skills" className={styles.section}>
      <div className={styles.head}>
        <p className={styles.kicker}>Workflow</p>
        <h2 className={styles.title}>From prompt to PNG, without hand-building a web page.</h2>
      </div>

      <div className={styles.grid}>
        <article className={`${styles.featureCard} ${styles.storyCard}`}>
          <header className={styles.featureHeader}>
            <span className={styles.featureIndex}>01</span>
            <div className={styles.featureMeta}>
              <p className={styles.featureEyebrow}>Ask</p>
              <h3 className={styles.featureTitle}>
                <ChatsCircle className={styles.featureIcon} aria-hidden="true" weight="duotone" />
                Describe the artifact in plain language.
              </h3>
            </div>
          </header>
          <div className={styles.bubble}>{CHAT_PROMPT}</div>
        </article>

        <article className={`${styles.featureCard} ${styles.jsonCard}`}>
          <header className={styles.featureHeader}>
            <span className={styles.featureIndex}>02</span>
            <div className={styles.featureMeta}>
              <p className={styles.featureEyebrow}>Generate JSON</p>
              <h3 className={styles.featureTitle}>
                <BracketsCurly className={styles.featureIcon} aria-hidden="true" weight="duotone" />
                Route the request to a structured spec.
              </h3>
            </div>
          </header>
          <pre className={styles.jsonPreview} aria-label="JSON content preview">
            {JSON_SPEC_PREVIEW}
          </pre>
        </article>

        <article className={`${styles.featureCard} ${styles.renderCard}`}>
          <header className={styles.featureHeader}>
            <span className={styles.featureIndex}>03</span>
            <div className={styles.featureMeta}>
              <p className={styles.featureEyebrow}>Render PNG</p>
              <h3 className={styles.featureTitle}>
                <TerminalWindow className={styles.featureIcon} aria-hidden="true" weight="duotone" />
                Run one command and ship the result.
              </h3>
            </div>
          </header>
          <code className={styles.renderCommand}>{RENDER_COMMAND}</code>
          <p className={styles.renderOutput}>Output path: {OUTPUT_PATH}</p>
          <ul className={styles.renderList}>
            <li>
              <CheckCircle className={styles.renderListIcon} aria-hidden="true" weight="duotone" />
              Reuse the same config so spacing, type, and color stay aligned.
            </li>
            <li>
              <CheckCircle className={styles.renderListIcon} aria-hidden="true" weight="duotone" />
              Drop the PNG into docs, chat, release notes, or status updates without rework.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
