/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F17",
        surface: "#121824",
        elevated: "#192333",
        border: "#263247",
        foreground: "#E7EDF7",
        muted: "#91A0B5",
        primary: "#3B82F6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#38BDF8"
      },
      boxShadow: { panel: "0 12px 36px rgba(0,0,0,.18)" },
      borderRadius: { panel: "14px" }
    }
  },
  plugins: []
};
