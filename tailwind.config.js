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
        dark: {
          text: '#eef0f7',
          background: '#060e23',
          primary: '#819cfd',
          secondary: '#23367b',
          accent: '#3a5dd9'
        },
        light: {
          text: '#080a11',
          background: '#dce4f9',
          primary: '#021d7e',
          secondary: '#8497dc',
          accent: '#2648c5'
        }
      }
    }
  },
  plugins: []
};
