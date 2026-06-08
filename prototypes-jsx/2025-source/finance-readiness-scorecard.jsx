import React, { useState } from 'react';

const FinanceReadinessScorecard = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [targetStage, setTargetStage] = useState('seriesA');

  const questions = [
    {
      id: 'cash_speed',
      category: 'Cash Visibility',
      question: 'How quickly can you state your exact cash position?',
      options: [
        { value: 1, label: 'Need to check multiple accounts, takes hours', stage: 'preseed' },
        { value: 2, label: 'Same day, after logging into bank', stage: 'preseed' },
        { value: 3, label: 'Real-time, single dashboard', stage: 'seed' },
        { value: 4, label: 'Real-time with 13-week forecast', stage: 'seriesB' }
      ]
    },
    {
      id: 'burn_accuracy',
      category: 'Burn Rate',
      question: 'How accurate is your stated monthly burn?',
      options: [
        { value: 1, label: 'Rough estimate, could be off by 30%+', stage: 'preseed' },
        { value: 2, label: 'Within 20%, based on bank activity', stage: 'preseed' },
        { value: 3, label: 'Within 10%, accrual-adjusted', stage: 'seed' },
        { value: 4, label: 'Within 5%, with variance explanation', stage: 'seriesA' }
      ]
    },
    {
      id: 'runway_calc',
      category: 'Runway',
      question: 'How do you calculate runway?',
      options: [
        { value: 1, label: 'Cash ÷ average monthly spend', stage: 'preseed' },
        { value: 2, label: 'Multiple scenarios in a spreadsheet', stage: 'seed' },
        { value: 3, label: 'Driver-based model tied to hiring plan', stage: 'seriesA' },
        { value: 4, label: 'Auto-updating model with trigger alerts', stage: 'seriesB' }
      ]
    },
    {
      id: 'close_time',
      category: 'Monthly Close',
      question: 'How many days after month-end do you have final numbers?',
      options: [
        { value: 1, label: '30+ days or whenever we get to it', stage: 'preseed' },
        { value: 2, label: '15-20 business days', stage: 'seed' },
        { value: 3, label: '10-12 business days', stage: 'seriesA' },
        { value: 4, label: '5-7 business days', stage: 'seriesB' }
      ]
    },
    {
      id: 'revenue_rec',
      category: 'Revenue',
      question: 'How do you recognize revenue?',
      options: [
        { value: 1, label: 'When cash hits the bank', stage: 'preseed' },
        { value: 2, label: 'When invoiced, roughly', stage: 'seed' },
        { value: 3, label: 'Deferred revenue tracked, policy documented', stage: 'seriesA' },
        { value: 4, label: 'ASC 606 compliant, auditor-reviewed', stage: 'seriesB' }
      ]
    },
    {
      id: 'ap_process',
      category: 'Accounts Payable',
      question: 'How do you manage vendor payments?',
      options: [
        { value: 1, label: 'Founder pays from personal/company card', stage: 'preseed' },
        { value: 2, label: 'Centralized, weekly payment run', stage: 'seed' },
        { value: 3, label: 'Approval workflow, PO for large purchases', stage: 'seriesA' },
        { value: 4, label: '3-way match (PO, receipt, invoice)', stage: 'seriesB' }
      ]
    },
    {
      id: 'evidence',
      category: 'Transaction Evidence',
      question: 'If asked to prove a $50K payment, how long would it take?',
      options: [
        { value: 1, label: 'Hours of email/Slack searching', stage: 'preseed' },
        { value: 2, label: '30-60 minutes, check a few folders', stage: 'seed' },
        { value: 3, label: '5-10 minutes, attached to transaction', stage: 'seriesA' },
        { value: 4, label: 'Instant, evidence required at entry', stage: 'seriesB' }
      ]
    },
    {
      id: 'audit',
      category: 'Audit Readiness',
      question: 'How painful would a financial audit be?',
      options: [
        { value: 1, label: 'Terrifying, would take months to prepare', stage: 'preseed' },
        { value: 2, label: 'Stressful, but doable with effort', stage: 'seed' },
        { value: 3, label: 'Manageable, most support available', stage: 'seriesA' },
        { value: 4, label: 'Efficient, PBC pre-populated', stage: 'seriesB' }
      ]
    }
  ];

  const stages = {
    preseed: { label: 'Pre-Seed', color: '#666', min: 0 },
    seed: { label: 'Seed', color: '#8b5cf6', min: 8 },
    seriesA: { label: 'Series A', color: '#3b82f6', min: 16 },
    seriesB: { label: 'Series B', color: '#22c55e', min: 24 }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const getReadinessStage = (score) => {
    if (score >= 24) return 'seriesB';
    if (score >= 16) return 'seriesA';
    if (score >= 8) return 'seed';
    return 'preseed';
  };

  const getGaps = () => {
    const gaps = [];
    const targetMin = targetStage === 'seriesA' ? 3 : targetStage === 'seriesB' ? 4 : 2;
    
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer && answer < targetMin) {
        const targetOption = q.options.find(o => o.value === targetMin);
        gaps.push({
          category: q.category,
          current: q.options.find(o => o.value === answer)?.label,
          target: targetOption?.label,
          gap: targetMin - answer
        });
      }
    });
    
    return gaps.sort((a, b) => b.gap - a.gap);
  };

  const allAnswered = Object.keys(answers).length === questions.length;
  const score = calculateScore();
  const currentReadiness = getReadinessStage(score);
  const gaps = getGaps();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '32px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
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
            Finance Readiness Scorecard
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: 0
          }}>
            8 questions. 3 minutes. Know where you stand before investors ask.
          </p>
        </div>

        {/* Target Stage Selector */}
        <div style={{
          marginBottom: '32px',
          padding: '16px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '12px' }}>
            WHAT'S YOUR NEXT RAISE?
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['seed', 'seriesA', 'seriesB'].map(stage => (
              <button
                key={stage}
                onClick={() => setTargetStage(stage)}
                style={{
                  padding: '8px 16px',
                  background: targetStage === stage ? `${stages[stage].color}20` : 'transparent',
                  border: `1px solid ${targetStage === stage ? stages[stage].color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '4px',
                  color: targetStage === stage ? stages[stage].color : '#666',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {stages[stage].label}
              </button>
            ))}
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Questions */}
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                style={{
                  marginBottom: '24px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: `1px solid ${answers[q.id] ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.06)'}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8b5cf6', marginBottom: '4px' }}>
                      {q.category.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#fff' }}>
                      {q.question}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {qIndex + 1}/8
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '8px' }}>
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(q.id, opt.value)}
                      style={{
                        padding: '12px 16px',
                        background: answers[q.id] === opt.value ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${answers[q.id] === opt.value ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '6px',
                        color: answers[q.id] === opt.value ? '#fff' : '#888',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{opt.label}</span>
                      <span style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: `${stages[opt.stage].color}20`,
                        color: stages[opt.stage].color
                      }}>
                        {stages[opt.stage].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit */}
            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              style={{
                width: '100%',
                padding: '16px',
                background: allAnswered ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                border: 'none',
                borderRadius: '8px',
                color: allAnswered ? '#fff' : '#666',
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {allAnswered ? 'See Results' : `Answer all questions (${Object.keys(answers).length}/8)`}
            </button>
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(34, 197, 94, 0.05))',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                YOUR FINANCE READINESS
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '600',
                color: stages[currentReadiness].color,
                marginBottom: '8px'
              }}>
                {score}/32
              </div>
              <div style={{
                fontSize: '18px',
                color: '#fff',
                marginBottom: '16px'
              }}>
                {stages[currentReadiness].label} Ready
              </div>
              
              {currentReadiness !== targetStage && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#f59e0b'
                }}>
                  Gap to {stages[targetStage].label}: {stages[targetStage].min - score} points
                </div>
              )}
              
              {currentReadiness === targetStage && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#22c55e'
                }}>
                  ✓ You meet {stages[targetStage].label} expectations
                </div>
              )}
            </div>

            {/* Score Breakdown */}
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ fontSize: '10px', color: '#888', marginBottom: '16px' }}>
                SCORE BY CATEGORY
              </div>
              {questions.map(q => {
                const answer = answers[q.id];
                const targetMin = targetStage === 'seriesA' ? 3 : targetStage === 'seriesB' ? 4 : 2;
                const meetsTarget = answer >= targetMin;
                
                return (
                  <div
                    key={q.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#888' }}>{q.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        color: meetsTarget ? '#22c55e' : '#f59e0b'
                      }}>
                        {answer}/4
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: meetsTarget ? '#22c55e' : '#f59e0b'
                      }}>
                        {meetsTarget ? '✓' : '↑'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Priority Gaps */}
            {gaps.length > 0 && (
              <div style={{
                marginBottom: '24px',
                padding: '20px',
                background: 'rgba(245, 158, 11, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{ fontSize: '10px', color: '#f59e0b', marginBottom: '16px' }}>
                  PRIORITY GAPS FOR {stages[targetStage].label.toUpperCase()}
                </div>
                {gaps.slice(0, 3).map((gap, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#fff', marginBottom: '6px' }}>
                      {gap.category}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      Now: {gap.current}
                    </div>
                    <div style={{ fontSize: '11px', color: '#22c55e' }}>
                      Need: {gap.target}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* What Investors Will Ask */}
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{ fontSize: '10px', color: '#3b82f6', marginBottom: '16px' }}>
                QUESTIONS INVESTORS WILL ASK AT {stages[targetStage].label.toUpperCase()}
              </div>
              {targetStage === 'seed' && (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#888', lineHeight: '1.8' }}>
                  <li>What's your current burn rate?</li>
                  <li>How much runway do you have?</li>
                  <li>Walk me through your unit economics.</li>
                  <li>How do you track cash?</li>
                </ul>
              )}
              {targetStage === 'seriesA' && (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#888', lineHeight: '1.8' }}>
                  <li>Send me your last 3 months of financials.</li>
                  <li>What's your revenue recognition policy?</li>
                  <li>How long is your monthly close?</li>
                  <li>Have you had an audit or review?</li>
                  <li>Show me your burn by department.</li>
                </ul>
              )}
              {targetStage === 'seriesB' && (
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#888', lineHeight: '1.8' }}>
                  <li>Send audited financials for the last 2 years.</li>
                  <li>Walk me through your internal controls.</li>
                  <li>What's your cash conversion cycle?</li>
                  <li>How do you manage vendor payments and approvals?</li>
                  <li>Show me your variance analysis vs budget.</li>
                </ul>
              )}
            </div>

            {/* CTA */}
            <div style={{
              padding: '24px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px' }}>
                Want to close these gaps before your next raise?
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
                Sightline gets you to {stages[targetStage].label}-ready in weeks, not months.
              </div>
              <button style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                See how it works
              </button>
            </div>

            {/* Retake */}
            <button
              onClick={() => {
                setAnswers({});
                setShowResults(false);
              }}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#666',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Retake Assessment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceReadinessScorecard;
