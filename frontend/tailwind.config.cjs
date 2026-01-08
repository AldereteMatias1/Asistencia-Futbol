/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#1e88e5',
          600: '#1675c4',
          700: '#135fa0'
        }
      }
    }
  },
  plugins: []
};
