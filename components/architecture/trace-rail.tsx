import { TRACE_STAGES } from "@/lib/content";

/**
 * Trilha de rastreamento lateral.
 *
 * Substitui os elos que ficavam centralizados entre as seções. Aqueles abriam
 * vãos mortos no meio da página e, como o conteúdo é alinhado à esquerda,
 * flutuavam deslocados do texto. Na lateral a linha é contínua, não interrompe
 * a leitura e acompanha a página inteira.
 *
 * Tudo em CSS, sem JavaScript:
 *  - a linha se preenche conforme a rolagem, via animation-timeline: scroll();
 *  - dois pulsos descem por ela em laço, que é o que a faz parecer monitorada;
 *  - cada estágio aparece e some conforme a rolagem passa por ele, via
 *    animation-timeline: view(), como um trace que vai sendo lido;
 *  - sem suporte a scroll-driven animations, a linha aparece preenchida e os
 *    estágios ficam visíveis, sem entrada progressiva.
 *
 * Decorativa, então aria-hidden. Os estágios existem como marcação visual da
 * jornada, não como índice navegável.
 */

/**
 * Distância entre o trilho e a coluna de conteúdo.
 *
 * Os rótulos crescem para a esquerda a partir do trilho, então cada nível de
 * detalhe só é exibido quando sobra largura real para ele. Os limiares abaixo
 * saem dessa conta: com o trilho a `OFFSET` da coluna, o nome precisa de uma
 * viewport a partir de ~1560px e a linha de tecnologias, de ~1760px. Abaixo
 * disso fica só o número, que cabe em qualquer gutter.
 */
const OFFSET = 88;

export function TraceRail() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-0 hidden w-px sm:block"
      style={{ left: `max(0.5rem, calc(50% - 600px - ${OFFSET}px))` }}
    >
      {/* Trilho apagado: o caminho inteiro, sempre visível. */}
      <div className="absolute inset-0 bg-border-soft" />

      {/* Preenchimento por rolagem. */}
      <div className="trace-rail-fill absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-primary via-primary-soft to-accent opacity-70" />

      {/* Pulsos de tráfego. O segundo entra defasado para a cadência não ficar
          mecânica. */}
      <div className="trace-rail-pulse absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-primary to-transparent" />
      <div
        className="trace-rail-pulse absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-accent to-transparent"
        style={{ animationDelay: "3.5s" }}
      />

      {TRACE_STAGES.map((stage, index) => (
        <div
          key={stage.name}
          // O centro vertical sai de margin, e não de translateY: a animação
          // usa transform, e um translate aqui seria sobrescrito por ela.
          className="trace-stage absolute inset-x-0 -mt-2"
          style={{ top: `${((index + 0.5) / TRACE_STAGES.length) * 100}%` }}
        >
          <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 ring-2 ring-bg" />

          {/* `right-full` ancora o bloco inteiramente à esquerda do trilho.
              Cada nível só aparece a partir da largura em que cabe de verdade,
              medida no navegador: abaixo de 1480px nem o número cabia e ele
              vazava para fora da tela. Sem texto, sobra a linha com os nós, que
              precisa de 1px. */}
          <div className="absolute right-full mr-4 hidden flex-col items-end gap-0.5 text-right min-[1480px]:flex">
            <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-primary-soft/70">
              {stage.index}
            </span>
            <span className="hidden whitespace-nowrap font-mono text-[0.5625rem] tracking-[0.16em] text-faint min-[1560px]:block">
              {stage.name}
            </span>
            <span className="hidden whitespace-nowrap font-mono text-[0.5rem] text-faint/70 min-[1760px]:block">
              {stage.tech.join(" · ")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
