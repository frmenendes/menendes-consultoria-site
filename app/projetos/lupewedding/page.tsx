import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitectureFlow } from "@/components/architecture/architecture-flow";
import { CallToAction } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { getProject } from "@/lib/content";

export const metadata: Metadata = {
  title: "LupeWedding",
  description:
    "Um produto digital construído da visão de negócio à arquitetura. Case da MENENDES sobre concepção, engenharia, cloud, segurança e operação de um produto próprio.",
  alternates: { canonical: "/projetos/lupewedding" },
};

const PRODUCT_VIEWS = [
  {
    title: "Experiência dos noivos",
    body: "A jornada de quem está organizando o próprio casamento: planejamento, convidados, documentos e acompanhamento do que falta.",
  },
  {
    title: "Experiência das assessorias",
    body: "A jornada de quem opera vários eventos ao mesmo tempo, com visão de portfólio e colaboração com cada casal.",
  },
  {
    title: "Estrutura administrativa",
    body: "A operação interna do produto, separada das duas jornadas anteriores por perfil e por permissão.",
  },
];

const ENGINEERING = [
  {
    title: "Arquitetura de frontend, API e dados",
    body: "Interface, regras de negócio e persistência em camadas distintas, para que uma mude sem obrigar a outra a mudar junto.",
  },
  {
    title: "Autenticação e perfis",
    body: "Modelo de identidade definido antes das funcionalidades, com separação clara entre os perfis que o produto atende.",
  },
  {
    title: "Separação de responsabilidades",
    body: "Isolamento entre eventos e entre clientes tratado como regra de dados, não como filtro aplicado na tela.",
  },
  {
    title: "Infraestrutura cloud e automação de deploy",
    body: "Publicação na borda com esteira automatizada, de forma que subir uma versão seja rotina reversível.",
  },
  {
    title: "Segurança",
    body: "Controles no perímetro e no acesso aos dados, com tratamento de documentos sob os requisitos da LGPD.",
  },
  {
    title: "Observabilidade",
    body: "Monitoramento de erros em produção, com rastreio até a origem em vez de relato de usuário.",
  },
  {
    title: "Preocupação com custos",
    body: "Custo de infraestrutura acompanhado desde o início, porque em produto próprio ele compete diretamente com a margem.",
  },
  {
    title: "Preparação para web, mobile e B2B",
    body: "A API e o modelo de permissões foram desenhados para comportar novos canais sem reescrita da base.",
  },
];

export default function LupeWeddingPage() {
  const project = getProject("lupewedding");
  if (!project) notFound();

  return (
    <>
      <PageHero
        label="Produtos digitais"
        title="LupeWedding"
        accent="Um produto digital construído da visão de negócio à arquitetura."
        body="Prova de capacidade de produto, não apenas de entrega técnica. Concepção, engenharia, operação e evolução conduzidas de ponta a ponta."
      />

      <Section>
        <div className="shell-narrow">
          <Reveal>
            <p className="text-lg text-fg-soft">{project.context}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-lg text-fg-soft">{project.challenge}</p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Visão de produto"
            title="Três jornadas"
            accent="sobre a mesma base."
            body="Cada uma tem necessidades, permissões e ritmos diferentes. Um único modelo de dados precisa servir às três sem que uma enxergue o contexto da outra."
          />
          <ul className="mt-12 grid gap-3 md:grid-cols-3">
            {PRODUCT_VIEWS.map((view, index) => (
              <li key={view.title}>
                <Reveal
                  delay={index * 0.07}
                  className="edge h-full rounded-[--radius-card] border border-border bg-surface/60 p-7"
                >
                  <h3 className="text-lg">{view.title}</h3>
                  <p className="mt-3 text-sm text-fg-soft">{view.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              label="Arquitetura"
              title="Cada camada conhece"
              accent="apenas a de baixo."
              body="É essa restrição que permite trocar a interface, adicionar um canal ou mudar de provedor sem que a regra de negócio precise ser reescrita."
            />
          </div>
          <ArchitectureFlow />
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell">
          <SectionHeading
            label="Engenharia"
            title="O que sustenta"
            accent="o produto por baixo."
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[--radius-card] border border-border bg-border md:grid-cols-2">
            {ENGINEERING.map((item) => (
              <li key={item.title} className="bg-surface/70 p-7">
                <h3 className="text-base text-fg">{item.title}</h3>
                <p className="mt-2.5 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell-narrow">
          <Reveal className="edge rounded-[--radius-panel] border border-border bg-surface/60 p-8 md:p-10">
            <h2 className="mono-label text-primary-soft">Uso de inteligência artificial</h2>
            <p className="mt-5 text-xl leading-snug text-fg md:text-2xl">
              A inteligência artificial acelerou partes da construção. Engenharia de
              software, arquitetura e experiência operacional garantiram que o produto
              pudesse evoluir.
            </p>
            <p className="mt-5 text-fg-soft">
              É a mesma tese que sustenta o Vibe to Scale, testada no produto da própria
              casa antes de ser oferecida a alguém.
            </p>
            <ButtonLink href="/vibe-to-scale" variant="outline" className="group mt-8">
              Conhecer Vibe to Scale
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="shell-narrow">
          <SectionHeading label="Tecnologias" title="Stack" accent="do produto." />
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-[0.6875rem] text-fg-soft"
              >
                {tech}
              </span>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <ButtonLink href="https://lupewedding.com.br" external variant="outline">
              Visitar lupewedding.com.br
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      <CallToAction
        title="Quer construir um produto com essa base desde o começo?"
        body="Concepção, arquitetura e operação tratadas juntas, em vez de encaixadas depois que a primeira versão já existe."
      />
    </>
  );
}
