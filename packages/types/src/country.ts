/**
 * Country discovery contracts. Sourced from an external provider (REST
 * Countries) — ATLAS never persists these; they are read-only world data.
 */

export interface CountrySummaryDTO {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  region?: string;
  flag?: string; // emoji
  flagUrl?: string;
}

export interface CountryDTO extends CountrySummaryDTO {
  officialName?: string;
  nativeName?: string;
  capital?: string;
  subregion?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  currencies?: string[];
  languages?: string[];
}
