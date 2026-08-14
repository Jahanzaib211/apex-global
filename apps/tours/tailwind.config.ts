import type { Config } from "tailwindcss";

/**
 * Apex Global Tours & Travels brand palette.
 *
 * Navy / charcoal = trust + premium, blue = international/calm, gold =
 * pilgrimage warmth.
 *
 * This file was lost when the app moved into the monorepo. Tailwind v3 with no
 * config falls back to `content: []`, which emits the preflight reset and *no
 * utility classes at all* — and silently drops the entire `@layer components`
 * block in `src/app/globals.css` as unused rather than erroring. The site
 * served unstyled HTML with no build failure to show for it. Restored verbatim
 * from the pre-migration app; every token below is referenced by markup or by
 * an `@apply` in globals.css, so removing one breaks a page.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2350",
          50: "#EEF0F8",
          100: "#D6DBED",
          200: "#AAB3D9",
          300: "#7B86C2",
          400: "#4F5BA8",
          500: "#2A3680",
          600: "#1B2350", // primary brand navy
          700: "#15193D",
          800: "#0F1230",
          900: "#0A0C22",
        },
        royal: {
          DEFAULT: "#1F3A66",
          50: "#EAF0FA",
          100: "#CBD9F0",
          200: "#9CB4E0",
          300: "#6C8DD0",
          400: "#4268BC",
          500: "#1F3A66",
          600: "#192F52",
          700: "#13233D",
          800: "#0D1829",
          900: "#070D14",
        },
        ink: {
          DEFAULT: "#33373D", // charcoal/grey from the logo sweep
          50: "#F4F5F7",
          100: "#E4E6EA",
          200: "#C4C9D1",
          300: "#9AA0AB",
          400: "#6F7682",
          500: "#33373D",
          600: "#2A2D32",
          700: "#202328",
          800: "#16181C",
          900: "#0B0C0F",
        },
        gold: {
          DEFAULT: "#F5B82E",
          50: "#FEF8E5",
          100: "#FCEDB8",
          200: "#F9DD7E",
          300: "#F7CD49",
          400: "#F5B82E", // primary brand gold
          500: "#D89C12",
          600: "#A87907",
          700: "#785505",
          800: "#483202",
          900: "#1E1300",
        },
        sand: {
          DEFAULT: "#FAF7F0",
          50: "#FDFCF7",
          100: "#FAF7F0", // pilgrimage warm neutral
          200: "#F1EAD8",
          300: "#E2D6B7",
          400: "#CFBE8E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(27, 35, 80, 0.15)",
        gold: "0 6px 28px -10px rgba(245, 184, 46, 0.55)",
        navy: "0 12px 40px -12px rgba(27, 35, 80, 0.45)",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, #F5B82E, transparent)",
        "navy-grad": "linear-gradient(135deg, #1B2350 0%, #1F3A66 60%, #0F1230 100%)",
        "gold-grad": "linear-gradient(135deg, #F5B82E 0%, #D89C12 100%)",
        "sand-grad": "linear-gradient(180deg, #FAF7F0 0%, #FFFFFF 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 184, 46, 0.6)" },
          "50%": { boxShadow: "0 0 0 14px rgba(245, 184, 46, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-gold": "pulse-gold 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
