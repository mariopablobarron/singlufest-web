// Configuración estática de fallback. Los valores reales vienen de SiteSettings (DB)
// y se sobrescriben en runtime. Mantener en sincronía con prisma/schema.prisma.

export const SITE = {
  name: "Singlufest",
  tagline: "El festival sin gluten de Granada",
  domain: "singlufest.hubstartidea.es",
  url: "https://singlufest.hubstartidea.es",
  defaultLocale: "es" as const,
  social: {
    instagram: "https://www.instagram.com/singlufest/",
    instagramHandle: "@singlufest",
  },
  contact: {
    email: "hola@singlufest.es",
  },
  nav: [
    { label: "Programa", href: "/programa" },
    { label: "Patrocinadores", href: "/patrocinadores" },
    { label: "Vídeos", href: "/videos" },
    { label: "Blog", href: "/blog" },
    { label: "Reservas", href: "/reservas", emphasis: true },
  ],
};
