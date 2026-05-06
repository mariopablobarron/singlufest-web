"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroBadge({ edition }: { edition: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-bg/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink backdrop-blur"
    >
      <Sparkles className="w-3 h-3 text-brand-orange animate-flicker" />
      <span>Granada · {edition}</span>
    </motion.div>
  );
}
