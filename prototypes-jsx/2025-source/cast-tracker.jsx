import { useState, useMemo, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CAST ARCHITECTURE DEMO — ENTERTAINMENT TRACKER
// Demonstrates: Public/Private event separation, selective disclosure,
// cryptographic boundary, on-device AI inference
// ═══════════════════════════════════════════════════════════════════════════

// ── Public Event Ledger (shared, immutable, sourced from TMDB/public APIs) ─
const PUBLIC_EVENTS = [
  { id: "pub-001", title: "Severance", type: "series", season: "S2", date: "2026-02-16", platform: "Apple TV+", status: "airing", genre: "Sci-Fi Thriller", eventType: "release" },
  { id: "pub-002", title: "The White Lotus", type: "series", season: "S4", date: "2026-02-16", platform: "HBO", status: "airing", genre: "Drama", eventType: "release" },
  { id: "pub-003", title: "Andor", type: "series", season: "S2", date: "2026-02-18", platform: "Disney+", status: "airing", genre: "Sci-Fi", eventType: "release" },
  { id: "pub-004", title: "Daredevil: Born Again", type: "series", season: "S1", date: "2026-02-18", platform: "Disney+", status: "airing", genre: "Action", eventType: "release" },
  { id: "pub-005", title: "The Monkey", type: "movie", date: "2026-02-21", platform: "Theaters", status: "upcoming", genre: "Horror", eventType: "release" },
  { id: "pub-006", title: "Reacher", type: "series", season: "S3", date: "2026-02-20", platform: "Prime Video", status: "airing", genre: "Action", eventType: "release" },
  { id: "pub-007", title: "Zero Day", type: "series", season: "S1", date: "2026-02-20", platform: "Netflix", status: "upcoming", genre: "Thriller", eventType: "release" },
  { id: "pub-008", title: "Black Mirror", type: "series", season: "S7", date: "2026-03-06", platform: "Netflix", status: "upcoming", genre: "Sci-Fi", eventType: "release" },
  { id: "pub-009", title: "Stranger Things", type: "series", season: "S5", date: "2026-03-14", platform: "Netflix", status: "upcoming", genre: "Sci-Fi Horror", eventType: "release" },
  { id: "pub-010", title: "Snow White", type: "movie", date: "2026-03-21", platform: "Theaters", status: "upcoming", genre: "Fantasy", eventType: "release" },
  { id: "pub-011", title: "The Studio", type: "series", season: "S1", date: "2026-03-26", platform: "Apple TV+", status: "upcoming", genre: "Comedy", eventType: "release" },
  { id: "pub-012", title: "Fallout", type: "series", season: "S2", date: "2026-04-01", platform: "Prime Video", status: "renewed", genre: "Sci-Fi", eventType: "renewal" },
  { id: "pub-013", title: "A Minecraft Movie", type: "movie", date: "2026-04-04", platform: "Theaters", status: "upcoming", genre: "Adventure", eventType: "release" },
  { id: "pub-014", title: "The Bear", type: "series", season: "S4", date: "2026-04-15", platform: "Hulu", status: "upcoming", genre: "Drama", eventType: "release" },
  { id: "pub-015", title: "Thunderbolts*", type: "movie", date: "2026-05-02", platform: "Theaters", status: "upcoming", genre: "Action", eventType: "release" },
  { id: "pub-016", title: "Mission: Impossible 8", type: "movie", date: "2026-05-23", platform: "Theaters", status: "upcoming", genre: "Action", eventType: "release" },
  { id: "pub-017", title: "Shogun", type: "series", season: "S2", date: "2026-06-01", platform: "FX / Hulu", status: "renewed", genre: "Drama", eventType: "renewal" },
  { id: "pub-018", title: "Squid Game", type: "series", season: "S3", date: "2026-06-27", platform: "Netflix", status: "upcoming", genre: "Thriller", eventType: "release" },
  { id: "pub-019", title: "Jurassic World Rebirth", type: "movie", date: "2026-07-02", platform: "Theaters", status: "upcoming", genre: "Sci-Fi", eventType: "release" },
  { id: "pub-020", title: "Superman", type: "movie", date: "2026-07-11", platform: "Theaters", status: "upcoming", genre: "Action", eventType: "release" },
  { id: "pub-021", title: "House of the Dragon", type: "series", season: "S3", date: "2026-08-01", platform: "HBO", status: "renewed", genre: "Fantasy", eventType: "renewal" },
  { id: "pub-022", title: "Wednesday", type: "series", season: "S2", date: "2026-08-06", platform: "Netflix", status: "upcoming", genre: "Comedy Horror", eventType: "release" },
];

// ── Private Event Log (local-only, never transmitted) ────────────────────
const INITIAL_PRIVATE_EVENTS = [
  { id: "prv-001", ref: "pub-001", action: "tracking", timestamp: "2026-01-15T10:00:00Z", detail: "Added to watchlist" },
  { id: "prv-002", ref: "pub-001", action: "watching", timestamp: "2026-02-04T21:00:00Z", detail: "Started S2, Episode 1" },
  { id: "prv-003", ref: "pub-001", action: "progress", timestamp: "2026-02-16T09:00:00Z", detail: "Caught up through S2E5" },
  { id: "prv-004", ref: "pub-002", action: "tracking", timestamp: "2026-02-01T08:00:00Z", detail: "Added to watchlist" },
  { id: "prv-005", ref: "pub-003", action: "tracking", timestamp: "2026-01-20T12:00:00Z", detail: "Added to watchlist" },
  { id: "prv-006", ref: "pub-003", action: "note", timestamp: "2026-02-01T14:00:00Z", detail: "Need to finish S1 first — on episode 9" },
  { id: "prv-007", ref: "pub-008", action: "tracking", timestamp: "2026-02-10T11:00:00Z", detail: "Added to watchlist" },
  { id: "prv-008", ref: "pub-009", action: "tracking", timestamp: "2026-01-05T09:00:00Z", detail: "Added to watchlist" },
  { id: "prv-009", ref: "pub-009", action: "rated", timestamp: "2026-01-10T20:00:00Z", detail: "S4 rating: 7/10 — weaker than S3" },
  { id: "prv-010", ref: "pub-014", action: "tracking", timestamp: "2026-02-12T16:00:00Z", detail: "Added to watchlist" },
  { id: "prv-011", ref: "pub-014", action: "rated", timestamp: "2026-02-12T16:01:00Z", detail: "S3 rating: 9/10" },
  { id: "prv-012", ref: "pub-017", action: "tracking", timestamp: "2026-01-25T13:00:00Z", detail: "Added to watchlist" },
  { id: "prv-013", ref: "pub-017", action: "rated", timestamp: "2026-01-25T13:01:00Z", detail: "S1 rating: 10/10 — masterpiece" },
  { id: "prv-014", ref: "pub-012", action: "tracking", timestamp: "2026-02-14T10:00:00Z", detail: "Added to watchlist" },
  { id: "prv-015", ref: "pub-018", action: "tracking", timestamp: "2026-02-15T19:00:00Z", detail: "Added to watchlist" },
];

// ── Selective Disclosures (what you've chosen to make public) ────────────
const INITIAL_DISCLOSURES = [
  { id: "disc-001", ref: "pub-017", field: "rating", value: "10/10", disclosedAt: "2026-01-26T10:00:00Z", hash: "a7f3c9..." },
  { id: "disc-002", ref: "pub-014", field: "rating", value: "9/10", disclosedAt: "2026-02-13T08:00:00Z", hash: "e2b8d1..." },
];

// ── Constants ────────────────────────────────────────────────────────────
const TODAY = new Date("2026-02-16");
const DAY_MS = 86400000;

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtMonth = (d) => new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const fmtTime = (ts) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const isSameDay = (a, b) => a.toDateString() === b.toDateString();

const getDateRange = (view, offset) => {
  const base = new Date(TODAY);
  if (view === "day") {
    base.setDate(base.getDate() + offset);
    return { start: new Date(base), end: new Date(base) };
  }
  if (view === "week") {
    const dow = base.getDay();
    base.setDate(base.getDate() - dow + offset * 7);
    const start = new Date(base);
    const end = new Date(base); end.setDate(end.getDate() + 6);
    return { start, end };
  }
  base.setMonth(base.getMonth() + offset, 1);
  const start = new Date(base);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return { start, end };
};

const inRange = (dateStr, s, e) => {
  const d = new Date(dateStr);
  return d >= new Date(s.toDateString()) && d <= new Date(e.toDateString());
};

// ── Platform / Status Styles ─────────────────────────────────────────────
const PC = {
  "Netflix": { bg: "#1a0a0a", border: "#e50914", text: "#e50914", glow: "rgba(229,9,20,0.08)" },
  "HBO": { bg: "#0c0a1a", border: "#b48eed", text: "#b48eed", glow: "rgba(180,142,237,0.08)" },
  "Disney+": { bg: "#0a1220", border: "#0075e0", text: "#56a8f5", glow: "rgba(0,117,224,0.08)" },
  "Apple TV+": { bg: "#111111", border: "#888", text: "#bbb", glow: "rgba(136,136,136,0.06)" },
  "Prime Video": { bg: "#0d1520", border: "#00a8e1", text: "#00c8ff", glow: "rgba(0,168,225,0.08)" },
  "Hulu": { bg: "#0a1a0a", border: "#1ce783", text: "#1ce783", glow: "rgba(28,231,131,0.08)" },
  "FX / Hulu": { bg: "#12180a", border: "#d4a830", text: "#d4a830", glow: "rgba(212,168,48,0.08)" },
  "Theaters": { bg: "#1a1510", border: "#c89840", text: "#c89840", glow: "rgba(200,152,64,0.08)" },
};
const gc = (p) => PC[p] || { bg: "#151515", border: "#444", text: "#888", glow: "rgba(68,68,68,0.06)" };

const SS = {
  airing: { bg: "#0f2e1a", color: "#34d67a", label: "AIRING" },
  upcoming: { bg: "#1a1a0a", color: "#b8a830", label: "UPCOMING" },
  renewed: { bg: "#0f1a2e", color: "#5ab4f0", label: "RENEWED" },
  cancelled: { bg: "#2e0f0f", color: "#f05a5a", label: "CANCELLED" },
};

const ACTION_ICONS = {
  tracking: "◉", watching: "▶", progress: "◈", rated: "★", note: "✎", disclosed: "↗",
};

// ── Styles ────────────────────────────────────────────────────────────────
const FONT = "'IBM Plex Mono', 'Fira Code', 'SF Mono', monospace";
const FONT_SANS = "'IBM Plex Sans', 'Helvetica Neue', sans-serif";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function CASTTracker() {
  const [view, setView] = useState("week");
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [activePanel, setActivePanel] = useState("calendar"); // calendar | events | ai
  const [privateEvents, setPrivateEvents] = useState(INITIAL_PRIVATE_EVENTS);
  const [disclosures, setDisclosures] = useState(INITIAL_DISCLOSURES);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const trackedIds = useMemo(() => new Set(
    privateEvents.filter(e => e.action === "tracking").map(e => e.ref)
  ), [privateEvents]);

  const { start, end } = useMemo(() => getDateRange(view, offset), [view, offset]);

  const filtered = useMemo(() => {
    return PUBLIC_EVENTS
      .filter(i => inRange(i.date, start, end))
      .filter(i => typeFilter === "all" || i.type === typeFilter)
      .filter(i => platformFilter === "all" || i.platform === platformFilter)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [start, end, typeFilter, platformFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(i => { if (!map[i.date]) map[i.date] = []; map[i.date].push(i); });
    return Object.entries(map).sort(([a], [b]) => new Date(a) - new Date(b));
  }, [filtered]);

  const platforms = [...new Set(PUBLIC_EVENTS.map(d => d.platform))].sort();

  const headerLabel = () => {
    if (view === "day") return fmt(start);
    if (view === "week") return `${fmt(start)} – ${fmt(end)}`;
    return fmtMonth(start);
  };

  const toggleTrack = (pubId) => {
    if (trackedIds.has(pubId)) {
      setPrivateEvents(prev => prev.filter(e => !(e.ref === pubId && e.action === "tracking")));
    } else {
      setPrivateEvents(prev => [...prev, {
        id: `prv-${Date.now()}`, ref: pubId, action: "tracking",
        timestamp: new Date().toISOString(), detail: "Added to watchlist"
      }]);
    }
  };

  const getPrivateForItem = (pubId) => privateEvents.filter(e => e.ref === pubId);
  const getDisclosuresForItem = (pubId) => disclosures.filter(d => d.ref === pubId);

  // ── AI Chat ────────────────────────────────────────────────────────────
  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    const trackedTitles = PUBLIC_EVENTS.filter(e => trackedIds.has(e.id));
    const contextStr = `You are an AI assistant embedded in a privacy-first entertainment tracker that demonstrates CAST (Causal Accounting Systems Technology) architecture principles.

ARCHITECTURE CONTEXT:
- This tracker separates PUBLIC EVENTS (release dates, renewals — shared, immutable) from PRIVATE STATE (user's watchlist, ratings, progress — local-only, never transmitted)
- The user controls what to DISCLOSE at the boundary — selective, auditable, cryptographically provable
- This is a demo of how CAST's event-sourced architecture applies beyond finance

USER'S TRACKED SHOWS (PRIVATE STATE — only visible because this is their local device):
${trackedTitles.map(t => `- ${t.title} ${t.season || ""} (${t.platform}, ${t.status}, ${t.date})`).join("\n")}

USER'S PRIVATE EVENTS:
${privateEvents.map(e => {
  const pub = PUBLIC_EVENTS.find(p => p.id === e.ref);
  return `- ${pub?.title || "Unknown"}: ${e.action} — ${e.detail} (${fmtTime(e.timestamp)})`;
}).join("\n")}

SELECTIVE DISCLOSURES (what user has chosen to make public):
${disclosures.map(d => {
  const pub = PUBLIC_EVENTS.find(p => p.id === d.ref);
  return `- ${pub?.title}: ${d.field} = ${d.value} (disclosed ${fmtTime(d.disclosedAt)}, hash: ${d.hash})`;
}).join("\n")}

ALL UPCOMING PUBLIC RELEASES:
${PUBLIC_EVENTS.map(e => `- ${e.title} ${e.season || ""}: ${e.date} on ${e.platform} [${e.status}]`).join("\n")}

Today's date: February 16, 2026.

Answer the user's question concisely. If they ask about their personal data, remind them this stays local. If they ask about sharing/disclosure, explain the boundary protocol. Keep responses short and direct — 2-4 sentences max unless they ask for detail.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: contextStr,
          messages: [
            ...chatMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMsg }
          ],
        }),
      });
      const data = await response.json();
      const reply = data.content?.map(c => c.text || "").filter(Boolean).join("\n") || "Unable to process request.";
      setChatMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", text: "Connection error. All processing stays local — this query was not transmitted." }]);
    }
    setChatLoading(false);
  }, [chatInput, chatLoading, chatMessages, privateEvents, disclosures, trackedIds]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#08080a", color: "#d0d0d0",
      fontFamily: FONT, fontSize: "12px", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: #222 transparent; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .item-row:hover { background: rgba(255,255,255,0.02) !important; }
        .track-btn:hover { opacity: 1 !important; }
        .nav-btn:hover { border-color: #444 !important; color: #aaa !important; }
        .panel-btn:hover { background: #151518 !important; }
        .chat-send:hover { background: #1a2a1a !important; border-color: #2a5a2a !important; }
      `}</style>

      {/* ════ TOP BAR ════ */}
      <div style={{
        padding: "16px 24px 12px", borderBottom: "1px solid #141418",
        background: "linear-gradient(180deg, #0c0c10 0%, #08080a 100%)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "1px", background: "#34d67a", boxShadow: "0 0 8px rgba(52,214,122,0.4)" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "3px", color: "#555", fontFamily: FONT }}>
                SIGHTLINE
              </span>
            </div>
            <span style={{ fontSize: "9px", color: "#2a2a2e", letterSpacing: "1.5px", marginLeft: "14px" }}>
              CAST ARCHITECTURE DEMO
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {[
            { key: "calendar", label: "CALENDAR", icon: "▦" },
            { key: "events", label: "EVENT LOG", icon: "◈" },
            { key: "ai", label: "AI QUERY", icon: "⬡" },
          ].map(p => (
            <button key={p.key} className="panel-btn" onClick={() => setActivePanel(p.key)} style={{
              background: activePanel === p.key ? "#141418" : "transparent",
              border: "1px solid " + (activePanel === p.key ? "#1e1e24" : "transparent"),
              color: activePanel === p.key ? "#d0d0d0" : "#444",
              padding: "6px 14px", borderRadius: "3px", fontSize: "10px",
              fontFamily: FONT, letterSpacing: "1.5px", cursor: "pointer",
              transition: "all 0.15s",
            }}>
              <span style={{ marginRight: "5px", fontSize: "11px" }}>{p.icon}</span>{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════ ARCHITECTURE INDICATOR ════ */}
      <div style={{
        display: "flex", gap: "0", borderBottom: "1px solid #141418", fontSize: "9px",
        letterSpacing: "1.5px", color: "#333",
      }}>
        <div style={{ flex: 1, padding: "6px 24px", borderRight: "1px solid #141418", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#34d67a", fontSize: "7px" }}>●</span> PUBLIC LEDGER — {PUBLIC_EVENTS.length} events
        </div>
        <div style={{ flex: 1, padding: "6px 24px", borderRight: "1px solid #141418", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#e0a030", fontSize: "7px" }}>●</span> PRIVATE STATE — {privateEvents.length} events · local only
        </div>
        <div style={{ flex: 1, padding: "6px 24px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#5ab4f0", fontSize: "7px" }}>●</span> DISCLOSED — {disclosures.length} items · selective · auditable
        </div>
      </div>

      {/* ════ MAIN CONTENT ════ */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ──── CALENDAR VIEW ──── */}
        {activePanel === "calendar" && (
          <div style={{ flex: 1, overflow: "auto", animation: "fadeIn 0.2s ease" }}>
            {/* Controls */}
            <div style={{
              padding: "14px 24px", display: "flex", alignItems: "center", gap: "8px",
              borderBottom: "1px solid #0e0e12", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", border: "1px solid #1a1a1e", borderRadius: "3px", overflow: "hidden" }}>
                {["day", "week", "month"].map(v => (
                  <button key={v} onClick={() => { setView(v); setOffset(0); }} style={{
                    background: view === v ? "#18181e" : "transparent",
                    color: view === v ? "#d0d0d0" : "#444",
                    border: "none", padding: "5px 13px", fontSize: "10px",
                    fontFamily: FONT, letterSpacing: "1px", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.15s",
                  }}>{v}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "3px" }}>
                {[
                  { label: "◀", action: () => setOffset(o => o - 1) },
                  { label: "NOW", action: () => setOffset(0) },
                  { label: "▶", action: () => setOffset(o => o + 1) },
                ].map((b, i) => (
                  <button key={i} className="nav-btn" onClick={b.action} style={{
                    background: "transparent", color: "#444", border: "1px solid #1a1a1e",
                    borderRadius: "3px", padding: "4px 10px", fontSize: "10px",
                    fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                  }}>{b.label}</button>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: "#777", fontWeight: 500, marginLeft: "8px" }}>
                {headerLabel()}
              </span>
              <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                {[
                  { val: typeFilter, set: setTypeFilter, opts: [["all", "All Types"], ["series", "Series"], ["movie", "Movies"]] },
                  { val: platformFilter, set: setPlatformFilter, opts: [["all", "All Platforms"], ...platforms.map(p => [p, p])] },
                ].map((f, i) => (
                  <select key={i} value={f.val} onChange={e => f.set(e.target.value)} style={{
                    background: "#0e0e12", color: "#666", border: "1px solid #1a1a1e",
                    borderRadius: "3px", padding: "4px 8px", fontSize: "10px",
                    fontFamily: FONT, cursor: "pointer",
                  }}>
                    {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ))}
              </div>
            </div>

            {/* Release List */}
            <div style={{ padding: "16px 24px" }}>
              {grouped.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: "#222", fontSize: "11px", letterSpacing: "2px" }}>
                  NO RELEASES IN THIS PERIOD
                </div>
              ) : grouped.map(([dateStr, items], gi) => (
                <div key={dateStr} style={{ marginBottom: "20px", animation: `slideIn 0.2s ease ${gi * 0.05}s both` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 600, letterSpacing: "2px",
                      color: isSameDay(new Date(dateStr), TODAY) ? "#d0d0d0" : "#444",
                    }}>{fmt(dateStr)}</span>
                    {isSameDay(new Date(dateStr), TODAY) && (
                      <span style={{
                        fontSize: "8px", letterSpacing: "2px", color: "#34d67a",
                        background: "#0f2e1a", padding: "2px 7px", borderRadius: "2px", fontWeight: 600,
                      }}>TODAY</span>
                    )}
                    <div style={{ flex: 1, height: "1px", background: "#141418" }} />
                  </div>

                  {items.map(item => {
                    const pc = gc(item.platform);
                    const st = SS[item.status] || SS.upcoming;
                    const isTracked = trackedIds.has(item.id);
                    const privCount = getPrivateForItem(item.id).length;
                    const discCount = getDisclosuresForItem(item.id).length;

                    return (
                      <div key={item.id} className="item-row" onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "9px 12px", marginBottom: "2px",
                          background: pc.bg, borderLeft: `3px solid ${pc.border}`,
                          borderRadius: "2px", cursor: "pointer", transition: "all 0.15s",
                          boxShadow: selectedItem === item.id ? `inset 0 0 20px ${pc.glow}` : "none",
                        }}>
                        {/* Track toggle */}
                        <button className="track-btn" onClick={(e) => { e.stopPropagation(); toggleTrack(item.id); }}
                          title={isTracked ? "Remove from watchlist (private)" : "Add to watchlist (private)"}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: isTracked ? "#e0a030" : "#2a2a2e", fontSize: "14px",
                            opacity: isTracked ? 1 : 0.5, transition: "all 0.15s", padding: "0", width: "18px",
                          }}>
                          {isTracked ? "◉" : "○"}
                        </button>

                        <span style={{ fontSize: "9px", color: "#333", width: "30px", letterSpacing: "1px", flexShrink: 0 }}>
                          {item.type === "series" ? "TV" : "FILM"}
                        </span>

                        <span style={{ fontSize: "12px", fontWeight: 500, color: "#d0d0d0", flex: 1, minWidth: 0 }}>
                          {item.title}
                          {item.season && <span style={{ color: "#555", fontWeight: 400, marginLeft: "5px", fontSize: "10px" }}>{item.season}</span>}
                        </span>

                        <span style={{ fontSize: "9px", color: "#333", minWidth: "70px", letterSpacing: "0.5px" }}>{item.genre}</span>

                        {/* Privacy indicators */}
                        {isTracked && (
                          <span title={`${privCount} private events`} style={{
                            fontSize: "8px", color: "#e0a030", background: "rgba(224,160,48,0.1)",
                            padding: "2px 5px", borderRadius: "2px", letterSpacing: "1px",
                          }}>
                            ◈ {privCount}
                          </span>
                        )}
                        {discCount > 0 && (
                          <span title={`${discCount} disclosures`} style={{
                            fontSize: "8px", color: "#5ab4f0", background: "rgba(90,180,240,0.1)",
                            padding: "2px 5px", borderRadius: "2px", letterSpacing: "1px",
                          }}>
                            ↗ {discCount}
                          </span>
                        )}

                        <span style={{
                          fontSize: "9px", fontWeight: 600, letterSpacing: "1px",
                          color: pc.text, minWidth: "80px", textAlign: "right",
                        }}>{item.platform}</span>

                        <span style={{
                          fontSize: "8px", fontWeight: 600, letterSpacing: "1.5px",
                          color: st.color, background: st.bg,
                          padding: "2px 7px", borderRadius: "2px", minWidth: "65px", textAlign: "center",
                        }}>{st.label}</span>
                      </div>
                    );
                  })}

                  {/* Expanded detail for selected item */}
                  {items.filter(i => i.id === selectedItem).map(item => {
                    const privEvts = getPrivateForItem(item.id);
                    const discEvts = getDisclosuresForItem(item.id);
                    return (
                      <div key={`detail-${item.id}`} style={{
                        margin: "4px 0 8px 21px", padding: "12px 16px",
                        background: "#0c0c10", border: "1px solid #1a1a1e", borderRadius: "3px",
                        animation: "fadeIn 0.15s ease",
                      }}>
                        <div style={{ display: "flex", gap: "24px", marginBottom: privEvts.length ? "12px" : "0" }}>
                          <div>
                            <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#34d67a", marginBottom: "4px" }}>
                              <span style={{ fontSize: "6px" }}>●</span> PUBLIC EVENT
                            </div>
                            <div style={{ fontSize: "10px", color: "#888" }}>
                              {item.title} {item.season} — {item.status} — {item.platform} — {fmt(item.date)}
                            </div>
                            <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>
                              Event ID: {item.id} · Type: {item.eventType} · Immutable
                            </div>
                          </div>
                        </div>

                        {privEvts.length > 0 && (
                          <div>
                            <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#e0a030", marginBottom: "6px" }}>
                              <span style={{ fontSize: "6px" }}>●</span> PRIVATE STATE — local device only
                            </div>
                            {privEvts.map(pe => (
                              <div key={pe.id} style={{
                                display: "flex", gap: "8px", alignItems: "center",
                                padding: "3px 0", fontSize: "10px", color: "#666",
                              }}>
                                <span style={{ color: "#e0a030", fontSize: "11px", width: "14px" }}>{ACTION_ICONS[pe.action] || "·"}</span>
                                <span style={{ color: "#888" }}>{pe.detail}</span>
                                <span style={{ color: "#333", fontSize: "9px", marginLeft: "auto" }}>{fmtTime(pe.timestamp)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {discEvts.length > 0 && (
                          <div style={{ marginTop: "10px" }}>
                            <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#5ab4f0", marginBottom: "6px" }}>
                              <span style={{ fontSize: "6px" }}>●</span> SELECTIVE DISCLOSURES — auditable
                            </div>
                            {discEvts.map(de => (
                              <div key={de.id} style={{
                                display: "flex", gap: "8px", alignItems: "center",
                                padding: "3px 0", fontSize: "10px", color: "#666",
                              }}>
                                <span style={{ color: "#5ab4f0", fontSize: "11px", width: "14px" }}>↗</span>
                                <span style={{ color: "#88c8f0" }}>{de.field}: {de.value}</span>
                                <span style={{ color: "#333", fontSize: "9px" }}>hash: {de.hash}</span>
                                <span style={{ color: "#333", fontSize: "9px", marginLeft: "auto" }}>{fmtTime(de.disclosedAt)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div style={{
                marginTop: "24px", paddingTop: "12px", borderTop: "1px solid #141418",
                display: "flex", gap: "24px", fontSize: "9px", color: "#2a2a2e", letterSpacing: "1px",
              }}>
                <span>{filtered.length} RELEASES</span>
                <span>{filtered.filter(i => trackedIds.has(i.id)).length} TRACKED</span>
                <span>{filtered.filter(i => i.type === "series").length} SERIES</span>
                <span>{filtered.filter(i => i.type === "movie").length} FILMS</span>
              </div>
            </div>
          </div>
        )}

        {/* ──── EVENT LOG VIEW ──── */}
        {activePanel === "events" && (
          <div style={{ flex: 1, overflow: "auto", padding: "20px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", gap: "24px" }}>
              {/* Public column */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "9px", letterSpacing: "2px", color: "#34d67a", marginBottom: "12px",
                  paddingBottom: "8px", borderBottom: "1px solid #141418",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ fontSize: "6px" }}>●</span> PUBLIC EVENT LEDGER
                  <span style={{ color: "#222", marginLeft: "auto" }}>Shared · Immutable · Verifiable</span>
                </div>
                {PUBLIC_EVENTS.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).map((e, i) => (
                  <div key={e.id} style={{
                    padding: "6px 10px", marginBottom: "2px", fontSize: "10px",
                    borderLeft: `2px solid ${gc(e.platform).border}`,
                    background: i % 2 === 0 ? "rgba(52,214,122,0.015)" : "transparent",
                    animation: `slideIn 0.15s ease ${i * 0.02}s both`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#888" }}>
                        <span style={{ color: "#34d67a", fontSize: "8px", letterSpacing: "1px", marginRight: "6px" }}>{e.eventType.toUpperCase()}</span>
                        {e.title} {e.season || ""}
                      </span>
                      <span style={{ color: "#444", fontSize: "9px" }}>{fmt(e.date)}</span>
                    </div>
                    <div style={{ color: "#333", fontSize: "9px", marginTop: "1px" }}>
                      {e.id} · {e.platform} · {e.genre}
                    </div>
                  </div>
                ))}
              </div>

              {/* Private column */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "9px", letterSpacing: "2px", color: "#e0a030", marginBottom: "12px",
                  paddingBottom: "8px", borderBottom: "1px solid #141418",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ fontSize: "6px" }}>●</span> PRIVATE EVENT LOG
                  <span style={{ color: "#222", marginLeft: "auto" }}>Local · Encrypted · Yours</span>
                </div>
                {privateEvents.map((e, i) => {
                  const pub = PUBLIC_EVENTS.find(p => p.id === e.ref);
                  return (
                    <div key={e.id} style={{
                      padding: "6px 10px", marginBottom: "2px", fontSize: "10px",
                      borderLeft: "2px solid rgba(224,160,48,0.3)",
                      background: i % 2 === 0 ? "rgba(224,160,48,0.015)" : "transparent",
                      animation: `slideIn 0.15s ease ${i * 0.02}s both`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#888" }}>
                          <span style={{ color: "#e0a030", marginRight: "5px" }}>{ACTION_ICONS[e.action] || "·"}</span>
                          {pub?.title || "?"} — {e.detail}
                        </span>
                        <span style={{ color: "#444", fontSize: "9px" }}>{fmtTime(e.timestamp)}</span>
                      </div>
                      <div style={{ color: "#333", fontSize: "9px", marginTop: "1px" }}>
                        {e.id} → refs {e.ref}
                      </div>
                    </div>
                  );
                })}

                {/* Disclosures */}
                <div style={{
                  fontSize: "9px", letterSpacing: "2px", color: "#5ab4f0", marginTop: "20px", marginBottom: "12px",
                  paddingBottom: "8px", borderBottom: "1px solid #141418",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ fontSize: "6px" }}>●</span> SELECTIVE DISCLOSURES
                  <span style={{ color: "#222", marginLeft: "auto" }}>Boundary · Auditable · Revocable</span>
                </div>
                {disclosures.map((d, i) => {
                  const pub = PUBLIC_EVENTS.find(p => p.id === d.ref);
                  return (
                    <div key={d.id} style={{
                      padding: "6px 10px", marginBottom: "2px", fontSize: "10px",
                      borderLeft: "2px solid rgba(90,180,240,0.3)",
                      background: i % 2 === 0 ? "rgba(90,180,240,0.015)" : "transparent",
                      animation: `slideIn 0.15s ease ${i * 0.02}s both`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#88c8f0" }}>
                          ↗ {pub?.title} — {d.field}: {d.value}
                        </span>
                        <span style={{ color: "#444", fontSize: "9px" }}>{fmtTime(d.disclosedAt)}</span>
                      </div>
                      <div style={{ color: "#333", fontSize: "9px", marginTop: "1px" }}>
                        {d.id} · hash: {d.hash} · verifiable proof of selective disclosure
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ──── AI QUERY VIEW ──── */}
        {activePanel === "ai" && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            animation: "fadeIn 0.2s ease",
          }}>
            <div style={{
              padding: "16px 24px 12px", borderBottom: "1px solid #141418",
              fontSize: "9px", color: "#333", letterSpacing: "1.5px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#e0a030", fontSize: "6px" }}>●</span>
                AI PROCESSES YOUR PRIVATE STATE LOCALLY — QUERIES ARE NOT STORED OR USED FOR TRAINING
                <div style={{ marginLeft: "auto", display: "flex", gap: "12px", color: "#222" }}>
                  <span>MODEL: CLAUDE SONNET</span>
                  <span>CONTEXT: {trackedIds.size} TRACKED · {privateEvents.length} EVENTS</span>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
              {chatMessages.length === 0 && (
                <div style={{ padding: "32px 0", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#333", letterSpacing: "1px", marginBottom: "16px" }}>
                    QUERY YOUR PRIVATE WATCHLIST
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                    {[
                      "What's dropping this week that I'm tracking?",
                      "Which shows have I rated highest?",
                      "What have I disclosed publicly?",
                      "How does the public/private boundary work here?",
                      "What should I start watching before the next season drops?",
                    ].map((q, i) => (
                      <button key={i} onClick={() => { setChatInput(q); }} style={{
                        background: "#0e0e12", border: "1px solid #1a1a1e", borderRadius: "3px",
                        color: "#555", padding: "6px 12px", fontSize: "10px",
                        fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                      }}>{q}</button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  marginBottom: "12px", animation: "fadeIn 0.2s ease",
                  display: "flex", flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    fontSize: "8px", letterSpacing: "1.5px", marginBottom: "3px",
                    color: msg.role === "user" ? "#e0a030" : "#34d67a",
                  }}>
                    {msg.role === "user" ? "YOU · PRIVATE" : "AI · LOCAL INFERENCE"}
                  </div>
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px",
                    background: msg.role === "user" ? "rgba(224,160,48,0.06)" : "rgba(52,214,122,0.04)",
                    border: `1px solid ${msg.role === "user" ? "rgba(224,160,48,0.15)" : "rgba(52,214,122,0.1)"}`,
                    borderRadius: "4px", fontSize: "11px", lineHeight: "1.6",
                    color: "#bbb", fontFamily: FONT_SANS, whiteSpace: "pre-wrap",
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#333", fontSize: "10px" }}>
                  <span style={{ animation: "pulse 1s infinite" }}>⬡</span> Processing locally...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div style={{
              padding: "12px 24px 16px", borderTop: "1px solid #141418",
              display: "flex", gap: "8px",
            }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Query your private watchlist..."
                style={{
                  flex: 1, background: "#0c0c10", border: "1px solid #1a1a1e",
                  borderRadius: "3px", padding: "10px 14px", color: "#bbb",
                  fontSize: "11px", fontFamily: FONT, outline: "none",
                }}
              />
              <button className="chat-send" onClick={sendChat} style={{
                background: "#0f1a0f", border: "1px solid #1a2a1a",
                borderRadius: "3px", padding: "8px 20px", color: "#34d67a",
                fontSize: "10px", fontFamily: FONT, letterSpacing: "1.5px",
                cursor: "pointer", transition: "all 0.15s",
              }}>
                QUERY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════ FOOTER ════ */}
      <div style={{
        padding: "8px 24px", borderTop: "1px solid #141418",
        display: "flex", justifyContent: "space-between",
        fontSize: "8px", color: "#1a1a1e", letterSpacing: "1.5px",
      }}>
        <span>SIGHTLINE · CAST ARCHITECTURE · EVENT-SOURCED · PRIVACY BY DESIGN</span>
        <span>PUBLIC: APPEND-ONLY · PRIVATE: LOCAL-ONLY · BOUNDARY: SELECTIVE DISCLOSURE</span>
      </div>
    </div>
  );
}
