import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const savedPlaceRepository = {
  listByUser(userId: string, countryCode?: string) {
    return prisma.savedPlace.findMany({
      where: { userId, ...(countryCode ? { countryCode } : {}) },
      orderBy: { createdAt: "desc" },
    });
  },

  findOwned(userId: string, id: string) {
    return prisma.savedPlace.findFirst({ where: { id, userId } });
  },

  findByExternalId(userId: string, externalPlaceId: string) {
    return prisma.savedPlace.findFirst({
      where: { userId, externalPlaceId },
    });
  },

  create(userId: string, data: Omit<Prisma.SavedPlaceUncheckedCreateInput, "userId">) {
    return prisma.savedPlace.create({ data: { ...data, userId } });
  },

  delete(id: string) {
    return prisma.savedPlace.delete({ where: { id } });
  },
};
