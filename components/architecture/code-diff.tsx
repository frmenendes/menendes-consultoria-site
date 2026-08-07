/**
 * Diff de código: o argumento da MENENDES em oito linhas.
 *
 * Existe por composição e por conteúdo, nesta ordem.
 *
 * Composição: medida a hero em 1920px, a coluna de texto tinha 679px de altura
 * e a da topologia, 304px. Sobrava um bloco morto de 608x250px à direita, e o
 * desequilíbrio entre as colunas era o que dava a sensação de vazio. Este
 * painel ocupa exatamente esse bloco.
 *
 * Conteúdo: é o mesmo código antes e depois, e a diferença entre os dois é
 * literalmente o que a empresa vende. O trecho removido não é ruim por
 * desleixo — é o que qualquer ferramenta de geração entrega, e funciona na
 * demonstração. O que falta nele é autorização, isolamento entre clientes e
 * uma fronteira entre rota e dados. Ou seja: o texto ao lado fala de
 * arquitetura em abstrato, e aqui a mesma frase aparece em código.
 *
 * Tudo em CSS, sem estado e sem JavaScript, como o resto das animações do
 * site. As linhas entram escalonadas, na ordem do diff, e param. Nada em laço:
 * isto fica ao lado de corpo de texto, e movimento perpétuo ali disputa
 * atenção com a leitura.
 */

type Linha = { tipo: "remove" | "add" | "contexto"; texto: string };

const LINHAS: readonly Linha[] = [
  { tipo: "contexto", texto: "// listagem de pedidos" },
  { tipo: "remove", texto: "app.get('/orders', async (req, res) => {" },
  { tipo: "remove", texto: "  const r = await db.query('SELECT * FROM orders')" },
  { tipo: "remove", texto: "  res.json(r)" },
  { tipo: "add", texto: "router.get('/orders', requireAuth, async (req, res) => {" },
  { tipo: "add", texto: "  const pedidos = await orders.listByTenant(req.tenantId)" },
  { tipo: "add", texto: "  res.json(serialize(pedidos))" },
  { tipo: "contexto", texto: "})" },
];

const ESTILO: Record<Linha["tipo"], string> = {
  remove:
    "text-danger/85 before:content-['-'] before:mr-2 before:text-danger/60 bg-danger/[0.06]",
  add: "text-success/90 before:content-['+'] before:mr-2 before:text-success/60 bg-success/[0.06]",
  // O espaço em branco antes do conteúdo mantém as linhas de contexto
  // alinhadas com as demais, que carregam o sinal de - ou +.
  contexto: "text-faint before:content-['\\00a0'] before:mr-2",
};

export function CodeDiff() {
  return (
    <div
      aria-hidden="true"
      className="edge overflow-hidden rounded-card border border-border bg-surface/60"
    >
      <div className="flex items-center justify-between border-b border-border-soft px-4 py-2.5">
        <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
          routes/orders.ts
        </span>
        <span className="flex items-center gap-2 font-mono text-[0.5625rem] tracking-[0.16em]">
          <span className="text-danger/70">−3</span>
          <span className="text-success/80">+3</span>
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-3">
        <code className="block font-mono text-[0.625rem] leading-[1.9]">
          {LINHAS.map((linha, index) => (
            <span
              key={linha.texto}
              className={`reveal-on-load -mx-2 block whitespace-pre rounded px-2 ${ESTILO[linha.tipo]}`}
              // Escalonamento curto: o diff precisa ler como uma coisa só que
              // se resolve, não como oito animações independentes.
              style={{ animationDelay: `${0.45 + index * 0.07}s` }}
            >
              {linha.texto}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * Curva de custo. SVG estático desenhado à mão, sem biblioteca de gráfico.
 *
 * Os números são ilustrativos e não estão rotulados com valores absolutos de
 * propósito: seria inventar métrica de cliente. O que a forma comunica é o que
 * de fato se afirma — a inclinação muda depois da decisão de arquitetura, e não
 * no dia em que alguém foi mexer na fatura.
 */
export function CostChart() {
  return (
    <div
      aria-hidden="true"
      className="edge overflow-hidden rounded-card border border-border bg-surface/60"
    >
      <div className="flex items-center justify-between border-b border-border-soft px-4 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
        <span>CUSTO DE INFRAESTRUTURA / MÊS</span>
        <span className="text-success/80">−41%</span>
      </div>

      <svg viewBox="0 0 320 140" className="w-full" role="presentation">
        {/* Grade. Fica atrás e bem apagada: referência de leitura, não desenho. */}
        {[0, 1, 2, 3].map((linha) => (
          <line
            key={linha}
            x1="0"
            x2="320"
            y1={20 + linha * 30}
            y2={20 + linha * 30}
            stroke="var(--color-border-soft)"
            strokeWidth="1"
          />
        ))}

        {/* Trajetória sem intervenção: continua subindo. Tracejada porque é
            projeção, e projeção não pode ser desenhada como fato. */}
        <path
          d="M8 116 L80 96 L152 70 L224 40 L312 14"
          fill="none"
          stroke="var(--color-danger)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Trajetória real: acompanha a projeção até a decisão e então dobra. */}
        <path
          d="M8 116 L80 96 L152 70 L224 78 L312 88"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* O ponto de inflexão é o assunto do gráfico, então é o único
            marcado. */}
        <circle cx="152" cy="70" r="3.5" fill="var(--color-primary)" />
        <line
          x1="152"
          y1="70"
          x2="152"
          y2="132"
          stroke="var(--color-primary)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="152"
          y="138"
          textAnchor="middle"
          fill="var(--color-primary-soft)"
          fontSize="7"
          fontFamily="var(--font-mono)"
          letterSpacing="1"
        >
          DECISÃO
        </text>
      </svg>
    </div>
  );
}

/**
 * Confiabilidade antes e depois.
 *
 * Duas séries de barras, e não uma curva: incidente é evento discreto, contado
 * por período, e desenhar isso como linha contínua sugeriria uma medição que
 * não existe.
 */
const INCIDENTES_ANTES = [7, 9, 6, 11, 8, 10] as const;
const INCIDENTES_DEPOIS = [3, 2, 3, 1, 2, 1] as const;

export function ReliabilityChart() {
  const maximo = Math.max(...INCIDENTES_ANTES);

  return (
    <div
      aria-hidden="true"
      className="edge overflow-hidden rounded-card border border-border bg-surface/60"
    >
      <div className="flex items-center justify-between border-b border-border-soft px-4 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-faint">
        <span>INCIDENTES POR MÊS</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-[1px] bg-danger/60" />
            ANTES
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-[1px] bg-success" />
            DEPOIS
          </span>
        </span>
      </div>

      <div className="flex h-[140px] items-end gap-3 px-4 py-4">
        {INCIDENTES_ANTES.map((antes, index) => {
          const depois = INCIDENTES_DEPOIS[index] ?? 0;
          return (
            // `h-full` é obrigatório, não estilo: a altura das barras é
            // percentual, e porcentagem só resolve contra uma altura definida.
            // Sem ele este contêiner fica com altura automática e as barras
            // renderizam com zero pixel — o gráfico aparecia vazio.
            <div key={index} className="flex h-full flex-1 items-end justify-center gap-1">
              <span
                className="w-full rounded-t-[2px] bg-danger/35"
                style={{ height: `${(antes / maximo) * 100}%` }}
              />
              <span
                className="w-full rounded-t-[2px] bg-success/70"
                style={{ height: `${(depois / maximo) * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
