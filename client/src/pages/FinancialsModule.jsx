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

// ─── Budget Store ────────────────────────────────────────────────────────────
const BUDGET_STORAGE_KEY = 'cc_budget_v2';
const BUDGET_GROUPS_STORAGE_KEY = 'cc_budget_groups_v2';

function loadBudgetFromStorage() {
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}
function loadGroupsFromStorage() {
  try {
    const raw = localStorage.getItem(BUDGET_GROUPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

// Build initial budget groups from seed data
function buildInitialBudget(seedBudget, expensesByCategory = {}) {
  // Group seed rows by category
  const grouped = {};
  seedBudget.forEach((row) => {
    const cat = row.Category || 'Uncategorized';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(row);
  });

  const groups = [];
  let groupOrder = 0;
  Object.entries(grouped).forEach(([cat, rows]) => {
    const csiGroupId = CATEGORY_TO_CSI[cat] || 'g01';
    const csiGroup = CSI_GROUPS.find((g) => g.id === csiGroupId) || CSI_GROUPS[0];
    const groupId = `grp-${Date.now()}-${groupOrder++}`;
    const lines = rows.map((row, li) => {
      const budget = Number(row.Amount || 0);
      const spent = expensesByCategory[cat] ? expensesByCategory[cat] / rows.length : 0;
      return {
        id: `line-${groupId}-${li}`,
        csi: `${csiGroup.csi.replace(' 00 00', '')} ${String(li + 1).padStart(2, '0')} 00`,
        name: row['Sub-Category'] || cat,
        budget,
        committed: row.Status && row.Status !== 'Open' ? budget : 0,
        spent: Math.round(spent),
        notes: '',
        isContingency: false,
        contingencyPct: 0,
        order: li,
      };
    });
    groups.push({
      id: groupId,
      csiGroupId,
      label: cat,
      csi: csiGroup.csi,
      collapsed: false,
      order: groupOrder,
      lines,
    });
  });
  return groups;
}

const BudgetStoreCtx = React.createContext(null);

export function BudgetStoreProvider({ children, seedBudget, expensesByCategory = {} }) {
  const [groups, setGroups] = React.useState(() => {
    const saved = loadGroupsFromStorage();
    if (saved) return saved;
    return buildInitialBudget(seedBudget, expensesByCategory);
  });

  // Persist on every change
  React.useEffect(() => {
    try { localStorage.setItem(BUDGET_GROUPS_STORAGE_KEY, JSON.stringify(groups)); } catch (_) {}
  }, [groups]);

  const addGroup = React.useCallback((group) => {
    setGroups((prev) => [...prev, { ...group, id: `grp-${Date.now()}`, lines: [], order: prev.length }]);
  }, []);

  const updateGroup = React.useCallback((groupId, patch) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, ...patch } : g));
  }, []);

  const deleteGroup = React.useCallback((groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }, []);

  const reorderGroups = React.useCallback((newOrder) => {
    setGroups(newOrder);
  }, []);

  const addLine = React.useCallback((groupId, line) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      const newLine = { ...line, id: `line-${Date.now()}`, order: g.lines.length };
      return { ...g, lines: [...g.lines, newLine] };
    }));
  }, []);

  const updateLine = React.useCallback((groupId, lineId, patch) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, lines: g.lines.map((l) => l.id === lineId ? { ...l, ...patch } : l) };
    }));
  }, []);

  const deleteLine = React.useCallback((groupId, lineId) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, lines: g.lines.filter((l) => l.id !== lineId) };
    }));
  }, []);

  const reorderLines = React.useCallback((groupId, newLines) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, lines: newLines } : g));
  }, []);

  return (
    <BudgetStoreCtx.Provider value={{
      groups, addGroup, updateGroup, deleteGroup, reorderGroups,
      addLine, updateLine, deleteLine, reorderLines,
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

  const filtered = options.filter((o) =>
    (o.label || o.value || '').toLowerCase().includes(query.toLowerCase())
  );
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
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
        />,
        document.body
      )}
    </div>
  );
}

function SearchableDropdown({ anchor, query, onQuery, filtered, onSelect, inputRef }) {
  const [rect, setRect] = React.useState(null);
  React.useEffect(() => {
    if (anchor) setRect(anchor.getBoundingClientRect());
  }, [anchor]);
  if (!rect) return null;
  const top = rect.bottom + window.scrollY + 4;
  const left = rect.left + window.scrollX;
  const width = rect.width;
  return (
    <div style={{
      position: 'absolute',
      top, left, width,
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
export function BudgetTab({ expenses }) {
  const store = useBudgetStore();
  const vendorStore = useVendorStore();
  const [filterGroup, setFilterGroup] = React.useState('All');
  const [groupModal, setGroupModal] = React.useState(null); // null | 'new' | group
  const [lineModal, setLineModal] = React.useState(null); // null | { groupId, line }
  const [dragState, setDragState] = React.useState(null);

  const groups = store?.groups || [];

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

  // Compute spent from expenses per division
  const spentByDivision = React.useMemo(() => {
    const map = {};
    (expenses || []).forEach((e) => {
      if (e.amount > 0) {
        const div = e.division || 'Uncategorized';
        map[div] = (map[div] || 0) + e.amount;
      }
    });
    return map;
  }, [expenses]);

  const filteredGroups = filterGroup === 'All' ? groups : groups.filter((g) => g.id === filterGroup);

  // Grand totals
  const grandTotals = React.useMemo(() => {
    let budget = 0, committed = 0, spent = 0;
    groups.forEach((g) => {
      g.lines.forEach((l) => {
        budget += l.budget || 0;
        if (l.isContingency) {
          const groupBudget = g.lines.filter((x) => !x.isContingency).reduce((s, x) => s + (x.budget || 0), 0);
          committed += groupBudget * (l.contingencyPct || 0) / 100;
        } else {
          committed += committedByDivision[g.label] ? committedByDivision[g.label] / Math.max(1, g.lines.filter((x) => !x.isContingency).length) : (l.committed || 0);
        }
        spent += spentByDivision[g.label] ? spentByDivision[g.label] / Math.max(1, g.lines.filter((x) => !x.isContingency).length) : (l.spent || 0);
      });
    });
    return { budget, committed, spent, variance: committed - spent };
  }, [groups, committedByDivision, spentByDivision]);

  const handleExportCSV = () => {
    const rows = [['Group', 'CSI', 'Line Item', 'Budget', 'Committed', 'Spent', 'Variance']];
    groups.forEach((g) => {
      g.lines.forEach((l) => {
        const committed = l.isContingency
          ? g.lines.filter((x) => !x.isContingency).reduce((s, x) => s + (x.budget || 0), 0) * (l.contingencyPct || 0) / 100
          : (committedByDivision[g.label] ? committedByDivision[g.label] / Math.max(1, g.lines.filter((x) => !x.isContingency).length) : (l.committed || 0));
        const spent = spentByDivision[g.label] ? spentByDivision[g.label] / Math.max(1, g.lines.filter((x) => !x.isContingency).length) : (l.spent || 0);
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
    groups.forEach((g) => {
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

  // Drag-and-drop for line items within a group
  const handleLineDragStart = (groupId, lineId) => setDragState({ groupId, lineId });
  const handleLineDragOver = (e, groupId, lineId) => {
    e.preventDefault();
    if (!dragState || dragState.groupId !== groupId || dragState.lineId === lineId) return;
    const g = groups.find((x) => x.id === groupId);
    if (!g) return;
    const fromIdx = g.lines.findIndex((l) => l.id === dragState.lineId);
    const toIdx = g.lines.findIndex((l) => l.id === lineId);
    if (fromIdx === -1 || toIdx === -1) return;
    const newLines = [...g.lines];
    const [moved] = newLines.splice(fromIdx, 1);
    newLines.splice(toIdx, 0, moved);
    store.reorderLines(groupId, newLines);
    setDragState({ groupId, lineId: dragState.lineId });
  };
  const handleLineDragEnd = () => setDragState(null);

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, flexWrap: 'wrap' }}>
          <button className={`chip ${filterGroup === 'All' ? 'active' : ''}`} onClick={() => setFilterGroup('All')}>All groups</button>
          {groups.map((g) => (
            <button key={g.id} className={`chip ${filterGroup === g.id ? 'active' : ''}`} onClick={() => setFilterGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}><Icon name="download" size={12} /> CSV</button>
          <button className="btn btn-ghost btn-sm" onClick={handleExportPDF}><Icon name="download" size={12} /> PDF</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setGroupModal('new')}><Icon name="plus" size={12} /> Add group</button>
        </div>
      </div>

      {/* Groups */}
      {filteredGroups.map((group) => {
        const groupBudget = group.lines.filter((l) => !l.isContingency).reduce((s, l) => s + (l.budget || 0), 0);
        const lineCount = group.lines.filter((l) => !l.isContingency).length;
        const groupCommitted = committedByDivision[group.label] || group.lines.filter((l) => !l.isContingency).reduce((s, l) => s + (l.committed || 0), 0);
        const groupSpent = spentByDivision[group.label] || group.lines.filter((l) => !l.isContingency).reduce((s, l) => s + (l.spent || 0), 0);
        const groupVariance = groupCommitted - groupSpent;
        const contingencyLines = group.lines.filter((l) => l.isContingency);
        const contingencyTotal = contingencyLines.reduce((s, l) => s + groupBudget * (l.contingencyPct || 0) / 100, 0);

        return (
          <div key={group.id} className="card" style={{ marginBottom: 12 }}>
            {/* Group header */}
            <div
              className="card-head"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => store.updateGroup(group.id, { collapsed: !group.collapsed })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <Icon name={group.collapsed ? 'chevronRight' : 'chevronDown'} size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono faint" style={{ fontSize: 11 }}>{group.csi}</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{group.label}</span>
                    <span className="muted" style={{ fontSize: 11 }}>{lineCount} line{lineCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 8 }}>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmtUSD(groupBudget, { compact: true })}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>budget</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--cc-accent)' }}>{fmtUSD(groupCommitted, { compact: true })}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>committed</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13 }}>{fmtUSD(groupSpent, { compact: true })}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>spent</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, color: groupVariance < 0 ? 'var(--signal-neg)' : groupVariance > 0 ? 'var(--signal-pos)' : 'var(--text-muted)' }}>
                    {groupVariance === 0 ? '—' : fmtUSD(groupVariance, { compact: true, sign: true })}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>variance</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => setLineModal({ groupId: group.id, line: null })}>
                  <Icon name="plus" size={11} /> Line
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setLineModal({ groupId: group.id, line: null, isContingency: true })}>
                  <Icon name="percent" size={11} /> Contingency
                </button>
                <button className="iconbtn" onClick={() => setGroupModal(group)} title="Edit group">
                  <Icon name="edit" size={12} />
                </button>
              </div>
            </div>

            {/* Line items */}
            {!group.collapsed && (
              <div className="card-body-flush">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 24 }}></th>
                      <th style={{ width: 90 }}>CSI</th>
                      <th>Line item</th>
                      <th className="num">Budget</th>
                      <th className="num">Committed</th>
                      <th className="num">Spent</th>
                      <th className="num">Variance</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.lines.map((line) => {
                      const lineCommitted = line.isContingency
                        ? groupBudget * (line.contingencyPct || 0) / 100
                        : (committedByDivision[group.label]
                          ? committedByDivision[group.label] / Math.max(1, lineCount)
                          : (line.committed || 0));
                      const lineSpent = line.isContingency ? 0
                        : (spentByDivision[group.label]
                          ? spentByDivision[group.label] / Math.max(1, lineCount)
                          : (line.spent || 0));
                      const lineVariance = lineCommitted - lineSpent;
                      const isDragging = dragState?.lineId === line.id;
                      return (
                        <tr
                          key={line.id}
                          draggable={!line.isContingency}
                          onDragStart={() => handleLineDragStart(group.id, line.id)}
                          onDragOver={(e) => handleLineDragOver(e, group.id, line.id)}
                          onDragEnd={handleLineDragEnd}
                          style={{
                            cursor: line.isContingency ? 'default' : 'grab',
                            opacity: isDragging ? 0.4 : 1,
                            background: line.isContingency ? 'var(--bg-sunk)' : undefined,
                          }}
                        >
                          <td style={{ color: 'var(--text-faint)', fontSize: 11, cursor: 'grab' }}>
                            {!line.isContingency && <Icon name="grip" size={11} />}
                          </td>
                          <td className="mono faint" style={{ fontSize: 11 }}>{line.csi}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {line.isContingency && (
                                <span className="pill warn no-dot" style={{ fontSize: 10 }}>CONTINGENCY</span>
                              )}
                              <span style={{ fontWeight: line.isContingency ? 400 : 500 }}>{line.name}</span>
                              {line.isContingency && (
                                <span className="muted" style={{ fontSize: 11 }}>{line.contingencyPct}% of group</span>
                              )}
                            </div>
                          </td>
                          <td className="num mono">{fmtUSD(line.isContingency ? groupBudget * (line.contingencyPct || 0) / 100 : (line.budget || 0), { compact: true })}</td>
                          <td className="num mono muted">{fmtUSD(lineCommitted, { compact: true })}</td>
                          <td className="num mono">{fmtUSD(lineSpent, { compact: true })}</td>
                          <td className="num mono" style={{ color: lineVariance < 0 ? 'var(--signal-neg)' : lineVariance > 0 ? 'var(--signal-pos)' : 'var(--text-muted)' }}>
                            {lineVariance === 0 ? '—' : fmtUSD(lineVariance, { compact: true, sign: true })}
                          </td>
                          <td>
                            <button className="iconbtn" onClick={() => setLineModal({ groupId: group.id, line, isContingency: line.isContingency })}>
                              <Icon name="edit" size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {group.lines.length > 0 && (
                    <tfoot>
                      <tr style={{ background: 'var(--bg-sunk)', fontWeight: 600 }}>
                        <td colSpan="3">Group total{contingencyTotal > 0 ? ` (incl. ${fmtUSD(contingencyTotal, { compact: true })} contingency)` : ''}</td>
                        <td className="num mono">{fmtUSD(groupBudget + contingencyTotal, { compact: true })}</td>
                        <td className="num mono">{fmtUSD(groupCommitted, { compact: true })}</td>
                        <td className="num mono">{fmtUSD(groupSpent, { compact: true })}</td>
                        <td className="num mono" style={{ color: groupVariance < 0 ? 'var(--signal-neg)' : 'var(--signal-pos)' }}>
                          {groupVariance === 0 ? '—' : fmtUSD(groupVariance, { compact: true, sign: true })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Grand total */}
      {filterGroup === 'All' && groups.length > 0 && (
        <div className="card" style={{ background: 'var(--bg-sunk)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>GRAND TOTAL</span>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontWeight: 700 }}>{fmtUSD(grandTotals.budget, { compact: true })}</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>budget</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontWeight: 700, color: 'var(--cc-accent)' }}>{fmtUSD(grandTotals.committed, { compact: true })}</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>committed</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontWeight: 700 }}>{fmtUSD(grandTotals.spent, { compact: true })}</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>spent</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontWeight: 700, color: grandTotals.variance < 0 ? 'var(--signal-neg)' : 'var(--signal-pos)' }}>
                  {fmtUSD(grandTotals.variance, { compact: true, sign: true })}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>variance</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          group={groups.find((g) => g.id === lineModal.groupId)}
          onClose={() => setLineModal(null)}
          onSave={(groupId, line) => {
            if (line.id) store.updateLine(groupId, line.id, line);
            else store.addLine(groupId, line);
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
  React.useEffect(() => {
    if (open) setForm(group ? { ...group } : { label: '', csi: '', csiGroupId: CSI_GROUPS[0].id });
  }, [open, group]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const isEdit = !!form.id;
  const csiOptions = CSI_GROUPS.map((g) => ({ value: g.id, label: `${g.csi} — ${g.label}` }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit group' : 'Add budget group'}
      subtitle="Groups organize budget lines by CSI division"
      width={520}
      footer={
        <>
          {isEdit && <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => onDelete(form.id)}><Icon name="trash" size={13} /> Delete group</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            const csiGroup = CSI_GROUPS.find((g) => g.id === form.csiGroupId) || CSI_GROUPS[0];
            onSave({ ...form, csi: csiGroup.csi, label: form.label || csiGroup.label });
          }}>
            {isEdit ? 'Save changes' : 'Add group'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="CSI Division" span={2}>
          <SearchableSelect
            value={form.csiGroupId}
            onChange={(v) => {
              const csiGroup = CSI_GROUPS.find((g) => g.id === v);
              setForm((f) => ({ ...f, csiGroupId: v, label: csiGroup?.label || f.label, csi: csiGroup?.csi || f.csi }));
            }}
            options={csiOptions}
            placeholder="Select CSI division…"
          />
        </Field>
        <Field label="Group label (override)" span={2}>
          <Input value={form.label} onChange={set('label')} placeholder="e.g. Foundation Site Work" />
        </Field>
      </div>
    </Modal>
  );
}

// ─── Line Modal ──────────────────────────────────────────────────────────────
function LineModal({ open, groupId, line, isContingency, group, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (!open) return;
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
      subtitle={group ? `Group: ${group.label}` : ''}
      width={520}
      footer={
        <>
          {isEdit && <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => onDelete(groupId, form.id)}><Icon name="trash" size={13} /> Delete</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(groupId, form)}>
            {isEdit ? 'Save changes' : 'Add line'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="CSI number"><Input value={form.csi} onChange={set('csi')} placeholder="03 01 00" /></Field>
        <Field label="Line item name"><Input value={form.name} onChange={set('name')} placeholder="Concrete formwork" /></Field>
        {form.isContingency ? (
          <Field label="Contingency %" span={2}>
            <Input value={form.contingencyPct} onChange={num('contingencyPct')} type="number" hint="% of group subtotal" />
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

// ─── Expense Store (localStorage-backed) ────────────────────────────────────
const EXP_STORAGE_KEY = 'cc_expenses_v3';

function loadExpenses(seedExpenses) {
  try {
    const raw = localStorage.getItem(EXP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return seedExpenses;
}

const ExpenseStoreCtx2 = React.createContext(null);

export function ExpenseStoreProvider2({ children, seedExpenses }) {
  const [expenses, setExpenses] = React.useState(() => loadExpenses(seedExpenses));

  React.useEffect(() => {
    try { localStorage.setItem(EXP_STORAGE_KEY, JSON.stringify(expenses)); } catch (_) {}
  }, [expenses]);

  const addExpense = React.useCallback((exp) => {
    setExpenses((prev) => [{ ...exp, id: `exp-${Date.now()}` }, ...prev]);
  }, []);

  const updateExpense = React.useCallback((id, patch) => {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, ...patch } : e));
  }, []);

  const deleteExpense = React.useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ExpenseStoreCtx2.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
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
  const [sortCol, setSortCol] = React.useState('date');
  const [sortDir, setSortDir] = React.useState('desc');
  const [expModal, setExpModal] = React.useState(null); // null | 'new' | expense

  const allDivisions = React.useMemo(() => [...new Set(expenses.map((e) => e.division).filter(Boolean))].sort(), [expenses]);
  const allVendors = React.useMemo(() => [...new Set(expenses.map((e) => e.vendor).filter(Boolean))].sort(), [expenses]);

  const filtered = React.useMemo(() => {
    let list = [...expenses];
    if (filterVendor) list = list.filter((e) => e.vendor === filterVendor);
    if (filterDivision) list = list.filter((e) => e.division === filterDivision);
    if (filterStatus) list = list.filter((e) => e.status === filterStatus);
    if (filterDateFrom) list = list.filter((e) => new Date(e.date) >= new Date(filterDateFrom));
    if (filterDateTo) list = list.filter((e) => new Date(e.date) <= new Date(filterDateTo));

    list.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'amount') { av = Number(av); bv = Number(bv); }
      if (sortCol === 'date') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [expenses, filterVendor, filterDivision, filterStatus, filterDateFrom, filterDateTo, sortCol, sortDir]);

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
          {(filterVendor || filterDivision || filterStatus || filterDateFrom || filterDateTo) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterVendor(''); setFilterDivision(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); }}>
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
          divisionOptions={allDivisions}
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

// ─── Expense Modal ───────────────────────────────────────────────────────────
function ExpenseModal({ open, expense, vendorOptions, divisionOptions, onClose, onSave, onDelete }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) setForm(expense || {
      date: today, vendor: '', desc: '', division: '', amount: 0,
      status: 'Pending', method: 'ACH', invoice: '', reference: '', notes: '',
    });
  }, [open, expense]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const num = (k) => (v) => setForm((f) => ({ ...f, [k]: parseFloat(v) || 0 }));
  const isEdit = !!form.id;

  const divOptions = [
    ...divisionOptions.map((d) => ({ value: d, label: d })),
    { value: 'Uncategorized', label: 'Uncategorized' },
  ];
  const methodOptions = METHOD_OPTS.map((m) => ({ value: m, label: m }));
  const statusOptions = STATUS_OPTS.map((s) => ({ value: s, label: s }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit expense' : 'Add expense'}
      subtitle="Record a payment or ledger entry"
      width={600}
      footer={
        <>
          {isEdit && <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => onDelete(form.id)}><Icon name="trash" size={13} /> Delete</button>}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>{isEdit ? 'Save changes' : 'Add expense'}</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Date"><Input value={form.date} onChange={set('date')} placeholder="May 20, 2026" /></Field>
        <Field label="Amount"><Input value={form.amount} onChange={num('amount')} type="number" prefix="$" /></Field>
        <Field label="Vendor" span={2}>
          <SearchableSelect
            value={form.vendor}
            onChange={set('vendor')}
            options={[{ value: '', label: '— No vendor —' }, ...vendorOptions]}
            placeholder="Select vendor…"
          />
        </Field>
        <Field label="Description" span={2}><Input value={form.desc} onChange={set('desc')} placeholder="Invoice description or memo" /></Field>
        <Field label="Division / Category">
          <SearchableSelect
            value={form.division}
            onChange={set('division')}
            options={[{ value: '', label: '— Select —' }, ...divOptions]}
            placeholder="Select division…"
          />
        </Field>
        <Field label="Status">
          <SearchableSelect value={form.status} onChange={set('status')} options={statusOptions} placeholder="Status…" />
        </Field>
        <Field label="Payment method">
          <SearchableSelect value={form.method} onChange={set('method')} options={methodOptions} placeholder="Method…" />
        </Field>
        <Field label="Check / ACH / Wire reference">
          <Input value={form.reference} onChange={set('reference')} placeholder="Check #1042 or ACH ref…" />
        </Field>
        <Field label="Invoice #"><Input value={form.invoice} onChange={set('invoice')} placeholder="INV-0001" /></Field>
        <Field label="Notes" span={2}><Textarea value={form.notes} onChange={set('notes')} placeholder="Additional notes…" rows={2} /></Field>
      </div>
    </Modal>
  );
}
