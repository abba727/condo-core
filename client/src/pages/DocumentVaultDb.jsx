import React from 'react';
import { trpc } from '@/lib/trpc';
/* global Icon, PageHead */

const CATEGORIES = [
  'Legal & offering',
  'Permits & filings',
  'Construction',
  'Financial',
  'Insurance / COI',
  'Marketing',
  'Closeout',
  'Other',
];

const TYPE_ICONS = {
  'application/pdf':        { ext: 'PDF', bg: 'var(--signal-neg-soft)',  fg: 'var(--signal-neg)' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'XLS', bg: 'var(--signal-pos-soft)', fg: 'var(--signal-pos)' },
  'application/vnd.ms-excel': { ext: 'XLS', bg: 'var(--signal-pos-soft)', fg: 'var(--signal-pos)' },
  'image/jpeg':             { ext: 'JPG', bg: 'var(--signal-warn-soft)', fg: 'var(--signal-warn)' },
  'image/png':              { ext: 'PNG', bg: 'var(--signal-warn-soft)', fg: 'var(--signal-warn)' },
  'application/msword':     { ext: 'DOC', bg: 'var(--signal-info-soft)', fg: 'var(--signal-info)' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOC', bg: 'var(--signal-info-soft)', fg: 'var(--signal-info)' },
};

function getTypeIcon(mimeType) {
  if (!mimeType) return { ext: 'FILE', bg: 'var(--bg-sunk)', fg: 'var(--text-faint)' };
  if (TYPE_ICONS[mimeType]) return TYPE_ICONS[mimeType];
  if (mimeType.startsWith('image/')) return { ext: 'IMG', bg: 'var(--signal-warn-soft)', fg: 'var(--signal-warn)' };
  if (mimeType.includes('pdf')) return { ext: 'PDF', bg: 'var(--signal-neg-soft)', fg: 'var(--signal-neg)' };
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return { ext: 'XLS', bg: 'var(--signal-pos-soft)', fg: 'var(--signal-pos)' };
  return { ext: 'FILE', bg: 'var(--bg-sunk)', fg: 'var(--text-faint)' };
}

function fmtBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadModal({ open, onClose, onUpload, isUploading }) {
  const [form, setForm] = React.useState({ name: '', category: CATEGORIES[0], version: 'v1.0', notes: '' });
  const [file, setFile] = React.useState(null);
  const fileRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setForm({ name: '', category: CATEGORIES[0], version: 'v1.0', notes: '' });
      setFile(null);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) {
      setFile(picked);
      if (!form.name) setForm((f) => ({ ...f, name: picked.name }));
    }
  };

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onUpload({ form, file });
  };

  return (
    <div
      style={{
        display: open ? 'flex' : 'none',
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg)',
        borderRadius: 12,
        width: 560,
        maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Upload document</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Add a new document to the vault
          </div>
        </div>
        <div style={{ padding: 24 }}>
          {/* File drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: 8,
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 16,
              background: file ? 'var(--signal-pos-soft)' : 'var(--bg-sunk)',
              transition: 'all 0.15s',
            }}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <Icon name="check" size={20} style={{ color: 'var(--signal-pos)', marginBottom: 6 }} />
                <div style={{ fontSize: 13, fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{fmtBytes(file.size)}</div>
              </>
            ) : (
              <>
                <Icon name="upload" size={20} style={{ color: 'var(--text-faint)', marginBottom: 6 }} />
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click to select a file</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>PDF, DOCX, XLSX, images</div>
              </>
            )}
          </div>

          <div className="form-grid">
            <div style={{ gridColumn: 'span 2' }}>
              <div className="field-label">Document name</div>
              <input
                className="input"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                placeholder="Offering Plan — 712 Driggs (Effective).pdf"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div className="field-label">Category</div>
              <select
                className="input"
                value={form.category}
                onChange={(e) => set('category')(e.target.value)}
                style={{ width: '100%' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="field-label">Version</div>
              <input
                className="input"
                value={form.version}
                onChange={(e) => set('version')(e.target.value)}
                placeholder="v1.0"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div className="field-label">Notes</div>
              <textarea
                className="input"
                value={form.notes}
                onChange={(e) => set('notes')(e.target.value)}
                placeholder="Description or context for this document…"
                rows={2}
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
        }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={isUploading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!form.name.trim() || isUploading}
          >
            {isUploading ? 'Uploading…' : 'Upload document'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentVaultDb() {
  const utils = trpc.useUtils();
  const { data: docs = [], isLoading } = trpc.documents.list.useQuery({});
  const addMut = trpc.documents.add.useMutation({
    onSuccess: () => utils.documents.list.invalidate(),
  });
  const deleteMut = trpc.documents.delete.useMutation({
    onSuccess: () => utils.documents.list.invalidate(),
  });

  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const [view, setView] = React.useState('list');
  const [uploadModal, setUploadModal] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  // Filter docs
  const filtered = docs.filter((d) => {
    if (category && d.category !== category) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !(d.category || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Category counts
  const catCounts = React.useMemo(() => {
    const counts = {};
    for (const d of docs) {
      const cat = d.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [docs]);

  const handleUpload = async ({ form, file }) => {
    setIsUploading(true);
    try {
      let fileKey = null;
      let fileUrl = null;
      let mimeType = null;
      let sizeBytes = null;

      if (file) {
        // Upload file via fetch to a server endpoint
        const uploadForm = new FormData();
        uploadForm.append('file', file);
        uploadForm.append('name', form.name);
        const resp = await fetch('/api/upload-document', {
          method: 'POST',
          body: uploadForm,
          credentials: 'include',
        });
        if (resp.ok) {
          const result = await resp.json();
          fileKey = result.key;
          fileUrl = result.url;
          mimeType = file.type;
          sizeBytes = file.size;
        }
      }

      await addMut.mutateAsync({
        name: form.name,
        category: form.category || undefined,
        fileKey: fileKey || undefined,
        fileUrl: fileUrl || undefined,
        mimeType: mimeType || undefined,
        sizeBytes: sizeBytes || undefined,
        version: form.version || undefined,
        notes: form.notes || undefined,
        status: 'current',
      });
      setUploadModal(false);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    deleteMut.mutate({ id });
    setConfirmDelete(null);
  };

  return (
    <>
      <PageHead
        eyebrow="Document vault"
        title="712 Driggs · Documents"
        sub="Centralized document repository for the 712 Driggs project. Upload, organize, and track all project documents."
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setView(view === 'list' ? 'grid' : 'list')}>
              <Icon name={view === 'list' ? 'grid' : 'list'} size={13} />
              {view === 'list' ? ' Grid' : ' List'}
            </button>
            <button className="btn btn-primary" onClick={() => setUploadModal(true)}>
              <Icon name="upload" size={13} /> Upload
            </button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Folders
              </div>
            </div>
            <div style={{ padding: '4px 0' }}>
              <button
                className={`vault-folder ${!category ? 'active' : ''}`}
                onClick={() => setCategory(null)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
              >
                <Icon name="folder" size={13} />
                <span style={{ flex: 1, textAlign: 'left' }}>All documents</span>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{docs.length}</span>
              </button>
            </div>
            <div style={{ padding: '8px 16px 6px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Categories
              </div>
            </div>
            <div style={{ padding: '4px 0 8px' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`vault-folder ${category === c ? 'active' : ''}`}
                  onClick={() => setCategory(c === category ? null : c)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
                >
                  <Icon name="file" size={12} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  {catCounts[c] ? (
                    <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{catCounts[c]}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">
                  {category || 'All documents'}
                </div>
                <div className="card-sub">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="card-actions">
                <div className="topbar-search" style={{ width: 220 }}>
                  <Icon name="search" size={13} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents…"
                    style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, flex: 1, color: 'var(--text)' }}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-faint)' }}>
                Loading documents…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-faint)' }}>
                <Icon name="folder" size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <div style={{ fontSize: 14 }}>
                  {search ? 'No documents match your search' : 'No documents yet'}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {!search && 'Click "Upload" to add the first document.'}
                </div>
              </div>
            ) : view === 'list' ? (
              <div className="card-body-flush">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Version</th>
                      <th>Size</th>
                      <th>Added</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => {
                      const type = getTypeIcon(d.mimeType);
                      const addedDate = d.createdAt
                        ? new Date(d.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: '2-digit', year: 'numeric',
                          })
                        : '—';
                      return (
                        <tr key={d.id}>
                          <td>
                            <div className="row" style={{ gap: 10 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: 6,
                                background: type.bg, color: type.fg,
                                display: 'grid', placeItems: 'center',
                                fontSize: 9, fontWeight: 700, flexShrink: 0,
                                letterSpacing: '0.04em',
                              }}>{type.ext}</div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</div>
                                {d.uploadedBy && (
                                  <div className="faint" style={{ fontSize: 11 }}>{d.uploadedBy}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {d.category && (
                              <span className="pill neutral no-dot">{d.category}</span>
                            )}
                          </td>
                          <td>
                            <span className={`pill no-dot ${
                              d.status === 'current' ? 'pos' :
                              d.status === 'draft' ? 'warn' :
                              d.status === 'archived' ? 'neutral' :
                              'info'
                            }`}>
                              {d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : '—'}
                            </span>
                          </td>
                          <td className="mono" style={{ fontSize: 12 }}>{d.version || '—'}</td>
                          <td className="num mono faint" style={{ fontSize: 12 }}>{fmtBytes(d.sizeBytes)}</td>
                          <td className="muted" style={{ fontSize: 12 }}>{addedDate}</td>
                          <td>
                            <div className="row" style={{ gap: 2 }}>
                              {d.fileUrl && (
                                <a
                                  href={d.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="iconbtn"
                                  title="Download"
                                >
                                  <Icon name="download" size={13} />
                                </a>
                              )}
                              <button
                                className="iconbtn"
                                onClick={() => setConfirmDelete(d)}
                                title="Delete"
                                style={{ color: 'var(--signal-neg)' }}
                              >
                                <Icon name="trash" size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body" style={{ padding: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {filtered.map((d) => {
                    const type = getTypeIcon(d.mimeType);
                    const addedDate = d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: '2-digit', year: 'numeric',
                        })
                      : '—';
                    return (
                      <div key={d.id} className="vendor-card" style={{ padding: 14 }}>
                        <div className="row-between" style={{ marginBottom: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 7,
                            background: type.bg, color: type.fg,
                            display: 'grid', placeItems: 'center',
                            fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.04em',
                          }}>{type.ext}</div>
                          <div className="row" style={{ gap: 4 }}>
                            {d.fileUrl && (
                              <a href={d.fileUrl} target="_blank" rel="noreferrer" className="iconbtn">
                                <Icon name="download" size={12} />
                              </a>
                            )}
                            <button
                              className="iconbtn"
                              onClick={() => setConfirmDelete(d)}
                              style={{ color: 'var(--signal-neg)' }}
                            >
                              <Icon name="trash" size={12} />
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {d.name}
                        </div>
                        {d.category && (
                          <div className="faint" style={{ fontSize: 11, marginBottom: 6 }}>{d.category}</div>
                        )}
                        <div className="row-between" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          <span>{addedDate}</span>
                          <span className="mono">{fmtBytes(d.sizeBytes)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <UploadModal
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {/* Confirm delete */}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}
        >
          <div style={{
            background: 'var(--bg)',
            borderRadius: 10,
            padding: 24,
            width: 380,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Delete document?</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              "{confirmDelete.name}" will be permanently removed from the vault.
            </div>
            <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--signal-neg)', borderColor: 'var(--signal-neg)' }}
                onClick={() => handleDelete(confirmDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
