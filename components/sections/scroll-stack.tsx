import { CodeDiff } from "@/components/architecture/code-diff";
import {
  ChartPanel,
  CostChart,
  LatencyChart,
  ReliabilityChart,
} from "@/components/architecture/chart-panel";

/**
 * Seções que cobrem a janela conforme a rolagem.
 *
 * ── O efeito, e por que a primeira versão não era ele ─────────────────────
 *
 * A referência é a home do GitHub. Lá cada seção ocupa a largura inteira e a
 * seguinte SOBE POR CIMA cobrindo a janela toda, como folhas empilhadas: a
 * anterior não encolhe nem desliza para o lado, ela simplesmente fica atrás.
 *
 * A primeira tentativa aqui eram cartões dentro do container, com vão entre
 * eles e cantos arredondados, cada um grudando alguns pixels abaixo do
 * anterior. Aquilo lê como pilha de cartões, que é outra coisa: a janela nunca
 * era coberta, e a borda do de baixo continuava à mostra o tempo todo.
 *
 * O que produz o efeito certo:
 *
 *  1. cada seção é `sticky top-0` — todas no MESMO topo, não escalonadas;
 *  2. cada seção tem altura de tela cheia, então gruda pelo tempo exato da
 *     própria rolagem antes de a próxima chegar;
 *  3. cada seção é full-bleed e tem fundo OPACO. Sem opacidade a de baixo
 *     aparece através e a leitura de cobertura se perde;
 *  4. a ordem do documento faz o resto: a seção seguinte pinta por cima da
 *     anterior sem nenhum z-index declarado.
 *
 * ── Sem biblioteca ───────────────────────────────────────────────────────
 *
 * Nenhum listener de scroll, nenhum scroll-jacking. Bibliotecas do gênero
 * sequestram a rolagem, quebram o scroll do teclado e da barra lateral, e
 * custam caro em INP — um dos Core Web Vitals que o trabalho de SEO deste site
 * protege. Com sticky, a rolagem continua sendo a do navegador e o trabalho é
 * do compositor.
 *
 * Sob `prefers-reduced-motion` não há nada a desligar: o único movimento é o da
 * própria rolagem, que o usuário controla. E onde `sticky` não funcionar, as
 * seções simplesmente se sucedem na vertical — o conteúdo continua inteiro.
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
    titulo: "A mesma rota, agora com fronteira.",
    corpo: "O que uma ferramenta de geração entrega funciona na demonstração. O que falta nela é autorização, isolamento entre clientes e uma fronteira entre rota e dados — e é isso que decide se o sistema aguenta o primeiro cliente grande.",
    visual: <CodeDiff />,
  },
  {
    indice: "02",
    rotulo: "FinOps",
    titulo: "A conta para de crescer sozinha.",
    corpo: "Custo de nuvem raramente se resolve na fatura. Ele é definido no acoplamento, no modelo de dados e no que roda de forma síncrona sem precisar. Corrigida a arquitetura, a curva muda de inclinação em vez de continuar subindo.",
    visual: (
      <ChartPanel titulo="CUSTO DE INFRAESTRUTURA · ÍNDICE" destaque="BASE 100">
        <CostChart />
      </ChartPanel>
    ),
  },
  {
    indice: "03",
    rotulo: "Performance",
    titulo: "O sistema responde sob carga.",
    corpo: "Cache, filas e processamento assíncrono deixam de ser otimização pontual e viram parte do desenho. A latência de cauda, que é a que o cliente sente, deixa de depender do dia.",
    visual: (
      <ChartPanel titulo="LATÊNCIA p95" destaque="ms">
        <LatencyChart />
      </ChartPanel>
    ),
  },
  {
    indice: "04",
    rotulo: "Confiabilidade",
    titulo: "A operação para de apagar incêndio.",
    corpo: "Disponibilidade não vem de esperança, vem de instrumentação. Com o sistema observável, o incidente deixa de ser descoberto pelo cliente e passa a ser detectado, diagnosticado e recuperado.",
    visual: (
      <ChartPanel titulo="INCIDENTES POR MÊS" destaque="12 MESES">
        <ReliabilityChart />
      </ChartPanel>
    ),
  },
];

export function ScrollStack() {
  return (
    <section aria-labelledby="pilha-titulo">
      {/* Abertura, ainda no ritmo normal da página. */}
      <div className="shell py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="mono-label text-primary-soft">Como a mudança aparece</span>
          <h2 id="pilha-titulo" className="mt-4 text-3xl md:text-[2.6rem]">
            Quatro formas de olhar
            <span className="text-gradient"> para a mesma decisão.</span>
          </h2>
          <p className="mt-5 text-fg-soft md:text-lg">
            Uma decisão de arquitetura não se justifica sozinha. Ela precisa aparecer no
            código, na conta do mês, no tempo de resposta e no sono de quem opera.
          </p>
        </div>
      </div>

      {ETAPAS.map((etapa) => (
        <div
          key={etapa.indice}
          // `sticky top-0` em TODAS, no mesmo topo: é o que faz uma cobrir a
          // outra em vez de escalonar. A altura de tela dá a cada uma o tempo
          // de rolagem que ela precisa antes de ser coberta.
          className="sticky top-0 min-h-svh border-t border-border bg-bg"
        >
          {/* Fio de luz na borda superior. Marca a chegada de cada folha, que
              sobre fundo escuro seria uma transição quase invisível. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in oklab, var(--color-primary) 55%, transparent) 30%, color-mix(in oklab, var(--color-nebula) 45%, transparent) 60%, transparent)",
            }}
          />

          {/* Só o padding do topo, e `items-center` faz o resto: com padding
              assimétrico (py-20 mais um pt maior) os dois brigavam e o
              conteúdo assentava abaixo do centro, com um vão morto em cima. */}
          <div className="shell flex min-h-svh items-center pt-(--nav-h)">
            <div className="grid w-full gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.625rem] tracking-[0.16em] text-faint">
                    {etapa.indice}
                  </span>
                  <span className="mono-label text-primary-soft">{etapa.rotulo}</span>
                </div>
                <h3 className="mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)]">{etapa.titulo}</h3>
                <p className="mt-5 max-w-md text-fg-soft md:text-lg">{etapa.corpo}</p>
              </div>

              {etapa.visual}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
