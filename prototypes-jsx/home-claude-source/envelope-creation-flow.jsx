import React, { useState, useMemo, useCallback } from 'react';

// ============================================================================
// DATA MODEL
// ============================================================================

const budgetAuthorities = {
  'MKT-2025-Q1': {
    id: 'MKT-2025-Q1',
    name: 'Q1 Marketing',
    authorized: 150000,
    department: 'Marketing',
    owner: 'M. Chen',
    ownerEmail: 'm.chen@company.com',
    period: '2025-Q1',
    glAccount: '6100-100',
    glCodes: [
      { code: '6100-100-5010', description: 'Agency Fees' },
      { code: '6100-100-5020', description: 'Digital Advertising' },
      { code: '6100-100-5030', description: 'Events & Sponsorships' },
      { code: '6100-100-5040', description: 'Creative Production' }
    ]
  },
  'PROD-2025-Q1': {
    id: 'PROD-2025-Q1',
    name: 'Q1 Product',
    authorized: 200000,
    department: 'Product',
    owner: 'L. Park',
    ownerEmail: 'l.park@company.com',
    period: '2025-Q1',
    glAccount: '6100-200',
    glCodes: [
      { code: '6100-200-5010', description: 'Design Services' },
      { code: '6100-200-5020', description: 'User Research' },
      { code: '6100-200-5030', description: 'Prototyping' }
    ]
  },
  'ENG-2025-Q1': {
    id: 'ENG-2025-Q1',
    name: 'Q1 Engineering',
    authorized: 280000,
    department: 'Engineering',
    owner: 'S. Patel',
    ownerEmail: 's.patel@company.com',
    period: '2025-Q1',
    glAccount: '6100-300',
    glCodes: [
      { code: '6100-300-5010', description: 'Cloud Infrastructure' },
      { code: '6100-300-5020', description: 'Software Licenses' },
      { code: '6100-300-5030', description: 'Security Services' },
      { code: '6100-300-5040', description: 'Consulting' }
    ]
  }
};

const forecasts = [
  { id: 'FCST-001', budgetId: 'MKT-2025-Q1', description: 'Q2 Campaign Planning - Agency', amount: 50000, expectedDate: '2025-04-01', status: 'PLANNED', createdBy: 'M. Chen' },
  { id: 'FCST-002', budgetId: 'MKT-2025-Q1', description: 'Trade Show - Fall', amount: 35000, expectedDate: '2025-09-15', status: 'TENTATIVE', createdBy: 'M. Chen' },
  { id: 'FCST-003', budgetId: 'ENG-2025-Q1', description: 'Additional cloud capacity', amount: 60000, expectedDate: '2025-04-01', status: 'PLANNED', createdBy: 'S. Patel' }
];

const vendorsList = [
  { id: 'V-001', name: 'Brandworks Creative LLC', contact: 'Sarah Mitchell', email: 'sarah@brandworks.co', paymentTerms: 'Net 30' },
  { id: 'V-002', name: 'MediaCorp Digital', contact: 'James Wong', email: 'jwong@mediacorp.io', paymentTerms: 'Net 45' },
  { id: 'V-003', name: 'SecureCheck Partners', contact: 'Diana Ross', email: 'd.ross@securecheck.com', paymentTerms: 'Net 30' },
  { id: 'V-NEW', name: '+ Add New Vendor', isPlaceholder: true }
];

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
    requestedByEmail: 'j.smith@company.com',
    lineItems: [
      { id: 'ENV-001-L1', description: 'Monthly retainer - Creative services', budgetId: 'MKT-2025-Q1', amount: 36000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5010', glDescription: 'Marketing - Agency Fees' },
      { id: 'ENV-001-L2', description: 'Brand refresh project', budgetId: 'PROD-2025-Q1', amount: 4000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On delivery', expectedUnits: 1, completedUnits: 0, glCode: '6100-200-5010', glDescription: 'Product - Design Services' }
    ],
    controls: [
      { type: 'BUDGET_HOLDER', status: 'SATISFIED', by: 'M. Chen', at: '2025-01-14T14:15:00Z', proof: '0x8f3a2b1c' },
      { type: 'BUDGET_HOLDER', status: 'SATISFIED', by: 'L. Park', at: '2025-01-14T14:45:00Z', proof: '0x9c4d3e2f', note: 'For PROD-2025-Q1 line item' },
      { type: 'PROCUREMENT_REVIEW', status: 'SATISFIED', by: 'J. Torres', at: '2025-01-14T16:30:00Z', proof: '0x2b1c8f3a' },
      { type: 'THRESHOLD_50K', status: 'NOT_REQUIRED', rule: 'Total amount < $50,000' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-01-14T09:32:00Z', type: 'INITIATED', actor: 'J. Smith', actorType: 'INTERNAL', detail: 'Envelope created from request', data: { totalAmount: 40000 } },
      { id: 'E002', timestamp: '2025-01-14T14:15:00Z', type: 'BUDGET_APPROVED', actor: 'M. Chen', actorType: 'INTERNAL', detail: 'Budget holder approval for MKT-2025-Q1 allocation', data: { budgetId: 'MKT-2025-Q1', amount: 36000 } },
      { id: 'E003', timestamp: '2025-01-14T14:45:00Z', type: 'BUDGET_APPROVED', actor: 'L. Park', actorType: 'INTERNAL', detail: 'Budget holder approval for PROD-2025-Q1 allocation', data: { budgetId: 'PROD-2025-Q1', amount: 4000 } },
      { id: 'E004', timestamp: '2025-01-14T16:30:00Z', type: 'PROCUREMENT_APPROVED', actor: 'J. Torres', actorType: 'INTERNAL', detail: 'Procurement review complete' },
      { id: 'E005', timestamp: '2025-01-15T10:00:00Z', type: 'PO_ISSUED', actor: 'System', actorType: 'SYSTEM', detail: 'PO-4521 issued to vendor', vendorVisible: true, journalEntries: [ { dr: 'Encumbrance', drCode: '1800-100', cr: 'Budgetary Fund Balance', crCode: '3900-100', amount: 36000 }, { dr: 'Encumbrance', drCode: '1800-200', cr: 'Budgetary Fund Balance', crCode: '3900-200', amount: 4000 } ] },
      { id: 'E006', timestamp: '2025-02-01T08:45:00Z', type: 'INVOICE_SUBMITTED', actor: 'Brandworks Creative LLC', actorType: 'VENDOR', detail: 'Invoice INV-BW-2201 submitted', data: { invoiceNumber: 'INV-BW-2201', amount: 12000 }, vendorVisible: true },
      { id: 'E007', timestamp: '2025-02-01T09:00:00Z', type: 'INVOICE_MATCHED', actor: 'System', actorType: 'SYSTEM', detail: 'Three-way match verified', vendorVisible: true },
      { id: 'E008', timestamp: '2025-02-03T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', actorType: 'INTERNAL', detail: 'ACH-88432 executed', data: { paymentRef: 'ACH-88432', amount: 12000 }, vendorVisible: true, journalEntries: [ { dr: 'Marketing - Agency Fees', drCode: '6100-100-5010', cr: 'Cash', crCode: '1000-100', amount: 12000 } ] },
      { id: 'E009', timestamp: '2025-03-01T08:30:00Z', type: 'INVOICE_SUBMITTED', actor: 'Brandworks Creative LLC', actorType: 'VENDOR', detail: 'Invoice INV-BW-2301 submitted', data: { invoiceNumber: 'INV-BW-2301', amount: 12000 }, vendorVisible: true },
      { id: 'E010', timestamp: '2025-03-01T09:15:00Z', type: 'INVOICE_MATCHED', actor: 'System', actorType: 'SYSTEM', detail: 'Three-way match verified', vendorVisible: true },
      { id: 'E011', timestamp: '2025-03-03T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', actorType: 'INTERNAL', detail: 'ACH-91205 executed', data: { paymentRef: 'ACH-91205', amount: 12000 }, vendorVisible: true, journalEntries: [ { dr: 'Marketing - Agency Fees', drCode: '6100-100-5010', cr: 'Cash', crCode: '1000-100', amount: 12000 } ] }
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
    requestedByEmail: 'a.wong@company.com',
    lineItems: [
      { id: 'ENV-002-L1', description: 'Paid social media - Q1', budgetId: 'MKT-2025-Q1', amount: 40000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5020', glDescription: 'Marketing - Digital Advertising' },
      { id: 'ENV-002-L2', description: 'Programmatic display', budgetId: 'MKT-2025-Q1', amount: 25000, fulfillmentType: 'RECURRING', fulfillmentSchedule: 'Monthly', expectedUnits: 3, completedUnits: 2, glCode: '6100-100-5020', glDescription: 'Marketing - Digital Advertising' }
    ],
    controls: [
      { type: 'BUDGET_HOLDER', status: 'SATISFIED', by: 'M. Chen', at: '2025-01-17T11:00:00Z', proof: '0x4e2f1a3b' },
      { type: 'PROCUREMENT_REVIEW', status: 'SATISFIED', by: 'J. Torres', at: '2025-01-17T15:45:00Z', proof: '0x9a3d5c2e' },
      { type: 'THRESHOLD_50K', status: 'SATISFIED', by: 'VP Finance', at: '2025-01-18T09:00:00Z', proof: '0x1f8b4d2a' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-01-17T09:00:00Z', type: 'INITIATED', actor: 'A. Wong', actorType: 'INTERNAL', detail: 'Envelope created', data: { totalAmount: 65000 } },
      { id: 'E002', timestamp: '2025-01-18T10:30:00Z', type: 'PO_ISSUED', actor: 'System', actorType: 'SYSTEM', detail: 'PO-4522 issued', vendorVisible: true },
      { id: 'E003', timestamp: '2025-02-12T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', actorType: 'INTERNAL', detail: 'ACH-89102 executed', data: { amount: 22000 }, vendorVisible: true },
      { id: 'E004', timestamp: '2025-03-07T00:00:00Z', type: 'DISBURSED', actor: 'Treasury', actorType: 'INTERNAL', detail: 'ACH-92341 executed', data: { amount: 24500 }, vendorVisible: true }
    ]
  },
  {
    id: 'ENV-003',
    poNumber: null,
    title: 'Security Audit - Annual',
    vendorId: 'V-003',
    status: 'PENDING_APPROVAL',
    risk: 'HIGH',
    riskNote: 'Awaiting threshold approval',
    createdAt: '2025-03-10T11:00:00Z',
    requestedBy: 'K. Lee',
    requestedByEmail: 'k.lee@company.com',
    lineItems: [
      { id: 'ENV-003-L1', description: 'Penetration testing', budgetId: 'ENG-2025-Q1', amount: 45000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On completion', expectedUnits: 1, completedUnits: 0, glCode: '6100-300-5030', glDescription: 'Engineering - Security Services' },
      { id: 'ENV-003-L2', description: 'Compliance documentation', budgetId: 'ENG-2025-Q1', amount: 30000, fulfillmentType: 'MILESTONE', fulfillmentSchedule: 'On delivery', expectedUnits: 1, completedUnits: 0, glCode: '6100-300-5030', glDescription: 'Engineering - Security Services' }
    ],
    controls: [
      { type: 'BUDGET_HOLDER', status: 'SATISFIED', by: 'S. Patel', at: '2025-03-10T14:00:00Z', proof: '0x8e2c4f1a' },
      { type: 'PROCUREMENT_REVIEW', status: 'PENDING', assignedTo: 'J. Torres', dueBy: '2025-03-12T17:00:00Z' },
      { type: 'THRESHOLD_50K', status: 'PENDING', assignedTo: 'VP Finance', dueBy: '2025-03-13T17:00:00Z' }
    ],
    events: [
      { id: 'E001', timestamp: '2025-03-10T11:00:00Z', type: 'INITIATED', actor: 'K. Lee', actorType: 'INTERNAL', detail: 'Envelope created - urgent security review', data: { totalAmount: 75000 } },
      { id: 'E002', timestamp: '2025-03-10T14:00:00Z', type: 'BUDGET_APPROVED', actor: 'S. Patel', actorType: 'INTERNAL', detail: 'Budget holder approval', data: { budgetId: 'ENG-2025-Q1', amount: 75000 } },
      { id: 'E003', timestamp: '2025-03-10T14:05:00Z', type: 'PENDING_REVIEW', actor: 'System', actorType: 'SYSTEM', detail: 'Routed to Procurement' }
    ]
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (isoString) => new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatDateTime = (isoString) => new Date(isoString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

const calculateEnvelopeTotals = (envelope) => {
  const committed = envelope.lineItems.reduce((sum, li) => sum + li.amount, 0);
  const disbursed = envelope.events.filter(e => e.type === 'DISBURSED').reduce((sum, e) => sum + (e.data?.amount || 0), 0);
  return { committed, disbursed, remaining: committed - disbursed };
};

const calculateBudgetPosition = (budgetId, allEnvelopes) => {
  const budget = budgetAuthorities[budgetId];
  let committed = 0;
  
  allEnvelopes.forEach(env => {
    env.lineItems.forEach(li => {
      if (li.budgetId === budgetId) committed += li.amount;
    });
  });
  
  let disbursed = allEnvelopes.reduce((sum, env) => {
    const envDisbursed = env.events.filter(e => e.type === 'DISBURSED').reduce((s, e) => s + (e.data?.amount || 0), 0);
    const envBudgetShare = env.lineItems.filter(li => li.budgetId === budgetId).reduce((s, li) => s + li.amount, 0);
    const envTotal = env.lineItems.reduce((s, li) => s + li.amount, 0);
    return sum + (envTotal > 0 ? (envDisbursed * envBudgetShare / envTotal) : 0);
  }, 0);
  
  const forecasted = forecasts.filter(f => f.budgetId === budgetId).reduce((sum, f) => sum + f.amount, 0);
  
  return {
    authorized: budget.authorized,
    committed,
    disbursed: Math.round(disbursed),
    forecasted,
    available: budget.authorized - committed,
    availableAfterForecast: budget.authorized - committed - forecasted
  };
};

const generateEnvelopeId = () => `ENV-${String(Math.floor(Math.random() * 9000) + 1000)}`;

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const StatusBadge = ({ status, small }) => {
  const config = {
    'INITIATED': { bg: '#1e1e2e', border: '#4b5563', color: '#9ca3af', label: 'Initiated' },
    'PENDING_APPROVAL': { bg: '#2e1e2e', border: '#9333ea', color: '#c4b5fd', label: 'Pending Approval' },
    'IN_PROGRESS': { bg: '#1a2a2e', border: '#0891b2', color: '#67e8f9', label: 'In Progress' },
    'COMPLETE': { bg: '#1e2e1e', border: '#059669', color: '#6ee7b7', label: 'Complete' }
  }[status] || { bg: '#1e1e2e', border: '#4b5563', color: '#9ca3af', label: status };

  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 8px' : '4px 12px',
      fontSize: small ? '9px' : '10px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '4px',
      color: config.color
    }}>
      {config.label}
    </span>
  );
};

const RiskBadge = ({ risk }) => {
  const config = {
    'NONE': { color: '#059669', bg: 'rgba(5,150,105,0.1)' },
    'LOW': { color: '#0891b2', bg: 'rgba(8,145,178,0.1)' },
    'MEDIUM': { color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
    'HIGH': { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' }
  }[risk];

  return (
    <span style={{ 
      fontSize: '9px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
      backgroundColor: config.bg, color: config.color, textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>
      {risk} RISK
    </span>
  );
};

// ============================================================================
// CREATION FLOW COMPONENTS
// ============================================================================

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = ['Request', 'Line Items', 'Vendor', 'Review', 'Submit'];
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
      {steps.slice(0, totalSteps).map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: isActive ? '#3b82f6' : isComplete ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#fff' : isComplete ? '#93c5fd' : '#6b7280',
                border: `1px solid ${isActive ? '#3b82f6' : isComplete ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`
              }}>
                {isComplete ? '✓' : stepNum}
              </div>
              <span style={{
                fontSize: '11px',
                color: isActive ? '#e2e2e8' : isComplete ? '#93c5fd' : '#6b7280',
                fontWeight: isActive ? '600' : '400'
              }}>
                {step}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: isComplete ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                minWidth: '20px',
                maxWidth: '60px'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const BudgetAvailabilityIndicator = ({ budgetId, requestedAmount, allEnvelopes }) => {
  const position = calculateBudgetPosition(budgetId, allEnvelopes);
  const budget = budgetAuthorities[budgetId];
  const isOverBudget = requestedAmount > position.available;
  const utilizationAfter = ((position.committed + requestedAmount) / position.authorized) * 100;
  
  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: isOverBudget ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)',
      border: `1px solid ${isOverBudget ? 'rgba(220,38,38,0.3)' : 'rgba(5,150,105,0.3)'}`,
      borderRadius: '6px',
      marginTop: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: isOverBudget ? '#fca5a5' : '#6ee7b7', fontWeight: '600' }}>
          {isOverBudget ? '⚠ Exceeds Available Budget' : '✓ Within Budget'}
        </span>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>
          {budget.owner}
        </span>
      </div>
      
      <div style={{ 
        height: '8px', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <div style={{ 
          display: 'flex', 
          height: '100%'
        }}>
          <div style={{ 
            width: `${(position.disbursed / position.authorized) * 100}%`, 
            backgroundColor: '#3b82f6' 
          }} />
          <div style={{ 
            width: `${((position.committed - position.disbursed) / position.authorized) * 100}%`, 
            backgroundColor: '#d97706' 
          }} />
          <div style={{ 
            width: `${(requestedAmount / position.authorized) * 100}%`, 
            backgroundColor: isOverBudget ? '#dc2626' : '#10b981',
            opacity: 0.7
          }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280' }}>
        <span>Available: {formatCurrency(position.available)}</span>
        <span>After: {utilizationAfter.toFixed(0)}% utilized</span>
      </div>
    </div>
  );
};

const LineItemEditor = ({ lineItem, index, onUpdate, onRemove, allEnvelopes }) => {
  const budget = lineItem.budgetId ? budgetAuthorities[lineItem.budgetId] : null;
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>LINE ITEM {index + 1}</span>
        <button
          onClick={() => onRemove(index)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 4px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Description
          </label>
          <input
            type="text"
            value={lineItem.description}
            onChange={(e) => onUpdate(index, { ...lineItem, description: e.target.value })}
            placeholder="What is this line item for?"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '12px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#e2e2e8',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {/* Amount + Budget */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Amount
            </label>
            <input
              type="number"
              value={lineItem.amount || ''}
              onChange={(e) => onUpdate(index, { ...lineItem, amount: parseInt(e.target.value) || 0 })}
              placeholder="0"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Budget Authority
            </label>
            <select
              value={lineItem.budgetId || ''}
              onChange={(e) => onUpdate(index, { ...lineItem, budgetId: e.target.value, glCode: '' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select budget...</option>
              {Object.values(budgetAuthorities).map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* GL Code (if budget selected) */}
        {budget && (
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              GL Code
            </label>
            <select
              value={lineItem.glCode || ''}
              onChange={(e) => {
                const selected = budget.glCodes.find(g => g.code === e.target.value);
                onUpdate(index, { ...lineItem, glCode: e.target.value, glDescription: selected?.description || '' });
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select GL code...</option>
              {budget.glCodes.map(gl => (
                <option key={gl.code} value={gl.code}>{gl.code} - {gl.description}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Fulfillment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Type
            </label>
            <select
              value={lineItem.fulfillmentType || 'MILESTONE'}
              onChange={(e) => onUpdate(index, { ...lineItem, fulfillmentType: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="MILESTONE">Milestone</option>
              <option value="RECURRING">Recurring</option>
              <option value="TIME_MATERIALS">Time & Materials</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Schedule
            </label>
            <input
              type="text"
              value={lineItem.fulfillmentSchedule || ''}
              onChange={(e) => onUpdate(index, { ...lineItem, fulfillmentSchedule: e.target.value })}
              placeholder="e.g., Monthly, On delivery"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Expected Units
            </label>
            <input
              type="number"
              value={lineItem.expectedUnits || ''}
              onChange={(e) => onUpdate(index, { ...lineItem, expectedUnits: parseInt(e.target.value) || 1 })}
              placeholder="1"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#e2e2e8',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
        
        {/* Budget availability indicator */}
        {lineItem.budgetId && lineItem.amount > 0 && (
          <BudgetAvailabilityIndicator 
            budgetId={lineItem.budgetId} 
            requestedAmount={lineItem.amount}
            allEnvelopes={allEnvelopes}
          />
        )}
      </div>
    </div>
  );
};

const ControlRequirementsPreview = ({ lineItems }) => {
  const totalAmount = lineItems.reduce((sum, li) => sum + (li.amount || 0), 0);
  const uniqueBudgets = [...new Set(lineItems.filter(li => li.budgetId).map(li => li.budgetId))];
  const needsThreshold = totalAmount >= 50000;
  
  const controls = [];
  
  // Budget holder approvals
  uniqueBudgets.forEach(budgetId => {
    const budget = budgetAuthorities[budgetId];
    const budgetAmount = lineItems.filter(li => li.budgetId === budgetId).reduce((sum, li) => sum + (li.amount || 0), 0);
    controls.push({
      type: 'BUDGET_HOLDER',
      label: 'Budget Holder Approval',
      detail: `${budget.owner} for ${formatCurrency(budgetAmount)} from ${budget.name}`,
      required: true
    });
  });
  
  // Procurement review
  controls.push({
    type: 'PROCUREMENT_REVIEW',
    label: 'Procurement Review',
    detail: 'Standard procurement review',
    required: true
  });
  
  // Threshold approval
  controls.push({
    type: 'THRESHOLD_50K',
    label: '>$50K Threshold Approval',
    detail: needsThreshold ? `Required - total ${formatCurrency(totalAmount)}` : `Not required - total ${formatCurrency(totalAmount)} < $50K`,
    required: needsThreshold
  });
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '8px'
    }}>
      <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Required Controls
      </div>
      
      {controls.map((control, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          backgroundColor: control.required ? 'rgba(217,119,6,0.1)' : 'rgba(75,85,99,0.1)',
          border: `1px solid ${control.required ? 'rgba(217,119,6,0.3)' : 'rgba(75,85,99,0.3)'}`,
          borderRadius: '6px',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: control.required ? '#fcd34d' : '#6b7280'
          }}>
            {control.required ? '○' : '—'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#e2e2e8', fontWeight: '500' }}>
              {control.label}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
              {control.detail}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// CREATION MODAL
// ============================================================================

const CreateEnvelopeModal = ({ isOpen, onClose, onSubmit, allEnvelopes }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'NORMAL',
    vendorId: '',
    newVendor: { name: '', contact: '', email: '' },
    lineItems: [
      { description: '', amount: 0, budgetId: '', glCode: '', glDescription: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1, completedUnits: 0 }
    ]
  });
  
  const totalAmount = formData.lineItems.reduce((sum, li) => sum + (li.amount || 0), 0);
  const uniqueBudgets = [...new Set(formData.lineItems.filter(li => li.budgetId).map(li => li.budgetId))];
  const isValid = {
    step1: formData.title.length > 0,
    step2: formData.lineItems.length > 0 && formData.lineItems.every(li => li.description && li.amount > 0 && li.budgetId && li.glCode),
    step3: formData.vendorId.length > 0 || (formData.vendorId === 'V-NEW' && formData.newVendor.name),
    step4: true
  };
  
  const handleLineItemUpdate = (index, updatedItem) => {
    const newItems = [...formData.lineItems];
    newItems[index] = updatedItem;
    setFormData({ ...formData, lineItems: newItems });
  };
  
  const handleLineItemRemove = (index) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, lineItems: newItems.length > 0 ? newItems : [{ description: '', amount: 0, budgetId: '', glCode: '', glDescription: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1, completedUnits: 0 }] });
  };
  
  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', amount: 0, budgetId: '', glCode: '', glDescription: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1, completedUnits: 0 }]
    });
  };
  
  const handleSubmit = () => {
    const newEnvelope = {
      id: generateEnvelopeId(),
      poNumber: null,
      title: formData.title,
      vendorId: formData.vendorId === 'V-NEW' ? 'V-NEW-' + Date.now() : formData.vendorId,
      status: 'PENDING_APPROVAL',
      risk: totalAmount >= 50000 ? 'MEDIUM' : 'LOW',
      createdAt: new Date().toISOString(),
      requestedBy: 'Current User',
      requestedByEmail: 'user@company.com',
      lineItems: formData.lineItems.map((li, i) => ({
        ...li,
        id: `${generateEnvelopeId()}-L${i + 1}`
      })),
      controls: [
        ...uniqueBudgets.map(budgetId => ({
          type: 'BUDGET_HOLDER',
          status: 'PENDING',
          assignedTo: budgetAuthorities[budgetId].owner,
          dueBy: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        })),
        { type: 'PROCUREMENT_REVIEW', status: 'PENDING', assignedTo: 'J. Torres', dueBy: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
        totalAmount >= 50000 
          ? { type: 'THRESHOLD_50K', status: 'PENDING', assignedTo: 'VP Finance', dueBy: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() }
          : { type: 'THRESHOLD_50K', status: 'NOT_REQUIRED', rule: 'Total amount < $50,000' }
      ],
      events: [
        {
          id: 'E001',
          timestamp: new Date().toISOString(),
          type: 'INITIATED',
          actor: 'Current User',
          actorType: 'INTERNAL',
          detail: `Envelope created: ${formData.title}`,
          data: { totalAmount }
        }
      ]
    };
    
    onSubmit(newEnvelope);
    onClose();
    setStep(1);
    setFormData({
      title: '',
      description: '',
      urgency: 'NORMAL',
      vendorId: '',
      newVendor: { name: '', contact: '', email: '' },
      lineItems: [{ description: '', amount: 0, budgetId: '', glCode: '', glDescription: '', fulfillmentType: 'MILESTONE', fulfillmentSchedule: '', expectedUnits: 1, completedUnits: 0 }]
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        backgroundColor: '#0c0c10',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
              Create Envelope
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#f8f8fc' }}>
              New Spend Request
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <StepIndicator currentStep={step} totalSteps={5} />
          
          {/* Step 1: Request Basics */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e2e8', marginBottom: '20px' }}>
                What do you need?
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Request Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Q1 Marketing Agency Retainer"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '13px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e2e8',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Description / Business Justification
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Why is this spend needed? What business outcome does it support?"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '13px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e2e8',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Urgency
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['NORMAL', 'HIGH', 'URGENT'].map(urgency => (
                      <button
                        key={urgency}
                        onClick={() => setFormData({ ...formData, urgency })}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '11px',
                          fontWeight: '600',
                          border: '1px solid',
                          borderColor: formData.urgency === urgency 
                            ? urgency === 'URGENT' ? '#dc2626' : urgency === 'HIGH' ? '#d97706' : '#3b82f6'
                            : 'rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          backgroundColor: formData.urgency === urgency 
                            ? urgency === 'URGENT' ? 'rgba(220,38,38,0.2)' : urgency === 'HIGH' ? 'rgba(217,119,6,0.2)' : 'rgba(59,130,246,0.2)'
                            : 'transparent',
                          color: formData.urgency === urgency
                            ? urgency === 'URGENT' ? '#fca5a5' : urgency === 'HIGH' ? '#fcd34d' : '#93c5fd'
                            : '#6b7280',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {urgency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Line Items */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e2e8', marginBottom: '8px' }}>
                What are you buying?
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
                Add line items with budget attribution. Each line item can draw from a different budget.
              </p>
              
              {formData.lineItems.map((li, i) => (
                <LineItemEditor
                  key={i}
                  lineItem={li}
                  index={i}
                  onUpdate={handleLineItemUpdate}
                  onRemove={handleLineItemRemove}
                  allEnvelopes={allEnvelopes}
                />
              ))}
              
              <button
                onClick={addLineItem}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  border: '1px dashed rgba(59,130,246,0.4)',
                  borderRadius: '6px',
                  color: '#93c5fd',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                + Add Line Item
              </button>
              
              {/* Total */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Request</span>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#d97706', fontFeatureSettings: '"tnum"' }}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          )}
          
          {/* Step 3: Vendor */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e2e8', marginBottom: '8px' }}>
                Who is the vendor?
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
                Select an existing vendor or add a new one.
              </p>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {vendorsList.map(vendor => (
                  <div
                    key={vendor.id}
                    onClick={() => setFormData({ ...formData, vendorId: vendor.id })}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: formData.vendorId === vendor.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${formData.vendorId === vendor.id ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {vendor.isPlaceholder ? (
                      <div style={{ fontSize: '12px', color: '#93c5fd', textAlign: 'center' }}>
                        {vendor.name}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e2e8' }}>{vendor.name}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                            {vendor.contact} · {vendor.email}
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                          {vendor.paymentTerms}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* New vendor form */}
              {formData.vendorId === 'V-NEW' && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    New Vendor Details
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input
                      type="text"
                      value={formData.newVendor.name}
                      onChange={(e) => setFormData({ ...formData, newVendor: { ...formData.newVendor, name: e.target.value } })}
                      placeholder="Vendor name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '12px',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#e2e2e8',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        value={formData.newVendor.contact}
                        onChange={(e) => setFormData({ ...formData, newVendor: { ...formData.newVendor, contact: e.target.value } })}
                        placeholder="Contact name"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '12px',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#e2e2e8',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                      <input
                        type="email"
                        value={formData.newVendor.email}
                        onChange={(e) => setFormData({ ...formData, newVendor: { ...formData.newVendor, email: e.target.value } })}
                        placeholder="Contact email"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '12px',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#e2e2e8',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e2e8', marginBottom: '20px' }}>
                Review your request
              </h3>
              
              {/* Summary */}
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#e2e2e8', marginBottom: '4px' }}>
                  {formData.title}
                </div>
                {formData.description && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    {formData.description}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(totalAmount)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Line Items</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#e2e2e8' }}>{formData.lineItems.length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Budgets</div>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#6366f1' }}>{uniqueBudgets.length}</div>
                  </div>
                </div>
                
                {/* Line items summary */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  {formData.lineItems.map((li, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: i < formData.lineItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#e2e2e8' }}>{li.description}</div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                          {budgetAuthorities[li.budgetId]?.name} · {li.glCode}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#d97706' }}>
                        {formatCurrency(li.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Vendor */}
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Vendor
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#e2e2e8' }}>
                  {formData.vendorId === 'V-NEW' ? formData.newVendor.name : vendorsList.find(v => v.id === formData.vendorId)?.name}
                </div>
              </div>
              
              {/* Required controls */}
              <ControlRequirementsPreview lineItems={formData.lineItems} />
            </div>
          )}
          
          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59,130,246,0.2)',
                border: '2px solid #3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '28px'
              }}>
                ◈
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e2e2e8', marginBottom: '8px' }}>
                Ready to Submit
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Your envelope will be created and routed to the required approvers. You'll be notified as each control is satisfied.
              </p>
              
              <div style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                <div style={{ fontSize: '12px', color: '#93c5fd', marginBottom: '4px' }}>Total Request</div>
                <div style={{ fontSize: '28px', fontWeight: '600', color: '#3b82f6', fontFeatureSettings: '"tnum"' }}>
                  {formatCurrency(totalAmount)}
                </div>
              </div>
              
              <div style={{ marginTop: '24px', fontSize: '11px', color: '#6b7280' }}>
                {uniqueBudgets.length} budget{uniqueBudgets.length > 1 ? 's' : ''} · {formData.lineItems.length} line item{formData.lineItems.length > 1 ? 's' : ''} · {totalAmount >= 50000 ? '3' : '2'} required approvals
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            style={{
              padding: '10px 20px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {step > 1 ? '← Back' : 'Cancel'}
          </button>
          
          <button
            onClick={() => step < 5 ? setStep(step + 1) : handleSubmit()}
            disabled={!isValid[`step${step}`]}
            style={{
              padding: '10px 24px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: isValid[`step${step}`] ? '#3b82f6' : 'rgba(59,130,246,0.3)',
              border: 'none',
              borderRadius: '6px',
              color: isValid[`step${step}`] ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: isValid[`step${step}`] ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit'
            }}
          >
            {step < 5 ? 'Continue →' : 'Create Envelope'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD (simplified for this file)
// ============================================================================

const EnvelopeCoordinationSystem = () => {
  const [envelopes, setEnvelopes] = useState(initialEnvelopes);
  const [selectedEnvelope, setSelectedEnvelope] = useState(envelopes[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateEnvelope = (newEnvelope) => {
    setEnvelopes([newEnvelope, ...envelopes]);
    setSelectedEnvelope(newEnvelope);
  };

  const vendor = vendorsList.find(v => v.id === selectedEnvelope.vendorId) || { name: 'Unknown Vendor' };
  const totals = calculateEnvelopeTotals(selectedEnvelope);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#06060a',
      color: '#e2e2e8',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '12px'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.01)'
      }}>
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '2px' }}>
            Sightline
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: '#f8f8fc' }}>
            Envelope Coordination System
          </h1>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span>
          New Envelope
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', minHeight: 'calc(100vh - 65px)' }}>
        {/* Envelope List */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
              Envelopes
            </div>
            <div style={{ fontSize: '24px', fontWeight: '300', color: '#e2e2e8' }}>
              {envelopes.length}
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                ({envelopes.filter(e => e.status === 'PENDING_APPROVAL').length} pending)
              </span>
            </div>
          </div>
          
          {envelopes.map(envelope => {
            const envTotals = calculateEnvelopeTotals(envelope);
            const isSelected = selectedEnvelope.id === envelope.id;
            
            return (
              <div
                key={envelope.id}
                onClick={() => setSelectedEnvelope(envelope)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(59,130,246,0.08)' : 'transparent',
                  borderLeft: isSelected ? '2px solid #3b82f6' : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1, marginRight: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#e2e2e8', marginBottom: '2px' }}>
                      {envelope.title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      {envelope.poNumber || 'PO Pending'} · {envelope.lineItems.length} line items
                    </div>
                  </div>
                  <RiskBadge risk={envelope.risk} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <StatusBadge status={envelope.status} small />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#d97706' }}>
                    {formatCurrency(envTotals.committed)}
                  </span>
                </div>
                
                <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${envTotals.committed > 0 ? (envTotals.disbursed / envTotals.committed) * 100 : 0}%`, 
                    height: '100%', 
                    backgroundColor: '#3b82f6' 
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail View */}
        <div style={{ overflowY: 'auto' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px', marginBottom: '4px' }}>
                  {selectedEnvelope.id} · {selectedEnvelope.poNumber || 'PO PENDING'}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#f8f8fc' }}>
                  {selectedEnvelope.title}
                </h2>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                  {vendor.name} · Requested by {selectedEnvelope.requestedBy}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <StatusBadge status={selectedEnvelope.status} />
                <RiskBadge risk={selectedEnvelope.risk} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Committed</div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#d97706' }}>{formatCurrency(totals.committed)}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Disbursed</div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#3b82f6' }}>{formatCurrency(totals.disbursed)}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Remaining</div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#9ca3af' }}>{formatCurrency(totals.remaining)}</div>
              </div>
            </div>
          </div>
          
          {/* Line Items */}
          <div style={{ padding: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>
              Line Items
            </div>
            
            {selectedEnvelope.lineItems.map((li, i) => (
              <div key={li.id} style={{
                padding: '14px 16px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#e2e2e8', marginBottom: '4px' }}>{li.description}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      {budgetAuthorities[li.budgetId]?.name} · {li.glCode} · {li.fulfillmentType}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(li.amount)}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{li.completedUnits}/{li.expectedUnits} complete</div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Controls */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>
                Controls
              </div>
              
              {selectedEnvelope.controls.map((control, i) => {
                const statusConfig = {
                  'SATISFIED': { bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.3)', color: '#6ee7b7', symbol: '✓' },
                  'PENDING': { bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.3)', color: '#fcd34d', symbol: '○' },
                  'NOT_REQUIRED': { bg: 'rgba(75,85,99,0.1)', border: 'rgba(75,85,99,0.3)', color: '#9ca3af', symbol: '—' }
                }[control.status];
                
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    backgroundColor: statusConfig.bg,
                    border: `1px solid ${statusConfig.border}`,
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: statusConfig.color, fontSize: '12px', fontWeight: '600' }}>{statusConfig.symbol}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#e2e2e8', fontWeight: '500' }}>
                        {control.type.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                        {control.status === 'SATISFIED' && `${control.by} · ${formatDateTime(control.at)}`}
                        {control.status === 'PENDING' && `Assigned: ${control.assignedTo}`}
                        {control.status === 'NOT_REQUIRED' && control.rule}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Events */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>
                Event Chain · {selectedEnvelope.events.length} Events
              </div>
              
              {selectedEnvelope.events.map((event, i) => (
                <div key={event.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: event.type === 'DISBURSED' ? '#3b82f6' : event.type === 'INITIATED' ? '#6b7280' : '#10b981',
                    marginTop: '4px',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>
                      {formatDateTime(event.timestamp)} · {event.actor}
                    </div>
                    <div style={{ fontSize: '12px', color: '#e2e2e8' }}>{event.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Modal */}
      <CreateEnvelopeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEnvelope}
        allEnvelopes={envelopes}
      />
    </div>
  );
};

export default EnvelopeCoordinationSystem;
