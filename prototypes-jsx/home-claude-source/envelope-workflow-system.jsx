import React, { useState, useMemo } from 'react';

// ============================================================================
// DATA MODEL
// ============================================================================

const budgetAuthorities = {
  'MKT-2025-Q1': {
    id: 'MKT-2025-Q1', name: 'Q1 Marketing', authorized: 150000, department: 'Marketing',
    owner: 'M. Chen', ownerEmail: 'm.chen@company.com', period: '2025-Q1', glAccount: '6100-100',
    glCodes: [
      { code: '6100-100-5010', description: 'Agency Fees' },
      { code: '6100-100-5020', description: 'Digital Advertising' },
      { code: '6100-100-5030', description: 'Events & Sponsorships' },
      { code: '6100-100-5040', description: 'Creative Production' }
    ]
  },
  'PROD-2025-Q1': {
    id: 'PROD-2025-Q1', name: 'Q1 Product', authorized: 200000, department: 'Product',
    owner: 'L. Park', ownerEmail: 'l.park@company.com', period: '2025-Q1', glAccount: '6100-200',
    glCodes: [
      { code: '6100-200-5010', description: 'Design Services' },
      { code: '6100-200-5020', description: 'User Research' },
      { code: '6100-200-5030', description: 'Prototyping' }
    ]
  },
  'ENG-2025-Q1': {
    id: 'ENG-2025-Q1', name: 'Q1 Engineering', authorized: 280000, department: 'Engineering',
    owner: 'S. Patel', ownerEmail: 's.patel@company.com', period: '2025-Q1', glAccount: '6100-300',
    glCodes: [
      { code: '6100-300-5010', description: 'Cloud Infrastructure' },
      { code: '6100-300-5020', description: 'Software Licenses' },
      { code: '6100-300-5030', description: 'Security Services' },
      { code: '6100-300-5040', description: 'Consulting' }
    ]
  }
};

const initialForecasts = [
  { id: 'FCST-001', budgetId: 'MKT-2025-Q1', description: 'Q2 Campaign Planning - Agency', amount: 50000, expectedDate: '2025-04-01', status: 'PLANNED', createdBy: 'M. Chen', vendorId: 'V-001' },
  { id: 'FCST-002', budgetId: 'MKT-2025-Q1', description: 'Trade Show - Fall', amount: 35000, expectedDate: '2025-09-15', status: 'TENTATIVE', createdBy: 'M. Chen', vendorId: null },
  { id: 'FCST-003', budgetId: 'ENG-2025-Q1', description: 'Additional cloud capacity', amount: 60000, expectedDate: '2025-04-01', status: 'PLANNED', createdBy: 'S. Patel', vendorId: null }
];

const vendorsList = [
  { id: 'V-001', name: 'Brandworks Creative LLC', contact: 'Sarah Mitchell', email: 'sarah@brandworks.co', paymentTerms: 'Net 30' },
  { id: 'V-002', name: 'MediaCorp Digital', contact: 'James Wong', email: 'jwong@mediacorp.io', paymentTerms: 'Net 45' },
  { id: 'V-003', name: 'SecureCheck Partners', contact: 'Diana Ross', email: 'd.ross@securecheck.com', paymentTerms: 'Net 30' }
];

// Current user context (would come from auth in real system)
const currentUser = {
  name: 'M. Chen',
  email: 'm.chen@company.com',
  roles: ['BUDGET_HOLDER', 'REQUESTOR'],
  budgets: ['MKT-2025-Q1'] // Budgets this user is holder for
};

const initialEnvelopes = [
  {
    id: 'ENV-001',
    poNumber: 'PO-4521',
    title: 'Agency Retainer - Brandworks Q1',
    vendorId: 'V-001',
    status: 'IN_PROGRESS',
    risk: 'LOW',
    createdAt: '2025-01-14T09:32:00Z',
    requestedBy: 'J. Smith',
    lineItems: [
      { id: 'ENV-001-L1', description: 'Monthly retainer - Creative services', budgetId: 'MKT-2025-Q1', amount: 36000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5010' },
      { id: 'ENV-001-L2', description: 'Brand refresh project', budgetId: 'PROD-2025-Q1', amount: 4000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On delivery', expectedUnits: 1, completedUnits: 0, glCode: '6100-200-5010' }
    ],
    controls: [
      { id: 'C1', type: 'BUDGET_HOLDER', budgetId: 'MKT-2025-Q1', status: 'SATISFIED', by: 'M. Chen', at: '2025-01-14T14:15:00Z', proof: '0x8f3a2b1c' },
      { id: 'C2', type: 'BUDGET_HOLDER', budgetId: 'PROD-2025-Q1', status: 'SATISFIED', by: 'L. Park', at: '2025-01-14T14:45:00Z', proof: '0x9c4d3e2f' },
      { id: 'C3', type: 'PROCUREMENT_REVIEW', status: 'SATISFIED', by: 'J. Torres', at: '2025-01-14T16:30:00Z', proof: '0x2b1c8f3a' },
      { id: 'C4', type: 'THRESHOLD_50K', status: 'NOT_REQUIRED', rule: 'Total < $50K' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-01-14T09:32:00Z', type: 'INITIATED', actor: 'J. Smith', detail: 'Envelope created' },
      { id: 'E002', timestamp: '2025-01-14T14:15:00Z', type: 'BUDGET_APPROVED', actor: 'M. Chen', detail: 'MKT-2025-Q1 approved' },
      { id: 'E003', timestamp: '2025-01-14T14:45:00Z', type: 'BUDGET_APPROVED', actor: 'L. Park', detail: 'PROD-2025-Q1 approved' },
      { id: 'E004', timestamp: '2025-01-14T16:30:00Z', type: 'PROCUREMENT_APPROVED', actor: 'J. Torres', detail: 'Procurement review complete' },
      { id: 'E005', timestamp: '2025-01-15T10:00:00Z', type: 'PO_ISSUED', actor: 'System', detail: 'PO-4521 issued', vendorVisible: true },
      { id: 'E006', timestamp: '2025-02-03T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', detail: 'ACH-88432 - $12,000', data: { amount: 12000 }, vendorVisible: true },
      { id: 'E007', timestamp: '2025-03-03T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', detail: 'ACH-91205 - $12,000', data: { amount: 12000 }, vendorVisible: true }
    ]
  },
  {
    id: 'ENV-002',
    poNumber: 'PO-4522',
    title: 'Q1 Digital Media Campaign',
    vendorId: 'V-002',
    status: 'IN_PROGRESS',
    risk: 'MEDIUM',
    riskNote: 'Spend pacing above forecast',
    createdAt: '2025-01-17T09:00:00Z',
    requestedBy: 'A. Wong',
    lineItems: [
      { id: 'ENV-002-L1', description: 'Paid social media - Q1', budgetId: 'MKT-2025-Q1', amount: 40000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5020' },
      { id: 'ENV-002-L2', description: 'Programmatic display', budgetId: 'MKT-2025-Q1', amount: 25000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5020' }
    ],
    controls: [
      { id: 'C1', type: 'BUDGET_HOLDER', budgetId: 'MKT-2025-Q1', status: 'SATISFIED', by: 'M. Chen', at: '2025-01-17T11:00:00Z', proof: '0x4e2f1a3b' },
      { id: 'C2', type: 'PROCUREMENT_REVIEW', status: 'SATISFIED', by: 'J. Torres', at: '2025-01-17T15:45:00Z', proof: '0x9a3d5c2e' },
      { id: 'C3', type: 'THRESHOLD_50K', status: 'SATISFIED', by: 'VP Finance', at: '2025-01-18T09:00:00Z', proof: '0x1f8b4d2a' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-01-17T09:00:00Z', type: 'INITIATED', actor: 'A. Wong', detail: 'Envelope created' },
      { id: 'E002', timestamp: '2025-01-18T10:30:00Z', type: 'PO_ISSUED', actor: 'System', detail: 'PO-4522 issued', vendorVisible: true },
      { id: 'E003', timestamp: '2025-02-12T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', detail: 'ACH-89102 - $22,000', data: { amount: 22000 }, vendorVisible: true },
      { id: 'E004', timestamp: '2025-03-07T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', detail: 'ACH-92341 - $24,500', data: { amount: 24500 }, vendorVisible: true }
    ]
  },
  {
    id: 'ENV-003',
    poNumber: null,
    title: 'Security Audit - Annual',
    vendorId: 'V-003',
    status: 'PENDING_APPROVAL',
    risk: 'HIGH',
    riskNote: 'Awaiting threshold approval - blocking PO',
    createdAt: '2025-03-10T11:00:00Z',
    requestedBy: 'K. Lee',
    lineItems: [
      { id: 'ENV-003-L1', description: 'Penetration testing', budgetId: 'ENG-2025-Q1', amount: 45000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On completion', expectedUnits: 1, completedUnits: 0, glCode: '6100-300-5030' },
      { id: 'ENV-003-L2', description: 'Compliance documentation', budgetId: 'ENG-2025-Q1', amount: 30000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On delivery', expectedUnits: 1, completedUnits: 0, glCode: '6100-300-5030' }
    ],
    controls: [
      { id: 'C1', type: 'BUDGET_HOLDER', budgetId: 'ENG-2025-Q1', status: 'SATISFIED', by: 'S. Patel', at: '2025-03-10T14:00:00Z', proof: '0x8e2c4f1a' },
      { id: 'C2', type: 'PROCUREMENT_REVIEW', status: 'PENDING', assignedTo: 'J. Torres', dueBy: '2025-03-12T17:00:00Z' },
      { id: 'C3', type: 'THRESHOLD_50K', status: 'PENDING', assignedTo: 'VP Finance', dueBy: '2025-03-13T17:00:00Z' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-03-10T11:00:00Z', type: 'INITIATED', actor: 'K. Lee', detail: 'Envelope created - urgent' },
      { id: 'E002', timestamp: '2025-03-10T14:00:00Z', type: 'BUDGET_APPROVED', actor: 'S. Patel', detail: 'ENG-2025-Q1 approved' },
      { id: 'E003', timestamp: '2025-03-10T14:05:00Z', type: 'PENDING_REVIEW', actor: 'System', detail: 'Awaiting Procurement + Finance' }
    ]
  }
];

// ============================================================================
// UTILITIES
// ============================================================================

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
const formatDate = (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatDateTime = (s) => new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
const generateId = (prefix) => `${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;
const generateProof = () => '0x' + Math.random().toString(16).substr(2, 8);

const calcTotals = (env) => {
  const committed = env.lineItems.reduce((s, li) => s + li.amount, 0);
  const disbursed = env.events.filter(e => e.type === 'DISBURSED').reduce((s, e) => s + (e.data?.amount || 0), 0);
  return { committed, disbursed, remaining: committed - disbursed };
};

const calcBudgetPosition = (budgetId, envelopes) => {
  const budget = budgetAuthorities[budgetId];
  let committed = 0, disbursed = 0;
  envelopes.forEach(env => {
    env.lineItems.forEach(li => { if (li.budgetId === budgetId) committed += li.amount; });
    const share = env.lineItems.filter(li => li.budgetId === budgetId).reduce((s, li) => s + li.amount, 0);
    const total = env.lineItems.reduce((s, li) => s + li.amount, 0);
    const envDisbursed = env.events.filter(e => e.type === 'DISBURSED').reduce((s, e) => s + (e.data?.amount || 0), 0);
    if (total > 0) disbursed += envDisbursed * share / total;
  });
  return { authorized: budget.authorized, committed, disbursed: Math.round(disbursed), available: budget.authorized - committed };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const StatusBadge = ({ status, small }) => {
  const cfg = {
    'PENDING_APPROVAL': { bg: '#2e1e2e', border: '#9333ea', color: '#c4b5fd', label: 'Pending Approval' },
    'APPROVED': { bg: '#1e2e1e', border: '#059669', color: '#6ee7b7', label: 'Approved' },
    'IN_PROGRESS': { bg: '#1a2a2e', border: '#0891b2', color: '#67e8f9', label: 'In Progress' },
    'COMPLETE': { bg: '#1e2e1e', border: '#059669', color: '#6ee7b7', label: 'Complete' },
    'PLANNED': { bg: '#1e1e2e', border: '#6366f1', color: '#a5b4fc', label: 'Planned' },
    'TENTATIVE': { bg: '#1e1e2e', border: '#4b5563', color: '#9ca3af', label: 'Tentative' }
  }[status] || { bg: '#1e1e2e', border: '#4b5563', color: '#9ca3af', label: status };
  return (
    <span style={{ display: 'inline-block', padding: small ? '2px 8px' : '4px 12px', fontSize: small ? '9px' : '10px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '4px', color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

const RiskBadge = ({ risk }) => {
  const cfg = { 'LOW': { color: '#0891b2', bg: 'rgba(8,145,178,0.1)' }, 'MEDIUM': { color: '#d97706', bg: 'rgba(217,119,6,0.1)' }, 'HIGH': { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' } }[risk] || { color: '#6b7280', bg: 'rgba(107,114,128,0.1)' };
  return <span style={{ fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', backgroundColor: cfg.bg, color: cfg.color, textTransform: 'uppercase' }}>{risk}</span>;
};

const ControlStatusIcon = ({ status }) => {
  const cfg = {
    'SATISFIED': { color: '#6ee7b7', symbol: '✓' },
    'PENDING': { color: '#fcd34d', symbol: '○' },
    'NOT_REQUIRED': { color: '#6b7280', symbol: '—' },
    'REJECTED': { color: '#fca5a5', symbol: '✕' }
  }[status];
  return <span style={{ color: cfg.color, fontWeight: '600' }}>{cfg.symbol}</span>;
};

// Approval Action Panel
const ApprovalActionPanel = ({ envelope, control, onApprove, onReject, onRequestInfo }) => {
  const [comment, setComment] = useState('');
  const [showActions, setShowActions] = useState(false);
  
  const budget = control.budgetId ? budgetAuthorities[control.budgetId] : null;
  const lineItemsForBudget = budget ? envelope.lineItems.filter(li => li.budgetId === control.budgetId) : envelope.lineItems;
  const amountForApproval = lineItemsForBudget.reduce((s, li) => s + li.amount, 0);
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(217,119,6,0.1)',
      border: '1px solid rgba(217,119,6,0.3)',
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#fcd34d', marginBottom: '4px' }}>
            Action Required: {control.type.replace(/_/g, ' ')}
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
            {budget ? `${formatCurrency(amountForApproval)} from ${budget.name}` : `Total: ${formatCurrency(amountForApproval)}`}
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#6b7280' }}>
          Due: {control.dueBy ? formatDateTime(control.dueBy) : 'ASAP'}
        </div>
      </div>
      
      {/* Line items being approved */}
      <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
        <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          Items for Approval
        </div>
        {lineItemsForBudget.map((li, i) => (
          <div key={li.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: i < lineItemsForBudget.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span style={{ color: '#e2e2e8' }}>{li.description}</span>
            <span style={{ color: '#d97706', fontWeight: '600' }}>{formatCurrency(li.amount)}</span>
          </div>
        ))}
      </div>
      
      {!showActions ? (
        <button onClick={() => setShowActions(true)} style={{
          width: '100%', padding: '10px', fontSize: '11px', fontWeight: '600',
          backgroundColor: '#d97706', border: 'none', borderRadius: '6px',
          color: '#fff', cursor: 'pointer', fontFamily: 'inherit'
        }}>
          Review & Take Action
        </button>
      ) : (
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment (optional)..."
            style={{
              width: '100%', padding: '10px', fontSize: '11px',
              backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit',
              resize: 'none', marginBottom: '12px', boxSizing: 'border-box'
            }}
            rows={2}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onApprove(control, comment)} style={{
              flex: 1, padding: '10px', fontSize: '11px', fontWeight: '600',
              backgroundColor: '#059669', border: 'none', borderRadius: '6px',
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit'
            }}>
              ✓ Approve
            </button>
            <button onClick={() => onRequestInfo(control, comment)} style={{
              flex: 1, padding: '10px', fontSize: '11px', fontWeight: '600',
              backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px', color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit'
            }}>
              ? Request Info
            </button>
            <button onClick={() => onReject(control, comment)} style={{
              flex: 1, padding: '10px', fontSize: '11px', fontWeight: '600',
              backgroundColor: '#dc2626', border: 'none', borderRadius: '6px',
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit'
            }}>
              ✕ Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Issue PO Panel
const IssuePOPanel = ({ envelope, onIssuePO }) => {
  const totals = calcTotals(envelope);
  const allControlsSatisfied = envelope.controls.every(c => c.status === 'SATISFIED' || c.status === 'NOT_REQUIRED');
  
  if (!allControlsSatisfied || envelope.poNumber) return null;
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(59,130,246,0.1)',
      border: '1px solid rgba(59,130,246,0.3)',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#93c5fd' }}>
            Ready to Issue PO
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>
            All controls satisfied · {formatCurrency(totals.committed)} committed
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#6ee7b7' }}>✓ All controls satisfied</div>
      </div>
      
      <button onClick={() => onIssuePO(envelope)} style={{
        width: '100%', padding: '12px', fontSize: '12px', fontWeight: '600',
        backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px',
        color: '#fff', cursor: 'pointer', fontFamily: 'inherit'
      }}>
        Issue Purchase Order
      </button>
    </div>
  );
};

// Forecast Card with Convert Action
const ForecastCard = ({ forecast, onConvert }) => {
  const budget = budgetAuthorities[forecast.budgetId];
  const vendor = forecast.vendorId ? vendorsList.find(v => v.id === forecast.vendorId) : null;
  
  return (
    <div style={{
      padding: '14px 16px',
      backgroundColor: 'rgba(99,102,241,0.05)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '8px',
      marginBottom: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#e2e2e8' }}>{forecast.description}</div>
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
            {budget.name} · Expected {formatDate(forecast.expectedDate)}
            {vendor && <span> · {vendor.name}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#a5b4fc' }}>{formatCurrency(forecast.amount)}</div>
          <StatusBadge status={forecast.status} small />
        </div>
      </div>
      
      <button onClick={() => onConvert(forecast)} style={{
        width: '100%', padding: '8px', fontSize: '10px', fontWeight: '600',
        backgroundColor: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
        borderRadius: '4px', color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit',
        textTransform: 'uppercase', letterSpacing: '0.5px'
      }}>
        Convert to Envelope →
      </button>
    </div>
  );
};

// State Machine Visualization
const StateMachineViz = ({ envelope }) => {
  const states = [
    { id: 'INITIATED', label: 'Initiated', x: 50 },
    { id: 'PENDING_APPROVAL', label: 'Pending Approval', x: 180 },
    { id: 'APPROVED', label: 'Approved', x: 310 },
    { id: 'PO_ISSUED', label: 'PO Issued', x: 440 },
    { id: 'IN_PROGRESS', label: 'In Progress', x: 570 },
    { id: 'COMPLETE', label: 'Complete', x: 700 }
  ];
  
  const currentStateIndex = states.findIndex(s => 
    s.id === envelope.status || 
    (envelope.poNumber && s.id === 'PO_ISSUED') ||
    (envelope.status === 'IN_PROGRESS' && s.id === 'IN_PROGRESS')
  );
  
  // Determine actual current state more precisely
  let activeIndex = 0;
  if (envelope.status === 'PENDING_APPROVAL') activeIndex = 1;
  else if (envelope.controls.every(c => c.status === 'SATISFIED' || c.status === 'NOT_REQUIRED') && !envelope.poNumber) activeIndex = 2;
  else if (envelope.poNumber && envelope.status !== 'COMPLETE') activeIndex = 4;
  else if (envelope.status === 'COMPLETE') activeIndex = 5;
  
  return (
    <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '16px', overflowX: 'auto' }}>
      <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Envelope State Machine
      </div>
      <svg width="750" height="60" style={{ display: 'block' }}>
        {/* Connection lines */}
        {states.slice(0, -1).map((state, i) => (
          <line
            key={`line-${i}`}
            x1={state.x + 40}
            y1={20}
            x2={states[i + 1].x - 10}
            y2={20}
            stroke={i < activeIndex ? '#3b82f6' : 'rgba(255,255,255,0.1)'}
            strokeWidth="2"
          />
        ))}
        
        {/* State nodes */}
        {states.map((state, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          
          return (
            <g key={state.id}>
              <circle
                cx={state.x + 15}
                cy={20}
                r={isActive ? 12 : 8}
                fill={isActive ? '#3b82f6' : isPast ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}
                stroke={isActive ? '#93c5fd' : 'none'}
                strokeWidth="2"
              />
              {isPast && (
                <text x={state.x + 15} y={24} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">✓</text>
              )}
              <text
                x={state.x + 15}
                y={48}
                textAnchor="middle"
                fill={isActive ? '#93c5fd' : isPast ? '#6b7280' : '#4b5563'}
                fontSize="9"
                fontWeight={isActive ? '600' : '400'}
              >
                {state.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Create Envelope Modal (simplified)
const CreateModal = ({ isOpen, onClose, onSubmit, envelopes, forecast }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: forecast?.description || '',
    vendorId: forecast?.vendorId || '',
    lineItems: forecast ? [{
      description: forecast.description,
      amount: forecast.amount,
      budgetId: forecast.budgetId,
      glCode: budgetAuthorities[forecast.budgetId]?.glCodes[0]?.code || '',
      fulfillmentType: 'MILESTONE',
      fulfillmentSchedule: 'On delivery',
      expectedUnits: 1
    }] : [{ description: '', amount: 0, budgetId: '', glCode: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1 }]
  });
  
  const total = form.lineItems.reduce((s, li) => s + (li.amount || 0), 0);
  const budgets = [...new Set(form.lineItems.filter(li => li.budgetId).map(li => li.budgetId))];
  
  const handleSubmit = () => {
    const env = {
      id: generateId('ENV'),
      poNumber: null,
      title: form.title,
      vendorId: form.vendorId,
      status: 'PENDING_APPROVAL',
      risk: total >= 50000 ? 'MEDIUM' : 'LOW',
      createdAt: new Date().toISOString(),
      requestedBy: currentUser.name,
      lineItems: form.lineItems.map((li, i) => ({ ...li, id: `${generateId('ENV')}-L${i + 1}`, completedUnits: 0 })),
      controls: [
        ...budgets.map(bid => ({ id: generateId('C'), type: 'BUDGET_HOLDER', budgetId: bid, status: 'PENDING', assignedTo: budgetAuthorities[bid].owner, dueBy: new Date(Date.now() + 2 * 86400000).toISOString() })),
        { id: generateId('C'), type: 'PROCUREMENT_REVIEW', status: 'PENDING', assignedTo: 'J. Torres', dueBy: new Date(Date.now() + 3 * 86400000).toISOString() },
        total >= 50000 
          ? { id: generateId('C'), type: 'THRESHOLD_50K', status: 'PENDING', assignedTo: 'VP Finance', dueBy: new Date(Date.now() + 4 * 86400000).toISOString() }
          : { id: generateId('C'), type: 'THRESHOLD_50K', status: 'NOT_REQUIRED', rule: 'Total < $50K' }
      ],
      events: [{ id: 'E001', timestamp: new Date().toISOString(), type: 'INITIATED', actor: currentUser.name, detail: `Envelope created: ${form.title}` }]
    };
    onSubmit(env, forecast?.id);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '600px', maxHeight: '85vh', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
              {forecast ? 'Convert Forecast' : 'New Envelope'}
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '500', margin: 0, color: '#f8f8fc' }}>
              {step === 1 ? 'Request Details' : step === 2 ? 'Line Items' : 'Review & Submit'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {step === 1 && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What is this spend for?" style={{ width: '100%', padding: '12px', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vendor *</label>
                <select value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })} style={{ width: '100%', padding: '12px', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="">Select vendor...</option>
                  {vendorsList.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              {form.lineItems.map((li, i) => (
                <div key={i} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input type="text" value={li.description} onChange={(e) => { const items = [...form.lineItems]; items[i].description = e.target.value; setForm({ ...form, lineItems: items }); }} placeholder="Description" style={{ width: '100%', padding: '10px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                      <input type="number" value={li.amount || ''} onChange={(e) => { const items = [...form.lineItems]; items[i].amount = parseInt(e.target.value) || 0; setForm({ ...form, lineItems: items }); }} placeholder="Amount" style={{ width: '100%', padding: '10px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                      <select value={li.budgetId} onChange={(e) => { const items = [...form.lineItems]; items[i].budgetId = e.target.value; items[i].glCode = budgetAuthorities[e.target.value]?.glCodes[0]?.code || ''; setForm({ ...form, lineItems: items }); }} style={{ width: '100%', padding: '10px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                        <option value="">Select budget...</option>
                        {Object.values(budgetAuthorities).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    {li.budgetId && (
                      <select value={li.glCode} onChange={(e) => { const items = [...form.lineItems]; items[i].glCode = e.target.value; setForm({ ...form, lineItems: items }); }} style={{ width: '100%', padding: '10px', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#e2e2e8', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                        <option value="">Select GL code...</option>
                        {budgetAuthorities[li.budgetId]?.glCodes.map(gl => <option key={gl.code} value={gl.code}>{gl.code} - {gl.description}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => setForm({ ...form, lineItems: [...form.lineItems, { description: '', amount: 0, budgetId: '', glCode: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1 }] })} style={{ width: '100%', padding: '10px', fontSize: '11px', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px dashed rgba(59,130,246,0.4)', borderRadius: '6px', color: '#93c5fd', cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add Line Item
              </button>
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#e2e2e8', marginBottom: '4px' }}>{form.title}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>{vendorsList.find(v => v.id === form.vendorId)?.name}</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(total)}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{form.lineItems.length} line items · {budgets.length} budgets</div>
              </div>
              
              <div style={{ padding: '16px', backgroundColor: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Required Approvals</div>
                {budgets.map(bid => (
                  <div key={bid} style={{ fontSize: '11px', color: '#fcd34d', padding: '4px 0' }}>○ Budget Holder: {budgetAuthorities[bid].owner}</div>
                ))}
                <div style={{ fontSize: '11px', color: '#fcd34d', padding: '4px 0' }}>○ Procurement: J. Torres</div>
                {total >= 50000 && <div style={{ fontSize: '11px', color: '#fcd34d', padding: '4px 0' }}>○ Finance (&gt;$50K): VP Finance</div>}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} style={{ padding: '10px 20px', fontSize: '12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit' }}>
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          <button onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()} disabled={step === 1 ? !form.title || !form.vendorId : step === 2 ? !form.lineItems.every(li => li.description && li.amount && li.budgetId && li.glCode) : false} style={{ padding: '10px 24px', fontSize: '12px', fontWeight: '600', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', opacity: (step === 1 && (!form.title || !form.vendorId)) || (step === 2 && !form.lineItems.every(li => li.description && li.amount && li.budgetId && li.glCode)) ? 0.5 : 1 }}>
            {step < 3 ? 'Continue →' : 'Create Envelope'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EnvelopeWorkflowSystem = () => {
  const [envelopes, setEnvelopes] = useState(initialEnvelopes);
  const [forecasts, setForecasts] = useState(initialForecasts);
  const [selectedEnvelope, setSelectedEnvelope] = useState(envelopes[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [convertForecast, setConvertForecast] = useState(null);
  const [viewMode, setViewMode] = useState('ALL'); // ALL, MY_APPROVALS, MY_REQUESTS
  const [notification, setNotification] = useState(null);

  // Filter for approval queue
  const myPendingApprovals = useMemo(() => {
    return envelopes.filter(env => 
      env.controls.some(c => 
        c.status === 'PENDING' && 
        (c.assignedTo === currentUser.name || currentUser.budgets.includes(c.budgetId))
      )
    );
  }, [envelopes]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle approval action
  const handleApprove = (envelope, control, comment) => {
    const now = new Date().toISOString();
    const proof = generateProof();
    
    setEnvelopes(prev => prev.map(env => {
      if (env.id !== envelope.id) return env;
      
      const updatedControls = env.controls.map(c => 
        c.id === control.id ? { ...c, status: 'SATISFIED', by: currentUser.name, at: now, proof, comment } : c
      );
      
      const allSatisfied = updatedControls.every(c => c.status === 'SATISFIED' || c.status === 'NOT_REQUIRED');
      const newStatus = allSatisfied ? 'APPROVED' : 'PENDING_APPROVAL';
      
      const eventType = control.type === 'BUDGET_HOLDER' ? 'BUDGET_APPROVED' : control.type === 'PROCUREMENT_REVIEW' ? 'PROCUREMENT_APPROVED' : 'THRESHOLD_APPROVED';
      
      return {
        ...env,
        status: newStatus,
        controls: updatedControls,
        events: [...env.events, {
          id: `E${String(env.events.length + 1).padStart(3, '0')}`,
          timestamp: now,
          type: eventType,
          actor: currentUser.name,
          detail: `${control.type.replace(/_/g, ' ')} approved${comment ? `: ${comment}` : ''}`
        }]
      };
    }));
    
    setSelectedEnvelope(prev => {
      if (prev.id !== envelope.id) return prev;
      return envelopes.find(e => e.id === envelope.id) || prev;
    });
    
    showNotification(`Approved: ${control.type.replace(/_/g, ' ')}`);
  };

  const handleReject = (envelope, control, comment) => {
    const now = new Date().toISOString();
    
    setEnvelopes(prev => prev.map(env => {
      if (env.id !== envelope.id) return env;
      
      return {
        ...env,
        status: 'REJECTED',
        controls: env.controls.map(c => c.id === control.id ? { ...c, status: 'REJECTED', by: currentUser.name, at: now, comment } : c),
        events: [...env.events, {
          id: `E${String(env.events.length + 1).padStart(3, '0')}`,
          timestamp: now,
          type: 'REJECTED',
          actor: currentUser.name,
          detail: `Rejected: ${comment || 'No reason provided'}`
        }]
      };
    }));
    
    showNotification(`Rejected: ${envelope.title}`, 'error');
  };

  const handleRequestInfo = (envelope, control, comment) => {
    const now = new Date().toISOString();
    
    setEnvelopes(prev => prev.map(env => {
      if (env.id !== envelope.id) return env;
      
      return {
        ...env,
        events: [...env.events, {
          id: `E${String(env.events.length + 1).padStart(3, '0')}`,
          timestamp: now,
          type: 'INFO_REQUESTED',
          actor: currentUser.name,
          detail: `Information requested: ${comment || 'Please provide more details'}`
        }]
      };
    }));
    
    showNotification('Information requested');
  };

  // Handle PO issuance
  const handleIssuePO = (envelope) => {
    const now = new Date().toISOString();
    const poNumber = `PO-${Math.floor(Math.random() * 9000) + 1000}`;
    const totals = calcTotals(envelope);
    
    // Generate journal entries for encumbrance
    const journalEntries = [];
    const budgetGroups = {};
    envelope.lineItems.forEach(li => {
      if (!budgetGroups[li.budgetId]) budgetGroups[li.budgetId] = 0;
      budgetGroups[li.budgetId] += li.amount;
    });
    
    Object.entries(budgetGroups).forEach(([budgetId, amount]) => {
      journalEntries.push({
        dr: 'Encumbrance', drCode: `1800-${budgetId.split('-')[0]}`,
        cr: 'Budgetary Fund Balance', crCode: `3900-${budgetId.split('-')[0]}`,
        amount
      });
    });
    
    setEnvelopes(prev => prev.map(env => {
      if (env.id !== envelope.id) return env;
      
      return {
        ...env,
        poNumber,
        status: 'IN_PROGRESS',
        events: [...env.events, {
          id: `E${String(env.events.length + 1).padStart(3, '0')}`,
          timestamp: now,
          type: 'PO_ISSUED',
          actor: 'System',
          detail: `${poNumber} issued - ${formatCurrency(totals.committed)}`,
          vendorVisible: true,
          journalEntries
        }]
      };
    }));
    
    showNotification(`PO Issued: ${poNumber}`);
  };

  // Handle envelope creation
  const handleCreateEnvelope = (newEnvelope, forecastId) => {
    setEnvelopes(prev => [newEnvelope, ...prev]);
    setSelectedEnvelope(newEnvelope);
    
    if (forecastId) {
      setForecasts(prev => prev.filter(f => f.id !== forecastId));
    }
    
    showNotification(`Envelope created: ${newEnvelope.id}`);
  };

  // Get controls that current user can act on
  const getActionableControls = (envelope) => {
    return envelope.controls.filter(c => 
      c.status === 'PENDING' && 
      (c.assignedTo === currentUser.name || currentUser.budgets.includes(c.budgetId))
    );
  };

  const totals = calcTotals(selectedEnvelope);
  const vendor = vendorsList.find(v => v.id === selectedEnvelope.vendorId) || { name: 'Unknown' };
  const actionableControls = getActionableControls(selectedEnvelope);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#06060a', color: '#e2e2e8', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '12px' }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          padding: '12px 20px', borderRadius: '8px',
          backgroundColor: notification.type === 'error' ? 'rgba(220,38,38,0.9)' : 'rgba(5,150,105,0.9)',
          color: '#fff', fontSize: '12px', fontWeight: '500',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '2px' }}>Sightline</div>
          <h1 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: '#f8f8fc' }}>Envelope Workflow</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* View mode tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
            {[
              { id: 'ALL', label: 'All Envelopes' },
              { id: 'MY_APPROVALS', label: `My Approvals (${myPendingApprovals.length})` },
              { id: 'FORECASTS', label: 'Forecasts' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setViewMode(tab.id)} style={{
                padding: '6px 12px', fontSize: '10px', fontWeight: '500',
                backgroundColor: viewMode === tab.id ? 'rgba(59,130,246,0.3)' : 'transparent',
                border: 'none', borderRadius: '4px',
                color: viewMode === tab.id ? '#93c5fd' : '#6b7280',
                cursor: 'pointer', fontFamily: 'inherit'
              }}>
                {tab.label}
              </button>
            ))}
          </div>
          
          <button onClick={() => { setConvertForecast(null); setShowCreate(true); }} style={{
            padding: '10px 20px', fontSize: '12px', fontWeight: '600',
            backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px',
            color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>+</span> New Envelope
          </button>
        </div>
      </header>

      {/* Main content */}
      {viewMode === 'FORECASTS' ? (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '16px' }}>
            Planned Spend · {forecasts.length} Forecasts
          </div>
          {forecasts.map(f => (
            <ForecastCard key={f.id} forecast={f} onConvert={(forecast) => { setConvertForecast(forecast); setShowCreate(true); }} />
          ))}
          {forecasts.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              No forecasts. Create envelopes directly or add forecasts for budget planning.
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', minHeight: 'calc(100vh - 65px)' }}>
          {/* Envelope List */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                {viewMode === 'MY_APPROVALS' ? 'Pending My Approval' : 'All Envelopes'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '300', color: '#e2e2e8' }}>
                {viewMode === 'MY_APPROVALS' ? myPendingApprovals.length : envelopes.length}
              </div>
            </div>
            
            {(viewMode === 'MY_APPROVALS' ? myPendingApprovals : envelopes).map(env => {
              const envTotals = calcTotals(env);
              const isSelected = selectedEnvelope.id === env.id;
              const hasMyAction = getActionableControls(env).length > 0;
              
              return (
                <div key={env.id} onClick={() => setSelectedEnvelope(env)} style={{
                  padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(59,130,246,0.08)' : 'transparent',
                  borderLeft: isSelected ? '2px solid #3b82f6' : hasMyAction ? '2px solid #d97706' : '2px solid transparent'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1, marginRight: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#e2e2e8', marginBottom: '2px' }}>{env.title}</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>{env.poNumber || 'PO Pending'}</div>
                    </div>
                    <RiskBadge risk={env.risk} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <StatusBadge status={env.status} small />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(envTotals.committed)}</span>
                  </div>
                  {hasMyAction && (
                    <div style={{ fontSize: '10px', color: '#fcd34d', backgroundColor: 'rgba(217,119,6,0.1)', padding: '6px 8px', borderRadius: '4px', textAlign: 'center' }}>
                      ⚡ Action Required
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail View */}
          <div style={{ overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', marginBottom: '4px' }}>
                    {selectedEnvelope.id} · {selectedEnvelope.poNumber || 'PO PENDING'}
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#f8f8fc' }}>{selectedEnvelope.title}</h2>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{vendor.name} · {selectedEnvelope.requestedBy}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <StatusBadge status={selectedEnvelope.status} />
                  <RiskBadge risk={selectedEnvelope.risk} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Committed</div>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#d97706' }}>{formatCurrency(totals.committed)}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Disbursed</div>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#3b82f6' }}>{formatCurrency(totals.disbursed)}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Remaining</div>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#9ca3af' }}>{formatCurrency(totals.remaining)}</div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* State Machine */}
              <StateMachineViz envelope={selectedEnvelope} />
              
              {/* Issue PO Panel */}
              <IssuePOPanel envelope={selectedEnvelope} onIssuePO={handleIssuePO} />
              
              {/* Approval Actions */}
              {actionableControls.map(control => (
                <ApprovalActionPanel
                  key={control.id}
                  envelope={selectedEnvelope}
                  control={control}
                  onApprove={(c, comment) => handleApprove(selectedEnvelope, c, comment)}
                  onReject={(c, comment) => handleReject(selectedEnvelope, c, comment)}
                  onRequestInfo={(c, comment) => handleRequestInfo(selectedEnvelope, c, comment)}
                />
              ))}
              
              {/* Controls List */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Controls</div>
                {selectedEnvelope.controls.map((c, i) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                    backgroundColor: c.status === 'SATISFIED' ? 'rgba(5,150,105,0.1)' : c.status === 'PENDING' ? 'rgba(217,119,6,0.05)' : 'rgba(75,85,99,0.1)',
                    border: `1px solid ${c.status === 'SATISFIED' ? 'rgba(5,150,105,0.3)' : c.status === 'PENDING' ? 'rgba(217,119,6,0.2)' : 'rgba(75,85,99,0.3)'}`,
                    borderRadius: '6px', marginBottom: '8px'
                  }}>
                    <ControlStatusIcon status={c.status} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#e2e2e8', fontWeight: '500' }}>
                        {c.type.replace(/_/g, ' ')}
                        {c.budgetId && <span style={{ color: '#6b7280' }}> · {budgetAuthorities[c.budgetId]?.name}</span>}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                        {c.status === 'SATISFIED' && `${c.by} · ${formatDateTime(c.at)}`}
                        {c.status === 'PENDING' && `Assigned: ${c.assignedTo}`}
                        {c.status === 'NOT_REQUIRED' && c.rule}
                      </div>
                    </div>
                    {c.proof && <span style={{ fontSize: '9px', color: '#4b5563', fontFamily: 'monospace' }}>{c.proof}</span>}
                  </div>
                ))}
              </div>
              
              {/* Line Items */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Line Items</div>
                {selectedEnvelope.lineItems.map(li => (
                  <div key={li.id} style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#e2e2e8' }}>{li.description}</div>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{budgetAuthorities[li.budgetId]?.name} · {li.glCode}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(li.amount)}</div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>{li.completedUnits}/{li.expectedUnits}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Event Timeline */}
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>Events · {selectedEnvelope.events.length}</div>
                {selectedEnvelope.events.map((e, i) => (
                  <div key={e.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: e.type === 'DISBURSED' ? '#3b82f6' : e.type.includes('APPROVED') ? '#10b981' : e.type === 'REJECTED' ? '#dc2626' : '#6b7280', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>{formatDateTime(e.timestamp)} · {e.actor}</div>
                      <div style={{ fontSize: '12px', color: '#e2e2e8' }}>{e.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Modal */}
      <CreateModal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setConvertForecast(null); }}
        onSubmit={handleCreateEnvelope}
        envelopes={envelopes}
        forecast={convertForecast}
      />
    </div>
  );
};

export default EnvelopeWorkflowSystem;
