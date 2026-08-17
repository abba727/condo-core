import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const vendorModule = readFileSync("client/src/pages/VendorsModule.jsx", "utf8");
const condoCore = readFileSync("client/src/pages/CondoCore.jsx", "utf8");
const financialsModule = readFileSync("client/src/pages/FinancialsModule.jsx", "utf8");
const documentVault = readFileSync("client/src/pages/DocumentVaultDb.jsx", "utf8");

describe("Vendor bid attachment rendering", () => {
  it("marks missing migrated attachments unavailable instead of rendering a hash link", () => {
    expect(vendorModule).toContain("doc.fileUrl ? (");
    expect(vendorModule).toContain("(unavailable)");
    expect(vendorModule).not.toContain("href={doc.fileUrl || '#'}");
  });
});

describe("Vendor primary contact and overlays", () => {
  it("provides a promotion action that updates the primary contact through the contact procedure", () => {
    expect(vendorModule).toContain("promoteContactMut");
    expect(vendorModule).toContain("Make primary");
    expect(vendorModule).toContain("contact_promoted");
  });

  it("does not attach backdrop click dismissal to shared and custom overlay containers", () => {
    expect(condoCore).not.toContain('className="modal-backdrop" onClick={onClose}');
    expect(financialsModule).not.toContain('className="modal-backdrop" onClick={onClose}');
    expect(vendorModule).not.toContain('className="modal-backdrop" onClick={onClose}');
    expect(documentVault).not.toContain('target === e.currentTarget) onClose()');
    expect(documentVault).not.toContain('target === e.currentTarget) setConfirmDelete(null)');
  });
});
