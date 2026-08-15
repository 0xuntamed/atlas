import type { CreateTripPlaceInput, UpdateTripPlaceInput } from "@atlas/types";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { tripDayRepository } from "../trip-days/trip-day.repository";
import { tripPlaceRepository } from "./trip-place.repository";

const placeNotFound = () =>
  notFound(ErrorCode.TRIP_PLACE_NOT_FOUND, "Place could not be found");
const dayNotFound = () =>
  notFound(ErrorCode.TRIP_DAY_NOT_FOUND, "Trip day could not be found");

export const tripPlaceService = {
  async create(userId: string, dayId: string, input: CreateTripPlaceInput) {
    // Verify the parent day (and thus its trip) is owned.
    const day = await tripDayRepository.findOwned(userId, dayId);
    if (!day) throw dayNotFound();

    const position =
      input.position ?? (await tripPlaceRepository.countForDay(dayId));

    return tripPlaceRepository.create({
      tripDayId: dayId,
      name: input.name,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      category: input.category ?? null,
      notes: input.notes ?? null,
      externalPlaceId: input.externalPlaceId ?? null,
      position,
    });
  },

  async update(userId: string, placeId: string, input: UpdateTripPlaceInput) {
    const existing = await tripPlaceRepository.findOwned(userId, placeId);
    if (!existing) throw placeNotFound();

    // If moving to another day, that day must also be owned by the user.
    if (input.tripDayId && input.tripDayId !== existing.tripDayId) {
      const target = await tripDayRepository.findOwned(userId, input.tripDayId);
      if (!target) throw dayNotFound();
    }

    return tripPlaceRepository.update(placeId, input);
  },

  async remove(userId: string, placeId: string) {
    const existing = await tripPlaceRepository.findOwned(userId, placeId);
    if (!existing) throw placeNotFound();
    await tripPlaceRepository.delete(placeId);
  },
};
