"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { NAV, PRIMARY_CTA } from "@/lib/site";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

type Command = { label: string; hint: string; href: string };

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="flex-none"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/**
 * Busca do cabeçalho.
 *
 * É um atalho para quem já conhece o site, nunca a única forma de chegar a
 * algum lugar: tudo aqui também está no menu convencional. Abre no clique ou
 * com Ctrl+K / Cmd+K.
 *
 * ── Por que ancorada, e não centralizada ──────────────────────────────────
 *
 * A versão anterior era um modal ao centro, no espírito do Spotlight. Ficava
 * bonito e tinha um defeito grave: não fechava ao clicar fora, e como o painel
 * cobria a tela, a página inteira ficava presa.
 *
 * A causa é uma armadilha de CSS que este repositório JÁ conhecia — o
 * comentário no `site-header.tsx` a descreve, porque o menu compacto sofreu
 * dela e foi corrigido. O <header> tem `backdrop-blur`, e `backdrop-filter`
 * torna o elemento um bloco de contenção para descendentes `position: fixed`.
 * O overlay era filho do header, então seu `inset-0` resolvia contra os 64px da
 * barra, e não contra a viewport: medido, o retângulo real do overlay era
 * 1905x178px. Qualquer clique abaixo dessa faixa caía na página, nunca no
 * overlay, e `close()` jamais rodava.
 *
 * Ancorar resolve na raiz em vez de remendar: o painel agora é `absolute`
 * dentro de um invólucro `relative`, e posicionamento absoluto se resolve
 * contra o ancestral posicionado mais próximo — o invólucro —, que é
 * exatamente o comportamento desejado. Não há mais nenhum `fixed` para o
 * `backdrop-filter` capturar.
 *
 * O fechamento ao clicar fora também deixou de depender de um elemento
 * invisível bem posicionado: é um ouvinte de `pointerdown` no documento que
 * pergunta se o alvo está dentro do invólucro. Não há geometria envolvida,
 * então não há como desalinhar de novo. `pointerdown` e não `click` para que o
 * painel já esteja fechado quando o clique chegar ao seu destino.
 *
 * ── Semântica ─────────────────────────────────────────────────────────────
 *
 * Deixou de ser `dialog` com `aria-modal`, que descrevia o comportamento
 * antigo e mentiria agora: nada mais fica inerte atrás dela. O padrão correto
 * para um campo que filtra uma lista logo abaixo é combobox, e é o que está
 * implementado — `aria-expanded`, `aria-controls`, `aria-activedescendant` e
 * uma listbox de opções.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const commands = useMemo<Command[]>(
    () => [
      ...NAV.map((item) => ({ label: item.label, hint: "Página", href: item.href })),
      { label: PRIMARY_CTA.label, hint: "Ação", href: PRIMARY_CTA.href },
      ...PROJECTS.filter((project) => project.hasPage).map((project) => ({
        label: project.client,
        hint: "Projeto",
        href: `/projetos/${project.slug}`,
      })),
    ],
    [],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(term));
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  /**
   * Ctrl+K / Cmd+K.
   *
   * O guarda de largura existe porque o gatilho é `md:` para cima: sem ele, um
   * teclado acoplado a um tablet estreito abriria um painel que ninguém veria,
   * e a página passaria a engolir o atalho do navegador sem contrapartida.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /**
   * Fechamento por clique fora e por Escape, ambos no documento.
   *
   * No documento, e não no painel, porque o Escape precisa funcionar mesmo se o
   * foco tiver escapado do campo. Os ouvintes só existem enquanto está aberta.
   */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && wrapperRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  /**
   * Gestão de foco. Ao abrir, vai para o campo; ao fechar, volta para o
   * gatilho, para que o teclado não perca a posição. O sinalizador impede que a
   * primeira renderização roube o foco sem o painel ter sido aberto.
   */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      inputRef.current?.focus();
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => (value + 1) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => (value - 1 + results.length) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[cursor];
      if (target) go(target.href);
    }
  };

  const optionId = (index: number) => `${listId}-opcao-${index}`;

  return (
    // `w-56` no invólucro reserva o espaço do gatilho, para que a barra não
    // mude de layout quando o painel, que é mais largo, aparece por cima.
    <div ref={wrapperRef} className="relative hidden w-56 md:block">
      {/* Parece um campo de busca, não um ícone: a pílula anterior era pequena
          demais para sinalizar o que fazia e ficava espremida ao lado do CTA. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Buscar página ou projeto"
        className={cn(
          "flex h-9 w-full items-center gap-2.5 rounded-md border border-border bg-surface/60 px-3 text-sm text-muted transition-colors hover:border-border-strong hover:text-fg-soft",
          // Some sob o painel em vez de desmontar: assim o gatilho continua
          // ocupando o espaço e nada na barra se desloca ao abrir.
          open && "invisible",
        )}
      >
        <SearchIcon />
        <span className="flex-1 text-left">Buscar</span>
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
          ⌘K
        </kbd>
      </button>

      {open ? (
        // Ancorado pela direita: o painel é mais largo que o gatilho e cresce
        // para a esquerda, sobre o vão da barra, em vez de vazar da tela.
        //
        // Sem a classe `edge` aqui, embora ela seja o acabamento padrão dos
        // painéis do site: `.edge` aplica `position: relative`, que venceria o
        // `absolute` do Tailwind e tiraria o painel da ancoragem. Medido, ele
        // saía do fluxo esperado e metade da lista ficava acima da viewport.
        <div className="absolute right-0 top-0 z-10 w-[26rem] overflow-hidden rounded-md border border-border-strong bg-surface shadow-2xl shadow-black/40">
          <div className="flex h-9 items-center gap-2.5 border-b border-border px-3">
            <SearchIcon />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Buscar página ou projeto"
              aria-label="Buscar página ou projeto"
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results[cursor] ? optionId(cursor) : undefined}
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-faint"
            />
            <kbd className="flex-none rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
              esc
            </kbd>
          </div>

          <ul id={listId} role="listbox" aria-label="Resultados" className="max-h-80 overflow-y-auto p-1.5">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted">Nada encontrado</li>
            ) : (
              results.map((command, index) => (
                <li key={command.href + command.label} role="none">
                  <button
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === cursor}
                    type="button"
                    onClick={() => go(command.href)}
                    onMouseEnter={() => setCursor(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded px-3 py-2 text-left text-sm transition-colors",
                      index === cursor ? "bg-surface-2 text-fg" : "text-fg-soft",
                    )}
                  >
                    <span className="truncate">{command.label}</span>
                    <span className="flex-none font-mono text-[0.625rem] text-faint">
                      {command.hint}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
