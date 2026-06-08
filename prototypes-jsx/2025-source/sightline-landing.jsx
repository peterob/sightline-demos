import React, { useState, useEffect } from 'react';

const SightlineLanding = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && demoStep < 4) {
      const timer = setTimeout(() => setDemoStep(d => d + 1), 800);
      return () => clearTimeout(timer);
    }
    if (demoStep >= 4) setIsRunning(false);
  }, [isRunning, demoStep]);

  const startDemo = () => {
    setDemoStep(0);
    setIsRunning(true);
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
        padding: '24px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          color: '#fff'
        }}>
          <span style={{ 
            display: 'inline-block',
            width: '8px',
            height: '8px',
            background: '#22c55e',
            borderRadius: '2px',
            marginRight: '10px'
          }}/>
          sightline
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#how" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>How it works</a>
          <a href="#why" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>Why it matters</a>
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Request demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '120px 48px 80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '52px',
              fontWeight: '500',
              lineHeight: '1.1',
              color: '#fff',
              margin: '0 0 24px 0',
              letterSpacing: '-1px'
            }}>
              Proof before posting.
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#888',
              lineHeight: '1.6',
              margin: '0 0 40px 0',
              maxWidth: '480px'
            }}>
              Sightline validates every transaction before it enters your ledger. 
              Bad data doesn't get fixed later. It doesn't get in.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{
                padding: '16px 32px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#0a0a0f',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                See it work
              </button>
              <button style={{
                padding: '16px 32px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                cursor: 'pointer'
              }}>
                Read the manifesto
              </button>
            </div>
          </div>

          {/* Live Demo */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '1px' }}>
                LIVE VALIDATION
              </div>
              <button
                onClick={startDemo}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '4px',
                  color: '#8b5cf6',
                  fontSize: '10px',
                  cursor: 'pointer',
                  letterSpacing: '1px'
                }}
              >
                ▶ RUN
              </button>
            </div>

            {/* Event */}
            <div style={{
              background: demoStep >= 1 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${demoStep >= 1 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '10px', color: '#3b82f6', marginBottom: '6px' }}>EVENT</div>
              <div style={{ fontSize: '12px', color: '#ddd' }}>GOODS_RECEIVED</div>
              <div style={{ fontSize: '11px', color: '#666' }}>SKU-456, Qty 75, PO#65102</div>
            </div>

            {/* Checks */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '10px' }}>VALIDATION</div>
              {[
                { label: 'PO exists', status: demoStep >= 2 ? 'pass' : 'pending' },
                { label: 'PO is open', status: demoStep >= 3 ? 'fail' : demoStep >= 2 ? 'checking' : 'pending' },
                { label: 'Qty ≤ remaining', status: 'pending' }
              ].map((check, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '6px',
                  opacity: check.status === 'pending' ? 0.4 : 1,
                  transition: 'all 0.3s'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: check.status === 'pass' ? 'rgba(34, 197, 94, 0.2)' :
                               check.status === 'fail' ? 'rgba(239, 68, 68, 0.2)' :
                               check.status === 'checking' ? 'rgba(139, 92, 246, 0.2)' :
                               'rgba(255,255,255,0.05)',
                    border: `1px solid ${check.status === 'pass' ? '#22c55e' :
                                        check.status === 'fail' ? '#ef4444' :
                                        check.status === 'checking' ? '#8b5cf6' :
                                        'rgba(255,255,255,0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: check.status === 'pass' ? '#22c55e' :
                           check.status === 'fail' ? '#ef4444' : '#666'
                  }}>
                    {check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : check.status === 'checking' ? '•' : '○'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{check.label}</span>
                  {check.status === 'fail' && (
                    <span style={{ fontSize: '10px', color: '#ef4444', marginLeft: 'auto' }}>CLOSED 12/13</span>
                  )}
                </div>
              ))}
            </div>

            {/* Result */}
            <div style={{
              background: demoStep >= 4 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${demoStep >= 4 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: demoStep >= 4 ? '#ef4444' : '#444'
              }}>
                {demoStep >= 4 ? 'REJECTED' : '—'}
              </div>
              {demoStep >= 4 && (
                <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                  No ledger impact. Routed to exception queue.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 48px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '15px',
          color: '#666',
          margin: 0,
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.7'
        }}>
          Built by a CFO who spent 15 years reconciling what should have been prevented.
          <br/>
          <span style={{ color: '#888' }}>This isn't another dashboard. It's a gate.</span>
        </p>
      </section>

      {/* How It Works */}
      <section id="how" style={{
        padding: '100px 48px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '500',
            color: '#fff',
            margin: '0 0 16px 0'
          }}>
            How it works
          </h2>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            One rule enforced everywhere.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px'
        }}>
          {[
            {
              num: '01',
              title: 'Event submitted',
              desc: 'Your systems submit business events—receipts, shipments, payments—with evidence attached.',
              detail: 'Not journal entries. Events.'
            },
            {
              num: '02',
              title: 'Rules checked',
              desc: 'Every event hits validation: Does the PO exist? Is the quantity valid? Is approval attached?',
              detail: 'Your rules, enforced automatically.'
            },
            {
              num: '03',
              title: 'Accept or reject',
              desc: 'Valid events post to the ledger. Invalid events go to an exception queue with clear reasons.',
              detail: 'No bad data gets in. Period.'
            }
          ].map((step, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '32px'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '300',
                color: 'rgba(139, 92, 246, 0.4)',
                marginBottom: '16px',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {step.num}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#fff',
                margin: '0 0 12px 0'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#888',
                margin: '0 0 16px 0',
                lineHeight: '1.6'
              }}>
                {step.desc}
              </p>
              <div style={{
                fontSize: '12px',
                color: '#8b5cf6',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Difference */}
      <section id="why" style={{
        padding: '100px 48px',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '500',
              color: '#fff',
              margin: '0 0 16px 0'
            }}>
              Why it matters
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: '12px',
              padding: '32px'
            }}>
              <div style={{ fontSize: '11px', color: '#ef4444', letterSpacing: '1px', marginBottom: '16px' }}>
                TODAY
              </div>
              <div style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                Accept everything.<br/>Reconcile later.
              </div>
              <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
                Month-end scramble. Evidence hunting. Adjusting entries. 
                Explaining variances. The same problems, every close.
              </div>
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '24px',
                color: '#ef4444',
                textAlign: 'center'
              }}>
                10+ day close
              </div>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
              padding: '32px'
            }}>
              <div style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '1px', marginBottom: '16px' }}>
                WITH SIGHTLINE
              </div>
              <div style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>
                Validate first.<br/>Always ready.
              </div>
              <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
                Exceptions surface in hours. Evidence is attached at creation.
                Your books are always audit-ready.
              </div>
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '24px',
                color: '#22c55e',
                textAlign: 'center'
              }}>
                2 day close
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section style={{
        padding: '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#666',
            letterSpacing: '2px',
            margin: '0 0 24px 0',
            textTransform: 'uppercase'
          }}>
            What we don't claim
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#888',
            lineHeight: '1.8',
            margin: 0
          }}>
            We improve integrity of recorded facts. We don't automate judgment.
            Fair value, impairment, reserves, complex allocations—those still need your expertise.
            <br/><br/>
            <span style={{ color: '#aaa' }}>
              We handle the facts. You handle the decisions.
            </span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 48px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '500',
          color: '#fff',
          margin: '0 0 16px 0'
        }}>
          See proof before posting.
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 40px 0'
        }}>
          30-minute demo. No slides. Just the system.
        </p>
        <button style={{
          padding: '18px 40px',
          background: '#fff',
          border: 'none',
          borderRadius: '8px',
          color: '#0a0a0f',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Request a demo
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#444' }}>
          © 2025 Sightline. Financial integrity platform.
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          Built in Charleston, SC
        </div>
      </footer>
    </div>
  );
};

export default SightlineLanding;
