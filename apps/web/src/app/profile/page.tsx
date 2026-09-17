"use client";

import { motion } from "framer-motion";
import { useProfileStats } from "@/lib/discovery-hooks";
import { CountUp } from "@/components/count-up";
import { Note, PageHeader, Plate } from "@/components/ui/primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * One line of the tally: a mono label, a dotted leader, and the figure set in
 * engraved numerals. The count-up is the page's one authored moment.
 */
function TallyRow({
  label,
  value,
  format,
  delay,
  text,
}: {
  label: string;
  value?: number;
  format?: (n: number) => string;
  delay: number;
  text?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
      className="flex items-baseline gap-3 py-4"
    >
      <dt className="shrink-0 font-mono text-[0.68rem] uppercase tracking-label text-ink/70">
        {label}
      </dt>
      <span
        aria-hidden
        className="mb-[0.35em] min-w-6 flex-1 border-b border-dotted border-ink/35"
      />
      <dd className="shrink-0 text-right font-display text-3xl font-semibold tabular-nums leading-none text-ink sm:text-4xl">
        {text ?? <CountUp value={value ?? 0} format={format} />}
      </dd>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) return <Note>Adding it all up…</Note>;
  if (!stats) return null;

  return (
    <section className="space-y-8">
      <PageHeader
        corner="Sheet 04 · Tally"
        title="Your world"
        marginalia={
          stats.tripsCompleted > 0
            ? `${stats.tripsCompleted} ${stats.tripsCompleted === 1 ? "trip" : "trips"} completed · ${stats.distanceKm.toLocaleString()} km logged`
            : "The tally of everywhere you've been"
        }
      />

      <Plate className="max-w-2xl">
        <dl className="divide-y divide-ink/15">
          <TallyRow label="Countries" value={stats.countriesVisited} delay={0.05} />
          <TallyRow label="Cities" value={stats.citiesVisited} delay={0.1} />
          <TallyRow
            label="Trips completed"
            value={stats.tripsCompleted}
            delay={0.15}
          />
          <TallyRow
            label="Distance"
            value={stats.distanceKm}
            format={(n) => `${n.toLocaleString()} km`}
            delay={0.2}
          />
          <TallyRow label="Upcoming" value={stats.upcomingTrips} delay={0.25} />
          {stats.mostVisitedCountry && (
            <TallyRow
              label="Most visited"
              text={stats.mostVisitedCountry.name}
              delay={0.3}
            />
          )}
        </dl>
      </Plate>

      {stats.tripsCompleted === 0 && (
        <Note>Complete a trip to start filling in your world.</Note>
      )}
    </section>
  );
}
