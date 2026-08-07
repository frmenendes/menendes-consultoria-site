import Link from "next/link";
import { NAV, SITE, whatsappUrl } from "@/lib/site";

import { CONSENT_HASH } from "@/lib/consent";

const LEGAL = [
  { href: "/privacidade", label: "Política de Privacidade" },
  // A âncora reabre o banner de qualquer página: revogar precisa ser tão
  // fácil quanto consentir.
  { href: `/privacidade${CONSENT_HASH}`, label: "Preferências de privacidade" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-[0.9375rem] font-bold tracking-[0.22em] text-fg">
            {SITE.name}
          </p>
          <p className="mt-4 max-w-xs text-sm text-muted">{SITE.tagline}</p>
          <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-faint">
            {SITE.contact.city}
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="mono-label">Navegar</h2>
          <ul className="mt-5 space-y-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-fg-soft hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mono-label">Contato</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="text-sm text-fg-soft hover:text-fg"
              >
                {SITE.contact.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-soft hover:text-fg"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fg-soft hover:text-fg"
              >
                LinkedIn
              </a>
            </li>
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-fg-soft hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Identificação legal fica aqui embaixo, não na abertura do site. */}
      <div className="border-t border-border-soft">
        <div className="shell flex flex-col gap-2 py-6 font-mono text-[0.625rem] tracking-[0.1em] text-faint md:flex-row md:items-center md:justify-between">
          <span>
            {year} {SITE.name}
          </span>
          <span>
            {SITE.legalName} · CNPJ {SITE.cnpj}
          </span>
        </div>
      </div>
    </footer>
  );
}
