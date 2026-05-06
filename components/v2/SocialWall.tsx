import Link from "next/link";
import { ThemedSection } from "./SectionTheme";
import { VideoEmbed } from "../VideoEmbed";

const REELS_PLACEHOLDER = Array.from({ length: 9 }).map((_, i) => ({
  url: "https://www.instagram.com/reel/Cxxxxxxxxxx/",
  title: `Reel ${i + 1}`,
}));

export function SocialWallV2() {
  return (
    <ThemedSection theme="teatro" className="py-24 md:py-32 border-t border-line">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge !text-brand-orange !border-brand-orange/40 mb-4 animate-flicker">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange" />
              En vivo · #SingluFest
            </p>
            <h2 className="text-display-md text-balance">
              El movimiento
              <span className="block h-script text-brand-orange mt-1">ya está en marcha.</span>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/singlufest/"
            target="_blank"
            rel="noreferrer"
            className="btn-outline !text-brand-bone !border-brand-bone/30"
          >
            Sigue @singlufest
          </a>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {REELS_PLACEHOLDER.map((r, i) => (
            <li
              key={i}
              className="aspect-[9/16] rounded-2xl overflow-hidden border border-line bg-brand-ember relative group transition-all hover:border-brand-orange/40"
            >
              <VideoEmbed url={r.url} title={r.title} />
              <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.22em] text-ink-muted bg-brand-carbon/70 px-2 py-1 rounded-full backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                Reel #{i + 1}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-ink-muted text-center">
          Sustituye estas URLs en <Link href="/admin/agentes" className="underline">/admin</Link> cuando estén los reels reales.
        </p>
      </div>
    </ThemedSection>
  );
}
