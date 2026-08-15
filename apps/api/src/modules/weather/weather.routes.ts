import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ErrorCode } from "@atlas/types";
import { AppError } from "../../lib/errors";
import { parse } from "../../lib/validate";
import { countryService } from "../countries/country.service";
import { weatherService } from "./weather.service";

const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  country: z.string().trim().length(2).optional(),
});

/**
 * GET /api/weather?lat=&lon=   — current weather at a coordinate, OR
 * GET /api/weather?country=JP  — weather at the country's capital.
 */
export async function weatherRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (req) => {
    const { lat, lon, country } = parse(weatherQuerySchema, req.query);

    let latitude = lat;
    let longitude = lon;

    if ((latitude === undefined || longitude === undefined) && country) {
      const c = await countryService.getByCode(country);
      latitude = c?.latitude;
      longitude = c?.longitude;
    }

    if (latitude === undefined || longitude === undefined) {
      throw new AppError(
        400,
        ErrorCode.VALIDATION_ERROR,
        "Provide lat & lon, or a country code",
      );
    }

    const weather = await weatherService.current(latitude, longitude);
    return { data: weather };
  });
}
