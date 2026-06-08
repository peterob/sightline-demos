import React, { useMemo, useState } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp, ShieldCheck, ArrowRight, CircleAlert, Boxes, Warehouse, Percent } from 'lucide-react';

const currency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const pct = (n) => `${(n * 100).toFixed(1)}%`;
const fmt = (n) => new Intl.NumberFormat('en-US').format(Math.round(n));

const scenarios = {
  base: {
    label: 'Base Case',
    description: 'Healthy mix, normal fill rates, moderate promotional pressure.',
    gmPct: 0.46, stockoutPct: 0.03, marketingEfficiency: 1, fillRate: 0.96, returnRate: 0.12,
  },
  tight_margin: {
    label: 'Promo Pressure',
    description: 'Higher markdowns and channel mix compression reduce contribution quality.',
    gmPct: 0.40, stockoutPct: 0.04, marketingEfficiency: 0.94, fillRate: 0.95, returnRate: 0.13,
  },
  stockout: {
    label: 'Stockout Drag',
    description: 'Inventory shortages suppress conversion and force substitutions.',
    gmPct: 0.44, stockoutPct: 0.09, marketingEfficiency: 0.9, fillRate: 0.88, returnRate: 0.12,
  },
};

function Slider({ value, onChange, min, max, step }) {
  const pctPos = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-5 flex items-center">
      <div className="w-full h-1.5 rounded-full bg-white/10 relative">
        <div className="absolute left-0 top-0 h-full rounded-full bg-orange-500" style={{ width: `${pctPos}%` }} />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-orange-400 border-2 border-white shadow-lg pointer-events-none"
        style={{ left: `calc(${pctPos}% - 8px)` }}
      />
    </div>
  );
}

export default function Food52SightlineDashboard() {
  const [scenario, setScenario] = useState('base');
  const [orders, setOrders] = useState(215000);
  const [aov, setAov] = useState(94);
  const [cac, setCac] = useState(28);
  const [fixedOpex, setFixedOpex] = useState(18000000);
  const [multiple, setMultiple] = useState(8.5);
  const [inventoryInvestment, setInventoryInvestment] = useState(5200000);
  const [stockoutRecovery, setStockoutRecovery] = useState(0.45);
  const [notes, setNotes] = useState('Restore in-stock depth in top kitchen electrics and reduce markdown dependency in owned categories.');

  const current = scenarios[scenario];

  const model = useMemo(() => {
    const grossDemand = orders * aov * current.marketingEfficiency;
    const realizedDemand = grossDemand * (1 - current.stockoutPct * (1 - stockoutRecovery));
    const netRevenue = realizedDemand * (1 - current.returnRate);
    const grossProfit = netRevenue * current.gmPct;
    const acquisitionSpend = orders * cac;
    const variableFulfillment = netRevenue * 0.13;
    const contribution = grossProfit - acquisitionSpend - variableFulfillment;
    const ebitda = contribution - fixedOpex;
    const enterpriseValue = ebitda * multiple;
    const roiic = inventoryInvestment > 0 ? (ebitda * 0.65) / inventoryInvestment : 0;
    const contributionMargin = netRevenue > 0 ? contribution / netRevenue : 0;
    const stockoutRevenueLost = grossDemand - realizedDemand;
    const recoveredRevenue = grossDemand * current.stockoutPct * stockoutRecovery;

    const nextProof = current.fillRate < 0.92
      ? 'Increase fill rate above 92% in top 50 SKUs before expanding paid demand.'
      : contributionMargin < 0.12
      ? 'Show contribution margin above 12% after marketing and fulfillment before scaling spend.'
      : roiic < 0.15
      ? 'Prove inventory investment clears 15% ROIIC with higher turns and lower stockout loss.'
      : 'System clears threshold. Expansion can be approved with weekly variance review.';

    const gates = [
      { title: 'Contribution quality', status: contributionMargin >= 0.12 ? 'Cleared' : 'Blocked', detail: `${pct(contributionMargin)} vs 12.0% minimum` },
      { title: 'Fill rate protection', status: current.fillRate >= 0.92 ? 'Cleared' : 'Blocked', detail: `${pct(current.fillRate)} fill rate` },
      { title: 'Inventory ROIIC', status: roiic >= 0.15 ? 'Cleared' : 'Blocked', detail: `${pct(roiic)} vs 15.0% hurdle` },
      { title: 'Demand efficiency', status: cac <= 30 ? 'Cleared' : 'Review', detail: `${currency(cac)} CAC per order` },
    ];

    return { grossDemand, realizedDemand, netRevenue, grossProfit, acquisitionSpend, variableFulfillment, contribution, contributionMargin, ebitda, enterpriseValue, roiic, stockoutRevenueLost, recoveredRevenue, nextProof, gates };
  }, [orders, aov, cac, fixedOpex, multiple, inventoryInvestment, stockoutRecovery, current]);

  const flow = [
    { label: 'Orders', value: fmt(orders), sub: 'Demand volume', icon: ShoppingCart },
    { label: 'Net Revenue', value: currency(model.netRevenue), sub: 'After returns and stockout loss', icon: DollarSign },
    { label: 'Contribution', value: currency(model.contribution), sub: `${pct(model.contributionMargin)} margin`, icon: Package },
    { label: 'EBITDA', value: currency(model.ebitda), sub: 'After fixed opex', icon: TrendingUp },
    { label: 'Enterprise Value', value: currency(model.enterpriseValue), sub: `${multiple.toFixed(1)}x EBITDA`, icon: ShieldCheck },
  ];

  const kpiValues = [
    { label: 'Demand', icon: ShoppingCart, value: `${fmt(orders)} orders`, desc: 'Traffic and conversion realized this period' },
    { label: 'Margin', icon: Percent, value: pct(current.gmPct), desc: 'Gross profit quality before fulfillment and CAC' },
    { label: 'Inventory', icon: Warehouse, value: pct(current.fillRate), desc: 'In-stock protection in core assortment' },
    { label: 'Value', icon: TrendingUp, value: currency(model.enterpriseValue), desc: 'Valuation output at current multiple' },
  ];

  const isBlocked = model.gates.some(g => g.status === 'Blocked');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Hero Card */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a, #1a0800)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: 'inline-block', marginBottom: 12, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(251,146,60,0.3)', background: 'rgba(249,115,22,0.1)', color: '#fed7aa', fontSize: 12 }}>
                  Sightline | Food52 Value Control Room
                </span>
                <h1 style={{ margin: 0, fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Unit Drivers → EBITDA → Enterprise Value</h1>
                <p style={{ marginTop: 12, color: '#d4d4d4', fontSize: 14, maxWidth: 560, lineHeight: 1.6 }}>
                  Board-ready operating dashboard. Traces demand, margin, inventory friction, and investment quality through to EBITDA and valuation impact.
                </p>
              </div>
              <div style={{ minWidth: 220, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '1rem' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#737373' }}>Decision Status</div>
                <div style={{ marginTop: 8, fontSize: 22, fontWeight: 600, color: isBlocked ? '#fcd34d' : '#6ee7b7' }}>
                  {isBlocked ? 'Conditional Release' : 'Cleared to Scale'}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: '#d4d4d4' }}>{current.label}: {current.description}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
              {kpiValues.map((k) => {
                const Icon = k.icon;
                return (
                  <div key={k.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d4d4d4' }}>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 6, display: 'flex' }}><Icon size={14} /></div>
                      <span style={{ fontSize: 13 }}>{k.label}</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 20, fontWeight: 600 }}>{k.value}</div>
                    <div style={{ marginTop: 4, fontSize: 11, color: '#737373', lineHeight: 1.4 }}>{k.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario Control */}
          <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Scenario Control</div>
            <div style={{ fontSize: 13, color: '#737373', marginBottom: 16 }}>Select a mode and inspect gating conditions.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(scenarios).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  style={{
                    width: '100%', borderRadius: 16, border: scenario === key ? '1px solid rgba(251,146,60,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    background: scenario === key ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)',
                    color: 'white', padding: '0.85rem 1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{s.label}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#737373' }}>{s.description}</div>
                </button>
              ))}
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: '1rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CircleAlert size={16} color="#fcd34d" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500, color: '#fef3c7', fontSize: 13 }}>Next required proof</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#fef3c7', opacity: 0.85, lineHeight: 1.5 }}>{model.nextProof}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Value Flow */}
            <div style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Value Flow</div>
              <div style={{ fontSize: 13, color: '#737373', marginBottom: 16, marginTop: 4 }}>Each stage traced to EBITDA and enterprise value.</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                {flow.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.label}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d4d4d4' }}>
                          <Icon size={14} />
                          <span style={{ fontSize: 12 }}>{step.label}</span>
                        </div>
                        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>{step.value}</div>
                        <div style={{ marginTop: 4, fontSize: 11, color: '#737373', lineHeight: 1.4 }}>{step.sub}</div>
                      </div>
                      {idx < flow.length - 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#404040' }}>
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Gates + Variance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Control Gates</div>
                <div style={{ fontSize: 13, color: '#737373', marginBottom: 16, marginTop: 4 }}>Capital release depends on proof, not momentum.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {model.gates.map((gate) => (
                    <div key={gate.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '0.85rem 1rem' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{gate.title}</div>
                        <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{gate.detail}</div>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                        background: gate.status === 'Cleared' ? 'rgba(52,211,153,0.12)' : gate.status === 'Blocked' ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.08)',
                        color: gate.status === 'Cleared' ? '#6ee7b7' : gate.status === 'Blocked' ? '#fcd34d' : 'white',
                        border: `1px solid ${gate.status === 'Cleared' ? 'rgba(52,211,153,0.2)' : gate.status === 'Blocked' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.1)'}`,
                      }}>{gate.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Variance Review</div>
                <div style={{ fontSize: 13, color: '#737373', marginBottom: 16, marginTop: 4 }}>Loss points that matter for valuation.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Revenue lost to stockouts', value: currency(model.stockoutRevenueLost), note: 'Gross demand not realized because product was unavailable.' },
                    { label: 'Recovered from inventory action', value: currency(model.recoveredRevenue), note: 'Demand recaptured through improved in-stock depth.' },
                    { label: 'Inventory ROIIC', value: pct(model.roiic), note: 'After-tax EBITDA yield on incremental inventory investment.' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem' }}>
                      <div style={{ fontSize: 12, color: '#737373' }}>{item.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{item.value}</div>
                      <div style={{ fontSize: 11, color: '#525252', marginTop: 4, lineHeight: 1.4 }}>{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Driver Console */}
            <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Driver Console</div>
              <div style={{ fontSize: 13, color: '#737373', marginBottom: 20, marginTop: 4 }}>Adjust the model and inspect downstream value impact.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { label: 'Orders', display: fmt(orders), value: orders, onChange: setOrders, min: 100000, max: 350000, step: 5000 },
                  { label: 'Average order value', display: currency(aov), value: aov, onChange: setAov, min: 60, max: 140, step: 1 },
                  { label: 'CAC per order', display: currency(cac), value: cac, onChange: setCac, min: 10, max: 50, step: 1 },
                  { label: 'Fixed opex', display: currency(fixedOpex), value: fixedOpex, onChange: setFixedOpex, min: 8000000, max: 26000000, step: 250000 },
                  { label: 'Inventory investment', display: currency(inventoryInvestment), value: inventoryInvestment, onChange: setInventoryInvestment, min: 1000000, max: 12000000, step: 100000 },
                  { label: 'Stockout recovery rate', display: pct(stockoutRecovery), value: stockoutRecovery, onChange: setStockoutRecovery, min: 0, max: 1, step: 0.01 },
                  { label: 'Valuation multiple', display: `${multiple.toFixed(1)}x`, value: multiple, onChange: setMultiple, min: 4, max: 14, step: 0.1 },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span>{s.label}</span>
                      <span style={{ color: '#737373' }}>{s.display}</span>
                    </div>
                    <Slider value={s.value} onChange={s.onChange} min={s.min} max={s.max} step={s.step} />
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Notes */}
            <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.5rem' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Operator Notes</div>
              <div style={{ fontSize: 13, color: '#737373', marginBottom: 16, marginTop: 4 }}>Board commentary tied to the live scenario.</div>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', color: 'white', fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
              />
              <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#d4d4d4', lineHeight: 1.5 }}>{notes}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                <button style={{ background: '#f97316', color: '#000', border: 'none', borderRadius: 12, padding: '10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Approve Release</button>
                <button style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>Hold for Proof</button>
              </div>
            </div>

            {/* Thesis */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #141414)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(249,115,22,0.12)', borderRadius: 14, padding: 10, color: '#fed7aa', flexShrink: 0 }}><Boxes size={18} /></div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Food52 system thesis</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#737373', lineHeight: 1.6 }}>
                    Commerce value creation depends on protecting contribution quality. Demand that outruns in-stock depth or margin quality should be blocked, even when top-line momentum looks attractive.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { tag: 'Blocked condition', title: 'Scale demand before fixing availability', body: 'This raises CAC waste, substitution drag, and markdown risk.' },
            { tag: 'Required proof', title: 'Show protected margin after fulfillment and CAC', body: 'The board should release spend only when contribution quality is visible.' },
            { tag: 'Value signal', title: 'Inventory turns and fill rate drive multiple quality', body: 'A stronger system improves both EBITDA and confidence in the earnings stream.' },
          ].map((c) => (
            <div key={c.tag} style={{ background: 'rgba(17,17,17,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '1.25rem' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#525252' }}>{c.tag}</div>
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: '#737373', lineHeight: 1.5 }}>{c.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
