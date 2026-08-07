import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { ConsentBanner } from "@/components/ui/consent-banner";
import { WebAnalytics } from "@/components/ui/web-analytics";
import { SITE } from "@/lib/site";
import "@/styles/globals.css";

/* next/font auto-hospeda e faz subset: zero requisição a terceiro e zero layout shift. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  description: SITE.description,
  areaServed: "BR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  founder: { "@type": "Person", name: "Felipe Menendes" },
  knowsAbout: [
    "Arquitetura de software",
    "Cloud computing",
    "Site Reliability Engineering",
    "DevSecOps",
    "FinOps",
    "Observabilidade",
    "Kubernetes",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={SITE.locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Consent Mode v2. Precisa rodar antes de qualquer tag do Google, então
          é inline e sem defer. Sem decisão salva, tudo nega: não presumimos
          consentimento por região.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem("menendes_consent_v1")||"null");var m=!!(s&&s.measurement);window.dataLayer=window.dataLayer||[];window.dataLayer.push(["consent","default",{analytics_storage:m?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",functionality_storage:"granted",security_storage:"granted",wait_for_update:500}]);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <ConsentBanner />
        <WebAnalytics />
        <script
          type="application/ld+json"
          // JSON-LD é dado estático definido acima, não entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
