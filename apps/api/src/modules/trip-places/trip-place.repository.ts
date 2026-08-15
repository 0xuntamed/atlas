import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const tripPlaceRepository = {
  /** Owned if day -> trip -> user chain matches. */
  findOwned(userId: string, placeId: string) {
    return prisma.tripPlace.findFirst({
      where: { id: placeId, tripDay: { trip: { userId } } },
    });
  },

  countForDay(tripDayId: string) {
    return prisma.tripPlace.count({ where: { tripDayId } });
  },

  create(data: Prisma.TripPlaceUncheckedCreateInput) {
    return prisma.tripPlace.create({ data });
  },

  update(placeId: string, data: Prisma.TripPlaceUpdateInput) {
    return prisma.tripPlace.update({ where: { id: placeId }, data });
  },

  delete(placeId: string) {
    return prisma.tripPlace.delete({ where: { id: placeId } });
  },
};
