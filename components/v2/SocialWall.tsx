import Link from "next/link";
import { ThemedSection } from "./SectionTheme";
import { VideoEmbed } from "../VideoEmbed";

const REELS_PLACEHOLDER = Array.from({ length: 6 }).map((_, i) => ({
  url: "https://www.instagram.com/reel/Cxxxxxxxxxx/",
  title: `Reel ${i + 1}`,
}));

export function SocialWallV2() {
  return (
    <ThemedSection className="py-24 md:py-32">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge mb-4 inline-flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange animate-flicker" />
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
            className="btn-primary"
          >
            Sigue @singlufest
          </a>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {REELS_PLACEHOLDER.map((r, i) => (
            <li
              key={i}
              className="aspect-[9/16] rounded-2xl overflow-hidden border-2 border-brand-orange/20 hover:border-brand-orange/70 bg-brand-carbon relative group transition-all hover:-translate-y-1"
            >
              <VideoEmbed url={r.url} title={r.title} />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-ink-muted text-center">
          Sustituye estas URLs en <Link href="/admin/agentes" className="underline">/admin</Link> cuando estén los reels reales.
        </p>
      </div>
    </ThemedSection>
  );
}
