"use client";
// ============================================================
// Stripe B2B Analytics Dashboard — Slide 5 Monetization Showcase
// ============================================================

import React from "react";
import type { DashboardMetrics } from "@/lib/types";
import { fmtUSD } from "@/lib/simulationLoop";

interface Props {
  metrics: DashboardMetrics;
  tier3NegotiatedPct: number;
}

export default function Slide5MonetizationBanner({
  metrics,
  tier3NegotiatedPct,
}: Props) {
  const screenedTxns = Math.round(
    metrics.totalAttempted > 0
      ? metrics.totalAttempted - metrics.totalAttempted * 0.35
      : 0
  );
  const negotiatedPctStr = `${(tier3NegotiatedPct * 100).toFixed(0)}%`;

  return (
    <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#25252d] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-[3px] bg-[#ab8ff1]/15 text-[#ab8ff1] px-2 py-0.5 font-mono text-[10px] font-bold border border-[#ab8ff1]/30">
            SLIDE 5
          </span>
          <h3 className="text-base font-bold text-[#dad7de] tracking-tight">
            3-Tier Monetization Model & Revenue Capture
          </h3>
          <span className="hidden sm:inline text-xs text-[#8b8e9c]">
            Quantitative Model Validation
          </span>
        </div>

        {/* Total Captured Revenue */}
        <div className="flex items-center gap-2.5 rounded-[6px] bg-[#0d0d12] border border-[#31313a] px-4 py-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8e9c]">
            Total Revenue Captured:
          </span>
          <span className="font-mono text-lg font-extrabold text-[#00d4aa]">
            {fmtUSD(metrics.totalRevenueCents)}
          </span>
        </div>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Tier 1 */}
        <div className="flex flex-col justify-between rounded-[10px] border border-[#31313a] bg-[#0d0d12] p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8e9c]">
                Tier 1 · Bundled
              </span>
              <span className="rounded-[3px] bg-[#25252d] px-2 py-0.5 text-[9px] font-bold uppercase text-[#aeaac0]">
                Included
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-[#dad7de]">Standard Processing</p>
            <p className="text-[11px] text-[#62626f] mt-0.5 font-mono">
              Formula: Revenue = $0.00
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[#25252d] pt-2.5">
            <span className="text-xs text-[#8b8e9c]">Revenue:</span>
            <span className="font-mono text-base font-bold text-[#62626f]">
              $0.00
            </span>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="flex flex-col justify-between rounded-[10px] border border-[#ab8ff1]/30 bg-[#131020] p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8ff1]">
                Tier 2 · Intelligence Pro
              </span>
              <span className="rounded-[3px] bg-[#ab8ff1]/15 text-[#ab8ff1] px-2 py-0.5 text-[9px] font-bold uppercase border border-[#ab8ff1]/30">
                Screened Only
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-[#dad7de]">Dynamic Risk & BIN Screening</p>
            <p className="text-[11px] text-[#aeaac0] mt-0.5 font-mono">
              Formula: $0.02 × {screenedTxns} screened
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[#25252d] pt-2.5">
            <span className="text-xs text-[#8b8e9c]">Revenue:</span>
            <span className="font-mono text-base font-bold text-[#ab8ff1]">
              {fmtUSD(metrics.tier2RevenueCents)}
            </span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="flex flex-col justify-between rounded-[10px] border border-[#00d4aa]/30 bg-[#0a1815] p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00d4aa]">
                Tier 3 · Outcome-Linked
              </span>
              <span className="rounded-[3px] bg-[#00d4aa]/15 text-[#00d4aa] px-2 py-0.5 text-[9px] font-bold uppercase border border-[#00d4aa]/30">
                Uplift Share
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-[#dad7de]">Recovered Soft-Decline Volume</p>
            <p className="text-[11px] text-[#aeaac0] mt-0.5 font-mono">
              Formula: {fmtUSD(metrics.recoveredGmvCents)} RecGMV × {negotiatedPctStr}
            </p>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-[#25252d] pt-2.5">
            <span className="text-xs text-[#8b8e9c]">Revenue:</span>
            <span className="font-mono text-base font-bold text-[#00d4aa]">
              {fmtUSD(metrics.tier3RevenueCents)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
