import { CountryState, type CountryMapEntryDTO } from "@atlas/types";
import { prisma } from "../../db/prisma";

/** Trip statuses that count as "planned" (i.e. not yet visited). */
const PLANNED_STATUSES = ["DRAFT", "PLANNED", "ACTIVE"] as const;

/**
 * Aggregates the user's country states for the globe. Priority when a country
 * qualifies for several: visited > planned > wishlist.
 */
export const mapService = {
  async countryStates(userId: string): Promise<CountryMapEntryDTO[]> {
    const [trips, visited, saved] = await Promise.all([
      prisma.trip.findMany({
        where: { userId },
        select: { countryCode: true, status: true },
      }),
      prisma.visitedCountry.findMany({
        where: { userId },
        select: { countryCode: true },
      }),
      prisma.savedPlace.findMany({
        where: { userId, countryCode: { not: null } },
        select: { countryCode: true },
        distinct: ["countryCode"],
      }),
    ]);

    const tripCount = new Map<string, number>();
    const hasVisitedTrip = new Set<string>();
    const hasPlannedTrip = new Set<string>();

    for (const t of trips) {
      const code = t.countryCode.toUpperCase();
      tripCount.set(code, (tripCount.get(code) ?? 0) + 1);
      if (t.status === "COMPLETED") hasVisitedTrip.add(code);
      else if ((PLANNED_STATUSES as readonly string[]).includes(t.status)) {
        hasPlannedTrip.add(code);
      }
    }

    const visitedCodes = new Set(
      visited.map((v) => v.countryCode.toUpperCase()),
    );
    const savedCodes = new Set(
      saved
        .map((s) => s.countryCode?.toUpperCase())
        .filter((c): c is string => Boolean(c)),
    );

    // Union of every country the user has any signal for.
    const allCodes = new Set<string>([
      ...tripCount.keys(),
      ...visitedCodes,
      ...savedCodes,
    ]);

    const entries: CountryMapEntryDTO[] = [];
    for (const code of allCodes) {
      let state: CountryMapEntryDTO["state"];
      if (visitedCodes.has(code) || hasVisitedTrip.has(code)) {
        state = CountryState.VISITED;
      } else if (hasPlannedTrip.has(code)) {
        state = CountryState.PLANNED;
      } else if (savedCodes.has(code)) {
        state = CountryState.WISHLIST;
      } else {
        continue; // no meaningful state
      }
      entries.push({ code, state, tripCount: tripCount.get(code) ?? 0 });
    }

    return entries.sort((a, b) => a.code.localeCompare(b.code));
  },
};
