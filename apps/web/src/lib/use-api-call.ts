"use client";

import { apiFetch } from "./api-client";
import { useAuthToken } from "./use-auth-token";

/**
 * Returns a token-bound API caller. In mock mode the token is null and the API
 * ignores it; in Clerk mode it carries the session JWT.
 */
export function useApiCall() {
  const getToken = useAuthToken();
  return async <T>(
    path: string,
    opts: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown } = {},
  ): Promise<T> => {
    const token = await getToken();
    return apiFetch<T>(path, { ...opts, token });
  };
}
