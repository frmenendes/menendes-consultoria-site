import { Reveal } from "@/components/motion/reveal";
import { MonoLabel } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * `flush` remove a borda inferior.
 *
 * Existe para as páginas que continuam num fundo cósmico: ali a régua de 1px
 * cruzando a tela briga com um fundo que tem profundidade, e a separação passa
 * a ser feita pela costura luminosa. Nas demais páginas a borda continua sendo
 * a divisa certa, porque abaixo dela há superfície chapada.
 */
export function PageHero({
  label,
  title,
  accent,
  body,
  flush = false,
}: {
  label: string;
  title: string;
  accent?: string;
  body?: string;
  flush?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-[calc(var(--nav-h)+5rem)] pb-20",
        !flush && "border-b border-border",
      )}
    >
      <div className="blueprint mask-fade absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(760px circle at 12% 0%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="shell relative">
        <Reveal mode="load">
          <MonoLabel className="text-primary-soft">{label}</MonoLabel>
        </Reveal>
        <Reveal mode="load" delay={0.08}>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.6rem)]">
            {title}
            {accent ? <span className="text-gradient"> {accent}</span> : null}
          </h1>
        </Reveal>
        {body ? (
          <Reveal mode="load" delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg text-fg-soft">{body}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
