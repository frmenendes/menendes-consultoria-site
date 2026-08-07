import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Endpoint com efeito colateral não tem por que ser rastreado.
      disallow: "/api/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
