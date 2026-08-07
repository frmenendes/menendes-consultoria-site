"use client";

import dynamic from "next/dynamic";

/**
 * Moldura dos gráficos.
 *
 * Existe por duas razões, e as duas são de disciplina, não de estilo.
 *
 * **Tamanho.** Os três painéis da pilha precisam ter exatamente a mesma
 * altura, senão a sobreposição por `sticky` desalinha e um painel mostra mais
 * borda que o outro. A altura vive aqui, uma vez, e não em cada gráfico. O
 * acabamento é o mesmo dos demais cartões do site — `rounded-card`, borda
 * `border-border`, superfície `bg-surface/60` —, e não uma variante nova.
 *
 * **Peso.** Recharts entra por `next/dynamic` com `ssr: false`: é a biblioteca
 * mais pesada do projeto, e num site que está sendo otimizado para busca ela
 * não pode custar no bundle inicial. O esqueleto reserva a altura exata do
 * gráfico enquanto ele não chega, então a troca não desloca nada — CLS é um dos
 * Core Web Vitals que o trabalho de SEO aqui protege, e um gráfico que
 * aparece empurrando o texto é exatamente o que o mede mal.
 */

const ALTURA = "h-[220px]";

const carregando = () => (
  <div className={`${ALTURA} w-full animate-pulse rounded bg-surface-2/40`} />
);

export const CostChart = dynamic(
  () => import("@/components/architecture/simulation-charts").then((m) => m.CostChart),
  { ssr: false, loading: carregando },
);

export const ReliabilityChart = dynamic(
  () =>
    import("@/components/architecture/simulation-charts").then((m) => m.ReliabilityChart),
  { ssr: false, loading: carregando },
);

export const LatencyChart = dynamic(
  () => import("@/components/architecture/simulation-charts").then((m) => m.LatencyChart),
  { ssr: false, loading: carregando },
);

export function ChartPanel({
  titulo,
  destaque,
  destaqueTom = "positivo",
  children,
}: {
  titulo: string;
  destaque: string;
  destaqueTom?: "positivo" | "neutro";
  children: React.ReactNode;
}) {
  return (
    <figure className="edge overflow-hidden rounded-card border border-border bg-surface/60">
      <figcaption className="flex items-center justify-between border-b border-border-soft px-4 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
        <span>{titulo}</span>
        <span className={destaqueTom === "positivo" ? "text-primary-soft" : "text-faint"}>
          {destaque}
        </span>
      </figcaption>
      <div className={`${ALTURA} w-full px-2 py-3`}>{children}</div>
    </figure>
  );
}

/** Mesma moldura para o diff, para os três painéis ficarem idênticos por fora. */
export function PanelFrame({
  titulo,
  destaque,
  children,
}: {
  titulo: string;
  destaque: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="edge overflow-hidden rounded-card border border-border bg-surface/60">
      <figcaption className="flex items-center justify-between border-b border-border-soft px-4 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
        <span>{titulo}</span>
        <span>{destaque}</span>
      </figcaption>
      <div className={`${ALTURA} w-full overflow-hidden`}>{children}</div>
    </figure>
  );
}
