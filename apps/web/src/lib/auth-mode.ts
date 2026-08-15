/**
 * Auth mode is a build-time switch shared by server components, middleware, and
 * client hooks. "mock" bypasses Clerk entirely (dev user, no token); "clerk"
 * uses real Clerk auth. Keep this file free of client-only imports.
 */
export type AuthMode = "clerk" | "mock";

export const AUTH_MODE: AuthMode =
  process.env.NEXT_PUBLIC_AUTH_MODE === "clerk" ? "clerk" : "mock";

export const isMockAuth = AUTH_MODE === "mock";
