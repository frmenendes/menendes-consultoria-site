import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { TwoPaths } from "@/components/sections/two-paths";
import { CallToAction } from "@/components/sections/cta";
import { CapabilityGrid } from "@/components/architecture/capability-grid";
import { ArchitectureTransformation } from "@/components/architecture/architecture-transformation";
import { ProjectReveal } from "@/components/architecture/project-reveal";
import { TraceLink } from "@/components/architecture/trace-link";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { OFFERINGS } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      <TraceLink index="01" stage="SOURCE" tech={["Git", "Monorepo", "Code review"]} />

      <Manifesto />

      <TraceLink index="02" stage="DEPENDENCIES" tech={["npm", "pip", "go mod", "SBOM"]} />

      <TwoPaths />

      <TraceLink index="03" stage="BUILD" tech={["GitHub Actions", "Docker", "Testes"]} />

      <Section id="expertise">
        <div className="shell">
          <SectionHeading
            label="Expertise"
            title="Seis frentes que sustentam"
            accent="uma operação inteira."
            body="Elas quase nunca chegam sozinhas. Um problema de custo costuma ser um problema de arquitetura, e uma falha recorrente costuma ser um problema de observabilidade."
          />
          <div className="mt-14">
            <CapabilityGrid />
          </div>
        </div>
      </Section>

      <TraceLink index="04" stage="DEPLOY" tech={["Terraform", "Pulumi", "Argo CD", "Rollback"]} />

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

      <TraceLink index="05" stage="RUNTIME" tech={["Kubernetes", "ECS", "Node", "Python", "Go"]} />

      <Section id="projetos">
        <div className="shell">
          <SectionHeading
            label="Projetos selecionados"
            title="Contexto, decisão"
            accent="e consequência."
            body="Cada case abre com a restrição que existia e a decisão que ela obrigou. É o que costuma faltar quando alguém apresenta apenas o resultado."
          />
          <div className="mt-14">
            <ProjectReveal />
          </div>
        </div>
      </Section>

      <TraceLink index="06" stage="DATA" tech={["PostgreSQL", "Redis", "Kafka", "Filas"]} />

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
                  className="edge h-full rounded-[--radius-card] border border-border bg-surface/50 p-7"
                >
                  <span className="font-mono text-xs text-primary-soft">{offering.index}</span>
                  <h3 className="mt-4 text-xl">{offering.title}</h3>
                  <p className="mt-3 text-sm text-fg-soft">{offering.summary}</p>
                  <ul className="mt-5 space-y-2 border-t border-border-soft pt-5">
                    {offering.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link
              href="/servicos"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-soft hover:text-primary"
            >
              Ver a expertise completa
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </Section>

      <TraceLink index="07" stage="OBSERVE" tech={["OpenTelemetry", "Grafana", "Datadog", "SLO"]} />

      <CallToAction />
    </>
  );
}
