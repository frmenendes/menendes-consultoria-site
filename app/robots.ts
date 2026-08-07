import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Regras de rastreamento.
 *
 * Duas famílias de robô, com objetivos diferentes:
 *
 *  - buscadores clássicos (Googlebot, Bingbot) rastreiam para indexar. Liberado.
 *  - crawlers de IA rastreiam para treinar modelo ou para responder perguntas
 *    citando a fonte. São coisas distintas, e a política aqui separa as duas.
 *
 * A escolha da MENENDES é liberar os dois casos. O site é material de
 * posicionamento: ser citado por um assistente quando alguém pergunta sobre
 * arquitetura, SRE ou custo de nuvem vale mais do que proteger um texto que já
 * está público. Quem preferir o contrário troca `allow` por `disallow` nos
 * agentes de treino (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) e
 * mantém os de resposta (OAI-SearchBot, Perplexity, Claude-User).
 *
 * `/api/` fica de fora para todos: endpoint com efeito colateral não tem por
 * que ser rastreado.
 */

/** Rastreiam para treinar modelo. */
const TREINO = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Bytespider",
];

/** Rastreiam para responder perguntas, citando a fonte. */
const RESPOSTA = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "cohere-ai",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: TREINO, allow: "/", disallow: "/api/" },
      { userAgent: RESPOSTA, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
