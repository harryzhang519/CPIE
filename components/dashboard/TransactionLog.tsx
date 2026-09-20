"use client";
// ============================================================
// Live Transaction Flow Monitor
// ============================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transaction, RoutingReason, TransactionOutcome } from "@/lib/types";
import { fmtUSD, fmtMs } from "@/lib/simulationLoop";
import { clsx } from "clsx";
import { ArrowRightLeft, ShieldAlert, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";

// ── Outcome pill ──────────────────────────────────────────────
function OutcomePill({ outcome }: { outcome: TransactionOutcome }) {
  const styles: Record<TransactionOutcome, string> = {
    APPROVED: "bg-brand-green-dim text-brand-green border-brand-green/20",
    SOFT_DECLINE: "bg-brand-amber-dim text-brand-amber border-brand-amber/20",
    HARD_DECLINE: "bg-brand-red-dim text-brand-red border-brand-red/20",
    FRAUD_BLOCK: "bg-brand-purple-dim text-brand-purple border-brand-purple/20",
  };
  const labels: Record<TransactionOutcome, string> = {
    APPROVED: "Approved",
    SOFT_DECLINE: "Soft Decline",
    HARD_DECLINE: "Hard Decline",
    FRAUD_BLOCK: "Fraud Block",
  };
  return (
    <span className={clsx("rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", styles[outcome])}>
      {labels[outcome]}
    </span>
  );
}

// ── Routing decision badge ────────────────────────────────────
function RoutingBadge({ reason, direct, optimized }: {
  reason: RoutingReason;
  direct: string;
  optimized: string;
}) {
  const isChanged = direct !== optimized;

  if (reason === "FRAUD_BLOCK") {
    return (
      <div className="flex items-center gap-1 text-brand-purple">
        <ShieldAlert size={12} />
        <span className="text-[10px] font-semibold">Radar Fraud Block</span>
      </div>
    );
  }

  if (reason === "LATENCY_FALLBACK") {
    return (
      <div className="flex items-center gap-1.5 text-brand-amber">
        <span className="rounded bg-brand-amber/20 px-1 py-0.2 text-[9px] font-bold font-mono text-brand-amber">
          SLIDE 6
        </span>
        <span className="text-[11px] font-semibold">Latency Fallback</span>
        <span className="text-brand-dim_text text-[10px] font-mono">({direct}→{optimized})</span>
      </div>
    );
  }

  if (reason === "STRIPE_INTELLIGENCE_CAPTURE") {
    return (
      <div className="flex items-center gap-1.5 text-brand-stripe">
        <span className="rounded bg-brand-stripe/20 px-1 py-0.2 text-[9px] font-bold font-mono text-brand-stripe-light">
          SLIDE 2
        </span>
        <span className="text-[11px] font-semibold">Stripe Intelligence Capture</span>
        <span className="text-brand-dim_text text-[10px] font-mono">({direct}→STRIPE)</span>
      </div>
    );
  }

  if (reason === "RETRY_APPROVED") {
    return (
      <div className="flex items-center gap-1 text-brand-green">
        <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "1.5s" }} />
        <span className="rounded bg-brand-green/20 px-1 py-0.2 text-[9px] font-bold font-mono text-brand-green">
          SLIDE 5
        </span>
        <span className="text-[10px] font-semibold">Retry Recovered</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-brand-dim_text">
      <CheckCircle2 size={12} />
      <span className="text-[10px]">Standard Pass-through</span>
    </div>
  );
}

// ── Vertical chip ─────────────────────────────────────────────
function VerticalChip({ vertical }: { vertical: string }) {
  const colors: Record<string, string> = {
    SaaS: "text-brand-blue",
    Retail: "text-brand-green",
    Travel: "text-brand-amber",
  };
  return (
    <span className={clsx("text-[10px] font-medium uppercase tracking-wider", colors[vertical] ?? "text-brand-muted_text")}>
      {vertical}
    </span>
  );
}

// ── Processor chip ────────────────────────────────────────────
function ProcessorChip({ id }: { id: string }) {
  const colors: Record<string, string> = {
    STRIPE: "bg-brand-stripe/10 text-brand-stripe border-brand-stripe/20",
    ADYEN: "bg-brand-green-dim text-brand-green border-brand-green/20",
    BRAINTREE: "bg-brand-amber-dim text-brand-amber border-brand-amber/20",
  };
  return (
    <span className={clsx("rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", colors[id] ?? "bg-brand-muted text-brand-muted_text")}>
      {id}
    </span>
  );
}

// ── Row ───────────────────────────────────────────────────────
function TxnRow({ txn }: { txn: Transaction }) {
  const isRetried = txn.tier3Recovered;
  return (
    <motion.tr
      key={txn.id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx(
        "border-b border-brand-border/50 transition-colors hover:bg-brand-muted/20",
        isRetried && "bg-brand-green-dim/10"
      )}
    >
      <td className="px-3 py-2">
        <span className="font-mono text-[11px] text-brand-dim_text">{txn.id}</span>
        {isRetried && (
          <span className="ml-1.5 rounded bg-brand-green-dim text-brand-green border border-brand-green/20 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider animate-pulse-slow">
            ↩ RETRY
          </span>
        )}
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-brand-text whitespace-nowrap">{txn.merchantName}</span>
          <VerticalChip vertical={txn.vertical} />
        </div>
      </td>
      <td className="px-3 py-2">
        <ProcessorChip id={txn.routingDecision.directRoute} />
      </td>
      <td className="px-3 py-2">
        <RoutingBadge
          reason={txn.routingDecision.reason}
          direct={txn.routingDecision.directRoute}
          optimized={txn.routingDecision.optimizedRoute}
        />
      </td>
      <td className="px-3 py-2">
        <OutcomePill outcome={txn.outcome} />
      </td>
      <td className="px-3 py-2 text-right">
        <span className="font-mono text-[11px] text-brand-text">{fmtUSD(txn.amount)}</span>
      </td>
      <td className="px-3 py-2 text-right">
        <span className={clsx(
          "font-mono text-[11px]",
          txn.simulatedLatency > 400 ? "text-brand-red" :
          txn.simulatedLatency > 250 ? "text-brand-amber" :
          "text-brand-green"
        )}>
          {fmtMs(txn.simulatedLatency)}
        </span>
      </td>
    </motion.tr>
  );
}

// ── Main Component ────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  isRunning: boolean;
}

export default function TransactionLog({ transactions, isRunning }: Props) {
  return (
    <div className="flex flex-col rounded-xl border border-brand-border bg-brand-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-text">Live Transaction Flow</span>
          {isRunning && (
            <span className="flex items-center gap-1.5 rounded bg-brand-green-dim px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-green">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
              Live
            </span>
          )}
        </div>
        <span className="text-xs text-brand-dim_text font-mono">Last {transactions.length} transactions</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-border/50">
              {["TXN ID", "Merchant · Vertical", "Origin", "Intelligent Decision", "Outcome", "Amount", "Latency"].map((h) => (
                <th key={h} className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-brand-dim_text whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {transactions.length === 0 ? (
                <tr key="empty">
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-brand-dim_text">
                    Hit <span className="text-brand-stripe font-semibold">Run Simulation</span> to begin the live feed
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => <TxnRow key={txn.id} txn={txn} />)
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
