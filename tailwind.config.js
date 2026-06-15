/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F3EFE7',
        ink: '#1F2420',
        moss: '#5C6B4F',
        clay: '#B0613C',
        sand: '#E3DACB',
        line: '#D8CFC0',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Georgia"', 'serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
