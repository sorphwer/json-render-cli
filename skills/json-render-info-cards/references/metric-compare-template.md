# Metric Comparison Template (No Temp JSON Files)

Render two side-by-side comparison panels with three shared rows.

## 1) Fill values

```bash
export TITLE="Checkout Performance Comparison"
export LEFT_TITLE="Current Week"
export RIGHT_TITLE="Previous Week"
export UPDATED_AT="Tue 11:58"

export R1_LABEL="Conversion Rate"
export R1_LEFT="4.8%"
export R1_RIGHT="4.2%"

export R2_LABEL="Average Latency"
export R2_LEFT="284ms"
export R2_RIGHT="316ms"

export R3_LABEL="Failed Payments"
export R3_LEFT="0.37%"
export R3_RIGHT="0.52%"

export SPEC_PATH="${SPEC_PATH:-/Users/sorphwer/repos/json-render-cli/skills/json-render-info-cards/references/metric-compare-spec.template.json}"
```

## 2) Build message JSON in memory

```bash
MESSAGE_JSON="$(python3 - <<'PY'
import json, os, pathlib
p = pathlib.Path(os.environ["SPEC_PATH"])
tpl = p.read_text(encoding="utf-8")
m = {
  "__TITLE__": os.environ["TITLE"],
  "__LEFT_TITLE__": os.environ["LEFT_TITLE"],
  "__RIGHT_TITLE__": os.environ["RIGHT_TITLE"],
  "__UPDATED_AT__": os.environ["UPDATED_AT"],
  "__R1_LABEL__": os.environ["R1_LABEL"],
  "__R1_LEFT__": os.environ["R1_LEFT"],
  "__R1_RIGHT__": os.environ["R1_RIGHT"],
  "__R2_LABEL__": os.environ["R2_LABEL"],
  "__R2_LEFT__": os.environ["R2_LEFT"],
  "__R2_RIGHT__": os.environ["R2_RIGHT"],
  "__R3_LABEL__": os.environ["R3_LABEL"],
  "__R3_LEFT__": os.environ["R3_LEFT"],
  "__R3_RIGHT__": os.environ["R3_RIGHT"],
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
  "viewport": { "width": 1040, "height": 310, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 12 }
}
JSON
) \
  -o /tmp/metric-compare.png \
  --size 1040x310
```
