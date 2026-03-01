# Compact Ticket List Table Command Template (Multi-Row)

Use this when you need a ticket table with multiple rows and stable rendering for mixed CJK/Latin text.

## 1) Fill values

```bash
export ROWS_JSON='[
  {"ID": "1395", "Priority": "high", "Status": "pending", "Assignee": "Yiliazhang", "Updated (UTC)": "2026-02-28 07:52:09", "Subject": "帮确认下插件基础镜像安装tiktoken 这个dockerfile没问题吧"},
  {"ID": "1394", "Priority": "low", "Status": "solved", "Assignee": "Zishuo", "Updated (UTC)": "2026-02-28 04:13:31", "Subject": "后台管理 -凭据管理"}
]'

export OUT_PATH="${OUT_PATH:-/tmp/ticket-list-table.png}"
export THEME_MODE="${THEME_MODE:-system}"

# Optional color palette overrides (JSON object; key -> {background,color})
# export PRIORITY_PALETTE_JSON='{"high":{"background":"#fee2e2","color":"#991b1b"}}'
# export STATUS_PALETTE_JSON='{"pending":{"background":"#fef3c7","color":"#92400e"}}'

# Optional deterministic snapshot check in current environment.
# 1 = render twice and compare hashes
# export RUN_SNAPSHOT_CHECK="1"
# Optional baseline compare path (after two-render hash passes)
# export SNAPSHOT_BASELINE_PATH="/tmp/ticket-list-baseline.png"
```

```bash
if ! command -v json-render >/dev/null 2>&1; then
  npm i -g json-render-cli
fi
export JSON_RENDER_CMD="${JSON_RENDER_CMD:-json-render}"

if [ -z "${SPEC_PATH:-}" ]; then
  for candidate in \
    "${CODEX_HOME:-$HOME/.codex}/skills/use-json-render-cli/references/compact-ticket-list-spec.template.json" \
    "./npm/skills/use-json-render-cli/references/compact-ticket-list-spec.template.json" \
    "./skills/use-json-render-cli/references/compact-ticket-list-spec.template.json"
  do
    if [ -f "$candidate" ]; then
      export SPEC_PATH="$candidate"
      break
    fi
  done
fi
if [ -z "${SPEC_PATH:-}" ] || [ ! -f "$SPEC_PATH" ]; then
  echo "Cannot find compact-ticket-list-spec.template.json. Set SPEC_PATH explicitly." >&2
  exit 1
fi

# Faster Playwright preflight: check cache folders first.
need_chromium=1
for cache_dir in \
  "${PLAYWRIGHT_BROWSERS_PATH:-}" \
  "${XDG_CACHE_HOME:-$HOME/.cache}/ms-playwright" \
  "$HOME/Library/Caches/ms-playwright"
do
  if [ -n "$cache_dir" ] && ls "$cache_dir"/chromium-* >/dev/null 2>&1; then
    need_chromium=0
    break
  fi
done

if [ "$need_chromium" -eq 1 ]; then
  PW_CHROMIUM_DIR="$((npx --yes playwright install --dry-run chromium 2>/dev/null || true) \
    | awk -F': +' '/chromium v/ { seen=1 } seen && /Install location:/ { print $2; exit }')"
  if [ -z "${PW_CHROMIUM_DIR:-}" ] || [ ! -d "$PW_CHROMIUM_DIR" ]; then
    npx --yes playwright install chromium
  fi
fi
```

## 2) Build message JSON in memory (with aliases, validation, and CJK-aware sizing)

```bash
eval "$(python3 - <<'PY'
import base64
import json
import math
import os
import pathlib
import re
import unicodedata


def normalize_key(value):
    return re.sub(r"[^a-z0-9]+", "", str(value).strip().lower())


def cjk_units(text):
    total = 0
    for ch in str(text):
        if ch == "\t":
            total += 4
            continue
        total += 2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1
    return max(total, 1)


def merge_palette(defaults, override_text):
    out = {str(k).lower(): v for k, v in defaults.items()}
    if not override_text:
        return out
    override = json.loads(override_text)
    if not isinstance(override, dict):
        raise ValueError("Palette override must be a JSON object")
    for key, value in override.items():
        if not isinstance(value, dict) or "background" not in value or "color" not in value:
            raise ValueError(
                f"Palette override for '{key}' must contain background and color fields"
            )
        out[str(key).lower()] = {
            "background": str(value["background"]),
            "color": str(value["color"]),
        }
    return out


def palette_for(mapping, raw_key):
    key = normalize_key(raw_key)
    return mapping.get(key) or mapping.get(str(raw_key).lower()) or mapping.get(
        "default", {"background": "#e2e8f0", "color": "#334155"}
    )


spec = json.loads(pathlib.Path(os.environ["SPEC_PATH"]).read_text(encoding="utf-8"))
rows = json.loads(os.environ["ROWS_JSON"])

if not isinstance(rows, list) or not rows:
    raise ValueError("ROWS_JSON must be a non-empty JSON array")

aliases = spec["aliases"]
required_fields = ["id", "priority", "status", "assignee", "updated", "subject"]

alias_index = {}
for canonical in required_fields:
    keys = {normalize_key(canonical)}
    for alias in aliases.get(canonical, []):
        keys.add(normalize_key(alias))
    alias_index[canonical] = keys

alias_index["updated"].update(
    {normalize_key("Updated (UTC)"), normalize_key("Updated UTC")}
)
alias_index["subject"].update({normalize_key("Topic"), normalize_key("Title")})

normalized_rows = []
errors = []

for i, row in enumerate(rows, start=1):
    if not isinstance(row, dict):
        errors.append(f"row {i}: item must be a JSON object")
        continue

    normalized = {}
    row_items = list(row.items())

    for field in required_fields:
        value = None
        for key, raw_value in row_items:
            if normalize_key(key) in alias_index[field]:
                value = raw_value
                break

        if value is None or str(value).strip() == "":
            errors.append(f"row {i}: missing required field `{field}`")
            continue

        compact = re.sub(r"\\s+", " ", str(value)).strip()
        normalized[field] = compact

    if len(normalized) == len(required_fields):
        normalized_rows.append(normalized)

if errors:
    raise ValueError("Input validation failed:\n- " + "\n- ".join(errors))

columns = spec["columns"]
text_cfg = spec["text"]
style = spec["style"]

subject_cfg = columns["subject"]
subject_min = int(subject_cfg.get("minWidth", 360))
subject_max = int(subject_cfg.get("maxWidth", 960))
subject_unit_px = int(subject_cfg.get("unitPx", 8))
subject_padding = int(subject_cfg.get("paddingPx", 48))
min_units_per_line = int(subject_cfg.get("minUnitsPerLine", 22))

max_subject_lines = int(text_cfg.get("maxSubjectLines", 3))
row_line_height = int(text_cfg.get("rowLineHeight", 22))
row_padding_y = int(text_cfg.get("rowPaddingY", 12))
header_padding_y = int(text_cfg.get("headerPaddingY", 10))

subject_max_units = max(cjk_units(row["subject"]) for row in normalized_rows)
subject_width = max(
    subject_min, min(subject_max, subject_max_units * subject_unit_px + subject_padding)
)
units_per_line = max(min_units_per_line, (subject_width - 24) // max(subject_unit_px, 1))

subject_lines = [
    max(1, min(max_subject_lines, math.ceil(cjk_units(row["subject"]) / units_per_line)))
    for row in normalized_rows
]
row_heights = [row_padding_y * 2 + row_line_height * n for n in subject_lines]
header_height = header_padding_y * 2 + row_line_height

fixed_width = (
    int(columns["id"]["width"])
    + int(columns["priority"]["width"])
    + int(columns["status"]["width"])
    + int(columns["assignee"]["width"])
    + int(columns["updated"]["width"])
)
viewport_width = fixed_width + subject_width + 2
viewport_height = max(180, min(560, header_height + sum(row_heights[:10]) + 8))

priority_palette = merge_palette(
    spec["priorityPalette"], os.environ.get("PRIORITY_PALETTE_JSON", "").strip()
)
status_palette = merge_palette(
    spec["statusPalette"], os.environ.get("STATUS_PALETTE_JSON", "").strip()
)

header_size = int(text_cfg.get("headerSize", 13))
cell_size = int(text_cfg.get("cellSize", 14))
badge_size = int(text_cfg.get("badgeSize", 11))

els = {
    "root": {
        "type": "Column",
        "props": {"align": "flex-start", "gap": 0},
        "children": ["table"],
    },
    "table": {
        "type": "Column",
        "props": {
            "gap": 0,
            "style": {
                "border": f"1px solid {style['tableBorder']}",
                "background": "#ffffff",
            },
        },
        "children": ["headerRow"],
    },
    "headerRow": {
        "type": "Row",
        "props": {
            "gap": 0,
            "style": {
                "background": style["headerBackground"],
                "borderBottom": f"1px solid {style['tableBorder']}",
            },
        },
        "children": ["hId", "hPri", "hStat", "hOwner", "hTime", "hSubject"],
    },
}

headers = [
    ("hId", columns["id"]["title"], int(columns["id"]["width"]), True),
    (
        "hPri",
        columns["priority"]["title"],
        int(columns["priority"]["width"]),
        True,
    ),
    ("hStat", columns["status"]["title"], int(columns["status"]["width"]), True),
    (
        "hOwner",
        columns["assignee"]["title"],
        int(columns["assignee"]["width"]),
        True,
    ),
    (
        "hTime",
        columns["updated"]["title"],
        int(columns["updated"]["width"]),
        True,
    ),
    ("hSubject", columns["subject"]["title"], subject_width, False),
]

for key, text, width, with_right_border in headers:
    text_key = f"{key}Text"
    style_map = {"borderRight": f"1px solid {style['rowDivider']}"} if with_right_border else {}
    els[key] = {
        "type": "Container",
        "props": {
            "width": width,
            "padding": f"{header_padding_y}px 12px",
            "style": style_map,
        },
        "children": [text_key],
    }
    els[text_key] = {
        "type": "Text",
        "props": {
            "text": text,
            "size": header_size,
            "weight": 700,
            "color": style["headerText"],
        },
    }

for idx, row in enumerate(normalized_rows):
    row_key = f"row{idx}"
    row_height = row_heights[idx]

    els[row_key] = {
        "type": "Row",
        "props": {
            "gap": 0,
            "style": {
                "background": "#ffffff",
                "borderTop": f"1px solid {style['rowDivider']}",
            },
        },
        "children": [
            f"cId{idx}",
            f"cPri{idx}",
            f"cStat{idx}",
            f"cOwner{idx}",
            f"cTime{idx}",
            f"cSubject{idx}",
        ],
    }
    els["table"]["children"].append(row_key)

    def add_cell(cell_key, width, child_key, with_right_border=True):
        style_map = {"borderRight": f"1px solid {style['rowDivider']}"} if with_right_border else {}
        els[cell_key] = {
            "type": "Container",
            "props": {
                "width": width,
                "padding": f"{row_padding_y}px 12px",
                "minHeight": row_height,
                "style": style_map,
            },
            "children": [child_key],
        }

    add_cell(f"cId{idx}", int(columns["id"]["width"]), f"idText{idx}")
    els[f"idText{idx}"] = {
        "type": "Text",
        "props": {"text": row["id"], "size": cell_size, "weight": 700, "color": style["cellText"]},
    }

    pri = palette_for(priority_palette, row["priority"])
    add_cell(f"cPri{idx}", int(columns["priority"]["width"]), f"priBadge{idx}")
    els[f"priBadge{idx}"] = {
        "type": "Badge",
        "props": {
            "text": row["priority"],
            "background": pri["background"],
            "color": pri["color"],
            "padding": "4px 10px",
            "size": badge_size,
            "weight": 700,
        },
    }

    sta = palette_for(status_palette, row["status"])
    add_cell(f"cStat{idx}", int(columns["status"]["width"]), f"statBadge{idx}")
    els[f"statBadge{idx}"] = {
        "type": "Badge",
        "props": {
            "text": row["status"],
            "background": sta["background"],
            "color": sta["color"],
            "padding": "4px 10px",
            "size": badge_size,
            "weight": 700,
        },
    }

    add_cell(f"cOwner{idx}", int(columns["assignee"]["width"]), f"ownerText{idx}")
    els[f"ownerText{idx}"] = {
        "type": "Text",
        "props": {
            "text": row["assignee"],
            "size": cell_size,
            "weight": 600,
            "color": style["cellText"],
        },
    }

    add_cell(f"cTime{idx}", int(columns["updated"]["width"]), f"timeText{idx}")
    els[f"timeText{idx}"] = {
        "type": "Text",
        "props": {"text": row["updated"], "size": cell_size, "color": style["mutedText"]},
    }

    add_cell(f"cSubject{idx}", subject_width, f"subjectText{idx}", with_right_border=False)
    els[f"subjectText{idx}"] = {
        "type": "Text",
        "props": {
            "text": row["subject"],
            "size": cell_size,
            "weight": 500,
            "color": style["cellText"],
        },
    }

payload = base64.b64encode(
    json.dumps({"root": "root", "elements": els}, ensure_ascii=False).encode("utf-8")
).decode("ascii")

print(f"export VIEWPORT_WIDTH={int(viewport_width)}")
print(f"export VIEWPORT_HEIGHT={int(viewport_height)}")
print(f"export MESSAGE_JSON_B64='{payload}'")
PY
)"

MESSAGE_JSON="$(python3 - <<'PY'
import base64
import os

print(base64.b64decode(os.environ["MESSAGE_JSON_B64"]).decode("utf-8"))
PY
)"
```

## 3) Render

```bash
render_png() {
  local out_path="$1"
  "$JSON_RENDER_CMD" \
    -m "$MESSAGE_JSON" \
    -c <(cat <<JSON
{
  "version": 1,
  "catalog": {
    "allowedComponents": ["Container", "Row", "Column", "Card", "Heading", "Text", "Badge", "Divider", "Spacer", "Button", "Image"],
    "componentDefaults": {}
  },
  "theme": { "mode": "${THEME_MODE}" },
  "viewport": { "width": ${VIEWPORT_WIDTH}, "height": ${VIEWPORT_HEIGHT}, "deviceScaleFactor": 2 },
  "screenshot": { "type": "png", "omitBackground": false, "fullPage": true },
  "canvas": { "background": "#ffffff", "padding": 0 }
}
JSON
) \
    -o "$out_path" \
    --size "${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}"
}

render_png "$OUT_PATH"
```

## 4) Optional snapshot stability check

```bash
if [ "${RUN_SNAPSHOT_CHECK:-0}" = "1" ]; then
  hash_file() {
    if command -v shasum >/dev/null 2>&1; then
      shasum -a 256 "$1" | awk '{print $1}'
    elif command -v sha256sum >/dev/null 2>&1; then
      sha256sum "$1" | awk '{print $1}'
    else
      python3 - <<'PY' "$1"
import hashlib
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
print(hashlib.sha256(path.read_bytes()).hexdigest())
PY
    fi
  }

  snap_a="$(mktemp /tmp/ticket-list-snap-a.XXXXXX.png)"
  snap_b="$(mktemp /tmp/ticket-list-snap-b.XXXXXX.png)"

  render_png "$snap_a"
  render_png "$snap_b"

  hash_a="$(hash_file "$snap_a")"
  hash_b="$(hash_file "$snap_b")"

  if [ "$hash_a" != "$hash_b" ]; then
    echo "Snapshot mismatch between two consecutive renders: $hash_a vs $hash_b" >&2
    exit 1
  fi

  if [ -n "${SNAPSHOT_BASELINE_PATH:-}" ]; then
    if [ ! -f "$SNAPSHOT_BASELINE_PATH" ]; then
      echo "SNAPSHOT_BASELINE_PATH does not exist: $SNAPSHOT_BASELINE_PATH" >&2
      exit 1
    fi
    baseline_hash="$(hash_file "$SNAPSHOT_BASELINE_PATH")"
    if [ "$hash_a" != "$baseline_hash" ]; then
      echo "Snapshot differs from baseline: current=$hash_a baseline=$baseline_hash" >&2
      exit 1
    fi
  fi

  rm -f "$snap_a" "$snap_b"
fi
```

If this command is executed by a sub-agent, keep `"$OUT_PATH"` and let the main agent decide final cleanup.
