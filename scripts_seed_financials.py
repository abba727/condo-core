from pathlib import Path
path = Path('/home/ubuntu/condocore_web/client/src/pages/CondoCore.jsx')
text = path.read_text()
start = text.index('const INITIAL_BUDGET = [')
end = text.index('const STATUS_OPTS = [', start)
replacement = r'''function trackerAmount(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function trackerDateLabel(value) {
  if (!value) return "Undated";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const TRACKER_SPEND_BY_CATEGORY = DRIGGS_712_EXPENSES.reduce((acc, row) => {
  const category = row.Category || "Capital / contributions";
  const debit = trackerAmount(row.Debit);
  acc[category] = (acc[category] || 0) + Math.max(0, debit);
  return acc;
}, {});

const INITIAL_BUDGET = DRIGGS_712_BUDGET.map((row, index) => {
  const budget = trackerAmount(row.Amount);
  const spent = TRACKER_SPEND_BY_CATEGORY[row.Category] || 0;
  return {
    id: `driggs-budget-${index + 1}`,
    code: String(index + 1).padStart(2, "0"),
    name: row["Sub-Category"] ? `${row.Category} · ${row["Sub-Category"]}` : row.Category,
    budget,
    committed: row.Status && row.Status !== "Open" ? budget : 0,
    spent,
    forecast: Math.max(budget, spent),
    risk: row.Status && row.Status !== "Open",
    sourceType: row.Type,
    raw: row,
  };
});

const INITIAL_EXPENSES = DRIGGS_712_EXPENSES.map((row, index) => {
  const debit = trackerAmount(row.Debit);
  const credit = trackerAmount(row.Credit);
  const amount = debit > 0 ? debit : -credit;
  return {
    id: `driggs-expense-${index + 1}`,
    date: trackerDateLabel(row.Date),
    desc: row.Memo || row.Type || "Ledger entry",
    vendor: row.Vendor || (credit > 0 ? "Project capital account" : "712 Driggs ledger"),
    division: row.Category || (credit > 0 ? "Capital / contributions" : "Uncategorized"),
    amount,
    status: debit > 0 ? "Paid" : "Approved",
    invoice: `LEDGER-${String(index + 1).padStart(4, "0")}`,
    method: row.Type || "Ledger",
    balance: trackerAmount(row.Balance),
    raw: row,
  };
}).reverse();

'''
path.write_text(text[:start] + replacement + text[end:], encoding='utf-8')
print('financials seeded from tracker')
