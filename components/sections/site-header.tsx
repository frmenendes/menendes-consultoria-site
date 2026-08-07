"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PRIMARY_CTA, SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { cn } from "@/lib/utils";

/**
 * Barra fixa.
 *
 * Estrutura: marca à esquerda, navegação imediatamente depois dela, e o bloco
 * de ações empurrado para a direita. Centralizar o menu deixava dois vãos
 * grandes e fazia a barra parecer vazia em tela wide.
 *
 * A barra tem fundo e borda desde o topo, em vez de só ganhar depois do scroll.
 * Flutuando transparente sobre o grid da hero, ela parecia solta da página.
 */
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
        "fixed inset-x-0 top-0 z-50 h-[--nav-h] border-b backdrop-blur-md",
        "transition-colors duration-300",
        scrolled ? "border-border bg-bg/95" : "border-border-soft bg-bg/70",
      )}
    >
      <div className="shell flex h-full items-center gap-8">
        <Link
          href="/"
          className="flex-none font-display text-[0.9375rem] font-bold tracking-[0.22em] text-fg"
          aria-label={`${SITE.name}, ir para a página inicial`}
        >
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-sm transition-colors duration-200",
                  active ? "text-fg" : "text-fg-soft hover:text-fg",
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-px bg-primary"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-3">
          <CommandPalette />

          {/* Divisor entre busca e ação, para os dois não lerem como um bloco só. */}
          <span aria-hidden="true" className="hidden h-5 w-px bg-border md:block" />

          <ButtonLink href={PRIMARY_CTA.href} size="sm" className="hidden sm:inline-flex">
            {PRIMARY_CTA.label}
          </ButtonLink>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="-mr-1.5 rounded-md p-1.5 text-fg lg:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
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
          className="fixed inset-x-0 bottom-0 top-[--nav-h] z-40 overflow-y-auto border-t border-border bg-bg px-5 py-8 lg:hidden"
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
