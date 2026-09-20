"use client";
// ============================================================
// Unicorn Studio — Top Navbar Component
// ============================================================

import React from "react";
import type { ActiveTab } from "@/lib/stripeData";
import { Bell, Sparkles } from "lucide-react";

interface Props {
  activeTab: ActiveTab;
  onOpenSuggestions: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  home: {
    title: "Home",
    subtitle: "Your payments at a glance",
  },
  optimizer: {
    title: "Revenue Optimizer",
    subtitle: "Find hidden revenue in your payments",
  },
  health: {
    title: "Payment Health",
    subtitle: "How your payments compare globally",
  },
  "action-center": {
    title: "AI Action Center",
    subtitle: "AI-suggested improvements, ready to apply",
  },
};

export default function TopNavbar({ activeTab, onOpenSuggestions }: Props) {
  const current = TAB_TITLES[activeTab];

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#31313a] bg-[#08080a] px-8 sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-sm font-medium tracking-tight text-[#dad7de]">{current.title}</h2>
        <p className="text-xs text-[#8b8e9c]">{current.subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Health Status Indicator */}
        <div className="flex items-center gap-2 rounded-[3px] border border-[#31313a] bg-[#0d0d12] px-3 py-1 text-xs font-mono text-[#aeaac0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4aa] shadow-[0_0_6px_#00d4aa]" />
          <span>Payments Running Normally</span>
        </div>

        {/* Ghost Notifications Bell (3px radius, #8b8e9c border) */}
        <button
          className="relative rounded-[3px] border border-[#31313a] bg-[#17171c] p-2 text-[#8b8e9c] hover:text-[#dad7de] hover:border-[#8b8e9c] transition-all"
          title="Alerts"
        >
          <Bell size={15} />
          <span className="absolute 1.5 top-1.5 flex h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
        </button>

        {/* Primary Action Button (Unicorn Studio signature cream filled button: #dad7de bg, #08080a text, 3px radius, keyline shadow) */}
        <button
          onClick={onOpenSuggestions}
          className="flex items-center gap-1.5 rounded-[3px] bg-[#dad7de] px-4 py-2 text-xs font-medium text-[#08080a] shadow-keyline hover:bg-[#ffffff] transition-all"
        >
          <Sparkles size={13} />
          <span>View AI Suggestions</span>
        </button>
      </div>
    </header>
  );
}
