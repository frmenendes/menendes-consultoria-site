import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança.
 *
 * Ficam aqui, e não em middleware, por dois motivos: a política é estática, e o
 * adapter da Cloudflare não executa middleware em runtime Node. Como cabeçalho
 * declarado no config, a regra é aplicada na borda sem custo de função por
 * requisição.
 *
 * Sobre script-src e a ausência de nonce:
 *
 * Uma CSP com nonce e 'strict-dynamic' é mais forte, mas o nonce muda a cada
 * requisição, o que obriga o Next a renderizar toda página de forma dinâmica.
 * Este site é inteiramente estático de propósito, e trocar SSG por SSR em todas
 * as rotas custa tempo de resposta e dinheiro por requisição para proteger uma
 * superfície que aqui é pequena: não há script de terceiro, não há conteúdo de
 * usuário renderizado como HTML, e o único formulário envia JSON sem refletir
 * nada de volta na página.
 *
 * Ficamos então com 'self' mais 'unsafe-inline', que é o necessário para os
 * scripts de hidratação que o Next injeta no documento. O restante da política
 * continua fechado.
 *
 * Se um script de terceiro entrar depois (analytics, chat, tag manager), a
 * origem precisa ser declarada aqui de forma explícita, e vale reavaliar a
 * troca por nonce nas rotas afetadas.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
  poweredByHeader: false,
  // Falha o build em erro de tipo. Um site de SRE não publica com erro
  // conhecido só porque o bundle compilou. O lint roda à parte (`npm run
  // lint`), porque o Next 16 removeu a integração pelo config.
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

// Disponibiliza os bindings do Worker (KV, vars, secrets do .dev.vars) durante
// `next dev`. Sem isto, getCloudflareContext só funcionaria no runtime real.
void initOpenNextCloudflareForDev();

export default createMDX()(nextConfig);
