"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Capa de fondo cinematográfica: spotlight naranja, partículas (chispas) flotantes,
 * y luna geométrica abstraída del logo.
 */
export function FestivalBackground() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; d: number; s: number }>>([]);

  useEffect(() => {
    // genera 16 partículas con posiciones estables
    const arr = Array.from({ length: 16 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: Math.random() * 6 + 4,
      s: Math.random() * 1.6 + 0.8,
    }));
    setParticles(arr);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* spotlight superior */}
      <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full bg-spotlight opacity-90" />
      {/* ember inferior */}
      <div className="absolute -bottom-1/4 -right-32 w-[70rem] h-[70rem] rounded-full bg-ember blur-2xl" />
      {/* chispas */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full bg-brand-orange/70"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

/**
 * Pequeña ornamentación SVG: una luna creciente con patrón geométrico sencillo,
 * en homenaje al motivo de la Alhambra del logo.
 */
export function MoonOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      <path d="M44 12c-9.5 2-17 10.5-17 20s7.5 18 17 20c-2 1-4.4 1.5-7 1.5C24.8 53.5 16 44.7 16 33.5S24.8 13.5 36 13.5c2.6 0 5 .5 7 1.5z" fill="currentColor" fillOpacity="0.08" />
      <path d="M44 12c-9.5 2-17 10.5-17 20s7.5 18 17 20" />
      <path d="M30 27 l3-3 3 3 3-3 3 3" opacity="0.6" />
      <path d="M30 39 l3 3 3-3 3 3 3-3" opacity="0.6" />
      <circle cx="36" cy="33" r="2" opacity="0.6" />
    </svg>
  );
}

/** Granada (la fruta) — guiño al logo. */
export function PomegranateOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 4c1 1.6 2 2.6 3 3 .9.4 1 1.5.4 2.4-.5.8-.4 1.4.4 1.9 4 2.6 5.7 7.6 4 12.4-1.7 4.6-7 7-11.6 5.3-4.6-1.6-7-7-5.3-11.6 1-2.7 3-4.6 5.6-5.6.9-.3 1.2-1 .8-2-.5-.9-.3-1.7.5-2 .9-.3 1.7-1.4 2.2-3z" opacity="0.85" />
      <circle cx="14" cy="18" r="0.9" fill="#0A0807" opacity="0.8" />
      <circle cx="18" cy="20" r="0.9" fill="#0A0807" opacity="0.8" />
      <circle cx="13" cy="22" r="0.9" fill="#0A0807" opacity="0.8" />
      <circle cx="19" cy="24" r="0.9" fill="#0A0807" opacity="0.8" />
    </svg>
  );
}
