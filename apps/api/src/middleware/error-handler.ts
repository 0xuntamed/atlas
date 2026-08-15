import type { FastifyError, FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ErrorCode, type ApiErrorBody } from "@atlas/types";
import { AppError } from "../lib/errors";
import { reportError } from "../lib/observability";

function envelope(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ApiErrorBody {
  return { error: { code, message, ...(details ? { details } : {}) } };
}

/**
 * Single translation point from thrown errors to the standard API envelope.
 * Keeps handlers free of try/catch and guarantees a predictable shape.
 */
export function registerErrorHandler(app: FastifyInstance) {
  app.setNotFoundHandler((req, reply) => {
    reply
      .code(404)
      .send(envelope(ErrorCode.NOT_FOUND, `Route ${req.method} ${req.url} not found`));
  });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    if (err instanceof AppError) {
      return reply
        .code(err.statusCode)
        .send(envelope(err.code, err.message, err.details));
    }

    if (err instanceof ZodError) {
      return reply
        .code(400)
        .send(
          envelope(
            ErrorCode.VALIDATION_ERROR,
            "Request validation failed",
            err.flatten(),
          ),
        );
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return reply
          .code(404)
          .send(envelope(ErrorCode.NOT_FOUND, "Resource not found"));
      }
      if (err.code === "P2002") {
        return reply
          .code(409)
          .send(envelope(ErrorCode.DUPLICATE, "Resource already exists"));
      }
    }

    // Fastify's own validation / payload errors carry a statusCode < 500.
    if (typeof err.statusCode === "number" && err.statusCode < 500) {
      return reply
        .code(err.statusCode)
        .send(envelope(ErrorCode.VALIDATION_ERROR, err.message));
    }

    reportError(req.log, err, {
      reqId: req.id,
      userId: req.auth?.userId,
      route: req.routeOptions?.url ?? req.url,
    });
    return reply
      .code(500)
      .send(envelope(ErrorCode.INTERNAL_ERROR, "Something went wrong"));
  });
}
