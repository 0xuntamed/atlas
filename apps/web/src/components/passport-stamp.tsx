"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { PassportStampDTO } from "@atlas/types";

const ROTATIONS = [-5, 3, -2, 4, -4, 2, -3, 5];

/**
 * A passport stamp. Animates in with a spring "press" — it starts oversized and
 * settles onto the page, the way an inked stamp lands. Used both in the passport
 * grid and as the celebratory overlay when a trip is completed.
 *
 * Inked in the visited green (the same hue the globe uses for a visited
 * country), with engraved caps for the name and mono for the date — the
 * lettering of a real entry stamp.
 */
export function PassportStamp({
  stamp,
  index = 0,
  size = "md",
}: {
  stamp: Pick<
    PassportStampDTO,
    "code" | "name" | "flag" | "firstVisitedAt" | "visitCount"
  >;
  index?: number;
  size?: "md" | "lg";
}) {
  const date = stamp.firstVisitedAt ? new Date(stamp.firstVisitedAt) : null;
  const dateLabel = date
    ? date
        .toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase()
    : "";
  const rotate = ROTATIONS[index % ROTATIONS.length]!;
  const big = size === "lg";

  return (
    <motion.div
      initial={{ opacity: 0, scale: big ? 2.2 : 1.5, rotate: rotate * 2 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 15,
        delay: index * 0.06,
      }}
      className={clsx(
        "relative grid place-items-center border-[3px] border-double text-center mix-blend-multiply",
        big
          ? "h-56 w-56 border-[#8a5a3c] text-[#8a5a3c]"
          : "h-40 w-40 border-emerald-800/75 text-emerald-900/85",
      )}
    >
      {/* faint circular postmark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-full border border-dashed border-current opacity-35"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2.5 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.3em] opacity-70"
      >
        Entry
      </span>
      <div className="px-3">
        <div
          className={clsx(
            "font-display font-bold leading-none tracking-[0.12em]",
            big ? "text-5xl" : "text-4xl",
          )}
        >
          {stamp.code.toUpperCase()}
        </div>
        <div
          className={clsx(
            "mt-2 font-display font-semibold uppercase leading-tight tracking-[0.08em] [text-wrap:balance]",
            big ? "text-lg" : "text-xs",
          )}
        >
          {stamp.name}
        </div>
        <div className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] opacity-85">
          {dateLabel}
        </div>
        {stamp.visitCount > 1 && (
          <div className="mt-0.5 font-mono text-[0.62rem] tracking-[0.15em] opacity-75">
            ×{stamp.visitCount}
          </div>
        )}
      </div>
    </motion.div>
  );
}
