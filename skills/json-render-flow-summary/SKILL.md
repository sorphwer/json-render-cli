---
name: json-render-flow-summary
description: Render flow and timeline summary visuals to PNG images with json-render-cli. Use when users ask to present steps, stage progress, lifecycle snapshots, or timeline summaries.
user-invocable: false
---

# JSON Render Flow Summary

## Overview

Render process snapshots using `json-render-cli` components (`Column`, `Row`, `Container`, `Heading`, `Text`, `Badge`, `Divider`).
Use this skill for sequence-oriented communication (steps, phases, or timelines).

## Workflow

1. Ensure `json-render-cli` is built.
2. Define ordered stages (name, state, and optional timestamp).
3. Compose a vertical timeline or horizontal step strip.
4. Use badges to indicate stage state (`DONE`, `IN PROGRESS`, `BLOCKED`).
5. Render PNG and adjust spacing so stage boundaries are visually clear.
6. Theme mode is configured with `theme.mode`; default to `system`, or pin to `light` / `dark` as needed.

## Layout Rules

- Keep stage order explicit from top-to-bottom or left-to-right.
- Use consistent spacing between stages.
- Separate stages with `Divider` or bordered containers.
- Keep per-stage text concise to avoid wrapping noise.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only when explicitly requested.
- Set `screenshot.fullPage=true` when stage count is variable.
