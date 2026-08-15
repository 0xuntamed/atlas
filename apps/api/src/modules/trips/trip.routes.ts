import type { FastifyInstance } from "fastify";
import { createTripSchema, updateTripSchema } from "@atlas/types";
import { requireAuth } from "../../middleware/auth";
import { parse } from "../../lib/validate";
import { serializeTrip, serializeTripWithItinerary } from "./trip.serializer";
import { tripService } from "./trip.service";

/**
 * /api/trips
 * All routes require authentication and are scoped to the caller's userId.
 */
export async function tripRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (req) => {
    const { userId } = requireAuth(req);
    const trips = await tripService.list(userId);
    return { data: trips.map(serializeTrip) };
  });

  app.post("/", async (req, reply) => {
    const { userId } = requireAuth(req);
    const input = parse(createTripSchema, req.body);
    const trip = await tripService.create(userId, input);
    return reply.code(201).send({ data: serializeTrip(trip) });
  });

  app.get("/:tripId", async (req) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    const trip = await tripService.get(userId, tripId);
    return { data: serializeTripWithItinerary(trip) };
  });

  app.patch("/:tripId", async (req) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    const input = parse(updateTripSchema, req.body);
    const trip = await tripService.update(userId, tripId, input);
    return { data: serializeTrip(trip) };
  });

  app.delete("/:tripId", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    await tripService.remove(userId, tripId);
    return reply.code(204).send();
  });
}
