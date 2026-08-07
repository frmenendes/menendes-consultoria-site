import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A MENENDES atua entre a decisão executiva e a implementação, reunindo arquitetura de software, cloud, SRE, DevOps, segurança, dados, FinOps e inteligência artificial.",
  alternates: { canonical: "/sobre" },
};

const RANGE = [
  {
    title: "Conversamos com a diretoria",
    body: "Traduzimos risco técnico em consequência de negócio, para que a decisão seja tomada com o custo real na mesa.",
  },
  {
    title: "Trabalhamos com o time técnico",
    body: "Entramos no repositório, na conta de nuvem e no pipeline, no nível de detalhe que a discussão exigir.",
  },
  {
    title: "Executamos quando é preciso",
    body: "Infraestrutura, código, esteira de entrega, observabilidade e segurança, sem terceirizar a parte difícil.",
  },
  {
    title: "Ficamos depois da entrega",
    body: "Acompanhamos o ambiente em produção, porque o que sustenta uma arquitetura é a operação, não o diagrama.",
  },
];

const PRINCIPLES = [
  {
    title: "Transparência",
    body: "Escopo, custo e risco ditos por inteiro, antes. Inclusive quando a resposta honesta é que o problema não justifica o projeto.",
  },
  {
    title: "Responsabilidade técnica",
    body: "A decisão que recomendamos é a que assumiríamos no próprio produto. Foi assim que a LupeWedding foi construída.",
  },
  {
    title: "Proximidade",
    body: "Poucos clientes por vez, com acesso direto a quem decide e a quem implementa. Sem camada de atendimento entre o problema e a engenharia.",
  },
  {
    title: "Evolução contínua",
    body: "Arquitetura não termina. Revisamos decisão à luz do que o sistema mostrou depois que entrou em produção.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        label="Sobre"
        title="Visão estratégica sem perder"
        accent="o contato com o terminal."
        body="A MENENDES atua entre a decisão executiva e a implementação. Nossa experiência reúne arquitetura de software, cloud, SRE, DevOps, segurança, dados, FinOps e inteligência artificial."
      />

      <Section>
        <div className="shell-narrow">
          <Reveal>
            <p className="text-lg text-fg-soft">
              Nosso trabalho pode assumir uma atuação consultiva e estratégica ou avançar
              até a implementação hands-on em infraestrutura, código, pipelines,
              observabilidade, segurança e operação.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-lg text-fg-soft">
              Fundada por Felipe Menendes, a MENENDES é a continuação como empresa de
              anos conduzindo migrações de nuvem, desenhando esteiras de entrega e
              operando plataformas em produção.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-lg text-fg-soft">
              A LupeWedding nasceu dentro da casa: um produto próprio, concebido e
              operado com o mesmo rigor aplicado nos projetos de cliente. Isso muda a
              consultoria que entregamos, porque a conta de nuvem e o plantão também são
              nossos.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Amplitude"
            title="Da reunião de diretoria"
            accent="ao incidente em produção."
            body="A mesma equipe percorre os dois extremos. É o que evita o repasse de contexto entre quem recomenda e quem executa."
          />
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {RANGE.map((item, index) => (
              <li key={item.title}>
                <Reveal
                  delay={index * 0.06}
                  className="edge h-full rounded-[--radius-card] border border-border bg-surface/60 p-7"
                >
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-3 text-sm text-fg-soft">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Como trabalhamos"
            title="Quatro compromissos"
            accent="que não negociamos."
          />
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((item, index) => (
              <li key={item.title}>
                <Reveal
                  delay={index * 0.06}
                  className="edge h-full rounded-[--radius-card] border border-border bg-surface/60 p-7"
                >
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-3 text-sm text-fg-soft">{item.body}</p>
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
