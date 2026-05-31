import React from 'react';
import { trpc } from '@/lib/trpc';
/* global Icon, fmtUSD, Modal, Field, Input, Select, Textarea */

const DRAW_STATUS_CLS = {
  funded: 'pos',
  approved: 'pos',
  submitted: 'warn',
  draft: 'neutral',
  rejected: 'neg',
};
const DRAW_STATUS_LABEL = {
  funded: 'Funded',
  approved: 'Approved',
  submitted: 'Pending bank review',
  draft: 'Draft',
  rejected: 'Rejected',
};
const STATUS_OPTS = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'funded', label: 'Funded' },
  { value: 'rejected', label: 'Rejected' },
];

function DrawModal({ open, draw, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) {
      setForm(
        draw && draw.id
          ? {
              id: draw.id,
              drawNumber: draw.drawNumber,
              label: draw.label || '',
              requestDate: draw.requestDate || '',
              approvedDate: draw.approvedDate || '',
              fundedDate: draw.fundedDate || '',
              requestAmount: Number(draw.requestAmount || 0),
              approvedAmount: Number(draw.approvedAmount || 0),
              fundedAmount: Number(draw.fundedAmount || 0),
              status: draw.status || 'draft',
              lender: draw.lender || '',
              notes: draw.notes || '',
            }
          : {
              drawNumber: 1,
              label: '',
              requestDate: new Date().toISOString().slice(0, 10),
              approvedDate: '',
              fundedDate: '',
              requestAmount: 0,
              approvedAmount: 0,
              fundedAmount: 0,
              status: 'draft',
              lender: '',
              notes: '',
            }
      );
    }
  }, [open, draw]);

  const isEdit = !!form.id;
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const num = (k) => (v) => setForm((f) => ({ ...f, [k]: parseFloat(v) || 0 }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit draw — ${form.label || `Draw ${form.drawNumber}`}` : 'Request new draw'}
      subtitle={isEdit ? `Draw #${form.drawNumber}` : 'Submit a new lender draw request'}
      width={640}
      footer={
        <>
          {isEdit && (
            <button
              className="btn btn-ghost"
              style={{ color: 'var(--signal-neg)', marginRight: 'auto' }}
              onClick={() => onDelete(form.id)}
            >
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {isEdit ? 'Save changes' : 'Submit request'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Draw number">
          <Input
            value={form.drawNumber}
            onChange={num('drawNumber')}
            type="number"
            placeholder="12"
          />
        </Field>
        <Field label="Label">
          <Input value={form.label} onChange={set('label')} placeholder="Draw 12 — May 2024" />
        </Field>
        <Field label="Request amount">
          <Input value={form.requestAmount} onChange={num('requestAmount')} type="number" prefix="$" />
        </Field>
        <Field label="Approved amount">
          <Input value={form.approvedAmount} onChange={num('approvedAmount')} type="number" prefix="$" />
        </Field>
        <Field label="Funded amount">
          <Input value={form.fundedAmount} onChange={num('fundedAmount')} type="number" prefix="$" />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')} options={STATUS_OPTS} />
        </Field>
        <Field label="Request date">
          <Input value={form.requestDate} onChange={set('requestDate')} placeholder="2024-05-02" />
        </Field>
        <Field label="Approved date">
          <Input value={form.approvedDate} onChange={set('approvedDate')} placeholder="2024-05-10" />
        </Field>
        <Field label="Funded date">
          <Input value={form.fundedDate} onChange={set('fundedDate')} placeholder="2024-05-15" />
        </Field>
        <Field label="Lender">
          <Input value={form.lender} onChange={set('lender')} placeholder="Arbor Realty Trust" />
        </Field>
        <Field label="Notes" span={2}>
          <Textarea value={form.notes} onChange={set('notes')} placeholder="Scope, conditions, retainage notes…" />
        </Field>
      </div>
    </Modal>
  );
}

export function DrawsTabDb() {
  const utils = trpc.useUtils();
  const { data: draws = [], isLoading } = trpc.capitalStack.listDraws.useQuery({});
  const { data: budgetLines = [] } = trpc.budget.listLines.useQuery({});

  // Derive contingency from budget lines
  const contingencyLines = budgetLines.filter((l) => l.isContingency);
  const hardContingency = contingencyLines
    .filter((l) => l.groupId && l.groupId.length > 0)
    .reduce((s, l) => s + Number(l.budgetAmount || 0), 0);
  const softContingency = budgetLines
    .filter((l) => l.isContingency === false && l.name && l.name.toLowerCase().includes('contingency'))
    .reduce((s, l) => s + Number(l.budgetAmount || 0), 0);
  // Total contingency from lines marked isContingency
  const totalContingency = contingencyLines.reduce((s, l) => s + Number(l.budgetAmount || 0), 0);
  // Drawn from funded draws as a proxy
  const totalFundedForContingency = draws
    .filter((d) => d.status === 'funded')
    .reduce((s, d) => s + Number(d.fundedAmount || d.requestAmount || 0), 0);
  const contingencyUsedPct = totalContingency > 0 ? Math.min((totalFundedForContingency / totalContingency) * 100, 100) : 0;
  const addMut = trpc.capitalStack.addDraw.useMutation({
    onSuccess: () => utils.capitalStack.listDraws.invalidate(),
  });
  const updateMut = trpc.capitalStack.updateDraw.useMutation({
    onSuccess: () => utils.capitalStack.listDraws.invalidate(),
  });
  const deleteMut = trpc.capitalStack.deleteDraw.useMutation({
    onSuccess: () => utils.capitalStack.listDraws.invalidate(),
  });

  const [modal, setModal] = React.useState({ open: false, draw: null });
  const openAdd = () => setModal({ open: true, draw: null });
  const openEdit = (draw) => setModal({ open: true, draw });
  const closeModal = () => setModal({ open: false, draw: null });

  const handleSave = (form) => {
    if (form.id) {
      updateMut.mutate({
        id: form.id,
        label: form.label || undefined,
        requestDate: form.requestDate || undefined,
        approvedDate: form.approvedDate || undefined,
        fundedDate: form.fundedDate || undefined,
        requestAmount: form.requestAmount || undefined,
        approvedAmount: form.approvedAmount || undefined,
        fundedAmount: form.fundedAmount || undefined,
        status: form.status || undefined,
        lender: form.lender || undefined,
        notes: form.notes || undefined,
      });
    } else {
      addMut.mutate({
        drawNumber: form.drawNumber,
        label: form.label || undefined,
        requestDate: form.requestDate || undefined,
        requestAmount: form.requestAmount || undefined,
        status: form.status || 'draft',
        lender: form.lender || undefined,
        notes: form.notes || undefined,
      });
    }
    closeModal();
  };

  const handleDelete = (id) => {
    deleteMut.mutate({ id });
    closeModal();
  };

  const sortedDraws = [...draws].sort((a, b) => b.drawNumber - a.drawNumber);

  // Summary stats
  const totalFunded = draws
    .filter((d) => d.status === 'funded')
    .reduce((s, d) => s + Number(d.fundedAmount || d.requestAmount || 0), 0);
  const totalPending = draws
    .filter((d) => d.status === 'submitted' || d.status === 'approved')
    .reduce((s, d) => s + Number(d.requestAmount || 0), 0);
  const totalDraft = draws
    .filter((d) => d.status === 'draft')
    .reduce((s, d) => s + Number(d.requestAmount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
      {/* Summary KPIs */}
      <div className="grid-kpis" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric">
          <div className="metric-label"><Icon name="dollar" size={11} /> Total draws</div>
          <div className="metric-value-mono">{draws.length}</div>
          <div className="metric-foot"><span className="muted">{draws.filter((d) => d.status === 'funded').length} funded</span></div>
        </div>
        <div className="metric">
          <div className="metric-label"><Icon name="check" size={11} /> Total funded</div>
          <div className="metric-value-mono">{fmtUSD(totalFunded, { compact: true })}</div>
          <div className="metric-foot"><span className="muted">from lender</span></div>
        </div>
        <div className="metric">
          <div className="metric-label"><Icon name="clock" size={11} /> Pending review</div>
          <div className="metric-value-mono">{fmtUSD(totalPending, { compact: true })}</div>
          <div className="metric-foot">
            <span className="pill warn no-dot" style={{ fontSize: 10 }}>
              {draws.filter((d) => d.status === 'submitted' || d.status === 'approved').length} draws
            </span>
          </div>
        </div>
        <div className="metric">
          <div className="metric-label"><Icon name="doc" size={11} /> In draft</div>
          <div className="metric-value-mono">{fmtUSD(totalDraft, { compact: true })}</div>
          <div className="metric-foot">
            <span className="muted">{draws.filter((d) => d.status === 'draft').length} draft draws</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 360px' }}>
        {/* Draws table */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Lender draws</div>
              <div className="card-sub">{draws.length} draw requests · DB-backed</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              <Icon name="plus" size={12} /> Request draw
            </button>
          </div>
          <div className="card-body-flush">
            {isLoading ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-faint)' }}>Loading draws…</div>
            ) : sortedDraws.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-faint)' }}>
                <Icon name="dollar" size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
                <div style={{ fontSize: 14 }}>No draws yet</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Click "Request draw" to add the first draw.</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Draw</th>
                    <th>Date</th>
                    <th className="num">Request</th>
                    <th className="num">Funded</th>
                    <th>Status</th>
                    <th>Lender</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sortedDraws.map((d) => {
                    const cls = DRAW_STATUS_CLS[d.status] || 'neutral';
                    const statusLabel = DRAW_STATUS_LABEL[d.status] || d.status;
                    const dateStr = d.requestDate
                      ? new Date(d.requestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : '—';
                    const reqAmt = Number(d.requestAmount || 0);
                    const fundedAmt = Number(d.fundedAmount || 0);
                    return (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 500 }}>
                          {d.label || `Draw ${String(d.drawNumber).padStart(2, '0')}`}
                        </td>
                        <td className="muted mono" style={{ fontSize: 12 }}>{dateStr}</td>
                        <td className="num mono">{reqAmt > 0 ? fmtUSD(reqAmt, { compact: true }) : '—'}</td>
                        <td className="num mono">{fundedAmt > 0 ? fmtUSD(fundedAmt, { compact: true }) : '—'}</td>
                        <td><span className={`pill ${cls} no-dot`}>{statusLabel}</span></td>
                        <td className="muted" style={{ fontSize: 12 }}>{d.lender || '—'}</td>
                        <td>
                          <button className="iconbtn" onClick={() => openEdit(d)} title="Edit draw">
                            <Icon name="edit" size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Contingency sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">Draw timeline</div>
            </div>
            <div className="card-body" style={{ padding: '12px 16px' }}>
              {sortedDraws.slice(0, 6).map((d, i) => {
                const cls = DRAW_STATUS_CLS[d.status] || 'neutral';
                const amt = Number(d.requestAmount || d.fundedAmount || 0);
                return (
                  <div
                    key={d.id}
                    className="row"
                    style={{
                      gap: 10,
                      padding: '8px 0',
                      borderBottom: i < Math.min(sortedDraws.length - 1, 5) ? '1px solid var(--border)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: `var(--signal-${cls === 'pos' ? 'pos' : cls === 'warn' ? 'warn' : cls === 'neg' ? 'neg' : 'info'}-soft)`,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        name={d.status === 'funded' ? 'check' : d.status === 'submitted' ? 'clock' : 'doc'}
                        size={12}
                        style={{
                          color: `var(--signal-${cls === 'pos' ? 'pos' : cls === 'warn' ? 'warn' : cls === 'neg' ? 'neg' : 'info'})`,
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>
                        {d.label || `Draw ${String(d.drawNumber).padStart(2, '0')}`}
                      </div>
                      <div className="faint" style={{ fontSize: 11 }}>
                        {d.requestDate
                          ? new Date(d.requestDate).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </div>
                    </div>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 500 }}>
                      {amt > 0 ? fmtUSD(amt, { compact: true }) : '—'}
                    </div>
                  </div>
                );
              })}
              {sortedDraws.length === 0 && (
                <div className="muted" style={{ fontSize: 12, textAlign: 'center', padding: '16px 0' }}>
                  No draws yet
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Contingency</div>
            </div>
            <div className="card-body">
              {totalContingency > 0 ? (
                <>
                  <div className="row-between">
                    <span className="muted" style={{ fontSize: 12 }}>Total contingency (from budget)</span>
                    <span className="mono" style={{ fontWeight: 500 }}>{fmtUSD(totalContingency, { compact: true })}</span>
                  </div>
                  <div className="bar" style={{ marginTop: 8 }}>
                    <div className="bar-fill warn" style={{ width: `${contingencyUsedPct}%` }} />
                  </div>
                  <div className="row-between" style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
                    <span>{fmtUSD(totalFundedForContingency, { compact: true })} funded draws</span>
                    <span>{fmtUSD(Math.max(totalContingency - totalFundedForContingency, 0), { compact: true })} remaining</span>
                  </div>
                  <div className="div" />
                  <div className="row-between">
                    <span className="muted" style={{ fontSize: 12 }}>Contingency lines</span>
                    <span className="mono" style={{ fontWeight: 500 }}>{contingencyLines.length}</span>
                  </div>
                  {contingencyLines.slice(0, 3).map((l) => (
                    <div key={l.id} className="row-between" style={{ fontSize: 11, marginTop: 4 }}>
                      <span className="muted">{l.name}</span>
                      <span className="mono">{fmtUSD(Number(l.budgetAmount || 0), { compact: true })}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="muted" style={{ fontSize: 12, textAlign: 'center', padding: '8px 0' }}>No contingency lines in budget</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DrawModal
        open={modal.open}
        draw={modal.draw}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
