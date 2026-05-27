import { eq, asc, and } from "drizzle-orm";
import { z } from "zod";
import { vendors, vendorBids } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs"; // TODO: make dynamic when multi-project

export const vendorsRouter = router({
  // ─── Vendors ───────────────────────────────────────────────────────────────
  list: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(vendors)
        .where(eq(vendors.projectId, pid))
        .orderBy(asc(vendors.companyName));
    }),

  add: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        companyName: z.string().min(1),
        contactName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        officePhone: z.string().optional(),
        fax: z.string().optional(),
        address: z.string().optional(),
        trade: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["active", "inactive", "pending"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const result = await db.insert(vendors).values({
        projectId: pid,
        companyName: input.companyName,
        contactName: input.contactName ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        officePhone: input.officePhone ?? null,
        fax: input.fax ?? null,
        address: input.address ?? null,
        trade: input.trade ?? null,
        category: input.category ?? null,
        status: input.status ?? "active",
        notes: input.notes ?? null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        officePhone: z.string().optional(),
        fax: z.string().optional(),
        address: z.string().optional(),
        trade: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["active", "inactive", "pending"]).optional(),
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
        await db.update(vendors).set(patch).where(eq(vendors.id, id));
      }
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(vendors).where(eq(vendors.id, input.id));
      return { success: true };
    }),

  // ─── Bids ──────────────────────────────────────────────────────────────────
  listBids: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(vendorBids)
        .where(eq(vendorBids.projectId, pid))
        .orderBy(asc(vendorBids.createdAt));
    }),

  addBid: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        vendorId: z.number(),
        vendorName: z.string().optional(),
        division: z.string().optional(),
        scope: z.string().optional(),
        bidAmount: z.number().optional(),
        status: z.enum(["pending", "received", "approved", "rejected", "contracted"]).optional(),
        bidDate: z.string().optional(),
        expiryDate: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const result = await db.insert(vendorBids).values({
        projectId: pid,
        vendorId: input.vendorId,
        vendorName: input.vendorName ?? null,
        division: input.division ?? null,
        scope: input.scope ?? null,
        bidAmount: String(input.bidAmount ?? 0),
        status: input.status ?? "pending",
        bidDate: input.bidDate ?? null,
        expiryDate: input.expiryDate ?? null,
        notes: input.notes ?? null,
      });
      return { id: Number(result[0].insertId) };
    }),

  updateBid: publicProcedure
    .input(
      z.object({
        id: z.number(),
        vendorName: z.string().optional(),
        division: z.string().optional(),
        scope: z.string().optional(),
        bidAmount: z.number().optional(),
        status: z.enum(["pending", "received", "approved", "rejected", "contracted"]).optional(),
        bidDate: z.string().optional(),
        expiryDate: z.string().optional(),
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
          patch[k] = k === "bidAmount" ? String(v) : v;
        }
      }
      if (Object.keys(patch).length > 0) {
        await db.update(vendorBids).set(patch).where(eq(vendorBids.id, id));
      }
      return { success: true };
    }),

  deleteBid: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(vendorBids).where(eq(vendorBids.id, input.id));
      return { success: true };
    }),
});
