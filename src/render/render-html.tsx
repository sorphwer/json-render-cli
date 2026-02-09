import { JSONUIProvider, Renderer } from "@json-render/react";
import { renderToStaticMarkup } from "react-dom/server";

import type { JsonRenderConfig, UISpec } from "../types";
import { BUILTIN_REGISTRY } from "./builtin-registry";

function escapeCss(value: string): string {
  return value.replace(/[\n\r;{}]/g, "").trim();
}

export function renderHtml(spec: UISpec, config: JsonRenderConfig): string {
  const appMarkup = renderToStaticMarkup(
    <JSONUIProvider registry={BUILTIN_REGISTRY}>
      <Renderer spec={spec} registry={BUILTIN_REGISTRY} />
    </JSONUIProvider>
  );

  const css = `
    :root {
      --jr-font-family: ${escapeCss(config.theme.fontFamily)};
      --jr-text: ${escapeCss(config.theme.textColor)};
      --jr-heading: ${escapeCss(config.theme.headingColor)};
      --jr-muted: ${escapeCss(config.theme.mutedTextColor)};
      --jr-card-bg: ${escapeCss(config.theme.cardBackground)};
      --jr-card-border: ${escapeCss(config.theme.cardBorderColor)};
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
      height: 100%;
      font-family: var(--jr-font-family);
      color: var(--jr-text);
      background: ${escapeCss(config.canvas.background)};
    }

    #app {
      width: 100%;
      height: 100%;
      padding: ${config.canvas.padding}px;
      display: flex;
      flex-direction: column;
      gap: var(--jr-spacing);
    }
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
