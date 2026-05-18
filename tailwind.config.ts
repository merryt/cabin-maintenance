import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f4',
          100: '#e1f0e5',
          200: '#c3e0cc',
          300: '#97c7a7',
          400: '#66a87e',
          500: '#428a5e',
          600: '#306d48',
          700: '#28573b',
          800: '#224631',
          900: '#1d3a2a',
          950: '#0f2016',
        },
      }
    },
  },
  plugins: [],
} satisfies Config

