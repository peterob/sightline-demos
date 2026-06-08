import React, { useState, useEffect } from 'react';

const SightlineLandingV2 = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    if (isRunning && demoStep < 4) {
      const timer = setTimeout(() => setDemoStep(d => d + 1), 800);
      return () => clearTimeout(timer);
    }
    if (demoStep >= 4) setIsRunning(false);
  }, [isRunning, demoStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(m => (m + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startDemo = () => {
    setDemoStep(0);
    setIsRunning(true);
  };

  const metrics = [
    { label: 'RUNWAY', value: '847', unit: 'days', status: 'nominal', color: '#22c55e' },
    { label: 'BURN RATE', value: '127K', unit: '/mo', status: 'tracking', color: '#22c55e' },
    { label: 'CASH POSITION', value: '3.2M', unit: 'verified', status: 'confirmed', color: '#22c55e' }
  ];

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
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ 
            display: 'inline-block',
            width: '8px',
            height: '8px',
            background: '#22c55e',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
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
        padding: '100px 48px 80px',
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
            <div style={{
              fontSize: '12px',
              color: '#22c55e',
              letterSpacing: '2px',
              marginBottom: '16px',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              FINANCIAL INTEGRITY PLATFORM
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '500',
              lineHeight: '1.1',
              color: '#fff',
              margin: '0 0 24px 0',
              letterSpacing: '-1px'
            }}>
              Move fast.<br/>Break nothing.
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#888',
              lineHeight: '1.6',
              margin: '0 0 16px 0',
              maxWidth: '480px'
            }}>
              The only financial stack engineered to keep pace with hyper-growth. 
              Real-time telemetry, not monthly reconciliation.
            </p>
            <p style={{
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.6',
              margin: '0 0 40px 0',
              maxWidth: '480px'
            }}>
              Most ventures don't die from fraud. They die from opacity—the thousand 
              invisible inefficiencies that weren't caught until the cash was gone.
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

          {/* Mission Control Telemetry */}
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
                MISSION TELEMETRY
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                color: '#22c55e'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}/>
                LIVE
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {metrics.map((m, i) => (
                <div key={i} style={{
                  background: activeMetric === i ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeMetric === i ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '20px', color: m.color, fontWeight: '600' }}>
                    {m.value}<span style={{ fontSize: '11px', color: '#888' }}>{m.unit}</span>
                  </div>
                  <div style={{ fontSize: '8px', color: '#22c55e', marginTop: '4px' }}>● {m.status}</div>
                </div>
              ))}
            </div>

            {/* Event Validation */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '10px', color: '#888' }}>LATEST VALIDATION</div>
                <button
                  onClick={startDemo}
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '4px',
                    color: '#8b5cf6',
                    fontSize: '9px',
                    cursor: 'pointer',
                    letterSpacing: '1px'
                  }}
                >
                  ▶ REPLAY
                </button>
              </div>

              <div style={{
                background: demoStep >= 4 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${demoStep >= 4 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '6px',
                padding: '12px',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '11px', color: '#ddd' }}>GOODS_RECEIVED</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: demoStep >= 4 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: demoStep >= 4 ? '#ef4444' : '#666'
                  }}>
                    {demoStep >= 4 ? 'REJECTED' : demoStep >= 1 ? 'VALIDATING...' : 'PENDING'}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {demoStep >= 2 && <span style={{ color: '#22c55e' }}>✓ PO exists </span>}
                  {demoStep >= 3 && <span style={{ color: '#ef4444' }}>✗ PO closed </span>}
                </div>
                {demoStep >= 4 && (
                  <div style={{ fontSize: '9px', color: '#888', marginTop: '8px' }}>
                    → Routed to exception queue. No ledger impact.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Founder Angle */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 48px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '8px' }}>
              FOR FOUNDERS
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>
              Know exactly how much runway you have, down to the second.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '1px', marginBottom: '8px' }}>
              FOR INVESTORS
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>
              See capital deployed efficiently, not wasted on variance.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#f59e0b', letterSpacing: '1px', marginBottom: '8px' }}>
              FOR EXIT
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>
              Hand over a cryptographic key. Due diligence done.
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Reframe */}
      <section id="why" style={{
        padding: '100px 48px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '500',
            color: '#fff',
            margin: '0 0 16px 0'
          }}>
            The fog of growth is optional.
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Traditional ERPs force you to fly blind for 30 days at a time.
            Sightline gives you instrument-rated visibility to navigate the storm.
          </p>
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
              THE SILENT KILLER
            </div>
            <div style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>
              Opacity & Drift
            </div>
            <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
              Most ventures don't die from a grand heist. They die from a thousand 
              invisible inefficiencies, delayed data points, and unknown burns 
              that weren't caught until the cash was gone.
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <div style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '1px', marginBottom: '16px' }}>
              THE STRUCTURAL FIX
            </div>
            <div style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>
              Real-Time Telemetry
            </div>
            <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
              We solve the "Fog of War" that kills good projects. Not with more 
              audits—with mission physics. Every transaction validated. Every 
              dollar tracked. Every anomaly surfaced in hours, not months.
            </div>
          </div>
        </div>
      </section>

      {/* The F1 Metaphor */}
      <section style={{
        padding: '80px 48px',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#8b5cf6',
            letterSpacing: '2px',
            marginBottom: '20px'
          }}>
            THE PHILOSOPHY
          </div>
          <div style={{
            fontSize: '24px',
            color: '#fff',
            lineHeight: '1.5',
            marginBottom: '32px'
          }}>
            "You need the world's strongest brakes and stiffest suspension 
            so you can drive at 200mph without falling apart."
          </div>
          <div style={{
            fontSize: '15px',
            color: '#888',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            We don't build armored trucks. We build F1 chassis. The structural 
            integrity that allows high-growth ventures to scale without exploding. 
            We don't solve for hackers—we solve for entropy.
          </div>
        </div>
      </section>

      {/* How It Works - Mission Control Language */}
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
            Mission physics
          </h2>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            Not compliance. Operational clarity.
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
              title: 'Event capture',
              desc: 'Every business event—receipts, shipments, payments—logged with evidence attached. Not journal entries. Telemetry.',
              old: 'Manual data entry',
              new: 'Automated capture'
            },
            {
              num: '02',
              title: 'Validation gate',
              desc: 'Every event hits mission rules: Does the PO exist? Is quantity valid? Is approval attached? Invalid events don\'t enter.',
              old: 'Reconcile later',
              new: 'Block now'
            },
            {
              num: '03',
              title: 'Real-time state',
              desc: 'Your financial position is always current. Not 30 days old. Not "pending close." Now.',
              old: 'Monthly snapshot',
              new: 'Continuous truth'
            }
          ].map((step, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '28px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '300',
                color: 'rgba(139, 92, 246, 0.4)',
                marginBottom: '12px',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {step.num}
              </div>
              <h3 style={{
                fontSize: '17px',
                fontWeight: '500',
                color: '#fff',
                margin: '0 0 10px 0'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#888',
                margin: '0 0 16px 0',
                lineHeight: '1.6'
              }}>
                {step.desc}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px'
              }}>
                <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{step.old}</span>
                <span style={{ color: '#666' }}>→</span>
                <span style={{ color: '#22c55e' }}>{step.new}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vocabulary Shift */}
      <section style={{
        padding: '60px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#666',
            letterSpacing: '2px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            A DIFFERENT VOCABULARY
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {[
              { old: 'Continuous Audit', new: 'Real-Time Telemetry' },
              { old: 'Fraud Prevention', new: 'Capital Preservation' },
              { old: 'Internal Controls', new: 'Mission Physics' },
              { old: 'Compliance', new: 'Operational Clarity' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#ef4444', textDecoration: 'line-through', marginBottom: '8px' }}>
                  {item.old}
                </div>
                <div style={{ fontSize: '13px', color: '#22c55e' }}>
                  {item.new}
                </div>
              </div>
            ))}
          </div>
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
          Build on bedrock.
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 40px 0',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Great ventures shouldn't die from bad data. Replace the quicksand 
          of spreadsheets with structural integrity.
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
        <div style={{
          marginTop: '16px',
          fontSize: '13px',
          color: '#666'
        }}>
          30 minutes. No slides. Just the system.
        </div>
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default SightlineLandingV2;
