import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * Devuelve true si el archivo /public/brand/logo.png parece ser el logo oficial
 * (un PNG mayor de 5KB). Si no, los componentes degradan al lettering tipográfico.
 *
 * Nota: solo se llama desde Server Components. Caché de proceso para no tocar el FS
 * en cada render.
 */
let cachedHasLogo: boolean | null = null;

export function hasOfficialLogo(): boolean {
  if (cachedHasLogo !== null) return cachedHasLogo;
  try {
    const stat = statSync(join(process.cwd(), "public", "brand", "logo.png"));
    cachedHasLogo = stat.size > 5 * 1024; // > 5KB
  } catch {
    cachedHasLogo = false;
  }
  return cachedHasLogo;
}
