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
const INSTALL_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/sorphwer/json-render-cli/main/scripts/install.sh | bash";
const AGENT_STEPS = [
  {
    title: "Run the skill installer",
    detail: "One command installs all skills to ~/.openclaw/skills/."
  },
  {
    title: "Chat with Agent using installed skills",
    detail: "Request image rendering directly; skills will bootstrap runtime if needed."
  },
  {
    title: "Render and iterate",
    detail: "Use compact templates and get PNG output in one prompt."
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
                <p className={styles.starKicker}>Acknowledgements</p>
                <h2 id="star-title" className={styles.starTitle}>
                  Built in the open. Give it a star if it saved you time.
                </h2>
                <p className={styles.starDescription}>
                  This project is open-source and free to use. If you find it helpful, a star on GitHub
                  means a lot and helps others discover it too.
                </p>
                <div className={styles.starActions}>
                  <a
                    href={`${GITHUB_URL}/stargazers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.starPrimary}
                  >
                    <Star className={styles.starPrimaryIcon} aria-hidden="true" />
                    Star on GitHub
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
                    Powered by
                  </p>
                  <h3 className={styles.partnerTitle}>Built on top of the JSON Render engine.</h3>
                  <p className={styles.partnerDescription}>
                    All skill templates compile to JSON specs and render through{" "}
                    <code>json-render</code> — an open-source, config-driven layout engine for
                    producing pixel-perfect PNGs from structured data.
                  </p>
                  <a
                    href="https://json-render.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partnerLink}
                  >
                    json-render.dev
                    <ExternalLink className={styles.partnerLinkIcon} aria-hidden="true" />
                  </a>
                </article>
              </div>
            </div>
          </section>
        </section>
        <p className={styles.copyright}>
          &copy;2012 &ndash; 2026<br />
          Nest of Etamine Studio All Rights Reserved.
        </p>
      </DeckScroller>
    </div>
  );
}
