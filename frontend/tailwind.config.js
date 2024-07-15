/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'roboto' : ["Roboto", 'sans-serif'],
        'bonaNova': ["Bona Nova SC", "serif"],
        "castoro": ["Castoro Titling", "serif"],
        "antonSC": ["Anton SC", "sans-serif"],
        "robotoCondensed": ["Roboto Condensed", "sans-serif"],
        "merriweather":["Merriweather", "serif"]
      }
    },
  },
  plugins: [
    // ...other plugins
  ],
}

