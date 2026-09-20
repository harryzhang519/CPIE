"use client";
// ============================================================
// Simulation Loop — Custom React Hook
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardMetrics, SimulationParams, Transaction } from "./types";
import { generateTransaction, resetCounter } from "./routingEngine";
import { calculateMetrics } from "./monetizationEngine";

const MAX_HISTORY = 500; // rolling window for metric aggregation
const LOG_SIZE = 8; // compact, high-signal log size

export interface SimulationState {
  transactions: Transaction[]; // last LOG_SIZE for display
  allTransactions: Transaction[]; // up to MAX_HISTORY for metrics
  metrics: DashboardMetrics;
  isRunning: boolean;
}

export interface SimulationControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  loadScenario: (preset: "default" | "latency_spike" | "cross_border") => void;
}

function getInitialBatch(params: SimulationParams): Transaction[] {
  resetCounter();
  const batch: Transaction[] = [];
  for (let i = 0; i < 24; i++) {
    batch.push(generateTransaction(params));
  }
  return batch;
}

export function useSimulation(
  params: SimulationParams
): [SimulationState, SimulationControls] {
  const initialBatch = useRef<Transaction[]>(getInitialBatch(params));
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => initialBatch.current);
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    [...initialBatch.current].reverse().slice(0, LOG_SIZE)
  );
  const [metrics, setMetrics] = useState<DashboardMetrics>(() =>
    calculateMetrics(initialBatch.current, params)
  );
  const [isRunning, setIsRunning] = useState(false);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const allTxnsRef = useRef<Transaction[]>(initialBatch.current);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const txn = generateTransaction(paramsRef.current);
    const nextAll = [...allTxnsRef.current, txn].slice(-MAX_HISTORY);
    allTxnsRef.current = nextAll;

    setAllTransactions(nextAll);
    setMetrics(calculateMetrics(nextAll, paramsRef.current));
    setTransactions((prev) => [txn, ...prev].slice(0, LOG_SIZE));
  }, []);

  const scheduleInterval = useCallback(
    (vps: number) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const ms = Math.round(1000 / Math.max(vps, 0.1));
      intervalRef.current = setInterval(tick, ms);
    },
    [tick]
  );

  // When volumePerSecond changes while running, reschedule
  useEffect(() => {
    if (isRunning) {
      scheduleInterval(params.volumePerSecond);
    }
  }, [params.volumePerSecond, isRunning, scheduleInterval]);

  // Recompute metrics when other params change
  useEffect(() => {
    if (allTxnsRef.current.length > 0) {
      setMetrics(calculateMetrics(allTxnsRef.current, params));
    }
  }, [
    params.authRetrySuccessRate,
    params.fraudBlockRate,
    params.tier3NegotiatedPct,
    params.crossBorderBinMix,
    params.baselineLatencyMs,
  ]);

  const start = useCallback(() => {
    setIsRunning(true);
    scheduleInterval(paramsRef.current.volumePerSecond);
  }, [scheduleInterval]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    resetCounter();
    allTxnsRef.current = [];
    setTransactions([]);
    setAllTransactions([]);
    setMetrics(calculateMetrics([], paramsRef.current));
  }, [pause]);

  const loadScenario = useCallback(
    (preset: "default" | "latency_spike" | "cross_border") => {
      pause();
      const newParams = { ...paramsRef.current };
      if (preset === "latency_spike") {
        newParams.baselineLatencyMs = 480;
      } else if (preset === "cross_border") {
        newParams.crossBorderBinMix = 0.85;
      } else {
        newParams.baselineLatencyMs = 200;
        newParams.crossBorderBinMix = 0.4;
      }
      const newBatch = getInitialBatch(newParams);
      allTxnsRef.current = newBatch;
      setAllTransactions(newBatch);
      setTransactions([...newBatch].reverse().slice(0, LOG_SIZE));
      setMetrics(calculateMetrics(newBatch, newParams));
    },
    [pause]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return [
    { transactions, allTransactions, metrics, isRunning },
    { start, pause, reset, loadScenario },
  ];
}

// ── Formatting helpers ────────────────────────────────────────
export function fmtUSD(cents: number): string {
  if (cents === 0) return "$0.00";
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(2)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}K`;
  return `$${dollars.toFixed(2)}`;
}

export function fmtPct(val: number, decimals = 1): string {
  return `${val.toFixed(decimals)}%`;
}

export function fmtMs(ms: number): string {
  return `${ms}ms`;
}
