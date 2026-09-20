// ============================================================
// Intelligent Routing Engine
// ============================================================
// Implements the decision logic from Slides 2/3 (Acceptance Models)
// and Slides 2/6 (Compliance/SLA Fallback).
//
// EXCLUSIVITY INVARIANT:
// When Stripe's Intelligence Layer engages, optimizedRoute is always "STRIPE".
// It never reroutes to Adyen or Braintree. Competitors appear only in
// directRoute — the counterfactual baseline a merchant would use without
// Stripe's intelligence layer. This is by design and is the business argument:
// Stripe keeps the transaction, not a competitor.

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
  AUTH_UPLIFT_SLIDE_VALUES,
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

// NOTE: bestProcessorForVertical() has been intentionally deleted.
// It returned ADYEN or BRAINTREE in some verticals (e.g. Travel), which
// directly contradicted the pitch: the Intelligence Layer should capture the
// transaction for Stripe, not reroute it to a competitor. The cross-border
// uplift rule now unconditionally sets optimizedRoute: "STRIPE".

// ── Select direct (naive) route ───────────────────────────────
// This is the counterfactual baseline — the processor a merchant would use
// without Stripe's intelligence layer. Adyen and Braintree appear here because
// they represent the "unbundled" world Stripe is pitching against.
function directRoute(merchant: Merchant): ProcessorId {
  // Naive: match processor region to merchant region
  if (merchant.region === "EU") return "ADYEN";
  if (merchant.region === "APAC") return "BRAINTREE";
  return "BRAINTREE"; // default US
}

// ── Core routing decision ─────────────────────────────────────
// INVARIANT: optimizedRoute is always "STRIPE" or direct (PASS_THROUGH).
// It is never set to "ADYEN" or "BRAINTREE" by the intelligence rules.
function makeRoutingDecision(
  merchant: Merchant,
  binCountry: Region,
  params: SimulationParams,
  rand: number
): RoutingDecision {
  const direct = directRoute(merchant);
  const directProcessor = PROCESSOR_MAP[direct];

  // Rule 1: Latency Fallback
  // If direct processor latency exceeds 1.5× baseline → dynamic fallback to Stripe.
  // Stripe's Intelligence Layer captures the transaction; competitor is bypassed.
  const latencyThreshold = params.baselineLatencyMs * 1.5;
  if (directProcessor.currentLatency > latencyThreshold) {
    return {
      directRoute: direct,
      optimizedRoute: "STRIPE",
      reason: "LATENCY_FALLBACK",
      stripeIntelligenceEngaged: true,
    };
  }

  // Rule 2: Stripe Intelligence Capture (cross-border BIN uplift)
  // Cross-border BIN → high soft-decline risk → Stripe's Intelligence Layer
  // engages and captures the transaction. The optimized route is always Stripe —
  // the uplift is achieved by Stripe's network intelligence and retry logic,
  // not by handing the transaction to Adyen or Braintree.
  const isCrossBorder = binCountry !== merchant.region && rand < params.crossBorderBinMix;
  if (isCrossBorder) {
    return {
      directRoute: direct,
      optimizedRoute: "STRIPE",
      reason: "STRIPE_INTELLIGENCE_CAPTURE",
      stripeIntelligenceEngaged: true,
    };
  }

  return {
    directRoute: direct,
    optimizedRoute: direct,
    reason: "PASS_THROUGH",
    stripeIntelligenceEngaged: false,
  };
}

// ── Determine transaction outcome ─────────────────────────────
// authRate is passed in explicitly so callers can inject the optimized
// (AUTH_UPLIFT_SLIDE_VALUES) rate when the Intelligence Layer is engaged,
// rather than Stripe's raw authRateByVertical. This is the mechanism that
// makes routing to Stripe valuable even in verticals where Stripe's raw rate
// is lower than Adyen's (e.g. Travel 94.1% raw vs 94.5% optimized).
function resolveOutcome(
  processor: ProcessorConfig,
  vertical: Vertical,
  paymentMethod: string,
  params: SimulationParams,
  rand: number,
  rand2: number,
  overrideAuthRate?: number
): TransactionOutcome {
  // Fraud check first
  if (rand < params.fraudBlockRate) return "FRAUD_BLOCK";

  const authRate = overrideAuthRate ?? processor.authRateByVertical[vertical];
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

  // When the Intelligence Layer is engaged, use the vertical's optimized auth rate
  // from AUTH_UPLIFT_SLIDE_VALUES. This is the value-add of Stripe's intelligence —
  // it achieves a higher auth rate than the raw Stripe processor rate alone, which
  // justifies routing to Stripe even in verticals where Stripe's raw rate is lower
  // (e.g. Travel: Stripe raw 94.1% vs Adyen raw 96.5% — but optimized 94.5% via retry).
  const authRateOverride = routing.stripeIntelligenceEngaged
    ? AUTH_UPLIFT_SLIDE_VALUES[merchant.vertical].optimized
    : undefined;

  let outcome = resolveOutcome(
    optimizedProcessor,
    merchant.vertical,
    paymentMethod,
    params,
    r6,
    r7,
    authRateOverride
  );

  // Latency: use optimized processor current latency ± jitter
  const latency = Math.round(
    optimizedProcessor.currentLatency * (0.9 + seededRand(idx * 53) * 0.2)
  );

  // Tier 2: explicitly gated on stripeIntelligenceEngaged — only transactions
  // captured by Stripe's Intelligence Layer qualify for Tier 2 screening fees.
  // This makes the "exclusive to Stripe-processed volume" contract unambiguous.
  const tier2Flagged = routing.stripeIntelligenceEngaged;

  // Tier 3: soft-decline recovery only on intelligence-captured transactions
  let tier3Recovered = false;
  let recoveredGmv = 0;
  let finalOutcome = outcome;

  if (outcome === "SOFT_DECLINE" && routing.stripeIntelligenceEngaged) {
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
