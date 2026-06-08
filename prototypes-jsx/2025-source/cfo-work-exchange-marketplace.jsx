import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA: Work Order Definitions
// ============================================================
const LIFECYCLE_STAGES = [
  { id: 1, label: "Ownership Transition & Integration", icon: "🔑", color: "#1a5276" },
  { id: 2, label: "Cash Flow Optimization & Treasury", icon: "💧", color: "#1e6f5c" },
  { id: 3, label: "Financial Reporting & Visibility", icon: "📊", color: "#6c3483" },
  { id: 4, label: "Transaction Readiness", icon: "🎯", color: "#b7410e" },
  { id: 5, label: "Finance Infrastructure", icon: "⚙️", color: "#2e4057" },
  { id: 6, label: "Compliance & Audit Support", icon: "🛡️", color: "#1b4332" },
  { id: 7, label: "Growth-Stage Build-Out", icon: "📈", color: "#7b2d26" },
  { id: 8, label: "Growth Capital & Supply Chain", icon: "🚢", color: "#0d3b66" },
];

const WORK_ORDERS = {
  "2.1": {
    id: "2.1",
    stage: 2,
    title: "13-Week Cash Flow Model",
    timeline: "1-2 weeks initial build",
    description: "Build a rolling weekly cash flow forecast that captures all sources and uses of cash, ties to banking activity, and provides forward visibility into liquidity position.",
    companyFields: [
      { key: "annualRevenue", label: "Annual Revenue", placeholder: "$XX,XXX,XXX (FY20XX)", type: "text" },
      { key: "industry", label: "Industry / Sector", placeholder: "e.g., ecommerce, manufacturing, SaaS", type: "text" },
      { key: "entityCount", label: "Entity Count", placeholder: "Number of legal entities included in model", type: "text" },
      { key: "bankingRelationships", label: "Banking Relationships", placeholder: "List all banks with account types", type: "textarea" },
      { key: "existingDebt", label: "Existing Debt Facilities", placeholder: "ABL, revolver, term loan: lender, size, maturity", type: "textarea" },
      { key: "erpSystem", label: "ERP / Accounting System", placeholder: "e.g., NetSuite, QuickBooks, Sage", type: "text" },
      { key: "closeTimeline", label: "Current Close Timeline", placeholder: "Business days to close monthly books", type: "text" },
      { key: "financeTeam", label: "Finance Team Size & Roles", placeholder: "Controller, Staff Accountant, AP/AR clerk, etc.", type: "textarea" },
      { key: "maturityTier", label: "Finance Maturity Tier", placeholder: "", type: "select", options: ["Tier 1 (Foundation)", "Tier 2 (Functional)", "Tier 3 (Scaled)"] },
    ],
    requiredInputs: [
      { name: "Bank Statements", detail: "13 weeks historical for all operating accounts (PDF or CSV)" },
      { name: "Accounts Payable Aging", detail: "Current AP aging by vendor with invoice date, due date, amount" },
      { name: "Accounts Receivable Aging", detail: "Current AR aging by customer with invoice date, due date, amount" },
      { name: "Payroll Register", detail: "Last 13 weeks: gross pay, employer taxes, benefits, net pay with pay dates" },
      { name: "Debt Service Schedule", detail: "All obligations: principal, interest, fees, payment dates, amortization" },
      { name: "Committed Payments", detail: "Rent, insurance, tax payments, capex deposits, legal settlements, earn-outs" },
    ],
    optionalInputs: [
      { name: "Revenue Forecast / Bookings", detail: "Pipeline, backlog, bookings by week" },
      { name: "Borrowing Base Certificate", detail: "Most recent if ABL facility exists" },
      { name: "Budget or Forecast", detail: "Current annual budget or operating forecast" },
      { name: "Seasonal Pattern Notes", detail: "Known seasonality in revenue, collections, or disbursements" },
    ],
    deliverables: [
      "13-Week Rolling Cash Flow Model (Excel): weekly receipts/disbursements, actuals vs. forecast, 3 scenarios, documented assumptions",
      "Model Documentation Memo (1-2 pages): methodology, data sources, update instructions, known limitations",
      "Lender-Ready Format (if applicable): additional tab formatted to lender specifications with mapping documented",
    ],
    acceptanceCriteria: [
      "Historical Reconciliation: Model reconciles to bank statements within +/- 2% per week",
      "Completeness: All known cash commitments captured; no missing outflows >$10K or >1% of weekly disbursements",
      "Scenario Analysis: Three scenarios populated with documented, defensible assumptions producing different outcomes",
      "Documentation: Every assumption documented; data sources identified; update instructions clear for internal team",
      "Transferability: Internal team walked through model and has completed one supervised weekly update",
      "Lender Compliance (if applicable): Output ties to internal model; format matches lender requirements exactly",
    ],
    sla: [
      { milestone: "Kickoff Call", timing: "Within 2 business days of receiving inputs" },
      { milestone: "Draft Model", timing: "Within 5 business days of kickoff (Tier 1/2); 3 days (Tier 3)" },
      { milestone: "Client Review", timing: "2 business days" },
      { milestone: "Final Delivery", timing: "Within 2 business days of feedback" },
      { milestone: "Knowledge Transfer", timing: "60-90 min session within 3 days of delivery" },
      { milestone: "Total Elapsed", timing: "7-12 business days from inputs to acceptance" },
    ],
    pricing: {
      tiers: [
        { tier: "Tier 1 (Foundation)", range: "$8,000 - $12,000", note: "Single entity, limited data quality, building from bank statements" },
        { tier: "Tier 2 (Functional)", range: "$6,000 - $10,000", note: "1-3 entities, reasonable data, needs structuring" },
        { tier: "Tier 3 (Scaled)", range: "$10,000 - $18,000", note: "Multiple entities, multi-entity consolidation" },
      ],
      ongoing: "$1,500 - $3,000/month for weekly maintenance",
      terms: "50% at start, 50% upon acceptance",
    },
  },
  "1.1": {
    id: "1.1",
    stage: 1,
    title: "Finance Function Assessment & 100-Day Plan",
    timeline: "2-4 weeks assessment + 100 days execution",
    description: "Assess the current state of the finance function across people, process, systems, data, and controls. Deliver a prioritized action plan for the first 100 days that aligns finance capabilities with the investment thesis.",
    companyFields: [
      { key: "annualRevenue", label: "Annual Revenue", placeholder: "$XX,XXX,XXX (FY20XX)", type: "text" },
      { key: "ebitda", label: "EBITDA / Operating Income", placeholder: "$ amount, adjusted or reported", type: "text" },
      { key: "industry", label: "Industry / Sector", placeholder: "e.g., ecommerce, manufacturing, SaaS", type: "text" },
      { key: "businessModel", label: "Business Model", placeholder: "Revenue streams, customer types, channels", type: "textarea" },
      { key: "entityCount", label: "Entity Count", placeholder: "Number of legal entities", type: "text" },
      { key: "employeeCount", label: "Employee Count", placeholder: "Total headcount", type: "text" },
      { key: "financeTeam", label: "Finance Team Size & Roles", placeholder: "CFO, Controller, Staff Accountant, AP/AR, FP&A", type: "textarea" },
      { key: "erpSystem", label: "ERP / Accounting System", placeholder: "e.g., NetSuite, QuickBooks, Sage", type: "text" },
      { key: "otherSystems", label: "Other Key Systems", placeholder: "Billing, CRM, HRIS, expense, treasury", type: "textarea" },
      { key: "closeTimeline", label: "Current Close Timeline", placeholder: "Business days", type: "text" },
      { key: "auditStatus", label: "Audit Status", placeholder: "Audited / Reviewed / Compiled / None", type: "text" },
      { key: "existingDebt", label: "Existing Debt Facilities", placeholder: "Type, lender, size, maturity", type: "textarea" },
      { key: "maturityTier", label: "Finance Maturity Tier", placeholder: "", type: "select", options: ["Tier 1 (Foundation)", "Tier 2 (Functional)", "Tier 3 (Scaled)"] },
    ],
    sponsorFields: [
      { key: "thesis", label: "Investment Thesis Summary", placeholder: "2-3 sentences: why this deal, value creation levers", type: "textarea" },
      { key: "priorities", label: "Value Creation Priorities", placeholder: "Revenue growth, margin expansion, operational efficiency, platform for bolt-ons, exit prep", type: "textarea" },
      { key: "diligenceConcerns", label: "Known Finance Concerns from Diligence", placeholder: "Issues identified during QofE or financial diligence", type: "textarea" },
      { key: "reportingReqs", label: "Sponsor Reporting Requirements", placeholder: "Cadence, KPIs required, format preferences", type: "textarea" },
      { key: "addOns", label: "Planned Add-On Acquisitions", placeholder: "Any bolt-ons in first 12 months", type: "textarea" },
      { key: "systemReqs", label: "System Standardization Requirements", placeholder: "Required ERP, tools, or processes across portfolio", type: "textarea" },
      { key: "pendingDecisions", label: "Key Decisions Pending Finance Input", placeholder: "Headcount, capex, pricing, M&A decisions needing assessment", type: "textarea" },
    ],
    requiredInputs: [
      { name: "Finance Team Access", detail: "1-on-1 interviews with each finance team member (30-60 min)" },
      { name: "Key Stakeholder Access", detail: "CEO/GM, COO, head of sales (30-60 min each)" },
      { name: "External Partner Contacts", detail: "Auditor, tax advisor, bookkeeper, bank RM" },
      { name: "3 Years Financial Statements", detail: "Audited, reviewed, or internal; plus current year monthly" },
      { name: "Close Process Documentation", detail: "Calendar, reconciliation workpapers, JE log" },
      { name: "Reporting Packages", detail: "Last 3 months board/management reports and lender reports" },
      { name: "Budget and Forecast", detail: "Current year budget and rolling forecast" },
      { name: "Deal Materials", detail: "CIM, QofE report, deal model (if sponsor approves)" },
      { name: "Org Chart", detail: "Company-wide and finance-specific with reporting lines" },
      { name: "System Documentation", detail: "Chart of accounts, integration maps, config notes" },
      { name: "Key Contracts", detail: "Top 10 customers, top 10 vendors, leases, employment agreements" },
      { name: "System Access", detail: "Read-only: ERP, banking, payroll, billing, expense management" },
    ],
    optionalInputs: [],
    deliverables: [
      "Finance Function Assessment (15-25 page report): maturity ratings across People, Process, Systems, Data, Controls with specific findings",
      "100-Day Action Plan (Excel + summary deck): 15-30 prioritized initiatives in 3 waves (Days 1-30, 31-60, 61-100) with owners, timelines, dependencies, and investment thesis alignment",
      "Executive Summary (10-15 slide deck): board-ready presentation with current state, top 5 findings, milestone timeline, resource requirements, budget estimate",
    ],
    acceptanceCriteria: [
      "Domain Coverage: All five domains assessed with specific findings, not generic observations",
      "Maturity Ratings: Numerical rating (1-5) per domain with supporting evidence",
      "Action Plan Specificity: Named owners, target dates, documented dependencies; at least 3 Wave 1 items actionable in first week",
      "Investment Thesis Alignment: Each initiative mapped to value creation lever; sponsor confirms top 3 diligence concerns addressed",
      "Actionability: Findings specific enough to act on (e.g., 'AP requires 3 approvals averaging 4.5 days; implement NetSuite automation')",
      "Presentation Quality: Board-ready; sponsor can present without additional practitioner explanation",
    ],
    sla: [
      { milestone: "Access Provisioning", timing: "Within 3 business days of signed work order" },
      { milestone: "Interview Scheduling", timing: "Within 5 business days of access; completed within 10" },
      { milestone: "Draft Assessment + Plan", timing: "Within 10 business days of completing interviews" },
      { milestone: "Review Cycle", timing: "3 business days for consolidated feedback" },
      { milestone: "Final Deliverables", timing: "Within 3 business days of feedback" },
      { milestone: "Executive Presentation", timing: "Within 5 business days of final delivery" },
      { milestone: "Total Elapsed", timing: "15-22 business days from access to acceptance" },
    ],
    pricing: {
      tiers: [
        { tier: "Tier 1 (Foundation)", range: "$20,000 - $30,000", note: "Limited documentation, finance function needs building" },
        { tier: "Tier 2 (Functional)", range: "$15,000 - $25,000", note: "Standard lower middle market PE acquisition" },
        { tier: "Tier 3 (Scaled)", range: "$25,000 - $40,000", note: "Multi-entity, bolt-on integration complexity" },
      ],
      ongoing: "$15,000 - $30,000/month for 100-day execution support",
      terms: "50% at start, 50% upon acceptance",
    },
  },
  "8.1": {
    id: "8.1",
    stage: 8,
    title: "PO Financing & Inventory Capital",
    timeline: "3-5 weeks assessment + 4-8 weeks through close",
    description: "Structure and secure financing against purchase orders, enabling the company to accept and fulfill orders that exceed current cash capacity. Covers financial modeling, lender packaging, and compliance framework for PO financing, inventory lines, or supply chain financing.",
    companyFields: [
      { key: "annualRevenue", label: "Annual Revenue", placeholder: "$XX,XXX,XXX (FY20XX)", type: "text" },
      { key: "industry", label: "Industry / Sector", placeholder: "e.g., ecommerce, consumer products, distribution", type: "text" },
      { key: "businessModel", label: "Business Model", placeholder: "DTC, B2B wholesale, multi-channel: describe mix", type: "textarea" },
      { key: "productCategories", label: "Product Categories", placeholder: "What you sell, SKU count, avg unit cost, avg selling price", type: "textarea" },
      { key: "entityCount", label: "Entity Count", placeholder: "Number of legal entities", type: "text" },
      { key: "sourcingGeography", label: "Sourcing Geography", placeholder: "Manufacturing countries and % of COGS", type: "textarea" },
      { key: "existingDebt", label: "Existing Debt Facilities", placeholder: "Type, lender, size, maturity, collateral pledged", type: "textarea" },
      { key: "erpSystem", label: "ERP / Accounting System", placeholder: "e.g., NetSuite, QuickBooks", type: "text" },
      { key: "inventorySystem", label: "Inventory Management System", placeholder: "If separate from ERP: name, integration status", type: "text" },
      { key: "thirdPL", label: "3PL / Warehouse", placeholder: "Provider(s), locations, contract status", type: "textarea" },
      { key: "maturityTier", label: "Finance Maturity Tier", placeholder: "", type: "select", options: ["Tier 1 (Foundation)", "Tier 2 (Functional)", "Tier 3 (Scaled)"] },
    ],
    supplyChainFields: [
      { key: "topCustomers", label: "Top 10 Customers by Revenue", placeholder: "Customer, annual revenue, terms, credit quality", type: "textarea" },
      { key: "concentration", label: "Customer Concentration", placeholder: "% revenue from top 1, top 5, top 10", type: "text" },
      { key: "avgOrderSize", label: "Average Order Size", placeholder: "$ amount and range", type: "text" },
      { key: "leadTime", label: "Order Lead Time", placeholder: "Weeks from PO to warehouse delivery", type: "text" },
      { key: "customerTerms", label: "Customer Payment Terms", placeholder: "Net 30, 60, COD by segment", type: "textarea" },
      { key: "supplierTerms", label: "Supplier Payment Terms", placeholder: "Deposit %, LC, open account by supplier", type: "textarea" },
      { key: "landedCost", label: "Typical Landed Cost Breakdown", placeholder: "Product %, freight %, duties %, insurance %, warehousing %", type: "textarea" },
      { key: "annualPurchases", label: "Annual Inventory Purchases", placeholder: "Total $ last fiscal year", type: "text" },
      { key: "currentInventory", label: "Current Inventory Value", placeholder: "$ at cost", type: "text" },
      { key: "turnover", label: "Inventory Turnover", placeholder: "Annual turns or days outstanding", type: "text" },
      { key: "returnRate", label: "Return / Defect Rate", placeholder: "% by channel", type: "text" },
      { key: "seasonality", label: "Seasonal Pattern", placeholder: "Peak ordering periods and magnitude", type: "textarea" },
      { key: "openPOs", label: "Open POs (Current)", placeholder: "Total $ value with suppliers", type: "text" },
      { key: "unfundedOrders", label: "Unfunded Order Book", placeholder: "$ of customer orders you cannot fulfill due to cash", type: "text" },
    ],
    requiredInputs: [
      { name: "Customer Purchase Orders", detail: "Current open POs (top 10 by value): customer, items, quantities, prices, terms" },
      { name: "Supplier Quotes / Invoices", detail: "Pro forma invoices: supplier, unit costs, quantities, terms, Incoterms" },
      { name: "Landed Cost Data", detail: "10+ historical shipments: product cost, freight, duties, insurance, warehousing" },
      { name: "AR Aging (Detailed)", detail: "By customer with invoice detail, disputes flagged" },
      { name: "Inventory Report", detail: "By SKU/category: quantity, cost, location, aging, slow-moving flagged" },
      { name: "Financial Statements", detail: "3 years + current year monthly + trailing 12-month P&L" },
      { name: "Existing Credit Agreements", detail: "All loan agreements, lines, factoring: critical for liens and collateral" },
    ],
    optionalInputs: [
      { name: "Customer Credit Info", detail: "D&B reports, credit apps, payment history for top customers" },
      { name: "Supplier Agreements", detail: "Master supply agreements, exclusivity, volume commitments" },
      { name: "Insurance Certificates", detail: "Cargo, product liability, credit insurance" },
      { name: "3PL Contract", detail: "Fee schedule, lien provisions (affects collateral availability)" },
      { name: "Quality/Compliance Docs", detail: "Testing reports, compliance certificates, import licenses" },
    ],
    deliverables: [
      "PO Financing Readiness Assessment (5-10 pages): order quality, supplier reliability, margin analysis, risk factors, proceed/no-proceed recommendation",
      "Landed Cost Model (Excel): cost calculator, historical analysis, margin waterfall, scenario analysis for tariffs/freight/FX",
      "Order-to-Cash Flow Model (Excel): full cash cycle, gap analysis, financing overlay with cost of capital, sensitivities",
      "Lender Package: company overview, financials, order book, customer credit, collateral analysis, facility sizing, projections. Includes 3-5 lender shortlist.",
      "Compliance & Reporting Framework: calendar, borrowing base template, covenant tracker, collateral monitoring, team procedures",
    ],
    acceptanceCriteria: [
      "Landed Cost Accuracy: Back-tests within 3% of actuals for 10+ historical shipments",
      "Cash Model Integrity: Timing ties to actual terms and payment history; correctly calculates peak financing need",
      "Lender Package Complete: All specified items included; data ties across sections; submission-ready",
      "Margin Viability: Clearly demonstrates whether margin covers financing costs; breakeven analysis included",
      "Risk Disclosure: All material risks identified and quantified; no omitted known risks",
      "Compliance Sustainability: Framework realistic for team to maintain; borrowing base tested with actual data; team trained",
    ],
    sla: [
      { milestone: "Kickoff Call", timing: "Within 2 business days of inputs" },
      { milestone: "Readiness Assessment (Draft)", timing: "Within 7 business days of kickoff" },
      { milestone: "Landed Cost + Cash Models (Draft)", timing: "Within 10 business days of kickoff" },
      { milestone: "Client Review", timing: "3 business days" },
      { milestone: "Lender Package (Draft)", timing: "Within 5 business days of feedback" },
      { milestone: "Final Deliverables", timing: "Within 3 business days of approval" },
      { milestone: "Lender Meeting Support", timing: "Available for 4 weeks post-submission" },
      { milestone: "Total Pre-Lender", timing: "18-25 business days" },
      { milestone: "Total Through Close", timing: "Additional 4-8 weeks" },
    ],
    pricing: {
      tiers: [
        { tier: "Tier 1 (Foundation)", range: "$20,000 - $30,000", note: "Data assembly required, first facility" },
        { tier: "Tier 2 (Functional)", range: "$15,000 - $25,000", note: "Data exists, needs lender structuring" },
        { tier: "Tier 3 (Scaled)", range: "$20,000 - $35,000", note: "Multi-geography, multiple lender negotiations" },
      ],
      ongoing: "$2,500 - $5,000/month for facility management",
      terms: "50% at start, 25% at draft, 25% upon acceptance",
      successFee: "Alternative: reduced base + success fee on facility size at closing",
    },
  },
};

// ============================================================
// STYLES
// ============================================================
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap');
`;

// ============================================================
// COMPONENTS
// ============================================================

function StageSelector({ onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
      {LIFECYCLE_STAGES.map((s) => {
        const workOrders = Object.values(WORK_ORDERS).filter((w) => w.stage === s.id);
        const hasTemplates = workOrders.length > 0;
        return (
          <button
            key={s.id}
            onClick={() => hasTemplates && onSelect(s.id)}
            style={{
              background: hasTemplates ? "#fff" : "#f8f9fa",
              border: `1.5px solid ${hasTemplates ? s.color + "40" : "#e0e0e0"}`,
              borderRadius: "10px",
              padding: "18px 16px",
              textAlign: "left",
              cursor: hasTemplates ? "pointer" : "default",
              opacity: hasTemplates ? 1 : 0.5,
              transition: "all 0.2s",
              position: "relative",
            }}
            onMouseEnter={(e) => { if (hasTemplates) { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.boxShadow = `0 2px 12px ${s.color}18`; } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = hasTemplates ? s.color + "40" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13.5px", color: "#1a1a1a", lineHeight: 1.3, marginBottom: "4px" }}>{s.label}</div>
            {hasTemplates && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#888", marginTop: "6px" }}>
                {workOrders.length} work order{workOrders.length > 1 ? "s" : ""}
              </div>
            )}
            {!hasTemplates && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#bbb", marginTop: "6px", fontStyle: "italic" }}>Coming soon</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function WorkOrderSelector({ stageId, onSelect, onBack }) {
  const stage = LIFECYCLE_STAGES.find((s) => s.id === stageId);
  const workOrders = Object.values(WORK_ORDERS).filter((w) => w.stage === stageId);
  return (
    <div>
      <button onClick={onBack} style={backBtnStyle}>
        <span style={{ marginRight: "6px" }}>&#8592;</span> All Stages
      </button>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 700, color: stage.color, marginBottom: "4px" }}>
          {stage.icon} {stage.label}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#666" }}>
          Select a work order to begin the engagement request.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {workOrders.map((wo) => (
          <button
            key={wo.id}
            onClick={() => onSelect(wo.id)}
            style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              padding: "16px 18px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = stage.color; e.currentTarget.style.background = stage.color + "06"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: stage.color, fontWeight: 500, marginRight: "10px" }}>{wo.id}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14.5px", color: "#1a1a1a" }}>{wo.title}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#999" }}>{wo.timeline}</span>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#666", marginTop: "6px", lineHeight: 1.5 }}>{wo.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #dde3ea",
    borderRadius: "7px",
    background: "#fff",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };
  if (field.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        style={{ ...base, resize: "vertical", minHeight: "70px" }}
        onFocus={(e) => e.target.style.borderColor = "#2e75b6"}
        onBlur={(e) => e.target.style.borderColor = "#dde3ea"}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        style={{ ...base, cursor: "pointer", appearance: "auto" }}
      >
        <option value="">Select...</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      style={base}
      onFocus={(e) => e.target.style.borderColor = "#2e75b6"}
      onBlur={(e) => e.target.style.borderColor = "#dde3ea"}
    />
  );
}

function InputChecklist({ items, checked, onToggle, title }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1a1a", marginBottom: "10px" }}>{title}</div>
      {items.map((item, i) => (
        <label
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "10px 12px",
            marginBottom: "6px",
            background: checked[i] ? "#f0f7ee" : "#fafafa",
            border: `1px solid ${checked[i] ? "#7cb342" : "#eee"}`,
            borderRadius: "7px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <input
            type="checkbox"
            checked={!!checked[i]}
            onChange={() => onToggle(i)}
            style={{ marginTop: "2px", accentColor: "#4a8c3f" }}
          />
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", color: "#1a1a1a" }}>{item.name}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#777", lineHeight: 1.4, marginTop: "2px" }}>{item.detail}</div>
          </div>
        </label>
      ))}
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#2e75b6",
        marginBottom: "10px",
        paddingBottom: "6px",
        borderBottom: "2px solid #2e75b620",
      }}>{title}</div>
      {children}
    </div>
  );
}

function ReviewItem({ label, items }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          padding: "6px 0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12.5px",
          color: "#444",
          lineHeight: 1.5,
        }}>
          <span style={{ color: "#2e75b6", flexShrink: 0, marginTop: "1px" }}>&#10003;</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN FORM COMPONENT
// ============================================================
function WorkOrderForm({ workOrderId, onBack }) {
  const wo = WORK_ORDERS[workOrderId];
  const stage = LIFECYCLE_STAGES.find((s) => s.id === wo.stage);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [engagementData, setEngagementData] = useState({});
  const [requiredChecked, setRequiredChecked] = useState({});
  const [optionalChecked, setOptionalChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, [step]);

  const onChange = (key, val) => setFormData((p) => ({ ...p, [key]: val }));
  const onEngChange = (key, val) => setEngagementData((p) => ({ ...p, [key]: val }));

  const hasSupplyChain = !!wo.supplyChainFields;
  const hasSponsor = !!wo.sponsorFields;

  const steps = [
    "Engagement Details",
    "Company Profile",
    ...(hasSponsor ? ["Investment Context"] : []),
    ...(hasSupplyChain ? ["Supply Chain Profile"] : []),
    "Input Readiness",
    "Review & Submit",
  ];

  const requiredCount = wo.requiredInputs.length;
  const checkedCount = Object.values(requiredChecked).filter(Boolean).length;

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div>
            <StepHeader num={1} title="Engagement Details" subtitle="Basic information about this engagement request" />
            <div style={fieldGrid}>
              {[
                { key: "companyName", label: "Company Name", placeholder: "Legal entity name", type: "text" },
                { key: "sponsor", label: "Engagement Sponsor", placeholder: "Name, title, email", type: "text" },
                { key: "dateInitiated", label: "Date Initiated", placeholder: "MM/DD/YYYY", type: "text" },
                { key: "targetCompletion", label: "Target Completion", placeholder: "MM/DD/YYYY", type: "text" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "14px" }}>
                  <div style={fieldLabel}>{f.label}</div>
                  <FormField field={f} value={engagementData[f.key]} onChange={(k, v) => onEngChange(k, v)} />
                </div>
              ))}
              {workOrderId === "1.1" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <div style={fieldLabel}>Acquiring Entity / Sponsor</div>
                    <FormField field={{ key: "acquirer", placeholder: "PE firm or acquirer name", type: "text" }} value={engagementData.acquirer} onChange={(k, v) => onEngChange(k, v)} />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <div style={fieldLabel}>Transaction Close Date</div>
                    <FormField field={{ key: "closeDate", placeholder: "MM/DD/YYYY or expected", type: "text" }} value={engagementData.closeDate} onChange={(k, v) => onEngChange(k, v)} />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <StepHeader num={2} title="Company Profile" subtitle="Tell us about your business so we can match the right practitioner and scope the engagement accurately." />
            <div style={fieldGrid}>
              {wo.companyFields.map((f) => (
                <div key={f.key} style={{ marginBottom: "14px" }}>
                  <div style={fieldLabel}>{f.label}</div>
                  <FormField field={f} value={formData[f.key]} onChange={onChange} />
                </div>
              ))}
            </div>
          </div>
        );
      default: {
        let adjusted = step;
        let currentSpecialStep = 2;

        if (hasSponsor && adjusted === currentSpecialStep) {
          return (
            <div>
              <StepHeader num={currentSpecialStep + 1} title="Investment Context" subtitle="Help the practitioner align the 100-day plan with your value creation priorities." />
              <div style={fieldGrid}>
                {wo.sponsorFields.map((f) => (
                  <div key={f.key} style={{ marginBottom: "14px" }}>
                    <div style={fieldLabel}>{f.label}</div>
                    <FormField field={f} value={formData[f.key]} onChange={onChange} />
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (hasSponsor) currentSpecialStep++;

        if (hasSupplyChain && adjusted === currentSpecialStep) {
          return (
            <div>
              <StepHeader num={currentSpecialStep + 1} title="Supply Chain & Order Profile" subtitle="Operational detail needed to assess financing feasibility and structure the right facility." />
              <div style={fieldGrid}>
                {wo.supplyChainFields.map((f) => (
                  <div key={f.key} style={{ marginBottom: "14px" }}>
                    <div style={fieldLabel}>{f.label}</div>
                    <FormField field={f} value={formData[f.key]} onChange={onChange} />
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (hasSupplyChain) currentSpecialStep++;

        if (adjusted === currentSpecialStep) {
          return (
            <div>
              <StepHeader num={currentSpecialStep + 1} title="Input Readiness" subtitle="Confirm which documents and data you can provide. The practitioner cannot begin until all required inputs are available." />
              <InputChecklist
                items={wo.requiredInputs}
                checked={requiredChecked}
                onToggle={(i) => setRequiredChecked((p) => ({ ...p, [i]: !p[i] }))}
                title={`Required Inputs (${checkedCount} of ${requiredCount} confirmed)`}
              />
              {wo.optionalInputs.length > 0 && (
                <InputChecklist
                  items={wo.optionalInputs}
                  checked={optionalChecked}
                  onToggle={(i) => setOptionalChecked((p) => ({ ...p, [i]: !p[i] }))}
                  title="Optional Inputs (improves accuracy)"
                />
              )}
              {checkedCount < requiredCount && (
                <div style={{
                  background: "#fff8e1",
                  border: "1px solid #ffe082",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12.5px",
                  color: "#6d5e00",
                  lineHeight: 1.5,
                }}>
                  <strong>{requiredCount - checkedCount} required input{requiredCount - checkedCount > 1 ? "s" : ""} not yet confirmed.</strong> You can still submit, but the engagement cannot begin until all required inputs are available. The practitioner will follow up on outstanding items.
                </div>
              )}
            </div>
          );
        }

        // Review step
        return (
          <div>
            <StepHeader num={steps.length} title="Review & Submit" subtitle="Review your engagement request before submitting to the practitioner network." />

            <ReviewSection title="Engagement">
              <ReviewItem items={[
                `Company: ${engagementData.companyName || "Not provided"}`,
                `Sponsor: ${engagementData.sponsor || "Not provided"}`,
                `Target: ${engagementData.targetCompletion || "Not provided"}`,
              ]} />
            </ReviewSection>

            <ReviewSection title="What You Get">
              <ReviewItem items={wo.deliverables} />
            </ReviewSection>

            <ReviewSection title="Acceptance Criteria">
              <ReviewItem items={wo.acceptanceCriteria} />
            </ReviewSection>

            <ReviewSection title="Timeline (SLA)">
              {wo.sla.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f0f0f0", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px" }}>
                  <span style={{ color: "#444" }}>{s.milestone}</span>
                  <span style={{ color: "#2e75b6", fontWeight: 500 }}>{s.timing}</span>
                </div>
              ))}
            </ReviewSection>

            <ReviewSection title="Pricing">
              {wo.pricing.tiers.map((t, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{t.tier}</span>
                    <span style={{ color: "#2e75b6", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px" }}>{t.range}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#888", marginTop: "2px" }}>{t.note}</div>
                </div>
              ))}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#666", marginTop: "10px" }}>
                Ongoing: {wo.pricing.ongoing} | Terms: {wo.pricing.terms}
                {wo.pricing.successFee && <><br />{wo.pricing.successFee}</>}
              </div>
            </ReviewSection>

            <ReviewSection title="Input Readiness">
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: checkedCount === requiredCount ? "#2e7d32" : "#c17900" }}>
                {checkedCount} of {requiredCount} required inputs confirmed
                {checkedCount === requiredCount ? " — ready to begin" : " — practitioner will follow up on outstanding items"}
              </div>
            </ReviewSection>

            {!submitted && (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: stage.color,
                  color: "#fff",
                  border: "none",
                  borderRadius: "9px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "14.5px",
                  cursor: "pointer",
                  marginTop: "10px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Submit Engagement Request
              </button>
            )}

            {submitted && (
              <div style={{
                background: "#f0f7ee",
                border: "1.5px solid #7cb342",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                marginTop: "10px",
              }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>&#10003;</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "18px", color: "#2e7d32", marginBottom: "6px" }}>Engagement Request Submitted</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#555", lineHeight: 1.5 }}>
                  Your work order for <strong>{wo.id} {wo.title}</strong> has been submitted to the practitioner network. You will receive matched practitioner profiles within 2 business days.
                </div>
              </div>
            )}
          </div>
        );
      }
    }
  }

  return (
    <div ref={topRef}>
      <button onClick={onBack} style={backBtnStyle}>
        <span style={{ marginRight: "6px" }}>&#8592;</span> Back
      </button>

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            fontWeight: 500,
            color: "#fff",
            background: stage.color,
            padding: "3px 9px",
            borderRadius: "5px",
          }}>{wo.id}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#888" }}>{stage.label}</span>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>{wo.title}</div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{
              height: "3px",
              width: "100%",
              borderRadius: "2px",
              background: i <= step ? stage.color : "#e8ecf0",
              transition: "background 0.3s",
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              color: i <= step ? stage.color : "#bbb",
              fontWeight: i === step ? 600 : 400,
              textAlign: "center",
              lineHeight: 1.2,
            }}>{s}</span>
          </div>
        ))}
      </div>

      {renderStep()}

      {/* Navigation */}
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #eee" }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              ...navBtnStyle,
              opacity: step === 0 ? 0.3 : 1,
              cursor: step === 0 ? "default" : "pointer",
            }}
          >
            &#8592; Previous
          </button>
          {step < steps.length - 1 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              style={{ ...navBtnStyle, background: stage.color, color: "#fff", borderColor: stage.color }}
            >
              Continue &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepHeader({ num, title, subtitle }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>
        {title}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "#888", lineHeight: 1.5 }}>{subtitle}</div>
    </div>
  );
}

// Shared styles
const fieldGrid = { display: "flex", flexDirection: "column", gap: "2px" };
const fieldLabel = { fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px", color: "#444", marginBottom: "5px", letterSpacing: "0.01em" };
const backBtnStyle = {
  background: "none",
  border: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  color: "#2e75b6",
  cursor: "pointer",
  padding: "4px 0",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
};
const navBtnStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  padding: "10px 20px",
  borderRadius: "7px",
  border: "1.5px solid #dde3ea",
  background: "#fff",
  color: "#444",
  cursor: "pointer",
  transition: "all 0.15s",
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [view, setView] = useState("stages"); // stages | workorders | form
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedWO, setSelectedWO] = useState(null);

  return (
    <>
      <style>{fonts}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(168deg, #f7f9fb 0%, #eef2f7 40%, #f5f0eb 100%)",
        padding: "0",
      }}>
        {/* Top bar */}
        <div style={{
          background: "#fff",
          borderBottom: "1px solid #e8ecf0",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "17px", color: "#1a3a5c" }}>CFO Work Exchange</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#aaa", fontWeight: 400 }}>by Digital Finance HQ</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#999",
            background: "#f5f5f5",
            padding: "4px 10px",
            borderRadius: "4px",
          }}>PROTOTYPE v0.1</div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 20px" }}>

          {view === "stages" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: "8px" }}>
                  What stage is your company in?
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#666", lineHeight: 1.6 }}>
                  Select your lifecycle stage to see available work orders. Each comes with defined scope, acceptance criteria, and service level agreements.
                </div>
              </div>
              <StageSelector onSelect={(id) => { setSelectedStage(id); setView("workorders"); }} />

              {/* Platform value prop */}
              <div style={{
                marginTop: "28px",
                padding: "18px",
                background: "#fff",
                border: "1px solid #e8ecf0",
                borderRadius: "10px",
              }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "#1a1a1a", marginBottom: "10px" }}>
                  How this works
                </div>
                {[
                  ["1", "Select a work order", "Every engagement has pre-defined scope, deliverables, and acceptance criteria."],
                  ["2", "Complete the intake form", "Provide company details and confirm your data readiness."],
                  ["3", "Get matched to a practitioner", "We match based on work-order-level experience, not generic titles."],
                  ["4", "Pay for outcomes, not hours", "The engagement is complete when acceptance criteria are met."],
                ].map(([num, title, desc]) => (
                  <div key={num} style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#2e75b610",
                      color: "#2e75b6",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>{num}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#1a1a1a" }}>{title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#888", lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "workorders" && (
            <WorkOrderSelector
              stageId={selectedStage}
              onSelect={(id) => { setSelectedWO(id); setView("form"); }}
              onBack={() => setView("stages")}
            />
          )}

          {view === "form" && (
            <WorkOrderForm
              workOrderId={selectedWO}
              onBack={() => setView("workorders")}
            />
          )}
        </div>
      </div>
    </>
  );
}
