import Link from "next/link";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

async function createPost(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const slug = ((formData.get("slug") as string) || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: (formData.get("excerpt") as string) || null,
      contentMdx: (formData.get("contentMdx") as string) || "Contenido pendiente.",
      status: "DRAFT",
    },
  });
  revalidatePath("/admin/posts");
}

async function deletePost(formData: FormData) {
  "use server";
  await prisma.post.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/posts");
}

async function publishPost(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/");
}

export default async function PostsAdmin() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-10">
      <header>
        <p className="badge">Blog</p>
        <h1 className="mt-3 text-display-md">Posts del blog</h1>
      </header>

      <details className="card">
        <summary className="cursor-pointer font-display text-lg">+ Nuevo post (rápido)</summary>
        <form action={createPost} className="mt-6 grid gap-4">
          <div>
            <label className="field-label">Título</label>
            <input name="title" required className="field-input" />
          </div>
          <div>
            <label className="field-label">Slug (opcional)</label>
            <input name="slug" className="field-input" />
          </div>
          <div>
            <label className="field-label">Excerpt</label>
            <input name="excerpt" className="field-input" maxLength={280} />
          </div>
          <div>
            <label className="field-label">Contenido (MDX)</label>
            <textarea name="contentMdx" rows={8} className="field-input font-mono text-xs" />
          </div>
          <div>
            <button className="btn-primary">Crear borrador</button>
          </div>
        </form>
      </details>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-muted">
            <tr className="text-left">
              <th className="px-3 py-3">Título</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Publicado</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-ink-muted">Aún no hay posts.</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-ink-muted">/blog/{p.slug}</p>
                </td>
                <td className="px-3 py-3"><span className="badge">{p.status}</span></td>
                <td className="px-3 py-3 text-xs text-ink-muted">
                  {p.publishedAt
                    ? new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(p.publishedAt)
                    : "—"}
                </td>
                <td className="px-3 py-3 text-right space-x-1">
                  {p.status !== "PUBLISHED" && (
                    <form action={publishPost} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn-outline text-xs px-3 py-1">Publicar</button>
                    </form>
                  )}
                  <form action={deletePost} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="btn-ghost text-coral text-xs px-2"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-ink-muted">
        ¿Quieres que la IA escriba un draft por ti?{" "}
        <Link href="/admin/agentes" className="underline">Lanza el agente Redactor</Link>.
      </p>
    </div>
  );
}
