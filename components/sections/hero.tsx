import { SystemTopology } from "@/components/architecture/system-topology";
import { OperationalStatus } from "@/components/architecture/operational-status";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-[--nav-h]">
      <div className="blueprint mask-fade absolute inset-0 opacity-50" aria-hidden="true" />
      <SystemTopology />

      {/* Véu que garante contraste do texto sobre a topologia, sem apagá-la. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent"
      />

      <div className="shell relative py-20">
        <Reveal y={0}>
          <p className="mono-label text-primary-soft">{SITE.name}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)]">
            Tecnologia para empresas que{" "}
            <span className="text-gradient">não podem parar.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-xl text-lg text-fg-soft">{SITE.description}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/projetos" className="group">
              Conheça os projetos
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/contato" variant="outline">
              Vamos discutir seu desafio
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.32} className="mt-14">
          <OperationalStatus />
        </Reveal>
      </div>
    </section>
  );
}
