"use client";
// ============================================================
// Stripe B2B Analytics Dashboard — AI Action Center View
// ============================================================
// High-contrast action cards with visual confidence meters,
// distinct warnings, and bold execution buttons.

import React, { useState } from "react";
import { INITIAL_ACTION_CARDS, ActionCenterCard } from "@/lib/stripeData";
import {
  Smartphone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Zap,
  FlaskConical,
} from "lucide-react";
import { clsx } from "clsx";

export default function ActionCenterView() {
  const [cards, setCards] = useState<ActionCenterCard[]>(INITIAL_ACTION_CARDS);

  const handleAction = (id: string, action: "test" | "apply") => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          appliedState: action === "test" ? "testing" : "applied",
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto">
      {/* ── Action Cards Stack ────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {cards.map((card) => {
          const isApple = card.id === "action-apple-pay";

          return (
            <div
              key={card.id}
              className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm transition-all hover:border-[#3d3d48]"
            >
              {/* Top Row: Icon, Title, Badge */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#0d0d12] border border-[#31313a] text-[#ab8ff1]">
                  {isApple ? <Smartphone size={18} /> : <FileText size={18} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-[#dad7de]">
                      {card.title}
                    </h3>
                    <span
                      className={clsx(
                        "rounded-[3px] px-2 py-0.5 text-[10px] font-bold uppercase border",
                        card.statusPillType === "safe"
                          ? "bg-[#00d4aa]/15 text-[#00d4aa] border-[#00d4aa]/30"
                          : "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30"
                      )}
                    >
                      {card.statusPill}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-[#aeaac0] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* "Why now" Box */}
              <div className="mt-4 rounded-[6px] bg-[#0d0d12] p-3 text-xs text-[#aeaac0] border border-[#31313a]">
                <span className="font-bold text-[#dad7de]">Why now: </span>
                {card.whyNow.replace("Why now: ", "")}
              </div>

              {/* Metrics Row: Area, Timeline, Expected Gain, AI Confidence */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-[#25252d] py-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8e9c]">
                    AREA
                  </span>
                  <p className="mt-1 font-semibold text-[#dad7de]">{card.area}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8e9c]">
                    TIMELINE
                  </span>
                  <p className="mt-1 font-semibold text-[#dad7de]">{card.timeline}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8e9c]">
                    EXPECTED GAIN
                  </span>
                  <p className="mt-1 font-mono text-sm font-bold text-[#00d4aa]">
                    {card.expectedGain}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-[#8b8e9c]">
                      AI CONFIDENCE
                    </span>
                    <span className="font-mono font-bold text-[#dad7de]">
                      {card.confidence}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[#25252d] overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        card.confidence > 75 ? "bg-[#00d4aa]" : "bg-[#f59e0b]"
                      )}
                      style={{ width: `${card.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Status notice */}
                <div className="flex items-center gap-1.5 text-xs">
                  {card.statusPillType === "safe" ? (
                    <>
                      <CheckCircle2 size={15} className="text-[#00d4aa]" />
                      <span className="font-semibold text-[#00d4aa]">Safe to apply now</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={15} className="text-[#f59e0b]" />
                      <span className="font-semibold text-[#f59e0b]">
                        Recommended: test with 10% of traffic first
                      </span>
                    </>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2.5">
                  <button className="rounded-[3px] px-3 py-1.5 text-xs text-[#8b8e9c] hover:text-[#dad7de] transition-colors">
                    Not now
                  </button>

                  <button
                    onClick={() => handleAction(card.id, "test")}
                    disabled={card.appliedState !== "idle"}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-[3px] border px-3.5 py-2 text-xs font-bold transition-all",
                      card.appliedState === "testing"
                        ? "border-[#00d4aa] bg-[#00d4aa]/15 text-[#00d4aa]"
                        : "border-[#31313a] bg-[#25252d] text-[#dad7de] hover:bg-[#31313a]"
                    )}
                  >
                    <FlaskConical size={13} />
                    <span>
                      {card.appliedState === "testing"
                        ? "Testing on 10%..."
                        : "Test with 10% first"}
                    </span>
                  </button>

                  <button
                    onClick={() => handleAction(card.id, "apply")}
                    disabled={card.appliedState === "applied"}
                    className={clsx(
                      "flex items-center gap-1.5 rounded-[3px] px-4 py-2 text-xs font-bold transition-all shadow-keyline",
                      card.appliedState === "applied"
                        ? "bg-[#00d4aa] text-[#08080a]"
                        : "bg-[#dad7de] text-[#08080a] hover:bg-white"
                    )}
                  >
                    <Zap size={13} />
                    <span>
                      {card.appliedState === "applied" ? "Applied ✓" : "Apply Now"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
