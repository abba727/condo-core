import { eq, asc, and, desc } from "drizzle-orm";
import { z } from "zod";
import { vendors, vendorBids, vendorCois, vendorAuditLog, vendorDocuments } from "../../drizzle/schema";
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
        ein: z.string().optional(),
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
        ein: input.ein ?? null,
      });
      const id = Number(result[0].insertId);
      // Audit log
      await db.insert(vendorAuditLog).values({
        vendorId: id,
        action: "vendor_added",
        detail: JSON.stringify({ name: input.companyName, trade: input.trade ?? "" }),
      });
      return { id };
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
        ein: z.string().optional(),
        rating: z.number().optional(),
        paid: z.number().optional(),
        contractValue: z.number().optional(),
        coiExpires: z.string().optional(),
        coiOk: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) {
          if (k === "paid" || k === "contractValue") patch[k] = String(v);
          else patch[k] = v;
        }
      }
      if (Object.keys(patch).length > 0) {
        await db.update(vendors).set(patch).where(eq(vendors.id, id));
      }
      // Audit log
      await db.insert(vendorAuditLog).values({
        vendorId: id,
        action: "vendor_edited",
        detail: JSON.stringify({ changes: Object.keys(patch) }),
      });
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

  archive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(vendors).set({ status: "inactive", archived: true, archivedAt: new Date() }).where(eq(vendors.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.id,
        action: "vendor_archived",
        detail: JSON.stringify({ archivedAt: new Date().toISOString() }),
      });
      return { success: true };
    }),

  restore: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(vendors).set({ status: "active", archived: false, archivedAt: null }).where(eq(vendors.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.id,
        action: "vendor_restored",
        detail: JSON.stringify({}),
      });
      return { success: true };
    }),

  updateRating: publicProcedure
    .input(z.object({ id: z.number(), rating: z.number().min(0).max(5) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(vendors).set({ rating: input.rating }).where(eq(vendors.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.id,
        action: "rating_changed",
        detail: JSON.stringify({ to: input.rating }),
      });
      return { success: true };
    }),

  addDocumentAudit: publicProcedure
    .input(z.object({ id: z.number(), fileName: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(vendorAuditLog).values({
        vendorId: input.id,
        action: "document_uploaded",
        detail: JSON.stringify({ name: input.fileName }),
      });
      return { success: true };
    }),

  // ─── Audit Log ─────────────────────────────────────────────────────────────
  listAuditLog: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(vendorAuditLog)
        .where(eq(vendorAuditLog.vendorId, input.vendorId))
        .orderBy(asc(vendorAuditLog.createdAt));
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

  // ─── COIs ──────────────────────────────────────────────────────────────────
  listCois: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(vendorCois)
        .where(eq(vendorCois.vendorId, input.vendorId))
        .orderBy(asc(vendorCois.createdAt));
    }),

  addCoi: publicProcedure
    .input(
      z.object({
        vendorId: z.number(),
        type: z.string().optional(),
        carrier: z.string().optional(),
        policyNumber: z.string().optional(),
        expires: z.string().optional(),
        status: z.enum(["active", "expired", "expiring_soon"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(vendorCois).values({
        vendorId: input.vendorId,
        type: input.type ?? null,
        carrier: input.carrier ?? null,
        policyNumber: input.policyNumber ?? null,
        expires: input.expires ?? null,
        status: input.status ?? "active",
        notes: input.notes ?? null,
      });
      await db.insert(vendorAuditLog).values({
        vendorId: input.vendorId,
        action: "coi_added",
        detail: JSON.stringify({ type: input.type, carrier: input.carrier, expires: input.expires }),
      });
      return { id: Number(result[0].insertId) };
    }),

  updateCoi: publicProcedure
    .input(
      z.object({
        id: z.number(),
        vendorId: z.number(),
        type: z.string().optional(),
        carrier: z.string().optional(),
        policyNumber: z.string().optional(),
        expires: z.string().optional(),
        status: z.enum(["active", "expired", "expiring_soon"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, vendorId, ...rest } = input;
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) patch[k] = v;
      }
      if (Object.keys(patch).length > 0) {
        await db.update(vendorCois).set(patch).where(eq(vendorCois.id, id));
      }
      await db.insert(vendorAuditLog).values({
        vendorId,
        action: "coi_updated",
        detail: JSON.stringify({ id }),
      });
      return { success: true };
    }),

  deleteCoi: publicProcedure
    .input(z.object({ id: z.number(), vendorId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(vendorCois).where(eq(vendorCois.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.vendorId,
        action: "coi_deleted",
        detail: JSON.stringify({ id: input.id }),
      });
      return { success: true };
    }),

  // ─── Vendor Documents ──────────────────────────────────────────────────────
  listDocuments: publicProcedure
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(vendorDocuments)
        .where(eq(vendorDocuments.vendorId, input.vendorId))
        .orderBy(desc(vendorDocuments.uploadedAt));
    }),

  addDocument: publicProcedure
    .input(
      z.object({
        vendorId: z.number(),
        projectId: z.string().optional(),
        fileName: z.string(),
        fileKey: z.string().optional(),
        fileUrl: z.string().optional(),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const result = await db.insert(vendorDocuments).values({
        vendorId: input.vendorId,
        projectId: pid,
        fileName: input.fileName,
        fileKey: input.fileKey ?? null,
        fileUrl: input.fileUrl ?? null,
        fileSize: input.fileSize ?? null,
        mimeType: input.mimeType ?? null,
        description: input.description ?? null,
      });
      await db.insert(vendorAuditLog).values({
        vendorId: input.vendorId,
        action: "document_uploaded",
        detail: JSON.stringify({ fileName: input.fileName }),
      });
      return { id: Number((result as any).insertId), success: true };
    }),

  deleteDocument: publicProcedure
    .input(z.object({ id: z.number(), vendorId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(vendorDocuments).where(eq(vendorDocuments.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.vendorId,
        action: "document_deleted",
        detail: JSON.stringify({ id: input.id }),
      });
      return { success: true };
    }),
});
