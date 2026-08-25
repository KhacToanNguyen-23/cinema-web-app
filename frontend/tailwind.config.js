/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cgv-red': '#E50914',
        'dark-bg': '#000000',
        'dark-card': '#141414',
      }
    },
  },
  plugins: [],
}
