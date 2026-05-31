import { eq, asc, and, sql } from "drizzle-orm";
import { z } from "zod";
import { budgetGroups, budgetLines } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs"; // TODO: make dynamic when multi-project

export const budgetRouter = router({
  // ─── Groups ────────────────────────────────────────────────────────────────
  listGroups: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(budgetGroups)
        .where(eq(budgetGroups.projectId, pid))
        .orderBy(asc(budgetGroups.sortOrder));
    }),

  addGroup: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        label: z.string().min(1),
        type: z.enum(["hard", "soft", "contingency", "other"]).optional(),
        useCategory: z.enum(["land_acquisition", "hard_costs", "soft_costs", "financing_carry", "contingency"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;

      // Determine next sort order
      const existing = await db
        .select({ sortOrder: budgetGroups.sortOrder })
        .from(budgetGroups)
        .where(eq(budgetGroups.projectId, pid))
        .orderBy(asc(budgetGroups.sortOrder));
      const nextOrder = existing.length > 0 ? (existing[existing.length - 1].sortOrder ?? 0) + 1 : 0;

      const id = `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await db.insert(budgetGroups).values({
        id,
        projectId: pid,
        label: input.label,
        type: input.type ?? "hard",
        useCategory: input.useCategory,
        sortOrder: nextOrder,
        collapsed: false,
      });
      return { id };
    }),

  updateGroup: publicProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().optional(),
        type: z.enum(["hard", "soft", "contingency", "other"]).optional(),
        useCategory: z.enum(["land_acquisition", "hard_costs", "soft_costs", "financing_carry", "contingency"]).optional(),
        collapsed: z.boolean().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      if (rest.label !== undefined) patch.label = rest.label;
      if (rest.type !== undefined) patch.type = rest.type;
      if (rest.useCategory !== undefined) patch.useCategory = rest.useCategory;
      if (rest.collapsed !== undefined) patch.collapsed = rest.collapsed;
      if (rest.notes !== undefined) patch.notes = rest.notes;
      if (Object.keys(patch).length > 0) {
        await db.update(budgetGroups).set(patch).where(eq(budgetGroups.id, id));
      }
      return { success: true };
    }),

  deleteGroup: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete all lines in the group first
      await db.delete(budgetLines).where(eq(budgetLines.groupId, input.id));
      await db.delete(budgetGroups).where(eq(budgetGroups.id, input.id));
      return { success: true };
    }),

  reorderGroups: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        orderedIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      for (let i = 0; i < input.orderedIds.length; i++) {
        await db
          .update(budgetGroups)
          .set({ sortOrder: i })
          .where(eq(budgetGroups.id, input.orderedIds[i]));
      }
      return { success: true };
    }),

  // ─── Lines ─────────────────────────────────────────────────────────────────
  listLines: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(budgetLines)
        .where(eq(budgetLines.projectId, pid))
        .orderBy(asc(budgetLines.sortOrder));
    }),

  addLine: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        groupId: z.string(),
        name: z.string().min(1),
        budgetAmount: z.number().optional(),
        isContingency: z.boolean().optional(),
        contingencyPct: z.number().nullable().optional(),
        status: z.enum(["open", "fixed", "closed"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;

      // Determine next sort order within the group
      const existing = await db
        .select({ sortOrder: budgetLines.sortOrder })
        .from(budgetLines)
        .where(and(eq(budgetLines.projectId, pid), eq(budgetLines.groupId, input.groupId)))
        .orderBy(asc(budgetLines.sortOrder));
      const nextOrder = existing.length > 0 ? (existing[existing.length - 1].sortOrder ?? 0) + 1 : 0;

      const id = `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await db.insert(budgetLines).values({
        id,
        projectId: pid,
        groupId: input.groupId,
        name: input.name,
        budgetAmount: String(input.budgetAmount ?? 0),
        committedAmount: "0",
        isContingency: input.isContingency ?? false,
        contingencyPct: input.contingencyPct ?? null,
        sortOrder: nextOrder,
        status: input.status ?? "open",
        notes: input.notes ?? null,
      });
      return { id };
    }),

  updateLine: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        budgetAmount: z.number().optional(),
        committedAmount: z.number().optional(),
        isContingency: z.boolean().optional(),
        contingencyPct: z.number().nullable().optional(),
        status: z.enum(["open", "fixed", "closed"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      if (rest.name !== undefined) patch.name = rest.name;
      if (rest.budgetAmount !== undefined) patch.budgetAmount = String(rest.budgetAmount);
      if (rest.committedAmount !== undefined) patch.committedAmount = String(rest.committedAmount);
      if (rest.isContingency !== undefined) patch.isContingency = rest.isContingency;
      if (rest.contingencyPct !== undefined) patch.contingencyPct = rest.contingencyPct;
      if (rest.status !== undefined) patch.status = rest.status;
      if (rest.notes !== undefined) patch.notes = rest.notes;
      if (Object.keys(patch).length > 0) {
        await db.update(budgetLines).set(patch).where(eq(budgetLines.id, id));
      }
      return { success: true };
    }),

  deleteLine: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(budgetLines).where(eq(budgetLines.id, input.id));
      return { success: true };
    }),

  reorderLines: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        orderedIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      for (let i = 0; i < input.orderedIds.length; i++) {
        await db
          .update(budgetLines)
          .set({ sortOrder: i })
          .where(eq(budgetLines.id, input.orderedIds[i]));
      }
      return { success: true };
    }),
});
