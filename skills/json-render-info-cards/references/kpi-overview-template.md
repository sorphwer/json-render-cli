# KPI Overview Template (No Temp JSON Files)

Render a one-row KPI dashboard with four metric cards and delta badges.

## 1) Fill values

```bash
export TITLE="Weekly Product Health"
export UPDATED_AT="Tue 11:45"

export M1_LABEL="Activation Rate"
export M1_VALUE="62.4%"
export M1_DELTA="+2.1%"

export M2_LABEL="Error-Free Sessions"
export M2_VALUE="98.7%"
export M2_DELTA="+0.4%"

export M3_LABEL="Avg Response Time"
export M3_VALUE="284ms"
export M3_DELTA="-16ms"

export M4_LABEL="Weekly Active Users"
export M4_VALUE="41,208"
export M4_DELTA="+5.8%"
export OUT_PATH="${OUT_PATH:-/tmp/kpi-overview.png}"

# Optional manual overrides:
export VIEWPORT_WIDTH="${VIEWPORT_WIDTH:-1032}"
export VIEWPORT_HEIGHT="${VIEWPORT_HEIGHT:-196}"

export SPEC_PATH="${SPEC_PATH:-/Users/sorphwer/repos/json-render-cli/skills/json-render-info-cards/references/kpi-overview-spec.template.json}"
```

## 2) Build message JSON in memory

```bash
MESSAGE_JSON="$(python3 - <<'PY'
import json, os, pathlib
p = pathlib.Path(os.environ["SPEC_PATH"])
tpl = p.read_text(encoding="utf-8")
m = {
  "__TITLE__": os.environ["TITLE"],
  "__UPDATED_AT__": os.environ["UPDATED_AT"],
  "__M1_LABEL__": os.environ["M1_LABEL"],
  "__M1_VALUE__": os.environ["M1_VALUE"],
  "__M1_DELTA__": os.environ["M1_DELTA"],
  "__M2_LABEL__": os.environ["M2_LABEL"],
  "__M2_VALUE__": os.environ["M2_VALUE"],
  "__M2_DELTA__": os.environ["M2_DELTA"],
  "__M3_LABEL__": os.environ["M3_LABEL"],
  "__M3_VALUE__": os.environ["M3_VALUE"],
  "__M3_DELTA__": os.environ["M3_DELTA"],
  "__M4_LABEL__": os.environ["M4_LABEL"],
  "__M4_VALUE__": os.environ["M4_VALUE"],
  "__M4_DELTA__": os.environ["M4_DELTA"],
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
  -c <(cat <<JSON
{
  "version": 1,
  "catalog": {
    "allowedComponents": ["Container", "Row", "Column", "Card", "Heading", "Text", "Badge", "Divider", "Spacer", "Button", "Image"],
    "componentDefaults": {}
  },
  "theme": { "mode": "system" },
  "viewport": { "width": ${VIEWPORT_WIDTH}, "height": ${VIEWPORT_HEIGHT}, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 16 }
}
JSON
) \
  -o "$OUT_PATH" \
  --size "${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}"
```

If this command is executed by a sub-agent, keep `"$OUT_PATH"` and let the main agent decide final cleanup.
