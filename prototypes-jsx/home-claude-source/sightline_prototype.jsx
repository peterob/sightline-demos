import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ============================================
// SAMPLE DATA
// ============================================

const cashFlowData = [
  { month: 'Jul', operating: 1850000, reserves: 4200000 },
  { month: 'Aug', operating: 1720000, reserves: 4150000 },
  { month: 'Sep', operating: 1680000, reserves: 4100000 },
  { month: 'Oct', operating: 1890000, reserves: 4050000 },
  { month: 'Nov', operating: 1950000, reserves: 3850000 },
  { month: 'Dec', operating: 2100000, reserves: 3710000 },
];

const budgetData = [
  { category: 'Payroll & Benefits', budget: 2400000, actual: 2380000, variance: -20000, icon: '👥', subcategories: [
    { name: 'Golf Operations Staff', budget: 680000, actual: 695000 },
    { name: 'F&B Staff', budget: 820000, actual: 805000 },
    { name: 'Administrative', budget: 420000, actual: 410000 },
    { name: 'Maintenance Crew', budget: 480000, actual: 470000 },
  ]},
  { category: 'Food & Beverage', budget: 1800000, actual: 1920000, variance: 120000, icon: '🍽️', subcategories: [
    { name: 'Food Cost', budget: 720000, actual: 780000 },
    { name: 'Beverage Cost', budget: 380000, actual: 395000 },
    { name: 'Supplies & Equipment', budget: 420000, actual: 445000 },
    { name: 'Special Events', budget: 280000, actual: 300000 },
  ]},
  { category: 'Golf Course', budget: 950000, actual: 980000, variance: 30000, icon: '⛳', subcategories: [
    { name: 'Equipment & Repairs', budget: 280000, actual: 295000 },
    { name: 'Chemicals & Fertilizers', budget: 180000, actual: 175000 },
    { name: 'Irrigation System', budget: 220000, actual: 235000 },
    { name: 'Contract Labor', budget: 270000, actual: 275000 },
  ]},
  { category: 'Utilities', budget: 420000, actual: 485000, variance: 65000, icon: '⚡', subcategories: [
    { name: 'Electric', budget: 240000, actual: 285000 },
    { name: 'Water & Sewer', budget: 95000, actual: 105000 },
    { name: 'Natural Gas', budget: 85000, actual: 95000 },
  ]},
  { category: 'Insurance', budget: 380000, actual: 462000, variance: 82000, icon: '🛡️', subcategories: [
    { name: 'Property Coverage', budget: 180000, actual: 225000 },
    { name: 'Liability', budget: 120000, actual: 142000 },
    { name: 'Workers Compensation', budget: 80000, actual: 95000 },
  ]},
  { category: 'Admin & Professional', budget: 290000, actual: 275000, variance: -15000, icon: '📋', subcategories: [
    { name: 'Legal Fees', budget: 80000, actual: 72000 },
    { name: 'Accounting & Audit', budget: 65000, actual: 63000 },
    { name: 'Office Operations', budget: 85000, actual: 82000 },
    { name: 'Technology', budget: 60000, actual: 58000 },
  ]},
];

const transactions = [
  { id: 1, date: 'Dec 9', fullDate: 'December 9, 2024', vendor: 'Toro Equipment Co.', category: 'Golf Maintenance', amount: -47500, status: 'cleared', flagged: false, hasDoc: true, description: 'Greens mower replacement parts - PO #2024-1847' },
  { id: 2, date: 'Dec 9', fullDate: 'December 9, 2024', vendor: 'ADP Payroll Services', category: 'Payroll', amount: -198450, status: 'cleared', flagged: false, hasDoc: true, description: 'Bi-weekly payroll processing - Period ending 12/7' },
  { id: 3, date: 'Dec 8', fullDate: 'December 8, 2024', vendor: 'Sysco Foods', category: 'F&B Operations', amount: -34200, status: 'cleared', flagged: false, hasDoc: true, description: 'Weekly food delivery - Invoice #SF-847291' },
  { id: 4, date: 'Dec 8', fullDate: 'December 8, 2024', vendor: 'Premium Landscaping LLC', category: 'Grounds', amount: -28000, status: 'pending', flagged: true, hasDoc: false, description: 'Monthly grounds maintenance contract' },
  { id: 5, date: 'Dec 7', fullDate: 'December 7, 2024', vendor: 'Member Dues Collection', category: 'Revenue', amount: 425000, status: 'cleared', flagged: false, hasDoc: false, description: 'December monthly dues - 425 members' },
  { id: 6, date: 'Dec 6', fullDate: 'December 6, 2024', vendor: 'Florida Power & Light', category: 'Utilities', amount: -18750, status: 'cleared', flagged: false, hasDoc: true, description: 'Monthly electric service - Account #7847291' },
  { id: 7, date: 'Dec 5', fullDate: 'December 5, 2024', vendor: 'Hartford Insurance', category: 'Insurance', amount: -38500, status: 'cleared', flagged: false, hasDoc: true, description: 'Monthly premium - Policy #HI-2024-4521' },
];

const anomalyData = {
  vendor: 'Premium Landscaping LLC',
  amount: 28000,
  date: 'December 8, 2024',
  category: 'Grounds Maintenance',
  riskScore: 72,
  status: 'Pending Review',
  flags: [
    { severity: 'high', title: 'Missing Documentation', description: 'No contract or invoice on file for this vendor' },
    { severity: 'medium', title: 'New Vendor', description: 'First transaction with this vendor - no payment history' },
    { severity: 'medium', title: 'Above Average Amount', description: 'Payment is 2.3x higher than similar landscaping vendors ($12,100 avg)' },
    { severity: 'low', title: 'Category Review', description: 'Vendor name suggests landscaping but categorized as general Grounds' },
  ],
  vendorComparison: [
    { name: 'Green Horizons Landscaping', avgPayment: 11500, frequency: 'Monthly', years: 3 },
    { name: 'Palm Beach Grounds Care', avgPayment: 12800, frequency: 'Monthly', years: 5 },
    { name: 'Coastal Lawn Services', avgPayment: 9200, frequency: 'Bi-weekly', years: 2 },
  ],
  timeline: [
    { time: '2:34 PM', date: 'Dec 8', event: 'Transaction imported from bank feed', actor: 'System' },
    { time: '2:35 PM', date: 'Dec 8', event: 'Anomaly detected - 4 risk factors identified', actor: 'Sightline AI' },
    { time: '2:36 PM', date: 'Dec 8', event: 'Alert sent to Finance Committee', actor: 'System' },
    { time: '3:15 PM', date: 'Dec 8', event: 'Viewed by James Wilson', actor: 'James Wilson' },
  ],
  recommendations: [
    { done: false, text: 'Request W-9 and verify tax ID with IRS' },
    { done: false, text: 'Obtain signed service contract' },
    { done: false, text: 'Request itemized invoice for services rendered' },
    { done: false, text: 'Verify board approval for new vendor relationships' },
    { done: false, text: 'Compare pricing with existing landscaping vendors' },
  ],
};

const documents = [
  { id: 1, name: 'Hartford_Policy_2024.pdf', type: 'Contract', size: '2.4 MB', date: 'Nov 1, 2024', linked: 3 },
  { id: 2, name: 'Sysco_Invoice_847291.pdf', type: 'Invoice', size: '156 KB', date: 'Dec 8, 2024', linked: 1 },
  { id: 3, name: 'Toro_PO_2024-1847.pdf', type: 'Invoice', size: '89 KB', date: 'Dec 9, 2024', linked: 1 },
  { id: 4, name: 'Q3_Audit_Report.pdf', type: 'Audit', size: '4.1 MB', date: 'Oct 15, 2024', linked: 0 },
  { id: 5, name: 'Reserve_Study_2024.pdf', type: 'Report', size: '8.7 MB', date: 'Sep 1, 2024', linked: 0 },
  { id: 6, name: 'FPL_Statement_Dec.pdf', type: 'Invoice', size: '234 KB', date: 'Dec 6, 2024', linked: 1 },
];

const users = [
  { id: 1, name: 'James Wilson', email: 'jwilson@palmharbor.club', role: 'Admin', status: 'active', lastSeen: '2 hours ago', initials: 'JW' },
  { id: 2, name: 'Margaret Chen', email: 'mchen@email.com', role: 'Treasurer', status: 'active', lastSeen: '1 day ago', initials: 'MC' },
  { id: 3, name: 'Robert Patterson', email: 'rpatterson@email.com', role: 'Board Member', status: 'active', lastSeen: '3 days ago', initials: 'RP' },
  { id: 4, name: 'Susan Miller', email: 'smiller@email.com', role: 'Board Member', status: 'pending', lastSeen: 'Invitation sent', initials: 'SM' },
  { id: 5, name: 'David Thompson', email: 'dthompson@email.com', role: 'Committee', status: 'active', lastSeen: '1 week ago', initials: 'DT' },
];

const formatCurrency = (val) => {
  if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SightlinePrototype() {
  const [screen, setScreen] = useState('overview');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [expandedBudget, setExpandedBudget] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mobileTab, setMobileTab] = useState('home');

  const navigateTo = (s) => {
    setScreen(s);
    setOnboardingStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap');
        
        * { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        
        .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); }
        .card { background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04); }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06); }
        
        .btn-primary { background: linear-gradient(135deg, #292524 0%, #44403c 100%); color: white; }
        .btn-primary:hover { background: linear-gradient(135deg, #1c1917 0%, #292524 100%); }
        
        .severity-high { background: #fef2f2; border-left: 3px solid #ef4444; }
        .severity-medium { background: #fffbeb; border-left: 3px solid #f59e0b; }
        .severity-low { background: #f0fdf4; border-left: 3px solid #22c55e; }
        
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        
        .slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .mobile-frame {
          width: 390px;
          height: 844px;
          border-radius: 50px;
          border: 10px solid #1a1a1a;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.3), 0 30px 60px -30px rgba(0,0,0,0.3), inset 0 0 0 2px #333;
        }
        
        .progress-ring { transition: stroke-dashoffset 0.5s ease; }
        
        input:focus, select:focus { outline: none; ring: 2px solid #a8a29e; }
      `}</style>

      {/* ========== NAVIGATION BAR ========== */}
      <nav className="glass sticky top-0 z-50 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-stone-800">Sightline</span>
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">PROTOTYPE</span>
              </div>
            </div>
            <div className="text-sm text-stone-500">Click screens below to navigate</div>
          </div>
          
          {/* Screen Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Desktop Dashboard', icon: '💻' },
              { id: 'mobile', label: 'Mobile View', icon: '📱' },
              { id: 'onboarding', label: 'Onboarding Flow', icon: '🚀' },
              { id: 'anomaly', label: 'Anomaly Detail', icon: '⚠️' },
              { id: 'documents', label: 'Document Linking', icon: '📎' },
              { id: 'budget', label: 'Budget Detail', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
              { id: 'users', label: 'User Management', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  screen === tab.id 
                    ? 'bg-stone-800 text-white shadow-lg' 
                    : 'bg-white text-stone-600 hover:bg-stone-50 shadow'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ==================== DESKTOP DASHBOARD ==================== */}
        {screen === 'overview' && (
          <div className="fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold text-stone-800">Palm Harbor Country Club</h1>
                <p className="text-stone-500 mt-1">Financial Overview · Updated 2 hours ago</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-stone-600 shadow hover:shadow-md transition-all">
                  Export Report
                </button>
                <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white font-medium shadow-lg">JW</div>
              </div>
            </div>

            {/* Alert Banner */}
            <div className="card p-4 border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">1 transaction requires your attention</div>
                    <div className="text-sm text-stone-500">New vendor payment flagged for review</div>
                  </div>
                </div>
                <button 
                  onClick={() => navigateTo('anomaly')}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Review Now
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Operating Cash', value: '$2.10M', change: '+7.7%', positive: true, sub: '98 days runway' },
                { label: 'Reserve Balance', value: '$3.71M', change: '-$340K', positive: false, sub: '68% funded' },
                { label: 'YTD Variance', value: '+$262K', change: '4.1% over', positive: false, sub: 'vs budget' },
                { label: 'Health Score', value: '72', change: '/100', positive: null, sub: 'Good standing' },
              ].map((m, i) => (
                <div key={i} className="card card-hover p-5">
                  <div className="text-xs text-stone-400 uppercase tracking-wider font-medium">{m.label}</div>
                  <div className="font-display text-3xl font-semibold text-stone-800 mt-2">{m.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {m.positive !== null && (
                      <span className={`text-sm font-medium ${m.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {m.change}
                      </span>
                    )}
                    {m.positive === null && <span className="text-sm text-stone-400">{m.change}</span>}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-stone-800">Cash & Reserves Trend</h3>
                    <p className="text-sm text-stone-500">6-month history</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Operating</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Reserves</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="opGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={v => `$${v/1000000}M`} />
                    <Tooltip formatter={(v) => [`$${(v/1000000).toFixed(2)}M`, '']} />
                    <Area type="monotone" dataKey="reserves" stroke="#3b82f6" strokeWidth={2} fill="url(#resGrad)" />
                    <Area type="monotone" dataKey="operating" stroke="#10b981" strokeWidth={2} fill="url(#opGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold text-stone-800 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(tx => (
                    <div 
                      key={tx.id} 
                      className={`flex items-center justify-between p-2 -mx-2 rounded-lg cursor-pointer hover:bg-stone-50 ${tx.flagged ? 'bg-amber-50' : ''}`}
                      onClick={() => tx.flagged && navigateTo('anomaly')}
                    >
                      <div className="flex items-center gap-2">
                        {tx.flagged && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                        <div>
                          <div className="text-sm font-medium text-stone-800 truncate max-w-[140px]">{tx.vendor}</div>
                          <div className="text-xs text-stone-400">{tx.date}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-stone-800'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                  View All Transactions →
                </button>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-stone-800">Budget vs Actual</h3>
                  <p className="text-sm text-stone-500">Year-to-date by category</p>
                </div>
                <button 
                  onClick={() => navigateTo('budget')}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  View Details →
                </button>
              </div>
              <div className="space-y-4">
                {budgetData.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 text-center text-lg">{b.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-stone-700">{b.category}</span>
                        <span className={`text-sm font-medium ${b.variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {b.variance > 0 ? '+' : ''}{formatCurrency(b.variance)}
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${b.variance > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((b.actual / b.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== MOBILE VIEW ==================== */}
        {screen === 'mobile' && (
          <div className="flex justify-center fade-in">
            <div className="mobile-frame bg-stone-50 relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10"></div>
              
              <div className="h-full overflow-y-auto">
                {/* Status Bar */}
                <div className="h-12 flex items-end justify-between px-8 pb-1 text-sm font-medium">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v18m-7-4l7 4 7-4M5 11l7 4 7-4M5 7l7 4 7-4"/></svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 4h-3V2h-4v2H7v18h10V4z"/></svg>
                  </div>
                </div>

                {/* Header */}
                <div className="px-5 pt-2 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-400 uppercase tracking-wider">Palm Harbor CC</div>
                      <h1 className="font-display text-2xl font-semibold text-stone-800">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                          <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-stone-50 flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">1</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white text-sm font-medium shadow-lg">JW</div>
                    </div>
                  </div>
                </div>

                {/* Alert Card */}
                <div className="px-5 mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Review Required</div>
                        <div className="text-sm text-white/80 mt-0.5">New vendor payment needs approval</div>
                      </div>
                      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="px-5 grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-stone-400 uppercase tracking-wider">Operating</div>
                    <div className="font-display text-2xl font-semibold text-stone-800 mt-1">$2.10M</div>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-xs text-emerald-600 font-medium">+7.7%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-stone-400 uppercase tracking-wider">Reserves</div>
                    <div className="font-display text-2xl font-semibold text-stone-800 mt-1">$3.71M</div>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-red-500 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-xs text-red-600 font-medium">-$340K</span>
                    </div>
                  </div>
                </div>

                {/* Health Score */}
                <div className="px-5 mb-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-stone-400 uppercase tracking-wider">Financial Health</div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-display text-4xl font-semibold text-stone-800">72</span>
                          <span className="text-stone-400 text-lg">/100</span>
                        </div>
                        <div className="text-sm text-stone-500 mt-1">Good · Similar clubs avg 74</div>
                      </div>
                      <div className="w-20 h-20 relative">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e7e5e4" strokeWidth="3"/>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#scoreGrad)" strokeWidth="3" strokeDasharray="72, 100" className="progress-ring"/>
                          <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f59e0b"/>
                              <stop offset="100%" stopColor="#22c55e"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="px-5 mb-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-3">6 Month Trend</div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={cashFlowData}>
                        <defs>
                          <linearGradient id="mobileGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="reserves" stroke="#3b82f6" strokeWidth={2} fill="url(#mobileGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="px-5 mb-24">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-stone-400 uppercase tracking-wider">Recent Activity</div>
                      <span className="text-xs text-blue-600 font-medium">View All</span>
                    </div>
                    <div className="space-y-3">
                      {transactions.slice(0, 4).map(tx => (
                        <div key={tx.id} className={`flex items-center justify-between py-2 ${tx.flagged ? 'bg-amber-50 -mx-2 px-2 rounded-lg' : ''}`}>
                          <div className="flex items-center gap-2">
                            {tx.flagged && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                            <div>
                              <div className="text-sm font-medium text-stone-800">{tx.vendor}</div>
                              <div className="text-xs text-stone-400">{tx.date}</div>
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-stone-700'}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Tab Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-2 pb-8" style={{ width: '370px', marginLeft: '10px' }}>
                  <div className="flex justify-around">
                    {[
                      { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
                      { id: 'activity', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Activity' },
                      { id: 'budget', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Budget' },
                      { id: 'more', icon: 'M4 6h16M4 12h16M4 18h16', label: 'More' },
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setMobileTab(tab.id)}
                        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${mobileTab === tab.id ? 'text-stone-800' : 'text-stone-400'}`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                        </svg>
                        <span className={`text-xs mt-1 ${mobileTab === tab.id ? 'font-medium' : ''}`}>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ONBOARDING FLOW ==================== */}
        {screen === 'onboarding' && (
          <div className="max-w-xl mx-auto fade-in">
            <div className="card overflow-hidden">
              {/* Progress */}
              <div className="h-1 bg-stone-100">
                <div className="h-full bg-gradient-to-r from-stone-600 to-stone-800 transition-all duration-500" style={{ width: `${((onboardingStep + 1) / 5) * 100}%` }}></div>
              </div>

              <div className="p-8">
                {/* Step 0: Welcome */}
                {onboardingStep === 0 && (
                  <div className="text-center slide-up">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h1 className="font-display text-3xl font-semibold text-stone-800 mb-3">Welcome to Sightline</h1>
                    <p className="text-stone-500 mb-8">Financial transparency for your club. Let's get you set up in about 5 minutes.</p>
                    
                    <div className="text-left space-y-3 mb-8">
                      {['Connect your bank accounts securely', 'Import your budget and historical data', 'Invite your finance committee', 'Start seeing insights immediately'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-stone-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={() => setOnboardingStep(1)} className="w-full py-4 btn-primary rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all">
                      Get Started
                    </button>
                  </div>
                )}

                {/* Step 1: Club Info */}
                {onboardingStep === 1 && (
                  <div className="slide-up">
                    <div className="text-center mb-8">
                      <div className="text-sm text-stone-400 uppercase tracking-wider mb-2">Step 1 of 4</div>
                      <h2 className="font-display text-2xl font-semibold text-stone-800">About Your Club</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Club Name</label>
                        <input type="text" defaultValue="Palm Harbor Country Club" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Club Type</label>
                        <select className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-stone-400">
                          <option>Country Club (Golf + Social)</option>
                          <option>Golf Club</option>
                          <option>City Club</option>
                          <option>HOA / Condo Association</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Number of Members</label>
                          <input type="text" defaultValue="425" className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Average Annual Dues</label>
                          <input type="text" defaultValue="$48,000" className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => setOnboardingStep(0)} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-50 rounded-xl">Back</button>
                      <button onClick={() => setOnboardingStep(2)} className="flex-1 py-3 btn-primary rounded-xl font-medium">Continue</button>
                    </div>
                  </div>
                )}

                {/* Step 2: Bank Connection */}
                {onboardingStep === 2 && (
                  <div className="slide-up">
                    <div className="text-center mb-8">
                      <div className="text-sm text-stone-400 uppercase tracking-wider mb-2">Step 2 of 4</div>
                      <h2 className="font-display text-2xl font-semibold text-stone-800">Connect Your Banks</h2>
                      <p className="text-stone-500 mt-2">Securely link your operating and reserve accounts</p>
                    </div>

                    <div className="space-y-3">
                      {/* Connected */}
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-stone-200 shadow-sm">
                              <span className="font-bold text-blue-700">T</span>
                            </div>
                            <div>
                              <div className="font-medium text-stone-800">Truist Operating ****4521</div>
                              <div className="text-sm text-emerald-600">Connected successfully</div>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Add Another */}
                      <button className="w-full p-4 border-2 border-dashed border-stone-300 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all">
                        <div className="flex items-center justify-center gap-2 text-stone-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="font-medium">Connect Reserve Account</span>
                        </div>
                      </button>

                      {/* Security Note */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl mt-4">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <span className="font-medium">Bank-level security.</span> We use Plaid to connect. Your credentials are never stored on our servers.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => setOnboardingStep(1)} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-50 rounded-xl">Back</button>
                      <button onClick={() => setOnboardingStep(3)} className="flex-1 py-3 btn-primary rounded-xl font-medium">Continue</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Import Data */}
                {onboardingStep === 3 && (
                  <div className="slide-up">
                    <div className="text-center mb-8">
                      <div className="text-sm text-stone-400 uppercase tracking-wider mb-2">Step 3 of 4</div>
                      <h2 className="font-display text-2xl font-semibold text-stone-800">Import Your Data</h2>
                      <p className="text-stone-500 mt-2">Upload your budget and historical financial reports</p>
                    </div>

                    <div className="space-y-3">
                      {/* Uploaded File */}
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-stone-800">2024_Budget.xlsx</div>
                              <div className="text-sm text-emerald-600">Uploaded successfully</div>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Upload Zone */}
                      <div className="p-8 border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-stone-400 hover:bg-stone-50 cursor-pointer transition-all">
                        <svg className="w-10 h-10 text-stone-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="font-medium text-stone-700">Drop files here or click to browse</div>
                        <div className="text-sm text-stone-400 mt-1">CSV, Excel, or PDF (max 10MB)</div>
                      </div>

                      <div className="text-sm text-stone-500 mt-4">
                        <div className="font-medium text-stone-700 mb-2">Recommended uploads:</div>
                        <ul className="space-y-1 text-stone-500">
                          <li>• Reserve study (most recent)</li>
                          <li>• Last annual audit report</li>
                          <li>• Key vendor contracts</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => setOnboardingStep(2)} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-50 rounded-xl">Back</button>
                      <button onClick={() => setOnboardingStep(4)} className="px-4 py-3 text-stone-600 font-medium hover:bg-stone-50 rounded-xl">Skip</button>
                      <button onClick={() => setOnboardingStep(4)} className="flex-1 py-3 btn-primary rounded-xl font-medium">Continue</button>
                    </div>
                  </div>
                )}

                {/* Step 4: Invite Team */}
                {onboardingStep === 4 && (
                  <div className="slide-up">
                    <div className="text-center mb-8">
                      <div className="text-sm text-stone-400 uppercase tracking-wider mb-2">Step 4 of 4</div>
                      <h2 className="font-display text-2xl font-semibold text-stone-800">Invite Your Team</h2>
                      <p className="text-stone-500 mt-2">Add finance committee members and board officers</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input type="email" placeholder="colleague@email.com" className="flex-1 px-4 py-3 border border-stone-200 rounded-xl" />
                        <button className="px-5 py-3 btn-primary rounded-xl font-medium">Invite</button>
                      </div>

                      <div className="space-y-2">
                        {[
                          { name: 'Margaret Chen', email: 'mchen@email.com', role: 'Treasurer' },
                          { name: 'Robert Patterson', email: 'rpatterson@email.com', role: 'Board Member' },
                        ].map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-stone-400 flex items-center justify-center text-white text-sm font-medium">
                                {p.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-stone-800">{p.name}</div>
                                <div className="text-xs text-stone-500">{p.email}</div>
                              </div>
                            </div>
                            <select className="text-sm border border-stone-200 rounded-lg px-2 py-1 bg-white">
                              <option>{p.role}</option>
                              <option>Admin</option>
                              <option>Board Member</option>
                              <option>View Only</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => setOnboardingStep(3)} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-50 rounded-xl">Back</button>
                      <button onClick={() => navigateTo('overview')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                        Launch Dashboard →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ANOMALY DETAIL ==================== */}
        {screen === 'anomaly' && (
          <div className="max-w-4xl mx-auto fade-in">
            {/* Back Button */}
            <button onClick={() => navigateTo('overview')} className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <div className="card overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">MEDIUM RISK</span>
                        <span className="text-xs text-stone-500">New Vendor</span>
                      </div>
                      <h1 className="font-display text-2xl font-semibold text-stone-800">{anomalyData.vendor}</h1>
                      <p className="text-stone-600 mt-1">{anomalyData.category} · {anomalyData.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-semibold text-stone-800">${anomalyData.amount.toLocaleString()}</div>
                    <div className="text-sm text-amber-600 font-medium mt-1">{anomalyData.status}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left - Flags */}
                  <div className="col-span-2 space-y-6">
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">Risk Flags Detected</h3>
                      <div className="space-y-2">
                        {anomalyData.flags.map((f, i) => (
                          <div key={i} className={`p-4 rounded-xl ${f.severity === 'high' ? 'severity-high' : f.severity === 'medium' ? 'severity-medium' : 'severity-low'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${f.severity === 'high' ? 'bg-red-500' : f.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              <div>
                                <div className="font-medium text-stone-800">{f.title}</div>
                                <div className="text-sm text-stone-600 mt-0.5">{f.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vendor Comparison */}
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">Comparison with Similar Vendors</h3>
                      <div className="bg-stone-50 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-stone-100">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium text-stone-600">Vendor</th>
                              <th className="text-right py-3 px-4 font-medium text-stone-600">Avg Payment</th>
                              <th className="text-right py-3 px-4 font-medium text-stone-600">History</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-amber-50 border-b border-amber-100">
                              <td className="py-3 px-4 font-medium text-amber-800">{anomalyData.vendor}</td>
                              <td className="py-3 px-4 text-right text-amber-800 font-medium">${anomalyData.amount.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right text-amber-600">New vendor</td>
                            </tr>
                            {anomalyData.vendorComparison.map((v, i) => (
                              <tr key={i} className="border-b border-stone-100">
                                <td className="py-3 px-4 text-stone-700">{v.name}</td>
                                <td className="py-3 px-4 text-right text-stone-700">${v.avgPayment.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-stone-500">{v.years} years</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">Activity Timeline</h3>
                      <div className="space-y-4">
                        {anomalyData.timeline.map((t, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-stone-300 border-2 border-white shadow"></div>
                              {i < anomalyData.timeline.length - 1 && <div className="w-0.5 flex-1 bg-stone-200 my-1"></div>}
                            </div>
                            <div className="pb-4">
                              <div className="text-sm font-medium text-stone-800">{t.event}</div>
                              <div className="text-xs text-stone-500">{t.date} at {t.time} · {t.actor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="space-y-6">
                    {/* Risk Score */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-amber-100">
                      <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">Risk Score</div>
                      <div className="font-display text-5xl font-semibold text-amber-600">{anomalyData.riskScore}</div>
                      <div className="text-sm text-stone-500 mt-1">out of 100</div>
                      <div className="w-full h-2 bg-stone-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-red-400" style={{ width: `${anomalyData.riskScore}%` }}></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full py-3 btn-primary rounded-xl font-medium">Approve Transaction</button>
                        <button className="w-full py-3 border border-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-50">Request Documentation</button>
                        <button className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50">Flag for Investigation</button>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div>
                      <h3 className="font-medium text-stone-800 mb-3">Resolution Checklist</h3>
                      <div className="space-y-2">
                        {anomalyData.recommendations.map((r, i) => (
                          <label key={i} className="flex items-start gap-3 p-2 hover:bg-stone-50 rounded-lg cursor-pointer">
                            <input type="checkbox" className="mt-1 rounded border-stone-300" />
                            <span className="text-sm text-stone-600">{r.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DOCUMENT LINKING ==================== */}
        {screen === 'documents' && (
          <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-semibold text-stone-800">Document Management</h1>
                <p className="text-stone-500">Link invoices, contracts, and receipts to transactions</p>
              </div>
              <button className="px-4 py-2 btn-primary rounded-xl font-medium shadow-lg">
                + Upload Document
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Transaction Panel */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Select Transaction</h2>
                
                <div className="space-y-2">
                  {transactions.slice(0, 6).map(tx => (
                    <div 
                      key={tx.id}
                      onClick={() => setSelectedDoc(tx.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDoc === tx.id 
                          ? 'border-stone-800 bg-stone-50' 
                          : 'border-transparent hover:bg-stone-50'
                      } ${tx.flagged ? 'bg-amber-50' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {tx.flagged && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                            <span className="font-medium text-stone-800">{tx.vendor}</span>
                          </div>
                          <div className="text-sm text-stone-500 mt-0.5">{tx.fullDate}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-stone-800'}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {tx.hasDoc ? (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Doc attached</span>
                            ) : (
                              <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded">No docs</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Library */}
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Document Library</h2>
                
                {/* Search */}
                <div className="relative mb-4">
                  <input type="text" placeholder="Search documents..." className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm" />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4">
                  {['All', 'Invoices', 'Contracts', 'Audits'].map(f => (
                    <button key={f} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${f === 'All' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* Document List */}
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.type === 'Invoice' ? 'bg-blue-100' :
                          doc.type === 'Contract' ? 'bg-purple-100' :
                          doc.type === 'Audit' ? 'bg-emerald-100' : 'bg-stone-100'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            doc.type === 'Invoice' ? 'text-blue-600' :
                            doc.type === 'Contract' ? 'text-purple-600' :
                            doc.type === 'Audit' ? 'text-emerald-600' : 'text-stone-600'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-stone-800">{doc.name}</div>
                          <div className="text-xs text-stone-500">{doc.type} · {doc.size} · {doc.date}</div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg transition-all">
                        Link
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Zone */}
                <div className="mt-4 p-6 border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-stone-400 hover:bg-stone-50 cursor-pointer transition-all">
                  <svg className="w-8 h-8 text-stone-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="text-sm text-stone-600 font-medium">Drop files or click to upload</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BUDGET DETAIL ==================== */}
        {screen === 'budget' && (
          <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-semibold text-stone-800">Budget vs Actual</h1>
                <p className="text-stone-500">Year-to-date through November 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="px-4 py-2 border border-stone-200 rounded-xl bg-white text-sm">
                  <option>2024</option>
                  <option>2023</option>
                </select>
                <button className="px-4 py-2 btn-primary rounded-xl text-sm font-medium">Export Report</button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Budget', value: '$6.24M', color: 'stone' },
                { label: 'Actual Spend', value: '$6.50M', color: 'stone' },
                { label: 'Variance', value: '+$262K', color: 'amber' },
                { label: '% of Budget', value: '104.2%', color: 'stone' },
              ].map((s, i) => (
                <div key={i} className={`card p-5 ${s.color === 'amber' ? 'bg-amber-50 border border-amber-200' : ''}`}>
                  <div className="text-xs text-stone-500 uppercase tracking-wider">{s.label}</div>
                  <div className={`font-display text-2xl font-semibold mt-1 ${s.color === 'amber' ? 'text-amber-600' : 'text-stone-800'}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Budget Categories */}
            <div className="card overflow-hidden">
              <div className="space-y-1">
                {budgetData.map((b, i) => (
                  <div key={i} className="border-b border-stone-100 last:border-0">
                    <div 
                      onClick={() => setExpandedBudget(expandedBudget === i ? null : i)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl">
                          {b.icon}
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{b.category}</div>
                          <div className="text-sm text-stone-500">{formatCurrency(b.actual)} of {formatCurrency(b.budget)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-48">
                          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${b.variance > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((b.actual / b.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={`w-20 text-right font-medium ${b.variance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {b.variance > 0 ? '+' : ''}{formatCurrency(b.variance)}
                        </div>
                        <svg className={`w-5 h-5 text-stone-400 transition-transform ${expandedBudget === i ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Expanded */}
                    {expandedBudget === i && (
                      <div className="px-5 pb-5 bg-stone-50">
                        <div className="space-y-3 pt-2">
                          {b.subcategories.map((sub, j) => (
                            <div key={j} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-stone-400"></div>
                                <span className="text-sm text-stone-700">{sub.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-stone-500">{formatCurrency(sub.actual)} / {formatCurrency(sub.budget)}</span>
                                <span className={`text-sm font-medium w-16 text-right ${sub.actual > sub.budget ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  {sub.actual > sub.budget ? '+' : ''}{formatCurrency(sub.actual - sub.budget)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS ==================== */}
        {screen === 'settings' && (
          <div className="max-w-3xl mx-auto fade-in">
            <h1 className="font-display text-2xl font-semibold text-stone-800 mb-6">Settings</h1>
            
            <div className="card overflow-hidden divide-y divide-stone-100">
              {/* Club Profile */}
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Club Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-500 mb-1">Club Name</label>
                    <input type="text" defaultValue="Palm Harbor Country Club" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-500 mb-1">Club Type</label>
                    <select className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white">
                      <option>Country Club</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Anomaly Alerts', desc: 'Get notified when unusual transactions are detected', on: true },
                    { label: 'Weekly Summary', desc: 'Receive a weekly financial summary every Monday', on: true },
                    { label: 'Budget Alerts', desc: 'Alert when spending exceeds 90% of budget', on: false },
                    { label: 'Large Transactions', desc: 'Notify for transactions over $25,000', on: true },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-stone-800">{n.label}</div>
                        <div className="text-sm text-stone-500">{n.desc}</div>
                      </div>
                      <button className={`w-12 h-7 rounded-full transition-colors ${n.on ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${n.on ? 'translate-x-6' : 'translate-x-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="p-6">
                <h3 className="font-medium text-stone-800 mb-4">Connected Bank Accounts</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Truist Operating ****4521', sync: '2 hours ago' },
                    { name: 'Truist Reserve ****7832', sync: '2 hours ago' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-stone-200 shadow-sm">
                          <span className="font-bold text-blue-700">T</span>
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{a.name}</div>
                          <div className="text-xs text-stone-500">Last synced {a.sync}</div>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Connected</span>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-600 font-