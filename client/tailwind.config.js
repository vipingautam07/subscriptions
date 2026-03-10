/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#fdfbf7', // Off-white/cream background
        primary: '#FF90E8', // Neobrutalist pink
        secondary: '#90FFA9', // Neobrutalist green
        accent: '#90B4FF', // Neobrutalist blue
        danger: '#FF6B6B',
        warning: '#FFD93D',
        dark: {
          bg: '#1a1a1a',
          card: '#242424',
          text: '#f3f4f6'
        },
        light: {
          bg: '#fdfbf7',
          card: '#ffffff',
          text: '#111827'
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-dark': '4px 4px 0px 0px rgba(255,255,255,1)',
        'neo-sm-dark': '2px 2px 0px 0px rgba(255,255,255,1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
