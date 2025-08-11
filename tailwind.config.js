/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          background: '#ffffff',
          surface: '#f8fafc',
          primary: '#000000',
          secondary: '#6b7280',
          accent: '#3b82f6',
          text: '#1f2937',
          'text-secondary': '#6b7280',
        },
        // Dark theme colors
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#ffffff',
          secondary: '#94a3b8',
          accent: '#60a5fa',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
        }
      },
    },
  },
  plugins: [],
}

