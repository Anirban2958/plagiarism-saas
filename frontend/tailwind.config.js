/**
 * =====================
 * Tailwind CSS Configuration for Next.js Project
 * =====================
 * - 'content': Specifies the files Tailwind should scan for class names
 * - 'theme': Customize your design system (colors, fonts, etc.)
 * - 'plugins': Add Tailwind or community plugins here
 */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // All JS/TS/JSX/TSX files in pages/
    "./components/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in components/
  ],
  theme: {
    extend: {}, // Extend the default Tailwind theme here
  },
  plugins: [],   // Add Tailwind plugins here (e.g., forms, typography)
}

