---
name: json-render-ticket-table
description: Render compact issue/ticket status tables to PNG images with json-render-cli. Use when users ask to visualize ticket fields (ID, priority, status, assignee, update time, topic) as a clean screenshot with stable column layout.
user-invocable: false
---

# JSON Render Ticket Table

## Overview

Render ticket rows into a compact table image using `json-render-cli` components (`Column`, `Row`, `Container`, `Text`, `Badge`).
Keep layout stable so repeated snapshots are visually consistent.

## Workflow

1. Ensure `json-render-cli` is built.
2. Generate message JSON in memory from template placeholders.
3. Pass config via process substitution (`-c <(...)`) to avoid temp config files.
4. Enable `screenshot.fullPage=true` when row count or text wrapping is variable.
5. Render PNG and return file path (or Base64 only when explicitly requested).
6. Theme mode is configured with `theme.mode`; keep `system` as default unless a fixed mode is requested.

## Model Routing

- If the current assistant model is high-cost (for example, Opus-class), prefer delegating straightforward ticket-table rendering to a lower-cost fast model (for example, `gemini3flash`). Keep the high-cost model for noisy inputs, schema ambiguity, and higher-level analysis.

## Build And Render

Use `references/compact-ticket-template.md`.
Use `references/compact-ticket-spec.template.json` as default ticket schema.

Default style:
- Header + body rows only (no title block)
- Compact spacing and fixed columns
- Edge-to-edge output
- No bottom clipping with `screenshot.fullPage=true`

## Layout Rules

- Keep standard six columns: `ID`, `Priority`, `Status`, `Assignee`, `Updated`, `Topic`.
- Use `Badge` for priority and status.
- Keep deterministic widths for stable snapshots.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only if caller explicitly wants Base64.
- Avoid writing temporary JSON files unless explicitly requested.

## Troubleshooting

- If Chromium is missing, run: `npx playwright install chromium`.
- If right side is cramped, increase topic column width first.
- If bottom rows are clipped, set `screenshot.fullPage=true`.
