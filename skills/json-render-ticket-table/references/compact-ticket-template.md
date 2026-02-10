# Compact Ticket Table Command Template (No Temp JSON Files)

## 1) Fill values

```bash
export ID="#1236"
export PRIORITY="HIGH"
export STATUS="OPEN"
export ASSIGNEE="Riino"
export UPDATED_AT="Mon 14:34"
export TOPIC="plugin-daemon Redis connectivity issue"
export SPEC_PATH="${SPEC_PATH:-/Users/sorphwer/repos/json-render-cli/skills/json-render-ticket-table/references/compact-ticket-spec.template.json}"
```

## 2) Build message JSON in memory

```bash
MESSAGE_JSON="$(python3 - <<'PY'
import json, pathlib, os
p = pathlib.Path(os.environ["SPEC_PATH"])
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

## 3) Render

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
  "theme": { "mode": "system" },
  "viewport": { "width": 986, "height": 120, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 0 }
}
JSON
) \
  -o /tmp/ticket-table.png \
  --size 986x120
```
