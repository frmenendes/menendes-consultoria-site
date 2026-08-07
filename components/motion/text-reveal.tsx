import { cn } from "@/lib/utils";

/**
 * Revelação editorial linha a linha, em CSS puro.
 *
 * Quebra por linha, nunca por letra: letra a letra atrapalha a leitura e
 * bagunça leitores de tela. O texto completo está sempre no DOM.
 *
 * Cada linha desliza de baixo dentro de uma máscara de overflow. Sem suporte a
 * animação ou com reduced motion, as linhas ficam paradas na posição final.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  accentLastLine = false,
  as: Tag = "h2",
}: {
  /** Cada string é uma linha. */
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  /** Aplica o destaque da marca só na última linha. */
  accentLastLine?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        // Máscara por linha. O pb evita que descendentes (g, p, q) sejam
        // cortados pelo overflow hidden.
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <span
            className={cn(
              "reveal-line block",
              lineClassName,
              // Resolvido por índice, e não por seletor `last:`: cada linha é
              // filha única do próprio wrapper, então `:last-child` valeria
              // para todas.
              accentLastLine && index === lines.length - 1 && "text-gradient",
            )}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
