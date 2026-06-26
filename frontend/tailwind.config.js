/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        editorial: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          border: 'var(--border)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          500: 'var(--brand)',
          600: 'var(--brand-hover)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          500: 'var(--accent)',
        },
        success: {
          DEFAULT: 'var(--success)',
          500: 'var(--success)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 15px rgba(255, 87, 34, 0.3)',
        'glow-orange-lg': '0 0 25px rgba(255, 87, 34, 0.5)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
