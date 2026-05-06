import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Section } from "@/components/Section";
import { prisma } from "@/lib/db";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return {};
    return {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? undefined,
        images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  let post;
  try {
    const { slug } = await params;
    post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { name: true, email: true } } },
    });
  } catch {
    notFound();
  }
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <Section eyebrow={post.publishedAt
      ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(post.publishedAt)
      : "Borrador"
    }
      title={post.title}
      description={post.excerpt ?? undefined}
    >
      {post.coverUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={post.coverUrl} alt="" className="rounded-2xl aspect-[16/9] w-full object-cover mb-10" />
      )}
      <article className="prose prose-lg max-w-3xl prose-headings:font-display prose-a:text-accent">
        <MDXRemote source={post.contentMdx} />
      </article>
      <div className="mt-16">
        <Link className="btn-outline" href="/blog">← Volver al blog</Link>
      </div>
    </Section>
  );
}
