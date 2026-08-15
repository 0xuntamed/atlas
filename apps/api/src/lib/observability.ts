import type { FastifyBaseLogger } from "fastify";
import { env } from "../env";

/**
 * Single place errors are reported from. Today it emits a structured log line;
 * if SENTRY_DSN (or another monitor) is configured this is where you'd forward
 * the exception. Keeping it behind one function means wiring a real monitor
 * later is a one-file change.
 */
export function reportError(
  log: FastifyBaseLogger,
  err: unknown,
  context: Record<string, unknown> = {},
): void {
  log.error({ err, ...context }, "unhandled_error");

  if (env.SENTRY_DSN) {
    // Integration seam: forward to Sentry/your monitor here.
    // e.g. Sentry.captureException(err, { extra: context });
  }
}
