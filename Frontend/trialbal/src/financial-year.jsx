import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';


const API_URL = "https://trialbal-1.onrender.com";

// ---- icons ---------------------------------------------------------------
const iconProps = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconChevronLeft = (p) => (<svg {...iconProps} {...p}><path d="m15 18-6-6 6-6" /></svg>);
const IconChevronDown = (p) => (<svg {...iconProps} {...p}><path d="m6 9 6 6 6-6" /></svg>);
const IconPanelLeft = (p) => (<svg {...iconProps} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>);
const IconBuilding = (p) => (<svg {...iconProps} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>);
const IconPencil = (p) => (<svg {...iconProps} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
const IconHome = (p) => (<svg {...iconProps} {...p}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
const IconCalendar = (p) => (<svg {...iconProps} {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
const IconLock = (p) => (<svg {...iconProps} {...p}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>);
const IconUnlock = (p) => (<svg {...iconProps} {...p}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 7.5-2" /></svg>);
const IconUser = (p) => (<svg {...iconProps} {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>);
const IconLogOut = (p) => (<svg {...iconProps} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>);
const IconGrid = (p) => (<svg {...iconProps} {...p}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>);
const IconUpload = (p) => (<svg {...iconProps} {...p}><path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>);
const IconCloud = (p) => (<svg {...iconProps} {...p}><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.5 2A4 4 0 0 0 6.5 19h11Z" /></svg>);
const IconDownload = (p) => (<svg {...iconProps} {...p}><path d="M12 4v12M6 10l6 6 6-6" /><path d="M4 20h16" /></svg>);
const IconFileText = (p) => (<svg {...iconProps} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h8M8 9h2" /></svg>);
const IconLandmark = (p) => (<svg {...iconProps} {...p}><path d="M3 21h18M4 10h16M5 6l7-4 7 4" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /></svg>);
const IconUsers = (p) => (<svg {...iconProps} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconCreditCard = (p) => (<svg {...iconProps} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>);
const IconFileBarChart = (p) => (<svg {...iconProps} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M9 17v-3M12 17v-5M15 17v-2" /></svg>);
const IconFileCheck = (p) => (<svg {...iconProps} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="m9 15 2 2 4-4" /></svg>);
const IconArrowUp = (p) => (<svg {...iconProps} {...p}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>);
const IconArrowDown = (p) => (<svg {...iconProps} {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>);
const IconScale = (p) => (<svg {...iconProps} {...p}><path d="M12 3v18M7 21h10M6 7l-3 5a3 3 0 0 0 6 0Zm12 0-3 5a3 3 0 0 0 6 0ZM4 7h5M15 7h5" /></svg>);
const IconWallet = (p) => (<svg {...iconProps} {...p}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" /><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" /></svg>);
const IconPiggyBank = (p) => (<svg {...iconProps} {...p}><path d="M19 9V6a1 1 0 0 0-1-1h-1l-1-2-2 1a7 7 0 0 0-6 7c0 1 0 2 1 3l-1 3h3l1-1h4l1 1h2l-1-3a5 5 0 0 0 1-4Z" /><circle cx="15" cy="10" r="0.5" fill="currentColor" /></svg>);

function formatAmount(n) {
  const value = typeof n === 'number' ? n : 0;
  return value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- sidebar nav config ----------------------------------------------------
const NAV_SECTIONS = [
  { key: 'overview', label: 'Overview', icon: IconGrid },
  { key: 'trial-balance', label: 'Trial Balance', icon: IconCloud },
  { key: 'notes', label: 'Notes', icon: IconFileText },
  { key: 'cash-bank', label: 'Cash and Bank', icon: IconLandmark },
  { key: 'receivables', label: 'Receivables', icon: IconUsers },
  { key: 'payables', label: 'Payables', icon: IconCreditCard },
  { key: 'financial-statements', label: 'Financial Statements', icon: IconFileBarChart },
  { key: 'ipsas-report', label: 'IPSAS Report', icon: IconFileCheck },
];

const DEFAULT_INVENTORY_ITEMS = [
  { key: 'foodstuffBes', label: 'Food stuff - BES' },
  { key: 'stationeriesTeaching', label: 'Stationaries - Teaching and Learning Materials' },
  { key: 'labChemicalsTeaching', label: 'Lab chemicals - Teaching and Learning Materials' },
  { key: 'fuelLubricants', label: 'Fuel and Lubricants' },
  { key: 'medicalSupplies', label: 'Medical Supplies' },
];

// ---- components -----------------------------------------------------------
function StatCard({ icon, tint, label, value }) {
  return (
    <div className="fy-stat-card">
      <div className="fy-stat-icon" style={{ backgroundColor: tint.bg, color: tint.fg }}>
        {icon}
      </div>
      <div>
        <p className="fy-stat-label">{label}</p>
        <p className="fy-stat-value">{formatAmount(value)}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const finalized = status === 'finalized';
  return (
    <span className={`fy-badge ${finalized ? 'fy-badge--final' : 'fy-badge--draft'}`}>
      {finalized ? 'Finalized' : 'Draft'}
    </span>
  );
}

function ProfileMenu({ user, onEditProfile, onLogOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="fy-profile-wrap" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="fy-profile-trigger">
        <span className="fy-avatar">{user.initials}</span>
        <span className="fy-profile-text">
          <span className="fy-profile-name">{user.name}</span>
          <span className="fy-profile-role">{user.role}</span>
        </span>
        <IconChevronDown className="fy-chevron-icon" />
      </button>

      {open && (
        <div className="fy-dropdown">
          <button onClick={onEditProfile} className="fy-dropdown-item">
            <IconUser width={16} height={16} /> Edit profile
          </button>
          <button onClick={onLogOut} className="fy-dropdown-item fy-dropdown-item--danger">
            <IconLogOut width={16} height={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function TrialBalanceTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="fy-empty">
        <p className="fy-empty-title">No trial balance uploaded yet</p>
        <p className="fy-empty-sub">
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
        <p className="fy-imbalance">
          Debits and credits don't match (difference of {formatAmount(Math.abs(totalDebit - totalCredit))}). Check the uploaded file.
        </p>
      )}
    </div>
  );
}

function SectionPlaceholder({ title, content }) {
  return (
    <div className="fy-section">
      <h3 className="fy-section-title">{title}</h3>
      <p className="fy-section-sub">This section is ready for data entry.</p>
      <div className="fy-section-content">
        <span className="fy-section-icon">📋</span>
        <p>{content || `Start adding ${title.toLowerCase()} data here.`}</p>
      </div>
    </div>
  );
}

// ---- page ------------------------------------------------------------------
function FinancialYear() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [school, setSchool] = useState(null);
  const [user, setUser] = useState(null);
  const [year, setYear] = useState(null);
  const [allYears, setAllYears] = useState([]);
  const [rows, setRows] = useState([]);
  const [inventories, setInventories] = useState(
    Object.fromEntries(DEFAULT_INVENTORY_ITEMS.map((i) => [i.key, 0]))
  );
  const [savingInfo, setSavingInfo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compareId, setCompareId] = useState('');

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
        const [meRes, yearRes, tbRes, yearsRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/financial-years/${id}`, { headers }),
          fetch(`${API_URL}/financial-years/${id}/trial-balance`, { headers }),
          fetch(`${API_URL}/financial-years`, { headers }),
        ]);

        if (!meRes.ok || !yearRes.ok) throw new Error('Failed to load financial year.');

        const me = await meRes.json();
        const yearData = await yearRes.json();
        const tbData = tbRes.ok ? await tbRes.json() : [];
        const yearsData = yearsRes.ok ? await yearsRes.json() : [];

        if (cancelled) return;

        const initials = me.principalName
          ? me.principalName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
          : '??';

        setSchool({ name: me.schoolName, county: me.county });
        setUser({ name: me.principalName, role: 'Principal', initials });
        setYear(yearData);
        setRows(Array.isArray(tbData) ? tbData : tbData.rows || []);
        setAllYears(Array.isArray(yearsData) ? yearsData : []);

        if (yearData?.additionalInfo?.inventories) {
          setInventories((prev) => ({ ...prev, ...yearData.additionalInfo.inventories }));
        }
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

  const handleEditProfile = () => {
    // TODO: navigate to profile edit screen
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  async function handleSaveAdditionalInfo() {
    setSavingInfo(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/financial-years/${id}/additional-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inventories }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Could not save additional information.');
      }
    } catch (err) {
      setError(err.message || 'Could not save additional information.');
    } finally {
      setSavingInfo(false);
    }
  }

  if (loading) {
    return (
      <div className="fy-loading">
        <p>Loading financial year…</p>
      </div>
    );
  }

  if (!year) {
    return (
      <div className="fy-loading">
        <p>{error || 'Financial year not found.'}</p>
        <Link to="/home" className="fy-back-link"><IconChevronLeft /> Back to dashboard</Link>
      </div>
    );
  }

  const totals = year.totals || { receipts: 0, payments: 0, surplus: 0, cash: 0, netAssets: 0 };
  const isFinalized = year.status === 'finalized';
  const compareOptions = allYears.filter((y) => y._id !== id);
  const totalInventory = Object.values(inventories).reduce((sum, val) => sum + Number(val), 0);

  return (
    <div className={`fy-page ${sidebarCollapsed ? 'fy-page--collapsed' : ''}`}>
      {/* header */}
      <header className="fy-header">
        <div className="fy-header-left">
          <button
            type="button"
            className="fy-toggle-btn"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <IconPanelLeft />
          </button>
          <span className="fy-school-icon">
            <IconBuilding />
          </span>
          <div className="fy-school-info">
            <div className="fy-school-name-row">
              <h1 className="fy-school-name">{school?.name}</h1>
              <IconPencil width={14} height={14} className="fy-school-edit-icon" />
            </div>
            <p className="fy-school-county">{school?.county}</p>
          </div>
        </div>

        <nav className="fy-nav-links">
          <Link to="/home" className="fy-nav-link">
            <IconHome width={16} height={16} /> Home
          </Link>
          <Link to="/financial-years" className="fy-nav-link">
            <IconCalendar width={16} height={16} /> Financial Years
          </Link>
          <span className="fy-year-pill">
            <IconLock width={14} height={14} /> {year.label} · <StatusBadge status={year.status} />
          </span>
        </nav>

        <ProfileMenu user={user} onEditProfile={handleEditProfile} onLogOut={handleLogOut} />
      </header>

      <div className="fy-body">
        {/* sidebar */}
        <aside className={`fy-sidebar ${sidebarCollapsed ? 'fy-sidebar--collapsed' : ''}`}>
          <div className="fy-sidebar-year">
            <p className="fy-sidebar-year-label">{year.label}</p>
            <p className="fy-sidebar-year-dates">
              {year.startDate?.slice(0, 10)} – {year.endDate?.slice(0, 10)}
            </p>
            <StatusBadge status={year.status} />
          </div>

          <nav className="fy-sidebar-nav">
            {NAV_SECTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`fy-nav-item ${activeSection === key ? 'fy-nav-item--active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                <Icon width={16} height={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="fy-status-toggle"
            onClick={handleToggleStatus}
            disabled={statusUpdating}
          >
            {isFinalized ? <IconUnlock width={16} height={16} /> : <IconLock width={16} height={16} />}
            {statusUpdating ? 'Updating…' : isFinalized ? 'Unlock year' : 'Finalize year'}
          </button>
        </aside>

        {/* main content */}
        <main className="fy-main">
          {error && <p className="fy-error">{error}</p>}

          {activeSection === 'overview' && (
            <>
              <div className="fy-compare">
                <span>Compare</span>
                <span className="fy-compare-current">{year.label}</span>
                <span>with</span>
                <select
                  className="fy-compare-select"
                  value={compareId}
                  onChange={(e) => setCompareId(e.target.value)}
                >
                  <option value="">No comparative year</option>
                  {compareOptions.map((y) => (
                    <option key={y._id} value={y._id}>{y.label}</option>
                  ))}
                </select>
              </div>

              <div className="fy-stats-grid">
                <StatCard icon={<IconArrowUp />} tint={{ bg: '#ecfdf5', fg: '#059669' }} label="Total Revenue" value={totals.receipts} />
                <StatCard icon={<IconArrowDown />} tint={{ bg: '#fef2f2', fg: '#dc2626' }} label="Total Expenses" value={totals.payments} />
                <StatCard icon={<IconScale />} tint={{ bg: '#eff6ff', fg: '#2563eb' }} label="Surplus / (Deficit)" value={totals.surplus} />
                <StatCard icon={<IconWallet />} tint={{ bg: '#fffbeb', fg: '#b45309' }} label="Cash & Bank" value={totals.cash} />
                <StatCard icon={<IconPiggyBank />} tint={{ bg: '#faf5ff', fg: '#7c3aed' }} label="Net Assets" value={totals.netAssets} />
              </div>

              <p className="fy-hint">Use the sidebar to open the trial balance or drill into a report.</p>

              <div className="fy-info-header">
                <h3 className="fy-info-title">Additional Information</h3>
                <button
                  type="button"
                  className="fy-btn fy-btn--primary"
                  onClick={handleSaveAdditionalInfo}
                  disabled={savingInfo}
                >
                  <IconFileText width={16} height={16} />
                  {savingInfo ? 'Saving…' : 'Save additional information'}
                </button>
              </div>
              <p className="fy-info-sub">
                School and year-end disclosures from the Additional Information sheet. These feed the Overview and the IPSAS report.
              </p>

              <div className="fy-info-panel">
                <h4 className="fy-info-section-title">1) Inventories as at prior year end</h4>
                <table className="fy-info-table">
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th className="fy-table-num">KSHS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEFAULT_INVENTORY_ITEMS.map((item) => (
                      <tr key={item.key}>
                        <td>{item.label}</td>
                        <td className="fy-table-num">
                          <input
                            type="number"
                            className="fy-info-input"
                            value={inventories[item.key] ?? 0}
                            onChange={(e) =>
                              setInventories((prev) => ({
                                ...prev,
                                [item.key]: Number(e.target.value),
                              }))
                            }
                            disabled={isFinalized}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="fy-info-total">
                      <td><strong>Total</strong></td>
                      <td className="fy-table-num"><strong>{formatAmount(totalInventory)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeSection === 'trial-balance' && (
            <div className="fy-panel">
              <div className="fy-panel-header">
                <div>
                  <h3 className="fy-panel-title">Trial Balance</h3>
                  <p className="fy-panel-sub">Upload an Excel file or download the current data.</p>
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
          )}

          {activeSection === 'notes' && <SectionPlaceholder title="Notes" content="Add narrative disclosures and notes to the financial statements." />}
          {activeSection === 'cash-bank' && <SectionPlaceholder title="Cash and Bank" content="Manage cash and bank account balances and transactions." />}
          {activeSection === 'receivables' && <SectionPlaceholder title="Receivables" content="Track amounts owed to the school from debtors and other entities." />}
          {activeSection === 'payables' && <SectionPlaceholder title="Payables" content="Manage creditors, suppliers, and other amounts owed by the school." />}
          {activeSection === 'financial-statements' && <SectionPlaceholder title="Financial Statements" content="View and prepare the complete set of financial statements." />}
          {activeSection === 'ipsas-report' && <SectionPlaceholder title="IPSAS Report" content="Generate the full IPSAS-compliant annual report and financial statements." />}
        </main>
      </div>
    </div>
  );
}

export default FinancialYear;
