/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lightPurple: '#C890FF',
        darkPurple:  '#7919FF',
        green:       '#32E685',
        black:       '#000000',
        white:       '#FFFFFF',
      },
    },
  },
  plugins: [],
}
