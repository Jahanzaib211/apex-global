/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1A1F4D", dark: "#11163A", light: "#2A3160" },
        slate2: { DEFAULT: "#2D3E5C", dark: "#1E2D44" },
        amber2: { DEFAULT: "#F5A623", dark: "#D8901C", light: "#FFB940" },
        ink: "#0B0E1A",
        paper: "#FFFFFF",
        mist: "#F4F6FA",
        steel: "#5C6678",
        line: "#E4E8F0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 30px -8px rgba(26, 31, 77, 0.15)",
        glow: "0 0 0 1px rgba(245, 166, 35, 0.3), 0 8px 32px -8px rgba(245, 166, 35, 0.25)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        fadeUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
