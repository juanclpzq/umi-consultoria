/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "umi-blue": {
          dark: "#223979",
          light: "#7692CB",
          80: "rgba(34, 57, 121, 0.8)",
          60: "rgba(34, 57, 121, 0.6)",
          40: "rgba(34, 57, 121, 0.4)",
        },
        "umi-light-blue": {
          DEFAULT: "#7692CB",
          80: "rgba(118, 146, 203, 0.8)",
          60: "rgba(118, 146, 203, 0.6)",
          40: "rgba(118, 146, 203, 0.4)",
        },
      },
      fontFamily: {
        domus: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-source-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
