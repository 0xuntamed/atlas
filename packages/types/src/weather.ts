/** Current weather at a coordinate, from Open-Meteo. */
export interface WeatherDTO {
  latitude: number;
  longitude: number;
  temperatureC: number | null;
  weatherCode: number | null;
  description: string;
  time: string | null;
}
