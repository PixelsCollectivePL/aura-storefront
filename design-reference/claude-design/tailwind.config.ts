import type { Config } from "tailwindcss";

/**
 * AURA — Tailwind config (v4-compatible shape, also works on v3).
 * Tokens mirror `aura-mono-tokens.css` 1:1. Single source of truth lives in
 * that CSS file as custom properties — this config references them via
 * var(--m-*) so themes can be swapped without rebuilding Tailwind.
 *
 * Pair with globals.css that imports aura-mono-tokens.css before the
 * @tailwind directives.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    // Hard reset the default palette — Aura has no colour beyond mono + ok.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "var(--m-bg)",
      bg:           "var(--m-bg)",
      "bg-soft":    "var(--m-bg-soft)",
      "bg-soft-2":  "var(--m-bg-soft-2)",
      line:         "var(--m-line)",
      "line-2":     "var(--m-line-2)",
      mute:         "var(--m-mute)",
      "mute-2":     "var(--m-mute-2)",
      ink:          "var(--m-ink)",
      "ink-hi":     "var(--m-ink-hi)",
      "ink-inv":    "var(--m-ink-inv)",
      ok:           "var(--m-ok)",
      warn:         "var(--m-warn)",
    },

    fontFamily: {
      sans: ["Geist", "Söhne", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "sans-serif"],
      num:  ["Geist", "Söhne", "-apple-system", "sans-serif"],
    },

    fontSize: {
      eyebrow:    ["11px",   { lineHeight: "1",    letterSpacing: "0.12em",    fontWeight: "500" }],
      meta:       ["11.5px", { lineHeight: "1.4",  letterSpacing: "0",          fontWeight: "400" }],
      "body-xs":  ["11.5px", { lineHeight: "1.45" }],
      "body-sm":  ["12.5px", { lineHeight: "1.55" }],
      body:       ["14px",   { lineHeight: "1.55" }],
      "body-lg":  ["15.5px", { lineHeight: "1.6"  }],
      h3:         ["17px",   { lineHeight: "1.2",  letterSpacing: "-0.014em", fontWeight: "500" }],
      "h3-lg":    ["20px",   { lineHeight: "1.2",  letterSpacing: "-0.014em", fontWeight: "500" }],
      h2:         ["28px",   { lineHeight: "1.1",  letterSpacing: "-0.022em", fontWeight: "500" }],
      "h2-lg":    ["44px",   { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "500" }],
      h1:         ["48px",   { lineHeight: "1.05", letterSpacing: "-0.028em", fontWeight: "500" }],
      "h1-lg":    ["72px",   { lineHeight: "0.98", letterSpacing: "-0.03em",  fontWeight: "500" }],
      display:    ["56px",   { lineHeight: "0.96", letterSpacing: "-0.035em", fontWeight: "500" }],
      "display-lg": ["96px", { lineHeight: "0.94", letterSpacing: "-0.035em", fontWeight: "500" }],
    },

    borderRadius: {
      DEFAULT: "0",
      none: "0",
      xs: "2px",
      sm: "4px",
      pill: "9999px",
      full: "9999px",
    },

    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      1: "1px",
      2: "2px",
    },

    boxShadow: {
      none: "none",
      drawer:  "0 -16px 50px rgba(0,0,0,0.20)",
      panel:   "-16px 0 50px rgba(0,0,0,0.15)",
      popover: "0 12px 32px rgba(0,0,0,0.10)",
      toast:   "0 8px 24px rgba(0,0,0,0.16)",
      // intentionally no shadow-sm / shadow-md — flat brand
    },

    screens: {
      sm:  "480px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1440px",
    },

    extend: {
      spacing: {
        // Add the few non-standard rhythm steps used in the design.
        15: "60px", // listing grid row gap (desktop)
        18: "72px",
        22: "88px",
        26: "104px",
        30: "120px",
        // Mobile section padding sweet spots
        section: "64px",
        "section-lg": "120px",
      },
      maxWidth: {
        prose: "65ch",
        canvas: "1440px",
      },
      transitionTimingFunction: {
        "ease-out-soft": "cubic-bezier(.2,.7,.3,1)",
      },
      transitionDuration: {
        120: "120ms",
        220: "220ms",
        280: "280ms",
      },
      fontFeatureSettings: {
        tabular: '"tnum","ss01","cv11"',
      },
    },
  },

  // Inject base utilities for the design's type tokens. Tailwind v4: put
  // these in globals.css under @layer utilities. v3: use plugin form.
  plugins: [],
};

export default config;
