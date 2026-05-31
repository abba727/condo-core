/**
 * DbBridgeProviders
 *
 * Loads data for modules that still use the mutable dataStore singleton:
 * - Plan tasks (PlanTab)
 * - Contracts, Insurances, Permits (ComplianceTab)
 * - Draws (DrawsTab)
 *
 * Budget, Expenses, Vendors, and Capital Stack are now fully DB-backed via
 * direct tRPC queries in their respective components — no localStorage bridge needed.
 *
 * Shows a loading spinner until all dataStore data is ready, then renders children.
 */
import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { setDataStore } from "@/data/dataStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;
const EMPTY: AnyRecord[] = [];

function DbSyncGate({ children }: { children: React.ReactNode }) {
  // Fetch plan tasks, contracts, insurances, permits, draws from DB
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
  const drawsQuery = trpc.capitalStack.listDraws.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const [ready, setReady] = useState(false);
  const syncedRef = React.useRef(false);

  const isLoading =
    planTasksQuery.isLoading ||
    contractsQuery.isLoading ||
    insurancesQuery.isLoading ||
    permitsQuery.isLoading ||
    drawsQuery.isLoading;

  useEffect(() => {
    if (isLoading) return;
    if (syncedRef.current) return; // Only run once

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
      : EMPTY;

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
      : EMPTY;

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
      : EMPTY;

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
      : EMPTY;

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

    // Write to the mutable dataStore — legacy modules (Plan, Compliance, Draws) read this on mount
    setDataStore({
      planTasks: planTasksForStore,
      contracts: contractsForStore,
      insurances: insurancesForStore,
      permits: permitsForStore,
      draws: drawsForStore,
      dbLoaded: true,
    });

    syncedRef.current = true;
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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
