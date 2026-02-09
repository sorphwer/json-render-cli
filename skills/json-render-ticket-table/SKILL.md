---
name: json-render-ticket-table
description: Render compact head+body ticket status tables to PNG images with json-render-cli. Use when users ask to visualize issue or ticket data (ID, priority, status, assignee, update time, topic) as a clean table screenshot, including edge-to-edge and compact-width layouts.
---

# JSON Render Ticket Table

## Overview

Render ticket rows into a compact table image using `json-render-cli` components (`Column`, `Row`, `Container`, `Text`, `Badge`).
Reuse a fixed layout so output stays visually consistent across tickets.

## Workflow

1. Ensure `json-render-cli` is built.
2. Generate message JSON from template placeholders (no temp spec file creation).
3. Pass config via process substitution (`-c <(...)`) to avoid temp config files.
4. Render to PNG with tight `--size`.
5. Return output path (or Base64 when requested).

## Build And Render

Use the no-garbage template in `references/compact-ticket-template.md`.
Default output style:
- No title area
- Header + one body row
- Compact horizontal spacing
- Edge-to-edge screenshot

## Layout Rules

- Keep exactly 6 columns: `ID`, `优先级`, `状态`, `Assignee`, `更新时间`, `主题`.
- Keep header/body only unless the user explicitly asks for additional rows.
- Keep column widths compact and deterministic.
- Use `Badge` for priority and status.
- Use Chinese labels when the request is Chinese.

## Output Rules

- Prefer `-o /tmp/<name>.png` for image delivery.
- Use `-o stdout` only when caller explicitly asks for Base64.
- Avoid creating temporary JSON files unless user explicitly asks.

## Troubleshooting

- If Chromium is missing, run: `npx playwright install chromium`.
- If rendering is too wide, reduce `主题` width first.
- If rendering is too tall, reduce row paddings and `--size` height.
