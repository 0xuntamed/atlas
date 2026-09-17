"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Compass } from "@/components/ui/icons";
import { HeaderAuth } from "@/components/auth";

const NAV = [
  { href: "/world", label: "World" },
  { href: "/countries", label: "Explore" },
  { href: "/trips", label: "Trips" },
  { href: "/saved", label: "Saved" },
  { href: "/passport", label: "Passport" },
  { href: "/profile", label: "Profile" },
];

/**
 * The chart's title strip. On the landing it sits on the night chart (dark);
 * inside the app it rules the top of the parchment page. Nav labels are mono
 * marginalia; the active route is underscored in brass.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const onChart = pathname === "/";

  return (
    <header
      className={clsx(
        "relative z-20 border-b",
        onChart
          ? "border-graticule/20 bg-chart text-parchment"
          : "border-brass/50 bg-parchment/85 text-ink backdrop-blur-[2px]",
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 px-5 py-3 sm:px-6">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.12em]",
            onChart ? "text-parchment" : "text-ink",
          )}
        >
          <Compass
            size={18}
            className={onChart ? "text-brass-bright" : "text-brass-ink"}
          />
          ATLAS
        </Link>

        <nav
          aria-label="Primary"
          className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,#000_0,#000_calc(100%-2.5rem),transparent)] sm:[mask-image:none]"
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative shrink-0 px-2.5 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-label transition",
                  onChart
                    ? active
                      ? "text-brass-bright"
                      : "text-parchment/70 hover:text-parchment"
                    : active
                      ? "text-brass-ink"
                      : "text-ink/70 hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={clsx(
                    "absolute inset-x-2.5 -bottom-[13px] h-px transition-opacity",
                    onChart ? "bg-brass-bright" : "bg-brass-ink",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
          <span className="ml-2 shrink-0">
            <HeaderAuth onChart={onChart} />
          </span>
        </nav>
      </div>
    </header>
  );
}
