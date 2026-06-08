import { useState, useEffect, useRef } from "react";

const DARK = "#0D0F14";
const PANEL = "#13161E";
const BORDER = "#1E2330";
const ACCENT = "#00C9A7";
const ACCENT2 = "#0E7C7B";
const RED = "#E05252";
const AMBER = "#F0A500";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const DIM = "#4A5368";
const TEXT = "#C8CDD8";
const WHITE = "#F0F4FF";
const mono = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
const sans = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

// ── Demo events (AP workflow) ────────────────────────────────────────────────
const EVENTS = [
  { id:"EVT-001", seq:1, type:"ProposedEvent", status:"pass", ts:"2026-04-15T09:14:02Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ event_type:"invoice_approval", payer_entity:"Acme Corp Ltd", vendor_entity:"BrightPath Services Inc", invoice_ref:"INV-1048", po_ref:"PO-882", amount:47200, currency:"USD", payment_date:"2026-04-28", destination_ref:"ACCT-****9921" },
    proof_hash:"a3f9e2d1c8b7", narrative:"Agent receives INV-1048 from BrightPath Services. Checks vendor history, PO match, amount within range. All triggers clear — no anomaly detected." },
  { id:"EVT-002", seq:2, type:"InvariantCore Check", status:"pass", ts:"2026-04-15T09:14:03Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ rules_checked:["R1: agent_id non-null","R2: amount < $50K threshold","R3: known vendor payee","R5: policy_version pinned"], rules_passed:4, rules_failed:0, decision:"PASS — Trade Message authorised" },
    proof_hash:"b7c4f1a9e3d2", narrative:"Policy engine runs all six InvariantCore rules. Invoice is $47,200 — below $50K dual-attestation threshold. Vendor is known payee. All rules pass." },
  { id:"EVT-003", seq:3, type:"Trade Message Sent", status:"pass", ts:"2026-04-15T09:14:05Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ delivered_to:"billing@brightpath.io", channel:"email + mobile-web", message:"Acme Corp intends to pay INV-1048. $47,200 on Apr 28 to account ending 9921.", options:["Confirm","Request change","Dispute"] },
    proof_hash:"c2e8d4b1f7a3", narrative:"Trade Message delivered to vendor. Three-button interface — Confirm, Request Change, Dispute. Vendor has 48 hours to respond." },
  { id:"EVT-004", seq:4, type:"AcknowledgeEvent", status:"pass", ts:"2026-04-15T11:42:17Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ vendor_response:"Confirm", vendor_signer:"J. Torres, Controller, BrightPath Services", signed_at:"2026-04-15T11:42:17Z", bilateral:true, note:"Bilateral event — both parties have signed" },
    proof_hash:"d9a1c6e4b2f8", narrative:"Vendor confirms in 2.5 hours. J. Torres (Controller) signs digitally. This is the bilateral event — both parties have now signed. ProofChain advances." },
  { id:"EVT-005", seq:5, type:"AttestView Generated", status:"pass", ts:"2026-04-15T11:42:18Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ views:{ "AP Team":"Full payload — all fields, ProofChain, vendor signature, agent identity", Auditor:"event_type, amount, date, agent_id, policy_version, root_hash", Vendor:"invoice_ref, amount, date, destination_ref, confirmation status" } },
    proof_hash:"e4f2b8d7c1a6", narrative:"Three scoped views generated simultaneously. Auditor view is restricted — no internal account details. Enforcement is at data model, not UI." },
  { id:"EVT-006", seq:6, type:"LedgerPosting", status:"pass", ts:"2026-04-15T11:42:19Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ debit:"AP Liability 47,200 USD", credit:"Cash 47,200 USD", gl_ref:"GL-2026-04-15-0041", proof_chain_id:"PC-INV1048-001", proof_chain_fk:"non-nullable — posting rejected without this" },
    proof_hash:"f8c3a5e1d9b4", narrative:"Ledger posting created. proof_chain_id is non-nullable — posting is structurally impossible without a complete ProofChain. This is the architectural invariant." },
  { id:"EVT-007", seq:7, type:"ProposedEvent", status:"violation", ts:"2026-04-15T14:03:44Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ event_type:"wire_payment", payer_entity:"Acme Corp Ltd", vendor_entity:"NewVendor Solutions LLC", invoice_ref:"INV-1052", po_ref:null, amount:85000, currency:"USD", payment_date:"2026-04-15", destination_ref:"ACCT-****4477" },
    proof_hash:"g1d7f4c2e9a5", narrative:"Agent receives rush wire request — $85,000 to a new vendor, same-day, no PO reference. Three InvariantCore rules triggered simultaneously." },
  { id:"EVT-008", seq:8, type:"DisputeEvent", status:"violation", ts:"2026-04-15T14:03:44Z", agent_id:"cast-ap-agent-v2.1", agent_type:"claude-opus", policy_version:"INV-CORE-v14", principal_id:"finance-ops@acmecorp.com", delegated_by:null,
    payload:{ rules_failed:["R2: amount $85,000 exceeds $50K — dual attestation required","R3: NewVendor Solutions LLC has no prior payment history","R4: missing PO reference above $10K threshold"], decision:"BLOCKED — payment not executed", escalation:"Human review required" },
    proof_hash:"h5a2e8f1d4c7", narrative:"Three rules fail simultaneously. Agent does not execute. DisputeEvent is a first-class object — permanent, cannot be deleted, has its own ProofChain link." },
  { id:"EVT-009", seq:9, type:"Human Resolution", status:"resolved", ts:"2026-04-15T15:21:09Z", agent_id:"human", agent_type:"human", policy_version:"INV-CORE-v14", principal_id:"sarah.chen@acmecorp.com", delegated_by:"finance-ops@acmecorp.com",
    payload:{ reviewer:"Sarah Chen, VP Finance", decision:"APPROVED with conditions", conditions:["New vendor approved and added to directory","PO-891 created retroactively","Dual attestation: Sarah Chen + CFO sign-off"], amended_payment_date:"2026-04-17" },
    proof_hash:"i9b6d3f7c1e4", narrative:"Human reviews DisputeEvent. VP Finance approves with conditions. Resolution is itself a signed event in the ProofChain — complete trail permanently linked." },
];

const PROOF_CHAIN = [
  { seq:1, type:"ProposedEvent", hash:"a3f9e2d1c8b7", prior:null, event_id:"EVT-001" },
  { seq:2, type:"InvariantCore", hash:"b7c4f1a9e3d2", prior:"a3f9e2d1c8b7", event_id:"EVT-002" },
  { seq:3, type:"TradeMessage", hash:"c2e8d4b1f7a3", prior:"b7c4f1a9e3d2", event_id:"EVT-003" },
  { seq:4, type:"AcknowledgeEvent", hash:"d9a1c6e4b2f8", prior:"c2e8d4b1f7a3", event_id:"EVT-004" },
  { seq:5, type:"AttestView", hash:"e4f2b8d7c1a6", prior:"d9a1c6e4b2f8", event_id:"EVT-005" },
  { seq:6, type:"LedgerPosting", hash:"f8c3a5e1d9b4", prior:"e4f2b8d7c1a6", event_id:"EVT-006" },
];

// ── Architecture data ────────────────────────────────────────────────────────
const ARCH_EVENTS = [
  { id:"EVT-AP-001", type:"INVOICE_RECEIVED", source:"email-parser", data:"INV-1048 • BrightPath • $47,200", ts:"09:14:02", hash:"a3f9...c8b7", status:"pass" },
  { id:"EVT-AP-002", type:"POLICY_EVALUATED", source:"invariant-core", data:"INV-CORE-v14 • 4 rules • PASS", ts:"09:14:03", hash:"b7c4...e3d2", status:"pass" },
  { id:"EVT-AP-003", type:"TRADE_MSG_SENT", source:"vendor-portal", data:"BrightPath • 3-button confirm", ts:"09:14:05", hash:"c2e8...f7a3", status:"pass" },
  { id:"EVT-AP-004", type:"VENDOR_CONFIRMED", source:"vendor-portal", data:"J. Torres • bilateral signed", ts:"11:42:17", hash:"d9a1...b2f8", status:"pass" },
  { id:"EVT-AP-005", type:"LEDGER_POSTED", source:"gl-engine", data:"AP Liability Dr $47,200 / Cash Cr", ts:"11:42:19", hash:"f8c3...d9b4", status:"pass" },
  { id:"EVT-AP-006", type:"INVOICE_RECEIVED", source:"email-parser", data:"INV-1052 • NewVendor • $85,000", ts:"14:03:44", hash:"g1d7...e9a5", status:"violation" },
  { id:"EVT-AP-007", type:"POLICY_VIOLATION", source:"invariant-core", data:"3 rules failed • BLOCKED", ts:"14:03:44", hash:"h5a2...d4c7", status:"violation" },
  { id:"EVT-AP-008", type:"HUMAN_RESOLVED", source:"finance-portal", data:"Sarah Chen • approved w/ conditions", ts:"15:21:09", hash:"i9b6...c1e4", status:"resolved" },
];

const ARCH_POLICIES = [
  { id:"INV-CORE-v14", name:"InvariantCore — AP Governance", status:"Active", version:"v14",
    condition:"event_type IN ('invoice_approval','wire_payment')", from_exception:false,
    rules:["R1: agent_id non-nullable on every event","R2: amount > $50K requires dual attestation","R3: new vendor requires prior AcknowledgeEvent","R4: bank change requires fresh Trade Message","R5: policy_version immutable at ProposedEvent","R6: ProofChain FK non-nullable at DB layer"],
    capability:"policy-engine", sla:"<1 sec", evals:"2,847 • 99.7%" },
  { id:"AP-THRESH-v4", name:"Payment Approval Thresholds", status:"Active", version:"v4",
    condition:"event_type = 'wire_payment'", from_exception:false,
    rules:["< $10K: agent auto-approve","$10K–$50K: agent + single human","$50K–$250K: dual human attestation","> $250K: CFO + board approval"],
    capability:"approval-engine", sla:"30 min", evals:"412 • 100%" },
  { id:"VENDOR-KYC-v2", name:"Vendor Onboarding Policy", status:"Active", version:"v2",
    condition:"vendor_entity NOT IN known_payees", from_exception:true,
    rules:["Trigger: first payment to any vendor","Require: KYC document upload","Require: AcknowledgeEvent before first payment","Block: same-day payment to new vendor"],
    capability:"kyc-engine", sla:"24 hrs", evals:"89 • 98.9%" },
  { id:"AUDIT-EXPORT-v1", name:"Auditor Scoped View Policy", status:"Active", version:"v1",
    condition:"audience = 'auditor'", from_exception:false,
    rules:["Expose: event_type, amount, date, agent_id","Expose: policy_version, proof_hash, chain_root","Redact: full account numbers","Redact: vendor contact emails, internal notes"],
    capability:"attest-engine", sla:"on-demand", evals:"34 • 100%" },
];

const ARCH_WORKORDERS = [
  { id:"WO-4821", policy:"INV-CORE-v14", task:"Evaluate invoice INV-1048", assigned:"cast-ap-agent-v2.1", type:"AI", status:"Completed", sla:"1 min", result:"PASS" },
  { id:"WO-4822", policy:"AP-THRESH-v4", task:"Send Trade Message to BrightPath", assigned:"cast-ap-agent-v2.1", type:"AI", status:"Completed", sla:"30 sec", result:"Delivered" },
  { id:"WO-4823", policy:"AP-THRESH-v4", task:"Await vendor confirmation", assigned:"cast-ap-agent-v2.1", type:"AI", status:"Completed", sla:"48 hrs", result:"Confirmed" },
  { id:"WO-4824", policy:"INV-CORE-v14", task:"Post ledger entry GL-2026-04-15-0041", assigned:"cast-ap-agent-v2.1", type:"AI", status:"Completed", sla:"1 min", result:"Posted" },
  { id:"WO-4825", policy:"INV-CORE-v14", task:"Evaluate wire INV-1052 — 3 violations", assigned:"cast-ap-agent-v2.1", type:"AI", status:"Exception", sla:"1 min", result:"BLOCKED" },
  { id:"WO-4826", policy:"VENDOR-KYC-v2", task:"Human review: NewVendor $85K wire", assigned:"sarah.chen@acmecorp.com", type:"Human", status:"Completed", sla:"4 hrs", result:"Approved" },
  { id:"WO-4827", policy:"AP-THRESH-v4", task:"Dual attestation: CFO sign-off", assigned:"cfo@acmecorp.com", type:"Human", status:"Completed", sla:"2 hrs", result:"Signed" },
  { id:"WO-4828", policy:"INV-CORE-v14", task:"Evaluate invoice INV-1051 (pending)", assigned:"cast-ap-agent-v2.1", type:"AI", status:"In Progress", sla:"1 min", result:"—" },
];

const ARCH_LEDGER = [
  { ref:"GL-2026-04-15-0041", desc:"AP Payment — BrightPath INV-1048", debit:"AP Liability", credit:"Cash", amount:47200, policy:"AP-THRESH-v4", executor:"cast-ap-agent-v2.1", proof:"PC-INV1048-001", ts:"11:42:19" },
  { ref:"GL-2026-04-15-0042", desc:"AP Payment — Acme Supplies INV-1044", debit:"AP Liability", credit:"Cash", amount:12800, policy:"AP-THRESH-v4", executor:"cast-ap-agent-v2.1", proof:"PC-INV1044-001", ts:"10:22:05" },
  { ref:"GL-2026-04-15-0040", desc:"Late fee assessed — Vendor 17", debit:"AR Receivable", credit:"Fee Income", amount:150, policy:"VENDOR-KYC-v2", executor:"cast-ap-agent-v2.1", proof:"PC-FEE-0040", ts:"09:01:44" },
  { ref:"GL-2026-04-14-0039", desc:"Approved wire — NewVendor INV-1052", debit:"AP Liability", credit:"Cash", amount:85000, policy:"INV-CORE-v14", executor:"sarah.chen + cfo", proof:"PC-INV1052-001", ts:"Apr 17 09:00" },
];

const ARCH_EXCEPTIONS = [
  { id:"EXC-019", type:"POLICY_VIOLATION", desc:"Wire $85K to new vendor — 3 rules failed", severity:"HIGH", status:"Resolved", sla:"4h", resolution:"Human approved w/ conditions. New policy VENDOR-KYC-v2 created.", policy_created:true },
  { id:"EXC-018", type:"NO_POLICY", desc:"Recurring SaaS payment — no matching policy", severity:"MED", status:"Open", sla:"23h remaining", resolution:null, policy_created:false },
  { id:"EXC-017", type:"SLA_BREACH", desc:"Vendor confirmation overdue 72hrs — INV-1047", severity:"LOW", status:"Resolved", sla:"Resolved", resolution:"Vendor contacted. Confirmed via phone. Manual AcknowledgeEvent created.", policy_created:false },
  { id:"EXC-016", type:"DUPLICATE", desc:"Possible duplicate — INV-1039 matches INV-1031", severity:"MED", status:"Resolved", sla:"Resolved", resolution:"Agent verified: different billing period. Approved.", policy_created:false },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function Tag({ label, color=ACCENT, bg }) {
  return <span style={{ fontFamily:mono, fontSize:10, fontWeight:600, color, background:bg||color+"18", border:`1px solid ${color}40`, borderRadius:3, padding:"1px 6px", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{label}</span>;
}
function StatusDot({ status }) {
  const c = status==="pass"?ACCENT:status==="violation"?RED:status==="resolved"?AMBER:DIM;
  return <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:c, flexShrink:0, boxShadow:`0 0 6px ${c}80` }} />;
}
function HashChip({ hash }) {
  return <span style={{ fontFamily:mono, fontSize:10, color:ACCENT2, background:ACCENT2+"12", padding:"1px 5px", borderRadius:2 }}>{hash}</span>;
}
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:18, fontWeight:700, color:WHITE, letterSpacing:"-0.01em" }}>{title}</div>
      {subtitle && <div style={{ fontSize:12, color:DIM, marginTop:2 }}>{subtitle}</div>}
    </div>
  );
}
function Card({ children, style={} }) {
  return <div style={{ background:PANEL, border:`1px solid ${BORDER}`, borderRadius:8, overflow:"hidden", ...style }}>{children}</div>;
}
function TableHead({ cols }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:cols, padding:"8px 16px", background:DARK, borderBottom:`1px solid ${BORDER}` }}>
      {cols.split(" ").map((_,i,arr) => <div key={i} style={{ fontFamily:mono, fontSize:10, color:DIM, letterSpacing:"0.06em" }}>{["ID","TYPE","SOURCE","DATA","TIME","HASH","STATUS","POLICY","TASK","ASSIGNED","EXECUTOR","SLA","RESULT","REF","DESC","DEBIT","CREDIT","AMOUNT","PROOF","SEVERITY","RESOLUTION"][i]||""}</div>)}
    </div>
  );
}
function statusColor(s) { return s==="pass"||s==="Completed"||s==="Active"?ACCENT:s==="violation"||s==="Exception"||s==="HIGH"?RED:s==="resolved"||s==="Resolved"?AMBER:s==="In Progress"?BLUE:DIM; }

// ── Architecture tab content ─────────────────────────────────────────────────
function ArchEvents() {
  return (
    <div>
      <SectionHeader title="Event Log" subtitle="Immutable, append-only record of all system triggers. Every action begins here." />
      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"110px 160px 140px 1fr 80px 100px 80px", padding:"8px 16px", background:DARK, borderBottom:`1px solid ${BORDER}` }}>
          {["EVENT ID","TYPE","SOURCE","DATA","TIME","HASH","STATUS"].map(h=><div key={h} style={{ fontFamily:mono, fontSize:10, color:DIM, letterSpacing:"0.06em" }}>{h}</div>)}
        </div>
        {ARCH_EVENTS.map((ev,i)=>(
          <div key={ev.id} style={{ display:"grid", gridTemplateColumns:"110px 160px 140px 1fr 80px 100px 80px", padding:"10px 16px", borderBottom:i<ARCH_EVENTS.length-1?`1px solid ${BORDER}40`:"none", background:ev.status==="violation"?RED+"06":ev.status==="resolved"?AMBER+"06":"transparent", alignItems:"center" }}>
            <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{ev.id}</div>
            <div><Tag label={ev.type} color={ev.status==="violation"?RED:ev.status==="resolved"?AMBER:ACCENT} /></div>
            <div style={{ fontSize:11, color:DIM }}>{ev.source}</div>
            <div style={{ fontSize:12, color:TEXT }}>{ev.data}</div>
            <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{ev.ts}</div>
            <HashChip hash={ev.hash} />
            <StatusDot status={ev.status} />
          </div>
        ))}
        <div style={{ padding:"8px 16px", background:DARK+"80", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:mono, fontSize:10, color:DIM }}>8 of 2,847 events today</span>
          <span style={{ fontFamily:mono, fontSize:10, color:ACCENT }}>append-only · cryptographically linked</span>
        </div>
      </Card>
    </div>
  );
}

function ArchPolicies() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <SectionHeader title="Policies" subtitle="Encoded business rules that evaluate events and determine required actions. Versioned, auditable, traceable." />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {ARCH_POLICIES.map((p,i)=>(
          <Card key={p.id}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start", cursor:"pointer" }} onClick={()=>setOpen(open===i?-1:i)}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:13, color:WHITE, fontFamily:mono }}>{p.id}</span>
                  <Tag label={p.status} color={ACCENT} />
                  {p.from_exception && <Tag label="From Exception" color={PURPLE} />}
                </div>
                <div style={{ fontSize:12, color:DIM }}>{p.name}</div>
              </div>
              <span style={{ fontFamily:mono, fontSize:10, color:DIM }}>{p.version}</span>
            </div>
            <div style={{ padding:"14px 16px" }}>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:4, letterSpacing:"0.06em" }}>CONDITION</div>
                <div style={{ fontFamily:mono, fontSize:10, color:ACCENT2, background:DARK, padding:"6px 10px", borderRadius:4 }}>{p.condition}</div>
              </div>
              {open===i && (
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:6, letterSpacing:"0.06em" }}>RULES</div>
                  {p.rules.map((r,j)=><div key={j} style={{ fontSize:11, color:TEXT, padding:"3px 0", borderBottom:`1px solid ${BORDER}40`, display:"flex", gap:8 }}>
                    <span style={{ color:ACCENT, fontFamily:mono }}>✓</span>{r}
                  </div>)}
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[["Capability",p.capability],["SLA",p.sla],["7d Evals",p.evals]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:2 }}>{k}</div>
                    <div style={{ fontSize:11, color:TEXT }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ArchWorkOrders() {
  const counts = { Completed:ARCH_WORKORDERS.filter(w=>w.status==="Completed").length, "In Progress":ARCH_WORKORDERS.filter(w=>w.status==="In Progress").length, Exception:ARCH_WORKORDERS.filter(w=>w.status==="Exception").length };
  return (
    <div>
      <SectionHeader title="Work Orders" subtitle="The contract between what Policy requires and what Capacity executes. Routes to AI, human, or API based on capability." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[["Completed",counts.Completed,ACCENT],["In Progress",counts["In Progress"],BLUE],["Exception",counts.Exception,RED],["AI vs Human","6 AI / 2 Human",PURPLE]].map(([l,v,c])=>(
          <Card key={l} style={{ padding:16 }}>
            <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:6 }}>{l.toUpperCase()}</div>
            <div style={{ fontSize:22, fontWeight:700, color:c }}>{v}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"80px 140px 1fr 160px 60px 80px 70px 80px", padding:"8px 16px", background:DARK, borderBottom:`1px solid ${BORDER}` }}>
          {["WO ID","POLICY","TASK","ASSIGNED","TYPE","STATUS","SLA","RESULT"].map(h=><div key={h} style={{ fontFamily:mono, fontSize:10, color:DIM }}>{h}</div>)}
        </div>
        {ARCH_WORKORDERS.map((wo,i)=>(
          <div key={wo.id} style={{ display:"grid", gridTemplateColumns:"80px 140px 1fr 160px 60px 80px 70px 80px", padding:"9px 16px", borderBottom:i<ARCH_WORKORDERS.length-1?`1px solid ${BORDER}40`:"none", alignItems:"center", background:wo.status==="Exception"?RED+"06":wo.status==="In Progress"?BLUE+"06":"transparent" }}>
            <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{wo.id}</div>
            <div style={{ fontFamily:mono, fontSize:10, color:ACCENT2 }}>{wo.policy}</div>
            <div style={{ fontSize:11, color:TEXT }}>{wo.task}</div>
            <div style={{ fontSize:11, color:DIM }}>{wo.assigned}</div>
            <Tag label={wo.type} color={wo.type==="AI"?ACCENT:AMBER} />
            <Tag label={wo.status} color={statusColor(wo.status)} />
            <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{wo.sla}</div>
            <div style={{ fontSize:11, color:statusColor(wo.result)||TEXT }}>{wo.result}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ArchLedger() {
  return (
    <div>
      <SectionHeader title="Ledger" subtitle="Double-entry accounting with complete lineage to origin events. Every number traces back through work order, policy, and event." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[["Cash","$2,847,231",ACCENT],["AP Liability","($145,000)",RED],["Receivables","$284,500",BLUE],["Posted Today","$145,150",AMBER]].map(([l,v,c])=>(
          <Card key={l} style={{ padding:16 }}>
            <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:6 }}>{l.toUpperCase()}</div>
            <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 120px 120px 90px 130px 140px 100px", padding:"8px 16px", background:DARK, borderBottom:`1px solid ${BORDER}` }}>
          {["GL REF","DESCRIPTION","DEBIT","CREDIT","AMOUNT","POLICY","EXECUTOR","PROOF"].map(h=><div key={h} style={{ fontFamily:mono, fontSize:10, color:DIM }}>{h}</div>)}
        </div>
        {ARCH_LEDGER.map((e,i)=>(
          <div key={e.ref} style={{ display:"grid", gridTemplateColumns:"140px 1fr 120px 120px 90px 130px 140px 100px", padding:"9px 16px", borderBottom:i<ARCH_LEDGER.length-1?`1px solid ${BORDER}40`:"none", alignItems:"center" }}>
            <div style={{ fontFamily:mono, fontSize:10, color:ACCENT2 }}>{e.ref}</div>
            <div style={{ fontSize:11, color:TEXT }}>{e.desc}</div>
            <div style={{ fontSize:11, color:RED+"CC" }}>{e.debit}</div>
            <div style={{ fontSize:11, color:ACCENT+"CC" }}>{e.credit}</div>
            <div style={{ fontFamily:mono, fontSize:11, color:AMBER }}>${e.amount.toLocaleString()}</div>
            <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{e.policy}</div>
            <div style={{ fontSize:10, color:DIM }}>{e.executor}</div>
            <HashChip hash={e.proof} />
          </div>
        ))}
        <div style={{ padding:"8px 16px", background:DARK+"80" }}>
          <span style={{ fontFamily:mono, fontSize:10, color:ACCENT }}>non-nullable FK · every posting traces to a ProofChain · append-only</span>
        </div>
      </Card>
    </div>
  );
}

function ArchExceptions() {
  return (
    <div>
      <SectionHeader title="Exceptions" subtitle="Structured handling of edge cases. Exceptions are first-class objects — not errors. They create a feedback loop for policy improvement." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[["Open",1,RED],["Resolved (7d)",3,ACCENT],["Policies Created",1,PURPLE],["Avg Resolution","2.8h",AMBER]].map(([l,v,c])=>(
          <Card key={l} style={{ padding:16 }}>
            <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:6 }}>{l.toUpperCase()}</div>
            <div style={{ fontSize:22, fontWeight:700, color:c }}>{v}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {ARCH_EXCEPTIONS.map(ex=>(
          <Card key={ex.id} style={{ border:`1px solid ${ex.status==="Open"?RED+"40":BORDER}` }}>
            <div style={{ padding:"14px 16px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:mono, fontSize:11, color:DIM }}>{ex.id}</span>
                  <Tag label={ex.type} color={ex.type==="POLICY_VIOLATION"?RED:ex.type==="NO_POLICY"?AMBER:DIM} />
                  <Tag label={ex.severity} color={ex.severity==="HIGH"?RED:ex.severity==="MED"?AMBER:DIM} />
                  <Tag label={ex.status} color={ex.status==="Open"?RED:ACCENT} />
                  {ex.policy_created && <Tag label="Policy Created" color={PURPLE} />}
                </div>
                <div style={{ fontSize:13, color:WHITE, marginBottom:ex.resolution?8:0 }}>{ex.desc}</div>
                {ex.resolution && <div style={{ fontSize:11, color:DIM, lineHeight:1.5 }}>{ex.resolution}</div>}
              </div>
              <div style={{ fontFamily:mono, fontSize:10, color:DIM, marginLeft:16, whiteSpace:"nowrap" }}>{ex.sla}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop:16, padding:"12px 16px", background:PURPLE+"0A", border:`1px solid ${PURPLE}20`, borderRadius:8 }}>
        <div style={{ fontFamily:mono, fontSize:10, color:PURPLE, marginBottom:4 }}>EXCEPTION LEARNING LOOP</div>
        <div style={{ fontSize:12, color:TEXT }}>EXC-019 produced VENDOR-KYC-v2 — the policy that now governs all first-payment to new vendor flows. Exceptions that expose policy gaps automatically suggest new policy creation. Edge cases become governance.</div>
      </div>
    </div>
  );
}

function ArchOverview() {
  const layers = [
    { name:"Event Layer", color:ACCENT, icon:"⬡", desc:"Immutable, append-only log. Every action begins as an event with a cryptographic hash linking to prior event.", detail:"append-only · cryptographically linked · agent_id non-nullable" },
    { name:"Policy Layer", color:BLUE, icon:"⚖", desc:"Encoded business rules that evaluate events and determine required actions. Versioned, auditable, traceable to governance decisions.", detail:"versioned · auditable · InvariantCore enforced before execution" },
    { name:"Work Order Layer", color:PURPLE, icon:"◈", desc:"The contract between what Policy requires and what Capacity executes. Specifies capabilities, authority levels, and SLAs.", detail:"capability-matched · SLA-governed · AI or human or API" },
    { name:"Capacity Layer", color:AMBER, icon:"⬟", desc:"Mixed execution environment. Work routes based on capability match, not operator type. AI, human, and API are interchangeable.", detail:"operator-agnostic · capability-matched routing · deterministic" },
    { name:"Ledger Layer", color:RED, icon:"◇", desc:"Double-entry accounting with complete lineage to origin events. Every number traces through work order, policy, and event.", detail:"non-nullable ProofChain FK · append-only · full lineage" },
    { name:"Exception Layer", color:DIM, icon:"△", desc:"Structured handling of edge cases. Exceptions are first-class objects that create a feedback loop for policy improvement.", detail:"first-class objects · policy feedback loop · permanent record" },
  ];
  return (
    <div>
      <SectionHeader title="Architecture Overview" subtitle="Six interconnected layers. Same architecture. Any domain. Different vocabulary." />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24 }}>
        {layers.map((l,i)=>(
          <Card key={l.name} style={{ padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:6, background:l.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:l.color }}>{l.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:WHITE }}>{i+1}. {l.name}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:TEXT, lineHeight:1.6, marginBottom:8 }}>{l.desc}</div>
            <div style={{ fontFamily:mono, fontSize:9, color:l.color, letterSpacing:"0.04em" }}>{l.detail}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:20 }}>
        <div style={{ fontFamily:mono, fontSize:10, color:DIM, marginBottom:12, letterSpacing:"0.06em" }}>CORE PRINCIPLE</div>
        <div style={{ fontSize:14, color:WHITE, lineHeight:1.7, marginBottom:16 }}>
          Same inputs → Same outputs, regardless of whether an AI agent, human, or API executes the work. Every action is governed by the same policy engine. Every outcome traces to the same event chain.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[["Deterministic","Same inputs always produce same outputs"],["Complete Lineage","Every number traces to its origin event"],["Operator Agnostic","AI, human, API are interchangeable executors"]].map(([k,v])=>(
            <div key={k} style={{ padding:"10px 14px", background:DARK, borderRadius:6, border:`1px solid ${BORDER}` }}>
              <div style={{ fontSize:12, fontWeight:600, color:ACCENT, marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:11, color:DIM }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function CastDemo() {
  const [mainTab, setMainTab] = useState("demo");
  const [archTab, setArchTab] = useState("overview");
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);
  const [rightTab, setRightTab] = useState("proofchain");
  const [animStep, setAnimStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const runDemo = () => {
    if (running) { clearInterval(timerRef.current); setRunning(false); return; }
    setRunning(true); setAnimStep(0); setSelectedEvent(EVENTS[0]);
    let step = 0;
    timerRef.current = setInterval(()=>{
      step++;
      if (step >= EVENTS.length) { clearInterval(timerRef.current); setRunning(false); return; }
      setAnimStep(step); setSelectedEvent(EVENTS[step]);
    }, 1800);
  };
  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const sc = (s)=>s==="pass"?ACCENT:s==="violation"?RED:AMBER;

  const MAIN_TABS = [
    { id:"demo", label:"AP Workflow Demo" },
    { id:"arch", label:"Architecture" },
  ];
  const ARCH_TABS = [
    { id:"overview", label:"Overview" },
    { id:"events", label:"Events" },
    { id:"policies", label:"Policies" },
    { id:"workorders", label:"Work Orders" },
    { id:"ledger", label:"Ledger" },
    { id:"exceptions", label:"Exceptions" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:DARK, fontFamily:sans, color:TEXT, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px", borderBottom:`1px solid ${BORDER}`, background:PANEL }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:DARK, fontWeight:900, fontSize:13 }}>C</span>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:WHITE }}>CAST v1</div>
            <div style={{ fontSize:10, color:DIM, fontFamily:mono }}>Control Assurance & Settlement Technology</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {MAIN_TABS.map(t=>(
            <button key={t.id} onClick={()=>setMainTab(t.id)} style={{ padding:"6px 16px", borderRadius:5, border:`1px solid ${mainTab===t.id?ACCENT+"40":BORDER}`, background:mainTab===t.id?ACCENT+"15":"transparent", color:mainTab===t.id?ACCENT:DIM, fontFamily:mono, fontSize:11, cursor:"pointer", fontWeight:600 }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Tag label="INV-CORE-v14" color={ACCENT2} />
          {mainTab==="demo" && (
            <button onClick={runDemo} style={{ background:running?RED+"20":ACCENT+"20", border:`1px solid ${running?RED:ACCENT}40`, color:running?RED:ACCENT, borderRadius:5, padding:"5px 14px", fontFamily:mono, fontSize:11, fontWeight:600, cursor:"pointer" }}>
              {running?"■ STOP":"▶ RUN DEMO"}
            </button>
          )}
        </div>
      </div>

      {/* Demo tab */}
      {mainTab==="demo" && (
        <>
          <div style={{ padding:"8px 24px", background:"#0A1A18", borderBottom:`1px solid ${ACCENT}20`, display:"flex", gap:24, alignItems:"center" }}>
            <div style={{ fontSize:11, color:DIM }}><span style={{ color:ACCENT, fontWeight:600 }}>SCENARIO 1</span> · Invoice approval — INV-1048 · $47,200 · BrightPath Services</div>
            <div style={{ width:1, height:14, background:BORDER }} />
            <div style={{ fontSize:11, color:DIM }}><span style={{ color:RED, fontWeight:600 }}>SCENARIO 2</span> · Rush wire — INV-1052 · $85,000 · New vendor · InvariantCore blocks</div>
            <div style={{ marginLeft:"auto", fontSize:11, color:DIM }}>{animStep+1} / {EVENTS.length} events</div>
          </div>
          <div style={{ height:2, background:BORDER }}>
            <div style={{ height:"100%", width:`${(animStep+1)/EVENTS.length*100}%`, background:`linear-gradient(90deg,${ACCENT2},${ACCENT})`, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>
            {/* Event list */}
            <div style={{ width:260, flexShrink:0, borderRight:`1px solid ${BORDER}`, background:PANEL, overflow:"auto" }}>
              <div style={{ padding:"10px 16px 6px", fontSize:10, color:DIM, fontFamily:mono, letterSpacing:"0.08em" }}>EVENT LOG</div>
              {EVENTS.map((ev,i)=>(
                <div key={ev.id} onClick={()=>{setSelectedEvent(ev);setAnimStep(i);}} style={{ padding:"10px 16px", cursor:"pointer", borderLeft:`3px solid ${selectedEvent?.id===ev.id?sc(ev.status):"transparent"}`, background:selectedEvent?.id===ev.id?sc(ev.status)+"10":"transparent", borderBottom:`1px solid ${BORDER}`, opacity:i>animStep?0.35:1, transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <StatusDot status={ev.status} />
                    <span style={{ fontFamily:mono, fontSize:10, color:DIM }}>{ev.id}</span>
                    <span style={{ marginLeft:"auto", fontFamily:mono, fontSize:9, color:DIM }}>{ev.ts.slice(11,16)}</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:i<=animStep?WHITE:DIM }}>{ev.type}</div>
                  {ev.status!=="pass" && <div style={{ marginTop:3 }}><Tag label={ev.status.toUpperCase()} color={sc(ev.status)} /></div>}
                </div>
              ))}
            </div>
            {/* Center detail */}
            <div style={{ flex:1, overflow:"auto", padding:24, display:"flex", flexDirection:"column", gap:16 }}>
              {selectedEvent && <>
                <Card style={{ border:`1px solid ${selectedEvent.status!=="pass"?sc(selectedEvent.status)+"40":BORDER}` }}>
                  <div style={{ padding:20 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                          <StatusDot status={selectedEvent.status} />
                          <span style={{ fontFamily:mono, fontSize:11, color:DIM }}>{selectedEvent.id}</span>
                          <Tag label={selectedEvent.status==="pass"?"PASS":selectedEvent.status==="violation"?"BLOCKED":"RESOLVED"} color={sc(selectedEvent.status)} />
                        </div>
                        <div style={{ fontSize:20, fontWeight:700, color:WHITE }}>{selectedEvent.type}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>{selectedEvent.ts.replace("T"," ").replace("Z"," UTC")}</div>
                        <div style={{ fontFamily:mono, fontSize:10, color:ACCENT2, marginTop:2 }}>proof: <HashChip hash={selectedEvent.proof_hash} /></div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"10px 14px", background:ACCENT+"08", border:`1px solid ${ACCENT}20`, borderRadius:5, marginBottom:12 }}>
                      <div style={{ fontSize:10, color:DIM, fontFamily:mono, width:"100%", marginBottom:4 }}>AGENT IDENTITY — non-nullable</div>
                      <Tag label={`agent: ${selectedEvent.agent_id}`} color={ACCENT} />
                      <Tag label={`type: ${selectedEvent.agent_type}`} color={ACCENT2} />
                      <Tag label={`policy: ${selectedEvent.policy_version}`} color={AMBER} />
                      <Tag label={`principal: ${selectedEvent.principal_id}`} color={DIM} bg={BORDER} />
                    </div>
                    <div style={{ padding:"10px 14px", background:DARK, borderRadius:5, fontSize:13, color:TEXT, lineHeight:1.6, borderLeft:`3px solid ${sc(selectedEvent.status)}` }}>
                      {selectedEvent.narrative}
                    </div>
                  </div>
                </Card>
                <Card>
                  <div style={{ padding:"8px 16px", borderBottom:`1px solid ${BORDER}`, fontFamily:mono, fontSize:10, color:DIM }}>PAYLOAD</div>
                  <div style={{ padding:16 }}>
                    {Object.entries(selectedEvent.payload).map(([k,v])=>(
                      <div key={k} style={{ display:"flex", gap:16, padding:"5px 0", borderBottom:`1px solid ${BORDER}40`, alignItems:"flex-start" }}>
                        <div style={{ fontFamily:mono, fontSize:11, color:ACCENT2, minWidth:180, flexShrink:0 }}>{k}</div>
                        <div style={{ fontSize:12, color:TEXT, flex:1 }}>
                          {typeof v==="object"&&v!==null ? (Array.isArray(v) ?
                            <div>{v.map((item,i)=><div key={i} style={{ fontFamily:mono, fontSize:11, color:k==="rules_failed"?RED:k==="rules_checked"?ACCENT:TEXT, padding:"1px 0" }}>{k==="rules_failed"?"✗ ":k==="rules_checked"?"✓ ":""}{item}</div>)}</div> :
                            <div>{Object.entries(v).map(([vk,vv])=><div key={vk} style={{ fontSize:11, fontFamily:mono }}><span style={{ color:DIM }}>{vk}: </span><span style={{ color:ACCENT }}>{String(vv)}</span></div>)}</div>
                          ) : <span style={{ fontFamily:typeof v==="boolean"||(typeof v==="string"&&v.includes("PASS")||v==="BLOCKED — payment not executed")?mono:sans, color:typeof v==="number"?AMBER:v===null?DIM:v==="BLOCKED — payment not executed"?RED:v&&String(v).includes("PASS")?ACCENT:TEXT }}>{v===null?"null":String(v)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                {selectedEvent.status==="violation"&&selectedEvent.type==="DisputeEvent" && (
                  <div style={{ background:RED+"0A", border:`1px solid ${RED}40`, borderRadius:8, padding:16 }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:RED, marginBottom:8 }}>INVARIANT CORE — STRUCTURAL ENFORCEMENT</div>
                    <div style={{ fontSize:13, color:TEXT, lineHeight:1.6, marginBottom:10 }}>The agent did <strong style={{ color:WHITE }}>not</strong> execute this payment. The InvariantCore rules are checked before execution — not logged after. Three rules failed simultaneously.</div>
                    <div style={{ fontFamily:mono, fontSize:11, color:RED }}>"Other systems log what happened. CAST prevents what shouldn't."</div>
                  </div>
                )}
                {selectedEvent.status==="resolved" && (
                  <div style={{ background:AMBER+"0A", border:`1px solid ${AMBER}40`, borderRadius:8, padding:16 }}>
                    <div style={{ fontFamily:mono, fontSize:10, color:AMBER, marginBottom:8 }}>HUMAN RESOLUTION — ALSO A SIGNED EVENT</div>
                    <div style={{ fontSize:13, color:TEXT, lineHeight:1.6 }}>The resolution is not a note. It is a signed ProposedEvent with its own agent identity (human), its own policy version, and its own ProofChain link. Complete trail — block → escalation → approval — permanently linked.</div>
                  </div>
                )}
              </>}
            </div>
            {/* Right panel */}
            <div style={{ width:290, flexShrink:0, borderLeft:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", background:PANEL }}>
              <div style={{ display:"flex", borderBottom:`1px solid ${BORDER}` }}>
                {[{id:"proofchain",label:"ProofChain"},{id:"auditor",label:"Auditor View"}].map(t=>(
                  <button key={t.id} onClick={()=>setRightTab(t.id)} style={{ flex:1, padding:"9px 4px", background:"none", border:"none", cursor:"pointer", fontFamily:mono, fontSize:10, color:rightTab===t.id?ACCENT:DIM, borderBottom:`2px solid ${rightTab===t.id?ACCENT:"transparent"}` }}>
                    {t.label.toUpperCase()}
                  </button>
                ))}
              </div>
              {rightTab==="proofchain" && (
                <div style={{ flex:1, overflow:"auto", padding:16 }}>
                  <div style={{ fontSize:10, color:DIM, fontFamily:mono, marginBottom:12 }}>PC-INV1048-001 · 6 links · append-only</div>
                  {PROOF_CHAIN.map((link,i)=>(
                    <div key={link.seq}>
                      <div style={{ padding:"10px 12px", background:selectedEvent?.id===link.event_id?ACCENT+"10":DARK, border:`1px solid ${selectedEvent?.id===link.event_id?ACCENT+"40":BORDER}`, borderRadius:5, transition:"all 0.2s" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontFamily:mono, fontSize:10, color:DIM }}>seq:{link.seq}</span>
                          <span style={{ fontFamily:mono, fontSize:9, color:DIM }}>{link.event_id}</span>
                        </div>
                        <div style={{ fontFamily:mono, fontSize:11, color:WHITE, marginBottom:5 }}>{link.type}</div>
                        <div style={{ fontSize:9, fontFamily:mono, marginBottom:2 }}><span style={{ color:DIM }}>hash: </span><HashChip hash={link.hash} /></div>
                        <div style={{ fontSize:9, fontFamily:mono }}><span style={{ color:DIM }}>prior: </span>{link.prior?<HashChip hash={link.prior} />:<span style={{ color:DIM }}>null (root)</span>}</div>
                      </div>
                      {i<PROOF_CHAIN.length-1&&<div style={{ width:1, height:12, background:ACCENT+"40", margin:"0 auto" }} />}
                    </div>
                  ))}
                  <div style={{ marginTop:12, padding:"10px 12px", background:RED+"08", border:`1px solid ${RED}20`, borderRadius:5 }}>
                    <div style={{ fontFamily:mono, fontSize:9, color:RED, marginBottom:4 }}>NON-NULLABLE FK INVARIANT</div>
                    <div style={{ fontSize:11, color:TEXT, lineHeight:1.5 }}>LedgerPosting with null proof_chain_id is rejected at DB layer. No exceptions.</div>
                  </div>
                </div>
              )}
              {rightTab==="auditor" && (
                <div style={{ flex:1, overflow:"auto", padding:16 }}>
                  <div style={{ fontSize:10, color:DIM, fontFamily:mono, marginBottom:8 }}>SCOPED ATTEST VIEW — AUDITOR</div>
                  <div style={{ fontSize:11, color:TEXT, lineHeight:1.5, marginBottom:12, padding:"8px 10px", background:AMBER+"08", border:`1px solid ${AMBER}20`, borderRadius:4 }}>Scoped at data model layer — not a UI filter.</div>
                  {selectedEvent&&(
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {[["event_id",selectedEvent.id],["event_type",selectedEvent.type],["timestamp",selectedEvent.ts],["agent_id",selectedEvent.agent_id],["agent_type",selectedEvent.agent_type],["policy_version",selectedEvent.policy_version],["status",selectedEvent.status.toUpperCase()],["proof_hash",selectedEvent.proof_hash],["amount",selectedEvent.payload.amount?`$${selectedEvent.payload.amount.toLocaleString()}`:"N/A"],["invoice_ref",selectedEvent.payload.invoice_ref||"N/A"],["chain_root","a3f9e2d1c8b7"]].map(([k,v])=>(
                        <div key={k} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid ${BORDER}40` }}>
                          <span style={{ fontFamily:mono, fontSize:10, color:ACCENT2, minWidth:110, flexShrink:0 }}>{k}</span>
                          <span style={{ fontFamily:mono, fontSize:10, color:TEXT, wordBreak:"break-all" }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:8, padding:"8px 10px", background:DARK, borderRadius:4, border:`1px solid ${BORDER}` }}>
                        <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:4 }}>REDACTED</div>
                        {["destination_ref (full)","vendor_contact (email)","internal_notes","ap_team_metadata"].map(f=>(
                          <div key={f} style={{ fontFamily:mono, fontSize:10, color:RED+"80", marginBottom:2 }}>✗ {f}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Architecture tab */}
      {mainTab==="arch" && (
        <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>
          {/* Arch sidebar */}
          <div style={{ width:200, flexShrink:0, borderRight:`1px solid ${BORDER}`, background:PANEL, padding:"12px 0" }}>
            <div style={{ padding:"0 16px 8px", fontSize:10, color:DIM, fontFamily:mono, letterSpacing:"0.08em" }}>LAYERS</div>
            {ARCH_TABS.map(t=>(
              <button key={t.id} onClick={()=>setArchTab(t.id)} style={{ width:"100%", textAlign:"left", padding:"9px 16px", background:archTab===t.id?ACCENT+"12":"transparent", borderLeft:`3px solid ${archTab===t.id?ACCENT:"transparent"}`, border:"none", borderRight:"none", borderTop:"none", borderBottom:"none", cursor:"pointer", color:archTab===t.id?WHITE:DIM, fontSize:13, fontWeight:archTab===t.id?600:400 }}>
                {t.label}
              </button>
            ))}
            <div style={{ margin:"16px 16px 8px", padding:"12px", background:DARK, borderRadius:6, border:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:mono, fontSize:9, color:DIM, marginBottom:6 }}>AP WORKFLOW KPIs</div>
              {[["Events Today","2,847"],["Work Orders","8"],["Ledger (today)","$145,150"],["Compliance","99.7%"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:10, color:DIM }}>{k}</span>
                  <span style={{ fontFamily:mono, fontSize:10, color:ACCENT }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Arch content */}
          <div style={{ flex:1, overflow:"auto", padding:24 }}>
            {archTab==="overview" && <ArchOverview />}
            {archTab==="events" && <ArchEvents />}
            {archTab==="policies" && <ArchPolicies />}
            {archTab==="workorders" && <ArchWorkOrders />}
            {archTab==="ledger" && <ArchLedger />}
            {archTab==="exceptions" && <ArchExceptions />}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding:"8px 24px", borderTop:`1px solid ${BORDER}`, background:PANEL, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>Every other system governs what humans do.&nbsp;<span style={{ color:ACCENT }}>CAST governs what agents do.</span></div>
        <div style={{ fontFamily:mono, fontSize:10, color:DIM }}>Events · Policies · Work Orders · Capacity · Ledger · Exceptions</div>
      </div>
    </div>
  );
}
