import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

/**
 * Data access for trips. All reads/writes are scoped by userId at this layer so
 * a caller can never accidentally touch another user's trip.
 */
export const tripRepository = {
  listByUser(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    });
  },

  findOwned(userId: string, tripId: string) {
    return prisma.trip.findFirst({ where: { id: tripId, userId } });
  },

  /** Full trip with nested days + places, for the trip detail screen. */
  findOwnedWithItinerary(userId: string, tripId: string) {
    return prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        days: {
          orderBy: { position: "asc" },
          include: { places: { orderBy: { position: "asc" } } },
        },
      },
    });
  },

  create(userId: string, data: Omit<Prisma.TripUncheckedCreateInput, "userId">) {
    return prisma.trip.create({ data: { ...data, userId } });
  },

  update(tripId: string, data: Prisma.TripUpdateInput) {
    return prisma.trip.update({ where: { id: tripId }, data });
  },

  delete(tripId: string) {
    return prisma.trip.delete({ where: { id: tripId } });
  },
};
