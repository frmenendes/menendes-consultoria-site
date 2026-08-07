import { ArrowRight, ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden pt-(--nav-h)">
      <div className="blueprint mask-fade absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="shell relative py-20">
        <p className="mono-label text-primary-soft">Erro 404</p>
        <h1 className="mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)]">
          Esta rota não existe.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-fg-soft">
          O endereço mudou de lugar ou nunca esteve aqui. As duas hipóteses terminam no
          mesmo destino.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" className="group">
            Voltar ao início
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/projetos" variant="outline">
            Ver projetos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
