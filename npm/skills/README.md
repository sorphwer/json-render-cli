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

Install one or more skills by repo path (example with Codex skill installer helper):

```bash
scripts/install-skill-from-github.py --repo sorphwer/json-render-cli --path npm/skills/json-render-table
```

You can install any other skill by replacing the final path segment.

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
