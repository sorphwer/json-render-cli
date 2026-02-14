import { JSONUIProvider, Renderer } from "@json-render/react";
import { renderToStaticMarkup } from "react-dom/server";

import type { JsonRenderConfig, UISpec } from "../types";
import { BUILTIN_REGISTRY } from "./builtin-registry";

function escapeCss(value: string): string {
  return value.replace(/[\n\r;{}]/g, "").trim();
}

function getThemeModeCss(config: JsonRenderConfig): string {
  const mode = config.theme.mode;
  const darkVars = `
    --jr-text: ${escapeCss(config.theme.dark.textColor)};
    --jr-heading: ${escapeCss(config.theme.dark.headingColor)};
    --jr-muted: ${escapeCss(config.theme.dark.mutedTextColor)};
    --jr-card-bg: ${escapeCss(config.theme.dark.cardBackground)};
    --jr-card-border: ${escapeCss(config.theme.dark.cardBorderColor)};
    --jr-canvas-bg: ${escapeCss(config.theme.dark.canvasBackground)};
  `;

  if (mode === "light") {
    return `
      html { color-scheme: light; }
    `;
  }

  if (mode === "dark") {
    return `
      :root { ${darkVars} }
      html { color-scheme: dark; }
    `;
  }

  return `
    html { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      :root { ${darkVars} }
      html { color-scheme: dark; }
    }
  `;
}

export function renderHtml(spec: UISpec, config: JsonRenderConfig): string {
  const appMarkup = renderToStaticMarkup(
    <JSONUIProvider registry={BUILTIN_REGISTRY}>
      <Renderer spec={spec} registry={BUILTIN_REGISTRY} />
    </JSONUIProvider>
  );

  const usesAdaptiveHeight = config.screenshot.fullPage;
  const rootHeight = usesAdaptiveHeight ? "auto" : "100%";
  const appHeight = usesAdaptiveHeight ? "auto" : "100%";
  const appMinHeight = usesAdaptiveHeight ? "0" : "100%";

  const css = `
    :root {
      --jr-font-family: ${escapeCss(config.theme.fontFamily)};
      --jr-text: ${escapeCss(config.theme.textColor)};
      --jr-heading: ${escapeCss(config.theme.headingColor)};
      --jr-muted: ${escapeCss(config.theme.mutedTextColor)};
      --jr-card-bg: ${escapeCss(config.theme.cardBackground)};
      --jr-card-border: ${escapeCss(config.theme.cardBorderColor)};
      --jr-canvas-bg: ${escapeCss(config.canvas.background)};
      --jr-radius: ${config.theme.borderRadius}px;
      --jr-spacing: ${config.theme.spacing}px;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      width: 100%;
      height: ${rootHeight};
      font-family: var(--jr-font-family);
      color: var(--jr-text);
      background: var(--jr-canvas-bg);
    }

    #app {
      width: 100%;
      min-height: ${appMinHeight};
      height: ${appHeight};
      padding: ${config.canvas.padding}px;
      display: flex;
      flex-direction: column;
      gap: var(--jr-spacing);
    }

    ${getThemeModeCss(config)}
  `;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css}</style>
  </head>
  <body>
    <div id="app">${appMarkup}</div>
  </body>
</html>`;
}
