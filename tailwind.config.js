/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nansen: {
          black: '#0a0a0a',
          dark: '#111111',
          green: '#00d395',
          'green-dark': '#00a876',
          'green-light': '#00ffb3',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'marker-move': 'markerMove 2s ease-out forwards',
      },
      keyframes: {
        markerMove: {
          '0%': { left: '50%' },
          '100%': { left: 'var(--marker-position)' },
        }
      }
    },
  },
  plugins: [],
}
