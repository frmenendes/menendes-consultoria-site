import { cn } from "@/lib/utils";

/**
 * Revelação de bloco, em CSS puro.
 *
 * Não é componente de cliente e não carrega estado. A versão anterior usava o
 * useInView do motion: o bloco montava em opacity 0 e só aparecia quando o
 * observador disparasse. Em produção o observador não disparou e a página
 * inteira ficou invisível. O modo de falha estava invertido, porque um efeito
 * decorativo não pode ter poder de esconder o conteúdo.
 *
 * Agora o padrão é visível e a animação é enriquecimento. Sem JavaScript, sem
 * suporte a scroll-driven animations ou com reduced motion, o conteúdo aparece
 * do mesmo jeito.
 *
 * `mode`:
 *  - "scroll" revela ao entrar na viewport, via animation-timeline;
 *  - "load" revela no carregamento, para o que já nasce na primeira tela e
 *    portanto nunca cruzaria um limiar de scroll.
 *
 * `delay` só vale no modo "load". No modo "scroll" a própria posição de rolagem
 * já escalona os blocos, e atrasar dentro de uma timeline de scroll produziria
 * elementos parados no meio da tela.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  mode = "scroll",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  mode?: "scroll" | "load";
}) {
  return (
    <div
      className={cn(mode === "load" ? "reveal-on-load" : "reveal-on-scroll", className)}
      style={mode === "load" && delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
