import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kingdom: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        personal: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        pastel: {
          lavender: "#E8E0F0",
          lilac: "#DDD6F0",
          rose: "#FCE4EC",
          peach: "#FFE2D8",
          mint: "#D1FAE5",
          sky: "#E0F2FE",
          lemon: "#FEF9C3",
          cream: "#FFF7ED",
        },
        surface: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-pastel":
          "linear-gradient(135deg, #FDF2F8 0%, #EDE9FE 35%, #E0F2FE 65%, #FEF3C7 100%)",
        "gradient-pastel-warm":
          "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 50%, #ECFDF5 100%)",
        "gradient-kingdom":
          "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        "gradient-personal":
          "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
