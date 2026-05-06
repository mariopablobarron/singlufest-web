// Configuración estática de fallback. Los valores reales vienen de SiteSettings (DB)
// y se sobrescriben en runtime. Mantener en sincronía con prisma/schema.prisma.

export const SITE = {
  name: "SingluFest",
  tagline: "El paraíso existe y no tiene trazas",
  domain: "singlufest.hubstartidea.es",
  url: "https://singlufest.hubstartidea.es",
  defaultLocale: "es" as const,
  edition: {
    label: "GRANADA · 14-16 NOVIEMBRE 2026",
    city: "Granada",
  },
  social: {
    instagram: "https://www.instagram.com/singlufest/",
    instagramHandle: "@singlufest",
    tiktok: "https://www.tiktok.com/@singlufest",
  },
  contact: {
    email: "hola@singlufest.es",
  },
  nav: [
    { label: "Cartel", href: "/cartel" },
    { label: "Manifiesto", href: "/manifiesto" },
    { label: "Protocolo", href: "/protocolo" },
    { label: "Partners", href: "/b2b" },
    { label: "Entradas", href: "/entradas", emphasis: true },
  ],
};
