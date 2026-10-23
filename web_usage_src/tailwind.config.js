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
        },
        obsidian: {
          base: '#030707',
          surface: '#051211',
          elevated: '#081a18',
        },
        wellbeing: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#2dd4bf',
          500: '#19e6c8',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#042f2e',
        },
        zen: {
          bg: '#030707',
          surface: '#051211',
          card: '#081a18',
          cardBorder: 'rgba(45, 212, 191, 0.12)',
          cardLight: '#ffffff',
          cardBorderLight: 'rgba(226, 232, 240, 0.8)',
        },
        android: {
          surface: {
            light: '#f8f9fa',
            dark: '#051211',
          },
          card: {
            light: '#ffffff',
            dark: '#081a18',
          },
          cardSubtle: {
            light: '#f1f5f9',
            dark: '#0c2422',
          },
          primary: '#19e6c8',
          blue: '#38bdf8',
          purple: '#8b5cf6',
          teal: '#19e6c8',
          amber: '#f59e0b',
          coral: '#ff6b6b',
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.65rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'sheet': '0 -10px 40px rgba(0, 0, 0, 0.25)',
        'phone': '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        'glow-emerald': '0 0 24px -2px rgba(16, 185, 129, 0.35)',
        'glow-card': '0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'glow-card-dark': '0 12px 35px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
