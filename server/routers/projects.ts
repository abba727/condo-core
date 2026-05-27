import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { projects, contracts, insurances, permits, planTasks } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

export const projectsRouter = router({
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(projects).orderBy(asc(projects.name));
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  // ─── Contracts ─────────────────────────────────────────────────────────────
  listContracts: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? "712-driggs";
      return db
        .select()
        .from(contracts)
        .where(eq(contracts.projectId, pid))
        .orderBy(asc(contracts.contractDate));
    }),

  addContract: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        vendorId: z.number().nullable().optional(),
        vendorName: z.string().optional(),
        contractDate: z.string().nullable().optional(),
        contractTotal: z.number().optional(),
        totalPaid: z.number().optional(),
        totalRemaining: z.number().optional(),
        status: z.enum(["draft", "executed", "complete", "terminated"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? "712-driggs";
      const result = await db.insert(contracts).values({
        projectId: pid,
        vendorId: input.vendorId ?? null,
        vendorName: input.vendorName ?? null,
        contractDate: input.contractDate ?? null,
        contractTotal: String(input.contractTotal ?? 0),
        totalPaid: String(input.totalPaid ?? 0),
        totalRemaining: String(input.totalRemaining ?? 0),
        status: input.status ?? "draft",
        notes: input.notes ?? null,
      });
      return { id: Number(result[0].insertId) };
    }),

  updateContract: publicProcedure
    .input(
      z.object({
        id: z.number(),
        vendorName: z.string().optional(),
        contractDate: z.string().nullable().optional(),
        contractTotal: z.number().optional(),
        totalPaid: z.number().optional(),
        totalRemaining: z.number().optional(),
        status: z.enum(["draft", "executed", "complete", "terminated"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) {
          if (["contractTotal", "totalPaid", "totalRemaining"].includes(k)) {
            patch[k] = String(v);
          } else {
            patch[k] = v;
          }
        }
      }
      if (Object.keys(patch).length > 0) {
        await db.update(contracts).set(patch).where(eq(contracts.id, id));
      }
      return { success: true };
    }),

  deleteContract: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(contracts).where(eq(contracts.id, input.id));
      return { success: true };
    }),

  // ─── Insurances ────────────────────────────────────────────────────────────
  listInsurances: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? "712-driggs";
      return db
        .select()
        .from(insurances)
        .where(eq(insurances.projectId, pid))
        .orderBy(asc(insurances.companyName));
    }),

  // ─── Permits ───────────────────────────────────────────────────────────────
  listPermits: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? "712-driggs";
      return db
        .select()
        .from(permits)
        .where(eq(permits.projectId, pid))
        .orderBy(asc(permits.permitType));
    }),

  // ─── Plan Tasks ────────────────────────────────────────────────────────────
  listPlanTasks: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? "712-driggs";
      return db
        .select()
        .from(planTasks)
        .where(eq(planTasks.projectId, pid))
        .orderBy(asc(planTasks.sourceRow));
    }),
});
