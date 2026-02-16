import Image from "next/image";

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.kicker}>json-render-cli / Skills Runtime</p>
      <h1 className={styles.title}>
        <span className={`${styles.titleRow} ${styles.titleRowWithImage}`}>
          <span className={styles.titleLine}>No more</span>
          <code className={styles.asciiDemo} aria-label="ASCII table example">
            {"+------------------+\n|  ASCII table |\n+--------+-------+\n   +-----------+"}
          </code>
          <span className={styles.titleLine}>in your chat,</span>
        </span>
        <span className={`${styles.titleRow} ${styles.titleRowWithImage}`}>
          <span className={styles.titleLine}>Agent can reply with</span>
          <figure className={styles.anyUiCard} aria-label="Rendered UI card preview">
            <span className={styles.anyUiGlow} aria-hidden="true" />
            <Image
              src="/showcase/dark/any-ui-you-want-1x4-tight-half.png"
              alt="Any UI You Want rendered as a polished card image"
              width={1600}
              height={260}
              className={styles.anyUiImage}
              priority
            />
          </figure>
        </span>
      </h1>
      <p className={styles.asciiHint}>
        ASCII wireframes can misalign fast and feel cramped, especially on mobile, but pre-rendered image perfectly
        fixed this, availble in your OpenClaw, Codex, Curser, Claude App and Dify (agent with shell capability)
      </p>
      <p className={styles.subtitle}>
        A CLI built for <strong>AI agents</strong> — bundled with <strong>composable skills</strong> that let any agent render <strong>rich UI on demand</strong>, turning plain data into polished visuals in one prompt.
      </p>
      <div className={styles.actions}>
        <a href="#showcase" className={styles.primaryAction}>
          Try Interactive Showcase
        </a>
        <a href="#skills" className={styles.secondaryAction}>
          How it works
        </a>
      </div>
    </section>
  );
}
