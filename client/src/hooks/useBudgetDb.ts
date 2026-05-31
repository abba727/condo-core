/**
 * useBudgetDb
 * Provides database-backed budget groups and lines via tRPC.
 * Designed to be a drop-in data source for BudgetStoreProvider.
 */
import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

const PROJECT_ID = "712-driggs";

export function useBudgetDb() {
  const utils = trpc.useUtils();

  // ─── Queries ─────────────────────────────────────────────────────────────
  const groupsQuery = trpc.budget.listGroups.useQuery({ projectId: PROJECT_ID });
  const linesQuery = trpc.budget.listLines.useQuery({ projectId: PROJECT_ID });

  // ─── Mutations ────────────────────────────────────────────────────────────
  const addGroupMut = trpc.budget.addGroup.useMutation({
    onSuccess: () => utils.budget.listGroups.invalidate(),
  });
  const updateGroupMut = trpc.budget.updateGroup.useMutation({
    onSuccess: () => utils.budget.listGroups.invalidate(),
  });
  const deleteGroupMut = trpc.budget.deleteGroup.useMutation({
    onSuccess: () => {
      utils.budget.listGroups.invalidate();
      utils.budget.listLines.invalidate();
    },
  });

  const addLineMut = trpc.budget.addLine.useMutation({
    onSuccess: () => utils.budget.listLines.invalidate(),
  });
  const updateLineMut = trpc.budget.updateLine.useMutation({
    onSuccess: () => utils.budget.listLines.invalidate(),
  });
  const deleteLineMut = trpc.budget.deleteLine.useMutation({
    onSuccess: () => utils.budget.listLines.invalidate(),
  });

  // ─── Derived data: groups with embedded lines ─────────────────────────────
  const rawGroups = groupsQuery.data ?? [];
  const rawLines = linesQuery.data ?? [];

  const groups = rawGroups.map((g) => ({
    id: g.id,
    label: g.label,
    type: g.type,
    collapsed: g.collapsed ?? false,
    order: g.sortOrder ?? 0,
    isContingencyGroup: g.type === "contingency",
    useCategory: g.useCategory ?? null,
    lines: rawLines
      .filter((l) => l.groupId === g.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((l) => ({
        id: l.id,
        name: l.name,
        budget: Number(l.budgetAmount ?? 0),
        committed: Number(l.committedAmount ?? 0),
        spent: 0, // computed from expenses in BudgetTab
        isContingency: l.isContingency ?? false,
        contingencyPct: l.contingencyPct ?? 0,
        status: l.status,
        notes: l.notes ?? "",
        order: l.sortOrder ?? 0,
      })),
  }));

  // ─── Actions ──────────────────────────────────────────────────────────────
  const addGroup = useCallback(
    (group: { label: string; type?: string; useCategory?: string }) => {
      addGroupMut.mutate({
        projectId: PROJECT_ID,
        label: group.label,
        type: group.type as "hard" | "soft" | "contingency" | "other" | undefined,
        useCategory: (group.useCategory as "land_acquisition" | "hard_costs" | "soft_costs" | "financing_carry" | "contingency") ?? "hard_costs",
      });
    },
    [addGroupMut]
  );

  const updateGroup = useCallback(
    (groupId: string, patch: Record<string, unknown>) => {
      updateGroupMut.mutate({
        id: groupId,
        label: patch.label as string | undefined,
        useCategory: patch.useCategory as "land_acquisition" | "hard_costs" | "soft_costs" | "financing_carry" | "contingency" | undefined,
        collapsed: patch.collapsed as boolean | undefined,
        notes: patch.notes as string | undefined,
      });
    },
    [updateGroupMut]
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      deleteGroupMut.mutate({ id: groupId });
    },
    [deleteGroupMut]
  );

  const addLine = useCallback(
    (groupId: string, line: Record<string, unknown>) => {
      addLineMut.mutate({
        projectId: PROJECT_ID,
        groupId,
        name: String(line.name ?? "New line"),
        budgetAmount: Number(line.budget ?? 0),
        isContingency: Boolean(line.isContingency),
        contingencyPct: line.contingencyPct as number | null | undefined,
        status: (line.status as "open" | "fixed" | "closed") ?? "open",
        notes: line.notes as string | undefined,
      });
    },
    [addLineMut]
  );

  const updateLine = useCallback(
    (_groupId: string, lineId: string, patch: Record<string, unknown>) => {
      updateLineMut.mutate({
        id: lineId,
        name: patch.name as string | undefined,
        budgetAmount: patch.budget as number | undefined,
        committedAmount: patch.committed as number | undefined,
        isContingency: patch.isContingency as boolean | undefined,
        contingencyPct: patch.contingencyPct as number | null | undefined,
        status: patch.status as "open" | "fixed" | "closed" | undefined,
        notes: patch.notes as string | undefined,
      });
    },
    [updateLineMut]
  );

  const deleteLine = useCallback(
    (_groupId: string, lineId: string) => {
      deleteLineMut.mutate({ id: lineId });
    },
    [deleteLineMut]
  );

  return {
    groups,
    isLoading: groupsQuery.isLoading || linesQuery.isLoading,
    addGroup,
    updateGroup,
    deleteGroup,
    addLine,
    updateLine,
    deleteLine,
  };
}
