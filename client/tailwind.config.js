/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#660099',
          light: '#663399',
          dark: '#6600CC',
        },
        secondary: '#FF00CC',
      },
    },
  },
  plugins: [],
}