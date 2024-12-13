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
      arvo: ['var(--font-arvo)'],
      roboto: ['var(--font-roboto)'],
      dm_sans: ['var(--font-dm_sans)'],
      poppins: ['var(--font-poppins)'],
    },
    extend: {
      colors: {
        brand: {
          orange: '#FF5542',
        },
        background: {
          dark: '#191919',
          light: '#F2F2F2',
        },
        foreground: {
          dark: '#2C2C2C',
          light: '#D9D9D9',
        },
        border: {
          dark: '#696969',
          light: '#878787',
        },
        text: {
          dark: '#FAFAFA',
          light: '#1E1E1E',
        },
        alert: {
          red: '#EF4444',
          green: '#22C55E',
        },
        primary: {
          monkeyOrange: '#FF5542',
          monkeyBlack: '#191919',
          monkeyWhite: '#F2F2F2',
        },
        secondary: {
          darkGrey: '#2C2C2C',
          lightGrey: '#4f4f4f',
          white: '#f2f2f3',
        },
      },
      borderWidth: {
        '1': '1px',
      },
      keyframes: {
        'scale-up': {
          '0%': {
            scale: '0.8',
          },
          '100%': {
            scale: '1',
          },
        },
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
        'scale-up': 'scale-up 0.1s ease-in',
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
