import { useState, useRef, useEffect } from "react";

var C = { owner:"#2D7FF9", architect:"#9B6FE8", gc:"#E8553A", sub:"#18A86B", inspector:"#F5A623", lender:"#FF6B9D", system:"#F5A623", both:"#8B95A5" };
var P = { owner:{n:"Homeowner",r:"Principal / Funder"}, architect:{n:"Architect",r:"Design Authority"}, gc:{n:"General Contractor",r:"Construction Manager"}, sub:{n:"Subcontractor",r:"Trade Specialist"}, inspector:{n:"Inspector",r:"Code Authority"}, lender:{n:"Lender",r:"Construction Loan"}, system:{n:"CAST Ledger",r:"Shared Truth"} };
var L = { PROJECT_CREATED:"Project Created",BUDGET_LOCKED:"Budget Locked",ARCHITECT_PLANS:"Plans Approved",PERMIT_ISSUED:"Permit Issued",GC_CONTRACT:"GC Contract Awarded",SUB_CONTRACT:"Sub-Contract Awarded",DRAW_SCHEDULE:"Draw Schedule Set",MILESTONE_COMPLETED:"Milestone Completed",INSPECTION_PASSED:"Inspection Passed",DRAW_REQUEST:"Draw Request",DRAW_APPROVED:"Draw Approved (Dual-Sig)",DRAW_FUNDED:"Draw Funded",CHANGE_ORDER:"Change Order",CHANGE_ORDER_BLOCKED:"Change Order BLOCKED",LIEN_WAIVER:"Lien Waiver Filed",FINAL_INSPECTION:"Final Inspection",PROJECT_COMPLETE:"Project Complete",DONOR_REPORT:"Donor / Lender Report" };

function fd(n){return "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function ft(iso){var d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}
function getAmt(d){return d.amount||d.totalBudget||d.contractAmount||d.drawAmount||d.fundedAmount||d.changeAmount||null;}
function renderVal(k,v){
  if(v==null)return "-";if(typeof v==="boolean")return v?"Yes":"No";
  if(Array.isArray(v))return v.join(", ");if(typeof v==="object")return JSON.stringify(v);
  var kl=(k||"").toLowerCase();
  if(typeof v==="number"){
    if(kl.indexOf("rate")>=0&&v<1)return(v*100).toFixed(1)+"%";
    if(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("price")>=0||kl.indexOf("funded")>=0||kl.indexOf("balance")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("remaining")>=0||kl.indexOf("draw")>=0||kl.indexOf("total")>=0||k==="amount")return fd(v);
  }
  return String(v);
}
function vc(k,v){
  var kl=(k||"").toLowerCase();
  if(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("price")>=0||kl.indexOf("funded")>=0||kl.indexOf("balance")>=0||kl.indexOf("draw")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("total")>=0||kl.indexOf("remaining")>=0)return"#F5A623";
  if(kl.indexOf("blocked")>=0||kl.indexOf("high")>=0||kl.indexOf("flagged")>=0||kl.indexOf("denied")>=0)return"#E8553A";
  if(kl.indexOf("hash")>=0)return"#9B6FE8";
  if(kl.indexOf("pass")>=0||v===true)return"#18A86B";
  return"#E8E8ED";
}
var mono="'IBM Plex Mono',monospace";

// ═══════════════════════════════════════
// EVENTS: $285K Home Addition
// The Rodriguez family is adding a second story to their 1960s ranch.
// Partially funded by a $200K construction loan, $85K cash from savings.
// ═══════════════════════════════════════
var EV=[
  {id:"R001",ts:"2026-03-01T10:00:00Z",tp:"PROJECT_CREATED",pa:"owner",vi:["owner","architect","gc","lender"],d:{projectName:"Rodriguez Second-Story Addition",address:"4217 Magnolia Dr, Charleston SC",description:"1,200 sq ft second-story addition to existing single-story ranch",estimatedCost:285000,fundingSources:"Construction loan ($200K) + Owner cash ($85K)",ownerName:"Maria & Carlos Rodriguez",startTarget:"May 2026"},h:"r001a1",ph:"000000",si:["owner.sig"]},
  {id:"R002",ts:"2026-03-15T14:00:00Z",tp:"ARCHITECT_PLANS",pa:"architect",vi:["owner","architect","gc","inspector","lender"],d:{architectFirm:"Lowcountry Design Studio",principalArchitect:"Elaine Park, AIA",planSetId:"PLAN-ROD-2026-001",sqFootage:1200,rooms:"3 bedrooms, 2 bathrooms, hallway, staircase",structuralEngineer:"Reeves Structural PE",engineeringApproved:true,planCostIncluded:18500},h:"r002b2",ph:"r001a1",si:["architect.sig","structural-engineer.sig"]},
  {id:"R003",ts:"2026-03-28T09:00:00Z",tp:"PERMIT_ISSUED",pa:"inspector",vi:["owner","architect","gc","inspector","lender"],d:{permitNumber:"BLD-2026-04217",issuedBy:"Charleston County Building Dept",permitType:"Residential Addition",zoningCompliance:"PASS",floodZoneCheck:"PASS",setbackCompliance:"PASS",feePaid:2850,estimatedInspections:6},h:"r003c3",ph:"r002b2",si:["county-building.sig"]},
  {id:"R004",ts:"2026-04-05T11:00:00Z",tp:"BUDGET_LOCKED",pa:"both",vi:["owner","architect","gc","lender"],d:{totalBudget:285000,constructionLoan:200000,ownerCash:85000,contingency:28500,contingencyPct:0.10,architectFees:18500,gcFees:38000,laborMaterials:171500,permits:2850,inspections:4200,insurance:3200,gcOverhead:18250,lineItems:12,bidsCollected:3},h:"r004d4",ph:"r003c3",si:["owner.sig","architect.sig","lender.sig"]},
  {id:"R005",ts:"2026-04-10T10:00:00Z",tp:"GC_CONTRACT",pa:"owner",vi:["owner","gc","lender"],d:{contractorName:"Coastal Build Co LLC",contractId:"GC-ROD-2026",contractAmount:227750,contractType:"Fixed price with allowances",license:"SC-RBC-14822",insuranceVerified:true,bondAmount:227750,bondVerified:true,warrantyYears:2,procurementMethod:"3-bid competitive",bidsReceived:[{name:"Coastal Build Co",amount:227750},{name:"Palmetto Construction",amount:248900},{name:"Harbor Builders",amount:261500}],selectionReason:"Lowest qualified bid + best references"},h:"r005e5",ph:"r004d4",si:["owner.sig","gc.sig","lender.sig"]},
  {id:"R006",ts:"2026-04-12T09:00:00Z",tp:"SUB_CONTRACT",pa:"gc",vi:["owner","gc","sub"],d:{subcontractorName:"Titan Structural Steel",subContractId:"SUB-STEEL-001",trade:"Structural steel framing",amount:42000,parentContract:"GC-ROD-2026",licenseVerified:true,insuranceVerified:true,scope:"Steel beam installation, second-floor joists, staircase framing"},h:"r006f6",ph:"r005e5",si:["gc.sig","sub-titan.sig"]},
  {id:"R007",ts:"2026-04-12T09:30:00Z",tp:"SUB_CONTRACT",pa:"gc",vi:["owner","gc","sub"],d:{subcontractorName:"LowCountry Electric",subContractId:"SUB-ELEC-001",trade:"Electrical rough-in + finish",amount:28500,parentContract:"GC-ROD-2026",licenseVerified:true,insuranceVerified:true,scope:"Panel upgrade, 24 circuits, 48 outlets, 16 fixtures, 2 HVAC circuits"},h:"r007g7",ph:"r006f6",si:["gc.sig","sub-electric.sig"]},
  {id:"R008",ts:"2026-04-12T10:00:00Z",tp:"DRAW_SCHEDULE",pa:"lender",vi:["owner","gc","lender"],d:{loanId:"CL-2026-ROD-04217",totalDraws:5,schedule:[{draw:1,milestone:"Foundation + Steel",pct:0.20,amount:40000},{draw:2,milestone:"Framing + Roof Dry-In",pct:0.25,amount:50000},{draw:3,milestone:"Mechanical Rough-In",pct:0.20,amount:40000},{draw:4,milestone:"Drywall + Finishes",pct:0.20,amount:40000},{draw:5,milestone:"Final / CO",pct:0.15,amount:30000}],inspectionRequired:true,drawCondition:"Inspector sign-off + lien waivers from all subs"},h:"r008h8",ph:"r007g7",si:["lender.sig","owner.sig"]},
  {id:"R009",ts:"2026-05-15T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"gc",vi:["owner","architect","gc","sub","inspector","lender"],d:{milestone:"Foundation + Steel",drawNumber:1,description:"Existing roof removed, steel beams installed, second-floor joists set, temporary weather protection",completionPhotos:28,photoHashBundle:"ph:9a:b2:c4:d7:e1:f3",laborHours:320,materialsDelivered:"14 steel beams, 48 joists, 2400 lbs fasteners",weatherDelayDays:3,actualVsBudget:"On track"},h:"r009i9",ph:"r008h8",si:["gc.sig","sub-titan.sig","site-super.sig"]},
  {id:"R010",ts:"2026-05-16T09:00:00Z",tp:"INSPECTION_PASSED",pa:"inspector",vi:["owner","architect","gc","inspector","lender"],d:{inspectionType:"Structural / Foundation",inspectorName:"James Whitfield, PE",inspectorLicense:"SC-PE-8841",permitRef:"BLD-2026-04217",result:"PASS",notes:"Steel connections verified, joist spacing confirmed, load path continuous",deficienciesFound:0,photosAttached:8,photoHash:"ip:3c:d8:e2:f9"},h:"r010j0",ph:"r009i9",si:["inspector.sig","county-building.sig"]},
  {id:"R011",ts:"2026-05-16T10:00:00Z",tp:"LIEN_WAIVER",pa:"sub",vi:["owner","gc","lender"],d:{subcontractor:"Titan Structural Steel",waiverId:"LW-TITAN-001",throughDate:"2026-05-15",amountCovered:42000,waiverType:"Conditional - through Draw 1",remainingOwed:0,notarized:true},h:"r011k1",ph:"r010j0",si:["sub-titan.sig","notary.sig"]},
  {id:"R012",ts:"2026-05-17T11:00:00Z",tp:"DRAW_REQUEST",pa:"gc",vi:["owner","gc","lender"],d:{drawNumber:1,milestone:"Foundation + Steel",requestedAmount:40000,inspectionRef:"R010",lienWaiverRefs:["R011"],budgetLineReconciliation:"Steel $42K complete, foundation $12K complete = $54K work / $40K draw",retainage:0,budgetCheck:"PASS",scheduleCheck:"3 days behind (weather) - within tolerance"},h:"r012l2",ph:"r011k1",si:["gc.sig"],pc:["R004 Budget > R005 Contract > R006 Sub > R009 Work > R010 Inspection > R011 Lien Waiver > R012 Draw Request"]},
  {id:"R013",ts:"2026-05-17T15:00:00Z",tp:"DRAW_APPROVED",pa:"both",vi:["owner","gc","lender"],d:{drawNumber:1,amount:40000,approver1:"Maria Rodriguez (Owner)",approver2:"First Federal Construction Lending",approvalMethod:"Dual-sig: owner + lender",inspectionVerified:true,lienWaiversVerified:true,budgetOnTrack:true,fundsSource:"Construction loan CL-2026-ROD-04217"},h:"r013m3",ph:"r012l2",si:["owner.sig","lender.sig"]},
  {id:"R014",ts:"2026-05-18T08:00:00Z",tp:"DRAW_FUNDED",pa:"lender",vi:["owner","gc","lender"],d:{drawNumber:1,fundedAmount:40000,payee:"Coastal Build Co LLC",method:"Wire transfer",bankRef:"WIRE-20260518-FF-9922",loanBalance:160000,loanRemaining:160000,totalFundedToDate:40000,projectPctComplete:0.20},h:"r014n4",ph:"r013m3",si:["lender.sig","bank.auto.sig"]},
  {id:"R-CO1",ts:"2026-06-20T14:00:00Z",tp:"CHANGE_ORDER_BLOCKED",pa:"gc",vi:["owner","architect","gc","lender"],d:{changeOrderId:"CO-001",requestedBy:"Coastal Build Co (site supervisor)",description:"Upgrade to spray foam insulation - existing batt insufficient for energy code",requestedAmount:8200,flaggedRisk:"REVIEW REQUIRED - exceeds $5K threshold without architect approval",architectApproval:"PENDING",codeJustification:"Not verified - 2024 energy code may not require spray foam for addition",ownerNotified:true,lenderNotified:true,autoHold:"Change orders >$5K require architect verification + owner approval before release"},h:"rco1p1",ph:"r014n4",si:["system.auto.sig"]},
  {id:"R-CO2",ts:"2026-06-21T10:00:00Z",tp:"CHANGE_ORDER",pa:"architect",vi:["owner","architect","gc","lender"],d:{changeOrderId:"CO-001-REVISED",originalRequest:"Spray foam upgrade - $8,200",architectReview:"R-2 insulation requirement met by fiberglass batts. Spray foam NOT required by code.",architectRecommendation:"Upgrade beneficial but optional. If desired, competitive pricing should be obtained.",revisedScope:"Owner elected partial spray foam for rim joists only",revisedAmount:2400,savings:5800,approvedBy:"Elaine Park, AIA + Maria Rodriguez",contingencyUsed:2400,contingencyRemaining:26100},h:"rco2q2",ph:"rco1p1",si:["architect.sig","owner.sig"]},
  {id:"R015",ts:"2026-07-10T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"gc",vi:["owner","architect","gc","sub","inspector","lender"],d:{milestone:"Framing + Roof Dry-In",drawNumber:2,description:"Wall framing complete, roof trusses set, sheathing and underlayment installed, windows rough-framed",completionPhotos:42,photoHashBundle:"ph:2b:c5:d8:e3:f6:a1",laborHours:480,weatherDelayDays:0,actualVsBudget:"$2,400 change order (rim joist spray foam) - within contingency"},h:"r015o5",ph:"rco2q2",si:["gc.sig","site-super.sig"]},
  {id:"R016",ts:"2026-07-11T09:00:00Z",tp:"INSPECTION_PASSED",pa:"inspector",vi:["owner","architect","gc","inspector","lender"],d:{inspectionType:"Framing + Sheathing",inspectorName:"James Whitfield, PE",result:"PASS",notes:"Framing per approved plans, hurricane clips verified, window headers sized correctly",deficienciesFound:0,photosAttached:12},h:"r016r6",ph:"r015o5",si:["inspector.sig"]},
  {id:"R017",ts:"2026-07-12T11:00:00Z",tp:"DRAW_REQUEST",pa:"gc",vi:["owner","gc","lender"],d:{drawNumber:2,milestone:"Framing + Roof Dry-In",requestedAmount:50000,inspectionRef:"R016",lienWaiverRefs:["LW-COASTAL-002","LW-LUMBER-001"],budgetCheck:"PASS",changeOrderAdjustment:2400,cumulativeDrawn:90000,remainingBudget:195000},h:"r017s7",ph:"r016r6",si:["gc.sig"],pc:["R004 Budget > R005 Contract > R015 Work > R016 Inspection > Lien Waivers > R017 Draw Request"]},
  {id:"R018",ts:"2026-07-12T16:00:00Z",tp:"DRAW_APPROVED",pa:"both",vi:["owner","gc","lender"],d:{drawNumber:2,amount:50000,approver1:"Carlos Rodriguez (Owner)",approver2:"First Federal Construction Lending",dualSigVerified:true,cumulativeFunded:90000,projectPctComplete:0.45},h:"r018t8",ph:"r017s7",si:["owner.sig","lender.sig"]},
  {id:"R019",ts:"2026-07-13T08:00:00Z",tp:"DRAW_FUNDED",pa:"lender",vi:["owner","gc","lender"],d:{drawNumber:2,fundedAmount:50000,method:"Wire transfer",bankRef:"WIRE-20260713-FF-3318",loanBalance:110000,totalFundedToDate:90000,projectPctComplete:0.45},h:"r019u9",ph:"r018t8",si:["lender.sig","bank.auto.sig"]},
  {id:"R020",ts:"2026-10-15T10:00:00Z",tp:"FINAL_INSPECTION",pa:"inspector",vi:["owner","architect","gc","inspector","lender"],d:{inspectionType:"Final / Certificate of Occupancy",inspectorName:"James Whitfield, PE",result:"PASS",certificateOfOccupancy:"CO-2026-04217",allInspectionsPassed:"6 of 6",finalDeficiencies:0,notes:"All work per approved plans. Structure sound. MEP systems operational. CO issued."},h:"r020v0",ph:"r019u9",si:["inspector.sig","county-building.sig"]},
  {id:"R021",ts:"2026-10-20T14:00:00Z",tp:"PROJECT_COMPLETE",pa:"system",vi:["owner","architect","gc","sub","inspector","lender"],d:{projectName:"Rodriguez Second-Story Addition",totalBudget:285000,totalSpent:262400,underBudget:22600,changeOrders:1,changeOrderTotal:2400,contingencyUsed:2400,contingencyReturned:26100,drawsFunded:5,allLienWaiversFiled:true,allInspectionsPassed:true,warrantyStart:"2026-10-15",warrantyEnd:"2028-10-15",daysToComplete:168,daysOverEstimate:8,finalPhotos:24,photoHash:"fp:8a:c3:d5:e7:f2"},h:"r021w1",ph:"r020v0",si:["system.auto.sig","gc.sig","owner.sig","lender.sig"],pc:["R001 Project > R004 Budget > R005 Contract > 5 Draws (all inspected) > R020 Final > R021 Complete"]},
  {id:"R022",ts:"2026-10-21T09:00:00Z",tp:"DONOR_REPORT",pa:"system",vi:["owner","lender"],d:{reportType:"Construction Loan Final Reconciliation",totalLoanFunded:200000,ownerCashContributed:62400,totalProjectCost:262400,underOriginalBudget:22600,savingsReturnedTo:"Owner (contingency not used)",changeOrders:1,changeOrderNet:2400,allSubsPaid:true,allLienWaiversClear:true,fraudAlertsTriggered:1,fraudAlertOutcome:"Change order held for architect review - saved owner $5,800",certificateOfOccupancy:"CO-2026-04217",loanToValue:"Compliant",warrantyActive:true},h:"r022x2",ph:"r021w1",si:["system.auto.sig","lender.sig"]},
];

var ST=[
  {ph:"context",ti:"The Problem",su:"$285,000. Three bids. One family. Zero visibility after signing.",na:"Maria and Carlos Rodriguez are adding a second story to their Charleston ranch house. $285,000 budget - $200K construction loan, $85K from savings. They hired a licensed contractor, got three bids, did everything right. And now they have no idea where their money is going.\n\nThis is a $420 billion annual market. Home renovation is the single largest financial transaction most families make after buying the house itself. And the accountability infrastructure is: a contract, a handshake, and hope.",sq:null,wc:null,hl:[],fo:null,va:"owner"},
  {ph:"project",ti:"The Project",su:"Plans approved, permit issued, budget locked - the ledger begins.",na:"The architect delivers stamped plans. The county issues a permit. The budget is locked with all parties signing: owner, architect, and lender. Every dollar is now traceable from this moment forward.\n\nThe budget isn't a spreadsheet on someone's laptop. It is the first event in a cryptographic chain. Every future draw, every subcontract, every change order will reference back to this ratified budget.",sq:{t:"Today: The budget disappears the day after signing",it:["The contractor provides a line-item estimate. You sign. The estimate goes in a drawer.","Three months later: 'We need another $12,000 for electrical.' Is that real? You have no way to know.","The lender requires draw inspections but only verifies completion - not cost.","Change orders arrive verbally. 'The inspector said we need spray foam.' Did the inspector actually say that?","By the end, 73% of renovation projects exceed budget. Homeowners blame themselves for not managing better."]},wc:{t:"Budget locked on-chain - every party signed, every line item traceable",de:"R001: Project created with scope and funding sources. R002: Architect plans stamped and engineering-approved. R003: Permit issued with all compliance checks passed. R004: Budget locked with 10% contingency, 3 bids documented, all 12 line items visible to owner and lender."},hl:["R001","R002","R003","R004"],fo:"R004",va:"owner"},
  {ph:"contract",ti:"Hiring the Builder",su:"3 bids. Fixed price. License, insurance, and bond - all verified on-chain.",na:"Coastal Build Co wins the contract at $227,750 - lowest of three qualified bids. Their license, insurance, and surety bond are verified as ledger events, not as photocopies in a folder. The subcontractors are also on-chain: Titan Structural Steel ($42K) and LowCountry Electric ($28.5K).",sq:{t:"Today: You're trusting a license number on a business card",it:["You check the contractor's license online - if you know where to look. Most homeowners don't.","Insurance 'verification' means the contractor showed you a certificate. It could be expired tomorrow.","Subcontractors are invisible. You don't know who's actually working on your house.","The contractor's bid is the last time you see line-item detail until something goes wrong.","If the contractor goes bankrupt mid-project, you discover the subs were never paid."]},wc:{t:"License, insurance, bond verified as events. Subs visible. All 3 bids on-chain.",de:"R005: GC contract with all 3 bids recorded - not just the winner. License SC-RBC-14822, insurance verified, $227K bond verified. R006-R007: Sub-contracts for steel and electrical visible to the owner. Toggle to Subcontractor view - they see their own scope and the GC contract but not the lender terms."},hl:["R005","R006","R007"],fo:"R005",va:"owner"},
  {ph:"draws",ti:"The Draw Schedule",su:"5 milestones. Inspector sign-off required. No work, no money.",na:"The lender sets up 5 draws tied to construction milestones. Each draw requires: work completion with photos, an independent inspection, and lien waivers from every sub who worked that phase. No milestone, no draw. No inspection, no draw. No lien waiver, no draw.\n\nThis is the structural control that makes fraud impossible. Money cannot move without verified work.",sq:{t:"Today: The contractor asks for money and you guess whether the work justifies it",it:["Draw 1: 'Foundation is done, I need $40K.' You look at a hole in the ground. Is that worth $40K?","The lender sends an inspector who drives by, checks a box, and approves the draw.","Subs don't get paid until the GC decides to pay them. You have no visibility.","By draw 3, you've released $130K and the project looks maybe 40% done. Is that right?","Mechanic's liens: a sub you never met files a lien on your house because the GC didn't pay them."]},wc:{t:"5 draws, each requiring: completion photos + inspection + lien waivers + dual-sig",de:"R008: Draw schedule with specific milestones and amounts. Each draw follows the chain: milestone completion (R009) > inspection pass (R010) > lien waiver (R011) > draw request with provenance chain (R012) > dual-sig approval by owner AND lender (R013) > wire funded (R014). The owner sees every step in real time."},hl:["R008","R009","R010","R011","R012","R013","R014"],fo:"R008",va:"owner"},
  {ph:"milestone1",ti:"First Draw",su:"$40,000 released - but only after steel verified, inspection passed, liens cleared.",na:"Structural steel is in. Titan Steel files a lien waiver confirming they've been paid. Inspector James Whitfield verifies the steel connections. Only then does the draw request generate. Maria and the lender both sign. Wire goes out.\n\nEvery dollar in this $40,000 traces from the locked budget through the contract, through the sub-contract, through verified work, through an independent inspection, through a filed lien waiver, to the dual-signature release.",sq:null,wc:{t:"The complete provenance chain for a single $40,000 draw",de:"Follow the chain: R004 (budget) > R005 (GC contract) > R006 (steel sub-contract) > R009 (work completion with 28 photos) > R010 (structural inspection PASS) > R011 (lien waiver filed and notarized) > R012 (draw request with reconciliation) > R013 (dual-sig: owner + lender) > R014 (wire funded, loan balance updated). Every event is visible to the owner."},hl:["R009","R010","R011","R012","R013","R014"],fo:"R012",va:"owner"},
  {ph:"changeorder",ti:"The Change Order",su:"$8,200 request held. Architect review saves $5,800.",na:"Mid-project, the GC's site supervisor requests an $8,200 change order for spray foam insulation, claiming the building inspector requires it for energy code compliance. In a traditional renovation, this gets approved over the phone.\n\nHere, the system holds it. Change orders over $5,000 require architect verification before release.",sq:{t:"Today: Change orders are where renovation fraud lives",it:["The GC says: 'Inspector requires spray foam. That's $8,200.' You're not an insulation expert.","You call the inspector. He says he mentioned spray foam as an option, not a requirement.","But by then you've already approved it verbally. Or worse, you never called.","Padding change orders is the #1 source of contractor profit above the bid.","Industry data: homeowners approve 80% of change orders without independent verification.","Average renovation: 3-5 change orders adding 15-25% to the original budget."]},wc:{t:"Auto-held at $5K threshold. Architect reviews. Saves owner $5,800.",de:"R-CO1: System auto-flags - exceeds $5K threshold, no architect approval. Hold placed. Owner AND lender notified. R-CO2: Architect Elaine Park reviews - fiberglass batts meet code. Spray foam optional. Owner elects partial upgrade for rim joists only at $2,400 instead of $8,200. The system saved the Rodriguez family $5,800 on a single change order."},hl:["R-CO1","R-CO2"],fo:"R-CO1",va:"owner"},
  {ph:"progress",ti:"The Build Continues",su:"Draw 2: framing + roof. Same chain. Same proof. Same dual-sig.",na:"Framing and roof dry-in complete. 42 completion photos. Inspection passed. Lien waivers filed. Draw 2 for $50,000 follows the identical chain. Cumulative funded: $90,000. Project 45% complete.\n\nThe pattern is now clear: no work happens in the dark. Every milestone follows the same provenance chain.",sq:null,wc:{t:"Draw 2 follows the identical provenance pattern",de:"R015: Framing complete with 42 photos. R016: Inspection passed - hurricane clips, headers, sheathing all verified. R017: Draw request with cumulative accounting - $90K drawn, $195K remaining, change order adjustment tracked. R018: Dual-sig (Carlos signs this time). R019: Wire funded. The lender sees the loan balance in real time."},hl:["R015","R016","R017","R018","R019"],fo:"R017",va:"lender"},
  {ph:"complete",ti:"Project Complete",su:"$262,400 total. $22,600 under budget. Every dollar traced.",na:"Certificate of Occupancy issued. All 6 inspections passed. All subs paid. All lien waivers filed. Total cost: $262,400 - $22,600 under the original $285,000 budget. The $2,400 change order was the only contingency used. $26,100 in unused contingency returns to the Rodriguezes.\n\n168 days, 5 draws, 1 change order (caught and reduced), zero disputes.",sq:{t:"Today: The project ends and you hope the math works out",it:["Final cost: somewhere between what the contractor says and what you can verify. Usually the contractor's number.","Warranty? The contractor promises 2 years. Enforcing it requires proving defects.","Lien risk: for 90 days after completion, unpaid subs can still file liens on your house.","The lender closes the construction loan. The reconciliation is: 'draws funded = loan amount.' That's it.","You have a folder of receipts, some photos on your phone, and a general sense that it went okay."]},wc:{t:"Final reconciliation computed from the event chain - not assembled from receipts",de:"R020: Final inspection - CO issued, all 6 inspections passed. R021: Project complete - $262,400 spent, $22,600 under budget, 1 change order ($2,400), all liens cleared, warranty active through Oct 2028. R022: Final lender report - every draw traced, fraud alert documented (change order held, saved $5,800), loan-to-value compliant."},hl:["R020","R021","R022"],fo:"R021",va:"owner"},
  {ph:"visibility",ti:"Every Party's View",su:"Same ledger. Different visibility. Toggle and see.",na:"The Rodriguezes see everything - it's their money, their house. The lender sees draws, inspections, and loan accounting but not sub-contract details. The GC sees their contract and work but not the lender's terms. Subcontractors see only events they're party to.\n\nToggle the 'Viewing As' switcher in the top right. Watch events encrypt and decrypt. This is field-level access control - the same architecture that protects individual payroll in the HOA product.",sq:null,wc:{t:"Toggle Viewing As to see each party's perspective",de:"Owner: sees all 23 events. Lender: sees draws, inspections, budget, completion - but R006/R007 sub-contracts show encrypted (not their business how the GC staffs the job). GC: sees their contract, subs, work - but lender terms encrypted. Subcontractor: sees only their sub-contract and the milestone events they participated in. Inspector: sees plans, permits, and inspections only."},hl:["R001","R005","R006","R008","R014"],fo:"R005",va:"lender"},
  {ph:"thesis",ti:"Why This Matters",su:"$420 billion in renovations. Zero accountability infrastructure. Until now.",na:"The Rodriguez addition is one of 500,000 home renovation projects over $100K happening this year. In 73% of them, the homeowner will exceed their budget. In many, change orders will add 15-25% to the original bid. In some, contractors will disappear mid-project with draws already funded.\n\nCAST doesn't require the homeowner to become a construction expert. It requires the construction process to prove itself. Every milestone photographed and inspected. Every draw traced from budget to disbursement. Every change order verified by the architect before release. Every sub-payment confirmed by lien waiver.\n\nThe Rodriguezes didn't manage their project better. They used a system that made mismanagement structurally impossible.\n\nThis is the same architecture that governs HOA budgets, commercial property CAM reconciliations, and PE portfolio company reporting. The provenance chain is identical. Only the parties change.",sq:null,wc:null,hl:[],fo:null,va:"owner"},
];

var NS;

// ═══════════════════════════════════════
// PROVENANCE DATA
// ═══════════════════════════════════════
var PROV=[
  {pay:"Draw 1: Foundation + Steel",amt:40000,vendor:"Coastal Build Co",chain:["R004 Budget","R005 GC Contract","R006 Sub-Steel","R009 Work Done","R010 Inspection","R011 Lien Waiver","R012 Draw Req","R013 Dual-Sig","R014 Wire"],status:"Funded"},
  {pay:"Draw 2: Framing + Roof",amt:50000,vendor:"Coastal Build Co",chain:["R004 Budget","R005 Contract","R015 Work Done","R016 Inspection","Lien Waivers","R017 Draw Req","R018 Dual-Sig","R019 Wire"],status:"Funded"},
  {pay:"Draws 3-5 (Mechanical/Finishes/Final)",amt:110000,vendor:"Coastal Build Co",chain:["R004 Budget","R005 Contract","(Milestones)","(Inspections)","(Lien Waivers)","(Draw Reqs)","(Dual-Sigs)","(Wires)"],status:"Funded"},
  {pay:"Change Order: Insulation",amt:2400,vendor:"Coastal Build Co",chain:["R-CO1 Requested $8,200","SYSTEM: >$5K Hold","R-CO2 Architect Review","Scope Reduced","Owner Approved","$5,800 SAVED"],status:"Revised",note:"System caught $5,800 in unnecessary cost"},
  {pay:"Final: Owner Cash Contribution",amt:62400,vendor:"(Direct)",chain:["R004 Budget $85K Cash","Less: Contingency Return $22,600","Net Owner Cash: $62,400"],status:"Complete"},
];

// ═══════════════════════════════════════
// BUDGET DATA
// ═══════════════════════════════════════
var BUDGET_DATA = [
  {cat:"FUNDING SOURCES",sec:true},
  {cat:"  Construction Loan (First Federal)",ann:200000,spent:200000},
  {cat:"  Owner Cash",ann:85000,spent:62400},
  {cat:"  Total Funding",sec:true,sum:"fund"},
  {cat:"",sec:false},
  {cat:"PROJECT COSTS",sec:true},
  {cat:"  Architect & Engineering",ann:18500,spent:18500},
  {cat:"  Structural Steel (Titan)",ann:42000,spent:42000},
  {cat:"  Electrical (LowCountry)",ann:28500,spent:28500},
  {cat:"  Plumbing",ann:22000,spent:21200},
  {cat:"  HVAC",ann:18000,spent:17500},
  {cat:"  Framing & Carpentry",ann:31000,spent:31000},
  {cat:"  Roofing & Weatherproofing",ann:16000,spent:15800},
  {cat:"  Drywall & Paint",ann:14000,spent:13900},
  {cat:"  Flooring & Finishes",ann:18500,spent:17600},
  {cat:"  Permits & Inspections",ann:7050,spent:7050},
  {cat:"  GC Overhead & Profit",ann:18250,spent:18250},
  {cat:"  Insurance",ann:3200,spent:3200},
  {cat:"  Total Construction",sec:true,sum:"cost"},
  {cat:"",sec:false},
  {cat:"CONTINGENCY",sec:true},
  {cat:"  Original Contingency (10%)",ann:28500,spent:0},
  {cat:"  Change Order: Rim Joist Spray Foam",ann:0,spent:2400},
  {cat:"  Net Contingency Used",sec:true,sum:"cont"},
  {cat:"",sec:false},
  {cat:"TOTAL PROJECT COST",sec:true,sum:"total"},
  {cat:"",sec:false},
  {cat:"SAVINGS RETURNED TO OWNER",sec:true,sum:"savings"},
];

// ═══════════════════════════════════════
// COMPONENTS (reusing HOA architecture)
// ═══════════════════════════════════════

function EvCard(props){
  var ev=props.ev;if(!ev)return null;
  var amt=getAmt(ev.d);var canSee=ev.vi.indexOf(props.viewAs)>=0;
  var blk=ev.tp.indexOf("BLOCKED")>=0;
  var isChange=ev.tp.indexOf("CHANGE")>=0;
  var isDraw=ev.tp.indexOf("DRAW")>=0;
  var isMilestone=ev.tp.indexOf("MILESTONE")>=0||ev.tp.indexOf("INSPECTION")>=0;
  var isFinal=ev.tp.indexOf("FINAL")>=0||ev.tp.indexOf("COMPLETE")>=0;
  var pfx=blk?"[HELD] ":isChange?"[CHANGE] ":"";
  if(!canSee)return(
    <div onClick={props.onClick} style={{padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",opacity:0.3,background:props.sel?"rgba(255,255,255,0.04)":"transparent"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{ev.id}</span>
          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.2)",fontWeight:600}}>ENCRYPTED</span>
        </div>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.1)"}}>{ft(ev.ts).split(" ")[0]}</span>
      </div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.12)",marginTop:2}}>No visibility - outside your access</div>
    </div>
  );
  return(
    <div onClick={props.onClick} style={{padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",background:props.sel?"rgba(245,166,35,0.06)":props.hlt?"rgba(255,255,255,0.02)":"transparent",borderLeft:props.hlt?"2px solid #F5A623":"2px solid transparent",transition:"all 0.15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
          <span style={{width:5,height:5,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
        </div>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>{ft(ev.ts)}</span>
      </div>
      <div style={{fontSize:11,fontWeight:600,marginTop:3,color:blk?"#E8553A":"#E8E8ED"}}>{pfx}{L[ev.tp]||ev.tp}</div>
      {amt&&<div style={{fontSize:10,color:"#F5A623",fontWeight:600,fontFamily:mono,marginTop:2}}>{fd(amt)}</div>}
      <div style={{display:"flex",gap:3,marginTop:4}}>
        {ev.vi.map(function(pk){
          var me=pk===props.viewAs;
          return <span key={pk} style={{width:5,height:5,borderRadius:"50%",background:C[pk]||"#444",opacity:me?1:0.3}}/>;
        })}
      </div>
    </div>
  );
}

function EvDetail(props){
  var ev=props.ev;var viewAs=props.viewAs;
  if(!ev)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"rgba(255,255,255,0.15)",fontSize:12}}>Select an event</div>;
  var canSee=ev.vi.indexOf(viewAs)>=0;
  if(!canSee)return(
    <div style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16}}>
      <div style={{fontSize:40,opacity:0.15}}>&#128274;</div>
      <div style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.3)"}}>Viewing as {(P[viewAs]||{}).n}</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.15)",textAlign:"center",maxWidth:280}}>This event is not in your visibility manifest.</div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.1)",textAlign:"center"}}>Parties with access: {ev.vi.map(function(v){return(P[v]||{}).n||v;}).join(", ")}</div>
      <div style={{padding:"8px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,fontFamily:mono,fontSize:9,color:"rgba(255,255,255,0.12)"}}>AES-256-GCM | payload encrypted</div>
    </div>
  );
  var entries=Object.entries(ev.d).map(function(e){return{k:e[0],v:e[1]};});
  return(
    <div style={{padding:18,overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
          <span style={{width:6,height:6,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{(P[ev.pa]||{}).n}</span>
        </div>
        <div style={{fontSize:16,fontWeight:700,color:ev.tp.indexOf("BLOCKED")>=0?"#E8553A":"#E8E8ED"}}>{L[ev.tp]||ev.tp}</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:2}}>{ft(ev.ts)}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:14,marginBottom:14}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Visibility ({ev.vi.length} parties)</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{ev.vi.map(function(pk){
          var info=P[pk]||{n:pk};var me=pk===viewAs;
          return <div key={pk} style={{display:"flex",alignItems:"center",gap:5,background:me?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",border:"1px solid "+(me?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.06)"),borderRadius:5,padding:"5px 8px"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C[pk]||"#666"}}/>
            <span style={{fontSize:10,fontWeight:600,color:"#E8E8ED"}}>{info.n}</span>
            {me&&<span style={{fontSize:7,background:"rgba(255,255,255,0.1)",padding:"1px 4px",borderRadius:2,fontWeight:700}}>YOU</span>}
          </div>;
        })}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:14,marginBottom:14}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Hash Chain</div>
        <div style={{fontFamily:mono,fontSize:11,color:"rgba(255,255,255,0.45)"}}>
          <span style={{background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:4,border:"1px solid rgba(255,255,255,0.08)"}}>prev: {ev.ph}</span>
          <span style={{margin:"0 6px",color:"rgba(255,255,255,0.12)"}}>{">"}</span>
          <span style={{background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:4,border:"1px solid rgba(255,255,255,0.08)"}}>this: {ev.h}</span>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:14,marginBottom:14}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Signatures ({ev.si.length})</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{ev.si.map(function(sig,idx){
          var isA=sig.indexOf("auto")>=0||sig.indexOf("county")>=0||sig.indexOf("bank")>=0||sig.indexOf("notary")>=0;
          return <span key={idx} style={{background:isA?"rgba(155,111,232,0.1)":"rgba(45,127,249,0.1)",border:"1px solid "+(isA?"rgba(155,111,232,0.25)":"rgba(45,127,249,0.25)"),borderRadius:3,padding:"2px 7px",fontSize:10,color:isA?"#B89AEF":"#6BA3F9",fontFamily:mono}}>{sig}</span>;
        })}</div>
      </div>
      {ev.pc&&<div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(245,166,35,0.15)",padding:14,marginBottom:14}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Provenance Chain</div>
        {ev.pc.map(function(ch,i){return <div key={i} style={{fontFamily:mono,fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.8}}>{ch}</div>;})}
      </div>}
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:14}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Event Data</div>
        {entries.map(function(e){
          var val=e.v;
          if(Array.isArray(val)&&val.length>0&&typeof val[0]==="object"){
            return <div key={e.k} style={{padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono,marginBottom:4}}>{e.k}</div>
              {val.map(function(item,idx){return <div key={idx} style={{fontSize:10,color:"#E8E8ED",marginLeft:12,lineHeight:1.6}}>{typeof item==="object"?Object.entries(item).map(function(kv){return kv[0]+": "+renderVal(kv[0],kv[1]);}).join(" | "):String(item)}</div>;})}
            </div>;
          }
          return <div key={e.k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",gap:10}}>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono,flexShrink:0}}>{e.k}</span>
            <span style={{fontSize:11,textAlign:"right",wordBreak:"break-all",maxWidth:"65%",color:vc(e.k,e.v)}}>{renderVal(e.k,e.v)}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

function BudgetView(){
  var fundItems=BUDGET_DATA.filter(function(r){return r.cat.indexOf("Construction Loan")>=0||r.cat.indexOf("Owner Cash")>=0;});
  var costItems=BUDGET_DATA.filter(function(r){return r.ann && !r.sec && r.cat.indexOf("Loan")<0 && r.cat.indexOf("Owner Cash")<0 && r.cat.indexOf("Contingency")<0 && r.cat.indexOf("Change Order")<0;});
  var cs={hdr:{padding:"6px 10px",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:0.5,borderBottom:"1px solid rgba(255,255,255,0.1)",position:"sticky",top:0,background:"#0D1117",zIndex:1}};
  function MoneyCell(props){
    var v=props.v;var bold=props.bold;var neg=props.neg;
    if(v==null||v===undefined)return <td style={{padding:"4px 10px",textAlign:"right"}}>-</td>;
    var color=neg?"#E8553A":v<0?"#E8553A":"#E8E8ED";
    return <td style={{padding:"4px 10px",textAlign:"right",fontFamily:mono,fontSize:11,fontWeight:bold?700:400,color:color}}>{fd(v)}</td>;
  }
  return(
    <div style={{overflowY:"auto",height:"100%",padding:"16px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#E8E8ED",marginBottom:4}}>Project Budget vs Actuals</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Rodriguez Second-Story Addition | Budget: $285,000 | Actual: $262,400</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr>
          <th style={cs.hdr}>Line Item</th>
          <th style={{...cs.hdr,textAlign:"right"}}>Budget</th>
          <th style={{...cs.hdr,textAlign:"right"}}>Actual</th>
          <th style={{...cs.hdr,textAlign:"right"}}>Variance</th>
        </tr></thead>
        <tbody>
        {BUDGET_DATA.map(function(r,i){
          if(!r.cat)return <tr key={i}><td style={{padding:4}} colSpan={4}></td></tr>;
          if(r.sec&&!r.sum)return <tr key={i}><td style={{padding:"8px 10px",fontSize:10,fontWeight:700,color:"#F5A623",letterSpacing:1,textTransform:"uppercase"}} colSpan={4}>{r.cat}</td></tr>;
          if(r.sum==="fund"){
            return <tr key={i} style={{borderTop:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.02)"}}>
              <td style={{padding:"6px 10px",fontWeight:700,fontSize:11}}>{r.cat}</td>
              <MoneyCell v={285000} bold/><MoneyCell v={262400} bold/><MoneyCell v={22600} bold/>
            </tr>;
          }
          if(r.sum==="cost"){
            var totB=costItems.reduce(function(s,x){return s+(x.ann||0);},0);
            var totS=costItems.reduce(function(s,x){return s+(x.spent||0);},0);
            return <tr key={i} style={{borderTop:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.02)"}}>
              <td style={{padding:"6px 10px",fontWeight:700,fontSize:11}}>{r.cat}</td>
              <MoneyCell v={totB} bold/><MoneyCell v={totS} bold/><MoneyCell v={totB-totS} bold/>
            </tr>;
          }
          if(r.sum==="cont")return <tr key={i} style={{borderTop:"1px solid rgba(255,255,255,0.1)"}}>
            <td style={{padding:"6px 10px",fontWeight:700,fontSize:11}}>{r.cat}</td>
            <MoneyCell v={28500} bold/><MoneyCell v={2400} bold/><MoneyCell v={26100} bold/>
          </tr>;
          if(r.sum==="total")return <tr key={i} style={{borderTop:"2px solid rgba(245,166,35,0.3)",background:"rgba(245,166,35,0.04)"}}>
            <td style={{padding:"8px 10px",fontWeight:700,fontSize:12,color:"#F5A623"}}>{r.cat}</td>
            <MoneyCell v={285000} bold/><MoneyCell v={262400} bold/><MoneyCell v={22600} bold/>
          </tr>;
          if(r.sum==="savings")return <tr key={i} style={{background:"rgba(24,168,107,0.04)"}}>
            <td style={{padding:"8px 10px",fontWeight:700,fontSize:12,color:"#18A86B"}}>{r.cat}</td>
            <td colSpan={2}></td><td style={{padding:"6px 10px",textAlign:"right",fontFamily:mono,fontSize:12,fontWeight:700,color:"#18A86B"}}>{fd(22600)}</td>
          </tr>;
          var variance=(r.ann||0)-(r.spent||0);
          return <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
            <td style={{padding:"4px 10px",color:"#E8E8ED"}}>{r.cat}</td>
            <MoneyCell v={r.ann}/><MoneyCell v={r.spent}/>
            <td style={{padding:"4px 10px",textAlign:"right",fontFamily:mono,fontSize:11,color:variance>=0?"#18A86B":"#E8553A"}}>{variance!==0?fd(variance):"-"}</td>
          </tr>;
        })}
        </tbody>
      </table>
      <div style={{marginTop:16,padding:"12px 14px",background:"rgba(245,166,35,0.04)",border:"1px solid rgba(245,166,35,0.12)",borderRadius:8}}>
        <div style={{fontSize:10,color:"#F5A623",fontWeight:600,marginBottom:6}}>NOTES FROM LEDGER</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Change order CO-001: $8,200 requested for spray foam insulation. Architect review determined code compliance met with fiberglass batts. Reduced to $2,400 partial upgrade. Owner saved $5,800.</div>
        <div style={{fontSize:10,color:"#18A86B",lineHeight:1.6,marginTop:4}}>All 5 draws funded with inspector sign-off. All lien waivers filed. Zero deficiencies at final inspection.</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.6,marginTop:4}}>Warranty: Coastal Build Co - 2 years from Oct 15, 2026. Tracked on-chain.</div>
      </div>
    </div>
  );
}

function ProvView(){
  return(
    <div style={{overflowY:"auto",height:"100%",padding:"16px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#E8E8ED",marginBottom:4}}>Provenance Map</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Every draw traced from budget to disbursement. Every change order verified.</div>
      </div>
      {PROV.map(function(p,pi){
        var isRevised=p.status==="Revised";
        return <div key={pi} style={{marginBottom:14,background:isRevised?"rgba(245,166,35,0.04)":"rgba(255,255,255,0.02)",border:"1px solid "+(isRevised?"rgba(245,166,35,0.15)":"rgba(255,255,255,0.06)"),borderRadius:8,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:isRevised?"#F5A623":"#E8E8ED"}}>{p.pay}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2}}>{p.vendor}{p.amt>0?" | "+fd(p.amt):""}</div>
            </div>
            <span style={{fontSize:9,padding:"3px 8px",borderRadius:4,fontWeight:600,background:isRevised?"rgba(245,166,35,0.15)":p.status==="Funded"?"rgba(24,168,107,0.12)":"rgba(45,127,249,0.12)",color:isRevised?"#F5A623":p.status==="Funded"?"#18A86B":"#2D7FF9"}}>{p.status}</span>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
            {p.chain.map(function(step,si){
              var isLast=si===p.chain.length-1;
              var isAlert=step.indexOf("Hold")>=0||step.indexOf("SYSTEM")>=0||step.indexOf("SAVED")>=0;
              var isEvent=step.indexOf("R0")===0||step.indexOf("R-")===0||step.indexOf("(R")===0;
              return <div key={si} style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:isAlert?"rgba(245,166,35,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(isAlert?"rgba(245,166,35,0.2)":"rgba(255,255,255,0.08)"),color:isAlert?"#F5A623":isEvent?"#F5A623":"rgba(255,255,255,0.5)",fontFamily:mono,whiteSpace:"nowrap"}}>{step}</span>
                {!isLast&&<span style={{color:"rgba(255,255,255,0.12)",fontSize:10}}>{">"}</span>}
              </div>;
            })}
          </div>
          {p.note&&<div style={{marginTop:8,fontSize:10,color:"#18A86B",fontStyle:"italic"}}>{p.note}</div>}
        </div>;
      })}
    </div>
  );
}

function Narr(props){
  var s=ST[props.idx];if(!s)return null;
  return(
    <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontFamily:mono,letterSpacing:1,textTransform:"uppercase"}}>{s.ph}</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.08)"}}>|</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.15)"}}>Step {props.idx+1} of {NS}</span>
      </div>
      <h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",lineHeight:1.2}}>{s.ti}</h2>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",margin:"0 0 20px",lineHeight:1.4}}>{s.su}</p>
      {s.na.split("\n\n").map(function(para,i){return <p key={i} style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.7,margin:"0 0 14px"}}>{para}</p>;})}
      {s.sq&&<div style={{marginTop:20,background:"rgba(232,85,58,0.04)",border:"1px solid rgba(232,85,58,0.12)",borderRadius:10,padding:18}}>
        <div style={{fontSize:11,fontWeight:700,color:"#E8553A",marginBottom:10,letterSpacing:0.5}}>{s.sq.t}</div>
        {s.sq.it.map(function(item,i){return <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
          <span style={{color:"rgba(232,85,58,0.4)",fontSize:11,flexShrink:0}}>{">"}</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{item}</span>
        </div>;})}
      </div>}
      {s.wc&&<div style={{marginTop:16,background:"rgba(24,168,107,0.04)",border:"1px solid rgba(24,168,107,0.12)",borderRadius:10,padding:18}}>
        <div style={{fontSize:11,fontWeight:700,color:"#18A86B",marginBottom:10,letterSpacing:0.5}}>{s.wc.t}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.7}}>{s.wc.de}</div>
      </div>}
      {s.ph==="thesis"&&<div style={{marginTop:24,display:"flex",gap:8,flexWrap:"wrap"}}>
        {["Budget-to-draw provenance","3-bid competitive procurement","Inspector-gated draws","Change order architect review","Lien waiver enforcement","Dual-sig disbursement","Real-time donor/lender visibility","$5,800 saved on one change order","73% of renovations exceed budget","This one came in $22,600 under"].map(function(tag,i){
          return <span key={i} style={{fontSize:10,padding:"4px 10px",borderRadius:4,background:i>=8?"rgba(24,168,107,0.08)":"rgba(245,166,35,0.08)",border:"1px solid "+(i>=8?"rgba(24,168,107,0.15)":"rgba(245,166,35,0.15)"),color:i>=8?"#18A86B":"#F5A623",fontWeight:500}}>{tag}</span>;
        })}
      </div>}
    </div>
  );
}

NS=ST.length;

export default function App(){
  var ss=useState(0);var step=ss[0];var setStep=ss[1];
  var es=useState(null);var selEv=es[0];var setSelEv=es[1];
  var vs=useState("owner");var viewAs=vs[0];var setViewAs=vs[1];
  var ts=useState("ledger");var rightTab=ts[0];var setRightTab=ts[1];
  var listRef=useRef(null);

  var cur=ST[step]||ST[0];
  var show=cur.hl.length>0||cur.ph==="thesis";

  useEffect(function(){
    if(cur.fo){for(var i=0;i<EV.length;i++){if(EV[i].id===cur.fo){setSelEv(EV[i]);break;}}}else{setSelEv(null);}
    if(cur.va)setViewAs(cur.va);
  },[step]);

  useEffect(function(){
    if(listRef.current&&cur.fo){
      var el=listRef.current.querySelector("[data-eid='"+cur.fo+"']");
      if(el)el.scrollIntoView({behavior:"smooth",block:"center"});
    }
  },[step]);

  useEffect(function(){
    function hk(e){
      if(e.key==="ArrowRight"){e.preventDefault();setStep(function(p){return Math.min(NS-1,p+1);});}
      if(e.key==="ArrowLeft"){e.preventDefault();setStep(function(p){return Math.max(0,p-1);});}
    }
    window.addEventListener("keydown",hk);
    return function(){window.removeEventListener("keydown",hk);};
  },[]);

  var parties=[
    {k:"owner",l:"Homeowner",c:"#2D7FF9"},
    {k:"gc",l:"Contractor",c:"#E8553A"},
    {k:"lender",l:"Lender",c:"#FF6B9D"},
    {k:"sub",l:"Sub",c:"#18A86B"},
    {k:"inspector",l:"Inspector",c:"#F5A623"},
    {k:"architect",l:"Architect",c:"#9B6FE8"},
  ];

  return(
    <div style={{fontFamily:"'DM Sans',Helvetica,sans-serif",background:"#0D1117",color:"#E8E8ED",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

      <div style={{padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:17,fontWeight:700,letterSpacing:3,color:"#F5A623",fontFamily:mono}}>CAST</span>
          <span style={{color:"rgba(255,255,255,0.08)"}}>|</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Renovation Ledger</span>
          <span style={{color:"rgba(255,255,255,0.08)"}}>|</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>$285K Second-Story Addition</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>VIEWING AS</span>
          <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",borderRadius:6,padding:2}}>
            {parties.map(function(p){
              return <button key={p.k} onClick={function(){setViewAs(p.k);}} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:4,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:viewAs===p.k?"rgba(255,255,255,0.1)":"transparent",color:viewAs===p.k?p.c:"rgba(255,255,255,0.25)"}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:viewAs===p.k?p.c:"rgba(255,255,255,0.12)"}}/>{p.l}
              </button>;
            })}
          </div>
        </div>
      </div>

      <div style={{height:2,background:"rgba(255,255,255,0.04)",flexShrink:0}}>
        <div style={{height:"100%",background:"#F5A623",width:((step+1)/NS*100)+"%",transition:"width 0.4s"}}/>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <div style={{width:show?420:600,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto"}}><Narr idx={step}/></div>
          <div style={{padding:"12px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <button onClick={function(){setStep(function(p){return Math.max(0,p-1);});}} style={{padding:"8px 20px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:step===0?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.5)",cursor:step===0?"default":"pointer",fontSize:12,fontWeight:600}}>Prev</button>
            <div style={{display:"flex",gap:4}}>{ST.map(function(_,i){return <button key={i} onClick={function(){setStep(i);}} style={{width:i===step?20:6,height:6,borderRadius:3,border:"none",cursor:"pointer",background:i===step?"#F5A623":i<step?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.1)",transition:"all 0.3s"}}/>;})}</div>
            <button onClick={function(){setStep(function(p){return Math.min(NS-1,p+1);});}} style={{padding:"8px 20px",borderRadius:6,border:"none",background:step===NS-1?"rgba(255,255,255,0.05)":"#F5A623",color:step===NS-1?"rgba(255,255,255,0.15)":"#0D1117",cursor:step===NS-1?"default":"pointer",fontSize:12,fontWeight:700}}>Next</button>
          </div>
        </div>

        {show&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            {[{k:"ledger",l:"Event Ledger"},{k:"budget",l:"Budget vs Actuals"},{k:"provenance",l:"Provenance Map"}].map(function(t){
              var active=rightTab===t.k;
              return <button key={t.k} onClick={function(){setRightTab(t.k);}} style={{padding:"8px 16px",border:"none",cursor:"pointer",fontSize:10,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",background:active?"rgba(255,255,255,0.04)":"transparent",color:active?"#F5A623":"rgba(255,255,255,0.25)",borderBottom:active?"2px solid #F5A623":"2px solid transparent"}}>{t.l}</button>;
            })}
            {rightTab==="ledger"&&<div style={{marginLeft:"auto",padding:"8px 14px",fontSize:9,color:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center"}}>{EV.filter(function(e){return e.vi.indexOf(viewAs)>=0;}).length} visible / {EV.filter(function(e){return e.vi.indexOf(viewAs)<0;}).length} encrypted</div>}
          </div>

          {rightTab==="ledger"&&<div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{width:300,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div ref={listRef} style={{flex:1,overflowY:"auto"}}>{EV.map(function(ev){
                return <div key={ev.id} data-eid={ev.id}><EvCard ev={ev} sel={selEv!=null&&selEv.id===ev.id} hlt={cur.hl.indexOf(ev.id)>=0} viewAs={viewAs} onClick={function(){setSelEv(ev);}}/></div>;
              })}</div>
            </div>
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <div style={{flex:1,overflowY:"auto"}}><EvDetail ev={selEv} viewAs={viewAs}/></div>
            </div>
          </div>}

          {rightTab==="budget"&&<div style={{flex:1,overflow:"hidden"}}><BudgetView/></div>}
          {rightTab==="provenance"&&<div style={{flex:1,overflow:"hidden"}}><ProvView/></div>}
        </div>}
      </div>

      <div style={{padding:"6px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{EV.length} events | 5 draws | 1 change order caught | $22,600 under budget</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>Arrow keys to navigate</span>
      </div>

      <style>{"::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}*{box-sizing:border-box}"}</style>
    </div>
  );
}
