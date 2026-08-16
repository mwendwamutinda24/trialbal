import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

/**
 * ---------------------------------------------------------------------------
 * FinancialYear.jsx — single financial year detail page
 * ---------------------------------------------------------------------------
 * Route it like: <Route path="/financial-years/:id" element={<FinancialYear />} />
 *
 * Data flow:
 *  - On load: GET /financial-years/:id (label, dates, status, totals) and
 *    GET /financial-years/:id/trial-balance (rows: account code, name,
 *    category, debit, credit).
 *  - Upload: POST /financial-years/:id/trial-balance/upload as multipart
 *    form-data, field name "file". Backend re-parses with SheetJS and
 *    returns the updated rows + totals.
 *  - Download: GET /financial-years/:id/trial-balance/download streams an
 *    .xlsx file back — triggered via a plain link/anchor click so the
 *    browser handles the file save.
 *  - Finalize / unlock: PATCH /financial-years/:id with { status }.
 *
 * Reuses hk-* classes from Home.jsx and fy-* classes introduced in
 * NewFinancialYear.jsx (fy-breadcrumb, fy-btn, fy-btn--primary). New
 * fy-table-* classes are introduced here for the trial balance table —
 * add them to your stylesheet alongside the others.
 * ---------------------------------------------------------------------------
 */

const API_URL = "https://trialbal-1.onrender.com";
const GOLD = '#E8B923';

// ---- icons ---------------------------------------------------------------
const iconProps = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconChevronLeft = (p) => (<svg {...iconProps} {...p}><path d="m15 18-6-6 6-6" /></svg>);
const IconBuilding = (p) => (<svg {...iconProps} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>);
const IconUpload = (p) => (<svg {...iconProps} {...p}><path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>);
const IconDownload = (p) => (<svg {...iconProps} {...p}><path d="M12 4v12M6 10l6 6 6-6" /><path d="M4 20h16" /></svg>);
const IconLock = (p) => (<svg {...iconProps} {...p}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>);
const IconUnlock = (p) => (<svg {...iconProps} {...p}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 7.5-2" /></svg>);
const IconArrowUp = (p) => (<svg {...iconProps} {...p}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>);
const IconArrowDown = (p) => (<svg {...iconProps} {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>);
const IconScale = (p) => (<svg {...iconProps} {...p}><path d="M12 3v18M7 21h10M6 7l-3 5a3 3 0 0 0 6 0Zm12 0-3 5a3 3 0 0 0 6 0ZM4 7h5M15 7h5" /></svg>);
const IconWallet = (p) => (<svg {...iconProps} {...p}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" /><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" /></svg>);
const IconPiggyBank = (p) => (<svg {...iconProps} {...p}><path d="M19 9V6a1 1 0 0 0-1-1h-1l-1-2-2 1a7 7 0 0 0-6 7c0 1 0 2 1 3l-1 3h3l1-1h4l1 1h2l-1-3a5 5 0 0 0 1-4Z" /><circle cx="15" cy="10" r="0.5" fill="currentColor" /></svg>);

function formatAmount(n) {
  const value = typeof n === 'number' ? n : 0;
  return value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- small building blocks ------------------------------------------------
function StatCard({ icon, tint, label, value }) {
  return (
    <div className="hk-stat-card">
      <div className="hk-stat-icon" style={{ backgroundColor: tint.bg, color: tint.fg }}>
        {icon}
      </div>
      <p className="hk-stat-label">{label}</p>
      <p className="hk-stat-value">{formatAmount(value)}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const finalized = status === 'finalized';
  return (
    <span className={`fy-status-badge ${finalized ? 'fy-status-badge--final' : 'fy-status-badge--draft'}`}>
      {finalized ? 'Finalized' : 'Draft'}
    </span>
  );
}

function TrialBalanceTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="hk-empty-state">
        <p className="hk-empty-title">No trial balance uploaded yet</p>
        <p className="hk-empty-sub">
          Upload an Excel file with your account codes, names, debits and credits to get started.
        </p>
      </div>
    );
  }

  const totalDebit = rows.reduce((sum, r) => sum + (Number(r.debit) || 0), 0);
  const totalCredit = rows.reduce((sum, r) => sum + (Number(r.credit) || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="fy-table-wrap">
      <table className="fy-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Account</th>
            <th>Category</th>
            <th className="fy-table-num">Debit</th>
            <th className="fy-table-num">Credit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id || r.accountCode}>
              <td>{r.accountCode}</td>
              <td>{r.accountName}</td>
              <td>{r.category}</td>
              <td className="fy-table-num">{formatAmount(Number(r.debit) || 0)}</td>
              <td className="fy-table-num">{formatAmount(Number(r.credit) || 0)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Totals</td>
            <td className="fy-table-num">{formatAmount(totalDebit)}</td>
            <td className="fy-table-num">{formatAmount(totalCredit)}</td>
          </tr>
        </tfoot>
      </table>

      {!balanced && (
        <p className="fy-imbalance-warning">
          Debits and credits don't match (difference of {formatAmount(Math.abs(totalDebit - totalCredit))}). Check the uploaded file.
        </p>
      )}
    </div>
  );
}

// ---- page ------------------------------------------------------------------
function FinancialYear() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [school, setSchool] = useState(null);
  const [year, setYear] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [meRes, yearRes, tbRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/financial-years/${id}`, { headers }),
          fetch(`${API_URL}/financial-years/${id}/trial-balance`, { headers }),
        ]);

        if (!meRes.ok || !yearRes.ok) throw new Error('Failed to load financial year.');

        const me = await meRes.json();
        const yearData = await yearRes.json();
        const tbData = tbRes.ok ? await tbRes.json() : [];

        if (cancelled) return;

        setSchool({ name: me.schoolName, county: me.county });
        setYear(yearData);
        setRows(Array.isArray(tbData) ? tbData : tbData.rows || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load this financial year.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/financial-years/${id}/trial-balance/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed.');

      setRows(json.rows || []);
      if (json.totals) {
        setYear((prev) => (prev ? { ...prev, totals: json.totals } : prev));
      }
    } catch (err) {
      setError(err.message || 'Could not upload the trial balance.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDownload() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/financial-years/${id}/trial-balance/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trial-balance-${year?.label || id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Could not download the trial balance.');
    }
  }

  async function handleToggleStatus() {
    if (!year) return;
    const nextStatus = year.status === 'finalized' ? 'draft' : 'finalized';
    const confirmMsg = nextStatus === 'finalized'
      ? 'Finalize this financial year? It will be locked from further edits.'
      : 'Unlock this financial year for editing?';
    if (!window.confirm(confirmMsg)) return;

    setStatusUpdating(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/financial-years/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not update status.');

      setYear((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      setError(err.message || 'Could not update the financial year status.');
    } finally {
      setStatusUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="hk-loading">
        <p>Loading financial year…</p>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="hk-loading">
        <p>{error || 'Financial year not found.'}</p>
        <Link to="/home" className="fy-breadcrumb"><IconChevronLeft /> Back to dashboard</Link>
      </div>
    );
  }

  const totals = year.totals || { receipts: 0, payments: 0, surplus: 0, cash: 0, netAssets: 0 };
  const isFinalized = year.status === 'finalized';

  return (
    <div className="hk-page">
      <header className="hk-header">
        <div className="hk-header-left">
          <span className="hk-icon-badge">
            <IconBuilding />
          </span>
          <div>
            <h1 className="hk-school-name">{school?.name}</h1>
            <p className="hk-county">{school?.county}</p>
          </div>
        </div>
      </header>

      <main className="hk-main">
        <Link to="/home" className="fy-breadcrumb">
          <IconChevronLeft />
          Back to dashboard
        </Link>

        {/* year header */}
        <div className="fy-year-header">
          <div>
            <div className="fy-year-title-row">
              <h2 className="hk-welcome-title">{year.label}</h2>
              <StatusBadge status={year.status} />
            </div>
            <p className="hk-welcome-sub">
              {year.startDate?.slice(0, 10)} – {year.endDate?.slice(0, 10)}
            </p>
          </div>

          <button
            type="button"
            className={`fy-btn ${isFinalized ? '' : 'fy-btn--primary'}`}
            onClick={handleToggleStatus}
            disabled={statusUpdating}
          >
            {isFinalized ? <IconUnlock width={16} height={16} /> : <IconLock width={16} height={16} />}
            {statusUpdating ? 'Updating…' : isFinalized ? 'Unlock year' : 'Finalize year'}
          </button>
        </div>

        {error && <p className="nfy-error">{error}</p>}

        {/* stats */}
        <div className="hk-grid-stats">
          <StatCard icon={<IconArrowUp />} tint={{ bg: '#ecfdf5', fg: '#059669' }} label="Total Receipts" value={totals.receipts} />
          <StatCard icon={<IconArrowDown />} tint={{ bg: '#fef2f2', fg: '#dc2626' }} label="Total Payments" value={totals.payments} />
          <StatCard icon={<IconScale />} tint={{ bg: '#eff6ff', fg: '#2563eb' }} label="Surplus / (Deficit)" value={totals.surplus} />
          <StatCard icon={<IconWallet />} tint={{ bg: '#fffbeb', fg: '#b45309' }} label="Cash & Bank" value={totals.cash} />
          <StatCard icon={<IconPiggyBank />} tint={{ bg: '#faf5ff', fg: '#7c3aed' }} label="Net Assets" value={totals.netAssets} />
        </div>

        {/* trial balance panel */}
        <div className="hk-panel">
          <div className="hk-panel-header fy-tb-header">
            <div>
              <h3 className="hk-panel-title">Trial Balance</h3>
              <p className="hk-panel-subtitle">Upload an Excel file or download the current data.</p>
            </div>

            <div className="fy-tb-actions">
              <button type="button" className="fy-btn" onClick={handleDownload}>
                <IconDownload width={16} height={16} /> Download
              </button>
              <button
                type="button"
                className="fy-btn fy-btn--primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isFinalized}
                title={isFinalized ? 'Unlock the year to upload a new trial balance' : undefined}
              >
                <IconUpload width={16} height={16} /> {uploading ? 'Uploading…' : 'Upload Excel'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <TrialBalanceTable rows={rows} />
        </div>
      </main>
    </div>
  );
}

export default FinancialYear;
