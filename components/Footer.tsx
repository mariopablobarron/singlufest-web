import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-bg-alt/40 backdrop-blur-sm">
      <div className="container max-w-7xl py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-6 max-w-md text-ink-muted text-pretty">
              Granada se llena de cocina sin gluten. Showcookings, charlas, catas y mercado
              para celíacos, sensibles y curiosos. Organiza Singlufest.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-sm hover:border-brand-orange/60 hover:text-brand-orange transition-colors"
              >
                <Instagram className="w-4 h-4" /> {SITE.social.instagramHandle}
              </a>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-sm hover:border-brand-orange/60 hover:text-brand-orange transition-colors"
              >
                <Mail className="w-4 h-4" /> {SITE.contact.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-4">Festival</h4>
            <ul className="space-y-2.5">
              {SITE.nav.map((n) => (
                <li key={n.href}>
                  <Link className="text-ink/85 hover:text-brand-orange transition-colors" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-4">Legal</h4>
            <ul className="space-y-2.5 text-ink/85">
              <li><Link href="/aviso-legal" className="hover:text-brand-orange">Aviso legal</Link></li>
              <li><Link href="/privacidad" className="hover:text-brand-orange">Privacidad</Link></li>
              <li><Link href="/cookies" className="hover:text-brand-orange">Cookies</Link></li>
              <li><Link href="/admin/login" className="text-ink-muted/60 hover:text-brand-orange">Acceso staff</Link></li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-line" />
        <p className="text-xs text-ink-muted text-center">
          © {year} <span className="font-display text-brand-orange">{SITE.name}</span> · hecho en Granada con cariño y sin gluten ·
          <a className="ml-1 underline-offset-4 hover:underline hover:text-brand-orange" href="https://startidea.es" target="_blank" rel="noreferrer">
            Startidea
          </a>
        </p>
      </div>
    </footer>
  );
}
