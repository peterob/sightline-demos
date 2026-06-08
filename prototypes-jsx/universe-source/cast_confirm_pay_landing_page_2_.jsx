import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
  Send,
  FileCheck2,
  Activity,
  XCircle,
  UserCheck,
  ReceiptText,
  Eye,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const SectionKicker = ({ children, dark = false }) => (
  <div
    className={cn(
      "mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
      dark
        ? "border-slate-200/15 bg-white/[0.04] text-slate-300"
        : "border-indigo-200 bg-indigo-50 text-indigo-700"
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-cyan-300" : "bg-indigo-500")} />
    {children}
  </div>
);

const GradientShell = ({ children, className = "" }) => (
  <div className={cn("relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-indigo-950/20", className)}>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(125,92,255,0.28),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.20),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
    <div className="relative">{children}</div>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="border-l border-slate-200 pl-5 first:border-l-0 first:pl-0">
    <div className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{value}</div>
    <div className="mt-1 max-w-[11rem] text-sm leading-5 text-slate-500">{label}</div>
  </div>
);

const SoftCard = ({ children, className = "" }) => (
  <div className={cn("rounded-[1.65rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60", className)}>{children}</div>
);

const DarkCard = ({ children, className = "" }) => (
  <div className={cn("rounded-[1.65rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur", className)}>{children}</div>
);

const CodePane = () => (
  <GradientShell className="min-h-[31rem]">
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <span className="font-mono text-[11px] text-slate-400">POST /v1/work-orders/wo_8fa2/confirm</span>
    </div>
    <pre className="overflow-x-auto px-5 py-6 text-left font-mono text-[12px] leading-6 text-slate-300 md:text-[13px]">
{`# Vendor confirms before payment release
{
  "event":        "bilateral.confirmed",
  "work_order":   "wo_8fa2c1",
  "payment": {
    "invoice":   "INV-1048",
    "amount":    "47000.00",
    "currency":  "USD",
    "pay_date":  "2026-05-22",
    "bank_last4":"4821"
  },
  "signature": {
    "method":    "passkey_or_verified_link",
    "bound_to":  "work_order_hash",
    "signer":    "vendor_contact"
  },
  "policy_version": "POL-v1",
  "lineage_hash":  "7c0d…b48a"
}

→ Covered payment blocked until vendor confirms.
→ Proof record retained for audit and review.`}
    </pre>
    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/[0.035] px-5 py-4">
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-slate-500">bilateral_state</div>
          <div className="mt-1 font-mono text-cyan-200">confirmed</div>
        </div>
        <div>
          <div className="text-slate-500">control_state</div>
          <div className="mt-1 font-mono text-emerald-200">approved</div>
        </div>
        <div>
          <div className="text-slate-500">release</div>
          <div className="mt-1 font-mono text-amber-200">unblocked</div>
        </div>
      </div>
    </div>
  </GradientShell>
);

const LoopStep = ({ n, label, title, body, icon: Icon, active }) => (
  <div className={cn("relative overflow-hidden rounded-[1.6rem] border p-5 transition", active ? "border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-100" : "border-slate-200 bg-white shadow-sm shadow-slate-200/60")}>
    <div className="mb-5 flex items-start justify-between">
      <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">{n} · {label}</div>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>
        <Icon size={18} />
      </div>
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    {active && <div className="mt-5 inline-flex rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Bilateral gate</div>}
  </div>
);

const Trigger = ({ icon: Icon, title, body }) => (
  <SoftCard className="p-5">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
      <Icon size={18} />
    </div>
    <h3 className="text-base font-semibold tracking-tight text-slate-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
  </SoftCard>
);

const TradeMessagePhone = () => (
  <div className="relative mx-auto max-w-[23rem]">
    <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-300/25 blur-3xl" />
    <div className="absolute -right-10 bottom-16 h-44 w-44 rounded-full bg-indigo-400/25 blur-3xl" />
    <div className="relative rounded-[2.65rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-300/50">
      <div className="rounded-[2.1rem] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">CAST Trade Message</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Confirm payment</h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm">
          {[
            ["Payer", "Acme Apparel Co."],
            ["Vendor", "Riverdale Textiles"],
            ["Invoice", "INV-1048"],
            ["Amount", "$47,000.00"],
            ["Pay date", "May 22, 2026"],
            ["Destination", "•••• 4821"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-b border-slate-200 py-2 last:border-b-0">
              <span className="text-slate-500">{k}</span>
              <span className={cn("text-right font-medium text-slate-950", k === "Invoice" || k === "Destination" ? "font-mono" : "")}>{v}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">Confirm only if these details match the payment you expect. Any change keeps the payment held.</p>

        <div className="mt-5 space-y-2">
          <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/60">Confirm payment details</button>
          <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Request change</button>
          <button className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">Dispute</button>
        </div>
      </div>
    </div>
  </div>
);

const ProofRecord = () => (
  <SoftCard className="overflow-hidden">
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">Confirmation record</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">A payment-specific proof package</h3>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">verified</span>
    </div>
    <div className="grid border-b border-slate-200 md:grid-cols-3">
      {[
        ["Counterparty", "Riverdale Textiles", "vendor signer"],
        ["Payment", "$47,000", "INV-1048"],
        ["Destination", "•••• 4821", "confirmed before release"],
      ].map(([label, value, note]) => (
        <div key={label} className="border-b border-r border-slate-200 p-5 last:border-r-0 md:border-b-0">
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{note}</div>
        </div>
      ))}
    </div>
    <div className="p-6">
      <div className="rounded-3xl bg-slate-50 p-5 font-mono text-xs leading-6 text-slate-600">
        <div>event_type: bilateral.confirmed</div>
        <div>work_order_id: wo_8fa2c1</div>
        <div>policy_version: POL-v1</div>
        <div>lineage_hash: 7c0d…b48a</div>
        <div>release_status: approved_after_confirmation</div>
      </div>
    </div>
  </SoftCard>
);

const Walkthrough = () => {
  const [tab, setTab] = useState("buyer");
  const tabs = useMemo(() => [
    { id: "buyer", label: "Buyer" },
    { id: "vendor", label: "Vendor" },
    { id: "proof", label: "Proof" },
  ], []);

  const content = {
    buyer: {
      eyebrow: "Buyer view · AP control queue",
      title: "High-risk payments wait for the vendor.",
      body: "First payment, bank change, rush payment, duplicate-risk invoice, or threshold breach. Your team can see what is waiting, confirmed, disputed, or expired.",
      badge: "held",
      rows: [
        ["INV-1048", "Riverdale Textiles", "$47,000", "Awaiting vendor"],
        ["INV-1049", "Pacific Packaging", "$8,250", "Confirmed"],
        ["INV-1050", "Kestrel Hardware", "$14,800", "Change requested"],
      ],
      note: "Confirm & Pay sits before payment release and alongside existing AP systems.",
    },
    vendor: {
      eyebrow: "Vendor view · secure link",
      title: "The vendor confirms only what they can verify.",
      body: "They see payer, invoice, amount, payment date, and destination last four. They can confirm, request a change, or dispute. No app. No tenant. No GL integration.",
      badge: "one link",
      rows: [
        ["Viewed", "J. Okafor", "14:04 UTC", "mobile"],
        ["Confirmed", "J. Okafor", "14:07 UTC", "bound to record"],
        ["Policy evaluated", "system", "14:07 UTC", "approved"],
      ],
      note: "The vendor confirms through a secure link without adopting a new finance system.",
    },
    proof: {
      eyebrow: "Proof view · retained evidence",
      title: "The output is a bilateral payment-confirmation record.",
      body: "CAST proves the vendor confirmed these payment terms for this specific payment record at this timestamp. It does not claim the invoice is inherently real or eliminate collusion.",
      badge: "retained",
      rows: [
        ["Payment intent", "INV-1048", "$47,000", "snapshot"],
        ["Vendor action", "confirmed", "14:07 UTC", "immutable event"],
        ["Lineage", "7c0d…b48a", "POL-v1", "audit-ready"],
      ],
      note: "Precise claim: covered payment release cannot proceed without counterparty confirmation.",
    },
  };

  const selected = content[tab];

  return (
    <GradientShell>
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r lg:p-9">
          <SectionKicker dark>Interactive walk-through</SectionKicker>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">One AP payment, three lenses.</h2>
          <p className="mt-5 text-base leading-7 text-slate-400">Follow one invoice from payment intent to vendor confirmation to retained proof.</p>
          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", tab === t.id ? "bg-white text-slate-950" : "text-slate-400 hover:text-white")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-7 lg:p-9">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200/80">{selected.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{selected.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{selected.body}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">{selected.badge}</span>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
            {selected.rows.map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 border-b border-white/10 px-4 py-4 text-sm last:border-b-0">
                {row.map((cell, j) => <div key={j} className={j === 0 ? "font-semibold text-white" : "text-slate-400"}>{cell}</div>)}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-3xl border border-cyan-200/10 bg-cyan-200/5 p-4 text-sm leading-6 text-cyan-50/90">{selected.note}</p>
        </div>
      </div>
    </GradientShell>
  );
};

export default function CastConfirmPayLanding() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f9fc] text-slate-700 selection:bg-indigo-600 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-48 left-1/2 h-[42rem] w-[70rem] -translate-x-1/2 rotate-[-8deg] rounded-[8rem] bg-[linear-gradient(90deg,#635bff_0%,#00d4ff_45%,#7c3aed_100%)] opacity-20 blur-3xl" />
        <div className="absolute right-[-12rem] top-[34rem] h-[36rem] w-[36rem] rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute left-[-10rem] top-[58rem] h-[34rem] w-[34rem] rounded-full bg-indigo-200/50 blur-3xl" />
      </div>

      <header className="relative z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-semibold text-white">C</div>
            <div>
              <div className="font-semibold tracking-tight text-slate-950">CAST</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Confirm & Pay</div>
            </div>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#how" className="hover:text-slate-950">How it works</a>
            <a href="#security" className="hover:text-slate-950">Controls</a>
            <a href="#walkthrough" className="hover:text-slate-950">Walk-through</a>
            <a href="#proof" className="hover:text-slate-950">Proof</a>
          </nav>
          <a href="mailto:peter@digitalfinancehq.com?subject=CAST%20Confirm%20%26%20Pay%20demo" className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300/50 transition hover:bg-indigo-600">
            Request a demo <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-20 md:grid-cols-[1.02fr_0.98fr] md:pb-28 md:pt-28">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionKicker>Commercial Agreement Settlement Technology</SectionKicker>
            <h1 className="max-w-4xl text-6xl font-semibold tracking-[-0.065em] text-slate-950 md:text-7xl lg:text-8xl">Confirm vendor payments before they move.</h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-600">CAST adds a bilateral gate to high-risk AP payments. Before release, the vendor confirms the amount, invoice, payment date, and destination-account last four.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:peter@digitalfinancehq.com?subject=CAST%20Confirm%20%26%20Pay%20demo" className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-200 transition hover:bg-slate-950">
                Request a demo <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
              </a>
              <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">See how it works</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
            <CodePane />
          </motion.div>
        </section>

        <section className="relative border-y border-slate-200 bg-white/70">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-4">
            <Stat value="$2.9B" label="Annual U.S. BEC losses" />
            <Stat value="1 of 2" label="Parties confirming terms today" />
            <Stat value="0" label="Covered payments released before confirmation" />
            <Stat value="1" label="Bilateral record for every covered release" />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-[0.78fr_1.22fr]">
          <div>
            <SectionKicker>The root cause</SectionKicker>
            <h2 className="text-5xl font-semibold tracking-[-0.055em] text-slate-950">AP today is unilateral.</h2>
          </div>
          <div className="max-w-3xl text-xl leading-9 text-slate-600">
            <p>The payer approves an invoice internally. The vendor learns of the transaction only when money arrives, when it does not arrive, or when something is already wrong.</p>
            <p className="mt-5">CAST adds one narrow control: before a covered payment is released, the counterparty confirms the payment details through a secure Trade Message.</p>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-5 py-24">
          <SectionKicker>The bilateral loop</SectionKicker>
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl">One party proposes. The vendor confirms. Policy governs release.</h2>
            <p className="max-w-md text-base leading-7 text-slate-600">Confirm & Pay is a pre-release AP control. It does not replace the ERP, create seller-side ledgers, or require vendors to adopt a new system.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <LoopStep n="01" label="Propose" icon={FileCheck2} title="Payment intent created" body="A high-risk invoice or payment request enters the queue. Policy version and payment details are snapshotted." />
            <LoopStep n="02" label="Send" icon={Send} title="Trade Message sent" body="Vendor receives one browser link: amount, invoice, payment date, bank last four, and deadline." />
            <LoopStep n="03" label="Confirm" icon={LockKeyhole} title="Vendor confirms" body="The vendor confirms, requests a change, or disputes. Confirmation is bound to the specific payment record." active />
            <LoopStep n="04" label="Release" icon={ShieldCheck} title="Payment can proceed" body="Covered payments remain blocked until the bilateral event exists. The proof record is retained." />
          </div>
        </section>

        <section className="relative bg-slate-950 py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(99,91,255,0.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(0,212,255,0.20),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[0.92fr_1.08fr] md:items-center">
            <div>
              <SectionKicker dark>What the vendor sees</SectionKicker>
              <h2 className="text-5xl font-semibold tracking-[-0.055em] text-white md:text-6xl">A secure payment card. Three actions. No integration.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">The vendor is a counterparty signer, not a full CAST tenant. They do not need an app, ERP connection, or account setup to confirm a payment.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <DarkCard className="p-4"><CheckCircle2 className="mb-3 text-emerald-300" size={20} /><div className="font-semibold">Confirm</div></DarkCard>
                <DarkCard className="p-4"><AlertTriangle className="mb-3 text-amber-300" size={20} /><div className="font-semibold">Request change</div></DarkCard>
                <DarkCard className="p-4"><XCircle className="mb-3 text-rose-300" size={20} /><div className="font-semibold">Dispute</div></DarkCard>
              </div>
              <p className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">Precise claim: CAST proves the vendor confirmed these payment terms for this specific payment record at this timestamp. It does not claim the invoice is inherently real, and it does not eliminate collusion.</p>
            </div>
            <TradeMessagePhone />
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-5 py-24">
          <SectionKicker>Covered AP controls</SectionKicker>
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl">Start where payment risk is concentrated.</h2>
            <p className="max-w-md text-base leading-7 text-slate-600">Confirm & Pay focuses on the flows where unilateral instructions create the most damage.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Trigger icon={UserCheck} title="First payment to a vendor" body="A new vendor relationship should not receive funds without counterparty confirmation of the destination details." />
            <Trigger icon={ShieldCheck} title="Bank-account change" body="Any destination-account change triggers confirmation. The vendor sees the bank last four before release." />
            <Trigger icon={Clock3} title="Rush payment" body="Urgency increases scrutiny instead of bypassing controls. A rush payment still waits for confirmation." />
            <Trigger icon={Activity} title="High-value threshold" body="Payments above your configured threshold require a bilateral event before proceeding." />
            <Trigger icon={ReceiptText} title="Duplicate-risk invoice" body="Potential duplicate invoices are sent for confirmation or held for review before money moves." />
            <Trigger icon={Eye} title="Dispute or non-response" body="If the vendor disputes or misses the deadline, the payment remains held and the exception is recorded." />
          </div>
        </section>

        <section id="walkthrough" className="mx-auto max-w-7xl px-5 py-24">
          <Walkthrough />
        </section>

        <section id="proof" className="relative border-y border-slate-200 bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[0.86fr_1.14fr] md:items-center">
            <div>
              <SectionKicker>Proof record</SectionKicker>
              <h2 className="text-5xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl">Every covered payment leaves behind a bilateral record.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">Confirm & Pay records who confirmed, what they confirmed, when they confirmed it, which policy governed the release, and which payment record the confirmation was bound to.</p>
              <div className="mt-8 space-y-3 text-sm font-medium text-slate-700">
                {[
                  "Vendor confirmation before payment release",
                  "Payment details snapshotted at confirmation time",
                  "Policy version retained with the event",
                  "Record available for audit, review, and dispute resolution",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3"><CheckCircle2 className="text-indigo-600" size={18} /> {item}</div>
                ))}
              </div>
            </div>
            <ProofRecord />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24">
          <SectionKicker>Built for AP teams</SectionKicker>
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 md:text-6xl">A control layer that sits before payment release.</h2>
            <p className="max-w-md text-base leading-7 text-slate-600">CAST works alongside existing AP and ERP systems. It creates the counterparty confirmation record those systems do not produce on their own.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SoftCard className="p-6">
              <ShieldCheck className="mb-6 text-indigo-600" size={24} />
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">Pre-release control</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Covered payments remain held until the vendor confirms the payment terms or an exception is reviewed.</p>
            </SoftCard>
            <SoftCard className="p-6">
              <GitBranch className="mb-6 text-indigo-600" size={24} />
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">Low-friction vendor experience</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Vendors receive one secure link and confirm in the browser. No vendor-side ERP connection is required.</p>
            </SoftCard>
            <SoftCard className="p-6">
              <FileCheck2 className="mb-6 text-indigo-600" size={24} />
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">Audit-ready evidence</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Each confirmation creates a retained record of the terms, signer, timestamp, policy version, and payment reference.</p>
            </SoftCard>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-28">
          <GradientShell>
            <div className="grid gap-10 p-8 md:grid-cols-[1fr_0.86fr] md:items-center md:p-10">
              <div>
                <SectionKicker dark>Confirm & Pay</SectionKicker>
                <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">Add counterparty confirmation to high-risk AP payments.</h2>
                <p className="mt-6 text-lg leading-8 text-slate-400">CAST gives finance teams a bilateral proof layer before payment release, without replacing the ERP or asking vendors to adopt a new system.</p>
              </div>
              <div className="space-y-3">
                {[
                  "Confirm first payments and bank-account changes",
                  "Hold payment when details are disputed or unconfirmed",
                  "Retain a payment-specific proof record",
                  "Operate alongside existing AP and ERP workflows",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm font-medium text-slate-300">{item}</div>
                ))}
              </div>
            </div>
          </GradientShell>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/70 px-5 py-10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-medium text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>CAST · Confirm & Pay · Vendor-confirmed AP payments before release.</div>
          <div className="flex gap-6">
            <a href="#how" className="hover:text-slate-950">How it works</a>
            <a href="#proof" className="hover:text-slate-950">Proof</a>
            <a href="mailto:peter@digitalfinancehq.com" className="hover:text-slate-950">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
