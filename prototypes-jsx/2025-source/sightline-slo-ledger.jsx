import React, { useState } from 'react';

const SLOLedger = () => {
  const [selectedSLO, setSelectedSLO] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('Feb 2025');

  const agents = [
    {
      id: 'AGT-GROWTH-001',
      name: 'Performance Marketing Optimizer',
      slos: [
        {
          id: 'SLO-001',
          metric: 'ROAS Lift',
          type: 'REVENUE',
          target: 10,
          actual: 8.2,
          unit: '%',
          status: 'AT_RISK',
          method: 'HOLDOUT_TEST',
          baseFee: 25000,
          adjustedFee: 18500,
          trend: [6.1, 7.2, 5.8, 6.5, 7.1, 8.2],
          holdoutData: {
            testImpressions: 2847000,
            testSpend: 48200,
            testRevenue: 187400,
            testROAS: 3.89,
            controlImpressions: 312000,
            controlSpend: 5300,
            controlRevenue: 19100,
            controlROAS: 3.60,
            confidence: 94
          }
        },
        {
          id: 'SLO-002',
          metric: 'Conversion Lift',
          type: 'REVENUE',
          target: 5,
          actual: 5.4,
          unit: '%',
          status: 'ON_TRACK',
          method: 'HOLDOUT_TEST',
          baseFee: 15000,
          adjustedFee: 15000,
          trend: [4.2, 4.8, 5.1, 5.0, 5.2, 5.4]
        }
      ]
    },
    {
      id: 'AGT-CONTENT-002',
      name: 'Creative Generator',
      slos: [
        {
          id: 'SLO-003',
          metric: 'First-Time-Right Rate',
          type: 'PRODUCTIVITY',
          target: 85,
          actual: 91,
          unit: '%',
          status: 'ON_TRACK',
          method: 'QA_SAMPLE',
          baseFee: 20000,
          adjustedFee: 20000,
          trend: [82, 84, 87, 88, 90, 91]
        },
        {
          id: 'SLO-004',
          metric: 'Cycle Time',
          type: 'PRODUCTIVITY',
          target: 2,
          actual: 3.2,
          unit: 'hrs',
          status: 'BREACHED',
          method: 'SYSTEM_LOGS',
          baseFee: 10000,
          adjustedFee: 5000,
          trend: [1.8, 2.1, 2.4, 2.7, 3.0, 3.2],
          inverse: true
        }
      ]
    },
    {
      id: 'AGT-SUPPORT-003',
      name: 'Customer Service Bot',
      slos: [
        {
          id: 'SLO-005',
          metric: 'Resolution Rate',
          type: 'QUALITY',
          target: 80,
          actual: 72,
          unit: '%',
          status: 'BREACHED',
          method: 'SYSTEM_LOGS',
          baseFee: 15000,
          adjustedFee: 10000,
          trend: [78, 76, 74, 73, 71, 72]
        },
        {
          id: 'SLO-006',
          metric: 'Error Rate',
          type: 'QUALITY',
          target: 2,
          actual: 4.5,
          unit: '%',
          status: 'BREACHED',
          method: 'INCIDENT_COUNT',
          baseFee: 10000,
          adjustedFee: 5000,
          trend: [1.8, 2.2, 2.9, 3.4, 4.1, 4.5],
          inverse: true
        }
      ]
    },
    {
      id: 'AGT-PRICING-004',
      name: 'Dynamic Pricing Engine',
      slos: [
        {
          id: 'SLO-007',
          metric: 'Margin Preservation',
          type: 'REVENUE',
          target: 15,
          actual: 17.2,
          unit: '%',
          status: 'ON_TRACK',
          method: 'SYSTEM_LOGS',
          baseFee: 30000,
          adjustedFee: 30000,
          trend: [15.1, 15.8, 16.2, 16.5, 16.9, 17.2]
        },
        {
          id: 'SLO-008',
          metric: 'Price Update Latency',
          type: 'PRODUCTIVITY',
          target: 5,
          actual: 3.2,
          unit: 'min',
          status: 'ON_TRACK',
          method: 'SYSTEM_LOGS',
          baseFee: 10000,
          adjustedFee: 10000,
          trend: [4.8, 4.2, 3.9, 3.6, 3.4, 3.2],
          inverse: true
        }
      ]
    }
  ];

  const trustMetrics = {
    revokeVelocity: {
      target: 4,
      unit: 'hours',
      events: [
        { date: '2025-02-12 14:14', agent: 'AGT-SUPPORT-003', action: 'Suspended', decision: '14:14', verified: '14:18', velocity: 4 },
        { date: '2025-01-28 09:45', agent: 'AGT-PRICING-007', action: 'Revoked', decision: '09:45', verified: '09:52', velocity: 7 },
        { date: '2025-01-15 16:30', agent: 'AGT-EMAIL-004', action: 'Suspended', decision: '16:30', verified: '16:31', velocity: 1 }
      ],
      average: 4,
      max: 7,
      status: 'ON_TRACK'
    },
    provenanceRate: {
      target: 100,
      actual: 99.7,
      total: 12886,
      withEvidence: 12847,
      missing: 39,
      status: 'ON_TRACK'
    }
  };

  const allSLOs = agents.flatMap(agent => agent.slos.map(slo => ({ ...slo, agentId: agent.id, agentName: agent.name })));
  
  const summary = {
    total: allSLOs.length,
    onTrack: allSLOs.filter(s => s.status === 'ON_TRACK').length,
    atRisk: allSLOs.filter(s => s.status === 'AT_RISK').length,
    breached: allSLOs.filter(s => s.status === 'BREACHED').length,
    baseFees: allSLOs.reduce((sum, s) => sum + s.baseFee, 0),
    adjustedFees: allSLOs.reduce((sum, s) => sum + s.adjustedFee, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ON_TRACK': return 'bg-green-100 text-green-800 border-green-200';
      case 'AT_RISK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BREACHED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ON_TRACK': return '✓';
      case 'AT_RISK': return '⚠️';
      case 'BREACHED': return '✗';
      default: return '•';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'REVENUE': return 'bg-green-50 text-green-700';
      case 'PRODUCTIVITY': return 'bg-blue-50 text-blue-700';
      case 'QUALITY': return 'bg-purple-50 text-purple-700';
      case 'TRUST': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const calculateVariance = (target, actual, inverse = false) => {
    if (inverse) {
      return ((target - actual) / target * 100).toFixed(0);
    }
    return ((actual - target) / target * 100).toFixed(0);
  };

  const getProgressWidth = (target, actual, inverse = false) => {
    if (inverse) {
      return Math.min((target / actual) * 100, 100);
    }
    return Math.min((actual / target) * 100, 100);
  };

  const SLODetail = ({ slo, onBack }) => (
    <div className="space-y-6">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700">← Back to Dashboard</button>
      
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{slo.metric}</h2>
          <p className="text-gray-600">{slo.agentId} · {slo.agentName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(slo.status)}`}>
          {getStatusIcon(slo.status)} {slo.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Target</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Metric</span><span className="text-gray-900">{slo.metric}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Target</span><span className="text-gray-900">{slo.inverse ? '<' : ''}{slo.target}{slo.unit}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="text-gray-900">{slo.method.replace('_', ' ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Window</span><span className="text-gray-900">Monthly</span></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Current Period</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="text-gray-900">Feb 1-28, 2025</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Actual</span><span className="text-gray-900 font-medium">{slo.actual}{slo.unit}</span></div>
            <div className="flex justify-between">
              <span className="text-gray-500">Variance</span>
              <span className={`font-medium ${(slo.inverse ? slo.actual < slo.target : slo.actual >= slo.target) ? 'text-green-600' : 'text-red-600'}`}>
                {calculateVariance(slo.target, slo.actual, slo.inverse)}%
              </span>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-gray-900">{slo.status === 'ON_TRACK' ? 'Meeting target' : slo.status === 'AT_RISK' ? 'Below threshold' : 'Breached'}</span></div>
          </div>
        </div>
      </div>

      {slo.holdoutData && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Holdout Test Details</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Test Group (agent-optimized)</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Impressions</span><span className="text-gray-900">{slo.holdoutData.testImpressions.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Spend</span><span className="text-gray-900">${slo.holdoutData.testSpend.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Revenue</span><span className="text-gray-900">${slo.holdoutData.testRevenue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ROAS</span><span className="text-gray-900 font-medium">{slo.holdoutData.testROAS}x</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Control Group (baseline)</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Impressions</span><span className="text-gray-900">{slo.holdoutData.controlImpressions.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Spend</span><span className="text-gray-900">${slo.holdoutData.controlSpend.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Revenue</span><span className="text-gray-900">${slo.holdoutData.controlRevenue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ROAS</span><span className="text-gray-900 font-medium">{slo.holdoutData.controlROAS}x</span></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Lift Calculation: </span>
                <span className="text-sm font-mono text-gray-700">({slo.holdoutData.testROAS} - {slo.holdoutData.controlROAS}) / {slo.holdoutData.controlROAS} = {slo.actual}%</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Confidence: </span>
                <span className={`font-medium ${slo.holdoutData.confidence >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>{slo.holdoutData.confidence}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">View Full Test Report</button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Export Evidence</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Fee Calculation</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Base Fee</span>
            <span className="text-gray-900">${slo.baseFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Target</span>
            <span className="text-gray-900">{slo.target}{slo.unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Actual</span>
            <span className="text-gray-900">{slo.actual}{slo.unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Formula</span>
            <span className="text-gray-700 font-mono text-xs">IF actual &lt; target THEN base × (actual/target)</span>
          </div>
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Adjusted Fee</span>
              <span className="font-bold text-gray-900">${slo.adjustedFee.toLocaleString()}</span>
            </div>
            {slo.baseFee !== slo.adjustedFee && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Savings</span>
                <span className="text-green-600 font-medium">${(slo.baseFee - slo.adjustedFee).toLocaleString()} ({((slo.baseFee - slo.adjustedFee) / slo.baseFee * 100).toFixed(0)}%)</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Override Fee</button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Dispute Measurement</button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Accept & Invoice</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Trend</h3>
        <div className="relative h-40">
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {slo.trend.map((value, i) => {
              const height = (value / Math.max(...slo.trend) * 80);
              const isAtTarget = slo.inverse ? value <= slo.target : value >= slo.target;
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{value}{slo.unit}</span>
                  <div 
                    className={`w-12 rounded-t ${isAtTarget ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-1">{['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i]}</span>
                </div>
              );
            })}
          </div>
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400"
            style={{ top: `${100 - (slo.target / Math.max(...slo.trend) * 80)}%` }}
          >
            <span className="absolute -top-3 right-0 text-xs text-gray-500">Target: {slo.target}{slo.unit}</span>
          </div>
        </div>
        {slo.status !== 'ON_TRACK' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              {slo.status === 'AT_RISK' 
                ? `Agent underperforming since ${slo.trend[slo.trend.length - 1] < slo.target ? 'last period' : 'recently'}. Consider: scope review, vendor discussion, or parameter adjustment.`
                : `SLO breached. Recommend immediate review with vendor. Consider suspension if not remediated within 30 days.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const TrustMetrics = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revoke Velocity</h3>
        <p className="text-sm text-gray-500 mb-4">SLO Target: &lt; {trustMetrics.revokeVelocity.target} hours from decision to verified revocation</p>
        
        <div className="space-y-3">
          {trustMetrics.revokeVelocity.events.map((event, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{event.agent}</p>
                <p className="text-xs text-gray-500">{event.date} · {event.action}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Decision: {event.decision} → Verified: {event.verified}</p>
                <p className={`text-sm font-medium ${event.velocity <= trustMetrics.revokeVelocity.target * 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {event.velocity} min ✓
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Average: </span>
            <span className="font-medium text-gray-900">{trustMetrics.revokeVelocity.average} min</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Max: </span>
            <span className="font-medium text-gray-900">{trustMetrics.revokeVelocity.max} min</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Status: </span>
            <span className="font-medium text-green-600">✓ ON TRACK</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Provenance Rate</h3>
        <p className="text-sm text-gray-500 mb-4">SLO Target: {trustMetrics.provenanceRate.target}% of agent actions have evidence reference</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Coverage</span>
              <span className="text-gray-900">{trustMetrics.provenanceRate.actual}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${trustMetrics.provenanceRate.actual}%` }}
              ></div>
            </div>
          </div>
          <span className="text-green-600 font-medium">✓ ON TRACK</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{trustMetrics.provenanceRate.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Actions</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{trustMetrics.provenanceRate.withEvidence.toLocaleString()}</p>
            <p className="text-xs text-gray-500">With Evidence</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{trustMetrics.provenanceRate.missing}</p>
            <p className="text-xs text-gray-500">Missing</p>
          </div>
        </div>
        
        <button className="mt-4 w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
          View Missing Evidence Report
        </button>
      </div>
    </div>
  );

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Active SLOs</p>
          <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">On Track</p>
          <p className="text-3xl font-bold text-green-600">{summary.onTrack}</p>
          <div className="flex gap-1 mt-2">
            {Array(summary.onTrack).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-green-500"></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">At Risk</p>
          <p className="text-3xl font-bold text-yellow-600">{summary.atRisk}</p>
          <div className="flex gap-1 mt-2">
            {Array(summary.atRisk).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-yellow-500"></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Breached</p>
          <p className="text-3xl font-bold text-red-600">{summary.breached}</p>
          <div className="flex gap-1 mt-2">
            {Array(summary.breached).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-red-500"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Fee Summary</h3>
          <span className="text-sm text-gray-500">{period}</span>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-sm text-gray-500">Base Fees</p>
            <p className="text-2xl font-bold text-gray-900">${summary.baseFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Adjustments</p>
            <p className="text-2xl font-bold text-green-600">-${(summary.baseFees - summary.adjustedFees).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Payable</p>
            <p className="text-2xl font-bold text-blue-600">${summary.adjustedFees.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{agent.id}</h4>
                <p className="text-sm text-gray-500">{agent.name}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-500">Fee: ${agent.slos.reduce((s, slo) => s + slo.adjustedFee, 0).toLocaleString()}</p>
                {agent.slos.reduce((s, slo) => s + slo.baseFee, 0) !== agent.slos.reduce((s, slo) => s + slo.adjustedFee, 0) && (
                  <p className="text-green-600">
                    -{((agent.slos.reduce((s, slo) => s + slo.baseFee, 0) - agent.slos.reduce((s, slo) => s + slo.adjustedFee, 0)) / agent.slos.reduce((s, slo) => s + slo.baseFee, 0) * 100).toFixed(0)}% vs base
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {agent.slos.map(slo => (
                <div 
                  key={slo.id} 
                  onClick={() => setSelectedSLO({ ...slo, agentId: agent.id, agentName: agent.name })}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(slo.type)}`}>
                      {slo.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{slo.metric}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{slo.actual}{slo.unit}</span>
                        <span className="text-gray-400">/ {slo.target}{slo.unit}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${slo.status === 'ON_TRACK' ? 'bg-green-500' : slo.status === 'AT_RISK' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${getProgressWidth(slo.target, slo.actual, slo.inverse)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(slo.status)}`}>
                      {getStatusIcon(slo.status)} {slo.status.replace('_', ' ')}
                    </span>
                    <div className="text-right w-24">
                      <p className="text-sm font-medium text-gray-900">${slo.adjustedFee.toLocaleString()}</p>
                      {slo.baseFee !== slo.adjustedFee && (
                        <p className="text-xs text-green-600">-${(slo.baseFee - slo.adjustedFee).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {selectedSLO ? (
          <SLODetail slo={selectedSLO} onBack={() => setSelectedSLO(null)} />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SLO Ledger</h1>
                <p className="text-gray-500 mt-1">Track agent performance against contracted outcomes</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option>Feb 2025</option>
                  <option>Jan 2025</option>
                  <option>Dec 2024</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                  Export Report
                </button>
              </div>
            </div>

            <div className="flex gap-2 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('trust')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'trust' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Trust Metrics
              </button>
            </div>

            {activeTab === 'overview' ? <Overview /> : <TrustMetrics />}
          </div>
        )}
      </div>
    </div>
  );
};

export default SLOLedger;
