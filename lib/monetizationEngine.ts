// ============================================================
// Monetization Engine — 3-Tier Revenue Calculator
// ============================================================
// Implements Slide 5: Monetization Model
//
// Tier 1 (Bundled):       Revenue = $0  (included with processing)
// Tier 2 (Intelligence Pro): Revenue = $0.02 × count(tier2Flagged)
// Tier 3 (Outcome-Linked): Revenue = RecoveredGMV × negotiatedPct

import type {
  DashboardMetrics,
  SimulationParams,
  Transaction,
  Vertical,
  WaterfallEntry,
} from "./types";
import {
  AUTH_UPLIFT_SLIDE_VALUES,
  INTERCHANGE_RATE,
  RADAR_SAVING_PER_BLOCK_CENTS,
} from "./mockData";

const TIER2_FEE_CENTS = 2; // $0.02 per screened txn

export function calculateMetrics(
  transactions: Transaction[],
  params: SimulationParams
): DashboardMetrics {
  if (transactions.length === 0) {
    return emptyMetrics();
  }

  let totalApprovedCents = 0;
  let totalAttempted = 0;
  let totalApproved = 0;
  let totalFraudBlocked = 0;
  let totalSoftDeclined = 0;
  let totalHardDeclined = 0;
  let totalLatency = 0;
  let tier2Count = 0;
  let recoveredGmvCents = 0;
  let totalInterchangeCents = 0;

  const verticalApproved: Record<Vertical, number> = { SaaS: 0, Retail: 0, Travel: 0 };
  const verticalAttempted: Record<Vertical, number> = { SaaS: 0, Retail: 0, Travel: 0 };

  for (const txn of transactions) {
    totalAttempted++;
    totalLatency += txn.simulatedLatency;
    verticalAttempted[txn.vertical]++;

    if (txn.outcome === "APPROVED") {
      totalApproved++;
      totalApprovedCents += txn.amount;
      verticalApproved[txn.vertical]++;
      const rate = INTERCHANGE_RATE[txn.paymentMethod] ?? 0.018;
      totalInterchangeCents += Math.round(txn.amount * rate);
    } else if (txn.outcome === "FRAUD_BLOCK") {
      totalFraudBlocked++;
    } else if (txn.outcome === "SOFT_DECLINE") {
      totalSoftDeclined++;
    } else {
      totalHardDeclined++;
    }

    if (txn.tier2Flagged) tier2Count++;
    if (txn.tier3Recovered) recoveredGmvCents += txn.recoveredGmv;
  }

  const overallAuthRate = totalAttempted > 0 ? (totalApproved / totalAttempted) * 100 : 0;

  // Baseline auth rate — what it would be without routing engine
  // We simulate baseline as the unoptimized mix (weighted average)
  const baselineAuthRate =
    (AUTH_UPLIFT_SLIDE_VALUES.SaaS.baseline * verticalAttempted.SaaS +
      AUTH_UPLIFT_SLIDE_VALUES.Retail.baseline * verticalAttempted.Retail +
      AUTH_UPLIFT_SLIDE_VALUES.Travel.baseline * verticalAttempted.Travel) /
    Math.max(totalAttempted, 1) *
    100;

  const avgLatencyMs = totalAttempted > 0 ? Math.round(totalLatency / totalAttempted) : 0;

  // Tier revenues
  const tier1RevenueCents = 0;
  const tier2RevenueCents = tier2Count * TIER2_FEE_CENTS;
  const tier3RevenueCents = Math.round(recoveredGmvCents * params.tier3NegotiatedPct);
  const totalRevenueCents = tier2RevenueCents + tier3RevenueCents;

  // Fraud cost savings (Radar attribution): blocked fraud × avg fraud loss
  const fraudCostSavedCents = totalFraudBlocked * RADAR_SAVING_PER_BLOCK_CENTS;

  // Auth uplift by vertical (slide values, modulated by retry rate)
  const upliftModifier = params.authRetrySuccessRate / 0.65; // normalized to default
  const authUpliftByVertical = Object.fromEntries(
    (["SaaS", "Retail", "Travel"] as Vertical[]).map((v) => {
      const base = AUTH_UPLIFT_SLIDE_VALUES[v].baseline;
      const opt = AUTH_UPLIFT_SLIDE_VALUES[v].optimized;
      const uplift = (opt - base) * upliftModifier;
      return [v, { baseline: base * 100, optimized: Math.min((base + uplift) * 100, 99.9) }];
    })
  ) as Record<Vertical, { baseline: number; optimized: number }>;

  return {
    totalGmvCents: totalApprovedCents,
    totalAttempted,
    totalApproved,
    totalFraudBlocked,
    totalSoftDeclined,
    totalHardDeclined,
    overallAuthRate,
    baselineAuthRate,
    avgLatencyMs,
    pciScore: 98,
    tier1RevenueCents,
    tier2RevenueCents,
    tier3RevenueCents,
    totalRevenueCents,
    recoveredGmvCents,
    fraudCostSavedCents,
    interchangeCostCents: totalInterchangeCents,
    authUpliftByVertical,
  };
}

function emptyMetrics(): DashboardMetrics {
  return {
    totalGmvCents: 0,
    totalAttempted: 0,
    totalApproved: 0,
    totalFraudBlocked: 0,
    totalSoftDeclined: 0,
    totalHardDeclined: 0,
    overallAuthRate: 0,
    baselineAuthRate: 94.7,
    avgLatencyMs: 0,
    pciScore: 98,
    tier1RevenueCents: 0,
    tier2RevenueCents: 0,
    tier3RevenueCents: 0,
    totalRevenueCents: 0,
    recoveredGmvCents: 0,
    fraudCostSavedCents: 0,
    interchangeCostCents: 0,
    authUpliftByVertical: {
      SaaS: { baseline: 94.4, optimized: 96.8 },
      Retail: { baseline: 94.7, optimized: 96.2 },
      Travel: { baseline: 92.1, optimized: 94.5 },
    },
  };
}

// ── Waterfall data for Unit Economics chart ───────────────────
export function buildWaterfallData(metrics: DashboardMetrics): WaterfallEntry[] {
  const gross = metrics.totalGmvCents;
  if (gross === 0) return [];

  const interchange = -metrics.interchangeCostCents;
  const fraudCost = -Math.round(metrics.totalFraudBlocked * 8500); // avg chargeback without Radar
  const radarSaving = metrics.fraudCostSavedCents;
  const recoveredGmv = metrics.recoveredGmvCents;

  const afterInterchange = gross + interchange;
  const afterFraud = afterInterchange + fraudCost;
  const afterRadar = afterFraud + radarSaving;
  const netRevenue = afterRadar + recoveredGmv;

  return [
    { name: "Gross Revenue", value: gross, cumulative: gross, type: "total" },
    { name: "Interchange / Schemes", value: interchange, cumulative: afterInterchange, type: "negative" },
    { name: "Fraud Cost (w/o Radar)", value: fraudCost, cumulative: afterFraud, type: "negative" },
    { name: "Radar Savings", value: radarSaving, cumulative: afterRadar, type: "positive" },
    { name: "Auth Uplift GMV", value: recoveredGmv, cumulative: netRevenue, type: "positive" },
    { name: "Net Revenue", value: netRevenue, cumulative: netRevenue, type: "total" },
  ];
}
