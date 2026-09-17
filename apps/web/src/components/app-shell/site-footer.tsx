"use client";

import { usePathname } from "next/navigation";

/**
 * Chart marginalia at the foot of every interior page — the same notes the
 * landing's chart carries, so the page still reads as a sheet from the same
 * atlas. Hidden on the landing, which draws its own.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-brass/40 px-5 py-5 font-mono text-[0.62rem] uppercase tracking-label text-ink/60 sm:px-6">
      <span>Chart no. 001 — Personal</span>
      <span>Scale 1 : the whole world</span>
    </footer>
  );
}
