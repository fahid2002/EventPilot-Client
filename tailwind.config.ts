import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1"
        },
        mint: {
          400: "#2dd4bf",
          500: "#14b8a6"
        },
        amberx: "#f59e0b"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(2, 8, 23, 0.10)",
        glow: "0 18px 80px rgba(14, 165, 233, 0.25)"
      }
    }
  },
  plugins: []
};
export default config;
