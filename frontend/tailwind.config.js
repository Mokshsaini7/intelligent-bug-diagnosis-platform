```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        surface: "#121824",
        elevated: "#192333",
        border: "#263247",

        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          light: "#60A5FA",
        },

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#38BDF8",

        foreground: "#F1F5F9",
        muted: "#94A3B8",
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },

      boxShadow: {
        panel: "0 8px 30px rgba(0, 0, 0, 0.20)",
        glow: "0 0 25px rgba(59, 130, 246, 0.15)",
      },

      borderRadius: {
        panel: "14px",
      },

      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },

  plugins: [],
};
```
