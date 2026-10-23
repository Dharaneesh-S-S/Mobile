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
        canvas: {
          base: '#030707',
          surface: '#051211',
          elevated: '#081a18',
        },
        teal: {
          primary: '#19E6C8',
          accent: '#2DD4BF',
          secondary: '#0D9488',
          deep: '#0B7F78',
          dark: '#064E3B',
        },
        coral: {
          expense: '#FF6B6B',
          dark: '#E11D48',
        },
        ice: {
          transfer: '#38BDF8',
        },
        txt: {
          heading: '#F4FFFD',
          body: '#94B5B0',
          muted: '#5B7B76',
          dim: '#354F4B',
        },
        glass: {
          subtle: 'rgba(6, 18, 17, 0.45)',
          medium: 'rgba(8, 24, 23, 0.65)',
          elevated: 'rgba(12, 32, 30, 0.82)',
          border: 'rgba(45, 212, 191, 0.12)',
          borderGlow: 'rgba(45, 212, 191, 0.30)',
          borderActive: 'rgba(25, 230, 200, 0.55)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 35px -5px rgba(25, 230, 200, 0.45)',
        'glow-teal-sm': '0 0 16px -2px rgba(25, 230, 200, 0.35)',
        'glow-teal-lg': '0 0 65px -10px rgba(25, 230, 200, 0.35)',
        'glow-white': '0 0 25px rgba(255, 255, 255, 0.25)',
        'glow-coral': '0 0 25px -5px rgba(255, 107, 107, 0.40)',
        'glass-card': '0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'card-featured': '0 0 50px -10px rgba(25, 230, 200, 0.30), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'ambient-glow': 'ambientPulse 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        ambientPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
