type Env = {
  ASSETS: Fetcher;
};

// Site estático puro: nenhum script de terceiro por padrão. Ao adicionar GTM /
// analytics, incluir a origem aqui — o CSP é a defesa real, não o header legado.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "style-src-attr 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const APEX = "menendesconsulting.com.br";

const secure = (response: Response, pathname: string): Response => {
  const secured = new Response(response.body, response);
  const headers = secured.headers;
  headers.set("Content-Security-Policy", CSP);
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");

  if (pathname.startsWith("/assets/")) {
    // Nome com hash: pode ser imutável.
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (/^\/(imagens|social)\/.+\.(webp|avif|png|jpe?g|svg|woff2)$/i.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
  } else {
    // HTML sempre revalida — senão a borda serve documento velho apontando
    // para assets que não existem mais e o deploy "não aparece".
    headers.set("Cache-Control", "no-cache, must-revalidate");
  }
  return secured;
};

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    // Canônico é o apex; www redireciona (canonical/og/sitemap apontam ao apex).
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 308);
    }
    return secure(await env.ASSETS.fetch(request), url.pathname);
  },
} satisfies ExportedHandler<Env>;
