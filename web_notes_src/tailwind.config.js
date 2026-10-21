/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        aura: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(0,0,0,0.1)',
        'card-dark': '0 12px 35px -10px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
