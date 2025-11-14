/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        // SpendWise warm color palette
        'warm': {
          50: '#F9F8F6',   // Soft beige background
          100: '#EFE9E3',  // Cream tone
          200: '#E5DDD5',  // Light taupe
          300: '#D9CFC7',  // Taupe for cards
          400: '#C9B59C',  // Warm accent brown
          500: '#B8A082',  // Medium brown
          600: '#A08B6B',  // Darker brown
          700: '#8B7355',  // Deep brown
          800: '#6B5A44',  // Very dark brown
          900: '#4A3F33',  // Almost black brown
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 1s ease-in-out 2',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
