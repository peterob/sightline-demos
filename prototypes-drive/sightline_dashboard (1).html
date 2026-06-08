import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data
const cashFlowData = [
  { month: 'Jul', operating: 1850000, reserves: 4200000 },
  { month: 'Aug', operating: 1720000, reserves: 4150000 },
  { month: 'Sep', operating: 1680000, reserves: 4100000 },
  { month: 'Oct', operating: 1890000, reserves: 4050000 },
  { month: 'Nov', operating: 1950000, reserves: 3850000 },
  { month: 'Dec', operating: 2100000, reserves: 3710000 },
];

const budgetData = [
  { category: 'Payroll', budget: 2400000, actual: 2380000, variance: -20000 },
  { category: 'F&B Operations', budget: 1800000, actual: 1920000, variance: 120000 },
  { category: 'Golf Maintenance', budget: 950000, actual: 980000, variance: 30000 },
  { category: 'Utilities', budget: 420000, actual: 485000, variance: 65000 },
  { category: 'Insurance', budget: 380000, actual: 462000, variance: 82000 },
  { category: 'Admin & Legal', budget: 290000, actual: 275000, variance: -15000 },
];

const recentTransactions = [
  { id: 1, date: 'Dec 9', vendor: 'Toro Equipment Co.', category: 'Golf Maintenance', amount: -47500, status: 'cleared', flagged: false },
  { id: 2, date: 'Dec 9', vendor: 'ADP Payroll', category: 'Payroll', amount: -198450, status: 'cleared', flagged: false },
  { id: 3, date: 'Dec 8', vendor: 'Sysco Foods', category: 'F&B Operations', amount: -34200, status: 'cleared', flagged: false },
  { id: 4, date: 'Dec 8', vendor: 'Premium Landscaping LLC', category: 'Grounds', amount: -28000, status: 'pending', flagged: true },
  { id: 5, date: 'Dec 7', vendor: 'Member Dues', category: 'Revenue', amount: 425000, status: 'cleared', flagged: false },
  { id: 6, date: 'Dec 6', vendor: 'Florida Power & Light', category: 'Utilities', amount: -18750, status: 'cleared', flagged: false },
  { id: 7, date: 'Dec 5', vendor: 'Hartford Insurance', category: 'Insurance', amount: -38500, status: 'cleared', flagged: false },
];

const varianceExplanation = [
  { 
    category: 'Insurance Premium Increase', 
    amount: -82000, 
    percent: 21.6,
    detail: 'Annual renewal came in 21.6% above budget. Industry-wide post-Surfside adjustment.',
    events: ['Policy renewed Nov 1', 'Board notified Nov 3']
  },
  { 
    category: 'Pool Resurfacing', 
    amount: -180000, 
    percent: null,
    detail: 'Approved at September board meeting. Completed Nov 15.',
    events: ['Bid accepted Sep 12', 'Work completed Nov 15', 'Final payment Nov 22']
  },
  { 
    category: 'HVAC Emergency Repair', 
    amount: -65000, 
    percent: null,
    detail: 'Clubhouse unit failure. Emergency approval by treasurer.',
    events: ['Unit failed Oct 28', 'Emergency approval Oct 28', 'Repair completed Nov 2']
  },
  { 
    category: 'F&B Revenue Shortfall', 
    amount: -45000, 
    percent: -8.2,
    detail: 'October event cancellations due to hurricane warnings.',
    events: ['3 events cancelled Oct 9-11']
  },
];

const anomalies = [
  { 
    id: 1, 
    severity: 'medium', 
    type: 'Vendor Pattern', 
    title: 'Premium Landscaping LLC — New vendor, high initial payment',
    detail: 'First payment to this vendor. Amount ($28,000) exceeds typical landscaping vendors by 2.3x.',
    action: 'Review contract and bid documentation'
  },
  { 
    id: 2, 
    severity: 'low', 
    type: 'Budget Variance', 
    title: 'Utilities trending 15% over budget',
    detail: 'YTD utilities at $485K vs $420K budget. Driven by cooling costs Jul-Sep.',
    action: 'Review for Q1 budget adjustment'
  },
];

const reserveAllocation = [
  { name: 'Roof Replacement', value: 850000, color: '#1a365d' },
  { name: 'Golf Course Irrigation', value: 620000, color: '#2c5282' },
  { name: 'Clubhouse Renovation', value: 480000, color: '#3182ce' },
  { name: 'Pool & Tennis', value: 340000, color: '#4299e1' },
  { name: 'Contingency', value: 420000, color: '#63b3ed' },
  { name: 'Unallocated', value: 1000000, color: '#90cdf4' },
];

const formatCurrency = (value) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const formatFullCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

export default function SightlineDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedVariance, setSelectedVariance] = useState(null);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&display=swap');
        
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
        
        .card-shadow {
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
        }
        
        .card-shadow-hover:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06);
        }
        
        .subtle-border {
          border: 1px solid rgba(0,0,0,0.06);
        }
        
        .metric-positive { color: #166534; }
        .metric-negative { color: #991b1b; }
        .metric-neutral { color: #525252; }
        
        .anomaly-high { background: #fef2f2; border-left: 3px solid #dc2626; }
        .anomaly-medium { background: #fffbeb; border-left: 3px solid #d97706; }
        .anomaly-low { background: #f0fdf4; border-left: 3px solid #16a34a; }
        
        .nav-item {
          transition: all 0.15s ease;
        }
        .nav-item:hover {
          background: rgba(0,0,0,0.04);
        }
        .nav-item.active {
          background: #1a365d;
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white subtle-border border-t-0 border-l-0 border-r-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-stone-800 to-stone-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <span className="font-display text-xl font-semibold tracking-tight text-stone-800">Sightline</span>
                </div>
              </div>
              
              {/* Club Name */}
              <div className="hidden md:block pl-8 border-l border-stone-200">
                <div className="text-xs text-stone-400 uppercase tracking-wider">Viewing</div>
                <div className="text-sm font-medium text-stone-700">Palm Harbor Country Club</div>
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-stone-400">Last updated</div>
                <div className="text-sm text-stone-600">Today, 6:42 AM</div>
              </div>
              <div className="w-px h-8 bg-stone-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                  <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-stone-700 flex items-center justify-center text-white text-sm font-medium">
                  JW
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <nav className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 card-shadow w-fit">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'budget', label: 'Budget' },
            { id: 'reserves', label: 'Reserves' },
            { id: 'documents', label: 'Documents' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`nav-item px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === tab.id ? 'active' : 'text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Operating Cash */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-medium">Operating Cash</div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="font-display text-3xl font-semibold text-stone-800 mb-1">$2.10M</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm metric-positive font-medium">+7.7%</span>
                  <span className="text-xs text-stone-400">vs last month</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-500">98 days of operating runway</div>
                </div>
              </div>

              {/* Reserve Balance */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-medium">Reserve Balance</div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                  </div>
                </div>
                <div className="font-display text-3xl font-semibold text-stone-800 mb-1">$3.71M</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm metric-negative font-medium">-$340K</span>
                  <span className="text-xs text-stone-400">vs last quarter</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                    68% funded vs 10-year needs
                  </div>
                </div>
              </div>

              {/* Budget Variance */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-medium">YTD Budget Variance</div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                </div>
                <div className="font-display text-3xl font-semibold text-stone-800 mb-1">+$262K</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm metric-negative font-medium">4.1% over</span>
                  <span className="text-xs text-stone-400">through Nov</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-500">Insurance +$82K, Utilities +$65K</div>
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-medium">Financial Health</div>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                </div>
                <div className="font-display text-3xl font-semibold text-stone-800 mb-1">72<span className="text-lg text-stone-400">/100</span></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500 font-medium">Good</span>
                  <span className="text-xs text-stone-400">vs 74 avg for similar clubs</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cash & Reserves Trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-stone-800">Cash & Reserves</h2>
                    <p className="text-sm text-stone-500">6-month trend</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-stone-600">Operating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-stone-600">Reserves</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOperating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReserves" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={(v) => `$${v/1000000}M`} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        padding: '12px 16px'
                      }}
                      formatter={(value) => [formatFullCurrency(value), '']}
                    />
                    <Area type="monotone" dataKey="reserves" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReserves)" />
                    <Area type="monotone" dataKey="operating" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOperating)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Anomalies & Alerts */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-lg font-semibold text-stone-800">Attention Required</h2>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">2 items</span>
                </div>
                <div className="space-y-3">
                  {anomalies.map(anomaly => (
                    <div 
                      key={anomaly.id} 
                      className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${
                        anomaly.severity === 'high' ? 'anomaly-high' :
                        anomaly.severity === 'medium' ? 'anomaly-medium' : 'anomaly-low'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          anomaly.severity === 'high' ? 'bg-red-500' :
                          anomaly.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-stone-500 mb-1">{anomaly.type}</div>
                          <div className="text-sm font-medium text-stone-800 mb-1.5">{anomaly.title}</div>
                          <div className="text-xs text-stone-500">{anomaly.detail}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-lg transition-colors">
                  View all alerts →
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Reserve Change Explanation */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-stone-800">Why Reserves Changed</h2>
                    <p className="text-sm text-stone-500">Q4 variance attribution</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-400">Net change</div>
                    <div className="font-display text-lg font-semibold metric-negative">-$340,000</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {varianceExplanation.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedVariance(selectedVariance === idx ? null : idx)}
                      className="group cursor-pointer"
                    >
                      <div className={`p-4 rounded-xl border transition-all ${
                        selectedVariance === idx 
                          ? 'border-stone-300 bg-stone-50' 
                          : 'border-transparent hover:bg-stone-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-1 h-8 rounded-full ${item.amount < 0 ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                            <div>
                              <div className="text-sm font-medium text-stone-800">{item.category}</div>
                              {item.percent && (
                                <div className="text-xs text-stone-500">{item.percent > 0 ? '+' : ''}{item.percent}% vs budget</div>
                              )}
                            </div>
                          </div>
                          <div className={`font-display text-lg font-semibold ${item.amount < 0 ? 'metric-negative' : 'metric-positive'}`}>
                            {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toLocaleString()}
                          </div>
                        </div>
                        
                        {selectedVariance === idx && (
                          <div className="mt-4 pt-4 border-t border-stone-200">
                            <p className="text-sm text-stone-600 mb-3">{item.detail}</p>
                            <div className="space-y-1.5">
                              {item.events.map((event, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-stone-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                                  {event}
                                </div>
                              ))}
                            </div>
                            <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">
                              View related documents →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-lg font-semibold text-stone-800">Recent Transactions</h2>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all →</button>
                </div>
                
                <div className="space-y-1">
                  {recentTransactions.map(tx => (
                    <div 
                      key={tx.id} 
                      className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer ${
                        tx.flagged ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {tx.flagged && (
                          <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-stone-800 truncate">{tx.vendor}</div>
                          <div className="text-xs text-stone-500">{tx.category} · {tx.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`text-sm font-medium ${tx.amount > 0 ? 'metric-positive' : 'text-stone-800'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </div>
                        {tx.status === 'pending' && (
                          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Overview Bar */}
            <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-stone-800">Budget vs Actual</h2>
                  <p className="text-sm text-stone-500">Year-to-date by category</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-stone-300"></div>
                    <span className="text-stone-600">Budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-stone-600">Actual</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {budgetData.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-stone-700">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-stone-500">{formatCurrency(item.actual)} / {formatCurrency(item.budget)}</span>
                        <span className={`text-sm font-medium w-16 text-right ${
                          item.variance > 0 ? 'metric-negative' : 'metric-positive'
                        }`}>
                          {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-stone-300 rounded-full"
                        style={{ width: '100%' }}
                      ></div>
                      <div 
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                          item.variance > 0 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((item.actual / item.budget) * 100, 120)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions View */}
        {activeView === 'transactions' && (
          <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-stone-800">All Transactions</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    className="w-64 pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50">
                  Filter
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-stone-800 rounded-lg hover:bg-stone-700">
                  Export
                </button>
              </div>
            </div>
            
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Category</th>
                    <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Amount</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className={`hover:bg-stone-50 transition-colors ${tx.flagged ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-4 py-4 text-sm text-stone-600">{tx.date}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {tx.flagged && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                          <span className="text-sm font-medium text-stone-800">{tx.vendor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">{tx.category}</span>
                      </td>
                      <td className={`px-4 py-4 text-sm font-medium text-right ${tx.amount > 0 ? 'metric-positive' : 'text-stone-800'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatFullCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded ${
                          tx.status === 'cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button className="text-stone-400 hover:text-stone-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reserves View */}
        {activeView === 'reserves' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Reserve Summary */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow subtle-border">
                <h2 className="font-display text-xl font-semibold text-stone-800 mb-6">Reserve Fund Status</h2>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-2">Current Balance</div>
                    <div className="font-display text-3xl font-semibold text-stone-800">$3.71M</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-2">10-Year Need</div>
                    <div className="font-display text-3xl font-semibold text-stone-800">$5.45M</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-2">Funded %</div>
                    <div className="font-display text-3xl font-semibold text-amber-600">68%</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-stone-600">Progress toward full funding</span>
                    <span className="font-medium text-stone-800">$3.71M / $5.45M</span>
                  </div>
                  <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all"
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-amber-800">Reserve funding below target</div>
                      <div className="text-sm text-amber-700 mt-1">
                        At current contribution rates, reserves will reach 75% funding in 2.3 years. 
                        Consider increasing quarterly reserve transfers by $45K to reach target by end of 2025.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allocation Pie */}
              <div className="bg-white rounded-2xl p-6 card-shadow subtle-border">
                <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Reserve Allocation</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={reserveAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {reserveAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {reserveAllocation.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: item.color }}></div>
                        <span className="text-stone-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-stone-800">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other views */}
        {(activeView === 'budget' || activeView === 'documents') && (
          <div className="bg-white rounded-2xl p-12 card-shadow subtle-border text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-stone-800 mb-2">
              {activeView === 'budget' ? 'Budget Management' : 'Document Repository'}
            </h3>
            <p className="text-stone-500 max-w-md mx-auto">
              {activeView === 'budget' 
                ? 'Detailed budget planning, variance analysis, and forecasting tools would appear here.'
                : 'Upload and organize contracts, invoices, audit reports, and board minutes linked to transactions.'
              }
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-stone-500">
          <div>© 2025 Sightline · Financial transparency for private clubs</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-700">Help</a>
            <a href="#" className="hover:text-stone-700">Privacy</a>
            <a href="#" className="hover:text-stone-700">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
