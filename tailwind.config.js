/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          950: '#0b0a09',
          900: '#12100e',
          850: '#181512',
          800: '#221d19',
          750: '#2c2621',
          700: '#3a322b',
          600: '#4e433a',
        },
        copper: {
          300: '#ff9473',
          400: '#f0704d',
          500: '#e05a36',
          600: '#c84320',
          700: '#a23216',
        },
        champagne: {
          300: '#f3e3b7',
          400: '#e6c280',
          500: '#d99b26',
          600: '#b87c17',
        },
        ticket: {
          paper: '#faf5eb',
          darkPaper: '#241f1a',
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
