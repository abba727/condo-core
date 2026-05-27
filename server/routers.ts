import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { budgetRouter } from "./routers/budget";
import { expensesRouter } from "./routers/expenses";
import { vendorsRouter } from "./routers/vendors";
import { projectsRouter } from "./routers/projects";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Feature routers ───────────────────────────────────────────────────────
  budget: budgetRouter,
  expenses: expensesRouter,
  vendors: vendorsRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
