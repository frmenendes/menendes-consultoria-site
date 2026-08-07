/**
 * Bindings e secrets do Worker. `wrangler types` regenera `cloudflare-env.d.ts`
 * a partir do wrangler.jsonc, mas os secrets não aparecem lá (não são
 * versionados), então são declarados aqui.
 */
declare global {
  /** Binding de rate limit nativo do Workers. */
  interface ContactRateLimiter {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  }

  interface CloudflareEnv {
    CONTACT_RATE_LIMIT?: ContactRateLimiter;
    SITE_URL?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO?: string;
    CONTACT_FROM?: string;
  }
}

export {};
