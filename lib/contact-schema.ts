import { z } from "zod";

/**
 * Contrato do formulário de contato. Compartilhado entre cliente e servidor,
 * mas a validação que vale é a do servidor: a do cliente existe só para dar
 * retorno rápido e pode ser contornada trivialmente.
 */

export const CHALLENGE_TYPES = [
  "Arquitetura de software",
  "Cloud e infraestrutura",
  "SRE e observabilidade",
  "Segurança e governança",
  "FinOps",
  "Aplicação criada por IA",
  "Produto digital",
  "Outro",
] as const;

/**
 * A mensagem em `error` cobre também o campo ausente. Sem ela, o zod devolve o
 * texto padrão em inglês ("expected string, received undefined"), que vazaria
 * para a interface.
 */
export const contactSchema = z.object({
  name: z.string({ error: "Informe seu nome." }).trim().min(2, "Informe seu nome.").max(120),
  company: z
    .string({ error: "Informe a empresa." })
    .trim()
    .min(2, "Informe a empresa.")
    .max(140),
  email: z.email({ error: "Informe um e-mail válido." }).max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  challenge: z.enum(CHALLENGE_TYPES, { error: "Selecione o tipo de desafio." }),
  message: z
    .string({ error: "Descreva o problema com pelo menos 20 caracteres." })
    .trim()
    .min(20, "Descreva o problema com pelo menos 20 caracteres.")
    .max(4000),

  /**
   * Honeypot: campo escondido que só um robô preenche.
   * Aceita qualquer string de propósito. Se o schema rejeitasse aqui, a resposta
   * seria um 422 apontando o campo, o que ensina ao robô exatamente qual campo
   * deixar em branco. A checagem acontece depois da validação, no endpoint, que
   * responde 200 sem enviar nada.
   */
  website: z.string().max(200).optional(),
  /** Instante em que o formulário foi montado, para medir o tempo de preenchimento. */
  startedAt: z.coerce.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };
