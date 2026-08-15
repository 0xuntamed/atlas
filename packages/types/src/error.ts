/**
 * Predictable error envelope returned by every API endpoint:
 *   { "error": { "code": "TRIP_NOT_FOUND", "message": "..." } }
 */

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
  TRIP_DAY_NOT_FOUND: "TRIP_DAY_NOT_FOUND",
  TRIP_PLACE_NOT_FOUND: "TRIP_PLACE_NOT_FOUND",
  SAVED_PLACE_NOT_FOUND: "SAVED_PLACE_NOT_FOUND",
  EXPENSE_NOT_FOUND: "EXPENSE_NOT_FOUND",
  DUPLICATE: "DUPLICATE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UPSTREAM_UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    /** Optional field-level validation details. */
    details?: unknown;
  };
}
