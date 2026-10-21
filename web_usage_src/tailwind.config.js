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
        wellbeing: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        zen: {
          bg: '#080B12',
          surface: '#0F1626',
          card: '#141D30',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          cardLight: '#ffffff',
          cardBorderLight: 'rgba(226, 232, 240, 0.8)',
        },
        android: {
          surface: {
            light: '#f8f9fa',
            dark: '#0e121d',
          },
          card: {
            light: '#ffffff',
            dark: '#141a29',
          },
          cardSubtle: {
            light: '#f1f5f9',
            dark: '#1e2638',
          },
          primary: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          teal: '#14b8a6',
          amber: '#f59e0b',
          coral: '#ef4444',
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
