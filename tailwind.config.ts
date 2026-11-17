import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7f2",
          100: "#e4ecdf",
          200: "#c9d8c0",
          300: "#a4bc96",
          400: "#7f9f6d",
          500: "#5f824d",
          600: "#48673a",
          700: "#39512f",
          800: "#2f4228",
          900: "#1f3520",
          950: "#142316",
        },
        accent: {
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
        },
        soil: {
          50: "#fbfaf7",
          100: "#f6f3ec",
          200: "#ece6d8",
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(31, 53, 32, 0.08)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
