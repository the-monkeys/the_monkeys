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
    animation: {
      shake: 'shake 600ms ease-in-out',
      pulse: 'pulse 1000ms ease-in-out infinite',
      rotate: 'rotate 800ms linear infinite',
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
      backgroundImage: {
        'custom-gradient1':
          'linear-gradient(237.34deg, rgba(255, 70, 46, 0) 5.59%, rgba(255, 70, 46, 0.15) 53.05%, rgba(255, 70, 46, 0) 79.73%)',
        'custom-gradient2':
          'linear-gradient(304.84deg, rgba(255, 70, 46, 0) 1.8%, rgba(255, 70, 46, 0.15) 47.81%, rgba(255, 70, 46, 0) 73.66%)',
        'custom-gradient3':
          'linear-gradient(221.33deg, rgba(255, 70, 46, 0) 1.43%, rgba(255, 70, 46, 0.15) 65.81%, rgba(255, 70, 46, 0) 101.98%)',
      },
      keyframes: {
        pulse: {
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
        shake: {
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
        rotate: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
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
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
