import { CAPABILITIES, type Capability } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Bento grid dos pilares de expertise.
 *
 * Sobre a ausência de revelação por hover:
 *
 * A versão anterior escondia o detalhe e o abria em hover, foco ou clique. Não
 * funcionou, por três motivos que se somavam. O texto expandindo mudava a
 * altura do conteúdo e, como `auto-rows-fr` iguala a altura das linhas, passar
 * o mouse reflowava a linha inteira. Os três gatilhos disputavam o mesmo
 * estado, então clicar depois do hover parecia não fazer nada. E o card era um
 * <button> que não levava a lugar nenhum, o que é ruim para leitor de tela e
 * para quem navega por teclado.
 *
 * O detalhe é justamente a parte diferenciada da copy, então escondê-lo atrás
 * de um gesto era esconder o que interessa. Agora está sempre visível: o card
 * não muda de tamanho, não existe estado, e a mesma informação chega igual no
 * desktop e no toque. O hover voltou a ser o que deveria ser, um realce.
 *
 * Sem estado, o componente também deixou de precisar rodar no cliente.
 */

const SPAN: Record<Capability["span"], string> = {
  wide: "md:col-span-2",
  normal: "",
};

export function CapabilityGrid() {
  return (
    <ul className="grid grid-cols-1 gap-3 md:auto-rows-fr md:grid-cols-3">
      {CAPABILITIES.map((capability, index) => (
        <li key={capability.slug} className={SPAN[capability.span]}>
          <CapabilityCard capability={capability} index={index} />
        </li>
      ))}
    </ul>
  );
}

function CapabilityCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <article
      className={cn(
        "edge group relative flex h-full flex-col overflow-hidden rounded-[--radius-card]",
        "border border-border bg-surface/60 p-6 md:p-7",
        "transition-[border-color,transform] duration-300",
        "hover:-translate-y-0.5 hover:border-border-strong",
      )}
    >
      {/* Iluminação localizada. Decorativa, e a única coisa que o hover muda. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(460px circle at 50% 0%, color-mix(in oklab, var(--color-primary) 13%, transparent), transparent 70%)",
        }}
      />

      <div className="relative flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-primary-soft">
          {capability.title}
        </h3>
        <span className="font-mono text-[0.625rem] text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="relative mt-4 max-w-md text-lg leading-snug text-fg md:text-xl">
        {capability.claim}
      </p>

      <p className="relative mt-4 max-w-lg text-sm leading-relaxed text-fg-soft">
        {capability.detail}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border-soft pt-4">
        {capability.items.map((item) => (
          <li key={item} className="font-mono text-[0.6875rem] text-faint">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
