"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Topologia abstrata da hero.
 *
 * Representa uma arquitetura sendo construída: borda, aplicações, API, núcleo,
 * dados, eventos, observabilidade e segurança. Não é decoração aleatória, cada
 * nó tem um papel e as arestas são as dependências reais entre eles.
 *
 * Decisões de performance, porque este componente fica na primeira tela:
 *  - SVG com ~16 nós, não canvas: menos código e linhas nítidas em qualquer DPI;
 *  - o loop de animação escreve direto no DOM via ref, sem re-render do React;
 *  - o rAF só roda quando o elemento está visível e o documento em foco;
 *  - sob reduced motion o diagrama renderiza estático, no estado final.
 */

type Role = "edge" | "app" | "core" | "data" | "observability" | "security";

type Node = {
  id: string;
  label: string;
  x: number; // percentual do viewBox
  y: number;
  role: Role;
  /** Ordem de entrada: a arquitetura se monta de fora para dentro. */
  step: number;
};

const NODES: readonly Node[] = [
  { id: "edge", label: "Edge", x: 8, y: 50, role: "edge", step: 0 },
  { id: "web", label: "Web", x: 22, y: 26, role: "app", step: 1 },
  { id: "mobile", label: "Mobile", x: 22, y: 74, role: "app", step: 1 },
  { id: "api", label: "API", x: 38, y: 50, role: "core", step: 2 },
  { id: "authz", label: "AuthZ", x: 38, y: 20, role: "security", step: 3 },
  { id: "core", label: "Core", x: 54, y: 50, role: "core", step: 3 },
  { id: "queue", label: "Queue", x: 54, y: 78, role: "core", step: 4 },
  { id: "cache", label: "Cache", x: 68, y: 28, role: "data", step: 4 },
  { id: "db", label: "DB", x: 72, y: 54, role: "data", step: 4 },
  { id: "replica", label: "Replica", x: 86, y: 68, role: "data", step: 6 },
  { id: "worker", label: "Worker", x: 68, y: 88, role: "core", step: 5 },
  { id: "integr", label: "Integr", x: 86, y: 88, role: "core", step: 6 },
  { id: "otel", label: "Traces", x: 52, y: 8, role: "observability", step: 5 },
  { id: "metrics", label: "Metrics", x: 72, y: 8, role: "observability", step: 6 },
  { id: "waf", label: "WAF", x: 8, y: 22, role: "security", step: 2 },
  { id: "secrets", label: "Secrets", x: 8, y: 78, role: "security", step: 5 },
];

/** [origem, destino, é caminho quente]. Caminho quente recebe pulso de tráfego. */
const EDGES: readonly [string, string, boolean][] = [
  ["edge", "web", true],
  ["edge", "mobile", true],
  ["waf", "edge", false],
  ["web", "api", true],
  ["mobile", "api", true],
  ["api", "authz", false],
  ["api", "core", true],
  ["core", "cache", true],
  ["core", "db", true],
  ["core", "queue", true],
  ["queue", "worker", true],
  ["worker", "integr", false],
  ["db", "replica", false],
  ["core", "otel", false],
  ["api", "otel", false],
  ["db", "metrics", false],
  ["secrets", "api", false],
];

const ROLE_COLOR: Record<Role, string> = {
  edge: "var(--color-primary)",
  app: "var(--color-primary-soft)",
  core: "var(--color-fg-soft)",
  data: "var(--color-accent)",
  observability: "var(--color-signal)",
  security: "var(--color-warning)",
};

const byId = new Map(NODES.map((node) => [node.id, node]));
const MAX_STEP = Math.max(...NODES.map((node) => node.step));

/**
 * O viewBox é largo (200x100) porque o grafo é horizontal: entra pela borda à
 * esquerda e termina em dados e integrações à direita.
 *
 * O `preserveAspectRatio` é `meet`, não `slice`: com `slice` o SVG cobre a área
 * e corta o que não cabe, o que deixava metade dos nós fora da tela e fazia as
 * legendas restantes parecerem palavras soltas. Com `meet` o grafo inteiro cabe
 * e volta a ser lido como uma arquitetura conectada.
 *
 * As coordenadas continuam sendo percentuais, e `sx` faz a conversão.
 */
const VIEW_W = 200;
const VIEW_H = 100;
const sx = (x: number) => (x / 100) * VIEW_W;

export function SystemTopology() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  /** Um <g> externo por nó, usado só pelo parallax. */
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const [built, setBuilt] = useState(-1);
  const [active, setActive] = useState(false);

  /** Sob reduced motion o diagrama já nasce completo, sem passar pela montagem. */
  const step = reduced ? MAX_STEP : built;

  // Só ativa quando entra em viewport: nada roda fora da tela.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => setActive(entries[0]?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Construção progressiva da arquitetura.
  useEffect(() => {
    if (reduced || !active) return;

    let current = -1;
    const timer = window.setInterval(() => {
      current += 1;
      setBuilt(current);
      if (current >= MAX_STEP) window.clearInterval(timer);
    }, 260);

    return () => window.clearInterval(timer);
  }, [active, reduced]);

  // Parallax de ponteiro. Escreve transform direto no <g>, sem passar pelo React.
  useEffect(() => {
    if (reduced || !active) return;
    const element = rootRef.current;
    if (!element) return;

    // Ponteiro grosseiro (toque) não tem hover: não vale o custo do listener.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Fator de profundidade por nó, espalhado pela razão áurea para os nós não
    // derivarem em uníssono. Entre 0.03 e 0.13, o que dá de 0,3 a 1,3 unidade
    // de deslocamento no pico.
    const nodeLayers: [SVGGElement, number][] = [];
    nodeRefs.current.forEach((nó, id) => {
      const i = NODES.findIndex((n) => n.id === id);
      nodeLayers.push([nó, 0.03 + (((i < 0 ? 0 : i) * 0.618) % 1) * 0.1]);
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      // A unidade aqui é a do viewBox, não pixel: `transform` em SVG opera no
      // espaço do usuário. Numa largura de 200, o valor antigo (20) deslocava
      // 5% do desenho inteiro — daí a sensação de o grafo escorregar em bloco.
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      // Cada nó recebe o próprio deslocamento, e não o grafo inteiro. O fator
      // é pequeno e varia por nó: eles derivam em profundidades diferentes,
      // como pontos a distâncias distintas, em vez de escorregarem juntos.
      // As arestas ficam paradas — com amplitude abaixo de 1,3 unidade num
      // viewBox de 200 a desconexão é imperceptível, e é o que preserva a
      // leitura de grafo.
      for (const [nó, fator] of nodeLayers) {
        nó.style.transform = `translate3d(${(currentX * fator).toFixed(3)}px, ${(currentY * fator).toFixed(3)}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      for (const [nó] of nodeLayers) nó.style.transform = "";
    };
  }, [active, reduced]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto absolute inset-0 select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <radialGradient id="topology-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={sx(50)} cy="50" rx={sx(48)} ry="46" fill="url(#topology-glow)" />

        <g ref={layerRef}>
          {EDGES.map(([fromId, toId, hot]) => {
            const from = byId.get(fromId);
            const to = byId.get(toId);
            if (!from || !to) return null;

            const visible = step >= Math.max(from.step, to.step);
            const length = Math.hypot(sx(to.x) - sx(from.x), to.y - from.y);

            return (
              <g key={`${fromId}-${toId}`}>
                <line
                  x1={sx(from.x)}
                  y1={from.y}
                  x2={sx(to.x)}
                  y2={to.y}
                  stroke={hot ? "var(--color-primary)" : "var(--color-border-strong)"}
                  strokeWidth={hot ? 0.28 : 0.2}
                  strokeOpacity={visible ? (hot ? 0.7 : 0.5) : 0}
                  strokeDasharray={length}
                  strokeDashoffset={visible ? 0 : length}
                  style={{
                    transition: reduced
                      ? "none"
                      : "stroke-dashoffset 700ms var(--ease-out-expo), stroke-opacity 500ms linear",
                  }}
                />
                {/* Pulso de tráfego apenas no caminho quente e só depois que a
                    aresta terminou de desenhar. */}
                {hot && visible && !reduced ? (
                  <circle r="0.5" fill="var(--color-primary-soft)">
                    <animateMotion
                      dur={`${2.6 + length / 40}s`}
                      repeatCount="indefinite"
                      path={`M${sx(from.x)},${from.y} L${sx(to.x)},${to.y}`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.9;0.9;0"
                      dur={`${2.6 + length / 40}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ) : null}
              </g>
            );
          })}

          {NODES.map((node) => {
            const visible = step >= node.step;
            const color = ROLE_COLOR[node.role];
            const cx = sx(node.x);
            return (
              // Duas camadas de propósito: a de fora é do parallax, a de dentro
              // é da entrada em escala. Num elemento só, o rAF do parallax
              // sobrescreveria o `transform` da animação de entrada a cada
              // frame e o nó nunca terminaria de aparecer.
              <g
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                style={{ willChange: "transform" }}
              >
              <g
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "scale(1)" : "scale(0.4)",
                  transformOrigin: `${cx}px ${node.y}px`,
                  transition: reduced
                    ? "none"
                    : "opacity 500ms linear, transform 600ms var(--ease-out-expo)",
                }}
              >
                <circle cx={cx} cy={node.y} r="2.2" fill={color} fillOpacity="0.12" />
                <circle
                  cx={cx}
                  cy={node.y}
                  r="0.9"
                  fill={color}
                  stroke={color}
                  strokeWidth="0.2"
                  strokeOpacity="0.5"
                />
                <text
                  x={cx}
                  y={node.y - 3.6}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  fontSize="2.9"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.1"
                >
                  {node.label}
                </text>
              </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
