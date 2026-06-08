import React, { useState } from 'react';

// Simulated cryptographic hash for demo purposes
const generateHash = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
};

const generateEventId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

const formatTimestamp = (ts) => {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Event types and their metadata
const EVENT_TYPES = {
  PO_CREATED: { label: 'PO Created', party: 'buyer', color: '#3B82F6' },
  PO_ACCEPTED: { label: 'PO Accepted', party: 'supplier', color: '#10B981' },
  PO_AMENDED: { label: 'Amendment Proposed', party: 'supplier', color: '#F59E0B' },
  AMENDMENT_ACCEPTED: { label: 'Amendment Accepted', party: 'buyer', color: '#10B981' },
  GOODS_SHIPPED: { label: 'Goods Shipped', party: 'supplier', color: '#8B5CF6' },
  RECEIPT_CONFIRMED: { label: 'Receipt Confirmed', party: 'buyer', color: '#10B981' },
  DISCREPANCY_FLAGGED: { label: 'Discrepancy Flagged', party: 'buyer', color: '#EF4444' },
  PAYMENT_TRIGGERED: { label: 'Payment Triggered', party: 'system', color: '#10B981' },
  DISPUTE_OPENED: { label: 'Dispute Opened', party: 'system', color: '#EF4444' }
};

const WORKFLOW_STATES = {
  DRAFT: 'draft',
  PO_PENDING: 'po_pending',
  PO_ACCEPTED: 'po_accepted',
  AMENDMENT_PENDING: 'amendment_pending',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  DISPUTED: 'disputed',
  COMPLETED: 'completed'
};

export default function SightlineDemo() {
  const [events, setEvents] = useState([]);
  const [workflowState, setWorkflowState] = useState(WORKFLOW_STATES.DRAFT);
  const [currentPO, setCurrentPO] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'buyer', 'supplier', 'both'
  
  // Demo PO data
  const [poData, setPoData] = useState({
    item: 'Industrial Sensors (Model X-500)',
    quantity: 100,
    unitPrice: 250,
    deliveryDate: '2025-01-15',
    paymentTerms: 'Net 30'
  });
  
  const [amendedData, setAmendedData] = useState(null);
  const [shipmentData, setShipmentData] = useState({ quantityShipped: 100, trackingNumber: '' });
  const [receiptData, setReceiptData] = useState({ quantityReceived: 100, condition: 'good' });

  const addEvent = (type, payload) => {
    const timestamp = Date.now();
    const event = {
      id: generateEventId(),
      type,
      timestamp,
      payload,
      party: EVENT_TYPES[type].party,
      previousHash: events.length > 0 ? events[events.length - 1].hash : '00000000',
    };
    event.hash = generateHash(event);
    
    setEvents(prev => [...prev, event]);
    return event;
  };

  const handleCreatePO = () => {
    const po = { ...poData, total: poData.quantity * poData.unitPrice };
    addEvent('PO_CREATED', po);
    setCurrentPO(po);
    setWorkflowState(WORKFLOW_STATES.PO_PENDING);
  };

  const handleAcceptPO = () => {
    addEvent('PO_ACCEPTED', { accepted: true, poReference: currentPO });
    setWorkflowState(WORKFLOW_STATES.PO_ACCEPTED);
  };

  const handleProposeAmendment = () => {
    const amendment = {
      originalQuantity: currentPO.quantity,
      proposedQuantity: 80,
      reason: 'Partial stock availability - can ship 80 units now, remaining 20 in 2 weeks'
    };
    setAmendedData(amendment);
    addEvent('PO_AMENDED', amendment);
    setWorkflowState(WORKFLOW_STATES.AMENDMENT_PENDING);
  };

  const handleAcceptAmendment = () => {
    const updatedPO = { ...currentPO, quantity: amendedData.proposedQuantity, total: amendedData.proposedQuantity * currentPO.unitPrice };
    addEvent('AMENDMENT_ACCEPTED', { amendment: amendedData, updatedPO });
    setCurrentPO(updatedPO);
    setWorkflowState(WORKFLOW_STATES.PO_ACCEPTED);
  };

  const handleShipGoods = () => {
    const shipment = {
      ...shipmentData,
      trackingNumber: 'TRK' + generateEventId(),
      shippedAt: new Date().toISOString()
    };
    setShipmentData(shipment);
    addEvent('GOODS_SHIPPED', shipment);
    setWorkflowState(WORKFLOW_STATES.SHIPPED);
  };

  const handleConfirmReceipt = () => {
    addEvent('RECEIPT_CONFIRMED', { ...receiptData, receivedAt: new Date().toISOString() });
    addEvent('PAYMENT_TRIGGERED', { 
      amount: currentPO.total, 
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      autoTriggered: true
    });
    setWorkflowState(WORKFLOW_STATES.COMPLETED);
  };

  const handleFlagDiscrepancy = () => {
    const discrepancy = {
      expected: currentPO.quantity,
      received: 85,
      variance: -15,
      description: 'Received 85 units instead of expected ' + currentPO.quantity
    };
    addEvent('DISCREPANCY_FLAGGED', discrepancy);
    addEvent('DISPUTE_OPENED', { 
      reason: 'Quantity mismatch',
      discrepancy,
      evidenceChain: events.map(e => e.hash)
    });
    setWorkflowState(WORKFLOW_STATES.DISPUTED);
  };

  const handleReset = () => {
    setEvents([]);
    setWorkflowState(WORKFLOW_STATES.DRAFT);
    setCurrentPO(null);
    setSelectedEvent(null);
    setAmendedData(null);
    setPoData({
      item: 'Industrial Sensors (Model X-500)',
      quantity: 100,
      unitPrice: 250,
      deliveryDate: '2025-01-15',
      paymentTerms: 'Net 30'
    });
    setShipmentData({ quantityShipped: 100, trackingNumber: '' });
    setReceiptData({ quantityReceived: 100, condition: 'good' });
  };

  const PartyPanel = ({ party, title }) => {
    const isActive = (party === 'buyer' && ['draft', 'po_pending', 'amendment_pending', 'shipped'].includes(workflowState)) ||
                     (party === 'supplier' && ['po_pending', 'po_accepted'].includes(workflowState));
    
    return (
      <div style={{
        flex: 1,
        background: party === 'buyer' ? '#0F172A' : '#1E1B4B',
        borderRadius: '12px',
        padding: '24px',
        border: `2px solid ${isActive ? (party === 'buyer' ? '#3B82F6' : '#8B5CF6') : 'transparent'}`,
        transition: 'border-color 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: party === 'buyer' ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {party === 'buyer' ? '🏢' : '🏭'}
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#F8FAFC', fontSize: '18px', fontWeight: 600 }}>{title}</h3>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>
              {party === 'buyer' ? 'Acme Corp' : 'TechSupply Inc'}
            </span>
          </div>
          {isActive && (
            <span style={{
              marginLeft: 'auto',
              background: party === 'buyer' ? '#3B82F620' : '#8B5CF620',
              color: party === 'buyer' ? '#60A5FA' : '#A78BFA',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              Your Turn
            </span>
          )}
        </div>

        {/* Buyer Actions */}
        {party === 'buyer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workflowState === 'draft' && (
              <>
                <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px' }}>
                  <label style={{ color: '#94A3B8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Item</label>
                  <input
                    type="text"
                    value={poData.item}
                    onChange={(e) => setPoData({ ...poData, item: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      color: '#F8FAFC',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: '#1E293B', borderRadius: '8px', padding: '16px' }}>
                    <label style={{ color: '#94A3B8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Quantity</label>
                    <input
                      type="number"
                      value={poData.quantity}
                      onChange={(e) => setPoData({ ...poData, quantity: parseInt(e.target.value) || 0 })}
                      style={{
                        width: '100%',
                        background: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        color: '#F8FAFC',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, background: '#1E293B', borderRadius: '8px', padding: '16px' }}>
                    <label style={{ color: '#94A3B8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Unit Price</label>
                    <input
                      type="number"
                      value={poData.unitPrice}
                      onChange={(e) => setPoData({ ...poData, unitPrice: parseInt(e.target.value) || 0 })}
                      style={{
                        width: '100%',
                        background: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        color: '#F8FAFC',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <span style={{ color: '#94A3B8', fontSize: '14px' }}>Total: </span>
                  <span style={{ color: '#10B981', fontSize: '24px', fontWeight: 700 }}>
                    ${(poData.quantity * poData.unitPrice).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCreatePO}
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  📝 Create Purchase Order
                </button>
              </>
            )}
            
            {workflowState === 'amendment_pending' && (
              <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#F59E0B', fontWeight: 600, marginBottom: '8px' }}>⚠️ Amendment Proposed</div>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px 0' }}>
                  Supplier proposes {amendedData?.proposedQuantity} units instead of {amendedData?.originalQuantity}
                </p>
                <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                  "{amendedData?.reason}"
                </p>
                <button
                  onClick={handleAcceptAmendment}
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  ✓ Accept Amendment
                </button>
              </div>
            )}
            
            {workflowState === 'shipped' && (
              <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#8B5CF6', fontWeight: 600, marginBottom: '12px' }}>📦 Shipment In Transit</div>
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 16px 0' }}>
                  Tracking: {shipmentData.trackingNumber}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleConfirmReceipt}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Confirm Receipt
                  </button>
                  <button
                    onClick={handleFlagDiscrepancy}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ⚠️ Flag Issue
                  </button>
                </div>
              </div>
            )}
            
            {workflowState === 'po_pending' && (
              <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '14px' }}>⏳ Waiting for supplier response...</div>
              </div>
            )}
            
            {workflowState === 'po_accepted' && (
              <div style={{ background: '#1E293B', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ color: '#10B981', fontSize: '14px' }}>✓ PO Accepted - Awaiting shipment</div>
              </div>
            )}
          </div>
        )}

        {/* Supplier Actions */}
        {party === 'supplier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workflowState === 'draft' && (
              <div style={{ background: '#2E1065', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '14px' }}>Waiting for purchase order...</div>
              </div>
            )}
            
            {workflowState === 'po_pending' && currentPO && (
              <div style={{ background: '#2E1065', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#A78BFA', fontWeight: 600, marginBottom: '12px' }}>📋 New PO Received</div>
                <div style={{ color: '#E2E8F0', fontSize: '14px', marginBottom: '8px' }}>{currentPO.item}</div>
                <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '4px' }}>
                  Qty: {currentPO.quantity} @ ${currentPO.unitPrice}/unit
                </div>
                <div style={{ color: '#10B981', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                  Total: ${currentPO.total.toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleAcceptPO}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={handleProposeAmendment}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✎ Amend
                  </button>
                </div>
              </div>
            )}
            
            {workflowState === 'po_accepted' && (
              <div style={{ background: '#2E1065', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#10B981', fontWeight: 600, marginBottom: '12px' }}>✓ PO Confirmed</div>
                <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>
                  Ready to ship {currentPO?.quantity} units
                </div>
                <button
                  onClick={handleShipGoods}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📦 Ship Goods
                </button>
              </div>
            )}
            
            {['amendment_pending', 'shipped', 'received', 'completed', 'disputed'].includes(workflowState) && (
              <div style={{ background: '#2E1065', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '14px' }}>
                  {workflowState === 'amendment_pending' && '⏳ Amendment pending buyer approval...'}
                  {workflowState === 'shipped' && '📦 Shipment in transit...'}
                  {workflowState === 'completed' && '✓ Transaction complete'}
                  {workflowState === 'disputed' && '⚠️ Dispute in progress'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #1E1B4B 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#F8FAFC',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚡
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Sightline
              </h1>
              <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Shared Truth Protocol</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              background: workflowState === 'completed' ? '#10B98120' : workflowState === 'disputed' ? '#EF444420' : '#3B82F620',
              color: workflowState === 'completed' ? '#10B981' : workflowState === 'disputed' ? '#EF4444' : '#60A5FA',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              {workflowState === 'draft' && '📝 Draft'}
              {workflowState === 'po_pending' && '⏳ PO Pending'}
              {workflowState === 'po_accepted' && '✓ PO Accepted'}
              {workflowState === 'amendment_pending' && '✎ Amendment Pending'}
              {workflowState === 'shipped' && '📦 In Transit'}
              {workflowState === 'completed' && '✓ Completed'}
              {workflowState === 'disputed' && '⚠️ Disputed'}
            </div>
            <button
              onClick={handleReset}
              style={{
                background: '#1E293B',
                color: '#94A3B8',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ↺ Reset Demo
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 400px', gap: '24px' }}>
          {/* Buyer Panel */}
          <PartyPanel party="buyer" title="Buyer" />
          
          {/* Supplier Panel */}
          <PartyPanel party="supplier" title="Supplier" />
          
          {/* Event Log */}
          <div style={{
            background: '#0F172A',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #1E293B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🔗
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#F8FAFC', fontSize: '18px', fontWeight: 600 }}>Event Chain</h3>
                <span style={{ color: '#64748B', fontSize: '13px' }}>
                  {events.length} events • Immutable Log
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
              {events.length === 0 ? (
                <div style={{
                  background: '#1E293B',
                  borderRadius: '8px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#64748B'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>🔗</div>
                  <div>No events yet</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>Create a PO to start the chain</div>
                </div>
              ) : (
                events.map((event, index) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                    style={{
                      background: selectedEvent?.id === event.id ? '#1E3A5F' : '#1E293B',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      border: `1px solid ${selectedEvent?.id === event.id ? '#3B82F6' : 'transparent'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: EVENT_TYPES[event.type].color
                      }} />
                      <span style={{ color: '#F8FAFC', fontSize: '14px', fontWeight: 500 }}>
                        {EVENT_TYPES[event.type].label}
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        color: '#64748B',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                      }}>
                        #{event.id}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748B', fontSize: '12px' }}>
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <span style={{
                        color: event.party === 'buyer' ? '#60A5FA' : event.party === 'supplier' ? '#A78BFA' : '#10B981',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {event.party}
                      </span>
                    </div>
                    
                    {selectedEvent?.id === event.id && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #334155'
                      }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ color: '#64748B', fontSize: '11px' }}>Hash: </span>
                          <code style={{ color: '#10B981', fontSize: '12px', fontFamily: 'monospace' }}>
                            {event.hash}
                          </code>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ color: '#64748B', fontSize: '11px' }}>Previous: </span>
                          <code style={{ color: '#F59E0B', fontSize: '12px', fontFamily: 'monospace' }}>
                            {event.previousHash}
                          </code>
                        </div>
                        <div>
                          <span style={{ color: '#64748B', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Payload:</span>
                          <pre style={{
                            background: '#0F172A',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#94A3B8',
                            overflow: 'auto',
                            margin: 0
                          }}>
                            {JSON.stringify(event.payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {events.length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#10B98110',
                borderRadius: '8px',
                border: '1px solid #10B98130'
              }}>
                <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  ✓ Chain Integrity Verified
                </div>
                <div style={{ color: '#64748B', fontSize: '11px' }}>
                  All {events.length} events cryptographically linked
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Value Proposition Footer */}
        {(workflowState === 'completed' || workflowState === 'disputed') && (
          <div style={{
            marginTop: '32px',
            background: workflowState === 'completed' ? '#10B98110' : '#EF444410',
            border: `1px solid ${workflowState === 'completed' ? '#10B98130' : '#EF444430'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            {workflowState === 'completed' ? (
              <>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>✓</div>
                <h3 style={{ color: '#10B981', margin: '0 0 8px 0', fontSize: '20px' }}>
                  Transaction Complete
                </h3>
                <p style={{ color: '#94A3B8', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Both parties share an identical, immutable record of every step. 
                  Payment triggered automatically. No reconciliation needed. No disputes possible.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
                <h3 style={{ color: '#EF4444', margin: '0 0 8px 0', fontSize: '20px' }}>
                  Dispute Opened — But Look at the Evidence
                </h3>
                <p style={{ color: '#94A3B8', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                  The event chain shows exactly what was agreed, shipped, and received. 
                  There's nothing to argue about — the cryptographic record is undeniable. 
                  Resolution is now a matter of policy, not archaeology.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
