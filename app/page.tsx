import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { TwoPaths } from "@/components/sections/two-paths";
import { ScrollStack } from "@/components/sections/scroll-stack";
import { CallToAction } from "@/components/sections/cta";
import { CapabilityGrid } from "@/components/architecture/capability-grid";
import { ArchitectureTransformation } from "@/components/architecture/architecture-transformation";
import { ProjectReveal } from "@/components/architecture/project-reveal";
import { TraceRail } from "@/components/architecture/trace-rail";
import { CosmicBackdrop, SeamGlow } from "@/components/architecture/cosmic-backdrop";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { OFFERINGS } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="relative">
      <CosmicBackdrop />
      <TraceRail />

      <Hero />

      <Manifesto />

      <SeamGlow />

      <TwoPaths />

      <SeamGlow intensity={0.75} />

      <Section id="solucoes">
        <div className="shell">
          <SectionHeading
            label="Soluções"
            title="Seis frentes que sustentam"
            accent="uma operação inteira."
            body="Elas quase nunca chegam sozinhas. Um problema de custo costuma ser um problema de arquitetura, e uma falha recorrente costuma ser um problema de observabilidade."
          />
          {/* Resumido: detail e lista de tecnologias vivem só em /servicos.
              Ver a nota sobre canibalização em capability-grid.tsx. */}
          <div className="mt-14">
            <CapabilityGrid compact />
          </div>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            label="From vibe to scale"
            title="Vibe coding cria velocidade."
            accent="Engenharia cria longevidade."
            body="Uma aplicação gerada por IA entrega a primeira versão em dias. O que ela não entrega é fronteira entre responsabilidades, controle de acesso, previsibilidade de custo e capacidade de operar sob carga."
          />
          <div className="mt-14">
            <ArchitectureTransformation />
          </div>

          <Reveal className="mt-14 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-lg text-fg-soft">
              A ideia continua sendo sua.
              <br />
              <span className="text-fg">A plataforma passa a estar preparada para crescer.</span>
            </p>
            <ButtonLink href="/vibe-to-scale" className="group self-start">
              Transformar meu aplicativo
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      <ScrollStack />

      <Section id="projetos">
        <div className="shell">
          <SectionHeading
            label="Projetos selecionados"
            title="Contexto, decisão"
            accent="e consequência."
            body="Cada case abre com a restrição que existia e a decisão que ela obrigou. É o que costuma faltar quando alguém apresenta apenas o resultado."
          />
          {/* Resumido: o resumo de cada case vive em /projetos.
              Ver a nota em project-reveal.tsx. */}
          <div className="mt-14">
            <ProjectReveal compact />
          </div>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            label="Modelo de atuação"
            title="Quatro formas"
            accent="de começar."
          />
          <ul className="mt-14 grid gap-3 md:grid-cols-2">
            {OFFERINGS.map((offering, index) => (
              <li key={offering.slug}>
                <Reveal
                  delay={index * 0.06}
                  className="edge h-full rounded-card border border-border bg-surface/50 p-7"
                >
                  <span className="font-mono text-xs text-primary-soft">{offering.index}</span>
                  <h3 className="mt-4 text-xl">{offering.title}</h3>
                  <p className="mt-3 text-sm text-fg-soft">{offering.summary}</p>
                  {/* O que cada modelo inclui fica em /servicos. Aqui a home
                      apresenta as quatro portas de entrada; lá se decide por
                      qual entrar. */}
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link
              href="/servicos"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-soft hover:text-primary"
            >
              Ver todas as soluções
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </Section>

      <SeamGlow intensity={0.85} />

      <CallToAction />
    </div>
  );
}
