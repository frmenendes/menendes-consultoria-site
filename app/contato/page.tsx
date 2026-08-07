import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a MENENDES sobre arquitetura, cloud, SRE, segurança, FinOps, aplicações criadas por IA ou produtos digitais.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        label="Contato"
        title="Seu próximo problema complexo"
        accent="pode começar com uma conversa simples."
        body="Quanto mais contexto vier na primeira mensagem, mais útil é a nossa primeira resposta."
      />

      <Section>
        <div className="shell grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-10">
            <div>
              <h2 className="mono-label text-primary-soft">Direto</h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-soft hover:text-fg"
                  >
                    WhatsApp {SITE.contact.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="text-fg-soft hover:text-fg"
                  >
                    {SITE.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-soft hover:text-fg"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mono-label text-primary-soft">O que ajuda saber</h2>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                {[
                  "Onde a dor aparece hoje: custo, disponibilidade, segurança ou velocidade de entrega.",
                  "Que nuvem e que stack sustentam a operação.",
                  "Se existe um prazo ou um evento forçando a decisão.",
                  "Se o time interno vai executar junto ou se a execução fica conosco.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mono-label text-primary-soft">Localização</h2>
              <p className="mt-5 text-sm text-muted">
                {SITE.contact.city}. Atendimento remoto para todo o Brasil.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
