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
  "viewport": {
    "width": 1200,
    "height": 630,
    "deviceScaleFactor": 2
  },
  "screenshot": {
    "type": "png",
    "omitBackground": false
  },
  "canvas": {
    "background": "#f8fafc",
    "padding": 24
  }
}
```

If `catalog.allowedComponents` is empty/missing, all built-in components are allowed.

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

This package ships with a reusable Codex skill:

- `skills/json-render-ticket-table/SKILL.md`

After global install (`npm i -g json-render-cli`), you can find it under your global `node_modules` path, for example:

- `$(npm root -g)/json-render-cli/skills/json-render-ticket-table/SKILL.md`
