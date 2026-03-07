import { ArrowSquareOut, GithubLogo, Sparkle, Star } from "@phosphor-icons/react/ssr";

import { Features } from "@/components/sections/Features";
import { DeckScroller } from "@/components/layout/DeckScroller";
import { CopyCommand } from "@/components/common/CopyCommand";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";

import styles from "./page.module.css";

const GITHUB_URL = "https://github.com/sorphwer/json-render-cli";
const INSTALL_COMMAND =
  "install skill from sorphwer/json-render-cli: npm/skills/use-json-render-cli";
const DEMO_STEPS = [
  {
    title: "Pick a request",
    detail: "Start from a realistic prompt instead of a toy input."
  },
  {
    title: "Send it once",
    detail: "The agent drafts JSON and runs the renderer in the same flow."
  },
  {
    title: "Review the PNG",
    detail: "Inspect the output immediately and iterate with another prompt."
  }
];
const AGENT_STEPS = [
  {
    title: "Install the skill",
    detail: "Point your agent at this repo and add the bundled use-json-render-cli skill once."
  },
  {
    title: "Ask in plain language",
    detail: "Describe the card, table, or summary you need without switching tools."
  },
  {
    title: "Render and iterate",
    detail: "The agent routes to the matching template and returns a PNG ready to share."
  }
];

const compatibleTools = [
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
        style={{ backdropFilter: "url(#liquid-glass) blur(2px) saturate(1.8) brightness(1.1)", WebkitBackdropFilter: "blur(14px) saturate(1.8) brightness(1.1)" }}
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

      <DeckScroller className={styles.deck} ariaLabel="Landing slices">
        <section id="top" className={`${styles.slice} ${styles.heroSlice}`} data-slice>
          <Hero />
        </section>

        <section id="showcase" className={`${styles.slice} ${styles.showcaseSlice}`} data-slice>
          <div className={styles.showcaseSection}>
            <div className={styles.showcaseLead}>
              <p className={styles.showcaseKicker}>Live Workflow</p>
              <h2 className={styles.showcaseTitle}>Watch one prompt turn into a ready-to-share card.</h2>
            </div>

            <div className={styles.showcaseFrame}>
              <div className={styles.showcaseSteps}>
                {DEMO_STEPS.map((step, index) => (
                  <article key={step.title} className={styles.showcaseStep}>
                    <span className={styles.showcaseStepIndex}>0{index + 1}</span>
                    <div className={styles.showcaseStepCopy}>
                      <h3 className={styles.showcaseStepTitle}>{step.title}</h3>
                      <p className={styles.showcaseStepDescription}>{step.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <ShowcaseShell />
            </div>
          </div>
        </section>

        <section className={`${styles.slice} ${styles.featuresSlice}`} data-slice>
          <Features />
        </section>

        <section className={`${styles.slice} ${styles.footerSlice}`} data-slice>
          <footer id="install" className={styles.footer}>
            <div className={styles.footerLead}>
              <div className={styles.footerLeadCopy}>
                <p className={styles.footerKicker}>Install + Ship</p>
                <h2 className={styles.footerTitle}>Keep prompt-to-image output consistent across agents.</h2>
              </div>

              <div className={styles.footerCtaRow}>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerPrimary}
                >
                  Open GitHub repo
                  <GithubLogo className={styles.footerPrimaryIcon} aria-hidden="true" weight="fill" />
                </a>
                <a href="#showcase" className={styles.footerSecondary}>
                  See the live demo
                </a>
              </div>
            </div>

            <div className={styles.footerGrid}>
              <section className={styles.footerFlow}>
                <p className={styles.footerFlowLabel}>Three-step setup</p>
                <ol className={styles.footerFlowList} aria-label="Agent workflow steps">
                  {AGENT_STEPS.map((step, index) => (
                    <li key={step.title} className={styles.footerFlowItem}>
                      <span className={styles.footerFlowIndex}>{index + 1}</span>
                      <div className={styles.footerFlowText}>
                        <strong>{step.title}</strong>
                        <span>{step.detail}</span>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className={styles.footerInstallBox}>
                  <div className={styles.footerInstallHead}>
                    <span className={styles.footerInstallLabel}>Skill path</span>
                    <CopyCommand command={INSTALL_COMMAND} buttonClassName={styles.footerCopyButton} compact />
                  </div>
                  <code className={styles.footerCode}>{INSTALL_COMMAND}</code>
                </div>
              </section>

              <section className={styles.footerTools}>
                <p className={styles.footerLabel}>Common Agent Surfaces</p>
                <p className={styles.footerToolsDescription}>
                  Use the same render workflow anywhere an agent can install a skill and run one CLI command.
                </p>
                <div className={styles.toolRail}>
                  {compatibleTools.map((tool) => (
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

            <div className={styles.footerBottom}>
              <p className={styles.footerMeta}>
                <cite>
                  Built with{" "}
                  <a
                    href="https://json-render.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerCiteLink}
                  >
                    json-render.dev
                  </a>
                </cite>
              </p>
            </div>
          </footer>
        </section>

        <section className={`${styles.slice} ${styles.starSlice}`} data-slice>
          <section className={styles.starPanel} aria-labelledby="star-title">
            <div className={styles.starGlow} aria-hidden="true" />
            <div className={styles.starGrid}>
              <div className={styles.starCopy}>
                <p className={styles.starKicker}>Open Source</p>
                <h2 id="star-title" className={styles.starTitle}>
                  Built in the open for teams that need visuals to ship fast.
                </h2>
                <div className={styles.starActions}>
                  <a
                    href={`${GITHUB_URL}/stargazers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.starPrimary}
                  >
                    <Star className={styles.starPrimaryIcon} aria-hidden="true" weight="fill" />
                    Star on GitHub
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.starSecondary}
                  >
                    <GithubLogo className={styles.starSecondaryIcon} aria-hidden="true" weight="fill" />
                    Browse repository
                  </a>
                </div>
              </div>

              <div className={styles.starVisual}>
                <article className={styles.partnerCard}>
                  <p className={styles.partnerKicker}>
                    <Sparkle className={styles.partnerKickerIcon} aria-hidden="true" weight="duotone" />
                    Powered by json-render.dev
                  </p>
                  <h3 className={styles.partnerTitle}>Structured JSON in. Pixel-precise PNG out.</h3>
                  <a
                    href="https://json-render.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                  >
                    json-render.dev
                    <ArrowSquareOut className={styles.partnerLinkIcon} aria-hidden="true" />
                  </a>
                </article>
              </div>
            </div>
          </section>
        </section>
        <p className={styles.copyright}>
          &copy;2012 &ndash; 2026<br />
          Nest of Etamine Studio. All rights reserved.
        </p>
      </DeckScroller>
    </div>
  );
}
