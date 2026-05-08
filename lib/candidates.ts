import { prisma } from "@/lib/db";
import type { Candidate } from "@prisma/client";

/**
 * Carga candidatos publicados desde BD. Si la tabla está vacía o falla,
 * devuelve un array vacío (la home se adapta).
 */
export async function loadCandidates(opts?: { onlyPublished?: boolean; take?: number }) {
  const { onlyPublished = true, take } = opts ?? {};
  try {
    return await prisma.candidate.findMany({
      where: onlyPublished ? { isPublished: true } : {},
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      take,
    });
  } catch {
    return [] as Candidate[];
  }
}

export async function loadCandidateBySlug(slug: string) {
  try {
    return await prisma.candidate.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}
