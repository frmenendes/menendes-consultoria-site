export {};

declare global {
  interface Window {
    /** Fila do Google Tag / Consent Mode. Existe mesmo sem tag carregada. */
    dataLayer?: unknown[];
    /**
     * Só existe depois que o GA4 é carregado, e o carregamento depende de
     * consentimento. Por isso é opcional: todo consumidor precisa checar antes
     * de chamar, e o tipo obriga a isso.
     */
    gtag?: (...args: unknown[]) => void;
  }
}
