/** / @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screen: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      dance: "Dancing Script",
    },
    extend: {
      colors: {
        offWhite: "#FFFAFA",
        lightBlack: "#343434",
      },
    },
  },
  plugins: [],
};
