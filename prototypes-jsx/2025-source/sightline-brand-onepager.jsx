import React from 'react';

const BrandOnePager = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '48px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '48px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '48px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: '#22c55e',
                borderRadius: '3px'
              }}/>
              sightline
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Brand Guidelines — v1.0
            </div>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '13px',
            color: '#888'
          }}>
            Financial Integrity Platform
            <div style={{ color: '#666', marginTop: '4px' }}>December 2025</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(34, 197, 94, 0.05))',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '16px' }}>
            TAGLINE
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: '500',
            color: '#fff',
            letterSpacing: '-0.5px'
          }}>
            Proof before posting.
          </div>
        </div>

        {/* Two Column: Position + Buyer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#22c55e', letterSpacing: '2px', marginBottom: '16px' }}>
              POSITIONING STATEMENT
            </div>
            <p style={{
              fontSize: '15px',
              color: '#ddd',
              lineHeight: '1.7',
              margin: 0
            }}>
              For <strong>controllers at operationally complex businesses</strong> who 
              lose weeks to month-end close, Sightline is a <strong>financial integrity 
              platform</strong> that validates every transaction before it posts—so 
              your books are always ready.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#3b82f6', letterSpacing: '2px', marginBottom: '16px' }}>
              PRIMARY BUYER
            </div>
            <div style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>
              Controller / VP Finance
            </div>
            <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
              At operationally complex businesses: manufacturing, distribution, 
              ecommerce, hospitality. Feels the pain daily. Sells internally to CFO.
            </div>
          </div>
        </div>

        {/* Brand Personality */}
        <div style={{
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '2px', marginBottom: '20px' }}>
            BRAND PERSONALITY
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {[
              { trait: 'Precise', desc: 'Every word matters. No fluff.' },
              { trait: 'Confident', desc: 'Quiet authority. Not arrogant.' },
              { trait: 'Warm', desc: 'Built by someone who lived this.' },
              { trait: 'Direct', desc: 'Say what it does. Clearly.' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>{item.trait}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Identity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Colors */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '2px', marginBottom: '16px' }}>
              COLOR SYSTEM
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#0a0a0f',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '6px'
                }}/>
                <div style={{ fontSize: '10px', color: '#666' }}>Base</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#22c55e',
                  borderRadius: '8px',
                  marginBottom: '6px'
                }}/>
                <div style={{ fontSize: '10px', color: '#666' }}>Accepted</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#ef4444',
                  borderRadius: '8px',
                  marginBottom: '6px'
                }}/>
                <div style={{ fontSize: '10px', color: '#666' }}>Rejected</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#8b5cf6',
                  borderRadius: '8px',
                  marginBottom: '6px'
                }}/>
                <div style={{ fontSize: '10px', color: '#666' }}>Accent</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Dark default. Green/red carry meaning. Use sparingly.
            </div>
          </div>

          {/* Typography */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '2px', marginBottom: '16px' }}>
              TYPOGRAPHY
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Marketing / UI</div>
              <div style={{ fontSize: '18px', color: '#fff', fontFamily: '-apple-system, sans-serif' }}>
                System Sans-Serif
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Product / Code / Data</div>
              <div style={{ fontSize: '18px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
                JetBrains Mono
              </div>
            </div>
          </div>
        </div>

        {/* Voice */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#22c55e', letterSpacing: '2px', marginBottom: '16px' }}>
              WE SAY
            </div>
            {[
              'Proof before posting.',
              'The system won\'t let bad data in.',
              'Problems surface in hours, not weeks.',
              'Your books are always audit-ready.',
              'We handle facts. You handle decisions.'
            ].map((phrase, i) => (
              <div key={i} style={{
                fontSize: '13px',
                color: '#ddd',
                marginBottom: '8px',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(34, 197, 94, 0.3)'
              }}>
                {phrase}
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '10px', color: '#ef4444', letterSpacing: '2px', marginBottom: '16px' }}>
              WE NEVER SAY
            </div>
            {[
              'AI-powered',
              'Revolutionary / Disruptive',
              'Seamless / Frictionless',
              'Best-in-class',
              'Synergy',
              'Blockchain'
            ].map((phrase, i) => (
              <div key={i} style={{
                fontSize: '13px',
                color: '#888',
                marginBottom: '8px',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(239, 68, 68, 0.3)',
                textDecoration: 'line-through'
              }}>
                {phrase}
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Position */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '10px', color: '#f59e0b', letterSpacing: '2px', marginBottom: '16px' }}>
            COMPETITIVE DIFFERENTIATION
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {[
              { vs: 'vs ERPs', line: '"Your ERP is a filing cabinet. We\'re the lock."' },
              { vs: 'vs AI Bookkeeping', line: '"They automate the entry. We eliminate it."' },
              { vs: 'vs Audit Firms', line: '"They test samples. We validate everything."' },
              { vs: 'vs GRC Software', line: '"They watch the door. We lock it."' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '12px 16px',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '6px' }}>{item.vs}</div>
                <div style={{ fontSize: '12px', color: '#ddd', fontStyle: 'italic' }}>{item.line}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Mark */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '2px', marginBottom: '12px' }}>
              LOGO CONCEPT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Simple geometric mark */}
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #22c55e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#22c55e',
                  borderRadius: '2px'
                }}/>
              </div>
              <div>
                <div style={{ fontSize: '20px', color: '#fff', fontWeight: '600' }}>sightline</div>
                <div style={{ fontSize: '11px', color: '#666' }}>The gate. The checkpoint. The proof.</div>
              </div>
            </div>
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{ marginBottom: '4px' }}>Category: Financial Integrity Platform</div>
            <div>Entry point: Close time reduction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandOnePager;
