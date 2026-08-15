import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createSavedPlaceSchema } from "@atlas/types";
import { requireAuth } from "../../middleware/auth";
import { parse } from "../../lib/validate";
import { serializeSavedPlace } from "./saved-place.serializer";
import { savedPlaceService } from "./saved-place.service";

const listQuerySchema = z.object({
  country: z.string().trim().length(2).optional(),
});

/**
 *   GET    /api/saved-places?country=JP
 *   POST   /api/saved-places
 *   DELETE /api/saved-places/:placeId
 */
export async function savedPlaceRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (req) => {
    const { userId } = requireAuth(req);
    const { country } = parse(listQuerySchema, req.query);
    const places = await savedPlaceService.list(
      userId,
      country?.toUpperCase(),
    );
    return { data: places.map(serializeSavedPlace) };
  });

  app.post("/", async (req, reply) => {
    const { userId } = requireAuth(req);
    const input = parse(createSavedPlaceSchema, req.body);
    const { record, created } = await savedPlaceService.save(userId, input);
    return reply.code(created ? 201 : 200).send({
      data: serializeSavedPlace(record),
    });
  });

  app.delete("/:placeId", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { placeId } = req.params as { placeId: string };
    await savedPlaceService.remove(userId, placeId);
    return reply.code(204).send();
  });
}
