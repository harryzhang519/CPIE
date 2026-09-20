// ============================================================
// Stripe Intelligence Prototype Domain Data & State Models
// ============================================================

export type ActiveTab = "home" | "optimizer" | "health" | "action-center";

export interface BenchmarkMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  benchmarkText: string;
  benchmarkColor: "yellow" | "blue" | "green" | "red" | "orange";
  subtext?: string;
}

export interface LiveAlert {
  id: string;
  title: string;
  timeAgo: string;
  description: string;
  statusTag: string;
  statusTagColor: "red" | "orange" | "green";
  actionTag: string;
  severity: "critical" | "warning" | "positive";
}

export interface OptimizationLever {
  id: string;
  title: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  minLabel: string;
  maxLabel: string;
}

export interface RevenueBreakdownItem {
  id: string;
  title: string;
  amount: string;
  impactTag: string;
  detail: string;
  color: "green" | "red" | "blue" | "amber";
}

export interface CountryHealth {
  code: string;
  name: string;
  problem: string;
  action: string;
  when: "Today" | "Now" | "This week" | "Monitor";
  revenueImpact: string;
  status: "normal" | "attention" | "critical";
  flag: string;
}

export interface ActionCenterCard {
  id: string;
  title: string;
  statusPill: string;
  statusPillType: "safe" | "test";
  description: string;
  whyNow: string;
  area: string;
  timeline: string;
  expectedGain: string;
  confidence: number;
  appliedState: "idle" | "testing" | "applied";
}

// ── Mock Initial Data Exact to Screenshots ──────────────────

export const BENCHMARKS: BenchmarkMetric[] = [
  {
    id: "accepted",
    label: "PAYMENTS ACCEPTED",
    value: "87.4%",
    change: "↑ 2.1% this week",
    changeDirection: "up",
    benchmarkText: "Better than 62% of similar businesses",
    benchmarkColor: "yellow",
  },
  {
    id: "completed",
    label: "CUSTOMERS WHO COMPLETE PURCHASE",
    value: "67.8%",
    change: "↑ 1.4% this week",
    changeDirection: "up",
    benchmarkText: "Room to improve vs. top businesses",
    benchmarkColor: "blue",
    subtext: "Of everyone who starts checkout, how many actually finish buying",
  },
  {
    id: "fraud",
    label: "FRAUDULENT TRANSACTIONS",
    value: "0.12%",
    change: "↓ 0.03% this week",
    changeDirection: "down",
    benchmarkText: "Lower than 78% of similar businesses ✓",
    benchmarkColor: "green",
  },
  {
    id: "disputed",
    label: "DISPUTED PAYMENTS",
    value: "0.41%",
    change: "↑ 0.04% this week",
    changeDirection: "up",
    benchmarkText: "Higher than average — needs attention",
    benchmarkColor: "red",
  },
  {
    id: "extra_rev",
    label: "EXTRA REVENUE FROM AI",
    value: "11.9%",
    change: "↑ 2.3% this week",
    changeDirection: "up",
    benchmarkText: "Top performer vs. industry",
    benchmarkColor: "orange",
  },
  {
    id: "ai_saved",
    label: "AI SAVED THIS MONTH",
    value: "$248K",
    change: "↑ 18 this week",
    changeDirection: "up",
    benchmarkText: "Strong performance this period",
    benchmarkColor: "yellow",
  },
];

export const LIVE_ALERTS: LiveAlert[] = [
  {
    id: "alert-1",
    title: "Chase Visa cards temporarily failing",
    timeAgo: "2 min ago",
    description:
      "Some customers paying with Chase Visa may see declines. We're automatically rerouting them.",
    statusTag: "Losing ~$12K/hr",
    statusTagColor: "red",
    actionTag: "Fix in progress",
    severity: "critical",
  },
  {
    id: "alert-2",
    title: "Unusual fraud spike in Europe",
    timeAgo: "18 min ago",
    description:
      "Fraud attempts from European prepaid cards jumped 3× above normal. Extra checks turned on automatically.",
    statusTag: "Fraud risk elevated",
    statusTagColor: "red",
    actionTag: "Blocked automatically",
    severity: "critical",
  },
  {
    id: "alert-3",
    title: "German customers seeing lower success rates",
    timeAgo: "1 hr ago",
    description:
      "Visa Debit payments in Germany underperforming vs. similar businesses. Rerouting recommended.",
    statusTag: "~$8K/day at risk",
    statusTagColor: "orange",
    actionTag: "Needs attention",
    severity: "warning",
  },
  {
    id: "alert-4",
    title: "Sales spike — 340% above normal traffic",
    timeAgo: "3 hrs ago",
    description:
      "Your checkout is handling a major traffic surge. Checkout optimizations applied automatically.",
    statusTag: "+$34K captured",
    statusTagColor: "green",
    actionTag: "All good ✓",
    severity: "positive",
  },
];

export const COUNTRY_RECOMMENDATIONS: CountryHealth[] = [
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    problem: "Visa Debit underperforming",
    action: "Switch to backup payment network",
    when: "Today",
    revenueImpact: "+$28K/mo",
    status: "attention",
  },
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    problem: "Chase cards failing right now",
    action: "Auto-retry via Mastercard network",
    when: "Now",
    revenueImpact: "+$12K/hr",
    status: "critical",
  },
  {
    code: "GB",
    name: "UK",
    flag: "🇬🇧",
    problem: "Too many extra verif. steps",
    action: "Request exemptions for low-risk purchases",
    when: "This week",
    revenueImpact: "+2.3% conv.",
    status: "attention",
  },
  {
    code: "DE2",
    name: "Germany",
    flag: "🇩🇪",
    problem: "Amex payments underperforming",
    action: "Enable Network Token for Amex",
    when: "This week",
    revenueImpact: "+$8K/day",
    status: "attention",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    problem: "Minor Interac gap vs. best",
    action: "No action needed",
    when: "Monitor",
    revenueImpact: "Nominal",
    status: "normal",
  },
];

export const INITIAL_ACTION_CARDS: ActionCenterCard[] = [
  {
    id: "action-apple-pay",
    title: "Move Apple Pay to the top of your checkout",
    statusPill: "Safe",
    statusPillType: "safe",
    description:
      "Customers who use Apple Pay are 23% more likely to complete their purchase vs. typing a card. Just reordering the buttons could meaningfully increase sales.",
    whyNow: "Why now: Mobile users make up 68% of your traffic. Biggest quick win available.",
    area: "Checkout",
    timeline: "Today",
    expectedGain: "+$22K/mo",
    confidence: 82,
    appliedState: "idle",
  },
  {
    id: "action-phone-field",
    title: "Remove phone number field from checkout",
    statusPill: "Test first",
    statusPillType: "test",
    description:
      "Testing shows your phone field causes 1.8% of customers to abandon checkout. It's not required for most purchases — removing it could meaningfully lift sales.",
    whyNow: "Why now: Simple change — but recommend testing with 10% of customers first.",
    area: "Checkout",
    timeline: "Test for 2 days",
    expectedGain: "+1.8% more sales",
    confidence: 71,
    appliedState: "idle",
  },
];
