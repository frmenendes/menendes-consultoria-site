import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { contactSchema, type ContactResponse } from "@/lib/contact-schema";

export const runtime = "nodejs";
/** Endpoint com efeito colateral: nunca pode ser pré-renderizado nem cacheado. */
export const dynamic = "force-dynamic";

/** Formulário preenchido em menos que isso é robô, não pessoa. */
const MIN_FILL_MS = 3000;

const json = (body: ContactResponse, status: number) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

/** Neutraliza quebra de cabeçalho e corta o que for absurdamente longo. */
const clean = (value: string, max = 500) =>
  value.replace(/[\r\n]+/g, " ").slice(0, max);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Bindings do Worker. Fora do runtime da Cloudflare (por exemplo `next start`
 * puro) o contexto não existe: devolvemos um env vazio para que a rota responda
 * 503 com mensagem útil, em vez de estourar com erro de plataforma.
 */
function readEnv(): CloudflareEnv {
  try {
    return getCloudflareContext().env;
  } catch {
    return {} as CloudflareEnv;
  }
}

export async function POST(request: Request): Promise<Response> {
  const env = readEnv();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Requisição inválida." }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return json({ ok: false, error: "Confira os campos destacados.", fields }, 422);
  }

  const data = parsed.data;

  // Honeypot e tempo de preenchimento. Respondem 200 de propósito: informar o
  // robô de que foi detectado só ajuda quem está automatizando.
  if (data.website) return json({ ok: true }, 200);
  if (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS) {
    return json({ ok: true }, 200);
  }

  // Rate limit por IP. CF-Connecting-IP é preenchido pela borda da Cloudflare e
  // não pode ser forjado pelo cliente.
  const ip = request.headers.get("CF-Connecting-IP") ?? "desconhecido";
  const limiter = env.CONTACT_RATE_LIMIT;
  if (limiter) {
    const { success } = await limiter.limit({ key: `contato:${ip}` });
    if (!success) {
      return json(
        { ok: false, error: "Muitas mensagens em pouco tempo. Tente novamente em instantes." },
        429,
      );
    }
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO;
  const from = env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    // Falta de configuração é erro de operação, não do visitante. O log do
    // Worker é privado, então pode nomear exatamente o que falta; a resposta
    // pública continua genérica, sem revelar estado de infraestrutura.
    // Para ver isto: `npx wrangler tail menendes-consultoria-site`.
    const ausentes = [
      !apiKey && "RESEND_API_KEY",
      !to && "CONTACT_TO",
      !from && "CONTACT_FROM",
    ].filter(Boolean);
    const contextoOk = Object.keys(env).length > 0;
    console.error(
      `[contato] secrets ausentes: ${ausentes.join(", ")}. ` +
        `Bindings visíveis ao Worker: ${contextoOk ? Object.keys(env).join(", ") : "nenhum"}. ` +
        `Se a lista de bindings estiver vazia, o problema não são os secrets: ` +
        `é o contexto da Cloudflare não estar disponível para a rota.`,
    );
    return json(
      { ok: false, error: "Não foi possível enviar agora. Escreva para o e-mail no rodapé." },
      503,
    );
  }

  const subject = `[Site] ${clean(data.challenge, 80)} — ${clean(data.company, 80)}`;
  const lines: [string, string][] = [
    ["Nome", data.name],
    ["Empresa", data.company],
    ["E-mail", data.email],
    ["Telefone", data.phone || "não informado"],
    ["Desafio", data.challenge],
  ];

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px">Nova mensagem pelo site</h2>
      <table style="border-collapse:collapse">
        ${lines
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(clean(value))}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px">Descrição</h3>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      // Responder o e-mail vai direto para quem escreveu.
      replyTo: data.email,
    });

    if (error) {
      console.error("[contato] falha no envio", error);
      return json(
        { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." },
        502,
      );
    }
  } catch (cause) {
    console.error("[contato] erro inesperado", cause);
    return json({ ok: false, error: "Não foi possível enviar agora." }, 500);
  }

  return json({ ok: true }, 200);
}
