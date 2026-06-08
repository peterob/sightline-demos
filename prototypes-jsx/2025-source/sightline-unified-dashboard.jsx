import React, { useState } from 'react';

const SightlineUnifiedDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeLens, setActiveLens] = useState('all');

  // The ONE ledger - all events flow through here
  const eventLedger = [
    {
      id: 'EVT-001',
      timestamp: '2025-02-12 14:23:15',
      type: 'INVOICE_MATCHED',
      actor: { id: 'AGT-AP-001', name: 'AP Processor', type: 'AGENT' },
      entity: { type: 'INVOICE', id: 'INV-4521' },
      policy: 'POL-AP-v3',
      evidence: 'INV-4521.pdf',
      constrained: true,
      payload: { vendor: 'Office Depot', amount: 4200, gl: '6100' },
      // Which lenses see this event
      lenses: ['FINANCE', 'AGENT', 'SLO'],
      // Downstream impacts
      impacts: {
        finance: { debit: '6100', credit: '2100', amount: 4200 },
        agent: { metric: 'invoices_processed', delta: 1 },
        slo: { metric: 'auto_match_rate', contribution: 'matched' }
      }
    },
    {
      id: 'EVT-002',
      timestamp: '2025-02-12 13:45:08',
      type: 'INVOICE_EXCEPTION',
      actor: { id: 'AGT-AP-001', name: 'AP Processor', type: 'AGENT' },
      entity: { type: 'INVOICE', id: 'INV-4519' },
      policy: 'POL-AP-v3',
      evidence: 'INV-4519.pdf',
      constrained: false,
      payload: { vendor: 'New Supplier', amount: 8750, reason: 'No PO' },
      lenses: ['FINANCE', 'AGENT', 'SLO'],
      impacts: {
        finance: { status: 'PENDING_REVIEW', amount: 8750 },
        agent: { metric: 'exceptions', delta: 1 },
        slo: { metric: 'auto_match_rate', contribution: 'exception' }
      }
    },
    {
      id: 'EVT-003',
      timestamp: '2025-02-12 11:30:00',
      type: 'AGENT_SUSPENDED',
      actor: { id: 'controller@co.com', name: 'Sarah Chen', type: 'HUMAN' },
      entity: { type: 'AGENT', id: 'AGT-EXP-001' },
      policy: 'POL-AGENT-v2',
      evidence: 'incident-report.pdf',
      constrained: true,
      payload: { reason: 'False positive rate 18.2%', threshold: 15 },
      lenses: ['AGENT', 'SLO'],
      impacts: {
        agent: { status: 'ACTIVE→SUSPENDED', credentials: 'REVOKED' },
        slo: { metric: 'revoke_velocity', value: '4 min' }
      }
    },
    {
      id: 'EVT-004',
      timestamp: '2025-02-12 09:00:00',
      type: 'SLO_MEASURED',
      actor: { id: 'SIGHTLINE', name: 'Measurement Engine', type: 'SYSTEM' },
      entity: { type: 'SLO', id: 'SLO-AP-001' },
      policy: 'POL-SLO-v1',
      evidence: 'measurement-202502.json',
      constrained: true,
      payload: { agent: 'AGT-AP-001', metric: 'Auto-Match Rate', target: 95, actual: 94.2 },
      lenses: ['SLO', 'AGENT'],
      impacts: {
        slo: { status: 'AT_RISK', fee_base: 8500, fee_adjusted: 8075 },
        agent: { performance: 'AT_RISK' }
      }
    },
    {
      id: 'EVT-005',
      timestamp: '2025-02-12 06:00:00',
      type: 'RECON_COMPLETED',
      actor: { id: 'AGT-REC-001', name: 'Recon Agent', type: 'AGENT' },
      entity: { type: 'RECONCILIATION', id: 'RECON-OP-0212' },
      policy: 'POL-RECON-v1',
      evidence: 'recon-operating.json',
      constrained: true,
      payload: { account: 'Operating', transactions: 142, matched: 142 },
      lenses: ['FINANCE', 'AGENT', 'SLO'],
      impacts: {
        finance: { reconciled: 142, variance: 0 },
        agent: { metric: 'reconciliations', delta: 1 },
        slo: { metric: 'match_rate', contribution: '100%' }
      }
    },
    {
      id: 'EVT-006',
      timestamp: '2025-02-12 09:01:00',
      type: 'FEE_COMPUTED',
      actor: { id: 'SIGHTLINE', name: 'Fee Engine', type: 'SYSTEM' },
      entity: { type: 'FEE', id: 'FEE-AP-001-202502' },
      policy: 'POL-SLO-v1',
      evidence: 'fee-calc.json',
      constrained: true,
      payload: { agent: 'AGT-AP-001', base: 8500, adjusted: 8075, savings: 425 },
      lenses: ['SLO', 'FINANCE'],
      impacts: {
        slo: { fee_status: 'COMPUTED' },
        finance: { payable: 8075, vendor: 'AccuBooks AI' }
      }
    },
    {
      id: 'EVT-007',
      timestamp: '2025-02-11 16:00:00',
      type: 'CONTROL_TESTED',
      actor: { id: 'SIGHTLINE', name: 'SOX Engine', type: 'SYSTEM' },
      entity: { type: 'CONTROL', id: 'CTL-SOD-0211' },
      policy: 'POL-SOX-v1',
      evidence: 'sox-test.json',
      constrained: true,
      payload: { control: 'Segregation of Duties', agents: 8, violations: 0 },
      lenses: ['SLO'],
      impacts: {
        slo: { control_status: 'PASS' }
      }
    },
    {
      id: 'EVT-008',
      timestamp: '2025-02-11 11:00:00',
      type: 'PAYMENT_EXECUTED',
      actor: { id: 'AGT-AP-001', name: 'AP Processor', type: 'AGENT' },
      entity: { type: 'PAYMENT', id: 'PAY-BATCH-0211' },
      policy: 'POL-AP-v3',
      evidence: 'payment-confirm.pdf',
      constrained: true,
      payload: { invoices: 18, amount: 94500, method: 'ACH' },
      lenses: ['FINANCE', 'AGENT'],
      impacts: {
        finance: { cash_out: 94500, ap_cleared: 94500 },
        agent: { metric: 'payments_processed', delta: 18 }
      }
    }
  ];

  const getLensColor = (lens) => {
    switch (lens) {
      case 'FINANCE': return { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' };
      case 'AGENT': return { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' };
      case 'SLO': return { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
      default: return { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const getEventIcon = (type) => {
    if (type.includes('INVOICE')) return '📄';
    if (type.includes('PAYMENT')) return '💳';
    if (type.includes('RECON')) return '🔄';
    if (type.includes('AGENT')) return '🤖';
    if (type.includes('SLO') || type.includes('MEASURED')) return '📊';
    if (type.includes('FEE')) return '💵';
    if (type.includes('CONTROL')) return '✅';
    if (type.includes('EXCEPTION')) return '⚠️';
    return '•';
  };

  const filteredEvents = activeLens === 'all' 
    ? eventLedger 
    : eventLedger.filter(e => e.lenses.includes(activeLens));

  // Aggregate stats for each lens
  const lensStats = {
    FINANCE: {
      label: 'Finance Ledger',
      icon: '💰',
      events: eventLedger.filter(e => e.lenses.includes('FINANCE')).length,
      metric1: { label: 'GL Entries', value: '2,847' },
      metric2: { label: 'Cash Flow', value: '-$94.5K' },
      metric3: { label: 'Reconciled', value: '99.8%' }
    },
    AGENT: {
      label: 'Agent Registry',
      icon: '🤖',
      events: eventLedger.filter(e => e.lenses.includes('AGENT')).length,
      metric1: { label: 'Active', value: '7/8' },
      metric2: { label: 'Actions Today', value: '847' },
      metric3: { label: 'Compliant', value: '97%' }
    },
    SLO: {
      label: 'SLO Ledger',
      icon: '📊',
      events: eventLedger.filter(e => e.lenses.includes('SLO')).length,
      metric1: { label: 'On Track', value: '18/26' },
      metric2: { label: 'Fee Savings', value: '$12.5K' },
      metric3: { label: 'SOX Pass', value: '100%' }
    }
  };

  const EventDetailPanel = ({ event }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{getEventIcon(event.type)}</span>
            <h3 className="text-lg font-bold text-gray-900">{event.type}</h3>
          </div>
          <p className="text-sm text-gray-500 font-mono">{event.id}</p>
        </div>
        <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
      </div>

      {/* Core Event Data */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Actor</p>
          <p className="text-sm font-medium">{event.actor.type === 'AGENT' ? '🤖' : event.actor.type === 'HUMAN' ? '👤' : '⚙️'} {event.actor.name}</p>
          <p className="text-xs text-gray-400 font-mono">{event.actor.id}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Entity</p>
          <p className="text-sm font-medium">{event.entity.type}</p>
          <p className="text-xs text-gray-400 font-mono">{event.entity.id}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Policy</p>
          <p className="text-sm font-medium font-mono">{event.policy}</p>
          <p className="text-xs text-gray-400">{event.constrained ? '✓ Compliant' : '✗ Exception'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Evidence</p>
          <p className="text-sm font-medium truncate">{event.evidence}</p>
          <button className="text-xs text-blue-600 hover:text-blue-800">View →</button>
        </div>
      </div>

      {/* Visible Through Lenses */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">VISIBLE THROUGH:</p>
        <div className="flex gap-2">
          {event.lenses.map(lens => {
            const colors = getLensColor(lens);
            return (
              <span key={lens} className={`px-3 py-1 rounded-full text-sm font-medium ${colors.light} ${colors.text}`}>
                {lensStats[lens].icon} {lens}
              </span>
            );
          })}
        </div>
      </div>

      {/* Impact on Each Lens */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500">DOWNSTREAM IMPACT:</p>
        {event.impacts.finance && (
          <div className={`rounded-lg p-3 ${getLensColor('FINANCE').light} border ${getLensColor('FINANCE').border}`}>
            <p className="text-xs font-medium text-emerald-800 mb-1">💰 Finance Ledger</p>
            <p className="text-sm text-emerald-700">
              {event.impacts.finance.debit && `DR ${event.impacts.finance.debit} / CR ${event.impacts.finance.credit}: $${event.impacts.finance.amount?.toLocaleString()}`}
              {event.impacts.finance.cash_out && `Cash Out: $${event.impacts.finance.cash_out.toLocaleString()}`}
              {event.impacts.finance.status && `Status: ${event.impacts.finance.status}`}
              {event.impacts.finance.reconciled && `Reconciled: ${event.impacts.finance.reconciled} transactions`}
              {event.impacts.finance.payable && `Vendor Payable: $${event.impacts.finance.payable.toLocaleString()}`}
            </p>
          </div>
        )}
        {event.impacts.agent && (
          <div className={`rounded-lg p-3 ${getLensColor('AGENT').light} border ${getLensColor('AGENT').border}`}>
            <p className="text-xs font-medium text-violet-800 mb-1">🤖 Agent Registry</p>
            <p className="text-sm text-violet-700">
              {event.impacts.agent.metric && `${event.impacts.agent.metric}: +${event.impacts.agent.delta}`}
              {event.impacts.agent.status && `Status: ${event.impacts.agent.status}`}
              {event.impacts.agent.performance && `Performance: ${event.impacts.agent.performance}`}
            </p>
          </div>
        )}
        {event.impacts.slo && (
          <div className={`rounded-lg p-3 ${getLensColor('SLO').light} border ${getLensColor('SLO').border}`}>
            <p className="text-xs font-medium text-amber-800 mb-1">📊 SLO Ledger</p>
            <p className="text-sm text-amber-700">
              {event.impacts.slo.contribution && `${event.impacts.slo.metric}: ${event.impacts.slo.contribution}`}
              {event.impacts.slo.status && `Status: ${event.impacts.slo.status}`}
              {event.impacts.slo.fee_adjusted && ` → Fee: $${event.impacts.slo.fee_base?.toLocaleString()} → $${event.impacts.slo.fee_adjusted?.toLocaleString()}`}
              {event.impacts.slo.value && `${event.impacts.slo.metric}: ${event.impacts.slo.value}`}
              {event.impacts.slo.control_status && `Control: ${event.impacts.slo.control_status}`}
              {event.impacts.slo.fee_status && `Fee: ${event.impacts.slo.fee_status}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SIGHTLINE</h1>
          <p className="text-xl text-slate-400">One Ledger. Three Lenses. Traceable Dollars.</p>
        </div>

        {/* The Core Concept Visual */}
        <div className="mb-8">
          <div className="relative">
            {/* Central Ledger */}
            <div className="flex justify-center mb-6">
              <div className="bg-slate-700 rounded-2xl px-8 py-4 border-2 border-slate-500 shadow-2xl">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Single Source of Truth</p>
                <p className="text-white text-2xl font-bold">EVENT LEDGER</p>
                <p className="text-slate-400 text-sm">{eventLedger.length} events today</p>
              </div>
            </div>

            {/* Three Lenses */}
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(lensStats).map(([key, lens]) => {
                const colors = getLensColor(key);
                const isActive = activeLens === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveLens(activeLens === key ? 'all' : key)}
                    className={`relative cursor-pointer transition-all duration-300 ${isActive ? 'scale-105' : 'hover:scale-102'}`}
                  >
                    {/* Connection line to center */}
                    <div className={`absolute top-0 left-1/2 w-0.5 h-6 -mt-6 ${colors.bg} opacity-50`}></div>
                    
                    <div className={`rounded-xl p-5 border-2 transition-all ${isActive ? `${colors.light} ${colors.border} shadow-lg` : 'bg-slate-800 border-slate-600 hover:border-slate-500'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{lens.icon}</span>
                          <span className={`font-semibold ${isActive ? colors.text : 'text-white'}`}>{lens.label}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${colors.light} ${colors.text}`}>
                          {lens.events} events
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className={`rounded-lg p-2 ${isActive ? 'bg-white/50' : 'bg-slate-700'}`}>
                          <p className={`text-lg font-bold ${isActive ? colors.text : 'text-white'}`}>{lens.metric1.value}</p>
                          <p className={`text-xs ${isActive ? colors.text : 'text-slate-400'}`}>{lens.metric1.label}</p>
                        </div>
                        <div className={`rounded-lg p-2 ${isActive ? 'bg-white/50' : 'bg-slate-700'}`}>
                          <p className={`text-lg font-bold ${isActive ? colors.text : 'text-white'}`}>{lens.metric2.value}</p>
                          <p className={`text-xs ${isActive ? colors.text : 'text-slate-400'}`}>{lens.metric2.label}</p>
                        </div>
                        <div className={`rounded-lg p-2 ${isActive ? 'bg-white/50' : 'bg-slate-700'}`}>
                          <p className={`text-lg font-bold ${isActive ? colors.text : 'text-white'}`}>{lens.metric3.value}</p>
                          <p className={`text-xs ${isActive ? colors.text : 'text-slate-400'}`}>{lens.metric3.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter indicator */}
        {activeLens !== 'all' && (
          <div className="flex justify-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getLensColor(activeLens).light} ${getLensColor(activeLens).text}`}>
              <span>Viewing through {activeLens} lens</span>
              <button onClick={() => setActiveLens('all')} className="ml-2 hover:opacity-70">×</button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Event Stream */}
          <div className="col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Event Stream</h2>
              <span className="text-slate-400 text-sm">{filteredEvents.length} events</span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`rounded-lg p-3 cursor-pointer transition-all ${selectedEvent?.id === event.id ? 'bg-slate-600 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-650'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getEventIcon(event.type)}</span>
                      <div>
                        <p className="text-white font-medium">{event.type}</p>
                        <p className="text-slate-400 text-sm">{event.actor.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">{event.timestamp.split(' ')[1]}</p>
                      <div className="flex gap-1 mt-1 justify-end">
                        {event.lenses.map(lens => (
                          <span key={lens} className={`w-2 h-2 rounded-full ${getLensColor(lens).bg}`}></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel or Explanation */}
          <div className="col-span-1">
            {selectedEvent ? (
              <EventDetailPanel event={selectedEvent} />
            ) : (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full">
                <h3 className="text-white font-semibold mb-4">How It Works</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <p className="text-white font-medium">Every Action → Event</p>
                      <p className="text-slate-400">Agent processes invoice, human suspends agent, system measures SLO—all become events</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <p className="text-white font-medium">Event → Three Lenses</p>
                      <p className="text-slate-400">Same event updates Finance (GL entries), Agent (metrics), and SLO (performance)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <p className="text-white font-medium">Trace Any Dollar</p>
                      <p className="text-slate-400">Click any event to see: who did it, under which policy, with what evidence, and all downstream impacts</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">The Guarantee</p>
                  <p className="text-white">Every dollar traces to the event that caused it, the policy that governed it, and the outcome it produced.</p>
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
                  <p className="text-blue-300 text-sm">👆 Click any event in the stream to see how one event flows through all three lenses</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: The Dollar Trace */}
        <div className="mt-8 bg-gradient-to-r from-emerald-900/30 via-violet-900/30 to-amber-900/30 rounded-xl border border-slate-600 p-6">
          <h3 className="text-white font-semibold mb-4 text-center">Traceable Dollar Example: Invoice INV-4521 ($4,200)</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className={`inline-block rounded-lg p-4 ${getLensColor('FINANCE').light} ${getLensColor('FINANCE').border} border-2`}>
                <p className="text-xs text-emerald-600 mb-1">FINANCE LENS</p>
                <p className="text-emerald-800 font-bold">DR 6100 $4,200</p>
                <p className="text-emerald-800 font-bold">CR 2100 $4,200</p>
              </div>
            </div>
            <div className="text-slate-500 text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className={`inline-block rounded-lg p-4 ${getLensColor('AGENT').light} ${getLensColor('AGENT').border} border-2`}>
                <p className="text-xs text-violet-600 mb-1">AGENT LENS</p>
                <p className="text-violet-800 font-bold">AGT-AP-001</p>
                <p className="text-violet-700 text-sm">+1 invoice processed</p>
              </div>
            </div>
            <div className="text-slate-500 text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className={`inline-block rounded-lg p-4 ${getLensColor('SLO').light} ${getLensColor('SLO').border} border-2`}>
                <p className="text-xs text-amber-600 mb-1">SLO LENS</p>
                <p className="text-amber-800 font-bold">Auto-Match: ✓</p>
                <p className="text-amber-700 text-sm">798/847 = 94.2%</p>
              </div>
            </div>
            <div className="text-slate-500 text-2xl">→</div>
            <div className="flex-1 text-center">
              <div className="inline-block rounded-lg p-4 bg-slate-700 border-2 border-slate-500">
                <p className="text-xs text-slate-400 mb-1">FEE IMPACT</p>
                <p className="text-white font-bold">$8,500 → $8,075</p>
                <p className="text-green-400 text-sm">Saves $425</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SightlineUnifiedDashboard;
