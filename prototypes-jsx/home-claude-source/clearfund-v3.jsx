import { useState, useRef, useEffect } from "react";

var C = {donor:"#2D7FF9",committee:"#E8553A",vendor:"#18A86B",city:"#9B6FE8",system:"#F5A623",agent:"#00D4AA",both:"#8B95A5"};
var P = {donor:{n:"Donors"},committee:{n:"Committee"},vendor:{n:"Contractor"},city:{n:"City Parks"},system:{n:"Ledger"},agent:{n:"AI Agent"},both:{n:"All Parties"}};
var L = {CAMPAIGN_CREATED:"Campaign Created",GOAL_FUNDED:"Goal Funded",BUDGET_RATIFIED:"Budget Ratified",COMMITTEE_FORMED:"Committee Formed",BID_RECEIVED:"Bid Received",CONTRACT_AWARDED:"Contract Awarded",PERMIT_ISSUED:"Permit Issued",MILESTONE_COMPLETED:"Milestone Completed",CITY_INSPECTION:"City Inspection Passed",PAYMENT_REQUESTED:"Payment Requested",PAYMENT_APPROVED:"Payment Approved (Dual-Sig)",PAYMENT_RELEASED:"Payment Released",VENDOR_FLAGGED:"Vendor Payment HELD",VENDOR_RESOLVED:"Vendor Issue Resolved",SURPLUS_VOTE:"Surplus Allocation Vote",MAINTENANCE_FUND:"Maintenance Fund Created",DONOR_REPORT:"Donor Impact Report",FINAL_WALKTHROUGH:"Final Walkthrough",AGENT_VERIFICATION:"Agent: Verification",AGENT_BUDGET_DRAFT:"Agent: Budget Draft",AGENT_BID_ANALYSIS:"Agent: Bid Analysis",AGENT_DRAW_RECONCILE:"Agent: Draw Reconciliation",AGENT_GL_ENTRY:"Agent: GL Journal Entry",AGENT_CONFLICT_SCAN:"Agent: Conflict Scan"};
var mono="'IBM Plex Mono',monospace";

function fd(n){return "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function ft(iso){var d=new Date(iso);return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}
function getAmt(d){return d.amount||d.totalRaised||d.totalBudget||d.bidAmount||d.contractAmount||d.paymentAmount||d.fundedAmount||d.surplusAmount||d.monthlyBudget||null;}

function rv(k,v){
  if(v==null)return "-";
  if(typeof v==="boolean")return v?"Yes":"No";
  if(Array.isArray(v))return v.map(function(x){return typeof x==="string"?x:JSON.stringify(x);}).join(", ");
  if(typeof v==="object")return Object.keys(v).map(function(k2){return k2+": "+rv(k2,v[k2]);}).join("; ");
  var kl=(k||"").toLowerCase();
  if(typeof v==="number"&&(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("raised")>=0||kl.indexOf("funded")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("total")>=0||kl.indexOf("surplus")>=0||kl.indexOf("price")>=0||kl.indexOf("fee")>=0||kl.indexOf("remaining")>=0||k==="amount"))return fd(v);
  return String(v);
}
function kc(k){
  var kl=(k||"").toLowerCase();
  if(kl.indexOf("amount")>=0||kl.indexOf("cost")>=0||kl.indexOf("budget")>=0||kl.indexOf("raised")>=0||kl.indexOf("funded")>=0||kl.indexOf("bid")>=0||kl.indexOf("paid")>=0||kl.indexOf("total")>=0||kl.indexOf("surplus")>=0||kl.indexOf("price")>=0||kl.indexOf("fee")>=0)return "#F5A623";
  if(kl.indexOf("fail")>=0||kl.indexOf("held")>=0||kl.indexOf("flag")>=0||kl.indexOf("blocked")>=0||kl.indexOf("match")>=0)return "#E8553A";
  if(kl.indexOf("pass")>=0||kl.indexOf("clear")>=0||kl.indexOf("clean")>=0||kl.indexOf("verified")>=0)return "#18A86B";
  if(kl.indexOf("hash")>=0||kl.indexOf("agent")>=0)return "#9B6FE8";
  return "#E8E8ED";
}

var EV=[
  {id:"CF01",ts:"2026-01-10T09:00:00Z",tp:"CAMPAIGN_CREATED",pa:"committee",vi:["donor","committee","vendor","city"],d:{campaignName:"Rebuild Forsyth Park Playground",location:"Forsyth Park, Savannah GA",goal:175000,organizer:"Forsyth Neighborhood Alliance",taxStatus:"501(c)(3) via Savannah Community Foundation",platformFee:"0% — stablecoin, no processing fees"},h:"cf01a",ph:"000000",si:["committee.sig","fiscal-sponsor.sig"]},
  {id:"CF02",ts:"2026-01-10T09:05:00Z",tp:"COMMITTEE_FORMED",pa:"committee",vi:["donor","committee","city"],d:{members:["Denise Carter (Chair)","Marcus Webb (Treasurer, CPA)","Keisha Thomas (ADA liaison)","James Okafor (Architect, volunteer)","Rosa Delgado (Youth programs)"],quorum:3,signaturesRequired:2,conflictCerts:"All clear",backgroundChecks:"Complete"},h:"cf02b",ph:"cf01a",si:["committee.sig","fiscal-sponsor.sig"]},
  {id:"CF03",ts:"2026-02-28T18:00:00Z",tp:"GOAL_FUNDED",pa:"system",vi:["donor","committee","city"],d:{totalRaised:182450,donorCount:38,medianDonation:500,largestDonation:15000,smallestDonation:25,processingFees:0,platformFees:0,netToProject:182450,daysToFund:49},h:"cf03c",ph:"cf02b",si:["system.auto.sig"]},
  {id:"AG01",ts:"2026-03-01T08:00:00Z",tp:"AGENT_BUDGET_DRAFT",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-budget-v2",task:"Draft budget from 47 comparable playground builds",equipmentBenchmark:"$82K vs $79K median (4% above)",surfacingBenchmark:"$28K vs $31K median (9% below)",accessibilityBenchmark:"$18.5K vs $14K median (32% above — expanded ADA)",contingencyRec:"10% (platform median 8.5%)",status:"DRAFTED — committee ratified 5-0",agentCost:"$0.12",humanEquivalent:"$800-$1,500 consultant"},h:"ag01a",ph:"cf03c",si:["agent.auto.sig"]},
  {id:"CF04",ts:"2026-03-05T10:00:00Z",tp:"BUDGET_RATIFIED",pa:"committee",vi:["donor","committee","vendor","city"],d:{totalBudget:175000,contingency:17500,equipment:82000,surfacing:28000,accessibility:18500,sitePrep:14000,landscaping:12000,permitsInsurance:7700,design:"$0 (donated)",projectMgmt:"$0 (volunteer)",surplusReserved:7450,vote:"5-0 unanimous",agentRef:"AG01 — drafted from 47 comps"},h:"cf04d",ph:"ag01a",si:["committee.sig"]},
  {id:"CF05",ts:"2026-03-10T14:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"Savannah Playground Systems",bidAmount:96500,scope:"Equipment + install + surfacing",license:"GA-CBC-22841",warranty:"5 years",references:"3 municipal projects"},h:"cf05e",ph:"cf04d",si:["vendor-sps.sig"]},
  {id:"AG02",ts:"2026-03-10T14:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-verify-v3",task:"Verify Savannah Playground Systems",gaSecOfState:"PASS — active corporation",license:"PASS — GA-CBC-22841, no disciplinary",insurance:"PASS — $2M GL, Hartford, active to 2027",bond:"PASS — $96,500 active",ofacSDN:"CLEAR — no matches",bbb:"A+, 0 complaints in 24mo",result:"6/6 checks PASS",agentCost:"$0.08",humanEquivalent:"$150-$300 manual (2-4 hrs)"},h:"ag02b",ph:"cf05e",si:["agent.auto.sig"]},
  {id:"CF06",ts:"2026-03-12T10:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"Southern Recreation LLC",bidAmount:108200,scope:"Equipment + install + surfacing + landscape",license:"GA-CBC-18093",warranty:"3 years",references:"5 projects, county preferred vendor"},h:"cf06f",ph:"ag02b",si:["vendor-southern.sig"]},
  {id:"CF07",ts:"2026-03-14T09:00:00Z",tp:"BID_RECEIVED",pa:"vendor",vi:["committee"],d:{bidder:"PlayCore Coastal",bidAmount:91800,scope:"Equipment + install + surfacing",license:"GA-CBC-31205",warranty:"2 years",references:"2 projects (newer company)"},h:"cf07g",ph:"cf06f",si:["vendor-playcore.sig"]},
  {id:"AG03",ts:"2026-03-14T09:01:00Z",tp:"AGENT_VERIFICATION",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-verify-v3",task:"Batch verify Southern + PlayCore",southernRec:"6/6 PASS — licensed, insured, bonded, OFAC clear, BBB A",playCore:"5/6 PASS, 1 NOTE — license 18mo old, $1M GL (lower), BBB unrated",flags:"PlayCore: newer license, lower insurance. Noted for committee.",agentCost:"$0.16",humanEquivalent:"$300-$600 manual"},h:"ag03c",ph:"cf07g",si:["agent.auto.sig"]},
  {id:"AG04",ts:"2026-03-15T08:00:00Z",tp:"AGENT_BID_ANALYSIS",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-analysis-v2",task:"Risk-adjusted bid scoring",savannahPS:"Score 90 — $96.5K, 5yr warranty, 3 refs, $2M ins",southernRec:"Score 77 — $108.2K, 3yr warranty, 5 refs, $2M ins",playCoreCoastal:"Score 70 — $91.8K, 2yr warranty, 2 refs, $1M ins",recommendation:"SPS — highest composite (90/100)",warrantyNote:"Replacement avg $15-30K. 5yr warranty value exceeds $4,700 premium.",status:"PREPARED — committee voted 5-0 per recommendation",agentCost:"$0.18",humanEquivalent:"$500-$1,000 consultant"},h:"ag04d",ph:"ag03c",si:["agent.auto.sig"]},
  {id:"CF08",ts:"2026-03-20T14:00:00Z",tp:"CONTRACT_AWARDED",pa:"committee",vi:["donor","committee","vendor","city"],d:{awardedTo:"Savannah Playground Systems",contractAmount:96500,bidsReceived:3,lowestBid:91800,selected:"2nd lowest — best value per agent score 90/100",agentRef:"AG04",conflictCheck:"PASS",contractType:"Fixed price, 4 milestones",retainage:"10%",vote:"5-0"},h:"cf08h",ph:"ag04d",si:["committee.sig","vendor-sps.sig"]},
  {id:"CF09",ts:"2026-03-22T11:00:00Z",tp:"PERMIT_ISSUED",pa:"city",vi:["donor","committee","vendor","city"],d:{permit:"SAV-PARK-2026-0142",zoning:"PASS",ADA:"Exceeds minimum",historicReview:"PASS",inspectionsRequired:3},h:"cf09i",ph:"cf08h",si:["city-parks.sig"]},
  {id:"CF10",ts:"2026-04-20T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"vendor",vi:["donor","committee","vendor","city"],d:{milestone:"Site Prep + Foundation",milestoneNum:1,photos:34,laborHours:280,volunteerHours:45,volunteerSavings:"$3,200 in demo costs"},h:"cf10j",ph:"cf09i",si:["vendor-sps.sig"]},
  {id:"CF11",ts:"2026-04-21T09:00:00Z",tp:"CITY_INSPECTION",pa:"city",vi:["donor","committee","vendor","city"],d:{type:"Foundation/Grading",inspector:"David Chen",result:"PASS",notes:"Drainage verified. ADA grade 4.8% (max 5%).",deficiencies:0},h:"cf11k",ph:"cf10j",si:["city-inspector.sig"]},
  {id:"CF12",ts:"2026-04-22T10:00:00Z",tp:"PAYMENT_REQUESTED",pa:"vendor",vi:["committee","vendor"],d:{paymentAmount:24125,calc:"$96,500 x 25%",inspRef:"CF11 PASS",invoice:"SPS-2026-0087"},h:"cf12l",ph:"cf11k",si:["vendor-sps.sig"]},
  {id:"CF13",ts:"2026-04-22T15:00:00Z",tp:"PAYMENT_APPROVED",pa:"committee",vi:["donor","committee","vendor"],d:{paymentAmount:24125,signer1:"Denise Carter (Chair)",signer2:"Marcus Webb (Treasurer)",dualSig:true,budgetCheck:"PASS — 25% of contract",cumulativePaid:24125},h:"cf13m",ph:"cf12l",si:["carter.sig","webb.sig"]},
  {id:"CF14",ts:"2026-04-23T08:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["donor","committee","vendor"],d:{fundedAmount:24125,payee:"Savannah Playground Systems",method:"USDC",txHash:"0x7a3f...b8c2",fee:0,escrowRemaining:158325},h:"cf14n",ph:"cf13m",si:["system.auto.sig"]},
  {id:"AG05",ts:"2026-04-23T08:01:00Z",tp:"AGENT_DRAW_RECONCILE",pa:"agent",vi:["donor","committee"],ag:true,d:{agentId:"clearfund-reconcile-v2",task:"Reconcile draw vs budget + schedule",draw:1,drawAmt:"$24,125",pctContract:"25.0% — matches milestone",anomalies:0,result:"CLEAN",agentCost:"$0.04",humanEquivalent:"$200-$400 bookkeeper (2-3 hrs)"},h:"ag05e",ph:"cf14n",si:["agent.auto.sig"]},
  {id:"AG06",ts:"2026-04-23T08:02:00Z",tp:"AGENT_GL_ENTRY",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-gl-v1",task:"Draft GL journal entries",debit:"Construction in Progress $24,125",credit:"Project Escrow (USDC) $24,125",retainageEntry:"DR Retainage Recv $2,413 / CR CIP $2,413",glTarget:"QuickBooks Online",status:"DRAFTED — treasurer approved batch",agentCost:"$0.02",humanEquivalent:"$75-$150 bookkeeper"},h:"ag06f",ph:"ag05e",si:["agent.auto.sig"]},
  {id:"AG07",ts:"2026-05-15T10:58:00Z",tp:"AGENT_CONFLICT_SCAN",pa:"agent",vi:["committee"],ag:true,d:{agentId:"clearfund-conflict-v2",task:"Scan invoice vs conflict graph",trigger:"Coastal Green Services invoice $8,400",check1:"Sub-contract on ledger? FAIL — none found",check2:"Address match? MATCH — 1847 Habersham St = Rosa Delgado",check3:"Registered agent? Miguel Delgado — surname match",check4:"OFAC? CLEAR",check5:"License? PASS — GA-CBC-29104",conflictDetected:true,confidence:"HIGH",action:"HOLD + recuse + notify fiscal sponsor",agentCost:"$0.06",humanEquivalent:"Would not have been caught"},h:"ag07g",ph:"ag06f",si:["agent.auto.sig"]},
  {id:"CFFL",ts:"2026-05-15T11:00:00Z",tp:"VENDOR_FLAGGED",pa:"system",vi:["committee","vendor"],d:{vendor:"Coastal Green Services",requestedAmount:8400,source:"Agent AG07 conflict scan",reason:"Address + surname match to committee member. No sub-contract.",risk:"HIGH",autoAction:"HELD. Rosa Delgado recused. Fiscal sponsor notified."},h:"cffl1",ph:"ag07g",si:["system.auto.sig"]},
  {id:"CFFR",ts:"2026-05-16T14:00:00Z",tp:"VENDOR_RESOLVED",pa:"committee",vi:["donor","committee","city"],d:{disclosure:"Rosa: Coastal Green is husband's business. Informal recommendation, not intentional.",action:"Removed. Competitive re-bid conducted.",replacement:"Savannah Greenscape $7,800",savings:600,vote:"4-0 (Delgado recused)",publicReport:"Full incident posted to donor ledger"},h:"cffr2",ph:"cffl1",si:["carter.sig","webb.sig","thomas.sig","okafor.sig","fiscal-sponsor.sig"]},
  {id:"CF15",ts:"2026-06-10T16:00:00Z",tp:"MILESTONE_COMPLETED",pa:"vendor",vi:["donor","committee","vendor","city"],d:{milestone:"Equipment Installation",milestoneNum:2,photos:52,features:"Wheelchair swing, transfer platform, sensory panels, shade structures",communityPreview:"40+ families preview day"},h:"cf15o",ph:"cffr2",si:["vendor-sps.sig"]},
  {id:"CF16",ts:"2026-06-11T09:00:00Z",tp:"CITY_INSPECTION",pa:"city",vi:["donor","committee","vendor","city"],d:{type:"Equipment + Surfacing",inspector:"David Chen",result:"PASS",standard:"CPSC/ASTM F1487 — exceeds minimum",deficiencies:0},h:"cf16p",ph:"cf15o",si:["city-inspector.sig"]},
  {id:"CF17",ts:"2026-06-12T10:00:00Z",tp:"PAYMENT_APPROVED",pa:"committee",vi:["donor","committee","vendor"],d:{paymentAmount:48250,signer1:"Keisha Thomas",signer2:"Marcus Webb",milestones:"M2 + M3 (equipment + surfacing)",cumulativePaid:72375,retainageHeld:9650},h:"cf17q",ph:"cf16p",si:["thomas.sig","webb.sig"]},
  {id:"CF18",ts:"2026-07-05T10:00:00Z",tp:"FINAL_WALKTHROUGH",pa:"both",vi:["donor","committee","vendor","city"],d:{attendees:"Committee + inspector + contractor + 15 residents",result:"PASS",punchList:0,certified:true,warranty:"5yr — Savannah Playground Systems",plaque:"38 donors listed by name"},h:"cf18r",ph:"cf17q",si:["committee.sig","vendor-sps.sig","city-inspector.sig"]},
  {id:"CF19",ts:"2026-07-06T09:00:00Z",tp:"PAYMENT_RELEASED",pa:"system",vi:["donor","committee","vendor"],d:{fundedAmount:33775,payee:"SPS final + retainage",txHash:"0x9d2e...f4a1",totalToSPS:96500,totalToGreenscape:7800,totalOther:14200,fee:0},h:"cf19s",ph:"cf18r",si:["system.auto.sig"]},
  {id:"CF20",ts:"2026-07-10T14:00:00Z",tp:"SURPLUS_VOTE",pa:"donor",vi:["donor","committee","city"],d:{surplusAmount:63950,method:"On-chain, 1 vote/donor, equal weight",optA:"Maintenance endowment",optB:"Phase 2 fitness stations",optC:"Return pro-rata",optD:"Donate to Foundation",result:"A:18(47%) B:14(37%) C:2(5%) D:4(11%)",winner:"Option A",turnout:"38/38 (100%)"},h:"cf20t",ph:"cf19s",si:["system.auto.sig"]},
  {id:"CF21",ts:"2026-07-15T10:00:00Z",tp:"MAINTENANCE_FUND",pa:"committee",vi:["donor","committee","city"],d:{type:"Recurring ledger",monthlyBudget:850,endowment:"$63,950 (6.3 years)",scope:"Inspections, repair, landscaping",governance:"Same committee, annual report",platformFee:"$99/mo Clearfund Recurring"},h:"cf21u",ph:"cf20t",si:["committee.sig"]},
  {id:"CF22",ts:"2026-07-20T09:00:00Z",tp:"DONOR_REPORT",pa:"system",vi:["donor","committee","city"],d:{totalRaised:182450,totalSpent:118500,surplus:63950,fees:"$0",donors:38,days:76,volunteerHrs:180,families:"2,000+",conflicts:"1 caught by agent AG07",inspections:"3/3 passed",agentTasks:7,agentCost:"$0.66",humanSaved:"$2,000-$4,000",warranty:"5yr active",maintenance:"$63,950 endowment"},h:"cf22v",ph:"cf21u",si:["system.auto.sig"]},
];

var ST=[
  {ph:"context",ti:"The Problem with Crowdfunding",su:"$182,450 raised. 38 donors. On GoFundMe, that's where accountability ends.",na:"After a storm condemned the Forsyth Park playground, the neighborhood raised $182,450 to rebuild it. On GoFundMe, that money goes into someone's bank account. The 38 donors receive a 'thanks' email and never know what happened next.\n\nThis is a $50 billion annual market. The accountability infrastructure: a thank-you email and hope.\n\nClearfund is a transparent ledger where every donor sees every dollar. AI agents handle verification, analysis, and bookkeeping for pennies. No processing fees. No trust required.",sq:null,wc:null,hl:[],fo:null,va:"donor"},
  {ph:"campaign",ti:"The Campaign",su:"38 donors. Zero fees. $182,450 raised in 49 days.",na:"A 5-person volunteer committee forms with conflict certifications and background checks. Two signatures required for any payment.\n\n49 days later: $182,450 from 38 donors. Processing fees: $0. Net to project: 100%.\n\nOn GoFundMe, payment processing would have cost $5,291 (2.9%). Here, that $5,291 stays in the playground.",sq:{t:"Today: GoFundMe takes its cut and accountability disappears",it:["GoFundMe charges 2.9% + $0.30/donation. On $182K: $5,291.","Donors see 'updates' posted by the organizer. No verification.","Money goes into the organizer's bank account. Period.","If $64K is left over, the organizer decides. Unilaterally."]},wc:{t:"$0 fees. 5-member committee. Dual-sig. Every donor sees every event.",de:"CF01-CF03: Campaign created, committee formed, $182,450 raised with zero processing fees."},hl:["CF01","CF02","CF03"],fo:"CF03",va:"donor"},
  {ph:"budget",ti:"The Budget",su:"Agent drafts from 47 comparable projects. Committee ratifies 5-0.",na:"Before the committee meets, an AI agent analyzes 47 playground builds on Clearfund and drafts a line-item budget with benchmarks. Equipment at $82K is within 4% of median. Surfacing 9% below. Accessibility 32% above — justified by expanded ADA scope.\n\nThe committee reviews, adjusts 2 items, ratifies 5-0. Agent cost: $0.12. Consultant equivalent: $800-$1,500.",sq:null,wc:{t:"Agent-drafted budget from platform data. Committee reviewed and ratified.",de:"AG01: Budget drafted from 47 comps with line-item benchmarks. CF04: Committee ratified 5-0 after adjusting 2 items."},hl:["AG01","CF04"],fo:"AG01",va:"donor"},
  {ph:"bidding",ti:"Competitive Bidding",su:"3 bids. Agent verifies all 3. Agent scores them. Committee decides.",na:"As each bid arrives, an agent instantly verifies license, insurance, bond, OFAC, and BBB against authoritative sources. Verification events land on the ledger with citations.\n\nThen the agent scores all three: SPS at 90, Southern at 77, PlayCore at 70. The $4,700 premium for SPS is justified by the 5-year warranty — replacement averages $15-30K.\n\nThe committee votes 5-0 for SPS. They reviewed the analysis. The decision was theirs.",sq:{t:"Today: Donors never see bids or know why a contractor was chosen",it:["The organizer picks a contractor. Maybe 3 bids. Maybe 1. You'll never know.","No volunteer committee has expertise for risk-adjusted analysis.","License and insurance status invisible to donors."]},wc:{t:"Agent-verified credentials. Agent-scored bids. Human decision. All on-chain.",de:"AG02-AG03: 18 checks across 3 vendors, all verified. AG04: Scoring matrix with warranty analysis. CF08: Committee 5-0."},hl:["CF05","AG02","CF06","CF07","AG03","AG04","CF08"],fo:"AG04",va:"donor"},
  {ph:"milestone",ti:"First Milestone + Agent Reconciliation",su:"Work done. Inspected. Paid. Agent reconciles. Agent drafts GL.",na:"Site prep complete. City inspection passed. Dual-sig approval. USDC transfer. Zero fees.\n\nThen two agent events fire: AG05 reconciles the draw — $24,125 is 25% of contract, matches schedule, zero anomalies. AG06 drafts GL journal entries for the treasurer.\n\nMarcus Webb reviews the batch in 5 minutes instead of 3 hours of bookkeeping. Agent cost: $0.06. Human equivalent: $275-$550.",sq:null,wc:{t:"Work > inspection > dual-sig > payment > reconciliation > GL entry.",de:"CF10-CF14: Milestone through payment. AG05: Reconciliation CLEAN. AG06: GL entries drafted, treasurer approved."},hl:["CF10","CF11","CF13","CF14","AG05","AG06"],fo:"AG05",va:"donor"},
  {ph:"agents",ti:"The Agent Layer",su:"7 agents. $0.66 total. 18 checks. 1 conflict caught. Zero trust required.",na:"Throughout this project, AI agents operated alongside the committee — not replacing judgment, but eliminating the tasks that make volunteer governance unsustainable.\n\nAG01 drafted the budget from 47 comparables. AG02-03 verified every bidder — 18 checks, authoritative sources. AG04 scored bids with warranty analysis. AG05 reconciled draws. AG06 drafted GL entries. AG07 caught a conflict no human would have detected.\n\nTotal cost: $0.66. Human equivalent: $2,000-$4,000.\n\nEvery agent event shows: task, result, sources, cost, and human alternative. Click the teal badges to inspect.",sq:{t:"Without agents, volunteer committees can't govern effectively",it:["45 minutes per monthly meeting. That's the entire governance bandwidth.","License checks? Nobody does them. Bid analysis? Nobody has the data.","GL entries? The treasurer gets to it eventually.","Conflict checks? Honor system."]},wc:{t:"7 agents, $0.66 total. Click teal events to see exactly what each did.",de:"Each agent event shows task performed, data sources, result, agent cost ($0.02-$0.18), and human equivalent ($75-$1,500). Agents are auditable, not trusted."},hl:["AG01","AG02","AG03","AG04","AG05","AG06","AG07"],fo:"AG07",va:"donor"},
  {ph:"conflict",ti:"The Conflict Caught",su:"Agent AG07: address match + surname match in 200ms. $0.06.",na:"An invoice from 'Coastal Green Services' for $8,400. Agent AG07 scans: address matches Rosa Delgado's home. Registered agent: Miguel Delgado. No sub-contract on ledger.\n\nPayment held. Rosa recused. She discloses: it's her husband's business. Replacement vendor sourced at $7,800 (saving $600). Full report posted to donors.\n\nAgent cost: $0.06. No human would have address-matched every invoice against every committee member.",sq:{t:"Today: Conflicts are invisible until they become scandals",it:["A committee member's spouse submits an invoice. Who would know?","No volunteer cross-references vendor addresses against member addresses.","Donors find out months later through rumors."]},wc:{t:"AG07 > address match > surname match > HOLD > resolved 24hrs > $600 saved",de:"AG07: 5 checks in 200ms, 3 flags. CFFL: Payment held. CFFR: Resolved with competitive re-bid."},hl:["AG07","CFFL","CFFR"],fo:"AG07",va:"donor"},
  {ph:"complete",ti:"Project Complete",su:"$118,500 spent. 3 inspections. Zero punch list. 2,000+ families.",na:"Equipment installed. Final inspection passed. Final walkthrough: zero deficiencies. Dedication plaque lists all 38 donors.\n\n76 days. 180 volunteer hours. 3 inspections passed. 1 conflict caught. Every dollar accounted for.",sq:null,wc:{t:"Final walkthrough PASS. Every payment verified. Warranty active 5 years.",de:"CF15-CF19: Equipment, inspection, final walkthrough, payment. Total: $118,500."},hl:["CF15","CF16","CF17","CF18","CF19"],fo:"CF18",va:"donor"},
  {ph:"surplus",ti:"The Surplus Vote",su:"$63,950 left over. 38 donors vote. 100% turnout.",na:"On GoFundMe, the organizer keeps surplus. On Clearfund, donors vote. Four options. Equal weight — the $25 donor has the same vote as the $15,000 donor.\n\n100% turnout. Option A wins: maintenance endowment. 6.3 years of upkeep funded.",sq:{t:"Today: Surplus is the organizer's to keep",it:["GoFundMe terms: once withdrawn, organizer controls funds.","$60K left over? Nobody knows.","Donors have no mechanism to decide."]},wc:{t:"On-chain vote. 4 options. 100% turnout. Donors decide.",de:"CF20: Surplus documented. Option A wins at 47%."},hl:["CF20"],fo:"CF20",va:"donor"},
  {ph:"recurring",ti:"From Project to Maintenance",su:"One-time ledger becomes recurring. Same transparency. $99/mo.",na:"Project ledger closes. Maintenance ledger opens — same committee, same visibility, same provenance chain. The endowment funds 6.3 years at $850/month.\n\nEvery one-time project that creates an ongoing fund = a recurring customer at near-zero CAC.",sq:null,wc:{t:"One-time > recurring. Same architecture. Agents continue.",de:"CF21: Maintenance fund. CF22: Final report — 31 events, $0 fees, 7 agents at $0.66, 1 conflict caught."},hl:["CF21","CF22"],fo:"CF22",va:"donor"},
  {ph:"thesis",ti:"Why This Changes Everything",su:"$0 fees. $0.66 agents. Volunteer governance that works.",na:"50,000 community fundraises happen annually. In every one, donors hope. Fees skim 3-5%. Conflicts go undetected.\n\nClearfund: AI agents handle verification, budgeting, analysis, reconciliation, bookkeeping, and conflict detection for pennies. The committee reviews instead of doing. That's what governance means.\n\nThe Delgado family still volunteers. The system protected a relationship. For six cents.\n\nSame architecture as HOA budgets, home renovations, PE portfolios. Same provenance chain. Same agents. Only the parties change.",sq:null,wc:null,hl:[],fo:null,va:"donor"},
];

var NS=ST.length;

var PROV=[
  {pay:"Agent: Budget Draft",amt:0,vn:"AI Agent",ch:["47 Comps","Benchmarks","CF04 Ratified"],st:"Done",nt:"$0.12 vs $800-$1,500"},
  {pay:"Agent: Vendor Verification",amt:0,vn:"AI Agent",ch:["18 Checks","3 Vendors","sos.gov, sam.gov, OFAC, BBB"],st:"Done",nt:"$0.24 vs $450-$900"},
  {pay:"Agent: Bid Analysis",amt:0,vn:"AI Agent",ch:["SPS:90","Southern:77","PlayCore:70","CF08 Voted 5-0"],st:"Done",nt:"$0.18 vs $500-$1,000"},
  {pay:"Draw 1: Site Prep",amt:24125,vn:"SPS",ch:["CF10 Work","CF11 Insp","CF13 Dual-Sig","CF14 USDC","AG05 Reconciled","AG06 GL"],st:"Paid",nt:null},
  {pay:"Agent: Conflict Detection",amt:8400,vn:"BLOCKED",ch:["AG07 Scan","Addr Match","Name Match","CFFL HELD","CFFR $7,800"],st:"Caught",nt:"$0.06. No human would have caught this."},
  {pay:"Equipment + Surfacing",amt:48250,vn:"SPS",ch:["CF15 Work","CF16 Insp","CF17 Dual-Sig","USDC"],st:"Paid",nt:null},
  {pay:"Final + Retainage",amt:33775,vn:"SPS",ch:["CF18 Final","CF19 Released"],st:"Paid",nt:null},
  {pay:"Surplus > Maintenance",amt:63950,vn:"Donor Vote",ch:["CF20 Vote 100%","Option A 47%","CF21 Fund"],st:"Active",nt:null},
  {pay:"ALL AGENT COSTS",amt:0,vn:"7 Agents",ch:["$0.12","$0.08","$0.16","$0.18","$0.04","$0.02","$0.06","= $0.66"],st:"$0.66",nt:"Human equiv: $2,000-$4,000"},
];

var BUD=[
  {c:"FUNDING",s:true},{c:"  USDC (28 donors)",b:148200,a:148200},{c:"  Credit card (10 donors)",b:34250,a:34250},{c:"  Fees deducted",b:0,a:0},{c:"TOTAL RAISED",s:true,k:"fund"},
  {c:""},{c:"CONSTRUCTION",s:true},{c:"  Equipment + install",b:82000,a:72500},{c:"  Surfacing",b:28000,a:24000},{c:"  Accessibility (ADA+)",b:18500,a:17200},{c:"  Site prep",b:14000,a:10800},{c:"  Landscaping",b:12000,a:7800},{c:"  Permits",b:4500,a:4500},{c:"  Insurance",b:3200,a:3200},{c:"  Design (donated)",b:0,a:0},{c:"TOTAL CONSTRUCTION",s:true,k:"cost"},
  {c:""},{c:"  Contingency (10%)",b:17500,a:0},{c:"TOTAL SPENT",s:true,k:"total"},{c:""},{c:"SURPLUS > MAINTENANCE",s:true,k:"surplus"},{c:""},{c:"PLATFORM FEES",s:true,k:"fees"},
];

function EvCard(p){
  var ev=p.ev,vis=ev.vi.indexOf(p.viewAs)>=0,held=ev.tp.indexOf("FLAGGED")>=0,ag=ev.ag===true;
  if(!vis)return <div onClick={p.onClick} style={{padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",opacity:0.25,cursor:"pointer"}}>
    <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontFamily:mono}}>{ev.id}</span><span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.2)"}}>ENCRYPTED</span></div>
  </div>;
  var amt=getAmt(ev.d);
  return <div onClick={p.onClick} style={{padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer",background:p.sel?"rgba(245,166,35,0.06)":p.hlt?"rgba(255,255,255,0.02)":"transparent",borderLeft:p.hlt?"2px solid "+(ag?"#00D4AA":"#F5A623"):"2px solid transparent"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
        <span style={{width:5,height:5,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
        {ag&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(0,212,170,0.15)",color:"#00D4AA",fontWeight:700}}>AI</span>}
      </div>
      <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>{ft(ev.ts)}</span>
    </div>
    <div style={{fontSize:11,fontWeight:600,marginTop:2,color:held?"#E8553A":ag?"#00D4AA":"#E8E8ED"}}>{held?"[HELD] ":""}{L[ev.tp]||ev.tp}</div>
    {amt!=null&&<div style={{fontSize:10,color:"#F5A623",fontWeight:600,fontFamily:mono,marginTop:1}}>{fd(amt)}</div>}
  </div>;
}

function EvDetail(p){
  var ev=p.ev,va=p.viewAs;
  if(!ev)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"rgba(255,255,255,0.12)",fontSize:12}}>Select an event</div>;
  if(ev.vi.indexOf(va)<0)return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10}}><div style={{fontSize:32,opacity:0.12}}>&#128274;</div><div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>Not in your visibility manifest</div></div>;
  var entries=Object.entries(ev.d);
  return <div style={{padding:16,overflowY:"auto",height:"100%"}}>
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:mono}}>{ev.id}</span>
        <span style={{width:6,height:6,borderRadius:"50%",background:C[ev.pa]||"#666"}}/>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{(P[ev.pa]||{}).n}</span>
      </div>
      <div style={{fontSize:15,fontWeight:700,color:ev.tp.indexOf("FLAGGED")>=0?"#E8553A":ev.ag?"#00D4AA":"#E8E8ED"}}>{L[ev.tp]||ev.tp}</div>
      {ev.ag&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:3,padding:"2px 7px",borderRadius:3,background:"rgba(0,212,170,0.08)",border:"1px solid rgba(0,212,170,0.15)"}}><span style={{fontSize:9,color:"#00D4AA",fontWeight:700}}>AI AGENT</span><span style={{fontSize:8,color:"rgba(0,212,170,0.45)"}}>automated, human-reviewable</span></div>}
      <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:3}}>{ft(ev.ts)}</div>
    </div>
    <div style={{background:"rgba(255,255,255,0.02)",borderRadius:6,border:"1px solid rgba(255,255,255,0.05)",padding:10,marginBottom:10}}>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:4}}>Hash</div>
      <div style={{fontFamily:mono,fontSize:9,color:"rgba(255,255,255,0.35)"}}>{ev.ph} {">"} {ev.h}</div>
    </div>
    <div style={{background:"rgba(255,255,255,0.02)",borderRadius:6,border:"1px solid rgba(255,255,255,0.05)",padding:10,marginBottom:10}}>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:4}}>Sigs ({ev.si.length})</div>
      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{ev.si.map(function(s,i){return <span key={i} style={{fontSize:9,fontFamily:mono,padding:"1px 5px",borderRadius:2,background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)"}}>{s}</span>;})}</div>
    </div>
    {ev.pc&&<div style={{background:"rgba(255,255,255,0.02)",borderRadius:6,border:"1px solid rgba(245,166,35,0.1)",padding:10,marginBottom:10}}>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:4}}>Provenance</div>
      {ev.pc.map(function(c,i){return <div key={i} style={{fontSize:9,fontFamily:mono,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>{c}</div>;})}
    </div>}
    <div style={{background:"rgba(255,255,255,0.02)",borderRadius:6,border:"1px solid "+(ev.ag?"rgba(0,212,170,0.1)":"rgba(255,255,255,0.05)"),padding:10}}>
      <div style={{fontSize:8,color:ev.ag?"#00D4AA":"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:4}}>Data</div>
      {entries.map(function(e){var k=e[0],v=e[1];
        var hl=ev.ag&&(k==="agentCost"||k==="humanEquivalent"||k==="result"||k==="confidence"||k==="conflictDetected");
        return <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.02)",gap:8}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontFamily:mono,flexShrink:0}}>{k}</span>
          <span style={{fontSize:10,textAlign:"right",wordBreak:"break-word",maxWidth:"62%",color:hl?"#00D4AA":kc(k),fontWeight:hl?600:400}}>{rv(k,v)}</span>
        </div>;
      })}
    </div>
  </div>;
}

function BudgetView(){
  return <div style={{overflowY:"auto",height:"100%",padding:14}}>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Budget vs Actuals</div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
      <thead><tr>{["","Budget","Actual","Var"].map(function(h,i){return <th key={i} style={{padding:"4px 6px",fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.3)",textAlign:i===0?"left":"right",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>{h}</th>;})}</tr></thead>
      <tbody>{BUD.map(function(r,i){
        if(!r.c)return <tr key={i}><td style={{padding:2}} colSpan={4}></td></tr>;
        if(r.s&&!r.k)return <tr key={i}><td style={{padding:"6px 6px",fontSize:9,fontWeight:700,color:"#F5A623"}} colSpan={4}>{r.c}</td></tr>;
        if(r.k==="fund")return <tr key={i} style={{background:"rgba(255,255,255,0.02)"}}><td style={{padding:"4px 6px",fontWeight:700}}>{r.c}</td><td style={{padding:"4px 6px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(182450)}</td><td style={{padding:"4px 6px",textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(182450)}</td><td style={{padding:"4px 6px",textAlign:"right",color:"#18A86B",fontWeight:700}}>$0 fees</td></tr>;
        if(r.k==="cost")return <tr key={i} style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}><td style={{padding:"4px 6px",fontWeight:700}}>{r.c}</td><td style={{textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(162200)}</td><td style={{textAlign:"right",fontFamily:mono,fontWeight:700}}>{fd(140000)}</td><td style={{textAlign:"right",fontFamily:mono,color:"#18A86B",fontWeight:700}}>{fd(22200)}</td></tr>;
        if(r.k==="total")return <tr key={i} style={{borderTop:"2px solid rgba(245,166,35,0.2)",background:"rgba(245,166,35,0.03)"}}><td style={{padding:"6px 6px",fontWeight:700,color:"#F5A623"}}>{r.c}</td><td colSpan={2} style={{textAlign:"right",fontFamily:mono,fontWeight:700,color:"#F5A623"}}>{fd(118500)}</td><td></td></tr>;
        if(r.k==="surplus")return <tr key={i} style={{background:"rgba(24,168,107,0.03)"}}><td style={{padding:"6px 6px",fontWeight:700,color:"#18A86B"}}>{r.c}</td><td colSpan={2}></td><td style={{textAlign:"right",fontFamily:mono,fontWeight:700,color:"#18A86B"}}>{fd(63950)}</td></tr>;
        if(r.k==="fees")return <tr key={i} style={{background:"rgba(0,212,170,0.03)"}}><td style={{padding:"6px 6px",fontWeight:700,color:"#00D4AA"}}>{r.c}</td><td colSpan={2}></td><td style={{textAlign:"right",fontFamily:mono,fontSize:12,fontWeight:700,color:"#00D4AA"}}>$0</td></tr>;
        var v=(r.b||0)-(r.a||0);
        return <tr key={i}><td style={{padding:"2px 6px"}}>{r.c}</td><td style={{textAlign:"right",fontFamily:mono}}>{r.b!=null?fd(r.b):""}</td><td style={{textAlign:"right",fontFamily:mono}}>{r.a!=null?fd(r.a):""}</td><td style={{textAlign:"right",fontFamily:mono,color:v>=0?"#18A86B":"#E8553A"}}>{v!==0?fd(v):r.b===0?"donated":""}</td></tr>;
      })}</tbody>
    </table>
  </div>;
}

function ProvView(){
  return <div style={{overflowY:"auto",height:"100%",padding:14}}>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Provenance Map</div>
    {PROV.map(function(p,i){
      var ag=p.vn==="AI Agent"||p.vn==="7 Agents",caught=p.st==="Caught";
      return <div key={i} style={{marginBottom:10,background:ag?"rgba(0,212,170,0.03)":caught?"rgba(245,166,35,0.03)":"rgba(255,255,255,0.02)",border:"1px solid "+(ag?"rgba(0,212,170,0.1)":caught?"rgba(245,166,35,0.1)":"rgba(255,255,255,0.05)"),borderRadius:6,padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <div style={{fontSize:11,fontWeight:600,color:ag?"#00D4AA":caught?"#F5A623":"#E8E8ED"}}>{p.pay}{p.amt>0?" | "+fd(p.amt):""}</div>
          <span style={{fontSize:8,padding:"2px 6px",borderRadius:3,fontWeight:600,background:ag?"rgba(0,212,170,0.1)":"rgba(255,255,255,0.05)",color:ag?"#00D4AA":caught?"#F5A623":"#18A86B"}}>{p.st}</span>
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{p.ch.map(function(s,j){return <div key={j} style={{display:"flex",alignItems:"center",gap:3}}>
          <span style={{fontSize:8,padding:"1px 5px",borderRadius:2,fontFamily:mono,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)"}}>{s}</span>
          {j<p.ch.length-1&&<span style={{fontSize:8,color:"rgba(255,255,255,0.1)"}}>{">"}</span>}
        </div>;})}</div>
        {p.nt&&<div style={{fontSize:9,color:ag?"#00D4AA":"#F5A623",marginTop:5,fontStyle:"italic"}}>{p.nt}</div>}
      </div>;
    })}
  </div>;
}

function Narr(p){
  var s=ST[p.idx];if(!s)return null;
  return <div style={{padding:"20px 24px",overflowY:"auto",height:"100%"}}>
    <div style={{fontSize:9,color:"rgba(255,255,255,0.12)",fontFamily:mono,marginBottom:12}}>{s.ph} | {p.idx+1}/{NS}</div>
    <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px",lineHeight:1.2}}>{s.ti}</h2>
    <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 16px"}}>{s.su}</p>
    {s.na.split("\n\n").map(function(para,i){return <p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.65,margin:"0 0 12px"}}>{para}</p>;})}
    {s.sq&&<div style={{marginTop:16,background:"rgba(232,85,58,0.04)",border:"1px solid rgba(232,85,58,0.08)",borderRadius:8,padding:14}}>
      <div style={{fontSize:10,fontWeight:700,color:"#E8553A",marginBottom:6}}>{s.sq.t}</div>
      {s.sq.it.map(function(x,i){return <div key={i} style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.5,marginBottom:4,paddingLeft:10}}>{x}</div>;})}
    </div>}
    {s.wc&&<div style={{marginTop:12,background:"rgba(24,168,107,0.04)",border:"1px solid rgba(24,168,107,0.08)",borderRadius:8,padding:14}}>
      <div style={{fontSize:10,fontWeight:700,color:"#18A86B",marginBottom:6}}>{s.wc.t}</div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>{s.wc.de}</div>
    </div>}
    {s.ph==="thesis"&&<div style={{marginTop:18,display:"flex",gap:5,flexWrap:"wrap"}}>
      {["$0 fees","100% to project","7 AI agents","$0.66 total","18 checks","1 conflict caught","Budget: 47 comps","GL auto-drafted","Same as HOA"].map(function(t,i){
        return <span key={i} style={{fontSize:9,padding:"3px 8px",borderRadius:3,background:i<2?"rgba(24,168,107,0.08)":i<8?"rgba(0,212,170,0.08)":"rgba(245,166,35,0.08)",border:"1px solid "+(i<2?"rgba(24,168,107,0.1)":i<8?"rgba(0,212,170,0.1)":"rgba(245,166,35,0.1)"),color:i<2?"#18A86B":i<8?"#00D4AA":"#F5A623"}}>{t}</span>;
      })}
    </div>}
  </div>;
}

export default function App(){
  var ss=useState(0),step=ss[0],setStep=ss[1];
  var es=useState(null),selEv=es[0],setSelEv=es[1];
  var vs=useState("donor"),viewAs=vs[0],setViewAs=vs[1];
  var ts=useState("ledger"),tab=ts[0],setTab=ts[1];
  var listRef=useRef(null);
  var cur=ST[step]||ST[0];
  var show=cur.hl.length>0||cur.ph==="thesis";

  useEffect(function(){
    if(cur.fo){for(var i=0;i<EV.length;i++){if(EV[i].id===cur.fo){setSelEv(EV[i]);break;}}}else setSelEv(null);
    if(cur.va)setViewAs(cur.va);
  },[step]);
  useEffect(function(){
    if(listRef.current&&cur.fo){var el=listRef.current.querySelector("[data-eid='"+cur.fo+"']");if(el)el.scrollIntoView({behavior:"smooth",block:"center"});}
  },[step]);
  useEffect(function(){
    var hk=function(e){if(e.key==="ArrowRight"){e.preventDefault();setStep(function(p){return Math.min(NS-1,p+1);});}if(e.key==="ArrowLeft"){e.preventDefault();setStep(function(p){return Math.max(0,p-1);});}};
    window.addEventListener("keydown",hk);return function(){window.removeEventListener("keydown",hk);};
  },[]);

  var pts=[{k:"donor",l:"Donor",c:"#2D7FF9"},{k:"committee",l:"Committee",c:"#E8553A"},{k:"vendor",l:"Contractor",c:"#18A86B"},{k:"city",l:"City",c:"#9B6FE8"}];

  return <div style={{fontFamily:"'DM Sans',sans-serif",background:"#0D1117",color:"#E8E8ED",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
    <div style={{padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:15,fontWeight:700,letterSpacing:2,color:"#F5A623",fontFamily:mono}}>CLEARFUND</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>Forsyth Park</span>
        <span style={{fontSize:10,color:"#18A86B",fontWeight:600}}>$0 fees</span>
        <span style={{fontSize:10,color:"#00D4AA",fontWeight:600}}>7 agents</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontSize:8,color:"rgba(255,255,255,0.2)"}}>VIEW AS</span>
        {pts.map(function(pt){return <button key={pt.k} onClick={function(){setViewAs(pt.k);}} style={{padding:"2px 6px",borderRadius:3,border:"none",cursor:"pointer",fontSize:9,fontWeight:600,background:viewAs===pt.k?"rgba(255,255,255,0.1)":"transparent",color:viewAs===pt.k?pt.c:"rgba(255,255,255,0.2)"}}>{pt.l}</button>;})}
      </div>
    </div>
    <div style={{height:2,background:"rgba(255,255,255,0.04)",flexShrink:0}}><div style={{height:"100%",background:"#F5A623",width:((step+1)/NS*100)+"%",transition:"width 0.3s"}}/></div>
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{width:show?380:560,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto"}}><Narr idx={step}/></div>
        <div style={{padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={function(){setStep(function(x){return Math.max(0,x-1);});}} style={{padding:"5px 14px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:step>0?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.1)",cursor:step>0?"pointer":"default",fontSize:11,fontWeight:600}}>Prev</button>
          <div style={{display:"flex",gap:3}}>{ST.map(function(_,i){return <button key={i} onClick={function(){setStep(i);}} style={{width:i===step?16:5,height:5,borderRadius:3,border:"none",cursor:"pointer",background:i===step?"#F5A623":i<step?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.08)"}}/>;})}</div>
          <button onClick={function(){setStep(function(x){return Math.min(NS-1,x+1);});}} style={{padding:"5px 14px",borderRadius:5,border:"none",background:step<NS-1?"#F5A623":"rgba(255,255,255,0.04)",color:step<NS-1?"#0D1117":"rgba(255,255,255,0.1)",cursor:step<NS-1?"pointer":"default",fontSize:11,fontWeight:700}}>Next</button>
        </div>
      </div>
      {show&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
          {["ledger","budget","provenance"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:9,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",background:tab===t?"rgba(255,255,255,0.04)":"transparent",color:tab===t?"#F5A623":"rgba(255,255,255,0.2)",borderBottom:tab===t?"2px solid #F5A623":"2px solid transparent"}}>{t}</button>;})}
        </div>
        {tab==="ledger"&&<div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div ref={listRef} style={{width:260,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)",overflowY:"auto"}}>{EV.map(function(ev){return <div key={ev.id} data-eid={ev.id}><EvCard ev={ev} sel={selEv&&selEv.id===ev.id} hlt={cur.hl.indexOf(ev.id)>=0} viewAs={viewAs} onClick={function(){setSelEv(ev);}}/></div>;})}</div>
          <div style={{flex:1,overflowY:"auto"}}><EvDetail ev={selEv} viewAs={viewAs}/></div>
        </div>}
        {tab==="budget"&&<div style={{flex:1,overflow:"auto"}}><BudgetView/></div>}
        {tab==="provenance"&&<div style={{flex:1,overflow:"auto"}}><ProvView/></div>}
      </div>}
    </div>
    <div style={{padding:"4px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",flexShrink:0}}>
      <span style={{fontSize:9,color:"rgba(255,255,255,0.1)",fontFamily:mono}}>31 events | 7 agents ($0.66) | 38 donors | $0 fees | 1 conflict caught</span>
      <span style={{fontSize:9,color:"rgba(255,255,255,0.12)"}}>Arrow keys</span>
    </div>
    <style>{"::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}*{box-sizing:border-box}"}</style>
  </div>;
}
