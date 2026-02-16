import { ExternalLink, Github, Sparkles, Star } from "lucide-react";

import { Features } from "@/components/sections/Features";
import { DeckScroller } from "@/components/layout/DeckScroller";
import { CopyCommand } from "@/components/common/CopyCommand";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";

import styles from "./page.module.css";

const LOBE_ICON_CDN = "https://unpkg.com/@lobehub/icons-static-svg@latest/icons";
const SIMPLE_ICON_CDN = "https://cdn.simpleicons.org";
const GITHUB_URL = "https://github.com/sorphwer/json-render-cli";
const SKILLS_PATH_URL = `${GITHUB_URL}/tree/main/npm/skills`;
const VERCEL_CONFIG_URL = `${GITHUB_URL}/blob/main/vercel.json`;
const INSTALL_COMMAND =
  "npm i -g json-render-cli && npx playwright install chromium && scripts/install-skill-from-github.py --repo sorphwer/json-render-cli --path npm/skills/json-render-table";
const AGENT_STEPS = [
  {
    title: "Install runtime first",
    detail: "Install json-render-cli and Chromium runtime once."
  },
  {
    title: "Install skills from GitHub paths",
    detail: "Install from sorphwer/json-render-cli under npm/skills/<skill-name>."
  },
  {
    title: "Chat with Agent using installed skills",
    detail: "Request image rendering directly without landingpage runtime dependency."
  }
];

const compatibleTools = [
  {
    name: "OpenClaw",
    slug: "openclaw",
    iconEmoji: "🦞",
    styleClass: "toolOpenclaw"
  },
  {
    name: "Codex",
    slug: "codex",
    iconSrc: `${LOBE_ICON_CDN}/openai.svg`,
    monochrome: true,
    styleClass: "toolCodex"
  },
  {
    name: "Cursor",
    slug: "cursor",
    iconSrc: `${SIMPLE_ICON_CDN}/cursor/3B82F6`,
    styleClass: "toolCursor"
  },
  {
    name: "Claude",
    slug: "claude",
    iconSrc: `${LOBE_ICON_CDN}/claude-color.svg`,
    styleClass: "toolClaude"
  }
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.installBar}>
          <span className={styles.installLabel}>Install</span>
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
            <Github className={styles.githubIcon} aria-hidden="true" />
          </a>
        </div>
      </header>

      <DeckScroller className={styles.deck} ariaLabel="Landing slices">
        <section id="top" className={`${styles.slice} ${styles.heroSlice}`} data-slice>
          <Hero />
        </section>

        <section id="showcase" className={`${styles.slice} ${styles.showcaseSlice}`} data-slice>
          <div className={styles.showcaseSection}>
            <div className={styles.showcaseHead}>
              <p className={styles.showcaseKicker}>Interactive Demo</p>
              <h2 className={styles.showcaseTitle}>Draw prompts. Send. Preview a skill output card.</h2>
            </div>
            <ShowcaseShell />
          </div>
        </section>

        <section className={`${styles.slice} ${styles.featuresSlice}`} data-slice>
          <Features />
        </section>

        <section className={`${styles.slice} ${styles.footerSlice}`} data-slice>
          <footer id="install" className={styles.footer}>
            <div className={styles.footerTop}>
              <section className={styles.footerIntro}>
                <p className={styles.footerKicker}>Install + Ship</p>
                <h2 className={styles.footerTitle}>json-render-cli for prompt-to-image workflows</h2>
                <p className={styles.footerDescription}>
                  Generate clean PNG outputs for reporting, incident updates, and release communication with one repeatable pipeline.
                </p>
                <ol className={styles.footerSteps} aria-label="Agent workflow steps">
                  {AGENT_STEPS.map((step, index) => (
                    <li key={step.title} className={styles.footerStepItem}>
                      <span className={styles.footerStepIndex}>{index + 1}</span>
                      <span>
                        <strong>{step.title}.</strong> {step.detail}
                      </span>
                    </li>
                  ))}
                </ol>
                <code className={styles.footerCode}>{INSTALL_COMMAND}</code>
              </section>

              <section className={styles.footerTools}>
                <p className={styles.footerLabel}>Compatible with</p>
                <div className={styles.iconGrid}>
                  {compatibleTools.map((tool) => (
                    <div key={tool.slug} className={`${styles.iconItem} ${styles[tool.styleClass]}`}>
                      <div className={styles.iconVisual} aria-hidden="true">
                        {"iconEmoji" in tool && tool.iconEmoji ? (
                          <span className={styles.iconEmoji}>{tool.iconEmoji}</span>
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tool.iconSrc}
                              alt=""
                              width={22}
                              height={22}
                              loading="lazy"
                              className={`${styles.iconImage} ${tool.monochrome ? styles.iconImageMono : ""}`}
                            />
                          </>
                        )}
                      </div>
                      <span>{tool.name}</span>
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
                <p className={styles.starKicker}>GitHub Skills</p>
                <h2 id="star-title" className={styles.starTitle}>
                  Install skills directly from this repo and start rendering in chat.
                </h2>
                <p className={styles.starDescription}>
                  For skill usage, you only need runtime + skill installation. The landing page is optional and separate.
                </p>
                <div className={styles.starActions}>
                  <a
                    href={SKILLS_PATH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.starPrimary}
                  >
                    <Star className={styles.starPrimaryIcon} aria-hidden="true" />
                    Open Skills Folder
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.starSecondary}
                  >
                    <Github className={styles.starSecondaryIcon} aria-hidden="true" />
                    Browse repository
                  </a>
                </div>
              </div>

              <div className={styles.starVisual}>
                <article className={styles.partnerCard}>
                  <p className={styles.partnerKicker}>
                    <Sparkles className={styles.partnerKickerIcon} aria-hidden="true" />
                    CI/CD
                  </p>
                  <h3 className={styles.partnerTitle}>Monorepo deploy path is pinned via vercel.json.</h3>
                  <p className={styles.partnerDescription}>
                    Use the root-level Vercel config to build from <code>landingpage/</code> while keeping npm and
                    skills under <code>npm/</code>.
                  </p>
                  <a
                    href={VERCEL_CONFIG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                  >
                    Open vercel.json
                    <ExternalLink className={styles.partnerLinkIcon} aria-hidden="true" />
                  </a>
                </article>
              </div>
            </div>
          </section>
        </section>
      </DeckScroller>
    </div>
  );
}
