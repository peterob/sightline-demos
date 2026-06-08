import { useState, useRef, useEffect } from "react";

var C = {donor:"#2D7FF9",committee:"#E8553A",vendor:"#18A86B",city:"#9B6FE8",system:"#F5A623",agent:"#00D4AA",both:"#8B95A5"};
var P = {donor:{n:"Donors",r:"Funders / Public"},committee:{n:"Committee",r:"Volunteer Board"},vendor:{n:"Contractor",r:"Service Provider"},city:{n:"City Parks",r:"Municipal Authority"},system:{n:"CAST Ledger",r:"Shared Truth"},agent:{n:"AI Agent",r:"Automated Task"},both:{n:"All Parties",r:"Multi-Sig"}};
var L = {CAMPAIGN_CREATED:"Campaign Created",GOAL_FUNDED:"Goal Funded",BUDGET_RATIFIED:"Budget Ratified",COMMITTEE_FORMED:"Committee Formed",BID_RECEIVED:"Bid Received",CONTRACT_AWARDED:"Contract Awarded",PERMIT_ISSUED:"Permit Issued",MILESTONE_COMPLETED:"Milestone Completed",CITY_INSPECTION:"City Inspection Passed",PAYMENT_REQUESTED:"Payment Requested",PAYMENT_APPROVED:"Payment Approved (Dual-Sig)",PAYMENT_RELEASED:"Payment Released",VENDOR_FLAGGED:"Vendor Payment HELD",VENDOR_RESOLVED:"Vendor Issue Resolved",SURPLUS_VOTE:"Surplus Allocation Vote",MAINTENANCE_FUND:"Maintenance Fund Created",DONOR_REPORT:"Donor Impact Report",FINAL_WALKTHROUGH:"Final Walkthrough",AGENT_VERIFICATION:"Agent: Credential Verification",AGENT_BUDGET_DRAFT:"Agent: Budget Draft",AGENT_BID_ANALYSIS:"Agent: Bid Analysis",AGENT_DRAW_RECONCILE:"Agent: Draw Reconciliation",AGENT_GL_ENTRY:"Agent: GL Journal Entry",AGENT_CONFLICT_SCAN:"Agent: Conflict Scan"};

function fd(n){return "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function ft(iso){var d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}
function getAmt(d){return d.amount||d.totalRaised||d.totalBudget||d.bidAmount||d.contractAmount||d.paymentAmount||d.fundedAmount||d.surplusAmount||d.monthlyBudget||null;}
var mono="'IBM Plex Mono',monospace";

function rv(k,v){
  if(v==null)return "-";
  if(typeof v==="boolean")return v?"Yes":"No";
  if(Array.isArray(v))return v.map(function(x){return typeof x==="object"?JSON.stringify(x):String(x);}).join(", ");
  if(typeof v==="object")return Object.keys(v).map(function(k2){return k2+": "+String(v[k2]);}).join(", ");
  var kl=(k||"").toLowerCase();
  if(typeof v==="number"){
    if(kl.indexOf("rate")>=0&&v<1)return (v*100).toFixed(1)+"%";
    if(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("raised")>=0||kl.indexOf("funded")>=0||kl.indexOf("balance")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("remaining")>=0||kl.indexOf("total")>=0||kl.indexOf("surplus")>=0||kl.indexOf("price")>=0||kl.indexOf("fee")>=0||kl.indexOf("donation")>=0||k==="amount")return fd(v);
  }
  return String(v);
}
function vc(k){
  var kl=(k||"").toLowerCase();
  if(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("raised")>=0||kl.indexOf("funded")>=0||kl.indexOf("balance")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("total")>=0||kl.indexOf("surplus")>=0||kl.indexOf("price")>=0||kl.indexOf("fee")>=0||kl.indexOf("donation")>=0)return "#F5A623";
  if(kl.indexOf("blocked")>=0||kl.indexOf("held")>=0||kl.indexOf("flag")>=0||kl.indexOf("fail")>=0)return "#E8553A";
  if(kl.indexOf("hash")>=0||kl.indexOf("agent")>=0)return "#9B6FE8";
  if(kl.indexOf("pass")>=0||kl.indexOf("clear")>=0||kl.indexOf("verified")>=0||kl.indexOf("clean")>=0)return "#18A86B";
  return "#E8E8ED";
}

var EV=[
  {id:"CF01",ts:"2026-01-10T09:00:00Z",tp:"CAMPAIGN_CREATED",pa:"committee",vi:["donor","committee","vendor","city"],d:{campaignName:"Rebuild Forsyth Park Playground",location:"Forsyth Park, Savannah GA 31401",goal:175000,description:"Storm-damaged playground serving 2,000+ families. Community-led rebuild with accessible design.",organizer:"Forsyth Neighborhood Alliance",taxStatus:"501(c)(3) fiscal sponsor: Savannah Community Foundation",platformFee:"0% — stablecoin, no processing fees"},h:"cf01a",ph:"000000",si:["committee.sig","fiscal-sponsor.sig"]},
  {id:"CF02",ts:"2026-01-10T09:05:00Z",tp:"COMMITTEE_FORMED",pa:"committee",vi:["donor","committee","city"],d:{members:["Denise Carter (Chair) — retired teacher","Marcus Webb (Treasurer) — CPA, pro bono","Keisha Thomas — ADA accessibility liaison","James Okafor — Landscape architect (volunteer)","Rosa Delgado — Youth program coordinator"],quorum:3,signaturesRequired:2,conflictCertification:"All members: no financial relationship with any bidder",backgroundChecks:"Complete — Savannah Community Foundation"},h:"cf02b",ph:"cf01a",si:["committee.sig","fiscal-sponsor.sig"]},
  {id:"CF03",ts:"2026-02-28T18:00:00Z",tp:"GOAL_FUNDED",pa:"system",vi:["donor","committee","city"],d:{totalRaised:182450,donorCount:38,avgDonation:4801,medianDonation:500,largestDonation:15000,smallestDonation:25,fundingMethod:"USDC (28 donors) + credit card (10 donors)",processingFees:0,platformFees:0,netToProject:182450,daysToFund:49},h:"cf03c",ph:"cf02b",si:["system.auto.sig"]},
  {id:"AG01",ts:"2026-03-01T08:00:00Z",tp:"AGENT_BUDGET_DRAFT",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-budget-agent-v2",task:"Draft budget from scope + comparable projects",comparablesAnalyzed:47,sourceData:"47 playground builds in SE US (2024-2025)",equipmentEstimate:"$82K vs median $79K (within 4%)",surfacingEstimate:"$28K vs median $31K (9% below)",accessibilityEstimate:"$18.5K vs median $14K (expanded ADA scope)",contingencyRec:"10% recommended (platform median 8.5%)",status:"DRAFTED — awaiting committee ratification",humanAction:"Committee adjusted 2 items, ratified 5-0",agentCost:"$0.12",humanEquivalent:"$800-$1,500 consultant"},h:"ag01a",ph:"cf03c",si:["agent.auto.sig"]},
  {id:"CF04",ts:"2026-03-05T10:00:00Z",tp:"BUDGET_RATIFIED",pa:"committee",vi:["donor","committee","vendor","city"],d:{totalBudget:175000,contingency:17500,contingencyPct:"10%",equipment:82000,surfacing:28000,accessibility:18500,sitePrep:14000,landscaping:12000,permitsInsurance:7700,designCost:"$0 (donated by James Okafor)",projectMgmt:"$0 (volunteer committee)",surplusReserved:7450,voteRecord:"5-0 unanimous",agentDraftRef:"AG01 — budget drafted from 47 comparable projects"},h:"cf04d",ph:"ag01a",si:["committee.sig"]},
  {id:"CF05",ts:"2026-03-10T14:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"Savannah Playground Systems",bidAmount:96500,scope:"Equipment + installation + safety surfacing",license:"GA-CBC-22841",timeline:"8 weeks",warrantyYears:5,references:"3 municipal projects (2024-25)"},h:"cf05e",ph:"cf04d",si:["vendor-sps.sig"]},
  {id:"AG02",ts:"2026-03-10T14:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-verify-agent-v3",task:"Verify bidder credentials — Savannah Playground Systems",gaSecretaryOfState:"PASS — Active corporation",contractorLicense:"PASS — GA-CBC-22841 active, no disciplinary actions",generalLiability:"PASS — $2M policy active through 2027-01-15 (Hartford)",suretyBond:"PASS — $96,500 bond active",ofacDoNotPay:"CLEAR — no matches (sam.gov + OFAC SDN)",betterBusinessBureau:"A+ rating, 0 complaints in 24 months",allChecksPassed:true,confidence:"HIGH — 6/6 authoritative sources verified",agentCost:"$0.08",humanEquivalent:"$150-$300 (2-4 hours manual)"},h:"ag02b",ph:"cf05e",si:["agent.auto.sig"]},
  {id:"CF06",ts:"2026-03-12T10:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"Southern Recreation LLC",bidAmount:108200,scope:"Equipment + installation + surfacing + landscaping",license:"GA-CBC-18093",timeline:"10 weeks",warrantyYears:3,references:"5 park projects, Chatham County preferred vendor"},h:"cf06f",ph:"ag02b",si:["vendor-southern.sig"]},
  {id:"CF07",ts:"2026-03-14T09:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"PlayCore Certified Installer (Coastal)",bidAmount:91800,scope:"Equipment + installation + surfacing",license:"GA-CBC-31205",timeline:"6 weeks",warrantyYears:2,references:"2 projects — newer company",note:"Lowest bid but shortest warranty and fewest references"},h:"cf07g",ph:"cf06f",si:["vendor-playcore.sig"]},
  {id:"AG03",ts:"2026-03-14T09:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-verify-agent-v3",task:"Batch verify: Southern Recreation + PlayCore Coastal",southernRecreation:"6/6 PASS — GA-CBC-18093 active, $2M GL, bonded, OFAC clear, BBB A",playCoreCostal:"5/6 PASS, 1 NOTE — license 18 months old, $1M GL (lower), BBB not rated",flags:"PlayCore: newer license, lower insurance limit. Not disqualifying but noted.",agentCost:"$0.16",humanEquivalent:"$300-$600 (manual verification of 2 vendors)"},h:"ag03c",ph:"cf07g",si:["agent.auto.sig"]},
  {id:"AG04",ts:"2026-03-15T08:00:00Z",tp:"AGENT_BID_ANALYSIS",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-analysis-agent-v2",task:"Comparative bid analysis with risk-adjusted scoring",savannahPS:"Score 90 — price $96.5K, 5yr warranty, 3 refs, $2M insurance",southernRec:"Score 77 — price $108.2K, 3yr warranty, 5 refs, $2M insurance",playCoreCostal:"Score 70 — price $91.8K, 2yr warranty, 2 refs, $1M insurance",recommendation:"Savannah Playground Systems — highest composite score (90/100)",warrantyAnalysis:"Equipment replacement averages $15K-$30K. 5yr warranty value exceeds $4,700 price premium.",benchmarkNote:"Median playground build in Savannah metro: $94,200. All 3 bids in range.",status:"PREPARED — awaiting committee decision",humanAction:"Committee voted 5-0 per agent recommendation",agentCost:"$0.18",humanEquivalent:"$500-$1,000 consultant bid analysis"},h:"ag04d",ph:"ag03c",si:["agent.auto.sig"]},
  {id:"CF08",ts:"2026-03-20T14:00:00Z",tp:"CONTRACT_AWARDED",pa:"committee",vi:["donor","committee","vendor","city"],d:{awardedTo:"Savannah Playground Systems",contractAmount:96500,bidsReceived:3,lowestBid:91800,selectedBidRank:"2nd lowest (best value)",selectionBasis:"Agent composite score 90/100 — strongest warranty + references",agentAnalysisRef:"AG04",conflictCheck:"PASS — no committee relationships with bidders",contractType:"Fixed price, 4 milestone payments",retainage:"10%",voteRecord:"5-0"},h:"cf08h",ph:"ag04d",si:["committee.sig","vendor-sps.sig"]},
  {id:"CF09",ts:"2026-03-22T11:00:00Z",tp:"PERMIT_ISSUED",pa:"city",vi:["donor","committee","vendor","city"],d:{permitNumber:"SAV-PARK-2026-0142",issuedBy:"City of Savannah Parks & Recreation",zoningApproval:"PASS",ADACompliance:"Exceeds minimum requirements",historicReview:"PASS — outside fountain viewshed",inspectionsRequired:3},h:"cf09i",ph:"cf08h",si:["city-parks.sig"]},
  {id:"CF10",ts:"2026-04-20T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"vendor",vi:["donor","committee","vendor","city"],d:{milestone:"Site Prep + Foundation",milestoneNumber:1,description:"Old equipment removed, grading complete, drainage installed, footings poured",completionPhotos:34,laborHours:280,communityVolunteerHours:45,volunteerNote:"12 neighbors helped — saved $3,200 in demo costs"},h:"cf10j",ph:"cf09i",si:["vendor-sps.sig"]},
  {id:"CF11",ts:"2026-04-21T09:00:00Z",tp:"CITY_INSPECTION",pa:"city",vi:["donor","committee","vendor","city"],d:{inspectionType:"Foundation / Grading",inspector:"David Chen, City Parks Dept",result:"PASS",notes:"Drainage verified. Footings per spec. ADA path grade 4.8% (max 5%).",deficiencies:0},h:"cf11k",ph:"cf10j",si:["city-inspector.sig"]},
  {id:"CF12",ts:"2026-04-22T10:00:00Z",tp:"PAYMENT_REQUESTED",pa:"vendor",vi:["committee","vendor"],d:{paymentAmount:24125,calculation:"$96,500 x 25% milestone",inspectionRef:"CF11 — PASS",invoiceNumber:"SPS-2026-0087"},h:"cf12l",ph:"cf11k",si:["vendor-sps.sig"]},
  {id:"CF13",ts:"2026-04-22T15:00:00Z",tp:"PAYMENT_APPROVED",pa:"committee",vi:["donor","committee","vendor"],d:{paymentAmount:24125,approver1:"Denise Carter (Chair)",approver2:"Marcus Webb (Treasurer)",dualSig:true,milestoneVerified:true,inspectionVerified:true,budgetCheck:"PASS — 25% of contract",cumulativePaid:24125,remaining:150875},h:"cf13m",ph:"cf12l",si:["committee-carter.sig","committee-webb.sig"]},
  {id:"CF14",ts:"2026-04-23T08:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["donor","committee","vendor"],d:{fundedAmount:24125,payee:"Savannah Playground Systems",method:"USDC transfer",txHash:"0x7a3f...b8c2",processingFee:0,escrowRemaining:158325,projectPctComplete:"25%"},h:"cf14n",ph:"cf13m",si:["system.auto.sig","escrow.auto.sig"]},
  {id:"AG05",ts:"2026-04-23T08:01:00Z",tp:"AGENT_DRAW_RECONCILE",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-reconcile-agent-v2",task:"Reconcile draw against budget and milestone schedule",drawNumber:1,drawAmount:"$24,125",contractTotal:"$96,500",drawPct:"25.0% — matches milestone schedule",budgetReconciliation:"Site prep $14K + foundation $10.1K = $24.1K. Draw aligns.",anomaliesDetected:0,result:"CLEAN — no anomalies",agentCost:"$0.04",humanEquivalent:"$200-$400 bookkeeper (2-3 hours)"},h:"ag05e",ph:"cf14n",si:["agent.auto.sig"]},
  {id:"AG06",ts:"2026-04-23T08:02:00Z",tp:"AGENT_GL_ENTRY",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-gl-agent-v1",task:"Generate journal entries from payment event",entry1:"DR Construction in Progress $24,125 / CR Project Escrow $24,125",entry2:"DR Retainage Receivable $2,413 / CR Construction in Progress $2,413",memo:"Draw 1: Foundation + Steel — SPS invoice SPS-2026-0087",glTarget:"QuickBooks Online (treasurer account)",status:"DRAFTED — awaiting treasurer approval",treasurerAction:"Marcus Webb reviewed and approved batch",agentCost:"$0.02",humanEquivalent:"$75-$150 bookkeeper GL entry"},h:"ag06f",ph:"ag05e",si:["agent.auto.sig"]},
  {id:"AG07",ts:"2026-05-15T10:58:00Z",tp:"AGENT_CONFLICT_SCAN",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-conflict-agent-v2",task:"Scan incoming invoice against conflict-of-interest graph",trigger:"New invoice: Coastal Green Services, $8,400",check1:"Vendor registry — existing sub-contract? FAIL (none found)",check2:"Address match vs committee? MATCH — 1847 Habersham St = Rosa Delgado",check3:"Secretary of State registered agent? Miguel Delgado — surname match",check4:"OFAC / Do Not Pay? CLEAR",check5:"GA contractor license? PASS — GA-CBC-29104 active",conflictDetected:true,confidence:"HIGH (address + surname + no sub-contract)",action:"HOLD payment. Recuse Rosa Delgado. Notify fiscal sponsor.",agentCost:"$0.06",humanEquivalent:"Would not have been caught — no human address-matches every invoice"},h:"ag07g",ph:"ag06f",si:["agent.auto.sig"]},
  {id:"CF-FL",ts:"2026-05-15T11:00:00Z",tp:"VENDOR_FLAGGED",pa:"system",vi:["committee","vendor"],d:{flaggedPayment:"Coastal Green Services — $8,400 landscaping",flagSource:"Agent AG07 conflict scan",flagReason:"Vendor address matches committee member. Surname match on registered agent. No sub-contract on ledger.",riskLevel:"HIGH — potential conflict of interest",autoAction:"Payment HELD. Rosa Delgado recused. Fiscal sponsor notified."},h:"cffl1",ph:"ag07g",si:["system.auto.sig"]},
  {id:"CF-FR",ts:"2026-05-16T14:00:00Z",tp:"VENDOR_RESOLVED",pa:"committee",vi:["donor","committee","city"],d:{resolution:"Rosa disclosed: Coastal Green is her husband's business. Informal recommendation, not intentional conflict.",action:"Coastal Green removed. Competitive re-bid conducted.",replacementVendor:"Savannah Greenscape — $7,800",savings:600,voteRecord:"4-0 (Delgado recused). Quorum met.",publicDisclosure:"Full incident report posted to donor ledger"},h:"cffr2",ph:"cffl1",si:["committee-carter.sig","committee-webb.sig","committee-thomas.sig","committee-okafor.sig","fiscal-sponsor.sig"]},
  {id:"CF15",ts:"2026-06-10T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"vendor",vi:["donor","committee","vendor","city"],d:{milestone:"Equipment Installation",milestoneNumber:2,description:"Climbing tower, swing set (incl. accessible), merry-go-round, sensory panels, shade structures",completionPhotos:52,ADAFeatures:"Wheelchair swing, transfer platform, sensory panels at wheelchair height",communityPreview:"40+ families tested equipment under supervision"},h:"cf15o",ph:"cffr2",si:["vendor-sps.sig"]},
  {id:"CF16",ts:"2026-06-11T09:00:00Z",tp:"CITY_INSPECTION",pa:"city",vi:["donor","committee","vendor","city"],d:{inspectionType:"Equipment + Safety Surfacing",inspector:"David Chen, City Parks Dept",result:"PASS",notes:"All equipment per CPSC/ASTM F1487. Fall zones verified. ADA connectivity confirmed.",safetyRating:"Exceeds minimum standards"},h:"cf16p",ph:"cf15o",si:["city-inspector.sig"]},
  {id:"CF17",ts:"2026-06-12T10:00:00Z",tp:"PAYMENT_APPROVED",pa:"committee",vi:["donor","committee","vendor"],d:{paymentAmount:48250,approver1:"Keisha Thomas",approver2:"Marcus Webb (Treasurer)",milestonesCovered:"Milestones 2 + 3 (equipment + surfacing)",cumulativePaid:72375,retainageHeld:9650},h:"cf17q",ph:"cf16p",si:["committee-thomas.sig","committee-webb.sig"]},
  {id:"CF18",ts:"2026-07-05T10:00:00Z",tp:"FINAL_WALKTHROUGH",pa:"both",vi:["donor","committee","vendor","city"],d:{attendees:"Full committee + city inspector + contractor + 15 community members",result:"PASS",punchListItems:0,equipmentCertified:true,accessibilityVerified:true,warranty:"5 years — Savannah Playground Systems",dedicationPlaque:"Lists all 38 donors by name"},h:"cf18r",ph:"cf17q",si:["committee.sig","vendor-sps.sig","city-inspector.sig"]},
  {id:"CF19",ts:"2026-07-06T09:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["donor","committee","vendor"],d:{fundedAmount:33775,payee:"SPS (final + retainage release)",txHash:"0x9d2e...f4a1",totalToSPS:96500,totalToGreenscape:7800,totalToOther:14200,processingFee:0},h:"cf19s",ph:"cf18r",si:["system.auto.sig"]},
  {id:"CF20",ts:"2026-07-10T14:00:00Z",tp:"SURPLUS_VOTE",pa:"donor",vi:["donor","committee","city"],d:{surplusAmount:63950,accounting:"$182,450 raised - $118,500 spent = $63,950",votingMethod:"On-chain — 1 vote per donor, equal weight",optionA:"Maintenance endowment fund (annual upkeep)",optionB:"Phase 2 — fitness stations + walking path",optionC:"Return pro-rata to donors",optionD:"Donate to Savannah Community Foundation",result:"A: 18 (47%) | B: 14 (37%) | C: 2 (5%) | D: 4 (11%)",winner:"Option A: Maintenance endowment",voterTurnout:"38 of 38 (100%)"},h:"cf20t",ph:"cf19s",si:["system.auto.sig"]},
  {id:"CF21",ts:"2026-07-15T10:00:00Z",tp:"MAINTENANCE_FUND",pa:"committee",vi:["donor","committee","city"],d:{fundType:"Recurring maintenance ledger",monthlyBudget:850,annualBudget:10200,endowment:"$63,950 = ~6.3 years at current rate",scope:"Monthly inspections, equipment repair, surface replenishment, landscaping",governance:"Same committee. Annual donor report. Election every 2 years.",platformFee:"$99/month — Clearfund Recurring tier"},h:"cf21u",ph:"cf20t",si:["committee.sig","system.auto.sig"]},
  {id:"CF22",ts:"2026-07-20T09:00:00Z",tp:"DONOR_REPORT",pa:"system",vi:["donor","committee","city"],d:{reportTitle:"Final Donor Impact Report",totalRaised:182450,totalSpent:118500,surplusToMaintenance:63950,fees:"$0 platform + $0 processing",donorCount:38,constructionDays:76,volunteerHours:180,familiesServed:"2,000+",conflictsDetected:"1 — caught by agent, resolved in 24hrs",inspectionsPassed:"3 of 3",agentTasksPerformed:7,totalAgentCost:"$0.66",humanEquivalentSaved:"$2,000-$4,000",warranty:"5 years active",maintenanceFund:"$63,950 endowment (6.3 years)"},h:"cf22v",ph:"cf21u",si:["system.auto.sig"],pc:["CF01 Campaign > CF03 Funded ($182K) > AG01 Budget Draft > CF04 Ratified > AG02-03 Vendor Verified > AG04 Bid Analysis > CF08 Contract > CF10 Work > CF11 Inspection > AG05 Reconciled > AG06 GL Entry > AG07 Conflict Scan > CF-FL HELD > CF-FR Resolved > CF18 Final > CF20 Donor Vote > CF21 Maintenance > CF22 Report"]},
];

var ST=[
  {ph:"context",ti:"The Problem with Crowdfunding",su:"$182,450 raised. 38 donors. On GoFundMe, that's where accountability ends.",na:"After a storm condemned the Forsyth Park playground in Savannah, the neighborhood raised $182,450 to rebuild it. On GoFundMe, that money would go into someone's bank account. The 38 donors would receive an email saying 'thanks' and never know what happened next.\n\nThis is a $50 billion annual market. Community fundraising, disaster relief, medical expenses, nonprofit capital campaigns. The accountability infrastructure for all of it is: a thank-you email and hope.\n\nClearfund is a transparent ledger where every donor sees every dollar — from collection through construction to completion. AI agents handle the verification, analysis, and bookkeeping that make governance work. No processing fees. No trust required.",sq:null,wc:null,hl:[],fo:null,va:"donor"},
  {ph:"campaign",ti:"The Campaign",su:"38 donors. Zero fees. Every dollar tracked from day one.",na:"The Forsyth Neighborhood Alliance creates a campaign on Clearfund. A 5-person volunteer committee is formed with conflict-of-interest certifications and background checks. The committee needs 2 signatures for any payment.\n\n49 days later: $182,450 raised from 38 donors. Processing fees: $0. Platform fees: $0. Net to the project: 100% of every dollar.\n\nOn GoFundMe, the same campaign would have lost $5,291 in payment processing (2.9%) plus whatever donors tipped. Here, that $5,291 stays in the playground.",sq:{t:"Today: GoFundMe takes its cut and accountability disappears",it:["GoFundMe charges 2.9% + $0.30 per donation. On $182K that's $5,291.","Donors see a progress bar and 'updates' posted by the organizer. No verification.","The money goes into the organizer's bank account. Period.","If the project costs $118K and there's $64K left over... the organizer decides. Unilaterally.","Donors have no visibility into bids, no confirmation work was done, no proof money reached the contractor."]},wc:{t:"$0 in fees. 5-member committee with dual-sig. Every donor sees every event.",de:"CF01: Campaign created with fiscal sponsor. CF02: Committee formed — 5 members, conflict certifications, 2-sig requirement. CF03: $182,450 raised from 38 donors. USDC collection = zero processing fees."},hl:["CF01","CF02","CF03"],fo:"CF03",va:"donor"},
  {ph:"budget",ti:"The Budget",su:"Agent drafts from 47 comparable projects. Committee adjusts 2 items. Ratifies 5-0.",na:"Before the committee even meets, an AI agent analyzes 47 comparable playground builds on the Clearfund platform and drafts a line-item budget with variance notes. Equipment at $82K is within 4% of the median. Surfacing at $28K is 9% below. Accessibility at $18.5K is 32% above median — justified by the expanded ADA scope.\n\nThe committee reviews the agent's draft, adjusts 2 line items, and ratifies 5-0. The $7,450 raised above goal is reserved for a donor vote at project completion.\n\nThe agent cost: $0.12. A consultant would have charged $800-$1,500 for the same analysis. The committee's volunteers spent 20 minutes reviewing instead of 8 hours researching.",sq:null,wc:{t:"Agent drafted from 47 comparable projects. Committee reviewed and ratified.",de:"AG01: Agent analyzed 47 playground builds, drafted budget with line-item benchmarks and contingency recommendation. CF04: Committee adjusted 2 items, ratified 5-0. Agent draft reference preserved on the ledger."},hl:["AG01","CF04"],fo:"AG01",va:"donor"},
  {ph:"bidding",ti:"Competitive Bidding",su:"3 bids. Agent verifies all 3 instantly. Agent scores them. Committee decides.",na:"Three contractors bid. As each bid arrives, an AI agent instantly verifies the bidder's license, insurance, bond, OFAC status, and BBB rating against authoritative sources. The verification events land on the ledger with source citations — any donor can check the agent's work.\n\nThen the agent produces a risk-adjusted scoring matrix. Savannah Playground Systems scores 90/100. PlayCore scores 70 — lowest price but the agent quantifies the risk: a 2-year warranty vs 5-year, when replacement averages $15K-$30K. The $4,700 price premium is obvious value.\n\nThe committee reviews the agent's analysis and votes 5-0 for SPS. They didn't need to become procurement experts. The agent gave them the analysis. The decision remained theirs.",sq:{t:"Today: Donors never see the bids or know why a contractor was chosen",it:["The organizer picks a contractor. Maybe they got 3 bids. Maybe 1. You'll never know.","Even legitimate organizers face suspicion: 'Is he your friend?'","No volunteer committee has expertise for risk-adjusted bid analysis.","The contractor's license and insurance status are invisible to donors."]},wc:{t:"Agent-verified credentials. Agent-scored bids. Human decision. All on-chain.",de:"AG02: SPS verified 6/6 checks PASS. AG03: Southern + PlayCore batch verified — 11/12 PASS, 1 NOTE on PlayCore's newer license. AG04: Scoring matrix with warranty value analysis. CF08: Committee votes 5-0 per recommendation."},hl:["CF05","AG02","CF06","CF07","AG03","AG04","CF08"],fo:"AG04",va:"donor"},
  {ph:"milestone",ti:"First Milestone + Agent Reconciliation",su:"Work done. Inspected. Paid. Agent reconciles. Agent drafts GL entries.",na:"Site prep complete — 34 photos, city inspection passed. The payment chain fires: dual-sig approval, USDC transfer, zero fees.\n\nThen two agent events fire automatically. AG05 reconciles the $24,125 draw against the budget and milestone schedule — 25% of contract, matching the schedule, zero anomalies. AG06 drafts the GL journal entries for the treasurer to review: debit Construction in Progress, credit Escrow.\n\nMarcus Webb, the volunteer treasurer, reviews and approves the batch in 5 minutes instead of spending 3 hours on bookkeeping.",sq:null,wc:{t:"Work > inspection > dual-sig > payment > agent reconcile > agent GL entry.",de:"CF10-CF14: Milestone completion through payment. AG05: Draw reconciliation — CLEAN, no anomalies. AG06: GL journal entries drafted, treasurer approved batch. Combined agent cost: $0.06. Human equivalent: $275-$550."},hl:["CF10","CF11","CF13","CF14","AG05","AG06"],fo:"AG05",va:"donor"},
  {ph:"agents",ti:"The Agent Layer",su:"7 AI agents. $0.66 total. 18 verification checks. 1 conflict caught.",na:"Throughout this project, AI agents operated alongside the volunteer committee — not replacing their judgment, but eliminating the tasks that make volunteer governance unsustainable.\n\nAG01 drafted the budget from 47 comparable projects. AG02-AG03 verified every bidder's credentials — 18 checks across 3 vendors. AG04 produced a risk-adjusted bid scoring matrix. AG05 reconciled draws. AG06 drafted GL entries. AG07 is the one that matters most — it caught a conflict of interest no human would have detected.\n\nTotal agent cost for this $182,450 project: $0.66. Equivalent human services: $2,000-$4,000. The agents didn't make the decisions. They made the decisions possible.\n\nClick each agent event (teal badges) to see exactly what the agent did, what sources it consulted, what it cost, and what the human alternative would have been.",sq:{t:"Without agents, volunteer committees can't govern effectively",it:["A 5-person committee meets monthly. 45 minutes. That's the entire governance bandwidth.","Checking contractor licenses? Nobody does it. Drafting from comparable data? Nobody has it.","Bid analysis? The committee picks whoever the chair's neighbor recommended.","GL entries? The treasurer enters transactions once a quarter, maybe.","Conflict checks? There is no check. It's an honor system."]},wc:{t:"7 agents, $0.66 total, 18 checks, 1 conflict caught. Click teal events to inspect.",de:"Every agent event shows: task performed, result, data sources, cost ($0.02-$0.18), and human equivalent ($75-$1,500). Agent events use the same visibility rules as everything else. Agents are auditable on the ledger, not trusted."},hl:["AG01","AG02","AG03","AG04","AG05","AG06","AG07"],fo:"AG07",va:"donor"},
  {ph:"conflict",ti:"The Conflict Caught",su:"Agent AG07 matched an address and a surname in 200ms. No human would have caught it.",na:"A landscaping invoice arrives from 'Coastal Green Services' for $8,400. Agent AG07 scans it: the vendor's address matches committee member Rosa Delgado's home. The registered agent is Miguel Delgado — surname match. No sub-contract on the ledger.\n\nThe agent escalates. The system holds the payment and recuses Rosa automatically. Within 24 hours, Rosa discloses: Coastal Green is her husband's business. The committee re-bids, saves $600, and posts the full incident report.\n\nThe agent's cost: $0.06. The value: $8,400 in prevented self-dealing plus a committee member's reputation protected.",sq:{t:"Today: Conflicts of interest are invisible until they become scandals",it:["A committee member's spouse does landscaping. They submit an invoice. Who would know?","No volunteer committee manually cross-references vendor addresses against member addresses.","Even honest conflicts look terrible after the fact if not disclosed proactively.","The organizer controls the bank account. There is no structural check."]},wc:{t:"AG07 scan > address match > surname match > no sub-contract > HOLD > resolved in 24hrs",de:"AG07: 5 checks in 200ms. 3 flags (address, surname, no sub-contract). Confidence: HIGH. CF-FL: Payment held. CF-FR: Replacement vendor at $7,800. Full disclosure posted. The agent event includes exact sources and reasoning."},hl:["AG07","CF-FL","CF-FR"],fo:"AG07",va:"donor"},
  {ph:"complete",ti:"Project Complete",su:"$118,500 spent. 3 inspections. Zero punch list. 2,000+ families served.",na:"Equipment installed. Final inspection passed. Final walkthrough with committee, contractor, inspector, and 15 community members. Zero deficiencies. A dedication plaque lists all 38 donors.\n\n76 construction days. 180 volunteer hours. 3 city inspections passed. 1 conflict caught. Every dollar accounted for.",sq:null,wc:{t:"Final walkthrough PASS. Every payment verified. Warranty active 5 years.",de:"CF15-CF16: Equipment + inspection. CF18: Final walkthrough PASS. CF19: Final payment + retainage release. Total: $118,500 on $175K budget."},hl:["CF15","CF16","CF17","CF18","CF19"],fo:"CF18",va:"donor"},
  {ph:"surplus",ti:"The Surplus Vote",su:"$63,950 left over. 38 donors vote. 100% turnout. Donors decide.",na:"There's $63,950 left over. On GoFundMe, the organizer keeps it. On Clearfund, the donors vote. Four options. One vote per donor, equal weight — the $25 retiree has the same vote as the $15,000 anonymous donor.\n\n38 of 38 voted (100% turnout). Option A wins: maintenance endowment. The surplus covers 6.3 years of playground upkeep.",sq:{t:"Today: Surplus funds are the organizer's to keep",it:["GoFundMe's terms: once withdrawn, the organizer controls funds entirely.","A campaign raises $180K, spends $120K. The $60K remaining? Nobody knows.","Even honest organizers face 'where did the rest go?' questions.","Donors have no mechanism to decide."]},wc:{t:"On-chain vote. 4 options. 100% turnout. Donors decide, not the organizer.",de:"CF20: Surplus documented with full accounting. 4 options. Option A wins at 47%. Every vote recorded."},hl:["CF20"],fo:"CF20",va:"donor"},
  {ph:"recurring",ti:"From Project to Maintenance",su:"One-time ledger becomes recurring. Same committee. Same transparency. $99/mo.",na:"The project ledger closes. A maintenance ledger opens — inheriting the committee, the donor visibility, and the provenance chain. The $63,950 endowment funds 6.3 years of maintenance at $850/month.\n\nEvery one-time project that creates an ongoing fund becomes a recurring customer acquired at near-zero CAC. This is the PLG bridge.",sq:null,wc:{t:"One-time > recurring. Same architecture. $99/mo. Agents continue operating.",de:"CF21: Maintenance fund created. CF22: Final impact report — 31 events, $0 fees, 7 agent tasks at $0.66, 1 conflict caught, 100% accountability."},hl:["CF21","CF22"],fo:"CF22",va:"donor"},
  {ph:"thesis",ti:"Why This Changes Everything",su:"$0 in fees. $0.66 in agent costs. Volunteer governance that actually works.",na:"The Forsyth Park playground is one project. But 50,000 community fundraises happen every year. In every one, donors give money and hope. Fees skim 3-5%. Organizers control funds unilaterally. Conflicts go undetected.\n\nClearfund doesn't require donors to become auditors or volunteers to become analysts. AI agents handle verification, budgeting, analysis, reconciliation, bookkeeping, and conflict detection for pennies. The committee's job shifts from doing the work to reviewing the work — which is what governance actually means.\n\nEvery agent event is transparent on the ledger. Donors audit the agent the same way they audit the committee. This isn't AI replacing humans. It's AI making human governance affordable at any project size.\n\nThe Delgado family still volunteers at the playground. The system didn't destroy a relationship — it protected one. For six cents.\n\nThis is the same architecture that governs HOA budgets, home renovations, and PE portfolio companies. The provenance chain is identical. The agents are identical. Only the parties change.",sq:null,wc:null,hl:[],fo:null,va:"donor"},
];

var NS=ST.length;

var PROV=[
  {pay:"Agent: Budget Draft (AG01)",amt:0,vendor:"AI Agent",chain:["47 Comparable Projects","Line-Item Benchmarks","Committee Review","CF04 Ratified 5-0"],st:"Done",nt:"$0.12 vs $800-$1,500 consultant"},
  {pay:"Agent: Vendor Verification (AG02-03)",amt:0,vendor:"AI Agent",chain:["18 Checks / 3 Vendors","sos.gov, sam.gov, OFAC, BBB","All Sources On-Chain"],st:"Done",nt:"$0.24 total vs $450-$900 manual verification"},
  {pay:"Agent: Bid Analysis (AG04)",amt:0,vendor:"AI Agent",chain:["Risk-Adjusted Scoring","SPS: 90 | Southern: 77 | PlayCore: 70","Warranty Value Analysis","CF08 Committee 5-0"],st:"Done",nt:"$0.18 vs $500-$1,000 consultant"},
  {pay:"Draw 1: Site Prep",amt:24125,vendor:"Savannah Playground Systems",chain:["CF04 Budget","CF08 Contract","CF10 Work","CF11 Inspection","CF13 Dual-Sig","CF14 USDC","AG05 Reconciled","AG06 GL Entry"],st:"Paid",nt:null},
  {pay:"Agent: Conflict Detection (AG07)",amt:8400,vendor:"BLOCKED",chain:["Invoice Received","AG07 Scan (200ms)","Address Match","Surname Match","CF-FL HELD","CF-FR Resolved $7,800"],st:"Caught",nt:"$0.06. No human would have caught this. Saved $600 + prevented self-dealing."},
  {pay:"Equipment + Surfacing",amt:48250,vendor:"Savannah Playground Systems",chain:["CF15 Work","CF16 Inspection","CF17 Dual-Sig","USDC Transfer"],st:"Paid",nt:null},
  {pay:"Final + Retainage",amt:33775,vendor:"Savannah Playground Systems",chain:["CF18 Final Walkthrough","CF19 Released","Total SPS: $96,500"],st:"Paid",nt:null},
  {pay:"Surplus > Maintenance",amt:63950,vendor:"Donor Vote",chain:["CF20 Vote (100% turnout)","Option A Wins 47%","CF21 Maintenance Fund","$850/mo x 75 months"],st:"Active",nt:"Donors decided, not the organizer."},
  {pay:"ALL AGENT COSTS",amt:0,vendor:"7 AI Agents",chain:["AG01 $0.12","AG02 $0.08","AG03 $0.16","AG04 $0.18","AG05 $0.04","AG06 $0.02","AG07 $0.06","TOTAL $0.66"],st:"$0.66",nt:"Human equivalent: $2,000-$4,000"},
];

var BUDGET=[
  {c:"FUNDING",s:true},{c:"  USDC donations (28 donors)",b:148200,a:148200},{c:"  Credit card donations (10 donors)",b:34250,a:34250},{c:"  Processing fees",b:0,a:0},{c:"  TOTAL NET RAISED",s:true,k:"fund"},
  {c:""},{c:"PROJECT COSTS",s:true},{c:"  Play equipment + installation",b:82000,a:72500},{c:"  Safety surfacing",b:28000,a:24000},{c:"  Accessibility (ADA+)",b:18500,a:17200},{c:"  Site preparation",b:14000,a:10800},{c:"  Landscaping (Savannah Greenscape)",b:12000,a:7800},{c:"  Permits + inspections",b:4500,a:4500},{c:"  Insurance",b:3200,a:3200},{c:"  Design (donated)",b:0,a:0},{c:"  Project mgmt (volunteer)",b:0,a:0},{c:"  TOTAL CONSTRUCTION",s:true,k:"cost"},
  {c:""},{c:"CONTINGENCY",s:true},{c:"  Original (10%)",b:17500,a:0},{c:"  NET CONTINGENCY USED",s:true,k:"cont"},
  {c:""},{c:"TOTAL SPENT",s:true,k:"total"},{c:""},{c:"SURPLUS > MAINTENANCE FUND",s:true,k:"surplus"},{c:""},{c:"FEES PAID TO PLATFORMS",s:true,k:"fees"},
];

function EvCard(p){
  var ev=p.ev;if(!ev)return null;
  var amt=getAmt(ev.d);var vis=ev.vi.indexOf(p.viewAs)>=0;
  var held=ev.tp.indexOf("FLAGGED")>=0;var isAg=ev.ag===true;
  if(!vis)return(
    <div onClick={p.onClick} style={{padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",opacity:0.3,background:p.sel?"rgba(255,255,255,0.04)":"transparent"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{ev.id}</span>
          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.2)",fontWeight:600}}>ENCRYPTED</span>
        </div>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.1)"}}>{ft(ev.ts).split(" ")[0]}</span>
      </div>
    </div>
  );
  return(
    <div onClick={p.onClick} style={{padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",background:p.sel?"rgba(245,166,35,0.06)":p.hlt?"rgba(255,255,255,0.02)":"transparent",borderLeft:p.hlt?"2px solid "+(isAg?"#00D4AA":"#F5A623"):"2px solid transparent"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
          <span style={{width:5,height:5,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
          {isAg&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(0,212,170,0.15)",color:"#00D4AA",fontWeight:700}}>AI</span>}
        </div>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>{ft(ev.ts)}</span>
      </div>
      <div style={{fontSize:11,fontWeight:600,marginTop:3,color:held?"#E8553A":isAg?"#00D4AA":"#E8E8ED"}}>{held?"[HELD] ":""}{L[ev.tp]||ev.tp}</div>
      {amt!=null&&<div style={{fontSize:10,color:"#F5A623",fontWeight:600,fontFamily:mono,marginTop:2}}>{fd(amt)}</div>}
      <div style={{display:"flex",gap:3,marginTop:4}}>{ev.vi.map(function(pk){return <span key={pk} style={{width:5,height:5,borderRadius:"50%",background:C[pk]||"#444",opacity:pk===p.viewAs?1:0.3}}/>;})}</div>
    </div>
  );
}

function EvDetail(p){
  var ev=p.ev;var va=p.viewAs;
  if(!ev)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"rgba(255,255,255,0.15)",fontSize:12}}>Select an event</div>;
  if(ev.vi.indexOf(va)<0)return(
    <div style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
      <div style={{fontSize:36,opacity:0.15}}>&#128274;</div>
      <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.25)"}}>Viewing as {(P[va]||{}).n}</div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.12)"}}>Access: {ev.vi.map(function(v){return (P[v]||{}).n||v;}).join(", ")}</div>
    </div>
  );
  var entries=Object.entries(ev.d);
  return(
    <div style={{padding:18,overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
          <span style={{width:6,height:6,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{(P[ev.pa]||{}).n}</span>
        </div>
        <div style={{fontSize:16,fontWeight:700,color:ev.tp.indexOf("FLAGGED")>=0?"#E8553A":ev.ag?"#00D4AA":"#E8E8ED"}}>{L[ev.tp]||ev.tp}</div>
        {ev.ag&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,padding:"3px 8px",borderRadius:4,background:"rgba(0,212,170,0.08)",border:"1px solid rgba(0,212,170,0.2)"}}><span style={{fontSize:10,color:"#00D4AA",fontWeight:700}}>AI AGENT</span><span style={{fontSize:9,color:"rgba(0,212,170,0.5)"}}>automated task, human-reviewable</span></div>}
        <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:4}}>{ft(ev.ts)}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:12,marginBottom:12}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:6}}>Visibility</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{ev.vi.map(function(pk){var me=pk===va;return <span key={pk} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 7px",borderRadius:4,background:me?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.02)",border:"1px solid "+(me?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.05)"),fontSize:10,fontWeight:600,color:"#E8E8ED"}}><span style={{width:5,height:5,borderRadius:"50%",background:C[pk]||"#666"}}/>{(P[pk]||{}).n}{me?" (you)":""}</span>;})}</div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:12,marginBottom:12}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:6}}>Hash Chain</div>
        <div style={{fontFamily:mono,fontSize:10,color:"rgba(255,255,255,0.4)"}}>
          <span style={{background:"rgba(255,255,255,0.04)",padding:"2px 6px",borderRadius:3}}>prev: {ev.ph}</span>
          <span style={{margin:"0 4px",color:"rgba(255,255,255,0.1)"}}>{">"}</span>
          <span style={{background:"rgba(255,255,255,0.04)",padding:"2px 6px",borderRadius:3}}>this: {ev.h}</span>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",padding:12,marginBottom:12}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:6}}>Signatures ({ev.si.length})</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{ev.si.map(function(sig,i){var auto=sig.indexOf("auto")>=0||sig.indexOf("city")>=0||sig.indexOf("escrow")>=0||sig.indexOf("fiscal")>=0;return <span key={i} style={{padding:"2px 6px",borderRadius:3,fontSize:10,fontFamily:mono,background:auto?"rgba(155,111,232,0.1)":"rgba(45,127,249,0.1)",border:"1px solid "+(auto?"rgba(155,111,232,0.2)":"rgba(45,127,249,0.2)"),color:auto?"#B89AEF":"#6BA3F9"}}>{sig}</span>;})}</div>
      </div>
      {ev.pc&&<div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(245,166,35,0.12)",padding:12,marginBottom:12}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:6}}>Provenance Chain</div>
        {ev.pc.map(function(ch,i){return <div key={i} style={{fontFamily:mono,fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{ch}</div>;})}
      </div>}
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid "+(ev.ag?"rgba(0,212,170,0.12)":"rgba(255,255,255,0.06)"),padding:12}}>
        <div style={{fontSize:9,color:ev.ag?"#00D4AA":"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:6}}>Event Data</div>
        {entries.map(function(e){
          var k=e[0],v=e[1];
          if(typeof v==="object"&&v!==null&&!Array.isArray(v)){
            return <div key={k} style={{padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono,marginBottom:3}}>{k}</div>
              {Object.entries(v).map(function(kv){return <div key={kv[0]} style={{display:"flex",justifyContent:"space-between",marginLeft:12,padding:"1px 0",gap:8}}>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:mono,flexShrink:0}}>{kv[0]}</span>
                <span style={{fontSize:10,color:vc(kv[0]),textAlign:"right",wordBreak:"break-word"}}>{rv(kv[0],kv[1])}</span>
              </div>;})}
            </div>;
          }
          if(Array.isArray(v)){
            return <div key={k} style={{padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono,marginBottom:3}}>{k}</div>
              {v.map(function(item,idx){return <div key={idx} style={{fontSize:10,color:"#E8E8ED",marginLeft:12,lineHeight:1.6}}>{typeof item==="object"?JSON.stringify(item):String(item)}</div>;})}
            </div>;
          }
          var isHighlight=ev.ag&&(k==="agentCost"||k==="humanEquivalent"||k==="confidence"||k==="result"||k==="conflictDetected");
          return <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",gap:8}}>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono,flexShrink:0}}>{k}</span>
            <span style={{fontSize:11,textAlign:"right",wordBreak:"break-word",maxWidth:"65%",color:isHighlight?"#00D4AA":vc(k),fontWeight:isHighlight?600:400}}>{rv(k,v)}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

function BudgetView(){
  return(
    <div style={{overflowY:"auto",height:"100%",padding:16}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Project Budget vs Actuals</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:14}}>Raised: $182,450 | Spent: $118,500 | Surplus: $63,950</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr>{["Line Item","Budget","Actual","Variance"].map(function(h){return <th key={h} style={{padding:"5px 8px",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)",textAlign:h==="Line Item"?"left":"right",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>{h}</th>;})}</tr></thead>
        <tbody>{BUDGET.map(function(r,i){
          if(!r.c)return <tr key={i}><td style={{padding:3}} colSpan={4}></td></tr>;
          if(r.s&&!r.k)return <tr key={i}><td style={{padding:"7px 8px",fontSize:10,fontWeight:700,color:"#F5A623",letterSpacing:0.5}} colSpan={4}>{r.c}</td></tr>;
          if(r.k==="fund")return <tr key={i} style={{background:"rgba(255,255,255,0.02)"}}><td style={{padding:"5px 8px",fontWeight:700}}>{r.c}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(182450)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(182450)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,color:"#18A86B",fontWeight:700}}>$0 fees</td></tr>;
          if(r.k==="cost")return <tr key={i} style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}><td style={{padding:"5px 8px",fontWeight:700}}>{r.c}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(162200)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(140000)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#18A86B"}}>{fd(22200)}</td></tr>;
          if(r.k==="cont")return <tr key={i}><td style={{padding:"5px 8px",fontWeight:700}}>{r.c}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(17500)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(0)}</td><td style={{padding:"5px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#18A86B"}}>{fd(17500)}</td></tr>;
          if(r.k==="total")return <tr key={i} style={{borderTop:"2px solid rgba(245,166,35,0.2)",background:"rgba(245,166,35,0.03)"}}><td style={{padding:"7px 8px",fontWeight:700,color:"#F5A623"}}>{r.c}</td><td colSpan={2} style={{padding:"7px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(118500)}</td><td></td></tr>;
          if(r.k==="surplus")return <tr key={i} style={{background:"rgba(24,168,107,0.03)"}}><td style={{padding:"7px 8px",fontWeight:700,color:"#18A86B"}}>{r.c}</td><td colSpan={2}></td><td style={{padding:"7px 8px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#18A86B"}}>{fd(63950)}</td></tr>;
          if(r.k==="fees")return <tr key={i} style={{background:"rgba(0,212,170,0.03)"}}><td style={{padding:"7px 8px",fontWeight:700,color:"#00D4AA"}}>{r.c}</td><td colSpan={2}></td><td style={{padding:"7px 8px",textAlign:"right",fontFamily:mono,fontSize:13,fontWeight:700,color:"#00D4AA"}}>$0</td></tr>;
          var v=(r.b||0)-(r.a||0);
          return <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}><td style={{padding:"3px 8px"}}>{r.c}</td><td style={{padding:"3px 8px",textAlign:"right",fontFamily:mono}}>{r.b!=null?fd(r.b):""}</td><td style={{padding:"3px 8px",textAlign:"right",fontFamily:mono}}>{r.a!=null?fd(r.a):""}</td><td style={{padding:"3px 8px",textAlign:"right",fontFamily:mono,color:v>=0?"#18A86B":"#E8553A"}}>{v!==0?fd(v):r.b===0&&r.a===0?"donated":"-"}</td></tr>;
        })}</tbody>
      </table>
      <div style={{marginTop:14,padding:"10px 12px",background:"rgba(24,168,107,0.04)",border:"1px solid rgba(24,168,107,0.1)",borderRadius:6}}>
        <div style={{fontSize:10,color:"#18A86B",fontWeight:600,marginBottom:4}}>GOFUNDME COMPARISON</div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Processing fees (2.9%): ~$5,291. Optional tip (avg 15%): ~$27,368. Competitive bidding: none. Conflict detection: none. Surplus: organizer decides.</div>
        <div style={{fontSize:10,color:"#18A86B",fontWeight:600,marginTop:4}}>Clearfund saved $5,291-$32,659 in fees + $600 from conflict catch.</div>
      </div>
    </div>
  );
}

function ProvView(){
  return(
    <div style={{overflowY:"auto",height:"100%",padding:16}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Provenance Map</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:14}}>Every payment and agent task traced end-to-end.</div>
      {PROV.map(function(p,i){
        var isAgent=p.vendor==="AI Agent"||p.vendor==="7 AI Agents";
        var isCaught=p.st==="Caught";
        var bgc=isAgent?"rgba(0,212,170,0.03)":isCaught?"rgba(245,166,35,0.03)":"rgba(255,255,255,0.02)";
        var bc=isAgent?"rgba(0,212,170,0.12)":isCaught?"rgba(245,166,35,0.12)":"rgba(255,255,255,0.06)";
        return <div key={i} style={{marginBottom:12,background:bgc,border:"1px solid "+bc,borderRadius:8,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:isAgent?"#00D4AA":isCaught?"#F5A623":"#E8E8ED"}}>{p.pay}</div>
              {p.amt>0&&<div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:1}}>{p.vendor} | {fd(p.amt)}</div>}
            </div>
            <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,fontWeight:600,background:isAgent?"rgba(0,212,170,0.12)":isCaught?"rgba(245,166,35,0.12)":"rgba(45,127,249,0.12)",color:isAgent?"#00D4AA":isCaught?"#F5A623":p.st==="Active"?"#2D7FF9":"#18A86B"}}>{p.st}</span>
          </div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>{p.chain.map(function(step,si){
            var last=si===p.chain.length-1;
            var alert=step.indexOf("HELD")>=0||step.indexOf("Scan")>=0||step.indexOf("Match")>=0||step.indexOf("TOTAL")>=0;
            return <div key={si} style={{display:"flex",alignItems:"center",gap:3}}>
              <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:alert?"rgba(245,166,35,0.08)":"rgba(255,255,255,0.04)",border:"1px solid "+(alert?"rgba(245,166,35,0.15)":"rgba(255,255,255,0.06)"),color:alert?"#F5A623":"rgba(255,255,255,0.45)",fontFamily:mono,whiteSpace:"nowrap"}}>{step}</span>
              {!last&&<span style={{color:"rgba(255,255,255,0.1)",fontSize:9}}>{">"}</span>}
            </div>;
          })}</div>
          {p.nt&&<div style={{marginTop:6,fontSize:10,color:isAgent?"#00D4AA":"#F5A623",fontStyle:"italic"}}>{p.nt}</div>}
        </div>;
      })}
    </div>
  );
}

function Narr(p){
  var s=ST[p.idx];if(!s)return null;
  return(
    <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontFamily:mono,letterSpacing:1,textTransform:"uppercase"}}>{s.ph}</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.08)"}}>|</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.15)"}}>Step {p.idx+1} of {NS}</span>
      </div>
      <h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",lineHeight:1.2}}>{s.ti}</h2>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",margin:"0 0 20px",lineHeight:1.4}}>{s.su}</p>
      {s.na.split("\n\n").map(function(para,i){return <p key={i} style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.7,margin:"0 0 14px"}}>{para}</p>;})}
      {s.sq&&<div style={{marginTop:20,background:"rgba(232,85,58,0.04)",border:"1px solid rgba(232,85,58,0.1)",borderRadius:10,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#E8553A",marginBottom:8}}>{s.sq.t}</div>
        {s.sq.it.map(function(item,i){return <div key={i} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:"rgba(232,85,58,0.35)",fontSize:11,flexShrink:0}}>{">"}</span><span style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{item}</span></div>;})}
      </div>}
      {s.wc&&<div style={{marginTop:14,background:"rgba(24,168,107,0.04)",border:"1px solid rgba(24,168,107,0.1)",borderRadius:10,padding:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#18A86B",marginBottom:8}}>{s.wc.t}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>{s.wc.de}</div>
      </div>}
      {s.ph==="thesis"&&<div style={{marginTop:22,display:"flex",gap:6,flexWrap:"wrap"}}>
        {["$0 processing fees","$0 platform fees","100% to project","7 AI agents","$0.66 total agent cost","18 verification checks","1 conflict caught","Budget from 47 comps","GL auto-drafted","Same architecture as HOA"].map(function(tag,i){
          return <span key={i} style={{fontSize:10,padding:"3px 9px",borderRadius:4,background:i<3?"rgba(24,168,107,0.08)":i<9?"rgba(0,212,170,0.08)":"rgba(245,166,35,0.08)",border:"1px solid "+(i<3?"rgba(24,168,107,0.12)":i<9?"rgba(0,212,170,0.12)":"rgba(245,166,35,0.12)"),color:i<3?"#18A86B":i<9?"#00D4AA":"#F5A623",fontWeight:500}}>{tag}</span>;
        })}
      </div>}
    </div>
  );
}

export default function App(){
  var ss=useState(0);var step=ss[0];var setStep=ss[1];
  var es=useState(null);var selEv=es[0];var setSelEv=es[1];
  var vs=useState("donor");var viewAs=vs[0];var setViewAs=vs[1];
  var ts=useState("ledger");var tab=ts[0];var setTab=ts[1];
  var listRef=useRef(null);
  var cur=ST[step]||ST[0];
  var show=cur.hl.length>0||cur.ph==="thesis";

  useEffect(function(){
    if(cur.fo){for(var i=0;i<EV.length;i++){if(EV[i].id===cur.fo){setSelEv(EV[i]);break;}}}else{setSelEv(null);}
    if(cur.va)setViewAs(cur.va);
  },[step]);
  useEffect(function(){
    if(listRef.current&&cur.fo){var el=listRef.current.querySelector("[data-eid='"+cur.fo+"']");if(el)el.scrollIntoView({behavior:"smooth",block:"center"});}
  },[step]);
  useEffect(function(){
    function hk(e){if(e.key==="ArrowRight"){e.preventDefault();setStep(function(p){return Math.min(NS-1,p+1);});}if(e.key==="ArrowLeft"){e.preventDefault();setStep(function(p){return Math.max(0,p-1);});}}
    window.addEventListener("keydown",hk);return function(){window.removeEventListener("keydown",hk);};
  },[]);

  var parties=[{k:"donor",l:"Donor",c:"#2D7FF9"},{k:"committee",l:"Committee",c:"#E8553A"},{k:"vendor",l:"Contractor",c:"#18A86B"},{k:"city",l:"City Parks",c:"#9B6FE8"}];

  return(
    <div style={{fontFamily:"'DM Sans',Helvetica,sans-serif",background:"#0D1117",color:"#E8E8ED",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:17,fontWeight:700,letterSpacing:3,color:"#F5A623",fontFamily:mono}}>CLEARFUND</span>
          <span style={{color:"rgba(255,255,255,0.06)"}}>|</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>Forsyth Park Playground</span>
          <span style={{color:"rgba(255,255,255,0.06)"}}>|</span>
          <span style={{fontSize:11,color:"#18A86B",fontWeight:600}}>$0 fees</span>
          <span style={{color:"rgba(255,255,255,0.06)"}}>|</span>
          <span style={{fontSize:11,color:"#00D4AA",fontWeight:600}}>7 AI agents</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>VIEW AS</span>
          <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",borderRadius:6,padding:2}}>
            {parties.map(function(pt){return <button key={pt.k} onClick={function(){setViewAs(pt.k);}} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:4,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:viewAs===pt.k?"rgba(255,255,255,0.1)":"transparent",color:viewAs===pt.k?pt.c:"rgba(255,255,255,0.2)"}}><span style={{width:5,height:5,borderRadius:"50%",background:viewAs===pt.k?pt.c:"rgba(255,255,255,0.1)"}}/>{pt.l}</button>;})}
          </div>
        </div>
      </div>
      <div style={{height:2,background:"rgba(255,255,255,0.04)",flexShrink:0}}><div style={{height:"100%",background:"#F5A623",width:((step+1)/NS*100)+"%",transition:"width 0.4s"}}/></div>
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        <div style={{width:show?400:580,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto"}}><Narr idx={step}/></div>
          <div style={{padding:"10px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <button onClick={function(){setStep(function(x){return Math.max(0,x-1);});}} style={{padding:"7px 18px",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:step===0?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.45)",cursor:step===0?"default":"pointer",fontSize:12,fontWeight:600}}>Prev</button>
            <div style={{display:"flex",gap:3}}>{ST.map(function(_,i){return <button key={i} onClick={function(){setStep(i);}} style={{width:i===step?18:6,height:6,borderRadius:3,border:"none",cursor:"pointer",background:i===step?"#F5A623":i<step?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.08)",transition:"all 0.3s"}}/>;})}</div>
            <button onClick={function(){setStep(function(x){return Math.min(NS-1,x+1);});}} style={{padding:"7px 18px",borderRadius:6,border:"none",background:step===NS-1?"rgba(255,255,255,0.04)":"#F5A623",color:step===NS-1?"rgba(255,255,255,0.12)":"#0D1117",cursor:step===NS-1?"default":"pointer",fontSize:12,fontWeight:700}}>Next</button>
          </div>
        </div>
        {show&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            {[{k:"ledger",l:"Event Ledger"},{k:"budget",l:"Budget vs Actuals"},{k:"provenance",l:"Provenance Map"}].map(function(t){return <button key={t.k} onClick={function(){setTab(t.k);}} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontSize:10,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",background:tab===t.k?"rgba(255,255,255,0.04)":"transparent",color:tab===t.k?"#F5A623":"rgba(255,255,255,0.2)",borderBottom:tab===t.k?"2px solid #F5A623":"2px solid transparent"}}>{t.l}</button>;})}
            {tab==="ledger"&&<div style={{marginLeft:"auto",padding:"7px 12px",fontSize:9,color:"rgba(255,255,255,0.15)"}}>{EV.filter(function(e){return e.vi.indexOf(viewAs)>=0;}).length} visible / {EV.filter(function(e){return e.vi.indexOf(viewAs)<0;}).length} encrypted</div>}
          </div>
          {tab==="ledger"&&<div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{width:280,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",overflowY:"auto"}} ref={listRef}>{EV.map(function(ev){return <div key={ev.id} data-eid={ev.id}><EvCard ev={ev} sel={selEv!=null&&selEv.id===ev.id} hlt={cur.hl.indexOf(ev.id)>=0} viewAs={viewAs} onClick={function(){setSelEv(ev);}}/></div>;})}</div>
            <div style={{flex:1,overflowY:"auto"}}><EvDetail ev={selEv} viewAs={viewAs}/></div>
          </div>}
          {tab==="budget"&&<div style={{flex:1,overflow:"hidden"}}><BudgetView/></div>}
          {tab==="provenance"&&<div style={{flex:1,overflow:"hidden"}}><ProvView/></div>}
        </div>}
      </div>
      <div style={{padding:"5px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.12)",fontFamily:mono}}>31 events | 7 agent tasks ($0.66) | 38 donors | $0 fees | 1 conflict caught</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>Arrow keys to navigate</span>
      </div>
      <style>{"::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}*{box-sizing:border-box}"}</style>
    </div>
  );
}
