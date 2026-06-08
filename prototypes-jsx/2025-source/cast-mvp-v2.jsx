import React, { useState } from 'react';

// CAST MVP - Transaction Surface + Payment Control
// Updated: Shared commitment state, private operational details per party

const STAGES = {
  DRAFT: 'draft',
  FUNDED: 'funded', 
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  DISPUTED: 'disputed',
  RELEASED: 'released'
};

const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const formatDate = (date) => 
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + 
         ' · ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Event descriptions vary by viewer role
const getEventDescription = (event, viewerRole) => {
  const descriptions = {
    commitment_created: {
      buyer: 'You created this commitment',
      seller: 'Buyer created this commitment'
    },
    commitment_funded: {
      buyer: 'You funded escrow',
      seller: 'Escrow funded by buyer'
    },
    commitment_accepted: {
      buyer: 'Seller accepted terms',
      seller: 'You accepted terms'
    },
    delivery_confirmed: {
      buyer: 'Seller marked delivery complete',
      seller: 'You marked delivery complete'
    },
    payment_released: {
      buyer: 'Payment released to seller',
      seller: 'Payment released to you'
    },
    dispute_opened: {
      buyer: 'You opened a dispute',
      seller: 'Buyer opened a dispute'
    }
  };
  
  return descriptions[event.type]?.[viewerRole] || event.description;
};

// Event log entry component
const EventEntry = ({ event, viewerRole }) => {
  const icons = {
    commitment_created: '◯',
    commitment_funded: '●',
    commitment_accepted: '◐',
    delivery_confirmed: '◑',
    payment_released: '◉',
    dispute_opened: '⊘'
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(63, 63, 70, 0.3)'
    }}>
      <span style={{ color: '#fbbf24', fontSize: '16px', marginTop: '2px' }}>
        {icons[event.type] || '○'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#e4e4e7', fontSize: '13px' }}>
          {getEventDescription(event, viewerRole)}
        </div>
        <div style={{ color: '#52525b', fontSize: '11px', marginTop: '4px', fontFamily: 'monospace' }}>
          {formatTime(event.timestamp)}
        </div>
      </div>
      <div style={{ 
        color: '#3f3f46', 
        fontSize: '10px', 
        fontFamily: 'monospace',
        padding: '2px 6px',
        backgroundColor: '#18181b',
        borderRadius: '3px'
      }}>
        {event.hash?.slice(0, 8)}
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ stage }) => {
  const configs = {
    [STAGES.DRAFT]: { bg: '#27272a', color: '#a1a1aa', border: 'none' },
    [STAGES.FUNDED]: { bg: 'rgba(120, 53, 15, 0.5)', color: '#fbbf24', border: '1px solid #92400e' },
    [STAGES.ACCEPTED]: { bg: 'rgba(6, 78, 59, 0.5)', color: '#34d399', border: '1px solid #065f46' },
    [STAGES.DELIVERED]: { bg: 'rgba(30, 58, 138, 0.5)', color: '#60a5fa', border: '1px solid #1e40af' },
    [STAGES.DISPUTED]: { bg: 'rgba(127, 29, 29, 0.5)', color: '#f87171', border: '1px solid #991b1b' },
    [STAGES.RELEASED]: { bg: 'rgba(39, 39, 42, 0.8)', color: '#a1a1aa', border: '1px solid #3f3f46' }
  };
  
  const labels = {
    [STAGES.DRAFT]: 'Draft',
    [STAGES.FUNDED]: 'Funded · Awaiting Seller',
    [STAGES.ACCEPTED]: 'Active',
    [STAGES.DELIVERED]: 'Pending Release',
    [STAGES.DISPUTED]: 'Disputed',
    [STAGES.RELEASED]: 'Complete'
  };
  
  const config = configs[stage];
  
  return (
    <span style={{
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      backgroundColor: config.bg,
      color: config.color,
      border: config.border
    }}>
      {labels[stage]}
    </span>
  );
};

// Shared terms section - identical for both parties
const SharedTerms = ({ commitment }) => {
  const labelStyle = {
    color: '#71717a',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px'
  };
  
  return (
    <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div style={labelStyle}>Resource</div>
          <div style={{ color: '#e4e4e7', fontSize: '15px' }}>{commitment.resource}</div>
        </div>
        <div>
          <div style={labelStyle}>Quantity</div>
          <div style={{ color: '#e4e4e7', fontSize: '15px' }}>{commitment.quantity}</div>
        </div>
        <div>
          <div style={labelStyle}>Delivery By</div>
          <div style={{ color: '#e4e4e7', fontSize: '15px' }}>{formatDate(commitment.deliveryDate)}</div>
        </div>
        <div>
          <div style={labelStyle}>Commitment Value</div>
          <div style={{ color: '#fbbf24', fontSize: '15px', fontWeight: 500 }}>
            {formatCurrency(commitment.amount)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Parties section - shows identities but NOT operational details of counterparty
const PartiesSection = ({ commitment, viewerRole }) => {
  const labelStyle = {
    color: '#71717a',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  };
  
  const isBuyer = viewerRole === 'buyer';
  
  return (
    <div style={{ padding: '24px', borderBottom: '1px solid #27272a', backgroundColor: 'rgba(24, 24, 27, 0.5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Buyer info */}
        <div>
          <div style={labelStyle}>Buyer {isBuyer && <span style={{ color: '#fbbf24' }}>(You)</span>}</div>
          <div style={{ color: '#d4d4d8', fontSize: '14px' }}>{commitment.buyer}</div>
          {isBuyer ? (
            // Buyer sees their own funding source
            <div style={{ 
              marginTop: '8px', 
              padding: '8px 10px', 
              backgroundColor: '#27272a', 
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#71717a', marginBottom: '4px' }}>Funding source</div>
              <div style={{ color: '#a1a1aa', fontFamily: 'monospace' }}>
                Chase ····4521
              </div>
            </div>
          ) : (
            // Seller just sees verification status
            <div style={{ marginTop: '8px', color: '#52525b', fontSize: '12px' }}>
              ✓ Identity verified
            </div>
          )}
        </div>
        
        {/* Seller info */}
        <div>
          <div style={labelStyle}>Seller {!isBuyer && <span style={{ color: '#fbbf24' }}>(You)</span>}</div>
          <div style={{ color: '#d4d4d8', fontSize: '14px' }}>{commitment.seller || '—'}</div>
          {!isBuyer && commitment.seller ? (
            // Seller sees their own payout destination
            <div style={{ 
              marginTop: '8px', 
              padding: '8px 10px', 
              backgroundColor: '#27272a', 
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#71717a', marginBottom: '4px' }}>Payout destination</div>
              <div style={{ color: '#a1a1aa', fontFamily: 'monospace' }}>
                Mercury ····8834
              </div>
            </div>
          ) : commitment.seller ? (
            // Buyer just sees verification status
            <div style={{ marginTop: '8px', color: '#52525b', fontSize: '12px' }}>
              ✓ Identity verified
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Escrow status - shared view with role-specific messaging
const EscrowStatus = ({ commitment, viewerRole }) => {
  const isBuyer = viewerRole === 'buyer';
  
  const getMessage = () => {
    switch(commitment.stage) {
      case STAGES.FUNDED:
        return isBuyer 
          ? 'Funds held until seller accepts and delivers'
          : 'Funds secured · Accept to begin delivery';
      case STAGES.ACCEPTED:
        return isBuyer
          ? 'Funds held until delivery confirmed'
          : 'Funds held · Mark delivered when complete';
      case STAGES.DELIVERED:
        return isBuyer
          ? 'Confirm to release payment or open dispute'
          : 'Awaiting buyer confirmation · Auto-release in 48h';
      case STAGES.RELEASED:
        return isBuyer
          ? 'Payment complete'
          : 'Payment received';
      case STAGES.DISPUTED:
        return 'Funds held pending resolution';
      default:
        return '';
    }
  };
  
  return (
    <div style={{ padding: '24px', borderBottom: '1px solid #27272a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ 
            color: '#71717a', 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '6px' 
          }}>
            Escrow
          </div>
          <div style={{ color: '#e4e4e7', fontSize: '24px', fontWeight: 500 }}>
            {commitment.stage === STAGES.DRAFT ? '—' : formatCurrency(commitment.amount)}
          </div>
        </div>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#18181b',
          borderRadius: '4px',
          border: '1px solid #27272a'
        }}>
          <div style={{ color: '#52525b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px' }}>
            Held by
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '13px', fontFamily: 'monospace' }}>
            CAST Escrow
          </div>
        </div>
      </div>
      
      {/* Status message */}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#0c0c0d', 
        borderRadius: '4px',
        color: '#71717a',
        fontSize: '13px'
      }}>
        {getMessage()}
      </div>
      
      {/* Progress bar */}
      <div style={{
        marginTop: '16px',
        height: '3px',
        backgroundColor: '#27272a',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: commitment.stage === STAGES.RELEASED 
            ? '#22c55e'
            : commitment.stage === STAGES.DISPUTED
            ? '#ef4444'
            : 'linear-gradient(to right, #f59e0b, #fbbf24)',
          transition: 'width 0.5s ease',
          width: commitment.stage === STAGES.RELEASED ? '100%' : 
                 commitment.stage === STAGES.DELIVERED ? '75%' :
                 commitment.stage === STAGES.ACCEPTED ? '50%' :
                 commitment.stage === STAGES.FUNDED ? '25%' : '0%'
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
        fontSize: '11px',
        color: '#3f3f46'
      }}>
        <span style={{ color: commitment.stage !== STAGES.DRAFT ? '#71717a' : undefined }}>Funded</span>
        <span style={{ color: [STAGES.ACCEPTED, STAGES.DELIVERED, STAGES.RELEASED].includes(commitment.stage) ? '#71717a' : undefined }}>Accepted</span>
        <span style={{ color: [STAGES.DELIVERED, STAGES.RELEASED].includes(commitment.stage) ? '#71717a' : undefined }}>Delivered</span>
        <span style={{ color: commitment.stage === STAGES.RELEASED ? '#71717a' : undefined }}>Released</span>
      </div>
    </div>
  );
};

// Main commitment card
const CommitmentCard = ({ commitment, onAction, userRole }) => {
  const canAccept = userRole === 'seller' && commitment.stage === STAGES.FUNDED;
  const canDeliver = userRole === 'seller' && commitment.stage === STAGES.ACCEPTED;
  const canConfirm = userRole === 'buyer' && commitment.stage === STAGES.DELIVERED;
  const canDispute = userRole === 'buyer' && commitment.stage === STAGES.DELIVERED;
  
  return (
    <div style={{
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid #27272a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ 
            color: '#52525b', 
            fontSize: '11px', 
            fontFamily: 'monospace',
            marginBottom: '8px' 
          }}>
            {commitment.id}
          </div>
          <h2 style={{ fontSize: '20px', color: '#f4f4f5', fontWeight: 500, margin: 0 }}>
            {commitment.title}
          </h2>
        </div>
        <StatusBadge stage={commitment.stage} />
      </div>
      
      {/* Shared terms - identical for both */}
      <SharedTerms commitment={commitment} />
      
      {/* Parties - role-aware, hides counterparty operational details */}
      <PartiesSection commitment={commitment} viewerRole={userRole} />
      
      {/* Escrow - shared status, role-specific messaging */}
      <EscrowStatus commitment={commitment} viewerRole={userRole} />
      
      {/* Actions */}
      {(canAccept || canDeliver || canConfirm || canDispute) && (
        <div style={{ padding: '24px', backgroundColor: 'rgba(9, 9, 11, 0.5)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {canAccept && (
              <button 
                onClick={() => onAction('accept')}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Accept Commitment
              </button>
            )}
            {canDeliver && (
              <button 
                onClick={() => onAction('deliver')}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Mark Delivered
              </button>
            )}
            {canConfirm && (
              <button 
                onClick={() => onAction('confirm')}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  backgroundColor: '#d97706',
                  color: 'white',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Confirm & Release Payment
              </button>
            )}
            {canDispute && (
              <button 
                onClick={() => onAction('dispute')}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#27272a',
                  color: '#d4d4d8',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Open Dispute
              </button>
            )}
          </div>
          {commitment.stage === STAGES.DELIVERED && userRole === 'buyer' && (
            <div style={{ marginTop: '12px', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
              Auto-release in 47:23:15 if no dispute
            </div>
          )}
        </div>
      )}
      
      {/* Completion state */}
      {commitment.stage === STAGES.RELEASED && (
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>
            ✓ Commitment Complete
          </div>
          <div style={{ color: '#52525b', fontSize: '12px', marginTop: '4px' }}>
            {formatCurrency(commitment.amount)} released to seller
          </div>
        </div>
      )}
    </div>
  );
};

// Create commitment form
const CreateCommitmentForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: 'H100 Compute Block',
    resource: 'NVIDIA H100 80GB',
    quantity: '1,000 GPU-hours',
    amount: 2500,
    deliveryDate: '2025-01-15',
    seller: ''
  });
  
  const inputStyle = {
    width: '100%',
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#e4e4e7',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };
  
  const labelStyle = {
    display: 'block',
    color: '#a1a1aa',
    fontSize: '14px',
    marginBottom: '8px'
  };
  
  return (
    <div style={{
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '24px'
    }}>
      <h2 style={{ fontSize: '18px', color: '#f4f4f5', fontWeight: 500, margin: '0 0 24px 0' }}>
        New Commitment
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            style={inputStyle}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Resource Type</label>
            <select
              value={form.resource}
              onChange={e => setForm({...form, resource: e.target.value})}
              style={inputStyle}
            >
              <option>NVIDIA H100 80GB</option>
              <option>NVIDIA A100 80GB</option>
              <option>NVIDIA H200</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quantity</label>
            <input
              type="text"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Total Amount (USD)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm({...form, amount: parseInt(e.target.value)})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Deliver By</label>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={e => setForm({...form, deliveryDate: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        
        <div>
          <label style={labelStyle}>Seller Email (optional)</label>
          <input
            type="email"
            value={form.seller}
            onChange={e => setForm({...form, seller: e.target.value})}
            placeholder="seller@gpuprovider.com"
            style={{...inputStyle, color: form.seller ? '#e4e4e7' : '#52525b'}}
          />
        </div>
        
        <div style={{ paddingTop: '16px', borderTop: '1px solid #27272a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#a1a1aa' }}>Amount to escrow</span>
            <span style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 500 }}>
              {formatCurrency(form.amount)}
            </span>
          </div>
          <button
            onClick={() => onSubmit(form)}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#d97706',
              color: 'white',
              fontWeight: 500,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Create & Fund Commitment
          </button>
        </div>
      </div>
    </div>
  );
};

// Event ledger panel - now role-aware
const EventLedger = ({ events, viewerRole }) => (
  <div style={{
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '8px'
  }}>
    <div style={{
      padding: '16px',
      borderBottom: '1px solid #27272a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h3 style={{ margin: 0, color: '#d4d4d8', fontWeight: 500, fontSize: '14px' }}>Event Ledger</h3>
      <span style={{ color: '#52525b', fontSize: '11px', fontFamily: 'monospace' }}>
        {events.length} events
      </span>
    </div>
    <div style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
      {events.length === 0 ? (
        <div style={{ color: '#52525b', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
          No events yet
        </div>
      ) : (
        events.map((event, i) => (
          <EventEntry key={i} event={event} viewerRole={viewerRole} />
        ))
      )}
    </div>
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid #27272a',
      backgroundColor: '#0c0c0d'
    }}>
      <div style={{ color: '#3f3f46', fontSize: '11px', textAlign: 'center' }}>
        Events are cryptographically signed and immutable
      </div>
    </div>
  </div>
);

// Share link component
const ShareLink = ({ commitmentId }) => {
  const [copied, setCopied] = useState(false);
  const link = `cast.finance/c/${commitmentId}`;
  
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div style={{
      backgroundColor: '#18181b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <div style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
        Share with seller
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{
          flex: 1,
          backgroundColor: '#27272a',
          borderRadius: '4px',
          padding: '10px 12px',
          color: '#d4d4d8',
          fontSize: '13px',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {link}
        </div>
        <button
          onClick={copy}
          style={{
            padding: '10px 16px',
            backgroundColor: copied ? '#059669' : '#3f3f46',
            color: '#e4e4e7',
            fontSize: '13px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div style={{ color: '#52525b', fontSize: '12px', marginTop: '12px' }}>
        Seller can view terms and accept without signing up first
      </div>
    </div>
  );
};

// Role indicator
const RoleIndicator = ({ role }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: role === 'buyer' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(96, 165, 250, 0.1)',
    border: `1px solid ${role === 'buyer' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(96, 165, 250, 0.3)'}`,
    borderRadius: '4px',
    fontSize: '12px',
    color: role === 'buyer' ? '#fbbf24' : '#60a5fa'
  }}>
    <span style={{ 
      width: '6px', 
      height: '6px', 
      borderRadius: '50%', 
      backgroundColor: role === 'buyer' ? '#fbbf24' : '#60a5fa' 
    }} />
    Viewing as {role}
  </div>
);

// Main app
export default function CastMVP() {
  const [view, setView] = useState('create');
  const [commitment, setCommitment] = useState(null);
  const [events, setEvents] = useState([]);
  
  const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const addEvent = (type) => {
    setEvents(prev => [{
      type,
      timestamp: new Date().toISOString(),
      hash: generateHash()
    }, ...prev]);
  };
  
  const handleCreate = (form) => {
    const newCommitment = {
      id: generateHash().slice(0, 8).toUpperCase(),
      ...form,
      stage: STAGES.FUNDED,
      buyer: 'you@company.com',
      seller: form.seller || null,
      createdAt: new Date().toISOString()
    };
    
    setCommitment(newCommitment);
    addEvent('commitment_created');
    addEvent('commitment_funded');
    setView('buyer');
  };
  
  const handleAction = (action) => {
    if (action === 'accept') {
      setCommitment(prev => ({
        ...prev,
        stage: STAGES.ACCEPTED,
        seller: 'seller@gpuprovider.com'
      }));
      addEvent('commitment_accepted');
    }
    
    if (action === 'deliver') {
      setCommitment(prev => ({ ...prev, stage: STAGES.DELIVERED }));
      addEvent('delivery_confirmed');
    }
    
    if (action === 'confirm') {
      setCommitment(prev => ({ ...prev, stage: STAGES.RELEASED }));
      addEvent('payment_released');
    }
    
    if (action === 'dispute') {
      setCommitment(prev => ({ ...prev, stage: STAGES.DISPUTED }));
      addEvent('dispute_opened');
    }
  };
  
  const tabStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: active ? '#27272a' : 'transparent',
    color: active ? '#f4f4f5' : '#71717a',
    transition: 'all 0.15s'
  });
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '60px'
    }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #27272a' }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#18181b', fontWeight: 'bold', fontSize: '14px' }}>C</span>
            </div>
            <span style={{ color: '#f4f4f5', fontWeight: 600, letterSpacing: '-0.01em' }}>CAST</span>
          </div>
          
          {commitment && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <RoleIndicator role={view} />
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#18181b', padding: '4px', borderRadius: '6px' }}>
                <button onClick={() => setView('buyer')} style={tabStyle(view === 'buyer')}>
                  Buyer
                </button>
                <button onClick={() => setView('seller')} style={tabStyle(view === 'seller')}>
                  Seller
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main */}
      <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px 24px' }}>
        {view === 'create' ? (
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', color: '#f4f4f5', fontWeight: 500, margin: '0 0 8px 0' }}>
                Create a Commitment
              </h1>
              <p style={{ color: '#71717a', margin: 0 }}>
                Define terms, fund escrow, share with seller
              </p>
            </div>
            <CreateCommitmentForm onSubmit={handleCreate} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <CommitmentCard 
                commitment={commitment}
                onAction={handleAction}
                userRole={view}
              />
              {view === 'buyer' && commitment?.stage === STAGES.FUNDED && !commitment.seller && (
                <ShareLink commitmentId={commitment.id} />
              )}
            </div>
            <div>
              <EventLedger events={events} viewerRole={view} />
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #27272a',
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#52525b'
        }}>
          <span>Shared terms · Private operational details · Immutable event ledger</span>
          <span>Toggle buyer/seller to see role-specific views</span>
        </div>
      </footer>
    </div>
  );
}
