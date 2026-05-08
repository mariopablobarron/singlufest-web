import type { Metadata } from "next";
import { Anton, Berkshire_Swash, Lobster, Manrope, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

// Headline brutalist (sustituto gratuito de Druk Wide).
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-brutal",
  weight: "400",
  display: "swap",
});

// Display = inspirado en el lettering del logo SingluFest (bold script con swashes art-nouveau).
const berkshire = Berkshire_Swash({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

// Script = acento emocional, mismo espíritu vintage que el display.
const lobster = Lobster({
  subsets: ["latin", "latin-ext"],
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

// Body.
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
    "El paraíso existe y no tiene trazas. El primer festival foodie 100% sin gluten en Granada. 70+ obradores premium, 20+ chefs en directo, 0 excusas.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "El primer festival foodie 100% sin gluten en Granada. Sin fechas, sin trigo.",
    images: ["/brand/og-default.png"],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/brand/logo.png", type: "image/png" }],
    apple: "/brand/apple-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0B0807",
  colorScheme: "light dark" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang="es"
      className={`${manrope.variable} ${anton.variable} ${berkshire.variable} ${lobster.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-ink min-h-screen flex flex-col">
        {children}
        {umamiSrc && umamiId && (
          <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" defer />
        )}
      </body>
    </html>
  );
}
