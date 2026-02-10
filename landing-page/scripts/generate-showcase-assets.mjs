#!/usr/bin/env node

import { mkdtemp, mkdir, rm, writeFile, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "../..");
const landingDir = path.resolve(__dirname, "..");
const cliPath = path.join(repoRoot, "dist", "cli.js");
const outputRoot = path.join(landingDir, "public", "showcase");

const skillOrder = [
  "json-render-table",
  "json-render-ticket-table",
  "json-render-info-cards",
  "json-render-announcement-cards",
  "json-render-flow-summary"
];

function getConfig(mode) {
  const isDark = mode === "dark";

  return {
    version: 1,
    catalog: {
      allowedComponents: [
        "Container",
        "Row",
        "Column",
        "Card",
        "Heading",
        "Text",
        "Badge",
        "Divider",
        "Spacer",
        "Button",
        "Image"
      ],
      componentDefaults: {
        Container: {
          gap: 14
        },
        Card: {
          padding: 18,
          gap: 10
        },
        Text: {
          size: 15
        }
      }
    },
    theme: {
      mode,
      fontFamily:
        "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      textColor: "#101828",
      headingColor: "#101828",
      mutedTextColor: "#475467",
      cardBackground: "#ffffff",
      cardBorderColor: "#d0d5dd",
      dark: {
        textColor: "#e5e7eb",
        headingColor: "#f9fafb",
        mutedTextColor: "#98a2b3",
        cardBackground: "#111827",
        cardBorderColor: "#344054",
        canvasBackground: "#0b1220"
      },
      borderRadius: 16,
      spacing: 12
    },
    viewport: {
      width: 1100,
      height: 620,
      deviceScaleFactor: 2
    },
    screenshot: {
      type: "png",
      omitBackground: false,
      fullPage: false
    },
    canvas: {
      background: isDark ? "#0b1220" : "#edf2f7",
      padding: 22
    }
  };
}

function tableMessage(mode) {
  const modeLabel = mode === "dark" ? "DARK" : "LIGHT";

  return {
    root: {
      type: "Column",
      props: {
        width: "100%",
        height: "100%",
        gap: 14
      },
      children: [
        {
          type: "Row",
          props: {
            justify: "space-between",
            align: "center"
          },
          children: [
            {
              type: "Heading",
              props: {
                text: "Generic Data Table",
                level: 2,
                size: 34
              }
            },
            {
              type: "Badge",
              props: {
                text: `${modeLabel} MODE`,
                background: "#dbeafe",
                color: "#1d4ed8"
              }
            }
          ]
        },
        {
          type: "Card",
          props: {
            gap: 8,
            padding: 14
          },
          children: [
            {
              type: "Row",
              props: {
                justify: "space-between",
                gap: 10
              },
              children: [
                { type: "Text", props: { text: "Region", width: "23%", weight: 700 } },
                { type: "Text", props: { text: "Revenue", width: "23%", weight: 700 } },
                { type: "Text", props: { text: "QoQ", width: "20%", weight: 700 } },
                { type: "Text", props: { text: "Owner", width: "20%", weight: 700 } },
                { type: "Text", props: { text: "Health", width: "14%", weight: 700 } }
              ]
            },
            { type: "Divider", props: { color: "#98a2b3", thickness: 1 } },
            {
              type: "Row",
              props: { justify: "space-between", gap: 10 },
              children: [
                { type: "Text", props: { text: "North America", width: "23%" } },
                { type: "Text", props: { text: "$2.4M", width: "23%" } },
                { type: "Text", props: { text: "+14%", width: "20%" } },
                { type: "Text", props: { text: "Mina", width: "20%" } },
                {
                  type: "Badge",
                  props: {
                    text: "Strong",
                    width: "14%",
                    background: "#dcfce7",
                    color: "#166534"
                  }
                }
              ]
            },
            {
              type: "Row",
              props: { justify: "space-between", gap: 10 },
              children: [
                { type: "Text", props: { text: "EMEA", width: "23%" } },
                { type: "Text", props: { text: "$1.6M", width: "23%" } },
                { type: "Text", props: { text: "+7%", width: "20%" } },
                { type: "Text", props: { text: "Jon", width: "20%" } },
                {
                  type: "Badge",
                  props: {
                    text: "Watch",
                    width: "14%",
                    background: "#fef3c7",
                    color: "#92400e"
                  }
                }
              ]
            },
            {
              type: "Row",
              props: { justify: "space-between", gap: 10 },
              children: [
                { type: "Text", props: { text: "APAC", width: "23%" } },
                { type: "Text", props: { text: "$1.1M", width: "23%" } },
                { type: "Text", props: { text: "+19%", width: "20%" } },
                { type: "Text", props: { text: "Akira", width: "20%" } },
                {
                  type: "Badge",
                  props: {
                    text: "Strong",
                    width: "14%",
                    background: "#dcfce7",
                    color: "#166534"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  };
}

function ticketTableMessage(mode) {
  const modeLabel = mode === "dark" ? "DARK" : "LIGHT";

  return {
    root: {
      type: "Column",
      props: {
        width: "100%",
        height: "100%",
        gap: 12
      },
      children: [
        {
          type: "Row",
          props: {
            justify: "space-between",
            align: "center"
          },
          children: [
            {
              type: "Heading",
              props: {
                text: "Ticket Status Snapshot",
                level: 2,
                size: 34
              }
            },
            {
              type: "Badge",
              props: {
                text: `${modeLabel} MODE`,
                background: "#dbeafe",
                color: "#1d4ed8"
              }
            }
          ]
        },
        {
          type: "Card",
          props: {
            gap: 8,
            padding: 14
          },
          children: [
            {
              type: "Row",
              props: {
                justify: "space-between",
                gap: 8
              },
              children: [
                { type: "Text", props: { text: "ID", width: "11%", weight: 700 } },
                { type: "Text", props: { text: "Priority", width: "14%", weight: 700 } },
                { type: "Text", props: { text: "Status", width: "16%", weight: 700 } },
                { type: "Text", props: { text: "Assignee", width: "16%", weight: 700 } },
                { type: "Text", props: { text: "Updated", width: "15%", weight: 700 } },
                { type: "Text", props: { text: "Topic", width: "28%", weight: 700 } }
              ]
            },
            { type: "Divider", props: { color: "#98a2b3", thickness: 1 } },
            {
              type: "Row",
              props: { justify: "space-between", gap: 8 },
              children: [
                { type: "Text", props: { text: "INC-412", width: "11%" } },
                {
                  type: "Badge",
                  props: {
                    text: "P0",
                    width: "14%",
                    background: "#fee2e2",
                    color: "#991b1b"
                  }
                },
                {
                  type: "Badge",
                  props: {
                    text: "Blocked",
                    width: "16%",
                    background: "#fee2e2",
                    color: "#991b1b"
                  }
                },
                { type: "Text", props: { text: "Luna", width: "16%" } },
                { type: "Text", props: { text: "3m ago", width: "15%" } },
                { type: "Text", props: { text: "Webhook retries stalled", width: "28%" } }
              ]
            },
            {
              type: "Row",
              props: { justify: "space-between", gap: 8 },
              children: [
                { type: "Text", props: { text: "INC-413", width: "11%" } },
                {
                  type: "Badge",
                  props: {
                    text: "P1",
                    width: "14%",
                    background: "#fef3c7",
                    color: "#92400e"
                  }
                },
                {
                  type: "Badge",
                  props: {
                    text: "In Progress",
                    width: "16%",
                    background: "#dbeafe",
                    color: "#1e3a8a"
                  }
                },
                { type: "Text", props: { text: "Diego", width: "16%" } },
                { type: "Text", props: { text: "11m ago", width: "15%" } },
                { type: "Text", props: { text: "Rate limit tuning", width: "28%" } }
              ]
            },
            {
              type: "Row",
              props: { justify: "space-between", gap: 8 },
              children: [
                { type: "Text", props: { text: "INC-414", width: "11%" } },
                {
                  type: "Badge",
                  props: {
                    text: "P2",
                    width: "14%",
                    background: "#e0e7ff",
                    color: "#3730a3"
                  }
                },
                {
                  type: "Badge",
                  props: {
                    text: "Done",
                    width: "16%",
                    background: "#dcfce7",
                    color: "#166534"
                  }
                },
                { type: "Text", props: { text: "Ari", width: "16%" } },
                { type: "Text", props: { text: "26m ago", width: "15%" } },
                { type: "Text", props: { text: "Dashboard threshold fix", width: "28%" } }
              ]
            }
          ]
        }
      ]
    }
  };
}

function infoCardsMessage(mode) {
  const modeLabel = mode === "dark" ? "DARK" : "LIGHT";

  return {
    root: {
      type: "Column",
      props: {
        width: "100%",
        height: "100%",
        gap: 14
      },
      children: [
        {
          type: "Row",
          props: {
            justify: "space-between",
            align: "center"
          },
          children: [
            {
              type: "Heading",
              props: {
                text: "KPI Overview Cards",
                level: 2,
                size: 34
              }
            },
            {
              type: "Badge",
              props: {
                text: `${modeLabel} MODE`,
                background: "#dbeafe",
                color: "#1d4ed8"
              }
            }
          ]
        },
        {
          type: "Row",
          props: {
            gap: 12,
            wrap: true
          },
          children: [
            {
              type: "Card",
              props: { width: "32%", minWidth: 260, gap: 6 },
              children: [
                { type: "Text", props: { text: "Monthly ARR", size: 13, color: "#667085" } },
                { type: "Heading", props: { text: "$4.8M", level: 3, size: 36 } },
                { type: "Badge", props: { text: "+12.4%", background: "#dcfce7", color: "#166534" } }
              ]
            },
            {
              type: "Card",
              props: { width: "32%", minWidth: 260, gap: 6 },
              children: [
                { type: "Text", props: { text: "Activation", size: 13, color: "#667085" } },
                { type: "Heading", props: { text: "68.2%", level: 3, size: 36 } },
                { type: "Badge", props: { text: "+3.1%", background: "#dcfce7", color: "#166534" } }
              ]
            },
            {
              type: "Card",
              props: { width: "32%", minWidth: 260, gap: 6 },
              children: [
                { type: "Text", props: { text: "Churn", size: 13, color: "#667085" } },
                { type: "Heading", props: { text: "1.9%", level: 3, size: 36 } },
                { type: "Badge", props: { text: "-0.4%", background: "#dbeafe", color: "#1e3a8a" } }
              ]
            }
          ]
        }
      ]
    }
  };
}

function announcementCardsMessage(mode) {
  const modeLabel = mode === "dark" ? "DARK" : "LIGHT";

  return {
    root: {
      type: "Column",
      props: {
        width: "100%",
        height: "100%",
        justify: "space-between"
      },
      children: [
        {
          type: "Card",
          props: {
            background: "linear-gradient(130deg, #1d4ed8, #0f766e)",
            borderColor: "transparent",
            color: "#ffffff",
            gap: 10,
            padding: 24,
            height: "72%"
          },
          children: [
            {
              type: "Row",
              props: {
                justify: "space-between",
                align: "center"
              },
              children: [
                {
                  type: "Badge",
                  props: {
                    text: "Launch Week",
                    background: "rgba(255,255,255,0.2)",
                    color: "#ffffff"
                  }
                },
                {
                  type: "Badge",
                  props: {
                    text: `${modeLabel} MODE`,
                    background: "rgba(255,255,255,0.2)",
                    color: "#ffffff"
                  }
                }
              ]
            },
            {
              type: "Heading",
              props: {
                text: "New Skills for json-render-cli",
                level: 1,
                size: 52,
                color: "#ffffff"
              }
            },
            {
              type: "Text",
              props: {
                text: "Ship polished PNG visuals for ticket boards, KPI cards, flow summaries, and announcements in one CLI workflow.",
                size: 20,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.92)"
              }
            },
            {
              type: "Button",
              props: {
                label: "Try the Showcase",
                background: "#ffffff",
                color: "#0f172a",
                padding: "12px 16px",
                borderRadius: 12
              }
            }
          ]
        },
        {
          type: "Text",
          props: {
            text: "Announcement-style cards for release notes and campaign visuals.",
            size: 14,
            color: "#667085"
          }
        }
      ]
    }
  };
}

function flowSummaryMessage(mode) {
  const modeLabel = mode === "dark" ? "DARK" : "LIGHT";

  return {
    root: {
      type: "Column",
      props: {
        width: "100%",
        height: "100%",
        gap: 12
      },
      children: [
        {
          type: "Row",
          props: {
            justify: "space-between",
            align: "center"
          },
          children: [
            {
              type: "Heading",
              props: {
                text: "Flow Timeline Summary",
                level: 2,
                size: 34
              }
            },
            {
              type: "Badge",
              props: {
                text: `${modeLabel} MODE`,
                background: "#dbeafe",
                color: "#1d4ed8"
              }
            }
          ]
        },
        {
          type: "Row",
          props: {
            gap: 12,
            align: "stretch"
          },
          children: [
            {
              type: "Card",
              props: { width: "33%", minWidth: 280 },
              children: [
                { type: "Badge", props: { text: "DONE", background: "#dcfce7", color: "#166534" } },
                { type: "Heading", props: { text: "Detect", level: 3, size: 26 } },
                { type: "Text", props: { text: "Alert triggered by error spike in ingest worker." } }
              ]
            },
            {
              type: "Card",
              props: { width: "33%", minWidth: 280 },
              children: [
                {
                  type: "Badge",
                  props: {
                    text: "IN PROGRESS",
                    background: "#dbeafe",
                    color: "#1e3a8a"
                  }
                },
                { type: "Heading", props: { text: "Mitigate", level: 3, size: 26 } },
                { type: "Text", props: { text: "Retry policy update rolling out to production queue." } }
              ]
            },
            {
              type: "Card",
              props: { width: "33%", minWidth: 280 },
              children: [
                {
                  type: "Badge",
                  props: {
                    text: "BLOCKED",
                    background: "#fee2e2",
                    color: "#991b1b"
                  }
                },
                { type: "Heading", props: { text: "Review", level: 3, size: 26 } },
                { type: "Text", props: { text: "Postmortem pending dependency from infra owners." } }
              ]
            }
          ]
        }
      ]
    }
  };
}

const messageBuilders = {
  "json-render-table": tableMessage,
  "json-render-ticket-table": ticketTableMessage,
  "json-render-info-cards": infoCardsMessage,
  "json-render-announcement-cards": announcementCardsMessage,
  "json-render-flow-summary": flowSummaryMessage
};

function renderAsset({ mode, skillId, configPath, outputPath }) {
  const message = messageBuilders[skillId](mode);

  const args = [
    cliPath,
    "-m",
    JSON.stringify(message),
    "-c",
    configPath,
    "-o",
    outputPath,
    "--size",
    "1100x620"
  ];

  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Failed to render ${skillId} (${mode}).`,
        result.stdout?.trim() || "",
        result.stderr?.trim() || ""
      ]
        .filter(Boolean)
        .join("\n")
    );
  }
}

async function ensureCliBuilt() {
  try {
    await access(cliPath, fsConstants.R_OK);
  } catch {
    throw new Error(
      `Cannot find ${cliPath}. Build root CLI first with: npm run build (in ${repoRoot}).`
    );
  }
}

async function main() {
  await ensureCliBuilt();

  await mkdir(path.join(outputRoot, "light"), { recursive: true });
  await mkdir(path.join(outputRoot, "dark"), { recursive: true });

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "jr-showcase-assets-"));

  try {
    for (const mode of ["light", "dark"]) {
      const configPath = path.join(tmpDir, `config-${mode}.json`);
      await writeFile(configPath, JSON.stringify(getConfig(mode), null, 2), "utf8");

      for (const skillId of skillOrder) {
        const outputPath = path.join(outputRoot, mode, `${skillId}.png`);
        renderAsset({ mode, skillId, configPath, outputPath });
        process.stdout.write(`Rendered ${mode}/${skillId}.png\n`);
      }
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
