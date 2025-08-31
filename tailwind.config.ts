/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)", // custom shadow-card
      },
    },
  },
  plugins: [],
};
