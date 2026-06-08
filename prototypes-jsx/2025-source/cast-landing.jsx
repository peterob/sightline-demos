import React, { useState } from 'react';

// CAST Landing Page
// Position: Standalone coordination + escrow for GPU compute
// Goal: "Create your first commitment in 60 seconds"

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M6 10l3 3 5-6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

// How it works step
const Step = ({ number, title, description }) => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#27272a',
      border: '1px solid #3f3f46',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#fbbf24',
      fontSize: '14px',
      fontWeight: 600
    }}>
      {number}
    </div>
    <div>
      <div style={{ color: '#f4f4f5', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  </div>
);

// Feature item
const Feature = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <CheckIcon />
    <span style={{ color: '#a1a1aa', fontSize: '15px' }}>{text}</span>
  </div>
);

// Commitment preview card
const CommitmentPreview = () => (
  <div style={{
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '400px'
  }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #27272a' }}>
      <div style={{ 
        display: 'inline-block',
        padding: '4px 10px', 
        backgroundColor: 'rgba(251, 191, 36, 0.15)', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#fbbf24',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px'
      }}>
        Funded · Awaiting Seller
      </div>
      <div style={{ color: '#f4f4f5', fontSize: '18px', fontWeight: 500 }}>
        H100 Compute Block
      </div>
    </div>
    
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Resource</div>
          <div style={{ color: '#d4d4d8', fontSize: '14px' }}>NVIDIA H100 80GB</div>
        </div>
        <div>
          <div style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Quantity</div>
          <div style={{ color: '#d4d4d8', fontSize: '14px' }}>1,000 GPU-hours</div>
        </div>
      </div>
      
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#0c0c0d', 
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ color: '#52525b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Escrow</div>
          <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 600 }}>$2,500</div>
        </div>
        <div style={{ 
          padding: '6px 12px', 
          backgroundColor: '#27272a', 
          borderRadius: '4px',
          color: '#71717a',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          CAST Escrow
        </div>
      </div>
    </div>
    
    <div style={{ 
      padding: '16px 20px', 
      backgroundColor: '#0c0c0d',
      borderTop: '1px solid #27272a',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '50%', 
        backgroundColor: '#22c55e',
        animation: 'pulse 2s infinite'
      }} />
      <span style={{ color: '#52525b', fontSize: '12px' }}>
        3 events recorded · Immutable ledger
      </span>
    </div>
  </div>
);

// Email signup form
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div style={{
        padding: '20px 24px',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
          You're on the list
        </div>
        <div style={{ color: '#71717a', fontSize: '14px' }}>
          We'll reach out when your account is ready
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        style={{
          flex: 1,
          padding: '14px 18px',
          backgroundColor: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '8px',
          color: '#f4f4f5',
          fontSize: '15px',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        style={{
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
          gap: '8px',
          whiteSpace: 'nowrap'
        }}
      >
        Get Early Access
        <ArrowRight />
      </button>
    </form>
  );
};

// Main landing page
export default function CastLanding() {
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
      </nav>
      
      {/* Hero */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 32px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center'
      }}>
        <div>
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
            Now in private beta
          </div>
          
          <h1 style={{
            fontSize: '52px',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 24px 0',
            color: '#fafafa'
          }}>
            Stop reconciling.<br/>
            <span style={{ color: '#fbbf24' }}>Start coordinating.</span>
          </h1>
          
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#71717a',
            margin: '0 0 40px 0',
            maxWidth: '480px'
          }}>
            CAST is the shared ledger for GPU compute transactions. 
            Both parties see the same commitment. Escrow releases on delivery. 
            No integrations required.
          </p>
          
          <div style={{ marginBottom: '32px' }}>
            <SignupForm />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Feature text="Create a commitment in 60 seconds" />
            <Feature text="Funds held in escrow until delivery" />
            <Feature text="Immutable event ledger for both parties" />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CommitmentPreview />
        </div>
      </section>
      
      {/* Problem / Solution */}
      <section style={{
        backgroundColor: '#0c0c0d',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px'
        }}>
          <div>
            <div style={{ 
              color: '#ef4444', 
              fontSize: '12px', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              The Problem
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              margin: '0 0 20px 0',
              color: '#fafafa'
            }}>
              GPU deals live in spreadsheets and email threads
            </h2>
            <p style={{ color: '#71717a', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
              Buyer and seller maintain separate records. Payment terms are negotiated over email. 
              Delivery confirmation is a screenshot. Disputes become he-said-she-said. 
              Finance teams spend hours reconciling what should be a simple transaction.
            </p>
          </div>
          
          <div>
            <div style={{ 
              color: '#22c55e', 
              fontSize: '12px', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              The Solution
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              margin: '0 0 20px 0',
              color: '#fafafa'
            }}>
              One ledger both parties trust
            </h2>
            <p style={{ color: '#71717a', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
              CAST is where the commitment lives—not a mirror of something elsewhere. 
              Terms are structured once. Funds are held in escrow. Every action creates an immutable event. 
              When delivery is confirmed, payment releases automatically. No reconciliation needed.
            </p>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 16px 0',
            color: '#fafafa'
          }}>
            How it works
          </h2>
          <p style={{ color: '#71717a', fontSize: '17px', margin: 0 }}>
            Four steps from commitment to settlement
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px'
        }}>
          <Step 
            number="1"
            title="Create commitment"
            description="Define resource, quantity, price, and delivery date. Takes 60 seconds."
          />
          <Step 
            number="2"
            title="Fund escrow"
            description="Money moves to CAST-controlled escrow. Seller sees funds are secured."
          />
          <Step 
            number="3"
            title="Seller delivers"
            description="Seller accepts terms, delivers compute, marks complete in CAST."
          />
          <Step 
            number="4"
            title="Payment releases"
            description="Buyer confirms or dispute window expires. Funds release to seller."
          />
        </div>
      </section>
      
      {/* Why standalone */}
      <section style={{
        backgroundColor: '#0c0c0d',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '100px 32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 24px 0',
            color: '#fafafa'
          }}>
            No integrations required
          </h2>
          <p style={{ 
            color: '#71717a', 
            fontSize: '18px', 
            lineHeight: 1.7, 
            margin: '0 0 48px 0' 
          }}>
            Most fintech tools want to connect to your ERP, your bank, your everything. 
            CAST takes a different approach: be the place where coordination happens. 
            Your systems can subscribe to the outcomes.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            textAlign: 'left'
          }}>
            <div style={{
              padding: '24px',
              backgroundColor: '#18181b',
              borderRadius: '8px',
              border: '1px solid #27272a'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', marginBottom: '12px' }}>◯</div>
              <div style={{ color: '#f4f4f5', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
                Standalone
              </div>
              <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.5 }}>
                No connectors to maintain. No sync to debug. CAST is the source of truth.
              </div>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#18181b',
              borderRadius: '8px',
              border: '1px solid #27272a'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', marginBottom: '12px' }}>●</div>
              <div style={{ color: '#f4f4f5', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
                Direct
              </div>
              <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.5 }}>
                Sign up online. Create a commitment. No sales call. No implementation project.
              </div>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#18181b',
              borderRadius: '8px',
              border: '1px solid #27272a'
            }}>
              <div style={{ color: '#fbbf24', fontSize: '24px', marginBottom: '12px' }}>◉</div>
              <div style={{ color: '#f4f4f5', fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
                Export-ready
              </div>
              <div style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.5 }}>
                When you need it in your ERP, export the journal entry. One-way, not a sync.
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 32px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          margin: '0 0 16px 0',
          color: '#fafafa'
        }}>
          Ready to coordinate?
        </h2>
        <p style={{ 
          color: '#71717a', 
          fontSize: '18px', 
          margin: '0 0 40px 0' 
        }}>
          Get early access to CAST. Create your first commitment in 60 seconds.
        </p>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <SignupForm />
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
            © 2025 CAST · Coordination & Settlement
          </div>
        </div>
      </footer>
      
      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
