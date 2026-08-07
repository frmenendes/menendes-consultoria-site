import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/lib/insights";
import { PROJECTS } from "@/lib/content";
import { SITE } from "@/lib/site";

/**
 * Sitemap.
 *
 * `lastModified` sai do build, e não de uma data fixa no código: o site é
 * estático e republicado a cada deploy, então o momento do build é a informação
 * honesta sobre quando o conteúdo daquela URL mudou pela última vez. A exceção
 * são os artigos, que têm data própria de publicação.
 *
 * `changeFrequency` é uma dica, não uma promessa. O Google a ignora há anos,
 * mas o Bing ainda a considera, e ela custa nada.
 *
 * As páginas de projeto são derivadas de `PROJECTS`, não listadas à mão: um case
 * novo com `hasPage` entra no sitemap sozinho.
 */

const BUILD_TIME = new Date();

type Entrada = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROTAS: readonly Entrada[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/servicos", priority: 0.9, changeFrequency: "monthly" },
  { path: "/vibe-to-scale", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projetos", priority: 0.9, changeFrequency: "monthly" },
  { path: "/sobre", priority: 0.7, changeFrequency: "yearly" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contato", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROTAS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE.url}${path}`,
      lastModified: BUILD_TIME,
      changeFrequency,
      priority,
    })),
    ...PROJECTS.filter((project) => project.hasPage).map((project) => ({
      url: `${SITE.url}/projetos/${project.slug}`,
      lastModified: BUILD_TIME,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...INSIGHTS.map((insight) => ({
      url: `${SITE.url}/insights/${insight.slug}`,
      lastModified: new Date(`${insight.date}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
