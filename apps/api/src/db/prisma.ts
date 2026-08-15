import { PrismaClient } from "@prisma/client";
import { isProd } from "../env";

/**
 * Single PrismaClient for the process. In dev, tsx watch can re-evaluate this
 * module on reload, so we cache the instance on globalThis to avoid exhausting
 * database connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ["error"] : ["error", "warn"],
  });

if (!isProd) globalForPrisma.prisma = prisma;
