import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth";
import { passportService } from "./passport.service";

/** GET /api/passport — visited countries as passport stamps. */
export async function passportRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (req) => {
    const { userId } = requireAuth(req);
    const stamps = await passportService.stamps(userId);
    return { data: stamps };
  });
}
