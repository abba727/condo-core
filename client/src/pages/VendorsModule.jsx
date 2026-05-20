/**
 * VendorsModule.jsx
 * CondoCore style: Quiet Brutalist Enterprise — warm stone/slate palette,
 * monospaced ledgers, compact status pills, restrained construction-document texture.
 *
 * Exports:
 *   VendorsPage         — list page with project filter, add vendor, assign to project
 *   VendorDetailPage    — detail page with 5 tabs: Profile, Transactions, 1099, Bids, COIs
 *   VENDOR_STORE        — shared mutable vendor state (React context)
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { CSI_GROUPS } from './FinancialsModule.jsx';
import {
  DRIGGS_712_CONTRACTS,
  DRIGGS_712_EXPENSES,
  DRIGGS_712_INSURANCES,
  DRIGGS_712_PERMITS,
  DRIGGS_712_TEAM,
  DRIGGS_712_LOOKUP,
} from '../data/driggs712.js';

/* ─── globals injected by CondoCore.jsx ─────────────────────────────────── */
/* global Icon, Modal, Field, Input, Select, Textarea, PageHead, fmtUSD, Avatar, Stars */

// Current user — will be replaced by auth context when team feature ships
const CURRENT_USER = { id: 'user-priya', name: 'Priya Desai', role: 'Project Director' };

function makeAuditEntry(action, detail = {}) {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    detail,
    performedBy: { ...CURRENT_USER },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================
// Helpers
// ============================================================

// Parse a date string to a Date object for comparison
function parseDateStr(s) {
  if (!s || s === '\u2014' || s === 'Not tracked') return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Is a date string in the past?
function isExpired(s) {
  const d = parseDateStr(s);
  if (!d) return false;
  return d < new Date();
}

// Derive effective COI status — auto-overrides to Expired when past expiry date
function effectiveCoiStatus(coi) {
  if (coi.status === 'Waived' || coi.status === 'Pending') return coi.status;
  if (isExpired(coi.expires)) return 'Expired';
  return coi.status || 'Active';
}

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return String(iso).slice(0, 10);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function vendorInitials(name) {
  return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?';
}

function classifyVendorTrade(name, sourceRole = '') {
  const v = `${name} ${sourceRole}`.toLowerCase();
  if (/architect|design|studio|office of architects/.test(v)) return 'Design';
  if (/engineer|mep|structural|consult|yaker|stroh|wjy/i.test(v)) return 'Engineering';
  if (/insurance|liability|workers|state farm|casulty/.test(v)) return 'Insurance';
  if (/permit|contracting|plumb|mason|sewer|gir(o|ó)n|first choice|trysler/.test(v)) return 'Subcontractor';
  if (/legal|law|counsel/.test(v)) return 'Legal';
  if (/broker|sales|marketing/.test(v)) return 'Brokerage';
  if (/construction|contractor|gc/.test(v)) return 'GC';
  return 'Consulting';
}

function trackerAmt(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return parseFloat(String(value).replace(/[$,]/g, '')) || 0;
}

function trackerDateLabel(iso) {
  if (!iso) return 'Not tracked';
  const d = new Date(iso);
  if (isNaN(d)) return String(iso).slice(0, 10);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================
// Seed vendor map from workbook data
// ============================================================
function buildVendorMap() {
  const map = new Map();
  let seq = 0;

  function coalesce(name, seed = {}) {
    if (!name) return null;
    const key = String(name).trim();
    if (!key) return null;
    const existing = map.get(key) || {
      id: `v-${++seq}`,
      name: key,
      role: seed.role || 'Project contact',
      trade: classifyVendorTrade(key, seed.role),
      status: 'Active',
      rating: 4.2,
      contracts: 0,
      paid: 0,
      contractValue: 0,
      contact: seed.contact || '—',
      email: seed.email || '',
      phone: seed.phone || '',
      address: seed.address || '',
      ein: '',
      notes: '',
      coiExpires: seed.coiExpires || 'Not tracked',
      coiOk: seed.coiOk ?? true,
      init: vendorInitials(key),
      color: seq % 7,
      rawSources: [],
      // project assignment — all seeded vendors are assigned to 712 Driggs
      projectIds: ['driggs-712'],
      // bids array
      bids: [],
      // coi records
      cois: [],
    };
    if (seed.role && existing.role === 'Project contact') existing.role = seed.role;
    if (seed.contact && existing.contact === '—') existing.contact = seed.contact;
    if (seed.email && !existing.email) existing.email = seed.email;
    if (seed.phone && !existing.phone) existing.phone = seed.phone;
    if (seed.trade) existing.trade = seed.trade;
    if (typeof seed.contractValue === 'number') existing.contractValue += seed.contractValue;
    if (typeof seed.paid === 'number') existing.paid += seed.paid;
    if (seed.hasContract) existing.contracts += 1;
    if (seed.coiExpires && existing.coiExpires === 'Not tracked') existing.coiExpires = seed.coiExpires;
    if (seed.coiOk === false) existing.coiOk = false;
    if (existing.contractValue > 0 && existing.paid >= existing.contractValue) existing.status = 'Inactive';
    if (!existing.coiOk) existing.status = 'At risk';
    existing.rawSources.push(seed.raw || {});
    map.set(key, existing);
    return existing;
  }

  DRIGGS_712_CONTRACTS.forEach((row) => {
    const v = coalesce(row.Vendor, {
      role: 'Contracted vendor',
      trade: classifyVendorTrade(row.Vendor, 'contract'),
      contractValue: trackerAmt(row['Contract Total']),
      paid: trackerAmt(row['Total Paid']),
      hasContract: true,
      raw: row,
    });
    if (v) {
      // Seed COI from contract date
      if (row.Date && !v.cois.length) {
        v.cois.push({
          id: `coi-${v.id}-1`,
          type: 'General Liability',
          carrier: 'On file',
          policyNum: '—',
          expires: trackerDateLabel(row.Date),
          status: 'Active',
          amount: '$1,000,000',
        });
      }
    }
  });

  DRIGGS_712_TEAM.forEach((row) => {
    const contactName = String(row.Contact || '').split('|').pop()?.trim() || row.Contact;
    coalesce(row.Company || row.Contact, {
      role: 'Project team',
      contact: contactName,
      email: row.Email,
      trade: classifyVendorTrade(row.Company, 'team'),
      raw: row,
    });
  });

  DRIGGS_712_LOOKUP.forEach((row) => {
    coalesce(row['Company Name'] || row['Company | Name'], {
      role: 'Directory contact',
      contact: row.Name,
      email: row.Email,
      trade: classifyVendorTrade(row['Company Name'], 'directory'),
      raw: row,
    });
  });

  DRIGGS_712_INSURANCES.forEach((row) => {
    const exp = row['General Liability Expiration'] || row['Workers Comp Expiration'];
    const days = row['General Liability Expiration(d)'] ?? row['Workers Comp Expiration (d)'];
    const v = coalesce(row.Company, {
      role: row.Subcontractor ? `${row.Subcontractor} subcontractor` : 'Insurance-tracked subcontractor',
      trade: 'Subcontractor',
      coiExpires: trackerDateLabel(exp),
      coiOk: Number(days ?? 1) >= 0,
      raw: row,
    });
    if (v) {
      // Build COI records from insurance data
      if (row['General Liability Expiration']) {
        v.cois.push({
          id: `coi-gl-${v.id}`,
          type: 'General Liability',
          carrier: row['General Liability'] || 'On file',
          policyNum: '—',
          expires: trackerDateLabel(row['General Liability Expiration']),
          status: Number(row['General Liability Expiration(d)'] ?? 1) >= 0 ? 'Active' : 'Expired',
          amount: '$1,000,000',
        });
      }
      if (row['Workers Comp Expiration']) {
        v.cois.push({
          id: `coi-wc-${v.id}`,
          type: 'Workers Comp',
          carrier: 'On file',
          policyNum: '—',
          expires: trackerDateLabel(row['Workers Comp Expiration']),
          status: Number(row['Workers Comp Expiration (d)'] ?? 1) >= 0 ? 'Active' : 'Expired',
          amount: 'Statutory',
        });
      }
    }
  });

  DRIGGS_712_PERMITS.forEach((row) => {
    const days = row['Number of Days Left'];
    coalesce(row.Contractor, {
      role: `${row['Permit Type'] || 'Permit'} permit contractor`,
      trade: 'Subcontractor',
      contact: row.Contact,
      coiExpires: trackerDateLabel(row.Expiration),
      coiOk: Number(days ?? 1) >= 0,
      raw: row,
    });
  });

  return map;
}

const SEED_MAP = buildVendorMap();
const SEED_VENDORS = Array.from(SEED_MAP.values()).sort(
  (a, b) => b.contractValue - a.contractValue || a.name.localeCompare(b.name)
);

// ============================================================
// Vendor transactions derived from expenses ledger
// ============================================================
function buildVendorTransactions(vendorName) {
  const key = String(vendorName || '').toLowerCase();
  return DRIGGS_712_EXPENSES
    .filter((row) => {
      const v = String(row.Vendor || '').toLowerCase();
      return v && v.includes(key.slice(0, 8));
    })
    .map((row, i) => ({
      id: `txn-${i}`,
      date: fmtDate(row.Date),
      type: row.Type || 'EXP',
      category: row.Category || '—',
      memo: row.Memo || '—',
      debit: trackerAmt(row.Debit),
      credit: trackerAmt(row.Credit),
    }));
}

// ============================================================
// Vendor Store (React Context for shared mutable state)
// ============================================================
const VendorStoreCtx = React.createContext(null);
const STORAGE_KEY_VENDORS = 'cc_vendors_v2';
const STORAGE_KEY_PROJECT_IDS = 'cc_project_vendor_ids_v2';
// Fields that are meaningful to show in the audit log when changed
const AUDITABLE_FIELDS = [
  'name', 'trade', 'role', 'status', 'contact', 'email', 'phone',
  'address', 'ein', 'notes', 'contractValue', 'paid', 'coiExpires', 'coiOk',
  'division', 'defaultDivision',
];
const FIELD_LABELS = {
  name: 'Name', trade: 'Trade', role: 'Role', status: 'Status',
  contact: 'Primary contact', email: 'Email', phone: 'Phone',
  address: 'Address', ein: 'EIN / Tax ID', notes: 'Notes',
  contractValue: 'Contract value', paid: 'Paid to date',
  coiExpires: 'COI expiry', coiOk: 'COI status',
  division: 'Division', defaultDivision: 'Default division',
};
function loadVendors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VENDORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return SEED_VENDORS;
}
function loadProjectIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECT_IDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (_) {}
  return new Set(SEED_VENDORS.map((v) => v.id));
}
export function VendorStoreProvider({ children }) {
  const [vendors, setVendors] = React.useState(() => loadVendors());
  const [projectVendorIds, setProjectVendorIds] = React.useState(() => loadProjectIds());
  // Persist vendors to localStorage whenever they change
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors)); } catch (_) {}
  }, [vendors]);
  // Persist projectVendorIds to localStorage whenever they change
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_PROJECT_IDS, JSON.stringify([...projectVendorIds])); } catch (_) {}
  }, [projectVendorIds]);

  const addVendor = React.useCallback((data) => {
    const newV = {
      id: `v-new-${Date.now()}`,
      name: data.name || 'New Vendor',
      role: data.role || 'Project contact',
      trade: data.trade || 'Consulting',
      status: 'Active',
      rating: 0,
      contracts: 0,
      paid: 0,
      contractValue: 0,
      contact: data.contact || '—',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      ein: data.ein || '',
      notes: data.notes || '',
      coiExpires: 'Not tracked',
      coiOk: true,
      init: vendorInitials(data.name || 'NV'),
      color: vendors.length % 7,
      rawSources: [],
      projectIds: data.assignToProject ? ['driggs-712'] : [],
      bids: [],
      cois: [],
      auditLog: [makeAuditEntry('vendor_added', { name: data.name || 'New Vendor', trade: data.trade || 'Consulting' })],
    };
    setVendors((prev) => [newV, ...prev]);
    if (data.assignToProject) {
      setProjectVendorIds((prev) => new Set([...prev, newV.id]));
    }
    return newV;
  }, [vendors.length]);

  const updateVendor = React.useCallback((id, patch) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      // Build a before/after diff for auditable fields only
      const changes = Object.keys(patch)
        .filter((k) => AUDITABLE_FIELDS.includes(k) && String(v[k] ?? '') !== String(patch[k] ?? ''))
        .map((k) => ({
          field: k,
          label: FIELD_LABELS[k] || k,
          from: v[k] ?? '',
          to: patch[k] ?? '',
        }));
      const entry = makeAuditEntry('vendor_edited', { changes });
      return { ...v, ...patch, auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);

  const updateRating = React.useCallback((vendorId, rating) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('rating_changed', { from: v.rating || 0, to: rating });
      return { ...v, rating, auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);

  const addVendorTransaction = React.useCallback((vendorId, txn) => {
    // Add to vendor's local transaction list
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('transaction_added', { amount: txn.amount, memo: txn.memo, type: txn.type });
      return { ...v, vendorTxns: [...(v.vendorTxns || []), { id: `vtxn-${Date.now()}`, ...txn }], auditLog: [...(v.auditLog || []), entry] };
    }));
    // Also push to shared expense store if available
    const expStore = typeof window !== 'undefined' && window.useExpenseStore ? window.useExpenseStore() : null;
    if (expStore) {
      expStore.addExpense({
        id: `e-vtxn-${Date.now()}`,
        date: txn.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        desc: txn.memo || 'Vendor payment',
        vendor: txn.vendorName || '',
        division: txn.division || 'Uncategorized',
        amount: txn.amount || 0,
        status: txn.status || 'Paid',
        invoice: txn.invoice || `VTX-${Date.now()}`,
        method: txn.method || 'Wire',
        balance: 0,
      });
    }
  }, []);

  const toggleProjectAssignment = React.useCallback((vendorId) => {
    setProjectVendorIds((prev) => {
      const next = new Set(prev);
      if (next.has(vendorId)) next.delete(vendorId);
      else next.add(vendorId);
      return next;
    });
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const assigned = v.projectIds.includes('driggs-712');
      return {
        ...v,
        projectIds: assigned
          ? v.projectIds.filter((p) => p !== 'driggs-712')
          : [...v.projectIds, 'driggs-712'],
      };
    }));
  }, []);

  const addBid = React.useCallback((vendorId, bid) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('bid_added', { scope: bid.scope, amount: bid.amount, status: bid.status });
      return { ...v, bids: [...v.bids, { id: `bid-${Date.now()}`, ...bid }], auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  const updateBid = React.useCallback((vendorId, bidId, patch) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const existing = v.bids.find((b) => b.id === bidId);
      const entry = makeAuditEntry('bid_updated', { scope: existing?.scope || bidId, status: patch.status || existing?.status });
      return { ...v, bids: v.bids.map((b) => b.id === bidId ? { ...b, ...patch } : b), auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  const deleteBid = React.useCallback((vendorId, bidId) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const existing = v.bids.find((b) => b.id === bidId);
      const entry = makeAuditEntry('bid_deleted', { scope: existing?.scope || bidId });
      return { ...v, bids: v.bids.filter((b) => b.id !== bidId), auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  const addCoi = React.useCallback((vendorId, coi) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('coi_added', { type: coi.type, carrier: coi.carrier, expires: coi.expires });
      return { ...v, cois: [...v.cois, { id: `coi-${Date.now()}`, ...coi }], auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  const updateCoi = React.useCallback((vendorId, coiId, patch) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const existing = v.cois.find((c) => c.id === coiId);
      const entry = makeAuditEntry('coi_updated', { type: existing?.type || coiId, status: patch.status || existing?.status });
      return { ...v, cois: v.cois.map((c) => c.id === coiId ? { ...c, ...patch } : c), auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  const deleteCoi = React.useCallback((vendorId, coiId) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const existing = v.cois.find((c) => c.id === coiId);
      const entry = makeAuditEntry('coi_deleted', { type: existing?.type || coiId });
      return { ...v, cois: v.cois.filter((c) => c.id !== coiId), auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);

  // Soft-delete: marks vendor as archived, preserving all linked data
  const archiveVendor = React.useCallback((vendorId) => {
    const archivedAt = new Date().toISOString();
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('vendor_archived', { archivedAt });
      return { ...v, archived: true, archivedAt, auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
   // Restore a previously archived vendor
  const restoreVendor = React.useCallback((vendorId) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('vendor_restored', {});
      return { ...v, archived: false, archivedAt: null, auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  // Log a document upload event to the audit trail
  const addDocumentAudit = React.useCallback((vendorId, fileName) => {
    setVendors((prev) => prev.map((v) => {
      if (v.id !== vendorId) return v;
      const entry = makeAuditEntry('document_uploaded', { name: fileName });
      return { ...v, auditLog: [...(v.auditLog || []), entry] };
    }));
  }, []);
  return (
    <VendorStoreCtx.Provider value={{
      vendors,
      projectVendorIds,
      addVendor,
      updateVendor,
      updateRating,
      addVendorTransaction,
      toggleProjectAssignment,
      addBid,
      updateBid,
      deleteBid,
      addCoi,
      updateCoi,
      deleteCoi,
      archiveVendor,
      restoreVendor,
      addDocumentAudit,
    }}>
      {children}
    </VendorStoreCtx.Provider>
  );
}

export function useVendorStore() {
  return React.useContext(VendorStoreCtx);
}

// ============================================================
// Add / Edit Vendor Modal
// ============================================================
const TRADE_OPTIONS = ['GC', 'Design', 'Engineering', 'Subcontractor', 'Consulting', 'Legal', 'Insurance', 'Brokerage'];
const STATUS_OPTIONS = ['Active', 'Inactive', 'At risk', 'Prospect'];
const DIVISION_OPTIONS = [
  'Soft Costs', 'General Condition', 'Foundation Site Work', 'Superstructure',
  'Masonry and Stucco', 'Carpentry', 'Roof', 'Windows and Storefront',
  'Electric', 'HVAC', 'Plumbing and Sprinkler', 'Elevator',
  'Kitchen, Bathrooms and Fixtures', 'Miscellaneous Site Work',
  'Equipment and Miscellaneous', 'Land Costs', 'Overhead & Profit', 'Contingencies',
];

function VendorModal({ open, vendor, onClose, onSave }) {
  const [form, setForm] = React.useState({});

  React.useEffect(() => {
    if (open) {
      setForm(vendor ? { ...vendor } : {
        name: '', trade: 'Consulting', role: '', contact: '', email: '',
        phone: '', address: '', ein: '', notes: '', status: 'Active',
        division: 'Soft Costs',
        assignToProject: true,
      });
    }
  }, [open, vendor]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const isEdit = !!vendor;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit vendor — ${vendor.name}` : 'Add new vendor'}
      subtitle={isEdit ? `${vendor.trade} · ${vendor.role}` : 'Add a vendor to the workspace'}
      width={680}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => { if (form.name?.trim()) { onSave(form); onClose(); } }}
          >
            {isEdit ? 'Save changes' : 'Add vendor'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Company / vendor name" span={2}>
          <Input value={form.name} onChange={set('name')} placeholder="Apex Building Group" />
        </Field>
        <Field label="Trade">
          <Select value={form.trade} onChange={set('trade')} options={TRADE_OPTIONS.map((t) => ({ value: t, label: t }))} />
        </Field>
        <Field label="Role / description">
          <Input value={form.role} onChange={set('role')} placeholder="General contractor" />
        </Field>
        <Field label="Primary contact">
          <Input value={form.contact} onChange={set('contact')} placeholder="John Smith" />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={set('email')} placeholder="contact@vendor.com" type="email" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={set('phone')} placeholder="(718) 555-0100" />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')} options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
        </Field>
        <Field label="Address" span={2}>
          <Input value={form.address} onChange={set('address')} placeholder="123 Main St, Brooklyn, NY 11201" />
        </Field>
        <Field label="EIN / Tax ID">
          <Input value={form.ein} onChange={set('ein')} placeholder="12-3456789" />
        </Field>
        <Field label="Default division (for expenses)">
          <Select
            value={form.division || 'Soft Costs'}
            onChange={set('division')}
            options={DIVISION_OPTIONS.map((d) => ({ value: d, label: d }))}
          />
        </Field>
        {!isEdit && (
          <Field label="Assign to active project">
            <div className="row" style={{ gap: 10, paddingTop: 6 }}>
              <input
                type="checkbox"
                id="assign-project-cb"
                checked={!!form.assignToProject}
                onChange={(e) => set('assignToProject')(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="assign-project-cb" style={{ fontSize: 13, cursor: 'pointer' }}>
                712 Driggs Condominium
              </label>
            </div>
          </Field>
        )}
        <Field label="Notes" span={2}>
          <Textarea value={form.notes} onChange={set('notes')} placeholder="Contract scope, payment terms, performance notes…" rows={3} />
        </Field>
      </div>
    </Modal>
  );
}

// ============================================================
// VendorsPage — list with project filter + add/assign
// ============================================================
const TRADE_FILTERS = ['All', 'GC', 'Design', 'Engineering', 'Subcontractor', 'Consulting', 'Legal', 'Insurance', 'Brokerage'];

export function VendorsPage({ onViewVendor }) {
  const store = useVendorStore();
  const [trade, setTrade] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState('table');
  const [projectOnly, setProjectOnly] = React.useState(true);
   const [showArchived, setShowArchived] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editVendor, setEditVendor] = React.useState(null);
  const vendors = store?.vendors || [];
  const projectVendorIds = store?.projectVendorIds || new Set();
  const archivedCount = vendors.filter((v) => v.archived).length;
  // When showArchived is true, show ONLY archived vendors (separate view)
  // When false, show only active (non-archived) vendors
  const activeVendors = showArchived
    ? vendors.filter((v) => v.archived)
    : vendors.filter((v) => !v.archived);
  const base = (!showArchived && projectOnly)
    ? activeVendors.filter((v) => projectVendorIds.has(v.id))
    : activeVendors;

  const filtered = base.filter((v) =>
    (trade === 'All' || v.trade === trade) &&
    (!search || v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.contact || '').toLowerCase().includes(search.toLowerCase()))
  );

  const totalCommitted = base.reduce((s, v) => s + v.contractValue, 0);
  const totalPaid = base.reduce((s, v) => s + v.paid, 0);
  const coiAlerts = base.filter((v) => !v.coiOk).length;
  const projectCount = projectVendorIds.size;

  const handleSaveNew = (form) => {
    store?.addVendor(form);
  };

  const handleSaveEdit = (form) => {
    store?.updateVendor(editVendor.id, form);
    setEditVendor(null);
  };

  const statusCls = (s) => s === 'Active' ? 'pos' : s === 'At risk' ? 'warn' : 'neutral';

  return (
    <>
      <PageHead
        eyebrow="Vendors"
        title="Vendor & contractor records"
        sub="Trade contacts, contract value, payment history, COI tracking, performance ratings."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="download" size={13} /> Export</button>
            <button className="btn btn-secondary" onClick={() => {
              // Generate a simple 1099 summary for all vendors with payments > $600
              const eligible = vendors.filter((v) => v.paid >= 600);
              alert(`1099-NEC prep: ${eligible.length} vendor(s) with $600+ in payments.\n\n${eligible.map((v) => `${v.name}: ${fmtUSD ? fmtUSD(v.paid) : '$' + v.paid.toLocaleString()}`).join('\n')}`);
            }}><Icon name="doc" size={13} /> 1099 prep</button>
            <button className="btn btn-primary" onClick={() => setAddOpen(true)}><Icon name="plus" size={13} /> Add vendor</button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid-kpis" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric">
          <div className="metric-label">Project vendors</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{projectCount}</div>
          <div className="metric-foot"><span>{vendors.length} total in workspace</span></div>
        </div>
        <div className="metric">
          <div className="metric-label">Committed value</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
            {typeof fmtUSD === 'function' ? fmtUSD(totalCommitted, { compact: true }) : '$' + Math.round(totalCommitted / 1000) + 'K'}
          </div>
          <div className="metric-foot"><span>{base.filter((v) => v.contracts > 0).length} contracts</span></div>
        </div>
        <div className="metric">
          <div className="metric-label">Paid to date</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
            {typeof fmtUSD === 'function' ? fmtUSD(totalPaid, { compact: true }) : '$' + Math.round(totalPaid / 1000) + 'K'}
          </div>
          <div className="metric-foot">
            <span>{totalCommitted > 0 ? Math.round(totalPaid / totalCommitted * 100) : 0}% of committed</span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">COI alerts</div>
          <div className="mono" style={{
            fontSize: 22, fontWeight: 600, marginTop: 4,
            color: coiAlerts > 0 ? 'var(--signal-warn)' : 'var(--signal-pos)',
          }}>{coiAlerts}</div>
          <div className="metric-foot"><span>Insurance expired or expiring</span></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {/* Toolbar */}
        <div className="card-head" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="row" style={{ gap: 10, flex: 1, flexWrap: 'wrap' }}>
            {/* Project filter toggle */}
            <button
              className={`btn btn-sm ${projectOnly ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setProjectOnly((p) => !p)}
              title={projectOnly ? 'Showing project vendors only — click to show all' : 'Showing all vendors — click to filter by project'}
            >
              <Icon name="building" size={12} />
              {projectOnly ? '712 Driggs only' : 'All vendors'}
            </button>

            {/* Archived view toggle — only shown when there are archived vendors */}
            {archivedCount > 0 && (
              <button
                className={`btn btn-sm ${showArchived ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setShowArchived((p) => !p)}
                title={showArchived ? 'Back to active vendors' : `View ${archivedCount} archived vendor${archivedCount !== 1 ? 's' : ''}`}
                style={showArchived ? { color: 'var(--signal-neg)' } : { color: 'var(--text-muted)' }}
              >
                <Icon name="folder" size={12} />
                {showArchived ? '← Active vendors' : `${archivedCount} archived`}
              </button>
            )}

            <label className="topbar-search" style={{ width: 240, margin: 0 }}>
              <Icon name="search" size={13} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vendors, contacts…"
                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%', outline: 'none', fontSize: 13 }}
              />
            </label>

            <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
              {TRADE_FILTERS.map((t) => (
                <button
                  key={t}
                  className={`chip ${trade === t ? 'active' : ''}`}
                  onClick={() => setTrade(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="card-actions">
            <div className="seg">
              <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
              <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>Cards</button>
            </div>
          </div>
        </div>

        {/* Table view */}
        {view === 'table' && (
          <div className="card-body-flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Trade</th>
                  <th>Status</th>
                  <th className="num">Contract value</th>
                  <th>Paid</th>
                  <th>COI</th>
                  <th>Rating</th>
                  <th>Project</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-faint)', fontSize: 13 }}>
                    No vendors match the current filters.
                  </td></tr>
                )}
                {filtered.map((v) => {
                  const paidPct = v.contractValue > 0 ? Math.round((v.paid / v.contractValue) * 100) : 0;
                  const isAssigned = projectVendorIds.has(v.id);
                  return (
                    <tr
                      key={v.id}
                      style={{ cursor: 'pointer', opacity: v.archived ? 0.55 : 1 }}
                      onClick={() => onViewVendor?.(v.id)}
                    >
                      <td>
                        <div className="row" style={{ gap: 10 }}>
                          <VendorAvatar init={v.init} color={v.color} size={32} />
                          <div>
                            <div style={{ fontWeight: 500, textDecoration: v.archived ? 'line-through' : 'none' }}>
                              {v.name}
                              {v.archived && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-faint)', textDecoration: 'none', display: 'inline-block' }}>ARCHIVED</span>}
                            </div>
                            <div className="faint" style={{ fontSize: 11 }}>{v.role} · {v.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="pill neutral no-dot">{v.trade}</span></td>
                      <td>
                        <span className={`pill no-dot ${statusCls(v.status)}`}>{v.status}</span>
                      </td>
                      <td className="num mono">{v.contractValue > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(v.contractValue, { compact: true }) : '$' + Math.round(v.contractValue / 1000) + 'K') : '—'}</td>
                      <td style={{ minWidth: 130 }}>
                        {v.contractValue > 0 ? (
                          <>
                            <div className="row-between" style={{ fontSize: 11, marginBottom: 3 }}>
                              <span className="mono">{typeof fmtUSD === 'function' ? fmtUSD(v.paid, { compact: true }) : '$' + Math.round(v.paid / 1000) + 'K'}</span>
                              <span className="faint">{paidPct}%</span>
                            </div>
                            <div className="bar" style={{ height: 4 }}>
                              <div className="bar-fill accent" style={{ width: `${paidPct}%` }} />
                            </div>
                          </>
                        ) : <span className="faint">—</span>}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          {v.coiOk
                            ? <Icon name="check" size={13} style={{ color: 'var(--signal-pos)' }} />
                            : <Icon name="alert" size={13} style={{ color: 'var(--signal-warn)' }} />}
                          <span className="muted" style={{ fontSize: 11 }}>{v.coiExpires}</span>
                        </div>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 4, alignItems: 'center' }}>
                          <span className="mono" style={{ fontWeight: 500 }}>{v.rating || '—'}</span>
                          {v.rating > 0 && <VendorStars value={v.rating} />}
                        </div>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${isAssigned ? 'btn-secondary' : 'btn-ghost'}`}
                          style={{ fontSize: 11, padding: '3px 8px' }}
                          title={isAssigned ? 'Remove from 712 Driggs' : 'Assign to 712 Driggs'}
                          onClick={(e) => { e.stopPropagation(); store?.toggleProjectAssignment(v.id); }}
                        >
                          {isAssigned ? <><Icon name="check" size={11} /> Assigned</> : <><Icon name="plus" size={11} /> Assign</>}
                        </button>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
                          {v.archived ? (
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Restore vendor"
                              style={{ fontSize: 11, padding: '3px 8px', color: 'var(--cc-accent)' }}
                              onClick={(e) => { e.stopPropagation(); store?.restoreVendor(v.id); }}
                            >
                              <Icon name="refresh" size={11} /> Restore
                            </button>
                          ) : (
                            <button
                              className="iconbtn"
                              title="Edit vendor"
                              onClick={(e) => { e.stopPropagation(); setEditVendor(v); }}
                            >
                              <Icon name="edit" size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Cards view */}
        {view === 'cards' && (
          <div className="card-body" style={{ padding: 16 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-faint)', fontSize: 13 }}>
                No vendors match the current filters.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {filtered.map((v) => {
                const isAssigned = projectVendorIds.has(v.id);
                return (
                  <div
                    key={v.id}
                    className="vendor-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onViewVendor?.(v.id)}
                  >
                    <div className="row" style={{ gap: 12, marginBottom: 12 }}>
                      <VendorAvatar init={v.init} color={v.color} size={40} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</div>
                        <div className="faint" style={{ fontSize: 11 }}>{v.role}</div>
                      </div>
                      <button
                        className="iconbtn"
                        title="Edit"
                        onClick={(e) => { e.stopPropagation(); setEditVendor(v); }}
                      >
                        <Icon name="edit" size={13} />
                      </button>
                    </div>
                    <div className="row" style={{ gap: 6, marginBottom: 10 }}>
                      <span className="pill neutral no-dot">{v.trade}</span>
                      <span className={`pill no-dot ${statusCls(v.status)}`}>{v.status}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
                    <div className="row-between" style={{ marginBottom: 6 }}>
                      <span className="muted" style={{ fontSize: 11 }}>Contract</span>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>
                        {v.contractValue > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(v.contractValue, { compact: true }) : '$' + Math.round(v.contractValue / 1000) + 'K') : '—'}
                      </span>
                    </div>
                    <div className="row-between" style={{ marginBottom: 10 }}>
                      <span className="muted" style={{ fontSize: 11 }}>Paid</span>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>
                        {typeof fmtUSD === 'function' ? fmtUSD(v.paid, { compact: true }) : '$' + Math.round(v.paid / 1000) + 'K'}
                      </span>
                    </div>
                    <button
                      className={`btn btn-sm ${isAssigned ? 'btn-secondary' : 'btn-ghost'} w-full`}
                      style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
                      onClick={(e) => { e.stopPropagation(); store?.toggleProjectAssignment(v.id); }}
                    >
                      {isAssigned ? <><Icon name="check" size={11} /> Assigned to 712 Driggs</> : <><Icon name="plus" size={11} /> Assign to project</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add vendor modal */}
      <VendorModal open={addOpen} vendor={null} onClose={() => setAddOpen(false)} onSave={handleSaveNew} />

      {/* Edit vendor modal */}
      <VendorModal open={!!editVendor} vendor={editVendor} onClose={() => setEditVendor(null)} onSave={handleSaveEdit} />
    </>
  );
}

// ============================================================
// Vendor Detail Page — 5 tabs
// ============================================================
const DETAIL_TABS = [
  { id: 'profile', label: 'Profile', icon: 'users' },
  { id: 'transactions', label: 'Transactions', icon: 'dollar' },
  { id: '1099', label: '1099', icon: 'doc' },
  { id: 'bids', label: 'Bids & Contracts', icon: 'list' },
  { id: 'cois', label: 'COIs', icon: 'shield' },
  { id: 'documents', label: 'Documents', icon: 'folder' },
  { id: 'activity', label: 'Activity', icon: 'clock' },
];

export function VendorDetailPage({ vendorId, onBack }) {
  const store = useVendorStore();
  const [tab, setTab] = React.useState('profile');
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const vendor = store?.vendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-faint)' }}>
        Vendor not found.{' '}
        <button className="btn btn-ghost" onClick={onBack}>← Back to vendors</button>
      </div>
    );
  }

  const isAssigned = store?.projectVendorIds.has(vendor.id);
  const statusCls = vendor.status === 'Active' ? 'pos' : vendor.status === 'At risk' ? 'warn' : 'neutral';

  // Derive COI status from actual COI records (respects expiry dates)
  const derivedCoiStatus = React.useMemo(() => {
    if (!vendor.cois || vendor.cois.length === 0) {
      return { label: 'Not tracked', ok: null, icon: 'neutral', expires: vendor.coiExpires || 'Not tracked' };
    }
    const statuses = vendor.cois.map((c) => effectiveCoiStatus(c));
    const hasExpired = statuses.includes('Expired');
    const hasPending = statuses.includes('Pending');
    const allWaived = statuses.every((s) => s === 'Waived');
    // Earliest expiry date among non-waived COIs
    const expiries = vendor.cois
      .filter((c) => c.expires && c.status !== 'Waived')
      .map((c) => parseDateStr(c.expires))
      .filter(Boolean)
      .sort((a, b) => a - b);
    const earliestExpiry = expiries.length > 0
      ? expiries[0].toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      : 'Not tracked';
    if (hasExpired) return { label: 'Expired', ok: false, icon: 'neg', expires: earliestExpiry };
    if (hasPending) return { label: 'Pending', ok: false, icon: 'warn', expires: earliestExpiry };
    if (allWaived) return { label: 'Waived', ok: true, icon: 'neutral', expires: 'Waived' };
    return { label: 'Current', ok: true, icon: 'pos', expires: earliestExpiry };
  }, [vendor.cois, vendor.coiExpires]);

  const handleSaveEdit = (form) => {
    store?.updateVendor(vendor.id, form);
    setEditOpen(false);
  };

  const handleConfirmDelete = () => {
    store?.archiveVendor(vendor.id);
    setDeleteConfirmOpen(false);
    onBack();
  };

  return (
    <>
      {/* Delete confirmation overlay — rendered via portal to escape stacking contexts */}
      {deleteConfirmOpen && ReactDOM.createPortal(
        <div
          className="modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => setDeleteConfirmOpen(false)}
        >
          <div
            className="modal"
            style={{ maxWidth: 440 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--signal-neg-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon name="trash" size={16} style={{ color: 'var(--signal-neg)' }} />
                </div>
                <div>
                  <div className="modal-title">Archive vendor?</div>
                  <div className="modal-sub">{vendor.name}</div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>
                This vendor will be <strong style={{ color: 'var(--text)' }}>archived</strong>, not permanently deleted.
                All linked transactions, documents, bids, and COIs are preserved and remain searchable.
                The vendor will no longer appear in the active vendor list.
              </p>
            </div>
            <div className="modal-foot">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  background: 'var(--signal-neg)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                }}
                onClick={handleConfirmDelete}
              >
                <Icon name="trash" size={13} /> Archive vendor
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Back nav + header */}
      <div style={{ marginBottom: 4 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onBack}
          style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}
        >
          <Icon name="chevronRight" size={12} style={{ transform: 'rotate(180deg)' }} /> Back to vendors
        </button>
      </div>

      {/* Archived notice banner */}
      {vendor.archived && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(220,38,38,0.07)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 13,
        }}>
          <Icon name="alert" size={14} style={{ color: 'var(--signal-neg)', flexShrink: 0 }} />
          <span style={{ flex: 1, color: 'var(--text-muted)' }}>
            This vendor has been <strong>archived</strong>. All historical data is preserved.
            {vendor.archivedAt && (
              <> Archived on {new Date(vendor.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.</>
            )}
          </span>
          <button
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--cc-accent)', flexShrink: 0 }}
            onClick={() => store?.restoreVendor(vendor.id)}
          >
            <Icon name="refresh" size={12} /> Restore vendor
          </button>
        </div>
      )}

      <div className="vendor-detail-header">
        <VendorAvatar init={vendor.init} color={vendor.color} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{vendor.name}</h1>
            <span className={`pill no-dot ${statusCls}`}>{vendor.status}</span>
            <span className="pill neutral no-dot">{vendor.trade}</span>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {vendor.role}
            {vendor.contact && vendor.contact !== '—' && ` · ${vendor.contact}`}
            {vendor.email && <> · <a href={`mailto:${vendor.email}`} style={{ color: 'var(--cc-accent)' }}>{vendor.email}</a></>}
            {vendor.phone && ` · ${vendor.phone}`}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button
            className={`btn btn-sm ${isAssigned ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => store?.toggleProjectAssignment(vendor.id)}
          >
            {isAssigned ? <><Icon name="check" size={12} /> Assigned to project</> : <><Icon name="plus" size={12} /> Assign to project</>}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setEditOpen(true)}>
            <Icon name="edit" size={12} /> Edit vendor
          </button>
          <button
            className="btn btn-sm btn-ghost"
            title="Delete vendor"
            onClick={() => setDeleteConfirmOpen(true)}
            style={{ color: 'var(--signal-neg)', borderColor: 'var(--signal-neg)' }}
          >
            <Icon name="trash" size={12} /> Delete
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid-kpis" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 16, marginBottom: 0 }}>
        <div className="metric">
          <div className="metric-label">Contract value</div>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
            {vendor.contractValue > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(vendor.contractValue) : '$' + vendor.contractValue.toLocaleString()) : '—'}
          </div>
          <div className="metric-foot"><span>{vendor.contracts} contract{vendor.contracts !== 1 ? 's' : ''}</span></div>
        </div>
        <div className="metric">
          <div className="metric-label">Paid to date</div>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
            {typeof fmtUSD === 'function' ? fmtUSD(vendor.paid) : '$' + vendor.paid.toLocaleString()}
          </div>
          <div className="metric-foot">
            <span>{vendor.contractValue > 0 ? Math.round(vendor.paid / vendor.contractValue * 100) : 0}% of contract</span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">COI status</div>
          <div className="row" style={{ gap: 6, marginTop: 6, alignItems: 'center' }}>
            {derivedCoiStatus.icon === 'pos' && <Icon name="check" size={16} style={{ color: 'var(--signal-pos)' }} />}
            {derivedCoiStatus.icon === 'neg' && <Icon name="alert" size={16} style={{ color: 'var(--signal-neg)' }} />}
            {derivedCoiStatus.icon === 'warn' && <Icon name="alert" size={16} style={{ color: 'var(--signal-warn)' }} />}
            {derivedCoiStatus.icon === 'neutral' && <Icon name="shield" size={16} style={{ color: 'var(--text-faint)' }} />}
            <span className="mono" style={{
              fontSize: 14,
              fontWeight: 600,
              color: derivedCoiStatus.icon === 'neg' ? 'var(--signal-neg)'
                : derivedCoiStatus.icon === 'warn' ? 'var(--signal-warn)'
                : derivedCoiStatus.icon === 'pos' ? 'var(--signal-pos)'
                : 'inherit'
            }}>{derivedCoiStatus.label}</span>
          </div>
          <div className="metric-foot"><span>Expires {derivedCoiStatus.expires}</span></div>
        </div>
        <div className="metric">
          <div className="metric-label">Rating</div>
          <div className="row" style={{ gap: 6, marginTop: 6, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{vendor.rating || '—'}</span>
            {vendor.rating > 0 && <VendorStars value={vendor.rating} />}
          </div>
          <div className="metric-foot"><span>{vendor.bids.length} bid{vendor.bids.length !== 1 ? 's' : ''} on record</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="vendor-detail-tabs">
        {DETAIL_TABS.map((t) => (
          <button
            key={t.id}
            className={`vendor-detail-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 16 }}>
        {tab === 'profile' && (
          <VendorProfileTab
            vendor={vendor}
            onEdit={() => setEditOpen(true)}
            onUpdateRating={(rating) => store?.updateRating(vendor.id, rating)}
          />
        )}
        {tab === 'transactions' && (
          <VendorTransactionsTab
            vendor={vendor}
            onAddTransaction={(txn) => store?.addVendorTransaction(vendor.id, txn)}
          />
        )}
        {tab === '1099' && <Vendor1099Tab vendor={vendor} />}
        {tab === 'bids' && <VendorBidsTab vendor={vendor} store={store} />}
        {tab === 'cois' && <VendorCoisTab vendor={vendor} store={store} />}
        {tab === 'documents' && <VendorDocumentsTab vendor={vendor} store={store} />}
        {tab === 'activity' && <VendorActivityTab vendor={vendor} />}
      </div>

      <VendorModal open={editOpen} vendor={vendor} onClose={() => setEditOpen(false)} onSave={handleSaveEdit} />
    </>
  );
}

// ── Profile Tab ──────────────────────────────────────────────
function VendorProfileTab({ vendor, onEdit, onUpdateRating }) {
  const row = (label, value) => (
    <div className="vendor-profile-row" key={label}>
      <span className="vendor-profile-label">{label}</span>
      <span className="vendor-profile-value">{value || '—'}</span>
    </div>
  );

  const [hoverRating, setHoverRating] = React.useState(0);
  const currentRating = vendor.rating || 0;

  return (
    <div className="row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div className="card" style={{ flex: '1 1 340px' }}>
        <div className="card-head">
          <span style={{ fontWeight: 600, fontSize: 13 }}>Contact information</span>
          <button className="btn btn-ghost btn-sm" onClick={onEdit}><Icon name="edit" size={12} /> Edit</button>
        </div>
        <div className="card-body" style={{ padding: '0 16px 16px' }}>
          {row('Company name', vendor.name)}
          {row('Trade', vendor.trade)}
          {row('Role', vendor.role)}
          {row('Primary contact', vendor.contact)}
          {row('Email', vendor.email ? <a href={`mailto:${vendor.email}`} style={{ color: 'var(--cc-accent)' }}>{vendor.email}</a> : null)}
          {row('Phone', vendor.phone)}
          {row('Address', vendor.address)}
          {row('EIN / Tax ID', vendor.ein)}
          {row('Default division', vendor.division || '—')}
          {row('Status', <span className={`pill no-dot ${vendor.status === 'Active' ? 'pos' : vendor.status === 'At risk' ? 'warn' : 'neutral'}`}>{vendor.status}</span>)}
        </div>
      </div>

      <div className="card" style={{ flex: '1 1 280px' }}>
        <div className="card-head">
          <span style={{ fontWeight: 600, fontSize: 13 }}>Contract summary</span>
        </div>
        <div className="card-body" style={{ padding: '0 16px 16px' }}>
          {row('Contract value', vendor.contractValue > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(vendor.contractValue) : '$' + vendor.contractValue.toLocaleString()) : '—')}
          {row('Total paid', typeof fmtUSD === 'function' ? fmtUSD(vendor.paid) : '$' + vendor.paid.toLocaleString())}
          {row('Remaining', vendor.contractValue > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(vendor.contractValue - vendor.paid) : '$' + (vendor.contractValue - vendor.paid).toLocaleString()) : '—')}
          {row('Contracts', String(vendor.contracts))}
          {row('COI expires', vendor.coiExpires)}
          {row('COI status', vendor.coiOk ? <span className="pill pos no-dot">Current</span> : <span className="pill warn no-dot">Alert</span>)}
        </div>
        {/* Rating editor */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 16px' }} />
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: 8 }}>Performance rating</div>
          <div className="row" style={{ gap: 4, alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => onUpdateRating && onUpdateRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px',
                  fontSize: 20,
                  color: i <= (hoverRating || currentRating) ? 'var(--signal-warn)' : 'var(--border-strong)',
                  transition: 'color 0.1s',
                  lineHeight: 1,
                }}
                title={`Rate ${i} star${i !== 1 ? 's' : ''}`}
              >★</button>
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
              {currentRating > 0 ? `${currentRating.toFixed(1)} / 5.0` : 'Not rated'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Click a star to update the rating</div>
        </div>
        {vendor.notes && (
          <>
            <div style={{ borderTop: '1px solid var(--border)', margin: '0 16px' }} />
            <div className="card-body" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{vendor.notes}</div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

// ── Transactions Tab ─────────────────────────────────────────
function AddTransactionModal({ open, vendor, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) setForm({
      date: today,
      type: 'Wire',
      division: vendor.division || 'Soft Costs',
      memo: '',
      amount: '',
      status: 'Paid',
      invoice: '',
    });
  }, [open, vendor.division, today]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSave = () => {
    if (!form.amount || isNaN(parseFloat(form.amount))) return;
    onSave({ ...form, amount: parseFloat(form.amount), vendorName: vendor.name });
  };
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span>Add transaction</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="Date">
              <Input type="date" value={form.date} onChange={set('date')} />
            </Field>
            <Field label="Payment method">
              <Select value={form.type} onChange={set('type')}
                options={['Wire','ACH','Check','Credit','Card'].map((v) => ({ value: v, label: v }))} />
            </Field>
            <Field label="Division / Category">
              <Select value={form.division} onChange={set('division')}
                options={DIVISION_OPTIONS.map((d) => ({ value: d, label: d }))} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={set('status')}
                options={['Pending','Approved','Paid'].map((v) => ({ value: v, label: v }))} />
            </Field>
            <Field label="Amount ($)" span={2}>
              <Input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" />
            </Field>
            <Field label="Memo / description" span={2}>
              <Input value={form.memo} onChange={set('memo')} placeholder="Payment description" />
            </Field>
            <Field label="Invoice #">
              <Input value={form.invoice} onChange={set('invoice')} placeholder="INV-001" />
            </Field>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Add transaction</button>
        </div>
      </div>
    </div>
  );
}

function VendorTransactionsTab({ vendor, onAddTransaction }) {
  const seedTxns = React.useMemo(() => buildVendorTransactions(vendor.name), [vendor.name]);
  const vendorTxns = (vendor.vendorTxns || []).map((t) => ({
    id: t.id,
    date: t.date,
    type: t.type || 'Wire',
    category: t.division || 'Uncategorized',
    memo: t.memo || '',
    debit: t.amount > 0 ? t.amount : 0,
    credit: t.amount < 0 ? Math.abs(t.amount) : 0,
    isManual: true,
  }));
  const allTxns = [...vendorTxns, ...seedTxns];
  const totalDebit = allTxns.reduce((s, t) => s + t.debit, 0);
  const totalCredit = allTxns.reduce((s, t) => s + t.credit, 0);
  const [showAdd, setShowAdd] = React.useState(false);

  const handleSave = (txn) => {
    onAddTransaction && onAddTransaction(txn);
    setShowAdd(false);
  };

  return (
    <>
      <AddTransactionModal open={showAdd} vendor={vendor} onClose={() => setShowAdd(false)} onSave={handleSave} />
      <div className="card">
        <div className="card-head">
          <span style={{ fontWeight: 600, fontSize: 13 }}>Transaction history</span>
          <div className="row" style={{ gap: 12 }}>
            <span className="muted" style={{ fontSize: 12 }}>
              Total paid: <strong className="mono">{typeof fmtUSD === 'function' ? fmtUSD(totalDebit) : '$' + totalDebit.toLocaleString()}</strong>
            </span>
            {totalCredit > 0 && (
              <span className="muted" style={{ fontSize: 12 }}>
                Credits: <strong className="mono">{typeof fmtUSD === 'function' ? fmtUSD(totalCredit) : '$' + totalCredit.toLocaleString()}</strong>
              </span>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add transaction</button>
          </div>
        </div>
        <div className="card-body-flush">
          {allTxns.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
              No transactions found. Click "+ Add transaction" to record a payment.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Memo</th>
                  <th className="num">Debit</th>
                  <th className="num">Credit</th>
                </tr>
              </thead>
              <tbody>
                {allTxns.map((t) => (
                  <tr key={t.id} style={t.isManual ? { background: 'var(--surface-raised)' } : {}}>
                    <td className="mono muted" style={{ fontSize: 12 }}>{t.date}</td>
                    <td><span className="pill neutral no-dot" style={{ fontSize: 10 }}>{t.type}</span></td>
                    <td className="muted" style={{ fontSize: 12 }}>{t.category}</td>
                    <td style={{ fontSize: 13 }}>{t.memo}</td>
                    <td className="num mono" style={{ color: t.debit > 0 ? 'var(--signal-neg)' : 'inherit' }}>
                      {t.debit > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(t.debit) : '$' + t.debit.toLocaleString()) : '—'}
                    </td>
                    <td className="num mono" style={{ color: t.credit > 0 ? 'var(--signal-pos)' : 'inherit' }}>
                      {t.credit > 0 ? (typeof fmtUSD === 'function' ? fmtUSD(t.credit) : '$' + t.credit.toLocaleString()) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ── 1099 Tab ─────────────────────────────────────────────────
function Vendor1099Tab({ vendor }) {
  const currentYear = new Date().getFullYear() - 1; // prior tax year
  const [taxYear, setTaxYear] = React.useState(String(currentYear));
  const [printed, setPrinted] = React.useState(false);

  // Filter transactions by selected tax year
  const allTransactions = React.useMemo(() => {
    // Gather all wire/expense transactions from seed data for this vendor
    const txns = [];
    DRIGGS_712_EXPENSES.forEach((row) => {
      const vendorName = String(row.Vendor || row['Paid To'] || row.Payee || '');
      if (vendorName.toLowerCase().includes(vendor.name.toLowerCase().slice(0, 8))) {
        const d = new Date(row.Date || row.date || '');
        if (!isNaN(d.getTime())) {
          txns.push({ date: d, amount: trackerAmt(row.Amount || row.Debit || row.amount || 0) });
        }
      }
    });
    // Also include contract payments from DRIGGS_712_CONTRACTS
    DRIGGS_712_CONTRACTS.forEach((row) => {
      const vendorName = String(row.Vendor || '');
      if (vendorName.toLowerCase().includes(vendor.name.toLowerCase().slice(0, 8))) {
        const d = new Date(row.Date || '');
        if (!isNaN(d.getTime())) {
          txns.push({ date: d, amount: trackerAmt(row['Total Paid'] || 0) });
        }
      }
    });
    return txns;
  }, [vendor.name]);

  const totalPayments = React.useMemo(() => {
    const yr = parseInt(taxYear, 10);
    const filtered = allTransactions.filter((t) => t.date.getFullYear() === yr);
    // If no transactions found for the year, fall back to vendor.paid for current year
    if (filtered.length === 0 && yr === currentYear) return vendor.paid;
    return filtered.reduce((s, t) => s + t.amount, 0);
  }, [allTransactions, taxYear, currentYear, vendor.paid]);

  const eligible = totalPayments >= 600;

  const handlePrint = () => {
    setPrinted(true);
    const content = `
1099-NEC — ${taxYear} Tax Year
================================
PAYER: 712 Driggs Condominium LLC
       712 Driggs Avenue, Brooklyn, NY 11211
       EIN: 83-XXXXXXX

RECIPIENT: ${vendor.name}
           ${vendor.address || 'Address not on file'}
           EIN/SSN: ${vendor.ein || 'Not on file'}

Box 1 — Nonemployee compensation: ${typeof fmtUSD === 'function' ? fmtUSD(totalPayments) : '$' + totalPayments.toLocaleString()}

Prepared by CondoCore on ${new Date().toLocaleDateString()}
================================
NOTE: This is a summary for review only. File the official IRS Form 1099-NEC.
    `.trim();
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<pre style="font-family:monospace;padding:40px;font-size:14px;">${content}</pre>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="card">
        <div className="card-head">
          <span style={{ fontWeight: 600, fontSize: 13 }}>1099-NEC Summary</span>
          <div className="row" style={{ gap: 8 }}>
            <select
              className="form-input"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              style={{ width: 100, fontSize: 13 }}
            >
              {[0, 1, 2, 3].map((offset) => {
                const y = String(currentYear - offset);
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} disabled={!eligible}>
              <Icon name="doc" size={12} /> Generate 1099
            </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 20 }}>
          {/* 1099 form preview */}
          <div className="vendor-1099-preview">
            <div className="vendor-1099-header">
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)' }}>Form 1099-NEC</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>Nonemployee Compensation</div>
                <div className="muted" style={{ fontSize: 12 }}>Tax Year {taxYear}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Prepared by</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>CondoCore</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              <div>
                <div className="vendor-1099-field-label">Payer</div>
                <div className="vendor-1099-field-value">712 Driggs Condominium LLC</div>
                <div className="vendor-1099-field-value muted">712 Driggs Avenue, Brooklyn, NY 11211</div>
                <div className="vendor-1099-field-value muted">EIN: 83-XXXXXXX</div>
              </div>
              <div>
                <div className="vendor-1099-field-label">Recipient</div>
                <div className="vendor-1099-field-value">{vendor.name}</div>
                <div className="vendor-1099-field-value muted">{vendor.address || <span style={{ color: 'var(--signal-warn)' }}>Address not on file</span>}</div>
                <div className="vendor-1099-field-value muted">EIN/SSN: {vendor.ein || <span style={{ color: 'var(--signal-warn)' }}>Not on file</span>}</div>
              </div>
            </div>

            <div style={{ borderTop: '2px solid var(--border)', margin: '20px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="vendor-1099-box">
                <div className="vendor-1099-box-label">Box 1 — Nonemployee compensation</div>
                <div className="vendor-1099-box-value">
                  {typeof fmtUSD === 'function' ? fmtUSD(totalPayments) : '$' + totalPayments.toLocaleString()}
                </div>
              </div>
              <div className="vendor-1099-box">
                <div className="vendor-1099-box-label">Box 4 — Federal income tax withheld</div>
                <div className="vendor-1099-box-value muted">$0.00</div>
              </div>
              <div className="vendor-1099-box">
                <div className="vendor-1099-box-label">Filing threshold</div>
                <div className="vendor-1099-box-value" style={{ color: eligible ? 'var(--signal-pos)' : 'var(--signal-warn)' }}>
                  {eligible ? '≥ $600 — File required' : '< $600 — No filing required'}
                </div>
              </div>
            </div>

            {!vendor.ein && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--signal-warn-soft)', border: '1px solid var(--signal-warn)', borderRadius: 8, fontSize: 12, color: 'var(--signal-warn)' }}>
                <Icon name="alert" size={13} style={{ marginRight: 6 }} />
                EIN / Tax ID is not on file for this vendor. Add it in the Profile tab before filing.
              </div>
            )}
          </div>

          {printed && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--signal-pos-soft)', border: '1px solid var(--signal-pos)', borderRadius: 8, fontSize: 12, color: 'var(--signal-pos)' }}>
              <Icon name="check" size={13} style={{ marginRight: 6 }} />
              1099 summary opened in a new window for printing. File the official IRS Form 1099-NEC separately.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bids Tab ─────────────────────────────────────────────────
const BID_STATUS_OPTS = ['Submitted', 'Under review', 'Approved', 'Contracted', 'Declined', 'Withdrawn'];

// Simulated file upload — stores file metadata in state
function useFileUpload(onUpload) {
  const [files, setFiles] = React.useState([]);
  const inputRef = React.useRef(null);
  const trigger = () => inputRef.current?.click();
  const onPick = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [
      ...prev,
      ...picked.map((f) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        description: '',
        url: URL.createObjectURL(f),
      }))
    ]);
    // Log each uploaded file to the audit trail
    if (typeof onUpload === 'function') {
      picked.forEach((f) => onUpload(f.name));
    }
    e.target.value = '';
  };
  const remove = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const setDesc = (id, desc) => setFiles((prev) => prev.map((f) => f.id === id ? { ...f, description: desc } : f));
  return { files, trigger, onPick, remove, setDesc, inputRef };
}

function BidModal({ open, bid, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) setForm(bid || {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      scope: '', amount: 0, status: 'Submitted', notes: '', division: '',
    });
  }, [open, bid]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={bid?.id ? 'Edit bid' : 'Add bid'}
      subtitle="Record a bid or proposal from this vendor"
      width={560}
      footer={
        <>
          {bid?.id && (
            <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => { onDelete(bid.id); onClose(); }}>
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose(); }}>
            {bid?.id ? 'Save changes' : 'Add bid'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Date"><Input value={form.date} onChange={set('date')} placeholder="May 06, 2024" /></Field>
        <Field label="Bid amount"><Input value={form.amount} onChange={(v) => set('amount')(parseFloat(v) || 0)} type="number" prefix="$" /></Field>
        <Field label="Scope / description" span={2}><Input value={form.scope} onChange={set('scope')} placeholder="Foundation work, Phase 1" /></Field>
        <Field label="Division / Category" span={2}>
          <Select
            value={form.division}
            onChange={set('division')}
            options={[
              { value: '', label: 'No division assigned' },
              ...CSI_GROUPS.map((g) => ({ value: g.label, label: `${g.csi} — ${g.label}` }))
            ]}
          />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')} options={BID_STATUS_OPTS.map((s) => ({ value: s, label: s }))} />
        </Field>
        <Field label="Notes" span={2}><Textarea value={form.notes} onChange={set('notes')} placeholder="Inclusions, exclusions, qualifications…" rows={3} /></Field>
      </div>
    </Modal>
  );
}

function VendorBidsTab({ vendor, store }) {
  const [bidModal, setBidModal] = React.useState({ open: false, bid: null });
  const upload = useFileUpload();
  // Per-bid document state: { [bidId]: File[] }
  const [bidDocs, setBidDocs] = React.useState({});
  const bidFileRef = React.useRef(null);
  const [activeBidForUpload, setActiveBidForUpload] = React.useState(null);

  // Contract rows from seed data
  const contractRows = React.useMemo(() => {
    return DRIGGS_712_CONTRACTS
      .filter((r) => String(r.Vendor || '').toLowerCase().includes(vendor.name.toLowerCase().slice(0, 8)))
      .map((r, i) => ({
        id: `contract-seed-${i}`,
        date: fmtDate(r.Date),
        scope: `Contract — ${r.Vendor}`,
        amount: trackerAmt(r['Contract Total']),
        paid: trackerAmt(r['Total Paid']),
        status: 'Contracted',
        notes: `Paid: ${typeof fmtUSD === 'function' ? fmtUSD(trackerAmt(r['Total Paid'])) : '$' + trackerAmt(r['Total Paid']).toLocaleString()} of ${typeof fmtUSD === 'function' ? fmtUSD(trackerAmt(r['Contract Total'])) : '$' + trackerAmt(r['Contract Total']).toLocaleString()}`,
        isContract: true,
        docs: [],
      }));
  }, [vendor.name]);

  const allRows = [...contractRows, ...vendor.bids];

  const statusCls = (s) => {
    if (s === 'Contracted' || s === 'Approved') return 'pos';
    if (s === 'Declined' || s === 'Withdrawn') return 'neutral';
    if (s === 'Submitted') return 'info';
    return 'neutral';
  };

  const handleBidFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!activeBidForUpload || !picked.length) return;
    setBidDocs((prev) => ({
      ...prev,
      [activeBidForUpload]: [
        ...(prev[activeBidForUpload] || []),
        ...picked.map((f) => ({
          id: `bdoc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: f.name,
          size: f.size,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          description: '',
          url: URL.createObjectURL(f),
        }))
      ]
    }));
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input ref={bidFileRef} type="file" multiple style={{ display: 'none' }} onChange={handleBidFileChange} />
      <div className="card">
        <div className="card-head">
          <div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Bids & Contracts</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>
              {allRows.filter((r) => r.status === 'Contracted').length} contracted
              {vendor.bids.filter((b) => b.status === 'Approved').length > 0 && (
                <span style={{ color: 'var(--signal-pos)', marginLeft: 6 }}>
                  · {vendor.bids.filter((b) => b.status === 'Approved').length} approved
                </span>
              )}
            </span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setBidModal({ open: true, bid: null })}>
            <Icon name="plus" size={12} /> Add bid
          </button>
        </div>
        <div className="card-body-flush">
          {allRows.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
              No bids or contracts on record. Click "Add bid" to record a proposal.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Scope</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Docs</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allRows.map((b) => (
                  <React.Fragment key={b.id}>
                    <tr>
                      <td className="mono muted" style={{ fontSize: 12 }}>{b.date}</td>
                      <td style={{ fontWeight: 500 }}>
                        {b.scope}
                        {b.isContract && (
                          <span className="pill neutral no-dot" style={{ fontSize: 10, marginLeft: 6 }}>Contract</span>
                        )}
                      </td>
                      <td className="num mono">{typeof fmtUSD === 'function' ? fmtUSD(b.amount) : '$' + (b.amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`pill no-dot ${statusCls(b.status)}`}>{b.status}</span>
                        {b.status === 'Approved' && !b.isContract && (
                          <span className="muted" style={{ fontSize: 10, marginLeft: 4 }}>→ contract amount</span>
                        )}
                      </td>
                      <td className="muted" style={{ fontSize: 12 }}>{b.notes || '—'}</td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 11, padding: '2px 6px' }}
                          onClick={() => {
                            setActiveBidForUpload(b.id);
                            setTimeout(() => bidFileRef.current?.click(), 0);
                          }}
                        >
                          <Icon name="plus" size={11} /> Upload
                        </button>
                        {(bidDocs[b.id] || []).length > 0 && (
                          <span className="pill info no-dot" style={{ fontSize: 10, marginLeft: 4 }}>
                            {(bidDocs[b.id] || []).length}
                          </span>
                        )}
                      </td>
                      <td>
                        {!b.isContract && (
                          <button className="iconbtn" onClick={() => setBidModal({ open: true, bid: b })}>
                            <Icon name="edit" size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                    {/* Inline document list for this bid */}
                    {(bidDocs[b.id] || []).map((doc) => (
                      <tr key={doc.id} style={{ background: 'var(--surface-raised)' }}>
                        <td colSpan={2} style={{ paddingLeft: 24 }}>
                          <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--cc-accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="doc" size={11} style={{ flexShrink: 0 }} />{doc.name}
                          </a>
                          <span className="muted" style={{ fontSize: 11, marginLeft: 8 }}>{doc.uploadedAt}</span>
                        </td>
                        <td colSpan={3}>
                          <input
                            value={doc.description}
                            onChange={(e) => setBidDocs((prev) => ({
                              ...prev,
                              [b.id]: (prev[b.id] || []).map((d) => d.id === doc.id ? { ...d, description: e.target.value } : d)
                            }))}
                            placeholder="Add description…"
                            style={{ fontSize: 12, background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text)' }}
                          />
                        </td>
                        <td colSpan={2} style={{ textAlign: 'right' }}>
                          <button className="iconbtn" onClick={() => setBidDocs((prev) => ({
                            ...prev,
                            [b.id]: (prev[b.id] || []).filter((d) => d.id !== doc.id)
                          }))}>
                            <Icon name="trash" size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <BidModal
        open={bidModal.open}
        bid={bidModal.bid}
        onClose={() => setBidModal({ open: false, bid: null })}
        onSave={(form) => {
          if (bidModal.bid?.id) store?.updateBid(vendor.id, bidModal.bid.id, form);
          else store?.addBid(vendor.id, form);
        }}
        onDelete={(id) => store?.deleteBid(vendor.id, id)}
      />
    </div>
  );
}

// ── COIs Tab ─────────────────────────────────────────────────
const COI_TYPE_OPTS = ['General Liability', 'Workers Comp', 'Umbrella / Excess', 'Professional Liability', 'Auto', 'Other'];
const COI_STATUS_OPTS = ['Active', 'Expired', 'Pending', 'Waived'];

function CoiModal({ open, coi, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) setForm(coi || {
      type: 'General Liability', carrier: '', policyNum: '',
      expires: '', status: 'Active', amount: '$1,000,000',
    });
  }, [open, coi]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={coi?.id ? 'Edit COI' : 'Add COI'}
      subtitle="Certificate of Insurance record"
      width={560}
      footer={
        <>
          {coi?.id && (
            <button className="btn btn-ghost" style={{ color: 'var(--signal-neg)', marginRight: 'auto' }} onClick={() => { onDelete(coi.id); onClose(); }}>
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose(); }}>
            {coi?.id ? 'Save changes' : 'Add COI'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Coverage type">
          <Select value={form.type} onChange={set('type')} options={COI_TYPE_OPTS.map((t) => ({ value: t, label: t }))} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')} options={COI_STATUS_OPTS.map((s) => ({ value: s, label: s }))} />
        </Field>
        <Field label="Carrier"><Input value={form.carrier} onChange={set('carrier')} placeholder="State Farm" /></Field>
        <Field label="Policy number"><Input value={form.policyNum} onChange={set('policyNum')} placeholder="GL-2024-XXXXX" /></Field>
        <Field label="Coverage amount"><Input value={form.amount} onChange={set('amount')} placeholder="$1,000,000" /></Field>
        <Field label="Expiration date"><Input value={form.expires} onChange={set('expires')} placeholder="Dec 31, 2025" /></Field>
      </div>
    </Modal>
  );
}

function VendorCoisTab({ vendor, store }) {
  const [coiModal, setCoiModal] = React.useState({ open: false, coi: null });
  // Per-COI document state
  const [coiDocs, setCoiDocs] = React.useState({});
  const coiFileRef = React.useRef(null);
  const [activeCoiForUpload, setActiveCoiForUpload] = React.useState(null);
  // COI tracking toggle (per-vendor, stored locally)
  const [trackingEnabled, setTrackingEnabled] = React.useState(
    vendor.cois.length > 0 || vendor.coiExpires !== 'Not tracked'
  );

  const statusCls = (s) => {
    if (s === 'Active') return 'pos';
    if (s === 'Expired') return 'neg';
    if (s === 'Pending') return 'info';
    return 'neutral';
  };

  const handleCoiFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!activeCoiForUpload || !picked.length) return;
    setCoiDocs((prev) => ({
      ...prev,
      [activeCoiForUpload]: [
        ...(prev[activeCoiForUpload] || []),
        ...picked.map((f) => ({
          id: `cdoc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: f.name,
          size: f.size,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          description: '',
          url: URL.createObjectURL(f),
        }))
      ]
    }));
    e.target.value = '';
  };

  const expiredCount = vendor.cois.filter((c) => effectiveCoiStatus(c) === 'Expired').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input ref={coiFileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleCoiFileChange} />

      {/* Tracking toggle card */}
      <div className="card">
        <div className="card-head" style={{ paddingBottom: 12 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>COI Tracking</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>
              {trackingEnabled
                ? (expiredCount > 0
                  ? <span style={{ color: 'var(--signal-neg)' }}>{expiredCount} expired</span>
                  : <span style={{ color: 'var(--signal-pos)' }}>All current</span>)
                : 'Tracking disabled'}
            </span>
          </div>
          <label className="vendor-toggle-row">
            <span className="muted" style={{ fontSize: 12 }}>Track COI</span>
            <button
              role="switch"
              aria-checked={trackingEnabled}
              className={`vendor-toggle ${trackingEnabled ? 'on' : ''}`}
              onClick={() => setTrackingEnabled((v) => !v)}
            />
          </label>
        </div>
      </div>

      {trackingEnabled && (
        <div className="card">
          <div className="card-head">
            <span style={{ fontWeight: 600, fontSize: 13 }}>Certificates of Insurance</span>
            <button className="btn btn-primary btn-sm" onClick={() => setCoiModal({ open: true, coi: null })}>
              <Icon name="plus" size={12} /> Add COI
            </button>
          </div>
          <div className="card-body-flush">
            {vendor.cois.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
                No COIs on record. Click "Add COI" to track a certificate.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Carrier</th>
                    <th>Policy #</th>
                    <th>Coverage</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Docs</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {vendor.cois.map((c) => {
                    const effStatus = effectiveCoiStatus(c);
                    return (
                      <React.Fragment key={c.id}>
                        <tr style={effStatus === 'Expired' ? { background: 'var(--signal-neg-soft, #fff1f0)' } : {}}>
                          <td style={{ fontWeight: 500 }}>{c.type}</td>
                          <td className="muted">{c.carrier || '—'}</td>
                          <td className="mono muted" style={{ fontSize: 12 }}>{c.policyNum || '—'}</td>
                          <td className="mono" style={{ fontSize: 12 }}>{c.amount || '—'}</td>
                          <td className="mono muted" style={{ fontSize: 12, color: effStatus === 'Expired' ? 'var(--signal-neg)' : 'inherit' }}>
                            {c.expires || '—'}
                            {effStatus === 'Expired' && <span style={{ marginLeft: 4, fontSize: 10 }}>(⚠ expired)</span>}
                          </td>
                          <td><span className={`pill no-dot ${statusCls(effStatus)}`}>{effStatus}</span></td>
                          <td>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: 11, padding: '2px 6px' }}
                              onClick={() => {
                                setActiveCoiForUpload(c.id);
                                setTimeout(() => coiFileRef.current?.click(), 0);
                              }}
                            >
                              <Icon name="plus" size={11} /> Upload
                            </button>
                            {(coiDocs[c.id] || []).length > 0 && (
                              <span className="pill info no-dot" style={{ fontSize: 10, marginLeft: 4 }}>
                                {(coiDocs[c.id] || []).length}
                              </span>
                            )}
                          </td>
                          <td>
                            <button className="iconbtn" onClick={() => setCoiModal({ open: true, coi: c })}>
                              <Icon name="edit" size={13} />
                            </button>
                          </td>
                        </tr>
                        {/* Inline document list for this COI */}
                        {(coiDocs[c.id] || []).map((doc) => (
                          <tr key={doc.id} style={{ background: 'var(--surface-raised)' }}>
                            <td colSpan={3} style={{ paddingLeft: 24 }}>
                              <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--cc-accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Icon name="doc" size={11} style={{ flexShrink: 0 }} />{doc.name}
                              </a>
                              <span className="muted" style={{ fontSize: 11, marginLeft: 8 }}>{doc.uploadedAt}</span>
                            </td>
                            <td colSpan={3}>
                              <input
                                value={doc.description}
                                onChange={(e) => setCoiDocs((prev) => ({
                                  ...prev,
                                  [c.id]: (prev[c.id] || []).map((d) => d.id === doc.id ? { ...d, description: e.target.value } : d)
                                }))}
                                placeholder="Add description…"
                                style={{ fontSize: 12, background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text)' }}
                              />
                            </td>
                            <td colSpan={2} style={{ textAlign: 'right' }}>
                              <button className="iconbtn" onClick={() => setCoiDocs((prev) => ({
                                ...prev,
                                [c.id]: (prev[c.id] || []).filter((d) => d.id !== doc.id)
                              }))}>
                                <Icon name="trash" size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <CoiModal
            open={coiModal.open}
            coi={coiModal.coi}
            onClose={() => setCoiModal({ open: false, coi: null })}
            onSave={(form) => {
              if (coiModal.coi?.id) store?.updateCoi(vendor.id, coiModal.coi.id, form);
              else store?.addCoi(vendor.id, form);
            }}
            onDelete={(id) => store?.deleteCoi(vendor.id, id)}
          />
        </div>
      )}
    </div>
  );
}

// ── Documents Tab ─────────────────────────────────────────────
function VendorDocumentsTab({ vendor, store }) {
  const upload = useFileUpload((fileName) => {
    store?.addDocumentAudit?.(vendor.id, fileName);
  });

  const fmtBytes = (b) => {
    if (!b) return '';
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Documents</span>
          <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>{upload.files.length} file{upload.files.length !== 1 ? 's' : ''}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={upload.trigger}>
          <Icon name="plus" size={12} /> Upload document
        </button>
      </div>
      <input ref={upload.inputRef} type="file" multiple style={{ display: 'none' }} onChange={upload.onPick} />
      <div className="card-body-flush">
        {upload.files.length === 0 ? (
          <div
            style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13, cursor: 'pointer' }}
            onClick={upload.trigger}
          >
            <Icon name="folder" size={24} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
            No documents uploaded yet. Click to upload files.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>File name</th>
                <th>Description</th>
                <th>Uploaded</th>
                <th className="num">Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {upload.files.map((f) => (
                <tr key={f.id}>
                  <td>
                    <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--cc-accent)', display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <Icon name="doc" size={13} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    </a>
                  </td>
                  <td>
                    <input
                      value={f.description}
                      onChange={(e) => upload.setDesc(f.id, e.target.value)}
                      placeholder="Add description…"
                      style={{ fontSize: 12, background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text)' }}
                    />
                  </td>
                  <td className="muted" style={{ fontSize: 12 }}>{f.uploadedAt}</td>
                  <td className="num mono muted" style={{ fontSize: 12 }}>{fmtBytes(f.size)}</td>
                  <td>
                    <button className="iconbtn" onClick={() => upload.remove(f.id)}>
                      <Icon name="trash" size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Activity / Audit Log Tab
// ============================================================
const AUDIT_ACTION_META = {
  vendor_added:      { label: 'Vendor added',          icon: 'plus',    color: 'var(--signal-pos)' },
  vendor_edited:     { label: 'Vendor profile updated', icon: 'edit',    color: 'var(--signal-info)' },
  vendor_archived:   { label: 'Vendor archived',        icon: 'trash',   color: 'var(--signal-neg)' },
  vendor_restored:   { label: 'Vendor restored',        icon: 'refresh', color: 'var(--signal-pos)' },
  rating_changed:    { label: 'Rating updated',         icon: 'star',    color: 'var(--signal-warn)' },
  transaction_added: { label: 'Transaction added',      icon: 'dollar',  color: 'var(--signal-info)' },
  bid_added:         { label: 'Bid added',              icon: 'list',    color: 'var(--cc-accent)' },
  bid_updated:       { label: 'Bid updated',            icon: 'list',    color: 'var(--signal-info)' },
  bid_deleted:       { label: 'Bid deleted',            icon: 'trash',   color: 'var(--signal-neg)' },
  coi_added:         { label: 'COI added',              icon: 'shield',  color: 'var(--cc-accent)' },
  coi_updated:       { label: 'COI updated',            icon: 'shield',  color: 'var(--signal-info)' },
  coi_deleted:       { label: 'COI deleted',            icon: 'trash',   color: 'var(--signal-neg)' },
  document_uploaded: { label: 'Document uploaded',      icon: 'doc',     color: 'var(--cc-accent)' },
};
function auditDetail(entry) {
  const { action, detail } = entry;
  if (action === 'vendor_added') return `${detail.name} · ${detail.trade}`;
  if (action === 'vendor_edited') {
    // New format: changes array with before/after values
    if (detail.changes?.length) {
      return detail.changes.map((c) => `${c.label}: "${c.from || '—'}" → "${c.to || '—'}"`).join(' · ');
    }
    // Legacy format: just field names
    if (detail.fields?.length) return `Fields updated: ${detail.fields.join(', ')}`;
    return 'No auditable fields changed';
  }
  if (action === 'vendor_archived') return detail.archivedAt ? `on ${new Date(detail.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : '';
  if (action === 'rating_changed') return `${detail.from} → ${detail.to} / 5`;
  if (action === 'transaction_added') return [detail.memo, detail.amount != null ? `$${Number(detail.amount).toLocaleString()}` : null].filter(Boolean).join(' · ');
  if (action === 'bid_added') return [detail.scope, detail.amount != null ? `$${Number(detail.amount).toLocaleString()}` : null, detail.status].filter(Boolean).join(' · ');
  if (action === 'bid_updated') return [detail.scope, detail.status].filter(Boolean).join(' · ');
  if (action === 'bid_deleted') return detail.scope || '';
  if (action === 'coi_added') return [detail.type, detail.carrier, detail.expires].filter(Boolean).join(' · ');
  if (action === 'coi_updated') return [detail.type, detail.status].filter(Boolean).join(' · ');
  if (action === 'coi_deleted') return detail.type || '';
  if (action === 'document_uploaded') return detail.name || '';
  return '';
}
function fmtAuditTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function VendorActivityTab({ vendor }) {
  const log = [...(vendor.auditLog || [])].reverse(); // newest first
  if (log.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-faint)' }}>
        <Icon name="clock" size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
        <div style={{ fontSize: 14 }}>No activity recorded yet.</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Actions like edits, bids, and COI changes will appear here.</div>
      </div>
    );
  }
  return (
    <div className="card" style={{ padding: '0 0 8px' }}>
      <div className="card-head" style={{ padding: '14px 20px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Activity log</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{log.length} event{log.length !== 1 ? 's' : ''}</div>
      </div>
      <div style={{ padding: '0 0 4px' }}>
        {log.map((entry, idx) => {
          const meta = AUDIT_ACTION_META[entry.action] || { label: entry.action, icon: 'doc', color: 'var(--text-muted)' };
          const detail = auditDetail(entry);
          const isLast = idx === log.length - 1;
          return (
            <div key={entry.id} style={{
              display: 'flex', gap: 14, padding: '12px 20px',
              borderBottom: isLast ? 'none' : '1px solid var(--border)',
              alignItems: 'flex-start',
            }}>
              {/* Icon column */}
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'var(--bg-sunk)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 1,
              }}>
                <Icon name={meta.icon} size={14} style={{ color: meta.color }} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{meta.label}</span>
                  {/* For vendor_edited with changes array, show inline count */}
                  {entry.action === 'vendor_edited' && entry.detail?.changes?.length > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>
                      {entry.detail.changes.length} field{entry.detail.changes.length !== 1 ? 's' : ''} changed
                    </span>
                  )}
                  {/* For all other actions, show the detail inline */}
                  {entry.action !== 'vendor_edited' && detail && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 380 }}>{detail}</span>
                  )}
                </div>
                {/* For vendor_edited, render each field change as a stacked row */}
                {entry.action === 'vendor_edited' && entry.detail?.changes?.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {entry.detail.changes.map((c, ci) => (
                      <div key={ci} style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 12 }}>
                        <span style={{ color: 'var(--text-faint)', minWidth: 110, flexShrink: 0 }}>{c.label}</span>
                        <span style={{ color: 'var(--signal-neg)', textDecoration: 'line-through', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(c.from || '—')}</span>
                        <span style={{ color: 'var(--text-faint)', fontSize: 10 }}>→</span>
                        <span style={{ color: 'var(--signal-pos)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(c.to || '—')}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Performed by */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--accent-soft)', color: 'var(--accent-soft-text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, flexShrink: 0,
                    }}>
                      {(entry.performedBy?.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {entry.performedBy?.name || 'Unknown'}
                      {entry.performedBy?.role ? ` · ${entry.performedBy.role}` : ''}
                    </span>
                  </div>
                  {/* Timestamp */}
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }} title={new Date(entry.timestamp).toLocaleString()}>
                    {fmtAuditTime(entry.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ============================================================
// Shared sub-components
// ============================================================
function VendorAvatar({ init, color = 0, size = 32 }) {
  const palettes = [
    { bg: 'var(--accent-soft)', fg: 'var(--accent-soft-text)' },
    { bg: 'var(--signal-info-soft)', fg: 'var(--signal-info)' },
    { bg: 'var(--signal-pos-soft)', fg: 'var(--signal-pos)' },
    { bg: 'var(--signal-warn-soft)', fg: 'var(--signal-warn)' },
    { bg: 'var(--signal-neg-soft)', fg: 'var(--signal-neg)' },
    { bg: 'var(--bg-active)', fg: 'var(--text)' },
    { bg: 'var(--accent)', fg: 'var(--text-on-accent)' },
  ];
  const p = palettes[color % palettes.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: p.bg, color: p.fg,
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{init}</div>
  );
}

function VendorStars({ value }) {
  return (
    <div className="row" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{
          color: i <= Math.round(value) ? 'var(--signal-warn)' : 'var(--border-strong)',
          fontSize: 11,
        }}>★</span>
      ))}
    </div>
  );
}
