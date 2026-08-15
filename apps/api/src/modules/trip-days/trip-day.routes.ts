import type { FastifyInstance } from "fastify";
import { createTripDaySchema, updateTripDaySchema } from "@atlas/types";
import { requireAuth } from "../../middleware/auth";
import { parse } from "../../lib/validate";
import { serializeTripDay } from "../trips/trip.serializer";
import { tripDayService } from "./trip-day.service";

/**
 * Trip days are addressed two ways:
 *   POST   /api/trips/:tripId/days   (nested create under a trip)
 *   PATCH  /api/trip-days/:dayId
 *   DELETE /api/trip-days/:dayId
 */
export async function tripDayRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.post("/trips/:tripId/days", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    const input = parse(createTripDaySchema, req.body);
    const day = await tripDayService.create(userId, tripId, input);
    return reply.code(201).send({ data: serializeTripDay(day) });
  });

  app.patch("/trip-days/:dayId", async (req) => {
    const { userId } = requireAuth(req);
    const { dayId } = req.params as { dayId: string };
    const input = parse(updateTripDaySchema, req.body);
    const day = await tripDayService.update(userId, dayId, input);
    return { data: serializeTripDay(day) };
  });

  app.delete("/trip-days/:dayId", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { dayId } = req.params as { dayId: string };
    await tripDayService.remove(userId, dayId);
    return reply.code(204).send();
  });
}
