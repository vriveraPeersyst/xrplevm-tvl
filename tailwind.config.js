/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      lightPurple: '#C890FF',
      darkPurple:  '#7919FF',
      green:       '#32E685',
      black:       '#000000',
      white:       '#FFFFFF',
    },
    extend: {
      fontFamily: {
        work: ['Work Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
