import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/*
 * SIGHTLINE - Complete Clickable Prototype v2
 * ============================================
 * Enhanced with:
 * - Income Statement with account-level drill-down
 * - Vendor and invoice detail views
 * - Budget vs Actuals comparison
 */

// ============================================
// FINANCIAL DATA - INCOME STATEMENT STRUCTURE
// ============================================

const incomeStatement = {
  revenue: {
    label: 'Revenue',
    budget: 8500000,
    actual: 8720000,
    accounts: [
      { 
        code: '4100', 
        name: 'Membership Dues', 
        budget: 6200000, 
        actual: 6350000,
        vendors: [
          { name: 'Member Dues - Annual', invoices: [
            { id: 'INV-2024-001', date: 'Jan 15', amount: 2100000, status: 'paid' },
            { id: 'INV-2024-045', date: 'Apr 15', amount: 2125000, status: 'paid' },
            { id: 'INV-2024-089', date: 'Jul 15', amount: 2125000, status: 'paid' },
          ]},
        ]
      },
      { 
        code: '4200', 
        name: 'F&B Revenue', 
        budget: 1400000, 
        actual: 1520000,
        vendors: [
          { name: 'Restaurant Sales', invoices: [
            { id: 'POS-Dec-001', date: 'Dec 1-7', amount: 38500, status: 'posted' },
            { id: 'POS-Dec-002', date: 'Dec 8-14', amount: 42100, status: 'posted' },
          ]},
          { name: 'Banquet Events', invoices: [
            { id: 'BNQ-2024-127', date: 'Dec 7', amount: 18500, status: 'paid', desc: 'Johnson Wedding' },
            { id: 'BNQ-2024-128', date: 'Dec 14', amount: 24200, status: 'pending', desc: 'Corporate Holiday Party' },
          ]},
        ]
      },
      { 
        code: '4300', 
        name: 'Golf Operations', 
        budget: 650000, 
        actual: 580000,
        vendors: [
          { name: 'Green Fees', invoices: [
            { id: 'GF-Dec-W1', date: 'Dec 1-7', amount: 12400, status: 'posted' },
            { id: 'GF-Dec-W2', date: 'Dec 8-14', amount: 11800, status: 'posted' },
          ]},
          { name: 'Cart Rentals', invoices: [
            { id: 'CART-Dec-W1', date: 'Dec 1-7', amount: 4200, status: 'posted' },
          ]},
          { name: 'Pro Shop Sales', invoices: [
            { id: 'PS-Dec-001', date: 'Dec 9', amount: 8750, status: 'posted' },
          ]},
        ]
      },
      { 
        code: '4400', 
        name: 'Other Income', 
        budget: 250000, 
        actual: 270000,
        vendors: [
          { name: 'Locker Rentals', invoices: [
            { id: 'LKR-2024-Q4', date: 'Oct 1', amount: 45000, status: 'paid' },
          ]},
          { name: 'Guest Fees', invoices: [
            { id: 'GUE-Dec', date: 'Dec 1-14', amount: 8200, status: 'posted' },
          ]},
        ]
      },
    ]
  },
  expenses: {
    label: 'Operating Expenses',
    budget: 6240000,
    actual: 6502000,
    accounts: [
      { 
        code: '5100', 
        name: 'Payroll & Benefits', 
        budget: 2400000, 
        actual: 2380000,
        vendors: [
          { name: 'ADP Payroll Services', invoices: [
            { id: 'ADP-2024-23', date: 'Dec 1', amount: 198450, status: 'paid', desc: 'Bi-weekly payroll' },
            { id: 'ADP-2024-24', date: 'Dec 15', amount: 198450, status: 'pending', desc: 'Bi-weekly payroll' },
          ]},
          { name: 'Blue Cross Blue Shield', invoices: [
            { id: 'BCBS-Dec', date: 'Dec 1', amount: 48200, status: 'paid', desc: 'Monthly premium' },
          ]},
          { name: 'Fidelity 401k', invoices: [
            { id: 'FID-Dec', date: 'Dec 5', amount: 24100, status: 'paid', desc: 'Monthly contribution' },
          ]},
        ]
      },
      { 
        code: '5200', 
        name: 'Food & Beverage Cost', 
        budget: 1800000, 
        actual: 1920000,
        vendors: [
          { name: 'Sysco Foods', invoices: [
            { id: 'SYS-847291', date: 'Dec 8', amount: 34200, status: 'paid', desc: 'Weekly food order' },
            { id: 'SYS-847456', date: 'Dec 15', amount: 31800, status: 'pending', desc: 'Weekly food order' },
          ]},
          { name: 'Southern Wine & Spirits', invoices: [
            { id: 'SWS-12847', date: 'Dec 5', amount: 18400, status: 'paid', desc: 'Beverage restock' },
          ]},
          { name: 'US Foods', invoices: [
            { id: 'USF-98721', date: 'Dec 10', amount: 12600, status: 'paid', desc: 'Specialty items' },
          ]},
        ]
      },
      { 
        code: '5300', 
        name: 'Golf Course Maintenance', 
        budget: 950000, 
        actual: 1008000,
        vendors: [
          { name: 'Toro Equipment Co.', invoices: [
            { id: 'TORO-2024-1847', date: 'Dec 9', amount: 47500, status: 'paid', desc: 'Mower parts & service', hasDoc: true },
          ]},
          { name: 'Premium Landscaping LLC', invoices: [
            { id: 'PL-2024-089', date: 'Dec 8', amount: 28000, status: 'flagged', desc: 'Monthly grounds service', flagged: true },
          ]},
          { name: 'SiteOne Landscape Supply', invoices: [
            { id: 'S1-458721', date: 'Dec 3', amount: 8900, status: 'paid', desc: 'Fertilizer & chemicals' },
          ]},
          { name: 'Rain Bird', invoices: [
            { id: 'RB-2024-42', date: 'Nov 28', amount: 12400, status: 'paid', desc: 'Irrigation repairs' },
          ]},
        ]
      },
      { 
        code: '5400', 
        name: 'Utilities', 
        budget: 420000, 
        actual: 485000,
        vendors: [
          { name: 'Florida Power & Light', invoices: [
            { id: 'FPL-Dec', date: 'Dec 6', amount: 18750, status: 'paid', desc: 'Monthly electric', hasDoc: true },
            { id: 'FPL-Nov', date: 'Nov 6', amount: 22100, status: 'paid', desc: 'Monthly electric', hasDoc: true },
          ]},
          { name: 'Palm Beach Water Utility', invoices: [
            { id: 'PBWU-Dec', date: 'Dec 10', amount: 8400, status: 'pending', desc: 'Monthly water/sewer' },
          ]},
          { name: 'TECO Peoples Gas', invoices: [
            { id: 'TECO-Dec', date: 'Dec 8', amount: 4200, status: 'paid', desc: 'Monthly gas' },
          ]},
        ]
      },
      { 
        code: '5500', 
        name: 'Insurance', 
        budget: 380000, 
        actual: 462000,
        vendors: [
          { name: 'Hartford Insurance', invoices: [
            { id: 'HART-2024-Q4', date: 'Oct 1', amount: 156000, status: 'paid', desc: 'Quarterly property/liability', hasDoc: true },
          ]},
          { name: 'Travelers', invoices: [
            { id: 'TRAV-Dec', date: 'Dec 1', amount: 28500, status: 'paid', desc: "Monthly workers' comp" },
          ]},
        ]
      },
      { 
        code: '5600', 
        name: 'Admin & Professional', 
        budget: 290000, 
        actual: 247000,
        vendors: [
          { name: 'Smith & Associates CPA', invoices: [
            { id: 'SA-2024-12', date: 'Dec 1', amount: 4500, status: 'paid', desc: 'Monthly accounting' },
          ]},
          { name: 'Carlton Fields LLP', invoices: [
            { id: 'CF-2024-089', date: 'Nov 15', amount: 8200, status: 'paid', desc: 'Legal consultation' },
          ]},
          { name: 'Microsoft 365', invoices: [
            { id: 'MS-Dec', date: 'Dec 1', amount: 1200, status: 'paid', desc: 'Monthly subscription' },
          ]},
        ]
      },
    ]
  }
};

const monthlyBudgetActuals = [
  { month: 'Jul', budget: 520000, actual: 485000 },
  { month: 'Aug', budget: 520000, actual: 542000 },
  { month: 'Sep', budget: 520000, actual: 558000 },
  { month: 'Oct', budget: 520000, actual: 534000 },
  { month: 'Nov', budget: 520000, actual: 578000 },
  { month: 'Dec', budget: 520000, actual: 502000 },
];

const cashFlowData = [
  { month: 'Jul', operating: 1850000, reserves: 4200000 },
  { month: 'Aug', operating: 1720000, reserves: 4150000 },
  { month: 'Sep', operating: 1680000, reserves: 4100000 },
  { month: 'Oct', operating: 1890000, reserves: 4050000 },
  { month: 'Nov', operating: 1950000, reserves: 3850000 },
  { month: 'Dec', operating: 2100000, reserves: 3710000 },
];

const users = [
  { id: 1, name: 'James Wilson', email: 'jwilson@palmharbor.club', role: 'Admin', initials: 'JW' },
  { id: 2, name: 'Margaret Chen', email: 'mchen@email.com', role: 'Treasurer', initials: 'MC' },
  { id: 3, name: 'Robert Patterson', email: 'rpatterson@email.com', role: 'Board', initials: 'RP' },
];

const fmt = (v) => {
  const abs = Math.abs(v);
  if (abs >= 1e6) return `$${(v/1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(v/1e3).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
};

const fmtFull = (v) => `$${v.toLocaleString()}`;

// ============================================
// MAIN APP
// ============================================

export default function SightlinePrototype() {
  const [screen, setScreen] = useState('overview');
  const [onboardStep, setOnboardStep] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [notifs, setNotifs] = useState({ anomaly: true, weekly: true, budget: false, large: true });

  const nav = (s) => { 
    setScreen(s); 
    setOnboardStep(0); 
    setExpandedSection(null);
    setExpandedAccount(null);
    setExpandedVendor(null);
    setSelectedInvoice(null);
  };

  const totalRevenue = incomeStatement.revenue.actual;
  const totalExpenses = incomeStatement.expenses.actual;
  const netIncome = totalRevenue - totalExpenses;
  const budgetVariance = (totalRevenue - incomeStatement.revenue.budget) - (totalExpenses - incomeStatement.expenses.budget);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        .glass { background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); }
        .card { background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04); }
        .btn-primary { background: linear-gradient(135deg, #292524, #44403c); color: white; }
        .severity-high { background: #fef2f2; border-left: 3px solid #ef4444; }
        .severity-medium { background: #fffbeb; border-left: 3px solid #f59e0b; }
        .severity-low { background: #f0fdf4; border-left: 3px solid #22c55e; }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } }
        .mobile-frame { width: 375px; height: 812px; border-radius: 44px; border: 8px solid #1a1a1a; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .row-hover:hover { background: #fafaf9; }
        .drill-row { border-left: 3px solid #e7e5e4; }
        .drill-row-l2 { border-left: 3px solid #d6d3d1; margin-left: 1rem; }
        .drill-row-l3 { border-left: 3px solid #a8a29e; margin-left: 2rem; }
      `}</style>

      {/* NAV */}
      <nav className="glass sticky top-0 z-50 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-display text-xl font-semibold text-stone-800">Sightline</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">PROTOTYPE</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Dashboard', icon: '💻' },
              { id: 'income-statement', label: 'Income Statement', icon: '📋' },
              { id: 'budget-vs-actual', label: 'Budget vs Actual', icon: '📊' },
              { id: 'anomaly', label: 'Anomaly', icon: '⚠️' },
              { id: 'mobile', label: 'Mobile', icon: '📱' },
              { id: 'onboarding', label: 'Onboarding', icon: '🚀' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map(t => (
              <button key={t.id} onClick={() => nav(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${screen === t.id ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-50 shadow-sm'}`}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ===== DASHBOARD ===== */}
        {screen === 'overview' && (
          <div className="fade-in space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold text-stone-800">Palm Harbor Country Club</h1>
                <p className="text-stone-500 mt-1">Financial Overview · December 2024</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white font-medium">JW</div>
            </div>

            {/* Alert */}
            <div className="card p-4 border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-white cursor-pointer" onClick={() => nav('anomaly')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">⚠️</div>
                  <div>
                    <div className="font-medium text-stone-800">1 transaction requires attention</div>
                    <div className="text-sm text-stone-500">Premium Landscaping LLC - $28,000 flagged</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">Review</button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('income-statement')}>
                <div className="text-xs text-stone-400 uppercase tracking-wider">YTD Revenue</div>
                <div className="font-display text-2xl font-semibold text-stone-800 mt-1">{fmt(totalRevenue)}</div>
                <div className="text-sm text-emerald-600 mt-1">+{fmt(totalRevenue - incomeStatement.revenue.budget)} vs budget</div>
              </div>
              <div className="card p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('income-statement')}>
                <div className="text-xs text-stone-400 uppercase tracking-wider">YTD Expenses</div>
                <div className="font-display text-2xl font-semibold text-stone-800 mt-1">{fmt(totalExpenses)}</div>
                <div className="text-sm text-red-600 mt-1">+{fmt(totalExpenses - incomeStatement.expenses.budget)} vs budget</div>
              </div>
              <div className="card p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('budget-vs-actual')}>
                <div className="text-xs text-stone-400 uppercase tracking-wider">Net Income</div>
                <div className="font-display text-2xl font-semibold text-emerald-600 mt-1">{fmt(netIncome)}</div>
                <div className="text-sm text-stone-500 mt-1">{((netIncome / totalRevenue) * 100).toFixed(1)}% margin</div>
              </div>
              <div className="card p-5">
                <div className="text-xs text-stone-400 uppercase tracking-wider">Health Score</div>
                <div className="font-display text-2xl font-semibold text-stone-800 mt-1">72/100</div>
                <div className="text-sm text-stone-500 mt-1">Good standing</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold text-stone-800 mb-4">Budget vs Actual (Monthly)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyBudgetActuals} barGap={2}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={v => `$${v/1000}K`} />
                    <Tooltip formatter={(v) => [fmtFull(v), '']} />
                    <Bar dataKey="budget" fill="#d6d3d1" radius={[4, 4, 0, 0]} name="Budget" />
                    <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="Actual">
                      {monthlyBudgetActuals.map((entry, index) => (
                        <Cell key={index} fill={entry.actual > entry.budget ? '#f59e0b' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-stone-300"></div>Budget</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div>Under</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div>Over</div>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold text-stone-800 mb-4">Cash & Reserves</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={v => `$${v/1e6}M`} />
                    <Tooltip formatter={(v) => [fmt(v), '']} />
                    <Area type="monotone" dataKey="reserves" stroke="#3b82f6" strokeWidth={2} fill="url(#g2)" />
                    <Area type="monotone" dataKey="operating" stroke="#10b981" strokeWidth={2} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Operating</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Reserves</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('income-statement')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">📋</div>
                  <div>
                    <div className="font-medium text-stone-800">Income Statement</div>
                    <div className="text-sm text-stone-500">Drill down to vendor & invoice</div>
                  </div>
                </div>
              </div>
              <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('budget-vs-actual')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">📊</div>
                  <div>
                    <div className="font-medium text-stone-800">Budget vs Actual</div>
                    <div className="text-sm text-stone-500">Variance analysis by account</div>
                  </div>
                </div>
              </div>
              <div className="card p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => nav('anomaly')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">⚠️</div>
                  <div>
                    <div className="font-medium text-stone-800">Review Flagged</div>
                    <div className="text-sm text-stone-500">1 item needs attention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== INCOME STATEMENT WITH DRILL-DOWN ===== */}
        {screen === 'income-statement' && (
          <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-semibold text-stone-800">Income Statement</h1>
                <p className="text-stone-500">Year-to-Date through December 2024 · Click to drill down</p>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-stone-200 rounded-xl bg-white text-sm">
                  <option>YTD 2024</option>
                  <option>Q4 2024</option>
                  <option>December 2024</option>
                </select>
                <button className="px-4 py-2 btn-primary rounded-xl text-sm font-medium">Export</button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="card p-4 bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-600 uppercase">Total Revenue</div>
                <div className="font-display text-2xl font-semibold text-emerald-700">{fmt(totalRevenue)}</div>
              </div>
              <div className="card p-4 bg-red-50 border border-red-200">
                <div className="text-xs text-red-600 uppercase">Total Expenses</div>
                <div className="font-display text-2xl font-semibold text-red-700">{fmt(totalExpenses)}</div>
              </div>
              <div className="card p-4 bg-blue-50 border border-blue-200">
                <div className="text-xs text-blue-600 uppercase">Net Income</div>
                <div className="font-display text-2xl font-semibold text-blue-700">{fmt(netIncome)}</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-stone-500 uppercase">Net Margin</div>
                <div className="font-display text-2xl font-semibold text-stone-800">{((netIncome / totalRevenue) * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Income Statement Table */}
            <div className="card overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-stone-100 text-xs font-medium text-stone-500 uppercase tracking-wider">
                <div className="col-span-5">Account</div>
                <div className="col-span-2 text-right">Budget</div>
                <div className="col-span-2 text-right">Actual</div>
                <div className="col-span-2 text-right">Variance</div>
                <div className="col-span-1 text-right">%</div>
              </div>

              {/* Revenue Section */}
              <div 
                className="grid grid-cols-12 gap-4 p-4 bg-emerald-50 cursor-pointer row-hover border-b border-stone-100"
                onClick={() => setExpandedSection(expandedSection === 'revenue' ? null : 'revenue')}
              >
                <div className="col-span-5 font-semibold text-emerald-800 flex items-center gap-2">
                  <span className={`transition-transform ${expandedSection === 'revenue' ? 'rotate-90' : ''}`}>→</span>
                  {incomeStatement.revenue.label}
                </div>
                <div className="col-span-2 text-right text-stone-600">{fmt(incomeStatement.revenue.budget)}</div>
                <div className="col-span-2 text-right font-medium text-emerald-700">{fmt(incomeStatement.revenue.actual)}</div>
                <div className="col-span-2 text-right text-emerald-600">+{fmt(incomeStatement.revenue.actual - incomeStatement.revenue.budget)}</div>
                <div className="col-span-1 text-right text-emerald-600">+{(((incomeStatement.revenue.actual - incomeStatement.revenue.budget) / incomeStatement.revenue.budget) * 100).toFixed(1)}%</div>
              </div>

              {/* Revenue Accounts */}
              {expandedSection === 'revenue' && incomeStatement.revenue.accounts.map((account, ai) => (
                <div key={ai}>
                  <div 
                    className="grid grid-cols-12 gap-4 p-4 pl-8 cursor-pointer row-hover border-b border-stone-100 drill-row"
                    onClick={() => setExpandedAccount(expandedAccount === `rev-${ai}` ? null : `rev-${ai}`)}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span className={`text-stone-400 transition-transform ${expandedAccount === `rev-${ai}` ? 'rotate-90' : ''}`}>→</span>
                      <span className="text-stone-400 text-sm">{account.code}</span>
                      <span className="text-stone-700">{account.name}</span>
                    </div>
                    <div className="col-span-2 text-right text-stone-500">{fmt(account.budget)}</div>
                    <div className="col-span-2 text-right font-medium text-stone-800">{fmt(account.actual)}</div>
                    <div className={`col-span-2 text-right ${account.actual >= account.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                      {account.actual >= account.budget ? '+' : ''}{fmt(account.actual - account.budget)}
                    </div>
                    <div className={`col-span-1 text-right ${account.actual >= account.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                      {(((account.actual - account.budget) / account.budget) * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Vendors */}
                  {expandedAccount === `rev-${ai}` && account.vendors.map((vendor, vi) => (
                    <div key={vi}>
                      <div 
                        className="grid grid-cols-12 gap-4 p-3 pl-12 cursor-pointer row-hover border-b border-stone-50 drill-row-l2"
                        onClick={() => setExpandedVendor(expandedVendor === `rev-${ai}-${vi}` ? null : `rev-${ai}-${vi}`)}
                      >
                        <div className="col-span-5 flex items-center gap-2 text-sm">
                          <span className={`text-stone-300 transition-transform ${expandedVendor === `rev-${ai}-${vi}` ? 'rotate-90' : ''}`}>→</span>
                          <span className="text-stone-600">{vendor.name}</span>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-2 text-right text-sm text-stone-600">
                          {fmt(vendor.invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                        </div>
                        <div className="col-span-3 text-right text-xs text-stone-400">
                          {vendor.invoices.length} invoice{vendor.invoices.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Invoices */}
                      {expandedVendor === `rev-${ai}-${vi}` && vendor.invoices.map((inv, ii) => (
                        <div 
                          key={ii} 
                          className="grid grid-cols-12 gap-4 p-3 pl-16 row-hover border-b border-stone-50 drill-row-l3 cursor-pointer"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <div className="col-span-5 flex items-center gap-3 text-sm">
                            <span className="text-blue-600 font-mono">{inv.id}</span>
                            {inv.desc && <span className="text-stone-400">· {inv.desc}</span>}
                          </div>
                          <div className="col-span-2 text-right text-xs text-stone-400">{inv.date}</div>
                          <div className="col-span-2 text-right text-sm font-medium text-stone-700">{fmtFull(inv.amount)}</div>
                          <div className="col-span-3 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                              inv.status === 'posted' ? 'bg-blue-100 text-blue-700' :
                              inv.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

              {/* Expenses Section */}
              <div 
                className="grid grid-cols-12 gap-4 p-4 bg-red-50 cursor-pointer row-hover border-b border-stone-100"
                onClick={() => setExpandedSection(expandedSection === 'expenses' ? null : 'expenses')}
              >
                <div className="col-span-5 font-semibold text-red-800 flex items-center gap-2">
                  <span className={`transition-transform ${expandedSection === 'expenses' ? 'rotate-90' : ''}`}>→</span>
                  {incomeStatement.expenses.label}
                </div>
                <div className="col-span-2 text-right text-stone-600">{fmt(incomeStatement.expenses.budget)}</div>
                <div className="col-span-2 text-right font-medium text-red-700">{fmt(incomeStatement.expenses.actual)}</div>
                <div className="col-span-2 text-right text-red-600">+{fmt(incomeStatement.expenses.actual - incomeStatement.expenses.budget)}</div>
                <div className="col-span-1 text-right text-red-600">+{(((incomeStatement.expenses.actual - incomeStatement.expenses.budget) / incomeStatement.expenses.budget) * 100).toFixed(1)}%</div>
              </div>

              {/* Expense Accounts */}
              {expandedSection === 'expenses' && incomeStatement.expenses.accounts.map((account, ai) => (
                <div key={ai}>
                  <div 
                    className="grid grid-cols-12 gap-4 p-4 pl-8 cursor-pointer row-hover border-b border-stone-100 drill-row"
                    onClick={() => setExpandedAccount(expandedAccount === `exp-${ai}` ? null : `exp-${ai}`)}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span className={`text-stone-400 transition-transform ${expandedAccount === `exp-${ai}` ? 'rotate-90' : ''}`}>→</span>
                      <span className="text-stone-400 text-sm">{account.code}</span>
                      <span className="text-stone-700">{account.name}</span>
                      {account.actual > account.budget * 1.1 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Over</span>
                      )}
                    </div>
                    <div className="col-span-2 text-right text-stone-500">{fmt(account.budget)}</div>
                    <div className="col-span-2 text-right font-medium text-stone-800">{fmt(account.actual)}</div>
                    <div className={`col-span-2 text-right ${account.actual <= account.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                      {account.actual <= account.budget ? '' : '+'}{fmt(account.actual - account.budget)}
                    </div>
                    <div className={`col-span-1 text-right ${account.actual <= account.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                      {(((account.actual - account.budget) / account.budget) * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Vendors */}
                  {expandedAccount === `exp-${ai}` && account.vendors.map((vendor, vi) => (
                    <div key={vi}>
                      <div 
                        className="grid grid-cols-12 gap-4 p-3 pl-12 cursor-pointer row-hover border-b border-stone-50 drill-row-l2"
                        onClick={() => setExpandedVendor(expandedVendor === `exp-${ai}-${vi}` ? null : `exp-${ai}-${vi}`)}
                      >
                        <div className="col-span-5 flex items-center gap-2 text-sm">
                          <span className={`text-stone-300 transition-transform ${expandedVendor === `exp-${ai}-${vi}` ? 'rotate-90' : ''}`}>→</span>
                          <span className="text-stone-600">{vendor.name}</span>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-2 text-right text-sm text-stone-600">
                          {fmt(vendor.invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                        </div>
                        <div className="col-span-3 text-right text-xs text-stone-400">
                          {vendor.invoices.length} invoice{vendor.invoices.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Invoices */}
                      {expandedVendor === `exp-${ai}-${vi}` && vendor.invoices.map((inv, ii) => (
                        <div 
                          key={ii} 
                          className={`grid grid-cols-12 gap-4 p-3 pl-16 row-hover border-b border-stone-50 drill-row-l3 cursor-pointer ${inv.flagged ? 'bg-amber-50' : ''}`}
                          onClick={() => inv.flagged ? nav('anomaly') : setSelectedInvoice(inv)}
                        >
                          <div className="col-span-5 flex items-center gap-3 text-sm">
                            {inv.flagged && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                            <span className="text-blue-600 font-mono">{inv.id}</span>
                            {inv.desc && <span className="text-stone-400">· {inv.desc}</span>}
                            {inv.hasDoc && <span className="text-xs text-emerald-600">📎</span>}
                          </div>
                          <div className="col-span-2 text-right text-xs text-stone-400">{inv.date}</div>
                          <div className="col-span-2 text-right text-sm font-medium text-stone-700">{fmtFull(inv.amount)}</div>
                          <div className="col-span-3 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                              inv.status === 'posted' ? 'bg-blue-100 text-blue-700' :
                              inv.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              inv.status === 'flagged' ? 'bg-red-100 text-red-700' :
                              'bg-stone-100 text-stone-700'
                            }`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}

              {/* Net Income */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-blue-50 border-t-2 border-blue-200">
                <div className="col-span-5 font-semibold text-blue-800">Net Income</div>
                <div className="col-span-2 text-right text-stone-600">{fmt(incomeStatement.revenue.budget - incomeStatement.expenses.budget)}</div>
                <div className="col-span-2 text-right font-bold text-blue-700">{fmt(netIncome)}</div>
                <div className={`col-span-2 text-right font-medium ${budgetVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {budgetVariance >= 0 ? '+' : ''}{fmt(budgetVariance)}
                </div>
                <div className="col-span-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BUDGET VS ACTUAL ===== */}
        {screen === 'budget-vs-actual' && (
          <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-semibold text-stone-800">Budget vs Actual</h1>
                <p className="text-stone-500">Variance analysis by account · YTD 2024</p>
              </div>
              <button className="px-4 py-2 btn-primary rounded-xl text-sm font-medium">Export Report</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="card p-4">
                <div className="text-xs text-stone-500 uppercase">Revenue Budget</div>
                <div className="font-display text-xl font-semibold text-stone-800">{fmt(incomeStatement.revenue.budget)}</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-stone-500 uppercase">Revenue Actual</div>
                <div className="font-display text-xl font-semibold text-emerald-600">{fmt(incomeStatement.revenue.actual)}</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-stone-500 uppercase">Expense Budget</div>
                <div className="font-display text-xl font-semibold text-stone-800">{fmt(incomeStatement.expenses.budget)}</div>
              </div>
              <div className="card p-4">
                <div className="text-xs text-stone-500 uppercase">Expense Actual</div>
                <div className="font-display text-xl font-semibold text-red-600">{fmt(incomeStatement.expenses.actual)}</div>
              </div>
              <div className={`card p-4 ${budgetVariance >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`text-xs uppercase ${budgetVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Net Variance</div>
                <div className={`font-display text-xl font-semibold ${budgetVariance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {budgetVariance >= 0 ? '+' : ''}{fmt(budgetVariance)}
                </div>
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="card p-6 mb-6">
              <h3 className="font-medium text-stone-800 mb-4">Monthly Expense Variance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyBudgetActuals} barGap={4}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={v => `$${v/1000}K`} />
                  <Tooltip formatter={(v) => [fmtFull(v), '']} />
                  <Bar dataKey="budget" fill="#e7e5e4" radius={[4, 4, 0, 0]} name="Budget" />
                  <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="Actual">
                    {monthlyBudgetActuals.map((entry, index) => (
                      <Cell key={index} fill={entry.actual > entry.budget ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Account-Level Variance */}
            <div className="card overflow-hidden">
              <div className="p-4 bg-stone-50 border-b border-stone-200">
                <h3 className="font-medium text-stone-800">Account-Level Variance Analysis</h3>
              </div>
              
              {/* Revenue Accounts */}
              <div className="p-3 bg-emerald-50 border-b border-stone-200">
                <span className="text-sm font-medium text-emerald-800">Revenue Accounts</span>
              </div>
              {incomeStatement.revenue.accounts.map((acct, i) => {
                const variance = acct.actual - acct.budget;
                const pct = ((variance / acct.budget) * 100).toFixed(1);
                const isPositive = variance >= 0;
                return (
                  <div key={i} className="p-4 border-b border-stone-100 hover:bg-stone-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-stone-400 font-mono">{acct.code}</span>
                        <span className="font-medium text-stone-800">{acct.name}</span>
                      </div>
                      <div className={`font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{fmt(variance)} ({pct}%)
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((acct.actual / acct.budget) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-stone-500 w-32 text-right">
                        {fmt(acct.actual)} / {fmt(acct.budget)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Expense Accounts */}
              <div className="p-3 bg-red-50 border-b border-stone-200">
                <span className="text-sm font-medium text-red-800">Expense Accounts</span>
              </div>
              {incomeStatement.expenses.accounts.map((acct, i) => {
                const variance = acct.actual - acct.budget;
                const pct = ((variance / acct.budget) * 100).toFixed(1);
                const isUnder = variance <= 0;
                return (
                  <div key={i} className="p-4 border-b border-stone-100 hover:bg-stone-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-stone-400 font-mono">{acct.code}</span>
                        <span className="font-medium text-stone-800">{acct.name}</span>
                        {!isUnder && Math.abs(parseFloat(pct)) > 10 && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Attention</span>
                        )}
                      </div>
                      <div className={`font-medium ${isUnder ? 'text-emerald-600' : 'text-red-600'}`}>
                        {variance > 0 ? '+' : ''}{fmt(variance)} ({pct}%)
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-stone-300 absolute"
                            style={{ width: '100%' }}
                          />
                          <div 
                            className={`h-full absolute ${isUnder ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((acct.actual / acct.budget) * 100, 120)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-stone-500 w-32 text-right">
                        {fmt(acct.actual)} / {fmt(acct.budget)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== ANOMALY DETAIL ===== */}
        {screen === 'anomaly' && (
          <div className="max-w-4xl mx-auto fade-in">
            <button onClick={() => nav('overview')} className="flex items-center gap-2 text-stone-500 mb-4 hover:text-stone-700">← Back to Dashboard</button>
            <div className="card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">MEDIUM RISK</span>
                    <h1 className="font-display text-2xl font-semibold text-stone-800 mt-2">Premium Landscaping LLC</h1>
                    <p className="text-stone-600">5300 · Golf Course Maintenance · December 8, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-semibold">$28,000</div>
                    <div className="text-amber-600 text-sm">Pending Review</div>
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <h3 className="font-medium text-stone-800">Risk Flags</h3>
                  {[
                    { sev: 'high', title: 'Missing Documentation', desc: 'No contract or W-9 on file for this vendor' },
                    { sev: 'medium', title: 'New Vendor', desc: 'First transaction - no payment history' },
                    { sev: 'medium', title: 'Above Average', desc: '2.3x higher than similar landscaping vendors ($12,100 avg)' },
                  ].map((f, i) => (
                    <div key={i} className={`p-4 rounded-xl severity-${f.sev}`}>
                      <div className="font-medium text-stone-800">{f.title}</div>
                      <div className="text-sm text-stone-600">{f.desc}</div>
                    </div>
                  ))}
                  <h3 className="font-medium text-stone-800 pt-4">Budget Context</h3>
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-stone-600">Account 5300 - Golf Course Maintenance</span>
                      <span className="font-medium text-amber-600">$58K over budget</span>
                    </div>
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '106%' }} />
                    </div>
                    <div className="flex justify-between text-sm text-stone-500 mt-1">
                      <span>$1.008M actual</span>
                      <span>$950K budget</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                    <div className="text-xs text-stone-500 uppercase">Risk Score</div>
                    <div className="font-display text-4xl font-semibold text-amber-600">72</div>
                    <div className="text-sm text-stone-500">out of 100</div>
                  </div>
                  <button className="w-full py-3 btn-primary rounded-xl font-medium">Approve</button>
                  <button className="w-full py-3 border border-stone-200 rounded-xl font-medium hover:bg-stone-50">Request Docs</button>
                  <button className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50">Reject</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== MOBILE ===== */}
        {screen === 'mobile' && (
          <div className="flex justify-center fade-in">
            <div className="mobile-frame bg-stone-50 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl z-10" />
              <div className="h-full overflow-y-auto pt-8 px-4 pb-24">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-stone-400 uppercase">Palm Harbor CC</div>
                    <h1 className="font-display text-xl font-semibold text-stone-800">Financials</h1>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-stone-700 text-white flex items-center justify-center text-sm font-medium">JW</div>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white mb-4">
                  <div className="font-medium">Review Required</div>
                  <div className="text-sm text-white/80">1 flagged transaction</div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-xs text-stone-400">Revenue YTD</div>
                    <div className="font-display text-xl font-semibold">{fmt(totalRevenue)}</div>
                    <div className="text-xs text-emerald-600">+2.6% vs budget</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-xs text-stone-400">Expenses YTD</div>
                    <div className="font-display text-xl font-semibold">{fmt(totalExpenses)}</div>
                    <div className="text-xs text-red-600">+4.2% vs budget</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-stone-400">Net Income</div>
                      <div className="font-display text-2xl font-semibold text-emerald-600">{fmt(netIncome)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-400">Margin</div>
                      <div className="font-display text-xl font-semibold">{((netIncome / totalRevenue) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-xs text-stone-400 mb-3">Top Variances</div>
                  {[
                    { name: 'Insurance', amt: '+$82K', neg: true },
                    { name: 'Utilities', amt: '+$65K', neg: true },
                    { name: 'F&B Revenue', amt: '+$120K', neg: false },
                  ].map((v, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                      <span className="text-sm text-stone-700">{v.name}</span>
                      <span className={`text-sm font-medium ${v.neg ? 'text-red-600' : 'text-emerald-600'}`}>{v.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-2 pb-6">
                <div className="flex justify-around">
                  {['Home', 'Income', 'Budget', 'More'].map((t, i) => (
                    <button key={t} className={`text-xs ${i === 0 ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ONBOARDING ===== */}
        {screen === 'onboarding' && (
          <div className="max-w-xl mx-auto fade-in">
            <div className="card overflow-hidden">
              <div className="h-1 bg-stone-100"><div className="h-full bg-stone-800 transition-all" style={{ width: `${((onboardStep + 1) / 4) * 100}%` }} /></div>
              <div className="p-8">
                {onboardStep === 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto mb-6 text-2xl">📊</div>
                    <h1 className="font-display text-2xl font-semibold text-stone-800 mb-2">Welcome to Sightline</h1>
                    <p className="text-stone-500 mb-6">Financial clarity for your club. Setup takes ~5 minutes.</p>
                    <button onClick={() => setOnboardStep(1)} className="w-full py-3 btn-primary rounded-xl font-medium">Get Started</button>
                  </div>
                )}
                {onboardStep === 1 && (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-xs text-stone-400 uppercase mb-1">Step 1 of 3</div>
                      <h2 className="font-display text-xl font-semibold">Club Information</h2>
                    </div>
                    <div className="space-y-4">
                      <input defaultValue="Palm Harbor Country Club" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl" />
                      <select className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white"><option>Country Club</option></select>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setOnboardStep(0)} className="px-4 py-2 text-stone-600">Back</button>
                      <button onClick={() => setOnboardStep(2)} className="flex-1 py-2.5 btn-primary rounded-xl font-medium">Continue</button>
                    </div>
                  </div>
                )}
                {onboardStep === 2 && (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-xs text-stone-400 uppercase mb-1">Step 2 of 3</div>
                      <h2 className="font-display text-xl font-semibold">Connect Banks</h2>
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-700">T</div>
                        <div>
                          <div className="font-medium text-stone-800">Truist ****4521</div>
                          <div className="text-sm text-emerald-600">Connected</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full p-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-600">+ Add Account</button>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setOnboardStep(1)} className="px-4 py-2 text-stone-600">Back</button>
                      <button onClick={() => setOnboardStep(3)} className="flex-1 py-2.5 btn-primary rounded-xl font-medium">Continue</button>
                    </div>
                  </div>
                )}
                {onboardStep === 3 && (
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-xs text-stone-400 uppercase mb-1">Step 3 of 3</div>
                      <h2 className="font-display text-xl font-semibold">Import Budget</h2>
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
                      <div className="font-medium text-stone-800">2024_Budget.xlsx</div>
                      <div className="text-sm text-emerald-600">Uploaded</div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setOnboardStep(2)} className="px-4 py-2 text-stone-600">Back</button>
                      <button onClick={() => nav('overview')} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-medium">Launch →</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {screen === 'settings' && (
          <div className="max-w-3xl mx-auto fade-in">
            <h1 className="font-display text-2xl font-semibold text-stone-800 mb-6">Settings</h1>
            <div className="card divide-y divide-stone-100">
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Club Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input defaultValue="Palm Harbor Country Club" className="px-3 py-2 border border-stone-200 rounded-xl" />
                  <select className="px-3 py-2 border border-stone-200 rounded-xl bg-white"><option>Country Club</option></select>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Notifications</h3>
                {[{ k: 'anomaly', l: 'Anomaly Alerts' }, { k: 'weekly', l: 'Weekly Summary' }, { k: 'budget', l: 'Budget Variance' }].map(n => (
                  <div key={n.k} className="flex justify-between items-center py-2">
                    <span className="text-stone-700">{n.l}</span>
                    <button onClick={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))} className={`w-10 h-6 rounded-full relative ${notifs[n.k] ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifs[n.k] ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Connected Banks</h3>
                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-700">T</div>
                    <span className="text-stone-800">Truist ****4521</span>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Invoice Detail</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-500">Invoice #</span>
                <span className="font-mono text-blue-600">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount</span>
                <span className="font-semibold">{fmtFull(selectedInvoice.amount)}</span>
              </div>
              {selectedInvoice.desc && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Description</span>
                  <span>{selectedInvoice.desc}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                  selectedInvoice.status === 'posted' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{selectedInvoice.status}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {selectedInvoice.hasDoc && (
                <button className="flex-1 py-2 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50">View Document</button>
              )}
              <button onClick={() => setSelectedInvoice(null)} className="flex-1 py-2 btn-primary rounded-xl text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
