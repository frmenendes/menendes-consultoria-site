/**
 * Fundo cósmico.
 *
 * A referência é a forma como o GitHub trata as páginas de produto: base quase
 * preta pontuada por faixas luminosas de lavanda. A adaptação tem um limite
 * que o original não tem, e ele define o desenho: lá as faixas claras ficam
 * sob imagens, aqui o texto é claro sobre escuro. Então a luz vive no fundo e
 * nas costuras entre seções, nunca sob corpo de texto.
 *
 * Usado na home e na /vibe-to-scale. Na segunda o tema não é só decorativo: a
 * página fala de IA e de vibe coding, e o fundo estelar é o que dá a essa
 * conversa a escala que o assunto sugere.
 *
 * Custo: gradientes, um SVG repetido e duas animações de transform. Nenhum
 * filter, nenhum blur, nenhum JavaScript. Gradiente grande é composto na GPU e
 * não repinta; a deriva anima só transform, pela mesma razão.
 *
 * Exige um ancestral `relative`, porque se posiciona sobre o wrapper da página.
 */

/**
 * Uma nebulosa.
 *
 * O posicionamento fica no elemento de fora e a deriva no de dentro, de
 * propósito: `.nebula-drift` anima `transform`, e um `-translate-x-1/2` no
 * mesmo elemento seria sobrescrito assim que a animação começasse — a nebulosa
 * saltaria meia largura no primeiro frame.
 */
function Nebula({
  className,
  color,
  strength,
  fade,
  delay,
}: {
  className: string;
  color: string;
  strength: number;
  fade: number;
  delay: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className="nebula-drift h-full w-full"
        style={{
          animationDelay: delay,
          background: `radial-gradient(ellipse at center in oklab, color-mix(in oklab, ${color} ${strength}%, transparent) 0%, transparent ${fade}%)`,
        }}
      />
    </div>
  );
}

/**
 * `fadeTop` desliga o corte no topo da camada.
 *
 * Na home o fundo começa no alto da página, onde não há nada acima para
 * costurar. Já numa página que abre com PageHero, o fundo começa no meio do
 * documento: sem esta transição, o campo de estrelas aparece de uma vez sobre a
 * borda da seção anterior e desenha a mesma linha reta que o resto do trabalho
 * está tentando eliminar.
 */
export function CosmicBackdrop({ fadeTop = false }: { fadeTop?: boolean } = {}) {
  const mask = fadeTop
    ? "linear-gradient(to bottom,transparent 0%,#000 9%,#000 84%,transparent 100%)"
    : "linear-gradient(to bottom,#000 0%,#000 84%,transparent 100%)";

  return (
    // A camada passa do fim do wrapper e some por máscara. Terminando na borda
    // exata, a transição para o rodapé virava um corte seco: medido, o fundo
    // acabava no mesmo pixel em que o rodapé começava.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-48 top-0 -z-10 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* Estrelas. Densidade baixa e já esmaecidas antes do fim, para não
          competir com o texto na parte de baixo da página. */}
      <div className="starfield absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,#000_0%,#000_55%,transparent_92%)]" />

      {/* Nebulosas. Posições, tamanhos e fases de deriva diferentes, para o
          fundo nunca repetir o mesmo desenho ao rolar nem pulsar em bloco. */}
      <Nebula
        className="-top-[10%] left-[55%] h-[70vh] w-[80vw] -translate-x-1/2"
        color="var(--color-primary)"
        strength={20}
        fade={65}
        delay="0s"
      />
      <Nebula
        className="top-[28%] -left-[15%] h-[60vh] w-[70vw]"
        color="var(--color-accent)"
        strength={16}
        fade={62}
        delay="-13s"
      />
      <Nebula
        className="top-[62%] left-[60%] h-[65vh] w-[75vw]"
        color="var(--color-nebula)"
        strength={13}
        fade={60}
        delay="-26s"
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
        // A caixa é mais alta que a faixa visível de propósito: o gradiente
        // precisa de folga para chegar a transparente antes da borda. Ver a
        // nota em `.seam-glow`.
        className="seam-glow absolute left-1/2 top-0 h-[26rem] w-[min(1400px,110vw)] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: intensity }}
      />
    </div>
  );
}
