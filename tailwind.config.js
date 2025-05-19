/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: "#061e14",
        background: "#ffffff",
        backgroundSecondary: "#f5f5f5",
        primary: "#17d171",
        secondary: "#8497e6",
        accent: "#7f58de",
        border: "#212121",
      },
      fontFamily: {
        poppins: ["Poppins Regular"],
        geist: ["Geist Regular"],
      },
    },
  },
  plugins: [],
};
