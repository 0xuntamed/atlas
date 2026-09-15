"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpenseCategory } from "@atlas/types";
import { useAddExpense, useDeleteExpense, useExpenses } from "@/lib/hooks";
import type { ExpenseDTO, ExpenseTotal } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  FLIGHT: "Flight",
  HOTEL: "Hotel",
  FOOD: "Food",
  TRANSPORT: "Transport",
  ACTIVITY: "Activity",
  SHOPPING: "Shopping",
  OTHER: "Other",
};

const CATEGORIES = Object.values(ExpenseCategory);

const fmtMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/** Per-currency roll-up, derived from the list so the ledger has one source. */
function totalsByCurrency(expenses: ExpenseDTO[]): ExpenseTotal[] {
  const byCurrency = new Map<string, number>();
  for (const e of expenses) {
    byCurrency.set(e.currency, (byCurrency.get(e.currency) ?? 0) + e.amount);
  }
  return [...byCurrency.entries()]
    .map(([currency, total]) => ({
      currency,
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => b.total - a.total);
}

export function ExpensesPanel({ tripId }: { tripId: string }) {
  const { data: expenses, isLoading } = useExpenses(tripId);
  const totals = useMemo(
    () => totalsByCurrency(expenses ?? []),
    [expenses],
  );

  return (
    <div className="space-y-6">
      <ExpenseForm tripId={tripId} />

      {totals.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {totals.map((t) => (
            <div
              key={t.currency}
              className="rounded-2xl border border-ink/10 bg-white/50 px-5 py-3"
            >
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink/45">
                Total · {t.currency}
              </p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                {fmtMoney(t.total, t.currency)}
              </p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-ink/50">Loading expenses…</p>
      ) : (expenses?.length ?? 0) === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink/60">
          No expenses logged yet. Add flights, lodging, food and more to see
          what this trip costs.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white/40">
          <AnimatePresence initial={false}>
            {expenses!.map((e) => (
              <ExpenseRow key={e.id} tripId={tripId} expense={e} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function ExpenseForm({ tripId }: { tripId: string }) {
  const addExpense = useAddExpense(tripId);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState<string>(ExpenseCategory.OTHER);
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    addExpense.mutate(
      {
        amount: value,
        currency: currency.trim() || "USD",
        category: category as (typeof ExpenseCategory)[keyof typeof ExpenseCategory],
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setAmount("");
          setDescription("");
        },
      },
    );
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-ink/10 bg-white/40 p-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-ink/45">
          Amount
        </span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          placeholder="0.00"
          className="w-28 rounded-lg border border-ink/15 bg-white/70 px-3 py-2 text-sm tabular-nums"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-ink/45">
          Currency
        </span>
        <input
          value={currency}
          onChange={(ev) => setCurrency(ev.target.value.toUpperCase().slice(0, 3))}
          maxLength={3}
          className="w-20 rounded-lg border border-ink/15 bg-white/70 px-3 py-2 text-sm uppercase"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-ink/45">
          Category
        </span>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
          className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c] ?? c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 flex-col gap-1" style={{ minWidth: "12rem" }}>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-ink/45">
          Note
        </span>
        <input
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="e.g. Round-trip flight"
          maxLength={280}
          className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={addExpense.isPending || !amount}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-parchment disabled:opacity-50"
      >
        {addExpense.isPending ? "Adding…" : "Add expense"}
      </button>
    </form>
  );
}

function ExpenseRow({
  tripId,
  expense,
}: {
  tripId: string;
  expense: ExpenseDTO;
}) {
  const deleteExpense = useDeleteExpense(tripId);

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-4 px-4 py-3"
    >
      <span className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-ink/60">
        {CATEGORY_LABEL[expense.category] ?? expense.category}
      </span>
      <span className="flex-1 truncate text-sm text-ink/80">
        {expense.description || (
          <span className="text-ink/40">No note</span>
        )}
      </span>
      <span className="text-sm font-semibold tabular-nums">
        {fmtMoney(expense.amount, expense.currency)}
      </span>
      <button
        onClick={() => deleteExpense.mutate(expense.id)}
        disabled={deleteExpense.isPending}
        title="Delete expense"
        className="text-xs text-ink/40 hover:text-red-700 disabled:opacity-40"
      >
        ✕
      </button>
    </motion.li>
  );
}
