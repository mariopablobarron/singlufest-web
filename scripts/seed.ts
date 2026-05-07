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
    update: {},
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

  console.log("\n✅ Seed terminado.\n");
}

main()
  .catch((e) => { console.error("❌ Seed falló:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
