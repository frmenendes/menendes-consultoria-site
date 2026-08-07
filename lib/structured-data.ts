/**
 * Dados estruturados (schema.org, JSON-LD).
 *
 * Ficam centralizados aqui e não espalhados pelas páginas por dois motivos: os
 * nós se referenciam entre si por `@id`, e um grafo com identificadores
 * inconsistentes é pior que grafo nenhum — o Google trata a organização como
 * duas entidades diferentes. E porque o conteúdo sai das mesmas constantes que
 * alimentam o HTML: marcação estruturada que discorda do texto visível é
 * violação de política e derruba o rich result.
 *
 * `@id` é a URL canônica mais um fragmento. É a convenção que permite dizer
 * "o publisher deste artigo é aquela organização" sem repetir o objeto inteiro.
 */

import { CAPABILITIES, OFFERINGS } from "@/lib/content";
import type { Insight } from "@/lib/insights";
import { SITE, whatsappUrl } from "@/lib/site";

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

export const organizationSchema = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: SITE.name,
  legalName: SITE.legalName,
  // O CNPJ é o identificador fiscal brasileiro. `taxID` é o campo previsto, e
  // ele ajuda o Google a reconciliar a entidade com registros públicos.
  taxID: SITE.cnpj,
  url: SITE.url,
  description: SITE.description,
  slogan: SITE.tagline,
  email: SITE.contact.email,
  telephone: `+${SITE.contact.whatsapp}`,
  image: `${SITE.url}/opengraph-image`,
  logo: `${SITE.url}/icon.svg`,
  areaServed: { "@type": "Country", name: "Brasil" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  founder: { "@type": "Person", name: "Felipe Menendes" },
  sameAs: [SITE.social.linkedin, SITE.social.github, whatsappUrl()],
  knowsAbout: CAPABILITIES.flatMap((capability) => capability.items),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Soluções MENENDES",
    itemListElement: OFFERINGS.map((offering) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: offering.title,
        description: offering.summary,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Brasil" },
      },
    })),
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE.url,
  name: SITE.name,
  inLanguage: SITE.locale,
  publisher: { "@id": ORG_ID },
};

/**
 * Trilha de navegação. O Google a usa para trocar a URL crua pelo caminho
 * legível no resultado de busca, o que melhora a taxa de clique mesmo sem mudar
 * a posição.
 */
export const breadcrumbSchema = (trilha: readonly { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Início", path: "" }, ...trilha].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE.url}${item.path}`,
  })),
});

export const articleSchema = (insight: Insight) => ({
  "@type": "TechArticle",
  "@id": `${SITE.url}/insights/${insight.slug}#article`,
  headline: insight.title,
  description: insight.summary,
  about: insight.topic,
  inLanguage: SITE.locale,
  datePublished: insight.date,
  dateModified: insight.date,
  // `timeRequired` em ISO 8601. É o mesmo número mostrado na página, e a
  // marcação precisa concordar com o texto visível.
  timeRequired: `PT${insight.readingMinutes}M`,
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: `${SITE.url}/insights/${insight.slug}`,
  isPartOf: { "@id": SITE_ID },
});

export const faqSchema = (perguntas: readonly { pergunta: string; resposta: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: perguntas.map(({ pergunta, resposta }) => ({
    "@type": "Question",
    name: pergunta,
    acceptedAnswer: { "@type": "Answer", text: resposta },
  })),
});

/**
 * Empacota um ou mais nós num `@graph` único.
 *
 * Um `@graph` é melhor que várias tags `<script>` soltas: os `@id` resolvem
 * dentro do mesmo documento, então a organização é declarada uma vez e apenas
 * referenciada nos demais nós.
 */
export const jsonLd = (...nos: object[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": nos });
