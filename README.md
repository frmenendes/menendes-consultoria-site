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
app/                 rotas (App Router), sitemap, robots, llms.txt,
                     opengraph-image, icon, api/contato
components/ui/       primitivos (Button, Section, CommandPalette)
components/motion/   Reveal, TextReveal
components/sections/ header, footer, hero, manifesto, two-paths, cta, form
components/architecture/  SystemTopology, OperationalStatus, CapabilityGrid,
                          ArchitectureTransformation, ArchitectureFlow,
                          ProjectReveal
content/insights/    artigos em MDX + registry.ts
lib/                 site.ts (marca), content.ts (copy), insights.ts,
                     structured-data.ts (JSON-LD), contact-schema.ts (zod)
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
  em todas as páginas. O site é estático de propósito, então a política usa
  `'self' 'unsafe-inline'` para script. As origens de terceiro são declaradas
  explicitamente em `next.config.ts`: hoje, o beacon da Cloudflare e o GA4. Ao
  adicionar outra (chat, tag manager), declarar lá e reavaliar a troca por nonce
  nas rotas afetadas.
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

## SEO e descoberta

Quatro camadas, e vale saber para que serve cada uma.

**Metadados e canonical.** Toda rota declara `title`, `description` e
`alternates.canonical`. O canonical existe mesmo sem parâmetro de query porque
campanhas colam `?utm_source=` em tudo, e sem ele cada variante vira uma URL
concorrente da própria página.

**Dados estruturados.** `lib/structured-data.ts` monta um `@graph` único por
página. A organização e o site são declarados uma vez no `layout.tsx`, com
`@id` estável, e as páginas apenas os referenciam — declarar a organização
inteira em cada rota faria o Google entender várias entidades diferentes.

Não há `FAQPage`. Marcação de FAQ exige perguntas e respostas visíveis na
página, e o site não tem essa seção; marcar sem o conteúdo correspondente é
violação de política e rende ação manual. Se uma seção de perguntas frequentes
for escrita, a marcação passa a caber.

**`llms.txt`.** Índice do site em Markdown para assistentes de IA
(llmstxt.org). É gerado das mesmas constantes que alimentam as páginas: escrito
à mão, descreveria o site de quando foi escrito e ninguém lembraria de
atualizá-lo ao publicar um artigo.

**`robots.txt`.** Separa crawler de buscador, crawler de treino de modelo e
crawler de resposta. Os três estão liberados hoje, e a escolha é deliberada:
ser citado por um assistente quando alguém pergunta sobre arquitetura ou custo
de nuvem vale mais que proteger um texto que já é público. Para reverter, trocar
`allow` por `disallow` na lista `TREINO` em `app/robots.ts`.

A imagem de compartilhamento é gerada por `ImageResponse` em
`app/opengraph-image.tsx`, a partir das constantes de marca. A rota não tem
parâmetro dinâmico, então o Next a pré-renderiza no `next build` e publica um
PNG estático — nada disso executa no Worker.

### Variáveis de build

`NEXT_PUBLIC_*` é substituída pelo valor literal durante o build. **Não podem
ser secret do Worker**: secret é lido em runtime, e nesse momento o bundle já
foi gerado com string vazia. No Workers Builds, defina-as como variável de
ambiente da *build*. Não há perda de sigilo: as três aparecem no HTML por
natureza.

| Variável                               | Para que serve                                  |
| -------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_CF_BEACON_TOKEN`          | Cloudflare Web Analytics                        |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`        | GA4 (`G-...`)                                   |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Meta tag do Search Console (opcional, se por DNS) |

Sem qualquer uma delas, a funcionalidade correspondente simplesmente não carrega
e o site funciona igual.

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
- essa finalidade **controla de fato** o carregamento das duas tags de medição,
  que só entram na página depois do aceite: o Cloudflare Web Analytics
  (cookieless, não identifica ninguém) e o GA4 (usa cookie e identifica entre
  sessões — por isso o script sequer é baixado antes do aceite, e não basta o
  Consent Mode negar o armazenamento).

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
- [x] Imagem Open Graph: gerada em `app/opengraph-image.tsx`, não é mais um PNG
      a versionar.
- [ ] Definir os secrets do Resend no Worker (ver acima).
- [x] Web Analytics criado para `menendes.com.br` com `auto_install: false`.
      Falta definir `NEXT_PUBLIC_CF_BEACON_TOKEN` como variável de build.
- [ ] Criar a propriedade GA4 e definir `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Verificar o domínio no Search Console e enviar o sitemap.
