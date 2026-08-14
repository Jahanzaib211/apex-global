import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

/**
 * Apex Group of Companies brand palette.
 *
 * This file was lost when the app moved into the monorepo. Tailwind v3 with no
 * config falls back to `content: []`, which emits the preflight reset and *no
 * utility classes at all* — with no build failure to show for it. The site
 * served unstyled HTML. Restored from the pre-migration app.
 *
 * One deliberate change from the original: `slate` was a flat `'#2C3E50'`,
 * which in Tailwind v3 replaces the entire built-in slate scale rather than
 * extending it — so `bg-slate-100`, `border-slate-200` and `border-slate-300`,
 * all of which this app's markup uses, generated nothing. Spreading the
 * default scale keeps those working while preserving the bare `text-slate`
 * the brand uses in 44 places.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1431",
        gold: "#F2A900",
        cream: "#F5F4F0",
        charcoal: "#1A1A1A",
        slate: { ...colors.slate, DEFAULT: "#2C3E50" },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        editorial: ["var(--font-editorial)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
