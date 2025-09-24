/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors - matching Welcome page
        light: {
          background: '#ffffff',
          surface: '#f8fafc',
          primary: '#1e1b4b', // indigo-950
          secondary: '#64748b', // slate-500
          accent: '#4f46e5', // indigo-600
          text: '#1e1b4b', // indigo-950
          'text-secondary': '#64748b', // slate-500
        },
        // Dark theme colors - matching Welcome page
        dark: {
          background: '#1e293b', // slate-800
          surface: '#1e293b', // slate-800
          primary: '#f1f5f9', // slate-100
          secondary: '#cbd5e1', // slate-300
          accent: '#4f46e5', // indigo-600
          text: '#f1f5f9', // slate-100
          'text-secondary': '#cbd5e1', // slate-300
        }
      },
    },
  },
  plugins: [],
}

