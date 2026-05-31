import { eq, sql, and } from "drizzle-orm";
import { z } from "zod";
import {
  expenses,
  budgetLines,
  vendors,
  draws,
  stackingPlanUnits,
  vendorCois,
  planTasks,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const PROJECT_ID = "712-driggs";

export const dashboardRouter = router({
  recentActivity: publicProcedure
    .input(z.object({ projectId: z.string().optional(), limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const pid = input?.projectId ?? PROJECT_ID;
      const limit = input?.limit ?? 10;

      // Recent expenses
      const recentExpenses = await db
        .select({
          id: expenses.id,
          type: sql<string>`'expense'`,
          title: expenses.description,
          vendor: expenses.vendorName,
          amount: expenses.amount,
          createdAt: expenses.expenseDate,
        })
        .from(expenses)
        .where(eq(expenses.projectId, pid))
        .orderBy(sql`${expenses.expenseDate} DESC`)
        .limit(5);

      // Recent draws
      const recentDraws = await db
        .select({
          id: draws.id,
          type: sql<string>`'draw'`,
          drawNumber: draws.drawNumber,
          label: draws.label,
          lender: draws.lender,
          requestAmount: draws.requestAmount,
          status: draws.status,
          createdAt: draws.requestDate,
        })
        .from(draws)
        .where(eq(draws.projectId, pid))
        .orderBy(sql`${draws.requestDate} DESC`)
        .limit(5);

      // Combine and sort
      const combined = [
        ...recentExpenses.map((e) => ({
          id: `exp-${e.id}`,
          icon: 'dollar',
          cls: 'info',
          title: e.title || 'Expense',
          sub: `${e.vendor || 'Vendor'} · $${Number(e.amount || 0).toLocaleString()}`,
          time: e.createdAt || '',
        })),
        ...recentDraws.map((d) => ({
          id: `draw-${d.id}`,
          icon: 'doc',
          cls: 'warn',
          title: `Draw #${d.drawNumber}${d.label ? ` — ${d.label}` : ''}`,
          sub: `${d.lender || 'Lender'} · $${Number(d.requestAmount || 0).toLocaleString()} · ${d.status}`,
          time: d.createdAt || '',
        })),
      ].sort((a, b) => {
        const da = a.time ? new Date(a.time).getTime() : 0;
        const db2 = b.time ? new Date(b.time).getTime() : 0;
        return db2 - da;
      }).slice(0, limit);

      return combined;
    }),

  metrics: publicProcedure
    .input(z.object({ projectId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalBudget: 0,
          totalSpent: 0,
          totalCommitted: 0,
          vendorCount: 0,
          coiAlerts: 0,
          drawsTotal: 0,
          drawsFunded: 0,
          unitCount: 0,
          unitsSold: 0,
          unitsReserved: 0,
          unitsContracted: 0,
          openTaskCount: 0,
          completedTaskCount: 0,
        };
      }
      const pid = input?.projectId ?? PROJECT_ID;

      // Budget totals from budget_lines
      const budgetRows = await db
        .select({
          totalBudget: sql<string>`COALESCE(SUM(CAST(${budgetLines.budgetAmount} AS DECIMAL(18,2))), 0)`,
          totalCommitted: sql<string>`COALESCE(SUM(CAST(${budgetLines.committedAmount} AS DECIMAL(18,2))), 0)`,
        })
        .from(budgetLines)
        .where(eq(budgetLines.projectId, pid));

      // Expenses total
      const expenseRows = await db
        .select({
          totalSpent: sql<string>`COALESCE(SUM(CAST(${expenses.amount} AS DECIMAL(18,2))), 0)`,
        })
        .from(expenses)
        .where(eq(expenses.projectId, pid));

      // Vendor count
      const vendorRows = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(vendors)
        .where(and(eq(vendors.projectId, pid), eq(vendors.archived, false)));

      // COI alerts (expired COIs)
      const coiAlertRows = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(vendorCois)
        .where(eq(vendorCois.status, "expired"));

      // Draws totals
      const drawRows = await db
        .select({
          drawsTotal: sql<string>`COALESCE(SUM(CAST(${draws.requestAmount} AS DECIMAL(18,2))), 0)`,
          drawsFunded: sql<string>`COALESCE(SUM(CAST(${draws.fundedAmount} AS DECIMAL(18,2))), 0)`,
        })
        .from(draws)
        .where(eq(draws.projectId, pid));

      // Stacking plan unit stats
      const unitRows = await db
        .select({ count: sql<number>`COUNT(*)`, status: stackingPlanUnits.status })
        .from(stackingPlanUnits)
        .where(eq(stackingPlanUnits.projectId, pid))
        .groupBy(stackingPlanUnits.status);

      const unitCount = unitRows.reduce((s, r) => s + Number(r.count), 0);
      const unitsSold = unitRows.filter((r) => r.status === "closed").reduce((s, r) => s + Number(r.count), 0);
      const unitsReserved = unitRows.filter((r) => r.status === "reserved").reduce((s, r) => s + Number(r.count), 0);
      const unitsContracted = unitRows.filter((r) => r.status === "contracted").reduce((s, r) => s + Number(r.count), 0);

      // Plan task stats
      const taskRows = await db
        .select({ count: sql<number>`COUNT(*)`, status: planTasks.status })
        .from(planTasks)
        .where(eq(planTasks.projectId, pid))
        .groupBy(planTasks.status);

      const openTaskCount = taskRows
        .filter((r) => r.status !== "Done" && r.status !== "Cancelled")
        .reduce((s, r) => s + Number(r.count), 0);
      const completedTaskCount = taskRows
        .filter((r) => r.status === "Done")
        .reduce((s, r) => s + Number(r.count), 0);

      return {
        totalBudget: Number(budgetRows[0]?.totalBudget ?? 0),
        totalSpent: Number(expenseRows[0]?.totalSpent ?? 0),
        totalCommitted: Number(budgetRows[0]?.totalCommitted ?? 0),
        vendorCount: Number(vendorRows[0]?.count ?? 0),
        coiAlerts: Number(coiAlertRows[0]?.count ?? 0),
        drawsTotal: Number(drawRows[0]?.drawsTotal ?? 0),
        drawsFunded: Number(drawRows[0]?.drawsFunded ?? 0),
        unitCount,
        unitsSold,
        unitsReserved,
        unitsContracted,
        openTaskCount,
        completedTaskCount,
      };
    }),
});
