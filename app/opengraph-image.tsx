import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * Imagem de compartilhamento (Open Graph e Twitter).
 *
 * Gerada por `ImageResponse` em vez de ser um PNG versionado: a arte sai das
 * mesmas constantes de marca, então mudar a tagline em `lib/site.ts` atualiza
 * também o card que o LinkedIn e o WhatsApp mostram. Um PNG no `public/` ficaria
 * defasado em silêncio.
 *
 * A rota não tem parâmetro dinâmico, então o Next a pré-renderiza durante o
 * `next build` e publica o resultado como asset estático. Nada disso executa em
 * runtime no Worker.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0c10",
          // Duas nebulosas, no mesmo espírito do fundo do site. Os raios cabem
          // dentro da caixa, então não há corte duro na borda.
          backgroundImage:
            "radial-gradient(ellipse 45% 45% at 78% 12%, rgba(99,102,241,0.38), transparent 70%), radial-gradient(ellipse 40% 40% at 8% 88%, rgba(56,189,248,0.22), transparent 70%)",
          color: "#e6e9f0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 12, color: "#a5b4fc" }}>
            {SITE.name}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              letterSpacing: 4,
              color: "#7c8598",
            }}
          >
            {SITE.contact.city.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, lineHeight: 1.12, maxWidth: 900 }}>
            Tecnologia para empresas
          </div>
          <div
            style={{
              fontSize: 66,
              lineHeight: 1.12,
              maxWidth: 900,
              color: "#818cf8",
            }}
          >
            que não podem parar.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#7c8598",
          }}
        >
          <div style={{ display: "flex", maxWidth: 760, lineHeight: 1.4 }}>
            Arquitetura · Cloud · SRE · Segurança · FinOps
          </div>
          <div style={{ display: "flex", color: "#a5b4fc" }}>menendes.com.br</div>
        </div>
      </div>
    ),
    size,
  );
}
