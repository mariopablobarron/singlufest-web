import { ThemedSection } from "@/components/v2/SectionTheme";

export const metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos los datos personales en SingluFest.",
};

export default function PrivacidadPage() {
  return (
    <ThemedSection className="pt-28 md:pt-36 pb-24 md:pb-32">
      <article className="container max-w-3xl prose prose-lg prose-headings:font-display prose-a:text-brand-orange max-w-none text-ink/85">
        <p className="badge mb-6">Política de privacidad</p>
        <h1 className="text-display-lg h-brutal text-ink">Cómo tratamos tus datos</h1>

        <h2>Responsable del tratamiento</h2>
        <p>
          Startidea (B19583632 · C/ Conde Cifuentes, 33, 18005 Granada). Email del DPO:{" "}
          <a href="mailto:privacidad@singlufest.es">privacidad@singlufest.es</a>.
        </p>

        <h2>Qué datos recogemos y para qué</h2>
        <ul>
          <li><strong>Reservas y entradas</strong>: nombre, email, teléfono opcional, alergias declaradas. Para gestionar tu reserva y avisarte de cambios.</li>
          <li><strong>Newsletter</strong>: email. Para enviarte la programación y avisos del festival. Puedes darte de baja en cualquier email.</li>
          <li><strong>Pago</strong>: tarjeta tratada exclusivamente por Stripe (PCI-DSS Level 1). Nunca almacenamos datos de tarjeta en nuestros servidores.</li>
          <li><strong>Logs técnicos</strong>: IP hasheada, navegador, hora de visita. Para seguridad y métricas básicas.</li>
        </ul>

        <h2>Base legal</h2>
        <p>
          Consentimiento explícito (newsletter, formularios) y ejecución de contrato (entradas y reservas).
        </p>

        <h2>Cesión a terceros</h2>
        <p>
          Solo a proveedores estrictamente necesarios: Stripe (pagos), Resend (emails transaccionales), Hostinger
          (hosting). Todos con contrato de encargo de tratamiento RGPD-compliant.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Acceso, rectificación, supresión, oposición, portabilidad y limitación. Escríbenos a{" "}
          <a href="mailto:privacidad@singlufest.es">privacidad@singlufest.es</a> y respondemos en menos de 30 días.
          Si no estás conforme, puedes reclamar ante la AEPD.
        </p>

        <h2>Plazo de conservación</h2>
        <p>
          Datos de reserva: 4 años (obligación contable). Newsletter: hasta que te des de baja. Logs técnicos: 90 días.
        </p>

        <p className="text-sm text-ink-muted mt-12">Última actualización: mayo 2026.</p>
      </article>
    </ThemedSection>
  );
}
