import { CAPABILITIES, OFFERINGS, PROJECTS } from "@/lib/content";
import { INSIGHTS } from "@/lib/insights";
import { SITE, whatsappUrl } from "@/lib/site";

/**
 * /llms.txt — resumo do site em Markdown, para assistentes de IA.
 *
 * A proposta (llmstxt.org) é a mesma ideia do robots.txt aplicada a modelo de
 * linguagem: em vez de obrigar o crawler a inferir a estrutura do site a partir
 * do HTML renderizado, entregar um índice curto e legível do que existe aqui e
 * onde. Quem consome hoje: os crawlers de resposta liberados em `robots.ts`.
 *
 * Nenhum buscador clássico usa este arquivo, e ele não substitui o sitemap.
 *
 * É gerado das mesmas constantes que alimentam as páginas, de propósito. Um
 * llms.txt escrito à mão descreve o site de quando foi escrito, e ninguém
 * lembra de atualizá-lo ao publicar um artigo novo.
 */

export const dynamic = "force-static";

const lista = (titulo: string, linhas: readonly string[]) =>
  linhas.length ? `## ${titulo}\n\n${linhas.join("\n")}\n` : "";

function build(): string {
  const paginas = [
    `- [Soluções](${SITE.url}/servicos): as seis frentes de atuação e os quatro modelos de contratação.`,
    `- [Vibe to Scale](${SITE.url}/vibe-to-scale): transformação de aplicações geradas por IA em plataformas de produção.`,
    `- [Projetos](${SITE.url}/projetos): alguns dos cases, com a restrição que existia e a decisão que ela obrigou.`,
    `- [Sobre](${SITE.url}/sobre): quem é a MENENDES e como trabalha.`,
    `- [Menendes Lab](${SITE.url}/insights): notas técnicas.`,
    `- [Contato](${SITE.url}/contato): formulário, e-mail e WhatsApp.`,
  ];

  return [
    `# ${SITE.name}`,
    "",
    // `legalName` já termina em ponto ("Ltda."), então não leva outro.
    `> ${SITE.legalName} ${SITE.tagline} ${SITE.description}`,
    "",
    `Consultoria de tecnologia sediada em ${SITE.contact.city}, atuando em todo o Brasil.`,
    "Site em português do Brasil.",
    "",
    lista("Páginas", paginas),
    lista(
      "Frentes de atuação",
      CAPABILITIES.map((c) => `- **${c.title}**: ${c.claim} (${c.items.join(", ")})`),
    ),
    lista(
      "Como contratar",
      OFFERINGS.map((o) => `- **${o.title}**: ${o.summary}`),
    ),
    lista(
      // Só parte dos projetos tem página própria; os demais abrem em painel
      // dentro de /projetos e não têm URL para citar.
      "Alguns dos projetos",
      PROJECTS.map((p) => {
        const url = p.hasPage ? `${SITE.url}/projetos/${p.slug}` : `${SITE.url}/projetos`;
        return `- [${p.title}](${url}) — ${p.client}, ${p.category}. ${p.summary}`;
      }),
    ),
    lista(
      "Artigos",
      INSIGHTS.map(
        (i) => `- [${i.title}](${SITE.url}/insights/${i.slug}) — ${i.topic}. ${i.summary}`,
      ),
    ),
    lista("Contato", [
      `- E-mail: ${SITE.contact.email}`,
      `- WhatsApp: ${SITE.contact.whatsappDisplay} (${whatsappUrl()})`,
      `- LinkedIn: ${SITE.social.linkedin}`,
    ]),
  ].join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
