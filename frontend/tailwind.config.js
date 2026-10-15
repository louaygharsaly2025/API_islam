/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'uthmani': ['UthmaniFont', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'handlee': ['Handlee', 'cursive'],
        'lpmq': ['LPMQ IsepMisbah', 'serif'],
      },
    },
  },
  plugins: [],
}