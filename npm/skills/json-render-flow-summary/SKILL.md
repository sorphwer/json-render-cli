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

1. Ensure `json-render` is available. If missing, run `npm i -g json-render-cli`; if Chromium is missing, run `npx playwright install chromium`.
2. Define ordered stages (name, state, and optional timestamp).
3. Compose a vertical timeline or horizontal step strip.
4. Use badges to indicate stage state (`DONE`, `IN PROGRESS`, `BLOCKED`).
5. Tune viewport width/height to the current content footprint before final render, and avoid oversized fixed `--size`.
6. Render PNG and adjust spacing so stage boundaries are visually clear.
7. Theme mode is configured with `theme.mode`; default to `system`, or pin to `light` / `dark` as needed.

## Agent Coordination

- Prefer rendering in the current (main) agent when the image must be delivered in the same turn.
- Delegate rendering to a sub-agent only when output-path handoff is explicit and deterministic.
- Keep rendered PNG files intact in sub-agent execution; do not delete or move them there.
- Perform garbage collection only in the main agent, and only after delivery succeeds.

## Layout Rules

- Keep stage order explicit from top-to-bottom or left-to-right.
- Use consistent spacing between stages.
- Separate stages with `Divider` or bordered containers.
- Keep per-stage text concise to avoid wrapping noise.
- Keep viewport width close to actual flow footprint and avoid large horizontal slack.
- Start from a compact viewport height and expand only when clipping appears.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only when explicitly requested.
- Set `screenshot.fullPage=true` when stage count is variable.
- If a sub-agent renders the PNG, return path only and skip cleanup in that sub-agent.
- Run final PNG cleanup only in the main agent after image delivery.
