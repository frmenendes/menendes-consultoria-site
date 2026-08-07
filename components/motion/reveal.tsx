"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Distância do deslocamento inicial. 0 revela só com opacidade. */
  y?: number;
};

/**
 * Revelação padrão de bloco. Anima apenas opacity e transform, então roda no
 * compositor. Sob reduced motion o conteúdo aparece sem transição alguma.
 */
export function Reveal({ children, delay = 0, className, y = 18 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
