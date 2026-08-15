"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { isMockAuth } from "@/lib/auth-mode";

/** Wraps the app in ClerkProvider, or nothing when running in mock mode. */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (isMockAuth) return <>{children}</>;
  return <ClerkProvider>{children}</ClerkProvider>;
}

function AppNavLinks() {
  return (
    <>
      <Link href="/world" className="hover:underline">
        World
      </Link>
      <Link href="/countries" className="hover:underline">
        Explore
      </Link>
      <Link href="/trips" className="hover:underline">
        Trips
      </Link>
      <Link href="/saved" className="hover:underline">
        Saved
      </Link>
      <Link href="/passport" className="hover:underline">
        Passport
      </Link>
      <Link href="/profile" className="hover:underline">
        Profile
      </Link>
    </>
  );
}

/** Header nav auth controls. */
export function HeaderAuth() {
  if (isMockAuth) {
    return (
      <>
        <AppNavLinks />
        <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs text-ink/60">
          dev
        </span>
      </>
    );
  }
  return (
    <>
      <SignedIn>
        <AppNavLinks />
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="hover:underline">
          Sign in
        </Link>
      </SignedOut>
    </>
  );
}
