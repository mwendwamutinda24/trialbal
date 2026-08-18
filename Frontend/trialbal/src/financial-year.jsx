import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './FinancialYear.css';

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
const IconPrinter = (p) => (<svg {...iconProps} {...p}><path d="M6 9V3h12v6" /><path d="M18 9h3v8h-3" /><path d="M6 9H3v8h3" /><path d="M6 15h12v6H6z" /><path d="M9 18h6" /></svg>);
const IconFilePdf = (p) => (<svg {...iconProps} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-4" /><path d="M12 12h.01" /></svg>);

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

function TrialBalanceTable({ rows, onCellChange }) {
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
            <th>Fund</th>
            <th>Votehead</th>
            <th>Note</th>
            <th className="fy-table-num">Estimates</th>
            <th className="fy-table-num">DR</th>
            <th className="fy-table-num">CR</th>
            <th className="fy-table-num">Adj DR</th>
            <th className="fy-table-num">Adj CR</th>
            <th className="fy-table-num">Open Jnl</th>
            <th className="fy-table-num">Close Jnl</th>
            <th className="fy-table-num">Final DR</th>
            <th className="fy-table-num">Final CR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r._id || idx}>
              <td>{r.accountKey || r.fund || ''}</td>
              <td>{r.voteheadName || r.accountName || ''}</td>
              <td>{r.note || ''}</td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.estimates || 0} onChange={(e) => onCellChange?.(idx, 'estimates', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.debit || 0} onChange={(e) => onCellChange?.(idx, 'debit', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.credit || 0} onChange={(e) => onCellChange?.(idx, 'credit', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.adjDr || 0} onChange={(e) => onCellChange?.(idx, 'adjDr', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.adjCr || 0} onChange={(e) => onCellChange?.(idx, 'adjCr', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.openJnl || 0} onChange={(e) => onCellChange?.(idx, 'openJnl', e.target.value)} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-cell-input" value={r.closeJnl || 0} onChange={(e) => onCellChange?.(idx, 'closeJnl', e.target.value)} />
              </td>
              <td className="fy-table-num">{formatAmount(Number(r.debit || 0) + Number(r.adjDr || 0) + Number(r.openJnl || 0) - Number(r.closeJnl || 0))}</td>
              <td className="fy-table-num">{formatAmount(Number(r.credit || 0) + Number(r.adjCr || 0))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Totals</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.estimates || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(totalDebit)}</td>
            <td className="fy-table-num">{formatAmount(totalCredit)}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.adjDr || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.adjCr || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.openJnl || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.closeJnl || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.debit || 0) + Number(r.adjDr || 0) + Number(r.openJnl || 0) - Number(r.closeJnl || 0), 0))}</td>
            <td className="fy-table-num">{formatAmount(rows.reduce((s, r) => s + Number(r.credit || 0) + Number(r.adjCr || 0), 0))}</td>
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

// ---- Receivables Section ----------------------------------------------------
function ReceivablesSection({ year, isFinalized }) {
  const [receivables, setReceivables] = useState([
    { type: 'Fees Arrears', currentFY: 0, comparativeFY: 0 },
    { type: 'Salary Advances', currentFY: 0, comparativeFY: 0 },
    { type: 'Imprest', currentFY: 0, comparativeFY: 0 },
    { type: 'Rent arrears', currentFY: 0, comparativeFY: 0 },
    { type: 'Other Debtor', currentFY: 0, comparativeFY: 0 },
  ]);

  const [additionalReceivables, setAdditionalReceivables] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReceivable, setNewReceivable] = useState({ type: '', description: '', amount: 0, age: '' });

  const totalReceivables = receivables.reduce((sum, r) => sum + (Number(r.currentFY) || 0), 0) + 
                           additionalReceivables.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddReceivable = () => {
    if (newReceivable.type && newReceivable.description) {
      setAdditionalReceivables([...additionalReceivables, { ...newReceivable, id: Date.now() }]);
      setNewReceivable({ type: '', description: '', amount: 0, age: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="fy-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">21 Accounts Receivable</h3>
        <button className="fy-btn fy-btn--primary" onClick={() => setShowAddForm(!showAddForm)}>
          + Add receivable
        </button>
      </div>

      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">Note 21: Accounts Receivable</h4>
        
        <table className="fy-statement-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th className="fy-table-num">CURRENT FY (KSHS)</th>
              <th className="fy-table-num">COMPARATIVE FY (KSHS)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="fy-account-section-header">
              <td colSpan={3}><strong>Fees Arrears</strong></td>
            </tr>
            {receivables.filter(r => r.type === 'Fees Arrears').map((r, idx) => (
              <tr key={idx}>
                <td>Fees Arrears</td>
                <td className="fy-table-num">
                  <input type="number" className="fy-info-input" value={r.currentFY} 
                    onChange={(e) => {
                      const updated = [...receivables];
                      updated[idx].currentFY = Number(e.target.value);
                      setReceivables(updated);
                    }}
                    disabled={isFinalized} />
                </td>
                <td className="fy-table-num">
                  <input type="number" className="fy-info-input" value={r.comparativeFY} 
                    onChange={(e) => {
                      const updated = [...receivables];
                      updated[idx].comparativeFY = Number(e.target.value);
                      setReceivables(updated);
                    }}
                    disabled={isFinalized} />
                </td>
              </tr>
            ))}
            
            <tr className="fy-account-section-header">
              <td colSpan={3}><strong>Other Non-Fees Receivables</strong></td>
            </tr>
            {receivables.filter(r => r.type !== 'Fees Arrears').map((r, idx) => {
              const adjustedIdx = receivables.indexOf(r);
              return (
                <tr key={idx}>
                  <td>{r.type} {r.type === 'Other Debtor' && '(specify)'}</td>
                  <td className="fy-table-num">
                    <input type="number" className="fy-info-input" value={r.currentFY} 
                      onChange={(e) => {
                        const updated = [...receivables];
                        updated[adjustedIdx].currentFY = Number(e.target.value);
                        setReceivables(updated);
                      }}
                      disabled={isFinalized} />
                  </td>
                  <td className="fy-table-num">
                    <input type="number" className="fy-info-input" value={r.comparativeFY} 
                      onChange={(e) => {
                        const updated = [...receivables];
                        updated[adjustedIdx].comparativeFY = Number(e.target.value);
                        setReceivables(updated);
                      }}
                      disabled={isFinalized} />
                  </td>
                </tr>
              );
            })}
            
            {additionalReceivables.map((r) => (
              <tr key={r.id}>
                <td>{r.description}</td>
                <td className="fy-table-num">{formatAmount(r.amount)}</td>
                <td className="fy-table-num">0.00</td>
              </tr>
            ))}
            
            <tr className="fy-statement-total">
              <td><strong>Total</strong></td>
              <td className="fy-table-num"><strong>{formatAmount(totalReceivables)}</strong></td>
              <td className="fy-table-num"><strong>0.00</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="fy-add-form">
          <h5>Add Receivable</h5>
          <div className="fy-form-grid">
            <div className="fy-form-field">
              <label>Type</label>
              <select className="fy-select" value={newReceivable.type} onChange={(e) => setNewReceivable({...newReceivable, type: e.target.value})}>
                <option value="">Select type</option>
                <option value="Fees Arrears">Fees Arrears</option>
                <option value="Salary Advances">Salary Advances</option>
                <option value="Imprest">Imprest</option>
                <option value="Rent arrears">Rent arrears</option>
                <option value="Other Debtor">Other Debtor</option>
              </select>
            </div>
            <div className="fy-form-field">
              <label>Description</label>
              <input type="text" className="fy-text-input" value={newReceivable.description} 
                onChange={(e) => setNewReceivable({...newReceivable, description: e.target.value})} />
            </div>
            <div className="fy-form-field">
              <label>Amount</label>
              <input type="number" className="fy-text-input" value={newReceivable.amount} 
                onChange={(e) => setNewReceivable({...newReceivable, amount: Number(e.target.value)})} />
            </div>
            <div className="fy-form-field">
              <label>Age</label>
              <select className="fy-select" value={newReceivable.age} onChange={(e) => setNewReceivable({...newReceivable, age: e.target.value})}>
                <option value="">Select age</option>
                <option value="0-30 days">0-30 days</option>
                <option value="31-60 days">31-60 days</option>
                <option value="61-90 days">61-90 days</option>
                <option value="90+ days">90+ days</option>
              </select>
            </div>
          </div>
          <div className="fy-form-actions">
            <button className="fy-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="fy-btn fy-btn--primary" onClick={handleAddReceivable}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Payables Section ----------------------------------------------------
function PayablesSection({ year, isFinalized }) {
  const [payables, setPayables] = useState({
    feesReceivedInAdvance: { currentFY: 0, comparativeFY: 0 },
    accountsPayable: { boarding: 0, tuition: 0 },
    borrowings: { shortTerm: 0, longTerm: 0 },
    provisions: { currentFY: 0, comparativeFY: 0 },
  });

  const [feesAdvanceItems, setFeesAdvanceItems] = useState([]);
  const [showAddFeesAdvance, setShowAddFeesAdvance] = useState(false);
  const [newFeesAdvance, setNewFeesAdvance] = useState({ description: '', amount: 0 });

  const handleAddFeesAdvance = () => {
    if (newFeesAdvance.description) {
      setFeesAdvanceItems([...feesAdvanceItems, { ...newFeesAdvance, id: Date.now() }]);
      setNewFeesAdvance({ description: '', amount: 0 });
      setShowAddFeesAdvance(false);
    }
  };

  const totalFeesAdvance = feesAdvanceItems.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className="fy-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">Payables</h3>
      </div>

      {/* 28 Fees Received in Advance */}
      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">Note 28: Fees Received in Advance</h4>
        <table className="fy-statement-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="fy-table-num">CURRENT FY (KSHS)</th>
              <th className="fy-table-num">COMPARATIVE FY (KSHS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amount received during the year</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={payables.feesReceivedInAdvance.currentFY} 
                  onChange={(e) => setPayables({...payables, feesReceivedInAdvance: {...payables.feesReceivedInAdvance, currentFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={payables.feesReceivedInAdvance.comparativeFY} 
                  onChange={(e) => setPayables({...payables, feesReceivedInAdvance: {...payables.feesReceivedInAdvance, comparativeFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
            </tr>
            <tr className="fy-statement-total">
              <td><strong>Total</strong></td>
              <td className="fy-table-num"><strong>{formatAmount(payables.feesReceivedInAdvance.currentFY + totalFeesAdvance)}</strong></td>
              <td className="fy-table-num"><strong>{formatAmount(payables.feesReceivedInAdvance.comparativeFY)}</strong></td>
            </tr>
          </tbody>
        </table>
        <button className="fy-btn fy-btn--primary" onClick={() => setShowAddFeesAdvance(!showAddFeesAdvance)}>
          + Add fees received in advance
        </button>

        {showAddFeesAdvance && (
          <div className="fy-add-form fy-add-form-inline">
            <div className="fy-form-field">
              <label>Description</label>
              <input type="text" className="fy-text-input" placeholder="Description" 
                value={newFeesAdvance.description} onChange={(e) => setNewFeesAdvance({...newFeesAdvance, description: e.target.value})} />
            </div>
            <div className="fy-form-field">
              <label>Amount</label>
              <input type="number" className="fy-text-input" placeholder="Amount" 
                value={newFeesAdvance.amount} onChange={(e) => setNewFeesAdvance({...newFeesAdvance, amount: Number(e.target.value)})} />
            </div>
            <div className="fy-form-actions">
              <button className="fy-btn" onClick={() => setShowAddFeesAdvance(false)}>Cancel</button>
              <button className="fy-btn fy-btn--primary" onClick={handleAddFeesAdvance}>Add</button>
            </div>
          </div>
        )}

        {/* Fees Advance Items List */}
        {feesAdvanceItems.length > 0 && (
          <table className="fy-info-table">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th className="fy-table-num">AMOUNT</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feesAdvanceItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td className="fy-table-num">{formatAmount(item.amount)}</td>
                  <td>
                    <button className="fy-btn fy-btn--danger" onClick={() => setFeesAdvanceItems(feesAdvanceItems.filter(i => i.id !== item.id))}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 29 Accounts Payable */}
      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">29 Accounts Payable</h4>
        <h5 className="fy-account-sub-subtitle">29A Ageing Analysis</h5>
        <table className="fy-statement-table">
          <thead>
            <tr>
              <th>VOTEHEAD</th>
              <th className="fy-table-num">BOARDING ACCOUNT</th>
              <th className="fy-table-num">TUITION ACCOUNT</th>
            </tr>
          </thead>
          <tbody>
            {['Repairs, Maintenance & Improv', 'Boarding, Equipment & Stores/Lunch', 'Administration Cost', 'Electricity, Water & Conservancy', 'Laboratory Equipments'].map((vh) => (
              <tr key={vh}>
                <td>{vh}</td>
                <td className="fy-table-num">
                  <input type="number" className="fy-info-input" value={0} disabled={isFinalized} />
                </td>
                <td className="fy-table-num">
                  <input type="number" className="fy-info-input" value={0} disabled={isFinalized} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 30 Borrowings */}
      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">30 Borrowings</h4>
        <h5 className="fy-account-sub-subtitle">30A Short Term Borrowings</h5>
        <div className="fy-info-field">
          <label>Short Term Borrowings</label>
          <input type="number" className="fy-info-input" value={payables.borrowings.shortTerm} 
            onChange={(e) => setPayables({...payables, borrowings: {...payables.borrowings, shortTerm: Number(e.target.value)}})}
            disabled={isFinalized} />
        </div>
        <h5 className="fy-account-sub-subtitle">30B Long Term Borrowings</h5>
        <div className="fy-info-field">
          <label>Long Term Borrowings</label>
          <input type="number" className="fy-info-input" value={payables.borrowings.longTerm} 
            onChange={(e) => setPayables({...payables, borrowings: {...payables.borrowings, longTerm: Number(e.target.value)}})}
            disabled={isFinalized} />
        </div>
      </div>

      {/* 31 Provisions */}
      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">31 Provisions</h4>
        <div className="fy-info-field">
          <label>Provisions</label>
          <input type="number" className="fy-info-input" value={payables.provisions.currentFY} 
            onChange={(e) => setPayables({...payables, provisions: {...payables.provisions, currentFY: Number(e.target.value)}})}
            disabled={isFinalized} />
        </div>
      </div>
    </div>
  );
}

// ---- Cash and Bank Section ------------------------------------------------
function CashBankSection({ year, isFinalized }) {
  const [cashBank, setCashBank] = useState({
    bank: { note: '20a', currentFY: 0, comparativeFY: 0 },
    cash: { note: '20b', currentFY: 0, comparativeFY: 0 },
    shortTermInvestment: { note: '20c', currentFY: 0, comparativeFY: 0 },
  });

  const totalCash = cashBank.bank.currentFY + cashBank.cash.currentFY + cashBank.shortTermInvestment.currentFY;

  return (
    <div className="fy-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">20 Cash and cash equivalent</h3>
      </div>

      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">Note 20: Cash and cash equivalent</h4>
        <table className="fy-statement-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th className="fy-table-num">NOTE</th>
              <th className="fy-table-num">CURRENT FY (KSHS)</th>
              <th className="fy-table-num">COMPARATIVE FY (KSHS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bank</td>
              <td className="fy-table-num">20a</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.bank.currentFY} 
                  onChange={(e) => setCashBank({...cashBank, bank: {...cashBank.bank, currentFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.bank.comparativeFY} 
                  onChange={(e) => setCashBank({...cashBank, bank: {...cashBank.bank, comparativeFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
            </tr>
            <tr>
              <td>Cash</td>
              <td className="fy-table-num">20b</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.cash.currentFY} 
                  onChange={(e) => setCashBank({...cashBank, cash: {...cashBank.cash, currentFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.cash.comparativeFY} 
                  onChange={(e) => setCashBank({...cashBank, cash: {...cashBank.cash, comparativeFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
            </tr>
            <tr>
              <td>Short term investment</td>
              <td className="fy-table-num">20c</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.shortTermInvestment.currentFY} 
                  onChange={(e) => setCashBank({...cashBank, shortTermInvestment: {...cashBank.shortTermInvestment, currentFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={cashBank.shortTermInvestment.comparativeFY} 
                  onChange={(e) => setCashBank({...cashBank, shortTermInvestment: {...cashBank.shortTermInvestment, comparativeFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
            </tr>
            <tr className="fy-statement-total">
              <td><strong>Total</strong></td>
              <td className="fy-table-num"></td>
              <td className="fy-table-num"><strong>{formatAmount(totalCash)}</strong></td>
              <td className="fy-table-num"><strong>{formatAmount(cashBank.bank.comparativeFY + cashBank.cash.comparativeFY + cashBank.shortTermInvestment.comparativeFY)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Notes Section --------------------------------------------------------
function NotesSection({ year, isFinalized }) {
  const [notes, setNotes] = useState({
    note1: { currentFY: 0, comparativeFY: 0, other: 0 },
    note2: { currentFY: 0, comparativeFY: 0, other: 0 },
    note3: { currentFY: 0, comparativeFY: 0, other: 0 },
    note4: { currentFY: 0, comparativeFY: 0, other: 0 },
    note5: { currentFY: 0, comparativeFY: 0, other: 0 },
    note6: { currentFY: 0, comparativeFY: 0, other: 0 },
    note7: { currentFY: 0, comparativeFY: 0, other: 0 },
  });

  const [selectedNote, setSelectedNote] = useState('1');
  const notesList = [
    { key: '1', label: 'Note 1: Capitation Grants for Tuition' },
    { key: '2', label: 'Note 2: Capitation Grants for Operations' },
    { key: '3', label: 'Note 3: Revenue for Infrastructure' },
    { key: '4', label: 'Note 4: Capitation grants for Special Needs' },
    { key: '5', label: 'Note 5: Grants from Donors and Development Partners' },
    { key: '6', label: 'Note 6: Transfers from Other Government Entities' },
    { key: '7', label: 'Note 7: Contributions and Donations' },
    { key: '8', label: 'Note 8: Parents contributions / School fund' },
    { key: '9', label: 'Note 9: Miscellaneous Revenue' },
    { key: '10', label: 'Note 10: Finance Income' },
  ];

  const noteData = notes[`note${selectedNote}`];

  return (
    <div className="fy-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">Income Notes 1-10</h3>
      </div>

      <div className="fy-notes-nav">
        {notesList.map((n) => (
          <button
            key={n.key}
            className={`fy-notes-nav-item ${selectedNote === n.key ? 'fy-notes-nav-item--active' : ''}`}
            onClick={() => setSelectedNote(n.key)}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="fy-account-section">
        <h4 className="fy-account-subtitle">{notesList.find(n => n.key === selectedNote)?.label}</h4>
        <table className="fy-statement-table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th className="fy-table-num">CURRENT FY (KSHS)</th>
              <th className="fy-table-num">COMPARATIVE FY (KSHS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Teaching/learning materials</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={noteData?.currentFY || 0} 
                  onChange={(e) => setNotes({...notes, [`note${selectedNote}`]: {...noteData, currentFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={noteData?.comparativeFY || 0} 
                  onChange={(e) => setNotes({...notes, [`note${selectedNote}`]: {...noteData, comparativeFY: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
            </tr>
            <tr>
              <td>Other (specify)</td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={noteData?.other || 0} 
                  onChange={(e) => setNotes({...notes, [`note${selectedNote}`]: {...noteData, other: Number(e.target.value)}})}
                  disabled={isFinalized} />
              </td>
              <td className="fy-table-num">
                <input type="number" className="fy-info-input" value={0} disabled={isFinalized} />
              </td>
            </tr>
            <tr className="fy-statement-total">
              <td><strong>Total</strong></td>
              <td className="fy-table-num"><strong>{formatAmount((noteData?.currentFY || 0) + (noteData?.other || 0))}</strong></td>
              <td className="fy-table-num"><strong>{formatAmount(noteData?.comparativeFY || 0)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Overview Section ----------------------------------------------------
function OverviewSection({ year, totals, inventories, setInventories, isFinalized, handleSaveAdditionalInfo, savingInfo, compareId, setCompareId, compareOptions }) {
  const totalInventory = Object.values(inventories).reduce((sum, val) => sum + Number(val), 0);

  return (
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

        <div className="fy-info-extra">
          <div className="fy-info-field">
            <label>Provisions (leave)</label>
            <input type="number" className="fy-info-input" value={inventories.provisions || 0} onChange={(e) => setInventories(prev => ({ ...prev, provisions: Number(e.target.value) }))} disabled={isFinalized} />
          </div>
          <div className="fy-info-field">
            <label>Accrued interest on loan</label>
            <input type="number" className="fy-info-input" value={inventories.accruedInterest || 0} onChange={(e) => setInventories(prev => ({ ...prev, accruedInterest: Number(e.target.value) }))} disabled={isFinalized} />
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Financial Statements Section ---------------------------------------
function FinancialStatementsSection({ year, totals, compareId, compareOptions }) {
  const [activeTab, setActiveTab] = useState('performance');

  const tabs = [
    { key: 'performance', label: 'Financial Performance' },
    { key: 'position', label: 'Financial Position' },
    { key: 'changes', label: 'Changes in Net Assets' },
    { key: 'cashflow', label: 'Cashflow Statement' },
    { key: 'budget', label: 'Budgeted vs Actual' },
  ];

  return (
    <div className="fy-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">Financial Statements</h3>
        <div className="fy-section-actions">
          <button className="fy-btn"><IconPrinter width={16} height={16} /> Print</button>
          <button className="fy-btn"><IconFilePdf width={16} height={16} /> Export PDF</button>
        </div>
      </div>

      <div className="fy-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`fy-tab ${activeTab === tab.key ? 'fy-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'performance' && (
        <div className="fy-statement">
          <h4 className="fy-statement-title">Statement of Financial Performance for the Year Ended {year.endDate ? new Date(year.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</h4>
          <table className="fy-statement-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="fy-table-num">Note</th>
                <th className="fy-table-num">CURRENT FY (KSHS)</th>
                <th className="fy-table-num">COMPARATIVE FY (KSHS)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="fy-statement-section">
                <td colSpan={4}><strong>Revenue from non-exchange transactions</strong></td>
              </tr>
              {[
                { label: 'Capitation Grants for Tuition', note: 1 },
                { label: 'Capitation Grants for Operations', note: 2 },
                { label: 'Revenue for Infrastructure', note: 3 },
                { label: 'Capitation grants for Special Needs', note: 4 },
                { label: 'Grants from Donors and Development Partners', note: 5 },
                { label: 'Transfers from Other Government Entities', note: 6 },
                { label: 'Contributions and Donations', note: 7 },
              ].map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td className="fy-table-num">{item.note}</td>
                  <td className="fy-table-num">0.00</td>
                  <td className="fy-table-num">0.00</td>
                </tr>
              ))}
              <tr className="fy-statement-subtotal">
                <td colSpan={2}><strong>Total — non-exchange</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>

              <tr className="fy-statement-section">
                <td colSpan={4}><strong>Revenue from Exchange transactions</strong></td>
              </tr>
              {[
                { label: 'Parents contributions / School fund', note: 8 },
                { label: 'Miscellaneous Revenue', note: 9 },
                { label: 'Finance Income', note: 10 },
              ].map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td className="fy-table-num">{item.note}</td>
                  <td className="fy-table-num">0.00</td>
                  <td className="fy-table-num">0.00</td>
                </tr>
              ))}
              <tr className="fy-statement-subtotal">
                <td colSpan={2}><strong>Total — exchange</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>

              <tr className="fy-statement-total">
                <td colSpan={2}><strong>Total Revenue</strong></td>
                <td className="fy-table-num"><strong>{formatAmount(totals.receipts)}</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>

              <tr className="fy-statement-section">
                <td colSpan={4}><strong>Expenses</strong></td>
              </tr>
              {[
                { label: 'Expenditure for Tuition', note: 11 },
                { label: 'Expenditure for Operations', note: 12 },
                { label: 'Expenditure for Special Needs', note: 13 },
                { label: 'Expenditure for Boarding and School Fund', note: 14 },
                { label: 'Depreciation and Amortization expense', note: 15 },
                { label: 'Finance Costs', note: 16 },
              ].map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td className="fy-table-num">{item.note}</td>
                  <td className="fy-table-num">0.00</td>
                  <td className="fy-table-num">0.00</td>
                </tr>
              ))}
              <tr className="fy-statement-total">
                <td colSpan={2}><strong>Total Expenses</strong></td>
                <td className="fy-table-num"><strong>{formatAmount(totals.payments)}</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>

              <tr className="fy-statement-section">
                <td colSpan={4}><strong>Other Gains (Losses)</strong></td>
              </tr>
              {[
                { label: 'Gain/Loss on Disposal of Assets', note: 17 },
                { label: 'Gain/(loss) on Fair Value Investments', note: 18 },
                { label: 'Impairment Loss', note: 19 },
              ].map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td className="fy-table-num">{item.note}</td>
                  <td className="fy-table-num">0.00</td>
                  <td className="fy-table-num">0.00</td>
                </tr>
              ))}
              <tr className="fy-statement-subtotal">
                <td colSpan={2}><strong>Total Other Gains/(Losses)</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>

              <tr className="fy-statement-total fy-statement-final">
                <td colSpan={2}><strong>Net surplus/Deficit for the Year</strong></td>
                <td className="fy-table-num"><strong>{formatAmount(totals.surplus)}</strong></td>
                <td className="fy-table-num"><strong>0.00</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'position' && (
        <div className="fy-statement">
          <h4 className="fy-statement-title">Statement of Financial Position</h4>
          <div className="fy-statement-summary">
            <div className="fy-summary-item">
              <span className="fy-summary-label">Total Assets</span>
              <span className="fy-summary-value">0.00</span>
            </div>
            <div className="fy-summary-item">
              <span className="fy-summary-label">Total Liabilities</span>
              <span className="fy-summary-value">0.00</span>
            </div>
            <div className="fy-summary-item">
              <span className="fy-summary-label">Net Assets</span>
              <span className="fy-summary-value">{formatAmount(totals.netAssets)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="fy-statement">
          <h4 className="fy-statement-title">Changes in Net Assets</h4>
          <div className="fy-empty">
            <p className="fy-empty-title">Statement of Changes in Net Assets</p>
            <p className="fy-empty-sub">Coming soon based on the financial data.</p>
          </div>
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="fy-statement">
          <h4 className="fy-statement-title">Cashflow Statement</h4>
          <div className="fy-empty">
            <p className="fy-empty-title">Cashflow Statement</p>
            <p className="fy-empty-sub">Coming soon based on the financial data.</p>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="fy-statement">
          <h4 className="fy-statement-title">Budgeted vs Actual</h4>
          <div className="fy-empty">
            <p className="fy-empty-title">Budget vs Actual Comparison</p>
            <p className="fy-empty-sub">Coming soon based on the financial data.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- IPSAS Report Section -----------------------------------------------
function IpsasReportSection({ year, school }) {
  const [docSection, setDocSection] = useState('cover');
  const [saveStatus, setSaveStatus] = useState('');

  const documentSections = [
    { key: 'cover', label: 'Cover' },
    { key: 'who-we-are', label: '3. Who we are' },
    { key: 'chairman', label: "4. Chairman's Statement" },
    { key: 'principal', label: "5. Principal's Statement" },
    { key: 'objectives', label: '6. Predetermined Objectives' },
    { key: 'management', label: '7. Management Discussion' },
    { key: 'bom', label: '8. BoM Responsibilities' },
    { key: 'auditor', label: '10. Auditor-General' },
    { key: 'financial-statements', label: '11-16. Financial Statements' },
    { key: 'notes', label: '17. Notes' },
    { key: 'annexes', label: '18. Annexes' },
  ];

  const handleSave = () => {
    setSaveStatus('Saving...');
    setTimeout(() => setSaveStatus('Saved ✓'), 1500);
  };

  return (
    <div className="fy-section fy-ipsas-section">
      <div className="fy-section-header">
        <h3 className="fy-section-title">IPSAS Annual Report</h3>
        <div className="fy-section-actions">
          <button className="fy-btn fy-btn--primary" onClick={handleSave}>
            <IconFileText width={16} height={16} /> Save
          </button>
          <button className="fy-btn"><IconPrinter width={16} height={16} /> Export PDF</button>
          <button className="fy-btn"><IconDownload width={16} height={16} /> Export Word</button>
        </div>
        {saveStatus && <span className="fy-save-status">{saveStatus}</span>}
      </div>

      <p className="fy-ipsas-sub">
        Official template sections. Yellow fields are written here; blue sections come from this year's data. 
        Statements compare {year.label} with None selected.
      </p>

      <div className="fy-compare">
        <span>Comparative financial year (second column on statements and notes)</span>
        <select className="fy-compare-select">
          <option value="">No comparative year</option>
        </select>
      </div>

      <div className="fy-ipsas-body">
        <aside className="fy-ipsas-sidebar">
          {documentSections.map((section) => (
            <button
              key={section.key}
              className={`fy-ipsas-nav-item ${docSection === section.key ? 'fy-ipsas-nav-item--active' : ''}`}
              onClick={() => setDocSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <main className="fy-ipsas-content">
          {docSection === 'cover' && (
            <div className="fy-ipsas-doc">
              <div className="fy-ipsas-cover">
                <h1 className="fy-ipsas-school-name">{school?.name || 'School Name'}</h1>
                <h2 className="fy-ipsas-title">ANNUAL REPORT AND FINANCIAL STATEMENTS</h2>
                <p className="fy-ipsas-date">FOR THE FINANCIAL YEAR ENDED {year.endDate ? new Date(year.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : '2027-06-30'}</p>
                <p className="fy-ipsas-standards">Prepared in accordance with the Accrual Basis of Accounting under IPSAS</p>
                <div className="fy-ipsas-cover-footer">
                  <span className="fy-ipsas-badge">Cover</span>
                  <span className="fy-ipsas-badge">Auto-filled</span>
                </div>
              </div>
            </div>
          )}

          {docSection === 'who-we-are' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">3. Who we are</h3>
              <div className="fy-ipsas-doc-content">
                <p><strong>{school?.name || 'Stephen Kanja hybrid school'}</strong> is domiciled in Kenya. Its operations are governed under the Basic Education Act, 2013. It is in {school?.county || 'Kwale'} County, {school?.subCounty || 'Matuga'} Sub-County. Registration number {school?.regNumber || '022222'}. School type: {school?.schoolType || 'mixed'}.</p>
                <p>Contacts, board members and bankers are taken from School Profile and School Accounts.</p>
                
                <div className="fy-ipsas-field">
                  <label>Board of Management</label>
                  <div className="fy-ipsas-empty">None added yet.</div>
                </div>
                
                <div className="fy-ipsas-field">
                  <label>School bankers</label>
                  <div className="fy-ipsas-empty">None added yet.</div>
                </div>
                
                <div className="fy-ipsas-field">
                  <label>Entity activities, mandate, vision and mission</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={4} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'chairman' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">4. Chairman's Statement</h3>
              <div className="fy-ipsas-doc-content">
                <div className="fy-ipsas-field">
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={10} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'principal' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">5. Principal's Statement</h3>
              <div className="fy-ipsas-doc-content">
                <p className="fy-ipsas-hint">Two to three pages</p>
                <div className="fy-ipsas-field">
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={10} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'objectives' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">6. Statement of Performance against Predetermined Objectives</h3>
              <div className="fy-ipsas-doc-content">
                <table className="fy-objectives-table">
                  <thead>
                    <tr>
                      <th>OBJECTIVE</th>
                      <th>KPI</th>
                      <th>TARGET</th>
                      <th>ACHIEVEMENT</th>
                      <th>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="fy-ipsas-empty">None yet.</td>
                    </tr>
                  </tbody>
                </table>
                <button className="fy-btn">+ Add Objective</button>

                <div className="fy-objectives-summary">
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">FY</span>
                    <span className="fy-summary-value">{year.label}</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">REVENUE</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">EXPENSES</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">SURPLUS/(DEFICIT)</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">CASH & BANK</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {docSection === 'management' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">7. Management Discussion and Analysis</h3>
              <div className="fy-ipsas-doc-content">
                <div className="fy-ipsas-field">
                  <label>Financial performance commentary</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={4} />
                </div>
                <div className="fy-ipsas-field">
                  <label>Teacher-student ratio</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={3} />
                </div>
                <div className="fy-ipsas-field">
                  <label>Non-teaching staff establishment</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={3} />
                </div>
                <div className="fy-ipsas-field">
                  <label>KCSE mean score and candidates (last three years)</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={3} />
                </div>
                <div className="fy-ipsas-field">
                  <label>Capacity of the school</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={3} />
                </div>
                <div className="fy-ipsas-field">
                  <label>Development projects</label>
                  <table className="fy-projects-table">
                    <thead>
                      <tr>
                        <th>PROJECT</th>
                        <th>SOURCE OF FUNDS</th>
                        <th>STATUS</th>
                        <th>INITIAL COST</th>
                        <th>AMOUNT SPENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="fy-ipsas-empty">No records yet.</td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="fy-btn">+ Add Project</button>
                </div>
                <div className="fy-ipsas-field">
                  <label>Other necessary information</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={3} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'bom' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">8. Statement of Board of Management Responsibilities</h3>
              <div className="fy-ipsas-doc-content">
                <div className="fy-ipsas-field">
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={8} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'auditor' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">10. Report of the Auditor General</h3>
              <div className="fy-ipsas-doc-content">
                <p className="fy-ipsas-note">
                  Completed by the Office of the Auditor-General after audit — not generated by this system.
                </p>
              </div>
            </div>
          )}

          {docSection === 'financial-statements' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">11-16. Financial statements</h3>
              <div className="fy-ipsas-doc-content">
                <p className="fy-ipsas-note">
                  These figures follow the year comparison selected above. Open Financial Statements in the sidebar for the full tables.
                </p>
                <div className="fy-ipsas-summary-grid">
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Financial Performance</span>
                    <span className="fy-summary-value">{year.label} vs None selected</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Total Revenue</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Total Expenses</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Surplus / (Deficit)</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                </div>
                <div className="fy-ipsas-summary-grid">
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Financial Position</span>
                    <span className="fy-summary-value">Total Assets: 0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Total Liabilities</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                  <div className="fy-summary-item">
                    <span className="fy-summary-label">Net Assets</span>
                    <span className="fy-summary-value">0.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {docSection === 'notes' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">17. Notes</h3>
              <div className="fy-ipsas-doc-content">
                <p className="fy-ipsas-note">Notes to the financial statements will appear here based on the data entered.</p>
                <div className="fy-ipsas-field">
                  <label>Significant accounting policies</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed — write this section here..." rows={4} />
                </div>
              </div>
            </div>
          )}

          {docSection === 'annexes' && (
            <div className="fy-ipsas-doc">
              <h3 className="fy-ipsas-doc-title">18. Annexes</h3>
              <div className="fy-ipsas-doc-content">
                <p className="fy-ipsas-note">Annexes will appear here based on the data entered.</p>
                <div className="fy-ipsas-field">
                  <label>Annex 1</label>
                  <textarea className="fy-textarea" placeholder="Not yet completed..." rows={3} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ---- Page Component -----------------------------------------------------
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

        setSchool({ name: me.schoolName, county: me.county, subCounty: me.subCounty, regNumber: me.regNumber, schoolType: me.schoolType });
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

  const handleCellChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [field]: Number(value) || 0 };
    setRows(updated);
  };

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
            <OverviewSection
              year={year}
              totals={totals}
              inventories={inventories}
              setInventories={setInventories}
              isFinalized={isFinalized}
              handleSaveAdditionalInfo={handleSaveAdditionalInfo}
              savingInfo={savingInfo}
              compareId={compareId}
              setCompareId={setCompareId}
              compareOptions={compareOptions}
            />
          )}

          {activeSection === 'trial-balance' && (
            <div className="fy-panel">
              <div className="fy-panel-header">
                <div>
                  <h3 className="fy-panel-title">Trial Balance — school accounts</h3>
                  <p className="fy-panel-sub">
                    Choose the school accounts you want, then download one combined workbook. Columns match the official Excel: Approved Estimates, extract DR/CR, Adjustments DR/CR, Opening Journal, Closing Journal, and Final TB.
                  </p>
                </div>

                <div className="fy-tb-actions">
                  <div className="fy-account-checkboxes">
                    {['Operations', 'Tuition', 'Boarding', 'Infrastructure'].map((acc) => (
                      <label key={acc} className="fy-checkbox-label">
                        <input type="checkbox" defaultChecked /> {acc}
                      </label>
                    ))}
                  </div>
                  <button type="button" className="fy-btn" onClick={handleDownload}>
                    <IconDownload width={16} height={16} /> Download combined template (.xlsx)
                  </button>
                  <button
                    type="button"
                    className="fy-btn fy-btn--primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || isFinalized}
                  >
                    <IconUpload width={16} height={16} /> {uploading ? 'Uploading…' : 'Upload'}
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

              <TrialBalanceTable rows={rows} onCellChange={handleCellChange} />
            </div>
          )}

          {activeSection === 'notes' && (
            <NotesSection year={year} isFinalized={isFinalized} />
          )}

          {activeSection === 'cash-bank' && (
            <CashBankSection year={year} isFinalized={isFinalized} />
          )}

          {activeSection === 'receivables' && (
            <ReceivablesSection year={year} isFinalized={isFinalized} />
          )}

          {activeSection === 'payables' && (
            <PayablesSection year={year} isFinalized={isFinalized} />
          )}

          {activeSection === 'financial-statements' && (
            <FinancialStatementsSection
              year={year}
              totals={totals}
              compareId={compareId}
              compareOptions={compareOptions}
            />
          )}

          {activeSection === 'ipsas-report' && (
            <IpsasReportSection year={year} school={school} />
          )}
        </main>
      </div>
    </div>
  );
}

export default FinancialYear;
