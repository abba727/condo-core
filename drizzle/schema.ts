import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
  float,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }),
  address: varchar("address", { length: 500 }),
  phase: varchar("phase", { length: 100 }),
  phaseClass: varchar("phaseClass", { length: 32 }),
  status: varchar("status", { length: 64 }),
  statusClass: varchar("statusClass", { length: 32 }),
  totalBudget: decimal("totalBudget", { precision: 15, scale: 2 }).default("0"),
  units: int("units"),
  floors: int("floors"),
  targetCompletion: varchar("targetCompletion", { length: 64 }),
  progress: int("progress").default(0),
  initials: varchar("initials", { length: 8 }),
  generalContractor: varchar("generalContractor", { length: 255 }),
  projectStartDate: varchar("projectStartDate", { length: 64 }),
  scheduleStartISO: varchar("scheduleStartISO", { length: 32 }),
  scheduleEndISO: varchar("scheduleEndISO", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// VENDORS
// ─────────────────────────────────────────────────────────────────────────────
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  officePhone: varchar("officePhone", { length: 64 }),
  fax: varchar("fax", { length: 64 }),
  address: varchar("address", { length: 500 }),
  trade: varchar("trade", { length: 128 }),
  category: varchar("category", { length: 128 }),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("vendors_project_idx").on(t.projectId),
]);

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR BIDS
// ─────────────────────────────────────────────────────────────────────────────
export const vendorBids = mysqlTable("vendor_bids", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  vendorId: int("vendorId").notNull(),
  vendorName: varchar("vendorName", { length: 255 }),
  division: varchar("division", { length: 128 }),
  scope: text("scope"),
  bidAmount: decimal("bidAmount", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["pending", "received", "approved", "rejected", "contracted"]).default("pending").notNull(),
  bidDate: varchar("bidDate", { length: 32 }),
  expiryDate: varchar("expiryDate", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("bids_project_idx").on(t.projectId),
  index("bids_vendor_idx").on(t.vendorId),
]);

export type VendorBid = typeof vendorBids.$inferSelect;
export type InsertVendorBid = typeof vendorBids.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  vendorId: int("vendorId"),
  vendorName: varchar("vendorName", { length: 255 }),
  contractDate: varchar("contractDate", { length: 32 }),
  contractTotal: decimal("contractTotal", { precision: 15, scale: 2 }).default("0"),
  totalPaid: decimal("totalPaid", { precision: 15, scale: 2 }).default("0"),
  totalRemaining: decimal("totalRemaining", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["draft", "executed", "complete", "terminated"]).default("draft").notNull(),
  notes: text("notes"),
  fileKey: varchar("fileKey", { length: 500 }),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("contracts_project_idx").on(t.projectId),
]);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// INSURANCE (COI)
// ─────────────────────────────────────────────────────────────────────────────
export const insurances = mysqlTable("insurances", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  vendorId: int("vendorId"),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  subcontractorTrade: varchar("subcontractorTrade", { length: 128 }),
  contractSigned: boolean("contractSigned").default(false),
  subcontractorRider: boolean("subcontractorRider").default(false),
  additionalInsured: boolean("additionalInsured").default(false),
  workersComp: boolean("workersComp").default(false),
  generalLiabilityCarrier: varchar("generalLiabilityCarrier", { length: 255 }),
  workersCompExpiration: varchar("workersCompExpiration", { length: 32 }),
  generalLiabilityExpiration: varchar("generalLiabilityExpiration", { length: 32 }),
  status: mysqlEnum("status", ["active", "expiring", "expired", "missing"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("insurance_project_idx").on(t.projectId),
]);

export type Insurance = typeof insurances.$inferSelect;
export type InsertInsurance = typeof insurances.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// PERMITS
// ─────────────────────────────────────────────────────────────────────────────
export const permits = mysqlTable("permits", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  address: varchar("address", { length: 500 }),
  permitType: varchar("permitType", { length: 255 }),
  agency: varchar("agency", { length: 64 }),
  permitNumber: varchar("permitNumber", { length: 128 }),
  contractor: varchar("contractor", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 64 }),
  superintendent: varchar("superintendent", { length: 255 }),
  expiration: varchar("expiration", { length: 32 }),
  status: mysqlEnum("status", ["active", "expiring", "expired", "pending"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("permits_project_idx").on(t.projectId),
]);

export type Permit = typeof permits.$inferSelect;
export type InsertPermit = typeof permits.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET GROUPS
// ─────────────────────────────────────────────────────────────────────────────
export const budgetGroups = mysqlTable("budget_groups", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["hard", "soft", "contingency", "other"]).default("hard").notNull(),
  useCategory: mysqlEnum("useCategory", ["land_acquisition", "hard_costs", "soft_costs", "financing_carry", "contingency"]),
  sortOrder: int("sortOrder").default(0).notNull(),
  collapsed: boolean("collapsed").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("budget_groups_project_idx").on(t.projectId),
]);

export type BudgetGroup = typeof budgetGroups.$inferSelect;
export type InsertBudgetGroup = typeof budgetGroups.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET LINE ITEMS
// ─────────────────────────────────────────────────────────────────────────────
export const budgetLines = mysqlTable("budget_lines", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  groupId: varchar("groupId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  budgetAmount: decimal("budgetAmount", { precision: 15, scale: 2 }).default("0"),
  committedAmount: decimal("committedAmount", { precision: 15, scale: 2 }).default("0"),
  isContingency: boolean("isContingency").default(false),
  contingencyPct: float("contingencyPct"),
  sortOrder: int("sortOrder").default(0).notNull(),
  status: mysqlEnum("status", ["open", "fixed", "closed"]).default("open").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("budget_lines_project_idx").on(t.projectId),
  index("budget_lines_group_idx").on(t.groupId),
]);

export type BudgetLine = typeof budgetLines.$inferSelect;
export type InsertBudgetLine = typeof budgetLines.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES
// ─────────────────────────────────────────────────────────────────────────────
export const expenses = mysqlTable("expenses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  vendorId: int("vendorId"),
  vendorName: varchar("vendorName", { length: 255 }),
  description: varchar("description", { length: 500 }),
  division: varchar("division", { length: 128 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0"),
  expenseDate: varchar("expenseDate", { length: 32 }),
  method: mysqlEnum("method", ["wire", "ach", "check", "zelle", "deposit", "other"]).default("wire"),
  referenceNumber: varchar("referenceNumber", { length: 128 }),
  invoiceNumber: varchar("invoiceNumber", { length: 128 }),
  status: mysqlEnum("status", ["pending", "approved", "paid", "void"]).default("pending").notNull(),
  receiptKey: varchar("receiptKey", { length: 500 }),
  receiptUrl: varchar("receiptUrl", { length: 1000 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("expenses_project_idx").on(t.projectId),
  index("expenses_vendor_idx").on(t.vendorId),
  index("expenses_division_idx").on(t.division),
]);

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// PLAN TASK GROUPS
// ─────────────────────────────────────────────────────────────────────────────
export const planTaskGroups = mysqlTable("plan_task_groups", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("plan_task_groups_project_idx").on(t.projectId),
]);

export type PlanTaskGroup = typeof planTaskGroups.$inferSelect;
export type InsertPlanTaskGroup = typeof planTaskGroups.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// PLAN TASKS (Project Schedule / Gantt)
// ─────────────────────────────────────────────────────────────────────────────
export const planTasks = mysqlTable("plan_tasks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  groupId: varchar("groupId", { length: 64 }),
  sourceRow: int("sourceRow"),
  wbs: varchar("wbs", { length: 32 }),
  name: varchar("name", { length: 500 }),
  owner: varchar("owner", { length: 255 }),
  phase: varchar("phase", { length: 128 }),
  days: int("days"),
  startISO: varchar("startISO", { length: 32 }),
  endISO: varchar("endISO", { length: 32 }),
  pctComplete: float("pctComplete"),
  status: mysqlEnum("status", ["Open", "In Progress", "Done", "Blocked", "Cancelled"]).default("Open"),
  bucket: varchar("bucket", { length: 64 }),
  ganttX: float("ganttX"),
  ganttW: float("ganttW"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("plan_tasks_project_idx").on(t.projectId),
  index("plan_tasks_group_idx").on(t.groupId),
]);

export type PlanTask = typeof planTasks.$inferSelect;
export type InsertPlanTask = typeof planTasks.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  category: varchar("category", { length: 128 }),
  fileKey: varchar("fileKey", { length: 500 }),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  mimeType: varchar("mimeType", { length: 128 }),
  sizeBytes: int("sizeBytes"),
  uploadedBy: varchar("uploadedBy", { length: 255 }),
  version: varchar("version", { length: 32 }),
  status: mysqlEnum("status", ["draft", "current", "superseded", "archived"]).default("current").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("documents_project_idx").on(t.projectId),
]);

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// STACKING PLAN (Units per floor)
// ─────────────────────────────────────────────────────────────────────────────
export const stackingPlanUnits = mysqlTable("stacking_plan_units", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  floor: int("floor").notNull(),
  unitNumber: varchar("unitNumber", { length: 32 }).notNull(),
  unitType: varchar("unitType", { length: 64 }),
  bedrooms: int("bedrooms"),
  bathrooms: float("bathrooms"),
  sqft: int("sqft"),
  status: mysqlEnum("status", ["available", "reserved", "contracted", "closed", "not_for_sale"]).default("available").notNull(),
  listPrice: decimal("listPrice", { precision: 15, scale: 2 }),
  salePrice: decimal("salePrice", { precision: 15, scale: 2 }),
  buyerName: varchar("buyerName", { length: 255 }),
  closingDate: varchar("closingDate", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("stacking_project_idx").on(t.projectId),
  index("stacking_floor_idx").on(t.floor),
]);

export type StackingPlanUnit = typeof stackingPlanUnits.$inferSelect;
export type InsertStackingPlanUnit = typeof stackingPlanUnits.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CAPITAL STACK
// ─────────────────────────────────────────────────────────────────────────────
export const capitalStackItems = mysqlTable("capital_stack_items", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  tier: mysqlEnum("tier", ["equity", "mezzanine", "senior_debt", "junior_debt", "other"]).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  lender: varchar("lender", { length: 255 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).default("0"),
  interestRate: float("interestRate"),
  maturityDate: varchar("maturityDate", { length: 32 }),
  ltc: float("ltc"),
  ltv: float("ltv"),
  status: mysqlEnum("status", ["proposed", "committed", "funded", "repaid"]).default("proposed").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("capital_stack_project_idx").on(t.projectId),
]);

export type CapitalStackItem = typeof capitalStackItems.$inferSelect;
export type InsertCapitalStackItem = typeof capitalStackItems.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CAPITAL STACK PARTICIPANTS
// ─────────────────────────────────────────────────────────────────────────────
export const capitalStackParticipants = mysqlTable("capital_stack_participants", {
  id: int("id").autoincrement().primaryKey(),
  trancheId: int("trancheId").notNull(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  commitment: decimal("commitment", { precision: 15, scale: 2 }).default("0").notNull(),
  role: varchar("role", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("csp_tranche_idx").on(t.trancheId),
  index("csp_project_idx").on(t.projectId),
]);

export type CapitalStackParticipant = typeof capitalStackParticipants.$inferSelect;
export type InsertCapitalStackParticipant = typeof capitalStackParticipants.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// DRAWS
// ─────────────────────────────────────────────────────────────────────────────
export const draws = mysqlTable("draws", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  drawNumber: int("drawNumber").notNull(),
  label: varchar("label", { length: 255 }),
  requestDate: varchar("requestDate", { length: 32 }),
  approvedDate: varchar("approvedDate", { length: 32 }),
  fundedDate: varchar("fundedDate", { length: 32 }),
  requestAmount: decimal("requestAmount", { precision: 15, scale: 2 }).default("0"),
  approvedAmount: decimal("approvedAmount", { precision: 15, scale: 2 }).default("0"),
  fundedAmount: decimal("fundedAmount", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["draft", "submitted", "approved", "funded", "rejected"]).default("draft").notNull(),
  lender: varchar("lender", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("draws_project_idx").on(t.projectId),
]);

export type Draw = typeof draws.$inferSelect;
export type InsertDraw = typeof draws.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// DRAW LINE ITEMS
// ─────────────────────────────────────────────────────────────────────────────
export const drawLineItems = mysqlTable("draw_line_items", {
  id: int("id").autoincrement().primaryKey(),
  drawId: int("drawId").notNull(),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  budgetGroupId: varchar("budgetGroupId", { length: 64 }),
  budgetLineId: varchar("budgetLineId", { length: 64 }),
  description: varchar("description", { length: 500 }),
  scheduledValue: decimal("scheduledValue", { precision: 15, scale: 2 }).default("0"),
  previouslyBilled: decimal("previouslyBilled", { precision: 15, scale: 2 }).default("0"),
  currentBilling: decimal("currentBilling", { precision: 15, scale: 2 }).default("0"),
  pctComplete: float("pctComplete"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [
  index("draw_lines_draw_idx").on(t.drawId),
  index("draw_lines_project_idx").on(t.projectId),
]);

export type DrawLineItem = typeof drawLineItems.$inferSelect;
export type InsertDrawLineItem = typeof drawLineItems.$inferInsert;
