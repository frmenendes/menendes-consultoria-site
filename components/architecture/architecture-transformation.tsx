"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GENERATED_APP, PRODUCTION_PLATFORM } from "@/lib/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Transformação de uma aplicação gerada por IA em uma plataforma de produção.
 *
 * O mesmo conjunto de componentes aparece nos dois estados. No estado inicial
 * eles estão amontoados e sem fronteira definida; no final ocupam camadas com
 * responsabilidade separada. A ideia é que a diferença seja legível para quem
 * não é técnico: o antes parece um nó, o depois parece uma planta.
 *
 * Controle explícito por tablist, então funciona por teclado e não sequestra o
 * scroll. Ao entrar na viewport avança uma vez sozinho, para demonstrar a
 * transformação sem exigir interação. Sob reduced motion não há avanço
 * automático nem transição, e os dois estados seguem acessíveis pelas abas.
 */

type Slot = { x: number; y: number };

type Component = {
  id: string;
  label: string;
  /** Estado inicial: tudo empilhado no centro, sem camada. */
  tangled: Slot;
  /** Estado final: quatro camadas com responsabilidade separada. */
  layered: Slot;
  layer: 0 | 1 | 2 | 3;
};

const COMPONENTS: readonly Component[] = [
  { id: "frontend", label: "Frontend", tangled: { x: 44, y: 40 }, layered: { x: 12, y: 14 }, layer: 0 },
  { id: "api", label: "API", tangled: { x: 52, y: 46 }, layered: { x: 38, y: 14 }, layer: 0 },
  { id: "core", label: "Núcleo de negócio", tangled: { x: 47, y: 53 }, layered: { x: 66, y: 14 }, layer: 0 },
  { id: "authz", label: "Autenticação e autorização", tangled: { x: 56, y: 38 }, layered: { x: 12, y: 38 }, layer: 1 },
  { id: "db", label: "Banco de dados", tangled: { x: 40, y: 50 }, layered: { x: 44, y: 38 }, layer: 1 },
  { id: "queue", label: "Filas", tangled: { x: 58, y: 55 }, layered: { x: 72, y: 38 }, layer: 1 },
  { id: "integrations", label: "Integrações", tangled: { x: 43, y: 58 }, layered: { x: 12, y: 62 }, layer: 2 },
  { id: "cache", label: "Cache", tangled: { x: 54, y: 60 }, layered: { x: 40, y: 62 }, layer: 2 },
  { id: "observability", label: "Observabilidade", tangled: { x: 49, y: 36 }, layered: { x: 66, y: 62 }, layer: 2 },
  { id: "cicd", label: "CI/CD", tangled: { x: 38, y: 44 }, layered: { x: 12, y: 86 }, layer: 3 },
  { id: "security", label: "Segurança", tangled: { x: 60, y: 48 }, layered: { x: 42, y: 86 }, layer: 3 },
  { id: "finops", label: "FinOps", tangled: { x: 46, y: 63 }, layered: { x: 70, y: 86 }, layer: 3 },
];

const LAYER_NAMES = ["Interface e regras", "Estado e fluxo", "Operação", "Plataforma"] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function ArchitectureTransformation() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const [scaled, setScaled] = useState(false);

  // Avanço automático único ao entrar na viewport, só para demonstrar.
  // O usuário continua no controle pelas abas.
  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(() => setScaled(true), 900);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  const duration = reduced ? 0 : 1.1;

  return (
    <div ref={ref}>
      {/* Controle de estado */}
      <div
        role="tablist"
        aria-label="Estado da arquitetura"
        className="mb-8 inline-flex rounded-full border border-border bg-surface/70 p-1"
      >
        {[
          { key: false, label: GENERATED_APP.label },
          { key: true, label: PRODUCTION_PLATFORM.label },
        ].map((tab) => (
          <button
            key={tab.label}
            role="tab"
            type="button"
            aria-selected={scaled === tab.key}
            onClick={() => setScaled(tab.key)}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-[0.625rem] tracking-[0.16em] transition-colors duration-300",
              scaled === tab.key
                ? "bg-primary text-white"
                : "text-muted hover:text-fg-soft",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        {/* Diagrama */}
        <div
          className="edge relative aspect-[4/3] w-full overflow-hidden rounded-[--radius-panel] border border-border bg-surface/40 md:aspect-[16/10]"
          aria-hidden="true"
        >
          <div className="blueprint mask-fade absolute inset-0 opacity-40" />

          {/* Faixas das camadas: só existem no estado organizado. */}
          {LAYER_NAMES.map((name, index) => (
            <motion.div
              key={name}
              className="absolute left-0 right-0 border-t border-dashed border-border-strong"
              style={{ top: `${index * 24 + 6}%` }}
              animate={{ opacity: scaled ? 0.5 : 0 }}
              transition={{ duration, ease: EASE }}
            >
              <span className="absolute right-3 -top-2.5 bg-surface px-2 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
                {name}
              </span>
            </motion.div>
          ))}

          {COMPONENTS.map((component, index) => {
            const target = scaled ? component.layered : component.tangled;
            return (
              <motion.div
                key={component.id}
                className="absolute"
                initial={false}
                animate={{ left: `${target.x}%`, top: `${target.y}%` }}
                transition={{
                  duration,
                  ease: EASE,
                  delay: reduced ? 0 : index * 0.035,
                }}
              >
                <motion.span
                  className="block whitespace-nowrap rounded-md border px-2.5 py-1.5 font-mono text-[0.625rem]"
                  animate={{
                    borderColor: scaled
                      ? "var(--color-border-strong)"
                      : "color-mix(in oklab, var(--color-warning) 45%, transparent)",
                    color: scaled ? "var(--color-fg)" : "var(--color-warning)",
                    backgroundColor: scaled
                      ? "var(--color-surface-2)"
                      : "color-mix(in oklab, var(--color-warning) 8%, transparent)",
                  }}
                  transition={{ duration, ease: EASE }}
                >
                  {component.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        {/* Leitura textual dos dois estados. É a fonte acessível do diagrama,
            que é aria-hidden, e o que sustenta a página sem JavaScript. */}
        <div>
          <p className="mono-label text-primary-soft">
            {scaled ? PRODUCTION_PLATFORM.label : GENERATED_APP.label}
          </p>
          <ul className="mt-5 space-y-2.5">
            {(scaled ? PRODUCTION_PLATFORM.nodes : GENERATED_APP.traits).map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-fg-soft">
                <span
                  className={cn(
                    "mt-2 h-1 w-1 flex-none rounded-full",
                    scaled ? "bg-primary" : "bg-warning",
                  )}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
