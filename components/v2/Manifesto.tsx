import Link from "next/link";
import { ThemedSection } from "./SectionTheme";

export function ManifestoV2() {
  return (
    <ThemedSection className="py-24 md:py-36">
      <div className="container max-w-4xl">
        <p className="badge mb-8">Manifiesto</p>
        <h2 className="text-display-lg text-balance">
          Llevamos 30 años pidiendo <span className="text-brand-orange">perdón</span> por ser celíacos.
          <span className="block h-script text-brand-orange/90 mt-3">se acabó.</span>
        </h2>

        <div className="mt-12 space-y-6 text-lg md:text-xl text-ink/85 max-w-3xl text-pretty">
          <p>
            Mientras el mercado nos vendía pan que sabe a cartón en bolsas tristes con letras verdes,
            en otros países montaban festivales con chefs Michelin sin gluten. Aquí no.
          </p>
          <p>
            <strong className="text-ink">SingluFest no es una feria.</strong> Es un concurso.
            10 iconos gastronómicos traen su mejor plato sin gluten. Tú lo pruebas, tú lo votas.
            Sin compromisos. Sin <em>"ya he limpiado la sartén"</em>. Sin trazas.
            Aquí tú eres el rey, no la excepción.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/manifiesto" className="btn-primary">Lee el manifiesto completo →</Link>
          <Link href="#cartel" className="btn-outline">ver los candidatos</Link>
        </div>
      </div>
    </ThemedSection>
  );
}
