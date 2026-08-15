"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TripStatus } from "@atlas/types";
import { useCreateTrip } from "@/lib/hooks";

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
    <section className="max-w-lg space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">New trip</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Title">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Japan 2026"
            className="input"
          />
        </Field>

        <Field label="Country code (ISO alpha-2)">
          <input
            required
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            maxLength={2}
            placeholder="JP"
            className="input uppercase"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TripStatus)}
            className="input"
          >
            {Object.values(TripStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        {createTrip.isError && (
          <p className="text-sm text-red-700">
            {(createTrip.error as Error).message}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={createTrip.isPending}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-parchment disabled:opacity-50"
          >
            {createTrip.isPending ? "Creating…" : "Create trip"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full px-6 py-3 text-sm font-medium text-ink/60"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(18 16 14 / 0.15);
          background: rgb(255 255 255 / 0.6);
          padding: 0.625rem 0.75rem;
          font-size: 0.95rem;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
