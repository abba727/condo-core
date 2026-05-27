import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";
import { expenses } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs"; // TODO: make dynamic when multi-project

export const expensesRouter = router({
  list: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(expenses)
        .where(eq(expenses.projectId, pid))
        .orderBy(desc(expenses.createdAt));
    }),

  add: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        vendorId: z.number().nullable().optional(),
        vendorName: z.string().optional(),
        description: z.string().optional(),
        division: z.string().optional(),
        amount: z.number().min(0),
        expenseDate: z.string().nullable().optional(),
        method: z.enum(["wire", "ach", "check", "zelle", "deposit", "other"]).optional(),
        referenceNumber: z.string().optional(),
        invoiceNumber: z.string().optional(),
        status: z.enum(["pending", "approved", "paid", "void"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      await db.insert(expenses).values({
        id,
        projectId: pid,
        vendorId: input.vendorId ?? null,
        vendorName: input.vendorName ?? null,
        description: input.description ?? null,
        division: input.division ?? null,
        amount: String(input.amount),
        expenseDate: input.expenseDate ?? null,
        method: input.method ?? "wire",
        referenceNumber: input.referenceNumber ?? null,
        invoiceNumber: input.invoiceNumber ?? null,
        status: input.status ?? "pending",
        notes: input.notes ?? null,
      });
      return { id };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        vendorId: z.number().nullable().optional(),
        vendorName: z.string().optional(),
        description: z.string().optional(),
        division: z.string().optional(),
        amount: z.number().min(0).optional(),
        expenseDate: z.string().nullable().optional(),
        method: z.enum(["wire", "ach", "check", "zelle", "deposit", "other"]).optional(),
        referenceNumber: z.string().optional(),
        invoiceNumber: z.string().optional(),
        status: z.enum(["pending", "approved", "paid", "void"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...rest } = input;
      const patch: Record<string, unknown> = {};
      if (rest.vendorId !== undefined) patch.vendorId = rest.vendorId;
      if (rest.vendorName !== undefined) patch.vendorName = rest.vendorName;
      if (rest.description !== undefined) patch.description = rest.description;
      if (rest.division !== undefined) patch.division = rest.division;
      if (rest.amount !== undefined) patch.amount = String(rest.amount);
      if (rest.expenseDate !== undefined) patch.expenseDate = rest.expenseDate;
      if (rest.method !== undefined) patch.method = rest.method;
      if (rest.referenceNumber !== undefined) patch.referenceNumber = rest.referenceNumber;
      if (rest.invoiceNumber !== undefined) patch.invoiceNumber = rest.invoiceNumber;
      if (rest.status !== undefined) patch.status = rest.status;
      if (rest.notes !== undefined) patch.notes = rest.notes;
      if (Object.keys(patch).length > 0) {
        await db.update(expenses).set(patch).where(eq(expenses.id, id));
      }
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(expenses).where(eq(expenses.id, input.id));
      return { success: true };
    }),
});
