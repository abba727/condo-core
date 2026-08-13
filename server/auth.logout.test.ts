import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("auth.logout", () => {
  it("is a no-op while authentication is intentionally deferred", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.auth.logout()).resolves.toEqual({ success: true });
  });
});
