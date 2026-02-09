import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { AppError } from "../src/errors";
import { loadConfig, parseSizeOverride } from "../src/config/load-config";

describe("config loader", () => {
  it("fills defaults and uses builtin components when allowedComponents is empty", () => {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), "json-render-config-"));

    try {
      const configPath = path.join(tmpDir, "config.json");
      writeFileSync(configPath, "{}", "utf8");

      const config = loadConfig(configPath, ["Container", "Text"]);

      expect(config.catalog.allowedComponents).toEqual(["Container", "Text"]);
      expect(config.viewport.width).toBe(1200);
      expect(config.screenshot.type).toBe("png");
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("rejects unknown components in allowedComponents", () => {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), "json-render-config-"));

    try {
      const configPath = path.join(tmpDir, "config.json");
      writeFileSync(configPath, JSON.stringify({ catalog: { allowedComponents: ["UnknownComponent"] } }), "utf8");

      expect(() => loadConfig(configPath, ["Container", "Text"])).toThrow(AppError);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("parses --size override", () => {
    expect(parseSizeOverride("1200x630")).toEqual({ width: 1200, height: 630 });
    expect(() => parseSizeOverride("foo")).toThrow(AppError);
  });
});
