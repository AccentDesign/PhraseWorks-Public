/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-datepicker/**/*.js',
  ],

  theme: {
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        'dark-teal': '#050a30',
        'mid-teal': '#2b6454',
        'light-teal': '#4a9582',
        'lighter-teal': '#63c2aa',
        cararra: '#eaeae1',
        'send-samples': '#dd4b39',
        'send-samples-dark': '#c23321',
      },
    },
  },
  plugins: [],
  darkMode: 'false',
};
