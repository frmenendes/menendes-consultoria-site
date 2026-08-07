"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** No servidor assumimos movimento reduzido: o primeiro frame nunca anima. */
const getServerSnapshot = () => true;

/**
 * Espelha prefers-reduced-motion.
 *
 * useSyncExternalStore em vez de useEffect com setState: a preferência é estado
 * externo ao React, e ler assim evita o render em cascata que um efeito
 * produziria a cada montagem.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
