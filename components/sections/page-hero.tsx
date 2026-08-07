import { Reveal } from "@/components/motion/reveal";
import { MonoLabel } from "@/components/ui/section";

export function PageHero({
  label,
  title,
  accent,
  body,
}: {
  label: string;
  title: string;
  accent?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-[calc(var(--nav-h)+5rem)] pb-20">
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
        <Reveal y={0}>
          <MonoLabel className="text-primary-soft">{label}</MonoLabel>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.6rem)]">
            {title}
            {accent ? <span className="text-gradient"> {accent}</span> : null}
          </h1>
        </Reveal>
        {body ? (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg text-fg-soft">{body}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
