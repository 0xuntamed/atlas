import type { CreateTripInput, UpdateTripInput } from "@atlas/types";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { visitedCountryRepository } from "../visited-countries/visited-country.repository";
import { tripRepository } from "./trip.repository";

const tripNotFound = () =>
  notFound(ErrorCode.TRIP_NOT_FOUND, "Trip could not be found");

export const tripService = {
  list(userId: string) {
    return tripRepository.listByUser(userId);
  },

  async get(userId: string, tripId: string) {
    const trip = await tripRepository.findOwnedWithItinerary(userId, tripId);
    if (!trip) throw tripNotFound();
    return trip;
  },

  async create(userId: string, input: CreateTripInput) {
    const trip = await tripRepository.create(userId, {
      title: input.title,
      countryCode: input.countryCode,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      status: input.status,
      coverImage: input.coverImage ?? null,
    });
    // Creating a trip already marked completed also stamps the passport.
    if (input.status === "COMPLETED") {
      await visitedCountryRepository.recordVisit(
        userId,
        trip.countryCode.toUpperCase(),
      );
    }
    return trip;
  },

  async update(userId: string, tripId: string, input: UpdateTripInput) {
    // Ownership check before any mutation.
    const existing = await tripRepository.findOwned(userId, tripId);
    if (!existing) throw tripNotFound();
    const updated = await tripRepository.update(tripId, input);

    // Completing a trip (PLANNED → COMPLETED) stamps the passport: record a
    // visit to the trip's country. Only fires on the transition, so re-saving
    // an already-completed trip doesn't inflate the count.
    if (input.status === "COMPLETED" && existing.status !== "COMPLETED") {
      await visitedCountryRepository.recordVisit(
        userId,
        updated.countryCode.toUpperCase(),
      );
    }

    return updated;
  },

  async remove(userId: string, tripId: string) {
    const existing = await tripRepository.findOwned(userId, tripId);
    if (!existing) throw tripNotFound();
    await tripRepository.delete(tripId);
  },
};
