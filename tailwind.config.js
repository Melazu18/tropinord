/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,mdx}"], // ✅ Add .mdx for blog support
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            a: {
              color: theme("colors.green.700"),
              "&:hover": {
                color: theme("colors.green.600"),
              },
            },
            h1: { color: theme("colors.green.800") },
            h2: { color: theme("colors.green.800") },
            h3: { color: theme("colors.green.800") },
            code: {
              backgroundColor: theme("colors.gray.100"),
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
            img: {
              borderRadius: theme("borderRadius.lg"),
            },
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.200"),
            a: { color: theme("colors.green.400") },
            h1: { color: theme("colors.green.300") },
            h2: { color: theme("colors.green.300") },
            h3: { color: theme("colors.green.300") },
            code: {
              backgroundColor: theme("colors.gray.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-rtl")],
};
