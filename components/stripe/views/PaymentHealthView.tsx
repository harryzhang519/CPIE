"use client";
// ============================================================
// Stripe B2B Analytics Dashboard — Payment Health View
// ============================================================
// Dark radar grid map with distinct alert pins, high-contrast KPI
// counters, and a color-coded recommendations register.

import React, { useState } from "react";
import { COUNTRY_RECOMMENDATIONS } from "@/lib/stripeData";
import { clsx } from "clsx";

interface RegionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  status: "normal" | "attention" | "critical";
  alertText: string;
}

const REGION_NODES: RegionNode[] = [
  { id: "US", name: "US", x: 22, y: 38, status: "critical", alertText: "Chase Visa cards failing" },
  { id: "CA", name: "CA", x: 26, y: 24, status: "normal", alertText: "Minor Interac gap" },
  { id: "LATAM", name: "LATAM", x: 32, y: 68, status: "normal", alertText: "Normal processing" },
  { id: "UK", name: "UK", x: 49, y: 26, status: "attention", alertText: "Extra verif friction" },
  { id: "EU", name: "EU", x: 55, y: 32, status: "attention", alertText: "Visa Debit underperforming" },
  { id: "APAC", name: "APAC", x: 80, y: 48, status: "normal", alertText: "Standard volume" },
];

export default function PaymentHealthView() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const activeNode = REGION_NODES.find((r) => r.id === selectedRegion);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      {/* Subtitle / Intro */}
      <p className="max-w-3xl text-xs text-[#8b8e9c] leading-relaxed">
        Stripe monitors payments across millions of businesses worldwide. This page shows you how your business compares to similar ones, and any issues happening around the world that might affect your customers.
      </p>

      {/* ── 1. Four Distinguishable KPI Counters ──────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm">
          <span className="font-mono text-3xl font-extrabold text-[#38bdf8]">195</span>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8b8e9c]">
            COUNTRIES WE MONITOR
          </p>
        </div>

        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm">
          <span className="font-mono text-3xl font-extrabold text-[#00d4aa]">4,800</span>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8b8e9c]">
            SIMILAR BUSINESSES TRACKED
          </p>
        </div>

        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm">
          <span className="font-mono text-3xl font-extrabold text-[#f59e0b]">Top 40%</span>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8b8e9c]">
            WHERE YOU RANK
          </p>
        </div>

        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm">
          <span className="font-mono text-3xl font-extrabold text-[#ef4444]">5</span>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8b8e9c]">
            ACTIVE ALERTS RIGHT NOW
          </p>
        </div>
      </div>

      {/* ── 2. World Payment Map with Glowing Radar Pins ──────── */}
      <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8e9c]">
              WORLD PAYMENT MAP
            </h3>
            <p className="text-sm font-bold text-[#dad7de]">
              Click any region to see what&apos;s happening
            </p>
          </div>

          {/* Color-Coded Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#8b8e9c]">
              <span className="h-2 w-2 rounded-full bg-[#00d4aa]" /> Running normally
            </span>
            <span className="flex items-center gap-1.5 text-[#8b8e9c]">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Needs attention
            </span>
            <span className="flex items-center gap-1.5 text-[#8b8e9c]">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" /> Active problem
            </span>
          </div>
        </div>

        {/* Map Canvas Background with Grid Lines */}
        <div className="relative h-64 w-full rounded-[10px] border border-[#31313a] bg-[#08080a] overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#31313a 1px, transparent 1px), linear-gradient(90deg, #31313a 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Regional Nodes with Glowing Indicators */}
          {REGION_NODES.map((node) => {
            const isSelected = selectedRegion === node.id;
            return (
              <button
                key={node.id}
                onClick={() =>
                  setSelectedRegion(isSelected ? null : node.id)
                }
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer pulse ring for critical or selected */}
                  {node.status === "critical" && (
                    <span className="absolute h-10 w-10 rounded-full bg-[#ef4444]/30 animate-ping" />
                  )}
                  {node.status === "attention" && (
                    <span className="absolute h-9 w-9 rounded-full bg-[#f59e0b]/20" />
                  )}

                  {/* Circle Node */}
                  <div
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold font-mono transition-transform group-hover:scale-110 shadow-lg border-2",
                      node.status === "critical"
                        ? "border-[#ef4444] bg-[#ef4444]/20 text-[#fca5a5] shadow-[0_0_10px_#ef4444]"
                        : node.status === "attention"
                        ? "border-[#f59e0b] bg-[#f59e0b]/20 text-[#fcd34d]"
                        : "border-[#00d4aa] bg-[#00d4aa]/20 text-[#6ee7b7]"
                    )}
                  >
                    {node.name}
                  </div>
                </div>

                {/* Tooltip on hover/select */}
                <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-[#0d0d12] px-2.5 py-1 text-[10px] font-semibold text-[#dad7de] border border-[#31313a] shadow-lg pointer-events-none opacity-90 z-10">
                  {node.alertText}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Region Detail */}
        {activeNode && (
          <div className="mt-3.5 rounded-[6px] border border-[#31313a] bg-[#0d0d12] p-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#dad7de]">
              Selected: <span className="text-[#38bdf8] font-bold">{activeNode.name}</span> — {activeNode.alertText}
            </span>
            <span className="text-[10px] text-[#8b8e9c]">Click node to deselect</span>
          </div>
        )}
      </div>

      {/* ── 3. Bottom Row: Peer Comparison & Recommendations ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8e9c]">
              HOW YOU COMPARE
            </h3>
            <h4 className="mt-1 text-sm font-bold text-[#dad7de]">
              Payment Success vs. Similar Businesses
            </h4>
            <p className="mt-2 text-xs text-[#aeaac0] leading-relaxed">
              You&apos;re better than <strong className="text-[#00d4aa]">62% of similar SaaS businesses</strong> — but there&apos;s room to close the gap to the top performers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#25252d]">
            <div className="flex justify-between text-[11px] font-mono mb-2 text-[#8b8e9c]">
              <span>Your Rate: 87.4%</span>
              <span className="text-[#00d4aa] font-bold">Top 10%: 94.2%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#25252d] overflow-hidden">
              <div className="h-full rounded-full bg-[#ab8ff1]" style={{ width: "62%" }} />
            </div>
          </div>
        </div>

        {/* Recommendations Table */}
        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8e9c]">
              AI RECOMMENDATIONS
            </h3>
            <h4 className="text-sm font-bold text-[#dad7de]">
              What to Fix, and When
            </h4>
            <p className="text-[11px] text-[#62626f] mt-0.5">
              Updated every 15 minutes based on global Stripe network data
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#25252d] text-[10px] font-bold uppercase tracking-wider text-[#8b8e9c]">
                  <th className="pb-2.5">REGION</th>
                  <th className="pb-2.5">THE PROBLEM</th>
                  <th className="pb-2.5">WHAT TO DO</th>
                  <th className="pb-2.5">WHEN</th>
                  <th className="pb-2.5 text-right">REVENUE IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25252d]">
                {COUNTRY_RECOMMENDATIONS.map((r, i) => (
                  <tr key={i} className="hover:bg-[#25252d]/30 transition-colors">
                    <td className="py-3 font-medium text-[#dad7de] whitespace-nowrap">
                      <span className="mr-2">{r.flag}</span>
                      {r.name}
                    </td>
                    <td className="py-3 text-[#fca5a5] font-semibold whitespace-nowrap">
                      {r.problem}
                    </td>
                    <td className="py-3 text-[#aeaac0]">
                      {r.action}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span
                        className={clsx(
                          "rounded-[3px] px-2 py-0.5 text-[10px] font-bold font-mono border",
                          r.when === "Now"
                            ? "bg-[#ef4444]/20 text-[#fca5a5] border-[#ef4444]/40"
                            : r.when === "Today"
                            ? "bg-[#f59e0b]/20 text-[#fcd34d] border-[#f59e0b]/40"
                            : "bg-[#25252d] text-[#aeaac0] border-[#31313a]"
                        )}
                      >
                        {r.when}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-[#00d4aa] whitespace-nowrap">
                      {r.revenueImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
