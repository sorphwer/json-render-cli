# json-render-cli Skills

These skills are designed for Codex and are hosted in this GitHub repository under `npm/skills/`.

## Available skills

- `use-json-render-cli`

The skill folder contains a `SKILL.md`, `references/`, and `agents/openai.yaml`.

## Install from GitHub

Install all skills with one command:

```bash
node scripts/install-skills.mjs --all
```

Install the skill explicitly:

```bash
node scripts/install-skills.mjs --skill use-json-render-cli
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
  use-json-render-cli/
    SKILL.md
    agents/openai.yaml
    references/* (routing guides, command templates, JSON specs)
```
