import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// The initial Google Cloud release has no login layer by user request.
// Reintroduce explicit authorization before enabling sensitive public workflows.
export const protectedProcedure = publicProcedure;
export const adminProcedure = publicProcedure;
