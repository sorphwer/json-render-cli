---
name: json-render-table
description: Render compact generic data tables to PNG images with json-render-cli. Use when users ask to visualize arbitrary structured rows/columns (non-ticket-specific) as clean table screenshots with controllable layout.
---

# JSON Render Table

## Overview

Render generic structured data into compact table images using `json-render-cli` components (`Column`, `Row`, `Container`, `Text`, `Badge`).
Use this skill for non-ticket table needs. For ticket-focused output, use `json-render-ticket-table`.

## Workflow

1. Ensure `json-render-cli` is built.
2. Define target columns and row schema for the current dataset.
3. Generate message JSON in memory from a table template.
4. Pass config via process substitution (`-c <(...)`) to avoid temporary config files.
5. Set `screenshot.fullPage=true` when row count or line wrapping is variable.
6. Render PNG and return output path (or Base64 only when explicitly requested).

## Build And Render

Use `references/compact-table-template.md`.
Treat the included template as a starter and customize columns/widths per dataset.

Default style:
- No title area
- Compact header + body
- Edge-to-edge screenshot
- Stable column widths
- Bottom rows remain visible (`screenshot.fullPage=true`)

## Layout Rules

- Define columns with `Row + Container` and explicit widths.
- Keep spacing compact and deterministic.
- Use `Badge` only for categorical status-like fields.
- Resize the widest column first when content overflows.

## Output Rules

- Prefer `-o /tmp/<name>.png` for image delivery.
- Use `-o stdout` only when caller explicitly asks for Base64.
- Avoid temporary JSON files unless explicitly requested.

## Troubleshooting

- If Chromium is missing, run: `npx playwright install chromium`.
- If rendering is too wide, reduce wide columns or font size.
- If bottom rows are clipped, enable `screenshot.fullPage=true`.
