import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * ---------------------------------------------------------------------------
 * Home.jsx — Principal / HOI dashboard landing page
 * ---------------------------------------------------------------------------
 * Plain-CSS version. Styling lives in Home.css and is applied via regular
 * class names instead of Tailwind utility classes.
 *
 * Data flow:
 *  - useSessionData() below fetches the logged-in school/principal's data
 *    from GET /me using the Bearer token stored in localStorage.
 *  - financialYear / financialYears are still placeholder data since the
 *    backend has no financial-year model yet — swap those out once that
 *    schema/endpoint exists.
 * ---------------------------------------------------------------------------
 */

const API_URL = "https://trialbal-1.onrender.com";

// ---- brand tokens -----------------------------------------------------
const GOLD = '#E8B923';
const INK = '#141414';

// ---- real session data hook --------------------------------------------
function useSessionData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to load session data");
        }

        const school = await res.json();

        const initials = school.principalName
          ? school.principalName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
          : '??';

        const json = {
          school: {
            name: school.schoolName,
            county: school.county,
            logoUrl: null,
          },
          user: {
            name: school.principalName,
            role: 'Principal',
            initials,
          },
          // TODO: replace with real financial year data once that
          // schema/endpoint exists on the backend.
          financialYear: {
            label: '2026/27',
            status: 'Finalized',
            startDate: '2026-07-01',
            endDate: '2027-06-30',
            totals: {
              receipts: 0,
              payments: 0,
              surplus: 0,
              cash: 0,
              netAssets: 0,
            },
          },
          financialYears: [
            {
              id: 1,
              label: '2026/27',
              status: 'Finalized',
              startDate: '2026-07-01',
              endDate: '2027-06-30',
              surplus: 0,
            },
          ],
        };

        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err);
          navigate("/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { data, loading, error };
}

// ---- tiny inline icon set (no extra dependency required) ---------------
const iconProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const IconBuilding = (p) => (<svg {...iconProps} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>);
const IconPencil = (p) => (<svg {...iconProps} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
const IconChevronDown = (p) => (<svg {...iconProps} {...p}><path d="m6 9 6 6 6-6" /></svg>);
const IconChevronRight = (p) => (<svg {...iconProps} {...p}><path d="m9 6 6 6-6 6" /></svg>);
const IconUser = (p) => (<svg {...iconProps} {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>);
const IconLogOut = (p) => (<svg {...iconProps} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>);
const IconCalendar = (p) => (<svg {...iconProps} {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
const IconGear = (p) => (<svg {...iconProps} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.6.5 1.11 1.04 1.44" /></svg>);
const IconArrowUp = (p) => (<svg {...iconProps} {...p}><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>);
const IconArrowDown = (p) => (<svg {...iconProps} {...p}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>);
const IconScale = (p) => (<svg {...iconProps} {...p}><path d="M12 3v18M7 21h10M6 7l-3 5a3 3 0 0 0 6 0Zm12 0-3 5a3 3 0 0 0 6 0ZM4 7h5M15 7h5" /></svg>);
const IconWallet = (p) => (<svg {...iconProps} {...p}><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" /><path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" /><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" /></svg>);
const IconPiggyBank = (p) => (<svg {...iconProps} {...p}><path d="M19 9V6a1 1 0 0 0-1-1h-1l-1-2-2 1a7 7 0 0 0-6 7c0 1 0 2 1 3l-1 3h3l1-1h4l1 1h2l-1-3a5 5 0 0 0 1-4Z" /><circle cx="15" cy="10" r="0.5" fill="currentColor" /></svg>);

// ---- small building blocks ----------------------------------------------
function formatAmount(n) {
  const value = typeof n === 'number' ? n : 0;
  return value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

function ActionCard({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="hk-action-card">
      <span className="hk-action-icon">
        {icon}
      </span>
      <span className="hk-action-body">
        <span className="hk-action-title">{title}</span>
        <span className="hk-action-subtitle">{subtitle}</span>
      </span>
      <IconChevronRight className="hk-action-chevron" />
    </button>
  );
}

function ReceiptsVsPaymentsPanel({ years }) {
  const hasData = years.some((y) => y.receipts > 0 || y.payments > 0);
  const max = Math.max(1, ...years.flatMap((y) => [y.receipts, y.payments]));

  return (
    <div className="hk-panel">
      <div className="hk-panel-header">
        <IconArrowUp className="hk-panel-header-icon" />
        <div>
          <h3 className="hk-panel-title">Receipts vs Payments</h3>
          <p className="hk-panel-subtitle">Across your most recent financial years</p>
        </div>
      </div>

      {!hasData ? (
        <div className="hk-empty-state">
          <p className="hk-empty-title">Nothing posted yet</p>
          <p className="hk-empty-sub">
            Once receipts and payments are recorded for a financial year, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="hk-bars">
          {years.map((y) => (
            <div key={y.label} className="hk-bars-group">
              <div
                className="hk-bar"
                style={{ height: `${(y.receipts / max) * 100}%`, backgroundColor: '#2563eb', minHeight: 2 }}
                title={`Receipts ${formatAmount(y.receipts)}`}
              />
              <div
                className="hk-bar"
                style={{ height: `${(y.payments / max) * 100}%`, backgroundColor: GOLD, minHeight: 2 }}
                title={`Payments ${formatAmount(y.payments)}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="hk-bar-labels">
        {years.map((y) => (
          <span key={y.label}>{y.label}</span>
        ))}
      </div>

      <div className="hk-legend">
        <span className="hk-legend-item"><span className="hk-legend-dot" style={{ backgroundColor: '#2563eb' }} /> Receipts</span>
        <span className="hk-legend-item"><span className="hk-legend-dot" style={{ backgroundColor: GOLD }} /> Payments</span>
      </div>
    </div>
  );
}

function SurplusMarginPanel({ receipts, surplus, yearLabel }) {
  const pct = receipts > 0 ? Math.round((surplus / receipts) * 100) : 0;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, Math.abs(pct)));
  const dash = (progress / 100) * circumference;

  return (
    <div className="hk-panel">
      <div className="hk-panel-header">
        <IconScale className="hk-panel-header-icon" />
        <h3 className="hk-panel-title">Surplus Margin</h3>
      </div>

      <div className="hk-gauge-wrap">
        <svg width="176" height="176" viewBox="0 0 176 176">
          <circle cx="88" cy="88" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke={pct < 0 ? '#dc2626' : GOLD}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 88 88)"
          />
          <text x="88" y="84" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>{pct}%</text>
          <text x="88" y="104" textAnchor="middle" fontSize="12" fill="#64748b">of receipts</text>
        </svg>
      </div>

      <p className="hk-gauge-caption">
        Surplus/(deficit) as a share of total receipts for {yearLabel}
      </p>
    </div>
  );
}

function FinancialYearCard({ year, onOpen }) {
  return (
    <div className="hk-year-card">
      <div className="hk-year-card-top">
        <span className="hk-year-icon">
          <IconCalendar />
        </span>
        <span className="hk-year-status">
          {year.status}
        </span>
      </div>
      <p className="hk-year-label">{year.label}</p>
      <p className="hk-year-dates">{year.startDate} – {year.endDate}</p>

      <div className="hk-year-surplus-row">
        <span className="hk-year-surplus-label">Surplus/(Deficit)</span>
        <span className="hk-year-surplus-value">{formatAmount(year.surplus)}</span>
      </div>

      <button onClick={() => onOpen(year)} className="hk-year-open-btn">
        Open <IconChevronRight width={14} height={14} />
      </button>
    </div>
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

  return (
    <div className="hk-profile-menu" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="hk-profile-trigger">
        <span className="hk-avatar">
          {user.initials}
        </span>
        <span className="hk-profile-text">
          <span className="hk-profile-name">{user.name}</span>
          <span className="hk-profile-role">{user.role}</span>
        </span>
        <IconChevronDown className="hk-chevron" />
      </button>

      {open && (
        <div className="hk-profile-dropdown">
          <button onClick={onEditProfile} className="hk-dropdown-item">
            <IconUser width={16} height={16} /> Edit profile
          </button>
          <button onClick={onLogOut} className="hk-dropdown-item hk-dropdown-item--danger">
            <IconLogOut width={16} height={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

// ---- page ---------------------------------------------------------------
function Home() {
  const { data, loading } = useSessionData();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    // TODO: navigate to profile edit screen
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleOpenAction = (key) => {
    // TODO: navigate to the relevant screen, e.g. navigate(`/${key}`)
  };

  const handleOpenYear = (year) => {
    // TODO: navigate to that financial year's detail view
  };

  if (loading || !data) {
    return (
      <div className="hk-loading">
        <p>Loading dashboard…</p>
      </div>
    );
  }

  const { school, user, financialYear } = data;
  const totals = financialYear.totals;
  // Build a simple series for the "Receipts vs Payments" chart. Once the
  // backend returns multiple financial years' totals, map over those here
  // instead of wrapping the single active year.
  const series = [{ label: financialYear.label, receipts: totals.receipts, payments: totals.payments }];

  return (
    <div className="hk-page">
      {/* header */}
      <header className="hk-header">
        <div className="hk-header-left">
          <span className="hk-icon-badge">
            <IconBuilding />
          </span>
          <div>
            <div className="hk-school-name-row">
              <h1 className="hk-school-name">{school.name}</h1>
              <IconPencil width={14} height={14} className="hk-pencil-icon" />
            </div>
            <p className="hk-county">{school.county}</p>
          </div>
        </div>

        <ProfileMenu user={user} onEditProfile={handleEditProfile} onLogOut={handleLogOut} />
      </header>

      <main className="hk-main">
        {/* welcome */}
        <div>
          <h2 className="hk-welcome-title">Welcome back, {user.name?.split(' ')[0]}</h2>
          <p className="hk-welcome-sub">{school.name} — here's where things stand.</p>
        </div>

        {/* quick actions */}
        <div className="hk-grid-actions">
          <ActionCard
            icon={<IconCalendar />}
            title="Manage Financial Years"
            subtitle="Create a new year, review trial balances, finalize or unlock."
            onClick={() => handleOpenAction('financial-years')}
          />
          <ActionCard
            icon={<IconGear />}
            title="School Settings"
            subtitle="School profile, users, school accounts & board of management."
            onClick={() => handleOpenAction('settings')}
          />
        </div>

        {/* stats */}
        <div className="hk-grid-stats">
          <StatCard icon={<IconArrowUp />} tint={{ bg: '#ecfdf5', fg: '#059669' }} label="Total Receipts" value={totals.receipts} />
          <StatCard icon={<IconArrowDown />} tint={{ bg: '#fef2f2', fg: '#dc2626' }} label="Total Payments" value={totals.payments} />
          <StatCard icon={<IconScale />} tint={{ bg: '#eff6ff', fg: '#2563eb' }} label="Surplus / (Deficit)" value={totals.surplus} />
          <StatCard icon={<IconWallet />} tint={{ bg: '#fffbeb', fg: '#b45309' }} label="Cash & Bank" value={totals.cash} />
          <StatCard icon={<IconPiggyBank />} tint={{ bg: '#faf5ff', fg: '#7c3aed' }} label="Net Assets" value={totals.netAssets} />
        </div>

        {/* charts */}
        <div className="hk-grid-charts">
          <ReceiptsVsPaymentsPanel years={series} />
          <SurplusMarginPanel receipts={totals.receipts} surplus={totals.surplus} yearLabel={financialYear.label} />
        </div>

        {/* financial years */}
        <div>
          <h3 className="hk-section-title">
            <IconCalendar className="hk-section-title-icon" /> Financial Years
          </h3>
          <div className="hk-grid-years">
            {data.financialYears.map((year) => (
              <FinancialYearCard key={year.id} year={year} onOpen={handleOpenYear} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
