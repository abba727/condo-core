import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { capitalStackItems, capitalStackParticipants, draws, drawLineItems, stackingPlanUnits } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs";

export const capitalStackRouter = router({
  // ─── CAPITAL STACK ──────────────────────────────────────────────────────────
  list: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(capitalStackItems)
        .where(eq(capitalStackItems.projectId, pid))
        .orderBy(asc(capitalStackItems.sortOrder));
    }),

  add: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        tier: z.enum(["equity", "mezzanine", "senior_debt", "junior_debt", "other"]),
        label: z.string(),
        lender: z.string().optional(),
        amount: z.number().optional(),
        interestRate: z.number().optional(),
        maturityDate: z.string().optional(),
        ltc: z.number().optional(),
        ltv: z.number().optional(),
        status: z.enum(["proposed", "committed", "funded", "repaid"]).optional(),
        sortOrder: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(capitalStackItems).values({
        projectId: pid,
        tier: input.tier,
        label: input.label,
        lender: input.lender ?? null,
        amount: input.amount?.toString() ?? "0",
        interestRate: input.interestRate ?? null,
        maturityDate: input.maturityDate ?? null,
        ltc: input.ltc ?? null,
        ltv: input.ltv ?? null,
        status: input.status ?? "proposed",
        sortOrder: input.sortOrder ?? 0,
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        tier: z.enum(["equity", "mezzanine", "senior_debt", "junior_debt", "other"]).optional(),
        label: z.string().optional(),
        lender: z.string().optional(),
        amount: z.number().optional(),
        interestRate: z.number().optional(),
        maturityDate: z.string().optional(),
        ltc: z.number().optional(),
        ltv: z.number().optional(),
        status: z.enum(["proposed", "committed", "funded", "repaid"]).optional(),
        sortOrder: z.number().optional(),
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
        await db.update(capitalStackItems).set(patch).where(eq(capitalStackItems.id, id));
      }
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(capitalStackItems).where(eq(capitalStackItems.id, input.id));
      return { success: true };
    }),

  // ─── PARTICIPANTS ────────────────────────────────────────────────────────────
  listParticipants: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(capitalStackParticipants)
        .where(eq(capitalStackParticipants.projectId, pid))
        .orderBy(asc(capitalStackParticipants.sortOrder));
    }),

  addParticipant: publicProcedure
    .input(
      z.object({
        trancheId: z.number(),
        projectId: z.string().optional(),
        name: z.string(),
        commitment: z.number(),
        role: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(capitalStackParticipants).values({
        trancheId: input.trancheId,
        projectId: pid,
        name: input.name,
        commitment: input.commitment.toString(),
        role: input.role ?? null,
        sortOrder: input.sortOrder ?? 0,
      });
      return { id: (result as any).insertId };
    }),

  updateParticipant: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        commitment: z.number().optional(),
        role: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) patch[k] = k === "commitment" ? String(v) : v;
      }
      if (Object.keys(patch).length > 0) {
        await db.update(capitalStackParticipants).set(patch).where(eq(capitalStackParticipants.id, id));
      }
      return { success: true };
    }),

  deleteParticipant: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(capitalStackParticipants).where(eq(capitalStackParticipants.id, input.id));
      return { success: true };
    }),

  // ─── DRAWS ──────────────────────────────────────────────────────────────────
  listDraws: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(draws)
        .where(eq(draws.projectId, pid))
        .orderBy(asc(draws.drawNumber));
    }),

  addDraw: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        drawNumber: z.number(),
        label: z.string().optional(),
        requestDate: z.string().optional(),
        approvedDate: z.string().optional(),
        fundedDate: z.string().optional(),
        requestAmount: z.number().optional(),
        approvedAmount: z.number().optional(),
        fundedAmount: z.number().optional(),
        status: z.enum(["draft", "submitted", "approved", "funded", "rejected"]).optional(),
        lender: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(draws).values({
        projectId: pid,
        drawNumber: input.drawNumber,
        label: input.label ?? null,
        requestDate: input.requestDate ?? null,
        approvedDate: input.approvedDate ?? null,
        fundedDate: input.fundedDate ?? null,
        requestAmount: input.requestAmount?.toString() ?? "0",
        approvedAmount: input.approvedAmount?.toString() ?? "0",
        fundedAmount: input.fundedAmount?.toString() ?? "0",
        status: input.status ?? "draft",
        lender: input.lender ?? null,
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  updateDraw: publicProcedure
    .input(
      z.object({
        id: z.number(),
        label: z.string().optional(),
        requestDate: z.string().optional(),
        approvedDate: z.string().optional(),
        fundedDate: z.string().optional(),
        requestAmount: z.number().optional(),
        approvedAmount: z.number().optional(),
        fundedAmount: z.number().optional(),
        status: z.enum(["draft", "submitted", "approved", "funded", "rejected"]).optional(),
        lender: z.string().optional(),
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
        await db.update(draws).set(patch).where(eq(draws.id, id));
      }
      return { success: true };
    }),

  deleteDraw: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(draws).where(eq(draws.id, input.id));
      return { success: true };
    }),

  // ─── STACKING PLAN ──────────────────────────────────────────────────────────
  listUnits: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(stackingPlanUnits)
        .where(eq(stackingPlanUnits.projectId, pid))
        .orderBy(asc(stackingPlanUnits.floor), asc(stackingPlanUnits.unitNumber));
    }),

  updateUnit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        unitNumber: z.string().optional(),
        floor: z.number().optional(),
        unitType: z.string().optional(),
        sqft: z.number().optional(),
        status: z.enum(["available", "reserved", "contracted", "closed", "not_for_sale"]).optional(),
        listPrice: z.number().optional(),
        salePrice: z.number().optional(),
        buyerName: z.string().optional(),
        closingDate: z.string().optional(),
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
        await db.update(stackingPlanUnits).set(patch).where(eq(stackingPlanUnits.id, id));
      }
      return { success: true };
    }),
});
