import { ThemedSection } from "@/components/v2/SectionTheme";

export const metadata = {
  title: "Política de cookies",
  description: "Cookies que usamos en SingluFest.",
};

export default function CookiesPage() {
  return (
    <ThemedSection className="pt-28 md:pt-36 pb-24 md:pb-32">
      <article className="container max-w-3xl prose prose-lg prose-headings:font-display prose-a:text-brand-orange max-w-none text-ink/85">
        <p className="badge mb-6">Política de cookies</p>
        <h1 className="text-display-lg h-brutal text-ink">Cookies que usamos</h1>

        <p>SingluFest usa el mínimo de cookies posible.</p>

        <h2>Cookies técnicas (siempre activas)</h2>
        <ul>
          <li><strong>Sesión de usuario</strong>: si tienes acceso al panel admin, una cookie segura HTTP-only para mantenerte autenticado.</li>
          <li><strong>Preferencia de idioma</strong>: cuando habilitemos versión inglesa.</li>
        </ul>

        <h2>Analíticas (anónimas)</h2>
        <ul>
          <li>
            <strong>Umami</strong> (auto-hosted en granadasocial.org/Startidea): no usa cookies, no rastrea usuarios
            individuales, no comparte con terceros. Solo agregados.
          </li>
        </ul>

        <h2>Cookies que NO usamos</h2>
        <ul>
          <li>Google Analytics</li>
          <li>Facebook Pixel</li>
          <li>Cookies de marketing de terceros</li>
          <li>Re-targeting</li>
        </ul>

        <h2>Cómo gestionar cookies</h2>
        <p>
          Puedes borrar todas las cookies desde la configuración de tu navegador. Si las borras y entras al panel admin,
          tendrás que volver a iniciar sesión.
        </p>

        <p className="text-sm text-ink-muted mt-12">Última actualización: mayo 2026.</p>
      </article>
    </ThemedSection>
  );
}
