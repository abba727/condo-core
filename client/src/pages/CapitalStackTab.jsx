import React from 'react';
import { trpc } from '@/lib/trpc';
/* global Icon, fmtUSD, Modal, Field, Input, Select, Textarea */

/**
 * CapitalStackTab
 * Matches the design: stacked bar, tranche rows with expand/collapse for LP participants,
 * Sources & Uses right panel, Equity Participants panel.
 */

// ── Tier config ────────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  senior_debt:  { label: "Debt",   color: "#2563eb", bg: "#dbeafe" },
  mezzanine:    { label: "Debt",   color: "#7c3aed", bg: "#ede9fe" },
  gp_equity:    { label: "Equity", color: "#d97706", bg: "#fef3c7" },
  lp_equity:    { label: "Equity", color: "#16a34a", bg: "#dcfce7" },
  equity:       { label: "Equity", color: "#16a34a", bg: "#dcfce7" },
  junior_debt:  { label: "Debt",   color: "#0891b2", bg: "#cffafe" },
  other:        { label: "Other",  color: "#6b7280", bg: "#f3f4f6" },
};

function getTierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG.other;
}

// ── Dollar formatter — compact display (e.g. $36.0M) for labels
function fmtDollar(n) {
  if (!n && n !== 0) return "$0";
  const abs = Math.abs(Math.round(n));
  if (abs >= 1e9) return `$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(abs / 1e3).toFixed(0)}K`;
  return `$${abs.toLocaleString("en-US")}`;
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
            title={`${t.label}: ${fmtDollar(t.amount)} (${pct.toFixed(1)}%)`}
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

// ── Funding type options ───────────────────────────────────────────────────────
const FUNDING_TYPE_OPTS = [
  { value: "senior_debt", label: "Construction Loan (Debt)" },
  { value: "mezzanine",   label: "Mezzanine (Debt)" },
  { value: "gp_equity",   label: "GP Equity" },
  { value: "lp_equity",   label: "LP Equity" },
  { value: "junior_debt", label: "Junior Debt / Bridge" },
  { value: "other",       label: "Other" },
];

// ── Add / Edit Tranche Modal ───────────────────────────────────────────────────
function TrancheModal({ open, onClose, onSave, onDelete, existing }) {
  const isEdit = !!existing;
  const [form, setForm] = React.useState({ tier: "senior_debt", lender: "", amount: 0, notes: "" });
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // If opened via the trash icon, jump straight to delete confirmation
      setConfirmDelete(!!(existing && existing._deleteIntent));
      if (existing) {
        setForm({
          tier: existing.tier,
          lender: existing.lender || "",
          amount: existing.amount || 0,
          notes: existing.notes || "",
        });
      } else {
        setForm({ tier: "senior_debt", lender: "", amount: 0, notes: "" });
      }
    }
  }, [open, existing]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    const typeLabel = FUNDING_TYPE_OPTS.find((o) => o.value === form.tier)?.label || form.tier;
    onSave({
      ...(existing || {}),
      id: existing ? existing.id : `tranche-${Date.now()}`,
      tier: form.tier,
      label: typeLabel.replace(/ \(.*\)/, ""),
      lender: form.lender,
      amount: Number(form.amount),
      notes: form.notes,
      status: existing?.status || "funded",
      participants: existing?.participants || [],
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit tranche" : "Add capital tranche"}
      subtitle={isEdit ? `Editing ${existing?.label}` : "Add a new layer to the capital stack"}
      width={520}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          {isEdit ? (
            confirmDelete ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--signal-neg)" }}>Delete this tranche?</span>
                <button className="btn btn-danger btn-sm" onClick={() => { onDelete(existing.id); onClose(); }}>Yes, delete</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--signal-neg)" }} onClick={() => setConfirmDelete(true)}>
                Delete tranche
              </button>
            )
          ) : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{isEdit ? "Save changes" : "Add tranche"}</button>
          </div>
        </div>
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
      </div>
    </Modal>
  );
}

// ── Add / Edit Participant Modal ───────────────────────────────────────────────
function ParticipantModal({ open, onClose, onSave, onDelete, tranche, totalCapital, existing }) {
  const isEdit = !!existing;
  const [form, setForm] = React.useState({ name: "", commitment: 0, role: "" });
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setConfirmDelete(false);
      if (existing) {
        setForm({ name: existing.name || "", commitment: existing.commitment || 0, role: existing.role || "" });
      } else {
        setForm({ name: "", commitment: 0, role: "" });
      }
    }
  }, [open, existing]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const commitment = Number(form.commitment) || 0;
  const pctOfTranche = tranche && tranche.amount > 0 ? (commitment / tranche.amount) * 100 : 0;
  const pctOfTotal = totalCapital > 0 ? (commitment / totalCapital) * 100 : 0;

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...(existing || {}),
      id: existing ? existing.id : `p-${Date.now()}`,
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
      title={isEdit ? "Edit participant" : "Add participant"}
      subtitle={tranche ? `${tranche.label} · ${fmtDollar(tranche.amount)} tranche` : ""}
      width={480}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          {isEdit ? (
            confirmDelete ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--signal-neg)" }}>Remove this participant?</span>
                <button className="btn btn-danger btn-sm" onClick={() => { onDelete(existing.id); onClose(); }}>Yes, remove</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--signal-neg)" }} onClick={() => setConfirmDelete(true)}>
                Remove participant
              </button>
            )
          ) : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{isEdit ? "Save changes" : "Add participant"}</button>
          </div>
        </div>
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

// ── Participant row (hover-only highlight) ─────────────────────────────────────
function ParticipantRow({ p, cfg, tranche, total, onEdit }) {
  const [hovered, setHovered] = React.useState(false);
  const pctTranche = tranche.amount > 0 ? (p.commitment / tranche.amount) * 100 : 0;
  const pctTotal = total > 0 ? (p.commitment / total) * 100 : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 160px 120px 100px 56px",
        padding: "9px 20px 9px 56px",
        alignItems: "center",
        borderTop: "1px solid var(--border)",
        fontSize: 13,
        background: hovered ? "var(--bg-hover)" : "transparent",
        transition: "background 0.12s",
      }}
    >
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={p.name} color={cfg.color} size={28} />
        <span style={{ fontWeight: 500, color: "var(--text)" }}>{p.name}</span>
        {p.role && (
          <span style={{ fontSize: 10, color: "var(--text-faint)", background: "var(--bg-sunk)", borderRadius: 4, padding: "1px 6px" }}>
            {p.role}
          </span>
        )}
      </div>
      <div style={{ textAlign: "right", fontFamily: "var(--font-mono, monospace)", fontWeight: 600, color: "var(--text)" }}>
        {fmtDollar(p.commitment)}
      </div>
      <div style={{ textAlign: "right", fontWeight: 500, color: "var(--text)" }}>
        {pctTranche.toFixed(1)}%
      </div>
      <div style={{ textAlign: "right", fontWeight: 500, color: "var(--text)" }}>
        {pctTotal.toFixed(1)}%
      </div>
      {/* Edit button — muted at rest, full opacity on hover */}
      <div style={{ display: "flex", justifyContent: "center", gap: 2, opacity: hovered ? 1 : 0.35, transition: "opacity 0.15s" }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: "2px 5px" }}
          title="Edit participant"
          onClick={(e) => { e.stopPropagation(); onEdit(p); }}
        >
          <Icon name="edit-2" size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Tranche row ────────────────────────────────────────────────────────────────
function TrancheRow({ tranche, total, expanded, onToggle, onAddParticipant, onEditTranche, onEditParticipant }) {
  const cfg = getTierConfig(tranche.tier);
  const pct = total > 0 ? (tranche.amount / total) * 100 : 0;
  const hasParticipants = tranche.participants && tranche.participants.length > 0;
  const isExpandable = hasParticipants || tranche.tier === "lp_equity" || tranche.tier === "gp_equity" || tranche.tier === "equity";
  const [rowHovered, setRowHovered] = React.useState(false);

  return (
    <>
      {/* Main tranche row */}
      <div
        onMouseEnter={() => setRowHovered(true)}
        onMouseLeave={() => setRowHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          cursor: isExpandable ? "pointer" : "default",
          background: rowHovered ? "var(--bg-hover)" : "transparent",
          transition: "background 0.12s",
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
            {fmtDollar(tranche.amount)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>
            {pct.toFixed(1)}%
          </div>
        </div>

        {/* Edit + Delete buttons — always visible, slightly muted at rest */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0, opacity: rowHovered ? 1 : 0.35, transition: "opacity 0.15s" }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 6px" }}
            title="Edit tranche"
            onClick={(e) => { e.stopPropagation(); onEditTranche(tranche); }}
          >
            <Icon name="edit-2" size={13} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 6px", color: "var(--signal-neg)" }}
            title="Delete tranche"
            onClick={(e) => { e.stopPropagation(); onEditTranche({ ...tranche, _deleteIntent: true }); }}
          >
            <Icon name="trash-2" size={13} />
          </button>
        </div>
      </div>

      {/* Expanded participants sub-table — no grey background, just transparent */}
      {expanded && (
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          {tranche.participants && tranche.participants.length > 0 && (
            <>
              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 120px 100px 56px",
                padding: "8px 20px 6px 56px",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                color: "var(--text-faint)", textTransform: "uppercase",
                background: "var(--bg-sunk)",
              }}>
                <span>Participant</span>
                <span style={{ textAlign: "right" }}>Commitment</span>
                <span style={{ textAlign: "right" }}>% of Tranche</span>
                <span style={{ textAlign: "right" }}>% of Total</span>
                <span />
              </div>

              {/* Participant rows */}
              {tranche.participants.map((p) => (
                <ParticipantRow
                  key={p.id}
                  p={p}
                  cfg={cfg}
                  tranche={tranche}
                  total={total}
                  onEdit={(participant) => onEditParticipant(tranche, participant)}
                />
              ))}

              {/* Totals row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 120px 100px 56px",
                padding: "9px 20px 9px 56px",
                borderTop: "1px solid var(--border-strong)",
                fontSize: 12,
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}>
                <span>Fully allocated</span>
                <span style={{ textAlign: "right", fontFamily: "var(--font-mono, monospace)", fontWeight: 600, color: "var(--text)", fontStyle: "normal" }}>
                  {fmtDollar(tranche.participants.reduce((s, p) => s + p.commitment, 0))}
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

/** Compute uses totals from budget groups data (passed as prop from tRPC query) */
function computeUsesFromBudget(groups) {
  if (!Array.isArray(groups) || groups.length === 0) return null;
  const hasCategories = groups.some((g) => g.useCategory);
  if (!hasCategories) return null;
  const totals = {};
  groups.forEach((g) => {
    const cat = g.useCategory;
    if (!cat) return;
    const groupBudget = (g.lines || []).reduce((s, l) => s + Number(l.budgetAmount ?? l.budget ?? 0), 0);
    totals[cat] = (totals[cat] || 0) + groupBudget;
  });
  return totals;
}

// ── Sources & Uses panel ───────────────────────────────────────────────────────
function SourcesUsesPanel({ tranches, total, budgetGroups }) {
  const sourcesTotal = tranches.reduce((s, t) => s + t.amount, 0);

  const liveTotals = computeUsesFromBudget(budgetGroups || []);
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
            {fmtDollar(sourcesTotal)}
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
                {fmtDollar(t.amount)}
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
            {fmtDollar(usesTotal)}
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
              {fmtDollar(u.amount)}
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

  const allParticipants = [];
  for (const t of equityTranches) {
    const cfg = getTierConfig(t.tier);
    for (const p of (t.participants || [])) {
      allParticipants.push({ ...p, trancheLabel: t.label, color: cfg.color });
    }
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
      amount: Number(item.amount ?? 0),
      notes: item.notes ?? "",
      status: item.status ?? "proposed",
      participants: item.participants ?? [],
    };
  });
}

// ── Main CapitalStackTab ───────────────────────────────────────────────────────
export function CapitalStackTab() {
  // Load tranches from DB via tRPC
  const capitalStackQuery = trpc.capitalStack.list.useQuery();
  const budgetGroupsQuery = trpc.budget.listGroups.useQuery();
  const budgetLinesQuery = trpc.budget.listLines.useQuery();

  const [tranches, setTranches] = React.useState(FALLBACK_TRANCHES);

  // Sync tranches from DB when query resolves
  React.useEffect(() => {
    if (capitalStackQuery.data && capitalStackQuery.data.length > 0) {
      const fromDb = buildTranchesFromDb(capitalStackQuery.data);
      if (fromDb && fromDb.length > 0) setTranches(fromDb);
    }
  }, [capitalStackQuery.data]);
  const [expandedId, setExpandedId] = React.useState(4);

  // Tranche modal state
  const [trancheModal, setTrancheModal] = React.useState({ open: false, existing: null });
  // Participant modal state
  const [participantModal, setParticipantModal] = React.useState({ open: false, tranche: null, existing: null });

  const total = tranches.reduce((s, t) => s + t.amount, 0);
  const debtTotal = tranches
    .filter((t) => t.tier === "senior_debt" || t.tier === "mezzanine" || t.tier === "junior_debt")
    .reduce((s, t) => s + t.amount, 0);
  const equityTotal = total - debtTotal;
  const debtPct = total > 0 ? Math.round((debtTotal / total) * 100) : 0;
  const equityPct = 100 - debtPct;

  // tRPC mutations for DB persistence
  const addTrancheMut = trpc.capitalStack.add.useMutation();
  const updateTrancheMut = trpc.capitalStack.update.useMutation();
  const deleteTrancheMut = trpc.capitalStack.delete.useMutation();
  const addParticipantMut = trpc.capitalStack.addParticipant.useMutation();
  const updateParticipantMut = trpc.capitalStack.updateParticipant.useMutation();
  const deleteParticipantMut = trpc.capitalStack.deleteParticipant.useMutation();

  // Tranche handlers
  const handleSaveTranche = async (tranche) => {
    // Optimistic update
    setTranches((prev) => {
      const idx = prev.findIndex((t) => t.id === tranche.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = tranche;
        return next;
      }
      return [...prev, tranche];
    });
    // Persist to DB
    try {
      const isNew = !tranche.id || typeof tranche.id === 'string';
      // Map gp_equity/lp_equity back to "equity" for DB enum
      const dbTier = (tranche.tier === 'gp_equity' || tranche.tier === 'lp_equity') ? 'equity' : tranche.tier;
      if (isNew) {
        const { id } = await addTrancheMut.mutateAsync({
          tier: dbTier,
          label: tranche.label,
          lender: tranche.lender,
          amount: tranche.amount,
          notes: tranche.notes,
          status: tranche.status,
          sortOrder: tranche.sortOrder ?? 0,
        });
        // Update local state with real DB id
        setTranches((prev) => prev.map((t) => t.id === tranche.id ? { ...t, id } : t));
      } else {
        await updateTrancheMut.mutateAsync({
          id: tranche.id,
          tier: dbTier,
          label: tranche.label,
          lender: tranche.lender,
          amount: tranche.amount,
          notes: tranche.notes,
          status: tranche.status,
        });
      }
    } catch (e) {
      console.error('Failed to save tranche', e);
    }
  };

  const handleDeleteTranche = async (id) => {
    setTranches((prev) => prev.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
    try {
      if (typeof id === 'number') await deleteTrancheMut.mutateAsync({ id });
    } catch (e) {
      console.error('Failed to delete tranche', e);
    }
  };

  // Participant handlers
  const handleSaveParticipant = async (trancheId, participant) => {
    const isNew = !participant.id || typeof participant.id === 'string';
    // Optimistic update
    setTranches((prev) =>
      prev.map((t) => {
        if (t.id !== trancheId) return t;
        const idx = t.participants.findIndex((p) => p.id === participant.id);
        if (idx >= 0) {
          const next = [...t.participants];
          next[idx] = participant;
          return { ...t, participants: next };
        }
        return { ...t, participants: [...t.participants, participant] };
      })
    );
    // Persist to DB
    try {
      if (isNew) {
        const { id } = await addParticipantMut.mutateAsync({
          trancheId,
          name: participant.name,
          commitment: participant.commitment,
          role: participant.role,
          sortOrder: participant.sortOrder ?? 0,
        });
        // Update local state with real DB id
        setTranches((prev) =>
          prev.map((t) =>
            t.id !== trancheId ? t : {
              ...t,
              participants: t.participants.map((p) =>
                p.id === participant.id ? { ...p, id } : p
              ),
            }
          )
        );
      } else {
        await updateParticipantMut.mutateAsync({
          id: participant.id,
          name: participant.name,
          commitment: participant.commitment,
          role: participant.role,
        });
      }
    } catch (e) {
      console.error('Failed to save participant', e);
    }
  };

  const handleDeleteParticipant = async (trancheId, participantId) => {
    setTranches((prev) =>
      prev.map((t) =>
        t.id !== trancheId
          ? t
          : { ...t, participants: t.participants.filter((p) => p.id !== participantId) }
      )
    );
    try {
      if (typeof participantId === 'number') await deleteParticipantMut.mutateAsync({ id: participantId });
    } catch (e) {
      console.error('Failed to delete participant', e);
    }
  };

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
                onClick={() => setTrancheModal({ open: true, existing: null })}
              >
                <Icon name="plus" size={12} /> Add tranche
              </button>
            </div>
          </div>

          {/* Total + stacked bar */}
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 36, fontWeight: 800,
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {fmtDollar(total)}
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
                  {fmtDollar(debtTotal)}
                </span>
                {" · "}
                <span style={{ color: "var(--text-muted)" }}>{debtPct}%</span>
              </span>
              <span>
                <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Equity</span>
                {" "}
                <span style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text)", fontWeight: 600 }}>
                  {fmtDollar(equityTotal)}
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
                onAddParticipant={() => setParticipantModal({ open: true, tranche: t, existing: null })}
                onEditTranche={(tranche) => setTrancheModal({ open: true, existing: tranche })}
                onEditParticipant={(tranche, participant) => setParticipantModal({ open: true, tranche, existing: participant })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Sources & Uses + Equity Participants ── */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <SourcesUsesPanel
          tranches={tranches}
          total={total}
          budgetGroups={(budgetGroupsQuery.data ?? []).map((g) => ({
            ...g,
            lines: (budgetLinesQuery.data ?? []).filter((l) => l.groupId === g.id),
          }))}
        />
        <EquityParticipantsPanel tranches={tranches} total={total} />
      </div>

      {/* Tranche Modal */}
      <TrancheModal
        open={trancheModal.open}
        onClose={() => setTrancheModal({ open: false, existing: null })}
        onSave={handleSaveTranche}
        onDelete={handleDeleteTranche}
        existing={trancheModal.existing}
      />

      {/* Participant Modal */}
      <ParticipantModal
        open={participantModal.open}
        onClose={() => setParticipantModal({ open: false, tranche: null, existing: null })}
        onSave={(p) => {
          if (participantModal.tranche) handleSaveParticipant(participantModal.tranche.id, p);
          setParticipantModal({ open: false, tranche: null, existing: null });
        }}
        onDelete={(pid) => {
          if (participantModal.tranche) handleDeleteParticipant(participantModal.tranche.id, pid);
          setParticipantModal({ open: false, tranche: null, existing: null });
        }}
        tranche={participantModal.tranche}
        totalCapital={total}
        existing={participantModal.existing}
      />
    </div>
  );
}

window.CapitalStackTab = CapitalStackTab;
