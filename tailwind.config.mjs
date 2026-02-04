/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Colors - ASTRO Theme
        primary: {
          50: "#e8eafc",
          100: "#c5c9f8",
          200: "#9ea5f3",
          300: "#7780ed",
          400: "#5965e9",
          500: "#1A2DE7", // Main primary
          600: "#1727d0",
          700: "#1320b5",
          800: "#0f199a",
          900: "#080d6a",
        },
        // Secondary - Lavender Grey
        secondary: {
          50: "#f5f4f7",
          100: "#e8e6ed",
          200: "#d5d2de",
          300: "#b8b3c7",
          400: "#9a94af",
          500: "#827D9C", // Main secondary
          600: "#706a8a",
          700: "#5d5873",
          800: "#4d495f",
          900: "#413e4f",
        },
        // Accent - Violet
        violet: {
          50: "#faf5fc",
          100: "#f4e9f9",
          200: "#ebd6f4",
          300: "#dbb5ea",
          400: "#c588dc",
          500: "#8F29BC", // Main violet
          600: "#7d24a5",
          700: "#691d88",
          800: "#571970",
          900: "#49185c",
        },
        // Accent - Pink/Magenta
        magenta: {
          50: "#fef1fa",
          100: "#fee5f7",
          200: "#ffcbf0",
          300: "#ffa1e3",
          400: "#F062C8", // Main magenta
          500: "#e53fa8",
          600: "#d31f89",
          700: "#b7136e",
          800: "#97135a",
          900: "#7d164d",
        },
        // Neutral - Steel Blue
        steel: {
          50: "#f4f6f9",
          100: "#e6eaf1",
          200: "#d2d9e6",
          300: "#b3bed4",
          400: "#8e9dbe",
          500: "#5B78B0", // Main steel
          600: "#4d659c",
          700: "#425380",
          800: "#3a476a",
          900: "#333d5a",
        },
        // Background Colors
        surface: {
          50: "#ECECEC", // Light surface
          100: "#e0e0e0",
          200: "#c7c7c7",
          300: "#a3a3a3",
          800: "#1e1e2e",
          900: "#13131f",
          950: "#0a0a12",
        },
        // Dark theme backgrounds
        dark: {
          100: "#2a2a3e",
          200: "#232336",
          300: "#1c1c2e",
          400: "#161625",
          500: "#11111d",
          600: "#0d0d16",
          700: "#09090f",
          800: "#050508",
          900: "#020203",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(26, 45, 231, 0.3)",
        "glow-violet": "0 0 20px rgba(143, 41, 188, 0.3)",
        "glow-magenta": "0 0 20px rgba(240, 98, 200, 0.3)",
        card: "0 4px 20px rgba(0, 0, 0, 0.25)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #1A2DE7 0%, #8F29BC 100%)",
        "gradient-accent": "linear-gradient(135deg, #8F29BC 0%, #F062C8 100%)",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      },
    },
  },
  plugins: [],
};
