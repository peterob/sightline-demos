import { useState, useEffect, useRef, useCallback } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy: "#0F1E33",
  navyMid: "#1A3050",
  navyLt: "#243B55",
  teal: "#2A9D8F",
  tealBr: "#3EBFAF",
  tealLt: "#D0EFEC",
  amber: "#E9A84C",
  amberLt: "#FDF3DC",
  red: "#C0392B",
  redLt: "#FDECEA",
  green: "#2E7D4F",
  greenLt: "#D6EFDF",
  slate: "#8AA4BE",
  slateLt: "#EEF2F7",
  white: "#FFFFFF",
  gray: "#F3F4F6",
  grayMd: "#9CA3AF",
  grayDk: "#374151",
};

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const RAW_DOCS = [
  { id: "e001", type: "event", label: "REFERRAL_RECEIVED", sub: "Dr. Patel · E11.9", icon: "⟶", color: C.teal },
  { id: "e002", type: "event", label: "PA_DENIED", sub: "Aetna · CPT 97803", icon: "⚡", color: C.red },
  { id: "e003", type: "event", label: "SESSION_DELIVERED", sub: "RD: M.Santos · $135", icon: "✓", color: C.green },
  { id: "e004", type: "event", label: "CLAIM_PAID", sub: "CareFirst · ERA 835", icon: "💰", color: C.green },
  { id: "p001", type: "payer", label: "Aetna EOB", sub: "CO-4 denial pattern", icon: "📄", color: C.amber },
  { id: "p002", type: "payer", label: "CareFirst rate", sub: "$115–135 contracted", icon: "📄", color: C.amber },
  { id: "ph001", type: "physician", label: "Dr. Patel", sub: "Cardio · 0 refs / 45d", icon: "👤", color: C.slate },
  { id: "ph002", type: "physician", label: "Dr. Rodriguez", sub: "Metabolic · active", icon: "👤", color: C.slate },
  { id: "ex001", type: "external", label: "CMS bulletin", sub: "MNT coverage update", icon: "🌐", color: C.navyLt },
];

const WIKI_ARTICLES = [
  { id: "w001", label: "prior-auth-denial-patterns.md", sub: "Aetna CO-4 · 13% first-pass", folder: "concepts", color: C.red },
  { id: "w002", label: "physician-activation.md", sub: "35%→55% · 5-touch sequence", folder: "concepts", color: C.teal },
  { id: "w003", label: "funnel-yield-by-condition.md", sub: "56.3%→70% target · by pod", folder: "concepts", color: C.amber },
  { id: "w004", label: "aetna.md", sub: "CO-4 · CO-97 · denial window", folder: "payers", color: C.amber },
  { id: "w005", label: "carefirst.md", sub: "$115–$135 · 14–30d EFT", folder: "payers", color: C.amber },
  { id: "w006", label: "dormant-cohort.md", sub: "47 MDs · 0 refs in 45d", folder: "physicians", color: C.slate },
  { id: "w007", label: "ltv-by-partner-tier.md", sub: "PG $5.7K · Clinic $1.7K", folder: "concepts", color: C.green },
  { id: "w008", label: "index.md", sub: "Auto-maintained · 8 articles · 42K words", folder: "root", color: C.navyLt },
];

const QUERIES = [
  {
    id: "q1",
    text: "Why did PA first-pass drop 3 pts this month?",
    reads: ["w001", "w004", "w005"],
    answer: "Aetna changed their CO-4 review window from 5 to 3 days in their March bulletin. 23 of 31 new denials match this pattern. Recommend: resubmit all CO-4 denials from March with updated clinical necessity notes.",
    writes: ["w001"],
  },
  {
    id: "q2",
    text: "Which dormant physicians are highest priority to reactivate?",
    reads: ["w002", "w006", "w007"],
    answer: "Top 5: Dr. Patel (Cardio, 18 eligible pts, last referral 67d ago), Dr. Kim (Endo, 14 pts, 89d), Dr. Singh (GI, 11 pts, 45d). Physician group tier has 3.4× LTV vs clinic. Start with Patel — CEO call + outcome PDF.",
    writes: ["w006", "w002"],
  },
  {
    id: "q3",
    text: "What's driving the GI pod no-show spike to 14%?",
    reads: ["w003", "w006"],
    answer: "ICD-10 K58.9 (IBS-M) patients show 22% no-show vs 8% average. Correlates with evening-only slot availability in GI pod. Recommendation: add morning slots for K58.9 cohort; SMS reminder 4h before (not 24h).",
    writes: ["w003"],
  },
];

const LINT_CHECKS = [
  { id: "l1", type: "inconsistency", label: "Physician status mismatch", detail: "Dr. Patel listed 'active' in physicians/top-referrers.md — 0 referrals in 67 days. Update to dormant-cohort.", severity: "warn", article: "w006" },
  { id: "l2", type: "missing", label: "Cigna denial pattern missing", detail: "3 Cigna CO-97 denials logged but no Cigna payer article exists. Create cigna.md from EOB data.", severity: "error", article: null },
  { id: "l3", type: "connection", label: "New article candidate", detail: "Session adherence vs ICD-10 sub-code shows significant clustering. Create: adherence-by-diagnosis.md", severity: "info", article: null },
  { id: "l4", type: "impute", label: "Web data available", detail: "Aetna 2026 MNT bulletin found. Updating prior-auth-denial-patterns.md with new 3-day review window.", severity: "info", article: "w001" },
];

// ── ANIMATION HELPERS ─────────────────────────────────────────────────────────
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Pulse({ color = C.teal, size = 8 }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      borderRadius: "50%", background: color,
      boxShadow: `0 0 0 0 ${color}`,
      animation: "pulse-ring 2s infinite",
    }} />
  );
}

// ── PARTICLE FLOW ─────────────────────────────────────────────────────────────
function FlowParticle({ from, to, color, delay = 0, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => {
      setProgress(100);
    }, delay + 50);
    const t3 = setTimeout(() => {
      setVisible(false);
      onComplete && onComplete();
    }, delay + 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [delay]);

  if (!visible || !from || !to) return null;

  const cx = from.x + (to.x - from.x) * (progress / 100);
  const cy = from.y + (to.y - from.y) * (progress / 100);

  return (
    <div style={{
      position: "absolute",
      left: cx - 5, top: cy - 5,
      width: 10, height: 10,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 12px ${color}`,
      transition: "left 1s ease-in-out, top 1s ease-in-out",
      pointerEvents: "none",
      zIndex: 100,
    }} />
  );
}

// ── TYPED TEXT ────────────────────────────────────────────────────────────────
function TypedText({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setDisplayed(""); setIdx(0);
  }, [text]);

  useEffect(() => {
    if (idx >= text.length) { onDone && onDone(); return; }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, idx + 1));
      setIdx(idx + 1);
    }, speed);
    return () => clearTimeout(t);
  }, [idx, text, speed]);

  return <span>{displayed}<span style={{ opacity: idx < text.length ? 1 : 0, color: C.teal }}>▋</span></span>;
}

// ── NODE CARD ─────────────────────────────────────────────────────────────────
function NodeCard({ node, active, pulse, onClick, small = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? node.color + "22" : C.navyMid,
        border: `1.5px solid ${active ? node.color : C.navyLt}`,
        borderRadius: 8,
        padding: small ? "6px 10px" : "8px 12px",
        cursor: "pointer",
        transition: "all 0.25s",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: active ? `0 0 16px ${node.color}44` : "none",
        minWidth: small ? 140 : 170,
      }}
    >
      <span style={{ fontSize: small ? 12 : 14 }}>{node.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: small ? 9 : 10, fontWeight: 700, color: node.color,
          letterSpacing: "0.08em", fontFamily: "monospace",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {node.label}
        </div>
        <div style={{ fontSize: 8.5, color: C.grayMd, marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {node.sub}
        </div>
      </div>
      {pulse && <Pulse color={node.color} size={6} />}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CASTKB() {
  const [mode, setMode] = useState("idle"); // idle | compile | query | lint
  const [activePhase, setActivePhase] = useState(null);
  const [activeRaw, setActiveRaw] = useState([]);
  const [activeWiki, setActiveWiki] = useState([]);
  const [queryIdx, setQueryIdx] = useState(0);
  const [lintIdx, setLintIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerDone, setAnswerDone] = useState(false);
  const [particles, setParticles] = useState([]);
  const [lintResults, setLintResults] = useState([]);
  const [step, setStep] = useState(0);
  const [autoRun, setAutoRun] = useState(false);
  const containerRef = useRef();

  // Node position refs for particle system
  const rawRefs = useRef({});
  const wikiRefs = useRef({});
  const llmRef = useRef();
  const outputRef = useRef();

  const getPos = (ref) => {
    if (!ref?.current || !containerRef?.current) return null;
    const r = ref.current.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
  };

  const spawnParticle = useCallback((from, to, color, delay = 0) => {
    const id = Math.random().toString(36).slice(2);
    setParticles(p => [...p, { id, from, to, color, delay }]);
    setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), delay + 1400);
  }, []);

  // ── COMPILE MODE ────────────────────────────────────────────────────────────
  const runCompile = useCallback(() => {
    setMode("compile");
    setActivePhase("compile");
    setActiveRaw([]); setActiveWiki([]); setShowAnswer(false);
    setLintResults([]);

    const sequence = [
      () => setActiveRaw(["e001", "e002"]),
      () => {
        setActiveRaw(["e001", "e002", "p001", "ph001"]);
        ["e001", "e002"].forEach((id, i) => {
          const fromRef = rawRefs.current[id];
          const toRef = llmRef.current;
          setTimeout(() => {
            const from = getPos(fromRef);
            const to = getPos(toRef ? { current: toRef } : null);
            if (from && to) spawnParticle(from, to, C.teal, i * 180);
          }, 100);
        });
      },
      () => {
        setActiveRaw(RAW_DOCS.map(d => d.id));
        RAW_DOCS.forEach((d, i) => {
          const fromRef = rawRefs.current[d.id];
          setTimeout(() => {
            const from = getPos(fromRef);
            const to = getPos(llmRef.current ? { current: llmRef.current } : null);
            if (from && to) spawnParticle(from, to, d.color, i * 120);
          }, 200);
        });
      },
      () => {
        setActiveWiki(["w008", "w001"]);
        ["w008", "w001"].forEach((id, i) => {
          setTimeout(() => {
            const from = getPos(llmRef.current ? { current: llmRef.current } : null);
            const toRef = wikiRefs.current[id];
            const to = getPos(toRef);
            if (from && to) spawnParticle(from, to, C.teal, i * 200);
          }, 300);
        });
      },
      () => {
        setActiveWiki(WIKI_ARTICLES.map(a => a.id));
        WIKI_ARTICLES.forEach((a, i) => {
          setTimeout(() => {
            const from = getPos(llmRef.current ? { current: llmRef.current } : null);
            const toRef = wikiRefs.current[a.id];
            const to = getPos(toRef);
            if (from && to) spawnParticle(from, to, a.color, i * 140);
          }, 200);
        });
      },
    ];

    let s = 0;
    setStep(0);
    const run = () => {
      if (s < sequence.length) {
        sequence[s]();
        setStep(s);
        s++;
        setTimeout(run, 1100);
      } else {
        setMode("idle");
        setActivePhase(null);
      }
    };
    run();
  }, [spawnParticle]);

  // ── QUERY MODE ──────────────────────────────────────────────────────────────
  const runQuery = useCallback((idx) => {
    const q = QUERIES[idx];
    setMode("query");
    setActivePhase("query");
    setQueryIdx(idx);
    setShowAnswer(false);
    setAnswerDone(false);

    // Highlight relevant wiki articles
    setTimeout(() => {
      setActiveWiki(q.reads);
      q.reads.forEach((id, i) => {
        setTimeout(() => {
          const fromRef = wikiRefs.current[id];
          const to = getPos(llmRef.current ? { current: llmRef.current } : null);
          const from = getPos(fromRef);
          if (from && to) spawnParticle(from, to, C.amber, i * 220);
        }, 200);
      });
    }, 300);

    // Show answer after reads
    setTimeout(() => {
      setShowAnswer(true);
    }, q.reads.length * 350 + 800);

    // Write back to wiki
    setTimeout(() => {
      setActiveWiki([...q.reads, ...q.writes]);
      q.writes.forEach((id, i) => {
        setTimeout(() => {
          const from = getPos(llmRef.current ? { current: llmRef.current } : null);
          const toRef = wikiRefs.current[id];
          const to = getPos(toRef);
          if (from && to) spawnParticle(from, to, C.green, i * 200);
        }, 200);
      });
    }, q.reads.length * 350 + 2800);
  }, [spawnParticle]);

  // ── LINT MODE ───────────────────────────────────────────────────────────────
  const runLint = useCallback(() => {
    setMode("lint");
    setActivePhase("lint");
    setLintResults([]);
    setActiveWiki([]);

    LINT_CHECKS.forEach((check, i) => {
      setTimeout(() => {
        setLintResults(r => [...r, check]);
        if (check.article) {
          setActiveWiki(w => [...w, check.article]);
          const from = getPos(llmRef.current ? { current: llmRef.current } : null);
          const toRef = wikiRefs.current[check.article];
          const to = getPos(toRef);
          const col = check.severity === "error" ? C.red : check.severity === "warn" ? C.amber : C.teal;
          if (from && to) spawnParticle(from, to, col);
        }
      }, i * 900 + 400);
    });

    setTimeout(() => {
      setMode("idle");
      setActivePhase(null);
    }, LINT_CHECKS.length * 900 + 1200);
  }, [spawnParticle]);

  // ── AUTO-RUN LOOP ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoRun) return;
    let cancelled = false;
    const loop = async () => {
      if (cancelled) return;
      runCompile();
      await new Promise(r => setTimeout(r, 7000));
      if (cancelled) return;
      runQuery(0);
      await new Promise(r => setTimeout(r, 7000));
      if (cancelled) return;
      runQuery(1);
      await new Promise(r => setTimeout(r, 7000));
      if (cancelled) return;
      runLint();
      await new Promise(r => setTimeout(r, 6000));
      if (!cancelled) loop();
    };
    loop();
    return () => { cancelled = true; };
  }, [autoRun, runCompile, runQuery, runLint]);

  const currentQuery = QUERIES[queryIdx];
  const severityColor = { error: C.red, warn: C.amber, info: C.teal };

  return (
    <div ref={containerRef} style={{
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      background: C.navy,
      minHeight: "100vh",
      color: C.white,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          70% { box-shadow: 0 0 0 8px transparent; opacity: 0.4; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .node-hover:hover { transform: scale(1.02); }
        .btn { cursor: pointer; transition: all 0.2s; border: none; font-family: 'DM Mono', monospace; }
        .btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #243B55; border-radius: 4px; }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.teal}08 1px, transparent 1px), linear-gradient(90deg, ${C.teal}08 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        {particles.map(p => (
          <FlowParticle key={p.id} from={p.from} to={p.to} color={p.color} delay={p.delay} />
        ))}
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: C.navyMid, borderBottom: `1px solid ${C.navyLt}`,
        padding: "12px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`,
            width: 32, height: 32, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, fontFamily: "Syne, sans-serif",
          }}>K</div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: C.white, letterSpacing: "0.02em" }}>
              CAST-KB
            </div>
            <div style={{ fontSize: 9, color: C.teal, letterSpacing: "0.18em" }}>
              KNOWLEDGE BASE · REVENUE CYCLE INTELLIGENCE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            background: autoRun ? C.teal + "22" : C.navyLt,
            border: `1px solid ${autoRun ? C.teal : C.navyLt}`,
            borderRadius: 20, padding: "4px 12px",
            fontSize: 9, color: autoRun ? C.teal : C.grayMd,
            cursor: "pointer", letterSpacing: "0.12em",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }} onClick={() => setAutoRun(a => !a)}>
            {autoRun && <Pulse color={C.teal} size={6} />}
            {autoRun ? "AUTO-RUNNING" : "AUTO-RUN"}
          </div>

          {[
            { label: "COMPILE", fn: runCompile, color: C.teal, active: activePhase === "compile" },
            { label: "QUERY", fn: () => runQuery(queryIdx), color: C.amber, active: activePhase === "query" },
            { label: "LINT", fn: runLint, color: C.red, active: activePhase === "lint" },
          ].map(btn => (
            <button key={btn.label} className="btn" onClick={btn.fn}
              disabled={mode !== "idle" && activePhase !== btn.label}
              style={{
                background: btn.active ? btn.color : "transparent",
                border: `1.5px solid ${btn.color}`,
                borderRadius: 6, padding: "5px 14px",
                fontSize: 9, fontWeight: 700, color: btn.active ? C.navy : btn.color,
                letterSpacing: "0.14em", opacity: (mode !== "idle" && activePhase !== btn.label) ? 0.35 : 1,
              }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 220px",
        gridTemplateRows: "1fr",
        gap: 0,
        height: "calc(100vh - 57px)",
        position: "relative", zIndex: 5,
      }}>

        {/* ── LEFT: RAW/ ─────────────────────────────────────────────────── */}
        <div style={{
          borderRight: `1px solid ${C.navyLt}`,
          overflow: "auto", padding: "16px 12px",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 8, color: C.teal, letterSpacing: "0.2em", marginBottom: 4 }}>RAW/</div>
            <div style={{ fontSize: 9, color: C.grayMd }}>Source documents · ingest layer</div>
          </div>

          {["event", "payer", "physician", "external"].map(type => (
            <div key={type}>
              <div style={{ fontSize: 8, color: C.grayMd, letterSpacing: "0.14em", margin: "8px 0 4px",
                paddingLeft: 4, borderLeft: `2px solid ${C.navyLt}` }}>
                {type.toUpperCase()}/
              </div>
              {RAW_DOCS.filter(d => d.type === type).map(doc => (
                <div key={doc.id}
                  ref={el => rawRefs.current[doc.id] = el ? { current: el } : null}
                  className="node-hover"
                  style={{
                    background: activeRaw.includes(doc.id) ? doc.color + "1A" : C.navyMid,
                    border: `1px solid ${activeRaw.includes(doc.id) ? doc.color : C.navyLt}`,
                    borderRadius: 6, padding: "5px 8px", marginBottom: 3,
                    transition: "all 0.3s",
                    boxShadow: activeRaw.includes(doc.id) ? `0 0 10px ${doc.color}33` : "none",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11 }}>{doc.icon}</span>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: activeRaw.includes(doc.id) ? doc.color : C.white,
                        fontFamily: "monospace", letterSpacing: "0.03em" }}>{doc.label}</div>
                      <div style={{ fontSize: 7.5, color: C.grayMd }}>{doc.sub}</div>
                    </div>
                    {activeRaw.includes(doc.id) && <Pulse color={doc.color} size={5} />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── CENTER: LLM ENGINE ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "flex-start", padding: "20px 16px", gap: 12, overflow: "auto",
        }}>

          {/* LLM Core */}
          <div ref={el => llmRef.current = el}
            style={{
              background: `linear-gradient(135deg, ${C.navyMid}, ${C.navyLt})`,
              border: `2px solid ${mode !== "idle" ? C.teal : C.navyLt}`,
              borderRadius: 16, padding: "18px 24px", width: "100%", maxWidth: 520,
              boxShadow: mode !== "idle" ? `0 0 40px ${C.teal}33` : "none",
              transition: "all 0.4s", position: "relative",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>🧠</div>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: C.white }}>
                  LLM Engine
                </div>
                <div style={{ fontSize: 8.5, color: C.teal, letterSpacing: "0.1em" }}>
                  {activePhase === "compile" && "COMPILING WIKI..."}
                  {activePhase === "query" && "PROCESSING QUERY..."}
                  {activePhase === "lint" && "RUNNING HEALTH CHECK..."}
                  {!activePhase && "IDLE · READY"}
                </div>
              </div>
              {mode !== "idle" && <Pulse color={C.teal} size={8} />}
            </div>

            {/* Phase indicator pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "COMPILE", color: C.teal },
                { label: "QUERY", color: C.amber },
                { label: "LINT", color: C.red },
              ].map(ph => (
                <div key={ph.label} style={{
                  background: activePhase === ph.label.toLowerCase() ? ph.color : C.navyLt,
                  color: activePhase === ph.label.toLowerCase() ? C.navy : C.grayMd,
                  borderRadius: 4, padding: "2px 8px", fontSize: 8, fontWeight: 700,
                  letterSpacing: "0.1em", transition: "all 0.3s",
                }}>
                  {ph.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── QUERY PANEL ──────────────────────────────────────────────── */}
          {(mode === "query" || (mode === "idle" && showAnswer)) && (
            <div style={{
              width: "100%", maxWidth: 520,
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ fontSize: 8, color: C.amber, letterSpacing: "0.16em", marginBottom: 8 }}>
                ACTIVE QUERY
              </div>

              {/* Query selector */}
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {QUERIES.map((q, i) => (
                  <div key={q.id}
                    onClick={() => { if (mode === "idle") { setQueryIdx(i); setShowAnswer(false); setAnswerDone(false); }}}
                    style={{
                      background: queryIdx === i ? C.amber + "22" : C.navyMid,
                      border: `1px solid ${queryIdx === i ? C.amber : C.navyLt}`,
                      borderRadius: 4, padding: "3px 8px", fontSize: 8,
                      color: queryIdx === i ? C.amber : C.grayMd,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>Q{i + 1}</div>
                ))}
              </div>

              <div style={{
                background: C.navyMid, border: `1px solid ${C.amber}`,
                borderRadius: 10, padding: "12px 14px", marginBottom: 8,
              }}>
                <div style={{ fontSize: 9, color: C.amber, marginBottom: 4, letterSpacing: "0.08em" }}>
                  query:
                </div>
                <div style={{ fontSize: 11.5, color: C.white, lineHeight: 1.5 }}>
                  "{currentQuery.text}"
                </div>
              </div>

              <div style={{ fontSize: 8, color: C.grayMd, marginBottom: 6 }}>
                reading: {currentQuery.reads.map(id => WIKI_ARTICLES.find(a => a.id === id)?.label).join(", ")}
              </div>

              {showAnswer && (
                <div style={{
                  background: C.green + "12", border: `1px solid ${C.green}`,
                  borderRadius: 10, padding: "12px 14px",
                  animation: "fadeIn 0.4s ease",
                }}>
                  <div style={{ fontSize: 9, color: C.green, marginBottom: 6, letterSpacing: "0.08em" }}>
                    answer:
                  </div>
                  <div style={{ fontSize: 11, color: C.white, lineHeight: 1.65 }}>
                    <TypedText text={currentQuery.answer} speed={14} onDone={() => setAnswerDone(true)} />
                  </div>
                  {answerDone && (
                    <div style={{ marginTop: 8, fontSize: 8, color: C.teal, animation: "fadeIn 0.3s" }}>
                      ↩ filing to: {currentQuery.writes.map(id => WIKI_ARTICLES.find(a => a.id === id)?.label).join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── LINT PANEL ───────────────────────────────────────────────── */}
          {(mode === "lint" || lintResults.length > 0) && mode !== "query" && mode !== "compile" && (
            <div style={{ width: "100%", maxWidth: 520, animation: "fadeIn 0.3s" }}>
              <div style={{ fontSize: 8, color: C.red, letterSpacing: "0.16em", marginBottom: 8 }}>
                HEALTH CHECK RESULTS
              </div>
              {lintResults.map((r, i) => (
                <div key={r.id} style={{
                  background: severityColor[r.severity] + "12",
                  border: `1px solid ${severityColor[r.severity]}`,
                  borderRadius: 8, padding: "8px 12px", marginBottom: 6,
                  animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: severityColor[r.severity], fontWeight: 700,
                      letterSpacing: "0.1em" }}>
                      {r.severity.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: C.white, fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 9, color: C.grayMd }}>[{r.type}]</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: C.grayMd, lineHeight: 1.5 }}>{r.detail}</div>
                </div>
              ))}
              {mode === "idle" && lintResults.length === LINT_CHECKS.length && (
                <div style={{ fontSize: 9, color: C.teal, marginTop: 4, animation: "fadeIn 0.3s" }}>
                  ✓ Health check complete · 4 issues found · 2 auto-resolved · 2 queued
                </div>
              )}
            </div>
          )}

          {/* ── COMPILE STATUS ───────────────────────────────────────────── */}
          {mode === "compile" && (
            <div style={{ width: "100%", maxWidth: 520, animation: "fadeIn 0.3s" }}>
              <div style={{ fontSize: 8, color: C.teal, letterSpacing: "0.16em", marginBottom: 8 }}>
                COMPILE LOG
              </div>
              {[
                { s: 0, text: "Scanning raw/ — 9 documents found", color: C.grayMd },
                { s: 1, text: "Indexing events: REFERRAL_RECEIVED, PA_DENIED...", color: C.grayMd },
                { s: 2, text: "Ingesting all sources into LLM context...", color: C.teal },
                { s: 3, text: "Writing wiki/index.md · wiki/concepts/prior-auth-denial-patterns.md...", color: C.teal },
                { s: 4, text: "Compiling 8 wiki articles · updating backlinks...", color: C.green },
              ].filter(l => l.s <= step).map((l, i) => (
                <div key={i} style={{ fontSize: 9.5, color: l.color, marginBottom: 4,
                  animation: "fadeIn 0.2s", lineHeight: 1.5 }}>
                  {l.s < step ? "✓ " : "▸ "}{l.text}
                </div>
              ))}
            </div>
          )}

          {/* ── IDLE: Architecture diagram ───────────────────────────────── */}
          {mode === "idle" && !showAnswer && lintResults.length === 0 && (
            <div style={{
              width: "100%", maxWidth: 520,
              background: C.navyMid, border: `1px solid ${C.navyLt}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 8, color: C.slate, letterSpacing: "0.16em", marginBottom: 12 }}>
                ARCHITECTURE OVERVIEW
              </div>
              {[
                { icon: "📂", label: "raw/", desc: "Source documents — events, payers, physicians, external", color: C.slate },
                { icon: "⬇", label: "", desc: "", color: C.navyLt },
                { icon: "🧠", label: "LLM Engine", desc: "Compile · Query · Lint — operates on the knowledge base", color: C.teal },
                { icon: "⬇", label: "", desc: "", color: C.navyLt },
                { icon: "📚", label: "wiki/", desc: "Compiled .md articles — concepts, payers, physicians, index", color: C.teal },
                { icon: "↺", label: "", desc: "", color: C.navyLt },
                { icon: "💬", label: "Q&A Output", desc: "Answers filed back into wiki — knowledge compounds over time", color: C.amber },
              ].map((item, i) => (
                item.label === "" ? (
                  <div key={i} style={{ textAlign: "center", color: C.navyLt, fontSize: 14, margin: "2px 0" }}>
                    {item.icon}
                  </div>
                ) : (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, minWidth: 20 }}>{item.icon}</span>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.label}  </span>
                      <span style={{ fontSize: 9.5, color: C.grayMd }}>{item.desc}</span>
                    </div>
                  </div>
                )
              ))}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.navyLt}`,
                fontSize: 9, color: C.grayMd, lineHeight: 1.6 }}>
                Click COMPILE, QUERY, or LINT above to see the loop in action.
                Watch particles flow between raw/, LLM, and wiki/ as data moves.
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: WIKI/ ───────────────────────────────────────────────── */}
        <div style={{
          borderLeft: `1px solid ${C.navyLt}`,
          overflow: "auto", padding: "16px 12px",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 8, color: C.teal, letterSpacing: "0.2em", marginBottom: 4 }}>WIKI/</div>
            <div style={{ fontSize: 9, color: C.grayMd }}>Compiled knowledge · LLM-maintained</div>
          </div>

          {["root", "concepts", "payers", "physicians"].map(folder => (
            <div key={folder}>
              <div style={{ fontSize: 8, color: C.grayMd, letterSpacing: "0.14em", margin: "8px 0 4px",
                paddingLeft: 4, borderLeft: `2px solid ${C.navyLt}` }}>
                {folder === "root" ? "" : folder + "/"}
              </div>
              {WIKI_ARTICLES.filter(a => a.folder === folder).map(article => (
                <div key={article.id}
                  ref={el => wikiRefs.current[article.id] = el ? { current: el } : null}
                  className="node-hover"
                  style={{
                    background: activeWiki.includes(article.id) ? article.color + "1A" : C.navyMid,
                    border: `1px solid ${activeWiki.includes(article.id) ? article.color : C.navyLt}`,
                    borderRadius: 6, padding: "5px 8px", marginBottom: 3,
                    transition: "all 0.3s",
                    boxShadow: activeWiki.includes(article.id) ? `0 0 10px ${article.color}33` : "none",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9 }}>📝</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, fontWeight: 600,
                        color: activeWiki.includes(article.id) ? article.color : C.white,
                        fontFamily: "monospace", letterSpacing: "0.01em",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {article.label}
                      </div>
                      <div style={{ fontSize: 7.5, color: C.grayMd }}>{article.sub}</div>
                    </div>
                    {activeWiki.includes(article.id) && <Pulse color={article.color} size={5} />}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Stats footer */}
          <div style={{
            marginTop: "auto", paddingTop: 10,
            borderTop: `1px solid ${C.navyLt}`,
          }}>
            <div style={{ fontSize: 8, color: C.teal, letterSpacing: "0.14em", marginBottom: 6 }}>WIKI STATS</div>
            {[
              { label: "Articles", value: `${activeWiki.length || 0} / ${WIKI_ARTICLES.length} active` },
              { label: "Words", value: "~42K (estimated)" },
              { label: "Last compile", value: activePhase === "compile" ? "running..." : "just now" },
              { label: "Backlinks", value: "34 cross-refs" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between",
                marginBottom: 3, fontSize: 8.5 }}>
                <span style={{ color: C.grayMd }}>{s.label}</span>
                <span style={{ color: C.white }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: C.navyMid, borderTop: `1px solid ${C.navyLt}`,
        padding: "4px 20px", display: "flex", gap: 20, zIndex: 20,
        fontSize: 8.5,
      }}>
        <span style={{ color: C.teal }}>CAST-KB v1.0</span>
        <span style={{ color: C.grayMd }}>·</span>
        <span style={{ color: C.grayMd }}>{RAW_DOCS.length} source docs</span>
        <span style={{ color: C.grayMd }}>·</span>
        <span style={{ color: C.grayMd }}>{WIKI_ARTICLES.length} wiki articles</span>
        <span style={{ color: C.grayMd }}>·</span>
        <span style={{ color: mode !== "idle" ? C.teal : C.grayMd }}>
          {mode !== "idle" ? `${mode.toUpperCase()} in progress...` : "idle · ready"}
        </span>
        {autoRun && (
          <>
            <span style={{ color: C.grayMd }}>·</span>
            <span style={{ color: C.teal }}>⟳ auto-loop active</span>
          </>
        )}
      </div>
    </div>
  );
}
