import { describe, expect, it } from "vitest";

import { renderHtml } from "../src/render/render-html";
import type { JsonRenderConfig, UISpec } from "../src/types";

function makeSpec(): UISpec {
  return {
    root: "root",
    elements: {
      root: {
        type: "Container",
        props: {},
        children: ["title"]
      },
      title: {
        type: "Text",
        props: { text: "Theme test" }
      }
    }
  };
}

function makeConfig(mode: "light" | "dark" | "system"): JsonRenderConfig {
  return {
    version: 1,
    catalog: {
      allowedComponents: [],
      componentDefaults: {}
    },
    theme: {
      mode,
      fontFamily: "sans-serif",
      textColor: "#111111",
      headingColor: "#222222",
      mutedTextColor: "#333333",
      cardBackground: "#ffffff",
      cardBorderColor: "#dddddd",
      dark: {
        textColor: "#eeeeee",
        headingColor: "#fafafa",
        mutedTextColor: "#aaaaaa",
        cardBackground: "#111111",
        cardBorderColor: "#444444",
        canvasBackground: "#000000"
      },
      borderRadius: 8,
      spacing: 8
    },
    viewport: {
      width: 640,
      height: 360,
      deviceScaleFactor: 1
    },
    screenshot: {
      type: "png",
      omitBackground: false,
      fullPage: false
    },
    canvas: {
      background: "#f8fafc",
      padding: 0
    }
  };
}

describe("renderHtml theme mode", () => {
  it("renders system mode with prefers-color-scheme media query", () => {
    const html = renderHtml(makeSpec(), makeConfig("system"));

    expect(html).toContain("color-scheme: light dark");
    expect(html).toContain("@media (prefers-color-scheme: dark)");
    expect(html).toContain("--jr-canvas-bg: #000000;");
  });

  it("renders dark mode with fixed dark color-scheme", () => {
    const html = renderHtml(makeSpec(), makeConfig("dark"));

    expect(html).toContain("color-scheme: dark");
    expect(html).not.toContain("@media (prefers-color-scheme: dark)");
    expect(html).toContain("--jr-text: #eeeeee;");
  });

  it("renders light mode with fixed light color-scheme", () => {
    const html = renderHtml(makeSpec(), makeConfig("light"));

    expect(html).toContain("color-scheme: light");
    expect(html).not.toContain("@media (prefers-color-scheme: dark)");
    expect(html).toContain("--jr-canvas-bg: #f8fafc;");
  });
});
