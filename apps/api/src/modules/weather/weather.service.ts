import type { WeatherDTO } from "@atlas/types";
import { weatherProvider } from "../../providers/weather/weather.provider";
import { TtlCache } from "../../providers/cache";

// Weather changes slowly enough that a short cache is safe and kind to upstream.
const cache = new TtlCache<WeatherDTO>(10 * 60 * 1000);

export const weatherService = {
  async current(latitude: number, longitude: number): Promise<WeatherDTO> {
    // Round the key so nearby requests share a cache entry.
    const key = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const weather = await weatherProvider.current(latitude, longitude);
    cache.set(key, weather);
    return weather;
  },
};
