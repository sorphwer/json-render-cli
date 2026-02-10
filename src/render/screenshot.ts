import { chromium } from "playwright";
import type { Browser, BrowserContext, Page } from "playwright";

import { AppError } from "../errors";
import type { JsonRenderConfig } from "../types";

function normalizePlaywrightError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Executable doesn't exist") || message.includes("browserType.launch")) {
    return new AppError({
      code: 2,
      message:
        "Failed to launch Chromium. Install Playwright browser binaries with: npx playwright install chromium",
      cause: error
    });
  }

  return new AppError({
    code: 2,
    message: `Failed to render screenshot: ${message}`,
    cause: error
  });
}

export async function captureScreenshot(html: string, config: JsonRenderConfig): Promise<Buffer> {
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: {
        width: config.viewport.width,
        height: config.viewport.height
      },
      deviceScaleFactor: config.viewport.deviceScaleFactor
    });

    page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const bytes = await page.screenshot({
      type: "png",
      omitBackground: config.screenshot.omitBackground,
      fullPage: config.screenshot.fullPage
    });

    return Buffer.from(bytes);
  } catch (error) {
    throw normalizePlaywrightError(error);
  } finally {
    await closeQuietly(page);
    await closeQuietly(context);
    await closeQuietly(browser);
  }
}

async function closeQuietly(target: { close: () => Promise<unknown> } | undefined): Promise<void> {
  if (!target) {
    return;
  }

  try {
    await target.close();
  } catch {
    // Cleanup errors are intentionally ignored.
  }
}
