import { cn } from "@/lib/utils";

/**
 * Elo de rastreamento entre seções.
 *
 * Continua, página abaixo, a leitura que a topologia da hero abre: a jornada de
 * um software é uma cadeia, e cada etapa depende da anterior. Cada elo é um
 * estágio dessa cadeia, com as tecnologias que costumam aparecer nele.
 *
 * Entre as seções, e não numa trilha lateral fixa, por dois motivos: funciona
 * em qualquer largura sem depender de gutter, e a linha acompanha o conteúdo em
 * vez de tentar adivinhar onde cada seção começa.
 *
 * Decorativo, então `aria-hidden`. A linha é desenhada por scroll em CSS, sem
 * JavaScript, e sem suporte a animation-timeline ela simplesmente já aparece
 * inteira.
 */
export function TraceLink({
  index,
  stage,
  tech,
  className,
}: {
  index: string;
  stage: string;
  tech: readonly string[];
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative flex flex-col items-center py-2", className)}
    >
      <Segment />

      <div className="relative my-3 flex flex-col items-center gap-2">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute h-2.5 w-2.5 rounded-full bg-primary/25" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
        </span>

        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[0.625rem] tracking-[0.18em] text-primary-soft">
            {index} · {stage}
          </span>
          <span className="font-mono text-[0.625rem] text-faint">
            {tech.join("  ·  ")}
          </span>
        </div>
      </div>

      <Segment />
    </div>
  );
}

/** Trecho da linha. Desenha de cima para baixo conforme entra na viewport. */
function Segment() {
  return (
    <span className="relative block h-10 w-px overflow-hidden bg-border-soft sm:h-14">
      <span className="trace-draw absolute inset-0 block bg-gradient-to-b from-primary/50 to-accent/50" />
      {/* Pulso de tráfego: é o que faz a linha parecer monitorada, e não desenhada. */}
      <span className="trace-pulse absolute inset-x-0 top-0 block h-6 bg-gradient-to-b from-transparent via-primary to-transparent" />
    </span>
  );
}
