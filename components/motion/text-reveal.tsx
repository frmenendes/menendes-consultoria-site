"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type TextRevealProps = {
  /** Cada string é uma linha. Quebrar por linha, nunca por letra: letra a letra
   *  atrapalha leitura e quebra leitores de tela. */
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  /** Aplica o destaque da marca só na última linha. */
  accentLastLine?: boolean;
  as?: "h1" | "h2" | "p";
};

/**
 * Revelação editorial linha a linha, com máscara de overflow. O texto completo
 * fica sempre no DOM, então continua legível sem JavaScript e para leitores de
 * tela, mesmo antes de animar.
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  accentLastLine = false,
  as: Tag = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const reduced = useReducedMotion();

  // Classe resolvida por índice, e não por seletor `last:`: cada linha é filha
  // única do próprio wrapper, então `:last-child` valeria para todas.
  const classFor = (index: number) =>
    cn(
      "block",
      lineClassName,
      accentLastLine && index === lines.length - 1 && "text-gradient",
    );

  return (
    <Tag className={className}>
      <span ref={ref} className="block">
        {lines.map((line, index) =>
          reduced ? (
            <span key={line} className={classFor(index)}>
              {line}
            </span>
          ) : (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={classFor(index)}
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : undefined}
                transition={{ duration: 0.85, ease: EASE, delay: index * 0.08 }}
              >
                {line}
              </motion.span>
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
