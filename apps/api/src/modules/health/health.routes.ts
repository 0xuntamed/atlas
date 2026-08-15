import type { FastifyInstance } from "fastify";
import { prisma } from "../../db/prisma";
import { env } from "../../env";

/**
 * Liveness/readiness. Public and rate-limit exempt. Verifies the DB connection
 * so a load balancer can tell a healthy instance from one that can't reach
 * Postgres.
 */
export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (_req, reply) => {
    const base = {
      version: env.APP_VERSION,
      uptime: Math.round(process.uptime()),
    };
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", db: "up", ...base };
    } catch (err) {
      app.log.error({ err }, "Health check failed");
      return reply.code(503).send({ status: "unhealthy", db: "down", ...base });
    }
  });
}
