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
      }
    },
  },
  plugins: [],
}
