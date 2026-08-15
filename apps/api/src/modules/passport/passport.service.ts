import type { PassportStampDTO } from "@atlas/types";
import { countryProvider } from "../../providers/countries/country.provider";
import { visitedCountryRepository } from "../visited-countries/visited-country.repository";

export const passportService = {
  async stamps(userId: string): Promise<PassportStampDTO[]> {
    const visited = await visitedCountryRepository.listByUser(userId);
    return Promise.all(
      visited.map(async (v) => {
        // Offline lookup (world-countries) — enrich with name + flag.
        const country = await countryProvider.getByCode(v.countryCode);
        return {
          code: v.countryCode,
          name: country?.name ?? v.countryCode,
          flag: country?.flag,
          firstVisitedAt: v.firstVisitedAt?.toISOString() ?? null,
          lastVisitedAt: v.lastVisitedAt?.toISOString() ?? null,
          visitCount: v.visitCount,
        };
      }),
    );
  },
};
