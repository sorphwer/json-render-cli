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
5. Render PNG and iterate on spacing/typography for readability.
6. Theme mode is configured with `theme.mode`; default to `system`, or force `light` / `dark` when required.

## Layout Rules

- Keep a single dominant headline.
- Limit supporting copy to 1-3 short lines.
- Use one focal accent element (badge, button, or image), not all three at once.
- Prefer generous padding and clear contrast for legibility.

## Output Rules

- Prefer `-o /tmp/<name>.png`.
- Use `-o stdout` only when explicitly requested.
- Keep dimensions explicit with `--size` for reproducible output.
