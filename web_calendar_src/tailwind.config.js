/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#2dd4bf',
          500: '#19e6c8',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        obsidian: {
          base: '#030707',
          surface: '#051211',
          elevated: '#081a18',
        },
      },
      boxShadow: {
        'popover': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 16px rgba(25, 230, 200, 0.1)',
        'modal': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(25, 230, 200, 0.15)',
        'glow-teal': '0 0 24px rgba(25, 230, 200, 0.35)',
      },
    },
  },
  plugins: [],
}
