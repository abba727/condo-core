/**
 * BudgetDbSync
 *
 * Sits inside the BudgetStoreProvider tree and watches for changes to the
 * budget groups state. When changes are detected, it fires the appropriate
 * tRPC mutations to keep the database in sync.
 *
 * This is a "sync watcher" — it does NOT replace the legacy store, it just
 * mirrors changes to the DB so they survive page reloads.
 */
import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

// We import useBudgetStore from the JSX module dynamically to avoid circular deps
// The store is accessed via a prop passed from CondoCore
interface BudgetGroup {
  id: string;
  label: string;
  order?: number;
  collapsed?: boolean;
  isContingencyGroup?: boolean;
  useCategory?: "land_acquisition" | "hard_costs" | "soft_costs" | "financing_carry" | "contingency";
  lines: BudgetLine[];
}

interface BudgetLine {
  id: string;
  name: string;
  budget?: number;
  committed?: number;
  isContingency?: boolean;
  contingencyPct?: number;
  status?: string;
  notes?: string;
  order?: number;
}

interface BudgetDbSyncProps {
  groups: BudgetGroup[];
}

export function BudgetDbSync({ groups }: BudgetDbSyncProps) {
  const updateGroup = trpc.budget.updateGroup.useMutation();
  const reorderGroups = trpc.budget.reorderGroups.useMutation();
  const updateLine = trpc.budget.updateLine.useMutation();
  const reorderLines = trpc.budget.reorderLines.useMutation();
  const addGroupMut = trpc.budget.addGroup.useMutation();
  const addLineMut = trpc.budget.addLine.useMutation();
  const deleteGroupMut = trpc.budget.deleteGroup.useMutation();
  const deleteLineMut = trpc.budget.deleteLine.useMutation();

  // Track the previous state to detect what changed
  const prevGroupsRef = useRef<BudgetGroup[] | null>(null);
  // Track which IDs exist in the DB (seeded or previously added)
  const dbGroupIdsRef = useRef<Set<string>>(new Set());
  const dbLineIdsRef = useRef<Set<string>>(new Set());
  // Track if we've done the initial snapshot (don't sync on first render)
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!groups || groups.length === 0) return;

    // On first render, just snapshot the current state as the "DB baseline"
    // (the DB was already seeded, so we don't need to re-insert anything)
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevGroupsRef.current = groups;
      groups.forEach((g) => {
        dbGroupIdsRef.current.add(g.id);
        (g.lines ?? []).forEach((l) => dbLineIdsRef.current.add(l.id));
      });
      return;
    }

    const prev = prevGroupsRef.current;
    if (!prev) {
      prevGroupsRef.current = groups;
      return;
    }

    // Check if anything actually changed (shallow compare)
    if (JSON.stringify(prev) === JSON.stringify(groups)) return;

    const prevGroupIds = new Set(prev.map((g) => g.id));
    const currGroupIds = new Set(groups.map((g) => g.id));

    // ── Detect deleted groups ──────────────────────────────────────────────
    for (const g of prev) {
      if (!currGroupIds.has(g.id) && dbGroupIdsRef.current.has(g.id)) {
        deleteGroupMut.mutate({ id: g.id });
        dbGroupIdsRef.current.delete(g.id);
      }
    }

    // ── Detect added groups ────────────────────────────────────────────────
    for (const g of groups) {
      if (!prevGroupIds.has(g.id) && !dbGroupIdsRef.current.has(g.id)) {
        addGroupMut.mutate({
          label: g.label,
          type: g.isContingencyGroup ? "contingency" : "hard",
          useCategory: (g.useCategory as "land_acquisition" | "hard_costs" | "soft_costs" | "financing_carry" | "contingency") ?? "hard_costs",
        }, {
          onSuccess: (data) => {
            // Update the DB ID tracking — the DB assigned a new ID
            // but the local store uses the temp ID, so we track both
            if (data?.id) dbGroupIdsRef.current.add(data.id);
          },
        });
        dbGroupIdsRef.current.add(g.id);
      }
    }

    // ── Detect group order changes ─────────────────────────────────────────
    const prevOrder = prev.map((g) => g.id).join(",");
    const currOrder = groups.map((g) => g.id).join(",");
    if (prevOrder !== currOrder) {
      reorderGroups.mutate({
        orderedIds: groups
          .map((g) => g.id)
          .filter((id) => dbGroupIdsRef.current.has(id)),
      });
    }

    // ── Detect group label/collapsed changes ──────────────────────────────
    for (const g of groups) {
      const prevG = prev.find((p) => p.id === g.id);
      if (!prevG) continue;
      if (!dbGroupIdsRef.current.has(g.id)) continue;

      const patch: { id: string; label?: string; collapsed?: boolean } = { id: g.id };
      let changed = false;
      if (prevG.label !== g.label) { patch.label = g.label; changed = true; }
      if (prevG.collapsed !== g.collapsed) { patch.collapsed = g.collapsed; changed = true; }
      if (changed) updateGroup.mutate(patch);

      // ── Detect line changes within this group ──────────────────────────
      const prevLines = prevG.lines ?? [];
      const currLines = g.lines ?? [];
      const prevLineIds = new Set(prevLines.map((l) => l.id));
      const currLineIds = new Set(currLines.map((l) => l.id));

      // Deleted lines
      for (const l of prevLines) {
        if (!currLineIds.has(l.id) && dbLineIdsRef.current.has(l.id)) {
          deleteLineMut.mutate({ id: l.id });
          dbLineIdsRef.current.delete(l.id);
        }
      }

      // Added lines
      for (const l of currLines) {
        if (!prevLineIds.has(l.id) && !dbLineIdsRef.current.has(l.id)) {
          addLineMut.mutate({
            groupId: g.id,
            name: l.name,
            budgetAmount: l.budget ?? 0,
            isContingency: l.isContingency ?? false,
            contingencyPct: l.contingencyPct ?? null,
            status: (l.status as "open" | "fixed" | "closed") ?? "open",
            notes: l.notes ?? "",
          });
          dbLineIdsRef.current.add(l.id);
        }
      }

      // Line order changes
      const prevLineOrder = prevLines.map((l) => l.id).join(",");
      const currLineOrder = currLines.map((l) => l.id).join(",");
      if (prevLineOrder !== currLineOrder) {
        reorderLines.mutate({
          groupId: g.id,
          orderedIds: currLines
            .map((l) => l.id)
            .filter((id) => dbLineIdsRef.current.has(id)),
        });
      }

      // Line field changes
      for (const l of currLines) {
        const prevL = prevLines.find((p) => p.id === l.id);
        if (!prevL) continue;
        if (!dbLineIdsRef.current.has(l.id)) continue;

        const linePatch: {
          id: string;
          name?: string;
          budgetAmount?: number;
          committedAmount?: number;
          isContingency?: boolean;
          contingencyPct?: number | null;
          status?: "open" | "fixed" | "closed";
          notes?: string;
        } = { id: l.id };
        let lineChanged = false;
        if (prevL.name !== l.name) { linePatch.name = l.name; lineChanged = true; }
        if (prevL.budget !== l.budget) { linePatch.budgetAmount = l.budget ?? 0; lineChanged = true; }
        if (prevL.committed !== l.committed) { linePatch.committedAmount = l.committed ?? 0; lineChanged = true; }
        if (prevL.isContingency !== l.isContingency) { linePatch.isContingency = l.isContingency; lineChanged = true; }
        if (prevL.contingencyPct !== l.contingencyPct) { linePatch.contingencyPct = l.contingencyPct ?? null; lineChanged = true; }
        if (prevL.status !== l.status) { linePatch.status = (l.status as "open" | "fixed" | "closed") ?? "open"; lineChanged = true; }
        if (prevL.notes !== l.notes) { linePatch.notes = l.notes ?? ""; lineChanged = true; }
        if (lineChanged) updateLine.mutate(linePatch);
      }
    }

    prevGroupsRef.current = groups;
  }, [groups]); // eslint-disable-line react-hooks/exhaustive-deps

  // This component renders nothing — it's a pure side-effect sync watcher
  return null;
}
