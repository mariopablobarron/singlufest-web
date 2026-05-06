"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } };
  }
}

export function InstagramEmbed({ permalink, caption }: { permalink: string; caption?: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
      return;
    }
    const id = "instagram-embed-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(s);
    }
  }, [permalink]);

  return (
    <blockquote
      className="instagram-media w-full max-w-[540px] !mx-0 !my-0 rounded-2xl overflow-hidden"
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{ background: "#FFF", border: 0, margin: 0, minWidth: "326px", padding: 0 }}
    >
      <a href={permalink} target="_blank" rel="noreferrer" className="sr-only">
        {caption ?? "Ver en Instagram"}
      </a>
    </blockquote>
  );
}
