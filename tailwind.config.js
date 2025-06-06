/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          200: "#f9e5b9",
          300: "#f8d58e",
          400: "#f7c85f",
          500: "#e0b347",
          600: "#c79b3a",
          700: "#a77e2c",
        },
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transformOrigin: {
        center: "center",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  plugins: [require("tailwindcss-rtl")],
};
