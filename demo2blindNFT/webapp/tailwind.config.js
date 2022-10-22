/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "1080px": "1080px",
      },
      height: {
        "640px": "640px",
      },
    },
  },
  plugins: [],
};
