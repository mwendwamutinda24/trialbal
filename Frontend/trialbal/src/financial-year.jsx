import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';


/**
 * ---------------------------------------------------------------------------
 * financial-year.jsx — Financial Year detail page (HOI / Principal view)
 * ---------------------------------------------------------------------------
 * Route it like: <Route path="/financial-years/:id" element={<FinancialYear />} />
 *
 * The sidebar items (Overview, Trial Balance, Financial Statements, Income,
 * Cash & Bank, Receivables, Payables, Equity) are NOT separate routes —
 * clicking one just swaps which panel is rendered via local state. The
 * "view" search param is kept in sync purely so the page stays linkable
 * (e.g. /financial-years/7?view=trial-balance), same idea as the reference
 * screenshot's URL.
 *
 * Data flow:
 *  - useFinancialYearData() below is a STAND-IN for real API calls. Replace
 *    its body with fetches to your Backend (e.g. GET /api/financial-years/:id,
 *    GET /api/financial-years/:id/accounts) using the Bearer token the same
 *    way Home.jsx / AuthContext do it elsewhere in this project.
 * ---------------------------------------------------------------------------
 */

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: IconGrid },
  { key: 'trial-balance', label: 'Trial Balance', icon: IconUpload },
  { key: 'financial-statements', label: 'Financial Statements', icon: IconDoc },
  { key: 'income', label: 'Income', icon: IconTrendUp },
  { key: 'cash-bank', label: 'Cash & Bank', icon: IconBank },
  { key: 'receivables', label: 'Receivables', icon: IconUsers },
  { key: 'payables', label: 'Payables', icon: IconCard },
  { key: 'equity', label: 'Equity', icon: IconPiggyBank },
];

// ---- data hook (replace with real API calls later) ------------------------
function useFinancialYearData(financialYearId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // TODO: swap for real calls, e.g.
        // const token = await getToken();
        // const res = await fetch(`${API_BASE_URL}/financial-years/${financialYearId}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const json = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 200));

        const json = {
          school: {
            name: 'Stephen Kanja hybrid school',
            county: 'Kwale County',
          },
          user: {
            name: 'Mwayeye kayeye',
            role: 'Principal',
            initials: 'MK',
          },
          financialYear: {
            id: financialYearId,
            label: '2026/27',
            status: 'finalized',
            startDate: '2026-07-01',
            endDate: '2027-06-30',
          },
          accounts: [
            { id: 1, name: 'Operations' },
            { id: 2, name: 'Tuition' },
            { id: 3, name: 'School Fund' },
            { id: 4, name: 'Infrastructure' },
          ],
          // Empty until a template has been uploaded and parsed by the backend.
          trialBalanceRows: [],
        };

        if (!cancelled) setData(json);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [financialYearId]);

  return { data, loading };
}

// ---- tiny inline icon set --------------------------------------------------
const iconProps = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

function IconGrid(p) { return (<svg {...iconProps} {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>); }
function IconUpload(p) { return (<svg {...iconProps} {...p}><path d="M7 16a4 4 0 0 1-1-7.87A5 5 0 0 1 15.9 6H17a4 4 0 0 1 1 7.87" /><path d="M12 12v6M9 15l3-3 3 3" /></svg>); }
function IconDoc(p) { return (<svg {...iconProps} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>); }
function IconTrendUp(p) { return (<svg {...iconProps} {...p}><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>); }
function IconBank(p) { return (<svg {...iconProps} {...p}><path d="m2 9 10-6 10 6" /><path d="M4 9v10M20 9v10M8 9v10M16 9v10" /><path d="M2 21h20" /></svg>); }
function IconUsers(p) { return (<svg {...iconProps} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 8.5a3 3 0 1 1 3.5 2.96" /><path d="M15.5 14.5a6.5 6.5 0 0 1 6 5.5" /></svg>); }
function IconCard(p) { return (<svg {...iconProps} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>); }
function IconPiggyBank(p) { return (<svg {...iconProps} {...p}><path d="M19 9V6a1 1 0 0 0-1-1h-1l-1-2-2 1a7 7 0 0 0-6 7c0 1 0 2 1 3l-1 3h3l1-1h4l1 1h2l-1-3a5 5 0 0 0 1-4Z" /><circle cx="15" cy="10" r="0.5" fill="currentColor" /></svg>); }
function IconBuilding(p) { return (<svg {...iconProps} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>); }
function IconPencil(p) { return (<svg {...iconProps} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>); }
function IconChevronDown(p) { return (<svg {...iconProps} {...p}><path d="m6 9 6 6 6-6" /></svg>); }
function IconChevronLeft(p) { return (<svg {...iconProps} {...p}><path d="m15 18-6-6 6-6" /></svg>); }
function IconLock(p) { return (<svg {...iconProps} {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V7a4 4 0 0 1 8 0" /></svg>); }
function IconCollapse(p) { return (<svg {...iconProps} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>); }
function IconDownload(p) { return (<svg {...iconProps} {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></svg>); }
function IconUploadFile(p) { return (<svg {...iconProps} {...p}><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M4 3h16" /></svg>); }

// ---- helper -----------------------------------------------------------
function formatAmount(n) {
  const value = typeof n === 'number' ? n : 0;
  return value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- sub-components -----------------------------------------------------
function TrialBalancePanel({ financialYearId, accounts, trialBalanceRows }) {
  const [selectedAccountIds, setSelectedAccountIds] = useState(accounts.map((a) => a.id));
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = React.useRef(null);

  function toggleAccount(id) {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleDownload() {
    if (selectedAccountIds.length === 0) {
      alert('Select at least one account.');
      return;
    }

    const params = new URLSearchParams();
    params.set('financial_year_id', financialYearId);
    selectedAccountIds.forEach((id) => params.append('account_ids[]', id));

    // TODO: point this at your real Backend endpoint, e.g.
    // window.location.href = `${API_BASE_URL}/financial-years/${financialYearId}/trial-balance/template?${params.toString()}`;
    window.location.href = `/api/financial-years/trial-balance-template?${params.toString()}`;
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Uploading ${file.name}…`);

    const formData = new FormData();
    formData.append('financial_year_id', financialYearId);
    formData.append('template', file);

    try {
      // TODO: point this at your real Backend endpoint.
      const res = await fetch('/api/financial-years/trial-balance-upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setUploadStatus('Uploaded successfully — refreshing…');
        // TODO: re-fetch trial balance rows instead of a full reload once wired up.
        window.location.reload();
      } else {
        setUploadStatus(`Upload failed: ${json.message || 'Unknown error'}`);
      }
    } catch {
      setUploadStatus('Upload failed: could not reach the server.');
    }
  }

  return (
    <>
      <div className="fy-panel">
        <h2 className="fy-panel-title">Trial balance — school accounts</h2>
        <p className="fy-panel-desc">
          Choose the school accounts you want, download one combined template (one sheet per
          account, pre-filled with voteheads, bank accounts and cash-in-hand rows), fill in the
          DR/CR figures offline, then upload it back as a single file.
        </p>

        <div className="fy-checkbox-row">
          {accounts.map((account) => (
            <label key={account.id}>
              <input
                type="checkbox"
                checked={selectedAccountIds.includes(account.id)}
                onChange={() => toggleAccount(account.id)}
              />
              {account.name}
            </label>
          ))}
        </div>

        <div className="fy-btn-row">
          <button className="fy-btn fy-btn--primary" type="button" onClick={handleDownload}>
            <IconDownload />
            Download combined template (.xlsx)
          </button>

          <button className="fy-btn" type="button" onClick={handleUploadClick}>
            <IconUploadFile />
            Upload filled template
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="fy-file-input"
            onChange={handleFileChange}
          />
        </div>

        {uploadStatus && <p className="fy-upload-status">{uploadStatus}</p>}
      </div>

      <div className="fy-table-wrap">
        <table className="fy-table">
          <thead>
            <tr>
              <th>Fund</th>
              <th>Votehead</th>
              <th>Note</th>
              <th>Estimates</th>
              <th>Commitments</th>
              <th>DR</th>
              <th>CR</th>
            </tr>
          </thead>
          <tbody>
            {trialBalanceRows.length === 0 ? (
              <tr>
                <td className="fy-empty" colSpan={7}>No trial balance data uploaded yet.</td>
              </tr>
            ) : (
              trialBalanceRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.fundName}</td>
                  <td>{row.voteheadName ?? '—'}</td>
                  <td>{row.note ?? ''}</td>
                  <td className="fy-num">{formatAmount(row.estimates)}</td>
                  <td className="fy-num">{formatAmount(row.commitment)}</td>
                  <td className="fy-num">{formatAmount(row.debit)}</td>
                  <td className="fy-num">{formatAmount(row.credit)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PlaceholderPanel({ title, children }) {
  return (
    <div className="fy-panel fy-placeholder">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

// ---- page ---------------------------------------------------------------
function FinancialYear() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const financialYearId = id || '7';

  const { data, loading } = useFinancialYearData(financialYearId);
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'trial-balance');

  function handleNavClick(key) {
    setActiveView(key);
    setSearchParams({ view: key }, { replace: true });
  }

  if (loading || !data) {
    return (
      <div className="fy-loading">
        <p>Loading financial year…</p>
      </div>
    );
  }

  const { school, user, financialYear, accounts, trialBalanceRows } = data;

  return (
    <div className="fy-shell">
      {/* ============================= HEADER ============================= */}
      <header className="fy-header">
        <div className="fy-header-left">
          <button className="fy-collapse-btn" title="Collapse sidebar" type="button">
            <IconCollapse />
          </button>
          <span className="fy-school-icon">
            <IconBuilding />
          </span>
          <div>
            <div className="fy-school-name-row">
              <p className="fy-school-name">{school.name}</p>
              <IconPencil className="fy-pencil" />
            </div>
            <p className="fy-school-county">{school.county}</p>
          </div>
        </div>

        <div className="fy-profile">
          <span className="fy-avatar">{user.initials}</span>
          <div>
            <span className="fy-profile-name">{user.name}</span>
            <span className="fy-profile-role">{user.role}</span>
          </div>
          <IconChevronDown className="fy-chevron" />
        </div>
      </header>

      {/* ============================= SIDEBAR ============================= */}
      <aside className="fy-sidebar">
        <Link className="fy-breadcrumb" to="/financial-years">
          <IconChevronLeft />
          All Financial Years
        </Link>

        <div className="fy-year-block">
          <div className="fy-year-row">
            <p className="fy-year-label">{financialYear.label}</p>
            <span className="fy-status-pill">{financialYear.status}</span>
          </div>
          <p className="fy-year-dates">{financialYear.startDate} – {financialYear.endDate}</p>

          <button className="fy-unlock-btn" type="button" onClick={() => alert('TODO: wire up unlock-for-editing endpoint')}>
            <IconLock />
            Unlock for editing
          </button>
        </div>

        <nav className="fy-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`fy-nav-item${activeView === key ? ' active' : ''}`}
              type="button"
              onClick={() => handleNavClick(key)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ============================= MAIN ============================= */}
      <main className="fy-main">
        {activeView === 'overview' && (
          <PlaceholderPanel title="Overview">
            Summary cards (receipts, payments, surplus, cash, net assets) go here — same shape
            as the dashboard's stats, scoped to this financial year.
            Backend: GET /api/financial-years/{financialYear.id}/summary
          </PlaceholderPanel>
        )}

        {activeView === 'trial-balance' && (
          <TrialBalancePanel
            financialYearId={financialYear.id}
            accounts={accounts}
            trialBalanceRows={trialBalanceRows}
          />
        )}

        {activeView === 'financial-statements' && (
          <PlaceholderPanel title="Financial Statements">
            Statement of Receipts & Payments, Statement of Assets & Liabilities, and notes —
            generated once the trial balance is uploaded.
          </PlaceholderPanel>
        )}

        {activeView === 'income' && (
          <PlaceholderPanel title="Income">
            Breakdown of receipts by votehead / income line for this financial year.
          </PlaceholderPanel>
        )}

        {activeView === 'cash-bank' && (
          <PlaceholderPanel title="Cash & Bank">
            Opening/closing bank balances per account, reconciliation status.
          </PlaceholderPanel>
        )}

        {activeView === 'receivables' && (
          <PlaceholderPanel title="Receivables">
            Fees arrears and other amounts owed to the school.
          </PlaceholderPanel>
        )}

        {activeView === 'payables' && (
          <PlaceholderPanel title="Payables">
            Creditors and other amounts the school owes.
          </PlaceholderPanel>
        )}

        {activeView === 'equity' && (
          <PlaceholderPanel title="Equity">
            Net assets / accumulated fund movement for the year.
          </PlaceholderPanel>
        )}
      </main>
    </div>
  );
}

export default FinancialYear;