import type { MDXComponents } from "mdx/types";

/**
 * Mapeamento de elementos do MDX.
 *
 * Precisa existir na raiz do projeto: sem ele, o @next/mdx resolve o provider
 * para `@mdx-js/react`, que cria um contexto do React e por isso não pode ser
 * avaliado em componente de servidor. O prerender quebra com
 * "createContext is not a function".
 *
 * Devolvemos os componentes como vieram. A tipografia do artigo é aplicada por
 * classe no wrapper da página, o que mantém os arquivos de conteúdo como texto
 * puro, sem marcação de estilo.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
