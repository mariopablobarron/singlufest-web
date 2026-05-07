import Link from "next/link";
import { TicketsV2 } from "@/components/v2/Tickets";
import { ThemedSection } from "@/components/v2/SectionTheme";
import { FaqV2 } from "@/components/v2/Faq";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import { Check, Clock, MapPin, Sparkles } from "lucide-react";

export const metadata = {
  title: "Entradas",
  description: "Compra tu entrada al SingluFest 2026. General desde 18€. VIP, Mesa del Chef y Pase Pro disponibles.",
};

const ADD_ONS = [
  { name: "Cata privada de cervezas sin gluten", price: 25, description: "1 hora con un brewmaster. 10 plazas." },
  { name: "Mesa reservada con vista", price: 35, description: "Mesa para 4 con la mejor visual al escenario." },
  { name: "Pack merch completo", price: 29, description: "Camiseta + tote + pin + tote bag impreso." },
  { name: "Parking VIP", price: 12, description: "A 30 metros del recinto. Ilimitado los 3 días." },
  { name: "Acceso 1h antes (foodies)", price: 15, description: "Antes de las colas, cuando los chefs aún emplatan." },
  { name: "Botella firmada por el chef", price: 79, description: "Numerada del 1 al 50. Solo Mesa del Chef." },
];

export default function EntradasPage() {
  return (
    <>
      <TicketsV2 />

      <ThemedSection alt className="py-20 md:py-24">
        <div className="container max-w-6xl">
          <p className="badge mb-6">Add-ons disponibles</p>
          <h2 className="text-display-md text-balance">
            Sube tu experiencia.
            <span className="block h-script text-brand-orange mt-2">opcional, pero brutal.</span>
          </h2>
          <p className="mt-4 text-ink-muted max-w-2xl text-pretty">
            Tras comprar tu entrada, podrás añadir estos extras. Algunos solo están disponibles para VIP o Mesa del Chef.
          </p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {ADD_ONS.map((a) => (
              <li key={a.name} className="card-elevated flex items-start justify-between gap-6">
                <div>
                  <h3 className="h-brutal text-xl text-ink">{a.name}</h3>
                  <p className="mt-2 text-sm text-ink-muted text-pretty">{a.description}</p>
                </div>
                <span className="h-brutal text-2xl text-brand-orange shrink-0">+{a.price}€</span>
              </li>
            ))}
          </ul>
        </div>
      </ThemedSection>

      <ThemedSection className="py-20 md:py-24">
        <div className="container max-w-5xl">
          <p className="badge mb-6">Cómo va el día</p>
          <h2 className="text-display-md text-balance">Tres días, una experiencia.</h2>

          <ol className="mt-12 space-y-8">
            {[
              { time: "11:00", title: "Apertura del recinto", body: "Mercado de candidatos abierto. Recoges tus tickets de degustación con tu QR.", icon: MapPin },
              { time: "12:30", title: "Primer showcooking", body: "Un chef cabeza de cartel cocina su plato en directo, lo pruebas y lo votas.", icon: Sparkles },
              { time: "14:00 - 17:00", title: "Comida + catas + charlas", body: "Roteas entre stands, asistes a charlas en escenario y catas privadas si tienes VIP.", icon: Check },
              { time: "20:00", title: "Mesa del Chef (solo entradas premium)", body: "Cena de 6 platos servida en mesa larga con el chef invitado. Botella firmada incluida.", icon: Clock },
            ].map(({ time, title, body, icon: Icon }) => (
              <li key={time} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-6 items-start">
                <div className="text-right">
                  <p className="h-brutal text-2xl md:text-3xl text-brand-orange">{time}</p>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-brand-orange/30 pl-6">
                  <span className="shrink-0 grid place-items-center w-10 h-10 rounded-2xl bg-brand-orange text-bg -ml-11 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="h-brutal text-xl text-ink">{title}</h3>
                    <p className="mt-1 text-ink-muted">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 rounded-3xl bg-brand-carbon text-brand-bone p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-bone/70">Política de devolución</p>
            <h3 className="mt-2 h-brutal text-2xl">Hasta 14 días antes con reembolso completo.</h3>
            <p className="mt-3 text-brand-bone/85 max-w-2xl">
              Después, transferible a otra persona sin coste. Si el festival se cancela por causa mayor, devolución íntegra automática.
            </p>
            <Link href="/protocolo" className="btn-accent mt-8">Ver protocolo de seguridad</Link>
          </div>
        </div>
      </ThemedSection>

      <FaqV2 />
      <FinalCtaV2 ticketsLeft={312} generalPrice={18} />
    </>
  );
}
