/**
 * Database router integration tests
 * Tests the budget, expenses, vendors, and projects tRPC procedures
 * using the actual database connection.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { budgetGroups, budgetLines, expenses, vendors, projects } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const PROJECT_ID = "712-driggs";

describe("Database connectivity", () => {
  it("can connect to the database", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
  });
});

describe("Budget groups", () => {
  it("returns budget groups for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const groups = await db
      .select()
      .from(budgetGroups)
      .where(eq(budgetGroups.projectId, PROJECT_ID));

    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0]).toHaveProperty("id");
    expect(groups[0]).toHaveProperty("label");
    expect(groups[0].projectId).toBe(PROJECT_ID);
  });

  it("budget groups have the expected structure", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const groups = await db
      .select()
      .from(budgetGroups)
      .where(eq(budgetGroups.projectId, PROJECT_ID));

    // Should have at least 10 CSI divisions
    expect(groups.length).toBeGreaterThanOrEqual(10);

    // Check required fields
    for (const g of groups) {
      expect(typeof g.id).toBe("string");
      expect(typeof g.label).toBe("string");
      expect(g.label.length).toBeGreaterThan(0);
    }
  });
});

describe("Budget lines", () => {
  it("returns budget lines for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const lines = await db
      .select()
      .from(budgetLines)
      .where(eq(budgetLines.projectId, PROJECT_ID));

    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]).toHaveProperty("id");
    expect(lines[0]).toHaveProperty("name");
    expect(lines[0]).toHaveProperty("budgetAmount");
  });

  it("budget lines have valid amounts", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const lines = await db
      .select()
      .from(budgetLines)
      .where(eq(budgetLines.projectId, PROJECT_ID));

    // Should have at least 30 line items
    expect(lines.length).toBeGreaterThanOrEqual(30);

    // All amounts should be parseable as numbers
    for (const l of lines) {
      const amount = parseFloat(l.budgetAmount ?? "0");
      expect(isNaN(amount)).toBe(false);
    }
  });
});

describe("Expenses", () => {
  it("returns expenses for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(expenses)
      .where(eq(expenses.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("amount");
  });

  it("expenses have valid amounts and statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(expenses)
      .where(eq(expenses.projectId, PROJECT_ID));

    const validStatuses = ["pending", "approved", "paid", "void"];
    for (const e of rows) {
      const amount = parseFloat(e.amount ?? "0");
      expect(isNaN(amount)).toBe(false);
      expect(amount).toBeGreaterThanOrEqual(0);
      if (e.status) {
        expect(validStatuses).toContain(e.status);
      }
    }
  });
});

describe("Vendors", () => {
  it("returns vendors for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(vendors)
      .where(eq(vendors.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty("id");
    expect(rows[0]).toHaveProperty("companyName");
  });

  it("has at least 40 vendors for the project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(vendors)
      .where(eq(vendors.projectId, PROJECT_ID));

    expect(rows.length).toBeGreaterThanOrEqual(40);
  });

  it("vendors have valid statuses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(vendors)
      .where(eq(vendors.projectId, PROJECT_ID));

    const validStatuses = ["active", "inactive", "pending"];
    for (const v of rows) {
      if (v.status) {
        expect(validStatuses).toContain(v.status);
      }
    }
  });
});

describe("Projects", () => {
  it("returns the 712 Driggs project", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.id, PROJECT_ID));

    expect(rows.length).toBe(1);
    expect(rows[0].id).toBe(PROJECT_ID);
    expect(rows[0].name).toContain("Driggs");
  });
});
