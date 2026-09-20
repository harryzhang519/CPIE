// ============================================================
// Domain Types — Payment Infrastructure Engine
// ============================================================

export type Vertical = "SaaS" | "Retail" | "Travel";
export type MerchantTier = 1 | 2 | 3;
export type ProcessorId = "STRIPE" | "ADYEN" | "BRAINTREE";
export type Region = "US" | "EU" | "APAC";
export type PaymentMethod = "Card" | "ACH" | "APM";
export type TransactionOutcome =
  | "APPROVED"
  | "SOFT_DECLINE"
  | "HARD_DECLINE"
  | "FRAUD_BLOCK";
export type RoutingReason =
  | "BIN_UPLIFT"
  | "LATENCY_FALLBACK"
  | "FRAUD_BLOCK"
  | "PASS_THROUGH"
  | "RETRY_APPROVED";

// ── Merchant ─────────────────────────────────────────────────
export interface Merchant {
  id: string;
  name: string;
  vertical: Vertical;
  tier: MerchantTier;
  region: Region;
}

// ── Processor ────────────────────────────────────────────────
export interface ProcessorConfig {
  id: ProcessorId;
  label: string;
  region: Region;
  slaAvailability: number; // 0–1, e.g. 0.9999
  latencyBaseline: number; // ms
  authRateByVertical: Record<Vertical, number>; // 0–1 auth rate
  currentLatency: number; // runtime — mutated by simulation
  currentAvailability: number; // runtime
}

// ── Routing Decision ─────────────────────────────────────────
export interface RoutingDecision {
  directRoute: ProcessorId;
  optimizedRoute: ProcessorId;
  reason: RoutingReason;
}

// ── Transaction ──────────────────────────────────────────────
export interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  vertical: Vertical;
  amount: number; // USD cents
  currency: string;
  binCountry: Region;
  paymentMethod: PaymentMethod;
  simulatedLatency: number; // ms
  outcome: TransactionOutcome;
  processorUsed: ProcessorId;
  routingDecision: RoutingDecision;
  tier2Flagged: boolean; // routed through Intelligence Screening
  tier3Recovered: boolean; // soft-decline recovered on retry
  recoveredGmv: number; // 0 unless tier3Recovered
  timestamp: number; // unix ms
}

// ── Simulation Parameters ────────────────────────────────────
export interface SimulationParams {
  baselineLatencyMs: number; // 50–800
  authRetrySuccessRate: number; // 0–1
  fraudBlockRate: number; // 0–1
  volumePerSecond: number; // 0.5–5
  tier3NegotiatedPct: number; // 0–1
  crossBorderBinMix: number; // 0–1 fraction of txns that are cross-border
}

export const DEFAULT_PARAMS: SimulationParams = {
  baselineLatencyMs: 200,
  authRetrySuccessRate: 0.65,
  fraudBlockRate: 0.04,
  volumePerSecond: 1,
  tier3NegotiatedPct: 0.15,
  crossBorderBinMix: 0.4,
};

// ── Aggregated Dashboard Metrics ─────────────────────────────
export interface DashboardMetrics {
  totalGmvCents: number;
  totalAttempted: number;
  totalApproved: number;
  totalFraudBlocked: number;
  totalSoftDeclined: number;
  totalHardDeclined: number;
  overallAuthRate: number; // %
  baselineAuthRate: number; // % (without routing engine)
  avgLatencyMs: number;
  pciScore: number; // static 98
  tier1RevenueCents: number;
  tier2RevenueCents: number;
  tier3RevenueCents: number;
  totalRevenueCents: number;
  recoveredGmvCents: number;
  fraudCostSavedCents: number;
  interchangeCostCents: number;
  authUpliftByVertical: Record<Vertical, { baseline: number; optimized: number }>;
}

// ── Unit Economics Waterfall ──────────────────────────────────
export interface WaterfallEntry {
  name: string;
  value: number;
  cumulative: number;
  type: "positive" | "negative" | "total";
}
