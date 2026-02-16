---
name: json-render-announcement-cards
description: Render announcement-style cards to PNG images with json-render-cli. Use when users ask for hero banners, release announcements, profile highlights, or promotional card visuals.
user-invocable: false
---

# JSON Render Announcement Cards

## Overview

Render presentation-focused cards using `json-render-cli` components (`Container`, `Row`, `Column`, `Heading`, `Text`, `Badge`, `Button`, `Image`).
Use this skill for communication visuals rather than tabular data.

## Workflow

1. Ensure `json-render-cli` is built.
2. Define the card objective (announcement, hero, profile highlight).
3. Structure content blocks in this order: headline, supporting text, optional CTA/media.
4. Build message JSON directly (tree spec is often easiest for this category).
5. Tune viewport width/height to the current content footprint before final render, and avoid oversized fixed `--size`.
6. Render PNG and iterate on spacing/typography for readability.
7. Theme mode is configured with `theme.mode`; default to `system`, or force `light` / `dark` when required.

## Agent Coordination

- Prefer rendering in the current (main) agent when the image must be delivered in the same turn.
- Delegate rendering to a sub-agent only when output-path handoff is explicit and deterministic.
- Keep rendered PNG files intact in sub-agent execution; do not delete or move them there.
- Perform garbage collection only in the main agent, and only after delivery succeeds.

## Layout Rules

- Keep a single dominant headline.
- Limit supporting copy to 1-3 short lines.
- Use one focal accent element (badge, button, or image), not all three at once.
- Prefer generous padding and clear contrast for legibility.
- Keep viewport width close to card footprint and avoid large horizontal slack.
- Start from a compact viewport height and expand only when clipping appears.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only when explicitly requested.
- Keep dimensions explicit with `--size` for reproducible output.
- If a sub-agent renders the PNG, return path only and skip cleanup in that sub-agent.
- Run final PNG cleanup only in the main agent after image delivery.
