import type { Metadata } from "next";
import { ProjectReveal } from "@/components/architecture/project-reveal";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { PRIOR_WORK, PROJECT_CATEGORIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Cases de produto digital, plataformas cloud, engenharia de confiabilidade e governança técnica, com o contexto e as decisões que produziram cada arquitetura.",
  alternates: { canonical: "/projetos" },
};

export default function ProjetosPage() {
  return (
    <>
      <PageHero
        label="Projetos"
        title="Contexto, decisão"
        accent="e consequência."
        body="Cada case começa pela restrição que existia. Resultado sem restrição é propaganda, porque não permite julgar se a decisão foi boa."
      />

      <Section>
        <div className="shell">
          <Reveal className="mb-14 flex flex-wrap gap-x-8 gap-y-3">
            {PROJECT_CATEGORIES.map((category, index) => (
              <span key={category} className="flex items-baseline gap-2.5">
                <span className="font-mono text-[0.625rem] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-muted">{category}</span>
              </span>
            ))}
          </Reveal>

          <ProjectReveal />
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Trabalhos anteriores"
            title="Outras entregas"
            accent="da equipe."
            body="Projetos de natureza diferente dos cases de plataforma acima, principalmente presença digital e sites institucionais."
          />
          <Reveal className="mt-10 flex flex-wrap gap-2">
            {PRIOR_WORK.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-muted"
              >
                {name}
              </span>
            ))}
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
