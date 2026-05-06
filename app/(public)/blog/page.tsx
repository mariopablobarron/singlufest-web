import Link from "next/link";
import { Section } from "@/components/Section";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Blog",
  description: "Recetas sin gluten, restaurantes recomendados en Granada y novedades del festival.",
};

async function load() {
  try {
    return await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await load();

  return (
    <Section
      eyebrow="Blog"
      title="Sin gluten, con mucho gusto"
      description="Recetas, restaurantes recomendados, ciencia accesible y todo lo que pasa en el festival."
    >
      {posts.length === 0 ? (
        <p className="text-ink-muted">
          Aún no hay posts publicados. Vuelve pronto, o suscríbete y te avisamos.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card-elevated h-full block group">
              {p.coverUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.coverUrl} alt="" className="aspect-[16/10] w-full rounded-xl object-cover mb-5" />
              )}
              <p className="badge">
                {p.publishedAt
                  ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(p.publishedAt)
                  : "Borrador"}
              </p>
              <h2 className="mt-3 text-2xl font-display tracking-tight group-hover:text-accent transition-colors">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 text-ink-muted line-clamp-3">{p.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
