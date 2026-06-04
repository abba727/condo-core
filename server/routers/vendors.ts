import { eq, asc, and, desc } from "drizzle-orm";
import { z } from "zod";
import { vendors, vendorBids, vendorCois, vendorAuditLog, vendorDocuments, budgetLines } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs"; // TODO: make dynamic when multi-project

/**
 * Atomically adjust committedAmount on the budget line matching the given
 * CSI-prefixed division label (e.g. "17.02 — Architect's Report / DOF Tax Maps").
 * Strips the CSI prefix before matching by line name.
 * Returns silently if no matching line is found.
 */
async function adjustCommittedForBid(
  db: Awaited<ReturnType<typeof getDb>>,
  projectId: string,
  division: string | null | undefined,
  delta: number
): Promise<void> {
  if (!db || !division || delta === 0) return;
  const rawName = division.includes(" \u2014 ")
    ? division.split(" \u2014 ").slice(1).join(" \u2014 ").trim()
    : division.trim();
  const lines = await db
    .select()
    .from(budgetLines)
    .where(eq(budgetLines.projectId, projectId));
  const match = lines.find((l) => {
    const lName = (l.name || "").trim();
    return lName === rawName || lName === division.trim();
  });
  if (!match) return; // division may be a group label — skip silently
  const current = parseFloat(match.committedAmount ?? "0") || 0;
  const updated = Math.max(0, current + delta);
  await db
    .update(budgetLines)
    .set({ committedAmount: String(updated) })
    .where(eq(budgetLines.id, match.id));
}

const APPROVED_STATUSES = new Set(["approved", "contracted"]);

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
        defaultDivision: z.string().optional(),
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

  toggleAssignment: publicProcedure
    .input(z.object({ id: z.number(), assigned: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(vendors)
        .set({ assignedToProject: input.assigned })
        .where(eq(vendors.id, input.id));
      await db.insert(vendorAuditLog).values({
        vendorId: input.id,
        action: input.assigned ? "vendor_assigned" : "vendor_unassigned",
        detail: JSON.stringify({ assigned: input.assigned }),
      });
      return { success: true, assigned: input.assigned };
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
      // If the new bid is already approved/contracted, add to committed immediately
      if (APPROVED_STATUSES.has(input.status ?? "")) {
        await adjustCommittedForBid(db, pid, input.division, Number(input.bidAmount ?? 0));
      }
      return { id: Number(result[0].insertId) };
    }),

  updateBid: publicProcedure
    .input(
      z.object({
        id: z.number(),
        projectId: z.string().optional(),
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
      const { id, projectId: _pid, ...rest } = input;

      // Fetch the current bid state before updating
      const [existing] = await db
        .select()
        .from(vendorBids)
        .where(eq(vendorBids.id, id));

      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) {
          patch[k] = k === "bidAmount" ? String(v) : v;
        }
      }
      if (Object.keys(patch).length > 0) {
        await db.update(vendorBids).set(patch).where(eq(vendorBids.id, id));
      }

      // Adjust committed based on status / amount / division transitions
      if (existing) {
        const wasApproved = APPROVED_STATUSES.has(existing.status ?? "");
        const newStatus = input.status ?? existing.status ?? "";
        const nowApproved = APPROVED_STATUSES.has(newStatus);
        const oldDiv = existing.division;
        const newDiv = input.division !== undefined ? input.division : oldDiv;
        const oldAmt = parseFloat(existing.bidAmount ?? "0") || 0;
        const newAmt = input.bidAmount !== undefined ? Number(input.bidAmount) : oldAmt;

        if (!wasApproved && nowApproved) {
          // Newly approved — add to committed
          await adjustCommittedForBid(db, pid, newDiv, newAmt);
        } else if (wasApproved && !nowApproved) {
          // Un-approved — remove from committed
          await adjustCommittedForBid(db, pid, oldDiv, -oldAmt);
        } else if (wasApproved && nowApproved) {
          // Still approved — handle division or amount changes
          if (oldDiv !== newDiv) {
            await adjustCommittedForBid(db, pid, oldDiv, -oldAmt);
            await adjustCommittedForBid(db, pid, newDiv, newAmt);
          } else if (oldAmt !== newAmt) {
            await adjustCommittedForBid(db, pid, newDiv, newAmt - oldAmt);
          }
        }
      }

      return { success: true };
    }),

  deleteBid: publicProcedure
    .input(z.object({ id: z.number(), projectId: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;

      // Fetch before deleting so we can reverse committed if needed
      const [existing] = await db
        .select()
        .from(vendorBids)
        .where(eq(vendorBids.id, input.id));

      await db.delete(vendorBids).where(eq(vendorBids.id, input.id));

      if (existing && APPROVED_STATUSES.has(existing.status ?? "")) {
        const amt = parseFloat(existing.bidAmount ?? "0") || 0;
        await adjustCommittedForBid(db, pid, existing.division, -amt);
      }

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
        sourceType: z.enum(["vendor", "bid", "expense"]).optional(),
        bidId: z.number().optional(),
        expenseId: z.number().optional(),
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
        sourceType: input.sourceType ?? "vendor",
        bidId: input.bidId ?? null,
        expenseId: input.expenseId ?? null,
      });
      await db.insert(vendorAuditLog).values({
        vendorId: input.vendorId,
        action: "document_uploaded",
        detail: JSON.stringify({ fileName: input.fileName, sourceType: input.sourceType ?? "vendor" }),
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
