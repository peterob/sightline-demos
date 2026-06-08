import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const C = {
  bg: "#08090b", surface: "#111318", surfaceAlt: "#161922",
  border: "#1e2230", borderHi: "#2a3050",
  text: "#c8cdd8", muted: "#6b7394", dim: "#3d4463", bright: "#e8ecf4",
  accent: "#4f7cff", accentBg: "rgba(79,124,255,0.08)", accentBorder: "rgba(79,124,255,0.2)",
  green: "#34d399", greenBg: "rgba(52,211,153,0.08)", greenBorder: "rgba(52,211,153,0.2)",
  red: "#f87171", redBg: "rgba(248,113,113,0.08)", redBorder: "rgba(248,113,113,0.2)",
  amber: "#fbbf24", amberBg: "rgba(251,191,36,0.08)", amberBorder: "rgba(251,191,36,0.25)",
  purple: "#a78bfa", purpleBg: "rgba(167,139,250,0.08)",
  cyan: "#22d3ee", cyanBg: "rgba(34,211,238,0.08)",
  orange: "#fb923c",
};
const F = {
  mono: "'JetBrains Mono','Fira Code',monospace",
  sans: "'DM Sans',sans-serif",
  display: "'Space Mono',monospace",
};

// ═══════════════════════════════════════════
// DATA: Interface Spec
// ═══════════════════════════════════════════

const GLOBAL_INVARIANTS = [
  { id: "G1", label: "Append-only events", desc: "No mutation of past events; corrections are new events referencing prior ones." },
  { id: "G2", label: "Server time", desc: "Event timestamps are server-issued; clients cannot set authoritative time." },
  { id: "G3", label: "As-known-then", desc: "Every decision stores a decision_snapshot_hash sufficient to replay the same result later." },
  { id: "G4", label: "Policy immutability", desc: "Policy versions are immutable; changes require new versions." },
  { id: "G5", label: "No settlement without obligation", desc: "No settlement instruction can exist without a valid bound Obligation." },
];

const OBJECTS = [
  {
    id: "actor", name: "Actor", purpose: "Identity + role context for authority and non-repudiation.", color: C.accent,
    fields: [
      { n: "actor_id", t: "UUID", r: true }, { n: "org_id", t: "UUID", r: true }, { n: "display_name", t: "string", r: true },
      { n: "status", t: "enum", r: true, v: ["active","suspended","terminated"] },
      { n: "roles[]", t: "enum[]", r: true, v: ["board_member","ceo","treasurer","ap_manager"] },
      { n: "auth_credentials[]", t: "passkey[]", r: true }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["active","suspended","terminated"],
    transitions: [{ f: "active", t: "suspended" }, { f: "suspended", t: "terminated" }],
    stateNote: "Monotonic; no reactivation without explicit ActorReinstated event",
    must: ["Every approval/explanation references an actor_id that was active at that timestamp."],
    never: ["Anonymous approvals.", "A terminated actor producing valid approvals post-termination."],
  },
  {
    id: "policy", name: "PolicyVersion", purpose: "Deterministic ruleset used for binding and eligibility.", color: C.purple,
    fields: [
      { n: "policy_version_hash", t: "content_hash", r: true }, { n: "policy_name", t: "string", r: true },
      { n: "effective_from", t: "timestamp", r: true }, { n: "effective_to", t: "timestamp?", r: false },
      { n: "authoring_actor_id", t: "UUID", r: true }, { n: "approved_by[]", t: "UUID[]", r: true },
      { n: "policy_bundle", t: "serialized", r: true }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["draft","published","retired"],
    transitions: [{ f: "draft", t: "published" }, { f: "published", t: "retired" }],
    stateNote: "Only published is evaluable",
    must: ["Every binding/eligibility decision references a published policy_version_hash."],
    never: ["Editing policy content in place.", "Evaluating against 'latest' without storing version hash."],
  },
  {
    id: "grant", name: "AuthorityGrant", purpose: "Explicit, bounded authority for binding/overrides.", color: C.amber,
    fields: [
      { n: "grant_id", t: "UUID", r: true }, { n: "grantor_actor_id", t: "UUID", r: true }, { n: "grantee_actor_id", t: "UUID", r: true },
      { n: "scope.project_ids[]", t: "UUID[]", r: true }, { n: "scope.vendor_ids[]", t: "UUID[]", r: false },
      { n: "scope.categories[]", t: "enum[]", r: true },
      { n: "limits.per_obligation_max", t: "currency", r: true }, { n: "limits.cumulative_max", t: "currency?", r: false },
      { n: "limits.time_window", t: "enum", r: true }, { n: "expiry_at", t: "timestamp", r: true },
      { n: "revoked_at", t: "timestamp?", r: false }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["active","revoked","expired"],
    transitions: [{ f: "active", t: "revoked" }, { f: "active", t: "expired" }],
    stateNote: "No path from revoked/expired back to active",
    must: ["Binding requires at least one active AuthorityGrant whose scope covers the obligation."],
    never: ["'Implied' authority.", "Using a revoked/expired grant."],
  },
  {
    id: "intent", name: "Intent", purpose: "Structured proposal of spend before it becomes a binding obligation.", color: C.green,
    fields: [
      { n: "intent_id", t: "UUID", r: true }, { n: "originator_actor_id", t: "UUID", r: true },
      { n: "intent_type", t: "enum", r: true, v: ["requisition","po_request","invoice_intake","contract_request"] },
      { n: "vendor_id", t: "UUID?", r: false }, { n: "amount_estimate", t: "currency?", r: false },
      { n: "currency", t: "ISO4217", r: true }, { n: "project_id", t: "UUID", r: true },
      { n: "category_code", t: "string", r: true }, { n: "attachments_merkle_root", t: "hash?", r: false },
      { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["draft","submitted","accepted","rejected","expired"],
    transitions: [{ f: "draft", t: "submitted" }, { f: "submitted", t: "accepted" }, { f: "submitted", t: "rejected" }, { f: "submitted", t: "expired" }],
    stateNote: "Accepted = eligible to bind, not yet an obligation",
    must: ["Every obligation references one originating intent or explicitly states intentless_exception=true."],
    never: ["Binding from a draft intent.", "Changing vendor/category silently after submission."],
  },
  {
    id: "obligation", name: "Obligation", purpose: "The control point artifact: intent → enforceable commitment under policy.", color: "#ff6b6b",
    fields: [
      { n: "obligation_id", t: "UUID", r: true }, { n: "intent_id", t: "UUID", r: true }, { n: "bound_by_actor_id", t: "UUID", r: true },
      { n: "vendor_id", t: "UUID", r: true }, { n: "payee_destination_token", t: "token", r: true },
      { n: "amount_ceiling", t: "currency", r: true }, { n: "currency", t: "ISO4217", r: true },
      { n: "purpose.project_id", t: "UUID", r: true }, { n: "purpose.category_code", t: "string", r: true },
      { n: "purpose.gl_hint", t: "string?", r: false }, { n: "policy_version_hash", t: "hash", r: true },
      { n: "decision_snapshot_hash", t: "hash", r: true }, { n: "approval_requirements", t: "structured", r: true },
      { n: "approvals[]", t: "approval[]", r: true }, { n: "release_conditions[]", t: "condition[]", r: true },
      { n: "expires_at", t: "timestamp", r: true }, { n: "status", t: "enum", r: true }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["draft","bound","eligible","blocked","cancelled","settled","reconciled"],
    transitions: [
      { f: "draft", t: "bound" }, { f: "bound", t: "eligible" }, { f: "bound", t: "blocked" }, { f: "bound", t: "cancelled" },
      { f: "eligible", t: "settled" }, { f: "eligible", t: "blocked" },
      { f: "settled", t: "reconciled" }, { f: "settled", t: "blocked", label: "recon exception" },
      { f: "blocked", t: "eligible", label: "resolution" }, { f: "blocked", t: "cancelled", label: "resolution" },
    ],
    stateNote: "Central state machine — the control point of the entire system",
    must: [
      "bound → policy evaluated true under referenced policy_version_hash",
      "bound → at least one active AuthorityGrant covered scope at bind time",
      "bound → required approvals satisfied or pending",
      "eligible → all release conditions satisfied as of eligibility timestamp",
      "settled → a SettlementReceipt exists referencing this obligation",
    ],
    never: [
      "Obligation becoming eligible without required approvals.",
      "Editing payee destination without re-approval + new decision snapshot.",
      "Settlement against a blocked/cancelled obligation.",
    ],
  },
  {
    id: "receipt", name: "SettlementReceipt", purpose: "Authoritative proof that money moved.", color: "#4ade80",
    fields: [
      { n: "receipt_id", t: "UUID", r: true }, { n: "rail_type", t: "enum", r: true, v: ["ach","wire","rtp","check","stablecoin"] },
      { n: "external_tx_id", t: "string", r: true }, { n: "obligation_id", t: "UUID", r: true },
      { n: "amount", t: "currency", r: true }, { n: "currency", t: "ISO4217", r: true },
      { n: "settled_at", t: "timestamp", r: true }, { n: "counterparty_destination_fingerprint", t: "hash", r: true },
      { n: "raw_payload_hash", t: "hash", r: true }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["observed","confirmed"],
    transitions: [{ f: "observed", t: "confirmed" }],
    stateNote: "Immutable once created",
    must: ["Receipt amount ≤ obligation eligible amount at time of execution.", "Destination fingerprint matches obligation destination token fingerprint."],
    never: ["Receipt without obligation linkage.", "Silent mismatch resolution (must open exception)."],
  },
  {
    id: "exception", name: "ExceptionCase", purpose: "The system fails closed with explicit remediation paths.", color: C.red,
    fields: [
      { n: "case_id", t: "UUID", r: true },
      { n: "case_type", t: "enum", r: true, v: ["unmatched_bank_tx","destination_mismatch","amount_mismatch","duplicate_invoice","override_requested","policy_bypass_attempt"] },
      { n: "related_ids", t: "structured", r: true }, { n: "opened_at", t: "timestamp", r: true },
      { n: "owner_actor_id", t: "UUID", r: true }, { n: "sla_due_at", t: "timestamp", r: true },
      { n: "status", t: "enum", r: true }, { n: "resolution_events[]", t: "event[]", r: true }, { n: "created_at", t: "timestamp", r: true },
    ],
    states: ["open","investigating","resolved","waived"],
    transitions: [{ f: "open", t: "investigating" }, { f: "investigating", t: "resolved" }, { f: "investigating", t: "waived" }],
    stateNote: "Waive requires higher authority + reason code",
    must: ["Any mismatch produces an ExceptionCase within the same processing cycle."],
    never: ["Reconciliation posting that 'forces match' without an ExceptionCase + resolution trail."],
  },
];

const API_INBOUND = [
  { path: "/intents", desc: "Create/submit intent" },
  { path: "/obligations/bind", desc: "Bind from intent → obligation + decision evidence" },
  { path: "/obligations/{id}/approve", desc: "Passkey-signed approval; nonce enforced" },
  { path: "/obligations/{id}/evaluate-eligibility", desc: "Compute eligible/blocked with reasons" },
  { path: "/settlement/execute", desc: "Requires eligible obligation; emits instruction + placeholder" },
  { path: "/settlement/receipts", desc: "Bank/rail receipt ingestion" },
  { path: "/exceptions/{id}/resolve", desc: "Signed resolution + explanation" },
  { path: "/policies/publish", desc: "New PolicyVersion" },
  { path: "/authority/grants", desc: "Create authority grant" },
  { path: "/authority/revoke", desc: "Revoke authority grant" },
];

const API_OUTBOUND = [
  { path: "/audit/trace", desc: "FS → journals → obligations → events → receipts", p: "fs_line_item_id" },
  { path: "/close/readiness", desc: "Unresolved cases, unmatched receipts, blocked obligations" },
  { path: "/disclosure/view", desc: "Tokenized view + proofs", p: "role" },
];

const AUDIT_CLAIMS = [
  { label: "Non-repudiation", desc: "Approvals are passkey-signed; nonces prevent replay.", inv: "Inv_NonceSingleUse" },
  { label: "Prevention over detection", desc: "No settlement execution without eligible obligation.", inv: "Inv_NoSettleWithoutBound" },
  { label: "Traceability", desc: "Every settlement receipt maps to a bound obligation or an open exception.", inv: "Inv_ReceiptMatchesOrException" },
  { label: "Replay", desc: "Decisions reproducible via stored policy version + decision snapshot hash.", inv: "Inv_EligibleRequiresGate" },
];

// ═══════════════════════════════════════════
// DATA: TLA+ Formal Spec
// ═══════════════════════════════════════════

const TLA_INVARIANTS = [
  {
    id: "Inv_EligibleRequiresGate", label: "Eligible ⇒ Quorum ∧ Release ∧ Policy ∧ Authority",
    formula: `∀ o ∈ ObligationIds:\n  obState[o] = "eligible" ⇒\n    HasQuorum(o) ∧ ReleaseSatisfied(o)\n    ∧ PolicyEval(o) ∧ HasAuthority(o)`,
    desc: "No obligation can reach eligible without all four gates passing simultaneously.",
    guards: ["HasQuorum", "ReleaseSatisfied", "PolicyEval", "HasAuthority"],
  },
  {
    id: "Inv_NonceSingleUse", label: "Nonce single-use (no replay)",
    formula: `∀ e1, e2 ∈ approvals:\n  (e1.nonce = e2.nonce) ⇒ e1 = e2`,
    desc: "Two approval events sharing a nonce must be identical — prevents replay attacks.",
    guards: ["ValidApproval"],
  },
  {
    id: "Inv_ReceiptMatchesOrException", label: "Receipt matches ∨ Exception exists",
    formula: `∀ r ∈ receipts:\n  (r.dest = obligations[r.obId].dest\n   ∧ r.amount ≤ EligibleAmount(r.obId))\n  ∨ ∃ c ∈ exceptions:\n    c.receiptId = r.receiptId`,
    desc: "Every receipt either matches its obligation exactly, or an exception case exists. No silent mismatches.",
    guards: ["DestinationMatch", "AmountMatch", "ExceptionExists"],
  },
  {
    id: "Inv_NoSettleWithoutBound", label: "Settled ⇒ was Eligible (history)",
    formula: `∀ o ∈ ObligationIds:\n  obState[o] = "settled" ⇒\n    o ∈ EverEligible`,
    desc: "Requires history variable EverEligible. No obligation can settle without having passed through eligible.",
    guards: ["EverEligible"],
  },
];

const TLA_ACTIONS = [
  { id: "PublishPolicy", from: null, to: null, desc: "Add policy version hash to published set", touches: ["policyPublished"], color: C.purple },
  { id: "SubmitIntent", from: "draft", to: "submitted", desc: "Intent: draft → submitted", touches: ["intentState"], color: C.green },
  { id: "AcceptIntent", from: "submitted", to: "accepted", desc: "Intent: submitted → accepted", touches: ["intentState"], color: C.green },
  { id: "BindObligation", from: "draft", to: "bound", desc: "Ob: draft → bound (policy + authority + active actor)", touches: ["obState"], color: "#ff6b6b",
    preconditions: ["intentState[o.intentId] = accepted", "IsActiveActor(o.boundBy)", "PolicyEval(o)", "HasAuthority(o)"] },
  { id: "ApproveObligation", from: null, to: null, desc: "Add signed approval + consume nonce", touches: ["approvals", "usedNonces"], color: C.accent,
    preconditions: ["IsActiveActor(e.actor)", "e.nonce ∉ usedNonces", "obState ∈ {bound, blocked}", "actor ≠ boundBy (SoD)"] },
  { id: "EvaluateEligibility", from: "bound", to: "eligible", desc: "Ob: bound → eligible (quorum + release)", touches: ["obState"], color: "#ff6b6b",
    preconditions: ["HasQuorum(o)", "ReleaseSatisfied(o)", "EligibleAmount(o) ≤ amountCeiling"] },
  { id: "BlockObligation", from: "bound|eligible|settled", to: "blocked", desc: "Ob → blocked (from bound, eligible, or settled)", touches: ["obState"], color: C.red },
  { id: "ExecuteSettlement", from: "eligible", to: "settled", desc: "Ob: eligible → settled + receipt created", touches: ["obState", "receipts"], color: "#4ade80",
    preconditions: ["obState = eligible", "r.amount ≤ EligibleAmount", "r.dest = obligations[o].dest"] },
  { id: "ReconcileOK", from: "settled", to: "reconciled", desc: "Ob: settled → reconciled (receipt consistent)", touches: ["obState"], color: "#4ade80" },
  { id: "OpenException", from: null, to: null, desc: "Create exception case (status: open)", touches: ["exceptions"], color: C.red },
  { id: "DetectMismatch", from: "settled", to: "blocked", desc: "Mismatch detected → blocked + exception", touches: ["obState", "exceptions"], color: C.red,
    preconditions: ["r.dest ≠ obligations[o].dest ∨ r.amount > EligibleAmount"] },
];

const TLA_VARIABLES = [
  { name: "actorStatus", type: "[Actors → {active,suspended,terminated}]", group: "identity" },
  { name: "roleAt", type: "[Actors → 𝒫{board,ceo,treasurer,ap}]", group: "identity" },
  { name: "policyPublished", type: "𝒫 PolicyVersions", group: "policy" },
  { name: "grants", type: "[GrantIds → Record]", group: "authority" },
  { name: "grantActive", type: "𝒫 GrantIds", group: "authority" },
  { name: "intents", type: "[IntentIds → Record]", group: "flow" },
  { name: "intentState", type: "[IntentIds → IntentStates]", group: "flow" },
  { name: "obligations", type: "[ObligationIds → Record]", group: "flow" },
  { name: "obState", type: "[ObligationIds → ObStates]", group: "flow" },
  { name: "approvals", type: "𝒫 ApprovalEvents", group: "approval" },
  { name: "usedNonces", type: "𝒫 Nonces", group: "approval" },
  { name: "receipts", type: "𝒫 ReceiptEvents", group: "settlement" },
  { name: "exceptions", type: "𝒫 ExceptionCases", group: "exception" },
];

// ═══════════════════════════════════════════
// SIMULATOR ENGINE
// ═══════════════════════════════════════════

const SIM_INITIAL = {
  intentState: "—",
  obState: "—",
  approvalCount: 0,
  quorumMet: false,
  releaseSatisfied: false,
  policyPinned: false,
  authorityActive: false,
  grantRevoked: false,
  actorSuspended: false,
  receiptExists: false,
  receiptMatches: null,
  exceptionOpen: false,
  exceptionResolved: false,
  nonceSet: [],
  destChanged: false,
  history: [],
  violations: [],
  scenarioMode: null,
  scenarioStep: 0,
  scenarioPaused: false,
};

function simReducer(state, action) {
  const seq = state.history.length + 1;
  const ev = (msg, color, type) => ({ seq, msg, color, type: type || "event" });
  const addH = (e) => [...state.history, e];
  const addV = (v) => [...state.violations, v];

  switch (action.id) {
    // ── Normal lifecycle actions ──
    case "create_intent": return { ...state, intentState: "draft", history: addH(ev("Intent INT-0041 created (draft) — originator: Sarah Chen (AP Manager)", C.green)) };
    case "submit": return { ...state, intentState: "submitted", history: addH(ev("Intent INT-0041 submitted — vendor: Vertex Cloud Services, amount: $847,200, category: CapEx/Infrastructure", C.green)) };
    case "accept": return { ...state, intentState: "accepted", history: addH(ev("Intent INT-0041 accepted — eligible to bind as obligation", C.green)) };
    case "reject": return { ...state, intentState: "rejected", history: addH(ev("Intent INT-0041 rejected — vendor not in approved list", C.red)) };
    case "create_ob": return { ...state, obState: "draft", policyPinned: true, authorityActive: true, history: addH(ev("Obligation OB-2847 created (draft) — policy v3.2a pinned (hash: 7f3c…a91b), AuthorityGrant GR-0092 covers scope", "#ff6b6b")) };
    case "bind": return { ...state, obState: "bound", history: addH(ev("Obligation OB-2847 bound — PolicyEval(v3.2a) ✓, HasAuthority(GR-0092) ✓, IsActiveActor(Sarah Chen) ✓, decision_snapshot: d4e1…8c3f", "#ff6b6b")) };
    case "approve": {
      const nonce = `N-${Math.random().toString(36).slice(2,8)}`;
      const actors = ["James Park (Board)", "Maria Torres (Treasurer)", "David Kim (CEO)"];
      const actor = actors[state.approvalCount] || actors[0];
      const nc = state.approvalCount + 1;
      const met = nc >= 2;
      return {
        ...state, approvalCount: nc, quorumMet: met, nonceSet: [...state.nonceSet, nonce],
        history: addH(ev(`Approval ${nc}/2 — ${actor} signed (passkey, nonce: ${nonce})${met ? " — QUORUM REACHED" : ""}`, C.accent))
      };
    }
    case "release": return { ...state, releaseSatisfied: true, history: addH(ev("Release conditions satisfied — milestone evidence uploaded, SLA deadline met", C.amber)) };
    case "eligible": return { ...state, obState: "eligible", history: addH(ev("Obligation OB-2847 → eligible — HasQuorum ✓, ReleaseSatisfied ✓, PolicyEval ✓, HasAuthority ✓", "#ff6b6b")) };
    case "settle": return { ...state, obState: "settled", receiptExists: true, history: addH(ev("Settlement executed — instruction sent via ACH to dest token tk_7x…2f, receipt placeholder R-1193 created", "#4ade80")) };
    case "receipt_ok": return { ...state, receiptMatches: true, history: addH(ev("Receipt R-1193 confirmed — bank ref: ACH-2847-VTXCLD, amount: $847,200 ✓, dest fingerprint matches ✓", "#4ade80")) };
    case "receipt_bad": return { ...state, receiptMatches: false, exceptionOpen: true, history: addH(ev("Receipt R-1193 ingested — MISMATCH: amount $912,000 > ceiling $847,200. ExceptionCase EXC-0071 opened (type: amount_mismatch)", C.red)) };
    case "receipt_dest_bad": return { ...state, receiptMatches: false, exceptionOpen: true, history: addH(ev("Receipt R-1193 ingested — MISMATCH: dest fingerprint fp_9a…3d ≠ obligation dest fp_7x…2f. ExceptionCase EXC-0072 opened (type: destination_mismatch)", C.red)) };
    case "reconcile": return { ...state, obState: "reconciled", history: addH(ev("Obligation OB-2847 reconciled ✓ — receipt R-1193 consistent, GL posting created", "#4ade80")) };
    case "mismatch_block": return { ...state, obState: "blocked", history: addH(ev("Mismatch detected → OB-2847 blocked — ExceptionCase EXC-0071 requires resolution before any further action", C.red)) };
    case "block": return { ...state, obState: "blocked", exceptionOpen: true, history: addH(ev("Obligation OB-2847 blocked — ExceptionCase opened, assigned to Maria Torres (Treasurer)", C.red)) };
    case "resolve_exception": return { ...state, exceptionOpen: false, exceptionResolved: true, history: addH(ev("ExceptionCase EXC-0071 resolved — signed explanation by Maria Torres, corrective receipt ingested", C.amber)) };
    case "unblock_eligible": return { ...state, obState: "eligible", exceptionOpen: false, history: addH(ev("Exception resolved → OB-2847 eligible again — all gates re-verified", C.amber)) };
    case "cancel": return { ...state, obState: "cancelled", history: addH(ev("Obligation OB-2847 cancelled — resolution event: vendor contract terminated", C.dim)) };

    // ── Violation attempts ──
    case "v_settle_blocked": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Execute settlement on blocked obligation OB-2847", C.red, "violation")),
      violations: addV({ inv: "Inv_NoSettleWithoutBound", action: "ExecuteSettlement", reason: "obState = blocked ≠ eligible — settlement requires eligible status", blocked: true }),
    };
    case "v_settle_bound": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Execute settlement on bound (not yet eligible) obligation OB-2847", C.red, "violation")),
      violations: addV({ inv: "Inv_NoSettleWithoutBound", action: "ExecuteSettlement", reason: "obState = bound — must pass through eligible first (quorum + release gates)", blocked: true }),
    };
    case "v_settle_cancelled": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Execute settlement on cancelled obligation OB-2847", C.red, "violation")),
      violations: addV({ inv: "Inv_NoSettleWithoutBound", action: "ExecuteSettlement", reason: "obState = cancelled — terminal state, no settlement path exists", blocked: true }),
    };
    case "v_eligible_no_quorum": return {
      ...state,
      history: addH(ev(`⛔ ATTEMPT: Evaluate eligibility with ${state.approvalCount}/2 approvals (quorum requires 2)`, C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "EvaluateEligibility", reason: `HasQuorum = false (${state.approvalCount} < ApprovalQuorum of 2)`, blocked: true }),
    };
    case "v_eligible_no_release": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Evaluate eligibility without release conditions satisfied", C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "EvaluateEligibility", reason: "ReleaseSatisfied = false — milestone evidence not uploaded", blocked: true }),
    };
    case "v_replay_nonce": {
      const reusedNonce = state.nonceSet[0] || "N-abc123";
      return {
        ...state,
        history: addH(ev(`⛔ ATTEMPT: Submit approval reusing nonce ${reusedNonce} (already consumed)`, C.red, "violation")),
        violations: addV({ inv: "Inv_NonceSingleUse", action: "ApproveObligation", reason: `Nonce ${reusedNonce} ∈ usedNonces — replay attack blocked`, blocked: true }),
      };
    }
    case "v_approve_terminated": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Approval from terminated actor (Robert Liu, terminated 2024-11-15)", C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "ApproveObligation", reason: "IsActiveActor(Robert Liu) = false — actorStatus = terminated", blocked: true }),
    };
    case "v_bind_draft_intent": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Bind obligation from draft (not submitted/accepted) intent", C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "BindObligation", reason: "intentState = draft — must be accepted before binding", blocked: true }),
    };
    case "v_bind_no_authority": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Bind obligation after authority grant GR-0092 was revoked", C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "BindObligation", reason: "HasAuthority = false — grant GR-0092 revoked at 14:32:01, no active grant covers scope", blocked: true }),
    };
    case "v_bind_no_policy": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Bind obligation against unpublished policy draft v3.3-beta", C.red, "violation")),
      violations: addV({ inv: "Inv_EligibleRequiresGate", action: "BindObligation", reason: "PolicyEval failed — policy v3.3-beta status = draft, only published policies are evaluable", blocked: true }),
    };
    case "v_change_dest": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Change payee destination on bound obligation without re-approval", C.red, "violation")),
      violations: addV({ inv: "Inv_ReceiptMatchesOrException", action: "ModifyObligation", reason: "Destination change requires new decision_snapshot_hash + full re-approval cycle — G1 append-only", blocked: true }),
    };
    case "v_force_reconcile": return {
      ...state,
      history: addH(ev("⛔ ATTEMPT: Force reconciliation match despite amount mismatch ($912K vs $847K)", C.red, "violation")),
      violations: addV({ inv: "Inv_ReceiptMatchesOrException", action: "ReconcileOK", reason: "r.amount ($912,000) > EligibleAmount ($847,200) — must open ExceptionCase, cannot force match", blocked: true }),
    };

    // ── Authority / Actor mutations ──
    case "revoke_grant": return { ...state, grantRevoked: true, authorityActive: false, history: addH(ev("AuthorityGrant GR-0092 revoked — Board action, effective immediately", C.amber)) };
    case "suspend_actor": return { ...state, actorSuspended: true, history: addH(ev("Actor Sarah Chen suspended — pending investigation, all active grants preserved but unusable", C.amber)) };

    // ── Scenario control ──
    case "start_scenario": return { ...SIM_INITIAL, scenarioMode: action.scenario, scenarioStep: 0, scenarioPaused: false, history: [ev(`▶ Scenario started: ${action.scenario.name}`, C.cyan, "scenario")] };
    case "scenario_advance": return state; // handled externally
    case "scenario_pause": return { ...state, scenarioPaused: !state.scenarioPaused };
    case "reset": return { ...SIM_INITIAL };
    default: return state;
  }
}

// ═══════════════════════════════════════════
// SCENARIOS
// ═══════════════════════════════════════════

const SCENARIOS = [
  {
    id: "happy",
    name: "Happy Path",
    subtitle: "$847K GPU compute lease — clean lifecycle",
    color: C.green,
    icon: "✓",
    description: "Standard obligation lifecycle: intent → bind → approve → eligible → settle → reconcile. All gates pass, receipt matches, no exceptions.",
    steps: [
      { action: "create_intent", narration: "AP Manager Sarah Chen creates an intent for a GPU compute lease with Vertex Cloud Services." },
      { action: "submit", narration: "Intent submitted with vendor, amount ($847,200), project (GPU-Cluster-East), and category (CapEx/Infrastructure)." },
      { action: "accept", narration: "Intent accepted after initial screening — eligible to become a binding obligation." },
      { action: "create_ob", narration: "Obligation created in draft. Policy v3.2a is pinned (immutable — G4). AuthorityGrant GR-0092 verified to cover scope." },
      { action: "bind", narration: "Binding succeeds: PolicyEval returns true, authority grant active, Sarah Chen is active actor. Decision snapshot hash stored (G3)." },
      { action: "approve", narration: "First approval: James Park (Board) signs with passkey. Nonce consumed — single-use, cannot replay (Inv_NonceSingleUse)." },
      { action: "approve", narration: "Second approval: Maria Torres (Treasurer) signs. Quorum reached (2-of-3). Separation of duties enforced — approvers ≠ binder." },
      { action: "release", narration: "Release conditions met: vendor SLA evidence uploaded, milestone deliverable confirmed." },
      { action: "eligible", narration: "All four gates pass simultaneously: HasQuorum ✓, ReleaseSatisfied ✓, PolicyEval ✓, HasAuthority ✓. Obligation becomes eligible." },
      { action: "settle", narration: "Settlement instruction sent via ACH rail. Receipt placeholder created. Money moves." },
      { action: "receipt_ok", narration: "Bank confirmation received. Amount matches ($847,200 ≤ ceiling). Destination fingerprint matches obligation token. Clean." },
      { action: "reconcile", narration: "Reconciliation completes — receipt consistent with obligation. GL posting created. Terminal state: reconciled." },
    ],
  },
  {
    id: "mismatch",
    name: "Mismatch Exception",
    subtitle: "Bank sends wrong amount — exception, block, resolution",
    color: C.red,
    icon: "!",
    description: "Everything proceeds normally until the bank receipt arrives with a higher amount than authorized. System blocks, opens exception, requires signed resolution.",
    steps: [
      { action: "create_intent", narration: "Standard intent creation for the same GPU compute lease." },
      { action: "submit", narration: "Intent submitted — same parameters as happy path." },
      { action: "accept", narration: "Intent accepted." },
      { action: "create_ob", narration: "Obligation drafted, policy pinned, authority verified." },
      { action: "bind", narration: "Binding succeeds — all preconditions met." },
      { action: "approve", narration: "First approval: James Park signs." },
      { action: "approve", narration: "Second approval: Maria Torres signs. Quorum met." },
      { action: "release", narration: "Release conditions satisfied." },
      { action: "eligible", narration: "Obligation becomes eligible." },
      { action: "settle", narration: "Settlement instruction sent. Receipt placeholder created." },
      { action: "receipt_bad", narration: "⚠ Bank receipt arrives: $912,000 — exceeds obligation ceiling of $847,200. System immediately opens ExceptionCase EXC-0071 (amount_mismatch). This is Inv_ReceiptMatchesOrException in action." },
      { action: "mismatch_block", narration: "Obligation automatically blocked. No reconciliation possible without resolving the exception. The system fails closed — there is no 'force match' button." },
      { action: "v_force_reconcile", narration: "What if someone tries to force a reconciliation? The system rejects it. Inv_ReceiptMatchesOrException: receipt.amount > EligibleAmount requires an ExceptionCase + resolution trail." },
      { action: "resolve_exception", narration: "Maria Torres (Treasurer) provides signed explanation: bank error, corrective credit in progress. Resolution event recorded with full audit trail." },
      { action: "unblock_eligible", narration: "Exception resolved — obligation returns to eligible. All gates re-verified. Corrective receipt can now be ingested." },
    ],
  },
  {
    id: "violations",
    name: "Attack Surface",
    subtitle: "7 violation attempts — every one blocked",
    color: C.orange,
    icon: "⛔",
    description: "A systematic walkthrough of how the system prevents common fraud and error patterns. Each attempt hits a specific TLA+ invariant.",
    steps: [
      { action: "create_intent", narration: "Setup: Create a normal intent to establish context for the attacks." },
      { action: "submit", narration: "Intent submitted normally." },
      { action: "v_bind_draft_intent", narration: "ATTACK 1: Try to bind an obligation from a draft intent (before submission/acceptance). Blocked — intentState must be 'accepted'." },
      { action: "accept", narration: "Intent accepted — now let's try more attacks." },
      { action: "create_ob", narration: "Obligation created in draft state." },
      { action: "v_bind_no_policy", narration: "ATTACK 2: Try to bind against an unpublished policy draft. Blocked — PolicyEval fails because only published policies are evaluable (G4)." },
      { action: "v_bind_no_authority", narration: "ATTACK 3: Try to bind after the authority grant has been revoked. Blocked — HasAuthority = false, no active grant covers the obligation scope." },
      { action: "bind", narration: "Normal bind succeeds with valid policy and authority." },
      { action: "approve", narration: "First approval recorded normally." },
      { action: "v_replay_nonce", narration: "ATTACK 4: Replay the same approval with the same nonce. Blocked — Inv_NonceSingleUse: nonce already in usedNonces set. This prevents a single approver from counting twice." },
      { action: "v_approve_terminated", narration: "ATTACK 5: Submit approval from a terminated actor. Blocked — IsActiveActor = false. A terminated employee cannot produce valid approvals regardless of their former role." },
      { action: "v_eligible_no_quorum", narration: "ATTACK 6: Try to force eligibility with only 1/2 approvals. Blocked — Inv_EligibleRequiresGate: HasQuorum = false. Cannot skip the approval gate." },
      { action: "approve", narration: "Second approval from a valid active actor. Quorum reached." },
      { action: "release", narration: "Release conditions satisfied." },
      { action: "eligible", narration: "Obligation becomes eligible normally." },
      { action: "v_change_dest", narration: "ATTACK 7: Try to change the payee destination on a live obligation without re-approval. Blocked — destination changes require a new decision_snapshot_hash and full re-approval cycle. G1 (append-only) means the original destination is immutable." },
      { action: "settle", narration: "Settlement proceeds normally against the original, verified destination." },
      { action: "receipt_ok", narration: "Clean receipt — all 7 attacks blocked, legitimate flow completed." },
      { action: "reconcile", narration: "Reconciled. Every attack hit a specific invariant wall. The system prevented all 7 without human intervention." },
    ],
  },
  {
    id: "authority_revoke",
    name: "Mid-Flight Revocation",
    subtitle: "Authority grant revoked while obligation is in-flight",
    color: C.amber,
    icon: "↩",
    description: "An authority grant is revoked after an obligation is already bound. Explores what happens to in-flight obligations when the underlying authority changes.",
    steps: [
      { action: "create_intent", narration: "Standard intent creation." },
      { action: "submit", narration: "Intent submitted." },
      { action: "accept", narration: "Intent accepted." },
      { action: "create_ob", narration: "Obligation created — AuthorityGrant GR-0092 active at this moment, policy pinned." },
      { action: "bind", narration: "Obligation bound. The decision_snapshot_hash captures that GR-0092 was active at bind time (G3: as-known-then)." },
      { action: "approve", narration: "First approval received." },
      { action: "revoke_grant", narration: "⚠ Board revokes AuthorityGrant GR-0092, effective immediately. The grant that authorized this obligation no longer exists." },
      { action: "approve", narration: "Second approval received. Quorum met — but authority is now revoked." },
      { action: "release", narration: "Release conditions satisfied." },
      { action: "v_eligible_no_release", narration: "System re-evaluates: HasAuthority now returns false. The obligation cannot become eligible because the authority gate fails, even though quorum and release are satisfied. Inv_EligibleRequiresGate requires ALL FOUR gates." },
      { action: "block", narration: "Obligation blocked — no active authority grant covers the scope. ExceptionCase opened for review." },
      { action: "v_settle_blocked", narration: "Can we settle a blocked obligation? No. Inv_NoSettleWithoutBound: settlement requires eligible status. Blocked is not eligible." },
      { action: "cancel", narration: "Board cancels the obligation. A new authority grant and new obligation would be required to proceed." },
    ],
  },
];

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

function Pill({ children, color, bg }) {
  return <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 700, color, background: bg || color+"15", padding: "2px 8px", borderRadius: 3, letterSpacing: "0.05em", border: `1px solid ${color}25`, whiteSpace: "nowrap" }}>{children}</span>;
}

function StateMachineViz({ states, transitions, color, isObligation, activeState }) {
  const pos = {};
  if (isObligation) {
    Object.assign(pos, { draft:{x:55,y:28}, bound:{x:175,y:28}, eligible:{x:315,y:28}, settled:{x:455,y:28}, reconciled:{x:595,y:28}, blocked:{x:315,y:110}, cancelled:{x:175,y:110} });
  } else {
    const sp = 660/(states.length+1);
    states.forEach((s,i) => { pos[s] = { x: sp*(i+1), y: 35 }; });
  }
  const h = isObligation ? 150 : 70;
  return (
    <svg width="100%" viewBox={`0 0 680 ${h}`} style={{ maxHeight: h, overflow: "visible" }}>
      {transitions.map((tr,i) => {
        const a=pos[tr.f], b=pos[tr.t]; if(!a||!b) return null;
        const dx=b.x-a.x, dy=b.y-a.y, len=Math.sqrt(dx*dx+dy*dy), nx=dx/len, ny=dy/len;
        const sx=a.x+nx*40, sy=a.y+ny*13, ex=b.x-nx*40, ey=b.y-ny*13;
        const curved=(tr.f==="blocked"&&tr.t==="eligible")||(tr.f==="settled"&&tr.t==="blocked");
        const path=curved?`M${sx} ${sy} Q${(sx+ex)/2} ${Math.min(sy,ey)+(tr.f==="blocked"?-25:35)} ${ex} ${ey}`:`M${sx} ${sy} L${ex} ${ey}`;
        return (
          <g key={i}>
            <defs><marker id={`ah${i}${color.replace(/#/g,'')}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={color+"70"}/></marker></defs>
            <path d={path} fill="none" stroke={color+"35"} strokeWidth="1.5" markerEnd={`url(#ah${i}${color.replace(/#/g,'')})`}/>
            {tr.label && <text x={(sx+ex)/2} y={(sy+ey)/2-6} fill={C.dim} fontSize="7" textAnchor="middle" fontFamily={F.mono}>{tr.label}</text>}
          </g>
        );
      })}
      {states.map(s => {
        const p=pos[s]; if(!p) return null;
        const isActive = activeState===s;
        return (
          <g key={s}>
            <rect x={p.x-34} y={p.y-11} width={68} height={22} rx={4} fill={isActive?color+"25":color+"08"} stroke={isActive?color+"80":color+"25"} strokeWidth={isActive?1.5:1}/>
            {isActive && <rect x={p.x-34} y={p.y-11} width={68} height={22} rx={4} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/></rect>}
            <text x={p.x} y={p.y+3} fill={isActive?C.bright:color} fontSize={9} textAnchor="middle" fontFamily={F.mono} fontWeight={isActive?600:500}>{s}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ObjectCard({ obj, isExpanded, onToggle, activeState }) {
  const [tab, setTab] = useState("fields");
  return (
    <div style={{ background: C.surface, border: `1px solid ${isExpanded?obj.color+"30":C.border}`, borderRadius: 8, overflow: "hidden", transition: "all 0.25s", boxShadow: isExpanded?`0 0 40px ${obj.color}06`:"none" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: obj.color, flexShrink: 0, boxShadow: `0 0 8px ${obj.color}50` }}/>
        <span style={{ fontFamily: F.mono, fontSize: 13, color: C.bright, fontWeight: 600, letterSpacing: "0.02em" }}>{obj.name}</span>
        <span style={{ fontFamily: F.sans, fontSize: 11.5, color: C.muted, flex: 1 }}>{obj.purpose}</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.dim, transform: isExpanded?"rotate(90deg)":"none", transition: "transform 0.2s" }}>▶</span>
      </button>
      {isExpanded && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 18px" }}>
            {["fields","states","invariants"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 14px", background: "none", border: "none", borderBottom: tab===t?`2px solid ${obj.color}`:"2px solid transparent", color: tab===t?C.bright:C.muted, fontFamily: F.mono, fontSize: 10, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.2s" }}>{t}</button>
            ))}
          </div>
          <div style={{ padding: "14px 18px" }}>
            {tab==="fields" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 48px", gap: 8, padding: "3px 8px", marginBottom: 4 }}>
                  {["Field","Type","Req"].map(h => <span key={h} style={{ fontFamily: F.mono, fontSize: 8, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em" }}>{h}</span>)}
                </div>
                {obj.fields.map((f,i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 48px", gap: 8, padding: "5px 8px", borderRadius: 3, background: i%2===0?"rgba(255,255,255,0.008)":"transparent" }}>
                    <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.bright }}>{f.n}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 10.5, color: C.muted }}>{f.t}{f.v && <span style={{ color: C.dim, fontSize: 8 }}> [{f.v.join("|")}]</span>}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: f.r?obj.color:C.dim }}>{f.r?"●":"○"}</span>
                  </div>
                ))}
              </div>
            )}
            {tab==="states" && (
              <div>
                <StateMachineViz states={obj.states} transitions={obj.transitions} color={obj.color} isObligation={obj.id==="obligation"} activeState={activeState}/>
                <p style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, marginTop: 10, padding: "7px 12px", background: obj.color+"06", borderRadius: 4, borderLeft: `2px solid ${obj.color}25` }}>{obj.stateNote}</p>
              </div>
            )}
            {tab==="invariants" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>✓ Must be true</div>
                  {obj.must.map((m,i) => <div key={i} style={{ padding: "7px 11px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 4, marginBottom: 3, fontFamily: F.sans, fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>{m}</div>)}
                </div>
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.red, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>✗ Can never be true</div>
                  {obj.never.map((n,i) => <div key={i} style={{ padding: "7px 11px", background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 4, marginBottom: 3, fontFamily: F.sans, fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>{n}</div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FlowDiagram() {
  const nodes = [
    { id: "actor", label: "Actor", x: 60, y: 35, c: C.accent },
    { id: "policy", label: "PolicyVersion", x: 60, y: 105, c: C.purple },
    { id: "grant", label: "AuthorityGrant", x: 60, y: 175, c: C.amber },
    { id: "intent", label: "Intent", x: 280, y: 35, c: C.green },
    { id: "obligation", label: "Obligation", x: 280, y: 105, c: "#ff6b6b" },
    { id: "receipt", label: "SettlementReceipt", x: 510, y: 105, c: "#4ade80" },
    { id: "exception", label: "ExceptionCase", x: 510, y: 175, c: C.red },
  ];
  const edges = [
    { f: "actor", t: "intent", l: "originates" }, { f: "actor", t: "obligation", l: "binds/approves" },
    { f: "policy", t: "obligation", l: "governs" }, { f: "grant", t: "obligation", l: "authorizes" },
    { f: "intent", t: "obligation", l: "becomes" }, { f: "obligation", t: "receipt", l: "settles" },
    { f: "receipt", t: "exception", l: "mismatch" }, { f: "obligation", t: "exception", l: "blocked" },
  ];
  const gn = id => nodes.find(n => n.id===id);
  return (
    <svg width="100%" viewBox="0 0 660 220" style={{ maxHeight: 220 }}>
      {edges.map((e,i) => { const a=gn(e.f), b=gn(e.t); return (
        <g key={i}><line x1={a.x+62} y1={a.y+13} x2={b.x-4} y2={b.y+13} stroke={C.border} strokeWidth="1" strokeDasharray="4 3"/>
        <text x={(a.x+b.x)/2+30} y={(a.y+b.y)/2+8} fill={C.dim} fontSize="7.5" textAnchor="middle" fontFamily={F.mono}>{e.l}</text></g>
      );})}
      {nodes.map(n => (
        <g key={n.id}><rect x={n.x} y={n.y} width={115} height={26} rx={5} fill={n.c+"10"} stroke={n.c+"35"} strokeWidth="1"/>
        <text x={n.x+57} y={n.y+17} fill={n.c} fontSize="9.5" textAnchor="middle" fontFamily={F.mono} fontWeight="500">{n.label}</text></g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [expandedObj, setExpandedObj] = useState("obligation");
  const [section, setSection] = useState("simulator");
  const [sim, setSim] = useState({ ...SIM_INITIAL });
  const [tlaTab, setTlaTab] = useState("invariants");
  const [simMode, setSimMode] = useState("scenarios"); // "scenarios" | "free"
  const [animIn, setAnimIn] = useState(false);
  const logEndRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => { requestAnimationFrame(() => setAnimIn(true)); }, []);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [sim.history.length]);

  // Cleanup autoplay on unmount
  useEffect(() => () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); }, []);

  const dispatch = useCallback((action) => {
    setSim(prev => simReducer(prev, action));
  }, []);

  // Scenario step advancement
  const advanceScenario = useCallback(() => {
    setSim(prev => {
      if (!prev.scenarioMode || prev.scenarioStep >= prev.scenarioMode.steps.length) return prev;
      const step = prev.scenarioMode.steps[prev.scenarioStep];
      const nextState = simReducer(prev, { id: step.action });
      return { ...nextState, scenarioStep: prev.scenarioStep + 1 };
    });
  }, []);

  // Auto-play
  const toggleAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
      setSim(prev => ({ ...prev, scenarioPaused: true }));
    } else {
      setSim(prev => ({ ...prev, scenarioPaused: false }));
      autoPlayRef.current = setInterval(() => {
        setSim(prev => {
          if (!prev.scenarioMode || prev.scenarioStep >= prev.scenarioMode.steps.length) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
            return { ...prev, scenarioPaused: true };
          }
          const step = prev.scenarioMode.steps[prev.scenarioStep];
          const nextState = simReducer(prev, { id: step.action });
          return { ...nextState, scenarioStep: prev.scenarioStep + 1 };
        });
      }, 2200);
    }
  }, []);

  const startScenario = useCallback((scenario) => {
    if (autoPlayRef.current) { clearInterval(autoPlayRef.current); autoPlayRef.current = null; }
    dispatch({ id: "start_scenario", scenario });
  }, [dispatch]);

  // Free mode actions
  const freeActions = useMemo(() => {
    if (simMode !== "free") return [];
    const s = sim;
    const a = [];
    if (s.intentState === "—") a.push({ id: "create_intent", label: "Create Intent" });
    if (s.intentState === "draft") a.push({ id: "submit", label: "Submit Intent" });
    if (s.intentState === "submitted") { a.push({ id: "accept", label: "Accept Intent" }); a.push({ id: "reject", label: "Reject Intent" }); }
    if (s.intentState === "accepted" && s.obState === "—") a.push({ id: "create_ob", label: "Create Obligation (draft)" });
    if (s.obState === "draft" && s.intentState === "accepted") a.push({ id: "bind", label: "Bind Obligation" });
    if (s.obState === "bound" && !s.quorumMet) a.push({ id: "approve", label: "Add Approval" });
    if (s.obState === "bound" && s.quorumMet && s.releaseSatisfied) a.push({ id: "eligible", label: "Evaluate → Eligible" });
    if (s.obState === "bound" && !s.releaseSatisfied) a.push({ id: "release", label: "Satisfy Release" });
    if (s.obState === "eligible") a.push({ id: "settle", label: "Execute Settlement" });
    if (s.obState === "settled" && s.receiptMatches === null) { a.push({ id: "receipt_ok", label: "Ingest Receipt (OK)" }); a.push({ id: "receipt_bad", label: "Ingest Receipt (mismatch)" }); }
    if (s.obState === "settled" && s.receiptMatches === true) a.push({ id: "reconcile", label: "Reconcile OK" });
    if (s.obState === "settled" && s.receiptMatches === false) a.push({ id: "mismatch_block", label: "Mismatch → Block" });
    if (["bound","eligible","settled"].includes(s.obState)) a.push({ id: "block", label: "Block Obligation" });
    if (s.obState === "blocked" && s.exceptionOpen && !s.exceptionResolved) a.push({ id: "resolve_exception", label: "Resolve Exception" });
    if (s.obState === "blocked" && s.exceptionResolved) a.push({ id: "unblock_eligible", label: "Unblock → Eligible" });
    if (s.obState === "blocked") a.push({ id: "cancel", label: "Cancel" });
    // Violation attempts — always available when they'd be meaningful
    if (s.obState === "bound" && !s.quorumMet) a.push({ id: "v_eligible_no_quorum", label: "⛔ Force Eligible (no quorum)", violation: true });
    if (s.obState === "bound" && s.quorumMet && !s.releaseSatisfied) a.push({ id: "v_eligible_no_release", label: "⛔ Force Eligible (no release)", violation: true });
    if (s.obState === "bound" && s.nonceSet.length > 0) a.push({ id: "v_replay_nonce", label: "⛔ Replay Nonce", violation: true });
    if (s.obState === "bound") { a.push({ id: "v_approve_terminated", label: "⛔ Terminated Actor Approval", violation: true }); a.push({ id: "v_settle_bound", label: "⛔ Settle from Bound", violation: true }); }
    if (s.obState === "blocked") a.push({ id: "v_settle_blocked", label: "⛔ Settle from Blocked", violation: true });
    if (s.obState === "cancelled") a.push({ id: "v_settle_cancelled", label: "⛔ Settle Cancelled", violation: true });
    if (s.obState === "eligible" || s.obState === "bound") a.push({ id: "v_change_dest", label: "⛔ Change Destination", violation: true });
    if (s.obState === "settled" && s.receiptMatches === false) a.push({ id: "v_force_reconcile", label: "⛔ Force Reconcile", violation: true });
    if (s.intentState === "draft") a.push({ id: "v_bind_draft_intent", label: "⛔ Bind from Draft", violation: true });
    return a;
  }, [sim, simMode]);

  const currentScenarioStep = sim.scenarioMode ? sim.scenarioMode.steps[sim.scenarioStep - 1] : null;
  const nextScenarioStep = sim.scenarioMode ? sim.scenarioMode.steps[sim.scenarioStep] : null;
  const scenarioDone = sim.scenarioMode && sim.scenarioStep >= sim.scenarioMode.steps.length;

  const invChecks = useMemo(() => [
    { id: "EligibleRequiresGate", ok: sim.obState !== "eligible" || (sim.quorumMet && sim.releaseSatisfied && sim.policyPinned && sim.authorityActive) },
    { id: "NonceSingleUse", ok: true },
    { id: "ReceiptMatchesOrException", ok: !sim.receiptExists || sim.receiptMatches !== false || sim.exceptionOpen },
    { id: "NoSettleWithoutBound", ok: !["blocked","cancelled","draft","bound"].includes(sim.obState) || !sim.receiptExists || sim.obState === "settled" || sim.obState === "reconciled" || sim.obState === "eligible" },
  ], [sim]);

  const sections_list = [
    { id: "invariants", label: "G0–G5" }, { id: "flow", label: "Flow" }, { id: "objects", label: "Objects" },
    { id: "api", label: "API" }, { id: "tla", label: "TLA+" }, { id: "simulator", label: "Simulate" }, { id: "audit", label: "Audit" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: C.bg+"f0", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: `linear-gradient(135deg,${C.accent}20,${C.accent}05)`, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 11, fontWeight: 700, color: C.accent }}>C</div>
          <span style={{ fontFamily: F.display, fontSize: 13, fontWeight: 700, color: C.bright, letterSpacing: "0.05em" }}>CAST</span>
          <span style={{ fontFamily: F.mono, fontSize: 9, color: C.dim }}>interface spec + formal model</span>
        </div>
        <div style={{ display: "flex", gap: 1, background: C.surface, borderRadius: 5, padding: 2, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {sections_list.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "5px 11px", borderRadius: 3, border: "none", background: section===s.id?C.accent+"18":"transparent", color: section===s.id?C.accent:C.muted, fontFamily: F.mono, fontSize: 10, cursor: "pointer", transition: "all 0.15s", fontWeight: section===s.id?600:400 }}>{s.label}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1020, margin: "0 auto", padding: "20px 20px 80px", opacity: animIn?1:0, transform: animIn?"translateY(0)":"translateY(6px)", transition: "all 0.3s ease" }}>

        {/* ── INVARIANTS ── */}
        {section === "invariants" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>Global Invariants</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>Apply everywhere. Violations are system-level bugs.</p>
            <div style={{ display: "grid", gap: 6 }}>
              {GLOBAL_INVARIANTS.map(inv => (
                <div key={inv.id} style={{ display: "flex", gap: 14, padding: "14px 18px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, alignItems: "flex-start" }}>
                  <Pill color={C.accent}>{inv.id}</Pill>
                  <div><div style={{ fontFamily: F.mono, fontSize: 12.5, color: C.bright, fontWeight: 600, marginBottom: 3 }}>{inv.label}</div>
                  <div style={{ fontFamily: F.sans, fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>{inv.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FLOW ── */}
        {section === "flow" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>Object Relationship Flow</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>Intent → Obligation is the critical control boundary.</p>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: 20 }}><FlowDiagram/></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              {OBJECTS.map(o => <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 7, height: 7, borderRadius: 2, background: o.color }}/><span style={{ fontFamily: F.mono, fontSize: 9.5, color: C.muted }}>{o.name}</span></div>)}
            </div>
          </div>
        )}

        {/* ── OBJECTS ── */}
        {section === "objects" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>Core Objects</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>7 objects — required fields, state machines, invariants.</p>
            <div style={{ display: "grid", gap: 6 }}>
              {OBJECTS.map(obj => <ObjectCard key={obj.id} obj={obj} isExpanded={expandedObj===obj.id} onToggle={() => setExpandedObj(expandedObj===obj.id?null:obj.id)} activeState={sim.obState!=="—"&&obj.id==="obligation"?sim.obState:null}/>)}
            </div>
          </div>
        )}

        {/* ── API ── */}
        {section === "api" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>External Interfaces</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>10 inbound commands, 3 outbound queries.</p>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Inbound (Commands)</div>
            <div style={{ display: "grid", gap: 3, marginBottom: 24 }}>
              {API_INBOUND.map((ep,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5 }}>
                  <Pill color={C.amber}>POST</Pill>
                  <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.bright, fontWeight: 500 }}>{ep.path}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, flex: 1, textAlign: "right" }}>{ep.desc}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Outbound (Queries)</div>
            <div style={{ display: "grid", gap: 3 }}>
              {API_OUTBOUND.map((ep,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5 }}>
                  <Pill color={C.green}>GET</Pill>
                  <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.bright, fontWeight: 500 }}>{ep.path}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, flex: 1, textAlign: "right" }}>{ep.desc}</span>
                  {ep.p && <span style={{ fontFamily: F.mono, fontSize: 8.5, color: C.dim, background: "rgba(255,255,255,0.02)", padding: "1px 5px", borderRadius: 2 }}>?{ep.p}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TLA+ ── */}
        {section === "tla" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>TLA+ Formal Specification</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>SightlineObligation module — states, actions, invariants mapped to the interface spec.</p>
            <div style={{ display: "flex", gap: 2, marginBottom: 16, background: C.surface, borderRadius: 5, padding: 2, border: `1px solid ${C.border}`, width: "fit-content" }}>
              {[{id:"invariants",l:"Safety Invariants"},{id:"actions",l:"Actions"},{id:"variables",l:"State Variables"},{id:"mapping",l:"Spec ↔ Interface"}].map(t => (
                <button key={t.id} onClick={() => setTlaTab(t.id)} style={{ padding: "6px 14px", borderRadius: 3, border: "none", background: tlaTab===t.id?C.cyan+"15":"transparent", color: tlaTab===t.id?C.cyan:C.muted, fontFamily: F.mono, fontSize: 10, cursor: "pointer", fontWeight: tlaTab===t.id?600:400 }}>{t.l}</button>
              ))}
            </div>
            {tlaTab==="invariants" && <div style={{ display: "grid", gap: 8 }}>
              {TLA_INVARIANTS.map(inv => (
                <div key={inv.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><Pill color={C.cyan}>{inv.id}</Pill><span style={{ fontFamily: F.mono, fontSize: 12, color: C.bright, fontWeight: 600 }}>{inv.label}</span></div>
                    <p style={{ fontFamily: F.sans, fontSize: 11.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>{inv.desc}</p>
                  </div>
                  <div style={{ padding: "12px 18px", background: C.bg }}><pre style={{ fontFamily: F.mono, fontSize: 11, color: C.cyan, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{inv.formula}</pre></div>
                  <div style={{ padding: "8px 18px", display: "flex", gap: 6, flexWrap: "wrap" }}>{inv.guards.map(g => <span key={g} style={{ fontFamily: F.mono, fontSize: 9, color: C.muted, background: C.cyanBg, padding: "2px 7px", borderRadius: 3 }}>{g}</span>)}</div>
                </div>
              ))}
              <div style={{ padding: "14px 18px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7 }}>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: C.cyan, fontWeight: 600, marginBottom: 6 }}>Safety (bundled)</div>
                <pre style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, margin: 0 }}>Safety ≡ Inv_EligibleRequiresGate ∧ Inv_NonceSingleUse ∧ Inv_ReceiptMatchesOrException</pre>
              </div>
            </div>}
            {tlaTab==="actions" && <div style={{ display: "grid", gap: 4 }}>
              {TLA_ACTIONS.map(a => (
                <div key={a.id} style={{ padding: "12px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: a.preconditions?8:0 }}>
                    <span style={{ fontFamily: F.mono, fontSize: 12, color: a.color, fontWeight: 600, minWidth: 160 }}>{a.id}</span>
                    {a.from && <span style={{ fontFamily: F.mono, fontSize: 9.5, color: C.dim }}>{a.from} → {a.to}</span>}
                    <span style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, flex: 1, textAlign: "right" }}>{a.desc}</span>
                  </div>
                  {a.preconditions && <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{a.preconditions.map((p,i) => <span key={i} style={{ fontFamily: F.mono, fontSize: 9, color: C.green, background: C.greenBg, padding: "2px 7px", borderRadius: 3, border: `1px solid ${C.greenBorder}` }}>{p}</span>)}</div>}
                </div>
              ))}
            </div>}
            {tlaTab==="variables" && <div>{["identity","policy","authority","flow","approval","settlement","exception"].map(group => { const vars=TLA_VARIABLES.filter(v=>v.group===group); if(!vars.length) return null; return (<div key={group} style={{ marginBottom: 16 }}><div style={{ fontFamily: F.mono, fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{group}</div>{vars.map(v => (<div key={v.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, marginBottom: 3 }}><span style={{ fontFamily: F.mono, fontSize: 12, color: C.bright, fontWeight: 500, minWidth: 140 }}>{v.name}</span><span style={{ fontFamily: F.mono, fontSize: 11, color: C.muted }}>{v.type}</span></div>))}</div>);})}</div>}
            {tlaTab==="mapping" && <div><p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>How the TLA+ formal invariants map to the interface spec constraints and audit claims.</p><div style={{ display: "grid", gap: 6 }}>{[
              { tla: "Inv_EligibleRequiresGate", iface: "Obligation: eligible → all release conditions satisfied", audit: "Replay", objs: ["obligation","policy","grant"] },
              { tla: "Inv_NonceSingleUse", iface: "Actor: no replay of signed approvals", audit: "Non-repudiation", objs: ["actor"] },
              { tla: "Inv_ReceiptMatchesOrException", iface: "Receipt: dest fingerprint matches + amount ≤ eligible", audit: "Traceability", objs: ["receipt","exception"] },
              { tla: "Inv_NoSettleWithoutBound", iface: "G5: no settlement without valid bound obligation", audit: "Prevention over detection", objs: ["obligation","receipt"] },
            ].map((m,i) => (<div key={i} style={{ padding: "14px 18px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}><Pill color={C.cyan}>{m.tla}</Pill><span style={{ fontFamily: F.mono, fontSize: 9, color: C.dim }}>→</span><Pill color={C.green}>{m.audit}</Pill></div><div style={{ fontFamily: F.sans, fontSize: 11.5, color: C.text, marginBottom: 6 }}>{m.iface}</div><div style={{ display: "flex", gap: 4 }}>{m.objs.map(o => { const obj=OBJECTS.find(ob=>ob.id===o); return obj?<span key={o} style={{ fontFamily: F.mono, fontSize: 8.5, color: obj.color, background: obj.color+"10", padding: "1px 6px", borderRadius: 2 }}>{obj.name}</span>:null;})}</div></div>))}</div></div>}
          </div>
        )}

        {/* ── SIMULATOR ── */}
        {section === "simulator" && (
          <div>
            {/* Header + mode toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>State Machine Simulator</h2>
                <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted }}>Guided scenarios with narration, or free-play with violation attempts.</p>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 1, background: C.surface, borderRadius: 4, padding: 2, border: `1px solid ${C.border}` }}>
                  {[{id:"scenarios",l:"Scenarios"},{id:"free",l:"Free Play"}].map(m => (
                    <button key={m.id} onClick={() => { setSimMode(m.id); dispatch({id:"reset"}); if(autoPlayRef.current){clearInterval(autoPlayRef.current);autoPlayRef.current=null;} }} style={{ padding: "4px 12px", borderRadius: 3, border: "none", background: simMode===m.id?C.accent+"18":"transparent", color: simMode===m.id?C.accent:C.muted, fontFamily: F.mono, fontSize: 10, cursor: "pointer", fontWeight: simMode===m.id?600:400 }}>{m.l}</button>
                  ))}
                </div>
                <button onClick={() => { dispatch({id:"reset"}); if(autoPlayRef.current){clearInterval(autoPlayRef.current);autoPlayRef.current=null;} }} style={{ padding: "5px 12px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.surface, color: C.muted, fontFamily: F.mono, fontSize: 10, cursor: "pointer" }}>Reset</button>
              </div>
            </div>

            {/* Scenario selection */}
            {simMode === "scenarios" && !sim.scenarioMode && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {SCENARIOS.map(sc => (
                  <button key={sc.id} onClick={() => startScenario(sc)} style={{ padding: "18px 20px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s", borderLeft: `3px solid ${sc.color}` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = sc.color+"50"; e.currentTarget.style.background = sc.color+"06"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.borderLeftColor = sc.color; e.currentTarget.style.background = C.surface; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 16, color: sc.color }}>{sc.icon}</span>
                      <span style={{ fontFamily: F.mono, fontSize: 13, color: C.bright, fontWeight: 600 }}>{sc.name}</span>
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: 10, color: sc.color, marginBottom: 6 }}>{sc.subtitle}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{sc.description}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.dim, marginTop: 8 }}>{sc.steps.length} steps</div>
                  </button>
                ))}
              </div>
            )}

            {/* Active simulator */}
            {(sim.scenarioMode || simMode === "free") && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* LEFT COLUMN */}
                <div>
                  {/* Narration panel (scenario mode) */}
                  {sim.scenarioMode && (
                    <div style={{ background: sim.scenarioMode.color+"08", border: `1px solid ${sim.scenarioMode.color}20`, borderRadius: 7, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: F.mono, fontSize: 14, color: sim.scenarioMode.color }}>{sim.scenarioMode.icon}</span>
                          <span style={{ fontFamily: F.mono, fontSize: 12, color: C.bright, fontWeight: 600 }}>{sim.scenarioMode.name}</span>
                          <span style={{ fontFamily: F.mono, fontSize: 9, color: C.dim }}>Step {sim.scenarioStep}/{sim.scenarioMode.steps.length}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={toggleAutoPlay} style={{ padding: "4px 10px", borderRadius: 3, border: `1px solid ${C.border}`, background: autoPlayRef.current ? C.amber+"15" : C.surface, color: autoPlayRef.current ? C.amber : C.muted, fontFamily: F.mono, fontSize: 9, cursor: "pointer" }}>{autoPlayRef.current ? "⏸ Pause" : "▶ Auto"}</button>
                          <button onClick={advanceScenario} disabled={scenarioDone} style={{ padding: "4px 10px", borderRadius: 3, border: `1px solid ${scenarioDone?C.border:C.accent+"40"}`, background: scenarioDone?C.surface:C.accent+"12", color: scenarioDone?C.dim:C.accent, fontFamily: F.mono, fontSize: 9, cursor: scenarioDone?"default":"pointer" }}>Next →</button>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 3, background: C.bg, borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(sim.scenarioStep/sim.scenarioMode.steps.length)*100}%`, background: sim.scenarioMode.color, borderRadius: 2, transition: "width 0.3s ease" }}/>
                      </div>
                      {/* Current narration */}
                      {currentScenarioStep ? (
                        <div style={{ fontFamily: F.sans, fontSize: 12.5, color: C.text, lineHeight: 1.65 }}>
                          {currentScenarioStep.narration}
                        </div>
                      ) : (
                        <div style={{ fontFamily: F.sans, fontSize: 12, color: C.dim }}>Click "Next →" or "▶ Auto" to begin the walkthrough.</div>
                      )}
                      {scenarioDone && (
                        <div style={{ marginTop: 10, padding: "8px 12px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 4, fontFamily: F.mono, fontSize: 11, color: C.green }}>
                          ✓ Scenario complete — {sim.violations.length > 0 ? `${sim.violations.length} violation(s) blocked` : "all steps succeeded"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* State dashboard */}
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Current State</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {[
                        { l: "Intent", v: sim.intentState, c: C.green },
                        { l: "Obligation", v: sim.obState, c: "#ff6b6b" },
                        { l: "Approvals", v: `${sim.approvalCount}/2${sim.quorumMet?" ✓":""}`, c: C.accent },
                        { l: "Release", v: sim.releaseSatisfied?"satisfied":"pending", c: C.amber },
                        { l: "Policy", v: sim.policyPinned?"pinned":"—", c: C.purple },
                        { l: "Authority", v: sim.grantRevoked?"REVOKED":(sim.authorityActive?"active":"—"), c: sim.grantRevoked?C.red:C.amber },
                        { l: "Receipt", v: sim.receiptMatches===null?(sim.receiptExists?"pending":"—"):(sim.receiptMatches?"matched":"MISMATCH"), c: sim.receiptMatches===false?C.red:"#4ade80" },
                        { l: "Exception", v: sim.exceptionOpen?(sim.exceptionResolved?"RESOLVED":"OPEN"):"none", c: sim.exceptionOpen?(sim.exceptionResolved?C.amber:C.red):C.dim },
                      ].map(s => (
                        <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                          <span style={{ fontFamily: F.mono, fontSize: 9.5, color: C.muted }}>{s.l}</span>
                          <span style={{ fontFamily: F.mono, fontSize: 9.5, fontWeight: 600, color: s.v==="—"?C.dim:s.c }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* State machine viz */}
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: 12, marginBottom: 12 }}>
                    <StateMachineViz states={["draft","bound","eligible","blocked","cancelled","settled","reconciled"]} transitions={OBJECTS[4].transitions} color="#ff6b6b" isObligation={true} activeState={sim.obState!=="—"?sim.obState:null}/>
                  </div>

                  {/* Free play actions */}
                  {simMode === "free" && (
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: 14 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Actions</div>
                      {freeActions.length === 0 ? (
                        <div style={{ fontFamily: F.sans, fontSize: 11.5, color: C.dim, padding: "8px 0" }}>
                          {sim.obState==="reconciled"?"✓ Reconciled — terminal.":sim.obState==="cancelled"?"Cancelled — terminal.":"No actions."}
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 3 }}>
                          {freeActions.filter(a => !a.violation).map(a => (
                            <button key={a.id} onClick={() => dispatch(a)} style={{ padding: "8px 12px", borderRadius: 4, border: `1px solid ${C.borderHi}`, background: C.surfaceAlt, color: C.bright, fontFamily: F.mono, fontSize: 10.5, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor=C.accent+"50"; e.currentTarget.style.background=C.accent+"08"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor=C.borderHi; e.currentTarget.style.background=C.surfaceAlt; }}
                            ><span style={{ color: C.accent, fontSize: 9 }}>▸</span>{a.label}</button>
                          ))}
                          {freeActions.some(a => a.violation) && (
                            <>
                              <div style={{ fontFamily: F.mono, fontSize: 8, color: C.red, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6, marginBottom: 2 }}>Violation Attempts</div>
                              {freeActions.filter(a => a.violation).map(a => (
                                <button key={a.id} onClick={() => dispatch(a)} style={{ padding: "8px 12px", borderRadius: 4, border: `1px solid ${C.redBorder}`, background: C.redBg, color: C.red, fontFamily: F.mono, fontSize: 10.5, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
                                  onMouseEnter={e => { e.currentTarget.style.background=C.red+"15"; }}
                                  onMouseLeave={e => { e.currentTarget.style.background=C.redBg; }}
                                >{a.label}</button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Violations ledger */}
                  {sim.violations.length > 0 && (
                    <div style={{ background: C.surface, border: `1px solid ${C.redBorder}`, borderRadius: 7, padding: 14, marginTop: 12 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 9, color: C.red, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>⛔ Blocked Violations ({sim.violations.length})</div>
                      {sim.violations.map((v, i) => (
                        <div key={i} style={{ padding: "8px 12px", background: C.redBg, borderRadius: 4, marginBottom: 4, borderLeft: `2px solid ${C.red}40` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <Pill color={C.red}>{v.inv}</Pill>
                            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted }}>{v.action}</span>
                          </div>
                          <div style={{ fontFamily: F.sans, fontSize: 11, color: C.text, lineHeight: 1.5 }}>{v.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Event Log */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 300, maxHeight: 580 }}>
                    <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontFamily: F.mono, fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", display: "flex", justifyContent: "space-between" }}>
                      <span>Event Log (append-only — G1)</span>
                      <span>{sim.history.length} events</span>
                    </div>
                    <div style={{ flex: 1, overflow: "auto", padding: "6px 0" }}>
                      {sim.history.length === 0 ? (
                        <div style={{ padding: "20px 16px", fontFamily: F.sans, fontSize: 11, color: C.dim }}>
                          {simMode === "scenarios" ? "Click Next → to begin." : "Start by creating an intent."}
                        </div>
                      ) : (
                        sim.history.map((e, i) => (
                          <div key={i} style={{ padding: "5px 14px", display: "flex", gap: 8, alignItems: "flex-start", borderBottom: `1px solid ${C.bg}`, background: e.type==="violation"?C.redBg:e.type==="scenario"?C.cyanBg:"transparent" }}>
                            <span style={{ fontFamily: F.mono, fontSize: 8, color: C.dim, flexShrink: 0, marginTop: 3, minWidth: 16 }}>#{e.seq}</span>
                            <span style={{ fontFamily: F.mono, fontSize: 10, color: e.color||C.text, lineHeight: 1.5 }}>{e.msg}</span>
                          </div>
                        ))
                      )}
                      <div ref={logEndRef}/>
                    </div>
                  </div>

                  {/* Invariant status */}
                  {(sim.obState !== "—" || sim.violations.length > 0) && (
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: 12 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Live Invariant Status</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {invChecks.map(inv => (
                          <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", background: inv.ok?C.greenBg:C.redBg, border: `1px solid ${inv.ok?C.greenBorder:C.redBorder}`, borderRadius: 4 }}>
                            <span style={{ fontFamily: F.mono, fontSize: 9, color: inv.ok?C.green:C.red }}>{inv.ok?"✓":"✗"}</span>
                            <span style={{ fontFamily: F.mono, fontSize: 8.5, color: inv.ok?C.green:C.red }}>{inv.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AUDIT ── */}
        {section === "audit" && (
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: 17, color: C.bright, fontWeight: 700, marginBottom: 3 }}>Audit Claims</h2>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.muted, marginBottom: 20 }}>Legitimately claimable only if all invariants are enforced. Each maps to a TLA+ safety invariant.</p>
            <div style={{ display: "grid", gap: 6 }}>
              {AUDIT_CLAIMS.map((cl,i) => (
                <div key={i} style={{ padding: "18px 22px", background: C.surface, border: `1px solid ${C.greenBorder}`, borderRadius: 7, borderLeft: `3px solid ${C.green}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.green, fontWeight: 600 }}>{cl.label}</span>
                    <Pill color={C.cyan}>{cl.inv}</Pill>
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>{cl.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
