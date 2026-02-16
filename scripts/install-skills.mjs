#!/usr/bin/env node

/**
 * Interactive skill installer for json-render-cli.
 *
 * Usage:
 *   node scripts/install-skills.mjs              # interactive (TTY) or install all (non-TTY)
 *   node scripts/install-skills.mjs --all        # install all skills
 *   node scripts/install-skills.mjs --skill name # install specific skill(s)
 *   node scripts/install-skills.mjs --dest dir   # custom destination directory
 */

import { createInterface } from "readline";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const REPO = "sorphwer/json-render-cli";
const SKILLS_DIR = "npm/skills";
const API_BASE = `https://api.github.com/repos/${REPO}/contents`;
const DEFAULT_DEST = join(homedir(), ".openclaw", "skills");

const SKILLS = [
  "json-render-table",
  "json-render-ticket-table",
  "json-render-info-cards",
  "json-render-announcement-cards",
  "json-render-flow-summary",
];

// ── CLI arg parsing ──────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { all: false, skills: [], dest: DEFAULT_DEST };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--all":
        result.all = true;
        break;
      case "--skill":
        if (i + 1 < args.length) {
          result.skills.push(args[++i]);
        } else {
          console.error("Error: --skill requires a value");
          process.exit(1);
        }
        break;
      case "--dest":
        if (i + 1 < args.length) {
          result.dest = args[++i].replace(/^~/, homedir());
        } else {
          console.error("Error: --dest requires a value");
          process.exit(1);
        }
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }
  return result;
}

function printHelp() {
  console.log(`
Usage: node scripts/install-skills.mjs [options]

Options:
  --all              Install all available skills
  --skill <name>     Install a specific skill (repeatable)
  --dest <path>      Destination directory (default: ~/.openclaw/skills/)
  -h, --help         Show this help message

Available skills:
${SKILLS.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}
`);
}

// ── GitHub API helpers ───────────────────────────────────────────────

async function fetchJSON(url) {
  const headers = { "User-Agent": "json-render-skill-installer" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${url}`);
  }
  return res.json();
}

async function listFilesRecursive(repoPath) {
  const entries = await fetchJSON(`${API_BASE}/${repoPath}`);
  const files = [];
  for (const entry of entries) {
    if (entry.type === "file") {
      files.push({ path: entry.path, download_url: entry.download_url });
    } else if (entry.type === "dir") {
      files.push(...(await listFilesRecursive(entry.path)));
    }
  }
  return files;
}

async function downloadFile(url) {
  const headers = { "User-Agent": "json-render-skill-installer" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Download failed ${res.status}: ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// ── Install logic ────────────────────────────────────────────────────

async function installSkill(skillName, dest) {
  const repoPath = `${SKILLS_DIR}/${skillName}`;
  const targetDir = join(dest, skillName);

  process.stdout.write(`  ${skillName} ... `);

  let files;
  try {
    files = await listFilesRecursive(repoPath);
  } catch (err) {
    console.log(`FAILED (${err.message})`);
    return false;
  }

  let count = 0;
  for (const file of files) {
    const relativePath = file.path.replace(`${repoPath}/`, "");
    const fileDest = join(targetDir, relativePath);
    await mkdir(join(fileDest, ".."), { recursive: true });
    const content = await downloadFile(file.download_url);
    await writeFile(fileDest, content);
    count++;
  }

  console.log(`OK (${count} file${count !== 1 ? "s" : ""})`);
  return true;
}

async function installSkills(skillNames, dest) {
  console.log(`\nInstalling ${skillNames.length} skill(s) to ${dest}\n`);

  let ok = 0;
  let fail = 0;
  for (const name of skillNames) {
    const success = await installSkill(name, dest);
    if (success) ok++;
    else fail++;
  }

  console.log(`\nDone: ${ok} installed${fail ? `, ${fail} failed` : ""}.`);
  return fail === 0;
}

// ── Interactive menu ─────────────────────────────────────────────────

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function interactiveMenu(dest) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log("\nAvailable skills:\n");
  SKILLS.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  console.log();

  const answer = await prompt(rl, "Install all? [Y/n] ");
  const trimmed = answer.trim().toLowerCase();

  if (trimmed === "" || trimmed === "y" || trimmed === "yes") {
    rl.close();
    return SKILLS;
  }

  if (trimmed === "n" || trimmed === "no") {
    const selection = await prompt(rl, "Enter skill numbers (comma-separated, e.g. 1,3,5): ");
    rl.close();

    const indices = selection
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => n >= 1 && n <= SKILLS.length);

    if (indices.length === 0) {
      console.log("No valid selection. Exiting.");
      process.exit(0);
    }

    return indices.map((i) => SKILLS[i - 1]);
  }

  rl.close();
  console.log("Invalid input. Exiting.");
  process.exit(1);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv);

  let selectedSkills;

  if (opts.all) {
    selectedSkills = SKILLS;
  } else if (opts.skills.length > 0) {
    const invalid = opts.skills.filter((s) => !SKILLS.includes(s));
    if (invalid.length > 0) {
      console.error(`Unknown skill(s): ${invalid.join(", ")}`);
      console.error(`Available: ${SKILLS.join(", ")}`);
      process.exit(1);
    }
    selectedSkills = opts.skills;
  } else if (process.stdin.isTTY) {
    selectedSkills = await interactiveMenu(opts.dest);
  } else {
    // Non-TTY without flags → install all (agent scenario)
    selectedSkills = SKILLS;
  }

  const success = await installSkills(selectedSkills, opts.dest);
  process.exit(success ? 0 : 1);
}

main();
