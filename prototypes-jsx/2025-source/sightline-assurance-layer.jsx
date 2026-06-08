import React, { useState } from 'react';

const SightlineAssuranceLayer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCheck, setSelectedCheck] = useState(null);

  // Overall assurance score calculation
  const assuranceMetrics = {
    overall: 97.3,
    reconciliation: { score: 98.5, checks: 24, passed: 23, exceptions: 1 },
    invariants: { score: 100, checks: 12, passed: 12, violations: 0 },
    holdouts: { score: 94.2, tests: 8, validated: 7, disputed: 1 },
    crossSystem: { score: 96.4, comparisons: 156, matched: 150, variance: 6 }
  };

  // External system reconciliations
  const reconciliations = [
    {
      id: 'RECON-001',
      type: 'AP_BALANCE',
      name: 'Accounts Payable Balance',
      period: '2025-02-12',
      sources: {
        sightline: { value: 247500, label: 'Sightline' },
        netsuite: { value: 247500, label: 'NetSuite' },
        billcom: { value: 247500, label: 'Bill.com' }
      },
      status: 'MATCHED',
      variance: 0,
      lastChecked: '2025-02-12 15:00:00'
    },
    {
      id: 'RECON-002',
      type: 'CASH_BALANCE',
      name: 'Operating Cash Balance',
      period: '2025-02-12',
      sources: {
        sightline: { value: 1234567.89, label: 'Sightline' },
        netsuite: { value: 1234567.89, label: 'NetSuite' },
        bank: { value: 1234567.89, label: 'Chase Bank' }
      },
      status: 'MATCHED',
      variance: 0,
      lastChecked: '2025-02-12 06:00:00'
    },
    {
      id: 'RECON-003',
      type: 'INVOICE_COUNT',
      name: 'February Invoice Count',
      period: '2025-02-01 to 2025-02-12',
      sources: {
        sightline: { value: 847, label: 'Sightline' },
        netsuite: { value: 847, label: 'NetSuite' },
        billcom: { value: 849, label: 'Bill.com' }
      },
      status: 'VARIANCE',
      variance: 2,
      variancePct: 0.24,
      varianceExplanation: '2 invoices pending sync from Bill.com API',
      resolution: 'EXPLAINED',
      lastChecked: '2025-02-12 15:00:00'
    },
    {
      id: 'RECON-004',
      type: 'AR_BALANCE',
      name: 'Accounts Receivable Balance',
      period: '2025-02-12',
      sources: {
        sightline: { value: 892450, label: 'Sightline' },
        netsuite: { value: 892450, label: 'NetSuite' },
        salesforce: { value: 895200, label: 'Salesforce' }
      },
      status: 'EXCEPTION',
      variance: 2750,
      variancePct: 0.31,
      varianceExplanation: null,
      resolution: 'PENDING',
      lastChecked: '2025-02-12 15:00:00',
      assignedTo: 'AR Manager'
    },
    {
      id: 'RECON-005',
      type: 'PAYMENT_TOTAL',
      name: 'MTD Payments Disbursed',
      period: '2025-02-01 to 2025-02-12',
      sources: {
        sightline: { value: 1847293.45, label: 'Sightline' },
        netsuite: { value: 1847293.45, label: 'NetSuite' },
        bank: { value: 1847293.45, label: 'Chase Bank' }
      },
      status: 'MATCHED',
      variance: 0,
      lastChecked: '2025-02-12 06:00:00'
    }
  ];

  // Invariant checks
  const invariants = [
    {
      id: 'INV-001',
      name: 'Debits Equal Credits',
      description: 'Total debits must equal total credits across all GL entries',
      query: 'SUM(debits) = SUM(credits)',
      frequency: 'CONTINUOUS',
      lastRun: '2025-02-12 15:30:00',
      status: 'PASS',
      details: { debits: 15847293.45, credits: 15847293.45, variance: 0 }
    },
    {
      id: 'INV-002',
      name: 'No Orphan Finance Entries',
      description: 'Every finance_ledger entry must link to an event',
      query: 'COUNT(finance WHERE event_id IS NULL) = 0',
      frequency: 'HOURLY',
      lastRun: '2025-02-12 15:00:00',
      status: 'PASS',
      details: { totalEntries: 2847, withEvent: 2847, orphans: 0 }
    },
    {
      id: 'INV-003',
      name: 'No Self-Approval (Segregation)',
      description: 'Agent cannot approve entries it proposed',
      query: 'COUNT(propose.actor = approve.actor) = 0',
      frequency: 'CONTINUOUS',
      lastRun: '2025-02-12 15:30:00',
      status: 'PASS',
      details: { proposalsChecked: 124, selfApprovals: 0 }
    },
    {
      id: 'INV-004',
      name: 'Evidence Completeness',
      description: 'Every event must have evidence reference',
      query: 'COUNT(events WHERE evidence_ref IS NULL) = 0',
      frequency: 'HOURLY',
      lastRun: '2025-02-12 15:00:00',
      status: 'PASS',
      details: { totalEvents: 45847, withEvidence: 45755, missing: 92, coverage: 99.8 }
    },
    {
      id: 'INV-005',
      name: 'Policy Version Active',
      description: 'Every event must reference an active policy version',
      query: 'COUNT(events WHERE policy.status != ACTIVE) = 0',
      frequency: 'CONTINUOUS',
      lastRun: '2025-02-12 15:30:00',
      status: 'PASS',
      details: { eventsChecked: 847, activePolicy: 847, deprecated: 0 }
    },
    {
      id: 'INV-006',
      name: 'Agent Within Transaction Limits',
      description: 'No agent transaction exceeds its defined limit',
      query: 'COUNT(txn WHERE amount > agent.limit) = 0',
      frequency: 'CONTINUOUS',
      lastRun: '2025-02-12 15:30:00',
      status: 'PASS',
      details: { transactionsChecked: 847, withinLimits: 847, exceeded: 0 }
    },
    {
      id: 'INV-007',
      name: 'GL Account Access Control',
      description: 'Agents only post to authorized GL accounts',
      query: 'COUNT(posts WHERE gl NOT IN agent.gl_access) = 0',
      frequency: 'CONTINUOUS',
      lastRun: '2025-02-12 15:30:00',
      status: 'PASS',
      details: { postsChecked: 2134, authorized: 2134, unauthorized: 0 }
    },
    {
      id: 'INV-008',
      name: 'Credential Validity',
      description: 'No active agent has expired credentials',
      query: 'COUNT(agents WHERE status=ACTIVE AND cred_expires < NOW) = 0',
      frequency: 'DAILY',
      lastRun: '2025-02-12 00:00:00',
      status: 'PASS',
      details: { activeAgents: 7, validCreds: 7, expired: 0 }
    }
  ];

  // Holdout validation tests
  const holdoutTests = [
    {
      id: 'HOLD-001',
      sloName: 'AP Auto-Match Rate',
      agent: 'AGT-AP-001',
      period: '2025-02',
      production: { sampleSize: 847, result: 94.2 },
      holdout: { sampleSize: 50, result: 94.0, verifiedBy: 'AP Supervisor' },
      variance: 0.2,
      toleranceThreshold: 5.0,
      status: 'VALIDATED',
      validatedAt: '2025-02-12 10:00:00'
    },
    {
      id: 'HOLD-002',
      sloName: 'GL Coding Accuracy',
      agent: 'AGT-AP-001',
      period: '2025-02',
      production: { sampleSize: 847, result: 97.2 },
      holdout: { sampleSize: 50, result: 96.0, verifiedBy: 'Staff Accountant' },
      variance: 1.2,
      toleranceThreshold: 5.0,
      status: 'VALIDATED',
      validatedAt: '2025-02-12 10:00:00'
    },
    {
      id: 'HOLD-003',
      sloName: 'Expense Violation Detection',
      agent: 'AGT-EXP-001',
      period: '2025-02',
      production: { sampleSize: 234, result: 87.5 },
      holdout: { sampleSize: 30, result: 80.0, verifiedBy: 'Controller' },
      variance: 7.5,
      toleranceThreshold: 5.0,
      status: 'DISPUTED',
      disputeReason: 'Holdout sample shows agent missing policy violations human reviewers caught',
      disputedAt: '2025-02-12 11:00:00',
      assignedTo: 'Vendor: ExpenseGuard'
    },
    {
      id: 'HOLD-004',
      sloName: 'Bank Reconciliation Match Rate',
      agent: 'AGT-REC-001',
      period: '2025-02',
      production: { sampleSize: 1420, result: 99.2 },
      holdout: { sampleSize: 100, result: 99.0, verifiedBy: 'Treasury Analyst' },
      variance: 0.2,
      toleranceThreshold: 2.0,
      status: 'VALIDATED',
      validatedAt: '2025-02-11 14:00:00'
    },
    {
      id: 'HOLD-005',
      sloName: 'JE Documentation Rate',
      agent: 'AGT-JE-001',
      period: '2025-02',
      production: { sampleSize: 124, result: 100.0 },
      holdout: { sampleSize: 25, result: 100.0, verifiedBy: 'Senior Accountant' },
      variance: 0.0,
      toleranceThreshold: 2.0,
      status: 'VALIDATED',
      validatedAt: '2025-02-11 16:00:00'
    },
    {
      id: 'HOLD-006',
      sloName: 'Collection Contact Rate',
      agent: 'AGT-AR-001',
      period: '2025-02',
      production: { sampleSize: 89, result: 100.0 },
      holdout: { sampleSize: 20, result: 100.0, verifiedBy: 'AR Manager' },
      variance: 0.0,
      toleranceThreshold: 3.0,
      status: 'VALIDATED',
      validatedAt: '2025-02-10 09:00:00'
    }
  ];

  // Cross-system comparisons (real-time checks)
  const crossSystemChecks = [
    {
      id: 'XS-001',
      name: 'NetSuite Invoice Sync',
      sightlineCount: 847,
      externalCount: 847,
      status: 'MATCHED',
      lastSync: '2025-02-12 15:25:00',
      latency: '< 1 min'
    },
    {
      id: 'XS-002',
      name: 'Bill.com Payment Status',
      sightlineCount: 156,
      externalCount: 156,
      status: 'MATCHED',
      lastSync: '2025-02-12 15:20:00',
      latency: '< 5 min'
    },
    {
      id: 'XS-003',
      name: 'Expensify Report Count',
      sightlineCount: 234,
      externalCount: 234,
      status: 'MATCHED',
      lastSync: '2025-02-12 15:15:00',
      latency: '< 1 min'
    },
    {
      id: 'XS-004',
      name: 'Plaid Transaction Feed',
      sightlineCount: 1420,
      externalCount: 1420,
      status: 'MATCHED',
      lastSync: '2025-02-12 06:00:00',
      latency: 'Daily batch'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'MATCHED':
      case 'PASS':
      case 'VALIDATED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'VARIANCE':
      case 'EXPLAINED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EXCEPTION':
      case 'FAIL':
      case 'DISPUTED':
      case 'PENDING':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'MATCHED':
      case 'PASS':
      case 'VALIDATED':
        return '✓';
      case 'VARIANCE':
      case 'EXPLAINED':
        return '~';
      case 'EXCEPTION':
      case 'FAIL':
      case 'DISPUTED':
      case 'PENDING':
        return '✗';
      default:
        return '?';
    }
  };

  const ScoreGauge = ({ score, label, size = 'large' }) => {
    const radius = size === 'large' ? 60 : 40;
    const stroke = size === 'large' ? 8 : 6;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const color = score >= 95 ? '#10b981' : score >= 85 ? '#f59e0b' : '#ef4444';
    
    return (
      <div className="flex flex-col items-center">
        <svg width={radius * 2 + stroke * 2} height={radius * 2 + stroke * 2} className="transform -rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute flex flex-col items-center justify-center ${size === 'large' ? 'mt-8' : 'mt-5'}`}>
          <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-xl'}`} style={{ color }}>{score}%</span>
        </div>
        {label && <p className="text-sm text-gray-600 mt-2">{label}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-bold text-gray-900">Sightline Assurance Layer</h1>
          </div>
          <p className="text-gray-600">Continuous verification through reconciliation, invariant checking, and holdout validation</p>
        </div>

        {/* Overall Assurance Score */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-5 gap-6">
            {/* Main Score */}
            <div className="col-span-1 flex flex-col items-center justify-center border-r border-gray-200">
              <div className="relative">
                <ScoreGauge score={assuranceMetrics.overall} size="large" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mt-4">Overall Assurance</p>
              <p className="text-sm text-gray-500">Last updated: 15:30:00</p>
            </div>

            {/* Component Scores */}
            <div className="col-span-4 grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="relative inline-block">
                  <ScoreGauge score={assuranceMetrics.reconciliation.score} size="small" />
                </div>
                <p className="font-medium text-gray-900 mt-3">Reconciliation</p>
                <p className="text-sm text-gray-500">{assuranceMetrics.reconciliation.passed}/{assuranceMetrics.reconciliation.checks} passed</p>
                {assuranceMetrics.reconciliation.exceptions > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    {assuranceMetrics.reconciliation.exceptions} exception
                  </span>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="relative inline-block">
                  <ScoreGauge score={assuranceMetrics.invariants.score} size="small" />
                </div>
                <p className="font-medium text-gray-900 mt-3">Invariants</p>
                <p className="text-sm text-gray-500">{assuranceMetrics.invariants.passed}/{assuranceMetrics.invariants.checks} passing</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  All healthy
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="relative inline-block">
                  <ScoreGauge score={assuranceMetrics.holdouts.score} size="small" />
                </div>
                <p className="font-medium text-gray-900 mt-3">Holdout Tests</p>
                <p className="text-sm text-gray-500">{assuranceMetrics.holdouts.validated}/{assuranceMetrics.holdouts.tests} validated</p>
                {assuranceMetrics.holdouts.disputed > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    {assuranceMetrics.holdouts.disputed} disputed
                  </span>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="relative inline-block">
                  <ScoreGauge score={assuranceMetrics.crossSystem.score} size="small" />
                </div>
                <p className="font-medium text-gray-900 mt-3">Cross-System</p>
                <p className="text-sm text-gray-500">{assuranceMetrics.crossSystem.matched}/{assuranceMetrics.crossSystem.comparisons} matched</p>
                {assuranceMetrics.crossSystem.variance > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    {assuranceMetrics.crossSystem.variance} variance
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'reconciliation', label: 'Reconciliation', icon: '🔄' },
            { id: 'invariants', label: 'Invariants', icon: '⚖️' },
            { id: 'holdouts', label: 'Holdout Tests', icon: '🎯' },
            { id: 'crossSystem', label: 'Cross-System', icon: '🔗' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* How Assurance Works */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How Assurance Works</h2>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-3xl mb-2">🔄</div>
                  <h3 className="font-medium text-blue-900">External Reconciliation</h3>
                  <p className="text-sm text-blue-700 mt-1">Compare Sightline balances against NetSuite, Bank, Bill.com</p>
                  <p className="text-xs text-blue-600 mt-2">Runs: Hourly + Daily</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-3xl mb-2">⚖️</div>
                  <h3 className="font-medium text-purple-900">Invariant Checking</h3>
                  <p className="text-sm text-purple-700 mt-1">Mathematical rules that must always hold true</p>
                  <p className="text-xs text-purple-600 mt-2">Runs: Continuous</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-medium text-amber-900">Holdout Validation</h3>
                  <p className="text-sm text-amber-700 mt-1">Human-verified samples to validate agent measurements</p>
                  <p className="text-xs text-amber-600 mt-2">Runs: Per SLO Period</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-3xl mb-2">🔗</div>
                  <h3 className="font-medium text-green-900">Cross-System Sync</h3>
                  <p className="text-sm text-green-700 mt-1">Real-time count matching across integrated systems</p>
                  <p className="text-xs text-green-600 mt-2">Runs: Per Sync</p>
                </div>
              </div>
            </div>

            {/* Open Exceptions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🚨 Open Exceptions Requiring Attention</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="font-medium text-red-900">AR Balance Reconciliation Exception</p>
                      <p className="text-sm text-red-700">Sightline: $892,450 vs Salesforce: $895,200 (Δ $2,750)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">PENDING</span>
                    <p className="text-xs text-red-600 mt-1">Assigned: AR Manager</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-medium text-red-900">Holdout Dispute: Expense Violation Detection</p>
                      <p className="text-sm text-red-700">Agent: 87.5% vs Holdout: 80.0% (Δ 7.5%, threshold 5%)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">DISPUTED</span>
                    <p className="text-xs text-red-600 mt-1">Assigned: ExpenseGuard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assurance Events */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Assurance Events</h2>
              <div className="space-y-2">
                {[
                  { time: '15:30:00', type: 'INVARIANT_CHECKED', detail: 'All 12 invariants passing', status: 'PASS' },
                  { time: '15:25:00', type: 'CROSS_SYSTEM_MATCHED', detail: 'NetSuite invoice sync: 847/847', status: 'MATCHED' },
                  { time: '15:00:00', type: 'RECON_COMPLETED', detail: 'AP Balance three-way match', status: 'MATCHED' },
                  { time: '15:00:00', type: 'RECON_EXCEPTION', detail: 'AR Balance variance $2,750', status: 'EXCEPTION' },
                  { time: '11:00:00', type: 'HOLDOUT_DISPUTED', detail: 'Expense violation detection failed validation', status: 'DISPUTED' },
                  { time: '10:00:00', type: 'HOLDOUT_VALIDATED', detail: 'AP Auto-match rate confirmed 94.2%', status: 'VALIDATED' },
                  { time: '06:00:00', type: 'RECON_COMPLETED', detail: 'Cash balance three-way match', status: 'MATCHED' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono w-20">{event.time}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.type}
                      </span>
                      <span className="text-sm text-gray-700">{event.detail}</span>
                    </div>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reconciliation' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">External System Reconciliation</h2>
                <p className="text-sm text-gray-500">Three-way matching against source systems</p>
              </div>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">
                Run All Reconciliations
              </button>
            </div>

            <div className="space-y-4">
              {reconciliations.map(recon => (
                <div key={recon.id} className={`rounded-lg border-2 p-4 ${
                  recon.status === 'MATCHED' ? 'border-green-200 bg-green-50' :
                  recon.status === 'VARIANCE' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{recon.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(recon.status)}`}>
                          {recon.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{recon.period}</p>
                    </div>
                    <p className="text-xs text-gray-500">Last checked: {recon.lastChecked}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {Object.entries(recon.sources).map(([key, source]) => (
                      <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">{source.label}</p>
                        <p className="text-lg font-bold text-gray-900">
                          {typeof source.value === 'number' 
                            ? source.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).replace('$', recon.type.includes('COUNT') ? '' : '$')
                            : source.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {recon.variance !== 0 && (
                    <div className={`rounded-lg p-3 ${recon.status === 'VARIANCE' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Variance: {recon.variance.toLocaleString()} ({recon.variancePct}%)</p>
                          {recon.varianceExplanation && (
                            <p className="text-sm text-gray-600 mt-1">📝 {recon.varianceExplanation}</p>
                          )}
                        </div>
                        {recon.resolution === 'PENDING' && (
                          <div className="text-right">
                            <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-medium">Needs Resolution</span>
                            <p className="text-xs text-gray-600 mt-1">Assigned: {recon.assignedTo}</p>
                          </div>
                        )}
                        {recon.resolution === 'EXPLAINED' && (
                          <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">✓ Explained</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invariants' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Invariant Health Monitor</h2>
                <p className="text-sm text-gray-500">Mathematical rules that must always hold true</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✓ {invariants.filter(i => i.status === 'PASS').length}/{invariants.length} Passing
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {invariants.map(inv => (
                <div key={inv.id} className={`rounded-lg border-2 p-4 ${
                  inv.status === 'PASS' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                        inv.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {inv.status === 'PASS' ? '✓' : '✗'}
                      </span>
                      <h3 className="font-semibold text-gray-900">{inv.name}</h3>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{inv.frequency}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{inv.description}</p>
                  
                  <div className="bg-white rounded p-2 mb-2">
                    <code className="text-xs text-gray-700">{inv.query}</code>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last run: {inv.lastRun}</span>
                    {inv.details && (
                      <span className="text-green-700">
                        {inv.details.coverage ? `Coverage: ${inv.details.coverage}%` : 
                         inv.details.variance !== undefined ? `Variance: ${inv.details.variance}` :
                         inv.details.orphans !== undefined ? `Orphans: ${inv.details.orphans}` :
                         inv.details.selfApprovals !== undefined ? `Violations: ${inv.details.selfApprovals}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'holdouts' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Holdout Validation Tests</h2>
                <p className="text-sm text-gray-500">Human-verified samples to validate agent SLO measurements</p>
              </div>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">
                Schedule New Holdout
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SLO / Agent</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Production</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Holdout</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Variance</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Threshold</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {holdoutTests.map(test => (
                    <tr key={test.id} className={`border-b border-gray-100 ${
                      test.status === 'DISPUTED' ? 'bg-red-50' : ''
                    }`}>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{test.sloName}</p>
                        <p className="text-sm text-gray-500">{test.agent}</p>
                      </td>
                      <td className="text-center py-4 px-4">
                        <p className="font-bold text-gray-900">{test.production.result}%</p>
                        <p className="text-xs text-gray-500">n={test.production.sampleSize}</p>
                      </td>
                      <td className="text-center py-4 px-4">
                        <p className="font-bold text-gray-900">{test.holdout.result}%</p>
                        <p className="text-xs text-gray-500">n={test.holdout.sampleSize}</p>
                        <p className="text-xs text-gray-400">{test.holdout.verifiedBy}</p>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`font-bold ${
                          test.variance <= test.toleranceThreshold ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {test.variance}%
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="text-gray-600">±{test.toleranceThreshold}%</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        {test.status === 'DISPUTED' && (
                          <p className="text-xs text-red-600 mt-1">{test.assignedTo}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Holdout Explanation */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">How Holdout Validation Works</h3>
              <div className="grid grid-cols-4 gap-4 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Agent processes all transactions and reports metric (e.g., 94.2% auto-match)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Random sample extracted for human review (e.g., 50 invoices)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Human reviewer independently measures same metric on sample</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>If variance exceeds threshold, SLO measurement is disputed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crossSystem' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cross-System Sync Status</h2>
                <p className="text-sm text-gray-500">Real-time count matching across integrated systems</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                All Systems Synced
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {crossSystemChecks.map(check => (
                <div key={check.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{check.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                      {check.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-slate-50 rounded p-3 text-center">
                      <p className="text-xs text-gray-500">Sightline</p>
                      <p className="text-xl font-bold text-gray-900">{check.sightlineCount.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded p-3 text-center">
                      <p className="text-xs text-gray-500">External</p>
                      <p className="text-xl font-bold text-gray-900">{check.externalCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last sync: {check.lastSync}</span>
                    <span>Latency: {check.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Diagram */}
            <div className="mt-6 p-6 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 text-center">Integration Architecture</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-2">📊</div>
                  <p className="text-xs text-gray-600">NetSuite</p>
                </div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-3xl mb-2">🛡️</div>
                  <p className="text-sm font-medium text-gray-900">Sightline</p>
                </div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-2">🏦</div>
                  <p className="text-xs text-gray-600">Bank (Plaid)</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-2">📄</div>
                  <p className="text-xs text-gray-600">Bill.com</p>
                </div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="w-20 h-20"></div>
                <div className="text-2xl text-gray-400">↔</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center text-2xl mb-2">🧾</div>
                  <p className="text-xs text-gray-600">Expensify</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* The Guarantee */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">The Assurance Guarantee</h3>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Every dollar in Sightline is continuously verified through external reconciliation, 
            mathematical invariants, human holdout samples, and cross-system sync. 
            When sources disagree, exceptions surface immediately for resolution.
          </p>
          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{assuranceMetrics.reconciliation.checks}</p>
              <p className="text-sm text-slate-400">Reconciliation Checks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{assuranceMetrics.invariants.checks}</p>
              <p className="text-sm text-slate-400">Invariants Monitored</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">{assuranceMetrics.holdouts.tests}</p>
              <p className="text-sm text-slate-400">Holdout Validations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{crossSystemChecks.length}</p>
              <p className="text-sm text-slate-400">Systems Integrated</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SightlineAssuranceLayer;
