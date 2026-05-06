import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
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
          carbon: "#0B0807",      // Carbón teatro
          ember: "#14100C",       // Brasa teatro alt
          bone: "#FBF6EB",        // Hueso papel
          parchment: "#F4EAD7",   // Pergamino papel alt
          orange: "#E85D1F",      // Naranja del logo
          tangerine: "#FF7A3D",   // Hover/luz
          burn: "#C24412",        // Brasa-deep
          gold: "#D4A23A",        // Oro Alhambra
          lemon: "#F5C56B",       // Limón scarcity
          wine: "#6B1D2E",        // Vino VIP / Mesa del Chef
          ink: "#1B1209",         // Tinta cálida
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
        // Brutal headline (Anton — sustituto gratis de Druk Wide)
        brutal: ["var(--font-brutal)", "Impact", "Anton", "sans-serif"],
        // Display ornamental (alma art-nouveau del logo)
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        // Script emocional
        script: ["var(--font-script)", "var(--font-display)", "cursive"],
        // Body
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(4rem, 11vw, 9rem)", { lineHeight: "0.9", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-lg": ["clamp(3rem, 7.5vw, 6.5rem)", { lineHeight: "0.92", letterSpacing: "-0.015em", fontWeight: "400" }],
        "display-md": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "0.96", letterSpacing: "-0.01em", fontWeight: "400" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.05", letterSpacing: "-0.005em", fontWeight: "400" }],
      },
      backgroundImage: {
        "spotlight": "radial-gradient(ellipse at top, rgba(232,93,31,0.18), transparent 55%)",
        "ember": "radial-gradient(800px 500px at 80% 110%, rgba(232,93,31,0.18), transparent 60%)",
        "festival": "radial-gradient(1100px 600px at 10% -10%, rgba(232,93,31,0.10), transparent 60%), radial-gradient(900px 600px at 100% 30%, rgba(212,162,58,0.10), transparent 60%), radial-gradient(900px 700px at 30% 110%, rgba(232,93,31,0.08), transparent 60%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(0, 0, 0, 0.18)",
        glow: "0 0 0 1px rgba(232,93,31,0.45), 0 12px 40px -12px rgba(232,93,31,0.6)",
        emboss: "inset 0 1px 0 rgba(255,246,233,0.06), 0 1px 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
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
        "fade-up": "fade-up 0.7s ease-out both",
        flicker: "flicker 5s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
