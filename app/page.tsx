"use client";
// ============================================================
// Stripe B2B Analytics Dashboard — Main Application Entry
// ============================================================
// Theme: Stripe Dark B2B Analytics Dashboard
// Palette: Dark Canvas (#090b10), Cards (#11141e), Stripe Blurple (#635bff),
// Emerald (#00d4aa), Amber (#f59e0b), Red (#ef4444), Cyan (#38bdf8).
// Fonts: Plus Jakarta Sans + JetBrains Mono for razor-sharp telemetry.

import React, { useState } from "react";
import type { ActiveTab } from "@/lib/stripeData";
import Sidebar from "@/components/stripe/Sidebar";
import TopNavbar from "@/components/stripe/TopNavbar";
import HomeView from "@/components/stripe/views/HomeView";
import RevenueOptimizerView from "@/components/stripe/views/RevenueOptimizerView";
import PaymentHealthView from "@/components/stripe/views/PaymentHealthView";
import ActionCenterView from "@/components/stripe/views/ActionCenterView";
import Slide5MonetizationBanner from "@/components/dashboard/Slide5MonetizationBanner";
import { useSimulation } from "@/lib/simulationLoop";
import { DEFAULT_PARAMS } from "@/lib/types";
import { Award, ChevronDown, ChevronUp } from "lucide-react";

export default function StripeIntelligenceApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showSlideProof, setShowSlideProof] = useState(false);
  const [simState] = useSimulation(DEFAULT_PARAMS);

  return (
    <div className="flex min-h-screen bg-[#08080a] text-[#dad7de] font-sans antialiased selection:bg-[#ab8ff1] selection:text-[#08080a]">
      {/* ── Persistent Sidebar ────────────────────────────────── */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* ── Main Canvas Workstation ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Navbar */}
        <TopNavbar
          activeTab={activeTab}
          onOpenSuggestions={() => setActiveTab("action-center")}
        />

        {/* ── Case Competition Slide 5 Evaluation Drawer ────────── */}
        <div className="px-8 pt-6 max-w-7xl w-full mx-auto">
          <div className="flex items-center justify-between rounded-[10px] border border-[#31313a] bg-[#17171c] px-4 py-3 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <Award size={16} className="text-[#ab8ff1]" />
              <span className="font-bold text-[#dad7de] uppercase tracking-wider text-[11px]">
                Case Competition Mode:
              </span>
              <span className="text-[#8b8e9c]">
                Slide 5 3-Tier Monetization Model ($0 Bundled · $0.02 Pro · Outcome-Linked Uplift)
              </span>
            </div>
            <button
              onClick={() => setShowSlideProof(!showSlideProof)}
              className="flex items-center gap-1.5 rounded-[3px] border border-[#31313a] bg-[#25252d] px-3.5 py-1.5 text-xs font-semibold text-[#dad7de] hover:bg-[#31313a] transition-all"
            >
              <span>{showSlideProof ? "Hide Slide 5 Math" : "Verify Slide 5 Math"}</span>
              {showSlideProof ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>

          {showSlideProof && (
            <div className="mt-3">
              <Slide5MonetizationBanner
                metrics={simState.metrics}
                tier3NegotiatedPct={DEFAULT_PARAMS.tier3NegotiatedPct}
              />
            </div>
          )}
        </div>

        {/* ── Active View Rendering ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-16">
          {activeTab === "home" && <HomeView />}
          {activeTab === "optimizer" && <RevenueOptimizerView />}
          {activeTab === "health" && <PaymentHealthView />}
          {activeTab === "action-center" && <ActionCenterView />}
        </main>
      </div>
    </div>
  );
}
