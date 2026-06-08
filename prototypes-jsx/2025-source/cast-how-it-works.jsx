import React, { useState } from 'react';

// CAST "How It Works" - Technical Architecture Page
// Audience: CFOs and technical buyers who want to understand the system

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #fbbf24, #d97706)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{ color: '#18181b', fontWeight: 'bold', fontSize: '16px' }}>C</span>
    </div>
    <span style={{ color: '#f4f4f5', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.02em' }}>CAST</span>
  </div>
);

const ArrowDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
    <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ledger type card
const LedgerCard = ({ icon, name, subtitle, description, examples, color }) => (
  <div style={{
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '32px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Accent line */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: color
    }} />
    
    <div style={{ 
      fontSize: '32px', 
      marginBottom: '16px',
      filter: 'grayscale(0.3)'
    }}>
      {icon}
    </div>
    
    <div style={{ 
      color: '#f4f4f5', 
      fontSize: '20px', 
      fontWeight: 600,
      marginBottom: '4px'
    }}>
      {name}
    </div>
    
    <div style={{ 
      color: '#71717a', 
      fontSize: '14px',
      marginBottom: '16px',
      fontFamily: 'monospace'
    }}>
      {subtitle}
    </div>
    
    <div style={{ 
      color: '#a1a1aa', 
      fontSize: '15px',
      lineHeight: 1.6,
      marginBottom: '20px'
    }}>
      {description}
    </div>
    
    <div style={{ 
      borderTop: '1px solid #27272a',
      paddingTop: '16px'
    }}>
      <div style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Contains
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {examples.map((ex, i) => (
          <span key={i} style={{
            padding: '4px 10px',
            backgroundColor: '#27272a',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#a1a1aa',
            fontFamily: 'monospace'
          }}>
            {ex}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Flow step
const FlowStep = ({ number, title, description, ledgers }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '48px 1fr',
    gap: '20px',
    alignItems: 'start'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#27272a',
      border: '2px solid #fbbf24',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fbbf24',
      fontSize: '18px',
      fontWeight: 600
    }}>
      {number}
    </div>
    <div>
      <div style={{ color: '#f4f4f5', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ color: '#71717a', fontSize: '15px', lineHeight: 1.6, marginBottom: '12px' }}>
        {description}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {ledgers.map((l, i) => (
          <span key={i} style={{
            padding: '4px 10px',
            backgroundColor: l.color,
            borderRadius: '4px',
            fontSize: '11px',
            color: '#18181b',
            fontWeight: 500
          }}>
            {l.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Principle card
const Principle = ({ title, description }) => (
  <div style={{
    padding: '24px',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '8px'
  }}>
    <div style={{ color: '#f4f4f5', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
      {title}
    </div>
    <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6 }}>
      {description}
    </div>
  </div>
);

// Example event row
const EventRow = ({ timestamp, type, actor, evidence, policy }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '140px 160px 100px 140px 100px',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: '#18181b',
    borderBottom: '1px solid #27272a',
    fontSize: '13px',
    fontFamily: 'monospace'
  }}>
    <div style={{ color: '#71717a' }}>{timestamp}</div>
    <div style={{ color: '#fbbf24' }}>{type}</div>
    <div style={{ color: '#a1a1aa' }}>{actor}</div>
    <div style={{ color: '#60a5fa' }}>{evidence}</div>
    <div style={{ color: '#52525b' }}>{policy}</div>
  </div>
);

// Email signup
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  if (submitted) {
    return (
      <div style={{
        padding: '20px 24px',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 500 }}>
          You're on the list
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} 
          style={{ display: 'flex', gap: '12px' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        style={{
          flex: 1,
          padding: '14px 18px',
          backgroundColor: '#27272a',
          border: '1px solid #3f3f46',
          borderRadius: '8px',
          color: '#f4f4f5',
          fontSize: '15px',
          outline: 'none'
        }}
      />
      <button type="submit" style={{
        padding: '14px 28px',
        backgroundColor: '#f59e0b',
        color: '#18181b',
        fontWeight: 600,
        fontSize: '15px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        Get Access
        <ArrowRight />
      </button>
    </form>
  );
};

export default function HowItWorks() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Nav */}
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#" style={{ color: '#71717a', fontSize: '14px', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: '#f4f4f5', fontSize: '14px', textDecoration: 'none' }}>How It Works</a>
          <button style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            border: '1px solid #3f3f46',
            borderRadius: '6px',
            color: '#a1a1aa',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '80px 32px 100px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 14px',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          borderRadius: '20px',
          fontSize: '13px',
          color: '#fbbf24',
          marginBottom: '24px'
        }}>
          Technical Overview
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 24px 0',
          color: '#fafafa'
        }}>
          Four ledgers.<br/>One source of truth.
        </h1>
        
        <p style={{
          fontSize: '18px',
          lineHeight: 1.6,
          color: '#71717a',
          margin: '0 auto',
          maxWidth: '700px'
        }}>
          CAST uses a consistent pattern across all transaction types: policies define the rules, 
          headers define the entity, events record state changes, and finance tracks the money. 
          Every payment is bound to an event. Every event is bound to a policy version.
        </p>
      </section>

      {/* The Four Ledgers */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 100px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px'
        }}>
          <LedgerCard
            icon="📋"
            name="Policy Ledger"
            subtitle="The rules"
            description="Versioned policies that govern what's allowed. Every threshold, approval requirement, and escalation path. When rules change, old decisions remain bound to their original policy version."
            examples={['policy_versions', 'policy_rules', 'thresholds', 'escalation_paths']}
            color="linear-gradient(90deg, #8b5cf6, #a78bfa)"
          />
          
          <LedgerCard
            icon="📦"
            name="Commitment Header"
            subtitle="The entity"
            description="The thing being tracked—a purchase order, a container, a project. Contains the parties, the terms, the current status. Events and payments attach to this."
            examples={['parties', 'terms', 'delivery_date', 'total_value', 'status']}
            color="linear-gradient(90deg, #3b82f6, #60a5fa)"
          />
          
          <LedgerCard
            icon="⚡"
            name="Event Ledger"
            subtitle="What happened"
            description="State transitions with timestamps, actors, and evidence. Every event records which policy version governed the decision and which constraints were checked."
            examples={['event_type', 'from_state', 'to_state', 'evidence_ref', 'policy_version_id']}
            color="linear-gradient(90deg, #f59e0b, #fbbf24)"
          />
          
          <LedgerCard
            icon="💰"
            name="Finance Ledger"
            subtitle="The money"
            description="Payments and cash movements, each linked to a triggering event. No payment without an event. Tracks direction, counterparty, amount, and escrow impact."
            examples={['amount', 'counterparty', 'direction', 'related_event_id', 'payment_ref']}
            color="linear-gradient(90deg, #22c55e, #4ade80)"
          />
        </div>
      </section>

      {/* The Chain */}
      <section style={{
        backgroundColor: '#0c0c0d',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '100px 32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
            color: '#fafafa'
          }}>
            The evidence chain
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#71717a',
            margin: '0 0 48px 0'
          }}>
            Every payment traces back to a policy decision
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Policy */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                📋
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: '#f4f4f5', fontWeight: 500 }}>Policy Version</div>
                <div style={{ color: '#71717a', fontSize: '14px' }}>The rules in effect at decision time</div>
              </div>
              <div style={{ color: '#52525b', fontFamily: 'monospace', fontSize: '13px' }}>
                POL-002
              </div>
            </div>

            <ArrowDown />

            {/* Event */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                ⚡
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: '#f4f4f5', fontWeight: 500 }}>Event</div>
                <div style={{ color: '#71717a', fontSize: '14px' }}>The state change that occurred</div>
              </div>
              <div style={{ color: '#52525b', fontFamily: 'monospace', fontSize: '13px' }}>
                DELIVERED
              </div>
            </div>

            <ArrowDown />

            {/* Evidence */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                📎
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: '#f4f4f5', fontWeight: 500 }}>Evidence</div>
                <div style={{ color: '#71717a', fontSize: '14px' }}>The proof that it happened</div>
              </div>
              <div style={{ color: '#52525b', fontFamily: 'monospace', fontSize: '13px' }}>
                BOL-77291
              </div>
            </div>

            <ArrowDown />

            {/* Payment */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                💰
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: '#f4f4f5', fontWeight: 500 }}>Payment Released</div>
                <div style={{ color: '#71717a', fontSize: '14px' }}>Funds move only after the chain is complete</div>
              </div>
              <div style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '13px' }}>
                $47,500
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '48px',
            padding: '20px 24px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#71717a',
            fontSize: '15px'
          }}>
            <span style={{ color: '#fbbf24' }}>No payment without an event.</span>{' '}
            <span style={{ color: '#a1a1aa' }}>No event without evidence.</span>{' '}
            <span style={{ color: '#71717a' }}>No evidence evaluated without a policy version.</span>
          </div>
        </div>
      </section>

      {/* Example: A Transaction Flow */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '100px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
            color: '#fafafa'
          }}>
            Example: Equipment purchase
          </h2>
          <p style={{ color: '#71717a', fontSize: '17px', margin: 0 }}>
            How the ledgers record a $47,500 CNC machine purchase
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <FlowStep
            number="1"
            title="Buyer creates commitment"
            description="Terms are defined: CNC Machine, $47,500, delivery by Jan 15. Policy POL-002 is in effect. The commitment header is created."
            ledgers={[
              { name: 'Header', color: '#60a5fa' },
              { name: 'Policy', color: '#a78bfa' }
            ]}
          />
          
          <div style={{ borderLeft: '2px dashed #27272a', marginLeft: '23px', height: '24px' }} />
          
          <FlowStep
            number="2"
            title="Buyer funds escrow"
            description="$47,500 moves to CAST escrow. Event COMMITMENT_FUNDED is recorded with payment reference. Finance ledger shows outbound payment from buyer."
            ledgers={[
              { name: 'Event', color: '#fbbf24' },
              { name: 'Finance', color: '#4ade80' }
            ]}
          />
          
          <div style={{ borderLeft: '2px dashed #27272a', marginLeft: '23px', height: '24px' }} />
          
          <FlowStep
            number="3"
            title="Seller accepts"
            description="Seller reviews terms, accepts commitment. Event COMMITMENT_ACCEPTED is recorded. Policy constraint R008 (vendor whitelist) is checked and passes."
            ledgers={[
              { name: 'Event', color: '#fbbf24' },
              { name: 'Policy', color: '#a78bfa' }
            ]}
          />
          
          <div style={{ borderLeft: '2px dashed #27272a', marginLeft: '23px', height: '24px' }} />
          
          <FlowStep
            number="4"
            title="Seller delivers"
            description="Equipment ships. Seller uploads BOL as evidence, marks DELIVERED. Event records evidence reference and policy version."
            ledgers={[
              { name: 'Event', color: '#fbbf24' }
            ]}
          />
          
          <div style={{ borderLeft: '2px dashed #27272a', marginLeft: '23px', height: '24px' }} />
          
          <FlowStep
            number="5"
            title="Buyer confirms (or timeout)"
            description="Buyer confirms receipt, or 48-hour window expires. Event PAYMENT_RELEASED triggers. Finance ledger records outbound payment to seller."
            ledgers={[
              { name: 'Event', color: '#fbbf24' },
              { name: 'Finance', color: '#4ade80' }
            ]}
          />
        </div>
      </section>

      {/* Sample Event Ledger */}
      <section style={{
        backgroundColor: '#0c0c0d',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '100px 32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: '0 0 16px 0',
              color: '#fafafa'
            }}>
              What the event ledger looks like
            </h2>
            <p style={{ color: '#71717a', fontSize: '17px', margin: 0 }}>
              Every row is immutable. Every decision is auditable.
            </p>
          </div>

          <div style={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 160px 100px 140px 100px',
              gap: '16px',
              padding: '12px 16px',
              backgroundColor: '#27272a',
              fontSize: '11px',
              fontWeight: 600,
              color: '#71717a',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div>Timestamp</div>
              <div>Event</div>
              <div>Actor</div>
              <div>Evidence</div>
              <div>Policy</div>
            </div>
            
            <EventRow
              timestamp="2025-01-10 09:15"
              type="CREATED"
              actor="buyer"
              evidence="—"
              policy="POL-002"
            />
            <EventRow
              timestamp="2025-01-10 09:16"
              type="FUNDED"
              actor="buyer"
              evidence="PAY-9981"
              policy="POL-002"
            />
            <EventRow
              timestamp="2025-01-10 14:32"
              type="ACCEPTED"
              actor="seller"
              evidence="—"
              policy="POL-002"
            />
            <EventRow
              timestamp="2025-01-14 11:20"
              type="DELIVERED"
              actor="seller"
              evidence="BOL-77291"
              policy="POL-002"
            />
            <EventRow
              timestamp="2025-01-14 16:45"
              type="CONFIRMED"
              actor="buyer"
              evidence="—"
              policy="POL-002"
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 160px 100px 140px 100px',
              gap: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#71717a' }}>2025-01-14 16:45</div>
              <div style={{ color: '#22c55e' }}>RELEASED</div>
              <div style={{ color: '#a1a1aa' }}>system</div>
              <div style={{ color: '#60a5fa' }}>PAY-OUT-442</div>
              <div style={{ color: '#52525b' }}>POL-002</div>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 600 }}>6</div>
              <div style={{ color: '#71717a', fontSize: '13px' }}>Events recorded</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 600 }}>4d 7h</div>
              <div style={{ color: '#71717a', fontSize: '13px' }}>Create to release</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 600 }}>100%</div>
              <div style={{ color: '#71717a', fontSize: '13px' }}>Policy compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
            color: '#fafafa'
          }}>
            Design principles
          </h2>
          <p style={{ color: '#71717a', fontSize: '17px', margin: 0 }}>
            Why the architecture works this way
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          <Principle
            title="Policy binding, not policy embedding"
            description="Events reference a policy version ID, not the rules themselves. When you audit, you can reconstruct exactly which rules were in effect. When policies change, old events remain valid."
          />
          <Principle
            title="Evidence is external"
            description="Events contain evidence references, not evidence itself. The BOL number, the payment reference, the intake document ID. CAST doesn't store your files—it records that they existed."
          />
          <Principle
            title="Finance follows events"
            description="Every finance entry links to a related_event_id. You can't pay without a triggering event. This makes reconciliation trivial—the linkage is built in."
          />
          <Principle
            title="Constraints are recorded, not just evaluated"
            description="Events don't just pass or fail. They record which rules were checked, which thresholds applied, and why. The audit trail explains itself."
          />
          <Principle
            title="Headers are lightweight"
            description="The commitment header contains identity and terms. Everything else—state, history, payments—lives in the event and finance ledgers. Headers don't grow."
          />
          <Principle
            title="Immutability over correction"
            description="You can't edit an event. You can only append new events. Corrections are reversals. Disputes are their own event type. The ledger only moves forward."
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{
        backgroundColor: '#0c0c0d',
        borderTop: '1px solid #1a1a1a'
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '100px 32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
            color: '#fafafa'
          }}>
            Ready to see it in action?
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#71717a',
            margin: '0 0 40px 0'
          }}>
            Get early access to CAST. Create your first commitment in 60 seconds.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <SignupForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1a1a1a',
        padding: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Logo />
          <div style={{ color: '#52525b', fontSize: '14px' }}>
            © 2025 CAST
          </div>
        </div>
      </footer>
    </div>
  );
}
