"use client";
// ============================================================
// Monetization Funnel + Revenue Sidebar
// ============================================================
// Implements Slide 5 funnel: Attempted → Fraud Block → Retry → Approved GMV
// + Tier 1/2/3 revenue capture sidebar

import React from "react";
import type { DashboardMetrics } from "@/lib/types";
import { fmtUSD, fmtPct } from "@/lib/simulationLoop";
import { clsx } from "clsx";

// ── Funnel stage data ─────────────────────────────────────────
interface FunnelStage {
  label: string;
  sublabel: string;
  count: number;
  pct: number;
  color: string;
  bgColor: string;
  borderColor: string;
  tag?: string;
  tagColor?: string;
}

function buildFunnelStages(metrics: DashboardMetrics): FunnelStage[] {
  const attempted = metrics.totalAttempted;
  if (attempted === 0) return [];

  const afterFraud = attempted - metrics.totalFraudBlocked;
  const afterFraudPct = (afterFraud / attempted) * 100;

  const softDeclined = metrics.totalSoftDeclined;
  const retried = Math.round(softDeclined * 0.65); // approximation shown
  const afterRetry = afterFraud - softDeclined + retried;
  const afterRetryPct = (afterRetry / attempted) * 100;

  const finalApproved = metrics.totalApproved;
  const finalPct = (finalApproved / attempted) * 100;

  return [
    {
      label: "Attempted Transactions",
      sublabel: `${attempted.toLocaleString()} total`,
      count: attempted,
      pct: 100,
      color: "#635bff",
      bgColor: "rgba(99,91,255,0.08)",
      borderColor: "rgba(99,91,255,0.3)",
    },
    {
      label: "After Radar Fraud Block",
      sublabel: `${metrics.totalFraudBlocked.toLocaleString()} blocked`,
      count: afterFraud,
      pct: afterFraudPct,
      color: "#a855f7",
      bgColor: "rgba(168,85,247,0.06)",
      borderColor: "rgba(168,85,247,0.25)",
      tag: `−${fmtPct(100 - afterFraudPct)} Fraud`,
      tagColor: "#a855f7",
    },
    {
      label: "After Intelligent Retry",
      sublabel: `${retried.toLocaleString()} recovered`,
      count: afterRetry,
      pct: afterRetryPct,
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.06)",
      borderColor: "rgba(245,158,11,0.25)",
      tag: `+${retried.toLocaleString()} Recovered`,
      tagColor: "#00d4aa",
    },
    {
      label: "Final Approved GMV",
      sublabel: fmtUSD(metrics.totalGmvCents),
      count: finalApproved,
      pct: finalPct,
      color: "#00d4aa",
      bgColor: "rgba(0,212,170,0.06)",
      borderColor: "rgba(0,212,170,0.3)",
      tag: `${fmtPct(finalPct)} Auth Rate`,
      tagColor: "#00d4aa",
    },
  ];
}

// ── Funnel bar ────────────────────────────────────────────────
function FunnelBar({ stage, maxCount, index }: {
  stage: FunnelStage;
  maxCount: number;
  index: number;
}) {
  const widthPct = Math.max((stage.count / maxCount) * 100, 8);

  return (
    <div className="flex items-center gap-3">
      {/* Index */}
      <span className="w-4 text-center text-[10px] font-bold text-brand-dim_text">{index + 1}</span>

      {/* Bar + label */}
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-brand-text">{stage.label}</span>
          <div className="flex items-center gap-2">
            {stage.tag && (
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-semibold border"
                style={{ color: stage.tagColor, borderColor: `${stage.tagColor}40`, backgroundColor: `${stage.tagColor}15` }}
              >
                {stage.tag}
              </span>
            )}
            <span className="font-mono text-[10px] text-brand-muted_text">{stage.count.toLocaleString()}</span>
            <span className="font-mono text-[10px] font-bold" style={{ color: stage.color }}>
              {fmtPct(stage.pct)}
            </span>
          </div>
        </div>
        <div className="relative h-7 rounded overflow-hidden" style={{ backgroundColor: stage.bgColor }}>
          <div
            className="h-full rounded transition-all duration-700"
            style={{
              width: `${widthPct}%`,
              backgroundColor: stage.color,
              opacity: 0.7,
              boxShadow: `0 0 12px ${stage.color}40`,
            }}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium" style={{ color: stage.color }}>
            {stage.sublabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Revenue sidebar ───────────────────────────────────────────
function RevenueSidebar({ metrics }: { metrics: DashboardMetrics }) {
  const total = metrics.totalRevenueCents;
  const t2 = metrics.tier2RevenueCents;
  const t3 = metrics.tier3RevenueCents;
  const t2Pct = total > 0 ? (t2 / total) * 100 : 0;
  const t3Pct = total > 0 ? (t3 / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <h4 className="text-sm font-semibold text-brand-text">Revenue Capture</h4>
        <p className="text-xs text-brand-dim_text">Slide 5 · 3-Tier Model</p>
      </div>

      {/* Tiers */}
      {[
        {
          tier: "Tier 1",
          name: "Bundled",
          desc: "All processing volume",
          value: 0,
          color: "#2a2a3a",
          textColor: "#64748b",
          badge: "Included",
        },
        {
          tier: "Tier 2",
          name: "Intelligence Pro",
          desc: "$0.02 × screened txns",
          value: t2,
          color: "#635bff",
          textColor: "#635bff",
          badge: `${metrics.totalAttempted > 0 ? Math.round((metrics.totalAttempted - metrics.totalAttempted * 0.4)) : 0} screened`,
        },
        {
          tier: "Tier 3",
          name: "Outcome-Linked",
          desc: "RecGMV × negotiated %",
          value: t3,
          color: "#00d4aa",
          textColor: "#00d4aa",
          badge: fmtUSD(metrics.recoveredGmvCents) + " recovered",
        },
      ].map((t) => (
        <div
          key={t.tier}
          className={clsx(
            "rounded-lg border p-3 transition-all",
            t.value > 0 ? "border-brand-border" : "border-brand-border/40 opacity-60"
          )}
          style={{ borderLeftColor: t.color, borderLeftWidth: 3 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim_text">{t.tier}</p>
              <p className="text-xs font-semibold text-brand-text">{t.name}</p>
              <p className="text-[10px] text-brand-dim_text mt-0.5">{t.desc}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-base font-bold" style={{ color: t.textColor }}>
                {t.value === 0 ? "$0" : fmtUSD(t.value)}
              </p>
              <p className="text-[9px] text-brand-dim_text mt-0.5">{t.badge}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Stacked bar */}
      {total > 0 && (
        <div>
          <p className="mb-1 text-[10px] text-brand-dim_text uppercase tracking-widest">Revenue Mix</p>
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${t2Pct}%`, backgroundColor: "#635bff" }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${t3Pct}%`, backgroundColor: "#00d4aa" }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-brand-dim_text">
            <span>T2 {t2Pct.toFixed(0)}%</span>
            <span>Total: <span className="text-brand-stripe font-bold">{fmtUSD(total)}</span></span>
            <span>T3 {t3Pct.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Fraud savings card */}
      <div className="rounded-lg border border-brand-purple/20 bg-brand-purple-dim/10 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-purple">Radar Fraud Savings</p>
        <p className="font-mono text-lg font-bold text-brand-text">{fmtUSD(metrics.fraudCostSavedCents)}</p>
        <p className="text-[10px] text-brand-dim_text">{metrics.totalFraudBlocked} fraud blocks · avg \$52/loss prevented</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
interface Props {
  metrics: DashboardMetrics;
}

export default function MonetizationFunnel({ metrics }: Props) {
  const stages = buildFunnelStages(metrics);
  const maxCount = stages[0]?.count ?? 1;

  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brand-text">Monetization & Conversion Funnel</h3>
          <p className="text-xs text-brand-dim_text">Payment Intelligence Stack · Slide 5</p>
        </div>
        {metrics.totalAttempted > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-brand-dim_text">Optimized Auth Rate</p>
            <p className="font-mono text-lg font-bold text-brand-green">{fmtPct(metrics.overallAuthRate)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Funnel */}
        <div className="flex flex-col gap-3">
          {stages.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-brand-dim_text text-sm">
              Awaiting simulation data…
            </div>
          ) : (
            stages.map((stage, i) => (
              <FunnelBar key={stage.label} stage={stage} maxCount={maxCount} index={i} />
            ))
          )}
        </div>

        {/* Revenue sidebar */}
        <div className="border-t border-brand-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <RevenueSidebar metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
