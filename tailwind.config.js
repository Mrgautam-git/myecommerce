/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include your React files
    './public/index.html',        // Include public HTML files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8', // Add custom colors
      },
      spacing: {
        128: '32rem', // Add custom spacing
      },
    },
  },
  plugins: [],
};
