/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ds: {
          bg: '#06080f',
          card: '#0d1525',
          'card-2': '#111827',
          border: 'rgba(14,165,233,0.12)',
          'border-hover': 'rgba(14,165,233,0.3)',
          cyan: '#0ea5e9',
          'cyan-light': '#38bdf8',
          indigo: '#6366f1',
          emerald: '#10b981',
          orange: '#f97316',
          purple: '#a855f7',
          text: '#f0f9ff',
          muted: '#94a3b8',
          dim: '#475569',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fadeInUp': 'fadeInUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
