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
 *  - sem suporte a scroll-driven animations, a linha aparece preenchida e só o
 *    progresso se perde.
 *
 * Decorativa, então aria-hidden. Os estágios existem como marcação visual da
 * jornada, não como índice navegável.
 *
 * Posição: 40px à esquerda da coluna de conteúdo, com piso de 8px para não
 * encostar na borda em tela estreita. O nome do estágio só aparece quando há
 * gutter suficiente para ele; abaixo disso fica só o número.
 */
export function TraceRail() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-0 hidden w-px sm:block"
      style={{ left: "max(0.5rem, calc(50% - 600px - 40px))" }}
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

      {TRACE_STAGES.map((stage, index) => {
        const top = `${((index + 0.5) / TRACE_STAGES.length) * 100}%`;
        return (
          <div key={stage.name}>
            {/* `right-full` ancora o bloco inteiramente à esquerda do trilho.
                Ancorado no próprio trilho, o texto crescia para a direita e
                invadia a coluna de conteúdo. */}
            <div
              className="absolute right-full mr-3 flex flex-col items-end gap-0.5 text-right"
              style={{ top, transform: "translateY(-50%)" }}
            >
              <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-primary-soft/70">
                {stage.index}
              </span>
              <span className="hidden whitespace-nowrap font-mono text-[0.5625rem] tracking-[0.16em] text-faint xl:block">
                {stage.name}
              </span>
              <span className="hidden whitespace-nowrap font-mono text-[0.5rem] text-faint/70 2xl:block">
                {stage.tech.join(" · ")}
              </span>
            </div>

            <span
              className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 ring-2 ring-bg"
              style={{ top }}
            />
          </div>
        );
      })}
    </div>
  );
}
