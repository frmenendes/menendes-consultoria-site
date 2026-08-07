import { SITE, CASES } from "./data";

const SITE_URL = SITE.url;
const DEFAULT_IMAGE = `${SITE_URL}/social/menendes-og.png`;

const ROUTE_SEO = {
  "/": {
    title: "Menendes Consulting | Consultoria em tecnologia, cloud e dados",
    description:
      "Consultoria em TI, infraestrutura cloud, DevOps, dados e desenvolvimento de plataformas. Kubernetes, AWS e entrega contínua para empresas que precisam escalar com segurança.",
  },
  "/sobre": {
    title: "Sobre a Menendes Consulting | Quem somos",
    description:
      "Menendes Consultoria em TI Ltda. — missão, visão e os seis pilares que orientam nossa atuação em consultoria tecnológica e transformação digital.",
  },
  "/servicos": {
    title: "O que fazemos | Menendes Consulting",
    description:
      "Consultoria, serviço de dados, infraestrutura cloud, desenvolvimento de sites e apps e DevOps — do diagnóstico à operação em produção.",
  },
  "/portfolio": {
    title: "Portfólio | Menendes Consulting",
    description:
      "Projetos entregues em saúde, logística, indústria, terceiro setor, marketplaces e produtos próprios como a plataforma Lupe Wedding.",
  },
  "/cases": {
    title: "Cases | Menendes Consulting",
    description:
      "Casos reais de transformação cloud-native, escalabilidade em fintech e validação técnica junto à AWS.",
  },
  "/contato": {
    title: "Contato | Menendes Consulting",
    description:
      "Fale com a Menendes Consulting sobre seu projeto de cloud, dados, DevOps ou desenvolvimento de plataforma.",
  },
  "/privacidade": {
    title: "Política de Privacidade | Menendes Consulting",
    description:
      "Como a Menendes Consulting trata dados de navegação e contato neste site, com transparência sobre suas escolhas.",
  },
};

const caseSeo = (slug) => {
  const c = CASES.find((item) => item.slug === slug);
  if (!c) return null;
  return {
    title: `${c.client} | Case Menendes Consulting`,
    description: c.summary,
  };
};

function upsertMeta(selector, attributes) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
}

export function applyRouteSeo(pathname) {
  const path = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
  const seo =
    ROUTE_SEO[path] ||
    (path.startsWith("/cases/") ? caseSeo(path.slice("/cases/".length)) : null) ||
    ROUTE_SEO["/"];
  const known = Boolean(ROUTE_SEO[path] || (path.startsWith("/cases/") && caseSeo(path.slice("/cases/".length))));
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;

  document.title = seo.title;
  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: known ? "index, follow, max-image-preview:large" : "noindex, follow",
  });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE.brand });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_IMAGE });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_IMAGE });

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonical;
}
