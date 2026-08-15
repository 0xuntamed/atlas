declare module "world-countries" {
  interface WorldCountry {
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
  const countries: WorldCountry[];
  export default countries;
}
