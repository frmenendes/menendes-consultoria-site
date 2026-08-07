/**
 * Índice do Menendes Lab.
 *
 * O corpo de cada artigo vive em `content/insights/<slug>.mdx`; os metadados
 * ficam aqui porque o runtime do Workers não varre o sistema de arquivos, então
 * a listagem precisa ser estática e conhecida em build.
 *
 * Ao adicionar um artigo: criar o .mdx e registrar a entrada abaixo.
 */

export type Insight = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  /** ISO 8601. Usado no <time> e nos metadados. */
  date: string;
  readingMinutes: number;
};

export const INSIGHTS: readonly Insight[] = [
  {
    slug: "custo-de-nuvem-e-decisao-de-arquitetura",
    title: "Custo de nuvem é decisão de arquitetura",
    summary:
      "Por que otimizar a fatura raramente resolve, e onde o custo realmente é definido: no acoplamento, no modelo de dados e no que roda de forma síncrona sem precisar.",
    topic: "FinOps",
    date: "2026-07-22",
    readingMinutes: 7,
  },
  {
    slug: "o-que-quebra-primeiro-num-app-gerado-por-ia",
    title: "O que quebra primeiro num app gerado por IA",
    summary:
      "A ordem em que os problemas aparecem quando um MVP assistido por IA encontra usuários reais, e por que autorização costuma ser o primeiro a ceder.",
    topic: "Vibe coding",
    date: "2026-06-30",
    readingMinutes: 9,
  },
  {
    slug: "observabilidade-antes-da-escala",
    title: "Observabilidade antes da escala",
    summary:
      "Instrumentar depois do incidente é caro e tardio. O que precisa existir antes de aumentar a carga, e o que pode esperar.",
    topic: "SRE",
    date: "2026-05-18",
    readingMinutes: 6,
  },
] as const;

export const getInsight = (slug: string): Insight | undefined =>
  INSIGHTS.find((insight) => insight.slug === slug);

export const formatInsightDate = (iso: string): string =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
