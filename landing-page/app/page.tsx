import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";

import styles from "./page.module.css";

const ICON_CDN = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons";

const compatibleTools = [
  { name: "OpenClaw", slug: "openclaw" },
  { name: "Codex", slug: "codex" },
  { name: "Cursor", slug: "cursor" },
  { name: "Claude", slug: "claude" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="#top" className={styles.brand}>
          npm i -g json-render-cli && npx playwright install chromium
        </a>
        <nav className={styles.nav}>
          <a href="https://github.com/sorphwer/json-render-cli" target="_blank" rel="noopener noreferrer">Visit Source Code</a>
        </nav>
      </header>

      <main id="top" className={styles.main}>
        <Hero />

        <section id="showcase" className={styles.showcaseSection}>
          <div className={styles.showcaseHead}>
            <p className={styles.showcaseKicker}>Interactive Demo</p>
            <h2 className={styles.showcaseTitle}>Draw prompts. Send. Preview a skill output card.</h2>
          </div>
          <ShowcaseShell />
        </section>

        <Features />
      </main>

      <footer id="install" className={styles.footer}>
        <p className={styles.footerLabel}>Compatible with</p>
        <div className={styles.iconGrid}>
          {compatibleTools.map((tool) => (
            <div key={tool.slug} className={styles.iconItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${ICON_CDN}/${tool.slug}.svg`}
                alt={tool.name}
                width={40}
                height={40}
                loading="lazy"
              />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
