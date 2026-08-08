import {
  siArgo,
  siDocker,
  siGithub,
  siGooglecloud,
  siGrafana,
  siKubernetes,
  siPostgresql,
  siRedis,
  siTerraform,
} from "simple-icons";

/**
 * Faixa de tecnologias, no tratamento monocromático das faixas de logo.
 *
 * ── Sobre as marcas, que aqui não é detalhe ───────────────────────────────
 *
 * Os ícones vêm do Simple Icons, cujos ARQUIVOS são CC0. Isso resolve o
 * direito autoral do desenho, e não a marca: cada logo continua sendo marca
 * registrada de seu dono. O que torna este uso legítimo é ser nominativo —
 * dizer com quais tecnologias se trabalha, sem sugerir parceria, certificação
 * ou endosso. Por isso a faixa não usa selo de "partner", não colore nenhuma
 * marca e leva a nota de atribuição abaixo.
 *
 * A AWS aparece como wordmark em texto, e não como logo, por um motivo
 * concreto: o Simple Icons removeu a família Amazon inteira a pedido da
 * Amazon, que restringe o uso do logo a parceiros APN. Reproduzir a arte
 * assim mesmo seria assumir um risco real por um ganho estético pequeno. O
 * nome escrito é uso nominativo pacífico, e é como o resto do site já se
 * refere a ela.
 *
 * O mesmo cuidado vale para o Google Cloud, que também restringe uso de logo:
 * o ícone entra monocromático, sem qualquer sugestão de parceria.
 *
 * ── Desenho ──────────────────────────────────────────────────────────────
 *
 * Monocromático em repouso e acendendo no cursor, como nas faixas de "quem
 * usa" que servem de referência. Colorido, dez marcas diferentes brigariam
 * entre si e com a paleta do site; em uma cor só, a faixa lê como um conjunto.
 *
 * Componente de servidor: os caminhos dos ícones são resolvidos no build e
 * nada de `simple-icons` chega ao navegador.
 */

const MARCAS = [
  siKubernetes,
  siDocker,
  siTerraform,
  siArgo,
  siGooglecloud,
  siPostgresql,
  siRedis,
  siGrafana,
  siGithub,
] as const;

export function TechMarks() {
  return (
    <section aria-labelledby="tecnologias-titulo" className="py-14 md:py-16">
      <div className="shell">
        <h2
          id="tecnologias-titulo"
          className="mono-label text-center text-primary-soft"
        >
          Tecnologias com que trabalhamos
        </h2>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
          {MARCAS.map((marca) => (
            <li key={marca.title}>
              <span
                className="group flex items-center gap-3 text-fg-soft transition-colors duration-300 hover:text-fg"
                title={marca.title}
              >
                <svg
                  role="img"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 flex-none fill-current opacity-55 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <path d={marca.path} />
                </svg>
                <span className="sr-only">{marca.title}</span>
              </span>
            </li>
          ))}

          {/* AWS em texto, não em logo. Ver a nota no topo do arquivo. */}
          <li>
            <span className="font-mono text-xl font-medium tracking-[0.12em] text-fg-soft/55 transition-colors duration-300 hover:text-fg">
              AWS
            </span>
          </li>
        </ul>

        <p className="mt-10 text-center text-[0.6875rem] text-faint">
          Marcas de seus respectivos titulares. A menção indica as tecnologias
          utilizadas nos projetos, não parceria, certificação ou endosso.
        </p>
      </div>
    </section>
  );
}
