import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apex Holdings palette — matched to uploaded logo / Color Pallet
        ink: "#0B1431", // deep navy (logo, primary)
        navy: {
          900: "#080D24",
          800: "#0B1431", // primary brand navy
          700: "#141C42",
          600: "#1F2854",
        },
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#6B7480", // logo slate grey
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
        // Saffron Gold — vibrant accent from logo
        gold: {
          50: "#FDF8E8",
          100: "#FAEEC4",
          200: "#F5DC8A",
          300: "#EFC552",
          400: "#E8B02A", // PRIMARY ACCENT
          500: "#D19919",
          600: "#A77A12",
          700: "#7A5A0B",
        },
        brand: {
          DEFAULT: "#0B1431",
          accent: "#E8B02A",
          dark: "#080D24",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      letterSpacing: {
        "wide-1": "0.08em",
        "wide-2": "0.16em",
        "wide-3": "0.24em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px rgba(11,18,32,0.06)",
        "card-hover": "0 2px 4px rgba(11,18,32,0.06), 0 16px 40px rgba(11,18,32,0.10)",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        kenburns: "kenburns 18s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        kenburns: {
          "0%, 100%": { transform: "scale(1) translate(0,0)" },
          "50%": { transform: "scale(1.08) translate(-1%, -1%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
