import type { ComponentType } from "react";
import CustoDeNuvem from "./custo-de-nuvem-e-decisao-de-arquitetura.mdx";
import QuebraPrimeiro from "./o-que-quebra-primeiro-num-app-gerado-por-ia.mdx";
import ObservabilidadeAntesDaEscala from "./observabilidade-antes-da-escala.mdx";

/**
 * Mapa de slug para o corpo em MDX.
 *
 * Import estático de propósito. Com `await import()` dentro do componente, o
 * bundler cria um chunk assíncrono que acaba avaliando biblioteca de cliente no
 * passo de SSR e quebra o prerender. Como todos os artigos são gerados em build,
 * importar os três de uma vez não custa nada em runtime nem no bundle do
 * cliente.
 *
 * Ao adicionar um artigo: criar o .mdx, importar aqui e registrar em
 * `lib/insights.ts`.
 */
export const INSIGHT_BODIES: Record<string, ComponentType> = {
  "custo-de-nuvem-e-decisao-de-arquitetura": CustoDeNuvem,
  "o-que-quebra-primeiro-num-app-gerado-por-ia": QuebraPrimeiro,
  "observabilidade-antes-da-escala": ObservabilidadeAntesDaEscala,
};
