import Link from "next/link";
import { ThemedSection } from "./SectionTheme";

export function ManifestoV2() {
  return (
    <ThemedSection theme="papel" className="py-24 md:py-36 border-t border-line">
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
            <strong className="text-ink">SingluFest es nuestra respuesta.</strong> Tres días en Granada con los
            mejores obradores y chefs del país cocinando para ti. Sin compromisos.
            Sin <em>“ya he limpiado la sartén”</em>. Sin trazas. Aquí tú eres el rey.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/manifiesto" className="btn-primary">Lee el manifiesto completo →</Link>
        </div>
      </div>
    </ThemedSection>
  );
}
