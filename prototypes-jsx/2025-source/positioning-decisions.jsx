import React, { useState } from 'react';

const PositioningDecision = () => {
  const [step, setStep] = useState(0);
  const [decisions, setDecisions] = useState({
    buyer: null,
    pain: null,
    category: null,
    proof: null,
    tagline: null
  });

  const choose = (key, value) => {
    setDecisions(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(step + 1), 300);
  };

  const reset = () => {
    setStep(0);
    setDecisions({ buyer: null, pain: null, category: null, proof: null, tagline: null });
  };

  const steps = [
    {
      key: 'buyer',
      question: 'WHO WRITES THE CHECK?',
      subtext: 'Pick ONE primary buyer. You can expand later.',
      options: [
        { 
          id: 'cfo_complex',
          label: 'CFO at Complex Operations',
          desc: 'Multi-entity, high transaction volume, inventory/logistics',
          examples: 'Manufacturing, distribution, ecommerce, hospitality',
          implication: 'Lead with operational efficiency, close time reduction'
        },
        { 
          id: 'pe_ops',
          label: 'PE Operating Partner',
          desc: 'Portfolio oversight, due diligence, value creation',
          examples: 'Mid-market PE, growth equity ops teams',
          implication: 'Lead with risk reduction, faster diligence, portfolio visibility'
        },
        { 
          id: 'cfo_audit',
          label: 'CFO Facing Audit Pain',
          desc: 'SOX compliance, IPO prep, audit fatigue',
          examples: 'Pre-IPO, regulated industries, post-restatement',
          implication: 'Lead with continuous controls, audit-ready state'
        },
        { 
          id: 'controller',
          label: 'Controller / VP Finance',
          desc: 'Owns the close, lives in reconciliation hell',
          examples: 'Any company with painful monthly close',
          implication: 'Lead with time savings, exception management'
        }
      ]
    },
    {
      key: 'pain',
      question: 'WHAT PAIN DO YOU SOLVE FIRST?',
      subtext: 'The entry point. What gets them to take the meeting.',
      options: [
        { 
          id: 'close',
          label: 'Slow, Painful Close',
          desc: '10+ days, reconciliation hell, late nights',
          hook: '"What if your books were always closed?"',
          metric: 'Close days reduced'
        },
        { 
          id: 'audit',
          label: 'Audit Evidence Scramble',
          desc: 'PBC chaos, screenshot hunting, re-explanation',
          hook: '"What if every transaction carried its own proof?"',
          metric: 'Audit prep hours reduced'
        },
        { 
          id: 'trust',
          label: 'Can\'t Trust the Numbers',
          desc: 'Reconciliation surprises, unexplained variances',
          hook: '"What if bad data couldn\'t get in?"',
          metric: 'Exception rate, adjustment volume'
        },
        { 
          id: 'scale',
          label: 'Processes Don\'t Scale',
          desc: 'Adding headcount to handle volume',
          hook: '"What if the system enforced the rules?"',
          metric: 'Transactions per FTE'
        }
      ]
    },
    {
      key: 'category',
      question: 'WHAT CATEGORY DO YOU CLAIM?',
      subtext: 'This is how people will file you in their brain.',
      options: [
        { 
          id: 'integrity',
          label: 'Financial Integrity Platform',
          position: 'New category. You define it.',
          risk: 'Requires education. No existing budget line.',
          upside: 'No direct comparison. Premium positioning.'
        },
        { 
          id: 'controls',
          label: 'Continuous Controls',
          position: 'Evolution of GRC / internal controls',
          risk: 'May get bucketed with compliance software',
          upside: 'Existing budget. Clear buyer (internal audit, SOX)'
        },
        { 
          id: 'middleware',
          label: 'Financial Operations Layer',
          position: 'Infrastructure between ops systems and ERP',
          risk: 'Technical, may feel like IT purchase',
          upside: 'Clear technical value prop. Integration story.'
        },
        { 
          id: 'automation',
          label: 'Intelligent Close Automation',
          position: 'Next-gen close management',
          risk: 'Crowded space. BlackLine comparisons.',
          upside: 'Clear pain point. Measurable ROI.'
        }
      ]
    },
    {
      key: 'proof',
      question: 'WHAT\'S YOUR PROOF POINT?',
      subtext: 'The concrete thing that makes it real.',
      options: [
        { 
          id: 'demo',
          label: 'Live Demo: Event Rejected',
          proof: 'Show a transaction blocked in real-time',
          why: 'Visceral. They\'ve never seen this.',
          need: 'Working system, even if limited scope'
        },
        { 
          id: 'pilot',
          label: 'Pilot Results',
          proof: '60% reduction in close time at [Company]',
          why: 'Social proof. Quantified outcome.',
          need: 'One customer willing to be referenced'
        },
        { 
          id: 'architecture',
          label: 'Technical Architecture',
          proof: 'Event-sourced, append-only, hash-verified',
          why: 'Appeals to technical buyers. Differentiated.',
          need: 'Credible technical narrative'
        },
        { 
          id: 'framework',
          label: 'The Framework Itself',
          proof: 'Proof-First Finance manifesto / methodology',
          why: 'Thought leadership. Sells the vision.',
          need: 'Content, speaking, publishing'
        }
      ]
    },
    {
      key: 'tagline',
      question: 'PICK YOUR LINE',
      subtext: 'The one sentence you\'ll repeat 1000 times.',
      options: [
        { 
          id: 'proof',
          label: 'Proof before posting.',
          tone: 'Direct, simple, memorable',
          use: 'Works everywhere. Easy to explain.'
        },
        { 
          id: 'fiction',
          label: 'Finance without the fiction.',
          tone: 'Provocative, contrarian',
          use: 'Great for content, may be too edgy for enterprise'
        },
        { 
          id: 'ready',
          label: 'Always audit-ready.',
          tone: 'Outcome-focused, safe',
          use: 'Clear value prop, may feel narrow'
        },
        { 
          id: 'integrity',
          label: 'The integrity layer.',
          tone: 'Technical, architectural',
          use: 'Category-defining, needs explanation'
        }
      ]
    }
  ];

  const currentStep = steps[step];
  const allDecided = Object.values(decisions).every(v => v !== null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '300',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          color: '#fff',
          margin: '0 0 8px 0'
        }}>
          POSITIONING DECISIONS
        </h1>
        <p style={{
          fontSize: '11px',
          color: '#666',
          letterSpacing: '2px',
          margin: 0
        }}>
          FIVE CHOICES THAT DEFINE YOUR BRAND
        </p>
      </div>

      {/* Progress */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '40px'
      }}>
        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              width: '120px',
              padding: '8px',
              background: i === step ? 'rgba(139, 92, 246, 0.2)' : 
                         i < step ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === step ? '#8b5cf6' : 
                                   i < step ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px',
              textAlign: 'center',
              cursor: i < step ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              fontSize: '9px', 
              letterSpacing: '1px', 
              color: i === step ? '#8b5cf6' : i < step ? '#22c55e' : '#666',
              marginBottom: '4px'
            }}>
              {i < step ? '✓' : `0${i + 1}`}
            </div>
            <div style={{ 
              fontSize: '9px', 
              color: i <= step ? '#aaa' : '#444',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {s.key}
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!allDecided ? (
          <>
            {/* Question */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                fontSize: '20px',
                color: '#fff',
                marginBottom: '8px',
                letterSpacing: '2px'
              }}>
                {currentStep.question}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {currentStep.subtext}
              </div>
            </div>

            {/* Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {currentStep.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => choose(currentStep.key, opt)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ':hover': {
                      borderColor: '#8b5cf6'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    color: '#fff',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {opt.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#888',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {opt.desc || opt.position || opt.proof || opt.tone}
                  </div>
                  {(opt.examples || opt.hook || opt.risk || opt.why || opt.use) && (
                    <div style={{
                      fontSize: '10px',
                      color: '#666',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '10px',
                      marginTop: '10px'
                    }}>
                      {opt.examples && <div><span style={{ color: '#8b5cf6' }}>Examples:</span> {opt.examples}</div>}
                      {opt.hook && <div style={{ color: '#22c55e', fontStyle: 'italic' }}>{opt.hook}</div>}
                      {opt.implication && <div><span style={{ color: '#f59e0b' }}>→</span> {opt.implication}</div>}
                      {opt.metric && <div><span style={{ color: '#22c55e' }}>Metric:</span> {opt.metric}</div>}
                      {opt.risk && <div><span style={{ color: '#ef4444' }}>Risk:</span> {opt.risk}</div>}
                      {opt.upside && <div><span style={{ color: '#22c55e' }}>Upside:</span> {opt.upside}</div>}
                      {opt.why && <div><span style={{ color: '#8b5cf6' }}>Why:</span> {opt.why}</div>}
                      {opt.need && <div><span style={{ color: '#f59e0b' }}>Need:</span> {opt.need}</div>}
                      {opt.use && <div style={{ color: '#888' }}>{opt.use}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '18px', color: '#22c55e', marginBottom: '8px' }}>
                YOUR POSITIONING
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                These five decisions create focus. Everything else flows from here.
              </div>
            </div>

            {/* Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(34, 197, 94, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              {/* Tagline */}
              <div style={{
                fontSize: '28px',
                color: '#fff',
                textAlign: 'center',
                marginBottom: '32px',
                fontWeight: '300'
              }}>
                "{decisions.tagline?.label}"
              </div>

              {/* Position Statement */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '24px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '12px' }}>
                  POSITIONING STATEMENT
                </div>
                <div style={{ fontSize: '14px', color: '#ddd', lineHeight: '1.8' }}>
                  For <span style={{ color: '#22c55e' }}>{decisions.buyer?.label.toLowerCase()}</span> who 
                  struggle with <span style={{ color: '#ef4444' }}>{decisions.pain?.label.toLowerCase()}</span>,{' '}
                  <span style={{ color: '#fff' }}>Sightline</span> is a{' '}
                  <span style={{ color: '#8b5cf6' }}>{decisions.category?.label.toLowerCase()}</span> that 
                  ensures every transaction carries its own proof.
                </div>
              </div>

              {/* Key Decisions Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#666', letterSpacing: '1px', marginBottom: '6px' }}>BUYER</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{decisions.buyer?.label}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{decisions.buyer?.examples}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#666', letterSpacing: '1px', marginBottom: '6px' }}>ENTRY PAIN</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{decisions.pain?.label}</div>
                  <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '4px' }}>{decisions.pain?.hook}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#666', letterSpacing: '1px', marginBottom: '6px' }}>CATEGORY</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{decisions.category?.label}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{decisions.category?.position}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#666', letterSpacing: '1px', marginBottom: '6px' }}>PROOF POINT</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{decisions.proof?.label}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{decisions.proof?.why}</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '10px', color: '#f59e0b', letterSpacing: '2px', marginBottom: '16px' }}>
                TO MAKE THIS REAL
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { action: 'Validate buyer', detail: `Talk to 5 ${decisions.buyer?.label.toLowerCase()}s this month` },
                  { action: 'Nail the hook', detail: `Test "${decisions.pain?.hook}" in cold outreach` },
                  { action: 'Build proof', detail: decisions.proof?.need },
                  { action: 'Own the category', detail: `Publish on "${decisions.category?.label}" — be the definition` }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#fff' }}>{item.action}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '12px 32px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}
              >
                Try Different Choices
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PositioningDecision;
