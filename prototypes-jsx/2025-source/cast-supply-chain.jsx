import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CAST SUPPLY CHAIN DEMO
// DTC Brand sourcing internationally with 5 trading partners
// Shows: shared event stream, per-party private journals, selective disclosure
// ═══════════════════════════════════════════════════════════════════════════

const FONT = "'IBM Plex Mono', 'Fira Code', monospace";
const FONT_SANS = "'IBM Plex Sans', 'Helvetica Neue', sans-serif";

// ── PARTIES ──────────────────────────────────────────────────────────────
const PARTIES = {
  brand:    { name: "Meridian Home Co.", role: "DTC Brand", color: "#e0a030", short: "BRAND" },
  mfg:      { name: "Shenzhen Lumen MFG", role: "Manufacturer", color: "#34d67a", short: "MFG" },
  freight:  { name: "Pacific Route Logistics", role: "Freight Forwarder", color: "#00c8ff", short: "FREIGHT" },
  customs:  { name: "US Entry Solutions", role: "Customs Broker", color: "#b48eed", short: "CUSTOMS" },
  threepl:  { name: "FulfillFirst 3PL", role: "3PL Warehouse", color: "#f07a5a", short: "3PL" },
};

const PARTY_KEYS = Object.keys(PARTIES);

// ── SHARED EVENT STREAM (public, immutable, multi-party anchors) ─────────
const EVENTS = [
  {
    id: "EVT-001", date: "2026-01-06", type: "PO_ISSUED",
    label: "Purchase Order Issued",
    detail: "PO #MHC-2026-0142 — 10,000 units ceramic table lamp SKU-CTL-440 — FOB Shenzhen — $8.50/unit — Net 30 from shipment",
    parties: ["brand", "mfg"],
    amounts: { poTotal: 85000, units: 10000, unitCost: 8.50 },
  },
  {
    id: "EVT-002", date: "2026-01-08", type: "PO_CONFIRMED",
    label: "Manufacturer Confirms Order",
    detail: "Shenzhen Lumen confirms PO #MHC-2026-0142 — production start Jan 13 — est. completion Feb 7",
    parties: ["brand", "mfg"],
    amounts: {},
  },
  {
    id: "EVT-003", date: "2026-02-07", type: "PRODUCTION_COMPLETE",
    label: "Production Complete — QC Passed",
    detail: "10,000 units produced — QC inspection passed 9,850 units — 150 units rejected (cosmetic defects) — packing list issued",
    parties: ["brand", "mfg"],
    amounts: { unitsShipped: 9850, unitsRejected: 150 },
  },
  {
    id: "EVT-004", date: "2026-02-10", type: "FREIGHT_BOOKED",
    label: "Freight Booking Confirmed",
    detail: "20ft container MSKU-4827531 — Vessel: Ever Forward — Shenzhen → Port of Los Angeles — ETD Feb 14 — ETA Mar 8",
    parties: ["brand", "mfg", "freight"],
    amounts: { freightCharge: 3200 },
  },
  {
    id: "EVT-005", date: "2026-02-12", type: "INVOICE_ISSUED",
    label: "Manufacturer Invoice Issued",
    detail: "Invoice #SL-26-0891 — 9,850 units × $8.50 = $83,725 — Terms: Net 30 from B/L date",
    parties: ["brand", "mfg"],
    amounts: { invoiceTotal: 83725, units: 9850 },
  },
  {
    id: "EVT-006", date: "2026-02-14", type: "BOL_ISSUED",
    label: "Bill of Lading Issued — Vessel Departed",
    detail: "B/L #EGLV-SZX-0294817 — On board date Feb 14 — Shipper: Shenzhen Lumen — Consignee: Meridian Home Co.",
    parties: ["brand", "mfg", "freight"],
    amounts: {},
  },
  {
    id: "EVT-007", date: "2026-03-08", type: "VESSEL_ARRIVED",
    label: "Vessel Arrived — Port of Los Angeles",
    detail: "Container MSKU-4827531 discharged — pending customs clearance",
    parties: ["brand", "freight", "customs"],
    amounts: {},
  },
  {
    id: "EVT-008", date: "2026-03-09", type: "CUSTOMS_ENTRY",
    label: "Customs Entry Filed",
    detail: "Entry #2026-0309-44217 — HTS 9405.40.8440 — Declared value: $83,725 — Duty rate: 3.9%",
    parties: ["brand", "customs"],
    amounts: { declaredValue: 83725, dutyRate: 0.039, dutyAmount: 3265.28, mPF: 418.63 },
  },
  {
    id: "EVT-009", date: "2026-03-10", type: "CUSTOMS_CLEARED",
    label: "Customs Cleared — Released for Delivery",
    detail: "Entry liquidated — Total duties & fees: $3,683.91 — Container released",
    parties: ["brand", "freight", "customs"],
    amounts: { totalDutyFees: 3683.91 },
  },
  {
    id: "EVT-010", date: "2026-03-12", type: "DELIVERED_3PL",
    label: "Container Delivered to 3PL",
    detail: "Container MSKU-4827531 delivered to FulfillFirst — Riverside, CA facility",
    parties: ["brand", "freight", "threepl"],
    amounts: { drayageCharge: 850 },
  },
  {
    id: "EVT-011", date: "2026-03-12", type: "RECEIVED_3PL",
    label: "Goods Received — Count Verified",
    detail: "Received count: 9,820 units (30 units damaged in transit) — 9,820 units put away to locations B7-R3 through B7-R8",
    parties: ["brand", "threepl"],
    amounts: { unitsReceived: 9820, unitsDamaged: 30 },
  },
  {
    id: "EVT-012", date: "2026-03-14", type: "FREIGHT_INVOICE",
    label: "Freight Forwarder Invoice",
    detail: "Invoice #PRL-26-3341 — Ocean freight: $3,200 + Drayage: $850 + Documentation: $150 = $4,200",
    parties: ["brand", "freight"],
    amounts: { freightTotal: 4200, ocean: 3200, drayage: 850, docFee: 150 },
  },
  {
    id: "EVT-013", date: "2026-03-14", type: "CUSTOMS_INVOICE",
    label: "Customs Broker Invoice",
    detail: "Invoice #USE-26-0712 — Brokerage fee: $185 + ISF filing: $65 + Duty disbursement: $3,683.91 = $3,933.91",
    parties: ["brand", "customs"],
    amounts: { brokerageTotal: 3933.91, brokerFee: 185, isfFee: 65, dutyPass: 3683.91 },
  },
  {
    id: "EVT-014", date: "2026-03-15", type: "MFG_PAYMENT",
    label: "Manufacturer Payment — Wire Sent",
    detail: "Wire transfer $83,725 — Ref: MHC-WR-20260315-01 — Paid against Invoice #SL-26-0891",
    parties: ["brand", "mfg"],
    amounts: { paymentAmount: 83725 },
  },
  {
    id: "EVT-015", date: "2026-03-16", type: "INVENTORY_LIVE",
    label: "Inventory Available for Sale",
    detail: "9,820 units SKU-CTL-440 now active in OMS — landed cost calculated — retail price: $44.00",
    parties: ["brand", "threepl"],
    amounts: { unitsAvailable: 9820, retailPrice: 44.00 },
  },
];

// ── PRIVATE JOURNAL ENTRIES (per-party, never shared) ────────────────────
// Each party books the SAME shared events differently
const JOURNALS = {
  brand: [
    { ref: "EVT-001", entries: [
      { dr: "Inventory – On Order", cr: "Purchase Commitments", amount: 85000, memo: "PO commitment at $8.50 × 10,000" },
    ]},
    { ref: "EVT-003", entries: [
      { dr: "Inventory – On Order", cr: "Inventory – On Order", amount: -1275, memo: "Adjust for 150 rejected units ($8.50 × 150)" },
    ]},
    { ref: "EVT-005", entries: [
      { dr: "Inventory – In Transit", cr: "Accounts Payable – Shenzhen Lumen", amount: 83725, memo: "Reclassify to in-transit; AP recognized on invoice" },
      { dr: "Purchase Commitments", cr: "Inventory – On Order", amount: 83725, memo: "Release PO commitment" },
    ]},
    { ref: "EVT-008", entries: [
      { dr: "Inventory – In Transit (Duty)", cr: "Accrued Duties Payable", amount: 3265.28, memo: "Duty accrual at 3.9% of declared value" },
      { dr: "Inventory – In Transit (MPF)", cr: "Accrued Duties Payable", amount: 418.63, memo: "Merchandise Processing Fee accrual" },
    ]},
    { ref: "EVT-011", entries: [
      { dr: "Inventory – Finished Goods", cr: "Inventory – In Transit", amount: 83725, memo: "Reclassify 9,820 received units to FG" },
      { dr: "Inventory – In Transit (Duty)", cr: "Inventory – Finished Goods (Duty)", amount: 3683.91, memo: "Allocate duties to received inventory" },
      { dr: "Shipping Damage Loss", cr: "Inventory – In Transit", amount: 255, memo: "30 units damaged in transit ($8.50 × 30)" },
    ]},
    { ref: "EVT-012", entries: [
      { dr: "Inventory – FG (Freight Alloc)", cr: "Accounts Payable – Pacific Route", amount: 4200, memo: "Freight cost allocated to landed cost" },
    ]},
    { ref: "EVT-013", entries: [
      { dr: "Inventory – FG (Customs Alloc)", cr: "Accounts Payable – US Entry Solutions", amount: 250, memo: "Brokerage & ISF fees to landed cost" },
      { dr: "Accrued Duties Payable", cr: "Accounts Payable – US Entry Solutions", amount: 3683.91, memo: "Reclassify duty accrual to broker AP" },
    ]},
    { ref: "EVT-014", entries: [
      { dr: "Accounts Payable – Shenzhen Lumen", cr: "Cash – Operating", amount: 83725, memo: "Wire payment against Invoice #SL-26-0891" },
    ]},
    { ref: "EVT-015", entries: [
      { dr: null, cr: null, amount: null, memo: "PRIVATE ANALYSIS: Landed cost = $9.34/unit | Retail $44.00 | Gross margin 78.8% | Total inventory value: $91,738.91" },
    ]},
  ],
  mfg: [
    { ref: "EVT-001", entries: [
      { dr: "Production Pipeline", cr: "Deferred Revenue", amount: 85000, memo: "PO received — production commitment (RMB equiv. booked)" },
    ]},
    { ref: "EVT-003", entries: [
      { dr: "COGS – Materials", cr: "Raw Materials Inventory", amount: 38000, memo: "PRIVATE: Materials consumed — $3.86/unit × 9,850" },
      { dr: "COGS – Labor", cr: "Wages Payable", amount: 14775, memo: "PRIVATE: Assembly labor — $1.50/unit × 9,850" },
      { dr: "Scrap/Rework", cr: "WIP Inventory", amount: 804, memo: "150 rejected units — materials cost written off" },
    ]},
    { ref: "EVT-005", entries: [
      { dr: "Accounts Receivable – Meridian", cr: "Revenue", amount: 83725, memo: "Invoice issued — 9,850 × $8.50 FOB" },
      { dr: "Deferred Revenue", cr: "Production Pipeline", amount: 83725, memo: "Release deferred revenue" },
    ]},
    { ref: "EVT-014", entries: [
      { dr: "Cash – USD Account", cr: "Accounts Receivable – Meridian", amount: 83725, memo: "Wire received — settlement complete" },
    ]},
  ],
  freight: [
    { ref: "EVT-004", entries: [
      { dr: "Carrier Payable – Evergreen", cr: "Accrued Freight Cost", amount: 2400, memo: "PRIVATE: Contracted carrier rate — $2,400 (margin: $800)" },
    ]},
    { ref: "EVT-006", entries: [
      { dr: "Unbilled Revenue", cr: "Revenue – Ocean Freight", amount: 3200, memo: "Ocean freight revenue recognized on sailing" },
    ]},
    { ref: "EVT-010", entries: [
      { dr: "Unbilled Revenue", cr: "Revenue – Drayage", amount: 850, memo: "Drayage revenue recognized on delivery" },
      { dr: "Drayage Cost", cr: "Accrued – Drayage Carrier", amount: 625, memo: "PRIVATE: Drayage carrier cost (margin: $225)" },
    ]},
    { ref: "EVT-012", entries: [
      { dr: "Accounts Receivable – Meridian", cr: "Unbilled Revenue", amount: 4200, memo: "Invoice issued — ocean + drayage + doc fee" },
      { dr: "Unbilled Revenue", cr: "Revenue – Doc Fees", amount: 150, memo: "Documentation fee revenue" },
    ]},
  ],
  customs: [
    { ref: "EVT-008", entries: [
      { dr: "Duty Disbursement Receivable", cr: "Cash – Trust Account", amount: 3683.91, memo: "Duty & MPF paid to CBP on client's behalf" },
    ]},
    { ref: "EVT-009", entries: [
      { dr: "Unbilled Revenue", cr: "Revenue – Brokerage", amount: 185, memo: "Entry processing fee earned" },
      { dr: "Unbilled Revenue", cr: "Revenue – ISF Filing", amount: 65, memo: "ISF filing fee earned" },
    ]},
    { ref: "EVT-013", entries: [
      { dr: "Accounts Receivable – Meridian", cr: "Unbilled Revenue", amount: 250, memo: "Brokerage & ISF fees invoiced" },
      { dr: "Accounts Receivable – Meridian", cr: "Duty Disbursement Receivable", amount: 3683.91, memo: "Pass-through duty disbursement invoiced" },
    ]},
  ],
  threepl: [
    { ref: "EVT-011", entries: [
      { dr: "Unbilled Revenue", cr: "Revenue – Receiving", amount: 1473, memo: "Receiving fee: 9,820 units × $0.15/unit" },
      { dr: "Unbilled Revenue", cr: "Revenue – Putaway", amount: 982, memo: "Putaway fee: 9,820 units × $0.10/unit" },
      { dr: "Labor Cost – Receiving", cr: "Wages Payable", amount: 840, memo: "PRIVATE: 6 labor-hours @ $140/hr loaded" },
    ]},
    { ref: "EVT-015", entries: [
      { dr: "Unbilled Revenue", cr: "Deferred Revenue – Storage", amount: 1200, memo: "Monthly storage: 6 pallet positions × $200/mo (starts billing)" },
    ]},
  ],
};

// ── SELECTIVE DISCLOSURES ────────────────────────────────────────────────
const DISCLOSURES = [
  { from: "brand", to: "mfg", ref: "EVT-011", field: "Received count", value: "9,820 units (30 damaged in transit)", hash: "c4f8a2...", note: "Disclosed to support shortage claim" },
  { from: "brand", to: "freight", ref: "EVT-011", field: "Damage count", value: "30 units", hash: "e7d1b3...", note: "Disclosed to file freight claim" },
  { from: "mfg", to: "brand", ref: "EVT-003", field: "QC report", value: "9,850 passed / 150 rejected", hash: "a1e9c7...", note: "Disclosed at production complete" },
  { from: "freight", to: "brand", ref: "EVT-004", field: "Vessel & ETA", value: "Ever Forward — ETA Mar 8", hash: "b3f2d8...", note: "Tracking info shared" },
  { from: "customs", to: "brand", ref: "EVT-008", field: "Duty assessment", value: "$3,265.28 duty + $418.63 MPF", hash: "d9a4e1...", note: "Entry details disclosed" },
];

// ── NOT DISCLOSED (what each party keeps private) ────────────────────────
const PRIVATE_KEPT = {
  brand: ["Retail price ($44.00)", "Gross margin (78.8%)", "Open-to-buy budget impact", "Cash flow forecast effect"],
  mfg: ["Bill of materials cost ($3.86/unit)", "Labor cost ($1.50/unit)", "Production margin (36.9%)", "RMB/USD hedge position"],
  freight: ["Carrier contracted rate ($2,400 vs $3,200 charged)", "Drayage carrier cost ($625 vs $850)", "Blended margin (24.4%)"],
  customs: ["Trust account balance", "Other client entries in process", "Volume-based CBP relationship"],
  threepl: ["Warehouse utilization rate", "Labor cost per unit ($0.086 vs $0.15 charged)", "Effective margin on storage"],
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function SupplyChainCAST() {
  const [activeView, setActiveView] = useState("timeline");   // timeline | journals | matrix | disclosures
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedParty, setSelectedParty] = useState("brand");
  const [expandedEvt, setExpandedEvt] = useState(null);

  // Landed cost calc
  const landed = useMemo(() => {
    const product = 83725;
    const freight = 4200;
    const customs = 250;
    const duty = 3683.91;
    const damageLoss = 255;
    const total = product + freight + customs + duty - damageLoss;
    const units = 9820;
    return { total, units, perUnit: (total / units).toFixed(2), margin: ((1 - (total / units) / 44) * 100).toFixed(1) };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#07070a", color: "#c8c8c8",
      fontFamily: FONT, fontSize: "11px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: #1a1a1e transparent; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1a1a1e; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideR { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .evt-row:hover { background: rgba(255,255,255,0.015) !important; }
        .party-tab:hover { background: #111114 !important; }
        .view-btn:hover { background: #111114 !important; }
      `}</style>

      {/* ════ HEADER ════ */}
      <div style={{ padding: "14px 22px 10px", borderBottom: "1px solid #111114", background: "linear-gradient(180deg, #0a0a0e 0%, #07070a 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "1px", background: "#34d67a", boxShadow: "0 0 8px rgba(52,214,122,0.4)" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "3px", color: "#4a4a50" }}>SIGHTLINE</span>
              <span style={{ fontSize: "9px", color: "#28282e", letterSpacing: "1.5px", marginLeft: "4px" }}>SUPPLY CHAIN · CAST ARCHITECTURE</span>
            </div>
            <div style={{ marginLeft: "14px", marginTop: "3px", fontSize: "9px", color: "#222", letterSpacing: "1px" }}>
              PO #MHC-2026-0142 · Meridian Home Co. ← Shenzhen Lumen MFG · 10,000 units ceramic table lamp
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "9px", color: "#28282e", letterSpacing: "1px" }}>
            <div>5 PARTIES · {EVENTS.length} SHARED EVENTS · {DISCLOSURES.length} DISCLOSURES</div>
            <div style={{ color: "#1a1a1e" }}>LANDED: ${landed.perUnit}/unit · {landed.margin}% MARGIN · {landed.units} UNITS</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: "2px", marginTop: "10px" }}>
          {[
            { key: "timeline", label: "TIMELINE", icon: "▦" },
            { key: "journals", label: "PARTY JOURNALS", icon: "◈" },
            { key: "matrix", label: "EVENT × PARTY MATRIX", icon: "⊞" },
            { key: "disclosures", label: "BOUNDARY & DISCLOSURE", icon: "↗" },
          ].map(v => (
            <button key={v.key} className="view-btn" onClick={() => setActiveView(v.key)} style={{
              background: activeView === v.key ? "#111114" : "transparent",
              border: "1px solid " + (activeView === v.key ? "#1a1a1e" : "transparent"),
              color: activeView === v.key ? "#c8c8c8" : "#3a3a40",
              padding: "5px 12px", borderRadius: "3px", fontSize: "9px",
              fontFamily: FONT, letterSpacing: "1.5px", cursor: "pointer", transition: "all 0.15s",
            }}>
              <span style={{ marginRight: "4px" }}>{v.icon}</span>{v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════ ARCHITECTURE BAR ════ */}
      <div style={{ display: "flex", borderBottom: "1px solid #111114", fontSize: "8px", letterSpacing: "1.5px", color: "#28282e" }}>
        {PARTY_KEYS.map(k => (
          <div key={k} style={{ flex: 1, padding: "5px 12px", borderRight: "1px solid #0e0e12", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ color: PARTIES[k].color, fontSize: "6px" }}>●</span>
            <span style={{ color: PARTIES[k].color, opacity: 0.7 }}>{PARTIES[k].short}</span>
            <span style={{ color: "#1a1a1e" }}>{PARTIES[k].name}</span>
          </div>
        ))}
      </div>

      {/* ════ CONTENT ════ */}
      <div style={{ overflow: "auto", height: "calc(100vh - 120px)" }}>

        {/* ──── TIMELINE VIEW ──── */}
        {activeView === "timeline" && (
          <div style={{ padding: "16px 22px", animation: "fadeIn 0.2s ease" }}>
            {EVENTS.map((evt, i) => (
              <div key={evt.id} style={{ marginBottom: "3px", animation: `slideR 0.15s ease ${i * 0.03}s both` }}>
                <div className="evt-row" onClick={() => setExpandedEvt(expandedEvt === evt.id ? null : evt.id)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 12px",
                    background: expandedEvt === evt.id ? "rgba(52,214,122,0.03)" : "transparent",
                    borderLeft: "3px solid #1a1a1e", borderRadius: "2px", cursor: "pointer", transition: "all 0.15s",
                  }}>
                  <span style={{ color: "#333", fontSize: "9px", minWidth: "56px", flexShrink: 0, marginTop: "1px" }}>{new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span style={{ color: "#34d67a", fontSize: "8px", letterSpacing: "1px", minWidth: "44px", marginTop: "2px" }}>{evt.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#bbb", fontSize: "11px", fontWeight: 500 }}>{evt.label}</div>
                    <div style={{ color: "#444", fontSize: "10px", marginTop: "2px", fontFamily: FONT_SANS }}>{evt.detail}</div>
                  </div>
                  <div style={{ display: "flex", gap: "3px", flexShrink: 0, marginTop: "2px" }}>
                    {evt.parties.map(p => (
                      <span key={p} style={{
                        fontSize: "7px", letterSpacing: "1px", color: PARTIES[p].color,
                        background: `${PARTIES[p].color}11`, padding: "2px 5px", borderRadius: "2px",
                      }}>{PARTIES[p].short}</span>
                    ))}
                  </div>
                </div>

                {/* Expanded: show all party journals for this event */}
                {expandedEvt === evt.id && (
                  <div style={{
                    margin: "2px 0 8px 69px", padding: "12px 16px",
                    background: "#0a0a0e", border: "1px solid #141418", borderRadius: "3px",
                    animation: "fadeIn 0.15s ease",
                  }}>
                    {PARTY_KEYS.filter(pk => {
                      const pj = JOURNALS[pk];
                      return pj && pj.find(j => j.ref === evt.id);
                    }).map(pk => {
                      const pj = JOURNALS[pk].find(j => j.ref === evt.id);
                      const party = PARTIES[pk];
                      return (
                        <div key={pk} style={{ marginBottom: "10px" }}>
                          <div style={{ fontSize: "8px", letterSpacing: "2px", color: party.color, marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ fontSize: "5px" }}>●</span> {party.short} — PRIVATE JOURNAL
                          </div>
                          {pj.entries.map((e, ei) => (
                            <div key={ei} style={{
                              display: "flex", gap: "8px", padding: "3px 0 3px 12px",
                              fontSize: "10px", borderLeft: `2px solid ${party.color}22`,
                            }}>
                              {e.dr ? (
                                <>
                                  <span style={{ color: "#666", minWidth: "200px" }}>
                                    <span style={{ color: "#888", fontSize: "8px", marginRight: "4px" }}>DR</span> {e.dr}
                                  </span>
                                  <span style={{ color: "#666", minWidth: "200px" }}>
                                    <span style={{ color: "#888", fontSize: "8px", marginRight: "4px" }}>CR</span> {e.cr}
                                  </span>
                                  <span style={{ color: party.color, minWidth: "80px", textAlign: "right", fontWeight: 500 }}>
                                    {e.amount < 0 ? `(${Math.abs(e.amount).toLocaleString()})` : `$${e.amount.toLocaleString()}`}
                                  </span>
                                </>
                              ) : (
                                <span style={{ color: "#555", fontStyle: "italic" }}>{e.memo}</span>
                              )}
                              {e.dr && <span style={{ color: "#333", fontSize: "9px", flex: 1, marginLeft: "8px" }}>{e.memo}</span>}
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Disclosures for this event */}
                    {DISCLOSURES.filter(d => d.ref === evt.id).length > 0 && (
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #141418" }}>
                        <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#5ab4f0", marginBottom: "4px" }}>
                          <span style={{ fontSize: "5px" }}>●</span> SELECTIVE DISCLOSURES AT THIS EVENT
                        </div>
                        {DISCLOSURES.filter(d => d.ref === evt.id).map((d, di) => (
                          <div key={di} style={{ fontSize: "10px", padding: "2px 0 2px 12px", borderLeft: "2px solid rgba(90,180,240,0.2)", color: "#666" }}>
                            <span style={{ color: PARTIES[d.from].color }}>{PARTIES[d.from].short}</span>
                            <span style={{ color: "#333" }}> → </span>
                            <span style={{ color: PARTIES[d.to].color }}>{PARTIES[d.to].short}</span>
                            <span style={{ marginLeft: "8px", color: "#88c8f0" }}>{d.field}: {d.value}</span>
                            <span style={{ marginLeft: "8px", color: "#28282e", fontSize: "9px" }}>hash: {d.hash}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ──── PARTY JOURNALS VIEW ──── */}
        {activeView === "journals" && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            {/* Party tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #111114" }}>
              {PARTY_KEYS.map(k => (
                <button key={k} className="party-tab" onClick={() => setSelectedParty(k)} style={{
                  flex: 1, padding: "8px 12px", background: selectedParty === k ? "#0e0e12" : "transparent",
                  border: "none", borderBottom: selectedParty === k ? `2px solid ${PARTIES[k].color}` : "2px solid transparent",
                  color: selectedParty === k ? PARTIES[k].color : "#333",
                  fontSize: "9px", fontFamily: FONT, letterSpacing: "1.5px", cursor: "pointer", transition: "all 0.15s",
                }}>
                  {PARTIES[k].short}
                  <div style={{ fontSize: "8px", color: "#222", marginTop: "1px", fontWeight: 400 }}>{PARTIES[k].name}</div>
                </button>
              ))}
            </div>

            <div style={{ padding: "16px 22px" }}>
              {/* Party header */}
              <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #111114" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: PARTIES[selectedParty].color, fontFamily: FONT_SANS }}>
                  {PARTIES[selectedParty].name}
                </div>
                <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>{PARTIES[selectedParty].role} — Private Ledger View</div>
                <div style={{ fontSize: "9px", color: "#28282e", marginTop: "6px", display: "flex", gap: "16px" }}>
                  <span>JOURNAL ENTRIES: {JOURNALS[selectedParty]?.reduce((a, j) => a + j.entries.length, 0) || 0}</span>
                  <span>EVENTS VISIBLE: {EVENTS.filter(e => e.parties.includes(selectedParty)).length} of {EVENTS.length}</span>
                  <span>KEPT PRIVATE: {PRIVATE_KEPT[selectedParty]?.length || 0} items</span>
                </div>
              </div>

              {/* What this party CANNOT see */}
              <div style={{
                marginBottom: "16px", padding: "10px 14px", background: "#0c0408",
                border: "1px solid #1a1014", borderRadius: "3px",
              }}>
                <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#f05a5a", marginBottom: "6px" }}>
                  ⊘ EVENTS NOT VISIBLE TO {PARTIES[selectedParty].short}
                </div>
                {EVENTS.filter(e => !e.parties.includes(selectedParty)).map(e => (
                  <div key={e.id} style={{ fontSize: "10px", color: "#443030", padding: "2px 0" }}>
                    <span style={{ color: "#553030", fontSize: "9px", marginRight: "6px" }}>{e.id}</span>
                    {e.label} — <span style={{ fontStyle: "italic" }}>not a party to this event</span>
                  </div>
                ))}
              </div>

              {/* Journal entries */}
              {(JOURNALS[selectedParty] || []).map((jGroup, gi) => {
                const evt = EVENTS.find(e => e.id === jGroup.ref);
                if (!evt) return null;
                return (
                  <div key={gi} style={{
                    marginBottom: "12px", animation: `slideR 0.15s ease ${gi * 0.04}s both`,
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px",
                      padding: "4px 0", borderBottom: "1px solid #0e0e12",
                    }}>
                      <span style={{ fontSize: "9px", color: "#34d67a", letterSpacing: "1px" }}>{evt.id}</span>
                      <span style={{ fontSize: "9px", color: "#444" }}>{new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span style={{ fontSize: "10px", color: "#888" }}>{evt.label}</span>
                    </div>

                    {/* Table header */}
                    <div style={{
                      display: "flex", gap: "8px", padding: "2px 12px",
                      fontSize: "8px", letterSpacing: "1.5px", color: "#28282e",
                    }}>
                      <span style={{ minWidth: "220px" }}>DEBIT</span>
                      <span style={{ minWidth: "220px" }}>CREDIT</span>
                      <span style={{ minWidth: "80px", textAlign: "right" }}>AMOUNT</span>
                      <span style={{ flex: 1, marginLeft: "8px" }}>MEMO</span>
                    </div>

                    {jGroup.entries.map((e, ei) => (
                      <div key={ei} style={{
                        display: "flex", gap: "8px", padding: "4px 12px",
                        borderLeft: `2px solid ${PARTIES[selectedParty].color}22`,
                        background: ei % 2 === 0 ? `${PARTIES[selectedParty].color}04` : "transparent",
                        fontSize: "10px",
                      }}>
                        {e.dr ? (
                          <>
                            <span style={{ color: "#888", minWidth: "220px" }}>{e.dr}</span>
                            <span style={{ color: "#888", minWidth: "220px" }}>{e.cr}</span>
                            <span style={{
                              color: e.amount < 0 ? "#f05a5a" : PARTIES[selectedParty].color,
                              minWidth: "80px", textAlign: "right", fontWeight: 500,
                            }}>
                              {e.amount < 0 ? `(${Math.abs(e.amount).toLocaleString()})` : `$${e.amount.toLocaleString()}`}
                            </span>
                            <span style={{ color: "#3a3a40", flex: 1, marginLeft: "8px", fontSize: "9px" }}>{e.memo}</span>
                          </>
                        ) : (
                          <span style={{ color: PARTIES[selectedParty].color, fontStyle: "italic", opacity: 0.6 }}>{e.memo}</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* What this party keeps private */}
              <div style={{
                marginTop: "20px", padding: "10px 14px",
                background: `${PARTIES[selectedParty].color}06`,
                border: `1px solid ${PARTIES[selectedParty].color}15`,
                borderRadius: "3px",
              }}>
                <div style={{ fontSize: "8px", letterSpacing: "2px", color: PARTIES[selectedParty].color, marginBottom: "6px" }}>
                  ◈ PRIVATE — NEVER DISCLOSED BY {PARTIES[selectedParty].short}
                </div>
                {(PRIVATE_KEPT[selectedParty] || []).map((item, i) => (
                  <div key={i} style={{ fontSize: "10px", color: "#555", padding: "2px 0" }}>
                    <span style={{ color: PARTIES[selectedParty].color, opacity: 0.4, marginRight: "6px" }}>◈</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──── EVENT × PARTY MATRIX ──── */}
        {activeView === "matrix" && (
          <div style={{ padding: "16px 22px", animation: "fadeIn 0.2s ease", overflowX: "auto" }}>
            <div style={{ fontSize: "9px", color: "#333", letterSpacing: "1px", marginBottom: "12px" }}>
              Every row is a shared event. Each column shows what that party books privately. Same reality, different ledgers.
            </div>

            <div style={{ minWidth: "1000px" }}>
              {/* Header */}
              <div style={{
                display: "flex", borderBottom: "2px solid #1a1a1e", padding: "6px 0",
                position: "sticky", top: 0, background: "#07070a", zIndex: 2,
              }}>
                <div style={{ minWidth: "140px", fontSize: "8px", letterSpacing: "1.5px", color: "#34d67a", padding: "0 8px" }}>
                  SHARED EVENT
                </div>
                {PARTY_KEYS.map(k => (
                  <div key={k} style={{
                    flex: 1, fontSize: "8px", letterSpacing: "1.5px",
                    color: PARTIES[k].color, padding: "0 6px", textAlign: "center",
                  }}>
                    {PARTIES[k].short}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {EVENTS.map((evt, ri) => (
                <div key={evt.id} style={{
                  display: "flex", borderBottom: "1px solid #0e0e12",
                  animation: `slideR 0.15s ease ${ri * 0.025}s both`,
                  minHeight: "36px",
                }}>
                  {/* Event column */}
                  <div style={{
                    minWidth: "140px", padding: "6px 8px",
                    borderRight: "1px solid #111114",
                  }}>
                    <div style={{ fontSize: "8px", color: "#34d67a", letterSpacing: "1px" }}>{evt.id}</div>
                    <div style={{ fontSize: "9px", color: "#888", marginTop: "1px" }}>{evt.label}</div>
                    <div style={{ fontSize: "8px", color: "#333", marginTop: "1px" }}>
                      {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>

                  {/* Party columns */}
                  {PARTY_KEYS.map(pk => {
                    const isParty = evt.parties.includes(pk);
                    const pj = JOURNALS[pk]?.find(j => j.ref === evt.id);
                    return (
                      <div key={pk} style={{
                        flex: 1, padding: "4px 6px", borderRight: "1px solid #0c0c10",
                        background: isParty ? `${PARTIES[pk].color}04` : "#07070a",
                        opacity: isParty ? 1 : 0.3,
                      }}>
                        {!isParty ? (
                          <div style={{ fontSize: "8px", color: "#222", textAlign: "center", marginTop: "8px" }}>—</div>
                        ) : pj ? (
                          pj.entries.map((e, ei) => (
                            <div key={ei} style={{ fontSize: "8px", color: "#666", marginBottom: "2px", lineHeight: "1.4" }}>
                              {e.dr ? (
                                <>
                                  <span style={{ color: PARTIES[pk].color, opacity: 0.6 }}>
                                    {e.amount < 0 ? `(${Math.abs(e.amount).toLocaleString()})` : `$${e.amount.toLocaleString()}`}
                                  </span>
                                  <br />
                                  <span style={{ color: "#444", fontSize: "8px" }}>
                                    DR {e.dr.length > 20 ? e.dr.slice(0, 20) + "…" : e.dr}
                                  </span>
                                </>
                              ) : (
                                <span style={{ color: "#444", fontStyle: "italic", fontSize: "8px" }}>{e.memo.slice(0, 35)}…</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: "8px", color: "#333", textAlign: "center", marginTop: "8px" }}>visible, no JE</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── DISCLOSURES VIEW ──── */}
        {activeView === "disclosures" && (
          <div style={{ padding: "16px 22px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontSize: "10px", color: "#555", marginBottom: "16px", fontFamily: FONT_SANS, lineHeight: "1.6", maxWidth: "700px" }}>
              The boundary is where private state becomes selectively visible. Each disclosure is an explicit act — cryptographically hashed, timestamped, and auditable. The system cannot leak what was never shared.
            </div>

            {/* Disclosure flow */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#5ab4f0", marginBottom: "10px" }}>
                ↗ SELECTIVE DISCLOSURES — WHAT CROSSED THE BOUNDARY
              </div>
              {DISCLOSURES.map((d, i) => (
                <div key={i} style={{
                  padding: "10px 14px", marginBottom: "4px",
                  background: "rgba(90,180,240,0.03)", borderLeft: "3px solid rgba(90,180,240,0.2)",
                  borderRadius: "2px", animation: `slideR 0.15s ease ${i * 0.05}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{
                      fontSize: "9px", fontWeight: 600, color: PARTIES[d.from].color,
                      background: `${PARTIES[d.from].color}11`, padding: "2px 6px", borderRadius: "2px",
                    }}>{PARTIES[d.from].short}</span>
                    <span style={{ color: "#333", fontSize: "12px" }}>→</span>
                    <span style={{
                      fontSize: "9px", fontWeight: 600, color: PARTIES[d.to].color,
                      background: `${PARTIES[d.to].color}11`, padding: "2px 6px", borderRadius: "2px",
                    }}>{PARTIES[d.to].short}</span>
                    <span style={{ fontSize: "9px", color: "#34d67a", marginLeft: "8px" }}>{d.ref}</span>
                    <span style={{ fontSize: "9px", color: "#28282e", marginLeft: "auto" }}>hash: {d.hash}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#88c8f0", marginLeft: "4px" }}>
                    {d.field}: <span style={{ color: "#aadcff" }}>{d.value}</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#333", marginLeft: "4px", marginTop: "2px" }}>{d.note}</div>
                </div>
              ))}
            </div>

            {/* What each party keeps private */}
            <div>
              <div style={{ fontSize: "8px", letterSpacing: "2px", color: "#e0a030", marginBottom: "10px" }}>
                ◈ WHAT STAYS PRIVATE — STRUCTURALLY IMPOSSIBLE TO LEAK
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PARTY_KEYS.map(pk => (
                  <div key={pk} style={{
                    flex: "1 1 180px", padding: "10px 12px",
                    background: `${PARTIES[pk].color}06`, border: `1px solid ${PARTIES[pk].color}15`,
                    borderRadius: "3px",
                  }}>
                    <div style={{ fontSize: "9px", fontWeight: 600, color: PARTIES[pk].color, letterSpacing: "1px", marginBottom: "6px" }}>
                      {PARTIES[pk].short}
                    </div>
                    {(PRIVATE_KEPT[pk] || []).map((item, i) => (
                      <div key={i} style={{ fontSize: "9px", color: "#555", padding: "2px 0", lineHeight: "1.4" }}>
                        <span style={{ color: PARTIES[pk].color, opacity: 0.3, marginRight: "4px" }}>◈</span>{item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture summary */}
            <div style={{
              marginTop: "24px", padding: "14px 18px",
              background: "linear-gradient(135deg, rgba(52,214,122,0.04) 0%, rgba(90,180,240,0.04) 50%, rgba(224,160,48,0.04) 100%)",
              border: "1px solid #141418", borderRadius: "4px",
            }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#555", marginBottom: "8px" }}>
                CAST ARCHITECTURE — WHY THIS MATTERS
              </div>
              <div style={{ fontSize: "10px", color: "#777", fontFamily: FONT_SANS, lineHeight: "1.7" }}>
                <strong style={{ color: "#34d67a" }}>Without CAST:</strong> Five parties maintain five separate records of the same 15 events. The brand's AP team manually reconciles PO → invoice → receipt → payment across email, spreadsheets, and disconnected systems. Disputes over the 30 damaged units require weeks of back-and-forth. The manufacturer's margin, the freight forwarder's carrier rates, and the 3PL's labor costs are "private" only because the systems are siloed — not because privacy is architecturally enforced.
              </div>
              <div style={{ fontSize: "10px", color: "#777", fontFamily: FONT_SANS, lineHeight: "1.7", marginTop: "8px" }}>
                <strong style={{ color: "#5ab4f0" }}>With CAST:</strong> One shared event stream is the single source of truth. Each party derives their private journal entries from the same anchors. Reconciliation is eliminated — not optimized. The brand's margin analysis, the manufacturer's BOM cost, and the freight forwarder's carrier spread are structurally private — the system literally does not have this data to leak. Disclosure is explicit, granular, and cryptographically auditable.
              </div>
              <div style={{ fontSize: "10px", color: "#777", fontFamily: FONT_SANS, lineHeight: "1.7", marginTop: "8px" }}>
                <strong style={{ color: "#e0a030" }}>The result:</strong> Same shared reality. Five different private interpretations. Zero reconciliation. Privacy by architecture, not by policy.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════ FOOTER ════ */}
      <div style={{
        padding: "6px 22px", borderTop: "1px solid #111114",
        display: "flex", justifyContent: "space-between",
        fontSize: "7px", color: "#18181e", letterSpacing: "1.5px",
      }}>
        <span>SIGHTLINE · CAST · EVENT-SOURCED SUPPLY CHAIN COORDINATION</span>
        <span>PUBLIC: APPEND-ONLY · PRIVATE: LOCAL-ONLY · BOUNDARY: SELECTIVE DISCLOSURE WITH CRYPTOGRAPHIC PROOF</span>
      </div>
    </div>
  );
}
