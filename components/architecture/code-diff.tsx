import { PanelFrame } from "@/components/architecture/chart-panel";

/**
 * Diff de código: o argumento da MENENDES em oito linhas.
 *
 * É o mesmo endpoint antes e depois, e a diferença entre os dois é literalmente
 * o que a empresa vende. O trecho removido não é ruim por desleixo — é o que
 * qualquer ferramenta de geração entrega, e funciona na demonstração. O que
 * falta nele é autorização, isolamento entre clientes e uma fronteira entre
 * rota e dados.
 *
 * Usa a mesma moldura dos gráficos, e não uma própria: os três painéis da pilha
 * precisam ser idênticos por fora, senão a sobreposição desalinha.
 *
 * Em CSS, sem estado e sem JavaScript. As linhas entram escalonadas na ordem do
 * diff e param. Nada em laço: isto fica ao lado de corpo de texto, e movimento
 * perpétuo ali disputa atenção com a leitura.
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
    <PanelFrame
      titulo="routes/orders.ts"
      destaque={
        <span className="flex items-center gap-2">
          <span className="text-danger/70">−3</span>
          <span className="text-success/80">+3</span>
        </span>
      }
    >
      <pre className="h-full overflow-auto px-4 py-3" aria-hidden="true">
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
    </PanelFrame>
  );
}
