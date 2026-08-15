import { ErrorCode } from "@atlas/types";

/**
 * Application-level error carrying an HTTP status and a stable machine code.
 * Thrown anywhere in services; translated to the standard envelope by the
 * global error handler.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (code: ErrorCode, message: string) =>
  new AppError(404, code, message);

export const forbidden = (message = "You do not have access to this resource") =>
  new AppError(403, ErrorCode.FORBIDDEN, message);

export const unauthorized = (message = "Authentication required") =>
  new AppError(401, ErrorCode.UNAUTHORIZED, message);

export const duplicate = (message: string) =>
  new AppError(409, ErrorCode.DUPLICATE, message);
