/**
 * Seed vendors from the DRIGGS_712 data into the database.
 * Run with: npx tsx server/seed-vendors.mjs
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const { drizzle } = await import("drizzle-orm/mysql2");
const mysql = await import("mysql2/promise");
const { vendors } = await import("../drizzle/schema.ts");

// Load seed data
const seedPath = path.join(__dirname, "../client/src/data/driggs712.js");
const seedSrc = await import("file://" + seedPath);
const SEED = seedSrc.DRIGGS_712_SEED;

const PROJECT_ID = "712-driggs";

function trackerAmt(val) {
  if (val === null || val === undefined || val === "") return 0;
  const n = Number(String(val).replace(/[$,]/g, ""));
  return isNaN(n) ? 0 : n;
}

function classifyTrade(name) {
  if (!name) return "General";
  const n = name.toLowerCase();
  if (n.includes("architect") || n.includes("design")) return "Architecture";
  if (n.includes("engineer") || n.includes("engineering")) return "Engineering";
  if (n.includes("electric") || n.includes("electrical")) return "Electrical";
  if (n.includes("plumb")) return "Plumbing";
  if (n.includes("hvac") || n.includes("mechanical")) return "HVAC";
  if (n.includes("mason") || n.includes("masonry")) return "Masonry";
  if (n.includes("scaffold")) return "Scaffolding";
  if (n.includes("excavat") || n.includes("shoring")) return "Excavation";
  if (n.includes("concrete")) return "Concrete";
  if (n.includes("steel") || n.includes("metal")) return "Structural Steel";
  if (n.includes("window") || n.includes("glass")) return "Windows";
  if (n.includes("roof")) return "Roofing";
  if (n.includes("survey")) return "Surveying";
  if (n.includes("consult")) return "Consulting";
  if (n.includes("legal") || n.includes("law") || n.includes("attorney")) return "Legal";
  if (n.includes("title")) return "Title";
  if (n.includes("insurance")) return "Insurance";
  if (n.includes("mapping") || n.includes("borough")) return "Surveying";
  if (n.includes("scaffold")) return "Scaffolding";
  return "General";
}

// Build a deduplicated vendor map from all seed sources
const vendorMap = new Map();

function addVendor(name, data = {}) {
  if (!name) return;
  const key = String(name).trim();
  if (!key) return;
  if (!vendorMap.has(key)) {
    vendorMap.set(key, {
      companyName: key,
      contactName: data.contact || null,
      email: data.email || null,
      phone: data.phone || null,
      trade: classifyTrade(key),
      category: data.category || null,
      status: "active",
      notes: null,
    });
  }
  const v = vendorMap.get(key);
  if (data.contact && !v.contactName) v.contactName = data.contact;
  if (data.email && !v.email) v.email = data.email;
  if (data.phone && !v.phone) v.phone = data.phone;
}

// Contracts
(SEED.contracts || []).forEach((row) => addVendor(row.Vendor, { category: "Contracted" }));

// Team
(SEED.team || []).forEach((row) => {
  const name = row.Company || row.Contact;
  addVendor(name, {
    contact: String(row.Contact || "").split("|").pop()?.trim() || row.Contact,
    email: row.Email,
    phone: row.Phone,
    category: "Team",
  });
});

// Lookup directory
(SEED.lookup || []).forEach((row) => {
  const name = row["Company Name"] || row["Company | Name"];
  addVendor(name, {
    contact: row.Name,
    email: row.Email,
    phone: row.Phone,
    category: "Directory",
  });
});

// Insurances
(SEED.insurances || []).forEach((row) => {
  addVendor(row.Company, { category: "Subcontractor" });
});

// Permits
(SEED.permits || []).forEach((row) => {
  addVendor(row.Contractor, {
    phone: row.Contact,
    category: "Permit Contractor",
  });
});

// Expenses (unique vendors)
(SEED.expenses || []).forEach((row) => {
  if (row.Vendor) addVendor(row.Vendor, { category: "Expense Payee" });
});

console.log(`🌱 Seeding ${vendorMap.size} vendors...`);

const connection = await mysql.default.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

for (const [name, data] of vendorMap.entries()) {
  await db.insert(vendors).values({
    projectId: PROJECT_ID,
    companyName: data.companyName,
    contactName: data.contactName,
    email: data.email,
    phone: data.phone,
    officePhone: null,
    fax: null,
    address: null,
    trade: data.trade,
    category: data.category,
    status: "active",
    notes: null,
  }).onDuplicateKeyUpdate({ set: { companyName: data.companyName } });
}

console.log("✅ Vendors seeded!");
await connection.end();
process.exit(0);
