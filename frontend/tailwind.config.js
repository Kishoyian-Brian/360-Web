/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts,js}",
    "./src/**/*.component.{html,ts,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Karla', 'sans-serif'],
        'karla': ['Karla', 'sans-serif'],
      },
      colors: {
        'brand': '#32529d',
        'brand-blue': '#32529d',
      },
    },
  },
  plugins: [],
}