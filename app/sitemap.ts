import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/lib/insights";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["", 1],
    ["/servicos", 0.9],
    ["/vibe-to-scale", 0.9],
    ["/projetos", 0.9],
    ["/projetos/lupewedding", 0.8],
    ["/sobre", 0.7],
    ["/insights", 0.7],
    ["/contato", 0.7],
    ["/privacidade", 0.2],
  ];

  return [
    ...routes.map(([path, priority]) => ({
      url: `${SITE.url}${path}`,
      priority,
    })),
    ...INSIGHTS.map((insight) => ({
      url: `${SITE.url}/insights/${insight.slug}`,
      lastModified: new Date(`${insight.date}T12:00:00Z`),
      priority: 0.6,
    })),
  ];
}
