import type { z } from "zod";
import { ZodError } from "zod";
import { ErrorCode } from "@atlas/types";
import { AppError } from "./errors";

/**
 * Parse untrusted input against a Zod schema, converting failures into the
 * standard validation error envelope instead of a 500.
 */
export function parse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError(
        400,
        ErrorCode.VALIDATION_ERROR,
        "Request validation failed",
        err.flatten(),
      );
    }
    throw err;
  }
}
