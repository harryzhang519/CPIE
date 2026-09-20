// ============================================================
// Intelligent Routing Engine
// ============================================================
// Implements the decision logic from Slides 2/3 (Acceptance Models)
// and Slides 2/6 (Compliance/SLA Fallback).

import type {
  Merchant,
  ProcessorConfig,
  ProcessorId,
  Region,
  RoutingDecision,
  RoutingReason,
  SimulationParams,
  Transaction,
  TransactionOutcome,
  Vertical,
} from "./types";
import {
  INTERCHANGE_RATE,
  MERCHANTS,
  PROCESSOR_MAP,
  PROCESSORS,
  RADAR_SAVING_PER_BLOCK_CENTS,
} from "./mockData";

// ── Seeded pseudo-random (deterministic per txn id) ──────────
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

let txnCounter = 0;

export function resetCounter() {
  txnCounter = 0;
}

// ── Processor latency simulation ─────────────────────────────
// Occasionally spikes Braintree latency to trigger fallback
let latencyDriftAccumulator = 0;

export function tickProcessorLatency(params: SimulationParams): void {
  latencyDriftAccumulator++;

  PROCESSORS.forEach((p) => {
    // Natural jitter ±20%
    const jitter = 0.8 + seededRand(latencyDriftAccumulator + p.id.length) * 0.4;
    p.currentLatency = Math.round(p.latencyBaseline * jitter);

    // Occasionally inject Braintree degradation (every ~30 ticks)
    if (p.id === "BRAINTREE" && latencyDriftAccumulator % 30 < 6) {
      p.currentLatency = Math.round(
        params.baselineLatencyMs * 1.8 + seededRand(latencyDriftAccumulator) * 200
      );
    }
  });
}

// ── Best processor for a vertical ────────────────────────────
function bestProcessorForVertical(vertical: Vertical): ProcessorId {
  let best: ProcessorId = "STRIPE";
  let bestRate = 0;
  for (const p of PROCESSORS) {
    if (p.authRateByVertical[vertical] > bestRate) {
      bestRate = p.authRateByVertical[vertical];
      best = p.id;
    }
  }
  return best;
}

// ── Select direct (naive) route ───────────────────────────────
function directRoute(merchant: Merchant): ProcessorId {
  // Naive: match processor region to merchant region
  if (merchant.region === "EU") return "ADYEN";
  if (merchant.region === "APAC") return "BRAINTREE";
  return "BRAINTREE"; // default US
}

// ── Core routing decision ─────────────────────────────────────
function makeRoutingDecision(
  merchant: Merchant,
  binCountry: Region,
  params: SimulationParams,
  rand: number
): RoutingDecision {
  const direct = directRoute(merchant);
  const directProcessor = PROCESSOR_MAP[direct];

  // Rule 1: Latency Fallback
  // If direct processor latency exceeds 1.5× baseline → dynamic fallback to Stripe
  const latencyThreshold = params.baselineLatencyMs * 1.5;
  if (directProcessor.currentLatency > latencyThreshold) {
    return {
      directRoute: direct,
      optimizedRoute: "STRIPE",
      reason: "LATENCY_FALLBACK",
    };
  }

  // Rule 2: BIN Cross-Border Uplift
  // Cross-border BIN → high soft-decline risk → route to best vertical processor
  const isCrossBorder = binCountry !== merchant.region && rand < params.crossBorderBinMix;
  if (isCrossBorder) {
    const optimized = bestProcessorForVertical(merchant.vertical);
    if (optimized !== direct) {
      return {
        directRoute: direct,
        optimizedRoute: optimized,
        reason: "BIN_UPLIFT",
      };
    }
  }

  return { directRoute: direct, optimizedRoute: direct, reason: "PASS_THROUGH" };
}

// ── Determine transaction outcome ─────────────────────────────
function resolveOutcome(
  processor: ProcessorConfig,
  vertical: Vertical,
  paymentMethod: string,
  params: SimulationParams,
  rand: number,
  rand2: number
): TransactionOutcome {
  // Fraud check first
  if (rand < params.fraudBlockRate) return "FRAUD_BLOCK";

  const authRate = processor.authRateByVertical[vertical];
  if (rand2 < authRate) return "APPROVED";

  // Of failures, split 70/30 soft/hard
  if (rand2 < authRate + (1 - authRate) * 0.7) return "SOFT_DECLINE";
  return "HARD_DECLINE";
}

// ── Generate one transaction ──────────────────────────────────
export function generateTransaction(params: SimulationParams): Transaction {
  txnCounter++;
  const idx = txnCounter;

  const r1 = seededRand(idx * 7);
  const r2 = seededRand(idx * 13);
  const r3 = seededRand(idx * 17);
  const r4 = seededRand(idx * 23);
  const r5 = seededRand(idx * 31);
  const r6 = seededRand(idx * 37);
  const r7 = seededRand(idx * 41);

  const merchant = MERCHANTS[Math.floor(r1 * MERCHANTS.length)];
  const binCountry = (["US", "EU", "APAC"] as Region[])[Math.floor(r2 * 3)];
  const paymentMethod = (["Card", "ACH", "APM"] as const)[Math.floor(r3 * 3)];
  const currency = ["USD", "EUR", "GBP", "CAD", "AUD"][Math.floor(r4 * 5)];

  // Amount: $10–$2500 skewed toward smaller
  const amountCents = Math.round((10 + r5 * 2490) * 100);

  // Tick processor latencies
  tickProcessorLatency(params);

  const routing = makeRoutingDecision(merchant, binCountry, params, r6);
  const optimizedProcessor = PROCESSOR_MAP[routing.optimizedRoute];

  // Fraud check uses direct route baseline (shows what optimized blocks)
  let outcome = resolveOutcome(optimizedProcessor, merchant.vertical, paymentMethod, params, r6, r7);

  // Latency: use optimized processor current latency ± jitter
  const latency = Math.round(
    optimizedProcessor.currentLatency * (0.9 + seededRand(idx * 53) * 0.2)
  );

  // Tier 2: flagged if routed through intelligence screening (non-pass-through)
  const tier2Flagged = routing.reason !== "PASS_THROUGH";

  // Tier 3: if soft-declined on direct, retry on optimized
  let tier3Recovered = false;
  let recoveredGmv = 0;
  let finalOutcome = outcome;

  if (outcome === "SOFT_DECLINE" && routing.reason !== "PASS_THROUGH") {
    const retryRoll = seededRand(idx * 59);
    if (retryRoll < params.authRetrySuccessRate) {
      tier3Recovered = true;
      recoveredGmv = amountCents;
      finalOutcome = "APPROVED";
    }
  }

  const interchange = INTERCHANGE_RATE[paymentMethod] ?? 0.018;

  return {
    id: `TXN-${String(idx).padStart(6, "0")}-${Math.floor(r1 * 1000)}`,
    merchantId: merchant.id,
    merchantName: merchant.name,
    vertical: merchant.vertical,
    amount: amountCents,
    currency,
    binCountry,
    paymentMethod,
    simulatedLatency: latency,
    outcome: finalOutcome,
    processorUsed: routing.optimizedRoute,
    routingDecision: routing,
    tier2Flagged,
    tier3Recovered,
    recoveredGmv,
    timestamp: Date.now(),
  };
}
