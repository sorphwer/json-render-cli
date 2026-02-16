import { Braces, MessageSquareText, Terminal } from "lucide-react";

import styles from "./Features.module.css";

const OUTPUT_PATH = "landingpage/public/showcase/dark/any-ui-you-want-1x4-tight-half.png";
const CHAT_PROMPT = 'Render "Any UI You Want" as a dark four-column PNG card.';
const AGENT_REPLY = "I will create the JSON spec first, then run one CLI command.";

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
        <p className={styles.kicker}>Skill Catalog</p>
        <h2 className={styles.title}>Prompt in chat, JSON by agent, one CLI render.</h2>
        <p className={styles.subtitle}>
          Compared with writing HTML/CSS from scratch, this flow typically uses about{" "}
          <strong>
            <u>60-75% fewer tokens</u>
          </strong>
          , and a{" "}
          <strong>
            <u>persistent config</u>
          </strong>{" "}
          keeps visual style consistent for faster, repeatable rendering.
        </p>
      </div>

      <div className={styles.stack}>
        <article className={`${styles.stepCard} ${styles.chatStep}`}>
          <header className={styles.stepHeader}>
            <span className={styles.stepIndex} aria-hidden="true">
              1
            </span>
            <div className={styles.stepMeta}>
              <p className={styles.stepKicker}>Step 1</p>
              <h3 className={styles.stepTitle}>
                <MessageSquareText className={styles.stepIcon} aria-hidden="true" />
                Send prompt in chat
              </h3>
            </div>
          </header>
          <p className={styles.stepNote}>User states intent in natural language.</p>
          <div className={`${styles.innerCard} ${styles.chatCard}`}>
            <p className={`${styles.chatBubble} ${styles.chatUser}`}>{CHAT_PROMPT}</p>
            <p className={`${styles.chatBubble} ${styles.chatAgent}`}>{AGENT_REPLY}</p>
          </div>
        </article>

        <article className={`${styles.stepCard} ${styles.jsonStep}`}>
          <header className={styles.stepHeader}>
            <span className={styles.stepIndex} aria-hidden="true">
              2
            </span>
            <div className={styles.stepMeta}>
              <p className={styles.stepKicker}>Step 2</p>
              <h3 className={styles.stepTitle}>
                <Braces className={styles.stepIcon} aria-hidden="true" />
                Agent generates JSON
              </h3>
            </div>
          </header>
          <p className={styles.stepNote}>Structured spec is produced before rendering.</p>
          <div className={styles.innerCard}>
            <pre className={styles.jsonCode} aria-label="JSON content preview">
              {JSON_SPEC_PREVIEW}
            </pre>
          </div>
        </article>

        <article className={`${styles.stepCard} ${styles.cliStep}`}>
          <header className={styles.stepHeader}>
            <span className={styles.stepIndex} aria-hidden="true">
              3
            </span>
            <div className={styles.stepMeta}>
              <p className={styles.stepKicker}>Step 3</p>
              <h3 className={styles.stepTitle}>
                <Terminal className={styles.stepIcon} aria-hidden="true" />
                Agent runs one CLI line
              </h3>
            </div>
          </header>
          <p className={styles.stepNote}>JSON goes into a single executable command.</p>
          <div className={`${styles.innerCard} ${styles.cliCard}`}>
            <code className={styles.command}>{RENDER_COMMAND}</code>
            <p className={styles.outputPath}>Output: {OUTPUT_PATH}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
