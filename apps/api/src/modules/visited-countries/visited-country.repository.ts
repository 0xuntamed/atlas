import { prisma } from "../../db/prisma";

export const visitedCountryRepository = {
  listByUser(userId: string) {
    return prisma.visitedCountry.findMany({
      where: { userId },
      orderBy: [{ visitCount: "desc" }, { countryCode: "asc" }],
    });
  },

  /**
   * Record a visit to a country. Idempotent per call: the first visit creates
   * the row; subsequent completions bump the count and lastVisitedAt.
   */
  recordVisit(userId: string, countryCode: string) {
    const now = new Date();
    return prisma.visitedCountry.upsert({
      where: { userId_countryCode: { userId, countryCode } },
      create: {
        userId,
        countryCode,
        firstVisitedAt: now,
        lastVisitedAt: now,
        visitCount: 1,
      },
      update: {
        lastVisitedAt: now,
        visitCount: { increment: 1 },
      },
    });
  },
};
