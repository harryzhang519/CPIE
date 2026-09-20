"use client";
// ============================================================
// Unicorn Studio — Persistent Sidebar Component
// ============================================================
// Surfaces: Void (#08080a), Graphite (#17171c), Iron (#31313a).
// Typography: Chalk (#dad7de), Pearl (#aeaac0), Ash (#62626f).
// Preserved Data Colors: Emerald (#00d4aa), Cyan (#38bdf8), Amber (#f59e0b).

import React from "react";
import type { ActiveTab } from "@/lib/stripeData";
import { Sparkles, Zap, Globe, Gift } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, onSelectTab }: Props) {
  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-[#31313a] bg-[#08080a] text-[#aeaac0] h-screen sticky top-0">
      {/* ── Top Header & Navigation ───────────────────────────── */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#31313a]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-[#17171c] border border-[#31313a] text-[#dad7de] font-mono font-bold text-sm shadow-keyline">
            S
          </div>
          <div>
            <h1 className="text-xs font-semibold tracking-tight text-[#dad7de]">
              Stripe Intelligence
            </h1>
            <p className="text-[10px] uppercase tracking-[0.04em] text-[#62626f]">
              MERCHANT AI PLATFORM
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex flex-col gap-5">
          {/* Main section */}
          <div>
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.06em] text-[#62626f]">
              MAIN
            </p>
            <button
              onClick={() => onSelectTab("home")}
              className={clsx(
                "w-full flex items-center justify-between rounded-[3px] px-3 py-2 text-xs font-medium transition-all",
                activeTab === "home"
                  ? "bg-[#17171c] text-[#dad7de] border border-[#31313a] shadow-keyline"
                  : "text-[#aeaac0] hover:bg-[#17171c] hover:text-[#dad7de]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles
                  size={14}
                  className={activeTab === "home" ? "text-[#ab8ff1]" : "text-[#8b8e9c]"}
                />
                <span>Home</span>
              </div>
            </button>
          </div>

          {/* Features section */}
          <div>
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.06em] text-[#62626f]">
              FEATURES
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onSelectTab("optimizer")}
                className={clsx(
                  "w-full flex items-center justify-between rounded-[3px] px-3 py-2 text-xs font-medium transition-all",
                  activeTab === "optimizer"
                    ? "bg-[#17171c] text-[#dad7de] border border-[#31313a] shadow-keyline"
                    : "text-[#aeaac0] hover:bg-[#17171c] hover:text-[#dad7de]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Zap
                    size={14}
                    className={activeTab === "optimizer" ? "text-[#f59e0b]" : "text-[#8b8e9c]"}
                  />
                  <span>Revenue Optimizer</span>
                </div>
                <span className="rounded-[3px] bg-[#25252d] text-[#aeaac0] px-1.5 py-0.2 text-[9px] font-mono border border-[#31313a]">
                  Core
                </span>
              </button>

              <button
                onClick={() => onSelectTab("health")}
                className={clsx(
                  "w-full flex items-center justify-between rounded-[3px] px-3 py-2 text-xs font-medium transition-all",
                  activeTab === "health"
                    ? "bg-[#17171c] text-[#dad7de] border border-[#31313a] shadow-keyline"
                    : "text-[#aeaac0] hover:bg-[#17171c] hover:text-[#dad7de]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Globe
                    size={14}
                    className={activeTab === "health" ? "text-[#38bdf8]" : "text-[#8b8e9c]"}
                  />
                  <span>Payment Health</span>
                </div>
                <span className="rounded-[3px] bg-[#25252d] text-[#38bdf8] px-1.5 py-0.2 text-[9px] font-mono border border-[#31313a]">
                  Live
                </span>
              </button>

              <button
                onClick={() => onSelectTab("action-center")}
                className={clsx(
                  "w-full flex items-center justify-between rounded-[3px] px-3 py-2 text-xs font-medium transition-all",
                  activeTab === "action-center"
                    ? "bg-[#17171c] text-[#dad7de] border border-[#31313a] shadow-keyline"
                    : "text-[#aeaac0] hover:bg-[#17171c] hover:text-[#dad7de]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Gift
                    size={14}
                    className={activeTab === "action-center" ? "text-[#00d4aa]" : "text-[#8b8e9c]"}
                  />
                  <span>AI Action Center</span>
                </div>
                <span className="rounded-[3px] bg-[#25252d] text-[#dad7de] px-1.5 py-0.2 text-[10px] font-mono border border-[#31313a]">
                  5
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Bottom Section ────────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-3">
        {/* AI Saved This Month Card (10px radius) */}
        <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-4 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-[0.057em] text-[#8b8e9c]">
            AI SAVED THIS MONTH
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[#00d4aa]">
            +$248K
          </p>
          <p className="text-[11px] text-[#62626f]">from smarter payments</p>

          <div className="mt-3.5 flex flex-col gap-2 border-t border-[#31313a] pt-2.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-[#8b8e9c]">More checkouts</span>
              <span className="font-mono font-semibold text-[#00d4aa]">+$84K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b8e9c]">Recovered failed</span>
              <span className="font-mono font-semibold text-[#00d4aa]">+$142K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b8e9c]">Fraud prevented</span>
              <span className="font-mono font-semibold text-[#00d4aa]">+$38K</span>
            </div>
          </div>
        </div>

        {/* Merchant Account Footer */}
        <div className="flex items-center gap-2.5 rounded-[3px] border border-[#31313a] bg-[#17171c] p-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-[#25252d] font-mono text-[#dad7de] text-xs">
            A
          </div>
          <div>
            <p className="text-xs font-medium text-[#dad7de]">Acme Commerce</p>
            <p className="text-[10px] text-[#62626f] font-mono">Enterprise · $4.2M/mo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
