/**
 * DbBridgeProviders
 *
 * Ensures database data is loaded into localStorage AND the mutable dataStore
 * BEFORE the legacy CondoCore store providers initialize. This prevents stale
 * seed data from being shown on first render.
 *
 * Strategy:
 * 1. Fetch all DB data via tRPC queries
 * 2. While loading, show a minimal loading indicator
 * 3. Once loaded:
 *    a. Write budget/expenses/vendors to localStorage (legacy stores read these)
 *    b. Write plan tasks, contracts, insurances, permits to dataStore singleton
 *       (CondoCore.jsx reads these on mount via getDataStore())
 * 4. Then render children (CondoCore) — all legacy stores will read fresh DB data
 *
 * On subsequent renders, mutations go through the legacy stores (localStorage)
 * AND are mirrored to the DB via the DbSync watcher components.
 */
import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useBudgetDb } from "@/hooks/useBudgetDb";
import { useExpensesDb } from "@/hooks/useExpensesDb";
import { useVendorsDb } from "@/hooks/useVendorsDb";
import { setDataStore } from "@/data/dataStore";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;
const DRIGGS_712_PLAN_TASKS_FALLBACK: AnyRecord[] = [];
const DRIGGS_712_CONTRACTS_FALLBACK: AnyRecord[] = [];
const DRIGGS_712_INSURANCES_FALLBACK: AnyRecord[] = [];
const DRIGGS_712_PERMITS_FALLBACK: AnyRecord[] = [];

// Storage keys used by the legacy stores
const BUDGET_GROUPS_STORAGE_KEY = "cc_budget_groups_v3";
const EXP_STORAGE_KEY = "cc_expenses_v3";
const STORAGE_KEY_VENDORS = "cc_vendors_v2";
const STORAGE_KEY_PROJECT_IDS = "cc_project_vendor_ids_v2";

function DbSyncGate({ children }: { children: React.ReactNode }) {
  const budget = useBudgetDb();
  const expenses = useExpensesDb();
  const vendors = useVendorsDb();

  // Fetch plan tasks, contracts, insurances, permits from DB
  const planTasksQuery = trpc.planTasks.list.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const contractsQuery = trpc.compliance.listContracts.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const insurancesQuery = trpc.compliance.listInsurances.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const permitsQuery = trpc.compliance.listPermits.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const capitalStackQuery = trpc.capitalStack.list.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const drawsQuery = trpc.capitalStack.listDraws.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [ready, setReady] = useState(false);
  const syncedRef = React.useRef(false);

  const isLoading =
    budget.isLoading ||
    expenses.isLoading ||
    vendors.isLoading ||
    planTasksQuery.isLoading ||
    contractsQuery.isLoading ||
    insurancesQuery.isLoading ||
    permitsQuery.isLoading ||
    capitalStackQuery.isLoading ||
    drawsQuery.isLoading;

  useEffect(() => {
    if (isLoading) return;
    if (syncedRef.current) return; // Only run once — never overwrite user changes

    // ── Budget groups → localStorage ──────────────────────────────────────────
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
          useCategory: (g as { useCategory?: string }).useCategory ?? null,
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

    // ── Expenses → localStorage ────────────────────────────────────────────────
    if (expenses.expenses.length > 0) {
      try {
        localStorage.setItem(EXP_STORAGE_KEY, JSON.stringify(expenses.expenses));
      } catch (_) {}
    }

    // ── Vendors → localStorage ─────────────────────────────────────────────────
    if (vendors.vendors.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors.vendors));
        localStorage.setItem(
          STORAGE_KEY_PROJECT_IDS,
          JSON.stringify(Array.from(vendors.projectVendorIds))
        );
      } catch (_) {}
    }

    // ── Plan tasks → dataStore ─────────────────────────────────────────────────
    const dbTasks = planTasksQuery.data ?? [];
    const planTasksForStore = dbTasks.length > 0
      ? dbTasks.map((t) => ({
          id: t.id,
          sourceRow: t.sourceRow ?? undefined,
          wbs: t.wbs ?? undefined,
          name: t.name ?? "",
          owner: t.owner ?? "Project leadership",
          phase: t.phase ?? undefined,
          days: t.days ?? undefined,
          startISO: t.startISO ?? undefined,
          endISO: t.endISO ?? undefined,
          pctComplete: t.pctComplete ?? undefined,
          pctLabel: t.pctComplete != null ? `${Math.round((t.pctComplete as number) * 100)}%` : "—",
          status: t.status ?? "Open",
          bucket: t.bucket ?? "backlog",
          cls: t.status === "Done" ? "pos" : t.status === "In Progress" ? "info" : "neutral",
          notes: t.notes ?? undefined,
          groupId: t.groupId ?? undefined,
          group: t.phase ?? undefined,
        }))
      : DRIGGS_712_PLAN_TASKS_FALLBACK; // fallback (DB should always have data)

    // ── Contracts → dataStore ──────────────────────────────────────────────────
    const dbContracts = contractsQuery.data ?? [];
    const contractsForStore = dbContracts.length > 0
      ? dbContracts.map((c) => ({
          Vendor: c.vendorName ?? "",
          "Contract Total": String(c.contractTotal ?? "0"),
          "Total Paid": String(c.totalPaid ?? "0"),
          "Total Remaining": String(c.totalRemaining ?? "0"),
          Status: c.status ?? "draft",
          Notes: c.notes ?? "",
          _dbId: c.id,
        }))
      : DRIGGS_712_CONTRACTS_FALLBACK;

    // ── Insurances → dataStore ─────────────────────────────────────────────────
    const dbInsurances = insurancesQuery.data ?? [];
    const insurancesForStore = dbInsurances.length > 0
      ? dbInsurances.map((ins) => ({
          Company: ins.companyName ?? "",
          Subcontractor: ins.subcontractorTrade ?? "",
          "Contract Signed": ins.contractSigned ? "Yes" : "",
          "Subcontractor Rider": ins.subcontractorRider ? "Yes" : "",
          "Additional Insured": ins.additionalInsured ? "Yes" : "",
          "Workers Comp": ins.workersComp ? "Yes" : "",
          "General Liability Carrier": ins.generalLiabilityCarrier ?? "",
          "Workers Comp Expiration": ins.workersCompExpiration ?? "",
          "General Liability Expiration": ins.generalLiabilityExpiration ?? "",
          Status: ins.status ?? "active",
          Notes: ins.notes ?? "",
          _dbId: ins.id,
        }))
      : DRIGGS_712_INSURANCES_FALLBACK;

    // ── Permits → dataStore ────────────────────────────────────────────────────
    const dbPermits = permitsQuery.data ?? [];
    const permitsForStore = dbPermits.length > 0
      ? dbPermits.map((p) => ({
          Address: p.address ?? "",
          "Permit Type": p.permitType ?? "",
          Agency: p.agency ?? "",
          "Permit Number": p.permitNumber ?? "",
          Contractor: p.contractor ?? "",
          Contact: p.contactPhone ?? "",
          Superintendent: p.superintendent ?? "",
          Expiration: p.expiration ?? "",
          Status: p.status ?? "active",
          Notes: p.notes ?? "",
          _dbId: p.id,
        }))
      : DRIGGS_712_PERMITS_FALLBACK;

    // ── Capital stack → dataStore ─────────────────────────────────────────────
    const dbCapitalStack = capitalStackQuery.data ?? [];
    const capitalStackForStore = dbCapitalStack.map((item) => ({
      id: item.id,
      tier: item.tier,
      label: item.label,
      lender: item.lender ?? "",
      amount: parseFloat(String(item.amount ?? "0")),
      interestRate: item.interestRate ?? null,
      maturityDate: item.maturityDate ?? "",
      ltc: item.ltc ?? null,
      ltv: item.ltv ?? null,
      status: item.status ?? "proposed",
      sortOrder: item.sortOrder ?? 0,
      notes: item.notes ?? "",
    }));

    // ── Draws → dataStore ──────────────────────────────────────────────────────
    const dbDraws = drawsQuery.data ?? [];
    const drawsForStore = dbDraws.map((d) => ({
      id: d.id,
      drawNumber: d.drawNumber,
      label: d.label ?? `Draw ${String(d.drawNumber).padStart(2, "0")}`,
      requestDate: d.requestDate ?? "",
      approvedDate: d.approvedDate ?? "",
      fundedDate: d.fundedDate ?? "",
      requestAmount: parseFloat(String(d.requestAmount ?? "0")),
      approvedAmount: parseFloat(String(d.approvedAmount ?? "0")),
      fundedAmount: parseFloat(String(d.fundedAmount ?? "0")),
      status: d.status ?? "draft",
      lender: d.lender ?? "",
      notes: d.notes ?? "",
    }));

    // Write all to the mutable dataStore — CondoCore reads this on mount
    setDataStore({
      planTasks: planTasksForStore,
      contracts: contractsForStore,
      insurances: insurancesForStore,
      permits: permitsForStore,
      capitalStack: capitalStackForStore,
      draws: drawsForStore,
      dbLoaded: true,
    });

    syncedRef.current = true;
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // Only re-run when loading state changes, NOT when data changes

  if (!ready) {
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
