"use client";

import { motion } from "framer-motion";
import { useProfileStats } from "@/lib/discovery-hooks";
import { CountUp } from "@/components/count-up";

function Stat({
  value,
  label,
  format,
  delay,
}: {
  value: number;
  label: string;
  format?: (n: number) => string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-6xl font-semibold tracking-tight tabular-nums">
        <CountUp value={value} format={format} />
      </div>
      <div className="mt-1 text-sm uppercase tracking-[0.2em] text-ink/50">
        {label}
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) return <p className="text-ink/60">Loading your world…</p>;
  if (!stats) return null;

  return (
    <section className="space-y-12">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-ink/40">
          Your world
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">
          Travel profile
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
        <Stat value={stats.countriesVisited} label="Countries" delay={0.05} />
        <Stat value={stats.citiesVisited} label="Cities" delay={0.1} />
        <Stat value={stats.tripsCompleted} label="Trips completed" delay={0.15} />
        <Stat
          value={stats.distanceKm}
          label="KM travelled"
          format={(n) => n.toLocaleString()}
          delay={0.2}
        />
        <Stat value={stats.upcomingTrips} label="Upcoming" delay={0.25} />
        {stats.mostVisitedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-3xl font-semibold tracking-tight">
              {stats.mostVisitedCountry.name}
            </div>
            <div className="mt-1 text-sm uppercase tracking-[0.2em] text-ink/50">
              Most visited
            </div>
          </motion.div>
        )}
      </div>

      {stats.tripsCompleted === 0 && (
        <p className="text-sm text-ink/50">
          Complete a trip to start filling in your world.
        </p>
      )}
    </section>
  );
}
