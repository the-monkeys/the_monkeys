import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			borderWidth: {
				"1": "1px",
			},
		},
		colors: {
			primary: {
				monkeyOrange: "#ff462e",
				monkeyBlack: "#101010",
				monkeyWhite: "#FFF4ed",
			},
			secondary: {
				darkGrey: "#2b2b2b",
				lightGrey: "#4f4f4f",
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
		animation: {
			shake: "shake 600ms ease-in-out",
		},
		keyframes: {
			shake: {
				"0%": {
					transform: "rotate(0deg)",
				},
				"25%": {
					transform: "rotate(15deg)",
				},
				"50%": {
					transform: "rotate(-10deg)",
				},
				"75%": {
					transform: "rotate(5deg)",
				},
				"100%": {
					transform: "rotate(0)",
				},
			},
		},
	},
	plugins: [],
};
export default config;
