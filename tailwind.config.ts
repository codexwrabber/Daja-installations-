import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'media',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaf3ff',
          100: '#d3e6ff',
          200: '#a6ccff',
          300: '#78b1ff',
          400: '#4a97ff',
          500: '#1c7dff',
          600: '#0f63d6',
          700: '#0c4ea8',
          800: '#0a3d84',
          900: '#082f66',
        },
        surface: {
          light: '#ffffff',
          lightAlt: '#f4f8ff',
          dark: '#050b18',
          darkAlt: '#0b1830',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(12, 78, 168, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
