"use client";

import { useState } from "react";
import { CAPABILITIES, type Capability } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Bento grid dos pilares de expertise.
 *
 * Acessibilidade da revelação, que é o ponto delicado deste componente:
 *  - o detalhe está sempre no DOM, então existe sem JavaScript e para leitores
 *    de tela;
 *  - no desktop abre por hover ou por foco de teclado;
 *  - abaixo de md fica sempre aberto, porque não existe hover em toque;
 *  - o card é um <button> com aria-expanded, então também abre por clique e por
 *    Enter, e não depende do ponteiro.
 */

const SPAN: Record<Capability["span"], string> = {
  wide: "md:col-span-2",
  normal: "",
};

export function CapabilityGrid() {
  return (
    <ul className="grid grid-cols-1 gap-3 md:auto-rows-fr md:grid-cols-3">
      {CAPABILITIES.map((capability) => (
        <li key={capability.slug} className={SPAN[capability.span]}>
          <CapabilityCard capability={capability} />
        </li>
      ))}
    </ul>
  );
}

function CapabilityCard({ capability }: { capability: Capability }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      className={cn(
        "edge group relative flex h-full w-full flex-col overflow-hidden rounded-[--radius-card]",
        "border border-border bg-surface/60 p-6 text-left",
        "transition-colors duration-300 hover:border-border-strong focus-visible:border-primary",
      )}
    >
      {/* Iluminação localizada no hover. Puramente decorativa. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at 50% 0%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative">
        <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-primary-soft">
          {capability.title}
        </h3>
        <p className="mt-3 text-lg leading-snug text-fg md:text-xl">{capability.claim}</p>
      </div>

      {/* Revelação por grid-template-rows: anima sem precisar saber a altura. */}
      <div
        className={cn(
          "relative grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]",
          "grid-rows-[1fr] md:grid-rows-[0fr]",
          "md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]",
          open && "md:grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="py-4 text-sm leading-relaxed text-fg-soft">{capability.detail}</p>
        </div>
      </div>

      {/* Conteúdo alinhado ao topo. Com mt-auto a lista ia para o rodapé e abria
          um vão no meio do card, já que auto-rows-fr iguala a altura das linhas.
          Sobra no fim do card é leitura normal; sobra no meio parece defeito. */}
      <ul className="relative mt-5 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border-soft pt-4">
        {capability.items.map((item) => (
          <li key={item} className="font-mono text-[0.6875rem] text-faint">
            {item}
          </li>
        ))}
      </ul>
    </button>
  );
}
