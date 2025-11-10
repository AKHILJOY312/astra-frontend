import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        light: ['"Motiva Sans Light"', "sans-serif"],
        bold: ['"Motiva Sans Bold"', "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2E186A",
          dark: "#18216D",
        },
        accent: "#FF825C",
        neutral: {
          50: "#F1F2F3",
          100: "#EDEFF5",
          200: "#CDD1D4",
        },
        black: "#000000",
        white: "#FFFFFF",
        overlay: "rgba(0, 0, 0, 0.85)",
      },
      gradientColorStops: {
        "primary-dark": "#18216D",
        primary: "#2E186A",
      },
    },
  },
  plugins: [],
};

export default config;
