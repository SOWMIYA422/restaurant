/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: {
          50: '#fbf8ea',
          100: '#f5efcb',
          200: '#eedf9a',
          300: '#e5c960',
          400: '#dcb030',
          500: '#d4af37', // Imperial Gold
          600: '#b88616',
          700: '#936115',
          800: '#7a4e18',
          900: '#67411a',
          950: '#3c220b',
        },
        royal: {
          50: '#f0f5fa',
          100: '#e0ebf5',
          200: '#c5dbe9',
          300: '#9bc1d9',
          400: '#699fc4',
          500: '#4683ae',
          600: '#346993',
          700: '#2a5477',
          800: '#264763',
          900: '#0B192C', // Deep Royal Blue
          950: '#162b41',
        },
        crimson: {
          50: '#fdf3f4',
          100: '#fbe5e7',
          200: '#f7ced2',
          300: '#f0abb2',
          400: '#e57a86',
          500: '#d55060',
          600: '#bf3648',
          700: '#a22736',
          800: '#87232e',
          900: '#73262f', // Rich Crimson
          950: '#400f15',
        }
      }
    },
  },
  plugins: [],
}
