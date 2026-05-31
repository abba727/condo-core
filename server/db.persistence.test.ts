/**
 * Database persistence integration tests
 * Tests plan tasks, compliance (contracts/insurances/permits),
 * capital stack, draws, and the PlanTaskDbSync pctComplete range.
 */
import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import {
  planTasks,
  contracts,
  insurances,
  permits,
  capitalStackItems,
  draws,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

const PROJECT_ID = "712-driggs";

// ─── Plan Tasks ──────────────────────────────────────────────────────────────

describe("Plan tasks", () => {
  it("returns plan tasks for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(planTasks)
      .where(eq(planTasks.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("name");
    expect(rows[0].projectId).toBe(PROJECT_ID);
  });

  it("has at least 50 plan tasks seeded", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(planTasks)
      .where(eq(planTasks.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThanOrEqual(50);
  });

  it("pctComplete values are in 0-1 range", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(planTasks)
      .where(eq(planTasks.projectId, PROJECT_ID));

    for (const t of rows) {
      if (t.pctComplete != null) {
        expect(t.pctComplete).toBeGreaterThanOrEqual(0);
        expect(t.pctComplete).toBeLessThanOrEqual(1);
      }
    }
  });

  it("plan tasks have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(planTasks)
      .where(eq(planTasks.projectId, PROJECT_ID));

    const validStatuses = ["Open", "In Progress", "Done", "Blocked", "Cancelled"];
    for (const t of rows) {
      if (t.status) {
        expect(validStatuses).toContain(t.status);
      }
    }
  });
});

// ─── Contracts ───────────────────────────────────────────────────────────────

describe("Contracts", () => {
  it("returns contracts for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(contracts)
      .where(eq(contracts.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("vendorName");
  });

  it("contracts have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(contracts)
      .where(eq(contracts.projectId, PROJECT_ID));

    const validStatuses = ["draft", "executed", "complete", "terminated"];
    for (const c of rows) {
      if (c.status) {
        expect(validStatuses).toContain(c.status);
      }
    }
  });
});

// ─── Insurances ──────────────────────────────────────────────────────────────

describe("Insurances", () => {
  it("returns insurances for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(insurances)
      .where(eq(insurances.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("companyName");
  });

  it("insurances have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(insurances)
      .where(eq(insurances.projectId, PROJECT_ID));

    const validStatuses = ["active", "expiring", "expired", "missing"];
    for (const ins of rows) {
      if (ins.status) {
        expect(validStatuses).toContain(ins.status);
      }
    }
  });
});

// ─── Permits ─────────────────────────────────────────────────────────────────

describe("Permits", () => {
  it("returns permits for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(permits)
      .where(eq(permits.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
  });

  it("permits have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(permits)
      .where(eq(permits.projectId, PROJECT_ID));

    const validStatuses = ["active", "expiring", "expired", "pending"];
    for (const p of rows) {
      if (p.status) {
        expect(validStatuses).toContain(p.status);
      }
    }
  });
});

// ─── Capital Stack ────────────────────────────────────────────────────────────

describe("Capital stack", () => {
  it("returns capital stack items for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(capitalStackItems)
      .where(eq(capitalStackItems.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("label");
    expect(rows[0]).toHaveProperty("tier");
  });

  it("capital stack items have valid tiers", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(capitalStackItems)
      .where(eq(capitalStackItems.projectId, PROJECT_ID));

    const validTiers = ["equity", "mezzanine", "senior_debt", "junior_debt", "other"];
    for (const item of rows) {
      expect(validTiers).toContain(item.tier);
    }
  });

  it("capital stack amounts are parseable as numbers", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(capitalStackItems)
      .where(eq(capitalStackItems.projectId, PROJECT_ID));

    for (const item of rows) {
      const amount = parseFloat(String(item.amount ?? "0"));
      expect(isNaN(amount)).toBe(false);
      expect(amount).toBeGreaterThanOrEqual(0);
    }
  });
});

// ─── Draws ────────────────────────────────────────────────────────────────────

describe("Draws", () => {
  it("returns draws for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(draws)
      .where(eq(draws.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("drawNumber");
  });

  it("draws have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(draws)
      .where(eq(draws.projectId, PROJECT_ID));

    const validStatuses = ["draft", "submitted", "approved", "funded", "rejected"];
    for (const d of rows) {
      if (d.status) {
        expect(validStatuses).toContain(d.status);
      }
    }
  });

  it("draw amounts are parseable as numbers", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(draws)
      .where(eq(draws.projectId, PROJECT_ID));

    for (const d of rows) {
      const amount = parseFloat(String(d.requestAmount ?? "0"));
      expect(isNaN(amount)).toBe(false);
    }
  });
});
