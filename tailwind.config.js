/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary palette (slate blue)
        primary: {
          50: '#f5f7fa',
          100: '#e9eef5',
          200: '#d5dfe8',
          300: '#b3c5d6',
          400: '#8da4be',
          500: '#6C7B95', // Main primary color
          600: '#556380',
          700: '#455069',
          800: '#3a4257',
          900: '#333a4c',
        },
        // Secondary palette (sage green)
        secondary: {
          50: '#f5f9f7',
          100: '#e8f2ec',
          200: '#d5e6dd',
          300: '#A3C1AD', // Main secondary color
          400: '#7fa48b',
          500: '#658b72',
          600: '#4e7159',
          700: '#3e594b',
          800: '#334a3f',
          900: '#2b3e34',
        },
        // Accent palette (coral)
        accent: {
          50: '#fff5f5',
          100: '#ffe6e6',
          200: '#ffcccc',
          300: '#ff9999',
          400: '#ff8080',
          500: '#FF6B6B', // Main accent color
          600: '#ff3333',
          700: '#ff0000',
          800: '#cc0000',
          900: '#990000',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};