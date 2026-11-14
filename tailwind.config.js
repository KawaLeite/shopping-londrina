import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
          tint: 'var(--color-primary-tint)',
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: 'var(--color-primary)',
          600: 'var(--color-primary)',
          700: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          tint: 'var(--color-accent-tint)',
          400: 'var(--color-accent)',
          500: 'var(--color-accent)',
          600: 'var(--color-accent-dark)',
        },
        londrina: {
          red: '#C8102E',
          darkRed: '#9B0B22',
          crimson: '#E11D48',
          terra: '#8B1E24',
          silver: '#C0C0C0',
          coffee: '#D97706',
          gold: '#F59E0B',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [forms, animate],
};

