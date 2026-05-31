/**
 * PlanTaskDbSync
 *
 * Sits inside the ProjectPlanPage and watches for changes to the plan tasks
 * state. When changes are detected, it fires the appropriate tRPC mutations
 * to keep the database in sync.
 *
 * Key notes:
 *  - Task IDs from DB are strings like "task-1234-abcd" or seeded IDs
 *  - New tasks created locally have IDs like "local-1234567890"
 *  - pctComplete is stored as 0-1 float in both UI and DB
 *  - Status values: "Open" | "In Progress" | "Done" | "Blocked" | "Cancelled"
 */
import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface PlanTask {
  id: string;
  name?: string;
  owner?: string;
  phase?: string;
  groupId?: string;
  days?: number;
  startISO?: string;
  endISO?: string;
  pctComplete?: number;
  status?: string;
  notes?: string;
  bucket?: string;
  wbs?: string;
}

interface PlanTaskDbSyncProps {
  tasks: PlanTask[];
}

// Map UI status to DB-valid status
function toDbStatus(
  status: string | undefined
): "Open" | "In Progress" | "Done" | "Blocked" | "Cancelled" {
  const s = (status ?? "").toLowerCase();
  if (s === "done") return "Done";
  if (s === "in progress" || s === "in-progress") return "In Progress";
  if (s === "blocked") return "Blocked";
  if (s === "cancelled" || s === "canceled") return "Cancelled";
  return "Open";
}

// Only sync tasks that have DB-valid IDs (not temp "local-..." IDs)
function isDbId(id: string): boolean {
  return !id.startsWith("local-");
}

export function PlanTaskDbSync({ tasks }: PlanTaskDbSyncProps) {
  const addTaskMut = trpc.planTasks.add.useMutation();
  const updateTaskMut = trpc.planTasks.update.useMutation();
  const deleteTaskMut = trpc.planTasks.delete.useMutation();

  const prevTasksRef = useRef<PlanTask[] | null>(null);
  const dbTaskIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  // Map from local temp ID → DB-assigned ID (after add mutation returns)
  const localToDbIdRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    // On first render, snapshot the current state as the DB baseline
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevTasksRef.current = tasks;
      tasks.forEach((t) => {
        if (isDbId(t.id)) {
          dbTaskIdsRef.current.add(t.id);
        }
      });
      return;
    }

    const prev = prevTasksRef.current;
    if (!prev) {
      prevTasksRef.current = tasks;
      return;
    }

    // Skip if nothing changed
    if (JSON.stringify(prev) === JSON.stringify(tasks)) return;

    const prevIds = new Set(prev.map((t) => t.id));
    const currIds = new Set(tasks.map((t) => t.id));

    // ── Detect deleted tasks ───────────────────────────────────────────────
    for (const t of prev) {
      if (!currIds.has(t.id) && dbTaskIdsRef.current.has(t.id)) {
        deleteTaskMut.mutate({ id: t.id });
        dbTaskIdsRef.current.delete(t.id);
      }
    }

    // ── Detect added tasks ─────────────────────────────────────────────────
    for (const t of tasks) {
      if (!prevIds.has(t.id) && !dbTaskIdsRef.current.has(t.id)) {
        const isLocal = !isDbId(t.id);
        addTaskMut
          .mutateAsync({
            projectId: "712-driggs",
            groupId: t.groupId ?? null,
            wbs: t.wbs,
            name: t.name ?? "Untitled task",
            owner: t.owner,
            phase: t.phase,
            days: t.days,
            startISO: t.startISO ?? null,
            endISO: t.endISO ?? null,
            pctComplete: t.pctComplete ?? 0,
            status: toDbStatus(t.status),
            notes: t.notes,
          })
          .then((result) => {
            if (isLocal && result?.id) {
              localToDbIdRef.current.set(t.id, result.id);
            }
            dbTaskIdsRef.current.add(result?.id ?? t.id);
          })
          .catch(() => {});
      }
    }

    // ── Detect updated tasks ───────────────────────────────────────────────
    for (const t of tasks) {
      const prevT = prev.find((p) => p.id === t.id);
      if (!prevT) continue;

      // Only update tasks that are in the DB (have DB IDs)
      const dbId = localToDbIdRef.current.get(t.id) ?? t.id;
      if (!isDbId(dbId)) continue;
      if (!dbTaskIdsRef.current.has(dbId) && !dbTaskIdsRef.current.has(t.id))
        continue;

      const prevStatus = toDbStatus(prevT.status);
      const currStatus = toDbStatus(t.status);

      const changed =
        prevT.name !== t.name ||
        prevT.owner !== t.owner ||
        prevT.phase !== t.phase ||
        prevT.days !== t.days ||
        prevT.startISO !== t.startISO ||
        prevT.endISO !== t.endISO ||
        prevT.pctComplete !== t.pctComplete ||
        prevStatus !== currStatus ||
        prevT.notes !== t.notes ||
        prevT.groupId !== t.groupId;

      if (changed) {
        updateTaskMut
          .mutateAsync({
            id: dbId,
            name: t.name,
            owner: t.owner,
            phase: t.phase,
            days: t.days,
            startISO: t.startISO ?? null,
            endISO: t.endISO ?? null,
            pctComplete: t.pctComplete ?? null,
            status: currStatus,
            notes: t.notes,
          })
          .catch(() => {});
      }
    }

    prevTasksRef.current = tasks;
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
