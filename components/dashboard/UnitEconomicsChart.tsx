"use client";
// ============================================================
// Unit Economics Chart — Waterfall + Auth Uplift Bar Chart
// ============================================================

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";
import type { DashboardMetrics, WaterfallEntry } from "@/lib/types";
import { buildWaterfallData } from "@/lib/monetizationEngine";
import { fmtUSD } from "@/lib/simulationLoop";

// ── Custom Waterfall Tooltip ──────────────────────────────────
function WaterfallTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as WaterfallEntry;
  if (!d) return null;
  const val = typeof d.value === "number" ? d.value : 0;
  const cum = typeof d.cumulative === "number" ? d.cumulative : 0;
  return (
    <div className="rounded-lg border border-brand-border bg-brand-bg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-brand-text mb-1">{d.name || "Item"}</p>
      <p className={val >= 0 ? "text-brand-green" : "text-brand-red"}>
        {val >= 0 ? "+" : ""}{fmtUSD(Math.abs(val))}
      </p>
      <p className="text-brand-dim_text">Cumulative: {fmtUSD(cum)}</p>
    </div>
  );
}

// ── Auth Uplift Tooltip ───────────────────────────────────────
function UpliftTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const p0 = payload[0]?.value;
  const p1 = payload[1]?.value;
  return (
    <div className="rounded-lg border border-brand-border bg-brand-bg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-brand-text mb-1">{label}</p>
      {payload.map((p: any) => {
        const num = typeof p.value === "number" ? p.value : 0;
        return (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {num.toFixed(1)}%
          </p>
        );
      })}
      {typeof p0 === "number" && typeof p1 === "number" && (
        <p className="text-brand-green mt-1 font-semibold">
          Uplift: +{(p1 - p0).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

// ── Waterfall chart ───────────────────────────────────────────
function WaterfallChart({ data }: { data: WaterfallEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-brand-dim_text text-sm">
        Awaiting data…
      </div>
    );
  }

  // For Recharts waterfall: use stacked bars with invisible base + colored segment
  const chartData = data.map((d) => {
    const isTotal = d.type === "total";
    const base = isTotal ? 0 : d.cumulative - d.value;
    const segment = Math.abs(d.value);
    return { ...d, base: isTotal ? 0 : Math.min(base, d.cumulative), segment };
  });

  const maxVal = Math.max(...data.map((d) => d.cumulative));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={48}
        />
        <YAxis
          tickFormatter={(v) => fmtUSD(v)}
          tick={{ fill: "#64748b", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<WaterfallTooltip />} />
        {/* Invisible base bar */}
        <Bar dataKey="base" stackId="w" fill="transparent" />
        {/* Colored segment bar */}
        <Bar dataKey="segment" stackId="w" radius={[3, 3, 0, 0]}>
          {chartData.map((d, i) => (
            <Cell
              key={i}
              fill={
                d.type === "total"
                  ? "#635bff"
                  : d.value >= 0
                  ? "#00d4aa"
                  : "#ef4444"
              }
              fillOpacity={d.type === "total" ? 1 : 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Auth uplift bar chart ─────────────────────────────────────
function UpliftChart({ metrics }: { metrics: DashboardMetrics }) {
  const data = (["SaaS", "Retail", "Travel"] as const).map((v) => ({
    vertical: v,
    Baseline: metrics.authUpliftByVertical[v].baseline,
    Optimized: metrics.authUpliftByVertical[v].optimized,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
        <XAxis
          dataKey="vertical"
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[88, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: "#64748b", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          width={38}
        />
        <Tooltip content={<UpliftTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: "#94a3b8", fontSize: 10 }}>{value}</span>
          )}
          iconSize={8}
        />
        <Bar dataKey="Baseline" fill="#2a2a3a" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Optimized" fill="#635bff" radius={[3, 3, 0, 0]} fillOpacity={0.9} />
        <ReferenceLine
          y={97}
          stroke="#00d4aa"
          strokeDasharray="4 2"
          strokeWidth={1}
          label={{ value: "Target", fill: "#00d4aa", fontSize: 9, position: "right" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Main component ────────────────────────────────────────────
interface Props {
  metrics: DashboardMetrics;
}

export default function UnitEconomicsChart({ metrics }: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const waterfallData = buildWaterfallData(metrics);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-brand-border bg-brand-surface p-4 h-64 animate-pulse flex items-center justify-center text-brand-dim_text text-xs">
          Loading charts...
        </div>
        <div className="rounded-xl border border-brand-border bg-brand-surface p-4 h-64 animate-pulse flex items-center justify-center text-brand-dim_text text-xs">
          Loading charts...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {/* Left: Waterfall */}
      <div className="rounded-xl border border-brand-border bg-brand-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand-text">Unit Economics Waterfall</h3>
            <p className="text-xs text-brand-dim_text">Gross Revenue → Net after costs & savings</p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-green" /> Gain</span>
            <span className="flex items-center gap-1 text-brand-dim_text"><span className="h-2 w-2 rounded-full bg-brand-red" /> Cost</span>
            <span className="flex items-center gap-1 text-brand-dim_text"><span className="h-2 w-2 rounded-full bg-brand-stripe" /> Total</span>
          </div>
        </div>
        <WaterfallChart data={waterfallData} />
        {waterfallData.length > 0 && (
          <div className="mt-2 flex justify-between text-[10px] text-brand-dim_text">
            <span>Interchange cost: <span className="text-brand-red">{fmtUSD(metrics.interchangeCostCents)}</span></span>
            <span>Fraud savings: <span className="text-brand-green">{fmtUSD(metrics.fraudCostSavedCents)}</span></span>
          </div>
        )}
      </div>

      {/* Right: Auth uplift per vertical */}
      <div className="rounded-xl border border-brand-border bg-brand-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand-text">Authorization Uplift by Vertical</h3>
            <p className="text-xs text-brand-dim_text">Baseline vs. Optimized auth rate · +2.2% avg uplift</p>
          </div>
          <span className="rounded bg-brand-green-dim px-2 py-0.5 text-[10px] font-semibold text-brand-green border border-brand-green/20">
            +2.2% Avg
          </span>
        </div>
        <UpliftChart metrics={metrics} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["SaaS", "Retail", "Travel"] as const).map((v) => {
            const uplift = metrics.authUpliftByVertical[v];
            const delta = (uplift.optimized - uplift.baseline).toFixed(2);
            return (
              <div key={v} className="rounded-lg border border-brand-border bg-brand-bg p-2">
                <p className="text-[9px] uppercase tracking-widest text-brand-dim_text">{v}</p>
                <p className="font-mono text-xs font-bold text-brand-text">{uplift.optimized.toFixed(1)}%</p>
                <p className="text-[10px] text-brand-green font-semibold">+{delta}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
