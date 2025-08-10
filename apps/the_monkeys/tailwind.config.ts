import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}',
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
      dm_sans: ['var(--font-dm_sans)'],
      ibm_plex_sans: ['var(--font-ibm_plex_sans)'],
    },
    extend: {
      colors: {
        brand: {
          orange: '#FF5542',
        },
        background: {
          dark: '#121212',
          light: '#FAFAFA',
        },
        foreground: {
          dark: '#2C2C2C',
          light: '#D9D9D9',
        },
        border: {
          dark: '#3F3F3F',
          light: '#CCCCCC',
        },
        text: {
          dark: '#FFFFFF',
          light: '#121212',
        },
        alert: {
          red: '#DC2626',
          green: '#16A34A',
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
          '50%': {
            scale: '1.3',
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
        'theme-spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(90deg)',
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
        'scale-up': 'scale-up 0.2s ease-in',
        'icon-shake': 'icon-shake 0.6s ease-in-out',
        'opacity-pulse': 'opacity-pulse 1s ease-in-out infinite',
        'loader-rotate': 'loader-rotate 0.8s linear infinite',
        'theme-spin': 'theme-spin 0.2s linear',
        'appear-up': 'appear-up .8s ease-out',
        'accordion-down': 'accordion-down 0.1s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
