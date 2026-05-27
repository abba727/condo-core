/**
 * useExpensesDb
 * Provides database-backed expenses via tRPC.
 * Designed to be a drop-in data source for ExpenseStoreProvider.
 */
import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

const PROJECT_ID = "712-driggs";

// Map DB status → UI status
function mapStatus(s: string | null): string {
  if (!s) return "Pending";
  const map: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    paid: "Paid",
    void: "Rejected",
  };
  return map[s] ?? "Pending";
}

// Map DB method → UI method
function mapMethod(m: string | null): string {
  if (!m) return "Wire";
  const map: Record<string, string> = {
    wire: "Wire",
    ach: "ACH",
    check: "Check",
    zelle: "Zelle",
    deposit: "Deposit",
    other: "Ledger",
  };
  return map[m] ?? "Wire";
}

export function useExpensesDb() {
  const utils = trpc.useUtils();

  const query = trpc.expenses.list.useQuery({ projectId: PROJECT_ID });

  const addMut = trpc.expenses.add.useMutation({
    onSuccess: () => utils.expenses.list.invalidate(),
  });
  const updateMut = trpc.expenses.update.useMutation({
    onSuccess: () => utils.expenses.list.invalidate(),
  });
  const deleteMut = trpc.expenses.delete.useMutation({
    onSuccess: () => utils.expenses.list.invalidate(),
  });

  // Map DB rows to the shape expected by ExpenseStoreProvider2
  const expenses = (query.data ?? []).map((row) => ({
    id: row.id,
    date: row.expenseDate ?? "",
    vendor: row.vendorName ?? "",
    desc: row.description ?? "",
    division: row.division ?? "",
    amount: Number(row.amount ?? 0),
    status: mapStatus(row.status),
    method: mapMethod(row.method),
    invoice: row.invoiceNumber ?? "",
    reference: row.referenceNumber ?? "",
    notes: row.notes ?? "",
    balance: 0,
  }));

  const addExpense = useCallback(
    (exp: Record<string, unknown>) => {
      const statusMap: Record<string, "pending" | "approved" | "paid" | "void"> = {
        Pending: "pending",
        Approved: "approved",
        Paid: "paid",
        Rejected: "void",
      };
      const methodMap: Record<string, "wire" | "ach" | "check" | "zelle" | "deposit" | "other"> = {
        Wire: "wire",
        ACH: "ach",
        Check: "check",
        Zelle: "zelle",
        Deposit: "deposit",
        Ledger: "other",
      };
      addMut.mutate({
        projectId: PROJECT_ID,
        vendorName: String(exp.vendor ?? ""),
        description: String(exp.desc ?? ""),
        division: String(exp.division ?? ""),
        amount: Number(exp.amount ?? 0),
        expenseDate: String(exp.date ?? ""),
        method: methodMap[String(exp.method ?? "Wire")] ?? "wire",
        invoiceNumber: String(exp.invoice ?? ""),
        referenceNumber: String(exp.reference ?? ""),
        status: statusMap[String(exp.status ?? "Pending")] ?? "pending",
        notes: String(exp.notes ?? ""),
      });
    },
    [addMut]
  );

  const updateExpense = useCallback(
    (id: string, patch: Record<string, unknown>) => {
      const statusMap: Record<string, "pending" | "approved" | "paid" | "void"> = {
        Pending: "pending",
        Approved: "approved",
        Paid: "paid",
        Rejected: "void",
      };
      const methodMap: Record<string, "wire" | "ach" | "check" | "zelle" | "deposit" | "other"> = {
        Wire: "wire",
        ACH: "ach",
        Check: "check",
        Zelle: "zelle",
        Deposit: "deposit",
        Ledger: "other",
      };
      updateMut.mutate({
        id,
        vendorName: patch.vendor as string | undefined,
        description: patch.desc as string | undefined,
        division: patch.division as string | undefined,
        amount: patch.amount as number | undefined,
        expenseDate: patch.date as string | undefined,
        method: patch.method ? methodMap[String(patch.method)] ?? "wire" : undefined,
        invoiceNumber: patch.invoice as string | undefined,
        referenceNumber: patch.reference as string | undefined,
        status: patch.status ? statusMap[String(patch.status)] ?? "pending" : undefined,
        notes: patch.notes as string | undefined,
      });
    },
    [updateMut]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      deleteMut.mutate({ id });
    },
    [deleteMut]
  );

  return {
    expenses,
    isLoading: query.isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
