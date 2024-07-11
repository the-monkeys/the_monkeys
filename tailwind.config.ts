import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      jost: ['var(--font-jost)'],
      josefin_Sans: ['var(--font-josefin_Sans)'],
      playfair_Display: ['var(--font-playfair_Display)'],
    },
    extend: {
      colors: {
        primary: {
          monkeyOrange: '#ff462e',
          monkeyBlack: '#101010',
          monkeyWhite: '#FFF4ed',
        },
        secondary: {
          darkGrey: '#2b2b2b',
          lightGrey: '#4f4f4f',
          white: '#f2f2f3',
        },
        alert: {
          red: '#ED3232',
          green: '#34A853',
        },
      },
      borderWidth: {
        '1': '1px',
      },
      keyframes: {
        'opacity-pulse': {
          '0%': {
            opacity: '0.25',
          },
          '50%': {
            opacity: '0.5',
          },
          '100%': {
            opacity: '0.25',
          },
        },
        'icon-shake': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(15deg)',
          },
          '50%': {
            transform: 'rotate(-10deg)',
          },
          '75%': {
            transform: 'rotate(5deg)',
          },
          '100%': {
            transform: 'rotate(0)',
          },
        },
        'loader-rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        'appear-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'icon-shake': 'icon-shake 0.6s ease-in-out',
        'opacity-pulse': 'opacity-pulse 1s ease-in-out infinite',
        'loader-rotate': 'loader-rotate 0.6s linear infinite',
        'appear-up': 'appear-up .8s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
