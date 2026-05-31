import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { contracts, insurances, permits } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs";

export const complianceRouter = router({
  // ─── CONTRACTS ──────────────────────────────────────────────────────────────
  listContracts: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db.select().from(contracts).where(eq(contracts.projectId, pid)).orderBy(asc(contracts.id));
    }),

  addContract: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        vendorName: z.string().optional(),
        vendorId: z.number().optional(),
        contractDate: z.string().optional(),
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
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(contracts).values({
        projectId: pid,
        vendorId: input.vendorId ?? null,
        vendorName: input.vendorName ?? null,
        contractDate: input.contractDate ?? null,
        contractTotal: input.contractTotal?.toString() ?? "0",
        totalPaid: input.totalPaid?.toString() ?? "0",
        totalRemaining: input.totalRemaining?.toString() ?? "0",
        status: input.status ?? "draft",
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  updateContract: publicProcedure
    .input(
      z.object({
        id: z.number(),
        vendorName: z.string().optional(),
        vendorId: z.number().optional(),
        contractDate: z.string().optional(),
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
        if (v !== undefined) patch[k] = v;
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

  // ─── INSURANCES ─────────────────────────────────────────────────────────────
  listInsurances: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db.select().from(insurances).where(eq(insurances.projectId, pid)).orderBy(asc(insurances.id));
    }),

  addInsurance: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        companyName: z.string(),
        subcontractorTrade: z.string().optional(),
        contractSigned: z.boolean().optional(),
        subcontractorRider: z.boolean().optional(),
        additionalInsured: z.boolean().optional(),
        workersComp: z.boolean().optional(),
        generalLiabilityCarrier: z.string().optional(),
        workersCompExpiration: z.string().optional(),
        generalLiabilityExpiration: z.string().optional(),
        status: z.enum(["active", "expiring", "expired", "missing"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(insurances).values({
        projectId: pid,
        companyName: input.companyName,
        subcontractorTrade: input.subcontractorTrade ?? null,
        contractSigned: input.contractSigned ?? false,
        subcontractorRider: input.subcontractorRider ?? false,
        additionalInsured: input.additionalInsured ?? false,
        workersComp: input.workersComp ?? false,
        generalLiabilityCarrier: input.generalLiabilityCarrier ?? null,
        workersCompExpiration: input.workersCompExpiration ?? null,
        generalLiabilityExpiration: input.generalLiabilityExpiration ?? null,
        status: input.status ?? "active",
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  updateInsurance: publicProcedure
    .input(
      z.object({
        id: z.number(),
        companyName: z.string().optional(),
        subcontractorTrade: z.string().optional(),
        contractSigned: z.boolean().optional(),
        subcontractorRider: z.boolean().optional(),
        additionalInsured: z.boolean().optional(),
        workersComp: z.boolean().optional(),
        generalLiabilityCarrier: z.string().optional(),
        workersCompExpiration: z.string().optional(),
        generalLiabilityExpiration: z.string().optional(),
        status: z.enum(["active", "expiring", "expired", "missing"]).optional(),
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
        await db.update(insurances).set(patch).where(eq(insurances.id, id));
      }
      return { success: true };
    }),

  deleteInsurance: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(insurances).where(eq(insurances.id, input.id));
      return { success: true };
    }),

  // ─── PERMITS ────────────────────────────────────────────────────────────────
  listPermits: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db.select().from(permits).where(eq(permits.projectId, pid)).orderBy(asc(permits.id));
    }),

  addPermit: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        address: z.string().optional(),
        permitType: z.string().optional(),
        agency: z.string().optional(),
        permitNumber: z.string().optional(),
        contractor: z.string().optional(),
        contactPhone: z.string().optional(),
        superintendent: z.string().optional(),
        expiration: z.string().optional(),
        status: z.enum(["active", "expiring", "expired", "pending"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(permits).values({
        projectId: pid,
        address: input.address ?? null,
        permitType: input.permitType ?? null,
        agency: input.agency ?? null,
        permitNumber: input.permitNumber ?? null,
        contractor: input.contractor ?? null,
        contactPhone: input.contactPhone ?? null,
        superintendent: input.superintendent ?? null,
        expiration: input.expiration ?? null,
        status: input.status ?? "active",
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  updatePermit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        address: z.string().optional(),
        permitType: z.string().optional(),
        agency: z.string().optional(),
        permitNumber: z.string().optional(),
        contractor: z.string().optional(),
        contactPhone: z.string().optional(),
        superintendent: z.string().optional(),
        expiration: z.string().optional(),
        status: z.enum(["active", "expiring", "expired", "pending"]).optional(),
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
        await db.update(permits).set(patch).where(eq(permits.id, id));
      }
      return { success: true };
    }),

  deletePermit: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(permits).where(eq(permits.id, input.id));
      return { success: true };
    }),
});
