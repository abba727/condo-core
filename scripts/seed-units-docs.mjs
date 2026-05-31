/**
 * Seed stacking_plan_units and documents tables for 712 Driggs
 */
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const PROJECT_ID = "712-driggs";
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await createConnection(DB_URL);

// ── STACKING PLAN UNITS ──────────────────────────────────────────────────────
const units = [
  // Floor 9 (Penthouse)
  { floor: 9, unitNumber: "9A", unitType: "3BR Penthouse", bedrooms: 3, bathrooms: 2.5, sqft: 2200, status: "available", listPrice: 4500000 },
  { floor: 9, unitNumber: "9B", unitType: "4BR Penthouse", bedrooms: 4, bathrooms: 3.5, sqft: 3100, status: "reserved", listPrice: 6200000 },
  // Floor 8
  { floor: 8, unitNumber: "8A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2650000 },
  { floor: 8, unitNumber: "8B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "contracted", listPrice: 3100000, buyerName: "J. Hoffman" },
  { floor: 8, unitNumber: "8C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2600000 },
  // Floor 7
  { floor: 7, unitNumber: "7A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "reserved", listPrice: 2575000 },
  { floor: 7, unitNumber: "7B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "available", listPrice: 3050000 },
  { floor: 7, unitNumber: "7C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "contracted", listPrice: 2550000, buyerName: "M. Tanaka" },
  // Floor 6
  { floor: 6, unitNumber: "6A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2525000 },
  { floor: 6, unitNumber: "6B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "reserved", listPrice: 3000000 },
  { floor: 6, unitNumber: "6C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "closed", listPrice: 2500000, salePrice: 2480000, buyerName: "R. Chen", closingDate: "2024-03-15" },
  // Floor 5
  { floor: 5, unitNumber: "5A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2475000 },
  { floor: 5, unitNumber: "5B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "contracted", listPrice: 2950000, buyerName: "A. Williams" },
  { floor: 5, unitNumber: "5C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "reserved", listPrice: 2450000 },
  // Floor 4
  { floor: 4, unitNumber: "4A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2425000 },
  { floor: 4, unitNumber: "4B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "available", listPrice: 2900000 },
  { floor: 4, unitNumber: "4C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "reserved", listPrice: 2400000 },
  // Floor 3
  { floor: 3, unitNumber: "3A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "available", listPrice: 2300000 },
  { floor: 3, unitNumber: "3B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "reserved", listPrice: 2925000 },
  { floor: 3, unitNumber: "3C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "closed", listPrice: 2275000, salePrice: 2250000, buyerName: "P. Singh", closingDate: "2024-02-28" },
  // Floor 2
  { floor: 2, unitNumber: "2A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "contracted", listPrice: 2225000, buyerName: "S. Park" },
  { floor: 2, unitNumber: "2B", unitType: "3BR", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "available", listPrice: 2825000 },
  { floor: 2, unitNumber: "2C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "reserved", listPrice: 2275000 },
  // Floor 1
  { floor: 1, unitNumber: "1A", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1500, status: "reserved", listPrice: 2150000 },
  { floor: 1, unitNumber: "1B", unitType: "3BR Garden", bedrooms: 3, bathrooms: 2, sqft: 1820, status: "available", listPrice: 2850000 },
  { floor: 1, unitNumber: "1C", unitType: "2BR", bedrooms: 2, bathrooms: 2, sqft: 1100, status: "available", listPrice: 1750000 },
];

console.log("Seeding stacking plan units...");
// Check if already seeded
const [existing] = await conn.execute("SELECT COUNT(*) as c FROM stacking_plan_units WHERE projectId = ?", [PROJECT_ID]);
if (existing[0].c > 0) {
  console.log(`  Already seeded (${existing[0].c} units). Skipping.`);
} else {
  for (const u of units) {
    await conn.execute(
      `INSERT INTO stacking_plan_units (projectId, floor, unitNumber, unitType, bedrooms, bathrooms, sqft, status, listPrice, salePrice, buyerName, closingDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [PROJECT_ID, u.floor, u.unitNumber, u.unitType, u.bedrooms ?? null, u.bathrooms ?? null, u.sqft ?? null, u.status, u.listPrice ?? null, u.salePrice ?? null, u.buyerName ?? null, u.closingDate ?? null]
    );
  }
  console.log(`  Inserted ${units.length} units.`);
}

// ── DOCUMENTS ────────────────────────────────────────────────────────────────
const docs = [
  { name: "Offering Plan — 712 Driggs (Effective).pdf", category: "Legal & offering", mimeType: "application/pdf", sizeBytes: 8800000, uploadedBy: "Fried Frank", version: "v3.2", status: "current", notes: "Effective offering plan filed with AG" },
  { name: "DOB-NB Application Approval.pdf", category: "Permits & filings", mimeType: "application/pdf", sizeBytes: 1200000, uploadedBy: "ZProekt Architecture", version: "v1.0", status: "current" },
  { name: "GC Contract — Wonder Works (executed).pdf", category: "Legal & offering", mimeType: "application/pdf", sizeBytes: 3900000, uploadedBy: "Fried Frank", version: "v2.1", status: "current" },
  { name: "Architectural Plans — A-Series (Issued for Construction).pdf", category: "Construction", mimeType: "application/pdf", sizeBytes: 42000000, uploadedBy: "ZProekt Architecture", version: "v4.0", status: "current" },
  { name: "Structural Steel Shop Drawings.pdf", category: "Construction", mimeType: "application/pdf", sizeBytes: 12400000, uploadedBy: "GACE Engineers", version: "v2.0", status: "draft" },
  { name: "Steel Pricing Memo — Risk Notice.pdf", category: "Construction", mimeType: "application/pdf", sizeBytes: 486000, uploadedBy: "GACE Engineers", version: "v1.0", status: "current" },
  { name: "Builder's Risk Policy — Marsh.pdf", category: "Insurance / COI", mimeType: "application/pdf", sizeBytes: 2100000, uploadedBy: "Marsh McLennan", version: "v1.0", status: "current" },
  { name: "Lender Draw 12 — May 2024.xlsx", category: "Financial", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sizeBytes: 284000, uploadedBy: "Operations", version: "v1.0", status: "current" },
  { name: "Pro Forma — Updated.xlsx", category: "Financial", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sizeBytes: 1800000, uploadedBy: "Sterling PD", version: "v8.4", status: "current" },
  { name: "Marketing Brochure — JLL.pdf", category: "Marketing", mimeType: "application/pdf", sizeBytes: 18000000, uploadedBy: "JLL", version: "v2.0", status: "current" },
  { name: "Survey — Williamsburg Block 2349.pdf", category: "Permits & filings", mimeType: "application/pdf", sizeBytes: 4200000, uploadedBy: "Langan", version: "v1.0", status: "current" },
  { name: "MEP Coordination Drawings.pdf", category: "Construction", mimeType: "application/pdf", sizeBytes: 32000000, uploadedBy: "ME Engineers", version: "v1.2", status: "current" },
  { name: "Schindler Elevator COI.pdf", category: "Insurance / COI", mimeType: "application/pdf", sizeBytes: 320000, uploadedBy: "Schindler Elevator", version: "v1.0", status: "current" },
  { name: "Site Photo — May 06.jpg", category: "Construction", mimeType: "image/jpeg", sizeBytes: 4800000, uploadedBy: "Site Operations", version: "v1.0", status: "current" },
  { name: "Zoning Resolution Compliance Report.pdf", category: "Permits & filings", mimeType: "application/pdf", sizeBytes: 2300000, uploadedBy: "ZProekt Architecture", version: "v1.0", status: "current" },
  { name: "Construction Schedule — Baseline.pdf", category: "Construction", mimeType: "application/pdf", sizeBytes: 1100000, uploadedBy: "Wonder Works Construction", version: "v2.0", status: "current" },
  { name: "Phase II Draw Package.pdf", category: "Financial", mimeType: "application/pdf", sizeBytes: 890000, uploadedBy: "Operations", version: "v1.0", status: "draft" },
  { name: "Title Insurance Policy.pdf", category: "Legal & offering", mimeType: "application/pdf", sizeBytes: 1500000, uploadedBy: "Fried Frank", version: "v1.0", status: "current" },
];

console.log("Seeding documents...");
const [existingDocs] = await conn.execute("SELECT COUNT(*) as c FROM documents WHERE projectId = ?", [PROJECT_ID]);
if (existingDocs[0].c > 0) {
  console.log(`  Already seeded (${existingDocs[0].c} docs). Skipping.`);
} else {
  for (const d of docs) {
    await conn.execute(
      `INSERT INTO documents (projectId, name, category, mimeType, sizeBytes, uploadedBy, version, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [PROJECT_ID, d.name, d.category ?? null, d.mimeType ?? null, d.sizeBytes ?? null, d.uploadedBy ?? null, d.version ?? null, d.status ?? "current", d.notes ?? null]
    );
  }
  console.log(`  Inserted ${docs.length} documents.`);
}

await conn.end();
console.log("Done!");
