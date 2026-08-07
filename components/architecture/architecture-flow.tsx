import { Reveal } from "@/components/motion/reveal";

/**
 * Diagrama vertical de camadas. Cada camada só conhece a de baixo, que é
 * exatamente a propriedade que o diagrama precisa comunicar.
 *
 * Renderiza no servidor e é uma lista ordenada de verdade, então funciona sem
 * JavaScript e é lido corretamente por leitor de tela. As setas são
 * decorativas.
 */

const LAYERS: readonly { name: string; detail: string }[] = [
  {
    name: "Experiências digitais",
    detail: "Jornada do casal, jornada da assessoria e operação administrativa",
  },
  {
    name: "API e regras de negócio",
    detail: "Núcleo único, para que nenhuma regra viva na interface",
  },
  {
    name: "Identidade e permissões",
    detail: "Perfis separados e isolamento entre eventos e clientes",
  },
  {
    name: "Dados e integrações",
    detail: "Persistência, documentos e serviços externos",
  },
  {
    name: "Infraestrutura cloud",
    detail: "Publicação na borda e deploy automatizado",
  },
  {
    name: "Observabilidade e operação",
    detail: "Monitoramento de erros e acompanhamento de custo",
  },
];

export function ArchitectureFlow() {
  return (
    <ol className="relative">
      {LAYERS.map((layer, index) => (
        <li key={layer.name}>
          <Reveal
            delay={index * 0.06}
            className="edge relative rounded-card border border-border bg-surface/60 px-6 py-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-base text-fg">{layer.name}</h3>
              <span className="font-mono text-[0.625rem] text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted">{layer.detail}</p>
          </Reveal>

          {index < LAYERS.length - 1 ? (
            <div aria-hidden="true" className="flex justify-center py-2">
              <svg width="12" height="18" viewBox="0 0 12 18" fill="none" aria-hidden="true">
                <path
                  d="M6 0v13m0 0 4-4m-4 4-4-4"
                  stroke="var(--color-border-strong)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
