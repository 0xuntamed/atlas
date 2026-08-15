/** Travel profile + passport contracts (Phase 4). Derived, read-only stats. */

export interface ProfileStatsDTO {
  countriesVisited: number;
  citiesVisited: number;
  tripsCompleted: number;
  upcomingTrips: number;
  /** Total distance across completed-trip routes, kilometres (rounded). */
  distanceKm: number;
  mostVisitedCountry: {
    code: string;
    name: string;
    visitCount: number;
  } | null;
}

export interface PassportStampDTO {
  code: string;
  name: string;
  flag?: string;
  firstVisitedAt: string | null;
  lastVisitedAt: string | null;
  visitCount: number;
}
