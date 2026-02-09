# Compact Ticket Table Command Template (No Temp JSON Files)

Use this template to render a compact head+body ticket table without creating temporary JSON files.

## 1) Fill ticket values

```bash
export ID="#1236"
export PRIORITY="HIGH"
export STATUS="OPEN"
export ASSIGNEE="Riino"
export UPDATED_AT="周一 14:34"
export TOPIC="plugin-daemon 链接 Redis 问题"
```

## 2) Build message JSON in memory from template

```bash
MESSAGE_JSON="$(python3 - <<'PY'
import json, pathlib, os
p = pathlib.Path('/Users/sorphwer/.codex/skills/json-render-ticket-table/references/compact-ticket-spec.template.json')
tpl = p.read_text(encoding='utf-8')
m = {
  '__ID__': os.environ['ID'],
  '__PRIORITY__': os.environ['PRIORITY'],
  '__STATUS__': os.environ['STATUS'],
  '__ASSIGNEE__': os.environ['ASSIGNEE'],
  '__UPDATED_AT__': os.environ['UPDATED_AT'],
  '__TOPIC__': os.environ['TOPIC'],
}
for k, v in m.items():
  tpl = tpl.replace(k, json.dumps(v, ensure_ascii=False)[1:-1])
print(tpl)
PY
)"
```

## 3) Render (config via process substitution)

```bash
node /Users/sorphwer/repos/json-render-cli/dist/cli.js \
  -m "$MESSAGE_JSON" \
  -c <(cat <<'JSON'
{
  "version": 1,
  "catalog": {
    "allowedComponents": ["Container", "Row", "Column", "Card", "Heading", "Text", "Badge", "Divider", "Spacer", "Button", "Image"],
    "componentDefaults": {}
  },
  "theme": {
    "fontFamily": "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    "textColor": "#0f172a",
    "headingColor": "#020617",
    "mutedTextColor": "#475569",
    "cardBackground": "#ffffff",
    "cardBorderColor": "#e2e8f0",
    "borderRadius": 0,
    "spacing": 0
  },
  "viewport": { "width": 986, "height": 120, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false },
  "canvas": { "background": "#ffffff", "padding": 0 }
}
JSON
) \
  -o /tmp/ticket-table.png \
  --size 986x120
```

## Optional: Base64 output only

```bash
node /Users/sorphwer/repos/json-render-cli/dist/cli.js -m "$MESSAGE_JSON" -c <(cat <<'JSON'
{ "version":1, "catalog":{"allowedComponents":["Container","Row","Column","Card","Heading","Text","Badge","Divider","Spacer","Button","Image"],"componentDefaults":{}}, "viewport":{"width":986,"height":120,"deviceScaleFactor":2}, "screenshot":{"type":"png","omitBackground":false}, "canvas":{"background":"#ffffff","padding":0} }
JSON
) -o stdout --size 986x120
```
