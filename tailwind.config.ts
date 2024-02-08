import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      jost: ["var(--font-jost)"],
      josefin_Sans: ["var(--font-josefin_Sans)"],
      playfair_Display: ["var(--font-playfair_Display)"],
    },
  },
  plugins: [],
};
export default config;
