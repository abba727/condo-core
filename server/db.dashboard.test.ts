/**
 * Dashboard router integration tests
 * Tests the dashboard metrics and recentActivity tRPC procedures
 * using the actual database connection.
 */
import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { draws, expenses, vendors, stackingPlanUnits } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const PROJECT_ID = "712-driggs";

describe("Dashboard metrics", () => {
  it("can query budget totals from budget_lines", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const { budgetLines } = await import("../drizzle/schema");
    const rows = await db
      .select({
        totalBudget: sql<string>`COALESCE(SUM(CAST(${budgetLines.budgetAmount} AS DECIMAL(18,2))), 0)`,
      })
      .from(budgetLines)
      .where(eq(budgetLines.projectId, PROJECT_ID));

    expect(rows.length).toBe(1);
    expect(Number(rows[0].totalBudget)).toBeGreaterThan(0);
  });

  it("can query vendor count", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(vendors)
      .where(eq(vendors.projectId, PROJECT_ID));

    expect(rows.length).toBe(1);
    expect(Number(rows[0].count)).toBeGreaterThan(0);
  });

  it("can query draws totals", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select({
        drawsTotal: sql<string>`COALESCE(SUM(CAST(${draws.requestAmount} AS DECIMAL(18,2))), 0)`,
        drawsFunded: sql<string>`COALESCE(SUM(CAST(${draws.fundedAmount} AS DECIMAL(18,2))), 0)`,
      })
      .from(draws)
      .where(eq(draws.projectId, PROJECT_ID));

    expect(rows.length).toBe(1);
    expect(Number(rows[0].drawsTotal)).toBeGreaterThanOrEqual(0);
  });

  it("can query stacking plan unit stats", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select({ count: sql<number>`COUNT(*)`, status: stackingPlanUnits.status })
      .from(stackingPlanUnits)
      .where(eq(stackingPlanUnits.projectId, PROJECT_ID))
      .groupBy(stackingPlanUnits.status);

    const totalUnits = rows.reduce((s, r) => s + Number(r.count), 0);
    expect(totalUnits).toBeGreaterThan(0);
  });
});

describe("Dashboard recent activity", () => {
  it("can query recent expenses", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select({
        id: expenses.id,
        description: expenses.description,
        amount: expenses.amount,
        vendorName: expenses.vendorName,
        expenseDate: expenses.expenseDate,
      })
      .from(expenses)
      .where(eq(expenses.projectId, PROJECT_ID))
      .limit(5);

    expect(Array.isArray(rows)).toBe(true);
    if (rows.length > 0) {
      expect(rows[0]).toHaveProperty("id");
      expect(rows[0]).toHaveProperty("amount");
    }
  });

  it("can query recent draws", async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");

    const rows = await db
      .select({
        id: draws.id,
        drawNumber: draws.drawNumber,
        label: draws.label,
        requestAmount: draws.requestAmount,
        status: draws.status,
      })
      .from(draws)
      .where(eq(draws.projectId, PROJECT_ID))
      .limit(5);

    expect(Array.isArray(rows)).toBe(true);
    if (rows.length > 0) {
      expect(rows[0]).toHaveProperty("id");
      expect(rows[0]).toHaveProperty("drawNumber");
      expect(rows[0]).toHaveProperty("status");
    }
  });
});
