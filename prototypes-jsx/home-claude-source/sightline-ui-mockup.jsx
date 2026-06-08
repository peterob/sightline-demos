import React, { useState } from 'react';

// Sightline UI Mockup - GPU Project Dashboard
// Industrial/utilitarian aesthetic with high information density
// Monospace typography, minimal color, data-forward design

const SightlineDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('GB200-Q4-2025-CoreWeave');
  const [activeTab, setActiveTab] = useState('ledger');

  const projects = [
    { id: 'GB200-Q4-2025-CoreWeave', name: 'GB200 Batch Q4-2025', host: 'CoreWeave DEN-1', units: 256, value: '$18.4M', confidence: 0.91, state: 'BURNED_IN' },
    { id: 'H100-Q4-2025-Lambda', name: 'H100 Batch Q4-2025', host: 'Lambda SJC-2', units: 512, value: '$12.8M', confidence: 0.78, state: 'RACKED' },
    { id: 'GB200-Q1-2026-Voltage', name: 'GB200 Batch Q1-2026', host: 'Voltage Park ATL', units: 128, value: '$9.2M', confidence: 0.84, state: 'SHIPPED' },
  ];

  const events = [
    { id: 1, type: 'BURNED_IN', timestamp: '2025-12-02T14:23:00Z', confidence: 0.94, signers: ['host:coreweave', 'buyer:internal'], evidence: 'burn-in-logs-256units.json', status: 'verified' },
    { id: 2, type: 'RACKED', timestamp: '2025-11-28T09:15:00Z', confidence: 0.96, signers: ['host:coreweave', 'buyer:internal'], evidence: 'rack-assignment-den1-r42-48.pdf', status: 'verified' },
    { id: 3, type: 'RECEIVED_AT_HOST', timestamp: '2025-11-25T16:42:00Z', confidence: 0.98, signers: ['host:coreweave', 'logistics:flexport'], evidence: 'intake-serials-256.csv', status: 'verified' },
    { id: 4, type: 'CUSTOMS_CLEARED', timestamp: '2025-11-22T11:30:00Z', confidence: 0.99, signers: ['logistics:flexport', 'customs:cbp'], evidence: 'cbp-release-7501.pdf', status: 'verified' },
    { id: 5, type: 'SHIPPED', timestamp: '2025-11-15T08:00:00Z', confidence: 0.97, signers: ['broker:wiwynn', 'logistics:flexport'], evidence: 'bol-flex-2025-1115.pdf', status: 'verified' },
    { id: 6, type: 'HARDWARE_ALLOCATED', timestamp: '2025-11-01T10:00:00Z', confidence: 0.92, signers: ['broker:wiwynn', 'oem:nvidia'], evidence: 'allocation-confirm-256.pdf', status: 'verified' },
    { id: 7, type: 'DEPOSIT_PAID', timestamp: '2025-10-15T14:00:00Z', confidence: 1.0, signers: ['bank:svb', 'buyer:internal'], evidence: 'wire-confirm-4.6M.pdf', status: 'verified' },
    { id: 8, type: 'CAPACITY_RESERVED', timestamp: '2025-10-10T09:00:00Z', confidence: 0.95, signers: ['host:coreweave', 'buyer:internal'], evidence: 'msa-coreweave-den1.pdf', status: 'verified' },
    { id: 9, type: 'PO_ISSUED', timestamp: '2025-10-01T08:00:00Z', confidence: 1.0, signers: ['buyer:internal', 'broker:wiwynn'], evidence: 'po-2025-0401.pdf', status: 'verified' },
  ];

  const agentRecommendations = [
    { id: 1, type: 'PAYMENT_RELEASE', priority: 'high', title: 'Release milestone payment', description: 'BURNED_IN state verified with 0.94 confidence. All constraints satisfied. $2.76M eligible for release.', action: 'Approve', timestamp: '2 hours ago' },
    { id: 2, type: 'DRAW_REQUEST', priority: 'medium', title: 'Initiate facility draw', description: 'Project at 85% completion. Additional $1.84M available under current advance rate (90%).', action: 'Review', timestamp: '4 hours ago' },
    { id: 3, type: 'ALERT', priority: 'low', title: 'H100 Batch delay detected', description: 'Lambda SJC-2 rack assignment 3 days behind schedule. No impact to critical path yet.', action: 'Monitor', timestamp: '1 day ago' },
  ];

  const invariants = [
    { name: 'Unit Conservation', formula: 'allocated = shipped = received = racked', status: 'PASS', values: '256 = 256 = 256 = 256' },
    { name: 'Power Bounds', formula: 'draw ≤ allocated', status: 'PASS', values: '892 kW ≤ 960 kW' },
    { name: 'Temporal Causality', formula: 'all events in causal order', status: 'PASS', values: '9/9 valid' },
    { name: 'Multi-Party Proof', formula: 'critical states dual-signed', status: 'PASS', values: '6/6 verified' },
  ];

  const financing = {
    facility: '$15M',
    drawn: '$11.04M',
    available: '$3.96M',
    advanceRate: '90%',
    spread: 'SOFR + 425 bps',
    nextMilestone: 'LIVE_REVENUE',
    nextRelease: '$1.84M',
  };

  const stateOrder = ['PO_ISSUED', 'CAPACITY_RESERVED', 'DEPOSIT_PAID', 'HARDWARE_ALLOCATED', 'SHIPPED', 'CUSTOMS_CLEARED', 'RECEIVED_AT_HOST', 'RACKED', 'BURNED_IN', 'LIVE_REVENUE'];
  const currentStateIndex = stateOrder.indexOf('BURNED_IN');

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.9) return '#22c55e';
    if (conf >= 0.7) return '#eab308';
    return '#ef4444';
  };

  return (
    <div style={{
      fontFamily: '"IBM Plex Mono", "SF Mono", "Fira Code", monospace',
      backgroundColor: '#0a0a0a',
      color: '#e5e5e5',
      minHeight: '100vh',
      fontSize: '13px',
      lineHeight: 1.5,
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #262626',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            letterSpacing: '0.05em',
            color: '#fff',
          }}>
            SIGHTLINE
          </div>
          <div style={{ color: '#737373', fontSize: '12px' }}>
            GPU COMPUTE FINANCING
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <span style={{ color: '#737373' }}>Last sync: 2 min ago</span>
          <span style={{ 
            backgroundColor: '#14532d', 
            color: '#22c55e', 
            padding: '2px 8px', 
            borderRadius: '2px',
            fontSize: '11px',
          }}>
            AGENT ACTIVE
          </span>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar - Project List */}
        <aside style={{
          width: '280px',
          borderRight: '1px solid #262626',
          padding: '16px 0',
          flexShrink: 0,
        }}>
          <div style={{ padding: '0 16px 12px', color: '#737373', fontSize: '11px', letterSpacing: '0.1em' }}>
            ACTIVE PROJECTS
          </div>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedProject === project.id ? '#171717' : 'transparent',
                borderLeft: selectedProject === project.id ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 500 }}>{project.name}</span>
                <span style={{ 
                  color: getConfidenceColor(project.confidence),
                  fontSize: '12px',
                }}>
                  {(project.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#737373' }}>
                {project.host} · {project.units} units · {project.value}
              </div>
              <div style={{ 
                marginTop: '6px',
                fontSize: '10px',
                color: '#a3a3a3',
                backgroundColor: '#262626',
                padding: '2px 6px',
                borderRadius: '2px',
                display: 'inline-block',
              }}>
                {project.state}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {/* Project Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#fff',
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  GB200 Batch Q4-2025
                </h1>
                <div style={{ color: '#737373', fontSize: '12px' }}>
                  CoreWeave DEN-1 · Wiwynn (broker) · SVB (lender) · 256 × NVIDIA GB200
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>
                  {(0.91 * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: '11px', color: '#737373' }}>CONFIDENCE</div>
              </div>
            </div>
          </div>

          {/* State Machine Visualization */}
          <div style={{
            backgroundColor: '#171717',
            border: '1px solid #262626',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '11px', color: '#737373', marginBottom: '16px', letterSpacing: '0.1em' }}>
              STATE MACHINE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
              {stateOrder.map((state, index) => (
                <React.Fragment key={state}>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: index <= currentStateIndex ? '#1e3a5f' : '#262626',
                    border: index === currentStateIndex ? '1px solid #3b82f6' : '1px solid transparent',
                    borderRadius: '2px',
                    fontSize: '10px',
                    color: index <= currentStateIndex ? '#93c5fd' : '#525252',
                    whiteSpace: 'nowrap',
                    fontWeight: index === currentStateIndex ? 600 : 400,
                  }}>
                    {state.replace(/_/g, ' ')}
                  </div>
                  {index < stateOrder.length - 1 && (
                    <div style={{ 
                      color: index < currentStateIndex ? '#3b82f6' : '#404040',
                      fontSize: '14px',
                    }}>
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0', 
            marginBottom: '20px',
            borderBottom: '1px solid #262626',
          }}>
            {['ledger', 'invariants', 'financing', 'agent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab ? '#fff' : '#737373',
                  cursor: 'pointer',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontFamily: 'inherit',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'ledger' && (
            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '4px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '140px 160px 80px 200px 1fr 80px',
                padding: '12px 16px',
                borderBottom: '1px solid #262626',
                fontSize: '10px',
                color: '#737373',
                letterSpacing: '0.1em',
              }}>
                <div>EVENT</div>
                <div>TIMESTAMP</div>
                <div>CONF</div>
                <div>SIGNERS</div>
                <div>EVIDENCE</div>
                <div>STATUS</div>
              </div>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 160px 80px 200px 1fr 80px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #1f1f1f',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ color: '#93c5fd', fontWeight: 500 }}>{event.type}</div>
                  <div style={{ color: '#a3a3a3' }}>{formatTimestamp(event.timestamp)}</div>
                  <div style={{ color: getConfidenceColor(event.confidence) }}>
                    {(event.confidence * 100).toFixed(0)}%
                  </div>
                  <div style={{ color: '#737373', fontSize: '11px' }}>
                    {event.signers.join(', ')}
                  </div>
                  <div style={{ 
                    color: '#3b82f6', 
                    fontSize: '11px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}>
                    {event.evidence}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#22c55e',
                    backgroundColor: '#14532d',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    textAlign: 'center',
                  }}>
                    {event.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invariants' && (
            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '4px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 200px 80px',
                padding: '12px 16px',
                borderBottom: '1px solid #262626',
                fontSize: '10px',
                color: '#737373',
                letterSpacing: '0.1em',
              }}>
                <div>CONSTRAINT</div>
                <div>FORMULA</div>
                <div>VALUES</div>
                <div>STATUS</div>
              </div>
              {invariants.map((inv, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 200px 80px',
                    padding: '16px',
                    borderBottom: '1px solid #1f1f1f',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ color: '#fff', fontWeight: 500 }}>{inv.name}</div>
                  <div style={{ color: '#a3a3a3', fontFamily: 'inherit' }}>{inv.formula}</div>
                  <div style={{ color: '#737373', fontSize: '12px' }}>{inv.values}</div>
                  <div style={{
                    fontSize: '10px',
                    color: '#22c55e',
                    backgroundColor: '#14532d',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                    {inv.status}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'financing' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{
                backgroundColor: '#171717',
                border: '1px solid #262626',
                borderRadius: '4px',
                padding: '20px',
              }}>
                <div style={{ fontSize: '11px', color: '#737373', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  FACILITY STATUS
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    ['Total Facility', financing.facility],
                    ['Amount Drawn', financing.drawn],
                    ['Available', financing.available],
                    ['Current Advance Rate', financing.advanceRate],
                    ['Spread', financing.spread],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#737373' }}>{label}</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: '#171717',
                border: '1px solid #262626',
                borderRadius: '4px',
                padding: '20px',
              }}>
                <div style={{ fontSize: '11px', color: '#737373', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  NEXT MILESTONE
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                    {financing.nextMilestone}
                  </div>
                  <div style={{ color: '#737373', fontSize: '12px' }}>
                    Unlocks additional {financing.nextRelease} at current advance rate
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#1e3a5f',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  padding: '12px',
                  fontSize: '12px',
                }}>
                  <div style={{ color: '#93c5fd', marginBottom: '4px' }}>Requirements:</div>
                  <div style={{ color: '#e5e5e5' }}>
                    • Tenant workload deployed<br />
                    • Usage metrics streaming<br />
                    • Revenue recognized in accounting system
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agent' && (
            <div>
              <div style={{ fontSize: '11px', color: '#737373', marginBottom: '16px', letterSpacing: '0.1em' }}>
                AGENT RECOMMENDATIONS
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {agentRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      backgroundColor: '#171717',
                      border: rec.priority === 'high' ? '1px solid #3b82f6' : '1px solid #262626',
                      borderRadius: '4px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          backgroundColor: rec.priority === 'high' ? '#1e3a5f' : rec.priority === 'medium' ? '#422006' : '#1f1f1f',
                          color: rec.priority === 'high' ? '#93c5fd' : rec.priority === 'medium' ? '#fbbf24' : '#737373',
                        }}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{rec.title}</span>
                      </div>
                      <span style={{ color: '#525252', fontSize: '11px' }}>{rec.timestamp}</span>
                    </div>
                    <div style={{ color: '#a3a3a3', fontSize: '12px', marginBottom: '12px' }}>
                      {rec.description}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: rec.action === 'Approve' ? '#1d4ed8' : '#262626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}>
                        {rec.action}
                      </button>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#737373',
                        border: '1px solid #404040',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}>
                        Dismiss
                      </button>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#737373',
                        border: '1px solid #404040',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SightlineDashboard;
