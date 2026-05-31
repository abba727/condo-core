import React from 'react';
import { trpc } from '@/lib/trpc';
/* global Icon, fmtUSD, Modal, Field, Input, Select, Textarea, PageHead */

const STATUS_COLORS = {
  available:    { cls: 'available',  label: 'Available',    bg: 'var(--signal-pos-soft)',  fg: 'var(--signal-pos)' },
  reserved:     { cls: 'reserved',   label: 'Reserved',     bg: 'var(--signal-warn-soft)', fg: 'var(--signal-warn)' },
  contracted:   { cls: 'contract',   label: 'In contract',  bg: 'var(--signal-info-soft)', fg: 'var(--signal-info)' },
  closed:       { cls: 'sold',       label: 'Sold / closed',bg: 'var(--accent-soft)',      fg: 'var(--accent)' },
  not_for_sale: { cls: 'common',     label: 'Not for sale', bg: 'var(--bg-sunk)',          fg: 'var(--text-faint)' },
};
const STATUS_OPTS = [
  { value: 'available',    label: 'Available' },
  { value: 'reserved',     label: 'Reserved' },
  { value: 'contracted',   label: 'In contract' },
  { value: 'closed',       label: 'Sold / closed' },
  { value: 'not_for_sale', label: 'Not for sale' },
];

const UNIT_TYPE_OPTS = [
  { value: '1BR', label: '1 Bedroom' },
  { value: '2BR', label: '2 Bedroom' },
  { value: '3BR', label: '3 Bedroom' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Common', label: 'Common Area' },
];

function UnitEditModal({ open, unit, onClose, onSave }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open && unit) {
      setForm({
        id: unit.id,
        unitNumber: unit.unitNumber || '',
        floor: unit.floor || 1,
        unitType: unit.unitType || '1BR',
        sqft: Number(unit.sqft || 0),
        status: unit.status || 'available',
        listPrice: Number(unit.listPrice || 0),
        salePrice: Number(unit.salePrice || 0),
        buyerName: unit.buyerName || '',
        closingDate: unit.closingDate || '',
        notes: unit.notes || '',
      });
    }
  }, [open, unit]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const num = (k) => (v) => setForm((f) => ({ ...f, [k]: parseFloat(v) || 0 }));
  const int = (k) => (v) => setForm((f) => ({ ...f, [k]: parseInt(v) || 0 }));

  if (!unit) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit unit — ${unit.unitNumber}`}
      subtitle={`Floor ${unit.floor} · ${unit.unitType || 'Residential'} · ${unit.sqft ? `${unit.sqft.toLocaleString()} SF` : '—'}`}
      width={560}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Save changes</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Unit number">
          <Input value={form.unitNumber} onChange={set('unitNumber')} placeholder="e.g. 3A" />
        </Field>
        <Field label="Floor">
          <Input value={form.floor} onChange={int('floor')} type="number" placeholder="3" />
        </Field>
        <Field label="Unit type">
          <Select value={form.unitType} onChange={set('unitType')} options={UNIT_TYPE_OPTS} />
        </Field>
        <Field label="Sq ft">
          <Input value={form.sqft} onChange={num('sqft')} type="number" placeholder="850" />
        </Field>
        <Field label="Status" span={2}>
          <Select value={form.status} onChange={set('status')} options={STATUS_OPTS} />
        </Field>
        <Field label="List price">
          <Input value={form.listPrice} onChange={num('listPrice')} type="number" prefix="$" />
        </Field>
        <Field label="Sale price">
          <Input value={form.salePrice} onChange={num('salePrice')} type="number" prefix="$" hint="Actual contract price" />
        </Field>
        <Field label="Buyer name">
          <Input value={form.buyerName} onChange={set('buyerName')} placeholder="John & Jane Smith" />
        </Field>
        <Field label="Closing date">
          <Input value={form.closingDate} onChange={set('closingDate')} placeholder="2024-09-15" />
        </Field>
        <Field label="Notes" span={2}>
          <Textarea value={form.notes} onChange={set('notes')} placeholder="Finishes, contingencies, agent notes…" />
        </Field>
      </div>
    </Modal>
  );
}

function UnitCell({ unit, isSelected, onClick }) {
  const def = STATUS_COLORS[unit.status] || STATUS_COLORS.available;
  const price = Number(unit.listPrice || unit.salePrice || 0);
  return (
    <button
      onClick={() => onClick(unit)}
      style={{
        flex: `${unit.sqft ? Math.max(unit.sqft / 200, 1) : 1} 0 0`,
        minWidth: 60,
        padding: '6px 8px',
        borderRadius: 6,
        border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
        background: def.bg,
        color: def.fg,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600 }}>{unit.unitNumber}</div>
      {price > 0 && (
        <div style={{ fontSize: 10, opacity: 0.8, marginTop: 1 }}>
          ${(price / 1e6).toFixed(2)}M
        </div>
      )}
      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>
        {unit.unitType || ''}
        {unit.sqft ? ` · ${unit.sqft.toLocaleString()} SF` : ''}
      </div>
    </button>
  );
}

function UnitDetailPanel({ unit, onEdit, onClose }) {
  if (!unit) {
    return (
      <div className="card" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
        <div className="card-head">
          <div className="card-title">Unit details</div>
        </div>
        <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 12px',
            borderRadius: 12, background: 'var(--bg-sunk)',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="layers" size={22} style={{ color: 'var(--text-faint)' }} />
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Click a unit in the stack to view contract status, pricing, and finishes.
          </div>
        </div>
      </div>
    );
  }
  const def = STATUS_COLORS[unit.status] || STATUS_COLORS.available;
  const listPrice = Number(unit.listPrice || 0);
  const salePrice = Number(unit.salePrice || 0);
  const displayPrice = salePrice || listPrice;
  return (
    <div className="card" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>
      <div className="card-head">
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: def.fg, flexShrink: 0 }} />
          <div>
            <div className="card-title">Unit {unit.unitNumber}</div>
            <div className="card-sub">Floor {unit.floor} · {unit.unitType || 'Residential'}</div>
          </div>
        </div>
        <button className="iconbtn" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <div className="card-body">
        {displayPrice > 0 && (
          <>
            <div className="metric-value-mono" style={{ fontSize: 28 }}>{fmtUSD(displayPrice)}</div>
            {unit.sqft && (
              <div className="faint" style={{ fontSize: 11, marginBottom: 12 }}>
                ${Math.round(displayPrice / unit.sqft).toLocaleString()}/sf
              </div>
            )}
          </>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {unit.bedrooms != null && (
            <div>
              <div className="field-label">Beds</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{unit.bedrooms} bed</div>
            </div>
          )}
          {unit.bathrooms != null && (
            <div>
              <div className="field-label">Baths</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{unit.bathrooms} bath</div>
            </div>
          )}
          {unit.sqft && (
            <div>
              <div className="field-label">Sqft</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{unit.sqft.toLocaleString()}</div>
            </div>
          )}
          <div>
            <div className="field-label">Floor</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{unit.floor}</div>
          </div>
        </div>
        <div className="div" />
        <div className="stack" style={{ gap: 8 }}>
          <div className="row-between">
            <span className="muted" style={{ fontSize: 12 }}>Sales status</span>
            <span className={`pill no-dot ${def.cls === 'available' ? 'pos' : def.cls === 'sold' ? 'pos' : def.cls === 'contract' ? 'info' : def.cls === 'reserved' ? 'warn' : 'neutral'}`}>
              {def.label}
            </span>
          </div>
          {unit.buyerName && (
            <div className="row-between">
              <span className="muted" style={{ fontSize: 12 }}>Buyer</span>
              <span style={{ fontSize: 12 }}>{unit.buyerName}</span>
            </div>
          )}
          {unit.closingDate && (
            <div className="row-between">
              <span className="muted" style={{ fontSize: 12 }}>Closing</span>
              <span style={{ fontSize: 12 }}>{unit.closingDate}</span>
            </div>
          )}
          {listPrice > 0 && salePrice > 0 && listPrice !== salePrice && (
            <div className="row-between">
              <span className="muted" style={{ fontSize: 12 }}>List price</span>
              <span style={{ fontSize: 12 }} className="mono">{fmtUSD(listPrice, { compact: true })}</span>
            </div>
          )}
        </div>
        {unit.notes && (
          <>
            <div className="div" />
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit.notes}</div>
          </>
        )}
        <div className="div" />
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onEdit(unit)}>
            <Icon name="edit" size={12} /> Edit unit
          </button>
        </div>
      </div>
    </div>
  );
}

export function StackingPlanDb() {
  const utils = trpc.useUtils();
  const { data: units = [], isLoading } = trpc.capitalStack.listUnits.useQuery({});
  const updateMut = trpc.capitalStack.updateUnit.useMutation({
    onSuccess: () => utils.capitalStack.listUnits.invalidate(),
  });

  const [filter, setFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(null);
  const [editModal, setEditModal] = React.useState({ open: false, unit: null });

  // Group units by floor
  const floorMap = React.useMemo(() => {
    const map = new Map();
    for (const u of units) {
      const key = u.floor;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(u);
    }
    return map;
  }, [units]);

  // Sort floors descending (highest first)
  const sortedFloors = React.useMemo(() => {
    return [...floorMap.keys()].sort((a, b) => b - a);
  }, [floorMap]);

  // Status counts
  const statusCounts = React.useMemo(() => {
    const counts = {};
    for (const u of units) {
      counts[u.status] = (counts[u.status] || 0) + 1;
    }
    return counts;
  }, [units]);

  // Total sellout
  const totalSellout = React.useMemo(() => {
    return units.reduce((s, u) => s + Number(u.listPrice || u.salePrice || 0), 0);
  }, [units]);

  const filteredUnits = React.useMemo(() => {
    if (filter === 'all') return new Set(units.map((u) => u.id));
    return new Set(units.filter((u) => u.status === filter).map((u) => u.id));
  }, [units, filter]);

  const handleSave = (form) => {
    updateMut.mutate({
      id: form.id,
      status: form.status,
      listPrice: form.listPrice || undefined,
      salePrice: form.salePrice || undefined,
      buyerName: form.buyerName || undefined,
      closingDate: form.closingDate || undefined,
      notes: form.notes || undefined,
    });
    setEditModal({ open: false, unit: null });
    // Update selected if it's the same unit
    if (selected?.id === form.id) {
      setSelected((prev) => prev ? { ...prev, ...form } : null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-faint)' }}>
        <Icon name="layers" size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
        <div>Loading stacking plan…</div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        eyebrow="Stacking plan"
        title="712 Driggs · Unit stack"
        sub="Live sales status by floor and line. Click any unit to view contract, pricing history, and finishes package."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="filter" size={13} /> Filter</button>
            <button className="btn btn-secondary"><Icon name="download" size={13} /> Export PDF</button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid-kpis" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="metric" style={{ padding: '12px 14px' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--signal-pos)', flexShrink: 0 }} />
            <span className="metric-label" style={{ fontSize: 11 }}>Available</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{statusCounts.available || 0}</div>
            <span className="faint mono" style={{ fontSize: 12 }}>
              {units.length > 0 ? `${Math.round(((statusCounts.available || 0) / units.length) * 100)}%` : '—'}
            </span>
          </div>
        </div>
        <div className="metric" style={{ padding: '12px 14px' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--signal-warn)', flexShrink: 0 }} />
            <span className="metric-label" style={{ fontSize: 11 }}>Reserved</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{statusCounts.reserved || 0}</div>
            <span className="faint mono" style={{ fontSize: 12 }}>
              {units.length > 0 ? `${Math.round(((statusCounts.reserved || 0) / units.length) * 100)}%` : '—'}
            </span>
          </div>
        </div>
        <div className="metric" style={{ padding: '12px 14px' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--signal-info)', flexShrink: 0 }} />
            <span className="metric-label" style={{ fontSize: 11 }}>Contract</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{statusCounts.contracted || 0}</div>
            <span className="faint mono" style={{ fontSize: 12 }}>
              {units.length > 0 ? `${Math.round(((statusCounts.contracted || 0) / units.length) * 100)}%` : '—'}
            </span>
          </div>
        </div>
        <div className="metric" style={{ padding: '12px 14px' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', flexShrink: 0 }} />
            <span className="metric-label" style={{ fontSize: 11 }}>Closed</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{statusCounts.closed || 0}</div>
            <span className="faint mono" style={{ fontSize: 12 }}>
              {units.length > 0 ? `${Math.round(((statusCounts.closed || 0) / units.length) * 100)}%` : '—'}
            </span>
          </div>
        </div>
        <div className="metric" style={{ padding: '12px 14px' }}>
          <div className="metric-label" style={{ fontSize: 11 }}>Sellout</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
            {fmtUSD(totalSellout, { compact: true })}
          </div>
          <div className="metric-foot">
            <span>{units.length} units total</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 320px', marginTop: 16 }}>
        {/* Stack */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Stack — 712 Driggs Avenue</div>
              <div className="card-sub">{sortedFloors.length} floors · {units.length} units · DB-backed</div>
            </div>
            <div className="card-actions">
              <div className="seg">
                {[['all', 'All'], ['available', 'Available'], ['reserved', 'Reserved'], ['contracted', 'Contract']].map(([id, l]) => (
                  <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="card-body" style={{ padding: 24, background: 'var(--bg-sunk)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 720, margin: '0 auto' }}>
              {sortedFloors.map((floor) => {
                const floorUnits = floorMap.get(floor) || [];
                const visibleUnits = filter === 'all'
                  ? floorUnits
                  : floorUnits.filter((u) => filteredUnits.has(u.id));
                if (visibleUnits.length === 0 && filter !== 'all') return null;
                return (
                  <div key={floor} className="row" style={{ gap: 8, alignItems: 'stretch' }}>
                    <div style={{
                      width: 56,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      paddingRight: 4,
                    }}>
                      <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                        {floor}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {floorUnits.map((u) => (
                        <div
                          key={u.id}
                          style={{ opacity: filter !== 'all' && !filteredUnits.has(u.id) ? 0.25 : 1 }}
                        >
                          <UnitCell
                            unit={u}
                            isSelected={selected?.id === u.id}
                            onClick={(unit) => setSelected((prev) => prev?.id === unit.id ? null : unit)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={{ height: 8, background: 'linear-gradient(180deg, var(--text-faint) 0%, transparent 100%)', opacity: 0.2 }} />
            </div>
          </div>
          <div className="card-foot">
            <div className="row" style={{ gap: 14, flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLORS).map(([key, def]) => (
                <div key={key} className="row" style={{ gap: 6, fontSize: 11 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: def.fg, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)' }}>{def.label}</span>
                  <span className="mono faint">{statusCounts[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unit detail panel */}
        <UnitDetailPanel
          unit={selected}
          onEdit={(unit) => setEditModal({ open: true, unit })}
          onClose={() => setSelected(null)}
        />
      </div>

      <UnitEditModal
        open={editModal.open}
        unit={editModal.unit}
        onClose={() => setEditModal({ open: false, unit: null })}
        onSave={handleSave}
      />
    </>
  );
}
