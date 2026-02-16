# json-render-cli Skills

These skills are designed for Codex and are hosted in this GitHub repository under `npm/skills/`.

## Available skills

- `json-render-table`
- `json-render-ticket-table`
- `json-render-info-cards`
- `json-render-announcement-cards`
- `json-render-flow-summary`

Each skill folder contains a `SKILL.md` plus optional `references/` and `agents/` files.

## Install from GitHub

Install all skills with one command:

```bash
node scripts/install-skills.mjs --all
```

Install specific skills:

```bash
node scripts/install-skills.mjs --skill json-render-table --skill json-render-flow-summary
```

Run interactively to pick which skills to install:

```bash
node scripts/install-skills.mjs
```

Custom destination (default is `~/.openclaw/skills/`):

```bash
node scripts/install-skills.mjs --all --dest ~/custom/path
```

## Runtime prerequisites

These skills render PNG output using the `json-render` CLI command.
If the command is not present, the templates instruct Codex to install it with:

```bash
npm i -g json-render-cli
```

If Chromium binaries are missing, install with:

```bash
npx playwright install chromium
```

## Repository structure

```text
npm/skills/
  json-render-*/
    SKILL.md
    agents/openai.yaml
    references/* (template commands and JSON specs)
```
