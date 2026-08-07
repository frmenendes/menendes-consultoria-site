import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { whatsappUrl } from "@/lib/site";

export function CallToAction({
  title = "Seu próximo problema complexo pode começar com uma conversa simples.",
  body = "Uma conversa curta costuma bastar para localizar onde está o gargalo: arquitetura, confiabilidade, custo de nuvem, segurança ou entrega.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section>
      <div className="shell">
        <Reveal className="edge relative overflow-hidden rounded-[--radius-panel] border border-border bg-surface/50 px-8 py-16 md:px-14 md:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(600px circle at 20% 0%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3.4vw,2.5rem)]">{title}</h2>
            <p className="mt-5 text-fg-soft">{body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contato" className="group">
                Fale conosco
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href={whatsappUrl()} external variant="outline">
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
