/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
      },
      backgroundImage: {
        city: 'radial-gradient(circle at top left, rgba(37,99,235,0.25), transparent 38%), radial-gradient(circle at 80% 10%, rgba(16,185,129,0.2), transparent 35%), linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'
      }
    }
  },
  plugins: []
};
