import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { parse } from "../../lib/validate";
import { countryService } from "./country.service";

const searchQuerySchema = z.object({
  search: z.string().trim().optional(),
});

/**
 * Country discovery. Read-only world data (no user scoping), but still behind
 * auth for consistency. Upstream failures surface as 503 via the error handler.
 */
export async function countryRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/", async (req) => {
    const { search } = parse(searchQuerySchema, req.query);
    // Require a couple of characters before hitting the upstream.
    if (!search || search.length < 2) return { data: [] };
    const countries = await countryService.search(search);
    return { data: countries };
  });

  app.get("/:code", async (req) => {
    const { code } = req.params as { code: string };
    const country = await countryService.getByCode(code);
    if (!country) {
      throw notFound(ErrorCode.NOT_FOUND, "Country could not be found");
    }
    return { data: country };
  });
}
