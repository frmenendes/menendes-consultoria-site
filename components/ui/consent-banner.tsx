"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { CONSENT_HASH, needsDecision, writeConsent, type ConsentChoice } from "@/lib/consent";
import { useConsent, useIsClient, useIsPreferencesHash } from "@/hooks/use-consent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Banner de consentimento.
 *
 * Só aparece quando não existe decisão salva, quando a política mudou de versão
 * ou quando o visitante reabre as preferências pela âncora do rodapé.
 *
 * Recusar não limita nada no site, e o botão de recusar tem o mesmo peso visual
 * do de aceitar. Recusa escondida atrás de "personalizar" não é escolha livre.
 *
 * Renderiza `null` no primeiro passe para evitar divergência de hidratação: a
 * decisão vive no localStorage, que o servidor não conhece.
 */
export function ConsentBanner() {
  const isClient = useIsClient();
  const stored = useConsent();
  const isPreferencesHash = useIsPreferencesHash();
  /** Só marca uma decisão tomada nesta sessão; o resto é derivado. */
  const [decided, setDecided] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  /**
   * Alteração ainda não salva. Começa nulo e cai na escolha guardada, então o
   * controle já abre refletindo o estado atual sem precisar de efeito para
   * semear valor.
   */
  const [draft, setDraft] = useState<boolean | null>(null);
  const measurement = draft ?? stored?.measurement ?? false;

  const decide = useCallback((choice: ConsentChoice) => {
    writeConsent(choice);
    setDecided(true);
    setDetailsOpen(false);
    if (window.location.hash === CONSENT_HASH) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const visible =
    isClient && !decided && (needsDecision(stored) || isPreferencesHash);

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Preferências de privacidade"
      className="consent-banner fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-bg/95 backdrop-blur-md"
    >
      <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:gap-8 lg:py-4">
        <div className="min-w-0 flex-1">
          <p className="mono-label text-primary-soft">Privacidade</p>
          <p className="mt-2 text-sm text-fg-soft">
            Usamos uma medição de audiência sem cookies e sem identificar quem
            navega. Você pode recusar sem perder nada do site. Detalhes na{" "}
            <Link
              href="/privacidade"
              className="text-primary-soft underline underline-offset-2"
            >
              Política de Privacidade
            </Link>
            .
          </p>

          {detailsOpen ? (
            <div className="mt-4 space-y-px overflow-hidden rounded-card border border-border">
              <div className="flex items-center justify-between gap-4 bg-surface/60 px-4 py-3">
                <div>
                  <p className="text-sm text-fg">Necessários</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Entrega das páginas, segurança e memória desta escolha.
                  </p>
                </div>
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-faint">
                  SEMPRE ATIVOS
                </span>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 bg-surface/60 px-4 py-3">
                <div>
                  <p className="text-sm text-fg">Medição de audiência</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Cloudflare Web Analytics: contagem agregada de visitas, sem
                    cookie e sem perfil individual.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={measurement}
                  onChange={(event) => setDraft(event.target.checked)}
                  className="h-4 w-4 flex-none accent-[var(--color-primary)]"
                />
              </label>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-none flex-wrap items-center gap-2",
            "lg:justify-end",
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
          >
            {detailsOpen ? "Ocultar opções" : "Personalizar"}
          </Button>

          {detailsOpen ? (
            <Button size="sm" onClick={() => decide({ measurement })}>
              Salvar escolhas
            </Button>
          ) : (
            <>
              {/* Mesmo peso visual nos dois: recusa escondida não é escolha. */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => decide({ measurement: false })}
              >
                Recusar
              </Button>
              <Button size="sm" onClick={() => decide({ measurement: true })}>
                Aceitar
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
