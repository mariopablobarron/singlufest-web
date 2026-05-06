type Source = "instagram" | "youtube" | "vimeo";

function parseUrl(url: string): { source: Source; id: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("instagram.com")) {
      const m = u.pathname.match(/\/(reel|p|tv)\/([^/]+)/);
      if (m) return { source: "instagram", id: m[2] };
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return { source: "youtube", id };
    }
    if (u.hostname.includes("youtu.be")) {
      return { source: "youtube", id: u.pathname.slice(1) };
    }
    if (u.hostname.includes("vimeo.com")) {
      return { source: "vimeo", id: u.pathname.replace("/", "") };
    }
  } catch {
    // ignore
  }
  return null;
}

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const parsed = parseUrl(url);
  if (!parsed) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="card block hover:bg-bg-alt">
        Ver vídeo →
      </a>
    );
  }

  const aspect = parsed.source === "instagram" ? "aspect-[9/16]" : "aspect-video";
  let src = "";
  if (parsed.source === "instagram") src = `https://www.instagram.com/p/${parsed.id}/embed`;
  if (parsed.source === "youtube") src = `https://www.youtube.com/embed/${parsed.id}?rel=0`;
  if (parsed.source === "vimeo") src = `https://player.vimeo.com/video/${parsed.id}`;

  return (
    <div className={`${aspect} relative overflow-hidden rounded-2xl border border-line bg-bg-alt`}>
      <iframe
        src={src}
        title={title ?? "Vídeo"}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
