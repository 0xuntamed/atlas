import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env, isProd, logLevel, webOrigins } from "./env";
import authPlugin from "./middleware/auth";
import { registerErrorHandler } from "./middleware/error-handler";
import { healthRoutes } from "./modules/health/health.routes";
import { tripRoutes } from "./modules/trips/trip.routes";
import { tripDayRoutes } from "./modules/trip-days/trip-day.routes";
import { tripPlaceRoutes } from "./modules/trip-places/trip-place.routes";
import { countryRoutes } from "./modules/countries/country.routes";
import { placesRoutes } from "./modules/places/places.routes";
import { weatherRoutes } from "./modules/weather/weather.routes";
import { savedPlaceRoutes } from "./modules/saved-places/saved-place.routes";
import { mapRoutes } from "./modules/map/map.routes";
import { passportRoutes } from "./modules/passport/passport.routes";
import { profileRoutes } from "./modules/profile/profile.routes";

/**
 * Builds the Fastify app with all plugins and routes wired, but does not start
 * listening. Kept separate from server.ts so it can be imported in tests.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: logLevel,
      // Never log secrets.
      redact: ["req.headers.authorization", "req.headers.cookie"],
      ...(isProd
        ? {}
        : {
            transport: {
              target: "pino-pretty",
              options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" },
            },
          }),
    },
    // We emit our own structured line in onResponse instead.
    disableRequestLogging: true,
    // Honor X-Forwarded-* when behind a load balancer (real client IP for logs
    // and rate limiting).
    trustProxy: env.TRUST_PROXY,
    // Stable request id per request (propagates an inbound one if present).
    genReqId: (req) =>
      (req.headers["x-request-id"] as string) ?? crypto.randomUUID(),
  });

  await app.register(helmet);
  await app.register(cors, {
    origin: webOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Rate limiting — health checks are exempt so probes never trip it.
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    allowList: (req) => req.url === "/health",
  });

  await app.register(authPlugin);
  registerErrorHandler(app);

  // One structured log line per request: requestId, userId, route, status,
  // duration — the fields you actually want in production.
  app.addHook("onResponse", (req, reply, done) => {
    // req.log is already bound with reqId; add the rest of the fields.
    req.log.info(
      {
        userId: req.auth?.userId,
        method: req.method,
        route: req.routeOptions?.url ?? req.url,
        statusCode: reply.statusCode,
        durationMs: Math.round(reply.elapsedTime),
      },
      "request",
    );
    done();
  });

  // Public
  await app.register(healthRoutes);

  // Domain (each guarded by auth inside its own module)
  await app.register(tripRoutes, { prefix: "/api/trips" });
  await app.register(tripDayRoutes, { prefix: "/api" });
  await app.register(tripPlaceRoutes, { prefix: "/api" });
  await app.register(savedPlaceRoutes, { prefix: "/api/saved-places" });
  await app.register(mapRoutes, { prefix: "/api/map" });
  await app.register(passportRoutes, { prefix: "/api/passport" });
  await app.register(profileRoutes, { prefix: "/api/profile" });

  // Discovery (external world data; degrades independently)
  await app.register(countryRoutes, { prefix: "/api/countries" });
  await app.register(placesRoutes, { prefix: "/api/places" });
  await app.register(weatherRoutes, { prefix: "/api/weather" });

  return app;
}
