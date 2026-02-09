import { AppError } from "./errors";
import { loadConfig, parseSizeOverride } from "./config/load-config";
import { normalizeMessageSpec } from "./input/normalize-tree";
import { parseMessage } from "./input/parse-message";
import { emitOutput } from "./output/emit";
import { BUILTIN_COMPONENTS } from "./render/builtin-registry";
import { renderHtml } from "./render/render-html";
import { captureScreenshot } from "./render/screenshot";
import { validateAndPrepareSpec } from "./render/validate-ui";

export interface RunOptions {
  message: string;
  configPath: string;
  output: string;
  size?: string;
}

export async function run(options: RunOptions): Promise<void> {
  const sizeOverride = parseSizeOverride(options.size);
  const config = loadConfig(options.configPath, BUILTIN_COMPONENTS, sizeOverride);

  const parsedMessage = parseMessage(options.message);
  const normalizedSpec = normalizeMessageSpec(parsedMessage);
  const validatedSpec = validateAndPrepareSpec(normalizedSpec, config, BUILTIN_COMPONENTS);

  const html = renderHtml(validatedSpec, config);
  const pngBuffer = await captureScreenshot(html, config);

  emitOutput(pngBuffer, options.output);
}

export function getErrorExitCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.code;
  }

  return 2;
}
