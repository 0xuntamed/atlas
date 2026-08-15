import { buildApp } from "./app";
import { env } from "./env";
import { prisma } from "./db/prisma";

async function main() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error({ err }, "Failed to start server");
    process.exit(1);
  }
}

void main();
