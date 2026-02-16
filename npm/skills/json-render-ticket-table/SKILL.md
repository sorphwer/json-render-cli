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

1. Ensure `json-render` is available. If missing, run `npm i -g json-render-cli`; if Chromium is missing, run `npx playwright install chromium`.
2. Generate message JSON in memory from template placeholders.
3. Pass config via process substitution (`-c <(...)`) to avoid temp config files.
4. Enable `screenshot.fullPage=true` when row count or text wrapping is variable.
5. Tune viewport width/height to the current content footprint before final render, and avoid oversized fixed `--size`.
6. Render PNG and return file path (or Base64 only when explicitly requested).
7. Theme mode is configured with `theme.mode`; keep `system` as default unless a fixed mode is requested.

## Agent Coordination

- Prefer rendering in the current (main) agent when the image must be delivered in the same turn.
- Delegate rendering to a sub-agent only when output-path handoff is explicit and deterministic.
- Keep rendered PNG files intact in sub-agent execution; do not delete or move them there.
- Perform garbage collection only in the main agent, and only after delivery succeeds.

## Model Routing

- If the current assistant model is high-cost (for example, Opus-class), prefer delegating straightforward ticket-table rendering to a lower-cost fast model (for example, `gemini3flash`) only when Agent Coordination rules can be enforced; otherwise render in the current main agent.

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
- Keep viewport width close to the table footprint and avoid large horizontal slack.
- Start from a compact viewport height and expand only when clipping appears.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only if caller explicitly wants Base64.
- Avoid writing temporary JSON files unless explicitly requested.
- If a sub-agent renders the PNG, return path only and skip cleanup in that sub-agent.
- Run final PNG cleanup only in the main agent after image delivery.

## Troubleshooting

- If Chromium is missing, run: `npx playwright install chromium`.
- If right side is cramped, increase topic column width first.
- If left/right whitespace is too large, decrease viewport width or topic column width and rerender.
- If top/bottom whitespace is too large, decrease viewport height and rerender.
- If bottom rows are clipped, set `screenshot.fullPage=true`.
