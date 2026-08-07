"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/hooks/use-consent";

/**
 * Google Analytics 4, carregado só com consentimento de medição.
 *
 * Diferença em relação ao Cloudflare Web Analytics, que roda ao lado deste: o
 * GA4 usa cookie e identifica o visitante entre sessões. Por isso ele não entra
 * na página antes do aceite, e não basta o Consent Mode negar o armazenamento:
 * o script sequer é baixado. O Consent Mode v2 (inicializado no `layout.tsx`,
 * antes de qualquer tag) continua valendo como segunda camada, para o caso de
 * uma tag futura carregar por outro caminho.
 *
 * Sem `NEXT_PUBLIC_GA_MEASUREMENT_ID` nada é carregado e o site funciona igual.
 * É o estado padrão em desenvolvimento.
 *
 * A `usePathname` existe porque o App Router navega no cliente: sem ela, o GA4
 * registraria só o primeiro carregamento e todas as páginas seguintes ficariam
 * invisíveis. `send_page_view: false` na configuração inicial evita a
 * duplicidade da primeira visualização, que seria contada aqui e pelo próprio
 * gtag.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const allowed = useConsent()?.measurement ?? false;
  const pathname = usePathname();

  useEffect(() => {
    if (!allowed || !id) return;
    if (document.getElementById("ga4-src")) return;

    const script = document.createElement("script");
    script.id = "ga4-src";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.async = true;
    document.head.appendChild(script);

    // O gtag empurra o objeto `arguments` cru na dataLayer, não um array — o
    // gtag.js distingue os dois ao processar a fila. Daí a `function` clássica
    // sem parâmetros declarados: uma arrow não tem `arguments`, e uma função
    // com rest params empilharia um array de verdade, que seria ignorado.
    const layer = (window.dataLayer = window.dataLayer ?? []);
    const gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      layer.push(arguments);
    } as (...args: unknown[]) => void;
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", id, {
      send_page_view: false,
      anonymize_ip: true,
    });

    // Sem remoção no cleanup, pelo mesmo motivo do beacon da Cloudflare: tirar
    // a tag não desfaz o que já carregou. A revogação vale da próxima
    // navegação em diante, e é o que a política de privacidade afirma.
  }, [allowed, id]);

  useEffect(() => {
    if (!allowed || !id || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [allowed, id, pathname]);

  return null;
}
