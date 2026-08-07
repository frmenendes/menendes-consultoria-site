import { CodeDiff } from "@/components/architecture/code-diff";
import {
  ChartPanel,
  CostChart,
  LatencyChart,
  ReliabilityChart,
} from "@/components/architecture/chart-panel";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * Painéis que se sobrepõem durante a rolagem.
 *
 * A referência é a home do GitHub: cada bloco gruda no topo e o seguinte sobe
 * por cima dele, de modo que a narrativa se empilha em vez de simplesmente
 * passar. Os quatro painéis contam a mesma história em quatro linguagens —
 * código, custo, latência e incidentes —, que é a sequência que a MENENDES
 * vende: a arquitetura muda, a conta muda, o sistema responde, e a operação
 * para de acordar de madrugada.
 *
 * ── Como funciona, e por que não tem biblioteca de scroll ─────────────────
 *
 * `position: sticky` e nada mais. Cada painel gruda a uma distância do topo
 * ligeiramente maior que a do anterior, então quando o segundo alcança o
 * primeiro ele para logo abaixo — é essa diferença que produz a pilha visível
 * de bordas, em vez de um painel tapando o outro por completo.
 *
 * Sem scroll-jacking, e isso é deliberado: bibliotecas do gênero sequestram a
 * rolagem, quebram o scroll do teclado e da barra lateral, e custam caro em
 * INP, que é um dos Core Web Vitals que o trabalho de SEO deste site protege.
 * Com sticky, a rolagem continua sendo a do navegador, e o trabalho é do
 * compositor. Não há um único listener de scroll nesta seção.
 *
 * Sob `prefers-reduced-motion` não há nada a desligar: o único movimento é o da
 * própria rolagem, que o usuário controla.
 *
 * ── Espaçamento ───────────────────────────────────────────────────────────
 *
 * A seção usa `Section` e `SectionHeading`, os mesmos primitivos do resto da
 * home, em vez de paddings próprios. A versão anterior repetia os valores à
 * mão, e valor repetido à mão é valor que sai do lugar na primeira mudança de
 * ritmo do site.
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
    <Section>
      <div className="shell">
        <SectionHeading
          label="Como a mudança aparece"
          title="Quatro formas de olhar"
          accent="para a mesma decisão."
          body="Uma decisão de arquitetura não se justifica sozinha. Ela precisa aparecer no código, na conta do mês, no tempo de resposta e no sono de quem opera."
        />

        {/* A pilha. Cada painel gruda um pouco abaixo do anterior, e é essa
            diferença que deixa a borda do de baixo à mostra. */}
        <div className="mt-14 flex flex-col gap-6">
          {ETAPAS.map((etapa, index) => (
            <article
              key={etapa.indice}
              className="edge sticky overflow-hidden rounded-panel border border-border bg-surface/90 backdrop-blur-sm"
              style={{
                // Em rem para acompanhar o zoom, e somado à altura da barra
                // fixa para o painel não grudar atrás dela.
                top: `calc(var(--nav-h) + ${1.25 + index * 0.7}rem)`,
                // Sem z-index: na ordem do documento o painel seguinte já pinta
                // por cima do anterior, que é o empilhamento desejado.
              }}
            >
              <div className="grid gap-8 p-7 md:p-9 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-12">
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
    </Section>
  );
}
