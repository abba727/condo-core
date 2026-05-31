import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { planTasks, planTaskGroups } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs";

export const planTasksRouter = router({
  list: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(planTasks)
        .where(eq(planTasks.projectId, pid))
        .orderBy(asc(planTasks.sourceRow));
    }),

  listGroups: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(planTaskGroups)
        .where(eq(planTaskGroups.projectId, pid))
        .orderBy(asc(planTaskGroups.sortOrder));
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        owner: z.string().optional(),
        phase: z.string().optional(),
        days: z.number().optional(),
        startISO: z.string().nullable().optional(),
        endISO: z.string().nullable().optional(),
        pctComplete: z.number().min(0).max(1).nullable().optional(),
        status: z.enum(["Open", "In Progress", "Done", "Blocked", "Cancelled"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) patch[k] = v;
      }
      if (Object.keys(patch).length > 0) {
        await db.update(planTasks).set(patch).where(eq(planTasks.id, id));
      }
      return { success: true };
    }),

  add: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        groupId: z.string().nullable().optional(),
        wbs: z.string().optional(),
        name: z.string(),
        owner: z.string().optional(),
        phase: z.string().optional(),
        days: z.number().optional(),
        startISO: z.string().nullable().optional(),
        endISO: z.string().nullable().optional(),
        pctComplete: z.number().optional(),
        status: z.enum(["Open", "In Progress", "Done", "Blocked", "Cancelled"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await db.insert(planTasks).values({
        id,
        projectId: pid,
        groupId: input.groupId ?? null,
        wbs: input.wbs ?? null,
        name: input.name,
        owner: input.owner ?? null,
        phase: input.phase ?? null,
        days: input.days ?? null,
        startISO: input.startISO ?? null,
        endISO: input.endISO ?? null,
        pctComplete: input.pctComplete ?? null,
        status: input.status ?? "Open",
        notes: input.notes ?? null,
      });
      return { id };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(planTasks).where(eq(planTasks.id, input.id));
      return { success: true };
    }),
});
