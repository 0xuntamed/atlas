import type { CountryDTO } from "@atlas/types";
import worldCountries from "world-countries";

/**
 * Country data provider backed by the `world-countries` dataset (the same open
 * data REST Countries was built on). Keyless, offline, and stable — country
 * reference data barely changes, and this keeps discovery resilient with no
 * external dependency.
 *
 * (REST Countries' hosted API was deprecated and its successor is key-gated;
 * bundling the dataset is the more robust choice. Flag images come from the
 * keyless flagcdn.com CDN.)
 */

interface RawCountry {
  cca2: string;
  name: {
    common: string;
    official: string;
    native?: Record<string, { official: string; common: string }>;
  };
  capital?: string[];
  region?: string;
  subregion?: string;
  latlng?: [number, number];
  flag?: string;
  currencies?: Record<string, { name: string; symbol?: string }>;
  languages?: Record<string, string>;
}

const DATA = worldCountries as unknown as RawCountry[];

// Index by code once for O(1) detail lookups.
const BY_CODE = new Map<string, RawCountry>(
  DATA.map((c) => [c.cca2.toUpperCase(), c]),
);

function firstNativeName(raw: RawCountry): string | undefined {
  const native = raw.name.native;
  if (!native) return undefined;
  return Object.values(native)[0]?.common;
}

function flagUrl(code: string): string {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

function mapCountry(raw: RawCountry): CountryDTO {
  return {
    code: raw.cca2,
    name: raw.name.common,
    officialName: raw.name.official,
    nativeName: firstNativeName(raw),
    capital: raw.capital?.[0],
    region: raw.region,
    subregion: raw.subregion,
    flag: raw.flag,
    flagUrl: flagUrl(raw.cca2),
    latitude: raw.latlng?.[0],
    longitude: raw.latlng?.[1],
    currencies: raw.currencies
      ? Object.values(raw.currencies).map((c) => c.name)
      : undefined,
    languages: raw.languages ? Object.values(raw.languages) : undefined,
  };
}

export const countryProvider = {
  name: "world-countries",

  async search(query: string): Promise<CountryDTO[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches = DATA.filter((c) => {
      if (c.name.common.toLowerCase().includes(q)) return true;
      if (c.name.official.toLowerCase().includes(q)) return true;
      const native = firstNativeName(c);
      return native ? native.toLowerCase().includes(q) : false;
    });
    return matches
      .map(mapCountry)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getByCode(code: string): Promise<CountryDTO | null> {
    const raw = BY_CODE.get(code.toUpperCase());
    return raw ? mapCountry(raw) : null;
  },
};
