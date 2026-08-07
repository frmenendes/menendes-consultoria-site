import { SystemTopology } from "@/components/architecture/system-topology";
import { CodeDiff } from "@/components/architecture/code-diff";
import { OperationalStatus } from "@/components/architecture/operational-status";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SITE } from "@/lib/site";

/**
 * Hero em duas colunas.
 *
 * A topologia ocupa uma coluna própria em vez de correr por trás do texto. Como
 * fundo de sangria, os nós apareciam atrás do título e as legendas viravam
 * palavras soltas, porque a maior parte das arestas ficava escondida sob o véu
 * de contraste. Em coluna, o grafo cabe inteiro e volta a ser lido como uma
 * arquitetura conectada.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-(--nav-h)">
      <div className="blueprint mask-fade absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="shell relative w-full py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
          <div>
            <Reveal mode="load">
              <p className="mono-label text-primary-soft">{SITE.name}</p>
            </Reveal>

            <Reveal mode="load" delay={0.08}>
              <h1 className="mt-6 text-[clamp(2.3rem,5vw,4rem)]">
                Tecnologia para empresas que{" "}
                <span className="text-gradient">não podem parar.</span>
              </h1>
            </Reveal>

            <Reveal mode="load" delay={0.16}>
              <p className="mt-7 max-w-lg text-lg text-fg-soft">{SITE.description}</p>
            </Reveal>

            <Reveal mode="load" delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/projetos" className="group">
                  Conheça alguns dos projetos
                  <ArrowRight />
                </ButtonLink>
                <ButtonLink href="/contato" variant="outline">
                  Vamos discutir seu desafio
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal mode="load" delay={0.32} className="mt-12">
              <OperationalStatus />
            </Reveal>
          </div>

          {/* Coluna da direita: topologia e diff empilhados.
              Medida a hero em 1920px, esta coluna tinha 304px de altura contra
              679px da coluna de texto, e o bloco morto de 608x250px abaixo da
              topologia era o que desequilibrava a composição. O diff ocupa
              exatamente esse espaço, e diz em código o que o texto ao lado diz
              em palavras. */}
          <div className="flex flex-col gap-5">
            {/* A proporção acompanha o viewBox do grafo (200x100). Com uma caixa
                mais alta que isso, o `meet` centraliza o desenho e sobra faixa
                vazia em cima e embaixo. */}
            <div className="relative aspect-[2/1] w-full">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 100%)",
                }}
              />
              <SystemTopology />
            </div>

            {/* Só a partir de lg: abaixo disso as colunas empilham, a hero já
                fica alta, e mais um bloco empurraria o CTA para fora da
                primeira tela. */}
            <div className="hidden lg:block">
              <CodeDiff />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
