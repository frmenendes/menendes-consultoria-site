import { jsonLd } from "@/lib/structured-data";

/**
 * Injeta um grafo JSON-LD.
 *
 * `dangerouslySetInnerHTML` é o caminho previsto para JSON-LD: o React
 * escaparia as aspas se o JSON fosse filho normal, e o resultado não seria
 * analisável. O conteúdo vem de constantes do próprio código, nunca de entrada
 * de usuário — se um dia vier, o `<` precisa ser escapado antes.
 */
export function StructuredData({ graph }: { graph: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(...graph) }}
    />
  );
}
