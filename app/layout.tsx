import type { Metadata } from "next";
import { Almendra_SC, Pirata_One, Manrope, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

// Display principal — capitales con flourishes art-nouveau, lo más cercano al lettering del logo.
const almendra = Almendra_SC({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

// Display script para citas y momentos cinematográficos.
const pirata = Pirata_One({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

// Body humanista, legible.
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Showcookings, charlas, catas y mercado: el gran encuentro sin gluten en Granada. Reservas, programa y novedades.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Showcookings, charlas, catas y mercado. Granada celebra la cocina sin gluten.",
    images: ["/brand/og-default.png"],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/logo.png", sizes: "any", type: "image/png" },
    ],
    apple: "/brand/apple-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0A0807",
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang="es"
      className={`${manrope.variable} ${almendra.variable} ${pirata.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-ink min-h-screen flex flex-col bg-festival bg-grain">
        {children}
        {umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
