import type { WeatherDTO } from "@atlas/types";
import { fetchJson } from "../http";

/**
 * Open-Meteo adapter (https://open-meteo.com). Keyless. Returns current weather
 * at a coordinate.
 */

const BASE = "https://api.open-meteo.com/v1/forecast";

interface RawForecast {
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
  };
}

// WMO weather interpretation codes -> short human labels.
const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

function describe(code: number | null): string {
  if (code === null) return "Unknown";
  return WEATHER_CODES[code] ?? "Unknown";
}

export const weatherProvider = {
  name: "open-meteo",

  async current(latitude: number, longitude: number): Promise<WeatherDTO> {
    const url =
      `${BASE}?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code`;
    const raw = await fetchJson<RawForecast>(url);
    const current = raw.current ?? {};
    const weatherCode = current.weather_code ?? null;
    return {
      latitude,
      longitude,
      temperatureC: current.temperature_2m ?? null,
      weatherCode,
      description: describe(weatherCode),
      time: current.time ?? null,
    };
  },
};
