import React, { useState } from 'react';

// ============================================
// DATA
// ============================================

const transactions = [
  { id: 1, date: 'Dec 9', fullDate: 'December 9, 2024', vendor: 'Toro Equipment Co.', amount: -47500, flagged: false, hasDoc: true },
  { id: 2, date: 'Dec 9', fullDate: 'December 9, 2024', vendor: 'ADP Payroll Services', amount: -198450, flagged: false, hasDoc: true },
  { id: 3, date: 'Dec 8', fullDate: 'December 8, 2024', vendor: 'Sysco Foods', amount: -34200, flagged: false, hasDoc: true },
  { id: 4, date: 'Dec 8', fullDate: 'December 8, 2024', vendor: 'Premium Landscaping LLC', amount: -28000, flagged: true, hasDoc: false },
  { id: 5, date: 'Dec 7', fullDate: 'December 7, 2024', vendor: 'Member Dues Collection', amount: 425000, flagged: false, hasDoc: false },
  { id: 6, date: 'Dec 6', fullDate: 'December 6, 2024', vendor: 'Florida Power & Light', amount: -18750, flagged: false, hasDoc: true },
];

const documents = [
  { id: 1, name: 'Hartford_Policy_2024.pdf', type: 'Contract', size: '2.4 MB', date: 'Nov 1, 2024' },
  { id: 2, name: 'Sysco_Invoice_847291.pdf', type: 'Invoice', size: '156 KB', date: 'Dec 8, 2024' },
  { id: 3, name: 'Toro_PO_2024-1847.pdf', type: 'Invoice', size: '89 KB', date: 'Dec 9, 2024' },
  { id: 4, name: 'Q3_Audit_Report.pdf', type: 'Audit', size: '4.1 MB', date: 'Oct 15, 2024' },
  { id: 5, name: 'Reserve_Study_2024.pdf', type: 'Report', size: '8.7 MB', date: 'Sep 1, 2024' },
  { id: 6, name: 'FPL_Statement_Dec.pdf', type: 'Invoice', size: '234 KB', date: 'Dec 6, 2024' },
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

const formatCurrency = (val) => {
  if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
};

// ============================================
// DOCUMENT LINKING
// ============================================

export function DocumentLinking() {
  const [selectedTx, setSelectedTx] = useState(null);
  const [filter, setFilter] = useState('All');

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-800">Document Management</h1>
          <p className="text-stone-500">Link invoices, contracts, and receipts to transactions</p>
        </div>
        <button className="px-4 py-2 btn-primary rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
          + Upload Document
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Transaction Panel */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-4">Select Transaction</h2>
          
          <div className="space-y-2">
            {transactions.map(tx => (
              <div 
                key={tx.id}
                onClick={() => setSelectedTx(tx.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTx === tx.id 
                    ? 'border-stone-800 bg-stone-50' 
                    : 'border-transparent hover:bg-stone-50'
                } ${tx.flagged ? 'bg-amber-50' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {tx.flagged && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                      <span className="font-medium text-stone-800">{tx.vendor}</span>
                    </div>
                    <div className="text-sm text-stone-500 mt-0.5">{tx.fullDate}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-stone-800'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </div>
                    <div className="mt-1">
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
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" 
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {['All', 'Invoices', 'Contracts', 'Audits'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="space-y-2">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border border-stone-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
              >
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
            <div className="text-xs text-stone-400 mt-1">PDF, PNG, JPG up to 10MB</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BUDGET DETAIL
// ============================================

export function BudgetDetail() {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-800">Budget vs Actual</h1>
          <p className="text-stone-500">Year-to-date through November 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none">
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
        ].map((stat, i) => (
          <div key={i} className={`card p-5 ${stat.color === 'amber' ? 'bg-amber-50 border border-amber-200' : ''}`}>
            <div className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</div>
            <div className={`font-display text-2xl font-semibold mt-1 ${stat.color === 'amber' ? 'text-amber-600' : 'text-stone-800'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Budget Categories */}
      <div className="card overflow-hidden">
        <div className="space-y-1">
          {budgetData.map((item, i) => (
            <div key={i} className="border-b border-stone-100 last:border-0">
              {/* Category Row */}
              <div 
                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{item.category}</div>
                    <div className="text-sm text-stone-500">
                      {formatCurrency(item.actual)} of {formatCurrency(item.budget)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-48">
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.variance > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((item.actual / item.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className={`w-20 text-right font-medium ${item.variance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                  </div>
                  <svg 
                    className={`w-5 h-5 text-stone-400 transition-transform ${expandedRow === i ? 'rotate-90' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Expanded Subcategories */}
              {expandedRow === i && (
                <div className="px-5 pb-5 bg-stone-50">
                  <div className="space-y-3 pt-2">
                    {item.subcategories.map((sub, j) => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          <span className="text-sm text-stone-700">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-stone-500">
                            {formatCurrency(sub.actual)} / {formatCurrency(sub.budget)}
                          </span>
                          <span className={`text-sm font-medium w-16 text-right ${
                            sub.actual > sub.budget ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
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
  );
}

export default { DocumentLinking, BudgetDetail };
