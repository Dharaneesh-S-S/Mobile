/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rf: {
          bg: '#090d16',
          card: '#111827',
          surface: '#172033',
          border: '#233047',
          income: '#3b82f6',
          incomeDark: '#1d4ed8',
          expense: '#ef4444',
          expenseDark: '#b91c1c',
          transfer: '#64748b',
          net: '#10b981',
          accent: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}
