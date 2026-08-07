import type { Metadata } from "next";
import { ArchitectureTransformation } from "@/components/architecture/architecture-transformation";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { VIBE_PHASES, VIBE_PROBLEMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vibe to Scale",
  description:
    "Transformamos aplicações criadas com IA em plataformas seguras, escaláveis, observáveis e economicamente sustentáveis. Do prompt à produção.",
  alternates: { canonical: "/vibe-to-scale" },
};

export default function VibeToScalePage() {
  return (
    <>
      <PageHero
        label="Vibe to Scale"
        title="Do prompt"
        accent="à produção."
        body="Você validou a ideia e construiu a primeira versão. Agora precisa de segurança, arquitetura, previsibilidade de custos e uma base capaz de sustentar o crescimento."
      />

      <Section>
        <div className="shell">
          <SectionHeading
            label="Diagnóstico"
            title="O que costuma aparecer"
            accent="quando a primeira versão encontra usuários reais."
            body="Nenhum destes itens é falha de quem construiu. São consequências previsíveis de otimizar para velocidade de validação, que é exatamente o que a primeira versão precisava fazer."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[--radius-card] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {VIBE_PROBLEMS.map((problem, index) => (
              <li key={problem} className="bg-surface/70 p-5">
                <span className="font-mono text-[0.625rem] text-warning">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm text-fg-soft">{problem}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="From vibe to scale"
            title="Vibe coding cria velocidade."
            accent="Engenharia cria longevidade."
          />
          <div className="mt-14">
            <ArchitectureTransformation />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Metodologia"
            title="Seis fases,"
            accent="nesta ordem."
            body="A ordem importa. Arquitetar antes de estabilizar significa reescrever sobre uma base que ainda está vazando."
          />

          <ol className="mt-14 border-t border-border">
            {VIBE_PHASES.map((phase, index) => (
              <Reveal
                key={phase.index}
                delay={index * 0.05}
                className="grid items-baseline gap-4 border-b border-border py-9 md:grid-cols-[5rem_1fr_1.4fr] md:gap-10"
              >
                <span className="font-mono text-xs text-primary-soft">{phase.index}</span>
                <h3 className="text-2xl">{phase.name}</h3>
                <p className="text-fg-soft">{phase.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-12 rounded-[--radius-card] border border-border bg-surface/60 p-7">
            <h3 className="mono-label text-primary-soft">Sobre o escopo</h3>
            <p className="mt-4 max-w-3xl text-fg-soft">
              Preparar a arquitetura para mobile e para uso B2B não significa incluir o
              desenvolvimento completo de um aplicativo mobile ou de todas as
              funcionalidades empresariais no escopo inicial. Significa que a base de
              dados, a API e o modelo de permissões não vão precisar ser refeitos quando
              esse momento chegar.
            </p>
          </Reveal>
        </div>
      </Section>

      <CallToAction
        title="A ideia continua sendo sua. A plataforma passa a estar preparada para crescer."
        body="Se você construiu com Lovable, Base44, Replit ou qualquer ferramenta assistida por IA e chegou no ponto em que segurança, custo ou escala viraram assunto, é uma boa hora para conversar."
      />
    </>
  );
}
