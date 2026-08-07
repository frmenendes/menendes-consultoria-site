"use client";

import { useCallback, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

/**
 * Informa se a página já passou de um deslocamento vertical.
 *
 * A posição de scroll é estado do navegador, não do React, então é lida por
 * useSyncExternalStore. O retorno é booleano de propósito: o componente só
 * re-renderiza quando cruza o limite, não a cada pixel rolado.
 */
export function useScrolledPast(threshold: number): boolean {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
