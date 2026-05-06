"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MoonOrnament, PomegranateOrnament } from "./Background";

export function HeroOrnaments() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ y, opacity }}
      className="pointer-events-none absolute inset-0 -z-10"
      // ref-position fix para framer-motion useScroll (necesita non-static).
    >
      <MoonOrnament className="absolute top-16 left-6 md:left-16 w-24 md:w-32 text-brand-orange/40 animate-floaty" />
      <PomegranateOrnament className="absolute top-24 right-8 md:right-24 w-12 md:w-16 text-brand-orange/60 animate-floaty" />
      <PomegranateOrnament className="absolute bottom-16 left-1/4 w-8 md:w-10 text-brand-gold/60 animate-floaty" />
      <MoonOrnament className="absolute bottom-24 right-12 w-16 md:w-24 text-brand-gold/30 rotate-180" />
    </motion.div>
  );
}
