"use client";
// ============================================================
// Simplified Simulation Controls & Judge Scenario Presets
// ============================================================
// Gives judges 1-click evaluation scenarios + collapsible sliders

import React, { useState } from "react";
import type { SimulationParams } from "@/lib/types";
import { SlidersHorizontal, Play, Pause, RotateCcw, ChevronDown, ChevronUp, Zap, AlertTriangle, Globe } from "lucide-react";
import { clsx } from "clsx";

interface SliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  accentColor?: string;
}

function ControlSlider({
  label,
  description,
  value,
  min,
  max,
  step,
  format,
  onChange,
  accentColor = "#635bff",
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-brand-border/60 bg-brand-bg/50 p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-text">{label}</span>
        <span
          className="rounded px-1.5 py-0.5 font-mono text-[11px] font-bold"
          style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
        >
          {format(value)}
        </span>
      </div>
      <div className="relative my-1">
        <div className="h-1.5 w-full rounded-full bg-brand-muted overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: accentColor }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      <p className="text-[9px] text-brand-dim_text">{description}</p>
    </div>
  );
}

interface Props {
  params: SimulationParams;
  onChange: (p: SimulationParams) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLoadScenario: (preset: "default" | "latency_spike" | "cross_border") => void;
}

export default function SimulationControls({
  params,
  onChange,
  isRunning,
  onStart,
  onPause,
  onReset,
  onLoadScenario,
}: Props) {
  const [showSliders, setShowSliders] = useState(false);
  const [activePreset, setActivePreset] = useState<"default" | "latency_spike" | "cross_border">("default");

  const set = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) =>
    onChange({ ...params, [key]: value });

  const handleScenario = (scenario: "default" | "latency_spike" | "cross_border") => {
    setActivePreset(scenario);
    onLoadScenario(scenario);
  };

  return (
    <div className="flex flex-col rounded-xl border border-brand-border bg-brand-surface overflow-hidden">
      {/* Top Bar: Judge One-Click Scenarios + Primary Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-brand-border/60">
        {/* Scenarios */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dim_text mr-1 hidden sm:inline">
            Judge Scenarios:
          </span>
          <button
            onClick={() => handleScenario("default")}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border",
              activePreset === "default"
                ? "border-brand-stripe bg-brand-stripe/20 text-brand-text shadow-sm"
                : "border-brand-border bg-brand-bg text-brand-muted_text hover:text-brand-text"
            )}
          >
            <Zap size={13} className="text-brand-stripe" />
            <span>Normal Operations</span>
          </button>

          <button
            onClick={() => handleScenario("latency_spike")}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border",
              activePreset === "latency_spike"
                ? "border-brand-amber bg-brand-amber/20 text-brand-text shadow-sm"
                : "border-brand-border bg-brand-bg text-brand-muted_text hover:text-brand-text"
            )}
          >
            <AlertTriangle size={13} className="text-brand-amber" />
            <span>Slide 6: Braintree Latency Spike</span>
          </button>

          <button
            onClick={() => handleScenario("cross_border")}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border",
              activePreset === "cross_border"
                ? "border-brand-green bg-brand-green/20 text-brand-text shadow-sm"
                : "border-brand-border bg-brand-bg text-brand-muted_text hover:text-brand-text"
            )}
          >
            <Globe size={13} className="text-brand-green" />
            <span>Slide 2: Cross-Border BIN Surge</span>
          </button>
        </div>

        {/* Play/Pause + Sliders Toggle */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 rounded-lg border border-brand-amber/40 bg-brand-amber/15 px-3 py-1.5 text-xs font-semibold text-brand-amber transition-all hover:bg-brand-amber/25"
            >
              <Pause size={13} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 rounded-lg border border-brand-stripe/60 bg-brand-stripe px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-brand-stripe/30 transition-all hover:bg-brand-stripe-light"
            >
              <Play size={13} />
              <span>Run Live Stream</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-brand-border bg-brand-bg px-2.5 py-1.5 text-xs font-medium text-brand-muted_text hover:text-brand-text"
            title="Reset simulation"
          >
            <RotateCcw size={12} />
          </button>

          <button
            onClick={() => setShowSliders(!showSliders)}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all",
              showSliders
                ? "border-brand-stripe/50 bg-brand-stripe/15 text-brand-stripe-light"
                : "border-brand-border bg-brand-bg text-brand-dim_text hover:text-brand-muted_text"
            )}
          >
            <SlidersHorizontal size={12} />
            <span>Tune Parameters</span>
            {showSliders ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Collapsible Sliders Panel (Only visible when user toggles) */}
      {showSliders && (
        <div className="p-3 bg-brand-bg/60 border-t border-brand-border/40">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            <ControlSlider
              label="Baseline Latency"
              description="SLA ceiling (ms)"
              value={params.baselineLatencyMs}
              min={50}
              max={800}
              step={10}
              format={(v) => `${v}ms`}
              onChange={(v) => set("baselineLatencyMs", v)}
              accentColor="#635bff"
            />
            <ControlSlider
              label="Retry Success"
              description="Auth recovery rate"
              value={params.authRetrySuccessRate}
              min={0}
              max={1}
              step={0.01}
              format={(v) => `${(v * 100).toFixed(0)}%`}
              onChange={(v) => set("authRetrySuccessRate", v)}
              accentColor="#00d4aa"
            />
            <ControlSlider
              label="Fraud Block"
              description="Radar ML block rate"
              value={params.fraudBlockRate}
              min={0}
              max={0.2}
              step={0.005}
              format={(v) => `${(v * 100).toFixed(1)}%`}
              onChange={(v) => set("fraudBlockRate", v)}
              accentColor="#a855f7"
            />
            <ControlSlider
              label="Throughput"
              description="Transactions / second"
              value={params.volumePerSecond}
              min={0.5}
              max={5}
              step={0.5}
              format={(v) => `${v}/s`}
              onChange={(v) => set("volumePerSecond", v)}
              accentColor="#f59e0b"
            />
            <ControlSlider
              label="Tier 3 Share"
              description="Outcome-linked %"
              value={params.tier3NegotiatedPct}
              min={0}
              max={0.3}
              step={0.01}
              format={(v) => `${(v * 100).toFixed(0)}%`}
              onChange={(v) => set("tier3NegotiatedPct", v)}
              accentColor="#3b82f6"
            />
            <ControlSlider
              label="Cross-Border Mix"
              description="Cross-border ratio"
              value={params.crossBorderBinMix}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${(v * 100).toFixed(0)}%`}
              onChange={(v) => set("crossBorderBinMix", v)}
              accentColor="#ef4444"
            />
          </div>
        </div>
      )}
    </div>
  );
}
