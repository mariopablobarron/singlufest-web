import Link from "next/link";
import { Section } from "@/components/Section";
import { VideoEmbed } from "@/components/VideoEmbed";

export const metadata = {
  title: "Vídeos",
  description: "Vídeos del Singlufest: showcookings, mercado y momentos del festival.",
};

const PLACEHOLDER_VIDEOS = [
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Showcooking 2025" },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "El mercado" },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Cata de cervezas sin gluten" },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Charlas" },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Talleres familiares" },
  { url: "https://www.instagram.com/reel/Cxxxxxxxxxx/", title: "Aftermovie" },
];

export default function VideosPage() {
  return (
    <Section
      eyebrow="Vídeos"
      title="Lo que se ha visto y vivido"
      description="Cuando metas las URLs reales en /admin/videos, esta galería se rellena sola. Por ahora son placeholders."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_VIDEOS.map((v) => (
          <div key={v.title} className="space-y-3">
            <VideoEmbed url={v.url} title={v.title} />
            <p className="text-sm font-medium">{v.title}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <Link
          href="https://www.instagram.com/singlufest/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Ver más en @singlufest
        </Link>
      </div>
    </Section>
  );
}
