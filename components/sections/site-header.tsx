"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PRIMARY_CTA, SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(8);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[--nav-h] transition-colors duration-300",
        scrolled && "border-b border-border bg-bg/80 backdrop-blur-md",
      )}
    >
      {/* justify-between com a navegação centralizada em absoluto: com o menu no
          fluxo, ele encostava no botão e deixava um vão grande depois da marca. */}
      <div className="shell relative flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[0.9375rem] font-bold tracking-[0.22em] text-fg"
          aria-label={`${SITE.name}, ir para a página inicial`}
        >
          {SITE.name}
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          aria-label="Principal"
        >
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors duration-200",
                  active ? "text-fg" : "text-muted hover:text-fg-soft",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <CommandPalette />
          <ButtonLink href={PRIMARY_CTA.href} size="sm" className="hidden sm:inline-flex">
            {PRIMARY_CTA.label}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="rounded-md p-1.5 text-fg lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-[--nav-h] bottom-0 z-40 overflow-y-auto border-t border-border bg-bg px-5 py-8 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Principal, versão compacta">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                // Fecha no clique em vez de reagir à troca de rota por efeito:
                // o header não remonta entre rotas, e um efeito aqui dispararia
                // um render em cascata a cada navegação.
                onClick={() => setMenuOpen(false)}
                className="border-b border-border-soft py-4 font-display text-2xl text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ButtonLink href={PRIMARY_CTA.href} className="mt-8 w-full">
            {PRIMARY_CTA.label}
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
