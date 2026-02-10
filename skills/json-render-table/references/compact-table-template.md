# Compact Generic Table Template (No Temp JSON Files)

Use this as a generic starter template. Customize columns, widths, and row mappings for your dataset.

## 1) Define dataset-specific values

Define variables for your own columns/rows (example below uses 4 columns):

```bash
export C1_HEADER="Name"
export C2_HEADER="Region"
export C3_HEADER="Status"
export C4_HEADER="Notes"

export R1_C1="Service A"
export R1_C2="us-east-1"
export R1_C3="active"
export R1_C4="Healthy"
```

## 2) Build `-m` JSON in memory

Create JSON in memory (or reuse your own templating approach), then assign to `MESSAGE_JSON`.

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
  "viewport": { "width": 1000, "height": 140, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 0 }
}
JSON
) \
  -o /tmp/table-render.png
```

For ticket-focused output with predefined six columns and badges, use `json-render-ticket-table`.
