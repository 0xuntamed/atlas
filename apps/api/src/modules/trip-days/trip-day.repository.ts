import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const tripDayRepository = {
  /** A day is "owned" if its parent trip belongs to the user. */
  findOwned(userId: string, dayId: string) {
    return prisma.tripDay.findFirst({
      where: { id: dayId, trip: { userId } },
    });
  },

  countForTrip(tripId: string) {
    return prisma.tripDay.count({ where: { tripId } });
  },

  create(data: Prisma.TripDayUncheckedCreateInput) {
    return prisma.tripDay.create({ data });
  },

  update(dayId: string, data: Prisma.TripDayUpdateInput) {
    return prisma.tripDay.update({ where: { id: dayId }, data });
  },

  delete(dayId: string) {
    return prisma.tripDay.delete({ where: { id: dayId } });
  },
};
