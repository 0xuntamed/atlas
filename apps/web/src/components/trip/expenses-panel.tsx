"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpenseCategory } from "@atlas/types";
import { useAddExpense, useDeleteExpense, useExpenses } from "@/lib/hooks";
import type { ExpenseDTO, ExpenseTotal } from "@/lib/types";
import {
  Button,
  EmptyState,
  Field,
  Label,
  Note,
  Plate,
} from "@/components/ui/primitives";
import { Close } from "@/components/ui/icons";

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

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });

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
    <div className="space-y-8">
      <ExpenseForm tripId={tripId} />

      {isLoading ? (
        <Note>Opening the ledger…</Note>
      ) : (expenses?.length ?? 0) === 0 ? (
        <EmptyState
          title="The ledger is empty"
          body="Log flights, lodging, meals and the rest as you go — the trip's cost adds itself up here, per currency."
        />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ink/25">
              <th className="hidden w-20 py-2 text-left sm:table-cell">
                <Label as="span">Date</Label>
              </th>
              <th className="w-28 py-2 text-left">
                <Label as="span">Kind</Label>
              </th>
              <th className="py-2 text-left">
                <Label as="span">Note</Label>
              </th>
              <th className="py-2 text-right">
                <Label as="span">Amount</Label>
              </th>
              <th className="w-8" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {expenses!.map((e) => (
                <ExpenseRow key={e.id} tripId={tripId} expense={e} />
              ))}
            </AnimatePresence>
          </tbody>
          <tfoot>
            {totals.map((t, i) => (
              <tr
                key={t.currency}
                className={i === 0 ? "border-t-[3px] border-double border-ink/60" : ""}
              >
                {/* Date column placeholder — hidden on mobile like its header. */}
                <td className="hidden sm:table-cell" />
                <td colSpan={2} className="pr-4 pt-3 text-right">
                  <Label as="span">Total · {t.currency}</Label>
                </td>
                <td className="whitespace-nowrap pt-3 text-right font-mono text-base font-medium tabular-nums text-ink">
                  {fmtMoney(t.total, t.currency)}
                </td>
                <td />
              </tr>
            ))}
          </tfoot>
        </table>
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
    <Plate className="p-5 sm:p-6">
      <form
        onSubmit={submit}
        className="grid grid-cols-2 items-end gap-x-5 gap-y-5 sm:grid-cols-[7rem_5rem_9rem_1fr_auto]"
      >
        <Field label="Amount">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            placeholder="0.00"
            className="field font-mono tabular-nums"
          />
        </Field>

        <Field label="Currency">
          <input
            value={currency}
            onChange={(ev) =>
              setCurrency(ev.target.value.toUpperCase().slice(0, 3))
            }
            maxLength={3}
            className="field font-mono uppercase tracking-[0.15em]"
          />
        </Field>

        <Field label="Kind">
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            className="field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c] ?? c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Note" className="col-span-2 sm:col-span-1">
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="e.g. Round-trip flight"
            maxLength={280}
            className="field"
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          disabled={addExpense.isPending || !amount}
          className="col-span-2 sm:col-span-1"
        >
          {addExpense.isPending ? "Entering…" : "Enter"}
        </Button>
      </form>
      {addExpense.isError && (
        <Note tone="error" className="mt-3">
          {(addExpense.error as Error).message}
        </Note>
      )}
    </Plate>
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
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-ink/10"
    >
      <td className="hidden whitespace-nowrap py-3 pr-3 align-top font-mono text-[0.68rem] uppercase tracking-label text-ink/70 sm:table-cell">
        {fmtDate(expense.createdAt)}
      </td>
      <td className="py-3 pr-3 align-top font-mono text-[0.68rem] uppercase tracking-label text-ink/70">
        {CATEGORY_LABEL[expense.category] ?? expense.category}
      </td>
      <td className="py-3 pr-3 align-top text-sm text-ink/85">
        {expense.description || <span className="text-ink/55">—</span>}
      </td>
      <td className="whitespace-nowrap py-3 text-right align-top font-mono text-sm tabular-nums text-ink">
        {fmtMoney(expense.amount, expense.currency)}
      </td>
      <td className="py-2 text-right align-top">
        <button
          onClick={() => deleteExpense.mutate(expense.id)}
          disabled={deleteExpense.isPending}
          aria-label="Delete expense"
          title="Delete expense"
          className="p-1 text-ink/50 transition hover:text-[#9b2c2c] disabled:opacity-40"
        >
          <Close size={13} />
        </button>
      </td>
    </motion.tr>
  );
}
