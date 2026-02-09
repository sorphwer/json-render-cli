#!/usr/bin/env node

import { Command } from "commander";

import { getErrorExitCode, run } from "./run";

export async function main(argv: string[] = process.argv): Promise<void> {
  const program = new Command();

  program
    .name("json-render")
    .description("Render JSON UI to PNG using @json-render/react and Playwright")
    .requiredOption("-m, --message <json>", "UI spec JSON string")
    .option("-c, --config <path>", "Path to config JSON", "./config.json")
    .option("-o, --output <stdout|filePath>", "Output mode: stdout or file path", "stdout")
    .option("--size <WIDTHxHEIGHT>", "Override viewport size")
    .showHelpAfterError(true);

  await program.parseAsync(argv);
  const options = program.opts<{
    message: string;
    config: string;
    output: string;
    size?: string;
  }>();

  await run({
    message: options.message,
    configPath: options.config,
    output: options.output,
    size: options.size
  });
}

if (require.main === module) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = getErrorExitCode(error);
  });
}
