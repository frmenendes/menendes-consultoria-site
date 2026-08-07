export {};

declare global {
  interface Window {
    /** Fila do Google Tag / Consent Mode. Existe mesmo sem tag carregada. */
    dataLayer?: unknown[];
  }
}
