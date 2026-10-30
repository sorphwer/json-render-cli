import { ArrowRight, Sparkle } from "@phosphor-icons/react/ssr";
import Image from "next/image";

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Prompt-to-PNG runtime for agents</p>
        <h1 className={styles.title}>Turn agent prompts into clean PNGs.</h1>
        <p className={styles.subtitle}>
          <strong>json-render-cli</strong> gives shell-capable agents one stable route from prompt to structured JSON
          to a shareable image.
        </p>

        <div className={styles.actions}>
          <a href="#showcase" className={styles.primaryAction}>
            See the live workflow
            <ArrowRight className={styles.actionIcon} aria-hidden="true" weight="bold" />
          </a>
          <a href="#install" className={styles.secondaryAction}>
            Jump to install
          </a>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.stage}>
          <div className={styles.beforeCard}>
            <span className={styles.beforeLabel}>Before</span>
            <code className={styles.asciiDemo} aria-label="ASCII table example">
              {"+------------------+\n|  ASCII table    |\n+--------+--------+\n| KPI    |  47.2% |\n+------------------+"}
            </code>
            <p className={styles.beforeCaption}>ASCII tables fall apart in long threads.</p>
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
        </div>

        <div className={styles.stageFooter}>
          <p className={styles.stageMetric}>Same prompt. Stable export.</p>
          <p className={styles.stageDescription}>Cards, tables, and summaries stay readable when the agent reruns them.</p>
        </div>
      </div>
    </section>
  );
}
