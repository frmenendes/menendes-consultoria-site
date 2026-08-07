"use client";

import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/ui/section";
import { ArrowRight } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Bifurcação de público. Empresas e fundadores chegam com problemas diferentes
 * e não devem ser jogados na mesma jornada.
 *
 * A superfície ativa muda de arquitetura visual: a corporativa desenha camadas
 * empilhadas, a de produto desenha um núcleo que se expande. É o mesmo grid
 * base, com densidade e direção diferentes.
 */

type Path = {
  id: "empresas" | "produtos";
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

const PATHS: readonly Path[] = [
  {
    id: "empresas",
    eyebrow: "Para empresas",
    title: "Sistemas críticos exigem decisões melhores.",
    body: "Arquitetura, cloud, SRE, segurança, DevSecOps, observabilidade, FinOps, dados e governança para empresas que precisam operar com confiança.",
    cta: "Explorar expertise corporativa",
    href: "/servicos",
  },
  {
    id: "produtos",
    eyebrow: "Para produtos criados com IA",
    title: "Seu MVP funcionou. Agora ele precisa estar preparado para crescer.",
    body: "Transformamos aplicações criadas com IA em plataformas seguras, escaláveis, observáveis e economicamente sustentáveis.",
    cta: "Conhecer Vibe to Scale",
    href: "/vibe-to-scale",
  },
];

export function TwoPaths() {
  const [active, setActive] = useState<Path["id"] | null>(null);

  return (
    <Section>
      <div className="shell grid gap-3 lg:grid-cols-2">
        {PATHS.map((path) => {
          const isActive = active === path.id;
          return (
            <Link
              key={path.id}
              href={path.href}
              onMouseEnter={() => setActive(path.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(path.id)}
              onBlur={() => setActive(null)}
              className={cn(
                "edge group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[--radius-panel]",
                "border border-border bg-surface/50 p-8 transition-colors duration-500 md:p-10",
                isActive && "border-border-strong",
              )}
            >
              <PathSurface variant={path.id} active={isActive} />

              <div className="relative">
                <span className="mono-label text-primary-soft">{path.eyebrow}</span>
                <h3 className="mt-5 max-w-md text-2xl md:text-[1.75rem]">{path.title}</h3>
                <p className="mt-4 max-w-md text-fg-soft">{path.body}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary-soft">
                  {path.cta}
                  <ArrowRight />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

/** Arquitetura abstrata de fundo, distinta por caminho. */
function PathSurface({ variant, active }: { variant: Path["id"]; active: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 200 160" className="absolute -top-6 right-0 h-64 w-full opacity-70">
        {variant === "empresas"
          ? // Camadas empilhadas: governança, plataforma, aplicação.
            [0, 1, 2, 3].map((row) => (
              <rect
                key={row}
                x={40 + row * 6}
                y={18 + row * 26}
                width={120 - row * 12}
                height="16"
                rx="3"
                fill="none"
                stroke={active ? "var(--color-primary)" : "var(--color-border-strong)"}
                strokeWidth="1"
                style={{
                  transition: "stroke 500ms linear, transform 700ms var(--ease-out-expo)",
                  transform: active ? "translateX(0)" : "translateX(-6px)",
                }}
              />
            ))
          : // Núcleo que se expande em anéis.
            [0, 1, 2, 3].map((ring) => (
              <circle
                key={ring}
                cx="120"
                cy="76"
                r={16 + ring * 18}
                fill="none"
                stroke={active ? "var(--color-accent)" : "var(--color-border-strong)"}
                strokeWidth="1"
                strokeDasharray={ring === 0 ? "0" : "3 5"}
                style={{
                  transition: "stroke 500ms linear, transform 700ms var(--ease-out-expo)",
                  transformOrigin: "120px 76px",
                  transform: active ? "scale(1)" : "scale(0.9)",
                }}
              />
            ))}
      </svg>
    </div>
  );
}
