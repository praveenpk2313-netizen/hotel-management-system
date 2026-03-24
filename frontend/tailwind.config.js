/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003b95', // Booking Blue
          dark: '#002663',
          light: '#006ce4',
        },
        secondary: {
          DEFAULT: '#0f172a',
          dark: '#020617',
          light: '#1e293b',
        },
        accent: {
          DEFAULT: '#ffb700', // Booking Yellow
          dark: '#e0a100',
          light: '#ffc840',
        },
        background: '#ffffff',
        surface: '#ffffff',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'booking': '8px',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 59, 149, 0.1), 0 8px 15px -6px rgba(0, 0, 0, 0.05)',
        'booking': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'gold': '0 10px 20px -5px rgba(255, 183, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
