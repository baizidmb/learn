/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0d0c0b',
          900: '#141210',
          850: '#1a1815',
          800: '#231f1a',
          700: '#342e27',
          600: '#484037',
        },
        paprika: {
          400: '#f07452',
          500: '#e05a36',
          600: '#c84320',
          700: '#a23216',
        },
        brass: {
          300: '#ecd078',
          400: '#e4c153',
          500: '#d99b26',
          600: '#b87c17',
        },
        ticket: {
          paper: '#faf6ed',
          darkPaper: '#26221c',
          line: '#e2dac6',
          text: '#221e1a',
          muted: '#6e6456',
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      }
    },
  },
  plugins: [],
}
