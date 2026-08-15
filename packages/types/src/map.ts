/**
 * Country "state" on the globe, derived per-user from their data:
 *   visited  — a completed trip or a recorded VisitedCountry
 *   planned  — an in-progress/upcoming trip (DRAFT/PLANNED/ACTIVE)
 *   wishlist — a saved place in that country, but no trip yet
 *   neutral  — everything else (never sent; the default on the client)
 */
export const CountryState = {
  VISITED: "visited",
  PLANNED: "planned",
  WISHLIST: "wishlist",
  NEUTRAL: "neutral",
} as const;
export type CountryState = (typeof CountryState)[keyof typeof CountryState];

export interface CountryMapEntryDTO {
  code: string;
  state: CountryState;
  /** Number of trips the user has in this country. */
  tripCount: number;
}
