import { describe, expect, it, vi, beforeEach } from "vitest";

const { launchMock } = vi.hoisted(() => ({
  launchMock: vi.fn()
}));

vi.mock("playwright", () => ({
  chromium: {
    launch: launchMock
  }
}));

import { AppError } from "../src/errors";
import { captureScreenshot } from "../src/render/screenshot";

function makeConfig() {
  return {
    version: 1 as const,
    catalog: {
      allowedComponents: [],
      componentDefaults: {}
    },
    theme: {
      fontFamily: "sans-serif",
      textColor: "#111",
      headingColor: "#111",
      mutedTextColor: "#666",
      cardBackground: "#fff",
      cardBorderColor: "#ddd",
      borderRadius: 8,
      spacing: 8
    },
    viewport: {
      width: 300,
      height: 120,
      deviceScaleFactor: 1
    },
    screenshot: {
      type: "png" as const,
      omitBackground: false,
      fullPage: false
    },
    canvas: {
      background: "#fff",
      padding: 0
    }
  };
}

describe("captureScreenshot cleanup", () => {
  beforeEach(() => {
    launchMock.mockReset();
  });

  it("closes page/context/browser on success", async () => {
    const page = {
      setContent: vi.fn().mockResolvedValue(undefined),
      screenshot: vi.fn().mockResolvedValue(Uint8Array.from([137, 80, 78, 71])),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const context = {
      newPage: vi.fn().mockResolvedValue(page),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const browser = {
      newContext: vi.fn().mockResolvedValue(context),
      close: vi.fn().mockResolvedValue(undefined)
    };

    launchMock.mockResolvedValue(browser);

    const buffer = await captureScreenshot("<html></html>", makeConfig());

    expect(buffer.toString("hex")).toBe("89504e47");
    expect(page.screenshot).toHaveBeenCalledWith({
      type: "png",
      omitBackground: false,
      fullPage: false
    });
    expect(page.close).toHaveBeenCalledTimes(1);
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it("forwards fullPage=true to Playwright screenshot options", async () => {
    const page = {
      setContent: vi.fn().mockResolvedValue(undefined),
      screenshot: vi.fn().mockResolvedValue(Uint8Array.from([137, 80, 78, 71])),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const context = {
      newPage: vi.fn().mockResolvedValue(page),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const browser = {
      newContext: vi.fn().mockResolvedValue(context),
      close: vi.fn().mockResolvedValue(undefined)
    };

    launchMock.mockResolvedValue(browser);
    const config = makeConfig();
    config.screenshot.fullPage = true;

    await captureScreenshot("<html></html>", config);

    expect(page.screenshot).toHaveBeenCalledWith({
      type: "png",
      omitBackground: false,
      fullPage: true
    });
  });

  it("still closes resources when screenshot fails", async () => {
    const page = {
      setContent: vi.fn().mockResolvedValue(undefined),
      screenshot: vi.fn().mockRejectedValue(new Error("boom")),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const context = {
      newPage: vi.fn().mockResolvedValue(page),
      close: vi.fn().mockResolvedValue(undefined)
    };

    const browser = {
      newContext: vi.fn().mockResolvedValue(context),
      close: vi.fn().mockResolvedValue(undefined)
    };

    launchMock.mockResolvedValue(browser);

    await expect(captureScreenshot("<html></html>", makeConfig())).rejects.toBeInstanceOf(AppError);

    expect(page.close).toHaveBeenCalledTimes(1);
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
});
