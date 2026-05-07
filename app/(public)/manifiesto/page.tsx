import Link from "next/link";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FinalCtaV2 } from "@/components/v2/FinalCta";

export const metadata = {
  title: "Manifiesto",
  description: "Por qué SingluFest existe. Por qué el celíaco merece un festival, no una resignación.",
};

export default function ManifiestoPage() {
  return (
    <>
      <ThemedSection className="pt-28 md:pt-36 pb-20">
        <div className="container max-w-4xl">
          <p className="badge mb-8">Manifiesto SingluFest</p>
          <h1 className="text-display-xl text-balance">
            <span className="block h-brutal text-ink">El paraíso existe.</span>
            <span className="block h-script text-brand-orange mt-2 md:mt-4">y no tiene trazas.</span>
          </h1>
        </div>
      </ThemedSection>

      <ThemedSection className="pb-24 md:pb-32">
        <article className="container max-w-3xl prose prose-lg prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand-orange max-w-none text-ink/90 text-pretty">
          <p className="text-2xl md:text-3xl leading-snug font-display text-ink !mb-12">
            Llevamos 30 años pidiendo perdón por ser celíacos.
            <span className="block h-script text-brand-orange mt-3">se acabó.</span>
          </p>

          <h2 className="h-brutal text-3xl text-ink mt-12">El mercado nos vendió cartón.</h2>
          <p>
            Durante tres décadas, ser celíaco en España ha significado entrar al supermercado y enfrentarse a un pasillo
            triste con bolsas verdes que parecen indicaciones farmacéuticas. Pan que sabe a cartón. Galletas que se
            desmoronan. Pasta amarilla. Cerveza prohibida. Restaurantes que “ya han limpiado la sartén”.
          </p>
          <p>
            Mientras tanto, en Italia un panadero certificado abría un horno 100% sin gluten en pleno centro de Roma con
            cola en la puerta. En París montaban un Michelin sin gluten. En Estados Unidos, los celíacos eran clientes
            premium, no excepciones a tolerar.
          </p>

          <h2 className="h-brutal text-3xl text-ink mt-12">Nosotros también merecemos un festival.</h2>
          <p>
            SingluFest no es una feria. Es un concurso. Un cartel. Una fiesta. Un festival foodie en el que comerás cosas
            que no creías posibles, conocerás a gente que ha pasado por lo mismo que tú y, sobre todo,
            <strong className="text-ink"> dejarás de ser la excepción</strong>.
          </p>

          <ul className="!my-8">
            <li>Aquí los chefs cocinan para ti, no a pesar de ti.</li>
            <li>Aquí las hamburguesas, los croissants y las tartas son un upgrade, no un sucedáneo.</li>
            <li>Aquí no hay que preguntar “¿esto lleva gluten?”. La respuesta es siempre no.</li>
            <li>Aquí pruebas, votas y decides. Como en cualquier otro festival foodie del mundo.</li>
          </ul>

          <h2 className="h-brutal text-3xl text-ink mt-12">Granada, porque sí.</h2>
          <p>
            Lo organizamos en Granada porque es donde vivimos, porque tiene la mejor materia prima del país y porque
            necesitábamos un sitio con luz, terraza y un Sacromonte donde sentarnos a cenar después.
          </p>

          <h2 className="h-brutal text-3xl text-ink mt-12">Esto va a ser ruidoso.</h2>
          <p>
            Vamos a hacer ruido. Vamos a meternos con el pan que sabe a cartón. Vamos a celebrar a los obradores que
            llevan años trabajando en silencio. Vamos a hablar alto.
          </p>
          <p>
            Si te gusta cómo suena, nos vemos en noviembre. Y si no te gusta, también, pero te avisamos: ese plato no se
            te va a olvidar.
          </p>

          <p className="!mt-16 h-script text-3xl md:text-4xl text-brand-orange">
            Aquí tú eres el rey, no la excepción.
          </p>
        </article>
      </ThemedSection>

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-4xl text-center">
          <p className="badge mb-6">Compártelo</p>
          <h2 className="text-display-md text-balance">¿Te has visto reflejado?</h2>
          <p className="mt-4 text-lg text-ink-muted text-pretty max-w-2xl mx-auto">
            Pásalo a alguien que lleve toda la vida diciendo "yo no como gluten". Te debe una.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/entradas" className="btn-accent btn-lg">Quiero mi entrada</Link>
            <Link href="/protocolo" className="btn-outline">Ver protocolo de seguridad</Link>
          </div>
        </div>
      </ThemedSection>

      <FinalCtaV2 ticketsLeft={312} generalPrice={18} />
    </>
  );
}
