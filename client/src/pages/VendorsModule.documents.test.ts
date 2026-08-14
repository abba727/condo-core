import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const vendorModule = readFileSync("client/src/pages/VendorsModule.jsx", "utf8");

describe("Vendor bid attachment rendering", () => {
  it("marks missing migrated attachments unavailable instead of rendering a hash link", () => {
    expect(vendorModule).toContain("doc.fileUrl ? (");
    expect(vendorModule).toContain("(unavailable)");
    expect(vendorModule).not.toContain("href={doc.fileUrl || '#'}");
  });
});
