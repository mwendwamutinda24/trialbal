import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * ---------------------------------------------------------------------------
 * new-financial-year.jsx — "Create a financial year" page
 * ---------------------------------------------------------------------------
 * Route: <Route path="/financial-years/new" element={<NewFinancialYear />} />
 *
 * Data flow:
 *  - On load: GET /me (school header) + GET /financial-years (existing
 *    years, used to suggest the next label and warn on duplicates).
 *  - On submit: POST /financial-years { label, startDate, endDate }.
 *    Backend attaches the default IPSAS accounts (Operations, Tuition,
 *    School Fund, Infrastructure) automatically — nothing to send for that.
 *  - On success: navigate straight to /financial-years/:id.
 * ---------------------------------------------------------------------------
 */

const API_URL = "https://trialbal-1.onrender.com";

const iconProps = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconChevronLeft = (p) => (<svg {...iconProps} {...p}><path d="m15 18-6-6 6-6" /></svg>);
const IconCalendarPlus = (p) => (<svg {...iconProps} {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M12 14v6M9 17h6" /></svg>);
const IconBuilding = (p) => (<svg {...iconProps} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>);

// Suggests the year after the most recent existing label, e.g. "2026/27" -> "2027/28".
// Falls back to the current calendar year if there are no existing years yet.
function suggestNextLabel(existingLabels) {
  const years = existingLabels
    .map((l) => parseInt((l || '').split('/')[0], 10))
    .filter((n) => !Number.isNaN(n));
  const base = years.length ? Math.max(...years) + 1 : new Date().getFullYear();
  const shortNext = String(base + 1).slice(-2);
  return `${base}/${shortNext}`;
}

function NewFinancialYear() {
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [existingYears, setExistingYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [label, setLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        const [meRes, yearsRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/financial-years`, { headers }),
        ]);
        if (!meRes.ok || !yearsRes.ok) throw new Error('Failed to load school data.');

        const me = await meRes.json();
        const years = await yearsRes.json();
        if (cancelled) return;

        setSchool({ name: me.schoolName, county: me.county });
        setExistingYears(years);

        const suggested = suggestNextLabel(years.map((y) => y.label));
        setLabel(suggested);

        // Default reporting period: 1 July -> 30 June the following year,
        // matching the school-year pattern already used in your sample data.
        const startYear = parseInt(suggested.split('/')[0], 10);
        setStartDate(`${startYear}-07-01`);
        setEndDate(`${startYear + 1}-06-30`);
      } catch (err) {
        if (!cancelled) setError('Could not load school data. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!label.trim() || !startDate || !endDate) {
      setError('Please fill in the label, start date, and end date.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after the start date.');
      return;
    }
    if (existingYears.some((y) => (y.label || '').trim().toLowerCase() === label.trim().toLowerCase())) {
      setError(`A financial year labeled "${label}" already exists.`);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/financial-years`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label: label.trim(), startDate, endDate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not create financial year.');

      navigate(`/financial-years/${json._id}`);
    } catch (err) {
      setError(err.message || 'Could not create financial year. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="hk-loading">
        <p>Loading…</p>
      </div>
    );
  }

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

      <main className="hk-main nfy-main">
        <Link to="/home" className="fy-breadcrumb">
          <IconChevronLeft />
          Back to dashboard
        </Link>

        <div className="hk-panel nfy-panel">
          <div className="hk-panel-header">
            <IconCalendarPlus className="hk-panel-header-icon" />
            <div>
              <h3 className="hk-panel-title">New Financial Year</h3>
              <p className="hk-panel-subtitle">
                Set the label and reporting period. Standard IPSAS accounts (Operations, Tuition,
                School Fund, Infrastructure) are added automatically — voteheads can be customised
                afterwards.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="nfy-form">
            <label className="nfy-field">
              <span className="nfy-field-label">Label</span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. 2026/27"
                className="nfy-input"
              />
            </label>

            <div className="nfy-row">
              <label className="nfy-field">
                <span className="nfy-field-label">Start date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="nfy-input"
                />
              </label>
              <label className="nfy-field">
                <span className="nfy-field-label">End date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="nfy-input"
                />
              </label>
            </div>

            {error && <p className="nfy-error">{error}</p>}

            <div className="nfy-btn-row">
              <button
                type="button"
                className="fy-btn"
                onClick={() => navigate('/home')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="fy-btn fy-btn--primary" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create financial year'}
              </button>
            </div>
          </form>
        </div>

        {existingYears.length > 0 && (
          <p className="hk-empty-sub nfy-existing-note">
            You already have {existingYears.length} financial year{existingYears.length > 1 ? 's' : ''}:{' '}
            {existingYears.map((y) => y.label).join(', ')}.
          </p>
        )}
      </main>
    </div>
  );
}

export default NewFinancialYear;
