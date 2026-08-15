import { PrismaClient } from "@prisma/client";

/**
 * Phase 1 has no seed data worth inserting — real users arrive via Clerk and
 * their trips are created through the app. This script exists so the pipeline
 * (and later phases, e.g. seeding country reference data) has a home.
 */
const prisma = new PrismaClient();

async function main() {
  console.log("Nothing to seed in Phase 1.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
