import { useState, useEffect } from "react";

var mono="'JetBrains Mono','IBM Plex Mono',monospace";
var C={exec:"#3B82F6",finance:"#F59E0B",vendor:"#10B981",legal:"#8B5CF6",system:"#6B7280",agent:"#06D6A0"};

var CASES={
  skunkworks:{name:"Skunkworks R&D",code:"SKUNK",envelope:5000000,sponsor:"EVP Engineering",approver:"CFO",
    sensitivity:"CONFIDENTIAL",
    parties:[{k:"exec",n:"Program Lead",who:"VP Advanced Materials"},{k:"finance",n:"CFO Office",who:"Controller + 1 analyst"},{k:"vendor",n:"Vendors",who:"3 equipment vendors, 2 labs"},{k:"legal",n:"Legal / IP",who:"Patent counsel"}],
    agents:{verify:"OFAC + debarment + credentialing",reconcile:"Draw vs milestone schedule",conflict:"COI: vendor principals vs employee roster",gl:"Sub-ledger (not main GL until declassified)"},
    color:"#3B82F6",anomaly:"Equipment vendor registered agent = spouse of program lead direct report",anomSev:"HIGH",anomSave:28000,anomRes:"Relationship disclosed. Vendor replaced. Re-bid saved $28K"},
  cyber:{name:"Cyber Incident Response",code:"CYBER",envelope:5000000,sponsor:"CISO",approver:"CFO + General Counsel",
    sensitivity:"PRIVILEGED",
    parties:[{k:"exec",n:"Incident Commander",who:"CISO + Deputy"},{k:"finance",n:"CFO Office",who:"CFO direct (bypasses AP)"},{k:"vendor",n:"IR Vendors",who:"Forensics, counsel, PR"},{k:"legal",n:"Legal",who:"GC + breach counsel"}],
    agents:{verify:"FedRAMP + DFARS + NDA + clearance",reconcile:"Hourly billing vs scope auth",conflict:"Vendor relationship scan (prior engagements)",gl:"Incident sub-ledger + insurance mapping"},
    color:"#EF4444",anomaly:"Second forensics firm: overlapping date ranges with primary vendor",anomSev:"MEDIUM",anomSave:38000,anomRes:"Overlapping dates corrected. Revised invoice $38K less"},
  buildout:{name:"Office Buildout",code:"BUILD",envelope:12000000,sponsor:"COO",approver:"CFO",
    sensitivity:"RESTRICTED",
    parties:[{k:"exec",n:"Project Sponsor",who:"COO + Facilities VP"},{k:"finance",n:"CFO Office",who:"Controller + project accountant"},{k:"vendor",n:"GC / Subs",who:"GC + 8-12 subcontractors"},{k:"legal",n:"Legal",who:"Real estate counsel"}],
    agents:{verify:"License + bond + insurance + prevailing wage",reconcile:"AIA G702/G703 vs schedule of values",conflict:"Sub ownership vs GC principals + CO patterns",gl:"CIP by cost code, capitalize vs expense"},
    color:"#F59E0B",anomaly:"Change order #3: electrical sub pricing 34% above market",anomSev:"MEDIUM",anomSave:142000,anomRes:"Re-bid electrical. New sub: $142K savings"},
  jv:{name:"Joint Venture",code:"JV",envelope:25000000,sponsor:"Division President",approver:"Both CFOs",
    sensitivity:"HIGHLY CONFIDENTIAL",
    parties:[{k:"exec",n:"JV Steering",who:"2 principals per partner"},{k:"finance",n:"Both CFOs",who:"Each controller (own allocation only)"},{k:"vendor",n:"Shared Vendors",who:"Common contractors + labs"},{k:"legal",n:"Both Legal",who:"JV counsel + IP counsel"}],
    agents:{verify:"Credentials against BOTH debarment lists",reconcile:"60/40 split verification every draw",conflict:"Cross-partner COI (vendor ties to either side)",gl:"Dual GL entries, allocation-verified"},
    color:"#8B5CF6",anomaly:"Duplicate invoice ($240K): different PO numbers, same deliverable",anomSev:"MEDIUM",anomSave:240000,anomRes:"Duplicate rejected. Vendor acknowledged billing error"}
};

function makeEvents(uc){
  var c=CASES[uc];
  var m1=uc==="cyber"?487000:uc==="buildout"?960000:uc==="jv"?2400000:375000;
  var wo1=uc==="cyber"?1200000:uc==="buildout"?4800000:uc==="jv"?8000000:1500000;
  return [
    {id:"FC01",h:"fc01a",ph:"000000",ts:"2026-01-15T09:00:00Z",tp:"LEDGER_CREATED",pa:"exec",vi:["exec","finance","legal"],
      d:{project:c.name,envelope:c.envelope,sponsor:c.sponsor,approver:c.approver,sensitivity:c.sensitivity,encryption:"Zero-knowledge available",parties:c.parties.length+" roles, cryptographic scoping"}},
    {id:"FC02",h:"fc02b",ph:"fc01a",ts:"2026-01-15T09:05:00Z",tp:"CONTROLS_CONFIGURED",pa:"finance",vi:["exec","finance","legal"],
      d:{thresholds:"$50K single / $250K dual / $500K+ committee",poRequired:"Yes",invoiceMatch:"3-way (PO, receipt, invoice)",budgetEnforce:"Hard ceiling per line item",retainage:uc==="buildout"?"10%":"N/A"}},
    {id:"FC03",h:"fc03c",ph:"fc02b",ts:"2026-01-16T10:00:00Z",tp:"BUDGET_LOADED",pa:"finance",vi:["exec","finance"],
      d:{totalBudget:c.envelope,lineItems:uc==="cyber"?"7 categories":"12 line items",contingency:uc==="cyber"?"25%":"10%",source:uc==="jv"?"60/40 split":"Corporate allocation"}},
    {id:"AG01",h:"ag01d",ph:"fc03c",ts:"2026-01-16T10:01:00Z",tp:"AGENT_BUDGET_REVIEW",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Benchmark budget vs comparables",compsAnalyzed:uc==="buildout"?"34 regional buildouts":"18 comparable programs",flags:uc==="buildout"?"HVAC 18% above market":"All lines within 15%",status:"Reviewed",agentCost:"$0.15",humanEquivalent:"$2,000-$5,000"}},
    {id:"FC04",h:"fc04e",ph:"ag01d",ts:"2026-01-20T14:00:00Z",tp:"WORK_ORDER_ISSUED",pa:"exec",vi:["exec","finance","vendor"],
      d:{woNumber:"WO-001",scope:uc==="cyber"?"Forensic analysis + containment":"Phase 1 per SOW",amount:wo1,terms:uc==="cyber"?"T&M NTE":"Fixed price, milestone"}},
    {id:"AG02",h:"ag02f",ph:"fc04e",ts:"2026-01-20T14:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Verify vendor credentials",checks:uc==="cyber"?"FedRAMP, DFARS, NDA, OFAC, insurance":"License, bond, insurance, OFAC, debarment",checkCount:uc==="cyber"?"8":"6",result:uc==="jv"?"5/6 PASS, 1 NOTE":"All PASS",sources:"sam.gov, state SOS, OFAC SDN, carrier API",agentCost:"$0.08",humanEquivalent:"$300-$800 (4-8 hrs)"}},
    {id:"FC05",h:"fc05g",ph:"ag02f",ts:"2026-02-10T16:00:00Z",tp:"MILESTONE_SUBMITTED",pa:"vendor",vi:["exec","finance","vendor"],
      d:{milestone:uc==="cyber"?"Forensic report delivered":"Milestone 1 complete",invoiceAmount:m1,documentation:uc==="buildout"?"AIA G702 + G703 + photos":"Deliverable + time logs"}},
    {id:"AG03",h:"ag03h",ph:"fc05g",ts:"2026-02-10T16:01:00Z",tp:"AGENT_RECONCILE",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"3-way match: invoice vs PO vs receipts",poMatch:"PASS",rateCheck:"PASS",scheduleCheck:"PASS",budgetImpact:uc==="cyber"?"41% of WO-001 consumed":"20% of total budget",anomalies:"0",result:"CLEAN",agentCost:"$0.04",humanEquivalent:"$400-$800 (3-5 hrs)"}},
    {id:"FC06",h:"fc06i",ph:"ag03h",ts:"2026-02-11T10:00:00Z",tp:"PAYMENT_APPROVED",pa:"finance",vi:["exec","finance","vendor"],
      d:{amount:m1,approver1:c.approver,dualSig:uc==="cyber"||uc==="jv"?"Yes":"No",agentCheck:"AG03 CLEAN",budgetRemaining:c.envelope-m1}},
    {id:"AG04",h:"ag04j",ph:"fc06i",ts:"2026-02-11T10:01:00Z",tp:"AGENT_GL_ENTRY",pa:"agent",vi:["finance"],ag:true,
      d:{task:"Draft GL journal entries",entries:uc==="jv"?"Dual: Partner A 60% / Partner B 40%":uc==="buildout"?"DR CIP / CR AP + retainage":"DR Project expense / CR AP",subLedger:uc==="skunkworks"?"Classified sub-ledger":uc==="cyber"?"Incident sub-ledger":"Project sub-ledger",status:"Controller approved",agentCost:"$0.02",humanEquivalent:"$150-$400"}},
    {id:"FC07",h:"fc07k",ph:"ag04j",ts:"2026-02-12T08:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["exec","finance","vendor"],
      d:{amount:m1,method:uc==="jv"?"Wire (split from both accounts)":"Wire",cumulativePaid:m1,budgetConsumed:Math.round(m1/c.envelope*100)+"%"}},
    {id:"AG05",h:"ag05l",ph:"fc07k",ts:"2026-03-15T09:00:00Z",tp:"AGENT_ANOMALY",pa:"agent",vi:["exec","finance"],ag:true,
      d:{task:"Continuous monitoring",trigger:c.anomaly,severity:c.anomSev,action:"HOLD + escalate",agentCost:"$0.06",humanEquivalent:uc==="skunkworks"?"Would not have been caught":"$500-$1,000"}},
    {id:"FC08",h:"fc08m",ph:"ag05l",ts:"2026-03-15T09:30:00Z",tp:"ISSUE_HELD",pa:"system",vi:["exec","finance","legal"],
      d:{source:"Agent AG05",issue:c.anomaly,autoAction:"Payment HELD pending resolution",escalatedTo:c.approver}},
    {id:"FC09",h:"fc09n",ph:"fc08m",ts:"2026-03-16T14:00:00Z",tp:"ISSUE_RESOLVED",pa:"exec",vi:["exec","finance","legal"],
      d:{resolution:c.anomRes,savings:c.anomSave,documented:"Full event chain: AG05 > FC08 > FC09"}},
    {id:"FC10",h:"fc10o",ph:"fc09n",ts:"2026-06-30T16:00:00Z",tp:"PROJECT_STATUS",pa:"system",vi:["exec","finance"],
      d:{elapsed:"5.5 months",budgetConsumed:uc==="cyber"?"73%":uc==="buildout"?"52%":uc==="jv"?"41%":"61%",invoicesProcessed:uc==="cyber"?"23":uc==="buildout"?"47":uc==="jv"?"31":"12",agentTasks:"14",totalAgentCost:"$1.84",humanEquivalent:"$8,000-$18,000",anomaliesCaught:uc==="cyber"?"2":uc==="buildout"?"3":uc==="jv"?"2":"1",dollarsSaved:c.anomSave}},
    {id:"FC11",h:"fc11p",ph:"fc10o",ts:"2026-06-30T16:01:00Z",tp:"AUDIT_PACKAGE",pa:"system",vi:["exec","finance","legal"],
      d:{events:"16+ (shown) + milestone/payment cycles",hashChain:"Independently verifiable",agentAudit:"Every task: input, logic, output, cost",zeroKnowledge:uc==="skunkworks"||uc==="cyber"?"ACTIVE":"Available",exportFormats:"JSON ledger, PDF summary, GL file",preparation:"Zero. The audit trail IS the system"}}
  ];
}

var LABELS={LEDGER_CREATED:"Ledger Created",CONTROLS_CONFIGURED:"Controls Configured",BUDGET_LOADED:"Budget Loaded",AGENT_BUDGET_REVIEW:"Agent: Budget Review",WORK_ORDER_ISSUED:"Work Order Issued",AGENT_VERIFICATION:"Agent: Vendor Verification",MILESTONE_SUBMITTED:"Milestone Submitted",AGENT_RECONCILE:"Agent: Draw Reconciliation",PAYMENT_APPROVED:"Payment Approved",AGENT_GL_ENTRY:"Agent: GL Journal Entry",PAYMENT_RELEASED:"Payment Released",AGENT_ANOMALY:"Agent: Anomaly Detected",ISSUE_HELD:"Payment HELD",ISSUE_RESOLVED:"Issue Resolved",PROJECT_STATUS:"Project Status",AUDIT_PACKAGE:"Audit Package"};

var STEPS=[
  {ti:"The Problem",su:"Funds authorized. 3 people need full visibility. The ERP cannot help.",
    na:"The CFO authorizes an envelope for a critical project. It does not fit the ERP. Too sensitive for shared services, too fast for normal procurement, too cross-functional for any single cost center.\n\nToday this is managed with spreadsheets, emails, and trust. The CFO gets monthly summaries that are already stale. Vendor credentials checked once, if at all. Nobody reconciles invoices against scope in real time.\n\nSame problem whether it is R&D, breach response, buildout, or joint venture. The money moves the same way. The controls should work the same way.",
    sq:["ERP setup: 4-12 weeks (cost center, WBS, security roles, approval chains)","Shared services sees every invoice. Confidentiality compromised","Reconciliation: monthly batch, 2-3 weeks after the fact","Audit prep: 40-80 hours assembling the transaction trail"],hl:[]},
  {ti:"Ledger + Controls",su:"Live in hours. Cryptographic access. Budget enforcement. Dual-sig thresholds.",
    na:"A dedicated ledger stands up in hours, not weeks. The visibility manifest is cryptographically scoped: each party sees exactly their slice. The CFO sees everything. A vendor sees only their work orders and payments. Legal sees compliance events.\n\nControls are protocol-level constraints, not policy guidelines. They cannot be bypassed.\n\nZero-knowledge option: the platform operator cannot read the data. Encryption keys stay with the customer.",
    sq:null,hl:["FC01","FC02","FC03","AG01"]},
  {ti:"Authorize + Commit",su:"Work order issued. Agent verifies vendor in 30 seconds. Not 2 weeks.",
    na:"A work order goes out. Before countersigning, an agent verifies the vendor: license, insurance, bonding, OFAC/SDN, debarment lists, references. All checked against authoritative sources with citations on the ledger.\n\n30 seconds, $0.08. In procurement: 2-4 weeks, $300-$800. For incident response or skunkworks, that delay is unacceptable.\n\nThe verification event lands on the ledger. Every future auditor sees exactly what was checked, when, against which sources.",
    sq:["Procurement adds 2-4 weeks per vendor engagement","Verification is manual, inconsistent, rarely documented","Urgent projects bypass procurement entirely","Nobody re-checks mid-project"],hl:["FC04","AG02"]},
  {ti:"Execute + Verify + Pay",su:"Invoice submitted. Agent reconciles in 200ms. 3-way match. Approved. Released.",
    na:"Vendor submits a milestone with documentation. The agent reconciles instantly: does the invoice match the PO? Do the rates match the contract? Is the milestone on schedule? What percentage of budget consumed?\n\nVerified in 200 milliseconds. A human project accountant: 3-5 hours.\n\nApproval routes per controls. Single-sig under $50K. Dual-sig over $250K. Approvers review verified data, not raw invoices.\n\nGL journal entries draft automatically. The controller reviews a batch instead of building entries from scratch.",
    sq:null,hl:["FC05","AG03","FC06","AG04","FC07"]},
  {ti:"The Anomaly Caught",su:"Agent flags what no human would find. Payment held. Resolved in 24 hours.",
    na:"Continuous monitoring catches what periodic review cannot. The specific anomaly varies by context: billing overlap, pricing spike, duplicate invoice, conflict of interest.\n\nThe pattern is always the same: agent scans every event against every rule, every relationship, every pattern. In 200 milliseconds. For six cents.\n\nPayment holds automatically. Issue escalates to the right people. Resolution documented on the ledger. The full chain becomes permanent audit trail.\n\nNo human was going to cross-reference that registered agent against the employee roster. The agent did. For pennies.",
    sq:["Conflicts surface at audit (12-18 months later) or never","Duplicate invoices caught by AP roughly 60% of the time","Pricing anomalies invisible without market data","Manual review is sample-based, not comprehensive"],hl:["AG05","FC08","FC09"]},
  {ti:"The Audit Package",su:"Zero prep. Hand the auditor a hash chain. Every event independently verifiable.",
    na:"At any point the system produces a complete audit package with zero preparation. The audit trail IS the system.\n\nEvery event, signature, agent task, approval, anomaly, resolution. Hash-chained and independently verifiable. An auditor recomputes the entire chain from genesis.\n\nAgent work is fully auditable: input, logic, output, cost, human alternative. The agents are not trusted. They are verified.\n\nFor zero-knowledge deployments, the auditor receives scoped decryption keys. They see everything needed. The platform operator still sees nothing.",
    sq:["Audit prep: 40-80 hours per project","Trail spread across ERP, email, drives, bank statements","AI work in most systems: opaque, unauditable","Auditors test samples because testing everything is impossible"],hl:["FC10","FC11"]},
  {ti:"One Platform. Every Use Case.",su:"Same ledger. Same agents. Same controls. Only the metadata changes.",
    na:"Toggle between the use cases above. The events change context but not structure. The ledger schema is identical. The agent layer is identical. The provenance chain is identical.\n\nWhat changes: parties on the visibility manifest, verification rules, GL mapping, approval thresholds. Configuration, not code.\n\nThis is the enterprise product: a funds control protocol that stands up in hours, runs with AI agents for pennies, produces audit-ready documentation by default, and works identically from $5M skunkworks to $25M joint venture.\n\nThe CFO gets complete visibility into any project, real-time, with controls that are mathematically enforced. For the most sensitive work, even the platform itself cannot see the data.",
    sq:null,hl:[]}
];

function fd(n){return "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function ft(iso){var d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

export default function App(){
  var [uc,setUc]=useState("skunkworks");
  var [step,setStep]=useState(0);
  var [selEv,setSelEv]=useState(null);
  var [viewAs,setViewAs]=useState("exec");
  var [tab,setTab]=useState("ledger");
  var cfg=CASES[uc];
  var EV=makeEvents(uc);
  var cur=STEPS[step];
  var NS=STEPS.length;

  useEffect(function(){setSelEv(null);setViewAs("exec");},[uc]);
  useEffect(function(){
    if(cur.hl && cur.hl.length>0){
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

  return <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0A0E14",color:"#D4D4D8",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

    <div style={{padding:"6px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:3,color:"rgba(255,255,255,0.5)",fontFamily:mono}}>CAST</span>
        <span style={{width:1,height:14,background:"rgba(255,255,255,0.08)"}}/>
        <span style={{fontSize:11,fontWeight:600,color:cfg.color}}>{cfg.name}</span>
        <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.25)",fontFamily:mono}}>{fd(cfg.envelope)}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:3}}>
        {Object.keys(CASES).map(function(k){var a=uc===k;return <button key={k} onClick={function(){setUc(k);setStep(0);}} style={{padding:"3px 8px",borderRadius:4,border:"none",cursor:"pointer",fontSize:9,fontWeight:a?700:500,background:a?"rgba(255,255,255,0.08)":"transparent",color:a?CASES[k].color:"rgba(255,255,255,0.2)"}}>{CASES[k].code}</button>;})}
      </div>
    </div>

    <div style={{height:2,background:"rgba(255,255,255,0.03)",flexShrink:0}}><div style={{height:"100%",background:cfg.color,width:((step+1)/NS*100)+"%",transition:"width 0.3s"}}/></div>

    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{width:380,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:2,color:cfg.color,marginBottom:6,fontFamily:mono}}>STEP {step+1} OF {NS}</div>
          <div style={{fontSize:20,fontWeight:700,color:"#FAFAFA",lineHeight:1.2,marginBottom:6}}>{cur.ti}</div>
          <div style={{fontSize:12,color:cfg.color,fontWeight:500,marginBottom:16,lineHeight:1.4}}>{cur.su}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,whiteSpace:"pre-line"}}>{cur.na}</div>

          {cur.sq && <div style={{marginTop:20,padding:14,borderRadius:8,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.1)"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(239,68,68,0.5)",marginBottom:8}}>STATUS QUO</div>
            {cur.sq.map(function(s,i){return <div key={i} style={{fontSize:11,color:"rgba(239,68,68,0.4)",lineHeight:1.6,marginBottom:2}}>{"- "+s}</div>;})}
          </div>}

          {cur.hl && cur.hl.length>0 && <div style={{marginTop:16,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(255,255,255,0.25)",marginBottom:6}}>EVENTS IN THIS STEP</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {cur.hl.map(function(eid){var ev=EV.find(function(e){return e.id===eid;});if(!ev)return null;var isAg=ev.ag===true;
                return <button key={eid} onClick={function(){setSelEv(ev);setTab("ledger");}} style={{padding:"3px 8px",borderRadius:3,border:"none",cursor:"pointer",fontSize:9,fontWeight:600,fontFamily:mono,background:isAg?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",color:isAg?"#06D6A0":"rgba(255,255,255,0.4)"}}>{eid}</button>;
              })}
            </div>
          </div>}

          {step===NS-1 && <div style={{marginTop:24}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:cfg.color,marginBottom:12}}>AGENT CONFIG BY USE CASE</div>
            {Object.keys(CASES).map(function(k){var cs=CASES[k];return <div key={k} style={{marginBottom:10,padding:10,borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{fontSize:11,fontWeight:600,color:cs.color,marginBottom:4}}>{cs.name}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>
                <div><span style={{color:"rgba(6,214,160,0.6)"}}>Verify: </span>{cs.agents.verify}</div>
                <div><span style={{color:"rgba(6,214,160,0.6)"}}>Reconcile: </span>{cs.agents.reconcile}</div>
                <div><span style={{color:"rgba(6,214,160,0.6)"}}>Detect: </span>{cs.agents.conflict}</div>
                <div><span style={{color:"rgba(6,214,160,0.6)"}}>GL: </span>{cs.agents.gl}</div>
              </div>
            </div>;})}
          </div>}
        </div>

        <div style={{padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={function(){setStep(function(x){return Math.max(0,x-1);});}} style={{padding:"5px 14px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:step>0?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.1)",cursor:step>0?"pointer":"default",fontSize:11,fontWeight:600}}>Prev</button>
          <div style={{display:"flex",gap:3}}>{STEPS.map(function(_,i){return <button key={i} onClick={function(){setStep(i);}} style={{width:i===step?16:5,height:5,borderRadius:3,border:"none",cursor:"pointer",background:i===step?cfg.color:i<step?cfg.color+"60":"rgba(255,255,255,0.06)"}}/>;})}</div>
          <button onClick={function(){setStep(function(x){return Math.min(NS-1,x+1);});}} style={{padding:"5px 14px",borderRadius:5,border:"none",background:step<NS-1?cfg.color:"rgba(255,255,255,0.04)",color:step<NS-1?"#0A0E14":"rgba(255,255,255,0.1)",cursor:step<NS-1?"pointer":"default",fontSize:11,fontWeight:700}}>Next</button>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0,padding:"0 8px"}}>
          <div style={{display:"flex"}}>
            {["ledger","controls","agents"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{padding:"7px 12px",border:"none",cursor:"pointer",fontSize:9,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",background:"transparent",color:tab===t?cfg.color:"rgba(255,255,255,0.2)",borderBottom:tab===t?"2px solid "+cfg.color:"2px solid transparent"}}>{t}</button>;})}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <span style={{fontSize:8,color:"rgba(255,255,255,0.15)",marginRight:4}}>VIEW AS</span>
            {cfg.parties.map(function(v){return <button key={v.k} onClick={function(){setViewAs(v.k);}} style={{padding:"2px 6px",borderRadius:3,border:"none",cursor:"pointer",fontSize:8,fontWeight:600,background:viewAs===v.k?"rgba(255,255,255,0.08)":"transparent",color:viewAs===v.k?C[v.k]:"rgba(255,255,255,0.15)"}}>{v.n}</button>;})}
          </div>
        </div>

        {tab==="ledger" && <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div style={{width:250,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",overflowY:"auto"}}>
            {EV.map(function(ev){
              var vis=ev.vi.indexOf(viewAs)>=0;
              var isAg=ev.ag===true;
              var sel=selEv && selEv.id===ev.id;
              var hlt=cur.hl && cur.hl.indexOf(ev.id)>=0;
              if(!vis) return <div key={ev.id} style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.02)",opacity:0.2}}>
                <span style={{fontSize:8,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{ev.id}</span>
                <span style={{fontSize:7,marginLeft:4,padding:"1px 4px",borderRadius:2,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.15)"}}>ENCRYPTED</span>
              </div>;
              var amt=ev.d.amount || ev.d.invoiceAmount || ev.d.totalBudget || ev.d.envelope || ev.d.savings || null;
              return <div key={ev.id} onClick={function(){setSelEv(ev);}} style={{padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.02)",cursor:"pointer",background:sel?"rgba(255,255,255,0.04)":hlt?"rgba(255,255,255,0.015)":"transparent",borderLeft:hlt?"2px solid "+(isAg?"#06D6A0":cfg.color):"2px solid transparent"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontFamily:mono}}>{ev.id}</span>
                    <span style={{width:5,height:5,borderRadius:"50%",background:C[ev.pa] || "#666"}}/>
                    {isAg && <span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(6,214,160,0.12)",color:"#06D6A0",fontWeight:700}}>AI</span>}
                  </div>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.15)"}}>{ft(ev.ts)}</span>
                </div>
                <div style={{fontSize:10,fontWeight:600,marginTop:2,color:ev.tp.indexOf("HELD")>=0?"#EF4444":isAg?"#06D6A0":"#D4D4D8"}}>{ev.tp.indexOf("HELD")>=0?"[HELD] ":""}{LABELS[ev.tp] || ev.tp}</div>
                {amt && typeof amt==="number" && <div style={{fontSize:9,color:"#F59E0B",fontWeight:600,fontFamily:mono,marginTop:1}}>{fd(amt)}</div>}
              </div>;
            })}
          </div>

          <div style={{flex:1,overflowY:"auto"}}>
            {!selEv && <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"rgba(255,255,255,0.1)",fontSize:12}}>Select an event</div>}
            {selEv && selEv.vi.indexOf(viewAs)<0 && <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:8}}>
              <div style={{fontSize:28,opacity:0.1}}>&#128274;</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.15)"}}>Outside your visibility manifest</div>
            </div>}
            {selEv && selEv.vi.indexOf(viewAs)>=0 && <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{fontSize:10,fontFamily:mono,color:"rgba(255,255,255,0.25)"}}>{selEv.id}</span>
                <span style={{width:6,height:6,borderRadius:"50%",background:C[selEv.pa]}}/>
              </div>
              <div style={{fontSize:16,fontWeight:700,color:selEv.tp.indexOf("HELD")>=0?"#EF4444":selEv.ag?"#06D6A0":"#FAFAFA"}}>{LABELS[selEv.tp] || selEv.tp}</div>
              {selEv.ag && <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,padding:"2px 8px",borderRadius:3,background:"rgba(6,214,160,0.06)",border:"1px solid rgba(6,214,160,0.12)"}}>
                <span style={{fontSize:9,color:"#06D6A0",fontWeight:700}}>AI AGENT</span>
                <span style={{fontSize:8,color:"rgba(6,214,160,0.4)"}}>automated / auditable / human-reviewable</span>
              </div>}
              <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:4}}>{ft(selEv.ts)}</div>
              <div style={{marginTop:12,padding:10,borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:8,fontWeight:600,letterSpacing:1,color:"rgba(255,255,255,0.2)",marginBottom:3}}>HASH CHAIN</div>
                <div style={{fontSize:9,fontFamily:mono,color:"rgba(255,255,255,0.3)"}}>{selEv.ph}{" -> "}{selEv.h}</div>
              </div>
              <div style={{marginTop:10}}>
                {Object.entries(selEv.d).map(function(pair){
                  var k=pair[0], v=pair[1];
                  if(v == null || v === "")return null;
                  var vs = typeof v === "number" ? fd(v) : String(v);
                  var kl = k.toLowerCase();
                  var isAmt = typeof v === "number" && (kl.indexOf("amount")>=0 || kl.indexOf("budget")>=0 || kl.indexOf("envelope")>=0 || kl.indexOf("savings")>=0 || kl.indexOf("remaining")>=0 || kl.indexOf("paid")>=0);
                  var isAg = k==="agentCost" || k==="humanEquivalent";
                  var isFail = vs.indexOf("FAIL")>=0 || vs.indexOf("HOLD")>=0 || vs.indexOf("HELD")>=0 || k==="severity";
                  var isPass = vs.indexOf("PASS")>=0 || vs.indexOf("CLEAN")>=0 || vs.indexOf("CLEAR")>=0;
                  var clr = isAmt?"#F59E0B":isFail?"#EF4444":isPass?"#10B981":isAg?"#06D6A0":"rgba(255,255,255,0.55)";
                  return <div key={k} style={{padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",minWidth:90,flexShrink:0}}>{k.replace(/([A-Z])/g," $1").trim()}</span>
                    <span style={{fontSize:10,fontWeight:isAmt||isAg?600:400,fontFamily:isAmt||isAg?mono:"inherit",color:clr,textAlign:"right",wordBreak:"break-word"}}>{vs}</span>
                  </div>;
                })}
              </div>
            </div>}
          </div>
        </div>}

        {tab==="controls" && <div style={{flex:1,overflowY:"auto",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#FAFAFA",marginBottom:16}}>Controls: {cfg.name}</div>
          <div style={{marginBottom:20,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8}}>VISIBILITY MANIFEST</div>
            {cfg.parties.map(function(p){return <div key={p.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:C[p.k]}}/>
                <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{p.n}</span>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{p.who}</span>
            </div>;})}
          </div>
          <div style={{marginBottom:20,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8}}>APPROVAL THRESHOLDS</div>
            {[["Under $50K","Single signature"],["$50K-$250K","Dual signature: sponsor + "+cfg.approver],["Over $250K","Committee: "+cfg.approver+" + sponsor + legal"]].map(function(r,i){
              return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <span style={{fontSize:10,fontWeight:600,color:"#F59E0B",fontFamily:mono}}>{r[0]}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"right"}}>{r[1]}</span>
              </div>;
            })}
          </div>
          <div style={{padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:cfg.color,marginBottom:8}}>ENCRYPTION</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>
              {(uc==="skunkworks"||uc==="cyber")
                ? <span><span style={{color:"#06D6A0",fontWeight:600}}>ZERO-KNOWLEDGE ACTIVE</span> - Platform operator cannot decrypt. Customer holds all keys.</span>
                : <span><span style={{color:"#F59E0B",fontWeight:600}}>ZERO-KNOWLEDGE AVAILABLE</span> - Can be enabled without data migration.</span>}
            </div>
          </div>
        </div>}

        {tab==="agents" && <div style={{flex:1,overflowY:"auto",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#FAFAFA",marginBottom:4}}>Agents: {cfg.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:16}}>Same architecture. Config varies by use case.</div>
          {[{n:"Verification",d:cfg.agents.verify,cost:"$0.08",human:"$300-$800"},
            {n:"Budget Review",d:"Benchmark against comparable projects",cost:"$0.15",human:"$2,000-$5,000"},
            {n:"Draw Reconciliation",d:cfg.agents.reconcile,cost:"$0.04",human:"$400-$800"},
            {n:"Anomaly Detection",d:cfg.agents.conflict,cost:"$0.06",human:"Often not caught"},
            {n:"GL Entry",d:cfg.agents.gl,cost:"$0.02",human:"$150-$400"}
          ].map(function(a,i){return <div key={i} style={{marginBottom:10,padding:12,borderRadius:8,background:"rgba(6,214,160,0.02)",border:"1px solid rgba(6,214,160,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:600,color:"#06D6A0"}}>{a.n}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:9,fontFamily:mono,color:"#06D6A0"}}>{a.cost}</span>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.15)"}}>vs</span>
                <span style={{fontSize:9,fontFamily:mono,color:"rgba(239,68,68,0.4)"}}>{a.human}</span>
              </div>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>{a.d}</div>
          </div>;})}
          <div style={{marginTop:16,padding:14,borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"rgba(255,255,255,0.25)",marginBottom:8}}>TOTAL ECONOMICS (5.5 MO)</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Agent cost</span><span style={{fontSize:12,fontWeight:700,color:"#06D6A0",fontFamily:mono}}>$1.84</span></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Human equivalent</span><span style={{fontSize:12,fontWeight:600,color:"rgba(239,68,68,0.5)",fontFamily:mono}}>$8,000-$18,000</span></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:4}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Anomalies caught</span>
              <span style={{fontSize:12,fontWeight:700,color:"#F59E0B",fontFamily:mono}}>{fd(cfg.anomSave)} saved</span>
            </div>
          </div>
        </div>}
      </div>
    </div>

    <div style={{padding:"4px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",flexShrink:0}}>
      <span style={{fontSize:8,color:"rgba(255,255,255,0.1)",fontFamily:mono}}>16 events | 5 agent tasks ($1.84) | zero-knowledge {uc==="skunkworks"||uc==="cyber"?"ACTIVE":"available"} | {fd(cfg.anomSave)} anomalies caught</span>
      <span style={{fontSize:8,color:"rgba(255,255,255,0.08)"}}>arrow keys to navigate</span>
    </div>
    <style>{"::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}*{box-sizing:border-box}"}</style>
  </div>;
}
