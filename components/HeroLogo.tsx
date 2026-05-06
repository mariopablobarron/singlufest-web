"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-[min(90vw,720px)] aspect-[5/3]"
    >
      <Image
        src="/brand/logo.png"
        alt="Singlufest"
        fill
        priority
        sizes="(max-width: 768px) 90vw, 720px"
        className="object-contain drop-shadow-[0_0_60px_rgba(232,93,31,0.45)]"
      />
    </motion.div>
  );
}
