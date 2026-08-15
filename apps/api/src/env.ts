import "dotenv/config";
import { z } from "zod";

/**
 * Validated environment. Fails fast at boot if anything required is missing,
 * so we never run with a half-configured server.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  // Comma-separated list of allowed web origins (CORS).
  WEB_ORIGIN: z.string().default("http://localhost:3000"),

  // Production concerns.
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW: z.string().default("1 minute"),
  // Trust X-Forwarded-* headers (enable behind a load balancer / proxy).
  TRUST_PROXY: z
    .string()
    .default("false")
    .transform((v) => v === "true" || v === "1"),
  APP_VERSION: z.string().default("0.1.0"),
  // Optional error-monitoring DSN (Sentry etc.). No-op when unset.
  SENTRY_DSN: z.string().url().optional(),

  // "mock" (default) skips Clerk entirely and resolves every request to a dev
  // user — lets the app run with no external setup. Switch to "clerk" once real
  // keys are in place.
  AUTH_MODE: z.enum(["clerk", "mock"]).default("mock"),

  // Clerk — required only when AUTH_MODE=clerk.
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  // Optional: documents the Clerk instance; verification derives it from the
  // secret key, so it is not strictly required.
  CLERK_ISSUER: z.string().url().optional(),

  // Discovery provider selection. "auto" uses OpenTripMap when a key is
  // present, otherwise the keyless mock provider.
  PLACES_PROVIDER: z.enum(["auto", "opentripmap", "mock"]).default("auto"),
  OPENTRIPMAP_API_KEY: z.string().min(1).optional(),
}).superRefine((val, ctx) => {
  if (val.AUTH_MODE === "clerk" && !val.CLERK_SECRET_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["CLERK_SECRET_KEY"],
      message: "CLERK_SECRET_KEY is required when AUTH_MODE=clerk",
    });
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid API environment:\n",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";

/** Allowed CORS origins, parsed from the comma-separated WEB_ORIGIN. */
export const webOrigins = env.WEB_ORIGIN.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const logLevel = env.LOG_LEVEL ?? (isProd ? "info" : "debug");
