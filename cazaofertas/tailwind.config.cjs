/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {      colors: {
        primary: {
          DEFAULT: '#0071e3', // Apple blue
          dark: '#005ac2',
          light: '#2997ff',
          hover: '#1884f4',
        },
        secondary: {
          DEFAULT: '#6b7280', // More readable gray
          dark: '#4b5563',
          light: '#9ca3af',
        },
        accent: {
          DEFAULT: '#bf4800',
          light: '#f56300',
          hover: '#d95400',
        },
        bg: {
          light: '#f5f5f7',  // Light mode background
          dark: '#111827',   // Dark mode background (more readable)
          card: '#ffffff',
          cardDark: '#1f2937', // Lighter dark mode card
          hover: '#f8fafc',
          darkHover: '#2d3748',
        },
        text: {
          light: '#1f2937', // Dark text for light mode
          dark: '#f3f4f6',  // Light text for dark mode
          muted: '#6b7280', // Muted text for both modes
          mutedDark: '#9ca3af', // Muted text for dark mode
        }
      },
      borderRadius: {
        'large': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'medium': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
        'hard': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'slide-in': 'slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-from-right': 'slideInFromRight 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-from-left': 'slideInFromLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
