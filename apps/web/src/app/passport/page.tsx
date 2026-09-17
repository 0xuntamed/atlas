"use client";

import { usePassport } from "@/lib/discovery-hooks";
import { PassportStamp } from "@/components/passport-stamp";
import {
  ButtonLink,
  EmptyState,
  Note,
  PageHeader,
  Plate,
} from "@/components/ui/primitives";

export default function PassportPage() {
  const { data: stamps, isLoading } = usePassport();

  const first = stamps?.length
    ? stamps
        .map((s) => (s.firstVisitedAt ? new Date(s.firstVisitedAt) : null))
        .filter((d): d is Date => Boolean(d))
        .sort((a, b) => a.getTime() - b.getTime())[0]
    : null;

  return (
    <section className="space-y-8">
      <PageHeader
        corner="Sheet 03 · Passport"
        title="Passport"
        marginalia={
          stamps && stamps.length > 0
            ? `${stamps.length} ${stamps.length === 1 ? "stamp" : "stamps"}${
                first
                  ? ` · first entry ${first.toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}`
                  : ""
              }`
            : "Everywhere you've been"
        }
      />

      {isLoading && <Note>Turning the pages…</Note>}

      {stamps && stamps.length === 0 && (
        <EmptyState
          title="No stamps yet"
          body="Mark a trip as completed and its country is stamped in here — the passport fills as you go."
          action={
            <ButtonLink href="/trips" variant="primary" cartouche>
              Go to your trips
            </ButtonLink>
          }
        />
      )}

      {stamps && stamps.length > 0 && (
        <Plate className="p-8 sm:p-12">
          <div className="flex flex-wrap justify-center gap-8 sm:justify-start">
            {stamps.map((stamp, i) => (
              <PassportStamp key={stamp.code} stamp={stamp} index={i} />
            ))}
          </div>
        </Plate>
      )}
    </section>
  );
}
