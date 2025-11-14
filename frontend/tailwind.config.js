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
        // Neon colors - matching cyberpunk gaming aesthetic
        'neon-cyan': '#00FFFF',      // Bright cyan blue
        'neon-pink': '#FF33CC',      // Hot pink/magenta
        'neon-purple': '#9d00ff',    // Vibrant purple
        // Dark backgrounds
        'dark-1': '#000000',
        'dark-2': '#0a0010',
        'dark-3': '#000015',
        'dark-4': '#0a001f',
      },
      boxShadow: {
        'neon': '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, inset 0 0 10px rgba(0, 255, 255, 0.1)',
        'neonPink': '0 0 10px #FF33CC, 0 0 20px #FF33CC, 0 0 30px #FF33CC, inset 0 0 10px rgba(255, 51, 204, 0.1)',
        'neonPurple': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #9d00ff, inset 0 0 10px rgba(157, 0, 255, 0.1)',
        'neon-cyan-sm': '0 0 5px #00FFFF, 0 0 10px #00FFFF',
        'neon-pink-sm': '0 0 5px #FF33CC, 0 0 10px #FF33CC',
        'neon-purple-sm': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
      },
    },
  },
  plugins: [],
}