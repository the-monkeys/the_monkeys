import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      primary: {
        monkeyOrange: "#ff462e",
        monkeyBlack: "#101010",
        monkeyWhite: "#FFF4ed",
      },
      secondary: {
        darkGray: "#2b2b2b",
        lightGray: "#4f4f4f",
        white: "#f2f2f3",
      },
      alert: {
        red: "#F22020",
        green: "#34A853",
      },
    },
    fontFamily: {
      jost: ["var(--font-jost)"],
      josefin_Sans: ["var(--font-josefin_Sans)"],
      playfair_Display: ["var(--font-playfair_Display)"],
    },
  },
  plugins: [],
};
export default config;
