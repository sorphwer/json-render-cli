import { ArrowSquareOut, GithubLogo, Sparkle, Star } from "@phosphor-icons/react/ssr";

import { CopyCommand } from "@/components/common/CopyCommand";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";

import styles from "./page.module.css";

const GITHUB_URL = "https://github.com/sorphwer/json-render-cli";
const INSTALL_COMMAND =
  "install skill from sorphwer/json-render-cli: npm/skills/use-json-render-cli";

const COMPATIBLE_TOOLS = [
  {
    name: "OpenClaw",
    slug: "openclaw",
    glyph: "OC",
    note: "Shell workflow"
  },
  {
    name: "Codex",
    slug: "codex",
    glyph: "CX",
    note: "Desktop agent"
  },
  {
    name: "Cursor",
    slug: "cursor",
    glyph: "CU",
    note: "Workspace tasks"
  },
  {
    name: "Claude",
    slug: "claude",
    glyph: "CL",
    note: "Computer use"
  }
];

export default function Home() {
  return (
    <div className={styles.page}>
      <svg width="0" height="0" style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden="true">
        <defs>
          <filter id="liquid-glass">
            <feTurbulence type="fractalNoise" baseFrequency="0.003" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.5" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="80" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <header
        className={styles.header}
        style={{
          backdropFilter: "url(#liquid-glass) blur(2px) saturate(1.8) brightness(1.1)",
          WebkitBackdropFilter: "blur(14px) saturate(1.8) brightness(1.1)"
        }}
      >
        <div className={styles.installBar}>
          <span className={styles.installEyebrow}>Install once</span>
          <code className={styles.installCommand}>{INSTALL_COMMAND}</code>
        </div>

        <div className={styles.headerActions}>
          <CopyCommand command={INSTALL_COMMAND} buttonClassName={styles.copyButton} compact />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceButton}
            aria-label="View source code on GitHub"
          >
            <span className={styles.sourceText}>View Source</span>
            <GithubLogo className={styles.sourceIcon} aria-hidden="true" weight="fill" />
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <section id="top" className={`${styles.section} ${styles.heroSection}`}>
          <Hero />
        </section>

        <section id="showcase" className={`${styles.section} ${styles.showcaseSection}`}>
          <div className={styles.showcaseHead}>
            <div className={styles.showcaseLead}>
              <h2 className={styles.sectionTitle}>Watch the render happen in chat.</h2>
              <p className={styles.sectionBody}>The agent picks the structure and returns a reviewable PNG in one pass.</p>
            </div>
          </div>

          <div className={styles.showcaseFrame}>
            <ShowcaseShell />
          </div>
        </section>

        <section className={`${styles.section} ${styles.featuresSection}`}>
          <Features />
        </section>

        <section id="install" className={`${styles.section} ${styles.installSection}`}>
          <div className={styles.installPanel}>
            <div className={styles.installLead}>
              <div className={styles.installLeadCopy}>
                <h2 className={styles.sectionTitle}>Install it once.</h2>
                <p className={styles.sectionBody}>Reuse the same render route across the agents your team already uses.</p>
              </div>

              <div className={styles.installActions}>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryLink}
                >
                  Open GitHub repo
                  <GithubLogo className={styles.primaryLinkIcon} aria-hidden="true" weight="fill" />
                </a>
                <a href="#showcase" className={styles.secondaryLink}>
                  Review the live workflow
                </a>
              </div>
            </div>

            <div className={styles.installGrid}>
              <section className={styles.installColumn}>
                <div className={styles.installCommandBox}>
                  <div className={styles.installCommandHead}>
                    <span className={styles.installCommandLabel}>Install command</span>
                    <CopyCommand command={INSTALL_COMMAND} buttonClassName={styles.installCopyButton} compact />
                  </div>
                  <code className={styles.installCode}>{INSTALL_COMMAND}</code>
                </div>
              </section>

              <section className={styles.toolsColumn}>
                <p className={styles.installLabel}>Works in</p>
                <div className={styles.toolRail}>
                  {COMPATIBLE_TOOLS.map((tool) => (
                    <div key={tool.slug} className={styles.toolRailItem}>
                      <span className={styles.toolRailGlyph} aria-hidden="true">
                        {tool.glyph}
                      </span>
                      <div className={styles.toolRailMeta}>
                        <span className={styles.toolRailName}>{tool.name}</span>
                        <span className={styles.toolRailNote}>{tool.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <footer className={`${styles.section} ${styles.footerSection}`}>
          <div className={styles.footerPanel}>
            <div className={styles.footerCopy}>
              <h2 className={styles.sectionTitle}>Open source and ready to adapt.</h2>
              <p className={styles.sectionBody}>
                Built on{" "}
                <a
                  href="https://json-render.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineLink}
                >
                  json-render.dev
                </a>
                {" "}for teams that need visual updates to stay crisp.
              </p>

              <div className={styles.footerActions}>
                <a
                  href={`${GITHUB_URL}/stargazers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryLink}
                >
                  <Star className={styles.primaryLinkIcon} aria-hidden="true" weight="fill" />
                  Star on GitHub
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryLink}
                >
                  Browse repository
                </a>
              </div>
            </div>

            <article className={styles.partnerCard}>
              <p className={styles.partnerKicker}>
                <Sparkle className={styles.partnerKickerIcon} aria-hidden="true" weight="duotone" />
                Stable output, small surface area.
              </p>
              <p className={styles.partnerSummary}>
                Keep the workflow short enough to remember and the export reliable enough to share.
              </p>

              <a
                href="https://json-render.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.partnerLink}
              >
                Explore json-render.dev
                <ArrowSquareOut className={styles.partnerLinkIcon} aria-hidden="true" />
              </a>
            </article>
          </div>

          <p className={styles.copyright}>
            &copy;2012 &ndash; 2026
            <br />
            Nest of Etamine Studio. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
