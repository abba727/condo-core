/**
 * DbBridgeProviders
 *
 * Ensures database data is loaded into localStorage BEFORE the legacy
 * CondoCore store providers initialize. This prevents stale localStorage
 * data from being shown on first render.
 *
 * Strategy:
 * 1. Fetch all DB data via tRPC queries (budget groups/lines, expenses, vendors)
 * 2. While loading, show a minimal loading indicator
 * 3. Once loaded, write the data to the localStorage keys the legacy stores use
 * 4. Then render children (CondoCore) — the legacy stores will read fresh DB data
 *
 * On subsequent renders (after initial mount), the legacy stores handle their
 * own state. Mutations go through the legacy stores (localStorage) AND are
 * mirrored to the DB via the DB hooks.
 */
import React, { useEffect, useState } from "react";
import { useBudgetDb } from "@/hooks/useBudgetDb";
import { useExpensesDb } from "@/hooks/useExpensesDb";
import { useVendorsDb } from "@/hooks/useVendorsDb";

// Storage keys used by the legacy stores
const BUDGET_GROUPS_STORAGE_KEY = "cc_budget_groups_v2";
const EXP_STORAGE_KEY = "cc_expenses_v3";
const STORAGE_KEY_VENDORS = "cc_vendors_v2";
const STORAGE_KEY_PROJECT_IDS = "cc_project_vendor_ids_v2";

function DbSyncGate({ children }: { children: React.ReactNode }) {
  const budget = useBudgetDb();
  const expenses = useExpensesDb();
  const vendors = useVendorsDb();
  const [ready, setReady] = useState(false);

  const isLoading = budget.isLoading || expenses.isLoading || vendors.isLoading;

  useEffect(() => {
    if (isLoading) return;
    if (ready) return;

    // Transform and write budget groups to localStorage
    if (budget.groups.length > 0) {
      const groups = budget.groups.map((g, gi) => {
        const groupCsi = String(gi + 1).padStart(2, "0");
        return {
          id: g.id,
          label: g.label,
          csi: groupCsi,
          csiGroupId: g.id,
          collapsed: g.collapsed ?? false,
          order: g.order ?? gi,
          isContingencyGroup: g.isContingencyGroup ?? false,
          lines: (g.lines ?? []).map((l, li) => ({
            id: l.id,
            name: l.name,
            budget: l.budget ?? 0,
            committed: l.committed ?? 0,
            spent: 0,
            notes: l.notes ?? "",
            isContingency: l.isContingency ?? false,
            contingencyPct: l.contingencyPct ?? 0,
            status: l.status ?? "open",
            order: l.order ?? li,
            csi: l.isContingency
              ? `${groupCsi}.C${String(li + 1).padStart(2, "0")}`
              : `${groupCsi}.${String(li + 1).padStart(2, "0")}`,
          })),
        };
      });
      try {
        localStorage.setItem(BUDGET_GROUPS_STORAGE_KEY, JSON.stringify(groups));
      } catch (_) {}
    }

    // Write expenses to localStorage
    if (expenses.expenses.length > 0) {
      try {
        localStorage.setItem(EXP_STORAGE_KEY, JSON.stringify(expenses.expenses));
      } catch (_) {}
    }

    // Write vendors to localStorage
    if (vendors.vendors.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors.vendors));
        localStorage.setItem(
          STORAGE_KEY_PROJECT_IDS,
          JSON.stringify(Array.from(vendors.projectVendorIds))
        );
      } catch (_) {}
    }

    setReady(true);
  }, [isLoading, budget.groups, expenses.expenses, vendors.vendors, vendors.projectVendorIds, ready]);

  if (isLoading && !ready) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--bg, #f5f3ef)",
        color: "var(--text-muted, #888)",
        fontFamily: "'Inter Tight', 'Inter', sans-serif",
        fontSize: 13,
        letterSpacing: "0.04em",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32,
            height: 32,
            border: "2px solid var(--border, #d4cfc8)",
            borderTopColor: "var(--cc-accent, #b5703a)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          <div>Loading project data…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * DbBridgeProviders
 * Wraps the app with the DB sync gate. Must be rendered inside the tRPC provider.
 */
export function DbBridgeProviders({ children }: { children: React.ReactNode }) {
  return <DbSyncGate>{children}</DbSyncGate>;
}
