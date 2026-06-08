import React, { useState } from 'react';

const SightlineEventLedger = () => {
  const [activeView, setActiveView] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({ domain: 'all', agent: 'all', status: 'all' });

  // Sample events showing the unified event ledger
  const events = [
    {
      event_id: 'evt-001',
      timestamp: '2025-02-12 14:23:15',
      domain: 'FINANCE',
      event_type: 'INVOICE_MATCHED',
      actor_type: 'AGENT',
      actor_id: 'AGT-AP-001',
      actor_name: 'Accounts Payable Processor',
      entity_type: 'INVOICE',
      entity_id: 'INV-4521',
      from_state: 'RECEIVED',
      to_state: 'MATCHED',
      policy_version: 'POL-AP-v3',
      constraints_passed: true,
      constraints_checked: { three_way_match: true, amount_tolerance: true, vendor_approved: true },
      evidence_ref: 's3://evidence/invoices/INV-4521.pdf',
      payload: { vendor: 'Office Depot', amount: 4200, po_number: 'PO-2025-0847', gl_account: '6100' }
    },
    {
      event_id: 'evt-002',
      timestamp: '2025-02-12 14:15:22',
      domain: 'FINANCE',
      event_type: 'INVOICE_MATCHED',
      actor_type: 'AGENT',
      actor_id: 'AGT-AP-001',
      actor_name: 'Accounts Payable Processor',
      entity_type: 'INVOICE',
      entity_id: 'INV-4520',
      from_state: 'RECEIVED',
      to_state: 'MATCHED',
      policy_version: 'POL-AP-v3',
      constraints_passed: true,
      constraints_checked: { three_way_match: true, amount_tolerance: true, vendor_approved: true },
      evidence_ref: 's3://evidence/invoices/INV-4520.pdf',
      payload: { vendor: 'AWS', amount: 12400, po_number: 'PO-2025-0842', gl_account: '6200' }
    },
    {
      event_id: 'evt-003',
      timestamp: '2025-02-12 13:45:08',
      domain: 'FINANCE',
      event_type: 'INVOICE_EXCEPTION_FLAGGED',
      actor_type: 'AGENT',
      actor_id: 'AGT-AP-001',
      actor_name: 'Accounts Payable Processor',
      entity_type: 'INVOICE',
      entity_id: 'INV-4519',
      from_state: 'RECEIVED',
      to_state: 'PENDING_REVIEW',
      policy_version: 'POL-AP-v3',
      constraints_passed: false,
      constraints_checked: { three_way_match: false, po_exists: false },
      evidence_ref: 's3://evidence/invoices/INV-4519.pdf',
      payload: { vendor: 'New Supplier Inc', amount: 8750, exception_reason: 'No matching PO found', gl_account: '5100' }
    },
    {
      event_id: 'evt-004',
      timestamp: '2025-02-12 11:30:00',
      domain: 'AGENT',
      event_type: 'AGENT_SUSPENDED',
      actor_type: 'HUMAN',
      actor_id: 'controller@company.com',
      actor_name: 'Sarah Chen (Controller)',
      entity_type: 'AGENT',
      entity_id: 'AGT-EXP-001',
      from_state: 'ACTIVE',
      to_state: 'SUSPENDED',
      policy_version: 'POL-AGENT-v2',
      constraints_passed: true,
      constraints_checked: { authorized_suspender: true, reason_provided: true },
      evidence_ref: 's3://evidence/incidents/AGT-EXP-001-incident.pdf',
      payload: { reason: 'False positive rate exceeded 15% threshold', false_positive_rate: 18.2 }
    },
    {
      event_id: 'evt-005',
      timestamp: '2025-02-12 11:00:00',
      domain: 'FINANCE',
      event_type: 'PAYMENT_BATCH_CREATED',
      actor_type: 'AGENT',
      actor_id: 'AGT-AP-001',
      actor_name: 'Accounts Payable Processor',
      entity_type: 'PAYMENT_BATCH',
      entity_id: 'BATCH-2025-0212',
      from_state: null,
      to_state: 'PENDING_APPROVAL',
      policy_version: 'POL-AP-v3',
      constraints_passed: true,
      constraints_checked: { daily_limit_check: true, duplicate_check: true },
      evidence_ref: 's3://evidence/batches/BATCH-2025-0212.json',
      payload: { invoice_count: 24, total_amount: 147500, payment_date: '2025-02-14' }
    },
    {
      event_id: 'evt-006',
      timestamp: '2025-02-12 09:00:00',
      domain: 'SLO',
      event_type: 'SLO_MEASUREMENT_RECORDED',
      actor_type: 'SYSTEM',
      actor_id: 'SIGHTLINE',
      actor_name: 'Sightline Measurement Engine',
      entity_type: 'SLO_MEASUREMENT',
      entity_id: 'MEAS-AP-001-202502',
      from_state: null,
      to_state: 'RECORDED',
      policy_version: 'POL-SLO-v1',
      constraints_passed: true,
      constraints_checked: { sample_size_met: true, data_complete: true },
      evidence_ref: 's3://evidence/slo/AGT-AP-001-202502.json',
      payload: { agent_id: 'AGT-AP-001', metric: 'Invoice Auto-Match Rate', target: 95, actual: 94.2, status: 'AT_RISK' }
    },
    {
      event_id: 'evt-007',
      timestamp: '2025-02-12 09:01:00',
      domain: 'SLO',
      event_type: 'SLO_FEE_COMPUTED',
      actor_type: 'SYSTEM',
      actor_id: 'SIGHTLINE',
      actor_name: 'Sightline Fee Engine',
      entity_type: 'FEE_ADJUSTMENT',
      entity_id: 'FEE-AP-001-202502',
      from_state: null,
      to_state: 'COMPUTED',
      policy_version: 'POL-SLO-v1',
      constraints_passed: true,
      constraints_checked: { formula_valid: true, floor_applied: false },
      evidence_ref: 's3://evidence/fees/FEE-AP-001-202502.json',
      payload: { agent_id: 'AGT-AP-001', base_fee: 8500, adjusted_fee: 8075, formula: 'actual/target * base', savings: 425 }
    },
    {
      event_id: 'evt-008',
      timestamp: '2025-02-12 06:00:00',
      domain: 'FINANCE',
      event_type: 'RECON_COMPLETED',
      actor_type: 'AGENT',
      actor_id: 'AGT-REC-001',
      actor_name: 'Bank Reconciliation Agent',
      entity_type: 'RECONCILIATION',
      entity_id: 'RECON-OP-20250212',
      from_state: null,
      to_state: 'COMPLETED',
      policy_version: 'POL-RECON-v1',
      constraints_passed: true,
      constraints_checked: { all_matched: true, tolerance_met: true },
      evidence_ref: 's3://evidence/recon/RECON-OP-20250212.json',
      payload: { account: 'Operating', transactions: 142, matched: 142, match_rate: 100 }
    },
    {
      event_id: 'evt-009',
      timestamp: '2025-02-12 06:30:00',
      domain: 'FINANCE',
      event_type: 'RECON_EXCEPTION_FLAGGED',
      actor_type: 'AGENT',
      actor_id: 'AGT-REC-001',
      actor_name: 'Bank Reconciliation Agent',
      entity_type: 'RECONCILIATION',
      entity_id: 'RECON-MM-20250212',
      from_state: null,
      to_state: 'EXCEPTION',
      policy_version: 'POL-RECON-v1',
      constraints_passed: false,
      constraints_checked: { all_matched: false },
      evidence_ref: 's3://evidence/recon/RECON-MM-20250212.json',
      payload: { account: 'Money Market', unmatched_amount: 4200, unmatched_count: 1 }
    },
    {
      event_id: 'evt-010',
      timestamp: '2025-02-11 16:00:00',
      domain: 'POLICY',
      event_type: 'CONTROL_TESTED',
      actor_type: 'SYSTEM',
      actor_id: 'SIGHTLINE',
      actor_name: 'Sightline SOX Engine',
      entity_type: 'CONTROL_TEST',
      entity_id: 'CTL-SOD-20250211',
      from_state: null,
      to_state: 'PASS',
      policy_version: 'POL-SOX-v1',
      constraints_passed: true,
      constraints_checked: { segregation_verified: true },
      evidence_ref: 's3://evidence/sox/CTL-SOD-20250211.json',
      payload: { control: 'Segregation of Duties', agents_tested: 8, violations: 0 }
    }
  ];

  // Finance entries derived from events
  const financeEntries = [
    { finance_id: 'FIN-001', event_id: 'evt-001', gl_account: '6100', amount: 4200, direction: 'DEBIT', vendor: 'Office Depot', agent: 'AGT-AP-001', auto_matched: true },
    { finance_id: 'FIN-002', event_id: 'evt-002', gl_account: '6200', amount: 12400, direction: 'DEBIT', vendor: 'AWS', agent: 'AGT-AP-001', auto_matched: true },
    { finance_id: 'FIN-003', event_id: 'evt-002', gl_account: '2100', amount: 12400, direction: 'CREDIT', vendor: 'AWS', agent: 'AGT-AP-001', auto_matched: true },
    { finance_id: 'FIN-004', event_id: 'evt-001', gl_account: '2100', amount: 4200, direction: 'CREDIT', vendor: 'Office Depot', agent: 'AGT-AP-001', auto_matched: true },
  ];

  // Summary stats
  const summary = {
    totalEvents: events.length,
    byDomain: {
      FINANCE: events.filter(e => e.domain === 'FINANCE').length,
      AGENT: events.filter(e => e.domain === 'AGENT').length,
      SLO: events.filter(e => e.domain === 'SLO').length,
      POLICY: events.filter(e => e.domain === 'POLICY').length
    },
    constraintsPassed: events.filter(e => e.constraints_passed).length,
    constraintsFailed: events.filter(e => !e.constraints_passed).length,
    withEvidence: events.filter(e => e.evidence_ref).length
  };

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'FINANCE': return 'bg-green-100 text-green-800';
      case 'AGENT': return 'bg-purple-100 text-purple-800';
      case 'SLO': return 'bg-blue-100 text-blue-800';
      case 'POLICY': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type) => {
    if (type.includes('INVOICE')) return '📄';
    if (type.includes('PAYMENT')) return '💳';
    if (type.includes('RECON')) return '🔄';
    if (type.includes('AGENT')) return '🤖';
    if (type.includes('SLO')) return '📊';
    if (type.includes('CONTROL')) return '✅';
    if (type.includes('EXCEPTION') || type.includes('FLAGGED')) return '⚠️';
    return '•';
  };

  const getConstraintStatus = (passed) => {
    return passed 
      ? <span className="text-green-600">✓ Passed</span>
      : <span className="text-red-600">✗ Failed</span>;
  };

  const filteredEvents = events.filter(e => {
    if (filters.domain !== 'all' && e.domain !== filters.domain) return false;
    if (filters.agent !== 'all' && e.actor_id !== filters.agent) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'passed' && !e.constraints_passed) return false;
      if (filters.status === 'failed' && e.constraints_passed) return false;
    }
    return true;
  });

  const EventDetail = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getEventIcon(event.event_type)}</span>
              <h3 className="text-lg font-semibold text-gray-900">{event.event_type}</h3>
            </div>
            <p className="text-sm text-gray-500 font-mono">{event.event_id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Event Identity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Domain</p>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getDomainColor(event.domain)}`}>
                {event.domain}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Timestamp</p>
              <p className="text-sm font-medium text-gray-900">{event.timestamp}</p>
            </div>
          </div>

          {/* Actor */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Actor</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{event.actor_type}</p>
              </div>
              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-medium font-mono">{event.actor_id}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{event.actor_name}</p>
              </div>
            </div>
          </div>

          {/* Entity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Entity</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{event.entity_type}</p>
              </div>
              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-medium font-mono">{event.entity_id}</p>
              </div>
              {event.from_state && (
                <div>
                  <p className="text-gray-500">From State</p>
                  <p className="font-medium">{event.from_state}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">To State</p>
                <p className="font-medium">{event.to_state}</p>
              </div>
            </div>
          </div>

          {/* Policy & Constraints */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Policy Binding</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Policy Version</span>
                <span className="font-mono font-medium">{event.policy_version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Constraints Status</span>
                {getConstraintStatus(event.constraints_passed)}
              </div>
              <div>
                <p className="text-gray-500 mb-2">Constraints Checked:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.constraints_checked).map(([key, value]) => (
                    <span 
                      key={key} 
                      className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {key}: {value ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Evidence</h4>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-gray-600 truncate flex-1">{event.evidence_ref}</p>
              <button className="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                View Evidence
              </button>
            </div>
          </div>

          {/* Payload */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Event Payload</h4>
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>

          {/* Related Finance Entries */}
          {financeEntries.filter(f => f.event_id === event.event_id).length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-700 mb-3">Related Finance Entries</h4>
              <div className="space-y-2">
                {financeEntries.filter(f => f.event_id === event.event_id).map(entry => (
                  <div key={entry.finance_id} className="flex justify-between text-sm">
                    <span className="font-mono">{entry.gl_account}</span>
                    <span className={entry.direction === 'DEBIT' ? 'text-red-600' : 'text-green-600'}>
                      {entry.direction === 'DEBIT' ? '-' : '+'}${entry.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
            Export Event
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Trace Related Events
          </button>
        </div>
      </div>
    </div>
  );

  const EventsView = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center bg-white border border-gray-200 rounded-lg p-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Domain</label>
          <select 
            value={filters.domain} 
            onChange={(e) => setFilters({...filters, domain: e.target.value})}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Domains</option>
            <option value="FINANCE">Finance</option>
            <option value="AGENT">Agent</option>
            <option value="SLO">SLO</option>
            <option value="POLICY">Policy</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Agent</label>
          <select 
            value={filters.agent} 
            onChange={(e) => setFilters({...filters, agent: e.target.value})}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All Actors</option>
            <option value="AGT-AP-001">AGT-AP-001 (AP)</option>
            <option value="AGT-REC-001">AGT-REC-001 (Recon)</option>
            <option value="AGT-EXP-001">AGT-EXP-001 (Expense)</option>
            <option value="SIGHTLINE">SYSTEM</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Constraints</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Search</label>
          <input type="text" placeholder="Search events..." className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div className="pt-5">
          <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Export for Audit
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-2">
        {filteredEvents.map(event => (
          <div 
            key={event.event_id}
            onClick={() => setSelectedEvent(event)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getEventIcon(event.event_type)}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDomainColor(event.domain)}`}>
                      {event.domain}
                    </span>
                    <span className="font-medium text-gray-900">{event.event_type}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.actor_type === 'AGENT' ? '🤖' : event.actor_type === 'HUMAN' ? '👤' : '⚙️'} {event.actor_name}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {event.entity_type}: {event.entity_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{event.timestamp}</p>
                <div className="mt-2">
                  {event.constraints_passed ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ Compliant</span>
                  ) : (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">✗ Exception</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-gray-500">
                <span>Policy: <span className="font-mono">{event.policy_version}</span></span>
                <span>Evidence: {event.evidence_ref ? '✓' : '—'}</span>
                {event.from_state && <span>{event.from_state} → {event.to_state}</span>}
              </div>
              <span className="text-blue-600 hover:text-blue-800">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TraceView = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Causal Trace: Invoice INV-4521</h3>
        <p className="text-sm text-gray-500 mb-6">Follow the chain: Event → Finance Entry → GL Impact → SLO Measurement → Fee Adjustment</p>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
          
          {/* Chain nodes */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl z-10">📄</div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">1. Event Created</p>
                <p className="font-medium">INVOICE_MATCHED</p>
                <p className="text-sm text-gray-600">Agent AGT-AP-001 matched INV-4521 to PO-2025-0847</p>
                <p className="text-xs text-gray-400 mt-1">Policy: POL-AP-v3 | Evidence: INV-4521.pdf</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl z-10">💰</div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">2. Finance Entry</p>
                <p className="font-medium">GL Entries Created</p>
                <div className="text-sm text-gray-600 space-y-1 mt-2">
                  <p>DR 6100 (Office Supplies) $4,200</p>
                  <p>CR 2100 (Accounts Payable) $4,200</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-matched: Yes | Processing Time: 4.2 min</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl z-10">📊</div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">3. SLO Impact</p>
                <p className="font-medium">Contributes to Auto-Match Rate SLO</p>
                <p className="text-sm text-gray-600">This invoice was auto-matched, contributing to 798/847 = 94.2% match rate</p>
                <p className="text-xs text-gray-400 mt-1">SLO Status: AT_RISK (target 95%)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl z-10">💵</div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">4. Fee Impact</p>
                <p className="font-medium">Vendor Fee Adjustment</p>
                <p className="text-sm text-gray-600">Base fee $8,500 adjusted to $8,075 based on 94.2% performance</p>
                <p className="text-xs text-green-600 mt-1">Savings: $425 (5%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>The Sightline Guarantee:</strong> Every dollar traces back to the event that caused it, 
          the policy that governed it, and the outcome it produced.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sightline Event Ledger</h1>
            <p className="text-gray-500 mt-1">Unified audit trail for outsourced F&A operations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Today:</span>
            <span className="text-sm font-medium">Feb 12, 2025</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalEvents}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Finance</p>
            <p className="text-2xl font-bold text-green-600">{summary.byDomain.FINANCE}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Agent</p>
            <p className="text-2xl font-bold text-purple-600">{summary.byDomain.AGENT}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">SLO</p>
            <p className="text-2xl font-bold text-blue-600">{summary.byDomain.SLO}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Compliant</p>
            <p className="text-2xl font-bold text-green-600">{summary.constraintsPassed}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Exceptions</p>
            <p className="text-2xl font-bold text-red-600">{summary.constraintsFailed}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveView('events')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeView === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Event Stream
          </button>
          <button 
            onClick={() => setActiveView('trace')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeView === 'trace' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Causal Trace
          </button>
        </div>

        {/* Content */}
        {activeView === 'events' ? <EventsView /> : <TraceView />}

        {/* Event Detail Modal */}
        {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </div>
    </div>
  );
};

export default SightlineEventLedger;
