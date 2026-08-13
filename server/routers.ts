import { publicProcedure, router } from "./_core/trpc";
import { budgetRouter } from "./routers/budget";
import { expensesRouter } from "./routers/expenses";
import { vendorsRouter } from "./routers/vendors";
import { projectsRouter } from "./routers/projects";
import { planTasksRouter } from "./routers/planTasks";
import { complianceRouter } from "./routers/compliance";
import { capitalStackRouter } from "./routers/capitalStack";
import { documentsRouter } from "./routers/documents";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(() => ({ success: true } as const)),
  }),

  // ─── Feature routers ───────────────────────────────────────────────────────
  budget: budgetRouter,
  expenses: expensesRouter,
  vendors: vendorsRouter,
  projects: projectsRouter,
  planTasks: planTasksRouter,
  compliance: complianceRouter,
  capitalStack: capitalStackRouter,
  documents: documentsRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
