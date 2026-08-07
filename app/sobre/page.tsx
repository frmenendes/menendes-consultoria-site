import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { SignalBars } from "@/components/architecture/signal-bars";
import { Section, SectionHeading } from "@/components/ui/section";
import { STACK } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A MENENDES atua entre a decisão executiva e a implementação, reunindo arquitetura de software, cloud, SRE, DevOps, segurança, dados, FinOps e inteligência artificial.",
  alternates: { canonical: "/sobre" },
};

/**
 * A amplitude é apresentada como um espectro, da sala de reunião ao terminal.
 * Cada faixa tem um lado dominante, o que dá leitura visual ao argumento sem
 * precisar dizer "somos os dois".
 */
const RANGE = [
  {
    side: "Estratégia",
    title: "Conversamos com a diretoria",
    body: "Traduzimos risco técnico em consequência de negócio, para que a decisão seja tomada com o custo real na mesa.",
    weight: 15,
  },
  {
    side: "Arquitetura",
    title: "Desenhamos antes de construir",
    body: "Decisão registrada com a restrição que a motivou. Sem isso, ninguém consegue julgar depois se ela ainda vale.",
    weight: 40,
  },
  {
    side: "Execução",
    title: "Executamos quando é preciso",
    body: "Infraestrutura, código, esteira de entrega, observabilidade e segurança, sem terceirizar a parte difícil.",
    weight: 72,
  },
  {
    side: "Operação",
    title: "Ficamos depois da entrega",
    body: "Acompanhamos o ambiente em produção, porque o que sustenta uma arquitetura é a operação, não o diagrama.",
    weight: 92,
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
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-lg text-fg-soft">
                Nosso trabalho pode assumir uma atuação consultiva e estratégica ou
                avançar até a implementação hands-on em infraestrutura, código,
                pipelines, observabilidade, segurança e operação.
              </p>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-fg-soft">
                Fundada por Felipe Menendes, a MENENDES é a continuação como empresa de
                anos conduzindo migrações de nuvem, desenhando esteiras de entrega e
                operando plataformas em produção.
              </p>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-fg-soft">
                A LupeWedding nasceu dentro da casa: um produto próprio, concebido e
                operado com o mesmo rigor aplicado nos projetos de cliente. Isso muda a
                consultoria que entregamos, porque a conta de nuvem e o plantão também
                são nossos.
              </p>
            </Reveal>
          </div>

          {/* Painel de terminal. Dá vida ao bloco de texto e diz, sem afirmar
              número nenhum, que a operação é acompanhada. */}
          <Reveal>
            <div className="edge overflow-hidden rounded-panel border border-border bg-surface/60">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-danger/60" />
                <span className="h-2 w-2 rounded-full bg-warning/60" />
                <span className="h-2 w-2 rounded-full bg-success/60" />
                <span className="ml-2 font-mono text-[0.625rem] tracking-[0.14em] text-faint">
                  menendes · operação
                </span>
              </div>

              <div className="space-y-2.5 p-5 font-mono text-[0.6875rem] leading-relaxed">
                <p className="text-muted">
                  <span className="text-primary-soft">$</span> arquitetura revisar
                  --ambiente producao
                </p>
                <p className="text-fg-soft">contexto lido · restrições mapeadas</p>
                <p className="text-muted">
                  <span className="text-primary-soft">$</span> risco listar --ordenar
                  impacto
                </p>
                <p className="text-fg-soft">
                  acesso · custo · disponibilidade · entrega
                </p>
                <p className="text-muted">
                  <span className="text-primary-soft">$</span> plano aplicar --reversivel
                  <span className="caret ml-1 inline-block w-1.5 bg-primary-soft align-middle">
                    &nbsp;
                  </span>
                </p>
              </div>

              <div className="flex items-end justify-between gap-6 border-t border-border px-5 py-4">
                <div>
                  <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
                    TELEMETRIA
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] text-muted">
                    acompanhamento contínuo
                  </p>
                </div>
                <SignalBars />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            label="Amplitude"
            title="Da reunião de diretoria"
            accent="ao incidente em produção."
            body="A mesma equipe percorre os dois extremos. É o que evita o repasse de contexto entre quem recomenda e quem executa."
          />

          <ul className="mt-12 space-y-3">
            {RANGE.map((item) => (
              <li key={item.title}>
                <Reveal className="edge group relative overflow-hidden rounded-card border border-border bg-surface/50 p-6 md:p-7">
                  {/* Marcador de posição no espectro. A largura é a própria
                      informação: onde aquela atuação vive entre estratégia e
                      terminal. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary to-accent transition-[width] duration-700"
                    style={{ width: `${item.weight}%` }}
                  />

                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-lg text-fg">{item.title}</h3>
                    <span className="font-mono text-[0.625rem] tracking-[0.16em] text-primary-soft">
                      {item.side}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm text-fg-soft">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            label="Como trabalhamos"
            title="Quatro compromissos"
            accent="que não negociamos."
          />
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((item, index) => (
              <li key={item.title}>
                <Reveal className="edge group relative h-full overflow-hidden rounded-card border border-border bg-surface/60 p-7 transition-colors duration-300 hover:border-border-strong">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(420px circle at 50% 0%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)",
                    }}
                  />
                  <span className="relative font-mono text-[0.625rem] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative mt-3 text-lg">{item.title}</h3>
                  <p className="relative mt-3 text-sm text-fg-soft">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            label="Stack"
            title="O que colocamos"
            accent="em produção."
            align="center"
          />
          <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface/50 px-4 py-2 font-mono text-[0.6875rem] text-muted transition-colors duration-300 hover:border-primary hover:text-primary-soft"
              >
                {tech}
              </span>
            ))}
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
