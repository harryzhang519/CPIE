"use client";
// ============================================================
// Stripe B2B Analytics Dashboard — Revenue Optimizer View
// ============================================================
// Features distinct colored sliders (Cyan, Green, Blurple, Amber),
// high-visibility metric values, and clear conversion paths.

import React, { useState } from "react";
import {
  RotateCcw,
  FileText,
  Network,
  ShieldCheck,
  Check,
  Rocket,
} from "lucide-react";
import { clsx } from "clsx";

export default function RevenueOptimizerView() {
  const [retryRate, setRetryRate] = useState(65);
  const [formFields, setFormFields] = useState(5);
  const [smartRouting, setSmartRouting] = useState(85);
  const [securityChecks, setSecurityChecks] = useState(40);
  const [appliedState, setAppliedState] = useState(false);
  const [testMode, setTestMode] = useState(true);

  // Dynamic calculations based on slider values
  const simplerCheckoutAmount = Math.round((7 - formFields) * 3000);
  const recoveredFailuresAmount = Math.round((retryRate / 65) * 27300);
  const smartRoutingAmount = Math.round((smartRouting / 85) * 34500);
  const securityChecksAmount = Math.round((securityChecks / 40) * 14400);

  // Percentages for high-visibility filled slider tracks
  const retryPct = Math.round(((retryRate - 20) / (95 - 20)) * 100);
  const formFieldsPct = Math.round(((formFields - 3) / (9 - 3)) * 100);
  const smartRoutingPct = Math.round(((smartRouting - 20) / (100 - 20)) * 100);
  const securityChecksPct = Math.round(((securityChecks - 10) / (90 - 10)) * 100);

  const handleApply = () => {
    setAppliedState(true);
    setTimeout(() => setAppliedState(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* ── Left Column: 4 Distinct Color-Coded Sliders ──────── */}
        <div className="flex flex-col gap-4">
          {/* Slider 1: Auto-Retry (Cyan) */}
          <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm hover:border-[#3d3d48] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-[6px] bg-[#38bdf8]/15 border border-[#38bdf8]/30 p-2 text-[#38bdf8]">
                  <RotateCcw size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#dad7de]">
                    Retry failed payments automatically
                  </h3>
                  <p className="text-xs text-[#8b8e9c]">
                    When a payment fails, we try again — sometimes it goes through on the second attempt
                  </p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2.5 py-1 rounded-[3px]">
                {retryRate}%
              </span>
            </div>

            <div className="mt-5 pl-11">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8b8e9c] mb-1.5">
                <span>Min: 20%</span>
                <span className="text-[#38bdf8] font-bold">Selected: {retryRate}%</span>
                <span>Max: 95%</span>
              </div>
              <input
                type="range"
                min={20}
                max={95}
                step={1}
                value={retryRate}
                onChange={(e) => setRetryRate(Number(e.target.value))}
                style={{
                  color: "#38bdf8",
                  background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${retryPct}%, #25252d ${retryPct}%, #25252d 100%)`,
                }}
                className="w-full cursor-pointer h-2.5 rounded-full"
              />
              <div className="mt-2 flex justify-between text-[10px] font-medium text-[#62626f]">
                <span>Fewer retries — less aggressive</span>
                <span>More retries — recover more failed payments</span>
              </div>
            </div>
          </div>

          {/* Slider 2: Form Fields (Emerald Green) */}
          <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm hover:border-[#3d3d48] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-[6px] bg-[#00d4aa]/15 border border-[#00d4aa]/30 p-2 text-[#00d4aa]">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#dad7de]">
                    Number of fields in checkout form
                  </h3>
                  <p className="text-xs text-[#8b8e9c]">
                    Fewer fields = less friction = more customers finish buying
                  </p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-[#00d4aa] bg-[#00d4aa]/10 border border-[#00d4aa]/30 px-2.5 py-1 rounded-[3px]">
                {formFields} fields
              </span>
            </div>

            <div className="mt-5 pl-11">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8b8e9c] mb-1.5">
                <span>Min: 3 fields</span>
                <span className="text-[#00d4aa] font-bold">Selected: {formFields} fields</span>
                <span>Max: 9 fields</span>
              </div>
              <input
                type="range"
                min={3}
                max={9}
                step={1}
                value={formFields}
                onChange={(e) => setFormFields(Number(e.target.value))}
                style={{
                  color: "#00d4aa",
                  background: `linear-gradient(to right, #00d4aa 0%, #00d4aa ${formFieldsPct}%, #25252d ${formFieldsPct}%, #25252d 100%)`,
                }}
                className="w-full cursor-pointer h-2.5 rounded-full"
              />
              <div className="mt-2 flex justify-between text-[10px] font-medium text-[#62626f]">
                <span>Minimal form — fastest checkout</span>
                <span>More info collected — slower for customer</span>
              </div>
            </div>
          </div>

          {/* Slider 3: AI Routing (Stripe Blurple / Lavender Beam) */}
          <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm hover:border-[#3d3d48] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-[6px] bg-[#ab8ff1]/20 border border-[#ab8ff1]/40 p-2 text-[#ab8ff1]">
                  <Network size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#dad7de]">
                    Smart payment routing (AI-powered)
                  </h3>
                  <p className="text-xs text-[#8b8e9c]">
                    AI picks the best payment network for each transaction to maximize success
                  </p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-[#ab8ff1] bg-[#ab8ff1]/15 border border-[#ab8ff1]/40 px-2.5 py-1 rounded-[3px]">
                {smartRouting}%
              </span>
            </div>

            <div className="mt-5 pl-11">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8b8e9c] mb-1.5">
                <span>Min: 20%</span>
                <span className="text-[#ab8ff1] font-bold">Selected: {smartRouting}%</span>
                <span>Max: 100%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={smartRouting}
                onChange={(e) => setSmartRouting(Number(e.target.value))}
                style={{
                  color: "#ab8ff1",
                  background: `linear-gradient(to right, #ab8ff1 0%, #ab8ff1 ${smartRoutingPct}%, #25252d ${smartRoutingPct}%, #25252d 100%)`,
                }}
                className="w-full cursor-pointer h-2.5 rounded-full"
              />
              <div className="mt-2 flex justify-between text-[10px] font-medium text-[#62626f]">
                <span>Standard routing only</span>
                <span>Full AI routing — highest success rates</span>
              </div>
            </div>
          </div>

          {/* Slider 4: EU Security Checks (Amber) */}
          <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-5 shadow-sm hover:border-[#3d3d48] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-[6px] bg-[#f59e0b]/15 border border-[#f59e0b]/30 p-2 text-[#f59e0b]">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#dad7de]">
                    Extra security checks (required in Europe)
                  </h3>
                  <p className="text-xs text-[#8b8e9c]">
                    European law requires this for some payments — but it adds an extra step for customers
                  </p>
                </div>
              </div>
              <span className="font-mono text-xl font-extrabold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2.5 py-1 rounded-[3px]">
                {securityChecks}%
              </span>
            </div>

            <div className="mt-5 pl-11">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8b8e9c] mb-1.5">
                <span>Min: 10%</span>
                <span className="text-[#f59e0b] font-bold">Selected: {securityChecks}%</span>
                <span>Max: 90%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={securityChecks}
                onChange={(e) => setSecurityChecks(Number(e.target.value))}
                style={{
                  color: "#f59e0b",
                  background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${securityChecksPct}%, #25252d ${securityChecksPct}%, #25252d 100%)`,
                }}
                className="w-full cursor-pointer h-2.5 rounded-full"
              />
              <div className="mt-2 flex justify-between text-[10px] font-medium text-[#62626f]">
                <span>Fewer extra steps — smoother for customer</span>
                <span>More checks — legally safer, but more friction</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Where the Revenue Comes From ────────── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[10px] border border-[#31313a] bg-[#17171c] p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8e9c]">
              WHERE THE REVENUE COMES FROM
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              {/* Item 1 */}
              <div className="flex items-start justify-between gap-3 border-b border-[#25252d] pb-3.5">
                <div>
                  <p className="text-xs font-bold text-[#dad7de]">Simpler checkout</p>
                  <p className="text-[11px] text-[#8b8e9c] mt-0.5">
                    {formFields} fields → customers finish more purchases
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#00d4aa]">
                    +${(simplerCheckoutAmount / 1000).toFixed(1)}K
                  </span>
                  <p className="text-[10px] text-[#62626f] font-mono">+1.8% conversion</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between gap-3 border-b border-[#25252d] pb-3.5">
                <div>
                  <p className="text-xs font-bold text-[#dad7de]">Recovered failures</p>
                  <p className="text-[11px] text-[#8b8e9c] mt-0.5">
                    Retrying failed payments at {retryRate}% intensity
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#38bdf8]">
                    +${recoveredFailuresAmount.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#62626f] font-mono">+1.2% recovered</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start justify-between gap-3 border-b border-[#25252d] pb-3.5">
                <div>
                  <p className="text-xs font-bold text-[#dad7de]">Fraud prevention</p>
                  <p className="text-[11px] text-[#8b8e9c] mt-0.5">
                    Blocking payments with risk score ≥ 54
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#ef4444]">
                    -$3,900
                  </span>
                  <p className="text-[10px] text-[#62626f] font-mono">Strict mode</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start justify-between gap-3 border-b border-[#25252d] pb-3.5">
                <div>
                  <p className="text-xs font-bold text-[#dad7de]">Smart routing</p>
                  <p className="text-[11px] text-[#8b8e9c] mt-0.5">
                    {smartRouting}% of payments routed by AI
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#ab8ff1]">
                    +${smartRoutingAmount.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#62626f] font-mono">+0.5% success</p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#dad7de]">Security checks</p>
                  <p className="text-[11px] text-[#8b8e9c] mt-0.5">
                    {securityChecks}% of EU payments get extra verification
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#f59e0b]">
                    +${securityChecksAmount.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#62626f] font-mono">-0.4% friction</p>
                </div>
              </div>
            </div>

            {/* Apply Button in Unicorn Studio Primary Cream / Green when applied */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleApply}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 rounded-[3px] py-3 text-xs font-bold transition-all shadow-keyline",
                  appliedState
                    ? "bg-[#00d4aa] text-[#08080a]"
                    : "bg-[#dad7de] text-[#08080a] hover:bg-white"
                )}
              >
                {appliedState ? (
                  <>
                    <Check size={16} />
                    <span>Settings Applied Successfully!</span>
                  </>
                ) : (
                  <>
                    <Rocket size={15} />
                    <span>Apply These Settings</span>
                  </>
                )}
              </button>

              <label className="flex items-center justify-center gap-2 cursor-pointer text-xs text-[#8b8e9c]">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="rounded-[3px] border-[#31313a] bg-[#0d0d12] text-[#ab8ff1] focus:ring-0"
                />
                <span>Test with 10% of Traffic First</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
