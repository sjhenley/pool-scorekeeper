/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './.rnstorybook/stories/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oxygen', 'System']
      },
      colors: {
        'text': {
          50: '#eff0f5',
          100: '#e0e1eb',
          200: '#c1c3d7',
          300: '#a2a5c3',
          400: '#8387af',
          500: '#63699c',
          600: '#50547c',
          700: '#3c3f5d',
          800: '#282a3e',
          900: '#14151f',
          950: '#0a0b10'
        },
        'background': {
          50: '#efeff5',
          100: '#dfe0ec',
          200: '#c0c1d8',
          300: '#a0a1c5',
          400: '#8182b1',
          500: '#61639e',
          600: '#4e4f7e',
          700: '#3a3b5f',
          800: '#27283f',
          900: '#131420',
          950: '#0a0a10'
        },
        'primary': {
          50: '#eff0f5',
          100: '#e0e0eb',
          200: '#c0c2d8',
          300: '#a1a3c4',
          400: '#8285b0',
          500: '#62669d',
          600: '#4f527d',
          700: '#3b3d5e',
          800: '#27293f',
          900: '#14141f',
          950: '#0a0a10'
        },
        'secondary': {
          50: '#f2eff5',
          100: '#e5e0eb',
          200: '#cac0d8',
          300: '#b0a1c4',
          400: '#9682b0',
          500: '#7c629d',
          600: '#634f7d',
          700: '#4a3b5e',
          800: '#31273f',
          900: '#19141f',
          950: '#0c0a10'
        },
        'accent': {
          50: '#f4f0f5',
          100: '#e9e0eb',
          200: '#d3c1d7',
          300: '#bda2c3',
          400: '#a784ae',
          500: '#90659a',
          600: '#74517b',
          700: '#573c5d',
          800: '#3a283e',
          900: '#1d141f',
          950: '#0e0a0f'
        }
      }
    }
  },
  plugins: []
};
