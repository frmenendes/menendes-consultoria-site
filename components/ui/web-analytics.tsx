"use client";

import { useEffect } from "react";
import { useConsent } from "@/hooks/use-consent";

/**
 * Cloudflare Web Analytics, carregado só com consentimento.
 *
 * O beacon é cookieless e não identifica o visitante, mas ele só entra na
 * página depois do aceite: é o que faz o botão do banner controlar algo de
 * verdade em vez de decorar.
 *
 * IMPORTANTE para a operação: a Cloudflare também sabe injetar este script
 * sozinha, na borda. Se a injeção automática ficar ligada no painel, o beacon
 * carrega antes de qualquer consentimento e este componente vira enfeite.
 * Desligue "Automatic Setup" em Web Analytics e informe o token em
 * NEXT_PUBLIC_CF_BEACON_TOKEN. Sem o token, nada é carregado.
 */
export function WebAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  const allowed = useConsent()?.measurement ?? false;

  useEffect(() => {
    if (!allowed || !token) return;
    if (document.querySelector("script[data-cf-beacon]")) return;

    const script = document.createElement("script");
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.defer = true;
    script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
    document.head.appendChild(script);

    // Sem remoção no cleanup de propósito: retirar a tag não desfaz o que já
    // foi carregado. A revogação vale a partir da próxima navegação, e é isso
    // que a política diz.
  }, [allowed, token]);

  return null;
}
