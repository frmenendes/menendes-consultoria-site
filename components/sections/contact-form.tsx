"use client";

import { useEffect, useRef, useState } from "react";
import { CHALLENGE_TYPES, contactSchema, type ContactResponse } from "@/lib/contact-schema";
import { ArrowRight, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "w-full rounded-card border border-border bg-surface/60 px-4 py-3 text-sm text-fg " +
  "outline-none transition-colors placeholder:text-faint focus:border-primary";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  /**
   * Instante de montagem, enviado no payload para o servidor medir o tempo de
   * preenchimento. Preenchido em efeito, não durante o render: Date.now() é
   * impuro e não pode ser chamado no corpo do componente.
   */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      challenge: String(form.get("challenge") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
      startedAt: startedAt.current,
    };

    // Validação no cliente só para retorno imediato. A que decide é a do servidor.
    const local = contactSchema.safeParse(payload);
    if (!local.success) {
      const fields: Record<string, string> = {};
      for (const issue of local.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
      }
      setErrors(fields);
      setStatus("error");
      setMessage("Confira os campos destacados.");
      return;
    }

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        setStatus("sent");
        return;
      }

      setErrors(result.fields ?? {});
      setStatus("error");
      setMessage(result.error);
    } catch {
      setStatus("error");
      setMessage("Falha de conexão. Tente novamente.");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="edge rounded-panel border border-border bg-surface/60 p-10 text-center"
      >
        <p className="mono-label text-signal">MENSAGEM ENVIADA</p>
        <h3 className="mt-4 text-2xl">Recebido. Retornamos em breve.</h3>
        <p className="mt-3 text-fg-soft">
          Se for urgente, o WhatsApp costuma ser mais rápido que o e-mail.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" name="name" error={errors.name} autoComplete="name" required />
        <Field
          label="Empresa"
          name="company"
          error={errors.company}
          autoComplete="organization"
          required
        />
        <Field
          label="E-mail"
          name="email"
          type="email"
          error={errors.email}
          autoComplete="email"
          required
        />
        <Field
          label="Telefone"
          name="phone"
          type="tel"
          hint="opcional"
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      <div>
        <Label htmlFor="challenge">Tipo de desafio</Label>
        <select
          id="challenge"
          name="challenge"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.challenge)}
          aria-describedby={errors.challenge ? "challenge-error" : undefined}
          className={cn(FIELD, errors.challenge && "border-danger")}
        >
          <option value="" disabled>
            Selecione
          </option>
          {CHALLENGE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError id="challenge-error" message={errors.challenge} />
      </div>

      <div>
        <Label htmlFor="message">Descrição do problema</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="O que está acontecendo, desde quando, e o que já foi tentado."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(FIELD, "resize-y", errors.message && "border-danger")}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot. Escondido de gente, visível para robô que preenche tudo.
          aria-hidden e tabIndex garantem que leitor de tela e teclado o ignorem. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" disabled={sending} className="group">
          {sending ? "Enviando" : "Enviar mensagem"}
          {sending ? null : <ArrowRight />}
        </Button>

        {status === "error" && message ? (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        ) : null}
      </div>

      <p className="pt-2 text-xs text-faint">
        Os dados enviados são usados apenas para responder ao seu contato.
      </p>
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm text-fg-soft">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {hint ? <span className="ml-2 text-xs text-faint">{hint}</span> : null}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(FIELD, error && "border-danger")}
        {...rest}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-danger">
      {message}
    </p>
  );
}
