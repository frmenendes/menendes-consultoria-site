import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function Manifesto() {
  return (
    <Section className="border-y border-border">
      <div className="shell">
        <TextReveal
          as="h2"
          lines={["Construir ficou mais rápido.", "Fazer durar continua exigindo engenharia."]}
          className="max-w-4xl text-[clamp(1.8rem,4.4vw,3.2rem)]"
          lineClassName="text-fg"
          accentLastLine
        />

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-2xl text-lg text-fg-soft">
            A MENENDES atua onde estratégia, arquitetura e operação se encontram.
            Construímos e modernizamos plataformas para que produtos digitais cresçam
            com segurança, confiabilidade e controle de custos.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
