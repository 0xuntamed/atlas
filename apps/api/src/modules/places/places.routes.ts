import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { parse } from "../../lib/validate";
import { placesService } from "./places.service";

const searchQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  country: z.string().trim().length(2).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

/**
 * GET /api/places/search?q=&lat=&lon=&country=&limit=
 * Discovery only — if the provider is down this returns 503 (via the error
 * handler) while the rest of the app keeps working.
 */
export async function placesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/search", async (req) => {
    const { q, lat, lon, country, limit } = parse(
      searchQuerySchema,
      req.query,
    );
    const places = await placesService.search({
      query: q,
      latitude: lat,
      longitude: lon,
      countryCode: country,
      limit,
    });
    return { data: places, provider: placesService.provider().name };
  });
}
