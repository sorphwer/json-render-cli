import { readFileSync } from "node:fs";
import path from "node:path";

import { AppError } from "../errors";
import type { JsonRenderConfig, SizeOverride } from "../types";
import { JsonRenderConfigSchema } from "./schema";

const SIZE_PATTERN = /^(?<width>\d{1,4})x(?<height>\d{1,4})$/i;

export function parseSizeOverride(input?: string): SizeOverride | undefined {
  if (!input) {
    return undefined;
  }

  const match = SIZE_PATTERN.exec(input.trim());

  if (!match?.groups) {
    throw new AppError({
      code: 1,
      message: `Invalid --size value "${input}". Use WIDTHxHEIGHT (example: 1200x630).`
    });
  }

  const width = Number.parseInt(match.groups.width, 10);
  const height = Number.parseInt(match.groups.height, 10);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new AppError({
      code: 1,
      message: `Invalid --size value "${input}". Width and height must be positive integers.`
    });
  }

  return { width, height };
}

export function loadConfig(
  configPath: string,
  builtinComponents: readonly string[],
  sizeOverride?: SizeOverride
): JsonRenderConfig {
  const absolutePath = path.resolve(configPath);
  let rawText: string;

  try {
    rawText = readFileSync(absolutePath, "utf8");
  } catch (error) {
    throw new AppError({
      code: 1,
      message: `Failed to read config file: ${absolutePath}`,
      cause: error
    });
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawText);
  } catch (error) {
    throw new AppError({
      code: 1,
      message: `Config file is not valid JSON: ${absolutePath}`,
      cause: error
    });
  }

  const parsedConfig = JsonRenderConfigSchema.safeParse(parsedJson);

  if (!parsedConfig.success) {
    const details = parsedConfig.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");

    throw new AppError({
      code: 1,
      message: `Config validation failed: ${details}`
    });
  }

  const builtinSet = new Set(builtinComponents);
  const allowedFromConfig = parsedConfig.data.catalog.allowedComponents;
  const allowedComponents = (allowedFromConfig.length > 0 ? allowedFromConfig : [...builtinSet]).filter(
    (component, index, arr) => arr.indexOf(component) === index
  );

  const unknownAllowed = allowedComponents.filter((component) => !builtinSet.has(component));

  if (unknownAllowed.length > 0) {
    throw new AppError({
      code: 1,
      message: `Config validation failed: catalog.allowedComponents has unknown components: ${unknownAllowed.join(", ")}`
    });
  }

  const defaultKeys = Object.keys(parsedConfig.data.catalog.componentDefaults);
  const unknownDefaults = defaultKeys.filter((component) => !builtinSet.has(component));

  if (unknownDefaults.length > 0) {
    throw new AppError({
      code: 1,
      message: `Config validation failed: catalog.componentDefaults has unknown components: ${unknownDefaults.join(", ")}`
    });
  }

  const config: JsonRenderConfig = {
    ...parsedConfig.data,
    catalog: {
      ...parsedConfig.data.catalog,
      allowedComponents,
      componentDefaults: parsedConfig.data.catalog.componentDefaults
    },
    viewport: sizeOverride
      ? {
          ...parsedConfig.data.viewport,
          width: sizeOverride.width,
          height: sizeOverride.height
        }
      : parsedConfig.data.viewport
  };

  return config;
}
