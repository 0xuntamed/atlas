"use client";

import { motion } from "framer-motion";
import type { PassportStampDTO } from "@atlas/types";

const ROTATIONS = [-5, 3, -2, 4, -4, 2, -3, 5];

/**
 * A passport stamp. Animates in with a spring "press" — it starts oversized and
 * settles onto the page, the way an inked stamp lands. Used both in the passport
 * grid and as the celebratory overlay when a trip is completed.
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
        .toLocaleDateString(undefined, { month: "short", year: "numeric" })
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
      className={
        "relative grid place-items-center rounded-2xl border-2 border-double text-center " +
        (big
          ? "h-56 w-56 border-[#8a5a3c] text-[#8a5a3c]"
          : "h-40 w-40 border-emerald-800/70 text-emerald-900/80")
      }
      style={{ boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.04)" }}
    >
      {/* faint circular postmark */}
      <span className="pointer-events-none absolute inset-2 rounded-full border border-dashed border-current opacity-30" />
      <div className="px-3">
        <div className={big ? "text-5xl" : "text-4xl"}>{stamp.flag ?? "🌍"}</div>
        <div
          className={
            "mt-1 font-semibold uppercase tracking-[0.15em] " +
            (big ? "text-lg" : "text-sm")
          }
        >
          {stamp.name}
        </div>
        <div className="mt-0.5 text-[11px] tracking-widest opacity-80">
          {dateLabel}
        </div>
        {stamp.visitCount > 1 && (
          <div className="mt-0.5 text-[11px] opacity-70">
            ×{stamp.visitCount} visits
          </div>
        )}
      </div>
    </motion.div>
  );
}
