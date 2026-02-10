import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="#top" className={styles.brand}>
          json-render-cli
        </a>
        <nav className={styles.nav}>
          <a href="#skills">View Skills</a>
          <a href="#install">Install CLI</a>
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
        <p className={styles.footerLabel}>Install</p>
        <code className={styles.footerCode}>npm i -g json-render-cli</code>
        <div className={styles.footerLinks}>
          <a href="https://json-render.dev/" target="_blank" rel="noopener noreferrer">
            json-render.dev
          </a>
          <a
            href="https://github.com/vercel-labs/agent-skills"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agent Skills Reference
          </a>
        </div>
      </footer>
    </div>
  );
}
