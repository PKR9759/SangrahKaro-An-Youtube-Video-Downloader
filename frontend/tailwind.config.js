/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        'dark-red': '#C8102E'
      },
    },
  },
  plugins: [],
}