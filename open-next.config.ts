import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * As rotas de artigo (/insights/[slug]) são geradas em build via
 * generateStaticParams. No Workers não existe sistema de arquivos, então sem um
 * incrementalCache o worker não encontra esse HTML pré-renderizado e responde
 * 404, mesmo com as páginas presentes no build.
 *
 * O adapter de static assets serve exatamente esse conteúdo a partir dos assets
 * do próprio Worker. Ele não suporta revalidação, o que aqui é irrelevante: o
 * site é inteiramente estático e todo conteúdo novo passa por um build.
 *
 * Se um dia existir ISR ou revalidação sob demanda, trocar por
 * r2IncrementalCache ou kvIncrementalCache.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
