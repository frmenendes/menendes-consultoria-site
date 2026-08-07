import { CodeDiff, CostChart, ReliabilityChart } from "@/components/architecture/code-diff";

/**
 * Painéis que se sobrepõem durante a rolagem.
 *
 * A referência é a home do GitHub: cada bloco gruda no topo e o seguinte sobe
 * por cima dele, de modo que a narrativa se empilha em vez de simplesmente
 * passar. Aqui os três painéis contam a mesma história em três linguagens —
 * código, custo e confiabilidade —, que é a sequência que a MENENDES vende:
 * primeiro a arquitetura muda, depois a conta muda, depois a operação para de
 * acordar de madrugada.
 *
 * ── Como funciona, e por que não tem biblioteca ───────────────────────────
 *
 * `position: sticky` e nada mais. Cada painel gruda a uma distância do topo
 * ligeiramente maior que a do anterior, então quando o segundo alcança o
 * primeiro ele para 12px abaixo — é essa diferença que produz a pilha visível
 * de bordas, em vez de um painel tapando o outro por completo.
 *
 * Sem scroll-jacking, e isso é deliberado: bibliotecas do gênero sequestram a
 * rolagem, quebram o scroll do teclado e da barra lateral, e custam caro em
 * INP, que é justamente um dos Core Web Vitals que o trabalho de SEO deste
 * site está protegendo. Com sticky, a rolagem continua sendo a do navegador: é
 * o compositor que faz o trabalho, não o JavaScript. Não há um único listener
 * de scroll nesta seção.
 *
 * Sob `prefers-reduced-motion` nada precisa ser desligado, porque nada anima
 * por tempo — o único movimento é o da própria rolagem, que o usuário controla.
 */

type Etapa = {
  indice: string;
  rotulo: string;
  titulo: string;
  corpo: string;
  visual: React.ReactNode;
};

const ETAPAS: readonly Etapa[] = [
  {
    indice: "01",
    rotulo: "Arquitetura",
    titulo: "A mesma rota, com fronteira.",
    corpo: "O que uma ferramenta de geração entrega funciona na demonstração. O que falta nela é autorização, isolamento entre clientes e uma fronteira entre rota e dados — e é isso que decide se o sistema aguenta o primeiro cliente grande.",
    visual: <CodeDiff />,
  },
  {
    indice: "02",
    rotulo: "FinOps",
    titulo: "A conta para de crescer sozinha.",
    corpo: "Custo de nuvem raramente se resolve na fatura. Ele é definido no acoplamento, no modelo de dados e no que roda de forma síncrona sem precisar. Corrigida a arquitetura, a curva muda de inclinação.",
    visual: <CostChart />,
  },
  {
    indice: "03",
    rotulo: "Confiabilidade",
    titulo: "A operação para de apagar incêndio.",
    corpo: "Disponibilidade não vem de esperança, vem de instrumentação. Com o sistema observável, o incidente deixa de ser descoberto pelo cliente e passa a ser detectado, diagnosticado e recuperado.",
    visual: <ReliabilityChart />,
  },
];

export function ScrollStack() {
  return (
    <section aria-labelledby="pilha-titulo" className="py-16 md:py-24">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="mono-label text-primary-soft">Como a mudança aparece</span>
          <h2 id="pilha-titulo" className="mt-4 text-3xl md:text-[2.6rem]">
            Três formas de olhar
            <span className="text-gradient"> para a mesma decisão.</span>
          </h2>
          <p className="mt-5 text-fg-soft md:text-lg">
            Uma decisão de arquitetura não se justifica sozinha. Ela precisa aparecer
            no código, na conta do mês e no sono de quem opera.
          </p>
        </div>

        {/* A pilha. Cada painel gruda 12px abaixo do anterior, e é essa
            diferença que deixa a borda do de baixo à mostra. */}
        <div className="mt-16 flex flex-col gap-8">
          {ETAPAS.map((etapa, index) => (
            <article
              key={etapa.indice}
              className="edge sticky overflow-hidden rounded-panel border border-border bg-surface/85 backdrop-blur-sm"
              style={{
                // `top` cresce com o índice: o painel 2 para abaixo do 1, e
                // assim por diante. Em rem para acompanhar o zoom do usuário.
                top: `calc(var(--nav-h) + ${1.5 + index * 0.75}rem)`,
                // Sem z-index explícito: na ordem do documento, o painel
                // seguinte já pinta por cima do anterior, que é o empilhamento
                // desejado. Declarar z-index aqui só criaria contexto de
                // empilhamento sem necessidade.
              }}
            >
              <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.625rem] tracking-[0.16em] text-faint">
                      {etapa.indice}
                    </span>
                    <span className="mono-label text-primary-soft">{etapa.rotulo}</span>
                  </div>
                  <h3 className="mt-5 text-2xl md:text-[1.75rem]">{etapa.titulo}</h3>
                  <p className="mt-4 max-w-md text-fg-soft">{etapa.corpo}</p>
                </div>

                {etapa.visual}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
