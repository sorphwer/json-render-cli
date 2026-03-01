# json-render-cli Monorepo

This repository is a monorepo with two projects:

- `npm/`: `json-render-cli` package (CLI source, tests, examples, and bundled Codex skills)
- `landingpage/`: Next.js marketing/demo site

## CLI package (`npm/`)

```bash
cd npm
npm install
npx playwright install chromium
npm test
npm run build
```

Publish from `npm/`:

```bash
cd npm
npm run release:check
npm run release:latest
```

## Landing page (`landingpage/`)

```bash
cd landingpage
npm install
npm run dev
```

## Skills

Codex skills live under `npm/skills/`.

- `npm/skills/use-json-render-cli`

See `npm/skills/README.md` for GitHub installation and usage details.
