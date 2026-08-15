import type { CountryDTO } from "@atlas/types";
import { countryProvider } from "../../providers/countries/country.provider";
import { TtlCache } from "../../providers/cache";

// Country metadata is effectively static — cache detail lookups for an hour.
const detailCache = new TtlCache<CountryDTO>(60 * 60 * 1000);

export const countryService = {
  search(query: string): Promise<CountryDTO[]> {
    return countryProvider.search(query);
  },

  async getByCode(code: string): Promise<CountryDTO | null> {
    const key = code.toUpperCase();
    const cached = detailCache.get(key);
    if (cached) return cached;
    const country = await countryProvider.getByCode(key);
    if (country) detailCache.set(key, country);
    return country;
  },
};
