"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { isMockAuth } from "@/lib/auth-mode";

/** Wraps the app in ClerkProvider, or nothing when running in mock mode. */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (isMockAuth) return <>{children}</>;
  return <ClerkProvider>{children}</ClerkProvider>;
}

/**
 * Header auth control. Primary navigation lives in the site header; this only
 * renders the identity affordance (a "dev" mark in mock mode, Clerk's user
 * button or a sign-in link otherwise).
 */
export function HeaderAuth({ onChart = false }: { onChart?: boolean }) {
  if (isMockAuth) {
    return (
      <span
        title="Mock auth — shared dev user"
        className={clsx(
          "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-label",
          onChart
            ? "border-graticule/30 text-parchment/70"
            : "border-ink/20 text-ink/70",
        )}
      >
        <span
          aria-hidden
          className={clsx(
            "h-1.5 w-1.5 rounded-full",
            onChart ? "bg-brass-bright" : "bg-brass-ink",
          )}
        />
        dev
      </span>
    );
  }
  return (
    <>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className={clsx(
            "font-mono text-[0.68rem] font-medium uppercase tracking-label transition",
            onChart
              ? "text-parchment/70 hover:text-parchment"
              : "text-ink/70 hover:text-ink",
          )}
        >
          Sign in
        </Link>
      </SignedOut>
    </>
  );
}
