/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        triage: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
        },
        civic: {
          blue: '#1d4ed8',
          crimson: '#dc2626',
          amber: '#d97706',
          emerald: '#059669',
        }
      }
    },
  },
  plugins: [],
}
