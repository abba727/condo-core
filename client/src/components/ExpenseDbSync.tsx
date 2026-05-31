/**
 * ExpenseDbSync
 *
 * Sits inside the ExpenseStoreProvider2 tree and watches for changes to the
 * expenses state. When changes are detected, it fires the appropriate
 * tRPC mutations to keep the database in sync.
 */
import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface Expense {
  id: string;
  date?: string;
  vendor?: string;
  vendorId?: number | null;
  description?: string;
  division?: string;
  amount?: number;
  status?: string;
  method?: string;
  invoice?: string;
  ref?: string;
  notes?: string;
}

interface ExpenseDbSyncProps {
  expenses: Expense[];
}

function toDbStatus(status: string | undefined): "pending" | "approved" | "paid" | "void" {
  const s = (status ?? "").toLowerCase();
  if (s === "approved") return "approved";
  if (s === "paid") return "paid";
  if (s === "void" || s === "rejected") return "void";
  return "pending";
}

function toDbMethod(method: string | undefined): "wire" | "ach" | "check" | "zelle" | "deposit" | "other" {
  const m = (method ?? "").toLowerCase();
  if (m === "wire") return "wire";
  if (m === "ach") return "ach";
  if (m === "check") return "check";
  if (m === "zelle") return "zelle";
  if (m === "deposit") return "deposit";
  return "other";
}

export function ExpenseDbSync({ expenses }: ExpenseDbSyncProps) {
  const addExpenseMut = trpc.expenses.add.useMutation();
  const updateExpenseMut = trpc.expenses.update.useMutation();
  const deleteExpenseMut = trpc.expenses.delete.useMutation();

  const prevExpensesRef = useRef<Expense[] | null>(null);
  const dbExpenseIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!expenses) return;

    // On first render, snapshot the current state as the DB baseline
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevExpensesRef.current = expenses;
      expenses.forEach((e) => dbExpenseIdsRef.current.add(e.id));
      return;
    }

    const prev = prevExpensesRef.current;
    if (!prev) {
      prevExpensesRef.current = expenses;
      return;
    }

    // Skip if nothing changed
    if (JSON.stringify(prev) === JSON.stringify(expenses)) return;

    const prevIds = new Set(prev.map((e) => e.id));
    const currIds = new Set(expenses.map((e) => e.id));

    // ── Detect deleted expenses ────────────────────────────────────────────
    for (const e of prev) {
      if (!currIds.has(e.id) && dbExpenseIdsRef.current.has(e.id)) {
        // Only delete DB records (IDs starting with "exp-" are DB IDs from seed)
        deleteExpenseMut.mutate({ id: e.id });
        dbExpenseIdsRef.current.delete(e.id);
      }
    }

    // ── Detect added expenses ──────────────────────────────────────────────
    for (const e of expenses) {
      if (!prevIds.has(e.id) && !dbExpenseIdsRef.current.has(e.id)) {
        addExpenseMut.mutate({
          projectId: "712-driggs",
          vendorId: e.vendorId ?? null,
          vendorName: e.vendor,
          description: e.description,
          division: e.division,
          amount: e.amount ?? 0,
          expenseDate: e.date ?? null,
          method: toDbMethod(e.method),
          referenceNumber: e.ref,
          invoiceNumber: e.invoice,
          status: toDbStatus(e.status),
          notes: e.notes,
        });
        dbExpenseIdsRef.current.add(e.id);
      }
    }

    // ── Detect updated expenses ────────────────────────────────────────────
    for (const e of expenses) {
      const prevE = prev.find((p) => p.id === e.id);
      if (!prevE) continue;
      if (!dbExpenseIdsRef.current.has(e.id)) continue;

      const changed =
        prevE.date !== e.date ||
        prevE.vendor !== e.vendor ||
        prevE.vendorId !== e.vendorId ||
        prevE.description !== e.description ||
        prevE.division !== e.division ||
        prevE.amount !== e.amount ||
        prevE.status !== e.status ||
        prevE.method !== e.method ||
        prevE.invoice !== e.invoice ||
        prevE.ref !== e.ref ||
        prevE.notes !== e.notes;

      if (changed) {
        updateExpenseMut.mutate({
          id: e.id,
          vendorId: e.vendorId ?? null,
          vendorName: e.vendor,
          description: e.description,
          division: e.division,
          amount: e.amount,
          expenseDate: e.date ?? null,
          method: toDbMethod(e.method),
          referenceNumber: e.ref,
          invoiceNumber: e.invoice,
          status: toDbStatus(e.status),
          notes: e.notes,
        });
      }
    }

    prevExpensesRef.current = expenses;
  }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
