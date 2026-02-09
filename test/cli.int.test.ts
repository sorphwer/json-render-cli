import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { chromium } from "playwright";
import { describe, expect, it, vi } from "vitest";

import { run } from "../src/run";

const configPath = path.resolve(process.cwd(), "config.json");
const hasChromiumBinary = existsSync(chromium.executablePath());

describe("run integration", () => {
  it("fails with code 1 for invalid JSON in -m", async () => {
    await expect(
      run({
        message: "{invalid}",
        configPath,
        output: "stdout"
      })
    ).rejects.toMatchObject({ code: 1 });
  });

  it("fails with code 1 for schema mismatch", async () => {
    await expect(
      run({
        message: JSON.stringify({ foo: "bar" }),
        configPath,
        output: "stdout"
      })
    ).rejects.toMatchObject({ code: 1 });
  });

  const itIfChromium = hasChromiumBinary ? it : it.skip;

  itIfChromium("renders a valid PNG file", async () => {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), "json-render-cli-"));
    let writeSpy: ReturnType<typeof vi.spyOn> | undefined;

    try {
      writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      const outputPath = path.join(tmpDir, "render.png");
      const message = {
        root: "root",
        elements: {
          root: {
            type: "Container",
            props: { height: "100%", justify: "center" },
            children: ["card"]
          },
          card: {
            type: "Card",
            props: { width: "100%" },
            children: ["title", "desc"]
          },
          title: {
            type: "Heading",
            props: { text: "Smoke test", level: 2 }
          },
          desc: {
            type: "Text",
            props: { text: "PNG generation works." }
          }
        }
      };

      await run({
        message: JSON.stringify(message),
        configPath,
        output: outputPath,
        size: "640x360"
      });

      const bytes = readFileSync(outputPath);

      expect(bytes.length).toBeGreaterThan(1000);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    } finally {
      writeSpy?.mockRestore();
      rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30_000);
});
