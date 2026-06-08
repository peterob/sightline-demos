import { useState, useRef, useEffect } from "react";

var mono="'JetBrains Mono','IBM Plex Mono',monospace";
var C={exec:"#3B82F6",finance:"#F59E0B",vendor:"#10B981",legal:"#8B5CF6",system:"#6B7280",agent:"#06D6A0"};

// === USE CASE CONFIGS — same ledger, different metadata ===
var CASES={
  skunkworks:{
    name:"Skunkworks R&D",
    code:"SKUNK",
    envelope:5000000,
    sponsor:"EVP Engineering",
    approver:"CFO",
    description:"Advanced materials lab — 18-month runway, classified until patent filing",
    sensitivity:"CONFIDENTIAL — need-to-know basis",
    parties:[
      {k:"exec",n:"Program Lead",who:"Sarah Chen, VP Advanced Materials"},
      {k:"finance",n:"CFO Office",who:"Controller + 1 analyst (zero-knowledge option)"},
      {k:"vendor",n:"Vendors / Labs",who:"3 equipment vendors, 2 university labs"},
      {k:"legal",n:"Legal / IP",who:"Patent counsel (scoped visibility)"}
    ],
    agents:{verify:"Vendor credentialing + OFAC + debarment list",reconcile:"Draw vs milestone schedule",conflict:"COI scan — vendor principals vs employee roster",gl:"Journal entries to sub-ledger (not main GL until declassified)"},
    color:"#3B82F6"
  },
  cyber:{
    name:"Cyber Incident Response",
    code:"CYBER",
    envelope:5000000,
    sponsor:"CISO",
    approver:"CFO + General Counsel",
    description:"Ransomware containment — forensics, remediation, regulatory notification",
    sensitivity:"PRIVILEGED — attorney-client protected",
    parties:[
      {k:"exec",n:"Incident Commander",who:"CISO + Deputy CISO"},
      {k:"finance",n:"CFO Office",who:"CFO direct (bypasses normal AP)"},
      {k:"vendor",n:"IR Vendors",who:"Forensics firm, outside counsel, PR, insurance"},
      {k:"legal",n:"Legal / Regulatory",who:"General Counsel + breach counsel"}
    ],
    agents:{verify:"IR vendor credentials + clearance + NDA status",reconcile:"Hourly billing verification vs scope authorization",conflict:"Vendor relationship scan (prior engagements, board ties)",gl:"Segregated incident sub-ledger + insurance claim mapping"},
    color:"#EF4444"
  },
  buildout:{
    name:"Office Buildout",
    code:"BUILD",
    envelope:12000000,
    sponsor:"COO",
    approver:"CFO",
    description:"New regional HQ — 45,000 sq ft, 14-month construction, LEED Silver target",
    sensitivity:"STANDARD — but pre-announcement restricted",
    parties:[
      {k:"exec",n:"Project Sponsor",who:"COO + Facilities VP"},
      {k:"finance",n:"CFO Office",who:"Controller + project accountant"},
      {k:"vendor",n:"GC / Subs",who:"General contractor, 8-12 subcontractors, architect"},
      {k:"legal",n:"Legal / Compliance",who:"Real estate counsel, permit authority"}
    ],
    agents:{verify:"GC + sub licensing, bonding, insurance, prevailing wage cert",reconcile:"AIA G702/G703 pay app verification vs schedule of values",conflict:"Sub ownership vs GC principals, change order pattern detection",gl:"CIP entries by cost code, capitalize vs expense classification"},
    color:"#F59E0B"
  },
  jv:{
    name:"Joint Venture",
    code:"JV",
    envelope:25000000,
    sponsor:"Division President",
    approver:"CFO + JV Partner CFO",
    description:"Co-development — shared IP, 60/40 capital split, 3-year horizon",
    sensitivity:"HIGHLY CONFIDENTIAL — competitive intelligence risk",
    parties:[
      {k:"exec",n:"JV Steering Committee",who:"2 principals from each partner"},
      {k:"finance",n:"Both CFO Offices",who:"Each partner's controller (sees own allocation only)"},
      {k:"vendor",n:"Shared Vendors",who:"Common contractors, labs, consultants"},
      {k:"legal",n:"Both Legal Teams",who:"JV counsel + each partner's IP counsel"}
    ],
    agents:{verify:"Vendor credentials against BOTH partner debarment lists",reconcile:"60/40 split verification on every draw + cumulative tracking",conflict:"Cross-partner COI scan (vendor ties to either partner's employees)",gl:"Dual GL entries — one per partner, allocation-verified"},
    color:"#8B5CF6"
  }
};

// === UNIVERSAL EVENT SEQUENCE — same for all use cases ===
function makeEvents(uc){
  var c=CASES[uc];
  return [
    {id:"FC01",ts:"2026-01-15T09:00:00Z",tp:"LEDGER_CREATED",pa:"exec",vi:["exec","finance","legal"],
      d:{project:c.name,envelope:c.envelope,sponsor:c.sponsor,approver:c.approver,sensitivity:c.sensitivity,
        encryptionTier:"Zero-knowledge available",accessManifest:c.parties.length+" parties, cryptographic scoping"}},
    {id:"FC02",ts:"2026-01-15T09:05:00Z",tp:"CONTROLS_CONFIGURED",pa:"finance",vi:["exec","finance","legal"],
      d:{approvalThreshold:"$50K single-sig / $250K dual-sig / $500K+ committee",
        poRequired:true,invoiceMatchRequired:"3-way (PO, receipt, invoice)",
        budgetEnforcement:"Hard — cannot exceed line item without amendment",
        retainage:uc==="buildout"?"10%":"N/A",
        changeOrderAuth:uc==="buildout"?"5% GMP tolerance, then dual-sig":"Amendment requires sponsor + approver"}},
    {id:"FC03",ts:"2026-01-16T10:00:00Z",tp:"BUDGET_LOADED",pa:"finance",vi:["exec","finance"],
      d:{totalBudget:c.envelope,lineItems:uc==="cyber"?"7 categories":"12 line items",
        contingency:uc==="cyber"?"25% — incident scope uncertain":"10% standard",
        source:uc==="jv"?"60/40 split — $15M partner A / $10M partner B":"Corporate allocation"}},
    {id:"AG01",ts:"2026-01-16T10:01:00Z",tp:"AGENT_BUDGET_REVIEW",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Benchmark budget against comparable projects",
        compsAnalyzed:uc==="buildout"?"34 comparable buildouts in region":"18 comparable programs",
        flags:uc==="buildout"?"HVAC 18% above market — recommend re-bid":"All lines within 15% of benchmark",
        status:"Reviewed — sponsor acknowledged",agentCost:"$0.15",humanEquivalent:"$2,000-$5,000 consultant"}},
    {id:"FC04",ts:"2026-01-20T14:00:00Z",tp:"WORK_ORDER_ISSUED",pa:"exec",vi:["exec","finance","vendor"],
      d:{woNumber:"WO-001",vendor:uc==="cyber"?"Mandiant":"Primary contractor",
        scope:uc==="cyber"?"Forensic analysis + containment — T&M NTE $1,200,000":"Phase 1 scope per SOW",
        amount:uc==="cyber"?1200000:uc==="buildout"?4800000:uc==="jv"?8000000:1500000,
        terms:uc==="cyber"?"T&M with daily rate cap":"Fixed price, milestone-based",
        deliverables:uc==="cyber"?"Forensic report + remediation plan within 72 hrs":"Per SOW schedule"}},
    {id:"AG02",ts:"2026-01-20T14:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Verify vendor credentials",
        checks:uc==="cyber"?"FedRAMP clearance, DFARS compliance, NDA status, OFAC, insurance":"License, bond, insurance, OFAC, debarment, references",
        checkCount:uc==="cyber"?8:6,
        result:uc==="jv"?"5/6 PASS, 1 NOTE — vendor has prior contract with Partner B (disclosed)":"All checks PASS",
        sources:"sam.gov, state SOS, OFAC SDN, carrier API, D&B",
        agentCost:"$0.08",humanEquivalent:"$300-$800 manual (4-8 hours)"}},
    {id:"FC05",ts:"2026-02-10T16:00:00Z",tp:"MILESTONE_SUBMITTED",pa:"vendor",vi:["exec","finance","vendor"],
      d:{milestone:uc==="cyber"?"Forensic report delivered":"Milestone 1 complete",
        milestoneNum:1,invoiceAmount:uc==="cyber"?487000:uc==="buildout"?960000:uc==="jv"?2400000:375000,
        documentation:uc==="buildout"?"AIA G702 + G703 + inspection photos + daily logs":"Deliverable + time logs + receipts",
        inspection:uc==="buildout"?"Structural inspection PASS":"Deliverable accepted by sponsor"}},
    {id:"AG03",ts:"2026-02-10T16:01:00Z",tp:"AGENT_RECONCILE",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Verify invoice against PO, receipts, and schedule",
        poMatch:"PASS — within WO-001 scope",
        rateCheck:uc==="cyber"?"PASS — all rates within NTE schedule":"PASS — unit prices match contract",
        scheduleCheck:"PASS — milestone on schedule",
        budgetImpact:uc==="cyber"?"41% of WO-001 NTE consumed":"20% of total budget",
        anomalies:0,result:"CLEAN — recommend approval",
        agentCost:"$0.04",humanEquivalent:"$400-$800 (project accountant, 3-5 hrs)"}},
    {id:"FC06",ts:"2026-02-11T10:00:00Z",tp:"PAYMENT_APPROVED",pa:"finance",vi:["exec","finance","vendor"],
      d:{amount:uc==="cyber"?487000:uc==="buildout"?960000:uc==="jv"?2400000:375000,
        approver1:c.approver.split("+")[0]||c.approver,
        approver2:uc==="cyber"?"General Counsel":uc==="jv"?"Partner B CFO":null,
        dualSig:uc==="cyber"||uc==="jv"?true:false,
        agentReconciliation:"AG03 CLEAN",budgetRemaining:c.envelope-(uc==="cyber"?487000:uc==="buildout"?960000:uc==="jv"?2400000:375000)}},
    {id:"AG04",ts:"2026-02-11T10:01:00Z",tp:"AGENT_GL_ENTRY",pa:"agent",vi:["finance"],ag:true,
      d:{task:"Draft GL journal entries",
        entries:uc==="jv"?"Dual entries — Partner A 60% ($1,440,000) / Partner B 40% ($960,000)":uc==="buildout"?"DR CIP $960,000 / CR AP $960,000 + retainage entries":"DR Project expense / CR AP",
        subLedger:uc==="skunkworks"?"Classified sub-ledger (not main GL)":uc==="cyber"?"Incident sub-ledger + insurance recoverable mapping":"Project sub-ledger",
        status:"Drafted — controller approved",agentCost:"$0.02",humanEquivalent:"$150-$400 (staff accountant)"}},
    {id:"FC07",ts:"2026-02-12T08:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["exec","finance","vendor"],
      d:{amount:uc==="cyber"?487000:uc==="buildout"?960000:uc==="jv"?2400000:375000,
        method:uc==="jv"?"Wire — split from both partner accounts":"Wire",
        retainageHeld:uc==="buildout"?96000:0,netPayment:uc==="buildout"?864000:uc==="cyber"?487000:uc==="jv"?2400000:375000,
        cumulativePaid:uc==="cyber"?487000:uc==="buildout"?864000:uc==="jv"?2400000:375000,
        budgetConsumed:uc==="cyber"?"9.7%":uc==="buildout"?"7.2%":uc==="jv"?"9.6%":"7.5%"}},
    {id:"AG05",ts:"2026-03-15T09:00:00Z",tp:"AGENT_ANOMALY",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Continuous monitoring — anomaly detection",
        trigger:uc==="cyber"?"Second forensics firm invoice — overlapping date ranges with Mandiant"
          :uc==="buildout"?"Change order #3 — electrical sub pricing 34% above market"
          :uc==="jv"?"Vendor submitted duplicate invoice ($240K) — different PO numbers, same deliverable"
          :uc==="skunkworks"?"Equipment vendor registered agent = spouse of program lead's direct report",
        severity:uc==="skunkworks"?"HIGH — potential COI":"MEDIUM — pricing / billing anomaly",
        action:uc==="skunkworks"?"HOLD + notify compliance":"HOLD + flag for review",
        agentCost:"$0.06",humanEquivalent:uc==="skunkworks"?"Would not have been caught manually":"$500-$1,000 (audit review)"}},
    {id:"FC08",ts:"2026-03-15T09:30:00Z",tp:"ISSUE_HELD",pa:"system",vi:["exec","finance","legal"],
      d:{source:"Agent AG05",
        issue:uc==="cyber"?"Overlapping billing dates — potential double-billing"
          :uc==="buildout"?"Change order pricing significantly above market"
          :uc==="jv"?"Duplicate invoice across PO numbers"
          :uc==="skunkworks"?"Conflict of interest — vendor/employee relationship",
        autoAction:"Payment HELD pending resolution",
        escalatedTo:uc==="skunkworks"?"Compliance + sponsor":c.approver}},
    {id:"FC09",ts:"2026-03-16T14:00:00Z",tp:"ISSUE_RESOLVED",pa:"exec",vi:["exec","finance","legal"],
      d:{resolution:uc==="cyber"?"Overlapping dates corrected — revised invoice $38K less"
          :uc==="buildout"?"Re-bid electrical. New sub: $142K savings"
          :uc==="jv"?"Duplicate rejected. Vendor acknowledged billing error"
          :uc==="skunkworks"?"Relationship disclosed. Vendor replaced. Competitive re-bid saved $28K",
        savings:uc==="cyber"?38000:uc==="buildout"?142000:uc==="jv"?240000:28000,
        documented:true,auditTrail:"Full event chain: AG05 > FC08 > FC09"}},
    {id:"FC10",ts:"2026-06-30T16:00:00Z",tp:"PROJECT_STATUS",pa:"system",vi:["exec","finance"],
      d:{elapsed:"5.5 months",
        budgetConsumed:uc==="cyber"?"73% ($3.65M of $5M)":uc==="buildout"?"52% ($6.24M of $12M)":uc==="jv"?"41% ($10.25M of $25M)":"61% ($3.05M of $5M)",
        workOrders:uc==="cyber"?4:uc==="buildout"?6:uc==="jv"?5:3,
        invoicesProcessed:uc==="cyber"?23:uc==="buildout"?47:uc==="jv"?31:12,
        agentTasks:14,totalAgentCost:"$1.84",humanEquivalent:"$8,000-$18,000",
        anomaliesCaught:uc==="cyber"?2:uc==="buildout"?3:uc==="jv"?2:1,
        dollarsSaved:uc==="cyber"?38000:uc==="buildout"?142000:uc==="jv"?240000:28000,
        controlExceptions:0}},
    {id:"FC11",ts:"2026-06-30T16:01:00Z",tp:"AUDIT_PACKAGE",pa:"system",vi:["exec","finance","legal"],
      d:{package:"Complete event chain — all events, all signatures, all agent work",
        events:"16+ (shown) + additional milestone/payment cycles",
        hashChain:"Independently verifiable — any auditor can recompute",
        agentAudit:"Every agent task: input, logic, output, cost, human alternative",
        zeroKnowledge:uc==="skunkworks"||uc==="cyber"?"ACTIVE — platform operator cannot read event data":"Available — not activated",
        exportFormats:"JSON ledger, PDF summary, GL integration file",
        preparation:"Zero — the audit trail IS the system"}}
  ];
}

var LABELS={
  LEDGER_CREATED:"Ledger Created",CONTROLS_CONFIGURED:"Controls Configured",BUDGET_LOADED:"Budget Loaded",
  AGENT_BUDGET_REVIEW:"Agent: Budget Review",WORK_ORDER_ISSUED:"Work Order Issued",
  AGENT_VERIFICATION:"Agent: Vendor Verification",MILESTONE_SUBMITTED:"Milestone Submitted",
  AGENT_RECONCILE:"Agent: Draw Reconciliation",PAYMENT_APPROVED:"Payment Approved",
  AGENT_GL_ENTRY:"Agent: GL Journal Entry",PAYMENT_RELEASED:"Payment Released",
  AGENT_ANOMALY:"Agent: Anomaly Detected",ISSUE_HELD:"Payment HELD",ISSUE_RESOLVED:"Issue Resolved",
  PROJECT_STATUS:"Project Status",AUDIT_PACKAGE:"Audit Package"
};

// === WALKTHROUGH STEPS — universal narrative ===
var STEPS=[
  {ti:"The Problem",
    su:"$5M authorized. 3 people need full visibility. The ERP can't help.",
    na:"The CFO authorizes an envelope of funds for a critical project. It doesn't fit the ERP — it's too sensitive for shared services, too fast-moving for normal procurement, too cross-functional for any single cost center.\n\nToday this gets managed with spreadsheets, emails, and trust. The CFO gets monthly summaries that are already stale. Vendor credentials are checked once (if at all). Nobody reconciles invoices against the original scope in real time. And if there's a conflict of interest buried in the vendor chain, it won't surface until the audit — if then.\n\nThis is the same problem whether it's R&D, a breach response, a buildout, or a joint venture. The money moves the same way. The controls should work the same way.",
    sq:["ERP setup: 4-12 weeks (cost center, WBS, security roles, approval chains)",
      "Shared services sees every invoice — confidentiality compromised",
      "Reconciliation: monthly batch, 2-3 weeks after the fact",
      "Audit prep: 40-80 hours assembling transaction trail"],
    hl:[]},
  {ti:"Ledger + Controls",
    su:"Live in hours. Cryptographic access. Budget enforcement. Dual-sig thresholds.",
    na:"A dedicated ledger stands up in hours — not weeks. The visibility manifest is cryptographically scoped: each party sees exactly their slice. The CFO sees everything. A vendor sees only their own work orders and payments. Legal sees compliance events. Nobody administers access — the protocol enforces it.\n\nControls are configured once: approval thresholds, PO requirements, 3-way match rules, budget enforcement. These aren't guidelines in a policy manual. They're protocol-level constraints that cannot be bypassed.\n\nZero-knowledge option: the platform operator (CAST) cannot read the data unless explicitly granted access. The encryption keys live with the customer.",
    sq:null,
    hl:["FC01","FC02","FC03","AG01"]},
  {ti:"Authorize → Commit",
    su:"Work order issued. Agent verifies vendor in 30 seconds. Not 2 weeks.",
    na:"A work order goes out. Before it's countersigned, an agent verifies the vendor — license, insurance, bonding, OFAC/SDN, debarment lists, and references. All checked against authoritative sources with citations on the ledger.\n\nThis takes 30 seconds and costs $0.08. In procurement, the same checks take 2-4 weeks and cost $300-$800 in staff time — if they happen at all. For incident response or skunkworks, that 2-week delay is unacceptable.\n\nThe verification event lands on the ledger. Every future auditor can see exactly what was checked, when, against which sources, and what the results were.",
    sq:["Procurement adds 2-4 weeks per vendor engagement",
      "Verification is manual, inconsistent, and rarely documented",
      "Urgent projects bypass procurement entirely — controls sacrificed for speed",
      "Nobody re-checks mid-project (insurance lapse? license revocation?)"],
    hl:["FC04","AG02"]},
  {ti:"Execute → Verify → Pay",
    su:"Invoice submitted. Agent reconciles in 200ms. 3-way match. Dual-sig. Released.",
    na:"Vendor submits a milestone with documentation. The agent reconciles instantly: does the invoice match the PO? Do the rates match the contract? Is the milestone on schedule? What percentage of budget has been consumed?\n\nAll verified in 200 milliseconds. A human project accountant doing the same work: 3-5 hours.\n\nApproval routes based on the controls configured at setup. Single-sig under $50K. Dual-sig over $250K. Committee above $500K. The approvers see the agent's reconciliation — they're reviewing verified data, not raw invoices.\n\nGL journal entries draft automatically. The controller reviews and approves a batch instead of building entries from scratch.",
    sq:null,
    hl:["FC05","AG03","FC06","AG04","FC07"]},
  {ti:"The Anomaly Caught",
    su:"Agent flags what no human would have found. Payment held. Issue resolved.",
    na:"This is where the agent layer proves its value. Continuous monitoring catches things that periodic human review cannot.\n\nThe specific anomaly varies by context — a billing overlap, a pricing spike, a duplicate invoice, a conflict of interest. But the pattern is always the same: agent scans every event against every rule, every relationship, every historical pattern. In 200 milliseconds. For six cents.\n\nPayment holds automatically. The issue escalates to the right people. Resolution is documented on the ledger. The full event chain — detection, hold, resolution — becomes part of the permanent audit trail.\n\nNo human was going to cross-reference that vendor's registered agent against the employee roster. No human was going to catch overlapping billing dates across two forensics firms. The agent did. For pennies.",
    sq:["Conflicts surface at audit (12-18 months later) or not at all",
      "Duplicate invoices caught by AP staff ~60% of the time",
      "Pricing anomalies invisible without market data comparison",
      "Manual review: sample-based, not comprehensive"],
    hl:["AG05","FC08","FC09"]},
  {ti:"The Audit Package",
    su:"Zero prep. Hand the auditor a hash chain. Every event independently verifiable.",
    na:"At any point — mid-project or at close — the system produces a complete audit package with zero preparation. Because the audit trail IS the system.\n\nEvery event, every signature, every agent task, every approval, every anomaly, every resolution. Hash-chained and independently verifiable. An auditor can recompute the entire chain from genesis.\n\nAgent work is fully auditable: what was the input, what logic was applied, what was the output, what did it cost, what would the human alternative have been. The agents aren't trusted — they're verified.\n\nFor zero-knowledge deployments, the auditor receives decryption keys scoped to their engagement. They see everything they need. The platform operator still sees nothing.",
    sq:["Audit prep: 40-80 hours per project assembling documentation",
      "Transaction trail spread across ERP, email, shared drives, bank statements",
      "Agent/AI work in most systems: opaque, unauditable",
      "Auditors test samples because testing everything is infeasible"],
    hl:["FC10","FC11"]},
  {ti:"One Platform. Every Use Case.",
    su:"Same ledger. Same agents. Same controls. Only the metadata changes.",
    na:"Toggle between the use cases above. Watch the events change context — but not structure. The ledger schema is identical. The agent layer is identical. The provenance chain is identical.\n\nWhat changes: the parties on the visibility manifest, the verification rules the agents apply, the GL mapping, the approval thresholds. Configuration, not code.\n\nThis is the enterprise product: a funds control protocol that stands up in hours, runs with AI agents for pennies, produces audit-ready documentation by default, and works identically whether it's $5M for a skunkworks lab or $25M for a joint venture.\n\nThe CFO's value: complete visibility into any project, real-time, with controls that are mathematically enforced rather than administratively hoped for. And for the most sensitive work — the option that even the platform itself can't see the data.",
    sq:null,
    hl:[]}
];

function fd(n){return "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function ft(iso){var d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

export default function App(){
  var [uc,setUc]=useState("skunkworks");
  var [step,setStep]=useState(0);
  var [selEv,setSelEv]=useState(null);
  var [viewAs,setViewAs]=useState("exec");
  var [showLedger,setShowLedger]=useState(true);
  var [tab,setTab]=useState("ledger");

  var cfg=CASES[uc];
  var EV=makeEvents(uc);
  var cur=STEPS[step];
  var NS=STEPS.length;

  useEffect(function(){setSelEv(null);},[uc]);
  useEffect(function(){
    if(cur.hl&&cur.hl.length>0){
      var found=EV.find(function(e){return e.id===cur.hl[0];});
      if(found)setSelEv(found);
    }
  },[step,uc]);

  useEffect(function(){
    function hk(e){
      if(e.key==="ArrowRight")setStep(function(x){return Math.min(NS-1,x+1);});
      if(e.key==="ArrowLeft")setStep(function(x){return Math.max(0,x-1);});
    }
    window.addEventListener("keydown",hk);return function(){window.removeEventListener("keydown",hk);};
  },[]);

  var views=cfg.parties;

  return <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0A0E14",color:"#D4D4D8",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

    {/* TOP BAR */}
    <div style={{padding:"6px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"rgba(255,255,255,0.5)",fontFamily:mono}}>CAST</span>
        <span style={{width:1,height:14,background:"rgba(255,255,255,0.08)"}}/>
        <span style={{fontSize:11,fontWeight:600,color:cfg.color}}>{cfg.name}</span>
        <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.25)",fontFamily:mono}}>{fd(cfg.envelope)}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:3}}>
        {Object.keys(CASES).map(function(k){
          var active=uc===k;
          return <button key={k} onClick={function(){setUc(k);setStep(0);}} style={{
            padding:"3px 8px",borderRadius:4,border:"none",cursor:"pointer",fontSize:9,fontWeight:active?700:500,
            background:active?"rgba(255,255,255,0.08)":"transparent",
            color:active?CASES[k].color:"rgba(255,255,255,0.2)",
            transition:"all 0.15s"
          }}>{CASES[k].code}</button>;
        })}
      </div>
    </div>

    {/* PROGRESS */}
    <div style={{height:2,background:"rgba(255,255,255,0.03)",flexShrink:0}}>
      <div style={{height:"100%",background:cfg.color,width:((step+1)/NS*100)+"%",transition:"width 0.3s"}}/>
    </div>

    {/* MAIN AREA */}
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>

      {/* LEFT: NARRATIVE */}
      <div style={{width:showLedger?360:520,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:2,color:cfg.color,marginBottom:6,textTransform:"uppercase",fontFamily:mono}}>Step {step+1} of {NS}</div>
          <div style={{fontSize:20,fontWeight:700,color:"#FAFAFA",lineHeight:1.2,marginBottom:6}}>{cur.ti}</div>
          <div style={{fontSize:12,color:cfg.color,fontWeight:500,marginBottom:16,lineHeight:1.4}}>{cur.su}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,whiteSpace:"pre-line"}}>{cur.na}</div>

          {cur.sq&&<div style={{marginTop:20,padding:14,borderRadius:8,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.1)"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(239,68,68,0.5)",marginBottom:8,textTransform:"uppercase"}}>Status Quo</div>
            {cur.sq.map(function(s,i){return <div key={i} style={{fontSize:11,color:"rgba(239,68,68,0.45)",lineHeight:1.6,paddingLeft:12,position:"relative"}}>
              <span style={{position:"absolute",left:0,color:"rgba(239,68,68,0.25)"}}>—</span>{s}
            </div>;})}
          </div>}

          {cur.hl&&cur.hl.length>0&&<div style={{marginTop:16,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(255,255,255,0.25)",marginBottom:6,textTransform:"uppercase"}}>Events in this step</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {cur.hl.map(function(eid){
                var ev=EV.find(function(e){return e.id===eid;});
                if(!ev)return null;
                var isAg=ev.ag===true;
                return <button key={eid} onClick={function(){setSelEv(ev);setShowLedger(true);setTab("ledger");}} style={{
                  padding:"3px 8px",borderRadius:3,border:"none",cursor:"pointer",fontSize:9,fontWeight:600,fontFamily:mono,
                  background:isAg?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",
                  color:isAg?"#06D6A0":"rgba(255,255,255,0.4)"
                }}>{eid}</button>;
              })}
            </div>
          </div>}

          {step===NS-1&&<div style={{marginTop:24}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:cfg.color,marginBottom:12,textTransform:"uppercase"}}>Agent Configuration by Use Case</div>
            {Object.keys(CASES).map(function(k){
              var cs=CASES[k];
              return <div key={k} style={{marginBottom:12,padding:10,borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:11,fontWeight:600,color:cs.color,marginBottom:4}}>{cs.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>
                  <div><span style={{color:"rgba(6,214,160,0.6)"}}>Verify:</span> {cs.agents.verify}</div>
                  <div><span style={{color:"rgba(6,214,160,0.6)"}}>Reconcile:</span> {cs.agents.reconcile}</div>
                  <div><span style={{color:"rgba(6,214,160,0.6)"}}>Detect:</span> {cs.agents.conflict}</div>
                  <div><span style={{color:"rgba(6,214,160,0.6)"}}>GL:</span> {cs.agents.gl}</div>
                </div>
              </div>;
            })}
          </div>}
        </div>

        {/* NAV */}
        <div style={{padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={function(){setStep(function(x){return Math.max(0,x-1);});}} style={{padding:"5px 14px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:step>0?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.1)",cursor:step>0?"pointer":"default",fontSize:11,fontWeight:600}}>Prev</button>
          <div style={{display:"flex",gap:3}}>{STEPS.map(function(_,i){return <button key={i} onClick={function(){setStep(i);}} style={{width:i===step?16:5,height:5,borderRadius:3,border:"none",cursor:"pointer",background:i===step?cfg.color:i<step?cfg.color+"60":"rgba(255,255,255,0.06)"}}/>;})}</div>
          <button onClick={function(){setStep(function(x){return Math.min(NS-1,x+1);});}} style={{padding:"5px 14px",borderRadius:5,border:"none",background:step<NS-1?cfg.color:"rgba(255,255,255,0.04)",color:step<NS-1?"#0A0E14":"rgba(255,255,255,0.1)",cursor:step<NS-1?"pointer":"default",fontSize:11,fontWeight:700}}>Next</button>
        </div>
      </div>

      {/* RIGHT: LEDGER */}
      {showLedger&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* VIEW-AS + TABS */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0,padding:"0 8px"}}>
          <div style={{display:"flex"}}>
            {["ledger","controls","agents"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{padding:"7px 12px",border:"none",cursor:"pointer",fontSize:9,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",background:"transparent",color:tab===t?cfg.color:"rgba(255,255,255,0.2)",borderBottom:tab===t?"2px solid "+cfg.color:"2px solid transparent"}}>{t}</button>;})}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <span style={{fontSize:8,color:"rgba(255,255,255,0.15)",marginRight:4}}>VIEW AS</span>
            {views.map(function(v){return <button key={v.k} onClick={function(){setViewAs(v.k);}} style={{padding:"2px 6px",borderRadius:3,border:"none",cursor:"pointer",fontSize:8,fontWeight:600,background:viewAs===v.k?"rgba(255,255,255,0.08)":"transparent",color:viewAs===v.k?C[v.k]:"rgba(255,255,255,0.15)"}}>{v.n}</button>;})}
          </div>
        </div>

        {tab==="ledger"&&<div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* EVENT LIST */}
          <div style={{width:250,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",overflowY:"auto"}}>
            {EV.map(function(ev){
              var vis=ev.vi.indexOf(viewAs)>=0;
              var isAg=ev.ag===true;
              var sel=selEv&&selEv.id===ev.id;
              var hlt=cur.hl&&cur.hl.indexOf(ev.id)>=0;
              var amt=ev.d.amount||ev.d.invoiceAmount||ev.d.netPayment||ev.d.totalBudget||ev.d.envelope||ev.d.savings||null;

              if(!vis)return <div key={ev.id} style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.02)",opacity:0.2}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{ev.id}</span>
                  <span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.15)"}}>ENCRYPTED</span>
                </div>
              </div>;

              return <div key={ev.id} onClick={function(){setSelEv(ev);}} style={{
                padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.02)",cursor:"pointer",
                background:sel?"rgba(255,255,255,0.04)":hlt?"rgba(255,255,255,0.02)":"transparent",
                borderLeft:hlt?"2px solid "+(isAg?"#06D6A0":cfg.color):"2px solid transparent"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontFamily:mono}}>{ev.id}</span>
                    <span style={{width:5,height:5,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
                    {isAg&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(6,214,160,0.12)",color:"#06D6A0",fontWeight:700}}>AI</span>}
                  </div>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.15)"}}>{ft(ev.ts)}</span>
                </div>
                <div style={{fontSize:10,fontWeight:600,marginTop:2,color:ev.tp.indexOf("HELD")>=0?"#EF4444":isAg?"#06D6A0":"#D4D4D8"}}>{ev.tp.indexOf("HELD")>=0?"[HELD] ":""}{LABELS[ev.tp]||ev.tp}</div>
                {amt&&typeof amt==="number"&&<div style={{fontSize:9,color:"#F59E0B",fontWeight:600,fontFamily:mono,marginTop:1}}>{fd(amt)}</div>}
              </div>;
            })}
          </div>

          {/* EVENT DETAIL */}
          <div style={{flex:1,overflowY:"auto"}}>
            {!selEv?<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"rgba(255,255,255,0.1)",fontSize:12}}>Select an event</div>
            :selEv.vi.indexOf(viewAs)<0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:8}}>
              <div style={{fontSize:28,opacity:0.1}}>&#128274;</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.15)"}}>Outside your visibility manifest</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.08)"}}>Encrypted at rest — decryption key not in your scope</div>
            </div>
            :<div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{fontSize:10,fontFamily:mono,color:"rgba(255,255,255,0.25)"}}>{selEv.id}</span>
                <span style={{width:6,height:6,borderRadius:"50%",background:C[selEv.pa]}}/>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{views.find(function(v){return v.k===selEv.pa;})?views.find(function(v){return v.k===selEv.pa;}).n:selEv.pa}</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:selEv.tp.indexOf("HELD")>=0?"#EF4444":selEv.ag?"#06D6A0":"#FAFAFA"}}>{LABELS[selEv.tp]||selEv.tp}</div>
              {selEv.ag&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,padding:"2px 8px",borderRadius:3,background:"rgba(6,214,160,0.06)",border:"1px solid rgba(6,214,160,0.12)"}}>
                <span style={{fontSize:9,color:"#06D6A0",fontWeight:700}}>AI AGENT</span>
                <span style={{fontSize:8,color:"rgba(6,214,160,0.4)"}}>automated • auditable • human-reviewable</span>
              </div>}
              <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:4}}>{ft(selEv.ts)}</div>

              {/* Hash chain */}
              <div style={{marginTop:12,padding:10,borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:8,fontWeight:600,letterSpacing:1,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:3}}>Hash Chain</div>
                <div style={{fontSize:9,fontFamily:mono,color:"rgba(255,255,255,0.3)"}}>{selEv.ph||"genesis"} → {selEv.h}</div>
              </div>

              {/* Data fields */}
              <div style={{marginTop:10}}>
                {Object.entries(selEv.d).map(function(pair){
                  var k=pair[0],v=pair[1];
                  if(v==null||v==="")return null;
                  var isAmount=typeof v==="number"&&(k.toLowerCase().indexOf("amount")>=0||k.toLowerCase().indexOf("budget")>=0||k.toLowerCase().indexOf("envelope")>=0||k.toLowerCase().indexOf("savings")>=0||k.toLowerCase().indexOf("remaining")>=0||k.toLowerCase().indexOf("paid")>=0||k.toLowerCase().indexOf("payment")>=0||k.toLowerCase().indexOf("held")>=0);
                  var isAgent=k==="agentCost"||k==="humanEquivalent";
                  var isFail=String(v).indexOf("FAIL")>=0||String(v).indexOf("HOLD")>=0||String(v).indexOf("HELD")>=0||k==="severity";
                  var isPass=String(v).indexOf("PASS")>=0||String(v).indexOf("CLEAN")>=0||String(v).indexOf("CLEAR")>=0;
                  return <div key={k} style={{padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",minWidth:100,flexShrink:0}}>{k.replace(/([A-Z])/g," $1").trim()}</span>
                    <span style={{fontSize:10,fontWeight:isAmount||isAgent?600:400,fontFamily:isAmount||isAgent?mono:"inherit",
                      color:isAmount?"#F59E0B":isFail?"#EF4444":isPass?"#10B981":isAgent?"#06D6A0":"rgba(255,255,255,0.55)",
                      textAlign:"right",wordBreak:"break-word"}}>{isAmount?fd(v):String(v)}</span>
                  </div>;
                })}
              </div>
            </div>}
          </div>
        </div>}

        {tab==="controls"&&<div style={{flex:1,overflowY:"auto",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#FAFAFA",marginBottom:16}}>Control Configuration — {cfg.name}</div>

          <div style={{marginBottom:20,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8,textTransform:"uppercase"}}>Visibility Manifest</div>
            {cfg.parties.map(function(p){return <div key={p.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C[p.k]}}/>
                <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{p.n}</span>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{p.who}</span>
            </div>;})}
          </div>

          <div style={{marginBottom:20,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8,textTransform:"uppercase"}}>Approval Thresholds</div>
            {[["Under $50K","Single signature — sponsor"],["$50K - $250K","Dual signature — sponsor + "+cfg.approver],["Over $250K",uc==="jv"?"Both partner CFOs must approve":"Committee approval — "+cfg.approver+" + sponsor + legal"]].map(function(r,i){
              return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <span style={{fontSize:10,fontWeight:600,color:"#F59E0B",fontFamily:mono,minWidth:100}}>{r[0]}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>{r[1]}</span>
              </div>;
            })}
          </div>

          <div style={{padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8,textTransform:"uppercase"}}>Encryption</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>
              {(uc==="skunkworks"||uc==="cyber")
                ?<span><span style={{color:"#06D6A0",fontWeight:600}}>ZERO-KNOWLEDGE ACTIVE</span> — Platform operator cannot decrypt event data. Customer holds all encryption keys. Auditor access granted via scoped key delegation.</span>
                :<span><span style={{color:"#F59E0B",fontWeight:600}}>ZERO-KNOWLEDGE AVAILABLE</span> — Not activated for this deployment. Can be enabled at any time without data migration. Platform operator access revocable.</span>
              }
            </div>
          </div>
        </div>}

        {tab==="agents"&&<div style={{flex:1,overflowY:"auto",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#FAFAFA",marginBottom:4}}>Agent Layer — {cfg.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:16}}>Same agent architecture. Configuration varies by use case.</div>

          {[
            {n:"Verification",d:cfg.agents.verify,cost:"$0.08/vendor",human:"$300-$800 manual",ev:"AG02"},
            {n:"Budget Review",d:cfg.agents.reconcile,cost:"$0.15/review",human:"$2,000-$5,000 consultant",ev:"AG01"},
            {n:"Draw Reconciliation",d:cfg.agents.reconcile,cost:"$0.04/invoice",human:"$400-$800 per review",ev:"AG03"},
            {n:"Anomaly Detection",d:cfg.agents.conflict,cost:"$0.06/scan",human:"Often not caught at all",ev:"AG05"},
            {n:"GL Entry",d:cfg.agents.gl,cost:"$0.02/entry",human:"$150-$400 staff accountant",ev:"AG04"}
          ].map(function(a,i){return <div key={i} style={{marginBottom:10,padding:12,borderRadius:8,background:"rgba(6,214,160,0.02)",border:"1px solid rgba(6,214,160,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:600,color:"#06D6A0"}}>{a.n}</span>
              <div style={{display:"flex",gap:8}}>
                <span style={{fontSize:9,fontFamily:mono,color:"#06D6A0"}}>{a.cost}</span>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.15)"}}>vs</span>
                <span style={{fontSize:9,fontFamily:mono,color:"rgba(239,68,68,0.4)"}}>{a.human}</span>
              </div>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>{a.d}</div>
          </div>;})}

          <div style={{marginTop:16,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,0.25)",marginBottom:8,textTransform:"uppercase"}}>Total Agent Economics</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Agent cost (this project, 5.5 mo)</span>
              <span style={{fontSize:12,fontWeight:700,color:"#06D6A0",fontFamily:mono}}>$1.84</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Human equivalent</span>
              <span style={{fontSize:12,fontWeight:600,color:"rgba(239,68,68,0.5)",fontFamily:mono}}>$8,000 – $18,000</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:4}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Anomalies caught</span>
              <span style={{fontSize:12,fontWeight:700,color:"#F59E0B",fontFamily:mono}}>
                {uc==="cyber"?"2":uc==="buildout"?"3":uc==="jv"?"2":"1"} — {fd(uc==="cyber"?38000:uc==="buildout"?142000:uc==="jv"?240000:28000)} saved
              </span>
            </div>
          </div>
        </div>}
      </div>}
    </div>

    {/* FOOTER */}
    <div style={{padding:"4px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",flexShrink:0}}>
      <span style={{fontSize:8,color:"rgba(255,255,255,0.1)",fontFamily:mono}}>16 events | 5 agent tasks ($1.84) | zero-knowledge {uc==="skunkworks"||uc==="cyber"?"ACTIVE":"available"} | {fd(uc==="cyber"?38000:uc==="buildout"?142000:uc==="jv"?240000:28000)} in anomalies caught</span>
      <span style={{fontSize:8,color:"rgba(255,255,255,0.08)"}}>← → arrow keys</span>
    </div>

    <style>{"::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}*{box-sizing:border-box}"}</style>
  </div>;
}
