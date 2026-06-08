import { useState, useEffect, useRef } from "react";

const DARK = "#0D0F14";
const PANEL = "#13161E";
const BORDER = "#1E2330";
const ACCENT = "#00C9A7";
const ACCENT2 = "#0E7C7B";
const RED = "#E05252";
const AMBER = "#F0A500";
const DIM = "#4A5368";
const TEXT = "#C8CDD8";
const WHITE = "#F0F4FF";

const mono = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
const sans = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

// ── Synthetic data ─────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: "EVT-001",
    seq: 1,
    type: "ProposedEvent",
    status: "pass",
    ts: "2026-04-15T09:14:02Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      event_type: "invoice_approval",
      payer_entity: "Acme Corp Ltd",
      vendor_entity: "BrightPath Services Inc",
      vendor_contact: "billing@brightpath.io",
      invoice_ref: "INV-1048",
      po_ref: "PO-882",
      amount: 47200,
      currency: "USD",
      payment_date: "2026-04-28",
      destination_ref: "ACCT-****9921",
      reply_by: "2026-04-17T17:00:00Z",
    },
    proof_hash: "a3f9e2d1c8b7",
    narrative: "Agent receives INV-1048 from BrightPath Services. Checks vendor history, PO match, amount within range. All triggers clear — no anomaly detected.",
  },
  {
    id: "EVT-002",
    seq: 2,
    type: "InvariantCore Check",
    status: "pass",
    ts: "2026-04-15T09:14:03Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      rules_checked: ["R1: agent_id non-null", "R2: amount < $50K threshold", "R3: known vendor payee", "R5: policy_version pinned"],
      rules_passed: 4,
      rules_failed: 0,
      decision: "PASS — Trade Message authorised",
    },
    proof_hash: "b7c4f1a9e3d2",
    narrative: "Policy engine runs all six InvariantCore rules. Invoice is $47,200 — below $50K dual-attestation threshold. Vendor is known payee. All rules pass.",
  },
  {
    id: "EVT-003",
    seq: 3,
    type: "Trade Message Sent",
    status: "pass",
    ts: "2026-04-15T09:14:05Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      delivered_to: "billing@brightpath.io",
      channel: "email + mobile-web",
      message: "Acme Corp intends to pay INV-1048. $47,200 on Apr 28 to account ending 9921. Reference: PO-882. Reply by 5pm ET Thu.",
      options: ["Confirm", "Request change", "Dispute"],
    },
    proof_hash: "c2e8d4b1f7a3",
    narrative: "Trade Message delivered to vendor. Three-button interface — Confirm, Request Change, Dispute. Vendor has 48 hours to respond.",
  },
  {
    id: "EVT-004",
    seq: 4,
    type: "AcknowledgeEvent",
    status: "pass",
    ts: "2026-04-15T11:42:17Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      vendor_response: "Confirm",
      vendor_signer: "J. Torres, Controller, BrightPath Services",
      signed_at: "2026-04-15T11:42:17Z",
      bilateral: true,
      note: "Bilateral event — both parties have signed",
    },
    proof_hash: "d9a1c6e4b2f8",
    narrative: "Vendor confirms in 2.5 hours. J. Torres (Controller) signs digitally. This is the bilateral event — both parties have now signed. ProofChain advances.",
  },
  {
    id: "EVT-005",
    seq: 5,
    type: "AttestView Generated",
    status: "pass",
    ts: "2026-04-15T11:42:18Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      views: {
        "AP Team": "Full payload — all fields, ProofChain, vendor signature, agent identity",
        Auditor: "event_type, amount, date, agent_id, policy_version, root_hash",
        Vendor: "invoice_ref, amount, date, destination_ref, confirmation status",
      },
    },
    proof_hash: "e4f2b8d7c1a6",
    narrative: "Three scoped views generated simultaneously. Auditor view is restricted — no internal account details. Vendor view shows only their own data. Enforcement is at data model, not UI.",
  },
  {
    id: "EVT-006",
    seq: 6,
    type: "LedgerPosting",
    status: "pass",
    ts: "2026-04-15T11:42:19Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      debit: "AP Liability 47,200 USD",
      credit: "Cash 47,200 USD",
      gl_ref: "GL-2026-04-15-0041",
      proof_chain_id: "PC-INV1048-001",
      proof_chain_fk: "non-nullable — posting rejected without this",
    },
    proof_hash: "f8c3a5e1d9b4",
    narrative: "Ledger posting created. proof_chain_id is non-nullable — posting is structurally impossible without a complete ProofChain. This is the architectural invariant.",
  },
  // --- VIOLATION SCENARIO ---
  {
    id: "EVT-007",
    seq: 7,
    type: "ProposedEvent",
    status: "violation",
    ts: "2026-04-15T14:03:44Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      event_type: "wire_payment",
      payer_entity: "Acme Corp Ltd",
      vendor_entity: "NewVendor Solutions LLC",
      vendor_contact: "payments@newvendor.io",
      invoice_ref: "INV-1052",
      po_ref: null,
      amount: 85000,
      currency: "USD",
      payment_date: "2026-04-15",
      destination_ref: "ACCT-****4477",
      reply_by: "2026-04-15T16:00:00Z",
    },
    proof_hash: "g1d7f4c2e9a5",
    narrative: "Agent receives rush wire request — $85,000 to a new vendor, same-day, no PO reference. Two InvariantCore rules are triggered simultaneously.",
  },
  {
    id: "EVT-008",
    seq: 8,
    type: "DisputeEvent",
    status: "violation",
    ts: "2026-04-15T14:03:44Z",
    agent_id: "cast-ap-agent-v2.1",
    agent_type: "claude-opus",
    policy_version: "INV-CORE-v14",
    principal_id: "finance-ops@acmecorp.com",
    delegated_by: null,
    payload: {
      rules_failed: [
        "R2: amount $85,000 exceeds $50K — dual attestation required",
        "R3: NewVendor Solutions LLC has no prior payment history — first-payment trigger",
        "R4: missing PO reference above $10K threshold",
      ],
      decision: "BLOCKED — payment not executed",
      escalation: "Human review required — finance-ops@acmecorp.com notified",
      note: "DisputeEvent is permanent. This record cannot be deleted.",
    },
    proof_hash: "h5a2e8f1d4c7",
    narrative: "Three rules fail simultaneously. Agent does not execute. DisputeEvent is a first-class object — not an error, not a log entry. It has its own ProofChain link. Permanent.",
  },
  {
    id: "EVT-009",
    seq: 9,
    type: "Human Resolution",
    status: "resolved",
    ts: "2026-04-15T15:21:09Z",
    agent_id: "human",
    agent_type: "human",
    policy_version: "INV-CORE-v14",
    principal_id: "sarah.chen@acmecorp.com",
    delegated_by: "finance-ops@acmecorp.com",
    payload: {
      reviewer: "Sarah Chen, VP Finance",
      decision: "APPROVED with conditions",
      conditions: ["New vendor approved and added to directory", "PO-891 created retroactively", "Dual attestation: Sarah Chen + CFO sign-off obtained"],
      amended_payment_date: "2026-04-17",
    },
    proof_hash: "i9b6d3f7c1e4",
    narrative: "Human reviews DisputeEvent. VP Finance approves with conditions — new vendor registered, PO created, dual sign-off obtained. Resolution is itself a signed event in the ProofChain.",
  },
];

const PROOF_CHAIN = [
  { seq: 1, type: "ProposedEvent", hash: "a3f9e2d1c8b7", prior: null, event_id: "EVT-001" },
  { seq: 2, type: "InvariantCore", hash: "b7c4f1a9e3d2", prior: "a3f9e2d1c8b7", event_id: "EVT-002" },
  { seq: 3, type: "TradeMessage", hash: "c2e8d4b1f7a3", prior: "b7c4f1a9e3d2", event_id: "EVT-003" },
  { seq: 4, type: "AcknowledgeEvent", hash: "d9a1c6e4b2f8", prior: "c2e8d4b1f7a3", event_id: "EVT-004" },
  { seq: 5, type: "AttestView", hash: "e4f2b8d7c1a6", prior: "d9a1c6e4b2f8", event_id: "EVT-005" },
  { seq: 6, type: "LedgerPosting", hash: "f8c3a5e1d9b4", prior: "e4f2b8d7c1a6", event_id: "EVT-006" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function Tag({ label, color = ACCENT, bg }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: 10, fontWeight: 600,
      color, background: bg || color + "18",
      border: `1px solid ${color}40`,
      borderRadius: 3, padding: "1px 6px", letterSpacing: "0.04em",
      whiteSpace: "nowrap"
    }}>{label}</span>
  );
}

function StatusDot({ status }) {
  const map = {
    pass: ACCENT, violation: RED, resolved: AMBER,
  };
  return (
    <span style={{
      display: "inline-block", width: 7, height: 7, borderRadius: "50%",
      background: map[status] || DIM, flexShrink: 0,
      boxShadow: `0 0 6px ${map[status] || DIM}80`
    }} />
  );
}

function HashChip({ hash, dim }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: 10,
      color: dim ? DIM : ACCENT2,
      background: dim ? "transparent" : ACCENT2 + "12",
      padding: dim ? 0 : "1px 5px",
      borderRadius: 2,
    }}>{hash}</span>
  );
}

function Kbd({ children }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: 10, color: DIM,
      border: `1px solid ${BORDER}`,
      borderRadius: 3, padding: "1px 5px",
      background: PANEL,
    }}>{children}</span>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function CastDemo() {
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);
  const [activeTab, setActiveTab] = useState("events"); // events | proofchain | auditor
  const [animStep, setAnimStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  // Auto-step through events
  const runDemo = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      return;
    }
    setRunning(true);
    setAnimStep(0);
    setSelectedEvent(EVENTS[0]);
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step >= EVENTS.length) {
        clearInterval(timerRef.current);
        setRunning(false);
        return;
      }
      setAnimStep(step);
      setSelectedEvent(EVENTS[step]);
    }, 1800);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const statusColor = (s) =>
    s === "pass" ? ACCENT : s === "violation" ? RED : AMBER;

  const isViolation = selectedEvent?.status === "violation" || selectedEvent?.status === "resolved";

  return (
    <div style={{
      minHeight: "100vh", background: DARK,
      fontFamily: sans, color: TEXT,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
        borderBottom: `1px solid ${BORDER}`,
        background: PANEL,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: DARK, fontWeight: 900, fontSize: 13 }}>C</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: WHITE, letterSpacing: "-0.01em" }}>CAST v1</div>
            <div style={{ fontSize: 10, color: DIM, fontFamily: mono }}>Confirm & Pay — AP Governance Demo</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tag label="INV-CORE-v14" color={ACCENT2} />
          <Tag label="agent: cast-ap-agent-v2.1" color={DIM} bg={BORDER} />
          <button onClick={runDemo} style={{
            background: running ? RED + "20" : ACCENT + "20",
            border: `1px solid ${running ? RED : ACCENT}40`,
            color: running ? RED : ACCENT,
            borderRadius: 5, padding: "5px 14px",
            fontFamily: mono, fontSize: 11, fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.04em",
          }}>
            {running ? "■ STOP" : "▶ RUN DEMO"}
          </button>
        </div>
      </div>

      {/* Scenario banner */}
      <div style={{
        padding: "10px 24px",
        background: "#0A1A18",
        borderBottom: `1px solid ${ACCENT}20`,
        display: "flex", gap: 32, alignItems: "center",
      }}>
        <div style={{ fontSize: 11, color: DIM }}>
          <span style={{ color: ACCENT, fontWeight: 600 }}>SCENARIO 1</span>
          &nbsp;· Invoice approval — INV-1048 · $47,200 · BrightPath Services
        </div>
        <div style={{ width: 1, height: 14, background: BORDER }} />
        <div style={{ fontSize: 11, color: DIM }}>
          <span style={{ color: RED, fontWeight: 600 }}>SCENARIO 2</span>
          &nbsp;· Rush wire attempt — INV-1052 · $85,000 · New vendor · InvariantCore blocks
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: DIM }}>
          {animStep + 1} / {EVENTS.length} events
          <span style={{ marginLeft: 8, color: ACCENT, fontFamily: mono }}>{Math.round((animStep + 1) / EVENTS.length * 100)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: BORDER }}>
        <div style={{
          height: "100%", width: `${(animStep + 1) / EVENTS.length * 100}%`,
          background: `linear-gradient(90deg, ${ACCENT2}, ${ACCENT})`,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Left: Event list */}
        <div style={{
          width: 280, flexShrink: 0,
          borderRight: `1px solid ${BORDER}`,
          background: PANEL, overflow: "auto",
        }}>
          <div style={{ padding: "10px 16px 6px", fontSize: 10, color: DIM, fontFamily: mono, letterSpacing: "0.08em" }}>
            EVENT LOG
          </div>
          {EVENTS.map((ev, i) => (
            <div
              key={ev.id}
              onClick={() => { setSelectedEvent(ev); setAnimStep(i); }}
              style={{
                padding: "10px 16px", cursor: "pointer",
                borderLeft: `3px solid ${selectedEvent?.id === ev.id ? statusColor(ev.status) : "transparent"}`,
                background: selectedEvent?.id === ev.id ? statusColor(ev.status) + "10" : "transparent",
                borderBottom: `1px solid ${BORDER}`,
                opacity: i > animStep ? 0.35 : 1,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <StatusDot status={ev.status} />
                <span style={{ fontFamily: mono, fontSize: 10, color: DIM }}>{ev.id}</span>
                <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9, color: DIM }}>
                  {ev.ts.slice(11, 16)}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: i <= animStep ? WHITE : DIM, lineHeight: 1.3 }}>
                {ev.type}
              </div>
              {ev.status !== "pass" && (
                <div style={{ marginTop: 3 }}>
                  <Tag
                    label={ev.status.toUpperCase()}
                    color={statusColor(ev.status)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center: Event detail */}
        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {selectedEvent && (
            <>
              {/* Event header */}
              <div style={{
                background: PANEL, border: `1px solid ${isViolation ? RED + "40" : BORDER}`,
                borderRadius: 8, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <StatusDot status={selectedEvent.status} />
                      <span style={{ fontFamily: mono, fontSize: 11, color: DIM }}>{selectedEvent.id}</span>
                      <Tag
                        label={selectedEvent.status === "pass" ? "PASS" : selectedEvent.status === "violation" ? "BLOCKED" : "RESOLVED"}
                        color={statusColor(selectedEvent.status)}
                      />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: WHITE, letterSpacing: "-0.02em" }}>
                      {selectedEvent.type}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: mono, fontSize: 10, color: DIM }}>{selectedEvent.ts.replace("T", " ").replace("Z", " UTC")}</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: ACCENT2, marginTop: 2 }}>
                      proof: <HashChip hash={selectedEvent.proof_hash} />
                    </div>
                  </div>
                </div>

                {/* Agent identity row */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 8,
                  padding: "10px 14px",
                  background: ACCENT + "08",
                  border: `1px solid ${ACCENT}20`,
                  borderRadius: 5,
                }}>
                  <div style={{ fontSize: 10, color: DIM, fontFamily: mono, width: "100%", marginBottom: 4 }}>
                    AGENT IDENTITY — non-nullable on every event
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Tag label={`agent: ${selectedEvent.agent_id}`} color={ACCENT} />
                    <Tag label={`type: ${selectedEvent.agent_type}`} color={ACCENT2} />
                    <Tag label={`policy: ${selectedEvent.policy_version}`} color={AMBER} />
                    <Tag label={`principal: ${selectedEvent.principal_id}`} color={DIM} bg={BORDER} />
                  </div>
                </div>

                {/* Narrative */}
                <div style={{
                  marginTop: 12, padding: "10px 14px",
                  background: DARK, borderRadius: 5,
                  fontSize: 13, color: TEXT, lineHeight: 1.6,
                  borderLeft: `3px solid ${statusColor(selectedEvent.status)}`,
                }}>
                  {selectedEvent.narrative}
                </div>
              </div>

              {/* Payload */}
              <div style={{
                background: PANEL, border: `1px solid ${BORDER}`,
                borderRadius: 8, overflow: "hidden",
              }}>
                <div style={{
                  padding: "8px 16px", borderBottom: `1px solid ${BORDER}`,
                  fontFamily: mono, fontSize: 10, color: DIM, letterSpacing: "0.06em",
                }}>
                  PAYLOAD
                </div>
                <div style={{ padding: 16 }}>
                  {Object.entries(selectedEvent.payload).map(([k, v]) => (
                    <div key={k} style={{
                      display: "flex", gap: 16, padding: "5px 0",
                      borderBottom: `1px solid ${BORDER}40`,
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        fontFamily: mono, fontSize: 11, color: ACCENT2,
                        minWidth: 180, flexShrink: 0,
                      }}>{k}</div>
                      <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5, flex: 1 }}>
                        {typeof v === "object" && v !== null ? (
                          Array.isArray(v) ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              {v.map((item, i) => (
                                <div key={i} style={{
                                  fontFamily: mono, fontSize: 11,
                                  color: k === "rules_failed" ? RED : k === "rules_checked" ? ACCENT : TEXT,
                                  padding: "1px 0",
                                }}>
                                  {k === "rules_failed" ? "✗ " : k === "rules_checked" ? "✓ " : ""}{item}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              {Object.entries(v).map(([vk, vv]) => (
                                <div key={vk} style={{ fontSize: 11, fontFamily: mono }}>
                                  <span style={{ color: DIM }}>{vk}: </span>
                                  <span style={{ color: ACCENT }}>{String(vv)}</span>
                                </div>
                              ))}
                            </div>
                          )
                        ) : (
                          <span style={{
                            fontFamily: typeof v === "boolean" || (typeof v === "string" && (v === "PASS — Trade Message authorised" || v === "BLOCKED — payment not executed")) ?
                              mono : sans,
                            color: typeof v === "number" ? AMBER :
                              v === null ? DIM :
                              v === "BLOCKED — payment not executed" ? RED :
                              v === "PASS — Trade Message authorised" ? ACCENT :
                              TEXT,
                          }}>
                            {v === null ? "null" : String(v)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Violation callout */}
              {selectedEvent.status === "violation" && selectedEvent.type === "DisputeEvent" && (
                <div style={{
                  background: RED + "0A",
                  border: `1px solid ${RED}40`,
                  borderRadius: 8, padding: 16,
                }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: RED, marginBottom: 8, letterSpacing: "0.06em" }}>
                    INVARIANT CORE — STRUCTURAL ENFORCEMENT
                  </div>
                  <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.6, marginBottom: 10 }}>
                    The agent did <strong style={{ color: WHITE }}>not</strong> execute this payment. It could not.
                    The InvariantCore rules are checked before execution — not logged after.
                    Three rules failed simultaneously. Each failure is a first-class DisputeEvent with its own ProofChain link.
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: RED }}>
                    "Other systems log what happened. CAST prevents what shouldn't."
                  </div>
                </div>
              )}

              {/* Resolution callout */}
              {selectedEvent.status === "resolved" && (
                <div style={{
                  background: AMBER + "0A",
                  border: `1px solid ${AMBER}40`,
                  borderRadius: 8, padding: 16,
                }}>
                  <div style={{ fontFamily: mono, fontSize: 10, color: AMBER, marginBottom: 8, letterSpacing: "0.06em" }}>
                    HUMAN RESOLUTION — ALSO A SIGNED EVENT
                  </div>
                  <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
                    The human resolution is not a note. It is a signed ProposedEvent with its own agent identity (human),
                    its own policy version, and its own ProofChain link. The complete decision trail —
                    block → escalation → conditions → approval — is permanently and causally linked.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: ProofChain + Auditor panels */}
        <div style={{
          width: 300, flexShrink: 0,
          borderLeft: `1px solid ${BORDER}`,
          display: "flex", flexDirection: "column",
          background: PANEL,
        }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", borderBottom: `1px solid ${BORDER}`,
          }}>
            {[
              { id: "proofchain", label: "ProofChain" },
              { id: "auditor", label: "Auditor View" },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: "9px 4px",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: mono, fontSize: 10, letterSpacing: "0.05em",
                color: activeTab === t.id ? ACCENT : DIM,
                borderBottom: `2px solid ${activeTab === t.id ? ACCENT : "transparent"}`,
              }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ProofChain tab */}
          {activeTab === "proofchain" && (
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              <div style={{ fontSize: 10, color: DIM, fontFamily: mono, marginBottom: 12, letterSpacing: "0.06em" }}>
                PC-INV1048-001 · 6 links · append-only
              </div>
              {PROOF_CHAIN.map((link, i) => (
                <div key={link.seq} style={{ marginBottom: 0 }}>
                  <div style={{
                    padding: "10px 12px",
                    background: selectedEvent?.id === link.event_id ? ACCENT + "10" : DARK,
                    border: `1px solid ${selectedEvent?.id === link.event_id ? ACCENT + "40" : BORDER}`,
                    borderRadius: 5,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: mono, fontSize: 10, color: DIM }}>seq:{link.seq}</span>
                      <span style={{ fontFamily: mono, fontSize: 9, color: DIM }}>{link.event_id}</span>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: WHITE, marginBottom: 5 }}>{link.type}</div>
                    <div style={{ fontSize: 9, fontFamily: mono, marginBottom: 2 }}>
                      <span style={{ color: DIM }}>hash: </span>
                      <HashChip hash={link.hash} />
                    </div>
                    <div style={{ fontSize: 9, fontFamily: mono }}>
                      <span style={{ color: DIM }}>prior: </span>
                      {link.prior ? <HashChip hash={link.prior} /> : <span style={{ color: DIM }}>null (root)</span>}
                    </div>
                  </div>
                  {i < PROOF_CHAIN.length - 1 && (
                    <div style={{
                      width: 1, height: 12, background: ACCENT + "40",
                      margin: "0 auto",
                    }} />
                  )}
                </div>
              ))}
              <div style={{
                marginTop: 12, padding: "10px 12px",
                background: RED + "08", border: `1px solid ${RED}20`,
                borderRadius: 5,
              }}>
                <div style={{ fontFamily: mono, fontSize: 9, color: RED, marginBottom: 4 }}>
                  NON-NULLABLE FK INVARIANT
                </div>
                <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>
                  A LedgerPosting with a null proof_chain_id is rejected at the DB layer.
                  No exceptions. No workarounds.
                </div>
              </div>
            </div>
          )}

          {/* Auditor view tab */}
          {activeTab === "auditor" && (
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              <div style={{ fontSize: 10, color: DIM, fontFamily: mono, marginBottom: 8, letterSpacing: "0.06em" }}>
                SCOPED ATTEST VIEW — AUDITOR
              </div>
              <div style={{
                fontSize: 11, color: TEXT, lineHeight: 1.5,
                marginBottom: 12, padding: "8px 10px",
                background: AMBER + "08", border: `1px solid ${AMBER}20`,
                borderRadius: 4,
              }}>
                This view is generated automatically and scoped at the data model layer — not a UI filter.
                The auditor cannot see internal account details, internal notes, or vendor contact data.
              </div>
              {selectedEvent && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    ["event_id", selectedEvent.id],
                    ["event_type", selectedEvent.type],
                    ["timestamp", selectedEvent.ts],
                    ["agent_id", selectedEvent.agent_id],
                    ["agent_type", selectedEvent.agent_type],
                    ["policy_version", selectedEvent.policy_version],
                    ["principal_id", selectedEvent.principal_id],
                    ["status", selectedEvent.status.toUpperCase()],
                    ["proof_hash", selectedEvent.proof_hash],
                    ["amount", selectedEvent.payload.amount ? `$${selectedEvent.payload.amount.toLocaleString()} ${selectedEvent.payload.currency || ""}` : "N/A"],
                    ["invoice_ref", selectedEvent.payload.invoice_ref || "N/A"],
                    ["chain_root", "a3f9e2d1c8b7"],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      display: "flex", gap: 8,
                      padding: "5px 0", borderBottom: `1px solid ${BORDER}40`,
                    }}>
                      <span style={{ fontFamily: mono, fontSize: 10, color: ACCENT2, minWidth: 110, flexShrink: 0 }}>{k}</span>
                      <span style={{ fontFamily: mono, fontSize: 10, color: TEXT, wordBreak: "break-all" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: 8, padding: "8px 10px",
                    background: DARK, borderRadius: 4,
                    border: `1px solid ${BORDER}`,
                  }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: DIM, marginBottom: 4 }}>REDACTED FIELDS</div>
                    {["destination_ref (full account)", "vendor_contact (email)", "internal_notes", "ap_team_metadata"].map(f => (
                      <div key={f} style={{ fontFamily: mono, fontSize: 10, color: RED + "80", marginBottom: 2 }}>
                        ✗ {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "8px 24px",
        borderTop: `1px solid ${BORDER}`,
        background: PANEL,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: DIM }}>
          Every other system governs what humans do.&nbsp;
          <span style={{ color: ACCENT }}>CAST governs what agents do.</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: DIM }}>click event to inspect · </span>
          <Kbd>▶ RUN DEMO</Kbd>
          <span style={{ fontFamily: mono, fontSize: 10, color: DIM }}> to auto-step</span>
        </div>
      </div>
    </div>
  );
}
