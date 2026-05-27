/**
 * CondoCore Database Seed Script
 * Seeds the DRIGGS_712 demo project data into the database.
 * Run with: node server/seed.mjs
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

// Dynamic imports for ESM compatibility
const { drizzle } = await import("drizzle-orm/mysql2");
const mysql = await import("mysql2/promise");

const {
  projects,
  budgetGroups,
  budgetLines,
  expenses,
  vendors,
  vendorBids,
  contracts,
  insurances,
  permits,
  planTasks,
} = await import("../drizzle/schema.ts");

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

function trackerAmount(val) {
  if (val === null || val === undefined || val === "") return 0;
  const n = Number(String(val).replace(/[$,]/g, ""));
  return isNaN(n) ? 0 : n;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Load seed data ───────────────────────────────────────────────────────────
const seedPath = path.join(__dirname, "../client/src/data/driggs712.js");
const seedSrc = await import("file://" + seedPath);
const SEED = seedSrc.DRIGGS_712_SEED;

const PROJECT_ID = "712-driggs";

// ─── Connect to DB ────────────────────────────────────────────────────────────
const connection = await mysql.default.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🌱 Starting CondoCore seed...");

// ─── 1. Project ───────────────────────────────────────────────────────────────
console.log("  → Inserting project...");
await db.insert(projects).values({
  id: PROJECT_ID,
  name: SEED.project.name,
  fullName: SEED.project.full,
  address: SEED.project.address,
  phase: SEED.project.phase,
  phaseClass: SEED.project.phaseClass,
  status: SEED.project.status,
  statusClass: SEED.project.statusClass,
  totalBudget: String(SEED.project.budget),
  units: SEED.project.units,
  floors: SEED.project.floors,
  targetCompletion: SEED.project.targetCompletion,
  progress: SEED.project.progress,
  initials: SEED.project.initials,
  generalContractor: SEED.project.generalContractor,
  projectStartDate: SEED.project.projectStartDate,
  scheduleStartISO: SEED.meta.scheduleStartISO,
  scheduleEndISO: SEED.meta.scheduleEndISO,
}).onDuplicateKeyUpdate({ set: { name: SEED.project.name } });

// ─── 2. Budget Groups & Lines ─────────────────────────────────────────────────
console.log("  → Inserting budget groups and lines...");

const CATEGORY_TO_TYPE = {
  "General Condition": "hard",
  "Foundation Site Work": "hard",
  "Superstructure": "hard",
  "Carpentry": "hard",
  "Windows and Storefront": "hard",
  "Masonry and Stucco": "hard",
  "Roof": "hard",
  "Elevator": "hard",
  "Plumbing and Sprinkler": "hard",
  "HVAC": "hard",
  "Electric": "hard",
  "Miscellaneous Site Work": "hard",
  "Equipment and Miscellaneous": "hard",
  "Kitchen, Bathrooms and Fixtures": "hard",
  "Overhead & Profit": "other",
  "Contingencies": "contingency",
  "Land Costs": "soft",
  "Soft Costs": "soft",
};

// Group budget rows by category
const grouped = {};
SEED.budget.forEach((row) => {
  const cat = row.Category || "Uncategorized";
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(row);
});

const groupIdMap = {}; // cat -> groupId
let groupOrder = 0;
for (const [cat, rows] of Object.entries(grouped)) {
  const groupId = `grp-seed-${groupOrder + 1}`;
  groupIdMap[cat] = groupId;
  const type = CATEGORY_TO_TYPE[cat] || "hard";

  await db.insert(budgetGroups).values({
    id: groupId,
    projectId: PROJECT_ID,
    label: cat,
    type,
    sortOrder: groupOrder,
    collapsed: false,
  }).onDuplicateKeyUpdate({ set: { label: cat } });

  // Insert lines for this group
  for (let li = 0; li < rows.length; li++) {
    const row = rows[li];
    const budget = Number(row.Amount || 0);
    const isFixed = row.Status && row.Status !== "Open";
    const lineId = `line-seed-${groupOrder + 1}-${li + 1}`;

    await db.insert(budgetLines).values({
      id: lineId,
      projectId: PROJECT_ID,
      groupId,
      name: row["Sub-Category"] || cat,
      budgetAmount: String(budget),
      committedAmount: isFixed ? String(budget) : "0",
      isContingency: type === "contingency",
      contingencyPct: null,
      sortOrder: li,
      status: isFixed ? "fixed" : "open",
    }).onDuplicateKeyUpdate({ set: { name: row["Sub-Category"] || cat } });
  }

  groupOrder++;
}

// ─── 3. Expenses ──────────────────────────────────────────────────────────────
console.log("  → Inserting expenses...");

const expenseRows = SEED.expenses || [];
for (let i = 0; i < expenseRows.length; i++) {
  const row = expenseRows[i];
  const debit = trackerAmount(row.Debit);
  const credit = trackerAmount(row.Credit);
  const amount = debit > 0 ? debit : -credit;
  if (amount === 0) continue; // skip zero-amount rows

  const rawDate = row.Date;
  let expenseDate = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      expenseDate = d.toISOString().split("T")[0];
    }
  }

  const methodRaw = String(row.Type || "").toLowerCase();
  let method = "other";
  if (methodRaw.includes("wire")) method = "wire";
  else if (methodRaw.includes("ach")) method = "ach";
  else if (methodRaw.includes("chk") || methodRaw.includes("check")) method = "check";
  else if (methodRaw.includes("zelle")) method = "zelle";
  else if (methodRaw.includes("deposit")) method = "deposit";

  const status = debit > 0 ? "paid" : "approved";
  const division = row.Category || (credit > 0 ? "Capital / contributions" : "Uncategorized");

  await db.insert(expenses).values({
    id: `exp-seed-${i + 1}`,
    projectId: PROJECT_ID,
    vendorName: row.Vendor || (credit > 0 ? "Project capital account" : "712 Driggs ledger"),
    description: row.Memo || row.Type || "Ledger entry",
    division,
    amount: String(Math.abs(amount)),
    expenseDate,
    method,
    invoiceNumber: `LEDGER-${String(i + 1).padStart(4, "0")}`,
    status,
  }).onDuplicateKeyUpdate({ set: { description: row.Memo || "Ledger entry" } });
}

// ─── 4. Contracts ─────────────────────────────────────────────────────────────
console.log("  → Inserting contracts...");

const contractRows = SEED.contracts || [];
for (let i = 0; i < contractRows.length; i++) {
  const row = contractRows[i];
  await db.insert(contracts).values({
    projectId: PROJECT_ID,
    vendorName: row.Vendor,
    contractDate: parseDate(row.Date),
    contractTotal: String(trackerAmount(row["Contract Total"])),
    totalPaid: String(trackerAmount(row["Total Paid"])),
    totalRemaining: String(trackerAmount(row["Total Remaining"])),
    status: "executed",
  }).onDuplicateKeyUpdate({ set: { vendorName: row.Vendor } });
}

// ─── 5. Insurances ────────────────────────────────────────────────────────────
console.log("  → Inserting insurances...");

const insuranceRows = SEED.insurances || [];
for (let i = 0; i < insuranceRows.length; i++) {
  const row = insuranceRows[i];
  const glExpDays = row["General Liability Expiration(d)"] ?? row["Workers Comp Expiration (d)"];
  const status = glExpDays === null ? "missing" : Number(glExpDays) >= 0 ? "active" : "expired";

  await db.insert(insurances).values({
    projectId: PROJECT_ID,
    companyName: row.Company || "Unknown",
    subcontractorTrade: row.Subcontractor,
    contractSigned: row["Contract Signed"] === "YES",
    subcontractorRider: row["Subcontractor Rider"] === "YES",
    additionalInsured: row["Additional Insured"] === "YES",
    workersComp: row["Workers Comp"] === "YES",
    generalLiabilityCarrier: row["General Liability"],
    workersCompExpiration: parseDate(row["Workers Comp Expiration"]),
    generalLiabilityExpiration: parseDate(row["General Liability Expiration"]),
    status,
  }).onDuplicateKeyUpdate({ set: { companyName: row.Company || "Unknown" } });
}

// ─── 6. Permits ───────────────────────────────────────────────────────────────
console.log("  → Inserting permits...");

const permitRows = SEED.permits || [];
for (let i = 0; i < permitRows.length; i++) {
  const row = permitRows[i];
  const daysLeft = row["Number of Days Left"];
  const status = daysLeft === null ? "pending" : Number(daysLeft) >= 30 ? "active" : Number(daysLeft) >= 0 ? "expiring" : "expired";

  await db.insert(permits).values({
    projectId: PROJECT_ID,
    address: row.Address,
    permitType: row["Permit Type"],
    agency: row.Agency,
    permitNumber: row["Permit Number"],
    contractor: row.Contractor,
    contactPhone: row.Contact,
    superintendent: row.Superintendent,
    expiration: parseDate(row.Expiration),
    status,
  }).onDuplicateKeyUpdate({ set: { permitNumber: row["Permit Number"] } });
}

// ─── 7. Plan Tasks ────────────────────────────────────────────────────────────
console.log("  → Inserting plan tasks...");

const planTaskRows = SEED.planTasks || [];
for (const row of planTaskRows) {
  const statusMap = {
    "Done": "Done",
    "In progress": "In Progress",
    "Open": "Open",
    "Blocked": "Blocked",
  };

  await db.insert(planTasks).values({
    id: row.id,
    projectId: PROJECT_ID,
    sourceRow: row.sourceRow,
    wbs: row.wbs,
    name: row.name,
    owner: row.owner,
    phase: row.phase,
    days: row.days,
    startISO: row.startISO,
    endISO: row.endISO,
    pctComplete: row.pctComplete,
    status: statusMap[row.status] || "Open",
    bucket: row.bucket,
    ganttX: row.x,
    ganttW: row.w,
  }).onDuplicateKeyUpdate({ set: { name: row.name } });
}

// ─── Done ─────────────────────────────────────────────────────────────────────
console.log("✅ Seed complete!");
await connection.end();
process.exit(0);
