/**
 * FinancialsModule.jsx
 * Design: Quiet Brutalist Enterprise — ledger-like density, warm stone/slate palette,
 * compact status pills, construction-document precision.
 *
 * Budget tab:
 *  - Groups (sections) with collapsible line items
 *  - Drag-to-sort rows within a group
 *  - Auto-increment CSI numbers (MasterFormat style)
 *  - Contingency line items per group (% of group total)
 *  - Committed = sum of Approved/Contracted bids from vendors (matched by division)
 *  - Spent = sum of expenses with matching division
 *  - Variance = Committed − Spent
 *  - Group subtotal rows
 *  - Division/category filter + export CSV/PDF
 *
 * Expenses tab:
 *  - Vendor dropdown = project vendors from VendorStore
 *  - Payment reference field (check #, ACH/wire ref)
 *  - Date range + vendor + category filters
 *  - Column sort (click headers)
 *  - Inline status change (click pill → cycle)
 *  - Export CSV/Excel/PDF
 *  - Searchable dropdowns on add/edit overlays
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useVendorStore } from './VendorsModule.jsx';
import { useBudgetDb } from '@/hooks/useBudgetDb';
import { useExpensesDb } from '@/hooks/useExpensesDb';

// ─── Shared UI helpers (mirrors CondoCore.jsx definitions) ───────────────────
const FM_ICONS = {
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M18 6 6 18M6 6l18 18" />,
  edit: (<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" /></>),
  trash: (<><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>),
  download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>),
  grip: (<><circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" /></>),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowUp: (<><path d="M12 19V5M5 12l7-7 7 7" /></>),
  arrowDown: (<><path d="M12 5v14M19 12l-7 7-7-7" /></>),
  percent: (<><circle cx="9" cy="9" r="2" /><circle cx="15" cy="15" r="2" /><path d="m5 19 14-14" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>),
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  alert: (<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>),
};

const Icon = ({ name, size = 16, stroke = 1.6, ...rest }) => {
  const paths = FM_ICONS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths}
    </svg>
  );
};

const USE_CATEGORY_OPTIONS = [
  { value: 'land_acquisition', label: 'Land acquisition' },
  { value: 'hard_costs',       label: 'Hard costs' },
  { value: 'soft_costs',       label: 'Soft costs' },
  { value: 'financing_carry',  label: 'Financing & carry' },
  { value: 'contingency',      label: 'Contingency' },
];

const fmtUSD = (n, opts = {}) => {
  const { compact = false, decimals = 0, sign = false } = opts;
  const prefix = sign && n > 0 ? '+' : n < 0 ? '\u2212' : '';
  const abs = Math.abs(n);
  if (compact) {
    if (abs >= 1e9) return `${prefix}$${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${prefix}$${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${prefix}$${(abs / 1e3).toFixed(0)}K`;
  }
  return `${prefix}$${abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

function Modal({ open, onClose, title, subtitle, children, footer, width = 560 }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{title}</div>
            {subtitle && <div className="modal-sub">{subtitle}</div>}
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

function Field({ label, hint, children, span = 1 }) {
  return (
    <div className="form-field" style={{ gridColumn: `span ${span}` }}>
      <label className="form-label">{label}</label>
      {children}
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', prefix, suffix }) {
  return (
    <div className="form-input-wrap">
      {prefix && <span className="form-input-prefix">{prefix}</span>}
      <input type={type} className="form-input" value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
        style={{ paddingLeft: prefix ? 24 : undefined, paddingRight: suffix ? 30 : undefined }} />
      {suffix && <span className="form-input-suffix">{suffix}</span>}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="form-input" value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}>
      {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea className="form-input" rows={rows} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      style={{ resize: 'vertical', fontFamily: 'inherit' }} />
  );
}

// ─── CSI MasterFormat group definitions ─────────────────────────────────────
export const CSI_GROUPS = [
  { id: 'g01', csi: '01 00 00', label: 'General Requirements' },
  { id: 'g02', csi: '02 00 00', label: 'Existing Conditions' },
  { id: 'g03', csi: '03 00 00', label: 'Concrete' },
  { id: 'g04', csi: '04 00 00', label: 'Masonry' },
  { id: 'g05', csi: '05 00 00', label: 'Metals' },
  { id: 'g06', csi: '06 00 00', label: 'Wood, Plastics & Composites' },
  { id: 'g07', csi: '07 00 00', label: 'Thermal & Moisture Protection' },
  { id: 'g08', csi: '08 00 00', label: 'Openings' },
  { id: 'g09', csi: '09 00 00', label: 'Finishes' },
  { id: 'g10', csi: '10 00 00', label: 'Specialties' },
  { id: 'g11', csi: '11 00 00', label: 'Equipment' },
  { id: 'g14', csi: '14 00 00', label: 'Conveying Equipment' },
  { id: 'g21', csi: '21 00 00', label: 'Fire Suppression' },
  { id: 'g22', csi: '22 00 00', label: 'Plumbing' },
  { id: 'g23', csi: '23 00 00', label: 'HVAC' },
  { id: 'g26', csi: '26 00 00', label: 'Electrical' },
  { id: 'g31', csi: '31 00 00', label: 'Earthwork' },
  { id: 'g32', csi: '32 00 00', label: 'Exterior Improvements' },
  { id: 'g33', csi: '33 00 00', label: 'Utilities' },
  { id: 'gSC', csi: 'SC 00 00', label: 'Soft Costs' },
  { id: 'gOH', csi: 'OH 00 00', label: 'Overhead & Profit' },
];

// Map legacy category names → CSI group id
const CATEGORY_TO_CSI = {
  'General Condition': 'g01',
  'Foundation Site Work': 'g31',
  'Superstructure': 'g03',
  'Carpentry': 'g06',
  'Windows and Storefront': 'g08',
  'Masonry and Stucco': 'g04',
  'Roof': 'g07',
  'Elevator': 'g14',
  'Plumbing and Sprinkler': 'g22',
  'HVAC': 'g23',
  'Electric': 'g26',
  'Miscellaneous Site Work': 'g32',
  'Equipment and Miscellaneous': 'g11',
  'Kitchen, Bathrooms and Fixtures': 'g09',
  'Overhead & Profit': 'gOH',
  'Contingencies': 'g01',
  'Land Costs': 'g31',
  'Soft Costs': 'gSC',
};

// ─── Budget Store (DB-backed via useBudgetDb) ────────────────────────────────
const BudgetStoreCtx = React.createContext(null);

export function BudgetStoreProvider({ children }) {
  const db = useBudgetDb();

  // Provide the same interface as the old localStorage-backed store
  // All mutations go directly to the DB via tRPC
  const reorderGroups = React.useCallback((newOrder) => {
    // Reorder by updating sortOrder for each group
    newOrder.forEach((g, i) => {
      if (g.order !== i) db.updateGroup(g.id, { sortOrder: i });
    });
  }, [db]);

  const reorderLines = React.useCallback((groupId, newLines) => {
    newLines.forEach((l, i) => {
      if (l.order !== i) db.updateLine(groupId, l.id, { sortOrder: i });
    });
  }, [db]);

  const addContingencyLine = React.useCallback((line) => {
    // Find or use the contingency group
    const contingencyGroup = db.groups.find((g) => g.isContingencyGroup);
    if (contingencyGroup) {
      db.addLine(contingencyGroup.id, { ...line, isContingency: true });
    } else {
      // Add to first group as fallback
      if (db.groups.length > 0) {
        db.addLine(db.groups[0].id, { ...line, isContingency: true });
      }
    }
  }, [db]);

  return (
    <BudgetStoreCtx.Provider value={{
      groups: db.groups,
      isLoading: db.isLoading,
      addGroup: db.addGroup,
      updateGroup: db.updateGroup,
      deleteGroup: db.deleteGroup,
      reorderGroups,
      addLine: db.addLine,
      updateLine: db.updateLine,
      deleteLine: db.deleteLine,
      reorderLines,
      addContingencyLine,
    }}>
      {children}
    </BudgetStoreCtx.Provider>
  );
}

export function useBudgetStore() {
  return React.useContext(BudgetStoreCtx);
}

// ─── Searchable Select ───────────────────────────────────────────────────────
export function SearchableSelect({ value, onChange, options, placeholder = 'Select…', style }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ref = React.useRef(null);
  const inputRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  const filtered = options.filter((o) =>
    (o.label || o.value || '').toLowerCase().includes(query.toLowerCase())
  );
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inAnchor = ref.current && ref.current.contains(e.target);
      const inDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!inAnchor && !inDropdown) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        className="select"
        style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        onClick={() => { setOpen((v) => !v); setQuery(''); }}
      >
        <span style={{ color: selected ? 'var(--text)' : 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? (selected.label || selected.value) : placeholder}
        </span>
        <Icon name="chevronDown" size={11} style={{ flexShrink: 0, marginLeft: 6, color: 'var(--text-muted)' }} />
      </button>
      {open && ReactDOM.createPortal(
        <SearchableDropdown
          anchor={ref.current}
          query={query}
          onQuery={setQuery}
          filtered={filtered}
          onSelect={(v) => { onChange(v); setOpen(false); setQuery(''); }}
          inputRef={inputRef}
          dropdownRef={dropdownRef}
        />,
        document.body
      )}
    </div>
  );
}

function SearchableDropdown({ anchor, query, onQuery, filtered, onSelect, inputRef, dropdownRef }) {
  const [rect, setRect] = React.useState(null);
  React.useEffect(() => {
    if (!anchor) return;
    const update = () => setRect(anchor.getBoundingClientRect());
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [anchor]);
  if (!rect) return null;
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropUp = spaceBelow < 240 && rect.top > 240;
  const top = dropUp ? rect.top - 4 : rect.bottom + 4;
  const left = rect.left;
  const width = Math.max(rect.width, 180);
  return (
    <div ref={dropdownRef} style={{
      position: 'fixed',
      top: dropUp ? undefined : top,
      bottom: dropUp ? window.innerHeight - rect.top + 4 : undefined,
      left, width,
      transform: 'none',
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      zIndex: 10000,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search…"
          style={{
            width: '100%', background: 'transparent', border: 'none',
            outline: 'none', fontSize: 13, color: 'var(--text)',
          }}
        />
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-faint)' }}>No results</div>
        ) : filtered.map((o) => (
          <button
            key={o.value}
            type="button"
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 12px', fontSize: 13, background: 'none',
              border: 'none', cursor: 'pointer', color: 'var(--text)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            onClick={() => onSelect(o.value)}
          >
            {o.label || o.value}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Budget Tab ──────────────────────────────────────────────────────────────
export function BudgetTab() {
  const store = useBudgetStore();
  const vendorStore = useVendorStore();
  const expenseStore = useExpenseStore2();
  const expenses = expenseStore?.expenses || [];
  const [groupModal, setGroupModal] = React.useState(null);
  const [lineModal, setLineModal] = React.useState(null);
  const [dragState, setDragState] = React.useState(null); // { type:'group'|'line', groupId?, id }
  const [inlineEdit, setInlineEdit] = React.useState(null); // { groupId, lineId, value }

  const groups = store?.groups || [];

  // ── Auto-assign CSI numbers based on sort order ──────────────────────────
  // Groups get sequential two-digit codes: 01, 02, 03 …
  // Lines within a group get: GG.LL.00 where GG = group index, LL = line index
  const groupsWithCsi = React.useMemo(() => {
    return groups.map((g, gi) => {
      const groupCsi = String(gi + 1).padStart(2, '0');
      const linesWithCsi = g.lines.map((l, li) => ({
        ...l,
        csi: l.isContingency
          ? `${groupCsi}.C${String(li + 1).padStart(2, '0')}`
          : `${groupCsi}.${String(li + 1).padStart(2, '0')}`,
      }));
      return { ...g, csi: groupCsi, lines: linesWithCsi };
    });
  }, [groups]);

  // Compute committed from vendor bids per group label
  const committedByDivision = React.useMemo(() => {
    const vendors = vendorStore?.vendors || [];
    const map = {};
    vendors.forEach((v) => {
      (v.bids || []).forEach((b) => {
        if (b.status === 'Approved' || b.status === 'Contracted') {
          const div = b.division || v.division || 'Uncategorized';
          map[div] = (map[div] || 0) + (b.amount || 0);
        }
      });
    });
    return map;
  }, [vendorStore?.vendors]);

  // Compute spent from expenses keyed by the division label stored in expense.division
  // Division values may be CSI line labels ("01.01 — Temp. Facility...") or legacy group labels ("Soft Costs")
  const spentByLabel = React.useMemo(() => {
    const map = {};
    (expenses || []).forEach((e) => {
      if (e.amount > 0) {
        const div = e.division || 'Uncategorized';
        map[div] = (map[div] || 0) + e.amount;
      }
    });
    return map;
  }, [expenses]);

  // Build a Set of all group labels so we can distinguish group-level vs line-level expense assignments
  const groupLabelSet = React.useMemo(() => {
    const s = new Set();
    groups.forEach((g) => s.add(g.label));
    return s;
  }, [groups]);

  // Grand totals
  const grandTotals = React.useMemo(() => {
    let budget = 0, committed = 0, spent = 0;
    groupsWithCsi.forEach((g) => {
      const nonContingencyLines = g.lines.filter((x) => !x.isContingency);
      // Line-level CSI matches (preferred)
      const lineLevelSpent = nonContingencyLines.reduce((s, l) => {
        const csiLabel = l.csi ? `${l.csi} — ${l.name}` : l.name;
        return s + (spentByLabel[csiLabel] || (!groupLabelSet.has(l.name) ? (spentByLabel[l.name] || 0) : 0));
      }, 0);
      // Group-level fallback (counted once, not per line)
      const groupLevelSpent = lineLevelSpent > 0 ? lineLevelSpent : (spentByLabel[g.label] || nonContingencyLines.reduce((s, l) => s + (l.spent || 0), 0));
      g.lines.forEach((l) => {
        budget += l.budget || 0;
        if (!l.isContingency) {
          committed += committedByDivision[g.label] ? committedByDivision[g.label] / Math.max(1, nonContingencyLines.length) : (l.committed || 0);
        }
      });
      // Add group spent once (not per line)
      spent += groupLevelSpent;
    });
    return { budget, committed, spent, variance: committed - spent };
  }, [groupsWithCsi, committedByDivision, spentByLabel, groupLabelSet]);

  const handleExportCSV = () => {
    const rows = [['Group', 'CSI', 'Line Item', 'Budget', 'Committed', 'Spent', 'Variance']];
    groupsWithCsi.forEach((g) => {
      g.lines.forEach((l) => {
        const committed = l.isContingency
          ? g.lines.filter((x) => !x.isContingency).reduce((s, x) => s + (x.budget || 0), 0) * (l.contingencyPct || 0) / 100
          : (committedByDivision[g.label] ? committedByDivision[g.label] / Math.max(1, g.lines.filter((x) => !x.isContingency).length) : (l.committed || 0));
        const csiLabel = l.csi ? `${l.csi} — ${l.name}` : l.name;
        const lineSpentFromCsi = spentByLabel[csiLabel] || (!groupLabelSet.has(l.name) ? (spentByLabel[l.name] || 0) : 0);
        const nonContLinesCount = g.lines.filter((x) => !x.isContingency).length;
        const grpLabelSpent = spentByLabel[g.label] || 0;
        const spent = l.isContingency ? 0 : (lineSpentFromCsi > 0 ? lineSpentFromCsi : (grpLabelSpent / Math.max(1, nonContLinesCount)));
        rows.push([g.label, l.csi, l.name, l.budget, Math.round(committed), Math.round(spent), Math.round(committed - spent)]);
      });
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'budget.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('712 Driggs — Budget Summary', 14, 16);
    doc.setFontSize(9);
    doc.text(`Exported ${new Date().toLocaleDateString()}`, 14, 22);
    const head = [['Group', 'CSI', 'Line Item', 'Budget', 'Committed', 'Spent', 'Variance']];
    const body = [];
    let grandBudget = 0, grandCommitted = 0, grandSpent = 0;
    groupsWithCsi.forEach((g) => {
      const gBudget = g.lines.reduce((s, l) => s + (l.isContingency ? 0 : (l.budget || 0)), 0);
      const gCommitted = committedByDivision[g.label] || 0;
      const gSpent = spentByDivision[g.label] || 0;
      g.lines.forEach((l) => {
        const lCommitted = l.isContingency ? gBudget * (l.contingencyPct || 0) / 100 : (gCommitted / Math.max(1, g.lines.filter((x) => !x.isContingency).length));
        const lSpent = gSpent / Math.max(1, g.lines.filter((x) => !x.isContingency).length);
        body.push([g.label, l.csi, l.name, `$${(l.budget || 0).toLocaleString()}`, `$${Math.round(lCommitted).toLocaleString()}`, `$${Math.round(lSpent).toLocaleString()}`, `$${Math.round(lCommitted - lSpent).toLocaleString()}`]);
      });
      grandBudget += gBudget; grandCommitted += gCommitted; grandSpent += gSpent;
      body.push(['', '', `${g.label} TOTAL`, `$${gBudget.toLocaleString()}`, `$${Math.round(gCommitted).toLocaleString()}`, `$${Math.round(gSpent).toLocaleString()}`, `$${Math.round(gCommitted - gSpent).toLocaleString()}`]);
    });
    body.push(['', '', 'GRAND TOTAL', `$${grandBudget.toLocaleString()}`, `$${Math.round(grandCommitted).toLocaleString()}`, `$${Math.round(grandSpent).toLocaleString()}`, `$${Math.round(grandCommitted - grandSpent).toLocaleString()}`]);
    autoTable(doc, { head, body, startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [30, 80, 60] }, alternateRowStyles: { fillColor: [245, 248, 245] } });
    doc.save('budget.pdf');
  };

  // ── Drag-and-drop: groups ────────────────────────────────────────────────
  const handleGroupDragStart = (groupId) => setDragState({ type: 'group', id: groupId });
  const handleGroupDragOver = (e, groupId) => {
    e.preventDefault();
    if (!dragState || dragState.type !== 'group' || dragState.id === groupId) return;
    const fromIdx = groups.findIndex((g) => g.id === dragState.id);
    const toIdx = groups.findIndex((g) => g.id === groupId);
    if (fromIdx === -1 || toIdx === -1) return;
    const newGroups = [...groups];
    const [moved] = newGroups.splice(fromIdx, 1);
    newGroups.splice(toIdx, 0, moved);
    store.reorderGroups(newGroups);
  };
  const handleGroupDragEnd = () => setDragState(null);

  // ── Drag-and-drop: lines within a group ──────────────────────────────────
  const handleLineDragStart = (groupId, lineId) => setDragState({ type: 'line', groupId, id: lineId });
  const handleLineDragOver = (e, groupId, lineId) => {
    e.preventDefault();
    if (!dragState || dragState.type !== 'line' || dragState.groupId !== groupId || dragState.id === lineId) return;
    const g = groups.find((x) => x.id === groupId);
    if (!g) return;
    const fromIdx = g.lines.findIndex((l) => l.id === dragState.id);
    const toIdx = g.lines.findIndex((l) => l.id === lineId);
    if (fromIdx === -1 || toIdx === -1) return;
    const newLines = [...g.lines];
    const [moved] = newLines.splice(fromIdx, 1);
    newLines.splice(toIdx, 0, moved);
    store.reorderLines(groupId, newLines);
  };
  const handleLineDragEnd = () => setDragState(null);

  const totalBudget = grandTotals.budget;
  const totalCommitted = grandTotals.committed;
  const totalSpent = grandTotals.spent;
  const totalRemaining = totalBudget - totalSpent;
  const totalVariance = totalCommitted - totalSpent;
  const totalRemainingToCommit = totalBudget - totalCommitted;

  const groupOptions = groupsWithCsi.map((g) => ({ value: g.id, label: `${g.csi} — ${g.label}` }));

  const allCollapsed = groupsWithCsi.every((g) => g.collapsed);
  const handleCollapseAll = () => groupsWithCsi.forEach((g) => store.updateGroup(g.id, { collapsed: true }));
  const handleExpandAll = () => groupsWithCsi.forEach((g) => store.updateGroup(g.id, { collapsed: false }));

  const handleInlineEditStart = (groupId, lineId, currentBudget) => {
    setInlineEdit({ groupId, lineId, value: String(currentBudget || 0) });
  };
  const handleInlineEditCommit = () => {
    if (!inlineEdit) return;
    const parsed = parseFloat(inlineEdit.value.replace(/[^0-9.]/g, '')) || 0;
    store.updateLine(inlineEdit.groupId, inlineEdit.lineId, { budget: parsed });
    setInlineEdit(null);
  };

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Summary stat cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12,
        marginBottom: 20,
      }}>
        {[
          { label: 'TOTAL BUDGET', value: totalBudget, sub: `${groupsWithCsi.length} divisions · ${groupsWithCsi.reduce((s,g)=>s+g.lines.length,0)} lines`, color: undefined },
          { label: 'COMMITTED', value: totalCommitted, sub: `${totalBudget > 0 ? Math.round(totalCommitted/totalBudget*100) : 0}% of budget`, color: undefined },
          { label: 'TO COMMIT', value: totalRemainingToCommit, sub: 'Budget not yet committed', color: totalRemainingToCommit < 0 ? 'var(--signal-neg)' : totalRemainingToCommit === 0 ? 'var(--text-muted)' : 'var(--signal-warn, #b45309)' },
          { label: 'SPENT', value: totalSpent, sub: `${totalBudget > 0 ? Math.round(totalSpent/totalBudget*100) : 0}% of budget`, color: undefined },
          { label: 'REMAINING', value: totalRemaining, sub: 'Available to draw', color: undefined },
          { label: 'VARIANCE', value: totalVariance, sub: 'On baseline', color: totalVariance < 0 ? 'var(--signal-neg)' : totalVariance === 0 ? 'var(--text-muted)' : 'var(--signal-pos)' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-faint)', marginBottom: 6 }}>{label}</div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: color || 'var(--text)', lineHeight: 1.1 }}>
              {fmtUSD(value, { compact: true, sign: label === 'VARIANCE' })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}><Icon name="download" size={12} /> CSV</button>
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF}><Icon name="download" size={12} /> PDF</button>
          <div style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center', margin: '0 2px' }} />
          <button className="btn btn-ghost btn-sm" onClick={allCollapsed ? handleExpandAll : handleCollapseAll}>
            <Icon name={allCollapsed ? 'chevronDown' : 'chevronRight'} size={12} />
            {allCollapsed ? 'Expand all' : 'Collapse all'}
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center', margin: '0 2px' }} />
          <button className="btn btn-secondary btn-sm" onClick={() => setGroupModal('new')}><Icon name="plus" size={12} /> Add group</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setLineModal({ groupId: groupsWithCsi[0]?.id || null, line: null, isContingency: false })}><Icon name="plus" size={12} /> Add line item</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--signal-warn, #b45309)' }} onClick={() => setLineModal({ groupId: '__contingency__', line: null, isContingency: true })}>
            <Icon name="plus" size={12} /> Add contingency
          </button>
        </div>
      </div>

      {/* ── Single flat table ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table" style={{ tableLayout: 'auto', width: '100%' }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-elev)' }}>
              <th style={{ fontSize: 11, width: 90 }}>CSI</th>
              <th style={{ fontSize: 11 }}>ITEM</th>
              <th className="num" style={{ fontSize: 11, width: 100 }}>BUDGET</th>
              <th className="num" style={{ fontSize: 11, width: 110 }}>COMMITTED</th>
              <th className="num" style={{ fontSize: 11, width: 80 }}>SPENT</th>
              <th style={{ fontSize: 11, width: 160 }}>PROGRESS</th>
              <th className="num" style={{ fontSize: 11, width: 100 }}>VARIANCE</th>
              <th style={{ width: 64 }}></th>
            </tr>
          </thead>
          <tbody>
            {groupsWithCsi.map((group) => {
              const groupBudget = group.lines.filter((l) => !l.isContingency).reduce((s, l) => s + (l.budget || 0), 0);
              const lineCount = group.lines.filter((l) => !l.isContingency).length;
              const groupCommitted = committedByDivision[group.label] || group.lines.filter((l) => !l.isContingency).reduce((s, l) => s + (l.committed || 0), 0);
              // Group spent: prefer sum of CSI-matched line amounts; fall back to group-label total (once)
              const nonContLines = group.lines.filter((l) => !l.isContingency);
              const lineLevelGroupSpent = nonContLines.reduce((s, l) => {
                const csiLbl = l.csi ? `${l.csi} — ${l.name}` : l.name;
                return s + (spentByLabel[csiLbl] || (!groupLabelSet.has(l.name) ? (spentByLabel[l.name] || 0) : 0));
              }, 0);
              const groupSpent = lineLevelGroupSpent > 0
                ? lineLevelGroupSpent
                : (spentByLabel[group.label] || nonContLines.reduce((s, l) => s + (l.spent || 0), 0));
              const groupVariance = groupCommitted - groupSpent;
              const contingencyLines = group.lines.filter((l) => l.isContingency);
              const contingencyTotal = contingencyLines.reduce((s, l) => s + totalBudget * (l.contingencyPct || 0) / 100, 0);
              const progressPct = groupBudget > 0 ? Math.min(100, Math.round(groupSpent / groupBudget * 100)) : 0;
              const isDraggingGroup = dragState?.type === 'group' && dragState?.id === group.id;

              return (
                <React.Fragment key={group.id}>
                  {/* Group header row */}
                  <tr
                    draggable
                    onDragStart={() => handleGroupDragStart(group.id)}
                    onDragOver={(e) => handleGroupDragOver(e, group.id)}
                    onDragEnd={handleGroupDragEnd}
                    style={{
                      background: 'var(--bg-sunk)',
                      cursor: 'default',
                      userSelect: 'none',
                      borderTop: '2px solid var(--border)',
                      opacity: isDraggingGroup ? 0.4 : 1,
                    }}
                    onClick={() => store.updateGroup(group.id, { collapsed: !group.collapsed })}
                  >
                    <td style={{ paddingLeft: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: 'var(--text-faint)', cursor: 'grab' }}><Icon name="grip" size={11} /></span>
                        <Icon name={group.collapsed ? 'chevronRight' : 'chevronDown'} size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{group.csi}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 13 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span>{group.label}</span>
                        {group.useCategory && (
                          <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-faint)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            {USE_CATEGORY_OPTIONS.find(o => o.value === group.useCategory)?.label ?? group.useCategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="num mono" style={{ fontWeight: 700, fontSize: 13 }}>{fmtUSD(groupBudget + contingencyTotal, { compact: true })}</td>
                    <td className="num mono" style={{ fontWeight: 700, fontSize: 13 }}>{fmtUSD(groupCommitted, { compact: true })}</td>
                    <td className="num mono" style={{ fontWeight: 700, fontSize: 13 }}>{fmtUSD(groupSpent, { compact: true })}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${progressPct}%`, height: '100%', background: progressPct >= 100 ? 'var(--signal-neg)' : 'var(--cc-accent)', borderRadius: 2, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-faint)', minWidth: 28, textAlign: 'right' }}>{progressPct}%</span>
                      </div>
                    </td>
                    <td className="num mono" style={{ fontWeight: 700, fontSize: 13, color: groupVariance < 0 ? 'var(--signal-neg)' : groupVariance > 0 ? 'var(--signal-pos)' : 'var(--text-muted)' }}>
                      {groupVariance === 0 ? '—' : fmtUSD(groupVariance, { compact: true, sign: true })}
                    </td>
                    <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: 'nowrap', paddingRight: 10 }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="iconbtn" title="Add line" onClick={() => setLineModal({ groupId: group.id, line: null })}><Icon name="plus" size={12} /></button>
                        <button className="iconbtn" title="Edit group" onClick={() => setGroupModal(group)}><Icon name="edit" size={12} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Line item rows */}
                  {!group.collapsed && group.lines.map((line) => {
                    const contingencyAmt = line.isContingency ? totalBudget * (line.contingencyPct || 0) / 100 : 0;
                    // Contingency lines: committed = $0 (no vendor bids), spent = $0
                    const lineCommitted = line.isContingency
                      ? 0
                      : (committedByDivision[group.label]
                        ? committedByDivision[group.label] / Math.max(1, lineCount)
                        : (line.committed || 0));
                    // Spent: match by CSI label or exact line name only.
                    // If the division is a group label (not a line label), show $0 on individual lines
                    // — the group row already shows the group-label total.
                    const lineCsiLabel = line.csi ? `${line.csi} — ${line.name}` : line.name;
                    const lineSpentFromCsi = spentByLabel[lineCsiLabel] || (!groupLabelSet.has(line.name) ? (spentByLabel[line.name] || 0) : 0);
                    const lineSpent = line.isContingency ? 0 : (lineSpentFromCsi || (line.spent || 0));
                    const lineVariance = lineCommitted - lineSpent;
                    const lineBudget = line.isContingency ? contingencyAmt : (line.budget || 0);
                    const lineProgressPct = lineBudget > 0 ? Math.min(100, Math.round(lineSpent / lineBudget * 100)) : 0;
                    const isDraggingLine = dragState?.type === 'line' && dragState?.id === line.id;
                    return (
                      <tr
                        key={line.id}
                        draggable={!line.isContingency}
                        onDragStart={() => handleLineDragStart(group.id, line.id)}
                        onDragOver={(e) => handleLineDragOver(e, group.id, line.id)}
                        onDragEnd={handleLineDragEnd}
                        style={{
                          opacity: isDraggingLine ? 0.4 : 1,
                          background: line.isContingency ? 'color-mix(in srgb, var(--bg-sunk) 60%, transparent)' : undefined,
                          cursor: 'default',
                        }}
                      >
                        <td className="mono" style={{ fontSize: 11, color: 'var(--text-faint)', paddingLeft: 28 }}>{line.csi}</td>
                        <td style={{ paddingLeft: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {!line.isContingency && (
                              <span style={{ color: 'var(--text-faint)', flexShrink: 0, cursor: 'grab' }}><Icon name="grip" size={10} /></span>
                            )}
                            {line.isContingency && (
                              <span className="pill warn no-dot" style={{ fontSize: 10, flexShrink: 0 }}>CONT.</span>
                            )}
                            <span style={{ fontSize: 13 }}>{line.name}</span>
                            {line.isContingency && (
                              <span className="muted" style={{ fontSize: 11 }}>({line.contingencyPct}%)</span>
                            )}
                          </div>
                        </td>
                        <td
                          className="num mono"
                          style={{ fontSize: 13, cursor: line.isContingency ? 'default' : 'text', userSelect: 'none' }}
                          onDoubleClick={() => !line.isContingency && handleInlineEditStart(group.id, line.id, line.budget || 0)}
                          title={line.isContingency ? '' : 'Double-click to edit'}
                        >
                          {inlineEdit?.groupId === group.id && inlineEdit?.lineId === line.id ? (
                            <input
                              autoFocus
                              type="number"
                              value={inlineEdit.value}
                              onChange={(e) => setInlineEdit((prev) => ({ ...prev, value: e.target.value }))}
                              onBlur={handleInlineEditCommit}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleInlineEditCommit(); if (e.key === 'Escape') setInlineEdit(null); }}
                              style={{ width: 80, textAlign: 'right', fontSize: 13, background: 'var(--bg-elev)', border: '1px solid var(--cc-accent)', borderRadius: 4, padding: '2px 4px', color: 'var(--text)', outline: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : fmtUSD(lineBudget, { compact: true })}
                        </td>
                        <td className="num mono" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{fmtUSD(lineCommitted, { compact: true })}</td>
                        <td className="num mono" style={{ fontSize: 13 }}>{fmtUSD(lineSpent, { compact: true })}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${lineProgressPct}%`, height: '100%', background: lineProgressPct >= 100 ? 'var(--signal-neg)' : 'var(--cc-accent)', borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--text-faint)', minWidth: 24, textAlign: 'right' }}>—</span>
                          </div>
                        </td>
                        <td className="num mono" style={{ fontSize: 13, color: lineVariance < 0 ? 'var(--signal-neg)' : lineVariance > 0 ? 'var(--signal-pos)' : 'var(--text-muted)' }}>
                          {lineVariance === 0 ? '—' : fmtUSD(lineVariance, { compact: true, sign: true })}
                        </td>
                        <td style={{ paddingRight: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="iconbtn" onClick={() => setLineModal({ groupId: group.id, line, isContingency: line.isContingency })}>
                              <Icon name="edit" size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
          {/* Grand total footer */}
          {groups.length > 0 && (
            <tfoot>
              <tr className="grand-total-row" style={{ background: 'var(--bg-inv, #1a1a1a)', color: 'var(--text-inv, #fff)', fontWeight: 700, borderTop: '2px solid var(--border)' }}>
                <td style={{ paddingLeft: 12, fontSize: 12, color: 'inherit' }}></td>
                <td style={{ fontSize: 13, color: 'inherit' }}>Grand total</td>
                <td className="num mono" style={{ fontSize: 13, color: 'inherit' }}>{fmtUSD(grandTotals.budget, { compact: true })}</td>
                <td className="num mono" style={{ fontSize: 13, color: 'inherit' }}>{fmtUSD(grandTotals.committed, { compact: true })}</td>
                <td className="num mono" style={{ fontSize: 13, color: 'inherit' }}>{fmtUSD(grandTotals.spent, { compact: true })}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${grandTotals.budget > 0 ? Math.min(100, Math.round(grandTotals.spent/grandTotals.budget*100)) : 0}%`, height: '100%', background: 'var(--cc-accent)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', minWidth: 28, textAlign: 'right' }}>—</span>
                  </div>
                </td>
                <td className="num mono" style={{ fontSize: 13, color: grandTotals.variance < 0 ? '#f87171' : grandTotals.variance === 0 ? 'rgba(255,255,255,0.5)' : '#4ade80' }}>
                  {fmtUSD(grandTotals.variance, { compact: true, sign: true })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Group modal */}
      {groupModal && (
        <GroupModal
          open={!!groupModal}
          group={groupModal === 'new' ? null : groupModal}
          onClose={() => setGroupModal(null)}
          onSave={(g) => {
            if (g.id) store.updateGroup(g.id, g);
            else store.addGroup(g);
            setGroupModal(null);
          }}
          onDelete={(id) => { store.deleteGroup(id); setGroupModal(null); }}
        />
      )}
      {/* Line modal */}
      {lineModal && (
        <LineModal
          open={!!lineModal}
          groupId={lineModal.groupId}
          line={lineModal.line}
          isContingency={lineModal.isContingency}
          group={groupsWithCsi.find((g) => g.id === lineModal.groupId)}
          groupOptions={groupOptions}
          onGroupChange={(gid) => setLineModal((prev) => ({ ...prev, groupId: gid }))}
          onClose={() => setLineModal(null)}
          onSave={(groupId, line) => {
            if (line.id) {
              // Edit: find the actual group
              store.updateLine(groupId, line.id, line);
            } else if (groupId === '__contingency__') {
              store.addContingencyLine(line);
            } else {
              store.addLine(groupId, line);
            }
            setLineModal(null);
          }}
          onDelete={(groupId, lineId) => { store.deleteLine(groupId, lineId); setLineModal(null); }}
        />
      )}
    </div>
  );
}

// ─── Group Modal ─────────────────────────────────────────────────────────────
function GroupModal({ open, group, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  React.useEffect(() => {
    if (open) {
      setForm(group ? { ...group } : { label: '', useCategory: '' });
      setConfirmDelete(false);
      setErrors({});
    }
  }, [open, group]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const isEdit = !!form.id;

  const handleSave = () => {
    const errs = {};
    if (!form.label || !form.label.trim()) errs.label = 'Group name is required';
    if (!form.useCategory) errs.useCategory = 'Use category is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ ...form });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit group' : 'Add budget group'}
      subtitle="CSI number is assigned automatically based on sort order"
      width={480}
      footer={
        <>
          {isEdit && !confirmDelete && (
            <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => setConfirmDelete(true)}><Icon name="trash" size={13} /> Delete group</button>
          )}
          {isEdit && confirmDelete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
              <span style={{ fontSize: 13, color: 'var(--signal-neg)' }}>Delete this group and all its lines?</span>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--signal-neg)' }} onClick={() => onDelete(form.id)}>Yes, delete</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          )}
          {!confirmDelete && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          {!confirmDelete && (
            <button className="btn btn-primary" onClick={handleSave}>
              {isEdit ? 'Save changes' : 'Add group'}
            </button>
          )}
        </>
      }
    >
      <div className="form-grid">
        <Field label="Group name" span={2} error={errors.label}>
          <Input value={form.label || ''} onChange={set('label')} placeholder="e.g. Foundation Site Work" autoFocus />
        </Field>
        <Field label="Use category" span={2} required error={errors.useCategory}>
          <Select
            value={form.useCategory || ''}
            onChange={set('useCategory')}
            options={[{ value: '', label: 'Select a use category…', disabled: true }, ...USE_CATEGORY_OPTIONS]}
          />
        </Field>
      </div>
    </Modal>
  );
}

// ─── Line Modal ──────────────────────────────────────────────────────────────
function LineModal({ open, groupId, line, isContingency, group, groupOptions, onGroupChange, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setConfirmDelete(false);
    if (line) {
      setForm({ ...line });
    } else if (isContingency) {
      const lineCount = (group?.lines || []).filter((l) => !l.isContingency).length;
      setForm({
        name: 'Contingency',
        csi: group ? `${group.csi.replace(' 00 00', '')} ${String(lineCount + 1).padStart(2, '0')} 00` : '',
        budget: 0,
        committed: 0,
        spent: 0,
        notes: '',
        isContingency: true,
        contingencyPct: 5,
      });
    } else {
      const lineCount = (group?.lines || []).filter((l) => !l.isContingency).length;
      setForm({
        name: '',
        csi: group ? `${group.csi.replace(' 00 00', '')} ${String(lineCount + 1).padStart(2, '0')} 00` : '',
        budget: 0,
        committed: 0,
        spent: 0,
        notes: '',
        isContingency: false,
        contingencyPct: 0,
      });
    }
  }, [open, line, isContingency, group]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const num = (k) => (v) => setForm((f) => ({ ...f, [k]: parseFloat(v) || 0 }));
  const isEdit = !!form.id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit line item' : (isContingency || form.isContingency) ? 'Add contingency line' : 'Add line item'}
      width={520}
      footer={
        <>
          {isEdit && !confirmDelete && (
            <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => setConfirmDelete(true)}><Icon name="trash" size={13} /> Delete</button>
          )}
          {isEdit && confirmDelete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
              <span style={{ fontSize: 13, color: 'var(--signal-neg)' }}>Delete this line item?</span>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--signal-neg)' }} onClick={() => onDelete(groupId, form.id)}>Yes, delete</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          )}
          {!confirmDelete && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          {!confirmDelete && (
            <button className="btn btn-primary" onClick={() => onSave(groupId, form)}>
              {isEdit ? 'Save changes' : 'Add line'}
            </button>
          )}
        </>
      }
    >
      <div className="form-grid">
        {!isEdit && !isContingency && !form.isContingency && groupOptions && groupOptions.length > 0 && (
          <Field label="Group" span={2}>
            <SearchableSelect
              value={groupId}
              onChange={(v) => onGroupChange && onGroupChange(v)}
              options={groupOptions}
              placeholder="Select group…"
            />
          </Field>
        )}
        {(isContingency || form.isContingency) && (
          <div span={2} style={{ gridColumn: '1 / -1', padding: '6px 10px', background: 'var(--bg-sunk)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            This line will be added to the <strong>Contingency</strong> group (created automatically if it doesn’t exist).
          </div>
        )}
        <Field label="Line item name" span={2}><Input value={form.name} onChange={set('name')} placeholder="Concrete formwork" /></Field>
        {form.isContingency ? (
          <Field label="Contingency %" span={2}>
            <Input value={form.contingencyPct} onChange={num('contingencyPct')} type="number" hint="% of total project budget" />
          </Field>
        ) : (
          <>
            <Field label="Budget"><Input value={form.budget} onChange={num('budget')} type="number" prefix="$" /></Field>
            <Field label="Notes" span={2}><Textarea value={form.notes} onChange={set('notes')} placeholder="Scope notes, risk flags…" rows={2} /></Field>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─── Expense Store (DB-backed via useExpensesDb) ────────────────────────────────
const ExpenseStoreCtx2 = React.createContext(null);

export function ExpenseStoreProvider2({ children }) {
  const db = useExpensesDb();

  return (
    <ExpenseStoreCtx2.Provider value={{
      expenses: db.expenses,
      isLoading: db.isLoading,
      addExpense: db.addExpense,
      updateExpense: db.updateExpense,
      deleteExpense: db.deleteExpense,
    }}>
      {children}
    </ExpenseStoreCtx2.Provider>
  );
}

export function useExpenseStore2() {
  return React.useContext(ExpenseStoreCtx2);
}

// ─── Expenses Tab ────────────────────────────────────────────────────────────
const STATUS_OPTS = ['Pending', 'Approved', 'Paid', 'Rejected'];
const STATUS_CYCLE = { Pending: 'Approved', Approved: 'Paid', Paid: 'Rejected', Rejected: 'Pending' };
const METHOD_OPTS = ['ACH', 'Wire', 'Check', 'Credit', 'Card', 'Ledger'];
const STATUS_CLS = { Pending: 'warn', Approved: 'info', Paid: 'pos', Rejected: 'neutral' };

export function ExpensesTab({ seedExpenses }) {
  const store = useExpenseStore2();
  const vendorStore = useVendorStore();
  const budgetStore = useBudgetStore();

  const expenses = store?.expenses || seedExpenses || [];
  const projectVendors = React.useMemo(() => {
    const vs = vendorStore?.vendors || [];
    const ids = vendorStore?.projectVendorIds || new Set();
    return vs.filter((v) => ids.has(v.id) && !v.archived);
  }, [vendorStore]);

  // Filters
  const [filterVendor, setFilterVendor] = React.useState('');
  const [filterDivision, setFilterDivision] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterDateFrom, setFilterDateFrom] = React.useState('');
  const [filterDateTo, setFilterDateTo] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [sortCol, setSortCol] = React.useState('date');
  const [sortDir, setSortDir] = React.useState('desc');

  // Robust date parser: handles ISO (2024-01-08) and human (Jan 08, 2024) formats
  const parseExpDate = React.useCallback((dateStr) => {
    if (!dateStr) return null;
    // Try ISO first
    const iso = new Date(dateStr);
    if (!isNaN(iso.getTime()) && dateStr.includes('-')) return iso;
    // Try human format like "Jan 08, 2024" or "Jan 8, 2024"
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
    return null;
  }, []);
  const [expModal, setExpModal] = React.useState(null); // null | 'new' | expense

  // Division options = budget group labels (so expenses can be tagged to match budget groups)
  // Fall back to unique divisions already in expenses if budget store not available
  const allDivisions = React.useMemo(() => {
    const budgetGroups = (budgetStore?.groups || []).map((g) => g.label).filter(Boolean);
    const expDivisions = expenses.map((e) => e.division).filter(Boolean);
    return [...new Set([...budgetGroups, ...expDivisions])].sort();
  }, [budgetStore?.groups, expenses]);
  const allVendors = React.useMemo(() => [...new Set(expenses.map((e) => e.vendor).filter(Boolean))].sort(), [expenses]);

  const filtered = React.useMemo(() => {
    let list = [...expenses];
    if (filterVendor) list = list.filter((e) => (e.vendor || '').toLowerCase() === filterVendor.toLowerCase());
    if (filterDivision) list = list.filter((e) => (e.division || '').toLowerCase() === filterDivision.toLowerCase());
    if (filterStatus) list = list.filter((e) => (e.status || '').toLowerCase() === filterStatus.toLowerCase());
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom + 'T00:00:00');
      list = list.filter((e) => { const d = parseExpDate(e.date); return d && d >= fromDate; });
    }
    if (filterDateTo) {
      const toDate = new Date(filterDateTo + 'T23:59:59');
      list = list.filter((e) => { const d = parseExpDate(e.date); return d && d <= toDate; });
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter((e) =>
        (e.vendor || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.division || '').toLowerCase().includes(q) ||
        (e.ref || '').toLowerCase().includes(q) ||
        String(e.amount || '').includes(q)
      );
    }

    list.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'amount') { av = Number(av); bv = Number(bv); }
      if (sortCol === 'date') { av = parseExpDate(av) || new Date(0); bv = parseExpDate(bv) || new Date(0); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [expenses, filterVendor, filterDivision, filterStatus, filterDateFrom, filterDateTo, searchText, sortCol, sortDir, parseExpDate]);

  const totalAmount = filtered.reduce((s, e) => s + (e.amount > 0 ? e.amount : 0), 0);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <Icon name="arrowDown" size={10} style={{ color: 'var(--text-faint)', marginLeft: 3, opacity: 0.4 }} />;
    return <Icon name={sortDir === 'asc' ? 'arrowUp' : 'arrowDown'} size={10} style={{ color: 'var(--cc-accent)', marginLeft: 3 }} />;
  };

  const handleExportCSV = () => {
    const rows = [['Date', 'Vendor', 'Description', 'Division', 'Amount', 'Status', 'Method', 'Invoice', 'Reference']];
    filtered.forEach((e) => rows.push([e.date, e.vendor, e.desc, e.division, e.amount, e.status, e.method, e.invoice || '', e.reference || '']));
    const csv = rows.map((r) => r.map((c) => `"${c ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    // Simple TSV that Excel opens natively
    const rows = [['Date', 'Vendor', 'Description', 'Division', 'Amount', 'Status', 'Method', 'Invoice', 'Reference']];
    filtered.forEach((e) => rows.push([e.date, e.vendor, e.desc, e.division, e.amount, e.status, e.method, e.invoice || '', e.reference || '']));
    const tsv = rows.map((r) => r.join('\t')).join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.xls'; a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('712 Driggs — Expenses', 14, 16);
    doc.setFontSize(9);
    doc.text(`${filtered.length} records · Exported ${new Date().toLocaleDateString()}`, 14, 22);
    const head = [['Date', 'Vendor', 'Description', 'Division', 'Amount', 'Status', 'Method', 'Invoice/Ref']];
    const body = filtered.map((e) => [e.date, e.vendor, e.desc, e.division, `$${Number(e.amount || 0).toLocaleString()}`, e.status, e.method || '', e.invoice || e.reference || '']);
    autoTable(doc, { head, body, startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [30, 80, 60] }, alternateRowStyles: { fillColor: [245, 248, 245] } });
    doc.save('expenses.pdf');
  };

  const vendorOptions = React.useMemo(() => [
    ...projectVendors.map((v) => ({ value: v.name, label: v.name })),
    ...allVendors.filter((n) => !projectVendors.find((v) => v.name === n)).map((n) => ({ value: n, label: n })),
  ], [projectVendors, allVendors]);

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: 180 }}>
            <Icon name="search" size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search expenses…"
              className="input"
              style={{ paddingLeft: 28, fontSize: 13, width: '100%' }}
            />
          </div>
          <SearchableSelect
            value={filterVendor}
            onChange={setFilterVendor}
            options={[{ value: '', label: 'All vendors' }, ...vendorOptions]}
            placeholder="All vendors"
            style={{ minWidth: 160 }}
          />
          <SearchableSelect
            value={filterDivision}
            onChange={setFilterDivision}
            options={[{ value: '', label: 'All divisions' }, ...allDivisions.map((d) => ({ value: d, label: d }))]}
            placeholder="All divisions"
            style={{ minWidth: 160 }}
          />
          <SearchableSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[{ value: '', label: 'All statuses' }, ...STATUS_OPTS.map((s) => ({ value: s, label: s }))]}
            placeholder="All statuses"
            style={{ minWidth: 130 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>From</span>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="input"
              style={{ width: 130, fontSize: 12 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>To</span>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="input"
              style={{ width: 130, fontSize: 12 }}
            />
          </div>
          {(filterVendor || filterDivision || filterStatus || filterDateFrom || filterDateTo || searchText) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterVendor(''); setFilterDivision(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); setSearchText(''); }}>
              <Icon name="x" size={11} /> Clear
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}><Icon name="download" size={12} /> CSV</button>
          <button className="btn btn-ghost btn-sm" onClick={handleExportExcel}><Icon name="download" size={12} /> Excel</button>
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF}><Icon name="download" size={12} /> PDF</button>
          <button className="btn btn-primary btn-sm" onClick={() => setExpModal('new')}><Icon name="plus" size={12} /> Add expense</button>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 16, padding: '8px 12px', background: 'var(--bg-sunk)', borderRadius: 6, fontSize: 12 }}>
        <span className="muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        <span style={{ fontWeight: 600 }}>Total: <span className="mono">{fmtUSD(totalAmount, { compact: true })}</span></span>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-body-flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>Date <SortIcon col="date" /></th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('vendor')}>Vendor <SortIcon col="vendor" /></th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('desc')}>Description <SortIcon col="desc" /></th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('division')}>Division <SortIcon col="division" /></th>
                <th className="num" style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>Amount <SortIcon col="amount" /></th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status <SortIcon col="status" /></th>
                <th>Method</th>
                <th>Invoice / Ref</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-faint)', fontSize: 13 }}>No expenses match the current filters.</td></tr>
              ) : filtered.map((exp) => (
                <tr key={exp.id}>
                  <td className="mono muted" style={{ fontSize: 12 }}>{exp.date}</td>
                  <td style={{ fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.vendor}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 12 }}>{exp.desc}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exp.division}</td>
                  <td className="num mono" style={{ color: exp.amount < 0 ? 'var(--signal-pos)' : undefined }}>
                    {exp.amount < 0 ? `(${fmtUSD(-exp.amount, { compact: true })})` : fmtUSD(exp.amount, { compact: true })}
                  </td>
                  <td>
                    <button
                      className={`pill no-dot ${STATUS_CLS[exp.status] || 'neutral'}`}
                      title="Click to advance status"
                      style={{ cursor: 'pointer', border: 'none', background: 'none' }}
                      onClick={() => store?.updateExpense(exp.id, { status: STATUS_CYCLE[exp.status] || 'Pending' })}
                    >
                      {exp.status}
                    </button>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exp.method}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {exp.invoice && <span>{exp.invoice}</span>}
                    {exp.reference && <span className="muted" style={{ marginLeft: 4 }}>#{exp.reference}</span>}
                  </td>
                  <td>
                    <button className="iconbtn" onClick={() => setExpModal(exp)}><Icon name="edit" size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {expModal && (
        <ExpenseModal
          open={!!expModal}
          expense={expModal === 'new' ? null : expModal}
          vendorOptions={vendorOptions}
          budgetGroups={budgetStore?.groups || []}
          onClose={() => setExpModal(null)}
          onSave={(exp) => {
            if (exp.id) store?.updateExpense(exp.id, exp);
            else store?.addExpense(exp);
            setExpModal(null);
          }}
          onDelete={(id) => { store?.deleteExpense(id); setExpModal(null); }}
        />
      )}
    </div>
  );
}

// ─── Grouped Budget Select ───────────────────────────────────────────────────
// Renders budget groups as non-selectable headers and line items as selectable
// options with their CSI number prefix. Supports search filtering.
export function GroupedBudgetSelect({ value, onChange, budgetGroups, placeholder = 'Select line item…', style, error }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ref = React.useRef(null);
  const inputRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  // Build flat list of all selectable line items with their CSI labels
  const allItems = React.useMemo(() => {
    const items = [];
    (budgetGroups || []).forEach((g) => {
      (g.lines || []).forEach((l) => {
        const csiLabel = l.csi ? `${l.csi} — ${l.name}` : l.name;
        items.push({ groupId: g.id, groupLabel: g.label, groupCsi: g.csi, value: csiLabel, label: csiLabel, lineName: l.name, csi: l.csi });
      });
    });
    return items;
  }, [budgetGroups]);

  const selected = allItems.find((i) => i.value === value);

  // Filtered groups for dropdown — only show groups that have matching lines
  const filteredGroups = React.useMemo(() => {
    if (!query.trim()) return budgetGroups || [];
    const q = query.toLowerCase();
    return (budgetGroups || []).map((g) => ({
      ...g,
      lines: (g.lines || []).filter((l) => {
        const csiLabel = l.csi ? `${l.csi} — ${l.name}` : l.name;
        return csiLabel.toLowerCase().includes(q) || (l.csi || '').toLowerCase().includes(q) || (l.name || '').toLowerCase().includes(q) || (g.label || '').toLowerCase().includes(q);
      }),
    })).filter((g) => g.lines.length > 0);
  }, [budgetGroups, query]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inAnchor = ref.current && ref.current.contains(e.target);
      const inDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!inAnchor && !inDropdown) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSelect = (val) => { onChange(val); setOpen(false); setQuery(''); };

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        className="select"
        style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderColor: error ? 'var(--signal-neg)' : undefined,
        }}
        onClick={() => { setOpen((v) => !v); setQuery(''); }}
      >
        <span style={{ color: selected ? 'var(--text)' : 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="chevronDown" size={11} style={{ flexShrink: 0, marginLeft: 6, color: 'var(--text-muted)' }} />
      </button>
      {open && ReactDOM.createPortal(
        <GroupedBudgetDropdown
          anchor={ref.current}
          query={query}
          onQuery={setQuery}
          filteredGroups={filteredGroups}
          onSelect={handleSelect}
          selectedValue={value}
          inputRef={inputRef}
          dropdownRef={dropdownRef}
        />,
        document.body
      )}
    </div>
  );
}

export function GroupedBudgetDropdown({ anchor, query, onQuery, filteredGroups, onSelect, selectedValue, inputRef, dropdownRef }) {
  const [rect, setRect] = React.useState(null);
  React.useEffect(() => {
    if (!anchor) return;
    const update = () => setRect(anchor.getBoundingClientRect());
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [anchor]);
  if (!rect) return null;
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropUp = spaceBelow < 300 && rect.top > 300;
  const top = dropUp ? undefined : rect.bottom + 4;
  const bottom = dropUp ? window.innerHeight - rect.top + 4 : undefined;
  const left = rect.left;
  const width = Math.max(rect.width, 320);

  return (
    <div ref={dropdownRef} style={{
      position: 'fixed', top, bottom, left, width,
      background: 'var(--bg-elev)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      zIndex: 10000, overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search CSI or line item…"
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)' }}
        />
      </div>
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {filteredGroups.length === 0 ? (
          <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-faint)' }}>No results</div>
        ) : filteredGroups.map((g) => (
          <React.Fragment key={g.id}>
            {/* Group header — not selectable */}
            <div style={{
              padding: '6px 12px 4px',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color: 'var(--text-faint)', textTransform: 'uppercase',
              background: 'var(--bg-sunk)',
              borderTop: '1px solid var(--border)',
              userSelect: 'none',
            }}>
              {g.csi && <span style={{ fontFamily: 'monospace', marginRight: 6, color: 'var(--text-muted)' }}>{g.csi}</span>}
              {g.label}
            </div>
            {/* Line items — selectable */}
            {(g.lines || []).map((l) => {
              const csiLabel = l.csi ? `${l.csi} — ${l.name}` : l.name;
              const isSelected = selectedValue === csiLabel;
              return (
                <button
                  key={l.id}
                  type="button"
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '7px 12px 7px 20px', fontSize: 13,
                    background: isSelected ? 'var(--cc-accent, #1a4a3a)' : 'none',
                    border: 'none', cursor: 'pointer',
                    color: isSelected ? '#fff' : 'var(--text)',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'none'; }}
                  onClick={() => onSelect(csiLabel)}
                >
                  {l.csi && <span style={{ fontFamily: 'monospace', fontSize: 11, marginRight: 8, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', minWidth: 48, display: 'inline-block' }}>{l.csi}</span>}
                  {l.name}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Expense Modal ───────────────────────────────────────────────────────────
function ExpenseModal({ open, expense, vendorOptions, budgetGroups, onClose, onSave, onDelete }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const [form, setForm] = React.useState({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  React.useEffect(() => {
    if (open) {
      setForm(expense || {
        date: today, vendor: '', desc: '', division: '', amount: 0,
        status: 'Pending', method: 'ACH', invoice: '', reference: '', notes: '',
      });
      setConfirmDelete(false);
      setErrors({});
    }
  }, [open, expense]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const num = (k) => (v) => {
    const parsed = parseFloat(v) || 0;
    setForm((f) => ({ ...f, [k]: parsed }));
    if (k === 'amount') setErrors((e) => ({ ...e, amount: parsed <= 0 ? 'Amount must be greater than 0.' : '' }));
  };
  const isEdit = !!form.id;

  const validate = () => {
    const errs = {};
    if (!form.date || !form.date.trim()) errs.date = 'Date is required.';
    if (!form.amount || form.amount <= 0) errs.amount = 'Amount must be greater than 0.';
    if (!form.vendor || !form.vendor.trim()) errs.vendor = 'Vendor is required.';
    if (!form.division || !form.division.trim()) errs.division = 'Division / Category is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const methodOptions = METHOD_OPTS.map((m) => ({ value: m, label: m }));
  const statusOptions = STATUS_OPTS.map((s) => ({ value: s, label: s }));

  const RequiredMark = () => <span style={{ color: 'var(--signal-neg)', marginLeft: 2 }}>*</span>;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit expense' : 'Add expense'}
      subtitle="Record a payment or ledger entry"
      width={620}
      footer={
        <>
          {isEdit && !confirmDelete && (
            <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          {isEdit && confirmDelete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
              <span style={{ fontSize: 12, color: 'var(--signal-neg)', fontWeight: 500 }}>Delete this expense?</span>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--signal-neg)' }} onClick={() => onDelete(form.id)}>Yes, delete</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            if (!validate()) return;
            onSave(form);
          }}>{isEdit ? 'Save changes' : 'Add expense'}</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label={<>DATE <RequiredMark /></>}>
          <Input value={form.date} onChange={(v) => { set('date')(v); setErrors((e) => ({ ...e, date: v.trim() ? '' : 'Date is required.' })); }} placeholder="May 20, 2026" />
          {errors.date && <div style={{ color: 'var(--signal-neg)', fontSize: 11, marginTop: 3 }}>{errors.date}</div>}
        </Field>
        <Field label={<>AMOUNT <RequiredMark /></>}>
          <Input value={form.amount} onChange={num('amount')} type="number" prefix="$" min={0} />
          {errors.amount && <div style={{ color: 'var(--signal-neg)', fontSize: 11, marginTop: 3 }}>{errors.amount}</div>}
        </Field>
        <Field label={<>VENDOR <RequiredMark /></>} span={2}>
          <SearchableSelect
            value={form.vendor}
            onChange={(v) => { set('vendor')(v); setErrors((e) => ({ ...e, vendor: v ? '' : 'Vendor is required.' })); }}
            options={[{ value: '', label: '— Select vendor —' }, ...vendorOptions]}
            placeholder="Select vendor…"
            style={errors.vendor ? { borderColor: 'var(--signal-neg)' } : {}}
          />
          {errors.vendor && <div style={{ color: 'var(--signal-neg)', fontSize: 11, marginTop: 3 }}>{errors.vendor}</div>}
        </Field>
        <Field label="DESCRIPTION" span={2}><Input value={form.desc} onChange={set('desc')} placeholder="Invoice description or memo" /></Field>
        <Field label={<>DIVISION / CATEGORY <RequiredMark /></>} span={2}>
          <GroupedBudgetSelect
            value={form.division}
            onChange={(v) => { set('division')(v); setErrors((e) => ({ ...e, division: v ? '' : 'Division / Category is required.' })); }}
            budgetGroups={budgetGroups}
            placeholder="Select CSI line item…"
            error={!!errors.division}
          />
          {errors.division && <div style={{ color: 'var(--signal-neg)', fontSize: 11, marginTop: 3 }}>{errors.division}</div>}
        </Field>
        <Field label="STATUS">
          <SearchableSelect value={form.status} onChange={set('status')} options={statusOptions} placeholder="Status…" />
        </Field>
        <Field label="PAYMENT METHOD">
          <SearchableSelect value={form.method} onChange={set('method')} options={methodOptions} placeholder="Method…" />
        </Field>
        <Field label="CHECK / ACH / WIRE REFERENCE">
          <Input value={form.reference} onChange={set('reference')} placeholder="Check #1042 or ACH ref…" />
        </Field>
        <Field label="INVOICE #"><Input value={form.invoice} onChange={set('invoice')} placeholder="INV-0001" /></Field>
        <Field label="NOTES" span={2}><Textarea value={form.notes} onChange={set('notes')} placeholder="Additional notes…" rows={2} /></Field>
        <Field label="RECEIPT / DOCUMENT" span={2}>
          {form.receiptUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <a href={form.receiptUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--cc-accent)', textDecoration: 'underline' }}>
                {form.receiptName || 'View receipt'}
              </a>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--signal-neg)', padding: '2px 6px', fontSize: 11 }}
                onClick={() => setForm((f) => ({ ...f, receiptUrl: '', receiptKey: '', receiptName: '' }))}>
                Remove
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setForm((f) => ({ ...f, _receiptUploading: true }));
                    try {
                      const fd = new FormData();
                      fd.append('file', file);
                      const res = await fetch('/api/upload-document', { method: 'POST', body: fd, credentials: 'include' });
                      if (!res.ok) throw new Error('Upload failed');
                      const { key, url } = await res.json();
                      setForm((f) => ({ ...f, receiptKey: key, receiptUrl: url, receiptName: file.name, _receiptUploading: false }));
                    } catch {
                      setForm((f) => ({ ...f, _receiptUploading: false }));
                      alert('Upload failed. Please try again.');
                    }
                  }}
                />
                <span className="btn btn-ghost btn-sm" style={{ pointerEvents: 'none' }}>
                  {form._receiptUploading ? 'Uploading…' : '+ Attach receipt'}
                </span>
              </label>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>PDF, PNG, JPG, DOC, XLS</span>
            </div>
          )}
        </Field>
      </div>
    </Modal>
  );
}
