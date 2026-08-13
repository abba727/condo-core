import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync("client/src/pages/condocore.css", "utf8");
const pageRule = stylesheet.match(/\.page\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("CondoCore shared page layout", () => {
  it("uses the full available main workspace on wide screens", () => {
    expect(pageRule).toContain("width: 100%");
    expect(pageRule).toContain("min-width: 0");
    expect(pageRule).toContain("flex: 1");
    expect(pageRule).not.toMatch(/max-width\s*:/);
  });
});
