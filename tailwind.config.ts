import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        unicorn: {
          void: "#08080a",
          charcoal: "#0d0d12",
          graphite: "#17171c",
          slate: "#25252d",
          iron: "#31313a",
          ash: "#62626f",
          fog: "#8b8e9c",
          pearl: "#aeaac0",
          chalk: "#dad7de",
          "lavender-beam": "#ab8ff1",
          "iris-glow": "#8960f0",
        },
        // Kept for numbers, sliders, warnings, and alerts
        data: {
          emerald: "#00d4aa",
          green: "#10b981",
          cyan: "#38bdf8",
          amber: "#f59e0b",
          coral: "#ef4444",
          purple: "#a855f7",
          iris: "#8960f0",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        tags: "3px",
        cards: "10px",
        buttons: "3px",
        inputs: "3px",
      },
      boxShadow: {
        keyline: "rgb(49, 49, 58) 0px -1px 0px 0px",
        sm: "rgba(0, 0, 0, 0.25) 0px 1px 4px 0px",
        "sm-2": "rgba(0, 0, 0, 0.4) 0px 2px 4px -1.5px",
        aurora: "0 0 50px rgba(142, 108, 228, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
