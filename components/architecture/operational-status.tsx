"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HudFrame } from "@/components/architecture/hud-frame";
import { OPERATIONAL_STATUS } from "@/lib/content";
import { useIsClient } from "@/hooks/use-consent";
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
 *
 * A pílula colapsada é levada ao <body> por portal, e isso não é preferência de
 * organização: é o que a mantém funcionando.
 *
 * Ela é `position: fixed`, e o componente é renderizado dentro de um `Reveal`.
 * O `Reveal` anima `transform` e usa `animation-fill-mode: both`, então mesmo
 * depois de terminar ele conserva o valor final computado — que o navegador
 * resolve como `matrix(1, 0, 0, 1, 0, 0)`, a identidade, e não como `none`.
 * Qualquer transform diferente de `none`, inclusive a identidade, cria bloco de
 * contenção para descendentes `fixed`. Medido: a pílula ficava em `top: 74`,
 * ancorada aos 34px do `Reveal`, quando deveria estar em `939` — ou seja,
 * desenhada em cima do próprio card, repetindo o mesmo texto duas vezes.
 *
 * É o terceiro elemento deste site a cair na mesma armadilha (o menu compacto e
 * a busca foram os outros dois, cada um por um gatilho diferente: backdrop-
 * filter num caso, transform de animação neste). Portal é a única solução que
 * não depende de auditar todos os ancestrais para sempre.
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
      {/*
        Estado expandido: faixa de módulos HUD na largura da hero.

        Duas correções de composição vieram antes desta camada, e elas seguem
        valendo. Era uma lista vertical estreita encostada no canto inferior
        esquerdo, com os valores alinhados à direita — e como "READY",
        "ENFORCED" e "RUNNING" têm larguras diferentes, os cinco pontos caíam em
        cinco colunas distintas. Em células próprias os pontos alinham por
        construção, e a faixa distribui a informação em vez de amontoá-la.

        O tratamento é de instrumento, não de cartão: cada estado vira um módulo
        com colchetes de canto, índice, e uma barra de telemetria própria. Os
        colchetes marcam só os cantos em vez de fechar um retângulo — sobre o
        fundo estelar, quatro linhas contínuas cortam o céu e quatro cantos
        apenas o pontuam.

        A telemetria é decorativa e diz "isto está sendo medido", sem afirmar
        número nenhum: os estados são declarações de postura de engenharia, e
        inventar métrica ao lado deles seria mentir com gráfico.
      */}
      <dl
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        aria-label="Postura operacional"
      >
        {OPERATIONAL_STATUS.map((item, index) => (
          <div
            key={item.key}
            className="group relative bg-surface/30 px-4 py-3.5 transition-colors duration-500 hover:bg-surface/60"
          >
            <HudFrame />
            {/* Realce no cursor: os colchetes acendem, como um módulo que
                responde ao ser consultado. */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <HudFrame tone="active" />
            </div>

            <div className="relative flex items-baseline justify-between gap-3">
              <dt className="mono-label">{item.key}</dt>
              <span
                aria-hidden="true"
                className="font-mono text-[0.5625rem] tracking-[0.16em] text-faint"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="relative mt-3 flex items-end justify-between gap-3">
              <dd className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-fg">
                <Dot />
                {item.value}
              </dd>
              <Telemetria seed={index} />
            </div>
          </div>
        ))}
      </dl>

      {/* Estado colapsado. aria-hidden porque repete a lista acima, que
          permanece no DOM: leitor de tela não deve ouvir duas vezes. */}
      <PilulaColapsada collapsed={collapsed} current={current} />
    </>
  );
}

function PilulaColapsada({
  collapsed,
  current,
}: {
  collapsed: boolean;
  current: (typeof OPERATIONAL_STATUS)[number] | undefined;
}) {
  // Portal só depois de montar: no servidor não há `document`, e renderizar o
  // mesmo nó nos dois lados quebraria a hidratação.
  const isClient = useIsClient();
  if (!isClient) return null;

  return createPortal(
    (
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
    ),
    document.body,
  );
}

/**
 * Telemetria compacta do módulo.
 *
 * Reaproveita a gramática de `.signal-bar` que já existe no site. Cada barra
 * recebe altura, duração e atraso próprios, espalhados pela razão áurea a
 * partir do índice do módulo — assim os cinco conjuntos da faixa nunca caem em
 * sincronia, que é o que faria a linha inteira pulsar como um LED.
 */
function Telemetria({ seed }: { seed: number }) {
  const fase = (seed * 0.618) % 1;

  return (
    <div aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => {
        const f = (fase + i * 0.27) % 1;
        return (
          <span
            key={i}
            className="signal-bar w-[2px] rounded-[1px] bg-gradient-to-t from-primary/20 to-primary-soft"
            style={{
              height: `${35 + f * 60}%`,
              animationDuration: `${1.8 + f * 1.6}s`,
              animationDelay: `-${f * 2.4}s`,
            }}
          />
        );
      })}
    </div>
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
