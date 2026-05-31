import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { documents } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs";

export const documentsRouter = router({
  list: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      return db
        .select()
        .from(documents)
        .where(eq(documents.projectId, pid))
        .orderBy(asc(documents.category), asc(documents.name));
    }),

  add: publicProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        name: z.string(),
        category: z.string().optional(),
        fileKey: z.string().optional(),
        fileUrl: z.string().optional(),
        mimeType: z.string().optional(),
        sizeBytes: z.number().optional(),
        uploadedBy: z.string().optional(),
        version: z.string().optional(),
        status: z.enum(["draft", "current", "superseded", "archived"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const pid = input.projectId ?? PROJECT_ID;
      const [result] = await db.insert(documents).values({
        projectId: pid,
        name: input.name,
        category: input.category ?? null,
        fileKey: input.fileKey ?? null,
        fileUrl: input.fileUrl ?? null,
        mimeType: input.mimeType ?? null,
        sizeBytes: input.sizeBytes ?? null,
        uploadedBy: input.uploadedBy ?? null,
        version: input.version ?? null,
        status: input.status ?? "current",
        notes: input.notes ?? null,
      });
      return { id: (result as any).insertId };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        fileKey: z.string().optional(),
        fileUrl: z.string().optional(),
        mimeType: z.string().optional(),
        sizeBytes: z.number().optional(),
        uploadedBy: z.string().optional(),
        version: z.string().optional(),
        status: z.enum(["draft", "current", "superseded", "archived"]).optional(),
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
        await db.update(documents).set(patch).where(eq(documents.id, id));
      }
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(documents).where(eq(documents.id, input.id));
      return { success: true };
    }),
});
