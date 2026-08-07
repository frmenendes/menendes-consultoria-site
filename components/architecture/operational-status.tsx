"use client";

import { useEffect, useState } from "react";
import { OPERATIONAL_STATUS } from "@/lib/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrolledPast } from "@/hooks/use-scrolled-past";

/**
 * Painel de estado operacional da hero.
 *
 * Comportamento tipo dynamic island: no topo mostra a lista completa; ao rolar,
 * colapsa numa pílula fixa que cicla entre os estados. A informação é a mesma
 * nos dois modos, então nada se perde ao colapsar.
 *
 * Os estados são declarações de postura de engenharia, não telemetria ao vivo.
 * Nenhum número de disponibilidade é exibido, porque não haveria como comprovar.
 */
export function OperationalStatus() {
  const reduced = useReducedMotion();
  const collapsed = useScrolledPast(420);
  const [index, setIndex] = useState(0);

  // Só cicla quando colapsado e visível: sem trabalho em segundo plano.
  useEffect(() => {
    if (!collapsed || reduced) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % OPERATIONAL_STATUS.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [collapsed, reduced]);

  const current = OPERATIONAL_STATUS[index] ?? OPERATIONAL_STATUS[0];

  return (
    <>
      {/* Estado expandido, dentro do fluxo da hero. */}
      <dl
        className="edge grid w-full max-w-sm gap-px overflow-hidden rounded-[--radius-card] border border-border bg-surface/70"
        aria-label="Postura operacional"
      >
        {OPERATIONAL_STATUS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 bg-surface/60 px-4 py-2.5"
          >
            <dt className="mono-label">{item.key}</dt>
            <dd className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-fg-soft">
              <Dot />
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Estado colapsado. aria-hidden porque repete a lista acima, que
          permanece no DOM: leitor de tela não deve ouvir duas vezes. */}
      <div
        aria-hidden="true"
        className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-[opacity,transform] duration-500 ${
          collapsed
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="edge flex items-center gap-3 rounded-full border border-border bg-surface/90 px-4 py-2 backdrop-blur-sm">
          <Dot />
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-muted">
            {current?.key}
          </span>
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-fg">
            {current?.value}
          </span>
        </div>
      </div>
    </>
  );
}

function Dot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
    </span>
  );
}
