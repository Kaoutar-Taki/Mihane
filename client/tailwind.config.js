/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Noto Sans Arabic', 'Arial', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: '#F97316',
        secondary: '#FACC15',
        light: '#FFF7ED',
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}
