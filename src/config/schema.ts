import { z } from "zod";

export const ThemeConfigSchema = z
  .object({
    fontFamily: z.string().default("ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"),
    textColor: z.string().default("#0f172a"),
    headingColor: z.string().default("#020617"),
    mutedTextColor: z.string().default("#475569"),
    cardBackground: z.string().default("#ffffff"),
    cardBorderColor: z.string().default("#e2e8f0"),
    borderRadius: z.number().min(0).max(64).default(16),
    spacing: z.number().min(0).max(64).default(12)
  })
  .strict();

export const JsonRenderConfigSchema = z
  .object({
    version: z.literal(1).default(1),
    catalog: z
      .object({
        allowedComponents: z.array(z.string().min(1)).default([]),
        componentDefaults: z.record(z.string(), z.record(z.string(), z.unknown())).default({})
      })
      .strict()
      .default({
        allowedComponents: [],
        componentDefaults: {}
      }),
    theme: ThemeConfigSchema.default({
      fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      textColor: "#0f172a",
      headingColor: "#020617",
      mutedTextColor: "#475569",
      cardBackground: "#ffffff",
      cardBorderColor: "#e2e8f0",
      borderRadius: 16,
      spacing: 12
    }),
    viewport: z
      .object({
        width: z.number().int().min(1).max(4096).default(1200),
        height: z.number().int().min(1).max(4096).default(630),
        deviceScaleFactor: z.number().min(1).max(4).default(2)
      })
      .strict()
      .default({ width: 1200, height: 630, deviceScaleFactor: 2 }),
    screenshot: z
      .object({
        type: z.literal("png").default("png"),
        omitBackground: z.boolean().default(false),
        fullPage: z.boolean().default(false)
      })
      .strict()
      .default({ type: "png", omitBackground: false, fullPage: false }),
    canvas: z
      .object({
        background: z.string().default("#f8fafc"),
        padding: z.number().int().min(0).max(256).default(24)
      })
      .strict()
      .default({ background: "#f8fafc", padding: 24 })
  })
  .strict();
