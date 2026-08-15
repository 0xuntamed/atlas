import type { FastifyPluginCallback, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { verifyToken } from "@clerk/backend";
import { env } from "../env";
import { unauthorized } from "../lib/errors";
import { ensureUser } from "../modules/users/user.service";

/**
 * Authenticated request context. `userId` is OUR database id (not the Clerk id),
 * so all downstream ownership checks compare against local rows.
 */
export interface AuthContext {
  userId: string;
  clerkId: string;
}

declare module "fastify" {
  interface FastifyRequest {
    auth?: AuthContext;
  }
  interface FastifyInstance {
    authenticate: (req: FastifyRequest) => Promise<void>;
  }
}

const MOCK_DEFAULT_USER = "mock_dev_user";

function extractBearer(req: FastifyRequest): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/**
 * Mock auth: resolve every request to a dev user, no token needed. An optional
 * `x-mock-user` header selects a distinct identity (useful for testing that
 * ownership scoping keeps users' data separate).
 */
async function authenticateMock(req: FastifyRequest): Promise<void> {
  const rawId = req.headers["x-mock-user"];
  const clerkId =
    (Array.isArray(rawId) ? rawId[0] : rawId)?.trim() || MOCK_DEFAULT_USER;
  const user = await ensureUser({
    clerkId,
    email: `${clerkId}@dev.local`,
    name: "Dev User",
  });
  req.auth = { userId: user.id, clerkId };
}

async function authenticateClerk(req: FastifyRequest): Promise<void> {
  const token = extractBearer(req);
  if (!token) throw unauthorized("Missing bearer token");

  let claims;
  try {
    // Networkless verification: Clerk fetches/caches its JWKS using the
    // secret key and validates the issuer + signature automatically.
    claims = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY!,
    });
  } catch (err) {
    req.log.debug({ err }, "Clerk token verification failed");
    throw unauthorized("Invalid or expired session token");
  }

  const clerkId = claims.sub;
  if (!clerkId) throw unauthorized("Token missing subject");

  const email = typeof claims.email === "string" ? claims.email : undefined;
  const name = typeof claims.name === "string" ? claims.name : undefined;

  const user = await ensureUser({ clerkId, email, name });
  req.auth = { userId: user.id, clerkId };
}

const authPlugin: FastifyPluginCallback = (app, _opts, done) => {
  if (env.AUTH_MODE === "mock") {
    app.log.warn(
      "⚠️  AUTH_MODE=mock — all requests resolve to a dev user. Do not use in production.",
    );
  }

  app.decorate(
    "authenticate",
    env.AUTH_MODE === "mock" ? authenticateMock : authenticateClerk,
  );

  done();
};

export default fp(authPlugin, { name: "auth" });

/** Narrowing helper: returns the auth context or throws 401. */
export function requireAuth(req: FastifyRequest): AuthContext {
  if (!req.auth) throw unauthorized();
  return req.auth;
}
