import React, { useState, useEffect } from 'react';

const SightlinePELanding = () => {
  const [activePortfolio, setActivePortfolio] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const portfolioCompanies = [
    { name: 'Acme Mfg', status: 'green', close: 5, exceptions: 3, evidence: 98 },
    { name: 'Bolt Logistics', status: 'green', close: 4, exceptions: 7, evidence: 96 },
    { name: 'Circuit Supply', status: 'yellow', close: 8, exceptions: 23, evidence: 87 },
    { name: 'Delta Services', status: 'green', close: 6, exceptions: 5, evidence: 94 },
    { name: 'Echo Retail', status: 'red', close: 14, exceptions: 47, evidence: 71 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePortfolio(p => (p + 1) % portfolioCompanies.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRunning && demoStep < 5) {
      const timer = setTimeout(() => setDemoStep(d => d + 1), 600);
      return () => clearTimeout(timer);
    }
    if (demoStep >= 5) setIsRunning(false);
  }, [isRunning, demoStep]);

  const getStatusColor = (status) => {
    return status === 'green' ? '#22c55e' : status === 'yellow' ? '#f59e0b' : '#ef4444';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ 
            width: '8px',
            height: '8px',
            background: '#22c55e',
            borderRadius: '2px'
          }}/>
          sightline
          <span style={{ 
            fontSize: '11px', 
            color: '#666', 
            fontWeight: '400',
            marginLeft: '8px',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '4px'
          }}>
            for PE
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#problem" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>The Problem</a>
          <a href="#solution" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>How It Works</a>
          <a href="#results" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>Results</a>
          <button style={{
            padding: '10px 20px',
            background: '#fff',
            border: 'none',
            borderRadius: '6px',
            color: '#0a0a0f',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Request Portfolio Assessment
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 48px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#8b5cf6',
              letterSpacing: '2px',
              marginBottom: '16px',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              PORTFOLIO FINANCIAL OPERATIONS
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '500',
              lineHeight: '1.15',
              color: '#fff',
              margin: '0 0 20px 0',
              letterSpacing: '-0.5px'
            }}>
              You paid 8x EBITDA.<br/>
              Can you trust the numbers?
            </h1>
            <p style={{
              fontSize: '17px',
              color: '#888',
              lineHeight: '1.6',
              margin: '0 0 12px 0',
              maxWidth: '500px'
            }}>
              Sightline gives PE operating teams real-time visibility into portfolio 
              company financials. Validated transactions. Evidence attached. 
              No more month-end surprises.
            </p>
            <p style={{
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              maxWidth: '500px'
            }}>
              Deploy across your portfolio in weeks. See which companies have 
              clean books and which need intervention—before the quarterly review.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button style={{
                padding: '14px 28px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#0a0a0f',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                See Portfolio Demo
              </button>
              <span style={{ fontSize: '13px', color: '#666' }}>
                30 min · No slides · Live system
              </span>
            </div>
          </div>

          {/* Portfolio Dashboard Preview */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>
                PORTFOLIO HEALTH
              </div>
              <div style={{ fontSize: '10px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}/>
                LIVE
              </div>
            </div>

            {/* Company List */}
            <div style={{ marginBottom: '16px' }}>
              {portfolioCompanies.map((co, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '8px 140px 60px 60px 60px',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '10px 8px',
                    background: activePortfolio === i ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                    borderRadius: '4px',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(co.status)
                  }}/>
                  <div style={{ fontSize: '12px', color: activePortfolio === i ? '#fff' : '#888' }}>
                    {co.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', textAlign: 'right' }}>
                    {co.close}d close
                  </div>
                  <div style={{ fontSize: '11px', color: co.exceptions > 20 ? '#f59e0b' : '#666', textAlign: 'right' }}>
                    {co.exceptions} exc
                  </div>
                  <div style={{ fontSize: '11px', color: co.evidence > 90 ? '#22c55e' : '#f59e0b', textAlign: 'right' }}>
                    {co.evidence}% ev
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', color: '#22c55e' }}>3</div>
                <div style={{ fontSize: '9px', color: '#666' }}>ON TRACK</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', color: '#f59e0b' }}>1</div>
                <div style={{ fontSize: '9px', color: '#666' }}>WATCH</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', color: '#ef4444' }}>1</div>
                <div style={{ fontSize: '9px', color: '#666' }}>INTERVENE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" style={{
        padding: '80px 48px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '500',
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              The post-acquisition reality
            </h2>
            <p style={{ fontSize: '15px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              You closed the deal. Now you need to protect the investment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '48px'
          }}>
            {[
              {
                day: 'Day 30',
                title: 'The books are a mess',
                detail: 'The "audited financials" from diligence don\'t match what the team produces monthly. Reconciliation differences everywhere.',
                stat: '73%',
                statLabel: 'of PE acquisitions find material accounting issues within 90 days'
              },
              {
                day: 'Day 60',
                title: 'Nobody trusts the numbers',
                detail: 'You ask for cash position and get three different answers. The controller is "working on it." Board meeting in two weeks.',
                stat: '45',
                statLabel: 'average days to close the books at newly acquired companies'
              },
              {
                day: 'Day 90',
                title: 'You\'re flying blind',
                detail: 'You need to make capital allocation decisions across the portfolio. Half the companies can\'t tell you their real burn rate.',
                stat: '2.3x',
                statLabel: 'more likely to miss plan with poor financial visibility'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '10px',
                padding: '24px'
              }}>
                <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>
                  {item.day}
                </div>
                <div style={{ fontSize: '16px', color: '#fff', marginBottom: '10px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', marginBottom: '20px' }}>
                  {item.detail}
                </div>
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '16px'
                }}>
                  <div style={{ fontSize: '28px', color: '#ef4444', fontWeight: '600' }}>{item.stat}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{item.statLabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* The real cost */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
              THE REAL COST OF BAD FINANCIAL DATA
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px'
            }}>
              {[
                { value: '$2-5M', label: 'Average working capital surprise post-close' },
                { value: '6-12 mo', label: 'Delayed value creation initiatives' },
                { value: '40%', label: 'Controller turnover in year one' },
                { value: '15-25%', label: 'Of deal value at risk from ops issues' }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '28px', color: '#fff', fontWeight: '500', marginBottom: '8px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" style={{
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '500',
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              Financial integrity at portfolio scale
            </h2>
            <p style={{ fontSize: '15px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Deploy Sightline across your portfolio. Get visibility in weeks, not quarters.
            </p>
          </div>

          {/* How it works */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {[
              {
                num: '01',
                title: 'Connect',
                desc: 'Sightline connects to existing ERP (NetSuite, QBO, Sage). No rip-and-replace. Live in 2-3 weeks per company.',
                time: '2-3 weeks'
              },
              {
                num: '02',
                title: 'Validate',
                desc: 'Every transaction checked against business rules. Missing PO? Blocked. No approval? Flagged. Evidence required.',
                time: 'Immediate'
              },
              {
                num: '03',
                title: 'Surface',
                desc: 'Exceptions surface in real-time, not month-end. Controllers fix issues when context is fresh.',
                time: 'Hours, not weeks'
              },
              {
                num: '04',
                title: 'Report',
                desc: 'Portfolio-level dashboard shows health across all companies. Drill down to any transaction instantly.',
                time: 'Always current'
              }
            ].map((step, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '24px'
              }}>
                <div style={{
                  fontSize: '24px',
                  color: 'rgba(139, 92, 246, 0.4)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: '12px'
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5', marginBottom: '12px' }}>
                  {step.desc}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e' }}>
                  {step.time}
                </div>
              </div>
            ))}
          </div>

          {/* What you get */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div style={{
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '10px',
              padding: '28px'
            }}>
              <div style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '1px', marginBottom: '20px' }}>
                AT THE PORTFOLIO LEVEL
              </div>
              {[
                'Single dashboard for all company financials',
                'Standardized close timeline across portfolio',
                'Early warning on exception trends',
                'Due diligence data room always current',
                'Benchmarking across similar companies'
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#ddd'
                }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              padding: '28px'
            }}>
              <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '20px' }}>
                AT THE COMPANY LEVEL
              </div>
              {[
                'Transaction validation before posting',
                'Evidence attached at creation',
                'Exception queue with clear owners',
                'Audit trail for every dollar',
                'Close time cut by 50%+'
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#ddd'
                }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" style={{
        padding: '80px 48px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '500',
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              Measurable outcomes
            </h2>
            <p style={{ fontSize: '15px', color: '#666' }}>
              From first 100 days post-deployment
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {[
              { before: '18 days', after: '6 days', label: 'Average close time', improvement: '67%' },
              { before: '40+ hrs', after: '4 hrs', label: 'Audit prep per quarter', improvement: '90%' },
              { before: '23%', after: '94%', label: 'Transactions with evidence', improvement: '4x' },
              { before: '3 weeks', after: '< 1 hour', label: 'Time to answer "what\'s our cash?"', improvement: '99%' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#ef4444', textDecoration: 'line-through' }}>{item.before}</span>
                  <span style={{ color: '#666' }}>→</span>
                  <span style={{ fontSize: '20px', color: '#22c55e', fontWeight: '600' }}>{item.after}</span>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#22c55e',
                  padding: '4px 8px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {item.improvement} improvement
                </div>
              </div>
            ))}
          </div>

          {/* Case study teaser */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '12px' }}>
                CASE STUDY
              </div>
              <div style={{ fontSize: '20px', color: '#fff', marginBottom: '12px' }}>
                Mid-market PE firm deploys Sightline across 12-company portfolio
              </div>
              <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '20px' }}>
                "We used to spend the first week of every board meeting reconciling 
                different versions of the numbers. Now we spend it on strategy. 
                Sightline paid for itself in the first quarter."
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                — Operating Partner, Growth Equity Fund
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', color: '#22c55e', fontWeight: '600' }}>12</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Companies deployed</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', color: '#22c55e', fontWeight: '600' }}>8 weeks</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Full deployment</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '24px', color: '#22c55e', fontWeight: '600' }}>$1.2M</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Annual savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Model */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '500',
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              Deployment model
            </h2>
            <p style={{ fontSize: '15px', color: '#666' }}>
              Start with highest-risk companies. Expand as you see results.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {[
              {
                phase: 'Pilot',
                timeline: 'Weeks 1-4',
                scope: '1-2 companies',
                activities: [
                  'Connect to existing ERP',
                  'Configure validation rules',
                  'Train finance team',
                  'Baseline current metrics'
                ],
                outcome: 'Prove value, refine playbook'
              },
              {
                phase: 'Expand',
                timeline: 'Weeks 5-12',
                scope: '5-10 companies',
                activities: [
                  'Parallel deployments',
                  'Portfolio dashboard live',
                  'Standardize chart of accounts',
                  'Exception workflow tuning'
                ],
                outcome: 'Portfolio-wide visibility'
              },
              {
                phase: 'Scale',
                timeline: 'Ongoing',
                scope: 'Full portfolio',
                activities: [
                  'New acquisition playbook',
                  'Day 1 deployment standard',
                  'Benchmarking active',
                  'Continuous improvement'
                ],
                outcome: 'Operational advantage'
              }
            ].map((phase, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '24px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: '#8b5cf6',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {phase.phase}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#22c55e', marginBottom: '4px' }}>{phase.timeline}</div>
                  <div style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>{phase.scope}</div>
                  <div style={{ marginBottom: '16px' }}>
                    {phase.activities.map((act, j) => (
                      <div key={j} style={{
                        fontSize: '12px',
                        color: '#888',
                        marginBottom: '6px',
                        paddingLeft: '12px',
                        borderLeft: '2px solid rgba(139, 92, 246, 0.3)'
                      }}>
                        {act}
                      </div>
                    ))}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#8b5cf6',
                    padding: '8px 12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '4px'
                  }}>
                    → {phase.outcome}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section style={{
        padding: '60px 48px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '1px', marginBottom: '16px' }}>
            PRICING
          </div>
          <div style={{ fontSize: '20px', color: '#fff', marginBottom: '16px' }}>
            Portfolio pricing. Not per-seat SaaS math.
          </div>
          <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7', marginBottom: '24px' }}>
            One price covers your entire portfolio. Add companies as you acquire them. 
            No per-user fees. No transaction volume gotchas. Pricing scales with portfolio 
            size, not with success.
          </div>
          <div style={{
            display: 'inline-flex',
            gap: '32px',
            padding: '20px 40px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>STARTING AT</div>
              <div style={{ fontSize: '24px', color: '#fff' }}>$5K<span style={{ fontSize: '14px', color: '#888' }}>/mo</span></div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}/>
            <div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>PER COMPANY</div>
              <div style={{ fontSize: '24px', color: '#fff' }}>~$500<span style={{ fontSize: '14px', color: '#888' }}>/mo</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '500',
          color: '#fff',
          margin: '0 0 16px 0'
        }}>
          Start with a portfolio assessment
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#666',
          margin: '0 0 32px 0',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          We'll review 2-3 of your portfolio companies and show you exactly where 
          the financial data gaps are—and how fast we can close them.
        </p>
        <button style={{
          padding: '16px 32px',
          background: '#fff',
          border: 'none',
          borderRadius: '8px',
          color: '#0a0a0f',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '12px'
        }}>
          Request Portfolio Assessment
        </button>
        <div style={{ fontSize: '13px', color: '#666' }}>
          45 minutes · We'll show you real gaps · No commitment
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '13px', color: '#444' }}>
          © 2025 Sightline. Financial integrity for PE portfolios.
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Built by operators who've lived post-acquisition chaos.
        </div>
      </footer>
    </div>
  );
};

export default SightlinePELanding;
