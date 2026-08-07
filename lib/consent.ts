/**
 * Consentimento de medição e marketing.
 *
 * Mesma abordagem do lupewedding-site: escolha por finalidade, guardada com a
 * versão da política, para que uma mudança de política reabra o pedido em vez
 * de herdar em silêncio um consentimento dado sobre outro texto.
 *
 * Diferença relevante em relação à Lupe, e é ela que define o desenho aqui: a
 * MENENDES não usa GTM, Google Analytics nem anúncios. A única medição é o
 * Cloudflare Web Analytics, que não usa cookie nem identifica o visitante. Por
 * isso existe uma finalidade só, "medição", e ela controla de fato o
 * carregamento do beacon. Não expomos uma chave de publicidade que não
 * controlaria nada: banner que finge escolha é pior que banner nenhum.
 *
 * O Consent Mode v2 é inicializado mesmo sem tags, para que a decisão do
 * visitante já esteja valendo no instante em que uma tag do Google entrar.
 */

export const CONSENT_STORAGE_KEY = "menendes_consent_v1";

/**
 * Versão da política. Ao alterar o texto de privacidade de forma relevante,
 * incremente: quem já decidiu volta a ver o banner.
 */
export const PRIVACY_VERSION = "2026-08-07";

export type ConsentChoice = {
  /** Medição de audiência. Hoje, o Cloudflare Web Analytics. */
  measurement: boolean;
};

export type StoredConsent = ConsentChoice & {
  policyVersion: string;
  updatedAt: string;
  firstDecisionAt: string;
};

export const CONSENT_EVENT = "menendes:consent-change";
/** Âncora que reabre as preferências a partir de qualquer link do site. */
export const CONSENT_HASH = "#privacidade-preferencias";

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed?.measurement !== "boolean") return null;
    return {
      measurement: parsed.measurement,
      policyVersion: parsed.policyVersion ?? "",
      updatedAt: parsed.updatedAt ?? "",
      firstDecisionAt: parsed.firstDecisionAt ?? "",
    };
  } catch {
    // localStorage bloqueado (modo privado, política de site). Sem decisão
    // salva, o padrão nega, que é o comportamento seguro.
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): StoredConsent {
  const previous = readConsent();
  const now = new Date().toISOString();
  const record: StoredConsent = {
    ...choice,
    policyVersion: PRIVACY_VERSION,
    updatedAt: now,
    firstDecisionAt: previous?.firstDecisionAt || now,
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Sem storage, a escolha vale para esta navegação e o banner reaparece
    // depois. Preferível a quebrar a página.
  }

  applyGoogleConsent(choice);
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
  return record;
}

/**
 * Repassa a decisão ao Consent Mode v2. Funciona mesmo sem nenhuma tag do
 * Google carregada: os comandos ficam na dataLayer e são consumidos assim que
 * uma entrar.
 */
export function applyGoogleConsent({ measurement }: ConsentChoice): void {
  const state = measurement ? "granted" : "denied";
  const layer = (window.dataLayer = window.dataLayer || []);
  layer.push(["consent", "update", {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  }]);
}

/** Precisa de nova decisão quando nunca houve uma, ou quando a política mudou. */
export function needsDecision(stored: StoredConsent | null): boolean {
  return stored === null || stored.policyVersion !== PRIVACY_VERSION;
}
