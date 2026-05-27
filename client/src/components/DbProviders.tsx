/**
 * DbProviders
 * Wraps the CondoCore app with database-backed context providers.
 * Replaces the localStorage-backed BudgetStoreProvider, ExpenseStoreProvider2,
 * and VendorStoreProvider with database-backed equivalents.
 *
 * The DB hooks fetch data from the tRPC API and expose the same interface
 * as the original localStorage stores, so no UI components need to change.
 */
import React, { createContext, useContext, useCallback } from "react";
import { useBudgetDb } from "@/hooks/useBudgetDb";
import { useExpensesDb } from "@/hooks/useExpensesDb";
import { useVendorsDb } from "@/hooks/useVendorsDb";

// ─── Budget Context (replaces BudgetStoreCtx in FinancialsModule.jsx) ─────────
const DbBudgetCtx = createContext<ReturnType<typeof useBudgetDb> | null>(null);

export function DbBudgetProvider({ children }: { children: React.ReactNode }) {
  const db = useBudgetDb();
  return <DbBudgetCtx.Provider value={db}>{children}</DbBudgetCtx.Provider>;
}

export function useDbBudget() {
  return useContext(DbBudgetCtx);
}

// ─── Expense Context (replaces ExpenseStoreCtx2 in FinancialsModule.jsx) ──────
const DbExpenseCtx = createContext<ReturnType<typeof useExpensesDb> | null>(null);

export function DbExpenseProvider({ children }: { children: React.ReactNode }) {
  const db = useExpensesDb();
  return <DbExpenseCtx.Provider value={db}>{children}</DbExpenseCtx.Provider>;
}

export function useDbExpenses() {
  return useContext(DbExpenseCtx);
}

// ─── Vendor Context (replaces VendorStoreCtx in VendorsModule.jsx) ────────────
const DbVendorCtx = createContext<ReturnType<typeof useVendorsDb> | null>(null);

export function DbVendorProvider({ children }: { children: React.ReactNode }) {
  const db = useVendorsDb();
  return <DbVendorCtx.Provider value={db}>{children}</DbVendorCtx.Provider>;
}

export function useDbVendors() {
  return useContext(DbVendorCtx);
}

// ─── Combined wrapper ──────────────────────────────────────────────────────────
export function DbProviders({ children }: { children: React.ReactNode }) {
  return (
    <DbBudgetProvider>
      <DbExpenseProvider>
        <DbVendorProvider>{children}</DbVendorProvider>
      </DbExpenseProvider>
    </DbBudgetProvider>
  );
}
