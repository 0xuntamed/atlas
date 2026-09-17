"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TripStatus } from "@atlas/types";
import { useCreateTrip } from "@/lib/hooks";
import {
  Button,
  Field,
  Note,
  PageHeader,
  Plate,
} from "@/components/ui/primitives";
import { TRIP_STATUS_LABEL } from "@/components/trip/status-mark";

export default function NewTripPage() {
  return (
    <Suspense fallback={null}>
      <NewTripForm />
    </Suspense>
  );
}

function NewTripForm() {
  const router = useRouter();
  const params = useSearchParams();
  const createTrip = useCreateTrip();

  // Prefill when arriving from a country's "Plan a trip" button.
  const [title, setTitle] = useState(params.get("title") ?? "");
  const [countryCode, setCountryCode] = useState(
    (params.get("country") ?? "").toUpperCase(),
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<TripStatus>(TripStatus.DRAFT);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrip.mutate(
      {
        title,
        countryCode,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      { onSuccess: (trip) => router.push(`/trips/${trip.id}`) },
    );
  };

  return (
    <section className="space-y-8">
      <PageHeader
        title="New trip"
        marginalia="A new line in the log"
        back={{ href: "/trips", label: "All trips" }}
      />

      <Plate className="max-w-xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <Field label="Title">
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Japan 2026"
              className="field text-lg"
            />
          </Field>

          <div className="grid grid-cols-[8rem_1fr] gap-6">
            <Field label="Country" hint="ISO code, e.g. JP">
              <input
                required
                value={countryCode}
                onChange={(e) =>
                  setCountryCode(e.target.value.toUpperCase().slice(0, 2))
                }
                maxLength={2}
                placeholder="JP"
                className="field font-mono uppercase tracking-[0.2em]"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TripStatus)}
                className="field"
              >
                {Object.values(TripStatus).map((s) => (
                  <option key={s} value={s}>
                    {TRIP_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Departs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="field font-mono text-sm"
              />
            </Field>
            <Field label="Returns">
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="field font-mono text-sm"
              />
            </Field>
          </div>

          {createTrip.isError && (
            <Note tone="error">{(createTrip.error as Error).message}</Note>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              cartouche
              disabled={createTrip.isPending}
            >
              {createTrip.isPending ? "Writing…" : "Create trip"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Plate>
    </section>
  );
}
