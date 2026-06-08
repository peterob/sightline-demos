import React, { useState } from 'react';

const FounderFinancePlaybook = () => {
  const [selectedRaise, setSelectedRaise] = useState('seriesA');

  const raises = {
    seed: {
      label: 'Seed',
      amount: '$1-3M',
      timeline: '12-18 months',
      color: '#8b5cf6'
    },
    seriesA: {
      label: 'Series A',
      amount: '$5-15M',
      timeline: '18-24 months',
      color: '#3b82f6'
    },
    seriesB: {
      label: 'Series B',
      amount: '$15-50M',
      timeline: '24-36 months',
      color: '#22c55e'
    }
  };

  const playbooks = {
    seed: {
      teamStructure: {
        title: '0.25-0.5 FTE',
        description: 'Founder + fractional bookkeeper',
        breakdown: [
          { role: 'Founder', time: '2-4 hrs/week', focus: 'Cash monitoring, approvals' },
          { role: 'Bookkeeper (outsourced)', time: '5-10 hrs/month', focus: 'Categorization, reconciliation' }
        ],
        cost: '$500-1,500/mo'
      },
      techStack: [
        { tool: 'Mercury or Brex', purpose: 'Banking + cards', cost: '$0', priority: 'Required' },
        { tool: 'QuickBooks Online', purpose: 'Ledger', cost: '$30-90/mo', priority: 'Required' },
        { tool: 'Gusto or Rippling', purpose: 'Payroll', cost: '$40+/mo', priority: 'Required' },
        { tool: 'Expensify or Ramp', purpose: 'Expenses', cost: '$0-100/mo', priority: 'Recommended' },
        { tool: 'Google Sheets', purpose: 'Runway model', cost: '$0', priority: 'Required' }
      ],
      weeklyRoutine: [
        { day: 'Monday', task: 'Check cash balance', time: '5 min', owner: 'Founder' },
        { day: 'Wednesday', task: 'Approve pending bills', time: '15 min', owner: 'Founder' },
        { day: 'Friday', task: 'Review weekly spend', time: '10 min', owner: 'Founder' }
      ],
      monthlyRoutine: [
        { task: 'Bank reconciliation', time: '1-2 hrs', owner: 'Bookkeeper' },
        { task: 'Categorize transactions', time: '2-3 hrs', owner: 'Bookkeeper' },
        { task: 'Update runway model', time: '30 min', owner: 'Founder' },
        { task: 'Review P&L', time: '15 min', owner: 'Founder' }
      ],
      investorReady: [
        'Cash position (same day)',
        'Burn rate (±15% accuracy)',
        'Runway (3 scenarios)',
        'Cap table (clean)',
        'Basic P&L by month'
      ],
      notYetNeeded: [
        'Audit or review',
        'Controller hire',
        'Revenue recognition policy',
        'AP automation',
        'Close calendar'
      ]
    },
    seriesA: {
      teamStructure: {
        title: '1-1.5 FTE',
        description: 'Fractional controller or senior bookkeeper + founder oversight',
        breakdown: [
          { role: 'Founder/CEO', time: '2-3 hrs/week', focus: 'Approvals, board reporting' },
          { role: 'Fractional Controller', time: '15-25 hrs/month', focus: 'Close, reporting, controls' },
          { role: 'Bookkeeper', time: '10-15 hrs/month', focus: 'Daily transactions' }
        ],
        cost: '$3,000-8,000/mo'
      },
      techStack: [
        { tool: 'Mercury or SVB', purpose: 'Banking + treasury', cost: '$0', priority: 'Required' },
        { tool: 'QuickBooks Online Advanced', purpose: 'Ledger + reporting', cost: '$200/mo', priority: 'Required' },
        { tool: 'Rippling', purpose: 'Payroll + HR', cost: '$8/employee', priority: 'Required' },
        { tool: 'Bill.com or Ramp', purpose: 'AP + approvals', cost: '$0-200/mo', priority: 'Required' },
        { tool: 'Carta', purpose: 'Cap table + 409A', cost: '$100+/mo', priority: 'Required' },
        { tool: 'Google Sheets or Runway', purpose: 'FP&A model', cost: '$0-500/mo', priority: 'Required' },
        { tool: 'Sightline', purpose: 'Transaction validation', cost: '$500-1K/mo', priority: 'Recommended' }
      ],
      weeklyRoutine: [
        { day: 'Monday', task: 'Cash + AR/AP aging review', time: '15 min', owner: 'Controller' },
        { day: 'Tuesday', task: 'Approve bills >$5K', time: '15 min', owner: 'Founder' },
        { day: 'Thursday', task: 'New vendor setup review', time: '10 min', owner: 'Controller' },
        { day: 'Friday', task: 'Week-over-week burn check', time: '10 min', owner: 'Controller' }
      ],
      monthlyRoutine: [
        { task: 'Close checklist (day 1-10)', time: '8-12 hrs', owner: 'Controller' },
        { task: 'Reconciliations (all accounts)', time: '3-4 hrs', owner: 'Bookkeeper' },
        { task: 'Accruals + prepaids', time: '2-3 hrs', owner: 'Controller' },
        { task: 'Board deck financials', time: '2-3 hrs', owner: 'Controller' },
        { task: 'Forecast update', time: '2-3 hrs', owner: 'Controller' },
        { task: 'CEO review + approval', time: '1 hr', owner: 'Founder' }
      ],
      investorReady: [
        'Monthly financials within 12 days',
        'Burn rate (±5% accuracy)',
        'Runway with hiring plan scenarios',
        'Revenue by customer/cohort',
        'Department-level spend',
        'Clean audit trail',
        'Basic revenue recognition policy'
      ],
      notYetNeeded: [
        'Full-time controller',
        'Audited financials',
        'ERP upgrade',
        'SOX-style controls',
        'Dedicated FP&A'
      ]
    },
    seriesB: {
      teamStructure: {
        title: '3-4 FTE',
        description: 'Controller + accountant + FP&A analyst',
        breakdown: [
          { role: 'CFO or VP Finance', time: 'Full-time', focus: 'Strategy, fundraise, board' },
          { role: 'Controller', time: 'Full-time', focus: 'Close, audit, controls' },
          { role: 'Staff Accountant', time: 'Full-time', focus: 'AP/AR, reconciliations' },
          { role: 'FP&A Analyst', time: 'Full or part-time', focus: 'Forecasting, variance' }
        ],
        cost: '$25,000-50,000/mo'
      },
      techStack: [
        { tool: 'SVB or JPM', purpose: 'Banking + treasury', cost: '$0', priority: 'Required' },
        { tool: 'NetSuite or QBO Advanced', purpose: 'ERP', cost: '$500-2K/mo', priority: 'Required' },
        { tool: 'Rippling', purpose: 'Payroll + HR + IT', cost: '$15/employee', priority: 'Required' },
        { tool: 'Bill.com + Zip', purpose: 'AP + procurement', cost: '$500-1K/mo', priority: 'Required' },
        { tool: 'Carta', purpose: 'Cap table + equity', cost: '$200+/mo', priority: 'Required' },
        { tool: 'Mosaic or Pigment', purpose: 'FP&A platform', cost: '$1-3K/mo', priority: 'Required' },
        { tool: 'Sightline', purpose: 'Financial integrity layer', cost: '$1-3K/mo', priority: 'Required' },
        { tool: 'FloQast or BlackLine', purpose: 'Close management', cost: '$500-1K/mo', priority: 'Recommended' }
      ],
      weeklyRoutine: [
        { day: 'Monday', task: 'Cash forecast review', time: '30 min', owner: 'Controller' },
        { day: 'Tuesday', task: 'AR collections review', time: '30 min', owner: 'Accountant' },
        { day: 'Wednesday', task: 'Spend vs budget check', time: '30 min', owner: 'FP&A' },
        { day: 'Thursday', task: 'Exception queue review', time: '20 min', owner: 'Controller' },
        { day: 'Friday', task: 'Leadership finance sync', time: '30 min', owner: 'CFO' }
      ],
      monthlyRoutine: [
        { task: 'Close (day 1-5)', time: '20-30 hrs', owner: 'Accounting team' },
        { task: 'Variance analysis', time: '4-6 hrs', owner: 'FP&A' },
        { task: 'Forecast update', time: '4-6 hrs', owner: 'FP&A' },
        { task: 'Board deck', time: '4-6 hrs', owner: 'CFO + FP&A' },
        { task: 'Controls testing', time: '2-3 hrs', owner: 'Controller' },
        { task: 'Audit prep (ongoing)', time: '2-4 hrs', owner: 'Controller' }
      ],
      investorReady: [
        'Audited financials (2 years)',
        'Close in 5-7 days',
        'Real-time cash + forecast',
        'Variance analysis vs budget',
        'Unit economics by segment',
        'Revenue by product/geo',
        'Full audit trail with evidence',
        'Documented controls',
        'ASC 606 compliance'
      ],
      notYetNeeded: [
        'IPO-readiness (unless 12mo out)',
        'SOX 404 compliance',
        'Big 4 auditor',
        'Full treasury function'
      ]
    }
  };

  const current = raises[selectedRaise];
  const playbook = playbooks[selectedRaise];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '32px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              background: '#22c55e',
              borderRadius: '2px'
            }}/>
            <span style={{ fontSize: '14px', color: '#888' }}>sightline</span>
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '500',
            color: '#fff',
            margin: '0 0 8px 0'
          }}>
            Founder Finance Playbook
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: 0
          }}>
            Small teams. Top-of-line equipment. Mission won.
          </p>
        </div>

        {/* Stage Selector */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {Object.entries(raises).map(([key, raise]) => (
            <button
              key={key}
              onClick={() => setSelectedRaise(key)}
              style={{
                flex: 1,
                padding: '16px',
                background: selectedRaise === key ? `${raise.color}15` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selectedRaise === key ? raise.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '14px', color: selectedRaise === key ? raise.color : '#888', marginBottom: '4px' }}>
                {raise.label}
              </div>
              <div style={{ fontSize: '18px', color: '#fff', marginBottom: '4px' }}>
                {raise.amount}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {raise.timeline} runway
              </div>
            </button>
          ))}
        </div>

        {/* Team Structure */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '8px' }}>
                TEAM STRUCTURE
              </div>
              <div style={{ fontSize: '24px', color: current.color, marginBottom: '4px' }}>
                {playbook.teamStructure.title}
              </div>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {playbook.teamStructure.description}
              </div>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>MONTHLY COST</div>
              <div style={{ fontSize: '16px', color: '#22c55e' }}>{playbook.teamStructure.cost}</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${playbook.teamStructure.breakdown.length}, 1fr)`,
            gap: '12px'
          }}>
            {playbook.teamStructure.breakdown.map((person, i) => (
              <div key={i} style={{
                padding: '12px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>{person.role}</div>
                <div style={{ fontSize: '11px', color: current.color, marginBottom: '4px' }}>{person.time}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>{person.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
            TECH STACK
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {playbook.techStack.map((tool, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 100px 100px',
                gap: '16px',
                padding: '10px 12px',
                background: tool.priority === 'Required' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#fff' }}>{tool.tool}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{tool.purpose}</div>
                <div style={{ fontSize: '11px', color: '#22c55e' }}>{tool.cost}</div>
                <div style={{
                  fontSize: '9px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: tool.priority === 'Required' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: tool.priority === 'Required' ? '#22c55e' : '#888',
                  textAlign: 'center'
                }}>
                  {tool.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routines */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Weekly */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
              WEEKLY ROUTINE
            </div>
            {playbook.weeklyRoutine.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < playbook.weeklyRoutine.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: current.color, marginRight: '8px' }}>{item.day}</span>
                  <span style={{ fontSize: '11px', color: '#ddd' }}>{item.task}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>{item.time}</div>
              </div>
            ))}
          </div>

          {/* Monthly */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
              MONTHLY ROUTINE
            </div>
            {playbook.monthlyRoutine.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < playbook.monthlyRoutine.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}>
                <div style={{ fontSize: '11px', color: '#ddd' }}>{item.task}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Ready vs Not Yet */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '10px', color: '#22c55e', letterSpacing: '1px', marginBottom: '16px' }}>
              INVESTOR-READY AT THIS STAGE
            </div>
            {playbook.investorReady.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#ddd'
              }}>
                <span style={{ color: '#22c55e' }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '20px'
          }}>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
              NOT YET NEEDED
            </div>
            {playbook.notYetNeeded.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '11px',
                color: '#888'
              }}>
                <span style={{ color: '#666' }}>○</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Sightline Integration */}
        <div style={{
          background: `${current.color}10`,
          borderRadius: '8px',
          border: `1px solid ${current.color}30`,
          padding: '24px'
        }}>
          <div style={{ fontSize: '10px', color: current.color, letterSpacing: '1px', marginBottom: '12px' }}>
            WHERE SIGHTLINE FITS AT {current.label.toUpperCase()}
          </div>
          <div style={{ fontSize: '13px', color: '#ddd', lineHeight: '1.7', marginBottom: '16px' }}>
            {selectedRaise === 'seed' && 
              'Optional but valuable. If you have complex transactions (inventory, marketplace, multi-currency), Sightline prevents the mess that will cost you 3x to clean up before Series A.'
            }
            {selectedRaise === 'seriesA' && 
              'Recommended. You need audit-ready books but can\'t afford a 3-person finance team. Sightline automates transaction validation so your fractional controller can focus on strategy, not reconciliation.'
            }
            {selectedRaise === 'seriesB' && 
              'Essential. Investors expect institutional-grade controls. Sightline provides evidence-gated transactions that satisfy auditors and due diligence without building a compliance department.'
            }
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Close time</div>
              <div style={{ fontSize: '14px', color: '#22c55e' }}>
                {selectedRaise === 'seed' && '15 → 10 days'}
                {selectedRaise === 'seriesA' && '12 → 5 days'}
                {selectedRaise === 'seriesB' && '7 → 3 days'}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Finance FTE equivalent</div>
              <div style={{ fontSize: '14px', color: '#22c55e' }}>
                {selectedRaise === 'seed' && '0.5 → 0.25'}
                {selectedRaise === 'seriesA' && '1.5 → 0.75'}
                {selectedRaise === 'seriesB' && '4 → 2.5'}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Audit prep</div>
              <div style={{ fontSize: '14px', color: '#22c55e' }}>
                {selectedRaise === 'seed' && 'N/A'}
                {selectedRaise === 'seriesA' && '40 → 8 hrs'}
                {selectedRaise === 'seriesB' && '80 → 16 hrs'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          Navy SEALs, not the Navy. Minimal team. Maximum capability. Mission won.
        </div>
      </div>
    </div>
  );
};

export default FounderFinancePlaybook;
