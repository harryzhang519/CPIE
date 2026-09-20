// ============================================================
// Mock Seed Data — Merchants, Processors
// ============================================================

import type { Merchant, ProcessorConfig, Vertical } from "./types";

export const MERCHANTS: Merchant[] = [
  { id: "m1", name: "Acme SaaS Co.", vertical: "SaaS", tier: 2, region: "US" },
  { id: "m2", name: "Wanderlust Travel", vertical: "Travel", tier: 3, region: "EU" },
  { id: "m3", name: "NexaRetail", vertical: "Retail", tier: 1, region: "US" },
  { id: "m4", name: "CloudOps Ltd.", vertical: "SaaS", tier: 2, region: "EU" },
  { id: "m5", name: "GlobalJet Corp.", vertical: "Travel", tier: 3, region: "US" },
  { id: "m6", name: "ShopKart Inc.", vertical: "Retail", tier: 2, region: "APAC" },
  { id: "m7", name: "DevStack Pro", vertical: "SaaS", tier: 3, region: "US" },
  { id: "m8", name: "SkyHopper EU", vertical: "Travel", tier: 2, region: "EU" },
];

// Baseline auth rates represent *without* the routing engine
// Optimized rates represent what the routing engine achieves
export const PROCESSORS: ProcessorConfig[] = [
  {
    id: "STRIPE",
    label: "Stripe",
    region: "US",
    slaAvailability: 0.9999,
    latencyBaseline: 120,
    authRateByVertical: { SaaS: 0.968, Retail: 0.954, Travel: 0.941 },
    currentLatency: 120,
    currentAvailability: 0.9999,
  },
  {
    id: "ADYEN",
    label: "Adyen",
    region: "EU",
    slaAvailability: 0.9998,
    latencyBaseline: 145,
    authRateByVertical: { SaaS: 0.951, Retail: 0.962, Travel: 0.965 },
    currentLatency: 145,
    currentAvailability: 0.9998,
  },
  {
    id: "BRAINTREE",
    label: "Braintree",
    region: "US",
    slaAvailability: 0.9995,
    latencyBaseline: 180,
    authRateByVertical: { SaaS: 0.942, Retail: 0.948, Travel: 0.933 },
    currentLatency: 180,
    currentAvailability: 0.9995,
  },
];

export const PROCESSOR_MAP = Object.fromEntries(
  PROCESSORS.map((p) => [p.id, p])
) as Record<string, ProcessorConfig>;

// Auth uplift slide values (from Slide 2/3)
export const AUTH_UPLIFT_SLIDE_VALUES: Record<Vertical, { baseline: number; optimized: number }> = {
  SaaS: { baseline: 0.944, optimized: 0.968 }, // +2.4%
  Retail: { baseline: 0.947, optimized: 0.962 }, // +1.5%
  Travel: { baseline: 0.921, optimized: 0.945 }, // +2.4% → avg ~+2.2% slide claim
};

export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"];
export const BIN_COUNTRIES: Array<"US" | "EU" | "APAC"> = ["US", "EU", "APAC"];
export const PAYMENT_METHODS: Array<"Card" | "ACH" | "APM"> = ["Card", "ACH", "APM"];

// Interchange rate by payment method (basis points → decimal)
export const INTERCHANGE_RATE: Record<string, number> = {
  Card: 0.018,
  ACH: 0.002,
  APM: 0.012,
};

// Radar fraud cost saving per blocked fraud txn (basis points)
export const RADAR_SAVING_PER_BLOCK_CENTS = 5200; // ~$52 average fraud loss prevented
