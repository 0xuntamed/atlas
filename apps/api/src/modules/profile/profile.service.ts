import type { ProfileStatsDTO } from "@atlas/types";
import { prisma } from "../../db/prisma";
import { haversineKm } from "../../lib/geo-distance";
import { countryProvider } from "../../providers/countries/country.provider";
import { visitedCountryRepository } from "../visited-countries/visited-country.repository";

const PLANNED_STATUSES = ["PLANNED", "ACTIVE"] as const;

export const profileService = {
  async stats(userId: string): Promise<ProfileStatsDTO> {
    const [visited, tripsCompleted, upcomingTrips, completedTrips] =
      await Promise.all([
        visitedCountryRepository.listByUser(userId),
        prisma.trip.count({ where: { userId, status: "COMPLETED" } }),
        prisma.trip.count({
          where: { userId, status: { in: [...PLANNED_STATUSES] } },
        }),
        prisma.trip.findMany({
          where: { userId, status: "COMPLETED" },
          include: {
            days: {
              orderBy: { position: "asc" },
              include: { places: { orderBy: { position: "asc" } } },
            },
          },
        }),
      ]);

    // Distinct cities (by place name) and total route distance across completed
    // trips — both derived from the same itinerary data, no duplication.
    const cities = new Set<string>();
    let distanceKm = 0;

    for (const trip of completedTrips) {
      const points: { lat: number; lng: number }[] = [];
      for (const day of trip.days) {
        for (const place of day.places) {
          cities.add(place.name.trim().toLowerCase());
          if (place.latitude != null && place.longitude != null) {
            points.push({ lat: place.latitude, lng: place.longitude });
          }
        }
      }
      for (let i = 1; i < points.length; i++) {
        distanceKm += haversineKm(
          points[i - 1]!.lat,
          points[i - 1]!.lng,
          points[i]!.lat,
          points[i]!.lng,
        );
      }
    }

    const top = visited[0]; // repository sorts by visitCount desc
    const mostVisitedCountry = top
      ? {
          code: top.countryCode,
          name:
            (await countryProvider.getByCode(top.countryCode))?.name ??
            top.countryCode,
          visitCount: top.visitCount,
        }
      : null;

    return {
      countriesVisited: visited.length,
      citiesVisited: cities.size,
      tripsCompleted,
      upcomingTrips,
      distanceKm: Math.round(distanceKm),
      mostVisitedCountry,
    };
  },
};
