import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // Tema oscuro como base — la marca vive en negro + naranja brillante.
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        brand: {
          ink: "#0A0807",        // negro cálido (fondo)
          night: "#14100E",      // negro un toque más alto
          ember: "#1F1610",      // marrón oscuro
          orange: "#E85D1F",     // NARANJA principal del logo
          tangerine: "#FF7A3D",  // hover/luz
          ember2: "#C24412",     // sombra del naranja
          gold: "#D4A23A",       // oro Alhambra (detalles)
          rose: "#F4A06B",       // pastel cálido
          cream: "#FBE9D6",      // texto crema
          paper: "#FFF6E9",      // crema claro
          tile: "#1B2D2A",       // verde mosaico apagado
        },
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          alt: "rgb(var(--bg-alt) / <alpha-value>)",
          inverse: "rgb(var(--bg-inverse) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          inverse: "rgb(var(--ink-inverse) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          contrast: "rgb(var(--accent-contrast) / <alpha-value>)",
        },
        line: "rgb(var(--line))",
      },
      fontFamily: {
        // Display ornamental (lettering tipo logo) — Almendra SC desde Google Fonts.
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        // Display alternativo (script con personalidad)
        script: ["var(--font-script)", "var(--font-display)", "cursive"],
        // Texto humanista para legibilidad
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 8rem)", { lineHeight: "0.95", letterSpacing: "0", fontWeight: "400" }],
        "display-lg": ["clamp(2.75rem, 6.5vw, 5.5rem)", { lineHeight: "1", letterSpacing: "0.005em", fontWeight: "400" }],
        "display-md": ["clamp(1.85rem, 3.6vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "0.01em", fontWeight: "400" }],
      },
      backgroundImage: {
        "spotlight":
          "radial-gradient(ellipse at top, rgba(232,93,31,0.18), transparent 55%)",
        "ember":
          "radial-gradient(800px 500px at 80% 110%, rgba(232,93,31,0.22), transparent 60%)",
        "festival":
          "radial-gradient(1100px 600px at 10% -10%, rgba(232,93,31,0.18), transparent 60%), radial-gradient(900px 600px at 100% 30%, rgba(212,162,58,0.10), transparent 60%), radial-gradient(900px 700px at 30% 110%, rgba(232,93,31,0.10), transparent 60%)",
        "noise": "url('/brand/noise.svg')",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(0, 0, 0, 0.55)",
        glow: "0 0 0 1px rgba(232,93,31,0.45), 0 12px 40px -12px rgba(232,93,31,0.6)",
        emboss: "inset 0 1px 0 rgba(255,246,233,0.06), 0 1px 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { textShadow: "0 0 20px rgba(232,93,31,0.4), 0 0 40px rgba(232,93,31,0.2)" },
          "50%": { textShadow: "0 0 28px rgba(232,93,31,0.6), 0 0 60px rgba(232,93,31,0.35)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "47%, 49%": { opacity: "0.85" },
          "53%": { opacity: "0.95" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 50s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        glow: "glow 4s ease-in-out infinite",
        flicker: "flicker 5s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
