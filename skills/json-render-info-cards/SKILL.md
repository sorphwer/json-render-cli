---
name: json-render-info-cards
description: Render compact information cards to PNG images with json-render-cli. Use when users ask for KPI snapshots, metric comparisons, or daily summary cards (non-table layouts).
user-invocable: false
---

# JSON Render Info Cards

## Overview

Render non-table information cards using `json-render-cli` components (`Container`, `Row`, `Column`, `Heading`, `Text`, `Badge`, `Divider`).
Use this skill for snapshot-style KPI and summary visuals.

## Use Case Selection

- KPI overview (four metric cards): use `references/kpi-overview-template.md`.
- Metric comparison (left/right panels): use `references/metric-compare-template.md`.
- Daily summary card (headline + key highlights): use `references/daily-summary-template.md`.

## Workflow

1. Ensure `json-render-cli` is built.
2. Select the closest reference template.
3. Fill template placeholders with dataset-specific values.
4. Build message JSON in memory from placeholder substitutions.
5. Pass config via process substitution (`-c <(...)`) to avoid temporary config files.
6. Tune viewport width/height to the current content footprint before final render, and avoid oversized fixed `--size`.
7. Render PNG to a file path (or Base64 only when explicitly requested).
8. Theme mode is configured with `theme.mode`; default to `system`, or set `light` / `dark` for fixed output.

## Agent Coordination

- Prefer rendering in the current (main) agent when the image must be delivered in the same turn.
- Delegate rendering to a sub-agent only when output-path handoff is explicit and deterministic.
- Keep rendered PNG files intact in sub-agent execution; do not delete or move them there.
- Perform garbage collection only in the main agent, and only after delivery succeeds.

## Layout Rules

- Keep hierarchy obvious: title -> key metrics -> context text.
- Use `Badge` for compact status or delta values.
- Keep spacing deterministic for comparable snapshots.
- If content grows unexpectedly, increase viewport height first, then reduce font size.
- Keep viewport width close to the card footprint and avoid large horizontal slack.
- Start from a compact viewport height and expand only when clipping appears.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only when explicitly requested.
- Avoid temporary JSON files unless explicitly requested.
- If a sub-agent renders the PNG, return path only and skip cleanup in that sub-agent.
- Run final PNG cleanup only in the main agent after image delivery.

## Troubleshooting

- If Chromium is missing, run: `npx playwright install chromium`.
- If cards feel cramped, increase `viewport.width` before reducing content.
- If left/right whitespace is too large, reduce viewport width and rerender.
- If top/bottom whitespace is too large, reduce viewport height and rerender.
- If bottom content clips, set `screenshot.fullPage=true`.
