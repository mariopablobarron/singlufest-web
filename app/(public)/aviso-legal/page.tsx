import { ThemedSection } from "@/components/v2/SectionTheme";

export const metadata = {
  title: "Aviso legal",
  description: "Información legal de SingluFest.",
};

export default function AvisoLegalPage() {
  return (
    <ThemedSection className="pt-28 md:pt-36 pb-24 md:pb-32">
      <article className="container max-w-3xl prose prose-lg prose-headings:font-display prose-a:text-brand-orange max-w-none text-ink/85">
        <p className="badge mb-6">Aviso legal</p>
        <h1 className="text-display-lg h-brutal text-ink">Información legal</h1>

        <h2>Titular del sitio</h2>
        <p>
          SingluFest es un proyecto operado por <strong>Startidea</strong> · CIF B19583632 · C/ Conde Cifuentes, 33,
          18005 Granada. Contacto: <a href="mailto:hola@singlufest.es">hola@singlufest.es</a>.
        </p>

        <h2>Objeto</h2>
        <p>
          El presente sitio web tiene como finalidad informar sobre el festival SingluFest, vender entradas, gestionar
          reservas y publicar contenido editorial relacionado con la cocina sin gluten.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Todos los contenidos de este sitio (textos, imágenes, vídeos, marca, identidad visual) son propiedad de
          Startidea o de los partners gastronómicos correspondientes. Está prohibida su reproducción sin autorización.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          Startidea no se responsabiliza de los contenidos de sitios externos enlazados desde SingluFest.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          El presente aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten
          a los juzgados y tribunales de Granada.
        </p>

        <p className="text-sm text-ink-muted mt-12">Última actualización: mayo 2026.</p>
      </article>
    </ThemedSection>
  );
}
