import type { Metadata } from "next";
import { CapabilityGrid } from "@/components/architecture/capability-grid";
import { CallToAction } from "@/components/sections/cta";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/ui/structured-data";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Section, SectionHeading } from "@/components/ui/section";
import { OFFERINGS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Soluções em arquitetura, cloud e SRE",
  description:
    "Arquitetura de software, cloud, SRE, segurança, FinOps e sistemas inteligentes. Quatro formas de começar, do diagnóstico ao acompanhamento contínuo.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <StructuredData
        graph={[breadcrumbSchema([{ name: "Soluções", path: "/servicos" }])]}
      />
      <PageHero
        label="Soluções"
        title="Arquitetura, operação"
        accent="e consequência financeira."
        body="As seis frentes abaixo raramente aparecem isoladas. Custo alto costuma ser sintoma de arquitetura, e indisponibilidade recorrente costuma ser sintoma de falta de observabilidade."
      />

      <Section>
        <div className="shell">
          <CapabilityGrid />
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Modelo de atuação"
            title="Quatro formas"
            accent="de começar."
            body="O ponto de entrada depende de onde está a dor. Nenhum deles exige contratar todos os outros."
          />

          <div className="mt-14 border-t border-border">
            {OFFERINGS.map((offering, index) => (
              <Reveal
                key={offering.slug}
                delay={index * 0.05}
                className="grid gap-6 border-b border-border py-10 md:grid-cols-[auto_1fr_1.2fr] md:gap-10"
              >
                <span className="font-mono text-xs text-primary-soft">{offering.index}</span>
                <div>
                  <h3 className="text-2xl">{offering.title}</h3>
                  <p className="mt-3 max-w-sm text-fg-soft">{offering.summary}</p>
                </div>
                <ul className="space-y-2.5">
                  {offering.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <p className="max-w-2xl text-sm text-muted">
              Escopo e investimento são definidos por proposta, depois de entender o
              ambiente. Não trabalhamos com pacote fechado apresentado antes do
              diagnóstico.
            </p>
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
