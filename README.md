# json-render-cli

Node.js CLI that renders a JSON UI spec into a PNG image using `@json-render/react` + Playwright headless Chromium.

## Install

```bash
npm install
npx playwright install chromium
npm run build
```

## Usage

```bash
json-render -m '<json>' -c ./config.json -o stdout --size 1200x630
```

Options:

- `-m, --message <json>`: Required. JSON string for UI spec (direct inline JSON only).
- `-c, --config <path>`: Optional. Path to config JSON. Default: `./config.json`.
- `-o, --output <stdout|filePath>`: Optional. Default: `stdout`.
- `--size <WIDTHxHEIGHT>`: Optional viewport override.

Output behavior:

- `stdout` (default): prints pure PNG Base64 (no data URL prefix).
- file path: writes PNG file and prints absolute file path.

## Message JSON formats (`-m`)

The CLI validates input with AJV JSON Schema before rendering.

### 1) Flat spec (`root + elements`)

```json
{
  "root": "root",
  "elements": {
    "root": {
      "type": "Container",
      "props": { "height": "100%" },
      "children": ["title"]
    },
    "title": {
      "type": "Heading",
      "props": { "text": "Hello" }
    }
  }
}
```

### 2) Tree spec (`root` nested element)

```json
{
  "root": {
    "type": "Container",
    "children": [
      {
        "type": "Heading",
        "props": { "text": "Hello" }
      }
    ]
  }
}
```

Tree spec is normalized to the flat structure internally.

## Config

`config.json` is validated with Zod.

```json
{
  "version": 1,
  "catalog": {
    "allowedComponents": ["Container", "Card", "Heading", "Text", "Button"],
    "componentDefaults": {
      "Card": { "padding": 20 }
    }
  },
  "theme": {
    "mode": "system",
    "fontFamily": "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    "textColor": "#0f172a",
    "headingColor": "#020617",
    "mutedTextColor": "#475569",
    "cardBackground": "#ffffff",
    "cardBorderColor": "#e2e8f0",
    "dark": {
      "textColor": "#e2e8f0",
      "headingColor": "#f8fafc",
      "mutedTextColor": "#94a3b8",
      "cardBackground": "#0f172a",
      "cardBorderColor": "#334155",
      "canvasBackground": "#020617"
    },
    "borderRadius": 16,
    "spacing": 12
  },
  "viewport": {
    "width": 1200,
    "height": 630,
    "deviceScaleFactor": 2
  },
  "screenshot": {
    "type": "png",
    "omitBackground": false,
    "fullPage": false
  },
  "canvas": {
    "background": "#f8fafc",
    "padding": 24
  }
}
```

If `catalog.allowedComponents` is empty/missing, all built-in components are allowed.

`theme.mode` supports `light`, `dark`, and `system` (default). `system` follows `prefers-color-scheme`.

For variable row counts (for example, table cells wrapping to multiple lines), set
`screenshot.fullPage` to `true` to avoid clipping the bottom rows.

## Built-in components

- `Container`
- `Row`
- `Column`
- `Card`
- `Heading`
- `Text`
- `Badge`
- `Divider`
- `Spacer`
- `Button`
- `Image`

## Local examples

```bash
# Flat spec to file
npm run dev -- -m "$(cat examples/ui-flat.json)" -c examples/config.json -o /tmp/render.png

# Tree spec to stdout(base64)
npm run dev -- -m "$(cat examples/ui-tree.json)" -c examples/config.json -o stdout
```

## Test

```bash
npm test
```

Integration screenshot test runs only when Playwright Chromium binary is available.

## Packaged skills

This package ships with five reusable Codex skills:

- `skills/json-render-table/SKILL.md` (generic table rendering)
- `skills/json-render-ticket-table/SKILL.md` (ticket-focused table rendering)
- `skills/json-render-info-cards/SKILL.md` (KPI and summary card rendering)
- `skills/json-render-announcement-cards/SKILL.md` (announcement and hero card rendering)
- `skills/json-render-flow-summary/SKILL.md` (step and timeline summary rendering)

After global install (`npm i -g json-render-cli`), you can find it under your global `node_modules` path, for example:

- `$(npm root -g)/json-render-cli/skills/json-render-table/SKILL.md`
- `$(npm root -g)/json-render-cli/skills/json-render-ticket-table/SKILL.md`
- `$(npm root -g)/json-render-cli/skills/json-render-info-cards/SKILL.md`
- `$(npm root -g)/json-render-cli/skills/json-render-announcement-cards/SKILL.md`
- `$(npm root -g)/json-render-cli/skills/json-render-flow-summary/SKILL.md`
