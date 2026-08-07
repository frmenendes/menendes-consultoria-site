"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
 * Navegação por teclado. É um atalho para quem já conhece o site, nunca a única
 * forma de chegar a algum lugar: tudo aqui também está no menu convencional.
 * Abre com Ctrl+K ou Cmd+K.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /**
   * Gestão de foco. Ao abrir, vai para o campo de busca; ao fechar, volta para
   * o gatilho, para que o teclado não perca a posição. O sinalizador impede que
   * a primeira renderização roube o foco sem o painel ter sido aberto.
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

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
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

  return (
    <>
      {/* Parece um campo de busca, não um ícone: a pílula anterior era pequena
          demais para sinalizar o que fazia e ficava espremida ao lado do CTA. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Buscar página ou projeto"
        className="hidden h-9 w-56 items-center gap-2.5 rounded-md border border-border bg-surface/60 px-3 text-sm text-muted transition-colors hover:border-border-strong hover:text-fg-soft md:flex"
      >
        <SearchIcon />
        <span className="flex-1 text-left">Buscar</span>
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-faint">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-bg/80 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Busca por comandos"
            className="edge w-full max-w-lg overflow-hidden rounded-[--radius-panel] border border-border bg-surface"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onListKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-5">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                placeholder="Buscar página ou projeto"
                aria-label="Buscar página ou projeto"
                className="w-full bg-transparent py-4 text-sm text-fg outline-none placeholder:text-faint"
              />
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  Nada encontrado
                </li>
              ) : (
                results.map((command, index) => (
                  <li key={command.href + command.label}>
                    <button
                      type="button"
                      onClick={() => go(command.href)}
                      onMouseEnter={() => setCursor(index)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                        index === cursor ? "bg-surface-2 text-fg" : "text-fg-soft",
                      )}
                    >
                      {command.label}
                      <span className="font-mono text-[0.625rem] text-faint">
                        {command.hint}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
