import type { AppErrorDetails } from "./types";

export class AppError extends Error {
  readonly code: number;

  constructor(details: AppErrorDetails) {
    super(details.message);
    this.name = "AppError";
    this.code = details.code;

    if (details.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = details.cause;
    }
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
