import type { CountryState } from "@atlas/types";

/** Country fill colors on the globe, by state. */
export const STATE_COLOR: Record<CountryState, string> = {
  visited: "#34d399", // emerald
  planned: "#fbbf24", // amber
  wishlist: "#a78bfa", // violet
  neutral: "#2f2e2b", // muted, sits quietly on the dark globe
};

export const STATE_LABEL: Record<CountryState, string> = {
  visited: "Visited",
  planned: "Planned",
  wishlist: "Wishlist",
  neutral: "Neutral",
};

export const LEGEND_ORDER: CountryState[] = [
  "visited",
  "planned",
  "wishlist",
];
