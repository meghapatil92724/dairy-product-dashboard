/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5d4cac",
        primaryHover: "#a493f7",
        surface: "#f5f6f7",
        surfaceDark: "#e0e3e4",
        lavender: "#A594F9",
        mint: "#98D8C8",
        skyBlue: "#95D5EE",
        warmPeach: "#FFDAB9",
        roseGlow: "#FFB6C1",
      },
      fontFamily: {
        heading: ["Comfortaa", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
}
