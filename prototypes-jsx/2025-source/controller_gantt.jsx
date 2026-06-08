import { useState, useMemo, useRef } from "react";

const WORKSTREAMS = [
  {
    category: "SEARCH & HIRING",
    color: "#2E75B6",
    tasks: [
      { name: "Role Architecture & Scorecard Design", start: "2026-02-26", end: "2026-03-15", status: "active", owner: "DFHQ", notes: "JTBD framework, hiring scorecard, interview guide" },
      { name: "Recruiter Briefing & Candidate Sourcing", start: "2026-03-09", end: "2026-03-29", status: "planned", owner: "DFHQ / Recruiter", notes: "Target 20 candidates from sourcing" },
      { name: "Round 1: Screen to 7", start: "2026-03-23", end: "2026-04-05", status: "planned", owner: "DFHQ / CFO", notes: "Scorecard screening, 20 → 7" },
      { name: "Round 2: Interviews to 3", start: "2026-04-06", end: "2026-04-19", status: "planned", owner: "CFO / DFHQ", notes: "Behavioral interviews, 7 → 3 finalists" },
      { name: "Round 3: Finals & Offer", start: "2026-04-20", end: "2026-05-03", status: "planned", owner: "CFO", notes: "Final interviews, reference checks, offer" },
      { name: "Notice Period / Pre-Start", start: "2026-05-04", end: "2026-05-24", status: "planned", owner: "Candidate", notes: "3-week notice assumed (UK)" },
    ]
  },
  {
    category: "TRANSITION & ONBOARDING",
    color: "#2D8B55",
    tasks: [
      { name: "Best Case: 7-week transition", start: "2026-04-27", end: "2026-06-15", end2: "2026-06-15", status: "scenario-best", owner: "Perm + Interim", notes: "Perm starts Apr 27, 7 weeks with Interim" },
      { name: "Base Case: 5-week transition", start: "2026-05-11", end: "2026-06-15", status: "scenario-base", owner: "Perm + Interim", notes: "Perm starts May 11, 5 weeks with Interim" },
      { name: "Worst Case: 3-week transition", start: "2026-05-25", end: "2026-06-15", status: "scenario-worst", owner: "Perm + Interim", notes: "Perm starts May 25, 3 weeks with Interim" },
      { name: "30/60/90 Day Onboarding Plan", start: "2026-05-11", end: "2026-08-09", status: "planned", owner: "DFHQ / CFO", notes: "Core jobs → Strategic jobs → Enabling jobs" },
      { name: "Fractional CFO Coverage (DFHQ)", start: "2026-05-11", end: "2026-07-05", status: "planned", owner: "DFHQ", notes: "Coverage during perm Controller ramp" },
    ]
  },
  {
    category: "INTERIM CONTROLLER: DAY-TO-DAY",
    color: "#E8792F",
    tasks: [
      { name: "Monthly Close & Reporting", start: "2026-02-26", end: "2026-06-15", status: "active", owner: "Interim Controller", notes: "Ongoing monthly close, IFRS reporting, consolidation" },
      { name: "Audit Coordination (Year-End / Interim)", start: "2026-03-01", end: "2026-05-31", status: "active", owner: "Interim Controller", notes: "External audit prep, PBC, technical memos" },
      { name: "Payroll & AP/AR Operations", start: "2026-02-26", end: "2026-06-15", status: "active", owner: "Interim Controller", notes: "BAU finance operations, multi-jurisdiction payroll" },
      { name: "Team Management (5 directs)", start: "2026-02-26", end: "2026-06-15", status: "active", owner: "Interim Controller", notes: "Day-to-day team leadership and performance" },
    ]
  },
  {
    category: "NEWCO ADMIN & SETUP",
    color: "#8B5CF6",
    tasks: [
      { name: "Bank Account Setup & Treasury", start: "2026-02-26", end: "2026-04-30", status: "active", owner: "Interim Controller", notes: "New bank accounts, signatory setup, cash management" },
      { name: "Legal Entity Registration & Compliance", start: "2026-02-26", end: "2026-04-15", status: "active", owner: "Interim Controller / Legal", notes: "Companies House, local registrations, VAT, tax registrations" },
      { name: "Vendor & Supplier Migration", start: "2026-03-15", end: "2026-05-31", status: "planned", owner: "Interim Controller", notes: "Transfer vendor relationships, payment terms, contracts to NewCo" },
      { name: "Insurance & Corporate Policies", start: "2026-03-01", end: "2026-04-30", status: "planned", owner: "Interim Controller / Legal", notes: "D&O, professional indemnity, property, cyber" },
      { name: "Intercompany Agreement Framework", start: "2026-03-15", end: "2026-05-15", status: "planned", owner: "Interim Controller / Tax", notes: "Transfer pricing, intercompany SLAs, cost allocation" },
    ]
  },
  {
    category: "PE SPONSOR COMMUNICATION",
    color: "#DC2626",
    tasks: [
      { name: "Monthly Investor Reporting Package", start: "2026-02-26", end: "2026-12-31", status: "active", owner: "Interim → Perm Controller", notes: "Monthly management accounts, KPIs, commentary" },
      { name: "Quarterly Board Pack Preparation", start: "2026-02-26", end: "2026-12-31", status: "active", owner: "CFO / Controller", notes: "Board materials, financial review, strategic metrics" },
      { name: "100-Day Plan Reporting to Sponsor", start: "2026-02-26", end: "2026-06-15", status: "active", owner: "CFO / Interim Controller", notes: "Post-acquisition 100-day plan progress updates" },
      { name: "Covenant & Compliance Monitoring", start: "2026-02-26", end: "2026-12-31", status: "active", owner: "Controller / CFO", notes: "Debt covenant tracking, compliance certifications" },
    ]
  },
  {
    category: "SPONSOR INITIATIVES",
    color: "#0891B2",
    tasks: [
      { name: "Customer Pricing Review & Optimization", start: "2026-04-01", end: "2026-07-31", status: "planned", owner: "CFO / Controller / Commercial", notes: "Pricing analysis, margin improvement, contract restructuring" },
      { name: "New Billing System Evaluation & Implementation", start: "2026-04-15", end: "2026-10-31", status: "planned", owner: "Controller / IT", notes: "RFP, vendor selection, implementation, go-live" },
      { name: "ERP Assessment & Roadmap", start: "2026-05-01", end: "2026-08-31", status: "planned", owner: "Controller / IT / DFHQ", notes: "Current state assessment, gap analysis, implementation plan" },
      { name: "Working Capital & Cash Flow Optimization", start: "2026-04-01", end: "2026-06-30", status: "planned", owner: "CFO / Controller", notes: "DSO/DPO analysis, cash conversion cycle improvement" },
      { name: "Finance Team Org Design & Headcount Assessment", start: "2026-03-15", end: "2026-05-15", status: "planned", owner: "DFHQ / CFO", notes: "Assess current capacity, identify gaps, build hiring roadmap" },
    ]
  },
];

// Milestones
const MILESTONES = [
  { date: "2026-06-15", label: "Interim Controller Ends", color: "#DC2626" },
  { date: "2026-05-11", label: "Perm Start (Base Case)", color: "#2D8B55" },
  { date: "2026-03-31", label: "Q1 Close", color: "#666" },
  { date: "2026-06-30", label: "Q2 / Half-Year Close", color: "#666" },
  { date: "2026-09-30", label: "Q3 Close", color: "#666" },
  { date: "2026-12-31", label: "Year-End Close", color: "#666" },
];

const TODAY = new Date("2026-02-26");
const CHART_START = new Date("2026-02-23"); // Monday
const CHART_END = new Date("2027-01-03");

function toDate(s) { return new Date(s + "T00:00:00"); }
function diffDays(a, b) { return (b - a) / 86400000; }
function formatDate(d) { return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }

function getMonths() {
  const months = [];
  let d = new Date(CHART_START);
  while (d < CHART_END) {
    const start = new Date(d);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    const end = d < CHART_END ? new Date(d) : new Date(CHART_END);
    months.push({ label: start.toLocaleDateString("en-US", { month: "short", year: "numeric" }), start, end });
  }
  return months;
}

function getWeeks() {
  const weeks = [];
  let d = new Date(CHART_START);
  while (d < CHART_END) {
    weeks.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return weeks;
}

const statusColors = {
  active: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", text: "#15803d" },
  planned: { bg: "rgba(59,130,246,0.1)", border: "#3b82f6", text: "#1d4ed8" },
  "scenario-best": { bg: "rgba(34,197,94,0.2)", border: "#22c55e", text: "#15803d" },
  "scenario-base": { bg: "rgba(234,179,8,0.2)", border: "#eab308", text: "#a16207" },
  "scenario-worst": { bg: "rgba(239,68,68,0.2)", border: "#ef4444", text: "#dc2626" },
};

export default function GanttChart() {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);

  const totalDays = diffDays(CHART_START, CHART_END);
  const months = useMemo(getMonths, []);
  const weeks = useMemo(getWeeks, []);
  const todayOffset = (diffDays(CHART_START, TODAY) / totalDays) * 100;

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const allTasks = WORKSTREAMS.flatMap(ws =>
    collapsedCategories[ws.category] ? [] : ws.tasks.map(t => ({ ...t, color: ws.color, category: ws.category }))
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh", padding: "24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-track { background: #1e293b; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Financial Controller Transition
          </h1>
          <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace" }}>
            NewCo · London · Feb 2026 → Dec 2026
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
          Reporting to CFO · Interim Controller through 15 Jun · {WORKSTREAMS.length} workstreams · {WORKSTREAMS.reduce((s, w) => s + w.tasks.length, 0)} tasks
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          {WORKSTREAMS.map(ws => (
            <div key={ws.category} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", cursor: "pointer", opacity: collapsedCategories[ws.category] ? 0.4 : 1 }}
              onClick={() => toggleCategory(ws.category)}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: ws.color }} />
              {ws.category}
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ position: "relative", display: "flex", background: "#1e293b", borderRadius: 8, border: "1px solid #334155", overflow: "hidden" }}
        onMouseMove={handleMouseMove}>

        {/* Left panel - task names */}
        <div style={{ minWidth: 300, maxWidth: 300, borderRight: "1px solid #334155", flexShrink: 0 }}>
          {/* Month header spacer */}
          <div style={{ height: 28, borderBottom: "1px solid #334155", background: "#0f172a", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 11, fontWeight: 600, color: "#64748b" }}>
            WORKSTREAM
          </div>
          <div style={{ height: 24, borderBottom: "1px solid #334155", background: "#0f172a" }} />

          {WORKSTREAMS.map(ws => (
            <div key={ws.category}>
              {/* Category header */}
              <div onClick={() => toggleCategory(ws.category)}
                style={{ height: 32, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", background: "#0f172a", borderBottom: "1px solid #334155", cursor: "pointer", userSelect: "none" }}>
                <span style={{ fontSize: 10, color: "#64748b", transform: collapsedCategories[ws.category] ? "rotate(-90deg)" : "rotate(0)", transition: "transform 0.15s" }}>▼</span>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: ws.color }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#cbd5e1", letterSpacing: "0.02em" }}>
                  {ws.category}
                </span>
              </div>
              {/* Tasks */}
              {!collapsedCategories[ws.category] && ws.tasks.map((task, i) => (
                <div key={i} style={{ height: 34, display: "flex", alignItems: "center", padding: "0 12px 0 28px", borderBottom: "1px solid rgba(51,65,85,0.5)", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  background: hoveredTask === `${ws.category}-${i}` ? "rgba(59,130,246,0.08)" : "transparent" }}
                  onMouseEnter={() => setHoveredTask(`${ws.category}-${i}`)}
                  onMouseLeave={() => setHoveredTask(null)}>
                  {task.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right panel - timeline */}
        <div style={{ flex: 1, overflowX: "auto", position: "relative" }}>
          {/* Month headers */}
          <div style={{ height: 28, display: "flex", borderBottom: "1px solid #334155", background: "#0f172a", position: "sticky", top: 0, zIndex: 5, minWidth: 1400 }}>
            {months.map((m, i) => {
              const left = (diffDays(CHART_START, m.start) / totalDays) * 100;
              const width = (diffDays(m.start, m.end) / totalDays) * 100;
              return (
                <div key={i} style={{ position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8", borderRight: "1px solid #334155" }}>
                  {m.label}
                </div>
              );
            })}
          </div>

          {/* Week headers */}
          <div style={{ height: 24, display: "flex", borderBottom: "1px solid #334155", background: "#0f172a", position: "relative", minWidth: 1400 }}>
            {weeks.map((w, i) => {
              const left = (diffDays(CHART_START, w) / totalDays) * 100;
              const width = (7 / totalDays) * 100;
              return (
                <div key={i} style={{ position: "absolute", left: `${left}%`, width: `${width}%`, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#475569", borderRight: "1px solid rgba(51,65,85,0.3)" }}>
                  {formatDate(w)}
                </div>
              );
            })}
          </div>

          {/* Task bars */}
          <div style={{ position: "relative", minWidth: 1400 }}>
            {/* Week grid lines */}
            {weeks.map((w, i) => {
              const left = (diffDays(CHART_START, w) / totalDays) * 100;
              return <div key={`wg-${i}`} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: 1, background: "rgba(51,65,85,0.2)", zIndex: 0 }} />;
            })}

            {/* Today line */}
            <div style={{ position: "absolute", left: `${todayOffset}%`, top: 0, bottom: 0, width: 2, background: "#f59e0b", zIndex: 10, boxShadow: "0 0 8px rgba(245,158,11,0.4)" }}>
              <div style={{ position: "absolute", top: -2, left: -14, background: "#f59e0b", color: "#0f172a", fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 2 }}>TODAY</div>
            </div>

            {/* Milestone lines */}
            {MILESTONES.map((m, i) => {
              const d = toDate(m.date);
              if (d < CHART_START || d > CHART_END) return null;
              const left = (diffDays(CHART_START, d) / totalDays) * 100;
              return (
                <div key={`ms-${i}`} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: 0, borderLeft: `1.5px dashed ${m.color}`, zIndex: 8, opacity: 0.6 }}>
                  <div style={{ position: "absolute", bottom: 4, left: 4, background: m.color, color: "#fff", fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 2, whiteSpace: "nowrap" }}>{m.label}</div>
                </div>
              );
            })}

            {WORKSTREAMS.map(ws => (
              <div key={ws.category}>
                {/* Category spacer */}
                <div style={{ height: 32, borderBottom: "1px solid #334155" }} />
                {/* Task bars */}
                {!collapsedCategories[ws.category] && ws.tasks.map((task, i) => {
                  const start = toDate(task.start);
                  const end = toDate(task.end);
                  const left = Math.max(0, (diffDays(CHART_START, start) / totalDays) * 100);
                  const width = Math.max(1, (diffDays(start, end) / totalDays) * 100);
                  const sc = statusColors[task.status] || statusColors.planned;
                  const isHovered = hoveredTask === `${ws.category}-${i}`;

                  return (
                    <div key={i} style={{ height: 34, position: "relative", borderBottom: "1px solid rgba(51,65,85,0.5)",
                      background: isHovered ? "rgba(59,130,246,0.04)" : "transparent" }}
                      onMouseEnter={() => setHoveredTask(`${ws.category}-${i}`)}
                      onMouseLeave={() => setHoveredTask(null)}>
                      <div style={{
                        position: "absolute", top: 5, left: `${left}%`, width: `${width}%`,
                        height: 22, borderRadius: 4,
                        background: `linear-gradient(135deg, ${ws.color}dd, ${ws.color}99)`,
                        border: `1px solid ${ws.color}`,
                        boxShadow: isHovered ? `0 0 12px ${ws.color}44` : "none",
                        transition: "box-shadow 0.15s, transform 0.1s",
                        transform: isHovered ? "scaleY(1.1)" : "scaleY(1)",
                        display: "flex", alignItems: "center", padding: "0 6px", overflow: "hidden",
                        cursor: "pointer",
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                          {task.name}
                        </span>
                      </div>

                      {/* Tooltip */}
                      {isHovered && (
                        <div style={{
                          position: "fixed", left: tooltipPos.x + 320, top: tooltipPos.y + 60,
                          background: "#1e293b", border: "1px solid #475569", borderRadius: 6,
                          padding: "10px 14px", fontSize: 12, color: "#e2e8f0", zIndex: 100,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxWidth: 280, pointerEvents: "none",
                        }}>
                          <div style={{ fontWeight: 600, marginBottom: 4, color: ws.color }}>{task.name}</div>
                          <div style={{ color: "#94a3b8", marginBottom: 2 }}>
                            {formatDate(start)} → {formatDate(end)} · {Math.round(diffDays(start, end) / 7)}w
                          </div>
                          <div style={{ color: "#94a3b8", marginBottom: 2 }}>Owner: {task.owner}</div>
                          <div style={{ color: "#cbd5e1", fontSize: 11, marginTop: 4 }}>{task.notes}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key dates summary */}
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { label: "Today", date: "26 Feb 2026", accent: "#f59e0b" },
          { label: "Perm Start (Best)", date: "27 Apr 2026", accent: "#22c55e" },
          { label: "Perm Start (Base)", date: "11 May 2026", accent: "#eab308" },
          { label: "Perm Start (Worst)", date: "25 May 2026", accent: "#ef4444" },
          { label: "Interim Ends", date: "15 Jun 2026", accent: "#DC2626" },
          { label: "Year-End Close", date: "31 Dec 2026", accent: "#64748b" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "10px 14px", borderLeft: `3px solid ${m.accent}` }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", fontFamily: "'IBM Plex Mono', monospace" }}>{m.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
