import type { FastifyInstance } from "fastify";
import { createTripPlaceSchema, updateTripPlaceSchema } from "@atlas/types";
import { requireAuth } from "../../middleware/auth";
import { parse } from "../../lib/validate";
import { serializeTripPlace } from "../trips/trip.serializer";
import { tripPlaceService } from "./trip-place.service";

/**
 *   POST   /api/trip-days/:dayId/places
 *   PATCH  /api/trip-places/:placeId
 *   DELETE /api/trip-places/:placeId
 */
export async function tripPlaceRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.post("/trip-days/:dayId/places", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { dayId } = req.params as { dayId: string };
    const input = parse(createTripPlaceSchema, req.body);
    const place = await tripPlaceService.create(userId, dayId, input);
    return reply.code(201).send({ data: serializeTripPlace(place) });
  });

  app.patch("/trip-places/:placeId", async (req) => {
    const { userId } = requireAuth(req);
    const { placeId } = req.params as { placeId: string };
    const input = parse(updateTripPlaceSchema, req.body);
    const place = await tripPlaceService.update(userId, placeId, input);
    return { data: serializeTripPlace(place) };
  });

  app.delete("/trip-places/:placeId", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { placeId } = req.params as { placeId: string };
    await tripPlaceService.remove(userId, placeId);
    return reply.code(204).send();
  });
}
