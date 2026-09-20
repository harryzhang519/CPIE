"use client";
// ============================================================
// Unicorn Studio — Home View Component
// ============================================================
// Canvas: Void (#08080a), Cards: Graphite (#17171c) with 10px radius.
// Typography: Chalk (#dad7de) & Pearl (#aeaac0).
// Preserved Data Colors: Numbers, Sliders, Warnings, and Alerts.

import React from "react";
import { BENCHMARKS, LIVE_ALERTS } from "@/lib/stripeData";
import {
  CheckCircle2,
  ShoppingCart,
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { clsx } from "clsx";

const ICONS: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={16} className="text-[#00d4aa]" />,
  completed: <ShoppingCart size={16} className="text-[#38bdf8]" />,
  fraud: <Shield size={16} className="text-[#00d4aa]" />,
  disputed: <AlertTriangle size={16} className="text-[#ef4444]" />,
  extra_rev: <TrendingUp size={16} className="text-[#a855f7]" />,
  ai_saved: <DollarSign size={16} className="text-[#00d4aa]" />,
};

// Preserved high-visibility progress bar fills
const PROGRESS_COLORS: Record<string, string> = {
  yellow: "bg-[#f59e0b]",
  blue: "bg-[#38bdf8]",
  green: "bg-[#00d4aa]",
  red: "bg-[#ef4444]",
  orange: "bg-[#a855f7]",
};

export default function HomeView() {
  const weeks = [
    { label: "W1", val: 82 },
    { label: "W2", val: 83 },
    { label: "W3", val: 82.5 },
    { label: "W4", val: 84 },
    { label: "W5", val: 83.5 },
    { label: "W6", val: 84.8 },
    { label: "W7", val: 85.2 },
    { label: "W8", val: 85.0 },
    { label: "W9", val: 85.8 },
    { label: "W10", val: 86.4 },
    { label: "W11", val: 86.9 },
    { label: "W12", val: 87.4, current: true },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1200px] mx-auto">
      {/* ── 1. Hero Banner with WebGL Aurora Atmosphere ────────── */}
      <div className="relative rounded-[10px] border border-[#31313a] bg-[#0d0d12] p-7 overflow-hidden shadow-sm">
        {/* Subtle WebGL Aurora Radial Gradient bleeding from lower-center */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(circle at 65% 100%, rgb(142, 108, 228) 0%, rgb(114, 79, 201) 35%, transparent 75%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] bg-[#17171c] border border-[#31313a] text-[#dad7de] font-mono font-bold text-lg shadow-keyline">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.06em] text-[#8b8e9c]">
                  STRIPE INTELLIGENCE
                </span>
                {/* Announcement Pill with Lavender Beam dot */}
                <span className="flex items-center gap-1.5 rounded-[3px] bg-[#17171c] border border-[#31313a] px-2 py-0.5 text-[10px] font-mono text-[#dad7de]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00d4aa] shadow-[0_0_6px_#00d4aa]" />
                  LIVE
                </span>
              </div>
              <h2 className="mt-1.5 text-2xl md:text-3xl font-normal tracking-[-1px] text-[#dad7de]">
                Your AI Payments Advisor
              </h2>
              <p className="mt-1 max-w-xl text-xs text-[#aeaac0] leading-relaxed">
                Stripe&apos;s AI monitors your payments 24/7 — catching problems, recovering failed transactions, and finding revenue you&apos;d otherwise miss. Hover any card to learn more.
              </p>
            </div>
          </div>

          {/* Right Highlight Box (Graphite, 10px radius) */}
          <div className="flex flex-col items-start md:items-end rounded-[10px] border border-[#31313a] bg-[#17171c] px-6 py-4 shrink-0 shadow-keyline">
            <span className="text-[10px] font-mono uppercase tracking-[0.057em] text-[#8b8e9c]">
              AI SAVED YOU THIS MONTH
            </span>
            <span className="font-mono text-3xl font-extrabold text-[#00d4aa] tracking-tight">
              +$248K
            </span>
            <span className="text-[11px] text-[#8b8e9c]">
              across fraud, retries, and checkout
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Six Metric Cards on Graphite (10px Radius) ─────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BENCHMARKS.map((b) => (
          <div
            key={b.id}
            className={clsx(
              "flex flex-col justify-between rounded-[10px] border p-5 transition-all hover:border-[#8b8e9c]",
              b.id === "disputed"
                ? "border-[#ef4444]/40 bg-[#17171c]"
                : "border-[#31313a] bg-[#17171c]"
            )}
          >
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="rounded-[3px] border border-[#31313a] bg-[#0d0d12] p-1.5">
                  {ICONS[b.id]}
                </div>
                <span
                  className={clsx(
                    "rounded-[3px] px-2 py-0.5 text-xs font-mono font-bold border",
                    b.id === "disputed"
                      ? "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40"
                      : b.changeDirection === "up" || b.id === "fraud"
                      ? "bg-[#00d4aa]/15 text-[#00d4aa] border-[#00d4aa]/30"
                      : "bg-[#ef4444]/20 text-[#ef4444]"
                  )}
                >
                  {b.change}
                </span>
              </div>

              {/* Big Distinguishable Number */}
              <div className="mt-4">
                <span className="font-mono text-3xl font-extrabold tracking-tight text-[#dad7de]">
                  {b.value}
                </span>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.057em] text-[#8b8e9c]">
                  {b.label}
                </p>
              </div>

              {/* Subtext description box */}
              {b.subtext && (
                <div className="mt-3 rounded-[3px] bg-[#0d0d12] p-2.5 text-xs text-[#aeaac0] leading-snug border border-[#31313a]">
                  {b.subtext}
                </div>
              )}
            </div>

            {/* Preserved Color-Coded Comparison Bar */}
            <div className="mt-5 pt-3 border-t border-[#31313a]">
              <div className="h-2 w-full rounded-full bg-[#0d0d12] overflow-hidden mb-2">
                <div
                  className={clsx("h-full rounded-full", PROGRESS_COLORS[b.benchmarkColor])}
                  style={{ width: "72%" }}
                />
              </div>
              <span
                className={clsx(
                  "text-xs font-medium",
                  b.id === "disputed" ? "text-[#ef4444] font-semibold" : "text-[#aeaac0]"
                )}
              >
                {b.benchmarkText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Bottom Row: 12-Week Success Rate & Live Alerts ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Success Rate Chart */}
        <div className="flex flex-col justify-between rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.057em] text-[#8b8e9c]">
                  PAYMENT SUCCESS RATE
                </h3>
                <p className="text-xs text-[#aeaac0] mt-0.5">
                  How often customer payments go through — last 12 weeks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-[#dad7de]">
                  87.4%
                </span>
                <span className="rounded-[3px] bg-[#00d4aa]/15 text-[#00d4aa] px-2 py-0.5 text-[10px] font-mono font-bold border border-[#00d4aa]/30">
                  ↑ RISING TREND
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="mt-8 flex items-end justify-between gap-2 h-44 px-2 pb-2">
              {weeks.map((w) => {
                const heightPct = ((w.val - 75) / 15) * 100;
                return (
                  <div key={w.label} className="flex-1 flex flex-col items-center gap-2">
                    {w.current && (
                      <span className="text-[10px] font-mono font-bold text-[#ab8ff1]">
                        {w.val}%
                      </span>
                    )}
                    <div className="w-full bg-[#0d0d12] rounded-t-sm h-32 flex items-end">
                      <div
                        className={clsx(
                          "w-full rounded-t-sm transition-all",
                          w.current
                            ? "bg-[#ab8ff1] shadow-[0_0_12px_#ab8ff1]"
                            : "bg-[#25252d] hover:bg-[#31313a]"
                        )}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8b8e9c]">
                      {w.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#31313a] flex items-center justify-between text-xs text-[#8b8e9c]">
            <span>Average: 84.6%</span>
            <span className="text-[#00d4aa] font-bold font-mono">+5.4% improvement over 12 weeks</span>
          </div>
        </div>

        {/* Live Alerts Feed with Preserved Severity Borders */}
        <div className="flex flex-col rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.057em] text-[#8b8e9c]">
                LIVE ALERTS
              </h3>
              <p className="text-sm font-medium text-[#dad7de]">
                Things Happening Right Now
              </p>
            </div>
            <span className="rounded-[3px] bg-[#ef4444]/20 text-[#ef4444] px-2.5 py-0.5 text-[10px] font-mono font-bold border border-[#ef4444]/40 uppercase">
              2 NEED ATTENTION
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {LIVE_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  "rounded-[3px] border p-3.5 transition-all hover:bg-[#25252d]",
                  alert.severity === "critical"
                    ? "border-l-4 border-l-[#ef4444] border-[#31313a] bg-[#0d0d12]"
                    : alert.severity === "warning"
                    ? "border-l-4 border-l-[#f59e0b] border-[#31313a] bg-[#0d0d12]"
                    : "border-l-4 border-l-[#00d4aa] border-[#31313a] bg-[#0d0d12]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "h-2 w-2 rounded-full shrink-0",
                        alert.severity === "critical"
                          ? "bg-[#ef4444] shadow-[0_0_8px_#ef4444]"
                          : alert.severity === "warning"
                          ? "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"
                          : "bg-[#00d4aa] shadow-[0_0_8px_#00d4aa]"
                      )}
                    />
                    <h4 className="text-xs font-medium text-[#dad7de]">
                      {alert.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#62626f] font-mono shrink-0">
                    {alert.timeAgo}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#aeaac0] leading-relaxed pl-4">
                  {alert.description}
                </p>

                <div className="mt-3 flex items-center gap-2 pl-4">
                  <span
                    className={clsx(
                      "rounded-[3px] px-2 py-0.5 text-[10px] font-mono font-bold border",
                      alert.statusTagColor === "red"
                        ? "bg-[#ef4444]/20 text-[#fca5a5] border-[#ef4444]/40"
                        : alert.statusTagColor === "orange"
                        ? "bg-[#f59e0b]/20 text-[#fcd34d] border-[#f59e0b]/40"
                        : "bg-[#00d4aa]/20 text-[#6ee7b7] border-[#00d4aa]/40"
                    )}
                  >
                    {alert.statusTag}
                  </span>
                  <span className="text-xs text-[#8b8e9c]">
                    {alert.actionTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
