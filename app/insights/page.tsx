import type { Metadata } from "next";
import Link from "next/link";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/ui/structured-data";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { ArrowRight } from "@/components/ui/button";
import { INSIGHTS, formatInsightDate } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Menendes Lab",
  description:
    "Arquitetura, SRE, cloud, FinOps, segurança, dados e vibe coding. Notas técnicas sobre o que sustenta plataformas em produção.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <StructuredData
        graph={[breadcrumbSchema([{ name: "Menendes Lab", path: "/insights" }])]}
      />
      <PageHero
        label="Menendes Lab"
        title="Notas sobre o que"
        accent="sustenta um sistema."
        body="Arquitetura, SRE, cloud, Kubernetes, FinOps, segurança, dados, inteligência artificial e modernização. Escrito a partir do que aparece na operação, não do que rende manchete."
      />

      <Section>
        <div className="shell">
          <ul className="border-t border-border">
            {INSIGHTS.map((insight, index) => (
              <li key={insight.slug} className="border-b border-border">
                <Reveal delay={index * 0.05}>
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="group flex flex-col gap-4 py-9 md:flex-row md:items-baseline md:gap-10"
                  >
                    <div className="flex items-center gap-4 md:w-56 md:flex-none md:flex-col md:items-start md:gap-2">
                      <span className="mono-label text-primary-soft">{insight.topic}</span>
                      <time
                        dateTime={insight.date}
                        className="font-mono text-[0.625rem] text-faint"
                      >
                        {formatInsightDate(insight.date)}
                      </time>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl text-fg transition-colors group-hover:text-primary-soft md:text-2xl">
                        {insight.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm text-muted">{insight.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] text-faint">
                        {insight.readingMinutes} MIN
                        <ArrowRight className="text-muted" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
