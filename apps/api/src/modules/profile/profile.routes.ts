import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth";
import { profileService } from "./profile.service";

/** GET /api/profile/stats — the user's travel statistics. */
export async function profileRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/stats", async (req) => {
    const { userId } = requireAuth(req);
    const stats = await profileService.stats(userId);
    return { data: stats };
  });
}
