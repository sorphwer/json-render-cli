import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

export function emitOutput(pngBuffer: Buffer, output: string): void {
  if (output === "stdout") {
    process.stdout.write(pngBuffer.toString("base64"));
    return;
  }

  const absolutePath = path.resolve(output);
  const directory = path.dirname(absolutePath);

  mkdirSync(directory, { recursive: true });
  writeFileSync(absolutePath, pngBuffer);

  process.stdout.write(`${absolutePath}\n`);
}
