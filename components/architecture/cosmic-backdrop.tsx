/**
 * Fundo cósmico da home.
 *
 * A referência é a forma como o GitHub trata as páginas de produto: base quase
 * preta pontuada por faixas luminosas de lavanda. A adaptação tem um limite
 * que o original não tem, e ele define o desenho: lá as faixas claras ficam
 * sob imagens, aqui o texto é claro sobre escuro. Então a luz vive no fundo e
 * nas costuras entre seções, nunca sob corpo de texto.
 *
 * Custo: só gradientes e um SVG repetido. Nenhum filter, nenhum blur, nenhum
 * JavaScript. Gradiente grande é composto na GPU e não repinta.
 */
export function CosmicBackdrop() {
  return (
    // A camada passa do fim do wrapper e some por máscara. Terminando na borda
    // exata, a transição para o rodapé virava um corte seco: medido, o fundo
    // acabava no mesmo pixel em que o rodapé começava.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-48 top-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_84%,transparent_100%)]"
    >
      {/* Estrelas. Densidade baixa e já esmaecidas antes do fim, para não
          competir com o texto na parte de baixo da página. */}
      <div className="starfield absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,#000_0%,#000_55%,transparent_92%)]" />

      {/* Nebulosas. Posições e tamanhos diferentes para o fundo nunca repetir
          o mesmo desenho ao rolar. */}
      <div
        className="absolute -top-[10%] left-[55%] h-[70vh] w-[80vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-primary) 20%, transparent) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[28%] -left-[15%] h-[60vh] w-[70vw]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 16%, transparent) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute top-[62%] left-[60%] h-[65vh] w-[75vw]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-nebula) 13%, transparent) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

/**
 * Costura luminosa entre duas seções.
 *
 * É a faixa clara que dá a leitura de nebulosa. Fica no respiro entre blocos,
 * onde não há texto por cima, e por isso pode ser realmente clara sem custar
 * legibilidade.
 */
export function SeamGlow({ intensity = 1 }: { intensity?: number }) {
  return (
    <div aria-hidden="true" className="relative h-0">
      <div
        className="seam-glow absolute left-1/2 top-0 h-56 w-[min(1400px,110vw)] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: intensity }}
      />
    </div>
  );
}
