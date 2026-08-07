# MENENDES — site institucional

Site da **MENENDES** (Menendes Consultoria em TI Ltda.), publicado em
**https://menendes.com.br**.

Next.js 16 (App Router) + TypeScript estrito + Tailwind v4 + Motion + MDX,
rodando em **Cloudflare Workers** via `@opennextjs/cloudflare`.

## Rodando

```bash
npm install
cp .dev.vars.example .dev.vars   # e preencha os secrets
npm run dev                      # http://localhost:8124
npm run check                    # typecheck + lint
npm run build                    # build do OpenNext (é o que o CI roda)
npm run preview                  # build + workerd local (runtime real)
```

`npm run dev` já expõe os bindings do Worker (rate limit e secrets do `.dev.vars`) via
`initOpenNextCloudflareForDev`.

## Deploy

O deploy é automático pelo **Workers Builds** a cada push na `main`, com as
configurações padrão do painel:

| Campo               | Valor              |
| ------------------- | ------------------ |
| Comando da build    | `npm run build`    |
| Comando de deploy   | `npx wrangler deploy` |

Isso funciona porque **`npm run build` é `opennextjs-cloudflare build`**, e não
`next build`. O `wrangler deploy` detecta o projeto OpenNext e delega para
`opennextjs-cloudflare deploy`, que exige a config compilada em `.open-next`.
Com `next build` puro o deploy falha com *"Could not find compiled Open Next
config"*.

Para não cair em recursão (o adapter chama `npm run build` por padrão para
construir o Next), `open-next.config.ts` fixa `buildCommand: "npx next build"`.

Deploy manual, se precisar:

```bash
npm run deploy
```

> **Nunca use `wrangler deploy` sem passar pelo `npm run build` antes.** O
> comando do adapter roda um passo extra, `populateCache`, que copia o HTML
> pré-renderizado para os assets do Worker. Sem ele, as rotas geradas por
> `generateStaticParams` (`/insights/[slug]`) respondem **404** em produção.

### Antes do primeiro deploy

O rate limit usa o **binding nativo do Workers**, configurado só no
`wrangler.jsonc`, então não há recurso para criar na conta. Falta apenas:

1. **Definir os três secrets no Worker.** Não existe configuração de variável
   dentro do Resend: lá você só cria a API key e verifica o domínio remetente.
   Os valores vivem como secret da Cloudflare. Sem eles o site sobe e funciona,
   mas o formulário responde 503 orientando o visitante a usar o e-mail do
   rodapé.

   | Secret            | O que é                                  | Exemplo                                          |
   | ----------------- | ---------------------------------------- | ------------------------------------------------ |
   | `RESEND_API_KEY`  | API key do Resend, com permissão de envio | `re_...`                                         |
   | `CONTACT_FROM`    | Remetente, no domínio verificado no Resend | `Site MENENDES <contato@mail.menendes.com.br>`  |
   | `CONTACT_TO`      | Caixa que recebe as mensagens            | o endereço de destino                            |

   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put CONTACT_FROM
   npx wrangler secret put CONTACT_TO
   ```

   > O `CONTACT_TO` é secret de propósito, e não uma var no `wrangler.jsonc`:
   > este repositório é público, e o endereço de destino não precisa estar nele.
2. Apontar o domínio `menendes.com.br` para o Worker no painel da Cloudflare.

## Estrutura

```
app/                 rotas (App Router), sitemap, robots, icon, api/contato
components/ui/       primitivos (Button, Section, CommandPalette)
components/motion/   Reveal, TextReveal
components/sections/ header, footer, hero, manifesto, two-paths, cta, form
components/architecture/  SystemTopology, OperationalStatus, CapabilityGrid,
                          ArchitectureTransformation, ArchitectureFlow,
                          ProjectReveal
content/insights/    artigos em MDX + registry.ts
lib/                 site.ts (marca), content.ts (copy), insights.ts, schema
styles/globals.css   tokens semânticos do design system
```

### Rotas

`/` · `/servicos` · `/vibe-to-scale` · `/projetos` · `/projetos/lupewedding` ·
`/sobre` · `/insights` · `/insights/[slug]` · `/contato` · `/privacidade`

Tudo estático. A única rota dinâmica é `POST /api/contato`.

## Adicionar um artigo ao Menendes Lab

1. Criar `content/insights/<slug>.mdx` (só o corpo, sem frontmatter).
2. Importar em `content/insights/registry.ts`.
3. Registrar os metadados em `lib/insights.ts`.

O import é estático de propósito: com `await import()` o bundler cria um chunk
assíncrono que avalia biblioteca de cliente no passo de SSR e quebra o prerender.

## Decisões que valem conhecer

- **CSP sem nonce.** Nonce muda a cada requisição e obriga renderização dinâmica
  em todas as páginas. O site é estático e não carrega script de terceiro, então
  a política usa `'self' 'unsafe-inline'` para script. Ao adicionar analytics ou
  chat, declarar a origem em `next.config.ts` e reavaliar.
- **Headers no `next.config.ts`, não em middleware.** O adapter da Cloudflare não
  executa middleware em runtime Node, e a política é estática de qualquer forma.
- **`staticAssetsIncrementalCache`.** Serve o HTML pré-renderizado a partir dos
  assets do Worker. Não suporta revalidação, o que aqui é irrelevante. Se surgir
  ISR, trocar por `r2IncrementalCache` ou `kvIncrementalCache`.
- **`mdx-components.tsx` na raiz é obrigatório.** Sem ele, o `@next/mdx` resolve
  o provider para `@mdx-js/react`, que usa `createContext` e não pode ser
  avaliado em componente de servidor.

## Formulário de contato

`POST /api/contato` faz, nesta ordem: validação com zod, honeypot, checagem de
tempo de preenchimento, rate limit por IP (3 mensagens por minuto, via binding
nativo do Workers) e envio via Resend. Honeypot e tempo respondem `200` sem enviar nada, de propósito:
avisar o robô de que foi detectado só ajuda quem está automatizando.

## Consentimento e medição

Mesma abordagem do `lupewedding-site`: escolha por finalidade guardada com a
versão da política, Consent Mode v2 inicializado antes de qualquer tag, e uma
âncora (`/privacidade#privacidade-preferencias`, no rodapé) que reabre o banner
para revogar.

Duas diferenças, e elas vêm do fato de a MENENDES não usar GTM, Google Analytics
nem anúncios:

- existe **uma finalidade só**, medição, porque é a única coisa que há para
  consentir. Expor uma chave de publicidade que não controlaria nada seria um
  banner que finge escolha, o que é pior que banner nenhum;
- essa finalidade **controla de fato** o carregamento do Cloudflare Web
  Analytics, que só entra na página depois do aceite.

Para o controle valer em produção:

1. no painel da Cloudflare, em Web Analytics, **desligue o "Automatic Setup"**.
   Com ele ligado, a borda injeta o beacon antes de qualquer consentimento e o
   componente vira enfeite;
2. informe o token do site em `NEXT_PUBLIC_CF_BEACON_TOKEN`. Sem token, nada é
   carregado e o banner segue funcionando para tags futuras.

Ao mudar o texto de privacidade de forma relevante, incremente
`PRIVACY_VERSION` em `lib/consent.ts`: quem já decidiu volta a ver o banner, em
vez de herdar em silêncio um consentimento dado sobre outro texto.

## Pendências antes de publicar

- [ ] Confirmar `contato@menendes.com.br` como caixa de destino e remetente
      (`SITE.contact.email` em `lib/site.ts` e os secrets).
- [ ] Confirmar as URLs de LinkedIn e GitHub em `SITE.social` (hoje marcadores).
- [ ] Criar a imagem Open Graph em `public/og.png` (1200x630) e referenciá-la em
      `app/layout.tsx`.
- [ ] Definir os secrets do Resend no Worker (ver acima).
- [ ] Desligar o Automatic Setup do Web Analytics e definir `NEXT_PUBLIC_CF_BEACON_TOKEN`.
