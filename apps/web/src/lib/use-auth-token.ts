"use client";

import { useAuth } from "@clerk/nextjs";
import { isMockAuth } from "./auth-mode";

/**
 * Returns a function that resolves the current session token, or null in mock
 * mode (the API ignores it there). The concrete hook is chosen once at module
 * load so we never call a Clerk hook outside a ClerkProvider.
 */
function useClerkToken() {
  const { getToken } = useAuth();
  return getToken;
}

function useMockToken() {
  return async (): Promise<string | null> => null;
}

export const useAuthToken = isMockAuth ? useMockToken : useClerkToken;
