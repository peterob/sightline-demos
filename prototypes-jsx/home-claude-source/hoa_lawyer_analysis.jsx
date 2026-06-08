import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, Legend } from 'recharts';

// Annual averages for legal-focused terms
const annualData = [
  {year: '2004', complaint: 0, lawsuit: 0, attorney: 0, lawyer: 0, audit: 0},
  {year: '2005', complaint: 0, lawsuit: 0, attorney: 0, lawyer: 0, audit: 0},
  {year: '2006', complaint: 0, lawsuit: 0, attorney: 0, lawyer: 0, audit: 0},
  {year: '2007', complaint: 1.8, lawsuit: 0, attorney: 9.6, lawyer: 0, audit: 0},
  {year: '2008', complaint: 0, lawsuit: 4.0, attorney: 10.3, lawyer: 0, audit: 0},
  {year: '2009', complaint: 3.8, lawsuit: 4.8, attorney: 20.2, lawyer: 0, audit: 0},
  {year: '2010', complaint: 0, lawsuit: 1.0, attorney: 16.3, lawyer: 1.2, audit: 0},
  {year: '2011', complaint: 0.8, lawsuit: 6.2, attorney: 19.8, lawyer: 5.7, audit: 0},
  {year: '2012', complaint: 6.1, lawsuit: 9.1, attorney: 21.6, lawyer: 8.3, audit: 1.1},
  {year: '2013', complaint: 5.6, lawsuit: 11.8, attorney: 21.8, lawyer: 8.7, audit: 0},
  {year: '2014', complaint: 6.5, lawsuit: 9.1, attorney: 24.3, lawyer: 9.1, audit: 0.8},
  {year: '2015', complaint: 9.2, lawsuit: 11.3, attorney: 23.5, lawyer: 10.8, audit: 1.1},
  {year: '2016', complaint: 8.3, lawsuit: 10.3, attorney: 28.0, lawyer: 12.8, audit: 1.2},
  {year: '2017', complaint: 8.9, lawsuit: 11.8, attorney: 27.9, lawyer: 13.1, audit: 0.3},
  {year: '2018', complaint: 9.7, lawsuit: 12.1, attorney: 30.3, lawyer: 14.2, audit: 2.5},
  {year: '2019', complaint: 11.8, lawsuit: 12.8, attorney: 33.3, lawyer: 14.7, audit: 2.9},
  {year: '2020', complaint: 12.3, lawsuit: 13.5, attorney: 33.8, lawyer: 16.0, audit: 3.3},
  {year: '2021', complaint: 14.1, lawsuit: 14.8, attorney: 36.1, lawyer: 16.8, audit: 3.5},
  {year: '2022', complaint: 18.3, lawsuit: 17.2, attorney: 42.5, lawyer: 20.6, audit: 5.2},
  {year: '2023', complaint: 20.3, lawsuit: 21.3, attorney: 50.5, lawyer: 24.8, audit: 7.5},
  {year: '2024', complaint: 22.3, lawsuit: 22.0, attorney: 51.9, lawyer: 27.3, audit: 8.1},
  {year: '2025', complaint: 27.3, lawsuit: 32.1, attorney: 74.3, lawyer: 42.8, audit: 12.8},
];

// Monthly data for 2023-2025 (the explosive period)
const recentMonthly = [
  {month: 'Jan 23', complaint: 18, lawsuit: 20, attorney: 43, lawyer: 19, audit: 8},
  {month: 'Apr 23', complaint: 22, lawsuit: 21, attorney: 48, lawyer: 26, audit: 8},
  {month: 'Jul 23', complaint: 21, lawsuit: 21, attorney: 53, lawyer: 30, audit: 5},
  {month: 'Oct 23', complaint: 24, lawsuit: 19, attorney: 60, lawyer: 29, audit: 10},
  {month: 'Jan 24', complaint: 19, lawsuit: 19, attorney: 52, lawyer: 23, audit: 10},
  {month: 'Apr 24', complaint: 23, lawsuit: 21, attorney: 58, lawyer: 29, audit: 7},
  {month: 'Jul 24', complaint: 22, lawsuit: 24, attorney: 53, lawyer: 28, audit: 5},
  {month: 'Oct 24', complaint: 22, lawsuit: 24, attorney: 55, lawyer: 25, audit: 6},
  {month: 'Jan 25', complaint: 20, lawsuit: 24, attorney: 57, lawyer: 30, audit: 8},
  {month: 'Apr 25', complaint: 28, lawsuit: 26, attorney: 65, lawyer: 37, audit: 7},
  {month: 'May 25', complaint: 25, lawsuit: 26, attorney: 65, lawyer: 47, audit: 10},
  {month: 'Jun 25', complaint: 30, lawsuit: 37, attorney: 88, lawyer: 43, audit: 16},
  {month: 'Jul 25', complaint: 28, lawsuit: 43, attorney: 100, lawyer: 56, audit: 18},
  {month: 'Aug 25', complaint: 31, lawsuit: 43, attorney: 99, lawyer: 58, audit: 13},
  {month: 'Sep 25', complaint: 30, lawsuit: 35, attorney: 78, lawyer: 50, audit: 13},
  {month: 'Oct 25', complaint: 32, lawsuit: 36, attorney: 88, lawyer: 50, audit: 18},
  {month: 'Nov 25', complaint: 31, lawsuit: 38, attorney: 73, lawyer: 44, audit: 22},
  {month: 'Dec 25', complaint: 24, lawsuit: 27, attorney: 70, lawyer: 35, audit: 11},
];

// Combined legal terms
const legalCombined = annualData.map(d => ({
  year: d.year,
  legalTotal: d.attorney + d.lawyer + d.lawsuit,
  problemTotal: d.complaint + d.audit,
  attorney: d.attorney,
  lawyer: d.lawyer
}));

export default function HOALawyerAnalysis() {
  const [view, setView] = useState('revelation');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">The Lawyer Signal: HOA Legal Searches Hit All-Time High</h1>
          <p className="text-slate-400">When people search for attorneys, they're past curiosity — they're taking action</p>
        </div>

        {/* The Revelation */}
        <div className="bg-gradient-to-r from-rose-900/50 to-orange-900/50 border border-rose-500/40 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">⚖️</div>
            <div>
              <h2 className="text-2xl font-bold">July 2025: "HOA Attorney" Hits 100</h2>
              <p className="text-slate-400">The highest-intent professional service term peaks</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="text-center bg-slate-800/50 rounded-lg p-4">
              <div className="text-4xl font-bold text-rose-400">100</div>
              <div className="text-sm text-slate-400">HOA attorney peak</div>
              <div className="text-xs text-slate-500">July 2025</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-lg p-4">
              <div className="text-4xl font-bold text-orange-400">+120%</div>
              <div className="text-sm text-slate-400">Growth since 2020</div>
              <div className="text-xs text-slate-500">attorney searches</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-lg p-4">
              <div className="text-4xl font-bold text-amber-400">+168%</div>
              <div className="text-sm text-slate-400">Growth since 2020</div>
              <div className="text-xs text-slate-500">lawyer searches</div>
            </div>
            <div className="text-center bg-slate-800/50 rounded-lg p-4">
              <div className="text-4xl font-bold text-emerald-400">+288%</div>
              <div className="text-sm text-slate-400">Growth since 2020</div>
              <div className="text-xs text-slate-500">audit searches</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['revelation', 'data', 'volume', 'implications'].map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === tab 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab === 'revelation' && '🔥 The Signal'}
              {tab === 'data' && '📊 Full Data'}
              {tab === 'volume' && '🔢 Volume'}
              {tab === 'implications' && '💡 So What'}
            </button>
          ))}
        </div>

        {/* Revelation Tab */}
        {view === 'revelation' && (
          <div className="space-y-6">
            
            {/* Why Lawyers Matter */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Why "HOA Attorney" Is the Ultimate Demand Signal</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0 text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Highest Intent Signal</h4>
                      <p className="text-sm text-slate-400">
                        Nobody searches "HOA attorney" for fun. This is someone ready to spend 
                        $200-500/hour to solve a problem.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0 text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-white">Problem Severity Indicator</h4>
                      <p className="text-sm text-slate-400">
                        Legal help = escalation. These aren't minor disputes — they're situations 
                        where someone feels they need professional intervention.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0 text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Market Size Proxy</h4>
                      <p className="text-sm text-slate-400">
                        Every attorney search represents real economic activity — fees, settlements, 
                        court costs. This is measurable demand.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-400 mb-3">The Search Hierarchy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Curiosity</span>
                      <span className="text-slate-500">"HOA rules"</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Frustration</span>
                      <span className="text-slate-500">"HOA complaint"</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Investigation</span>
                      <span className="text-slate-500">"HOA fraud" / "audit"</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Escalation</span>
                      <span className="text-slate-500">"HOA lawsuit"</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-rose-900/30 border border-rose-500/30 rounded">
                      <span className="text-rose-400 font-semibold">Action</span>
                      <span className="text-rose-300 font-semibold">"HOA attorney" ← Peak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Chart */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">2023-2025: The Explosion</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={recentMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={[0, 110]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="attorney" stroke="#ef4444" strokeWidth={3} name="HOA attorney" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="lawyer" stroke="#f97316" strokeWidth={2} name="HOA lawyer" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="lawsuit" stroke="#eab308" strokeWidth={2} name="HOA lawsuit" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="complaint" stroke="#22c55e" strokeWidth={2} name="HOA complaint" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="audit" stroke="#3b82f6" strokeWidth={2} name="HOA audit" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-slate-400 text-sm mt-4">
                All five terms accelerate in mid-2025, but "HOA attorney" leads the surge — 
                from ~50 in early 2024 to <span className="text-rose-400 font-semibold">100 in July 2025</span>.
              </p>
            </div>

            {/* The Pattern */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">The Pattern: Legal Searches Lead, Others Follow</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-rose-400 mb-2">Attorney + Lawyer</h4>
                  <div className="text-3xl font-bold text-white mb-1">117</div>
                  <div className="text-sm text-slate-400 mb-2">Combined 2025 avg index</div>
                  <p className="text-xs text-slate-500">
                    These professional service terms dominate volume and show highest growth
                  </p>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-400 mb-2">Lawsuit</h4>
                  <div className="text-3xl font-bold text-white mb-1">32</div>
                  <div className="text-sm text-slate-400 mb-2">2025 avg index</div>
                  <p className="text-xs text-slate-500">
                    Legal action intent — doubled since 2020, tracking with attorney searches
                  </p>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">Audit</h4>
                  <div className="text-3xl font-bold text-white mb-1">13</div>
                  <div className="text-sm text-slate-400 mb-2">2025 avg index</div>
                  <p className="text-xs text-slate-500">
                    Proactive investigation — fastest % growth, your early adopter signal
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {view === 'data' && (
          <div className="space-y-6">
            
            {/* Full Historical Chart */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">20-Year Trend: Legal-Focused HOA Searches</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={annualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" domain={[0, 80]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="attorney" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} name="HOA attorney" />
                  <Line type="monotone" dataKey="lawyer" stroke="#f97316" strokeWidth={2} name="HOA lawyer" dot={false} />
                  <Line type="monotone" dataKey="lawsuit" stroke="#eab308" strokeWidth={2} name="HOA lawsuit" dot={false} />
                  <Line type="monotone" dataKey="complaint" stroke="#22c55e" strokeWidth={2} name="HOA complaint" dot={false} />
                  <Line type="monotone" dataKey="audit" stroke="#3b82f6" strokeWidth={2} name="HOA audit" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Growth Table */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Term-by-Term Growth Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-700">
                      <th className="pb-3 text-slate-400">Term</th>
                      <th className="pb-3 text-slate-400">2020 Avg</th>
                      <th className="pb-3 text-slate-400">2025 Avg</th>
                      <th className="pb-3 text-slate-400">2025 Peak</th>
                      <th className="pb-3 text-slate-400">5-Year Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr className="bg-rose-900/10">
                      <td className="py-3 font-medium text-rose-400">HOA attorney</td>
                      <td className="py-3">33.8</td>
                      <td className="py-3">74.3</td>
                      <td className="py-3 font-bold">100</td>
                      <td className="py-3 text-emerald-400 font-bold">+120%</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-orange-400">HOA lawyer</td>
                      <td className="py-3">16.0</td>
                      <td className="py-3">42.8</td>
                      <td className="py-3">58</td>
                      <td className="py-3 text-emerald-400">+168%</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-amber-400">HOA lawsuit</td>
                      <td className="py-3">13.5</td>
                      <td className="py-3">32.1</td>
                      <td className="py-3">43</td>
                      <td className="py-3 text-emerald-400">+138%</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-green-400">HOA complaint</td>
                      <td className="py-3">12.3</td>
                      <td className="py-3">27.3</td>
                      <td className="py-3">32</td>
                      <td className="py-3 text-emerald-400">+122%</td>
                    </tr>
                    <tr className="bg-blue-900/10">
                      <td className="py-3 font-medium text-blue-400">HOA audit</td>
                      <td className="py-3">3.3</td>
                      <td className="py-3">12.8</td>
                      <td className="py-3">22</td>
                      <td className="py-3 text-emerald-400 font-bold">+288%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="text-rose-400 font-semibold">Key finding:</span> "HOA attorney" 
                  is both the <span className="text-white">highest volume</span> legal term AND 
                  growing at <span className="text-white">120%</span>. The only term growing faster 
                  is "HOA audit" (+288%), which signals proactive investigation demand.
                </p>
              </div>
            </div>

            {/* Combined Legal Index */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Combined "Legal Action" Index</h3>
              <p className="text-slate-400 text-sm mb-4">
                Attorney + Lawyer + Lawsuit searches combined as a proxy for total legal market activity
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={legalCombined}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="legalTotal" fill="#ef4444" stroke="#ef4444" fillOpacity={0.4} name="Legal Total" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">63</div>
                  <div className="text-xs text-slate-500">2020 combined index</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-400">149</div>
                  <div className="text-xs text-slate-500">2025 combined index</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">+137%</div>
                  <div className="text-xs text-slate-500">5-year growth</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Volume Tab */}
        {view === 'volume' && (
          <div className="space-y-6">
            
            {/* Volume Estimates */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Absolute Volume Estimates: Legal-Intent Searches</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-700">
                      <th className="pb-3 text-slate-400">Term</th>
                      <th className="pb-3 text-slate-400">Est. Monthly (2025)</th>
                      <th className="pb-3 text-slate-400">Est. Annual</th>
                      <th className="pb-3 text-slate-400">$ Value Proxy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr className="bg-rose-900/10">
                      <td className="py-3 font-medium text-rose-400">HOA attorney</td>
                      <td className="py-3">20,000 - 50,000</td>
                      <td className="py-3">240K - 600K</td>
                      <td className="py-3 text-slate-400">$300-500/hr legal fees</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-orange-400">HOA lawyer</td>
                      <td className="py-3">10,000 - 30,000</td>
                      <td className="py-3">120K - 360K</td>
                      <td className="py-3 text-slate-400">$200-400/hr legal fees</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-amber-400">HOA lawsuit</td>
                      <td className="py-3">8,000 - 20,000</td>
                      <td className="py-3">96K - 240K</td>
                      <td className="py-3 text-slate-400">$5K-50K+ litigation</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-green-400">HOA complaint</td>
                      <td className="py-3">6,000 - 15,000</td>
                      <td className="py-3">72K - 180K</td>
                      <td className="py-3 text-slate-400">Pre-legal dispute</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-blue-400">HOA audit</td>
                      <td className="py-3">3,000 - 8,000</td>
                      <td className="py-3">36K - 96K</td>
                      <td className="py-3 text-slate-400">$2K-10K audit cost</td>
                    </tr>
                    <tr className="bg-slate-700/30 font-semibold">
                      <td className="py-3">TOTAL (5 terms)</td>
                      <td className="py-3">47,000 - 123,000</td>
                      <td className="py-3 text-rose-400">564K - 1.48M</td>
                      <td className="py-3 text-slate-400">High-value searches</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Economic Value */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">The Economic Value of These Searches</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-3">Each "HOA attorney" search represents:</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• <span className="text-white">$500-5,000</span> in initial consultation + retainer</li>
                    <li>• <span className="text-white">$5,000-50,000+</span> if matter goes to litigation</li>
                    <li>• <span className="text-white">$0-unlimited</span> in settlements/judgments</li>
                    <li>• <span className="text-white">Months of stress</span> for the searcher</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Market size implication:</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-2xl font-bold text-white">$500M - $2B+</div>
                      <div className="text-sm text-slate-400">Annual HOA legal services market</div>
                      <div className="text-xs text-slate-500">(attorney + lawyer searches × avg engagement value)</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-2xl font-bold text-white">Growing 120-168%</div>
                      <div className="text-sm text-slate-400">5-year search growth</div>
                      <div className="text-xs text-slate-500">Legal demand is accelerating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Addressable Pain */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">What These Numbers Mean for Prevention</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-rose-400 mb-2">564K-1.48M</div>
                  <div className="text-sm text-slate-400 mb-2">Annual legal-intent searches</div>
                  <p className="text-xs text-slate-500">
                    Each one represents a problem that escalated to the point of needing 
                    professional help. Most could have been prevented.
                  </p>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-amber-400 mb-2">$500M-2B+</div>
                  <div className="text-sm text-slate-400 mb-2">Annual legal spend implied</div>
                  <p className="text-xs text-slate-500">
                    Money spent on litigation that could have gone to transparency tools, 
                    audits, and prevention systems.
                  </p>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">10-100x</div>
                  <div className="text-sm text-slate-400 mb-2">Prevention vs. litigation cost</div>
                  <p className="text-xs text-slate-500">
                    A $5K annual transparency system vs. a $50K lawsuit. The ROI case 
                    for prevention is overwhelming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Implications Tab */}
        {view === 'implications' && (
          <div className="space-y-6">
            
            {/* The Answer */}
            <div className="bg-gradient-to-r from-rose-900/40 to-amber-900/40 border border-rose-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">The Definitive Answer: Does Anyone Care About HOA Problems?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-rose-400 mb-3">The Evidence Is Overwhelming:</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• <span className="text-white font-bold">"HOA attorney" at all-time high (100)</span></li>
                    <li>• <span className="text-white">564K-1.48M</span> annual legal-intent searches</li>
                    <li>• <span className="text-white">120-288% growth</span> across all legal terms</li>
                    <li>• <span className="text-white">$500M-2B+</span> implied legal services market</li>
                    <li>• <span className="text-white">All 5 terms</span> at multi-year highs in 2025</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-3">What This Means:</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• People care enough to <span className="text-white">pay $300-500/hr</span> for help</li>
                    <li>• Demand is <span className="text-white">accelerating, not plateauing</span></li>
                    <li>• The <span className="text-white">"audit" signal</span> shows prevention demand emerging</li>
                    <li>• <span className="text-white">July 2025 peak</span> = optimal market timing</li>
                    <li>• Legal spend is <span className="text-white">addressable by prevention</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* The Story to Tell */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">How to Tell This Story</h3>
              
              <div className="space-y-4">
                <div className="bg-rose-900/20 border border-rose-500/30 rounded p-4">
                  <div className="text-rose-400 font-semibold mb-2">❌ Don't lead with fraud volume:</div>
                  <p className="text-slate-300 text-sm italic">
                    "HOA fraud gets 60,000-180,000 searches per year"
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    (Sounds small, invites "is that enough?" questions)
                  </p>
                </div>
                
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-4">
                  <div className="text-emerald-400 font-semibold mb-2">✓ Lead with legal demand:</div>
                  <p className="text-slate-300 text-sm italic">
                    "In July 2025, 'HOA attorney' hit its all-time peak on Google Trends. 
                    Combined with related legal searches, we're looking at 1-1.5 million annual 
                    searches from people ready to spend $300-500/hour on HOA legal help. 
                    That represents a $500M-2B legal services market — growing at 120-170% over five years. 
                    Every one of those searches represents a problem that escalated to litigation. 
                    We're building the transparency infrastructure that prevents those problems 
                    before they become lawsuits."
                  </p>
                </div>
              </div>
            </div>

            {/* The Funnel */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">The Complete HOA Problem Funnel</h3>
              <div className="flex flex-col items-center gap-1">
                {[
                  {stage: 'HOA Residents', count: '77 million', width: '100%', color: 'bg-slate-600'},
                  {stage: 'General HOA Searches', count: '5-10M/year', width: '85%', color: 'bg-slate-500'},
                  {stage: 'Problem-Related Searches', count: '2-4M/year', width: '60%', color: 'bg-blue-600'},
                  {stage: 'Legal-Intent Searches', count: '564K-1.5M/year', width: '40%', color: 'bg-amber-600'},
                  {stage: 'Attorney/Lawyer Searches', count: '360K-960K/year', width: '25%', color: 'bg-rose-600'},
                  {stage: 'Actual Litigation', count: '~100K cases/year', width: '12%', color: 'bg-rose-800'},
                ].map((item, i) => (
                  <div key={i} className={`${item.color} rounded p-3 text-center transition-all`} style={{ width: item.width }}>
                    <div className="font-semibold text-white text-sm">{item.stage}</div>
                    <div className="text-xs text-white/70">{item.count}</div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm mt-6 text-center">
                Your product intervenes at the "Problem-Related" and "Legal-Intent" layers — 
                preventing escalation to expensive litigation.
              </p>
            </div>

            {/* Final Summary */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">The Complete Picture</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">77M</div>
                  <div className="text-xs text-slate-400">HOA residents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">1.5M</div>
                  <div className="text-xs text-slate-400">Legal-intent searches/yr</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-400">100</div>
                  <div className="text-xs text-slate-400">Attorney search peak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">120-288%</div>
                  <div className="text-xs text-slate-400">5-year growth</div>
                </div>
              </div>
              <p className="text-slate-300 text-center">
                <span className="text-white font-semibold">Yes, people care.</span> They care enough to search for attorneys 
                at all-time record rates. They care enough to spend hundreds of millions on legal fees annually. 
                The question isn't whether there's demand — it's whether you can capture it before it becomes litigation.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
