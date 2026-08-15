import type { CreateTripDayInput, UpdateTripDayInput } from "@atlas/types";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { tripRepository } from "../trips/trip.repository";
import { tripDayRepository } from "./trip-day.repository";

const dayNotFound = () =>
  notFound(ErrorCode.TRIP_DAY_NOT_FOUND, "Trip day could not be found");
const tripNotFound = () =>
  notFound(ErrorCode.TRIP_NOT_FOUND, "Trip could not be found");

export const tripDayService = {
  async create(userId: string, tripId: string, input: CreateTripDayInput) {
    // Verify the parent trip is owned before adding to it.
    const trip = await tripRepository.findOwned(userId, tripId);
    if (!trip) throw tripNotFound();

    const position =
      input.position ?? (await tripDayRepository.countForTrip(tripId));

    return tripDayRepository.create({
      tripId,
      date: input.date ?? null,
      title: input.title ?? null,
      notes: input.notes ?? null,
      position,
    });
  },

  async update(userId: string, dayId: string, input: UpdateTripDayInput) {
    const existing = await tripDayRepository.findOwned(userId, dayId);
    if (!existing) throw dayNotFound();
    return tripDayRepository.update(dayId, input);
  },

  async remove(userId: string, dayId: string) {
    const existing = await tripDayRepository.findOwned(userId, dayId);
    if (!existing) throw dayNotFound();
    await tripDayRepository.delete(dayId);
  },
};
