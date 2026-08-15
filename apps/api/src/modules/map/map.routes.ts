import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth";
import { mapService } from "./map.service";

/**
 * GET /api/map/countries — the user's per-country states for the globe.
 * Countries with no signal are omitted (treated as "neutral" client-side).
 */
export async function mapRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/countries", async (req) => {
    const { userId } = requireAuth(req);
    const states = await mapService.countryStates(userId);
    return { data: states };
  });
}
