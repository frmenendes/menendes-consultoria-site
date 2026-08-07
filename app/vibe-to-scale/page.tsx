import type { Metadata } from "next";
import { ArchitectureTransformation } from "@/components/architecture/architecture-transformation";
import { CosmicBackdrop, SeamGlow } from "@/components/architecture/cosmic-backdrop";
import { HudFrame } from "@/components/architecture/hud-frame";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { StructuredData } from "@/components/ui/structured-data";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { VIBE_PHASES, VIBE_PROBLEMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vibe to Scale",
  description:
    "Transformamos aplicações criadas com IA em plataformas seguras, escaláveis, observáveis e economicamente sustentáveis. Do prompt à produção.",
  alternates: { canonical: "/vibe-to-scale" },
};

/**
 * O fundo estelar desta página não é enfeite emprestado da home. A conversa
 * aqui é sobre IA e sobre uma aplicação que precisa deixar de ser experimento,
 * e a escala visual do céu é o que dá a essa mudança o tamanho que ela tem.
 * As seções antes eram separadas por `border-t`, uma linha reta atravessando a
 * página. Sobre um fundo com profundidade, aquilo lia como corte; agora a
 * separação é feita de luz.
 */
export default function VibeToScalePage() {
  return (
    <>
      <StructuredData
        graph={[breadcrumbSchema([{ name: "Vibe to Scale", path: "/vibe-to-scale" }])]}
      />
      <PageHero
        flush
        label="Vibe to Scale"
        title="Do prompt"
        accent="à produção."
        body="Você validou a ideia e construiu a primeira versão. Agora precisa de segurança, arquitetura, previsibilidade de custos e uma base capaz de sustentar o crescimento."
      />

      {/* O fundo cobre da primeira seção ao CTA, e fica fora do PageHero de
          propósito: aquele já tem fundo próprio (blueprint mais glow), e
          sobrepor os dois só empasta a área do título. */}
      <div className="relative">
        <CosmicBackdrop fadeTop galaxy />

        {/* Costura no lugar da borda que havia aqui: a página entra no
            fundo estelar por luz, não por régua de 1px. */}
        <SeamGlow intensity={0.55} />

        <Section>
          <div className="shell">
            <SectionHeading
              label="Diagnóstico"
              title="O que costuma aparecer"
              accent="quando a primeira versão encontra usuários reais."
              body="Nenhum destes itens é falha de quem construiu. São consequências previsíveis de otimizar para velocidade de validação, que é exatamente o que a primeira versão precisava fazer."
            />

            {/* Painel de diagnóstico.
                A grade é a leitura certa para doze itens: dá começo, fim e
                permite varrer a lista de uma vez. Duas tentativas anteriores
                falharam por atacar isso — soltar os itens no fundo estelar
                virou uma lista à deriva, e uma varredura animada descendo pelo
                painel lia como linha quebrada, não como sensor.

                Então a estrutura da tabela fica, e o acréscimo é só estático:
                cabeçalho de instrumento, e colchetes de canto que acendem no
                item sob o cursor. Nada se move aqui — o movimento da página
                vive no fundo, atrás, onde não disputa com texto.

                As células são opacas de propósito. Translúcidas, o campo de
                estrelas passava por trás do texto e custava legibilidade: é a
                mesma regra que rege o resto do site, luz no fundo e nunca sob
                corpo de texto. */}
            <div className="mt-14 overflow-hidden rounded-card border border-border">
              <div className="flex items-center justify-between border-b border-border bg-surface-2/80 px-5 py-3 font-mono text-[0.5625rem] tracking-[0.18em] text-faint">
                <span className="text-primary-soft">DIAGNOSTIC_SCAN</span>
                <span>{VIBE_PROBLEMS.length} ACHADOS</span>
              </div>

              <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {VIBE_PROBLEMS.map((problem, index) => (
                  <li
                    key={problem}
                    className="group relative bg-surface p-5 transition-colors duration-300 hover:bg-surface-2"
                  >
                    <div className="absolute inset-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <HudFrame tone="active" />
                    </div>

                    <div className="relative flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-primary-soft/50 transition-colors duration-300 group-hover:bg-primary-soft"
                      />
                      <span className="font-mono text-[0.625rem] tracking-[0.16em] text-warning">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="relative mt-2.5 text-sm text-fg-soft transition-colors duration-300 group-hover:text-fg">
                      {problem}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <SeamGlow intensity={0.8} />

        <Section>
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

        <SeamGlow intensity={0.8} />

        <Section>
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

            <Reveal className="mt-12 rounded-card border border-border bg-surface/60 p-7">
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

        <SeamGlow intensity={0.9} />

        <CallToAction
          title="A ideia continua sendo sua. A plataforma passa a estar preparada para crescer."
          body="Se você construiu com Lovable, Base44, Replit ou qualquer ferramenta assistida por IA e chegou no ponto em que segurança, custo ou escala viraram assunto, é uma boa hora para conversar."
        />
      </div>
    </>
  );
}
