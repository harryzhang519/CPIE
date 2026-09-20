# CPIE — Payment Intelligence Engine

A live, interactive visualization of a commercial payment infrastructure stack — intelligent routing, unit economics, and a 3-tier monetization model. Built for a Stripe Case Competition demo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## What It Does

Simulates a real-time payment processing stack with:

- **Intelligent Routing Engine** — routes transactions based on BIN country (cross-border uplift) and processor latency (dynamic fallback to Stripe when Braintree degrades)
- **Radar Fraud Blocking** — configurable ML intercept rate with cost savings attribution
- **Soft Decline Retry** — recovers failed transactions across processors
- **3-Tier Monetization Model** (Slide 5):
  - Tier 1 — Bundled: `$0` (included with processing)
  - Tier 2 — Intelligence Pro: `$0.02 × screened transactions`
  - Tier 3 — Outcome-Linked: `Recovered GMV × negotiated %`

All data is generated locally in the browser — no backend, no database, no external services.

---

## Dashboard

| Panel | Description |
|---|---|
| **KPI Header** | GMV, Auth Rate (vs baseline), Latency, PCI-DSS, Revenue Uplift, Stripe Revenue Capture |
| **Live Transaction Log** | Animated feed of last 15 transactions with routing decisions and outcome pills |
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
| Baseline Latency | 200ms | Triggers Braintree → Stripe fallback above 1.5× |
| Auth Retry Success Rate | 65% | Tier 3 revenue and funnel recovery stage |
| Fraud Block Rate | 4% | Radar intercept rate and fraud savings card |
| Volume (TXN/s) | 1/s | Simulation speed |
| Tier 3 Negotiated % | 15% | Revenue share on recovered GMV |
| Cross-Border BIN Mix | 40% | Frequency of BIN uplift routing events |

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — Waterfall & bar charts
- [Framer Motion](https://www.framer.com/motion/) — Transaction row animations
>>>>>>> 1d902d6 (feat: Stripe B2B Analytics Dashboard with Unicorn Studio styling)
