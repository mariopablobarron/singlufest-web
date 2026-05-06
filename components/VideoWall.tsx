"use client";

import { motion } from "framer-motion";
import { VideoEmbed } from "./VideoEmbed";

/**
 * Mosaico vertical de Reels — pone en valor el contenido del Instagram.
 * Cada vídeo en 9:16, animados al entrar en viewport, con borde naranja al hover.
 */
export function VideoWall({
  items,
}: {
  items: Array<{ url: string; title?: string; caption?: string }>;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((it, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-bg-alt transition-all hover:border-brand-orange/60 hover:shadow-glow"
        >
          <VideoEmbed url={it.url} title={it.title} />
          {(it.title || it.caption) && (
            <figcaption className="p-4">
              {it.title && (
                <p className="font-display text-lg text-ink group-hover:text-brand-orange transition-colors">
                  {it.title}
                </p>
              )}
              {it.caption && <p className="text-xs text-ink-muted line-clamp-2 mt-1">{it.caption}</p>}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}
