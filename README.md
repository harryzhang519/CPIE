# CPIE — Payment Intelligence Engine

A live, interactive visualization of Stripe's Payment Intelligence Layer — demonstrating how exclusive routing intelligence, fraud interception, and soft-decline recovery create a monetizable value layer on top of commodity processing. Built for a Stripe Case Competition demo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## The Business Argument

Stripe's intelligence layer is the product. The pitch is not "better routing across processors" — it is "Stripe captures transactions that would otherwise soft-decline or route to a competitor, and monetizes that capture through a tiered pricing model."

The codebase enforces this at the code level:

- `directRoute()` — the **counterfactual baseline**: where a merchant's transaction goes without Stripe's intelligence (Adyen for EU, Braintree for APAC/US). Competitors appear here because they represent the unbundled world Stripe is pitching against.
- `makeRoutingDecision()` — the **invariant**: when the Intelligence Layer fires (latency fallback or cross-border BIN capture), `optimizedRoute` is always `"STRIPE"`. It is never set to `"ADYEN"` or `"BRAINTREE"`. The competitor is bypassed, not rerouted to.
- `stripeIntelligenceEngaged: boolean` — the **authority flag**: Tier 2 and Tier 3 revenue are gated on this field. Only Stripe-captured volume qualifies.

---

## What It Simulates

- **Stripe Intelligence Capture** (`STRIPE_INTELLIGENCE_CAPTURE`) — cross-border BIN detected → Stripe's Intelligence Layer captures the transaction, applying the vertical's optimized auth rate from `AUTH_UPLIFT_SLIDE_VALUES`, not Stripe's raw rate. This is how Stripe justifies routing even in verticals where its raw auth rate is lower than Adyen's (e.g. Travel: raw 94.1% vs optimized 94.5% via retry intelligence).
- **Latency Fallback** (`LATENCY_FALLBACK`) — direct processor exceeds 1.5× baseline latency → Stripe captures. Already Stripe-exclusive by design.
- **Radar Fraud Blocking** — configurable ML intercept rate with cost savings attribution.
- **Soft Decline Retry** — recovers failed transactions *only* on Stripe-intelligence-captured volume (Tier 3 eligibility).
- **3-Tier Monetization Model** (Slide 5):
  - Tier 1 — Bundled: `$0` (included with processing)
  - Tier 2 — Intelligence Pro: `$0.02 × screened transactions` (requires `stripeIntelligenceEngaged`)
  - Tier 3 — Outcome-Linked: `Recovered GMV × negotiated %` (requires `stripeIntelligenceEngaged`)

All data is generated locally in the browser — no backend, no database, no external services.

---

## Dashboard

| Panel | Description |
|---|---|
| **KPI Header** | GMV, Auth Rate (vs baseline), Latency, PCI-DSS, Revenue Uplift, Stripe Revenue Capture |
| **Live Transaction Log** | Animated feed with routing decisions — "Stripe Intelligence Capture" badges when the layer fires |
| **Unit Economics Waterfall** | Gross Revenue → Interchange → Fraud Cost → Radar Savings → Net |
| **Auth Uplift Chart** | Baseline vs Optimized auth rate per vertical (SaaS / Retail / Travel) |
| **Monetization Funnel** | Attempted → Fraud Block → Retry → Approved GMV + Tier 1/2/3 revenue sidebar |
| **Simulation Controls** | 6 interactive sliders to tune the engine in real time |

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Simulation Controls

| Slider | Default | What It Drives |
|---|---|---|
| Baseline Latency | 200ms | Triggers Braintree → Stripe latency fallback above 1.5× |
| Auth Retry Success Rate | 65% | Tier 3 recovery rate on Stripe-intelligence-captured soft declines |
| Fraud Block Rate | 4% | Radar intercept rate and fraud savings card |
| Volume (TXN/s) | 1/s | Simulation speed |
| Tier 3 Negotiated % | 15% | Revenue share on recovered GMV (Stripe-captured volume only) |
| Cross-Border BIN Mix | 40% | Frequency of Stripe Intelligence Capture events |

---

## Routing Logic Reference

```
directRoute(merchant)
  └── EU merchant  → ADYEN    (counterfactual baseline)
  └── APAC/US      → BRAINTREE (counterfactual baseline)

makeRoutingDecision()
  Rule 1: directProcessor.latency > 1.5× baseline
    → optimizedRoute: "STRIPE", reason: "LATENCY_FALLBACK", stripeIntelligenceEngaged: true

  Rule 2: cross-border BIN detected
    → optimizedRoute: "STRIPE", reason: "STRIPE_INTELLIGENCE_CAPTURE", stripeIntelligenceEngaged: true
    → authRate = AUTH_UPLIFT_SLIDE_VALUES[vertical].optimized (not Stripe's raw rate)

  Default:
    → optimizedRoute: directRoute, reason: "PASS_THROUGH", stripeIntelligenceEngaged: false

INVARIANT: optimizedRoute is NEVER set to "ADYEN" or "BRAINTREE" by any intelligence rule.
```

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — Waterfall & bar charts
- [Framer Motion](https://www.framer.com/motion/) — Transaction row animations
