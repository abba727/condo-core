/**
 * CondoCore style reminder: Quiet Brutalist Enterprise. Keep the fixed command rail,
 * ledger-like operational density, warm stone/slate palette, compact status pills,
 * and precise construction-document controls consistent across all converted pages.
 */
import React from 'react';
import './condocore.css';
import {
  VendorStoreProvider,
  VendorsPage as VendorsPageImpl,
  VendorDetailPage as VendorDetailPageImpl,
} from './VendorsModule.jsx';
import {
  BudgetStoreProvider,
  BudgetTab as BudgetTabNew,
  ExpenseStoreProvider2,
  ExpensesTab as ExpensesTabNew,
  SearchableSelect,
} from './FinancialsModule.jsx';
import {
  DRIGGS_712_PROJECT,
  DRIGGS_712_PLAN_TASKS,
  DRIGGS_712_PLAN_MONTHS,
  DRIGGS_712_TEAM,
  DRIGGS_712_BUDGET,
  DRIGGS_712_EXPENSES,
  DRIGGS_712_CONTRACTS,
  DRIGGS_712_INSURANCES,
  DRIGGS_712_PERMITS,
  DRIGGS_712_LOOKUP,
  DRIGGS_712_FINANCIAL_SUMMARY,
  DRIGGS_712_SEED,
} from '../data/driggs712.js';

/* global React */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ============ ICONS (lucide-style, 16px default) ============
const Icon = ({ name, size = 16, stroke = 1.6, ...rest }) => {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
};

const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15" />
      <path d="M15 9h3a2 2 0 0 1 2 2v10" />
      <path d="M9 8h2M9 12h2M9 16h2" />
      <path d="M3 21h18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
      <path d="m2 18 10 5 10-5" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5M12 3v12" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5M12 15V3" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />,
  more: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </>
  ),
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l18 18" />,
  alert: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  doc: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6Z" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M14 7h7v7" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </>
  ),
  ext: <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />,
  refresh: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  command: <path d="M18 6V4a2 2 0 1 0-2 2h2zm0 0v12m0 0v2a2 2 0 1 0 2-2h-2zm0 0H6m0 0v2a2 2 0 1 1-2-2h2zm0 0V6m0 0V4a2 2 0 1 1 2 2H6zm0 0h12" />,
  pinned: <path d="M12 17v5M9 10.76V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5.76l1.83 4.15A1 1 0 0 1 16 16H8a1 1 0 0 1-.83-1.09Z" />,
  flag: (
    <>
      <path d="M4 22V4M4 4h13l-2 5 2 5H4" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </>
  ),
  percent: (
    <>
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="m5 19 14-14" />
    </>
  ),
  sort: <path d="M3 6h18M7 12h10M11 18h2" />,
};

// ============ DATA ============
const PROJECTS = [DRIGGS_712_PROJECT];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "details", label: "Project Details", icon: "building" },
  { id: "plan", label: "Project Plan", icon: "calendar", badge: String(DRIGGS_712_PLAN_TASKS.filter((task) => task.name && !task.name.startsWith('Reserved tracker row')).length) },
  { id: "stacking", label: "Stacking Plan", icon: "layers" },
  { id: "vault", label: "Document Vault", icon: "folder", badge: "147" },
  { id: "financials", label: "Financials", icon: "dollar" },
  { id: "vendors", label: "Vendors", icon: "users", badge: String(new Set([...DRIGGS_712_CONTRACTS.map((row) => row.Vendor), ...DRIGGS_712_TEAM.map((row) => row.Company || row.Contact), ...DRIGGS_712_LOOKUP.map((row) => row["Company Name"] || row["Company | Name"]), ...DRIGGS_712_INSURANCES.map((row) => row.Company), ...DRIGGS_712_PERMITS.map((row) => row.Contractor)].filter(Boolean)).size) },
];

const fmtUSD = (n, opts = {}) => {
  const { compact = false, decimals = 0, sign = false } = opts;
  const prefix = sign && n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (compact) {
    if (abs >= 1e9) return `${prefix}$${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${prefix}$${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${prefix}$${(abs / 1e3).toFixed(0)}K`;
  }
  return `${prefix}$${abs.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

const fmtPct = (n) => `${n.toFixed(0)}%`;

// ============ Sparkline ============
const Sparkline = ({ data, color = "currentColor", w = 80, h = 28 }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={area} fill={color} opacity="0.08" />
    </svg>
  );
};

// ============ Avatars helper ============
const Avatars = ({ people = [] }) => (
  <div className="avatars">
    {people.map((p, i) => (
      <span className="av" key={i} title={p.name}>
        {p.initials}
      </span>
    ))}
  </div>
);

// expose to other scripts
Object.assign(window, {
  Icon,
  PROJECTS,
  NAV,
  DRIGGS_712_SEED,
  DRIGGS_712_PROJECT,
  DRIGGS_712_PLAN_TASKS,
  DRIGGS_712_PLAN_MONTHS,
  DRIGGS_712_TEAM,
  DRIGGS_712_BUDGET,
  DRIGGS_712_EXPENSES,
  DRIGGS_712_CONTRACTS,
  DRIGGS_712_INSURANCES,
  DRIGGS_712_PERMITS,
  DRIGGS_712_LOOKUP,
  DRIGGS_712_FINANCIAL_SUMMARY,
  fmtUSD,
  fmtPct,
  Sparkline,
  Avatars,
});
/* global React, NAV, PROJECTS, Icon */
const { useState: useShellState } = React;

function Rail({ active, onNav, project, onProjectSwitch }) {
  return (
    <aside className="rail">
      <div className="rail-brand">
        <div className="rail-brand-mark">CC</div>
        <div className="stack-tight">
          <div className="rail-brand-name">CondoCore</div>
          <div className="rail-brand-sub">Development OS</div>
        </div>
      </div>

      <div className="rail-project">
        <div className="rail-project-label">Active project</div>
        <button className="project-switch" onClick={onProjectSwitch}>
          <div className="project-switch-icon">
            <Icon name="building" size={14} />
          </div>
          <div className="project-switch-meta">
            <div className="project-switch-name">{project.full}</div>
            <div className="project-switch-addr">{project.address}</div>
          </div>
          <Icon name="chevronDown" size={14} style={{ color: "var(--text-faint)" }} />
        </button>
      </div>

      <nav className="rail-nav">
        <div className="rail-nav-section">
          <div className="rail-nav-label">Workspace</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`rail-link ${active === item.id ? "active" : ""}`}
              onClick={() => onNav(item.id)}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
              {item.badge && <span className="rail-link-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        <div className="rail-nav-section">
          <div className="rail-nav-label">Pinned</div>
          <button className="rail-link">
            <Icon name="pinned" size={15} />
            <span>GC contract — Apex</span>
          </button>
          <button className="rail-link">
            <Icon name="pinned" size={15} />
            <span>Steel pricing memo</span>
          </button>
          <button className="rail-link">
            <Icon name="pinned" size={15} />
            <span>Phase II draw</span>
          </button>
        </div>
      </nav>

      <div className="rail-foot">
        <div className="rail-foot-avatar">PD</div>
        <div className="rail-foot-meta">
          <div className="rail-foot-name">Priya Desai</div>
          <div className="rail-foot-role">Project Director</div>
        </div>
        <button className="rail-foot-action" title="Settings">
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ crumbs = [], onTheme, theme, onTweaks }) {
  const isDark = theme.includes("dark");
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="crumbs-sep">/</span>}
            {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </div>

      <button className="topbar-search">
        <Icon name="search" size={14} />
        <span>Search projects, vendors, docs…</span>
        <kbd>⌘K</kbd>
      </button>

      <button className="topbar-icon" title={isDark ? "Light" : "Dark"} onClick={onTheme}>
        <Icon name={isDark ? "sun" : "moon"} size={15} />
      </button>
      <button className="topbar-icon" title="Notifications" style={{ position: "relative" }}>
        <Icon name="bell" size={15} />
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 7,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--signal-neg)",
          }}
        />
      </button>
    </div>
  );
}

function PageHead({ eyebrow, title, sub, actions }) {
  return (
    <div className="page-head">
      <div className="page-head-meta">
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

Object.assign(window, { Rail, TopBar, PageHead });
/* global React, Icon */

const { useEffect: useModalEffect } = React;

function Modal({ open, onClose, title, subtitle, children, footer, width = 560 }) {
  useModalEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
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
    </div>
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

function Input({ value, onChange, placeholder, type = "text", prefix, suffix }) {
  return (
    <div className="form-input-wrap">
      {prefix && <span className="form-input-prefix">{prefix}</span>}
      <input
        type={type}
        className="form-input"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: prefix ? 24 : undefined, paddingRight: suffix ? 30 : undefined }}
      />
      {suffix && <span className="form-input-suffix">{suffix}</span>}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="form-input" value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      className="form-input"
      rows={rows}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{ resize: "vertical", fontFamily: "inherit" }}
    />
  );
}

Object.assign(window, { Modal, Field, Input, Select, Textarea });

// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', noDeckControls = false, children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(
    () => typeof document !== 'undefined' && !!document.querySelector('deck-stage'),
    [],
  );
  // Hide the toggle until the host has actually enabled the rail (the
  // __omelette_rail_enabled window message, posted only when the
  // omelette_deck_rail_enabled flag is on for this user). The initial read
  // covers TweaksPanel mounting after the message already arrived; the
  // listener covers the common case of mounting first.
  const [railEnabled, setRailEnabled] = React.useState(
    () => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled,
  );
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = (e) => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try { return localStorage.getItem('deck-stage.railVisible') !== '0'; } catch (e) { return true; }
  });
  const toggleRail = (on) => {
    setRailVisible(on);
    window.postMessage({ type: '__deck_rail_visible', on }, '*');
  };
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-noncommentable=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
          {hasDeckStage && railEnabled && !noDeckControls && (
            <TweakSection label="Deck">
              <TweakToggle label="Thumbnail rail" value={railVisible} onChange={toggleRail} />
            </TweakSection>
          )}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});
/* global React, Icon, PageHead, PROJECTS, fmtUSD, fmtPct, Sparkline, Avatars */

function DashboardPage() {
  const project = PROJECTS[0];
  const portfolio = {
    active: PROJECTS.length,
    budget: project.budget,
    spent: project.spent,
    remaining: project.budget - project.spent,
    vendors: new Set([...DRIGGS_712_CONTRACTS.map((row) => row.Vendor), ...DRIGGS_712_TEAM.map((row) => row.Company || row.Contact), ...DRIGGS_712_LOOKUP.map((row) => row["Company Name"] || row["Company | Name"]), ...DRIGGS_712_INSURANCES.map((row) => row.Company), ...DRIGGS_712_PERMITS.map((row) => row.Contractor)].filter(Boolean)).size,
    burnRate: DRIGGS_712_EXPENSES.reduce((sum, row) => sum + (Number(row.Debit) || 0), 0),
    coiAlerts: DRIGGS_712_INSURANCES.filter((row) => row.Status && row.Status !== "Active").length,
  };

  const burnSpark = [18, 21, 19, 24, 27, 31, 29, 34, 38, 35, 42, 41];
  const occupancySpark = [4, 6, 9, 12, 16, 18, 20, 21, 23, 24, 26, 27];

  return (
    <>
      <PageHead
        eyebrow="Executive overview"
        title="712 Driggs command"
        sub="Workbook-seeded visibility into the 712 Driggs project — capital exposure, near-term milestones, vendor compliance, and operational pulse."
        actions={
          <>
            <button className="btn btn-secondary">
              <Icon name="upload" size={13} /> Upload
            </button>
            <button className="btn btn-secondary">
              <Icon name="download" size={13} /> Export
            </button>
            <button className="btn btn-primary">
              <Icon name="plus" size={13} /> New task
            </button>
          </>
        }
      />

      <div className="grid-kpis">
        <div className="metric">
          <div className="metric-label">
            <Icon name="building" size={11} /> Active project
          </div>
          <div className="metric-value">{portfolio.active}</div>
          <div className="metric-foot">
            <span className="metric-delta up">
              <Icon name="check" size={11} /> seeded
            </span>
            <span>from tracker workbook</span>
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">
            <Icon name="dollar" size={11} /> Capital deployed
          </div>
          <div className="metric-value-mono">
            ${(portfolio.spent / 1e6).toFixed(1)}M
          </div>
          <div className="bar" style={{ marginTop: 8 }}>
            <div
              className="bar-fill accent"
              style={{ width: `${(portfolio.spent / portfolio.budget) * 100}%` }}
            />
          </div>
          <div className="metric-foot">
            <span className="muted">
              of {fmtUSD(portfolio.budget, { compact: true })} approved
            </span>
            <span style={{ marginLeft: "auto" }} className="tabular">
              {fmtPct((portfolio.spent / portfolio.budget) * 100)}
            </span>
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">
            <Icon name="trend" size={11} /> Weekly burn
          </div>
          <div className="row" style={{ alignItems: "flex-end", gap: 12, marginTop: 4 }}>
            <div className="metric-value-mono" style={{ marginTop: 0 }}>
              {fmtUSD(portfolio.burnRate, { compact: true })}
            </div>
            <Sparkline data={burnSpark} color="var(--accent)" w={70} h={28} />
          </div>
          <div className="metric-foot">
            <span className="metric-delta up">
              <Icon name="arrowUp" size={11} /> 25 entries
            </span>
            <span>from workbook ledger</span>
          </div>
        </div>

        <div className="metric">
          <div className="metric-label">
            <Icon name="shield" size={11} /> Vendor compliance
          </div>
          <div className="row" style={{ alignItems: "flex-end", gap: 12, marginTop: 4 }}>
            <div className="metric-value-mono" style={{ marginTop: 0 }}>
              {portfolio.vendors - portfolio.coiAlerts}<span className="faint" style={{ fontSize: 14 }}>/{portfolio.vendors}</span>
            </div>
            <span className="pill pos no-dot" style={{ marginLeft: "auto" }}>
              {portfolio.coiAlerts ? `${portfolio.coiAlerts} COI alerts` : "All COIs current"}
            </span>
          </div>
          <div className="metric-foot">
            <span>Insurance workbook · {DRIGGS_712_INSURANCES.length} records</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Project pulse</div>
              <div className="card-sub">Live workbook spend vs. budget for the active project</div>
            </div>
            <div className="card-actions">
              <button className="iconbtn" title="Filter">
                <Icon name="filter" size={14} />
              </button>
              <button className="iconbtn" title="More">
                <Icon name="more" size={14} />
              </button>
            </div>
          </div>
          <div className="card-body-flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Phase</th>
                  <th className="num">Budget</th>
                  <th className="num">Spent</th>
                  <th>Progress</th>
                  <th className="num">Target</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: "var(--accent-soft)",
                            color: "var(--accent-soft-text)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {p.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.full}</div>
                          <div className="faint" style={{ fontSize: 11 }}>
                            {p.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`pill ${p.phaseClass} no-dot`}>{p.phase}</span>
                    </td>
                    <td className="num mono">
                      {fmtUSD(p.budget, { compact: true })}
                    </td>
                    <td className="num mono">
                      {fmtUSD(p.spent, { compact: true })}
                    </td>
                    <td style={{ width: 180 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <div className="bar" style={{ flex: 1 }}>
                          <div
                            className={`bar-fill ${
                              p.progress > 75 ? "warn" : "accent"
                            }`}
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span
                          className="tabular"
                          style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 30 }}
                        >
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="num" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {p.targetCompletion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head">
              <div className="card-title">This week</div>
              <div className="card-actions">
                <button className="linklike">View all</button>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {[
                {
                  time: "Today",
                  icon: "alert",
                  cls: "neg",
                  title: "Steel pricing memo flagged",
                  sub: "Phase II structural · +8.2% over forecast",
                },
                {
                  time: "Today",
                  icon: "doc",
                  cls: "info",
                  title: "Expense NF-1048 awaiting approval",
                  sub: "Apex Building Group · $284,500",
                },
                {
                  time: "Yesterday",
                  icon: "check",
                  cls: "pos",
                  title: "Executed GC contract uploaded",
                  sub: "Wonder Works Construction · v3.2",
                },
                {
                  time: "Mon",
                  icon: "calendar",
                  cls: "warn",
                  title: "DOB Approvals shifted +14d",
                  sub: "712 Driggs · Schedule refreshed",
                },
                {
                  time: "Mon",
                  icon: "users",
                  cls: "info",
                  title: "Buro Happold added 2 consultants",
                  sub: "MEP coordination phase",
                },
              ].map((it, i) => (
                <div
                  key={i}
                  className="row"
                  style={{
                    padding: "12px 16px",
                    gap: 12,
                    alignItems: "flex-start",
                    borderTop: i ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: `var(--signal-${
                        it.cls === "pos" ? "pos" : it.cls === "neg" ? "neg" : it.cls === "warn" ? "warn" : "info"
                      }-soft)`,
                      color: `var(--signal-${
                        it.cls === "pos" ? "pos" : it.cls === "neg" ? "neg" : it.cls === "warn" ? "warn" : "info"
                      })`,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={it.icon} size={13} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{it.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {it.sub}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                    {it.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Sales velocity</div>
              <span className="pill pos no-dot">On pace</span>
            </div>
            <div className="card-body">
              <div className="row" style={{ alignItems: "flex-end", gap: 16 }}>
                <div>
                  <div className="metric-value-mono" style={{ marginTop: 0 }}>
                    80<span className="faint" style={{ fontSize: 14 }}>%</span>
                  </div>
                  <div className="faint" style={{ fontSize: 11, marginTop: 2 }}>
                    Pre-sale of inventory
                  </div>
                </div>
                <Sparkline data={occupancySpark} color="var(--signal-pos)" w={140} h={42} />
              </div>
              <div className="div" />
              <div className="stack" style={{ gap: 8 }}>
                {[
                  ["Reservations", "62 units", "pos"],
                  ["Contracts out", "9 units", "info"],
                  ["Closed", "0 units", "neutral"],
                ].map(([k, v, cls]) => (
                  <div className="row-between" key={k}>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {k}
                    </span>
                    <span className={`pill ${cls} no-dot`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-head">
        <div>
          <div className="section-title">Upcoming milestones</div>
          <div className="section-sub">Next 60 days across the portfolio</div>
        </div>
        <div className="section-actions">
          <button className="btn btn-secondary btn-sm">
            <Icon name="calendar" size={12} /> Open calendar
          </button>
        </div>
      </div>

      <div className="grid-3">
        {[
          {
            date: "May 14",
            d: "in 7 days",
            title: "Phase II foundation pour",
            project: "712 Driggs",
            owner: "Wonder Works",
            cls: "warn",
          },
          {
            date: "May 22",
            d: "in 15 days",
            title: "TCO inspection — units 21–28",
            project: "Junction Lofts",
            owner: "DOB",
            cls: "info",
          },
          {
            date: "Jun 03",
            d: "in 27 days",
            title: "Quarterly draw review",
            project: "Portfolio",
            owner: "Lender · Capital One",
            cls: "neutral",
          },
          {
            date: "Jun 14",
            d: "in 38 days",
            title: "Vendor compliance audit",
            project: "Portfolio",
            owner: "Internal",
            cls: "neutral",
          },
          {
            date: "Jun 24",
            d: "in 48 days",
            title: "Curtain wall mock-up review",
            project: "Harbour & King",
            owner: "GACE Engineers",
            cls: "info",
          },
          {
            date: "Jul 02",
            d: "in 56 days",
            title: "Marketing launch — Parkside",
            project: "Parkside Residences",
            owner: "JLL",
            cls: "pos",
          },
        ].map((m, i) => (
          <div className="card" key={i}>
            <div className="card-body">
              <div className="row-between">
                <div className="serif" style={{ fontSize: 22 }}>
                  {m.date}
                </div>
                <span className={`pill ${m.cls} no-dot`}>{m.d}</span>
              </div>
              <div style={{ marginTop: 10, fontWeight: 500 }}>{m.title}</div>
              <div
                className="row"
                style={{ marginTop: 8, gap: 6, fontSize: 12, color: "var(--text-muted)" }}
              >
                <Icon name="building" size={12} />
                <span>{m.project}</span>
                <span className="dot" style={{ width: 3, height: 3 }} />
                <span>{m.owner}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

window.DashboardPage = DashboardPage;
/* global React, Icon, PageHead, PROJECTS, fmtUSD */

const UNITS = [
  { unit: "1A", type: "2BR", beds: 2, baths: 2, floor: 1, sf: 1500, line: "A", exp: "NW", price: 2150000, status: "Reserved", construction: "Rough In", statusCls: "info", consCls: "warn" },
  { unit: "1B", type: "3BR", beds: 3, baths: 2, floor: 1, sf: 1820, line: "B", exp: "NE", price: 2850000, status: "Available", construction: "Finishing", statusCls: "neutral", consCls: "info" },
  { unit: "1C", type: "2BR", beds: 2, baths: 2, floor: 1, sf: 1100, line: "C", exp: "SE", price: 1750000, status: "Available", construction: "Drywall", statusCls: "neutral", consCls: "warn" },
  { unit: "2A", type: "2BR", beds: 2, baths: 2, floor: 2, sf: 1500, line: "A", exp: "NW", price: 2225000, status: "Contract", construction: "Framing", statusCls: "info", consCls: "neutral" },
  { unit: "2B", type: "3BR", beds: 3, baths: 2, floor: 2, sf: 1820, line: "B", exp: "NE", price: 2925000, status: "Available", construction: "Punch List", statusCls: "neutral", consCls: "info" },
  { unit: "2C", type: "2BR", beds: 2, baths: 2, floor: 2, sf: 1500, line: "C", exp: "SE", price: 2275000, status: "Reserved", construction: "Complete", statusCls: "info", consCls: "pos" },
  { unit: "3A", type: "2BR", beds: 2, baths: 2, floor: 3, sf: 1500, line: "A", exp: "NW", price: 2300000, status: "Available", construction: "Framing", statusCls: "neutral", consCls: "neutral" },
  { unit: "3B", type: "PH", beds: 4, baths: 3.5, floor: 3, sf: 2980, line: "B+C", exp: "Full", price: 5950000, status: "Reserved", construction: "Framing", statusCls: "info", consCls: "neutral" },
];

function ProjectDetailsPage() {
  const project = PROJECTS[0];
  const [tab, setTab] = React.useState("overview");

  return (
    <>
      <PageHead
        eyebrow={`Project · ${project.id.toUpperCase()}-04`}
        title={project.full}
        sub={`${project.address} · R6B Contextual Residential District · Manager: Development Team`}
        actions={
          <>
            <button className="btn btn-secondary">
              <Icon name="ext" size={13} /> Public listing
            </button>
            <button className="btn btn-secondary">
              <Icon name="edit" size={13} /> Edit details
            </button>
            <button className="btn btn-primary">
              <Icon name="plus" size={13} /> Add unit
            </button>
          </>
        }
      />

      <div className="grid-kpis">
        <Kpi label="Current phase" value="Construction" sub="Jan 3, 2022 → Sep 9, 2024" icon="clock" />
        <Kpi label="Total budget" value={fmtUSD(project.budget, { compact: true })} sub={`${fmtUSD(project.spent, { compact: true })} spent · 39%`} icon="dollar" />
        <Kpi label="Inventory" value={`${project.units} units`} sub={`1 cellar · ${project.floors} floors · roof`} icon="layers" />
        <Kpi label="Target completion" value={project.targetCompletion} sub="Tracked from project plan" icon="pin" />
      </div>

      <div className="tabs">
        {[
          ["overview", "Overview"],
          ["site", "Site & acquisition"],
          ["compliance", "Compliance"],
          ["amenities", "Amenities"],
          ["units", "Units"],
        ].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab project={project} />}
      {tab === "site" && <SiteTab />}
      {tab === "compliance" && <ComplianceTab />}
      {tab === "amenities" && <AmenitiesTab />}
      {tab === "units" && <UnitsTab />}
    </>
  );
}

function Kpi({ label, value, sub, icon }) {
  return (
    <div className="metric">
      <div className="metric-label">
        <Icon name={icon} size={11} /> {label}
      </div>
      <div className="metric-value-mono" style={{ fontSize: 20 }}>{value}</div>
      {sub && <div className="metric-foot"><span>{sub}</span></div>}
    </div>
  );
}

function OverviewTab({ project }) {
  return (
    <div className="grid-2">
      <div className="stack">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Site & acquisition facts</div>
              <div className="card-sub">Persisted to project records — supports underwriting & offering plans</div>
            </div>
            <div className="card-actions">
              <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /> Edit</button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <ProjectDetailField label="Block & lot" value="Williamsburg / Block 2349 · Lot 18" />
              <ProjectDetailField label="Tax lot" value="2349-018" />
              <ProjectDetailField label="Lot size" value="14,820 SF" />
              <ProjectDetailField label="Total buildable" value="58,200 SF" />
              <ProjectDetailField label="Total sellable" value="48,400 SF" />
              <ProjectDetailField label="Purchase price" value="$10,003,500" mono />
              <ProjectDetailField label="Gross SF" value="52,005 SF" mono />
              <ProjectDetailField label="Planned units" value="30" mono />
              <ProjectDetailField label="Above-grade floors" value="4" mono />
              <ProjectDetailField label="Cellar levels" value="1" mono />
              <ProjectDetailField label="FAR utilized" value="3.92" mono />
              <ProjectDetailField label="Closing date" value="Jan 3, 2022" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Regulatory & compliance</div>
              <div className="card-sub">Filing, permit, zoning, insurance, closeout</div>
            </div>
            <div className="card-actions">
              <span className="pill pos no-dot">8 of 9 cleared</span>
            </div>
          </div>
          <div className="card-body-flush">
            <table className="table">
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Last updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Offering plan (AG)", "Accepted · effective", "Fried Frank", "Apr 18, 2024", "pos"],
                  ["DOB job", "Permitted", "EM Associates", "Mar 02, 2024", "pos"],
                  ["DOB permit", "Active permits", "ZProekt Architecture", "Mar 02, 2024", "pos"],
                  ["Zoning", "R6B verified", "Sterling PD", "Feb 14, 2024", "pos"],
                  ["Entitlement", "Active tracking", "Sterling PD", "May 02, 2024", "info"],
                  ["TCO / CO", "Not started", "—", "—", "neutral"],
                  ["Insurance / COIs", "Vendor records", "Operations", "May 06, 2024", "pos"],
                  ["Closeout", "Tracked", "—", "—", "neutral"],
                  ["Steel pricing memo", "At risk", "GACE Engineers", "May 06, 2024", "warn"],
                ].map(([track, status, owner, date, cls]) => (
                  <tr key={track}>
                    <td style={{ fontWeight: 500 }}>{track}</td>
                    <td><span className={`pill ${cls} no-dot`}>{status}</span></td>
                    <td className="muted">{owner}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{date}</td>
                    <td><button className="iconbtn"><Icon name="more" size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="stack">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Plan completion</div>
            <span className="pill info no-dot">42 tasks</span>
          </div>
          <div className="card-body">
            <div className="row" style={{ alignItems: "flex-end", gap: 12 }}>
              <div className="metric-value" style={{ fontSize: 48 }}>23<span className="faint" style={{ fontSize: 22 }}>%</span></div>
              <div style={{ flex: 1 }}>
                <div className="bar" style={{ height: 6 }}>
                  <div className="bar-fill accent" style={{ width: "23%" }} />
                </div>
                <div className="row-between" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                  <span>9 done</span>
                  <span>32 open</span>
                </div>
              </div>
            </div>
            <div className="div" />
            <div className="stack" style={{ gap: 6 }}>
              {[
                ["Planning", 9, 11, "pos"],
                ["Project definition", 0, 31, "neutral"],
              ].map(([phase, done, total, cls]) => (
                <div key={phase} className="row-between">
                  <span style={{ fontSize: 13 }}>{phase}</span>
                  <span className={`pill ${cls} no-dot`}>{done}/{total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Building amenities</div>
            <button className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /></button>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Pool", "Yes"], ["Doorman", "Yes"],
                ["Gym", "Yes"], ["Lounge", "Yes"],
                ["Kids play", "Yes"], ["Roof deck", "Mech."],
              ].map(([k, v]) => (
                <div className="row-between" key={k} style={{ padding: "6px 0" }}>
                  <span className="muted" style={{ fontSize: 13 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="div" />
            <div className="stack" style={{ gap: 8 }}>
              <ServiceRow label="Parking spaces" value="0" hint="No on-site parking" />
              <ServiceRow label="Storage units" value="0" hint="Not tracked" />
              <ServiceRow label="Elevators" value="2" hint="Passenger + service" />
              <ServiceRow label="Bike storage" value="48 racks" hint="Cellar level" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Project team</div>
            <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12} /></button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {[
              ["Wonder Works Construction", "General contractor", "WW"],
              ["ZProekt Architecture", "Architect", "ZP"],
              ["GACE Consulting Engineers", "Structural", "GA"],
              ["ME Engineers", "MEP", "ME"],
              ["Buro Happold", "Consultant", "BH"],
              ["JLL", "Sales & marketing", "JL"],
            ].map(([name, role, init]) => (
              <div key={name} className="row" style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--accent-soft)", color: "var(--accent-soft-text)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>{init}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{role}</div>
                </div>
                <button className="iconbtn"><Icon name="ext" size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailField({ label, value, mono }) {
  return (
    <div className="stack-tight">
      <div className="field-label">{label}</div>
      <div className={mono ? "mono" : ""} style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ServiceRow({ label, value, hint }) {
  return (
    <div className="row-between">
      <div>
        <div style={{ fontSize: 13 }}>{label}</div>
        <div className="faint" style={{ fontSize: 11 }}>{hint}</div>
      </div>
      <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function SiteTab() {
  return (
    <div className="card">
      <div className="card-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            ["Block & lot identifier", "Williamsburg / Block 2349 · Lot 18"],
            ["Tax lot", "2349-018"],
            ["Lot size", "14,820 SF"],
            ["Total buildable SF", "58,200"],
            ["Total sellable SF", "48,400"],
            ["Purchase price", "$10,003,500"],
            ["Gross SF", "52,005"],
            ["Planned units", "30"],
            ["Above-grade floors", "4"],
            ["Cellar levels", "1"],
            ["FAR utilized", "3.92"],
            ["Closing date", "Jan 3, 2022"],
          ].map(([k, v]) => (
            <ProjectDetailField key={k} label={k} value={v} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceTab() {
  return <div className="muted" style={{ padding: 32, textAlign: "center" }}>Detailed compliance tracking — see Overview tab for live status.</div>;
}

function AmenitiesTab() {
  return <div className="muted" style={{ padding: 32, textAlign: "center" }}>Amenity inventory & specs.</div>;
}

function UnitsTab() {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Unit inventory</div>
          <div className="card-sub">{UNITS.length} units · sortable, filterable, exportable</div>
        </div>
        <div className="card-actions">
          <button className="btn btn-secondary btn-sm"><Icon name="filter" size={12} /> Filter</button>
          <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export</button>
        </div>
      </div>
      <div className="card-body-flush">
        <table className="table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Type</th>
              <th>Floor</th>
              <th className="num">SF</th>
              <th>Line</th>
              <th>Sales</th>
              <th>Construction</th>
              <th className="num">Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {UNITS.map((u) => (
              <tr key={u.unit}>
                <td style={{ fontWeight: 600 }}>{u.unit}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{u.type}</div>
                  <div className="faint" style={{ fontSize: 11 }}>{u.beds} bed · {u.baths} bath</div>
                </td>
                <td className="mono">{u.floor}</td>
                <td className="num mono">{u.sf.toLocaleString()}</td>
                <td className="muted">{u.line} · {u.exp}</td>
                <td><span className={`pill ${u.statusCls} no-dot`}>{u.status}</span></td>
                <td><span className={`pill ${u.consCls} no-dot`}>{u.construction}</span></td>
                <td className="num mono">${(u.price / 1e6).toFixed(2)}M</td>
                <td><button className="iconbtn"><Icon name="more" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.ProjectDetailsPage = ProjectDetailsPage;
/* global React, Icon, PageHead */

const TASKS = DRIGGS_712_PLAN_TASKS;
const PLAN_MONTHS = DRIGGS_712_PLAN_MONTHS;

const PLAN_STATUS_META = {
  backlog: { id: "backlog", title: "Open", status: "Open", cls: "neutral" },
  progress: { id: "progress", title: "In progress", status: "In progress", cls: "info" },
  done: { id: "done", title: "Done", status: "Done", cls: "pos" },
  unscheduled: { id: "unscheduled", title: "Unscheduled / reserved", status: "Unscheduled", cls: "neutral" },
};

const PLAN_BUCKET_BY_STATUS = {
  open: "backlog",
  backlog: "backlog",
  "in progress": "progress",
  progress: "progress",
  done: "done",
  complete: "done",
  completed: "done",
  unscheduled: "unscheduled",
  reserved: "unscheduled",
};

const PLAN_TASK_FILTER = (task) => task.name && !task.name.startsWith("Reserved tracker row");
const DAY_MS = 24 * 60 * 60 * 1000;
const PLAN_START_DATE = new Date(DRIGGS_712_SEED.meta.scheduleStartISO || "2023-10-14T00:00:00");
const PLAN_END_DATE = new Date(DRIGGS_712_SEED.meta.scheduleEndISO || "2026-01-14T00:00:00");

function monthFloor(value) {
  const d = parsePlanDate(value);
  if (!d) return null;
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addPlanMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

const PLAN_TIMELINE_START_DATE = monthFloor(PLAN_MONTHS[0]?.iso) || PLAN_START_DATE;
const PLAN_TIMELINE_END_DATE = PLAN_MONTHS.length
  ? addPlanMonths(monthFloor(PLAN_MONTHS[PLAN_MONTHS.length - 1]?.iso) || PLAN_END_DATE, 1)
  : PLAN_END_DATE;
const PLAN_TOTAL_DAYS = Math.max(1, Math.round((PLAN_TIMELINE_END_DATE - PLAN_TIMELINE_START_DATE) / DAY_MS));

function normalizePlanText(value) {
  return String(value || "").toLowerCase().trim();
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function slugPlanValue(value, fallback = "group") {
  return String(value || fallback).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || fallback;
}

function parsePlanDate(value) {
  if (!value || value === "—" || value === "Not set") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatPlanDate(value) {
  const d = parsePlanDate(value);
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function displayPlanDate(value) {
  const d = parsePlanDate(value);
  if (!d) return "Not set";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function statusBucket(status) {
  return PLAN_BUCKET_BY_STATUS[normalizePlanText(status)] || "backlog";
}

function statusMetaForBucket(bucket) {
  return PLAN_STATUS_META[bucket] || PLAN_STATUS_META.backlog;
}

function coercePct(value, bucket) {
  const n = Number(value);
  if (Number.isFinite(n)) return Math.max(0, Math.min(1, n > 1 ? n / 100 : n));
  return bucket === "done" ? 1 : bucket === "progress" ? 0.25 : 0;
}

function normalizeTaskForPlanner(task, index = 0) {
  const bucket = task.bucket === "reserved" ? "unscheduled" : statusBucket(task.status || task.bucket);
  const meta = statusMetaForBucket(bucket);
  const pctComplete = bucket === "done" ? 1 : coercePct(task.pctComplete, bucket);
  const groupName = task.group || task.phase || "Project plan";
  const startISO = formatPlanDate(task.startISO || task.start || task.startDisplay);
  const endISO = formatPlanDate(task.endISO || task.end || task.endDisplay || startISO);
  const startDate = parsePlanDate(startISO);
  const endDate = parsePlanDate(endISO || startISO);
  const fallbackDays = Number(task.days) || (startDate && endDate ? Math.max(1, Math.round((endDate - startDate) / DAY_MS) + 1) : 1);
  return {
    ...task,
    id: String(task.id || `task-${index + 1}`),
    plannerOrder: Number.isFinite(task.plannerOrder) ? task.plannerOrder : index,
    kanbanOrder: Number.isFinite(task.kanbanOrder) ? task.kanbanOrder : (Number.isFinite(task.plannerOrder) ? task.plannerOrder : index),
    wbs: task.wbs || `${index + 1}`,
    name: task.name || `Task ${index + 1}`,
    groupId: task.groupId || slugPlanValue(groupName),
    group: groupName,
    phase: task.phase || groupName,
    owner: task.owner || "Unassigned",
    startISO: startISO || null,
    endISO: endISO || null,
    start: startISO ? startISO.slice(5) : "—",
    end: endISO ? endISO.slice(5) : "—",
    startDisplay: displayPlanDate(startISO),
    endDisplay: displayPlanDate(endISO),
    days: fallbackDays,
    bucket,
    status: meta.status,
    cls: pctComplete >= 1 ? "pos" : meta.cls,
    pctComplete,
    pctLabel: `${Math.round(pctComplete * 100)}%`,
    predecessors: Array.isArray(task.predecessors) ? task.predecessors : String(task.predecessors || task.raw?.Predecessors || task.raw?.Predecessor || "").split(",").map((x) => x.trim()).filter(Boolean),
    successors: Array.isArray(task.successors) ? task.successors : String(task.successors || task.raw?.Successors || task.raw?.Successor || task.raw?.Dependencies || task.raw?.Dependency || "").split(",").map((x) => x.trim()).filter(Boolean),
  };
}

function buildInitialGroups(tasks) {
  const map = new Map();
  tasks.forEach((task, index) => {
    const groupName = task.group || task.phase || "Project plan";
    const id = task.groupId || slugPlanValue(groupName);
    if (!map.has(id)) map.set(id, { id, name: groupName, order: map.size, collapsed: false, source: index === 0 ? "tracker" : "derived" });
  });
  return Array.from(map.values());
}

function getPeriodEndDate(period, nextPeriod, zoom) {
  if (nextPeriod?.iso) return monthFloor(nextPeriod.iso) || addPlanMonths(monthFloor(period?.iso) || PLAN_TIMELINE_START_DATE, 1);
  const start = monthFloor(period?.iso) || PLAN_TIMELINE_START_DATE;
  if (zoom === "years") return new Date(start.getFullYear() + 1, 0, 1);
  if (zoom === "quarters") return addPlanMonths(start, 3);
  return addPlanMonths(start, 1);
}

function getDatePeriodCoordinate(value, periods = PLAN_MONTHS, zoom = "months", { clamp = true } = {}) {
  const date = parsePlanDate(value);
  const visiblePeriods = periods.length ? periods : PLAN_MONTHS;
  if (!date || !visiblePeriods.length) return null;
  const firstStart = monthFloor(visiblePeriods[0]?.iso) || PLAN_TIMELINE_START_DATE;
  const lastEnd = getPeriodEndDate(visiblePeriods[visiblePeriods.length - 1], null, zoom);
  if (date < firstStart) return clamp ? 0 : null;
  if (date >= lastEnd) return clamp ? 100 : null;

  const periodIndex = visiblePeriods.findIndex((period, index) => {
    const start = monthFloor(period.iso) || firstStart;
    const end = getPeriodEndDate(period, visiblePeriods[index + 1], zoom);
    return date >= start && date < end;
  });

  if (periodIndex < 0) {
    if (!clamp) return null;
    return Math.max(0, Math.min(100, ((date - firstStart) / Math.max(DAY_MS, lastEnd - firstStart)) * 100));
  }

  const period = visiblePeriods[periodIndex];
  const start = monthFloor(period.iso) || firstStart;
  const end = getPeriodEndDate(period, visiblePeriods[periodIndex + 1], zoom);
  const within = Math.max(0, Math.min(1, (date - start) / Math.max(DAY_MS, end - start)));
  return Math.max(0, Math.min(100, ((periodIndex + within) / visiblePeriods.length) * 100));
}

function getTaskTimelineMetrics(task, periods = PLAN_MONTHS, zoom = "months") {
  const start = parsePlanDate(task.startISO);
  const end = parsePlanDate(task.endISO || task.startISO);
  if (!start || !end) return { left: 0, width: 2 };
  const left = getDatePeriodCoordinate(start, periods, zoom, { clamp: true }) ?? 0;
  const right = getDatePeriodCoordinate(new Date(end.getTime() + DAY_MS), periods, zoom, { clamp: true }) ?? Math.min(100, left + 2);
  return {
    left: Math.max(0, Math.min(99, left)),
    width: Math.max(1.6, Math.min(100 - left, right - left)),
  };
}

function getCurrentDayMarker(periods = PLAN_MONTHS, zoom = "months") {
  const today = new Date();
  const left = getDatePeriodCoordinate(today, periods, zoom, { clamp: false });
  if (left == null) return null;
  return {
    left,
    label: today.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  };
}

function buildPlanCsv(tasks) {
  const headers = ["WBS", "Task", "Group", "Phase", "Owner", "Status", "Percent Complete", "Days", "Start", "End", "Predecessors", "Successors", "Source Row"];
  const rows = tasks.map((task) => [
    task.wbs,
    task.name,
    task.group,
    task.phase,
    task.owner,
    task.status,
    task.pctLabel,
    task.days ?? "",
    task.startDisplay,
    task.endDisplay,
    (task.predecessors || []).join("; "),
    (task.successors || []).join("; "),
    task.sourceRow,
  ]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function downloadPlanCsv(tasks) {
  const blob = new Blob([buildPlanCsv(tasks)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "712-driggs-project-plan.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ProjectPlanPage() {
  const [view, setView] = React.useState("timeline");
  const [zoom, setZoom] = React.useState("months");
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [phaseFilter, setPhaseFilter] = React.useState("all");
  const [tasks, setTasks] = React.useState(() => TASKS.map(normalizeTaskForPlanner));
  const [groups, setGroups] = React.useState(() => buildInitialGroups(TASKS.map(normalizeTaskForPlanner)));
  const [editingTask, setEditingTask] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);
  const [draggedTaskId, setDraggedTaskId] = React.useState(null);
  const [draggedKanbanTaskId, setDraggedKanbanTaskId] = React.useState(null);
  const [kanbanDropBucket, setKanbanDropBucket] = React.useState(null);

  const visibleBaseTasks = React.useMemo(() => tasks.filter(PLAN_TASK_FILTER).sort((a, b) => (a.plannerOrder ?? 0) - (b.plannerOrder ?? 0)), [tasks]);
  const ownerOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.owner || "Unassigned"))).sort(), [visibleBaseTasks]);
  const statusOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.status || "Unknown"))).sort(), [visibleBaseTasks]);
  const phaseOptions = React.useMemo(() => Array.from(new Set(visibleBaseTasks.map((task) => task.phase || task.group || "Project plan"))).sort(), [visibleBaseTasks]);

  const filteredTasks = React.useMemo(() => {
    const q = normalizePlanText(query);
    return visibleBaseTasks.filter((task) => {
      const haystack = normalizePlanText([task.wbs, task.name, task.owner, task.status, task.phase, task.group, task.startDisplay, task.endDisplay, ...(task.predecessors || []), ...(task.successors || [])].join(" "));
      const queryOk = !q || haystack.includes(q);
      const statusOk = statusFilter === "all" || task.status === statusFilter;
      const ownerOk = ownerFilter === "all" || task.owner === ownerFilter;
      const phaseOk = phaseFilter === "all" || task.phase === phaseFilter || task.group === phaseFilter;
      return queryOk && statusOk && ownerOk && phaseOk;
    });
  }, [visibleBaseTasks, query, statusFilter, ownerFilter, phaseFilter]);

  const orderedGroups = React.useMemo(() => [...groups].sort((a, b) => a.order - b.order), [groups]);
  const filteredGroupedTasks = React.useMemo(() => orderedGroups.map((group) => ({
    group,
    tasks: filteredTasks.filter((task) => task.groupId === group.id),
  })).filter((entry) => entry.tasks.length > 0 || phaseFilter === "all"), [orderedGroups, filteredTasks, phaseFilter]);

  const toggleGroupCollapse = React.useCallback((groupId) => {
    setGroups((current) => current.map((group) => group.id === groupId ? { ...group, collapsed: !group.collapsed } : group));
  }, []);

  const doneCount = visibleBaseTasks.filter((task) => task.bucket === "done" || task.pctComplete >= 1).length;
  const progressCount = visibleBaseTasks.filter((task) => task.bucket === "progress").length;
  const openCount = visibleBaseTasks.filter((task) => task.bucket === "backlog").length;
  const avgCompletion = visibleBaseTasks.length
    ? Math.round(visibleBaseTasks.reduce((sum, task) => sum + (task.pctComplete || 0), 0) / visibleBaseTasks.length * 100)
    : 0;

  const saveTask = React.useCallback((taskDraft) => {
    const bucket = statusBucket(taskDraft.status || taskDraft.bucket);
    const meta = statusMetaForBucket(bucket);
    const pctComplete = coercePct(taskDraft.pctComplete, bucket);
    const group = groups.find((g) => g.id === taskDraft.groupId) || groups[0] || { id: "project-plan", name: "Project plan" };
    const startISO = formatPlanDate(taskDraft.startISO);
    const endISO = formatPlanDate(taskDraft.endISO || taskDraft.startISO);
    const normalized = normalizeTaskForPlanner({
      ...taskDraft,
      groupId: group.id,
      group: group.name,
      phase: taskDraft.phase || group.name,
      startISO,
      endISO,
      bucket,
      status: meta.status,
      cls: pctComplete >= 1 ? "pos" : meta.cls,
      pctComplete,
      pctLabel: `${Math.round(pctComplete * 100)}%`,
      predecessors: String(taskDraft.predecessorsText || "").split(",").map((x) => x.trim()).filter(Boolean),
      successors: String(taskDraft.successorsText || "").split(",").map((x) => x.trim()).filter(Boolean),
    });

    // Cascade: if the editor flagged successor tasks to push forward, shift them.
    const cascade = taskDraft._cascadeSuccessors;

    setTasks((current) => {
      let updated = (() => {
        const exists = current.some((task) => task.id === normalized.id);
        if (exists) return current.map((task) => task.id === normalized.id ? normalized : task);
        return [{ ...normalized, plannerOrder: -1, kanbanOrder: -1 }, ...current].map((task, index) => ({ ...task, plannerOrder: index, kanbanOrder: Number.isFinite(task.kanbanOrder) ? task.kanbanOrder : index }));
      })();

      if (cascade) {
        const { sucKeys, newEnd } = cascade;
        const newStart = new Date(newEnd.getTime() + DAY_MS);
        updated = updated.map((task) => {
          const key = task.wbs || task.name;
          if (!sucKeys.includes(key)) return task;
          const taskStart = parsePlanDate(task.startISO);
          // Only push forward — never pull backward.
          if (taskStart && taskStart >= newStart) return task;
          const shifted = shiftTaskDates(task, newStart);
          return normalizeTaskForPlanner({
            ...task,
            startISO: shifted.startISO,
            endISO: shifted.endISO,
            days: shifted.days,
          });
        });
      }

      return updated;
    });
    setEditingTask(null);
  }, [groups]);

  const saveGroup = React.useCallback((groupDraft) => {
    const name = groupDraft.name?.trim() || "Untitled group";
    const id = groupDraft.id || `group-${Date.now()}`;
    setGroups((current) => {
      const exists = current.some((group) => group.id === id);
      if (exists) return current.map((group) => group.id === id ? { ...group, name } : group);
      return [...current, { id, name, order: current.length, collapsed: false, source: "local" }];
    });
    setTasks((current) => current.map((task) => task.groupId === id ? { ...task, group: name, phase: task.phase || name } : task));
    setEditingGroup(null);
  }, []);

  const updateTaskStatus = React.useCallback((taskId, bucket) => {
    const meta = statusMetaForBucket(bucket);
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const pctComplete = bucket === "done" ? 1 : bucket === "progress" ? Math.max(task.pctComplete || 0.25, 0.25) : 0;
      return normalizeTaskForPlanner({ ...task, bucket, status: meta.status, cls: meta.cls, pctComplete, pctLabel: `${Math.round(pctComplete * 100)}%` });
    }));
  }, []);

  const moveKanbanTask = React.useCallback((taskId, targetTaskId, bucket) => {
    const targetBucket = bucket === "reserved" ? "unscheduled" : bucket;
    const meta = statusMetaForBucket(targetBucket);
    const matchesBucket = (task) => targetBucket === "unscheduled" ? ["unscheduled", "reserved"].includes(task.bucket) : task.bucket === targetBucket;
    setTasks((current) => {
      const moving = current.find((task) => task.id === taskId);
      if (!moving) return current;
      const pctComplete = targetBucket === moving.bucket
        ? moving.pctComplete
        : targetBucket === "done"
          ? 1
          : targetBucket === "progress"
            ? Math.max(moving.pctComplete || 0.25, 0.25)
            : 0;
      const statusAdjusted = current.map((task) => task.id === taskId
        ? normalizeTaskForPlanner({ ...task, bucket: targetBucket, status: meta.status, cls: meta.cls, pctComplete, pctLabel: `${Math.round(pctComplete * 100)}%` })
        : task
      );
      const column = statusAdjusted
        .filter(matchesBucket)
        .sort((a, b) => (a.kanbanOrder ?? a.plannerOrder ?? 0) - (b.kanbanOrder ?? b.plannerOrder ?? 0));
      const movingTask = column.find((task) => task.id === taskId);
      if (!movingTask) return statusAdjusted;
      const orderedColumn = column.filter((task) => task.id !== taskId);
      const targetIndex = targetTaskId ? orderedColumn.findIndex((task) => task.id === targetTaskId) : -1;
      orderedColumn.splice(targetIndex >= 0 ? targetIndex : orderedColumn.length, 0, movingTask);
      const orderMap = new Map(orderedColumn.map((task, index) => [task.id, index]));
      return statusAdjusted.map((task) => orderMap.has(task.id) ? { ...task, kanbanOrder: orderMap.get(task.id) } : task);
    });
  }, []);

  const moveTask = React.useCallback((taskId, targetTaskId, targetGroupId = null) => {
    setTasks((current) => {
      const ordered = [...current].sort((a, b) => (a.plannerOrder ?? 0) - (b.plannerOrder ?? 0));
      const fromIndex = ordered.findIndex((task) => task.id === taskId);
      if (fromIndex === -1) return current;
      const [moving] = ordered.splice(fromIndex, 1);
      const targetIndex = targetTaskId ? Math.max(0, ordered.findIndex((task) => task.id === targetTaskId)) : ordered.length;
      const group = groups.find((g) => g.id === targetGroupId) || groups.find((g) => g.id === moving.groupId) || groups[0];
      const moved = group ? { ...moving, groupId: group.id, group: group.name, phase: moving.phase || group.name } : moving;
      ordered.splice(targetIndex === -1 ? ordered.length : targetIndex, 0, moved);
      return ordered.map((task, index) => ({ ...task, plannerOrder: index }));
    });
  }, [groups]);

  const addTaskForGroup = React.useCallback((groupId = null) => {
    const group = groups.find((g) => g.id === groupId) || groups[0] || { id: "project-plan", name: "Project plan" };
    setEditingTask({
      id: `local-${Date.now()}`,
      sourceRow: "local",
      wbs: `L-${visibleBaseTasks.length + 1}`,
      name: "",
      owner: ownerFilter !== "all" ? ownerFilter : "Project leadership",
      groupId: group.id,
      group: group.name,
      phase: group.name,
      status: "Open",
      bucket: "backlog",
      pctComplete: 0,
      startISO: "",
      endISO: "",
      days: 1,
      predecessors: [],
      successors: [],
      raw: { source: "local client-side addition" },
    });
  }, [groups, ownerFilter, visibleBaseTasks.length]);

  return (
    <>
      <PageHead
        eyebrow="Project plan"
        title={`${DRIGGS_712_PROJECT.name} · Tracker schedule`}
        sub={`Seeded from the attached workbook with ${visibleBaseTasks.length} named plan rows, ${DRIGGS_712_SEED.meta.scheduleStartLabel} → ${DRIGGS_712_SEED.meta.scheduleEndLabel}. Source label preserved: ${DRIGGS_712_SEED.meta.workbookProjectName}.`}
        actions={
          <>
            <div className="seg">
              <button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")}>Timeline</button>
              <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>Kanban</button>
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
            </div>
            <button className="btn btn-secondary" onClick={() => downloadPlanCsv(filteredTasks)}><Icon name="download" size={13} /> Export</button>
            <button className="btn btn-secondary" onClick={() => setEditingGroup({ id: null, name: "" })}><Icon name="layers" size={13} /> Add group</button>
            <button className="btn btn-primary" onClick={() => addTaskForGroup()}><Icon name="plus" size={13} /> Add task</button>
          </>
        }
      />

      <div className="grid-kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <SmallStat label="Tracker rows" value={String(visibleBaseTasks.length)} sub={`${filteredTasks.length} visible after filters`} />
        <SmallStat label="Completion" value={`${avgCompletion}%`} sub={`${doneCount} done · ${progressCount} in progress`} cls="pos" />
        <SmallStat label="Open tasks" value={String(openCount)} sub={`${statusOptions.length} statuses · ${ownerOptions.length} owners`} cls="info" />
        <SmallStat label="Groups" value={String(groups.length)} sub={`${filteredGroupedTasks.length} visible task groups`} />
      </div>

      <div className="card planner-card" style={{ marginTop: 16 }}>
        <div className="card-head planner-toolbar">
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <label className="topbar-search" style={{ width: 260, margin: 0 }}>
              <Icon name="search" size={13} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search plan, owner, WBS…"
                aria-label="Search project plan"
                style={{ width: "100%", border: 0, outline: 0, background: "transparent", color: "var(--text-main)", fontSize: 13 }}
              />
            </label>
            <select className="select" style={{ width: 160 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter project plan by status">
              <option value="all">Status: All</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select className="select" style={{ width: 190 }} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="Filter project plan by owner">
              <option value="all">Owner: All</option>
              {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
            </select>
            <select className="select" style={{ width: 220 }} value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)} aria-label="Filter project plan by phase">
              <option value="all">Phase: All</option>
              {phaseOptions.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
            </select>
          </div>
          {view === "timeline" && (
            <div className="card-actions">
              <div className="seg" aria-label="Timeline zoom controls">
                {["months", "quarters", "years"].map((z) => (
                  <button key={z} className={zoom === z ? "active" : ""} onClick={() => setZoom(z)}>
                    {z[0].toUpperCase() + z.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {view === "timeline" && <TimelineView groups={filteredGroupedTasks} allTasks={visibleBaseTasks} months={PLAN_MONTHS} zoom={zoom} draggedTaskId={draggedTaskId} setDraggedTaskId={setDraggedTaskId} onMoveTask={moveTask} onEditTask={setEditingTask} onEditGroup={setEditingGroup} onAddTask={addTaskForGroup} onToggleCollapse={toggleGroupCollapse} />}
        {view === "kanban" && <KanbanView tasks={filteredTasks} draggedTaskId={draggedKanbanTaskId} setDraggedTaskId={setDraggedKanbanTaskId} dropBucket={kanbanDropBucket} setDropBucket={setKanbanDropBucket} onStatusChange={updateTaskStatus} onKanbanMove={moveKanbanTask} onEditTask={setEditingTask} />}
        {view === "list" && <PlanListView groups={filteredGroupedTasks} tasks={filteredTasks} onStatusChange={updateTaskStatus} onEditTask={setEditingTask} onEditGroup={setEditingGroup} onAddTask={addTaskForGroup} onAddGroup={() => setEditingGroup({ id: null, name: "" })} onToggleCollapse={toggleGroupCollapse} />}
      </div>

      {editingTask && <TaskEditorOverlay task={editingTask} groups={groups} tasks={visibleBaseTasks} onClose={() => setEditingTask(null)} onSave={saveTask} />}
      {editingGroup && <GroupEditorOverlay group={editingGroup} onClose={() => setEditingGroup(null)} onSave={saveGroup} />}
    </>
  );
}

function SmallStat({ label, value, sub, cls = "neutral" }) {
  return (
    <div className="metric" style={{ padding: "12px 14px" }}>
      <div className="metric-label" style={{ fontSize: 10 }}>{label}</div>
      <div className="row" style={{ alignItems: "baseline", gap: 6, marginTop: 4 }}>
        <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
        {cls !== "neutral" && <span className={`pill ${cls} no-dot`} style={{ height: 18 }}>•</span>}
      </div>
      <div className="metric-foot" style={{ marginTop: 2 }}>
        <span>{sub}</span>
      </div>
    </div>
  );
}

function getTimelinePeriods(months, zoom) {
  if (zoom === "years") {
    const seen = new Set();
    return months.filter((m) => {
      const year = m.label.slice(-2);
      if (seen.has(year)) return false;
      seen.add(year);
      return true;
    }).map((m) => ({ ...m, label: `20${m.label.slice(-2)}` }));
  }
  if (zoom === "quarters") {
    const seen = new Set();
    return months.filter((m) => {
      const d = new Date(m.iso);
      const q = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
      if (seen.has(q)) return false;
      seen.add(q);
      return true;
    }).map((m) => {
      const d = new Date(m.iso);
      return { ...m, label: `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(-2)}` };
    });
  }
  return months;
}

function TimelineView({ groups, allTasks, months, zoom, draggedTaskId, setDraggedTaskId, onMoveTask, onEditTask, onEditGroup, onAddTask, onToggleCollapse }) {
  const [hoveredTaskId, setHoveredTaskId] = React.useState(null);
  const periods = getTimelinePeriods(months, zoom);
  const todayMarker = getCurrentDayMarker(periods, zoom);
  const minWidth = zoom === "months" ? 1680 : zoom === "quarters" ? 1180 : 980;
  const periodMin = Math.max(116, Math.floor(minWidth / Math.max(1, periods.length)));

  return (
    <div className="planner-timeline-shell">
      <div className="planner-timeline" style={{ gridTemplateColumns: "390px max-content" }}>
        <div className="planner-task-pane">
          <div className="planner-sticky-head planner-task-head">Task / WBS · Owner · Days · Predecessors</div>
          {groups.map(({ group, tasks }) => (
            <React.Fragment key={group.id}>
              <GroupHeader group={group} count={tasks.length} onEditGroup={onEditGroup} onAddTask={onAddTask} onToggleCollapse={onToggleCollapse} onDropTask={(taskId) => onMoveTask(taskId, null, group.id)} />
              {!group.collapsed && tasks.map((task) => (
                <TimelineTaskRow key={task.id} task={task} draggedTaskId={draggedTaskId} setDraggedTaskId={setDraggedTaskId} onMoveTask={onMoveTask} onEditTask={onEditTask} hoveredTaskId={hoveredTaskId} setHoveredTaskId={setHoveredTaskId} />
              ))}
            </React.Fragment>
          ))}
          {allTasks.length === 0 && <EmptyPlanState />}
        </div>

        <div className="planner-grid-pane">
          <div className="planner-grid-inner" style={{ minWidth }}>
            <div className="planner-period-head planner-sticky-head" style={{ gridTemplateColumns: `repeat(${periods.length}, minmax(${periodMin}px, 1fr))` }}>
              {periods.map((m) => <div key={`${zoom}-${m.label}-${m.iso}`} className="planner-period-cell">{m.label}</div>)}
            </div>
            <div className="planner-bars" style={{ "--timeline-cols": periods.length, "--today-left": todayMarker ? `${todayMarker.left}%` : "-999px" }}>
              {todayMarker && <div className="planner-today-line"><span>Today · {todayMarker.label}</span></div>}
              {groups.map(({ group, tasks }) => (
                <React.Fragment key={group.id}>
                  <div className="planner-group-grid-row" />
                  {!group.collapsed && tasks.map((task) => <TimelineBarRow key={task.id} task={task} periods={periods} zoom={zoom} hoveredTaskId={hoveredTaskId} setHoveredTaskId={setHoveredTaskId} onEditTask={onEditTask} />)}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupHeader({ group, count, onEditGroup, onAddTask, onToggleCollapse, onDropTask }) {
  return (
    <div
      className="planner-group-row"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId);
      }}
    >
      <div className="row" style={{ gap: 8 }}>
        <button className="planner-collapse-btn" onClick={() => onToggleCollapse(group.id)} title={group.collapsed ? "Expand group" : "Collapse group"} aria-label={group.collapsed ? `Expand ${group.name}` : `Collapse ${group.name}`}>
          <Icon name={group.collapsed ? "chevronRight" : "chevronDown"} size={13} />
        </button>
        <Icon name="layers" size={13} />
        <strong>{group.name}</strong>
        <span className="mono faint">{count}</span>
      </div>
      <div className="row" style={{ gap: 6 }}>
        <button className="planner-icon-btn" onClick={() => onAddTask(group.id)} title="Add task to group"><Icon name="plus" size={12} /></button>
        <button className="planner-icon-btn" onClick={() => onEditGroup(group)} title="Edit group"><Icon name="edit" size={12} /></button>
      </div>
    </div>
  );
}

function TimelineTaskRow({ task, draggedTaskId, setDraggedTaskId, onMoveTask, onEditTask, hoveredTaskId, setHoveredTaskId }) {
  const isDragging = draggedTaskId === task.id;
  const isHovered = hoveredTaskId === task.id;
  return (
    <div
      className={`planner-task-row ${task.pctComplete >= 1 ? "is-done" : ""} ${isDragging ? "is-dragging" : ""} ${isHovered ? "is-hovered" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
        setDraggedTaskId(task.id);
      }}
      onDragEnd={() => setDraggedTaskId(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/plain");
        if (taskId && taskId !== task.id) onMoveTask(taskId, task.id, task.groupId);
      }}
      onDoubleClick={() => onEditTask(task)}
      onMouseEnter={() => setHoveredTaskId(task.id)}
      onMouseOver={() => setHoveredTaskId(task.id)}
      onPointerEnter={() => setHoveredTaskId(task.id)}
      onPointerOver={() => setHoveredTaskId(task.id)}
      onMouseLeave={() => setHoveredTaskId((current) => current === task.id ? null : current)}
      onPointerLeave={() => setHoveredTaskId((current) => current === task.id ? null : current)}
      onFocus={() => setHoveredTaskId(task.id)}
      onBlur={() => setHoveredTaskId((current) => current === task.id ? null : current)}
    >
      <Icon name="grip" size={12} className="planner-grip" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="mono faint" style={{ fontSize: 11, minWidth: 36 }}>{task.wbs}</span>
          <span className="planner-task-name">{task.name}</span>
          {task.pctComplete > 0 && <span className={`pill ${task.pctComplete >= 1 ? "pos" : task.cls} no-dot`} style={{ height: 18 }}>{task.pctLabel}</span>}
        </div>
        <div className="planner-task-meta">
          {task.owner} · {task.startDisplay} → {task.endDisplay} · {task.days ?? "—"}d · {task.pctLabel}
          {(task.predecessors || []).length > 0 && <> · pred: {(task.predecessors || []).join(", ")}</>}
        </div>
      </div>
      <button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button>
    </div>
  );
}

function TimelineBarRow({ task, periods, zoom, hoveredTaskId, setHoveredTaskId, onEditTask }) {
  const metrics = getTaskTimelineMetrics(task, periods, zoom);
  const isDone = task.pctComplete >= 1;
  const predecessorCount = (task.predecessors || []).length;
  const isHovered = hoveredTaskId === task.id;
  return (
    <div
      className={`planner-bar-row ${isHovered ? "is-hovered" : ""}`}
      style={{ "--timeline-cols": periods.length }}
      onMouseEnter={() => setHoveredTaskId(task.id)}
      onMouseOver={() => setHoveredTaskId(task.id)}
      onPointerEnter={() => setHoveredTaskId(task.id)}
      onPointerOver={() => setHoveredTaskId(task.id)}
      onMouseLeave={() => setHoveredTaskId((current) => current === task.id ? null : current)}
      onPointerLeave={() => setHoveredTaskId((current) => current === task.id ? null : current)}
    >
      <div
        className={`planner-task-bar ${isDone ? "is-complete" : task.bucket === "progress" ? "is-progress" : task.bucket === "unscheduled" ? "is-unscheduled" : ""}`}
        style={{ left: `${metrics.left}%`, width: `${metrics.width}%`, "--task-progress": `${Math.max(4, (task.pctComplete || 0) * 100)}%` }}
        title={`${task.name}: ${task.startDisplay} → ${task.endDisplay}`}
        onDoubleClick={() => onEditTask(task)}
      >
        <span>{isDone ? "Done" : task.status}</span>
      </div>
      {predecessorCount > 0 && <div className="planner-dependency-chip" style={{ left: `${Math.max(0, metrics.left - 3)}%` }} title={`Predecessors: ${task.predecessors.join(", ")}`}><Icon name="link" size={10} /> {predecessorCount}</div>}
    </div>
  );
}

function KanbanView({ tasks, draggedTaskId, setDraggedTaskId, dropBucket, setDropBucket, onStatusChange, onKanbanMove, onEditTask }) {
  const [dragOverKanbanTaskId, setDragOverKanbanTaskId] = React.useState(null);
  const columns = [
    { ...PLAN_STATUS_META.backlog, count: tasks.filter((task) => task.bucket === "backlog").length },
    { ...PLAN_STATUS_META.progress, count: tasks.filter((task) => task.bucket === "progress").length },
    { ...PLAN_STATUS_META.done, count: tasks.filter((task) => task.bucket === "done").length },
    { ...PLAN_STATUS_META.unscheduled, count: tasks.filter((task) => task.bucket === "unscheduled" || task.bucket === "reserved").length },
  ];
  const tasksByCol = Object.fromEntries(columns.map((column) => [column.id, tasks
    .filter((task) => column.id === "unscheduled" ? ["unscheduled", "reserved"].includes(task.bucket) : task.bucket === column.id)
    .sort((a, b) => (a.kanbanOrder ?? a.plannerOrder ?? 0) - (b.kanbanOrder ?? b.plannerOrder ?? 0))]));

  return (
    <div className="card-body planner-kanban-shell">
      <div className="planner-kanban-grid">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`planner-kanban-col ${dropBucket === col.id ? "is-drop-target" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDropBucket(col.id); }}
            onDragLeave={() => setDropBucket(null)}
            onDrop={(event) => {
              event.preventDefault();
              const taskId = event.dataTransfer.getData("text/plain") || draggedTaskId;
              if (taskId) onKanbanMove(taskId, null, col.id);
              setDraggedTaskId(null);
              setDropBucket(null);
              setDragOverKanbanTaskId(null);
            }}
          >
            <div className="row-between planner-kanban-head">
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</span>
                <span className="faint mono" style={{ fontSize: 11 }}>{col.count}</span>
              </div>
              <span className={`pill ${col.cls} no-dot`} style={{ height: 18 }}>{col.status}</span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {(tasksByCol[col.id] || []).map((task) => (
                <div
                  key={task.id}
                  className={`planner-kanban-card ${task.pctComplete >= 1 ? "is-complete" : ""} ${dragOverKanbanTaskId === task.id ? "is-drop-before" : ""}`}
                  style={{ "--card-accent": `var(--${task.pctComplete >= 1 ? "signal-pos" : task.cls === "info" ? "signal-info" : task.cls === "warn" ? "signal-warn" : task.cls === "neg" ? "signal-neg" : "border-strong"})`, "--card-progress": `${Math.max(0, Math.min(100, (task.pctComplete || 0) * 100))}%` }}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", task.id);
                    setDraggedTaskId(task.id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setDropBucket(col.id);
                    if (draggedTaskId && draggedTaskId !== task.id) setDragOverKanbanTaskId(task.id);
                  }}
                  onDragLeave={() => setDragOverKanbanTaskId((current) => current === task.id ? null : current)}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const taskId = event.dataTransfer.getData("text/plain") || draggedTaskId;
                    if (taskId && taskId !== task.id) onKanbanMove(taskId, task.id, col.id);
                    setDraggedTaskId(null);
                    setDropBucket(null);
                    setDragOverKanbanTaskId(null);
                  }}
                  onDragEnd={() => { setDraggedTaskId(null); setDropBucket(null); setDragOverKanbanTaskId(null); }}
                  onDoubleClick={() => onEditTask(task)}
                >
                  <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                    <span className="mono faint" style={{ fontSize: 10 }}>{task.wbs}</span>
                    <span className={`pill ${task.pctComplete >= 1 ? "pos" : task.cls} no-dot`} style={{ marginLeft: "auto", height: 18 }}>{task.pctLabel}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{task.name}</div>
                  <div className="planner-kanban-dates mono">{task.startDisplay} → {task.endDisplay}</div>
                  <div className="planner-kanban-progress" aria-label={`${task.pctLabel} complete`}><span /></div>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <Icon name="clock" size={11} />
                    <span>{task.days ?? "—"}d</span>
                    <span className="dot" style={{ width: 3, height: 3, marginLeft: 4 }} />
                    <span>{task.owner}</span>
                    {(task.predecessors || []).length > 0 && <span className="planner-kanban-badge"><Icon name="link" size={10} /> {(task.predecessors || []).length}</span>}
                  </div>
                  <div className="planner-card-foot">
                    <span className="faint">{task.phase || task.group}</span>
                    <button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button>
                  </div>
                </div>
              ))}
              {(tasksByCol[col.id] || []).length === 0 && <div className="planner-empty-drop">Drop cards here to mark them {col.title.toLowerCase()}.</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanListView({ groups, onStatusChange, onEditTask, onEditGroup, onAddTask, onAddGroup, onToggleCollapse }) {
  return (
    <div className="card-body-flush planner-list-shell">
      <div className="planner-list-actions">
        <button className="btn btn-secondary btn-sm" onClick={onAddGroup}><Icon name="layers" size={12} /> Add group</button>
      </div>
      <table className="table planner-table">
        <thead>
          <tr>
            <th style={{ width: 54 }}>WBS</th>
            <th>Task / group</th>
            <th>Phase</th>
            <th>Status</th>
            <th className="num">%</th>
            <th className="num">Days</th>
            <th>Start</th>
            <th>End</th>
            <th>Owner</th>
            <th>Pred.</th>
            <th>Succ.</th>
            <th className="num">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(({ group, tasks }) => (
            <React.Fragment key={group.id}>
              <tr className="planner-table-group-row">
                <td colSpan="12">
                  <div className="row-between">
                    <div className="row" style={{ gap: 8 }}><button className="planner-collapse-btn" onClick={() => onToggleCollapse(group.id)} title={group.collapsed ? "Expand group" : "Collapse group"} aria-label={group.collapsed ? `Expand ${group.name}` : `Collapse ${group.name}`}><Icon name={group.collapsed ? "chevronRight" : "chevronDown"} size={13} /></button><Icon name="layers" size={13} /><strong>{group.name}</strong><span className="mono faint">{tasks.length}</span></div>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onAddTask(group.id)}><Icon name="plus" size={12} /> Task</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => onEditGroup(group)}><Icon name="edit" size={12} /> Group</button>
                    </div>
                  </div>
                </td>
              </tr>
              {!group.collapsed && tasks.map((task) => (
                <tr key={task.id} className={task.pctComplete >= 1 ? "planner-row-complete" : ""}>
                  <td className="mono faint">{task.wbs}</td>
                  <td style={{ fontWeight: 500 }}>
                    <div>{task.name}</div>
                    <div className="faint" style={{ fontSize: 11 }}>Source row {task.sourceRow} · {(task.successors || []).length} successor{(task.successors || []).length !== 1 ? "s" : ""}</div>
                  </td>
                  <td className="muted">{task.phase}</td>
                  <td>
                    <select className="select planner-status-select" value={task.bucket === "reserved" ? "unscheduled" : task.bucket} onChange={(event) => onStatusChange(task.id, event.target.value)} aria-label={`Update status for ${task.name}`}>
                      <option value="backlog">Open</option>
                      <option value="progress">In progress</option>
                      <option value="done">Done</option>
                      <option value="unscheduled">Unscheduled</option>
                    </select>
                  </td>
                  <td className="num mono">{task.pctLabel}</td>
                  <td className="num mono">{task.days ?? "—"}</td>
                  <td className="muted mono" style={{ fontSize: 12 }}>{task.startISO || "—"}</td>
                  <td className="muted mono" style={{ fontSize: 12 }}>{task.endISO || "—"}</td>
                  <td className="muted">{task.owner}</td>
                  <td className="muted mono" style={{ fontSize: 11 }}>{(task.predecessors || []).join(", ") || "—"}</td>
                  <td className="muted mono" style={{ fontSize: 11 }}>{(task.successors || []).join(", ") || "—"}</td>
                  <td className="num"><button className="planner-icon-btn" onClick={() => onEditTask(task)} title="Edit task"><Icon name="edit" size={12} /></button></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {groups.every((entry) => entry.tasks.length === 0) && (
            <tr>
              <td colSpan="12"><EmptyPlanState /></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auto-date helpers used by TaskEditorOverlay
// ---------------------------------------------------------------------------

/**
 * Given a list of predecessor WBS/name keys and the full task list, return the
 * latest end date among all matched predecessor tasks, or null if none found.
 */
function latestPredecessorEnd(predecessorKeys, allTasks) {
  let latest = null;
  for (const key of predecessorKeys) {
    const match = allTasks.find((t) => (t.wbs && t.wbs === key) || t.name === key);
    if (!match) continue;
    const end = parsePlanDate(match.endISO || match.startISO);
    if (end && (!latest || end > latest)) latest = end;
  }
  return latest;
}

/**
 * Shift a task's start date to `newStart`, preserving its duration (days).
 * Returns updated { startISO, endISO, days }.
 */
function shiftTaskDates(task, newStart) {
  const origStart = parsePlanDate(task.startISO);
  const origEnd = parsePlanDate(task.endISO || task.startISO);
  const durationMs = origStart && origEnd ? Math.max(0, origEnd - origStart) : 0;
  const endDate = new Date(newStart.getTime() + durationMs);
  return {
    startISO: formatPlanDate(newStart),
    endISO: formatPlanDate(endDate),
    days: Math.max(1, Math.round(durationMs / DAY_MS) + 1),
  };
}

function TaskEditorOverlay({ task, groups, tasks, onClose, onSave }) {
  const [draft, setDraft] = React.useState(() => ({
    ...task,
    startISO: formatPlanDate(task.startISO),
    endISO: formatPlanDate(task.endISO),
    pctComplete: Math.round((task.pctComplete || 0) * 100),
    predecessorsText: (task.predecessors || []).join(", "),
    successorsText: (task.successors || []).join(", "),
  }));
  const [autoAdjustNotice, setAutoAdjustNotice] = React.useState(null);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const selectableTasks = React.useMemo(() => tasks.filter((candidate) => candidate.id !== task.id), [tasks, task.id]);

  // When a predecessor chip is added, snap this task's start date to the
  // day after the latest predecessor end date (Finish-to-Start constraint).
  const toggleTaskLink = React.useCallback((field, value) => {
    setDraft((current) => {
      const selected = String(current[field] || "").split(",").map((item) => item.trim()).filter(Boolean);
      const wasSelected = selected.includes(value);
      const next = wasSelected ? selected.filter((item) => item !== value) : [...selected, value];
      const nextDraft = { ...current, [field]: next.join(", ") };

      if (field === "predecessorsText" && !wasSelected) {
        // A new predecessor was just added — recalculate start date.
        const latestEnd = latestPredecessorEnd(next, tasks);
        if (latestEnd) {
          // Start the day after the predecessor ends.
          const newStart = new Date(latestEnd.getTime() + DAY_MS);
          const shifted = shiftTaskDates(current, newStart);
          setAutoAdjustNotice(`Start date moved to ${displayPlanDate(shifted.startISO)} based on predecessor schedule.`);
          return { ...nextDraft, ...shifted };
        }
      }
      return nextDraft;
    });
  }, [tasks]);

  const removeTaskLink = React.useCallback((field, value) => {
    setDraft((current) => {
      const next = String(current[field] || "").split(",").map((item) => item.trim()).filter(Boolean).filter((item) => item !== value);
      return { ...current, [field]: next.join(", ") };
    });
  }, []);

    // When saving, also push successor tasks forward if this task's end date
    // changed relative to the original, so callers can cascade the change.
    const handleSave = (event) => {
      event.preventDefault();
      const saved = { ...draft, pctComplete: Number(draft.pctComplete) / 100 };
      const origEnd = parsePlanDate(task.endISO);
      const newEnd = parsePlanDate(draft.endISO);
      // If end date moved forward, push any successor tasks that start before the new end.
      if (origEnd && newEnd && newEnd > origEnd) {
        const sucKeys = String(draft.successorsText || "").split(",").map((k) => k.trim()).filter(Boolean);
        if (sucKeys.length > 0) {
          saved._cascadeSuccessors = { sucKeys, newEnd };
        }
      }
      onSave(saved);
    };

  return (
    <div className="planner-modal-backdrop" role="dialog" aria-modal="true">
      <form className="planner-modal" onSubmit={handleSave}>
        <div className="planner-modal-head">
          <div>
            <div className="metric-label">Task editor</div>
            <h3>{task.sourceRow === "local" && !task.name ? "Add tracker task" : "Edit tracker task"}</h3>
          </div>
          <button type="button" className="planner-icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        {autoAdjustNotice && (
          <div className="planner-auto-adjust-notice" role="status">
            <Icon name="calendar" size={13} />
            <span>{autoAdjustNotice}</span>
            <button type="button" className="planner-icon-btn" onClick={() => setAutoAdjustNotice(null)}><Icon name="x" size={11} /></button>
          </div>
        )}
        <div className="planner-form-grid">
          <label className="planner-field planner-field-wide"><span>Task name</span><input value={draft.name || ""} onChange={(event) => update("name", event.target.value)} required /></label>
          <label className="planner-field"><span>WBS</span><input value={draft.wbs || ""} onChange={(event) => update("wbs", event.target.value)} /></label>
          <label className="planner-field"><span>Owner</span><input value={draft.owner || ""} onChange={(event) => update("owner", event.target.value)} /></label>
          <label className="planner-field"><span>Group</span><select value={draft.groupId || groups[0]?.id || ""} onChange={(event) => update("groupId", event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
          <label className="planner-field"><span>Phase</span><input value={draft.phase || ""} onChange={(event) => update("phase", event.target.value)} /></label>
          <label className="planner-field"><span>Status</span><select value={draft.status || "Open"} onChange={(event) => update("status", event.target.value)}><option>Open</option><option>In progress</option><option>Done</option><option>Unscheduled</option></select></label>
          <label className="planner-field"><span>% complete</span><input type="number" min="0" max="100" value={draft.pctComplete ?? 0} onChange={(event) => update("pctComplete", event.target.value)} /></label>
          <ThemedDateField label="Start" value={draft.startISO || ""} onChange={(value) => update("startISO", value)} />
          <ThemedDateField label="End" value={draft.endISO || ""} onChange={(value) => update("endISO", value)} />
          <label className="planner-field"><span>Days</span><input type="number" min="0" value={draft.days ?? 0} onChange={(event) => update("days", Number(event.target.value))} /></label>
          <TaskLinkSelector
            label="Predecessors"
            description="Tasks that must happen before this task."
            value={draft.predecessorsText || ""}
            field="predecessorsText"
            candidates={selectableTasks}
            onToggle={toggleTaskLink}
            onRemove={removeTaskLink}
          />
          <TaskLinkSelector
            label="Successors"
            description="Tasks that come after this task."
            value={draft.successorsText || ""}
            field="successorsText"
            candidates={selectableTasks}
            onToggle={toggleTaskLink}
            onRemove={removeTaskLink}
          />
        </div>
        <div className="planner-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Icon name="check" size={13} /> Save task</button>
        </div>
      </form>
    </div>
  );
}

function ThemedDateField({ label, value, onChange }) {
  const inputRef = React.useRef(null);
  const display = value ? displayPlanDate(value) : "Choose date";
  const openPicker = () => {
    if (inputRef.current?.showPicker) inputRef.current.showPicker();
    else inputRef.current?.focus();
  };
  return (
    <label className="planner-field planner-date-field">
      <span>{label}</span>
      <button type="button" className={`planner-date-trigger ${value ? "has-value" : ""}`} onClick={openPicker}>
        <Icon name="calendar" size={14} />
        <strong>{display}</strong>
        <em>{value || "Not scheduled"}</em>
      </button>
      <input ref={inputRef} type="date" value={value || ""} onChange={(event) => onChange(event.target.value)} aria-label={`${label} date`} />
    </label>
  );
}

function TaskLinkSelector({ label, description, value, field, candidates, onToggle, onRemove }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  const selectedSet = new Set(selected);
  const byKey = React.useMemo(() => new Map(candidates.map((candidate) => [candidate.wbs || candidate.name, candidate])), [candidates]);
  const filteredCandidates = candidates.filter((candidate) => {
    const haystack = `${candidate.wbs} ${candidate.name} ${candidate.owner} ${candidate.phase}`.toLowerCase();
    return haystack.includes(query.toLowerCase().trim());
  }).slice(0, 18);

  const pick = (key) => {
    onToggle(field, key);
    setQuery("");
    setOpen(true);
  };

  return (
    <div className={`planner-field planner-field-wide planner-link-selector ${open ? "is-open" : ""}`}>
      <div className="planner-link-selector-head">
        <div>
          <span>{label}</span>
          <small>{description}</small>
        </div>
        <em>{selected.length} linked</em>
      </div>
      <button type="button" className="planner-link-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span><Icon name="link" size={13} /> Click to find and link a task</span>
        <Icon name={open ? "chevronUp" : "chevronDown"} size={14} />
      </button>
      {open && (
        <div className="planner-link-popover">
          <label className="planner-link-search">
            <Icon name="search" size={13} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by WBS, task, owner, or phase…" autoFocus />
          </label>
          <div className="planner-link-list" role="listbox" aria-label={`Choose ${label.toLowerCase()}`}>
            {filteredCandidates.map((candidate) => {
              const key = candidate.wbs || candidate.name;
              const active = selectedSet.has(key);
              return (
                <button key={candidate.id} type="button" className={`planner-link-option ${active ? "is-selected" : ""}`} onClick={() => pick(key)} aria-pressed={active}>
                  <span className="planner-link-check"><Icon name={active ? "check" : "plus"} size={11} /></span>
                  <span className="planner-link-copy"><strong>{candidate.wbs}</strong><em>{candidate.name}</em><small>{candidate.owner} · {candidate.startDisplay} → {candidate.endDisplay}</small></span>
                  <span className={`pill ${candidate.pctComplete >= 1 ? "pos" : candidate.cls} no-dot`}>{candidate.pctLabel}</span>
                </button>
              );
            })}
            {filteredCandidates.length === 0 && <div className="planner-link-empty">No matching tasks found.</div>}
          </div>
        </div>
      )}
      <div className="planner-link-selected" aria-label={`Selected ${label.toLowerCase()}`}>
        {selected.length === 0 && <div className="planner-link-empty compact">No tasks linked yet.</div>}
        {selected.map((item) => {
          const linkedTask = byKey.get(item);
          return (
            <button key={item} type="button" className="planner-link-chip" onClick={() => onRemove(field, item)} title={`Remove ${item}`}>
              <strong>{item}</strong>
              {linkedTask && <span>{linkedTask.name}</span>}
              <Icon name="x" size={10} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GroupEditorOverlay({ group, onClose, onSave }) {
  const [name, setName] = React.useState(group.name || "");
  return (
    <div className="planner-modal-backdrop" role="dialog" aria-modal="true">
      <form className="planner-modal planner-modal-small" onSubmit={(event) => { event.preventDefault(); onSave({ ...group, name }); }}>
        <div className="planner-modal-head">
          <div>
            <div className="metric-label">Task group</div>
            <h3>{group.id ? "Edit group" : "Add group"}</h3>
          </div>
          <button type="button" className="planner-icon-btn" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <label className="planner-field planner-field-wide"><span>Group name</span><input value={name} onChange={(event) => setName(event.target.value)} required autoFocus /></label>
        <div className="planner-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary"><Icon name="check" size={13} /> Save group</button>
        </div>
      </form>
    </div>
  );
}

function EmptyPlanState() {
  return <div className="muted" style={{ padding: 24, textAlign: "center", fontSize: 13 }}>No 712 Driggs plan rows match the current search and filters.</div>;
}

window.ProjectPlanPage = ProjectPlanPage;
/* global React, Icon, PageHead, fmtUSD */

// Stacking plan: each floor → array of units. Penthouse on top.
const FLOORS = [
  {
    floor: "Roof", label: "Roof / Mech", height: 28,
    units: [{ unit: "Mechanical & solar", type: "MECH", width: 100, status: "mech" }]
  },
  {
    floor: "PH", label: "Penthouse", height: 110,
    units: [
      { unit: "PH-A", type: "4BR Penthouse", sf: 2980, beds: 4, baths: 3.5, exp: "Full floor", price: 5950000, width: 100, status: "reserved" },
    ]
  },
  {
    floor: 4, label: "Floor 4", height: 96,
    units: [
      { unit: "4A", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "NW", price: 2425000, width: 36, status: "available" },
      { unit: "4B", type: "3BR", sf: 1820, beds: 3, baths: 2, exp: "NE", price: 3050000, width: 38, status: "contract" },
      { unit: "4C", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "SE", price: 2400000, width: 26, status: "available" },
    ]
  },
  {
    floor: 3, label: "Floor 3", height: 96,
    units: [
      { unit: "3A", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "NW", price: 2300000, width: 36, status: "available" },
      { unit: "3B", type: "3BR", sf: 1820, beds: 3, baths: 2, exp: "NE", price: 2925000, width: 38, status: "reserved" },
      { unit: "3C", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "SE", price: 2275000, width: 26, status: "sold" },
    ]
  },
  {
    floor: 2, label: "Floor 2", height: 96,
    units: [
      { unit: "2A", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "NW", price: 2225000, width: 36, status: "contract" },
      { unit: "2B", type: "3BR", sf: 1820, beds: 3, baths: 2, exp: "NE", price: 2825000, width: 38, status: "available" },
      { unit: "2C", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "SE", price: 2275000, width: 26, status: "reserved" },
    ]
  },
  {
    floor: 1, label: "Floor 1 / Ground", height: 96,
    units: [
      { unit: "1A", type: "2BR", sf: 1500, beds: 2, baths: 2, exp: "NW", price: 2150000, width: 30, status: "reserved" },
      { unit: "1B", type: "3BR Garden", sf: 1820, beds: 3, baths: 2, exp: "NE/Garden", price: 2850000, width: 32, status: "available" },
      { unit: "Lobby", type: "Lobby", width: 12, status: "common" },
      { unit: "1C", type: "2BR", sf: 1100, beds: 2, baths: 2, exp: "SE", price: 1750000, width: 26, status: "available" },
    ]
  },
  {
    floor: "C", label: "Cellar", height: 60,
    units: [
      { unit: "Bike storage", type: "Storage · 48 racks", width: 30, status: "amenity" },
      { unit: "Mech / MEP", type: "Mechanical", width: 28, status: "mech" },
      { unit: "Gym", type: "Amenity", width: 22, status: "amenity" },
      { unit: "Lounge", type: "Amenity", width: 20, status: "amenity" },
    ]
  },
];

const STATUS_DEF = {
  available: { label: "Available", cls: "available", count: 12 },
  reserved:  { label: "Reserved", cls: "reserved", count: 8 },
  contract:  { label: "In contract", cls: "contract", count: 4 },
  sold:      { label: "Sold / closed", cls: "sold", count: 3 },
  common:    { label: "Common area", cls: "common", count: 2 },
  amenity:   { label: "Amenity", cls: "amenity", count: 4 },
  mech:      { label: "Mechanical", cls: "mech", count: 2 },
};

function StackingPlanPage() {
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState(null);

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
            <button className="btn btn-primary"><Icon name="edit" size={13} /> Edit pricing</button>
          </>
        }
      />

      <div className="grid-kpis" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatusKpi label="Available" value="12" pct="40%" cls="available" />
        <StatusKpi label="Reserved" value="8" pct="27%" cls="reserved" />
        <StatusKpi label="Contract" value="4" pct="13%" cls="contract" />
        <StatusKpi label="Sold" value="3" pct="10%" cls="sold" />
        <StatusKpi label="Sellout" value="$74.2M" sub="$1,533/sf avg" />
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1fr 320px", marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Stack — 712 Driggs Avenue</div>
              <div className="card-sub">{FLOORS.length} floors · 30 residences · cellar level</div>
            </div>
            <div className="card-actions">
              <div className="seg">
                {[["all", "All"], ["available", "Available"], ["reserved", "Held"]].map(([id, l]) => (
                  <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{l}</button>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="search" size={13} /></button>
            </div>
          </div>
          <div className="card-body" style={{ padding: 24, background: "var(--bg-sunk)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 720, margin: "0 auto" }}>
              {FLOORS.map((floor) => (
                <FloorRow
                  key={floor.label}
                  floor={floor}
                  filter={filter}
                  onSelect={setSelected}
                  selectedUnit={selected?.unit}
                />
              ))}
              {/* ground line */}
              <div style={{ height: 8, background: "linear-gradient(180deg, var(--text-faint) 0%, transparent 100%)", opacity: 0.2 }} />
            </div>
          </div>
          <div className="card-foot">
            <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
              {Object.entries(STATUS_DEF).map(([key, def]) => (
                <div key={key} className="row" style={{ gap: 6, fontSize: 11 }}>
                  <span className={`stack-swatch sw-${def.cls}`} />
                  <span style={{ color: "var(--text-muted)" }}>{def.label}</span>
                  <span className="mono faint">{def.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <UnitDetail unit={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  );
}

function FloorRow({ floor, filter, onSelect, selectedUnit }) {
  return (
    <div className="row" style={{ gap: 8, alignItems: "stretch" }}>
      <div style={{
        width: 56,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 4,
      }}>
        <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{floor.floor}</div>
        <div className="faint" style={{ fontSize: 10 }}>{floor.height}'</div>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        gap: 2,
        height: floor.height,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        overflow: "hidden",
      }}>
        {floor.units.map((u) => {
          const dimmed = filter === "available" && u.status !== "available";
          const isSelected = selectedUnit === u.unit;
          return (
            <button
              key={u.unit}
              onClick={() => u.price && onSelect(u)}
              className={`stack-cell sw-${u.status} ${isSelected ? "selected" : ""}`}
              style={{
                flex: u.width,
                opacity: dimmed ? 0.25 : 1,
                cursor: u.price ? "pointer" : "default",
              }}
            >
              <div className="stack-cell-inner">
                <div className="row-between" style={{ width: "100%" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{u.unit}</span>
                  {u.price && <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>${(u.price / 1e6).toFixed(2)}M</span>}
                </div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{u.type}{u.sf ? ` · ${u.sf} SF` : ""}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusKpi({ label, value, pct, sub, cls }) {
  return (
    <div className="metric" style={{ padding: "12px 14px" }}>
      <div className="row" style={{ gap: 8, alignItems: "center" }}>
        {cls && <span className={`stack-swatch sw-${cls}`} />}
        <span className="metric-label" style={{ fontSize: 11 }}>{label}</span>
      </div>
      <div className="row" style={{ alignItems: "baseline", gap: 8, marginTop: 4 }}>
        <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
        {pct && <span className="faint mono" style={{ fontSize: 12 }}>{pct}</span>}
      </div>
      {sub && <div className="metric-foot"><span>{sub}</span></div>}
    </div>
  );
}

function UnitDetail({ unit, onClose }) {
  if (!unit) {
    return (
      <div className="card" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <div className="card-head">
          <div className="card-title">Unit details</div>
        </div>
        <div className="card-body" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{
            width: 56, height: 56, margin: "0 auto 12px",
            borderRadius: 12, background: "var(--bg-sunk)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="layers" size={22} style={{ color: "var(--text-faint)" }} />
          </div>
          <div className="muted" style={{ fontSize: 13 }}>Click a unit in the stack to see contract status, pricing history, and finishes.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
      <div className="card-head">
        <div className="row" style={{ gap: 10 }}>
          <div className={`stack-swatch sw-${unit.status}`} style={{ width: 12, height: 12 }} />
          <div>
            <div className="card-title">Unit {unit.unit}</div>
            <div className="card-sub">{unit.type}</div>
          </div>
        </div>
        <button className="iconbtn" onClick={onClose}><Icon name="x" size={14} /></button>
      </div>
      <div className="card-body">
        <div className="metric-value-mono" style={{ fontSize: 28 }}>{fmtUSD(unit.price)}</div>
        <div className="faint" style={{ fontSize: 11, marginBottom: 12 }}>${Math.round(unit.price / unit.sf).toLocaleString()}/sf</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <DetailField label="Beds" value={`${unit.beds} bed`} />
          <DetailField label="Baths" value={`${unit.baths} bath`} />
          <DetailField label="Sqft" value={unit.sf?.toLocaleString()} />
          <DetailField label="Exposure" value={unit.exp} />
        </div>

        <div className="div" />

        <div className="stack" style={{ gap: 8 }}>
          <div className="row-between">
            <span className="muted" style={{ fontSize: 12 }}>Sales status</span>
            <span className={`pill no-dot ${unit.status === "available" ? "neutral" : unit.status === "sold" ? "pos" : "info"}`}>
              {STATUS_DEF[unit.status]?.label}
            </span>
          </div>
          <div className="row-between">
            <span className="muted" style={{ fontSize: 12 }}>Construction</span>
            <span className="pill warn no-dot">Framing</span>
          </div>
          <div className="row-between">
            <span className="muted" style={{ fontSize: 12 }}>Reserved by</span>
            <span style={{ fontSize: 12 }}>—</span>
          </div>
          <div className="row-between">
            <span className="muted" style={{ fontSize: 12 }}>Listing agent</span>
            <span style={{ fontSize: 12 }}>JLL · A. Park</span>
          </div>
        </div>

        <div className="div" />

        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Icon name="edit" size={12} /> Edit</button>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>View contract</button>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value || "—"}</div>
    </div>
  );
}

window.StackingPlanPage = StackingPlanPage;
/* global React, Icon, PageHead, fmtUSD, Modal, Field, Input, Select, Textarea */

function trackerAmount(value) {
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

const STATUS_OPTS = ["Pending", "Approved", "Paid", "Rejected"];
const METHOD_OPTS = ["ACH", "Wire", "Check", "Credit", "Card"];

// ── Shared Expense Store (shared between Financials and Vendors) ──────────────
const ExpenseStoreCtx = React.createContext(null);

export function ExpenseStoreProvider({ children }) {
  const [expenses, setExpenses] = React.useState(INITIAL_EXPENSES);

  const addExpense = React.useCallback((row) => {
    setExpenses((prev) => [{ ...row, id: row.id || `e${Date.now()}` }, ...prev]);
  }, []);

  const updateExpense = React.useCallback((row) => {
    setExpenses((prev) => prev.map((e) => e.id === row.id ? row : e));
  }, []);

  const deleteExpense = React.useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ExpenseStoreCtx.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseStoreCtx.Provider>
  );
}

function useExpenseStore() {
  return React.useContext(ExpenseStoreCtx);
}

// Make available to VendorsModule via window
window.useExpenseStore = useExpenseStore;

function FinancialsPage() {
  const [tab, setTab] = React.useState('budget');
  return (
    <>
      <PageHead
        eyebrow="Financials"
        title="712 Driggs · Cost & cash"
        sub="Budget, committed, expenses, draws, contingency."
      />
      <div className="tabs" style={{ marginTop: 18 }}>
        {[['budget', 'Budget'], ['expenses', 'Expenses'], ['capital', 'Capital stack'], ['draws', 'Draws & contingency']].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === 'budget' && <BudgetTabNew />}
      {tab === 'expenses' && <ExpensesTabNew />}
      {tab === 'capital' && <CapitalTab />}
      {tab === 'draws' && <DrawsTab />}
    </>
  );
}
function BudgetTab({ rows, totals, onAdd, onEdit }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head">
        <div>
          <div className="card-title">Cost-to-complete by CSI division</div>
          <div className="card-sub">Budget · committed · spent · forecast — click any row to edit</div>
        </div>
        <div className="card-actions">
          <button className="btn btn-ghost btn-sm"><Icon name="filter" size={12} /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={onAdd}><Icon name="plus" size={12} /> Add line</button>
        </div>
      </div>
      <div className="card-body-flush">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>CSI</th>
              <th>Division</th>
              <th className="num">Budget</th>
              <th className="num">Committed</th>
              <th className="num">Spent</th>
              <th>Progress</th>
              <th className="num">Variance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const pct = r.budget > 0 ? Math.round((r.spent / r.budget) * 100) : 0;
              const committedPct = r.budget > 0 ? Math.round((r.committed / r.budget) * 100) : 0;
              const variance = r.budget - r.forecast;
              return (
                <tr key={r.id} onClick={() => onEdit(r)} style={{ cursor: "pointer" }}>
                  <td className="mono faint">{r.code}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    {r.risk && <div style={{ fontSize: 11, color: "var(--signal-warn)", marginTop: 2 }}>⚠ At risk</div>}
                  </td>
                  <td className="num mono">{fmtUSD(r.budget, { compact: true })}</td>
                  <td className="num mono muted">{fmtUSD(r.committed, { compact: true })}</td>
                  <td className="num mono">{fmtUSD(r.spent, { compact: true })}</td>
                  <td style={{ minWidth: 140 }}>
                    <div style={{ position: "relative", height: 6, background: "var(--bg-sunk)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, width: `${committedPct}%`, background: "var(--bg-active)" }} />
                      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: r.risk ? "var(--signal-warn)" : "var(--accent)" }} />
                    </div>
                    <div className="row-between" style={{ marginTop: 3, fontSize: 10, color: "var(--text-faint)" }}>
                      <span>{pct}% spent</span>
                      <span>{committedPct}% commit</span>
                    </div>
                  </td>
                  <td className="num mono" style={{ color: variance < 0 ? "var(--signal-neg)" : variance > 0 ? "var(--signal-pos)" : "var(--text-muted)" }}>
                    {variance === 0 ? "—" : fmtUSD(variance, { compact: true, sign: true })}
                  </td>
                  <td>
                    <button className="iconbtn" onClick={(e) => { e.stopPropagation(); onEdit(r); }}>
                      <Icon name="edit" size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--bg-sunk)", fontWeight: 600 }}>
              <td colSpan="2">Total</td>
              <td className="num mono">{fmtUSD(totals.totalBudget, { compact: true })}</td>
              <td className="num mono">{fmtUSD(totals.totalCommitted, { compact: true })}</td>
              <td className="num mono">{fmtUSD(totals.totalSpent, { compact: true })}</td>
              <td>—</td>
              <td className="num mono" style={{ color: totals.variance < 0 ? "var(--signal-neg)" : "var(--signal-pos)" }}>
                {fmtUSD(totals.variance, { compact: true, sign: true })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function ExpensesTab({ rows, divisions, onAdd, onEdit }) {
  const [filter, setFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const filtered = rows.filter(r =>
    (filter === "All" || r.status === filter) &&
    (!search ||
      r.desc.toLowerCase().includes(search.toLowerCase()) ||
      r.vendor.toLowerCase().includes(search.toLowerCase()) ||
      r.invoice.toLowerCase().includes(search.toLowerCase()))
  );

  const total = filtered.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head">
        <div className="row" style={{ gap: 10, flex: 1 }}>
          <label className="topbar-search" style={{ width: 280, margin: 0 }}>
            <Icon name="search" size={13} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses, vendors, invoices…"
              style={{ background: "transparent", border: "none", color: "inherit", width: "100%", outline: "none", fontSize: 13 }}
            />
          </label>
          <div className="row" style={{ gap: 4 }}>
            {["All", ...STATUS_OPTS].map((s) => (
              <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={onAdd}><Icon name="plus" size={12} /> Log expense</button>
        </div>
      </div>
      <div className="card-body-flush">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Vendor</th>
              <th>Division</th>
              <th>Status</th>
              <th>Method</th>
              <th>Invoice</th>
              <th className="num">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} onClick={() => onEdit(r)} style={{ cursor: "pointer" }}>
                <td className="muted mono" style={{ fontSize: 12 }}>{r.date}</td>
                <td style={{ fontWeight: 500 }}>{r.desc}</td>
                <td className="muted">{r.vendor}</td>
                <td className="muted" style={{ fontSize: 12 }}>{r.division}</td>
                <td>
                  <span className={`pill no-dot ${
                    r.status === "Paid" ? "pos" :
                    r.status === "Approved" ? "info" :
                    r.status === "Pending" ? "warn" :
                    "neutral"
                  }`}>{r.status}</span>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{r.method}</td>
                <td className="mono faint" style={{ fontSize: 11 }}>{r.invoice}</td>
                <td className="num mono" style={{ color: r.amount < 0 ? "var(--signal-pos)" : "var(--text)", fontWeight: 500 }}>
                  {fmtUSD(r.amount, { sign: true })}
                </td>
                <td>
                  <button className="iconbtn" onClick={(e) => { e.stopPropagation(); onEdit(r); }}>
                    <Icon name="edit" size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--bg-sunk)", fontWeight: 600 }}>
              <td colSpan="7">Total ({filtered.length} entries)</td>
              <td className="num mono">{fmtUSD(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CapitalTab() {
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>
      <div className="card">
        <div className="card-head"><div className="card-title">Capital stack</div></div>
        <div className="card-body">
          <div className="metric-value-mono" style={{ fontSize: 28 }}>$58.4M</div>
          <div className="faint" style={{ fontSize: 11 }}>Total project cost</div>
          <div className="div" />
          <div className="stack" style={{ gap: 14 }}>
            <StackBar label="Senior construction loan" value={36000000} pct={62} cls="accent" detail="Bank OZK · 6.45% SOFR+225" />
            <StackBar label="Mezzanine" value={8400000} pct={14} cls="info" detail="Madison Realty · 11%" />
            <StackBar label="GP equity" value={4200000} pct={7} cls="warn" detail="Sterling PD" />
            <StackBar label="LP equity" value={9800000} pct={17} cls="pos" detail="3 LPs · pref 8%" />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Sources & uses</div></div>
        <div className="card-body-flush">
          <table className="table">
            <tbody>
              {[
                ["Sources", null, true],
                ["Senior debt", "$36.0M"],
                ["Mezzanine", "$8.4M"],
                ["GP equity", "$4.2M"],
                ["LP equity", "$9.8M"],
                ["Uses", null, true],
                ["Land acquisition", "$10.0M"],
                ["Hard costs", "$35.9M"],
                ["Soft costs", "$8.4M"],
                ["Financing & carry", "$2.6M"],
                ["Contingency", "$1.5M"],
              ].map(([k, v, isHead], i) => (
                <tr key={i} style={isHead ? { background: "var(--bg-sunk)" } : {}}>
                  <td style={{ fontWeight: isHead ? 600 : 400, fontSize: isHead ? 11 : 13, textTransform: isHead ? "uppercase" : "none", letterSpacing: isHead ? "0.04em" : 0 }}>{k}</td>
                  <td className="num mono">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DrawsTab() {
  const draws = [
    { num: "Draw 12", date: "May 02, 2024", amount: 1248000, status: "Pending bank review", cls: "warn" },
    { num: "Draw 11", date: "Apr 04, 2024", amount: 1885000, status: "Funded", cls: "pos" },
    { num: "Draw 10", date: "Mar 06, 2024", amount: 1620000, status: "Funded", cls: "pos" },
    { num: "Draw 09", date: "Feb 07, 2024", amount: 1340000, status: "Funded", cls: "pos" },
    { num: "Draw 08", date: "Jan 10, 2024", amount: 980000, status: "Funded", cls: "pos" },
  ];
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "1fr 360px", marginTop: 16 }}>
      <div className="card">
        <div className="card-head">
          <div className="card-title">Lender draws</div>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={12} /> Request draw</button>
        </div>
        <div className="card-body-flush">
          <table className="table">
            <thead>
              <tr>
                <th>Draw #</th>
                <th>Date</th>
                <th className="num">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((d) => (
                <tr key={d.num}>
                  <td style={{ fontWeight: 500 }}>{d.num}</td>
                  <td className="muted mono" style={{ fontSize: 12 }}>{d.date}</td>
                  <td className="num mono">{fmtUSD(d.amount, { compact: true })}</td>
                  <td><span className={`pill ${d.cls} no-dot`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">Contingency</div>
        </div>
        <div className="card-body">
          <div className="row-between"><span className="muted" style={{ fontSize: 12 }}>Hard cost (5%)</span><span className="mono" style={{ fontWeight: 500 }}>$1.8M</span></div>
          <div className="bar" style={{ marginTop: 8 }}><div className="bar-fill warn" style={{ width: "42%" }} /></div>
          <div className="row-between" style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}><span>$760k drawn</span><span>$1.04M remaining</span></div>
          <div className="div" />
          <div className="row-between"><span className="muted" style={{ fontSize: 12 }}>Soft cost</span><span className="mono" style={{ fontWeight: 500 }}>$420k</span></div>
          <div className="bar" style={{ marginTop: 8 }}><div className="bar-fill pos" style={{ width: "18%" }} /></div>
          <div className="row-between" style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}><span>$76k drawn</span><span>$344k remaining</span></div>
        </div>
      </div>
    </div>
  );
}

// ============ MODALS ============
function BudgetModal({ open, row, onClose, onSave }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => { if (open) setForm(row && row.id ? { ...row } : { code: "", name: "", budget: 0, committed: 0, spent: 0, forecast: 0 }); }, [open, row]);

  const isEdit = !!form.id;
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const num = (k) => (v) => setForm({ ...form, [k]: parseFloat(v) || 0 });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit budget — ${form.name}` : "Add budget line"}
      subtitle={isEdit ? `CSI ${form.code} · last edited just now` : "New CSI division line item"}
      width={620}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {isEdit ? "Save changes" : "Add line"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="CSI code"><Input value={form.code} onChange={set("code")} placeholder="03" /></Field>
        <Field label="Division name" span={1}><Input value={form.name} onChange={set("name")} placeholder="Concrete / foundation" /></Field>
        <Field label="Baseline budget"><Input value={form.budget} onChange={num("budget")} type="number" prefix="$" /></Field>
        <Field label="Committed"><Input value={form.committed} onChange={num("committed")} type="number" prefix="$" hint="From signed contracts" /></Field>
        <Field label="Spent to date"><Input value={form.spent} onChange={num("spent")} type="number" prefix="$" /></Field>
        <Field label="Forecast at completion"><Input value={form.forecast} onChange={num("forecast")} type="number" prefix="$" /></Field>
        <Field label="Notes" span={2}>
          <Textarea value={form.notes} onChange={set("notes")} placeholder="Risk notes, scope changes…" />
        </Field>
      </div>
    </Modal>
  );
}

function ExpenseModal({ open, row, divisions, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (open) setForm(row && row.id ? { ...row } : {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      desc: "", vendor: "", division: divisions[0]?.name || "",
      amount: 0, status: "Pending", method: "ACH", invoice: ""
    });
  }, [open, row, divisions]);

  const isEdit = !!form.id;
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const num = (k) => (v) => setForm({ ...form, [k]: parseFloat(v) || 0 });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit expense — ${form.invoice || form.desc}` : "Log new expense"}
      subtitle={isEdit ? `Logged ${form.date}` : "Record an invoice, draw, or reimbursement"}
      width={640}
      footer={
        <>
          {isEdit && (
            <button className="btn btn-ghost" style={{ color: "var(--signal-neg)", marginRight: "auto" }} onClick={() => onDelete(form.id)}>
              <Icon name="trash" size={13} /> Delete
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {isEdit ? "Save changes" : "Log expense"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Date"><Input value={form.date} onChange={set("date")} placeholder="May 06, 2024" /></Field>
        <Field label="Amount"><Input value={form.amount} onChange={num("amount")} type="number" prefix="$" hint="Use negative for credits" /></Field>
        <Field label="Description" span={2}><Input value={form.desc} onChange={set("desc")} placeholder="What is this for?" /></Field>
        <Field label="Vendor"><Input value={form.vendor} onChange={set("vendor")} placeholder="Wonder Works Construction" /></Field>
        <Field label="Division">
          <Select value={form.division} onChange={set("division")} options={divisions.map(d => ({ value: d.name, label: `${d.code} · ${d.name}` }))} />
        </Field>
        <Field label="Status"><Select value={form.status} onChange={set("status")} options={STATUS_OPTS} /></Field>
        <Field label="Payment method"><Select value={form.method} onChange={set("method")} options={METHOD_OPTS} /></Field>
        <Field label="Invoice / reference" span={2}><Input value={form.invoice} onChange={set("invoice")} placeholder="WW-2024-1842" /></Field>
        <Field label="Notes" span={2}>
          <Textarea value={form.notes} onChange={set("notes")} placeholder="Receipts, reviewers, GL coding…" />
        </Field>
      </div>
    </Modal>
  );
}

function FinKpi({ label, value, sub, cls = "neutral" }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="row" style={{ alignItems: "baseline", gap: 8, marginTop: 4 }}>
        <div className="mono" style={{
          fontSize: 22,
          fontWeight: 600,
          color: cls === "neg" ? "var(--signal-neg)" : cls === "pos" ? "var(--signal-pos)" : "var(--text)",
        }}>{value}</div>
      </div>
      <div className="metric-foot"><span>{sub}</span></div>
    </div>
  );
}

function StackBar({ label, value, pct, cls, detail }) {
  return (
    <div>
      <div className="row-between" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 12 }}>{fmtUSD(value, { compact: true })}</span>
      </div>
      <div className="bar"><div className={`bar-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
      <div className="row-between" style={{ marginTop: 3, fontSize: 10, color: "var(--text-faint)" }}>
        <span>{detail}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

window.FinancialsPage = FinancialsPage;
/* global React, Icon, PageHead, fmtUSD */

// Vendor module imported at top of file

function vendorInitials(name) {
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

const TRADE_FILTERS = ["All", "GC", "Design", "Engineering", "Subcontractor", "Consulting", "Legal", "Insurance", "Brokerage"];

// Thin wrapper — delegates to VendorsModule
function VendorsPage() {
  return null; // replaced by VendorsShell in CondoCoreApp
}

function VKpi({ label, value, sub, cls = "neutral" }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="mono" style={{
        fontSize: 22,
        fontWeight: 600,
        color: cls === "warn" ? "var(--signal-warn)" : cls === "pos" ? "var(--signal-pos)" : "var(--text)",
        marginTop: 4,
      }}>{value}</div>
      <div className="metric-foot"><span>{sub}</span></div>
    </div>
  );
}

function Avatar({ init, color = 0, size = 32 }) {
  const palettes = [
    { bg: "var(--accent-soft)", fg: "var(--accent-soft-text)" },
    { bg: "var(--signal-info-soft)", fg: "var(--signal-info)" },
    { bg: "var(--signal-pos-soft)", fg: "var(--signal-pos)" },
    { bg: "var(--signal-warn-soft)", fg: "var(--signal-warn)" },
    { bg: "var(--signal-neg-soft)", fg: "var(--signal-neg)" },
    { bg: "var(--bg-active)", fg: "var(--text)" },
    { bg: "var(--accent)", fg: "var(--text-on-accent)" },
  ];
  const p = palettes[color % palettes.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: p.bg, color: p.fg,
      display: "grid", placeItems: "center",
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{init}</div>
  );
}

function Stars({ value }) {
  return (
    <div className="row" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{
          color: i <= Math.round(value) ? "var(--signal-warn)" : "var(--border-strong)",
          fontSize: 11,
        }}>★</span>
      ))}
    </div>
  );
}

window.VendorsPage = VendorsPage; // kept for compatibility
/* global React, Icon, PageHead */

const FOLDERS = [
  { id: "all", name: "All documents", count: 248, icon: "folder" },
  { id: "fav", name: "Pinned", count: 12, icon: "star" },
  { id: "recent", name: "Recent", count: 24, icon: "clock" },
];

const CATEGORIES = [
  { id: "legal", name: "Legal & offering", count: 38, icon: "file" },
  { id: "permits", name: "Permits & filings", count: 52, icon: "file" },
  { id: "construction", name: "Construction", count: 84, icon: "file" },
  { id: "financial", name: "Financial", count: 36, icon: "file" },
  { id: "insurance", name: "Insurance / COI", count: 18, icon: "file" },
  { id: "marketing", name: "Marketing", count: 12, icon: "file" },
  { id: "closeout", name: "Closeout", count: 8, icon: "file" },
];

const DOCS = [
  { id: "d1", name: "Offering Plan — 712 Driggs (Effective).pdf", category: "Legal & offering", size: "8.4 MB", type: "pdf", modified: "Apr 18, 2024", modifiedBy: "Fried Frank", version: "v3.2", pinned: true, status: "Final" },
  { id: "d2", name: "DOB-NB Application Approval.pdf", category: "Permits & filings", size: "1.2 MB", type: "pdf", modified: "Mar 02, 2024", modifiedBy: "ZProekt Architecture", version: "v1.0", pinned: true, status: "Final" },
  { id: "d3", name: "GC Contract — Wonder Works (executed).pdf", category: "Legal & offering", size: "3.8 MB", type: "pdf", modified: "Feb 14, 2024", modifiedBy: "Fried Frank", version: "v2.1", pinned: true, status: "Final" },
  { id: "d4", name: "Architectural Plans — A-Series (Issued for Construction).dwg", category: "Construction", size: "42 MB", type: "dwg", modified: "Jan 28, 2024", modifiedBy: "ZProekt Architecture", version: "v4.0", pinned: false, status: "Issued" },
  { id: "d5", name: "Structural Steel Shop Drawings.pdf", category: "Construction", size: "12.4 MB", type: "pdf", modified: "May 06, 2024", modifiedBy: "GACE Engineers", version: "v2.0", pinned: false, status: "Under review" },
  { id: "d6", name: "Steel Pricing Memo — Risk Notice.pdf", category: "Construction", size: "486 KB", type: "pdf", modified: "May 06, 2024", modifiedBy: "GACE Engineers", version: "v1.0", pinned: true, status: "Action needed" },
  { id: "d7", name: "Builder's Risk Policy — Marsh.pdf", category: "Insurance / COI", size: "2.1 MB", type: "pdf", modified: "Feb 28, 2024", modifiedBy: "Marsh McLennan", version: "v1.0", pinned: false, status: "Active" },
  { id: "d8", name: "Lender Draw 12 — May 2024.xlsx", category: "Financial", size: "284 KB", type: "xlsx", modified: "May 02, 2024", modifiedBy: "Operations", version: "v1.0", pinned: false, status: "Pending" },
  { id: "d9", name: "Pro Forma — Updated.xlsx", category: "Financial", size: "1.8 MB", type: "xlsx", modified: "Apr 30, 2024", modifiedBy: "Sterling PD", version: "v8.4", pinned: true, status: "Final" },
  { id: "d10", name: "Marketing Brochure — JLL.pdf", category: "Marketing", size: "18 MB", type: "pdf", modified: "Mar 22, 2024", modifiedBy: "JLL", version: "v2.0", pinned: false, status: "Final" },
  { id: "d11", name: "Survey — Williamsburg Block 2349.pdf", category: "Permits & filings", size: "4.2 MB", type: "pdf", modified: "Mar 27, 2024", modifiedBy: "Langan", version: "v1.0", pinned: false, status: "Final" },
  { id: "d12", name: "MEP Coordination Drawings.pdf", category: "Construction", size: "32 MB", type: "pdf", modified: "Apr 18, 2024", modifiedBy: "ME Engineers", version: "v1.2", pinned: false, status: "Issued" },
  { id: "d13", name: "Schindler Elevator COI.pdf", category: "Insurance / COI", size: "320 KB", type: "pdf", modified: "Apr 02, 2024", modifiedBy: "Schindler Elevator", version: "v1.0", pinned: false, status: "Expiring" },
  { id: "d14", name: "Site Photo — May 06.jpg", category: "Construction", size: "4.8 MB", type: "img", modified: "May 06, 2024", modifiedBy: "Site Operations", version: "v1.0", pinned: false, status: "—" },
];

const TYPE_ICONS = {
  pdf: { ext: "PDF", bg: "var(--signal-neg-soft)", fg: "var(--signal-neg)" },
  xlsx: { ext: "XLS", bg: "var(--signal-pos-soft)", fg: "var(--signal-pos)" },
  dwg: { ext: "DWG", bg: "var(--signal-info-soft)", fg: "var(--signal-info)" },
  img: { ext: "JPG", bg: "var(--signal-warn-soft)", fg: "var(--signal-warn)" },
};

function DocumentVaultPage() {
  const [folder, setFolder] = React.useState("all");
  const [category, setCategory] = React.useState(null);
  const [view, setView] = React.useState("list");
  const [search, setSearch] = React.useState("");

  const filtered = DOCS.filter(d => {
    if (folder === "fav" && !d.pinned) return false;
    if (category && d.category !== category) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHead
        eyebrow="Document vault"
        title="712 Driggs · Documents"
        sub="Offering plans, contracts, drawings, COIs, and closeout — version-controlled with full audit trail."
        actions={
          <>
            <button className="btn btn-secondary"><Icon name="folder" size={13} /> New folder</button>
            <button className="btn btn-primary"><Icon name="plus" size={13} /> Upload</button>
          </>
        }
      />

      <div className="grid-2" style={{ gridTemplateColumns: "260px 1fr", gap: 16 }}>
        <aside className="vault-aside">
          <div className="vault-aside-section">
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                className={`vault-folder ${folder === f.id && !category ? "active" : ""}`}
                onClick={() => { setFolder(f.id); setCategory(null); }}
              >
                <Icon name={f.icon} size={14} />
                <span style={{ flex: 1, textAlign: "left" }}>{f.name}</span>
                <span className="mono faint" style={{ fontSize: 11 }}>{f.count}</span>
              </button>
            ))}
          </div>
          <div className="vault-aside-section">
            <div className="vault-section-label">Categories</div>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`vault-folder ${category === c.name ? "active" : ""}`}
                onClick={() => { setCategory(c.name); setFolder("all"); }}
              >
                <Icon name={c.icon} size={14} />
                <span style={{ flex: 1, textAlign: "left" }}>{c.name}</span>
                <span className="mono faint" style={{ fontSize: 11 }}>{c.count}</span>
              </button>
            ))}
          </div>
          <div className="vault-aside-section">
            <div className="vault-section-label">Storage</div>
            <div style={{ padding: "0 4px" }}>
              <div className="row-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>2.4 GB</span>
                <span className="faint" style={{ fontSize: 11 }}>of 10 GB</span>
              </div>
              <div className="bar" style={{ height: 4 }}>
                <div className="bar-fill accent" style={{ width: "24%" }} />
              </div>
            </div>
          </div>
        </aside>

        <div className="card">
          <div className="card-head">
            <div className="row" style={{ gap: 10, flex: 1 }}>
              <label className="topbar-search" style={{ width: 320, margin: 0 }}>
                <Icon name="search" size={13} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents…"
                  style={{ background: "transparent", border: "none", color: "inherit", width: "100%", outline: "none", fontSize: 13 }}
                />
              </label>
              <select className="select"><option>All types</option></select>
              <select className="select"><option>Modified anytime</option></select>
            </div>
            <div className="card-actions">
              <div className="seg">
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><Icon name="list" size={12} /></button>
                <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><Icon name="grid" size={12} /></button>
              </div>
            </div>
          </div>

          <div className="vault-breadcrumb">
            <span className="faint">Vault</span>
            <Icon name="chevronRight" size={11} style={{ color: "var(--text-faint)" }} />
            <span>{category || (folder === "fav" ? "Pinned" : folder === "recent" ? "Recent" : "All documents")}</span>
            <span className="muted" style={{ marginLeft: 12, fontSize: 12 }}>{filtered.length} items</span>
          </div>

          {view === "list" ? <ListView docs={filtered} /> : <GridView docs={filtered} />}
        </div>
      </div>
    </>
  );
}

function ListView({ docs }) {
  return (
    <div className="card-body-flush">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 28 }}></th>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Modified</th>
            <th className="num">Size</th>
            <th>Version</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => {
            const type = TYPE_ICONS[d.type] || TYPE_ICONS.pdf;
            return (
              <tr key={d.id}>
                <td>
                  {d.pinned ? <Icon name="star" size={12} style={{ color: "var(--signal-warn)" }} /> : null}
                </td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 6,
                      background: type.bg, color: type.fg,
                      display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 700, flexShrink: 0,
                      letterSpacing: "0.04em",
                    }}>{type.ext}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</div>
                      <div className="faint" style={{ fontSize: 11 }}>{d.modifiedBy}</div>
                    </div>
                  </div>
                </td>
                <td><span className="pill neutral no-dot">{d.category}</span></td>
                <td>
                  <span className={`pill no-dot ${
                    d.status === "Final" || d.status === "Active" ? "pos" :
                    d.status === "Action needed" || d.status === "Expiring" ? "warn" :
                    d.status === "Under review" || d.status === "Pending" ? "info" :
                    "neutral"
                  }`}>{d.status}</span>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{d.modified}</td>
                <td className="num mono faint" style={{ fontSize: 12 }}>{d.size}</td>
                <td className="mono" style={{ fontSize: 12 }}>{d.version}</td>
                <td>
                  <div className="row" style={{ gap: 2 }}>
                    <button className="iconbtn"><Icon name="download" size={13} /></button>
                    <button className="iconbtn"><Icon name="more" size={14} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GridView({ docs }) {
  return (
    <div className="card-body" style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {docs.map((d) => {
          const type = TYPE_ICONS[d.type] || TYPE_ICONS.pdf;
          return (
            <div key={d.id} className="vendor-card" style={{ padding: 14 }}>
              <div className="row-between" style={{ marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 7,
                  background: type.bg, color: type.fg,
                  display: "grid", placeItems: "center",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.04em",
                }}>{type.ext}</div>
                <div className="row" style={{ gap: 4 }}>
                  {d.pinned && <Icon name="star" size={12} style={{ color: "var(--signal-warn)" }} />}
                  <button className="iconbtn"><Icon name="more" size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {d.name}
              </div>
              <div className="faint" style={{ fontSize: 11, marginBottom: 8 }}>{d.modifiedBy}</div>
              <div className="row-between" style={{ fontSize: 11, color: "var(--text-muted)" }}>
                <span>{d.modified}</span>
                <span className="mono">{d.size}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.DocumentVaultPage = DocumentVaultPage;


const TWEAK_DEFAULTS = {
  theme: "slate",
  mode: "light",
  density: "comfy",
  fontFamily: "tight",
  radius: 8,
  showBadges: true,
};

const PAGES = {
  dashboard: { Component: DashboardPage, crumbs: ["Workspace", "Dashboard"], asset: "blueprint" },
  details: { Component: ProjectDetailsPage, crumbs: ["Workspace", "712 Driggs", "Project details"], asset: "blueprint" },
  plan: { Component: ProjectPlanPage, crumbs: ["Workspace", "712 Driggs", "Project plan"], asset: "blueprint" },
  stacking: { Component: StackingPlanPage, crumbs: ["Workspace", "712 Driggs", "Stacking plan"], asset: "blueprint" },
  financials: { Component: FinancialsPage, crumbs: ["Workspace", "712 Driggs", "Financials"], asset: "finance" },
  vendors: { Component: VendorsPage, crumbs: ["Workspace", "712 Driggs", "Vendors"], asset: "finance" },
  vault: { Component: DocumentVaultPage, crumbs: ["Workspace", "712 Driggs", "Document vault"], asset: "vault" },
};

const PAGE_ASSETS = {
  blueprint: "/manus-storage/condocore-hero-blueprint_6f2f5977.png",
  finance: "/manus-storage/condocore-finance-ledger_2611f913.png",
  vault: "/manus-storage/condocore-document-vault_04fdc28d.png",
};

function PageAssetBanner({ asset, route }) {
  const src = PAGE_ASSETS[asset] || PAGE_ASSETS.blueprint;
  return (
    <div className={`page-asset page-asset-${asset}`} aria-hidden="true">
      <img src={src} alt="" />
      <div className="page-asset-caption mono">{route.toUpperCase()} · CONDOCORE OPERATIONS FABRIC</div>
    </div>
  );
}

function readRouteFromHash() {
  const h = (window.location.hash || "").replace(/^#\/?/, "");
  return PAGES[h] ? h : "dashboard";
}

function CondoCoreApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(readRouteFromHash());
  // Vendor detail sub-routing: null = list, string = vendor id
  const [vendorDetailId, setVendorDetailId] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", `${t.theme}-${t.mode}`);
    document.documentElement.setAttribute("data-density", t.density);
    document.documentElement.setAttribute("data-font", t.fontFamily);
    document.documentElement.style.setProperty("--radius", `${t.radius}px`);
  }, [t.theme, t.mode, t.density, t.fontFamily, t.radius]);

  React.useEffect(() => {
    const onHash = () => {
      const newRoute = readRouteFromHash();
      setRoute(newRoute);
      // Clear vendor detail when navigating away from vendors
      if (newRoute !== "vendors") setVendorDetailId(null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleNav = (id) => {
    window.location.hash = `/${id}`;
    setRoute(id);
    if (id !== "vendors") setVendorDetailId(null);
  };

  const toggleTheme = () => {
    setTweak("mode", t.mode === "light" ? "dark" : "light");
  };

  const pageConfig = PAGES[route];
  // Dynamic crumbs for vendor detail
  const crumbs = vendorDetailId && route === "vendors"
    ? [...pageConfig.crumbs, "Vendor details"]
    : pageConfig.crumbs;

  return (
    <ExpenseStoreProvider>
    <BudgetStoreProvider seedBudget={DRIGGS_712_BUDGET}>
    <ExpenseStoreProvider2 seedExpenses={INITIAL_EXPENSES}>
    <VendorStoreProvider>
    <div className="condocore-root app-shell">
      <Rail active={route} onNav={handleNav} project={PROJECTS[0]} onProjectSwitch={() => {}} />
      <main className="main">
        <TopBar crumbs={crumbs} onTheme={toggleTheme} theme={`${t.theme}-${t.mode}`} />
        <div className="page">
          {route === "vendors" ? (
            vendorDetailId ? (
              <VendorDetailPageImpl
                vendorId={vendorDetailId}
                onBack={() => setVendorDetailId(null)}
              />
            ) : (
              <VendorsPageImpl onViewVendor={(id) => setVendorDetailId(id)} />
            )
          ) : (
            React.createElement(pageConfig.Component)
          )}
        </div>
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio
          label="Palette"
          value={t.theme}
          options={[{ value: "stone", label: "Stone" }, { value: "slate", label: "Slate" }, { value: "carbon", label: "Carbon" }]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakRadio
          label="Mode"
          value={t.mode}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          onChange={(v) => setTweak("mode", v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={[{ value: "compact", label: "Compact" }, { value: "regular", label: "Regular" }, { value: "comfy", label: "Comfy" }]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSlider label="Corner radius" value={t.radius} min={2} max={14} step={1} unit="px" onChange={(v) => setTweak("radius", v)} />
        <TweakSection label="Typography" />
        <TweakRadio
          label="Type system"
          value={t.fontFamily}
          options={[{ value: "tight", label: "Inter Tight" }, { value: "serif", label: "Serif accents" }]}
          onChange={(v) => setTweak("fontFamily", v)}
        />
        <TweakSection label="Display" />
        <TweakToggle label="Show nav badges" value={t.showBadges} onChange={(v) => setTweak("showBadges", v)} />
      </TweaksPanel>
    </div>
    </VendorStoreProvider>
    </ExpenseStoreProvider2>
    </BudgetStoreProvider>
    </ExpenseStoreProvider>
  );
}

export default CondoCoreApp;
