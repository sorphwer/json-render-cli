# Daily Summary Card Template (No Temp JSON Files)

Render a single summary card with key highlights and a short narrative.

## 1) Fill values

```bash
export TITLE="Daily Platform Summary"
export KEY_1="Requests: 1.94M"
export KEY_2="Success Rate: 99.92%"
export KEY_3="P95 Latency: 287ms"
export SUMMARY="Traffic increased 6.3% day-over-day with stable latency. Error volume stayed flat, and no customer-facing incidents were recorded."
export UPDATED_AT="Tue 18:10"

export SPEC_PATH="${SPEC_PATH:-/Users/sorphwer/repos/json-render-cli/skills/json-render-info-cards/references/daily-summary-spec.template.json}"
```

## 2) Build message JSON in memory

```bash
MESSAGE_JSON="$(python3 - <<'PY'
import json, os, pathlib
p = pathlib.Path(os.environ["SPEC_PATH"])
tpl = p.read_text(encoding="utf-8")
m = {
  "__TITLE__": os.environ["TITLE"],
  "__KEY_1__": os.environ["KEY_1"],
  "__KEY_2__": os.environ["KEY_2"],
  "__KEY_3__": os.environ["KEY_3"],
  "__SUMMARY__": os.environ["SUMMARY"],
  "__UPDATED_AT__": os.environ["UPDATED_AT"],
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
  "viewport": { "width": 1024, "height": 270, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 12 }
}
JSON
) \
  -o /tmp/daily-summary.png \
  --size 1024x270
```
