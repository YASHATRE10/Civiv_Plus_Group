/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}', './src/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        accent: '#F59E0B',
        surface: '#F8FAFC'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(37, 99, 235, 0.12)',
        card: '0 8px 28px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
