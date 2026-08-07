# Menendes Consulting — site institucional

Site institucional da **Menendes Consultoria em TI Ltda.** (CNPJ 67.659.396/0001-54),
marca **Menendes Consulting**. Conteúdo de portfólio e cases herdado da operação
Datarock e reescrito sob a marca Menendes.

Stack: **Vite + React 18**, publicado na **Cloudflare Workers** com assets estáticos —
mesma arquitetura do `lupewedding-site`.

## Rodando

```bash
npm install
npm run dev       # http://localhost:8124
npm run build     # gera dist/
npm run preview   # serve o dist/ em :4174
```

## Deploy

```bash
npm run deploy:cloudflare   # build + wrangler deploy
```

O `src/worker.ts` aplica os security headers (CSP, HSTS, X-Frame-Options,
Permissions-Policy), a política de cache (assets com hash = imutável, HTML =
`no-cache`) e o redirect canônico `www` → apex.

> **HTML sempre revalida.** Os assets têm hash no nome e cache eterno; o HTML
> aponta para eles, então precisa ser fresco a cada deploy — senão a borda serve
> documento velho e a mudança "não aparece".

## Estrutura

```
index.html          shell + meta tags + JSON-LD (ProfessionalService)
src/App.jsx         router mínimo (history API) + todas as páginas
src/data.js         fonte única de conteúdo: SITE, SERVICES, CASES, PORTFOLIO
src/components.jsx  átomos: Wordmark, Icon, SectionHead, Reveal, Counter
src/seo.js          title/description/canonical/OG por rota
src/styles.css      design tokens + layout
src/worker.ts       Cloudflare Worker (headers, cache, redirect)
public/             robots.txt, sitemap.xml, favicon.svg
```

### Rotas

`/` · `/sobre` · `/servicos` · `/portfolio` · `/cases` · `/cases/:slug` ·
`/contato` · `/privacidade`

Os três cases (`frst-falconi-cloud-native`, `magie-escalabilidade`,
`runflow-aws`) são gerados de `CASES` em `src/data.js`.

## Antes de publicar

O domínio canônico está fixado em **`menendesconsulting.com.br`**. Se for outro,
trocar em quatro lugares:

1. `SITE.url` em `src/data.js`
2. `APEX` em `src/worker.ts`
3. `<link rel="canonical">` e as tags `og:`/`twitter:` em `index.html`
4. `public/robots.txt` e `public/sitemap.xml`

Também faltam, e são placeholders hoje:

- `public/social/menendes-og.png` — imagem Open Graph (1200×630)
- E-mail `contato@menendesconsulting.com.br` e as URLs de LinkedIn/Instagram em
  `SITE.social` (`src/data.js`)
