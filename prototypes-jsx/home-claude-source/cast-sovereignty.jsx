import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════
// CAST — Shared Ledger for GPU Compute Financing
// WITH: Data Sovereignty, Access Control, Zero-Trust Architecture
//
// Core principle: The ledger belongs to the counterparties. 
// Sightline operates the protocol. It cannot read the data.
// View access is an explicit, revocable, auditable grant.
// ═══════════════════════════════════════════════════════════════════════

// --- Access Control Layer ---
// Every event carries a visibility manifest: who can decrypt it, why, and since when.
const ACCESS_GRANTS = {
  "axion": { name: "Axion Compute", role: "provider", keyFingerprint: "ax:9f:c2:41:b8", color: "#E8553A" },
  "helios": { name: "Helios AI Labs", role: "customer", keyFingerprint: "he:3d:a7:e5:12", color: "#2D7FF9" },
  "norwest": { name: "Norwest Capital", role: "financier", keyFingerprint: "nw:7b:f1:d8:63", color: "#18A86B" },
  "sightline": { name: "Sightline (Operator)", role: "managed_service", keyFingerprint: "sl:00:00:00:00", color: "#F5A623" },
};

const DEPLOYMENT_MODES = {
  SELF_HOSTED: { label: "Self-Hosted", desc: "You run everything. We provide the software.", icon: "◼", operatorAccess: false },
  MANAGED_ZERO: { label: "Managed · Zero Visibility", desc: "We operate infrastructure. We hold no keys. We see encrypted blobs.", icon: "◧", operatorAccess: false },
  MANAGED_VIEW: { label: "Managed · View Access", desc: "You grant us read access for analytics & advisory. Revocable anytime.", icon: "◨", operatorAccess: true },
};

// Events now carry: visibility (who can decrypt), encryption metadata
const EVENTS = [
  {
    id: "E001", ts: "2026-01-15T09:00:00Z", type: "CONTRACT_CREATED", party: "both",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", provider: "Axion Compute", customer: "Helios AI Labs", financier: "Norwest Capital Fund III", gpuType: "H100-SXM5", quantity: 256, ratePerGpuHr: 2.85, term: "90 days", minCommitment: 0.85, startDate: "2026-02-01" },
    hash: "a7c3f1", prevHash: "000000", signatures: ["axion.sig", "helios.sig", "norwest.sig"]
  },
  {
    id: "E002", ts: "2026-02-01T00:00:01Z", type: "CLUSTER_PROVISIONED", party: "provider",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", clusterId: "AX-NV-2261", gpusOnline: 256, healthCheck: "PASS", telemetryEndpoint: "wss://telemetry.axion.io/2261" },
    hash: "b8d4e2", prevHash: "a7c3f1", signatures: ["axion.sig", "cluster.auto.sig"]
  },
  {
    id: "E003", ts: "2026-02-01T00:05:00Z", type: "PROVISIONING_CONFIRMED", party: "customer",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", clusterId: "AX-NV-2261", benchmarkResult: "PASS", latencyMs: 0.42, confirmedBy: "helios-infra-bot" },
    hash: "c9e5f3", prevHash: "b8d4e2", signatures: ["helios.sig"]
  },
  {
    id: "E004", ts: "2026-02-07T23:59:59Z", type: "UTILIZATION_PERIOD", party: "machine",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", clusterId: "AX-NV-2261", periodStart: "2026-02-01T00:00:00Z", periodEnd: "2026-02-07T23:59:59Z", totalGpuHours: 42547.2, avgUtilization: 0.946, peakUtilization: 0.99, downtimeMinutes: 14, telemetryRecords: 604800, hashOfTelemetry: "f4a8b2c1d3e5" },
    hash: "d0f6a4", prevHash: "c9e5f3", signatures: ["cluster.auto.sig", "helios-monitor.sig"]
  },
  {
    id: "E005", ts: "2026-02-08T06:00:00Z", type: "INVOICE_GENERATED", party: "system",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: true, redactedFields: { splitProvider: ["axion", "norwest"], splitFinancier: ["norwest"] } },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W01", period: "Week 1", gpuHours: 42547.2, rate: 2.85, grossAmount: 121259.52, downtimeCredit: -9.31, netAmount: 121250.21, derivedFrom: ["E004"], proofChain: ["E001→E002→E003→E004→E005"] },
    hash: "e1a7b5", prevHash: "d0f6a4", signatures: ["system.auto.sig"]
  },
  {
    id: "E006", ts: "2026-02-08T09:15:00Z", type: "INVOICE_ACKNOWLEDGED", party: "customer",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W01", status: "ACCEPTED", verifiedBy: "Maria Chen, VP Finance", note: "Telemetry hash verified against our monitoring" },
    hash: "f2b8c6", prevHash: "e1a7b5", signatures: ["helios.sig"]
  },
  {
    id: "E007", ts: "2026-02-08T09:15:01Z", type: "PAYMENT_INSTRUCTION", party: "system",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: true, redactedFields: { splitProvider: ["axion", "norwest"], splitFinancier: ["norwest"] } },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W01", amount: 121250.21, splitProvider: 97000.17, splitFinancier: 24250.04, rail: "USDC", escrowContract: "0x7a3b...c4d1" },
    hash: "a3c9d7", prevHash: "f2b8c6", signatures: ["system.auto.sig"]
  },
  {
    id: "E008", ts: "2026-02-08T09:30:00Z", type: "SETTLEMENT_COMPLETE", party: "ledger",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W01", txHashProvider: "0xabc...123", txHashFinancier: "0xdef...456", settledAt: "2026-02-08T09:30:00Z", totalLatencyMs: 4200 },
    hash: "b4d0e8", prevHash: "a3c9d7", signatures: ["escrow.auto.sig", "axion.sig", "norwest.sig"]
  },
  // === ACCESS CONTROL EVENTS — these live in the same chain ===
  {
    id: "E-AC1", ts: "2026-02-10T14:00:00Z", type: "VIEW_ACCESS_GRANTED", party: "customer",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { grantedTo: "Sightline (Operator)", grantedBy: "Helios AI Labs", scope: "All events, CTR-4401", purpose: "Dispute analytics & advisory", expiry: "2026-05-01T00:00:00Z", revocable: true, grantorKeyFingerprint: "he:3d:a7:e5:12" },
    hash: "ac01f1", prevHash: "b4d0e8", signatures: ["helios.sig"]
  },
  {
    id: "E-AC2", ts: "2026-02-10T14:05:00Z", type: "VIEW_ACCESS_GRANTED", party: "provider",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { grantedTo: "Sightline (Operator)", grantedBy: "Axion Compute", scope: "All events, CTR-4401", purpose: "Dispute analytics & advisory", expiry: "2026-05-01T00:00:00Z", revocable: true, grantorKeyFingerprint: "ax:9f:c2:41:b8" },
    hash: "ac02f2", prevHash: "ac01f1", signatures: ["axion.sig"]
  },
  // Week 2 with dispute
  {
    id: "E009", ts: "2026-02-14T23:59:59Z", type: "UTILIZATION_PERIOD", party: "machine",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", clusterId: "AX-NV-2261", periodStart: "2026-02-08T00:00:00Z", periodEnd: "2026-02-14T23:59:59Z", totalGpuHours: 38912.0, avgUtilization: 0.865, peakUtilization: 0.97, downtimeMinutes: 847, telemetryRecords: 604800, hashOfTelemetry: "g5b9c2d4e6f7" },
    hash: "c5e1f9", prevHash: "ac02f2", signatures: ["cluster.auto.sig", "helios-monitor.sig"]
  },
  {
    id: "E010", ts: "2026-02-15T06:00:00Z", type: "INVOICE_GENERATED", party: "system",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: true, redactedFields: { splitProvider: ["axion", "norwest", "sightline"], splitFinancier: ["norwest", "sightline"] } },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W02", period: "Week 2", gpuHours: 38912.0, rate: 2.85, grossAmount: 110899.20, downtimeCredit: -706.12, netAmount: 110193.08, derivedFrom: ["E009"], proofChain: ["E001→E002→E003→E009→E010"] },
    hash: "d6f2a0", prevHash: "c5e1f9", signatures: ["system.auto.sig"]
  },
  {
    id: "E011", ts: "2026-02-15T10:30:00Z", type: "INVOICE_DISPUTED", party: "customer",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W02", disputeType: "DOWNTIME_UNDERCOUNT", claimedDowntimeMinutes: 1203, evidenceHash: "h6c0d5e7f8a9", disputedBy: "Maria Chen, VP Finance", note: "Our monitoring shows 1203 min downtime vs reported 847. Requesting telemetry reconciliation." },
    hash: "e7a3b1", prevHash: "d6f2a0", signatures: ["helios.sig"]
  },
  {
    id: "E012", ts: "2026-02-15T11:00:00Z", type: "DISPUTE_RESOLUTION", party: "system",
    visibility: ["axion", "helios", "norwest", "sightline"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { contractId: "CTR-4401", invoiceId: "INV-4401-W02", method: "TELEMETRY_COMPARISON", providerDowntime: 847, customerDowntime: 1203, reconciledDowntime: 1087, discrepancySource: "Network partition 02/11 14:22-14:58 caused monitoring gap", adjustedCredit: -907.64, revisedNetAmount: 109991.56, resolution: "ADJUSTED" },
    hash: "f8b4c2", prevHash: "e7a3b1", signatures: ["system.auto.sig", "axion.sig", "helios.sig"]
  },
  // === REVOCATION EVENT ===
  {
    id: "E-AC3", ts: "2026-02-16T09:00:00Z", type: "VIEW_ACCESS_REVOKED", party: "customer",
    visibility: ["axion", "helios", "norwest"],
    encryption: { algo: "AES-256-GCM", envelope: "per-party-key-wrap", fieldLevel: false },
    data: { revokedFrom: "Sightline (Operator)", revokedBy: "Helios AI Labs", reason: "Advisory engagement complete", effectiveImmediately: true, revokerKeyFingerprint: "he:3d:a7:e5:12", note: "Sightline read key for Helios-authored events destroyed. Hash chain remains verifiable." },
    hash: "ac03f3", prevHash: "f8b4c2", signatures: ["helios.sig"]
  },
];

const PARTIES = {
  provider: { name: "Axion Compute", role: "GPU Provider", color: "#E8553A" },
  customer: { name: "Helios AI Labs", role: "Compute Buyer", color: "#2D7FF9" },
  financier: { name: "Norwest Capital", role: "Capital Provider", color: "#18A86B" },
  machine: { name: "Cluster Telemetry", role: "Machine-Generated", color: "#9B6FE8" },
  system: { name: "CAST Protocol", role: "Shared Ledger", color: "#F5A623" },
  ledger: { name: "Settlement Layer", role: "Execution", color: "#F5A623" },
  both: { name: "All Parties", role: "Multi-Sig", color: "#8B95A5" },
};

const EVENT_LABELS = {
  CONTRACT_CREATED: "Contract Executed",
  CLUSTER_PROVISIONED: "Cluster Online",
  PROVISIONING_CONFIRMED: "Provisioning Verified",
  UTILIZATION_PERIOD: "Usage Period Closed",
  INVOICE_GENERATED: "Invoice Derived",
  INVOICE_ACKNOWLEDGED: "Invoice Accepted",
  INVOICE_DISPUTED: "Invoice Disputed",
  DISPUTE_RESOLUTION: "Dispute Resolved",
  PAYMENT_INSTRUCTION: "Payment Routed",
  SETTLEMENT_COMPLETE: "Settlement Final",
  VIEW_ACCESS_GRANTED: "View Access Granted",
  VIEW_ACCESS_REVOKED: "View Access Revoked",
};

const formatCurrency = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
};
const formatPct = (n) => (n * 100).toFixed(1) + "%";

// ═══════════════════════════════════════════════════════════════════
// Shared UI Components
// ═══════════════════════════════════════════════════════════════════

const HashChip = ({ hash, label }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4, padding: "2px 8px", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 0.5
  }}>
    {label && <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 2 }}>{label}</span>}
    <span>{hash}</span>
  </span>
);

const SignatureBadge = ({ sig }) => {
  const isAuto = sig.includes("auto") || sig.includes("bot") || sig.includes("monitor");
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: isAuto ? "rgba(155,111,232,0.1)" : "rgba(45,127,249,0.1)",
      border: `1px solid ${isAuto ? "rgba(155,111,232,0.25)" : "rgba(45,127,249,0.25)"}`,
      borderRadius: 3, padding: "1px 6px", fontSize: 10,
      color: isAuto ? "#B89AEF" : "#6BA3F9", fontFamily: "'IBM Plex Mono', monospace"
    }}>
      <span style={{ fontSize: 8 }}>{isAuto ? "⚙" : "✍"}</span> {sig}
    </span>
  );
};

const PartyDot = ({ party, size = 8 }) => (
  <span style={{
    display: "inline-block", width: size, height: size, borderRadius: "50%",
    background: PARTIES[party]?.color || ACCESS_GRANTS[party]?.color || "#666", flexShrink: 0
  }} />
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
    letterSpacing: 1, marginBottom: 8, fontWeight: 600
  }}>{children}</div>
);

const Card = ({ children, style = {}, accent }) => (
  <div style={{
    background: "rgba(255,255,255,0.02)", borderRadius: 8,
    border: `1px solid ${accent || "rgba(255,255,255,0.06)"}`,
    padding: 14, marginBottom: 14, ...style
  }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════
// Visibility Manifest — the key new component
// Shows WHO can see this event and WHY
// ═══════════════════════════════════════════════════════════════════

const VisibilityManifest = ({ event, viewingAs }) => {
  const isAccessEvent = event.type.includes("VIEW_ACCESS");
  const hasSightline = event.visibility.includes("sightline");

  return (
    <Card accent={isAccessEvent ? "rgba(245,166,35,0.25)" : undefined}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel>Visibility Manifest</SectionLabel>
        <span style={{
          fontSize: 9, padding: "2px 8px", borderRadius: 10,
          background: hasSightline ? "rgba(245,166,35,0.12)" : "rgba(24,168,107,0.12)",
          color: hasSightline ? "#F5A623" : "#18A86B",
          fontWeight: 600, letterSpacing: 0.5
        }}>
          {hasSightline ? "OPERATOR HAS VIEW ACCESS" : "COUNTERPARTIES ONLY"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {event.visibility.map((partyKey) => {
          const p = ACCESS_GRANTS[partyKey];
          if (!p) return null;
          const isOperator = partyKey === "sightline";
          const isViewing = partyKey === viewingAs;
          return (
            <div key={partyKey} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isOperator ? "rgba(245,166,35,0.08)" : isViewing ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isOperator ? "rgba(245,166,35,0.2)" : isViewing ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 6, padding: "6px 10px"
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: p.color, flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#E8E8ED" }}>{p.name}</div>
                <div style={{
                  fontSize: 9, fontFamily: "'IBM Plex Mono', monospace",
                  color: "rgba(255,255,255,0.3)", marginTop: 1
                }}>
                  {p.keyFingerprint}
                </div>
              </div>
              {isOperator && (
                <span style={{
                  fontSize: 8, background: "rgba(245,166,35,0.15)", color: "#F5A623",
                  padding: "1px 5px", borderRadius: 3, fontWeight: 700, marginLeft: 2
                }}>GRANTED</span>
              )}
              {isViewing && (
                <span style={{
                  fontSize: 8, background: "rgba(255,255,255,0.1)", color: "#E8E8ED",
                  padding: "1px 5px", borderRadius: 3, fontWeight: 700, marginLeft: 2
                }}>YOU</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Encryption metadata */}
      <div style={{
        display: "flex", gap: 12, fontSize: 10, color: "rgba(255,255,255,0.3)",
        fontFamily: "'IBM Plex Mono', monospace", flexWrap: "wrap"
      }}>
        <span>enc: {event.encryption.algo}</span>
        <span>wrap: {event.encryption.envelope}</span>
        {event.encryption.fieldLevel && (
          <span style={{ color: "#F5A623" }}>field-level encryption active</span>
        )}
      </div>

      {/* Field-level redaction info */}
      {event.encryption.fieldLevel && event.encryption.redactedFields && (
        <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
            Field-Level Access
          </div>
          {Object.entries(event.encryption.redactedFields).map(([field, allowedParties]) => (
            <div key={field} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.03)"
            }}>
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.5)" }}>
                {field}
              </span>
              <div style={{ display: "flex", gap: 3 }}>
                {allowedParties.map(pk => (
                  <span key={pk} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: ACCESS_GRANTS[pk]?.color || "#666"
                  }} />
                ))}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 6, fontStyle: "italic" }}>
            Fields not listed are visible to all parties in the visibility manifest.
          </div>
        </div>
      )}
    </Card>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Event Card (timeline)
// ═══════════════════════════════════════════════════════════════════

const EventCard = ({ event, isSelected, onClick }) => {
  const party = PARTIES[event.party];
  const isDispute = event.type.includes("DISPUTE");
  const isSettlement = event.type === "SETTLEMENT_COMPLETE";
  const isAccess = event.type.includes("VIEW_ACCESS");

  const borderColor = isAccess ? "#F5A623"
    : isDispute ? "#E8553A"
    : isSettlement ? "#18A86B"
    : "rgba(255,255,255,0.08)";

  const dotColor = isAccess ? "#F5A623" : (party?.color || "#666");

  return (
    <div onClick={onClick} style={{
      padding: "14px 16px", cursor: "pointer", position: "relative",
      background: isSelected ? "rgba(255,255,255,0.05)" : "transparent",
      borderLeft: `2px solid ${borderColor}`,
      transition: "all 0.15s ease",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{
        position: "absolute", left: -5, top: 18, width: 8, height: 8,
        borderRadius: "50%", background: dotColor,
        border: isSelected ? "2px solid #fff" : "2px solid #0D1117",
        zIndex: 2, transition: "all 0.15s"
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontFamily: "'IBM Plex Mono', monospace",
              color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase"
            }}>{event.id}</span>
            {isAccess ? (
              <span style={{ fontSize: 9, color: "#F5A623", fontWeight: 600, letterSpacing: 0.5 }}>
                ACCESS CONTROL
              </span>
            ) : (
              <span style={{ fontSize: 9, color: party?.color, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {party?.name}
              </span>
            )}
          </div>
          <div style={{
            fontSize: 13, fontWeight: 600, letterSpacing: -0.2,
            color: isAccess ? "#F5A623" : isDispute ? "#E8553A" : "#E8E8ED",
          }}>
            {isAccess && (event.type === "VIEW_ACCESS_GRANTED" ? "🔓 " : "🔒 ")}
            {isDispute && "⚠ "}
            {EVENT_LABELS[event.type] || event.type}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
            {formatDate(event.ts)}
          </div>
          {/* Mini visibility dots */}
          <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
            {event.visibility.map(pk => (
              <span key={pk} title={ACCESS_GRANTS[pk]?.name} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: ACCESS_GRANTS[pk]?.color || "#666",
                opacity: pk === "sightline" ? 1 : 0.6
              }} />
            ))}
          </div>
        </div>
        {event.data.netAmount && (
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#E8E8ED",
            fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap"
          }}>{formatCurrency(event.data.netAmount)}</div>
        )}
        {event.data.revisedNetAmount && (
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#F5A623",
            fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap"
          }}>{formatCurrency(event.data.revisedNetAmount)}</div>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Event Detail Panel — now with Visibility as first-class
// ═══════════════════════════════════════════════════════════════════

const EventDetail = ({ event, viewingAs }) => {
  if (!event) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height: "100%", color: "rgba(255,255,255,0.2)", fontSize: 13,
      padding: 40, textAlign: "center", lineHeight: 1.8
    }}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>◉</div>
      Select an event to inspect its provenance,<br />
      visibility manifest, and encryption state
    </div>
  );

  const party = PARTIES[event.party];
  const isAccess = event.type.includes("VIEW_ACCESS");

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <PartyDot party={event.party} size={10} />
          <span style={{ fontSize: 11, color: party?.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {party?.name} — {party?.role}
          </span>
        </div>
        <h2 style={{
          fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 8,
          fontFamily: "'Instrument Serif', Georgia, serif", letterSpacing: -0.5,
          color: isAccess ? "#F5A623" : "#E8E8ED"
        }}>
          {EVENT_LABELS[event.type] || event.type}
        </h2>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{formatDate(event.ts)}</div>
      </div>

      {/* ★ VISIBILITY MANIFEST — shown first, above everything else */}
      <VisibilityManifest event={event} viewingAs={viewingAs} />

      {/* Hash Chain */}
      <Card>
        <SectionLabel>Hash Chain</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <HashChip hash={event.prevHash} label="prev" />
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14 }}>→</span>
          <HashChip hash={event.hash} label="this" />
        </div>
      </Card>

      {/* Signatures */}
      <Card>
        <SectionLabel>Signatures ({event.signatures.length})</SectionLabel>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {event.signatures.map((sig, i) => <SignatureBadge key={i} sig={sig} />)}
        </div>
      </Card>

      {/* Proof Chain */}
      {event.data.proofChain && (
        <Card accent="rgba(245,166,35,0.15)">
          <SectionLabel>Provenance Chain</SectionLabel>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
            color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, lineHeight: 1.8
          }}>
            {event.data.proofChain.map((chain, i) => <div key={i}>{chain}</div>)}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8, fontStyle: "italic" }}>
            Every dollar on this invoice traces to a machine-generated event co-signed by both parties.
          </div>
        </Card>
      )}

      {/* Event Data */}
      <Card>
        <SectionLabel>Event Data</SectionLabel>
        {Object.entries(event.data).filter(([k]) => k !== "proofChain").map(([key, value]) => (
          <div key={key} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", gap: 12
          }}>
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,0.35)",
              fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0
            }}>{key}</span>
            <span style={{
              fontSize: 12, textAlign: "right", wordBreak: "break-all", maxWidth: "65%",
              fontFamily: typeof value === "number" || key.includes("hash") || key.includes("Hash") || key.includes("tx") || key.includes("Fingerprint")
                ? "'IBM Plex Mono', monospace" : "inherit",
              color: key.includes("Amount") || key.includes("Credit") || key === "rate" || key === "ratePerGpuHr"
                ? "#F5A623" : key.includes("hash") || key.includes("Hash") || key.includes("tx") || key.includes("Fingerprint")
                ? "#9B6FE8" : "#E8E8ED",
            }}>
              {typeof value === "number" && key.includes("mount") ? formatCurrency(value)
                : typeof value === "number" && key.includes("tilization") ? formatPct(value)
                : typeof value === "number" && key.includes("Credit") ? formatCurrency(value)
                : Array.isArray(value) ? value.join(", ")
                : typeof value === "boolean" ? (value ? "Yes" : "No")
                : String(value)}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Data Sovereignty Panel — the new core view
// ═══════════════════════════════════════════════════════════════════

const SovereigntyPanel = ({ deploymentMode, setDeploymentMode }) => {
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%" }}>
      {/* Statement of principle */}
      <div style={{
        padding: "20px", marginBottom: 24,
        background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(245,166,35,0.02) 100%)",
        border: "1px solid rgba(245,166,35,0.15)", borderRadius: 10
      }}>
        <div style={{
          fontSize: 18, fontWeight: 700, color: "#E8E8ED", marginBottom: 10,
          fontFamily: "'Instrument Serif', Georgia, serif", letterSpacing: -0.3, lineHeight: 1.3
        }}>
          Your ledger is encrypted end-to-end.<br />
          Sightline cannot read your financial data.
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          If you want managed analytics or advisory services, you grant view access — and you
          can revoke it at any time. Every grant and revocation is recorded in your ledger, permanently.
          You own your data. We operate the protocol.
        </div>
      </div>

      {/* Deployment Mode Selector */}
      <SectionLabel>Deployment Mode</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {Object.entries(DEPLOYMENT_MODES).map(([key, mode]) => {
          const isActive = deploymentMode === key;
          return (
            <div
              key={key}
              onClick={() => setDeploymentMode(key)}
              style={{
                padding: "14px 16px", borderRadius: 8, cursor: "pointer",
                background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 16, color: isActive ? "#F5A623" : "rgba(255,255,255,0.3)" }}>
                  {mode.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#F5A623" : "#E8E8ED" }}>
                  {mode.label}
                </span>
                {isActive && (
                  <span style={{
                    fontSize: 9, background: "rgba(245,166,35,0.15)", color: "#F5A623",
                    padding: "2px 8px", borderRadius: 10, fontWeight: 700, marginLeft: "auto"
                  }}>ACTIVE</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, paddingLeft: 26 }}>
                {mode.desc}
              </div>
              {key === "MANAGED_VIEW" && isActive && (
                <div style={{
                  marginTop: 10, paddingLeft: 26, paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.06)"
                }}>
                  <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 600, marginBottom: 4 }}>
                    Active View Grants
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                    Axion Compute granted E-AC2 · Feb 10 · Expires May 1<br />
                    Helios AI Labs — <span style={{ color: "#E8553A" }}>REVOKED</span> E-AC3 · Feb 16
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* What the operator sees in each mode */}
      <SectionLabel>What Sightline Can See</SectionLabel>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <td style={{ padding: "8px 0", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Data Type</td>
              <td style={{ padding: "8px 6px", color: "#E8553A", fontWeight: 600, textAlign: "center", fontSize: 10 }}>Self-Hosted</td>
              <td style={{ padding: "8px 6px", color: "#2D7FF9", fontWeight: 600, textAlign: "center", fontSize: 10 }}>Managed Zero</td>
              <td style={{ padding: "8px 6px", color: "#F5A623", fontWeight: 600, textAlign: "center", fontSize: 10 }}>Managed View</td>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Event contents", self: "—", zero: "—", view: "✓" },
              { label: "Invoice amounts", self: "—", zero: "—", view: "✓" },
              { label: "Party identities", self: "—", zero: "—", view: "✓" },
              { label: "Hash chain integrity", self: "—", zero: "✓", view: "✓" },
              { label: "Sync latency & uptime", self: "—", zero: "✓", view: "✓" },
              { label: "Event count & volume", self: "—", zero: "✓", view: "✓" },
              { label: "Encryption key material", self: "—", zero: "—", view: "—" },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "7px 0", color: "rgba(255,255,255,0.6)" }}>{row.label}</td>
                <td style={{ padding: "7px 6px", textAlign: "center", color: row.self === "✓" ? "#18A86B" : "rgba(255,255,255,0.15)" }}>{row.self}</td>
                <td style={{ padding: "7px 6px", textAlign: "center", color: row.zero === "✓" ? "#18A86B" : "rgba(255,255,255,0.15)" }}>{row.zero}</td>
                <td style={{ padding: "7px 6px", textAlign: "center", color: row.view === "✓" ? "#18A86B" : "rgba(255,255,255,0.15)" }}>{row.view}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Crypto-shredding / GDPR */}
      <SectionLabel>Data Erasure (GDPR Article 17)</SectionLabel>
      <Card accent="rgba(45,127,249,0.15)">
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          To exercise the right to erasure, a party destroys their encryption keys via <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2D7FF9"
          }}>crypto-shredding</span>. Their
          encrypted events become permanently unreadable. The hash chain remains intact for integrity
          verification — hashes prove the chain is unbroken without revealing contents. This approach
          satisfies erasure requirements while preserving the structural guarantee of the ledger.
        </div>
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 6,
          background: "rgba(45,127,249,0.06)", border: "1px solid rgba(45,127,249,0.12)",
          fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace"
        }}>
          keys destroyed → encrypted blobs remain → hashes verify → contents gone forever
        </div>
      </Card>

      {/* Zero Trust alignment */}
      <SectionLabel>Zero Trust Architecture</SectionLabel>
      <Card accent="rgba(24,168,107,0.15)">
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          Zero trust at the data layer, not just the network layer. Even the infrastructure operator
          cannot access event contents without an explicit cryptographic grant from data owners.
          Identity verification alone is insufficient — access requires a key grant that is scoped,
          time-limited, and revocable.
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["End-to-end encrypted", "Per-party key wrapping", "Field-level redaction", "Auditable grants", "Instant revocation", "Crypto-shredding"].map((tag, i) => (
            <span key={i} style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 4,
              background: "rgba(24,168,107,0.08)", border: "1px solid rgba(24,168,107,0.15)",
              color: "#18A86B", fontWeight: 500
            }}>{tag}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Adversarial Integrity Panel
// ═══════════════════════════════════════════════════════════════════

const IntegrityPanel = () => {
  const checks = [
    { label: "Hash Chain Integrity", status: "pass", detail: "All 15 events (including access control) chain correctly" },
    { label: "Signature Coverage", status: "pass", detail: "Every event has ≥1 valid signature" },
    { label: "Multi-Sig on Contract", status: "pass", detail: "3/3 parties signed E001" },
    { label: "Telemetry Hash Match", status: "pass", detail: "Provider + customer telemetry hashes align" },
    { label: "Invoice Derivation", status: "pass", detail: "All invoices derive from upstream utilization events" },
    { label: "Ghost Invoice Check", status: "pass", detail: "No invoice exists without upstream utilization" },
    { label: "Access Grant Audit", status: "pass", detail: "2 grants, 1 revocation — all signed by granting party" },
    { label: "Operator Visibility", status: "warn", detail: "Sightline has active view via Axion grant; Helios grant revoked" },
    { label: "Dispute Resolution", status: "warn", detail: "1 dispute resolved — 356 min discrepancy, telemetry reconciled" },
    { label: "Settlement Finality", status: "pass", detail: "Week 1 settled in 4.2s via USDC escrow" },
    { label: "Key Escrow Status", status: "info", detail: "No key escrow configured — parties manage own keys" },
  ];

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%" }}>
      <div style={{
        fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
        letterSpacing: 1.5, marginBottom: 16, fontWeight: 700
      }}>Adversarial Integrity Checks</div>
      {checks.map((c, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.03)"
        }}>
          <span style={{
            fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1, width: 14, textAlign: "center",
            color: c.status === "pass" ? "#18A86B" : c.status === "warn" ? "#F5A623" : "#2D7FF9"
          }}>
            {c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "i"}
          </span>
          <div>
            <div style={{ fontSize: 12, color: "#E8E8ED", fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{c.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Contract Summary
// ═══════════════════════════════════════════════════════════════════

const ContractSummary = () => {
  const contract = EVENTS[0].data;
  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", height: "100%" }}>
      <SectionLabel>Contract Overview</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Contract", value: contract.contractId },
          { label: "GPU Type", value: contract.gpuType },
          { label: "Quantity", value: contract.quantity + " GPUs" },
          { label: "Rate", value: "$" + contract.ratePerGpuHr + "/GPU-hr" },
          { label: "Term", value: contract.term },
          { label: "Min Commit", value: formatPct(contract.minCommitment) },
        ].map((item, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)", borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.05)", padding: "10px 12px"
          }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E8ED", fontFamily: "'IBM Plex Mono', monospace" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Shared Ledger Parties</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          { key: "provider", name: contract.provider, icon: "◆" },
          { key: "customer", name: contract.customer, icon: "▲" },
          { key: "financier", name: contract.financier, icon: "●" },
        ].map((p, i) => (
          <div key={i} style={{
            flex: 1, background: `${PARTIES[p.key]?.color}10`,
            border: `1px solid ${PARTIES[p.key]?.color}30`,
            borderRadius: 6, padding: "12px", textAlign: "center"
          }}>
            <div style={{ fontSize: 18, marginBottom: 4, color: PARTIES[p.key]?.color }}>{p.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#E8E8ED", marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{PARTIES[p.key]?.role}</div>
            <div style={{
              fontSize: 9, fontFamily: "'IBM Plex Mono', monospace",
              color: "rgba(255,255,255,0.2)", marginTop: 6
            }}>
              {ACCESS_GRANTS[p.key === "provider" ? "axion" : p.key === "customer" ? "helios" : "norwest"]?.keyFingerprint}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Settlement Status</SectionLabel>
      <Card accent="rgba(24,168,107,0.2)">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Week 1 — Settled</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#18A86B", fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatCurrency(121250.21)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Week 2 — Dispute Resolved</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#F5A623", fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatCurrency(109991.56)}
          </span>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 10, paddingTop: 10,
          display: "flex", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 13, color: "#E8E8ED", fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#E8E8ED", fontFamily: "'IBM Plex Mono', monospace" }}>
            {formatCurrency(121250.21 + 109991.56)}
          </span>
        </div>
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// Main Application
// ═══════════════════════════════════════════════════════════════════

const TABS = {
  LEDGER: "ledger",
  CONTRACT: "contract",
  SOVEREIGNTY: "sovereignty",
  INTEGRITY: "integrity",
};

export default function CASTPrototype() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.LEDGER);
  const [filterParty, setFilterParty] = useState("all");
  const [viewingAs, setViewingAs] = useState("helios");
  const [deploymentMode, setDeploymentMode] = useState("MANAGED_VIEW");

  const filteredEvents = filterParty === "all"
    ? EVENTS
    : EVENTS.filter(e => e.party === filterParty || e.type.includes("VIEW_ACCESS"));

  const showDetail = activeTab === TABS.LEDGER;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0D1117", color: "#E8E8ED",
      height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Serif&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{
        padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.01)", flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{
              fontSize: 17, fontWeight: 700, letterSpacing: 3,
              color: "#F5A623", fontFamily: "'IBM Plex Mono', monospace"
            }}>CAST</span>
            <span style={{
              fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: 0.5
            }}>Shared Ledger</span>
          </div>
          <div style={{ height: 14, width: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
            GPU Compute Financing — CTR-4401
          </span>
        </div>

        {/* Viewing-as selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5 }}>VIEWING AS</span>
          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: 2 }}>
            {[
              { key: "axion", label: "Axion", color: "#E8553A" },
              { key: "helios", label: "Helios", color: "#2D7FF9" },
              { key: "norwest", label: "Norwest", color: "#18A86B" },
              { key: "sightline", label: "Sightline", color: "#F5A623" },
            ].map(p => (
              <button key={p.key} onClick={() => setViewingAs(p.key)} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer",
                fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                background: viewingAs === p.key ? "rgba(255,255,255,0.1)" : "transparent",
                color: viewingAs === p.key ? p.color : "rgba(255,255,255,0.3)"
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: viewingAs === p.key ? p.color : "rgba(255,255,255,0.15)"
                }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", gap: 0, flexShrink: 0, background: "rgba(255,255,255,0.01)"
      }}>
        {[
          { key: TABS.LEDGER, label: "Event Ledger" },
          { key: TABS.CONTRACT, label: "Contract" },
          { key: TABS.SOVEREIGNTY, label: "Data Sovereignty" },
          { key: TABS.INTEGRITY, label: "Integrity" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "10px 16px", border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 600, letterSpacing: 0.3, transition: "all 0.15s",
            background: "transparent",
            color: activeTab === tab.key ? "#F5A623" : "rgba(255,255,255,0.3)",
            borderBottom: activeTab === tab.key ? "2px solid #F5A623" : "2px solid transparent",
          }}>
            {tab.key === TABS.SOVEREIGNTY && "🔐 "}{tab.label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Event list (ledger view) or full-width panels */}
        {activeTab === TABS.LEDGER ? (
          <>
            <div style={{
              width: 360, borderRight: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0
            }}>
              {/* Party filter */}
              <div style={{
                padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex", gap: 4, flexWrap: "wrap", flexShrink: 0
              }}>
                {[
                  { key: "all", label: "All" },
                  { key: "machine", label: "Machine" },
                  { key: "provider", label: "Provider" },
                  { key: "customer", label: "Customer" },
                  { key: "system", label: "Protocol" },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilterParty(f.key)} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                    fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                    background: filterParty === f.key ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                    color: filterParty === f.key ? "#E8E8ED" : "rgba(255,255,255,0.3)"
                  }}>
                    {f.key !== "all" && <PartyDot party={f.key} size={5} />}
                    {f.label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id} event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
            {/* Right: Detail */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.01)" }}>
              <div style={{
                padding: "8px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
                letterSpacing: 1.5, fontWeight: 700, flexShrink: 0
              }}>Event Inspector</div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <EventDetail event={selectedEvent} viewingAs={viewingAs} />
              </div>
            </div>
          </>
        ) : activeTab === TABS.SOVEREIGNTY ? (
          <SovereigntyPanel deploymentMode={deploymentMode} setDeploymentMode={setDeploymentMode} />
        ) : activeTab === TABS.CONTRACT ? (
          <ContractSummary />
        ) : activeTab === TABS.INTEGRITY ? (
          <IntegrityPanel />
        ) : null}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "7px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.01)", flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace" }}>
          <span>{EVENTS.length} events</span>
          <span>·</span>
          <span>{EVENTS.filter(e => e.type.includes("VIEW_ACCESS")).length} access events</span>
          <span>·</span>
          <span>{EVENTS.filter(e => e.type.includes("DISPUTE")).length} disputes</span>
          <span>·</span>
          <span>chain verified</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: deploymentMode === "SELF_HOSTED" ? "#E8553A" : deploymentMode === "MANAGED_ZERO" ? "#2D7FF9" : "#F5A623",
              display: "inline-block", animation: "pulse 2s infinite"
            }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
              {DEPLOYMENT_MODES[deploymentMode]?.label}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace" }}>
            enc: AES-256-GCM
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
