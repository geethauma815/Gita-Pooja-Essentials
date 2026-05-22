/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crimson: {
          light: '#a31535',
          DEFAULT: '#800020', // Kumkum Red
          dark: '#590014',
        },
        gold: {
          light: '#f1d575',
          DEFAULT: '#D4AF37', // Divine Gold
          dark: '#9a7c20',
        },
        amber: {
          light: '#ffb33b',
          DEFAULT: '#FF9900', // Haldi Yellow / Marigold
          dark: '#cc7a00',
        },
        cream: {
          light: '#ffffff',
          DEFAULT: '#FAF6F0', // Sacred Cream background
          dark: '#eae2d5',
        },
        darkslate: {
          light: '#3a2d22',
          DEFAULT: '#241C15', // Text & dark mode base
          dark: '#120d09',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        serif: ['var(--font-cinzel)', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
