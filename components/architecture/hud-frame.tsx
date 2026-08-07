import { cn } from "@/lib/utils";

/**
 * Colchetes de canto, no vocabulário de HUD.
 *
 * A referência é interface de instrumento: em vez de fechar um retângulo
 * inteiro, marca-se apenas onde ele começa e termina. Isso resolve o problema
 * que a moldura fechada tinha sobre o fundo estelar — quatro linhas contínuas
 * cortam o céu, quatro cantos apenas o pontuam.
 *
 * `tone` decide o peso: "quiet" para o estado de repouso do painel, "active"
 * para o que responde a cursor ou foco.
 *
 * Decorativo, então o consumidor deve marcar o contêiner como aria-hidden ou
 * garantir que o conteúdo real esteja fora daqui.
 */

const TAMANHO = "h-2.5 w-2.5";

export function HudFrame({
  tone = "quiet",
  className,
}: {
  tone?: "quiet" | "active";
  className?: string;
}) {
  const cor = tone === "active" ? "border-primary-soft" : "border-border-strong";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <span className={cn("absolute left-0 top-0 border-l border-t", TAMANHO, cor)} />
      <span className={cn("absolute right-0 top-0 border-r border-t", TAMANHO, cor)} />
      <span className={cn("absolute bottom-0 left-0 border-b border-l", TAMANHO, cor)} />
      <span className={cn("absolute bottom-0 right-0 border-b border-r", TAMANHO, cor)} />
    </div>
  );
}
