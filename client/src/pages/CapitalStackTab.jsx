import React from 'react';
import { getDataStore } from '@/data/dataStore';
/* global Icon, fmtUSD, Modal, Field, Input, Select, Textarea */

/**
 * CapitalStackTab
 * Matches the design: stacked bar, tranche rows with expand/collapse for LP participants,
 * Sources & Uses right panel, Equity Participants panel.
 */

// ── Tier config ────────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  senior_debt:  { label: "Debt",   color: "#2563eb", bg: "#dbeafe" },  // blue
  mezzanine:    { label: "Debt",   color: "#7c3aed", bg: "#ede9fe" },  // violet
  gp_equity:    { label: "Equity", color: "#d97706", bg: "#fef3c7" },  // amber
  lp_equity:    { label: "Equity", color: "#16a34a", bg: "#dcfce7" },  // green
  equity:       { label: "Equity", color: "#16a34a", bg: "#dcfce7" },  // green
  junior_debt:  { label: "Debt",   color: "#0891b2", bg: "#cffafe" },  // cyan
  other:        { label: "Other",  color: "#6b7280", bg: "#f3f4f6" },
};

function getTierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG.other;
}

// ── Fallback data ──────────────────────────────────────────────────────────────
const FALLBACK_TRANCHES = [
  {
    id: 1, tier: "senior_debt", label: "Construction Loan", lender: "Bank OZK",
    amount: 36000000, notes: "6.45% SOFR+225", status: "funded",
    participants: [],
  },
  {
    id: 2, tier: "mezzanine", label: "Mezzanine", lender: "Madison Realty",
    amount: 8400000, notes: "11% current pay", status: "funded",
    participants: [],
  },
  {
    id: 3, tier: "gp_equity", label: "GP Equity", lender: "Sterling PD",
    amount: 4200000, notes: "Promote 20% over 8% pref · 2 participants", status: "funded",
    participants: [],
  },
  {
    id: 4, tier: "lp_equity", label: "LP Equity", lender: "3 limited partners",
    amount: 9800000, notes: "8% preferred return · 3 participants", status: "funded",
    participants: [
      { id: "p1", name: "Briar Capital Partners", commitment: 4900000, role: "LP" },
      { id: "p2", name: "Hudson Yards Family Office", commitment: 2940000, role: "LP" },
      { id: "p3", name: "K. Tanaka (individual)", commitment: 1960000, role: "LP" },
    ],
  },
];

const SOURCES_USES = {
  sources: [
    { label: "Construction Loan", amount: 36000000, tier: "senior_debt" },
    { label: "Mezzanine",         amount: 8400000,  tier: "mezzanine" },
    { label: "GP Equity",         amount: 4200000,  tier: "gp_equity" },
    { label: "LP Equity",         amount: 9800000,  tier: "lp_equity" },
  ],
  uses: [
    { label: "Land acquisition",  amount: 10000000 },
    { label: "Hard costs",        amount: 35900000 },
    { label: "Soft costs",        amount: 8400000 },
    { label: "Financing & carry", amount: 2600000 },
    { label: "Contingency",       amount: 1500000 },
  ],
};

// ── Avatar initials helper ─────────────────────────────────────────────────────
function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name, color, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: color + "22",
      color: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      letterSpacing: "-0.02em",
    }}>
      {initials(name)}
    </div>
  );
}

// ── Stacked bar ────────────────────────────────────────────────────────────────
function StackedBar({ tranches, total }) {
  return (
    <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", gap: 2 }}>
      {tranches.map((t) => {
        const cfg = getTierConfig(t.tier);
        const pct = total > 0 ? (t.amount / total) * 100 : 0;
        return (
          <div
            key={t.id}
            title={`${t.label}: ${fmtUSD(t.amount, { compact: true })} (${pct.toFixed(1)}%)`}
            style={{
              width: `${pct}%`,
              background: cfg.color,
              borderRadius: 4,
              minWidth: pct > 0 ? 4 : 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Add Tranche Modal ──────────────────────────────────────────────────────────
const FUNDING_TYPE_OPTS = [
  { value: "senior_debt", label: "Construction Loan (Debt)" },
  { value: "mezzanine",   label: "Mezzanine (Debt)" },
  { value: "gp_equity",   label: "GP Equity" },
  { value: "lp_equity",   label: "LP Equity" },
  { value: "junior_debt", label: "Junior Debt / Bridge" },
  { value: "other",       label: "Other" },
];

function AddTrancheModal({ open, onClose, onAdd }) {
  const [form, setForm] = React.useState({ tier: "senior_debt", lender: "", amount: 0, notes: "" });
  React.useEffect(() => {
    if (open) setForm({ tier: "senior_debt", lender: "", amount: 0, notes: "" });
  }, [open]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    const cfg = getTierConfig(form.tier);
    const typeLabel = FUNDING_TYPE_OPTS.find((o) => o.value === form.tier)?.label || form.tier;
    onAdd({
      id: `tranche-${Date.now()}`,
      tier: form.tier,
      label: typeLabel.replace(/ \(.*\)/, ""),
      lender: form.lender,
      amount: Number(form.amount),
      notes: form.notes,
      status: "funded",
      participants: [],
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add capital tranche"
      subtitle="Add a new layer to the capital stack"
      width={520}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add tranche</button>
        </>
      }
    >
      <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <Field label="Funding type">
          <Select value={form.tier} onChange={set("tier")} options={FUNDING_TYPE_OPTS} />
        </Field>
        <Field label="Source / Lender">
          <Input value={form.lender} onChange={set("lender")} placeholder="Bank OZK, Sterling PD, etc." />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Amount">
            <Input value={form.amount} onChange={set("amount")} type="number" prefix="$" />
          </Field>
          <Field label="Terms">
            <Input value={form.notes} onChange={set("notes")} placeholder="6.45% SOFR+225, 8% pref..." />
          </Field>
        </div>
        <Field label="Notes">
          <Textarea
            value={form.extraNotes}
            onChange={set("extraNotes")}
            placeholder="Covenants, draw conditions, intercreditor..."
            rows={3}
          />
        </Field>
      </div>
    </Modal>
  );
}

// ── Add Participant Modal ──────────────────────────────────────────────────────
function AddParticipantModal({ open, onClose, onAdd, tranche, totalCapital }) {
  const [form, setForm] = React.useState({ name: "", commitment: 0, role: "" });
  React.useEffect(() => {
    if (open) setForm({ name: "", commitment: 0, role: "" });
  }, [open]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const commitment = Number(form.commitment) || 0;
  const pctOfTranche = tranche && tranche.amount > 0 ? (commitment / tranche.amount) * 100 : 0;
  const pctOfTotal = totalCapital > 0 ? (commitment / totalCapital) * 100 : 0;

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({
      id: `p-${Date.now()}`,
      name: form.name.trim(),
      commitment,
      role: form.role,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add participant"
      subtitle={tranche ? `${tranche.label} · ${fmtUSD(tranche.amount, { compact: true })} tranche` : ""}
      width={480}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add participant</button>
        </>
      }
    >
      <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <Field label="Name — individual or company">
          <Input value={form.name} onChange={set("name")} placeholder="Briar Capital Partners, K. Tanaka..." />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Commitment">
            <Input value={form.commitment} onChange={set("commitment")} type="number" prefix="$" />
          </Field>
          <Field label="Role / Class">
            <Input value={form.role} onChange={set("role")} placeholder="LP, Sponsor, Co-GP..." />
          </Field>
        </div>
        {/* Live calc preview */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          background: "var(--bg-sunk)", borderRadius: 8, padding: "12px 16px",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: 4 }}>
              % of Tranche
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--text)" }}>
              {pctOfTranche.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: 4 }}>
              % of Total Funding
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--signal-info)" }}>
              {pctOfTotal.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Tranche row ────────────────────────────────────────────────────────────────
function TrancheRow({ tranche, total, expanded, onToggle, onAddParticipant }) {
  const cfg = getTierConfig(tranche.tier);
  const pct = total > 0 ? (tranche.amount / total) * 100 : 0;
  const hasParticipants = tranche.participants && tranche.participants.length > 0;
  const isExpandable = hasParticipants || tranche.tier === "lp_equity" || tranche.tier === "gp_equity" || tranche.tier === "equity";

  return (
    <>
      {/* Main tranche row */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          cursor: isExpandable ? "pointer" : "default",
          background: expanded ? "var(--bg-hover)" : "transparent",
          transition: "background 0.15s",
        }}
        onClick={isExpandable ? onToggle : undefined}
      >
        {/* Expand arrow */}
        <div style={{ width: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isExpandable && (
            <Icon
              name={expanded ? "chevron-down" : "chevron-right"}
              size={14}
              style={{ color: "var(--text-faint)", transition: "transform 0.15s" }}
            />
          )}
        </div>

        {/* Color dot */}
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: cfg.color, flexShrink: 0,
        }} />

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{tranche.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "1px 7px", borderRadius: 4,
              background: cfg.bg, color: cfg.color,
            }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {[tranche.lender, tranche.notes].filter(Boolean).join(" · ")}
          </div>
        </div>

        {/* Amount + pct */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "var(--font-mono, monospace)" }}>
            {fmtUSD(tranche.amount, { compact: true })}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>
            {pct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Expanded participants sub-table */}
      {expanded && (
        <div style={{ background: "var(--bg-sunk)", borderBottom: "1px solid var(--border)" }}>
          {tranche.participants && tranche.participants.length > 0 && (
            <>
              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 120px 100px 32px",
                padding: "8px 20px 6px 56px",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                color: "var(--text-faint)", textTransform: "uppercase",
              }}>
                <span>Participant</span>
                <span style={{ textAlign: "right" }}>Commitment</span>
                <span style={{ textAlign: "right" }}>% of Tranche</span>
                <span style={{ textAlign: "right" }}>% of Total</span>
                <span />
              </div>

              {/* Participant rows */}
              {tranche.participants.map((p) => {
                const pctTranche = tranche.amount > 0 ? (p.commitment / tranche.amount) * 100 : 0;
                const pctTotal = total > 0 ? (p.commitment / total) * 100 : 0;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 140px 120px 100px 32px",
                      padding: "9px 20px 9px 56px",
                      alignItems: "center",
                      borderTop: "1px solid var(--border)",
                      fontSize: 13,
                    }}
                  >
                    {/* Avatar + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={p.name} color={cfg.color} size={28} />
                      <span style={{ fontWeight: 500, color: "var(--text)" }}>{p.name}</span>
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "var(--font-mono, monospace)", fontWeight: 600, color: "var(--text)" }}>
                      {fmtUSD(p.commitment, { compact: true })}
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 500, color: "var(--text)" }}>
                      {pctTranche.toFixed(1)}%
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 500, color: "var(--text)" }}>
                      {pctTotal.toFixed(1)}%
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "2px 4px", opacity: 0.5 }}
                        title="Edit participant"
                      >
                        <Icon name="edit-2" size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Totals row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 120px 100px 32px",
                padding: "9px 20px 9px 56px",
                borderTop: "1px solid var(--border-strong)",
                fontSize: 12,
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}>
                <span>Fully allocated</span>
                <span style={{ textAlign: "right", fontFamily: "var(--font-mono, monospace)", fontWeight: 600, color: "var(--text)", fontStyle: "normal" }}>
                  {fmtUSD(tranche.participants.reduce((s, p) => s + p.commitment, 0), { compact: true })}
                </span>
                <span style={{ textAlign: "right", fontWeight: 600, color: "var(--text)", fontStyle: "normal" }}>100%</span>
                <span style={{ textAlign: "right", fontWeight: 600, color: "var(--text)", fontStyle: "normal" }}>
                  {total > 0 ? (tranche.amount / total * 100).toFixed(1) : "0.0"}%
                </span>
                <span />
              </div>
            </>
          )}

          {/* Add participant button */}
          <div style={{ padding: "10px 20px 10px 56px" }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.stopPropagation(); onAddParticipant(); }}
              style={{ fontSize: 12 }}
            >
              <Icon name="plus" size={12} /> Add participant
            </button>
          </div>
        </div>
      )}
    </>
  );
}
// Category key → display label mapping
const USE_CATEGORY_LABELS = {
  land_acquisition: "Land acquisition",
  hard_costs:       "Hard costs",
  soft_costs:       "Soft costs",
  financing_carry:  "Financing & carry",
  contingency:      "Contingency",
};
const USE_CATEGORY_ORDER = ["land_acquisition", "hard_costs", "soft_costs", "financing_carry", "contingency"];

/** Read budget groups from localStorage and sum line budgets per useCategory */
function computeUsesFromBudget() {
  try {
    const raw = localStorage.getItem("cc_budget_groups_v3");
    if (!raw) return null;
    const groups = JSON.parse(raw);
    if (!Array.isArray(groups) || groups.length === 0) return null;
    // Check if any group has useCategory
    const hasCategories = groups.some((g) => g.useCategory);
    if (!hasCategories) return null;
    const totals = {};
    groups.forEach((g) => {
      const cat = g.useCategory;
      if (!cat) return;
      const groupBudget = (g.lines || []).reduce((s, l) => s + (l.budget || 0), 0);
      totals[cat] = (totals[cat] || 0) + groupBudget;
    });
    return totals;
  } catch (_) {
    return null;
  }
}

// ── Sources & Uses panel ───────────────────────────────────────────────────────────────────────────────────────
function SourcesUsesPanel({ tranches, total }) {
  const sourcesTotal = tranches.reduce((s, t) => s + t.amount, 0);

  // Compute uses from live budget data, fall back to hardcoded
  const liveTotals = computeUsesFromBudget();
  const usesData = liveTotals
    ? USE_CATEGORY_ORDER.map((cat) => ({
        label: USE_CATEGORY_LABELS[cat],
        amount: liveTotals[cat] || 0,
      }))
    : SOURCES_USES.uses;
  const usesTotal = usesData.reduce((s, u) => s + u.amount, 0);

  return (
    <div className="card" style={{ overflow: "visible" }}>
      <div className="card-head">
        <div className="card-title">Sources & uses</div>
      </div>
      <div className="card-body-flush">
        {/* Sources header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px 8px",
          background: "var(--bg-sunk)",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          <span>Sources</span>
          <span style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text)" }}>
            {fmtUSD(sourcesTotal, { compact: true })}
          </span>
        </div>
        {tranches.map((t) => {
          const cfg = getTierConfig(t.tier);
          return (
            <div key={t.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 16px",
              borderBottom: "1px solid var(--border)",
              fontSize: 13,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                <span>{t.label}</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                {fmtUSD(t.amount, { compact: true })}
              </span>
            </div>
          );
        })}

        {/* Uses header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px 8px",
          background: "var(--bg-sunk)",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          color: "var(--text-muted)",
          marginTop: 4,
        }}>
          <span>Uses</span>
          <span style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text)" }}>
            {fmtUSD(usesTotal, { compact: true })}
          </span>
        </div>
        {usesData.map((u, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 16px",
            borderBottom: i < usesData.length - 1 ? "1px solid var(--border)" : "none",
            fontSize: 13,
          }}>
            <span style={{ color: "var(--text)" }}>{u.label}</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
              {fmtUSD(u.amount, { compact: true })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Equity Participants panel ──────────────────────────────────────────────────
function EquityParticipantsPanel({ tranches, total }) {
  const equityTranches = tranches.filter((t) =>
    t.tier === "gp_equity" || t.tier === "lp_equity" || t.tier === "equity"
  );

  // Collect all participants across equity tranches
  const allParticipants = [];
  for (const t of equityTranches) {
    const cfg = getTierConfig(t.tier);
    for (const p of (t.participants || [])) {
      allParticipants.push({ ...p, trancheLabel: t.label, color: cfg.color });
    }
    // If no participants but equity tranche, show the tranche itself
    if (!t.participants || t.participants.length === 0) {
      allParticipants.push({
        id: `t-${t.id}`, name: t.lender || t.label,
        commitment: t.amount, trancheLabel: t.label,
        color: cfg.color,
      });
    }
  }

  if (allParticipants.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-head">
        <div className="card-title">Equity participants</div>
      </div>
      <div className="card-body-flush">
        {allParticipants.map((p, i) => {
          const pct = total > 0 ? (p.commitment / total) * 100 : 0;
          return (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px",
              borderBottom: i < allParticipants.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <Avatar name={p.name} color={p.color} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>{p.trancheLabel}</div>
              </div>
              <div style={{
                fontFamily: "var(--font-mono, monospace)", fontWeight: 600, fontSize: 13,
                color: "var(--text)",
              }}>
                {pct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Build tranches from DB data ──────────────────────────────────────────────
function buildTranchesFromDb(dbItems) {
  if (!dbItems || dbItems.length === 0) return null;
  const TIER_ORDER = ["senior_debt", "mezzanine", "junior_debt", "gp_equity", "lp_equity", "equity", "other"];
  const sorted = [...dbItems].sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a.tier);
    const bi = TIER_ORDER.indexOf(b.tier);
    if (ai !== bi) return ai - bi;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });
  return sorted.map((item) => {
    // Normalize generic "equity" tier to gp_equity or lp_equity based on label
    let tier = item.tier;
    if (tier === "equity") {
      const lbl = (item.label || "").toLowerCase();
      if (lbl.includes("gp") || lbl.includes("general partner") || lbl.includes("sponsor")) {
        tier = "gp_equity";
      } else {
        tier = "lp_equity";
      }
    }
    return {
      id: item.id,
      tier,
      label: item.label,
      lender: item.lender ?? "",
      amount: item.amount ?? 0,
      notes: item.notes ?? "",
      status: item.status ?? "proposed",
      participants: [],
    };
  });
}

// ── Main CapitalStackTab ───────────────────────────────────────────────────────
export function CapitalStackTab() {
  const [tranches, setTranches] = React.useState(() => {
    const ds = getDataStore();
    if (ds.dbLoaded && ds.capitalStack && ds.capitalStack.length > 0) {
      const fromDb = buildTranchesFromDb(ds.capitalStack);
      if (fromDb && fromDb.length > 0) return fromDb;
    }
    return FALLBACK_TRANCHES;
  });
  const [expandedId, setExpandedId] = React.useState(4); // LP equity expanded by default
  const [showAddTranche, setShowAddTranche] = React.useState(false);
  const [addParticipantFor, setAddParticipantFor] = React.useState(null); // tranche id

  const total = tranches.reduce((s, t) => s + t.amount, 0);

  // Debt vs equity split
  const debtTotal = tranches
    .filter((t) => t.tier === "senior_debt" || t.tier === "mezzanine" || t.tier === "junior_debt")
    .reduce((s, t) => s + t.amount, 0);
  const equityTotal = total - debtTotal;
  const debtPct = total > 0 ? Math.round((debtTotal / total) * 100) : 0;
  const equityPct = 100 - debtPct;

  const handleAddTranche = (tranche) => {
    setTranches((prev) => [...prev, tranche]);
  };

  const handleAddParticipant = (trancheId, participant) => {
    setTranches((prev) =>
      prev.map((t) =>
        t.id === trancheId
          ? { ...t, participants: [...(t.participants || []), participant] }
          : t
      )
    );
  };

  const activeParticipantTranche = tranches.find((t) => t.id === addParticipantFor);

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 16, alignItems: "flex-start" }}>
      {/* ── Left: main capital stack panel ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="card">
          {/* Header */}
          <div className="card-head">
            <div>
              <div className="card-title">Capital stack</div>
              <div className="card-sub">{tranches.length} tranches · senior to junior</div>
            </div>
            <div className="card-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddTranche(true)}
              >
                <Icon name="plus" size={12} /> Add tranche
              </button>
            </div>
          </div>

          {/* Total + stacked bar */}
          <div style={{ padding: "20px 20px 16px" }}>
            {/* Total capitalization */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 36, fontWeight: 800,
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {fmtUSD(total, { compact: true })}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>
                Total capitalization
              </div>
            </div>

            {/* Debt / Equity summary */}
            <div style={{
              display: "flex", justifyContent: "flex-end", gap: 20,
              fontSize: 11, color: "var(--text-faint)", marginBottom: 8,
            }}>
              <span>
                <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Debt</span>
                {" "}
                <span style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text)", fontWeight: 600 }}>
                  {fmtUSD(debtTotal, { compact: true })}
                </span>
                {" · "}
                <span style={{ color: "var(--text-muted)" }}>{debtPct}%</span>
              </span>
              <span>
                <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Equity</span>
                {" "}
                <span style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text)", fontWeight: 600 }}>
                  {fmtUSD(equityTotal, { compact: true })}
                </span>
                {" · "}
                <span style={{ color: "var(--text-muted)" }}>{equityPct}%</span>
              </span>
            </div>

            {/* Stacked bar */}
            <StackedBar tranches={tranches} total={total} />
          </div>

          {/* Tranche rows */}
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {tranches.map((t) => (
              <TrancheRow
                key={t.id}
                tranche={t}
                total={total}
                expanded={expandedId === t.id}
                onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
                onAddParticipant={() => setAddParticipantFor(t.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Sources & Uses + Equity Participants ── */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <SourcesUsesPanel tranches={tranches} total={total} />
        <EquityParticipantsPanel tranches={tranches} total={total} />
      </div>

      {/* Modals */}
      <AddTrancheModal
        open={showAddTranche}
        onClose={() => setShowAddTranche(false)}
        onAdd={handleAddTranche}
      />
      <AddParticipantModal
        open={!!addParticipantFor}
        onClose={() => setAddParticipantFor(null)}
        onAdd={(p) => { handleAddParticipant(addParticipantFor, p); setAddParticipantFor(null); }}
        tranche={activeParticipantTranche}
        totalCapital={total}
      />
    </div>
  );
}

window.CapitalStackTab = CapitalStackTab;
