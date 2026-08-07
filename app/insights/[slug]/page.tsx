import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CallToAction } from "@/components/sections/cta";
import { INSIGHT_BODIES } from "@/content/insights/registry";
import { INSIGHTS, formatInsightDate, getInsight } from "@/lib/insights";
import { StructuredData } from "@/components/ui/structured-data";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { SITE } from "@/lib/site";

type Params = { slug: string };

/** Gera as rotas em build: nenhum artigo é renderizado sob demanda. */
export function generateStaticParams(): Params[] {
  return INSIGHTS.map((insight) => ({ slug: insight.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.summary,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.summary,
      publishedTime: insight.date,
      url: `${SITE.url}/insights/${insight.slug}`,
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  const Body = INSIGHT_BODIES[slug];
  if (!Body) notFound();

  return (
    <>
      <StructuredData
        graph={[
          articleSchema(insight),
          breadcrumbSchema([
            { name: "Menendes Lab", path: "/insights" },
            { name: insight.title, path: `/insights/${insight.slug}` },
          ]),
        ]}
      />
      <article className="pt-[calc(var(--nav-h)+4.5rem)]">
        <header className="shell-narrow">
          <Link
            href="/insights"
            className="font-mono text-[0.625rem] tracking-[0.16em] text-muted hover:text-fg"
          >
            MENENDES LAB
          </Link>

          <h1 className="mt-6 text-[clamp(1.9rem,4.4vw,3rem)]">{insight.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-8 font-mono text-[0.625rem] tracking-[0.14em] text-faint">
            <span className="text-primary-soft">{insight.topic}</span>
            <time dateTime={insight.date}>{formatInsightDate(insight.date)}</time>
            <span>{insight.readingMinutes} MIN</span>
          </div>
        </header>

        {/* Estilos do corpo do artigo. Ficam aqui, e não no MDX, para que os
            arquivos de conteúdo permaneçam texto puro. */}
        <div
          className="shell-narrow py-12
            [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:text-fg
            [&_h3]:mt-10 [&_h3]:text-xl [&_h3]:text-fg
            [&_p]:mt-5 [&_p]:text-[1.0625rem] [&_p]:leading-[1.75] [&_p]:text-fg-soft
            [&_strong]:font-semibold [&_strong]:text-fg
            [&_ul]:mt-5 [&_ul]:space-y-2.5 [&_ul]:pl-5
            [&_li]:list-disc [&_li]:text-fg-soft [&_li]:marker:text-primary
            [&_a]:text-primary-soft [&_a]:underline [&_a]:underline-offset-2
            [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5
            [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:text-fg
            [&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-card
            [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-5"
        >
          <Body />
        </div>
      </article>

      <CallToAction
        title="Discutir isso no seu contexto costuma render mais que ler sobre."
        body="Se algum ponto acima descreve o que está acontecendo no seu ambiente, vale uma conversa."
      />

    </>
  );
}
