/**
 * Seed inicial de Singlufest.
 * Idempotente: usa upsert/findFirst donde puede.
 *
 * Ejecutar:
 *   npm run db:seed
 *
 * Variables relevantes:
 *   ADMIN_EMAIL, ADMIN_PASSWORD
 */
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "mario@startidea.es";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin Singlufest",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    // Re-hashea con la pwd actual del .env y reactiva. Si quieres preservar la pwd
    // existente sin tocarla, usa SEED_PRESERVE_PASSWORD=1.
    update: process.env.SEED_PRESERVE_PASSWORD === "1"
      ? {}
      : { passwordHash, role: "ADMIN", isActive: true },
  });
  console.log("✓ Admin:", admin.email);

  // Settings (singleton)
  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    await prisma.siteSettings.create({ data: { singleton: true } });
    console.log("✓ SiteSettings creado");
  }

  // Edición demo (deshabilitada por defecto, sin fechas reales)
  const editionExists = await prisma.edition.findFirst();
  if (!editionExists) {
    const ed = await prisma.edition.create({
      data: {
        year: new Date().getFullYear(),
        slug: `${new Date().getFullYear()}`,
        title: `Singlufest ${new Date().getFullYear()}`,
        subtitle: "Programa por confirmar",
        venue: "Granada (sede por confirmar)",
        city: "Granada",
        country: "España",
        description:
          "Borrador inicial. Edita esta edición desde /admin/settings cuando confirmemos sede y fechas.",
        isCurrent: true,
        isPublished: false,
        createdById: admin.id,
      },
    });
    console.log("✓ Edición demo:", ed.title);
  }

  // Patrocinadores demo (placeholders para que la home no se vea vacía)
  const sponsorCount = await prisma.sponsor.count();
  if (sponsorCount === 0) {
    await prisma.sponsor.createMany({
      data: [
        { name: "Marca Diamante (placeholder)", slug: "diamante-demo", tier: "DIAMOND", order: 1, isPublished: false },
        { name: "Marca Oro (placeholder)", slug: "oro-demo", tier: "GOLD", order: 1, isPublished: false },
        { name: "Marca Plata (placeholder)", slug: "plata-demo", tier: "SILVER", order: 1, isPublished: false },
      ],
    });
    console.log("✓ Patrocinadores placeholder creados (no publicados)");
  }

  // Colaboradores fijos del ecosistema Startidea — siempre publicados.
  await prisma.sponsor.upsert({
    where: { slug: "startidea" },
    create: {
      name: "Startidea",
      slug: "startidea",
      tier: "COLLAB",
      order: 1,
      isPublished: true,
      logoUrl: "/brand/partners/startidea-color.png",
      websiteUrl: "https://startidea.es",
      description: "Agencia de Innovación Social · Granada.",
    },
    update: {
      logoUrl: "/brand/partners/startidea-color.png",
      websiteUrl: "https://startidea.es",
      isPublished: true,
      tier: "COLLAB",
    },
  });
  console.log("✓ Colaborador: Startidea");

  await prisma.sponsor.upsert({
    where: { slug: "granadasocial" },
    create: {
      name: "Granada Social",
      slug: "granadasocial",
      tier: "COLLAB",
      order: 2,
      isPublished: true,
      logoUrl: "/brand/partners/granadasocial-azul.svg",
      websiteUrl: "https://granadasocial.org",
      description: "El medio de la Granada que pasa.",
    },
    update: {
      logoUrl: "/brand/partners/granadasocial-azul.svg",
      websiteUrl: "https://granadasocial.org",
      isPublished: true,
      tier: "COLLAB",
    },
  });
  console.log("✓ Colaborador: Granada Social");

  // ─── Candidatos del concurso (los 12 del cartel) ─────────────────────────
  const candidates = [
    { number: "01", slug: "kimcakes", chef: "KIMCAKES", dish: "La Reina",
      description: "Cheesecake volcánico, almendra tostada y caramelo de cerveza sin gluten.",
      longBio: "KIMCAKES es el obrador de repostería sin gluten más premiado de España. Empezó como un proyecto familiar en 2018 y hoy distribuye en 30 restaurantes premium. Su 'Reina' fue elegida mejor cheesecake sin gluten de Europa por Pastry Awards 2025.",
      price: 7, badge: "Headliner",
      bg: "from-brand-orange via-brand-tangerine to-brand-burn",
      websiteUrl: "https://kimcakes.es", instagramUrl: "https://www.instagram.com/kimcakes/",
      location: "Granada", foundedYear: 2018 },
    { number: "02", slug: "carmela", chef: "Carmela", dish: "El Bocadillo Imposible",
      description: "Pan brioche sin gluten relleno de chuletón madurado 60 días y mantequilla ahumada.",
      longBio: "Carmela es un obrador artesano que lleva 12 años perfeccionando masas sin gluten que no tienen nada que envidiar a las tradicionales. Su 'Bocadillo Imposible' es lo que pasa cuando combinas técnica de panadería francesa con producto cárnico premium español.",
      price: 9, badge: "Headliner",
      bg: "from-brand-wine via-[#9B2A41] to-brand-burn",
      location: "Madrid", foundedYear: 2014 },
    { number: "03", slug: "headliner-3", chef: "TBA", dish: "Próximamente",
      description: "El tercer cabeza de cartel se anuncia el 1 de septiembre.",
      longBio: "Aún bajo embargo. Pista: viene del País Vasco y trabajó con dos chefs Michelin antes de abrir su proyecto.",
      price: 0, badge: "Headliner",
      bg: "from-brand-carbon via-brand-ember to-brand-ink" },
    { number: "04", slug: "tahona-sur", chef: "Tahona Sur", dish: "Croissant 36h",
      description: "Croissant de fermentación lenta, hojaldrado a mano. Crujiente real.",
      price: 4, bg: "from-brand-lemon via-brand-orange to-brand-burn" },
    { number: "05", slug: "brewmaster-gf", chef: "Brewmaster GF", dish: "IPA Tres Lúpulos",
      description: "Cerveza artesana 100% sin cebada. Tropical, amarga, peligrosa.",
      price: 5, bg: "from-[#F5C56B] via-brand-orange to-brand-burn" },
    { number: "06", slug: "heladeria-lunar", chef: "Heladería Lunar", dish: "Sorbete de Granada",
      description: "Granada del Albaicín, romero del Sacromonte y ralladura de yuzu.",
      price: 4, bg: "from-[#E76F51] via-brand-orange to-[#C24412]" },
    { number: "07", slug: "pan-de-pueblo", chef: "Pan de Pueblo", dish: "Hogaza Madre",
      description: "Pan de masa madre 100% sin gluten. Corteza dura, miga aireada. Imposible distinguirlo.",
      price: 6, bg: "from-[#CE7C2D] via-brand-orange to-brand-burn" },
    { number: "08", slug: "granada-fermenta", chef: "Granada Fermenta", dish: "Kimchi del Albaicín",
      description: "Fermentado andaluz, picante medio, con tostada de teff. Para los valientes.",
      price: 5, bg: "from-[#A4243B] via-brand-wine to-brand-burn" },
    { number: "09", slug: "cafe-colibri", chef: "Café Colibrí", dish: "Brunch Plato",
      description: "Huevos rotos sobre teff con bacon ibérico y pan de molde sin gluten.",
      price: 8, bg: "from-[#F4A261] via-brand-orange to-[#C24412]" },
    { number: "10", slug: "quesos-reyna", chef: "Quesos del Reyna", dish: "Tabla del Sur",
      description: "5 quesos curados de pastor + miel de azahar + crackers de garbanzo.",
      price: 9, bg: "from-brand-gold via-brand-orange to-brand-burn" },
    { number: "11", slug: "vermut-co", chef: "Vermut & Co", dish: "Vermut Rojo Granadino",
      description: "Vermut de la casa con aceitunas premium y boquerón en vinagre. Sin trampa.",
      price: 4, bg: "from-brand-wine via-[#A4243B] to-brand-burn" },
    { number: "12", slug: "dolce-vento", chef: "Dolce Vento", dish: "Tiramisú del Sacromonte",
      description: "Bizcocho de almendra, mascarpone batido, café Colombia. La mejor versión.",
      price: 6, bg: "from-[#6B3F2A] via-brand-burn to-brand-carbon" },
  ];

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    await prisma.candidate.upsert({
      where: { slug: c.slug },
      create: { ...c, order: i + 1, isPublished: true },
      update: {}, // si ya existe, no toca lo que el admin haya editado
    });
  }
  console.log(`✓ ${candidates.length} candidatos sembrados`);

  console.log("\n✅ Seed terminado.\n");
}

main()
  .catch((e) => { console.error("❌ Seed falló:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
