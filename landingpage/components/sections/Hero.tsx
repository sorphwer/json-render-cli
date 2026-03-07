import { ArrowRight, CheckCircle, Sparkle } from "@phosphor-icons/react/ssr";
import Image from "next/image";

import styles from "./Hero.module.css";

const PROOF_ITEMS = [
  {
    title: "One install path",
    detail: "Add the skill once and keep the workflow available in every supported agent surface."
  },
  {
    title: "Template routing",
    detail: "The agent picks the matching JSON template before it renders, so structure stays predictable."
  },
  {
    title: "Shareable outputs",
    detail: "Export cards, tables, and summaries as PNGs that survive docs, chat, and release notes."
  }
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Prompt-to-PNG Runtime for Agents</p>
        <h1 className={styles.title}>Turn raw agent output into polished PNGs people can scan in seconds.</h1>
        <p className={styles.subtitle}>
          <strong>json-render-cli</strong> gives shell-capable agents a repeatable path from natural-language request
          to structured JSON and finally to a shareable image. Use it for launch cards, KPI strips, status tables,
          and flow summaries without hand-building HTML.
        </p>

        <div className={styles.proofStrip} aria-label="Key benefits">
          {PROOF_ITEMS.map((item) => (
            <div key={item.title} className={styles.proofItem}>
              <CheckCircle className={styles.proofIcon} aria-hidden="true" weight="duotone" />
              <div className={styles.proofCopy}>
                <span className={styles.proofTitle}>{item.title}</span>
                <span className={styles.proofText}>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="#showcase" className={styles.primaryAction}>
            Open the live demo
            <ArrowRight className={styles.actionIcon} aria-hidden="true" weight="bold" />
          </a>
          <a href="#install" className={styles.secondaryAction}>
            See install steps
          </a>
        </div>

        <p className={styles.supportingLine}>
          Works in Codex, Cursor, Claude, OpenClaw, and other agent environments with shell access.
        </p>
      </div>

      <div className={styles.stage}>
        <div className={styles.beforeCard}>
          <span className={styles.beforeLabel}>Before</span>
          <code className={styles.asciiDemo} aria-label="ASCII table example">
            {"+------------------+\n|  ASCII table    |\n+--------+--------+\n| KPI    |  47.2% |\n+------------------+"}
          </code>
          <p className={styles.beforeCaption}>ASCII layouts wrap, drift, and lose hierarchy fast in long chat threads.</p>
        </div>

        <figure className={styles.renderCard} aria-label="Rendered UI card preview">
          <span className={styles.renderGlow} aria-hidden="true" />
          <span className={styles.renderBadge}>
            <Sparkle className={styles.renderBadgeIcon} aria-hidden="true" weight="duotone" />
            After
          </span>
          <Image
            src="/showcase/dark/any-ui-you-want-1x4-tight-half.png"
            alt="Any UI You Want rendered as a polished card image"
            width={1600}
            height={260}
            className={styles.anyUiImage}
            priority
          />
        </figure>

        <div className={styles.stageNote}>
          <p className={styles.stageMetric}>Deterministic layout</p>
          <p className={styles.stageDescription}>
            The same prompt keeps stable spacing, typography, and export size across repeated runs.
          </p>
        </div>
      </div>
    </section>
  );
}
