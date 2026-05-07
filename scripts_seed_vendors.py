from pathlib import Path
path = Path('/home/ubuntu/condocore_web/client/src/pages/CondoCore.jsx')
text = path.read_text()
start = text.index('const VENDORS = [')
end = text.index('const TRADE_FILTERS = [', start)
replacement = r'''function vendorInitials(name) {
  return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

function classifyVendorTrade(name, sourceRole = "") {
  const value = `${name} ${sourceRole}`.toLowerCase();
  if (/architect|design|studio|office of architects/.test(value)) return "Design";
  if (/engineer|mep|structural|consult|yaker|stroh|wjY/i.test(value)) return "Engineering";
  if (/insurance|liability|workers|state farm|casulty/.test(value)) return "Insurance";
  if (/permit|contracting|plumb|mason|sewer|gir(o|ó)n|first choice|trysler/.test(value)) return "Subcontractor";
  if (/legal|law|counsel/.test(value)) return "Legal";
  if (/broker|sales|marketing/.test(value)) return "Brokerage";
  if (/construction|contractor|gc/.test(value)) return "GC";
  return "Consulting";
}

function coalesceVendorRecord(map, name, seed = {}) {
  if (!name) return null;
  const key = String(name).trim();
  if (!key) return null;
  const existing = map.get(key) || {
    id: `driggs-vendor-${map.size + 1}`,
    name: key,
    role: seed.role || "Project contact",
    trade: classifyVendorTrade(key, seed.role),
    status: "Active",
    rating: 4.2,
    contracts: 0,
    paid: 0,
    contractValue: 0,
    contact: seed.contact || "—",
    email: seed.email || "",
    coiExpires: seed.coiExpires || "Not tracked",
    coiOk: seed.coiOk ?? true,
    init: vendorInitials(key),
    color: map.size % 7,
    rawSources: [],
  };
  if (seed.role && existing.role === "Project contact") existing.role = seed.role;
  if (seed.contact && existing.contact === "—") existing.contact = seed.contact;
  if (seed.email && !existing.email) existing.email = seed.email;
  if (seed.trade) existing.trade = seed.trade;
  if (typeof seed.contractValue === "number") existing.contractValue += seed.contractValue;
  if (typeof seed.paid === "number") existing.paid += seed.paid;
  if (seed.hasContract) existing.contracts += 1;
  if (seed.coiExpires) existing.coiExpires = seed.coiExpires;
  if (seed.coiOk === false) existing.coiOk = false;
  if (existing.contractValue > 0 && existing.paid >= existing.contractValue) existing.status = "Inactive";
  if (!existing.coiOk) existing.status = "At risk";
  existing.rawSources.push(seed.raw || {});
  map.set(key, existing);
  return existing;
}

const VENDOR_MAP_712 = new Map();

DRIGGS_712_CONTRACTS.forEach((row) => {
  coalesceVendorRecord(VENDOR_MAP_712, row.Vendor, {
    role: "Contracted vendor",
    trade: classifyVendorTrade(row.Vendor, "contract"),
    contractValue: trackerAmount(row["Contract Total"]),
    paid: trackerAmount(row["Total Paid"]),
    hasContract: true,
    raw: row,
  });
});

DRIGGS_712_TEAM.forEach((row) => {
  const contactName = String(row.Contact || "").split("|").pop()?.trim() || row.Contact;
  coalesceVendorRecord(VENDOR_MAP_712, row.Company || row.Contact, {
    role: "Project team",
    contact: contactName,
    email: row.Email,
    trade: classifyVendorTrade(row.Company, "team"),
    raw: row,
  });
});

DRIGGS_712_LOOKUP.forEach((row) => {
  coalesceVendorRecord(VENDOR_MAP_712, row["Company Name"] || row["Company | Name"], {
    role: "Directory contact",
    contact: row.Name,
    email: row.Email,
    trade: classifyVendorTrade(row["Company Name"], "directory"),
    raw: row,
  });
});

DRIGGS_712_INSURANCES.forEach((row) => {
  const exp = row["General Liability Expiration"] || row["Workers Comp Expiration"];
  const days = row["General Liability Expiration(d)"] ?? row["Workers Comp Expiration (d)"];
  coalesceVendorRecord(VENDOR_MAP_712, row.Company, {
    role: row.Subcontractor ? `${row.Subcontractor} subcontractor` : "Insurance-tracked subcontractor",
    trade: "Subcontractor",
    coiExpires: trackerDateLabel(exp),
    coiOk: Number(days ?? 1) >= 0,
    raw: row,
  });
});

DRIGGS_712_PERMITS.forEach((row) => {
  const days = row["Number of Days Left"];
  coalesceVendorRecord(VENDOR_MAP_712, row.Contractor, {
    role: `${row["Permit Type"] || "Permit"} permit contractor`,
    trade: "Subcontractor",
    contact: row.Contact,
    coiExpires: trackerDateLabel(row.Expiration),
    coiOk: Number(days ?? 1) >= 0,
    raw: row,
  });
});

const VENDORS = Array.from(VENDOR_MAP_712.values()).sort((a, b) => b.contractValue - a.contractValue || a.name.localeCompare(b.name));

'''
path.write_text(text[:start] + replacement + text[end:], encoding='utf-8')
print('vendors seeded from tracker')
