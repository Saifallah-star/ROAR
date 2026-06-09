/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        roar: {
          dark:          '#07070f',
          card:          '#0e0e1c',
          surface:       '#141428',
          border:        '#2a2a45',
          text:          '#f0ece0',
          muted:         '#6b6b8a',
          crimson:       '#c41e3a',
          'crimson-dark':'#8b1020',
          'crimson-glow':'rgba(196,30,58,0.35)',
          gold:          '#d4a017',
          'gold-light':  '#f0c040',
          'gold-glow':   'rgba(212,160,23,0.35)',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 20px rgba(196,30,58,0.4), 0 0 60px rgba(196,30,58,0.15)',
        'glow-gold':    '0 0 20px rgba(212,160,23,0.4), 0 0 60px rgba(212,160,23,0.15)',
        'card':         '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.16,1,0.3,1)',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(196,30,58,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(196,30,58,0.65)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
