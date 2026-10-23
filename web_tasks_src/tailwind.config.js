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
        primary: {
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
        },
        obsidian: {
          base: '#030707',
          surface: '#051211',
          elevated: '#081a18',
        },
      },
      boxShadow: {
        'popover': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 16px rgba(25, 230, 200, 0.15)',
        'modal': '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(25, 230, 200, 0.2)',
        'task': '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(45, 212, 191, 0.15)',
        'glow-teal': '0 0 20px rgba(25, 230, 200, 0.35)',
      },
    },
  },
  plugins: [],
}
