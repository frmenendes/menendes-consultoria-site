import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      {children}
    </section>
  );
}

export function MonoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("mono-label", className)}>{children}</span>;
}

/**
 * Cabeçalho de seção. `accent` recebe o gradiente da marca, então deve ser a
 * parte da frase que carrega a ideia, não um adjetivo solto.
 */
export function SectionHeading({
  label,
  title,
  accent,
  body,
  align = "left",
  className,
}: {
  label?: string;
  title: string;
  accent?: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {label ? <MonoLabel className="text-primary-soft">{label}</MonoLabel> : null}
      <h2 className="mt-4 text-3xl md:text-[2.6rem]">
        {title}
        {accent ? <span className="text-gradient"> {accent}</span> : null}
      </h2>
      {body ? <p className="mt-5 text-fg-soft md:text-lg">{body}</p> : null}
    </Reveal>
  );
}
