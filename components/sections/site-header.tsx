"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
 * O painel do menu compacto é irmão do <header>, e não filho. Dentro dele, o
 * `backdrop-blur` da barra criava um bloco de contenção para descendentes
 * `position: fixed`, então `top` e `bottom` do painel resolviam contra os 64px
 * da barra em vez da viewport: o menu abria com 65px de altura e ficava
 * inutilizável. Como irmão, o `fixed` volta a se referir à viewport.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(8);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-(--nav-h) border-b backdrop-blur-md",
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

            <span aria-hidden="true" className="hidden h-5 w-px bg-border md:block" />

            {/* A visibilidade fica no wrapper, não no botão: o `hidden` passado
                como className disputa com o `inline-flex` da base do ButtonLink,
                e quem vence depende da ordem no CSS gerado. */}
            <span className="hidden sm:block">
              <ButtonLink href={PRIMARY_CTA.href} size="sm">
                {PRIMARY_CTA.label}
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="-mr-1.5 rounded-md p-1.5 text-fg transition-transform duration-150 active:scale-90 lg:hidden"
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
      </header>

      {menuOpen ? (
        <div
          id="menu-mobile"
          ref={panelRef}
          tabIndex={-1}
          className="menu-panel fixed inset-x-0 bottom-0 top-(--nav-h) z-40 overflow-y-auto bg-bg px-5 py-8 outline-none lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Principal, versão compacta">
            {NAV.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  // Fecha no clique em vez de reagir à troca de rota por efeito:
                  // o header não remonta entre rotas, e um efeito aqui
                  // dispararia um render em cascata a cada navegação.
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "menu-item flex items-baseline justify-between gap-4 border-b border-border-soft py-4",
                    "font-display text-2xl transition-colors active:text-primary-soft",
                    active ? "text-primary-soft" : "text-fg",
                  )}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {item.label}
                  <span className="font-mono text-[0.625rem] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className="menu-item mt-8"
            style={{ animationDelay: `${NAV.length * 45}ms` }}
          >
            <ButtonLink href={PRIMARY_CTA.href} className="w-full">
              {PRIMARY_CTA.label}
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </>
  );
}
