"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Gráficos da simulação.
 *
 * ── Paleta ────────────────────────────────────────────────────────────────
 *
 * Azul da marca e âmbar, e não o par vermelho/verde que o olho pediria. O par
 * vermelho/verde foi medido e reprovou: no único verde que cabia na faixa de
 * luminosidade, a separação em deuteranopia era ΔE 4,6 — ou seja, invisível
 * para quem tem a forma mais comum de daltonismo. O par abaixo passou nas seis
 * checagens sobre a superfície escura do site:
 *
 *   #3d7bff  ·  #cf7d1c
 *   luminosidade dentro da faixa · croma ok · CVD ΔE 31,7 (protan) ·
 *   visão normal ΔE 34,8 · contraste >= 3:1
 *
 * A identidade nunca depende só da cor: cada série tem legenda, e a projeção
 * ainda é tracejada contra a linha cheia do real. Quem não distingue as cores
 * distingue o traço.
 *
 * ── Honestidade dos números ───────────────────────────────────────────────
 *
 * O eixo de custo é ÍNDICE com base 100, não reais. Publicar valores absolutos
 * seria inventar a fatura de um cliente. O que se afirma é a forma da curva —
 * a inclinação muda depois da decisão de arquitetura —, e é só isso que o
 * gráfico mostra.
 *
 * Um eixo por gráfico, sempre. Custo e incidentes são grandezas diferentes e
 * por isso são dois gráficos, nunca dois eixos y no mesmo desenho.
 */

/** Superfície e tinta, lidas dos tokens para não fixar hex nos componentes. */
const TINTA = {
  serie: "#3d7bff",
  projecao: "#cf7d1c",
  grade: "var(--color-border-soft)",
  eixo: "var(--color-faint)",
  superficie: "var(--color-surface-2)",
  borda: "var(--color-border-strong)",
};

/**
 * Eixos.
 *
 * `width` no eixo Y é dimensionado para o maior rótulo de cada gráfico, e a
 * margem esquerda é zero. A primeira versão usava margem negativa para ganhar
 * área de desenho e cortava os números pela metade — "12" aparecia como "2".
 * Área de plotagem não vale um eixo ilegível.
 */
const EIXO = {
  stroke: "transparent",
  tick: { fill: "var(--color-faint)", fontSize: 9, fontFamily: "var(--font-mono)" },
  tickLine: false,
  axisLine: false,
};

/** Tooltip no vocabulário do site, em vez do padrão branco do Recharts. */
function Dica({
  active,
  payload,
  label,
  sufixo = "",
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string | number;
  sufixo?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-2 shadow-xl shadow-black/50">
      <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-faint">{label}</p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((item) => (
          <li key={item.dataKey} className="flex items-center gap-2 text-[0.6875rem]">
            <span
              className="h-1.5 w-1.5 flex-none rounded-[1px]"
              style={{ background: item.color }}
            />
            <span className="text-fg-soft">{item.name}</span>
            <span className="ml-auto font-mono text-fg">
              {item.value}
              {sufixo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const legendaProps = {
  iconType: "square" as const,
  iconSize: 7,
  wrapperStyle: {
    fontSize: "0.625rem",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.08em",
    color: "var(--color-muted)",
    paddingTop: 8,
  },
};

/* ────────────────────────── custo ────────────────────────── */

/**
 * Doze meses. A decisão acontece no mês 6: até ali as duas séries são a mesma
 * história, e é por isso que a projeção só se separa depois — antes da decisão
 * não havia nada a projetar.
 */
const CUSTO = [
  { mes: "JAN", real: 100, projecao: 100 },
  { mes: "FEV", real: 108, projecao: 108 },
  { mes: "MAR", real: 119, projecao: 119 },
  { mes: "ABR", real: 131, projecao: 131 },
  { mes: "MAI", real: 142, projecao: 142 },
  { mes: "JUN", real: 156, projecao: 156 },
  { mes: "JUL", real: 143, projecao: 171 },
  { mes: "AGO", real: 124, projecao: 188 },
  { mes: "SET", real: 109, projecao: 206 },
  { mes: "OUT", real: 98, projecao: 224 },
  { mes: "NOV", real: 93, projecao: 243 },
  { mes: "DEZ", real: 92, projecao: 264 },
];

export function CostChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={CUSTO} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={TINTA.grade} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="mes" {...EIXO} interval={1} />
        <YAxis {...EIXO} width={34} domain={[80, 280]} tickCount={5} />

        {/* A decisão é o assunto do gráfico, então é o único ponto anotado. */}
        <ReferenceLine
          x="JUN"
          stroke={TINTA.serie}
          strokeOpacity={0.5}
          strokeDasharray="3 3"
          label={{
            value: "DECISÃO",
            position: "insideTopLeft",
            fill: "var(--color-primary-soft)",
            fontSize: 8,
            fontFamily: "var(--font-mono)",
            letterSpacing: 1,
            offset: 8,
          }}
        />

        <Tooltip
          content={<Dica />}
          cursor={{ stroke: TINTA.borda, strokeDasharray: "3 3" }}
        />
        <Legend {...legendaProps} />

        {/* Tracejada: é projeção, e projeção não pode ser desenhada como fato. */}
        <Line
          type="monotone"
          dataKey="projecao"
          name="Sem intervenção"
          stroke={TINTA.projecao}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--color-surface)" }}
          animationDuration={1400}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="real"
          name="Com arquitetura revista"
          stroke={TINTA.serie}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--color-surface)" }}
          animationDuration={1400}
          animationBegin={200}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────── confiabilidade ─────────────────────── */

const INCIDENTES = [
  { mes: "JAN", n: 9 },
  { mes: "FEV", n: 7 },
  { mes: "MAR", n: 11 },
  { mes: "ABR", n: 8 },
  { mes: "MAI", n: 10 },
  { mes: "JUN", n: 9 },
  { mes: "JUL", n: 6 },
  { mes: "AGO", n: 4 },
  { mes: "SET", n: 3 },
  { mes: "OUT", n: 2 },
  { mes: "NOV", n: 2 },
  { mes: "DEZ", n: 1 },
];

/**
 * Série única, então sem legenda: o título do painel já nomeia a métrica, e uma
 * caixa de legenda para uma cor só é ruído. O regime "depois" é marcado por
 * área de referência, não por uma segunda cor — a cor segue a entidade, e a
 * entidade aqui é a mesma o tempo todo.
 */
export function ReliabilityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={INCIDENTES} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={TINTA.grade} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="mes" {...EIXO} interval={1} />
        <YAxis {...EIXO} width={26} allowDecimals={false} domain={[0, 12]} tickCount={5} />

        {/* Linha, e não área sombreada. A `ReferenceArea` foi tentada primeiro
            e não renderizava com o domínio do eixo Y fixado — sumia sem erro no
            console, o que é pior que falhar alto. A linha é o mesmo recurso já
            usado nos outros dois gráficos desta seção, e é consistente: em
            todos, o momento da decisão é marcado do mesmo jeito. */}
        <ReferenceLine
          x="JUN"
          stroke={TINTA.serie}
          strokeOpacity={0.5}
          strokeDasharray="3 3"
          label={{
            value: "OBSERVABILIDADE ATIVA",
            // `insideTopLeft` alinha o texto à ESQUERDA a partir da linha, ou
            // seja, ele cai à direita dela — que é o período que o rótulo
            // descreve. Com `insideTopRight` o texto terminava na linha e
            // parecia rotular os meses anteriores, o contrário do que se diz.
            position: "insideTopLeft",
            fill: "var(--color-primary-soft)",
            fontSize: 8,
            fontFamily: "var(--font-mono)",
            letterSpacing: 1,
            offset: 8,
          }}
        />

        <Tooltip
          content={<Dica />}
          cursor={{ fill: "var(--color-surface-3)", fillOpacity: 0.5 }}
        />

        {/* Topo arredondado e um respiro entre as barras: especificação de
            marca do design system, não enfeite. */}
        <Bar
          dataKey="n"
          name="Incidentes"
          fill={TINTA.serie}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
          animationDuration={1100}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────── latência ─────────────────────── */

const LATENCIA = [
  { mes: "JAN", p95: 840 },
  { mes: "FEV", p95: 910 },
  { mes: "MAR", p95: 1180 },
  { mes: "ABR", p95: 1020 },
  { mes: "MAI", p95: 1340 },
  { mes: "JUN", p95: 1210 },
  { mes: "JUL", p95: 720 },
  { mes: "AGO", p95: 480 },
  { mes: "SET", p95: 390 },
  { mes: "OUT", p95: 340 },
  { mes: "NOV", p95: 310 },
  { mes: "DEZ", p95: 295 },
];

export function LatencyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={LATENCIA} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="grad-latencia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TINTA.serie} stopOpacity={0.35} />
            <stop offset="100%" stopColor={TINTA.serie} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={TINTA.grade} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="mes" {...EIXO} interval={1} />
        <YAxis {...EIXO} width={38} tickCount={5} />

        <ReferenceLine
          y={400}
          stroke={TINTA.projecao}
          strokeDasharray="4 4"
          strokeOpacity={0.8}
          label={{
            value: "ALVO 400ms",
            position: "insideBottomRight",
            fill: TINTA.projecao,
            fontSize: 8,
            fontFamily: "var(--font-mono)",
            letterSpacing: 1,
          }}
        />

        <Tooltip
          content={<Dica sufixo="ms" />}
          cursor={{ stroke: TINTA.borda, strokeDasharray: "3 3" }}
        />

        <Area
          type="monotone"
          dataKey="p95"
          name="Latência p95"
          stroke={TINTA.serie}
          strokeWidth={2}
          fill="url(#grad-latencia)"
          activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--color-surface)" }}
          animationDuration={1300}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
