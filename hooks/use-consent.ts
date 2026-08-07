"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  CONSENT_HASH,
  CONSENT_STORAGE_KEY,
  readConsent,
  type StoredConsent,
} from "@/lib/consent";

/**
 * A decisão de consentimento vive no localStorage, que é estado externo ao
 * React. Ler por useSyncExternalStore, e não por efeito com setState, evita o
 * render em cascata a cada montagem e mantém as abas em sincronia: o evento
 * `storage` chega quando a escolha muda em outra aba.
 *
 * O snapshot é a string crua, não o objeto: useSyncExternalStore compara por
 * identidade, e devolver um objeto novo a cada leitura entraria em laço.
 */
const subscribeConsent = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const getConsentSnapshot = () => {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const getServerConsentSnapshot = () => "";

export function useConsent(): StoredConsent | null {
  const raw = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  return useMemo(() => (raw ? readConsent() : null), [raw]);
}

/** Indica se já estamos no cliente, sem setState em efeito. */
const subscribeNever = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/** Reage à âncora que reabre as preferências a partir de qualquer link. */
const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export function useIsPreferencesHash(): boolean {
  return useSyncExternalStore(
    subscribeHash,
    () => window.location.hash === CONSENT_HASH,
    () => false,
  );
}
