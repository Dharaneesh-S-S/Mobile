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
        android: {
          surface: {
            light: '#f8f9fa',
            dark: '#121316',
          },
          card: {
            light: '#ffffff',
            dark: '#1e1f24',
          },
          cardSubtle: {
            light: '#f1f3f5',
            dark: '#282a30',
          },
          primary: '#388e3c',
          blue: '#1a73e8',
          purple: '#8430ce',
          teal: '#00796b',
          amber: '#f29900',
          coral: '#d93025',
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'sheet': '0 -8px 30px rgba(0, 0, 0, 0.15)',
        'phone': '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 12px #262626, 0 0 0 14px #404040',
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Roboto', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
