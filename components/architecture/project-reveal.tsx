"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowRight } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Lista editorial de projetos. Cada linha abre um painel em tela cheia com o
 * case completo.
 *
 * O detalhe do case só é montado quando aberto, então o carregamento inicial
 * não paga por conteúdo que ninguém pediu.
 *
 * Contrato de acessibilidade do painel:
 *  - role="dialog" aria-modal, rotulado pelo título do case;
 *  - foco vai para o painel ao abrir e volta ao gatilho ao fechar;
 *  - Escape fecha;
 *  - o scroll do documento trava enquanto está aberto.
 */
export function ProjectReveal() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const open = PROJECTS.find((project) => project.slug === openSlug) ?? null;

  const close = () => {
    if (openSlug) triggerRefs.current.get(openSlug)?.focus();
    setOpenSlug(null);
  };

  return (
    <>
      <ul className="border-t border-border">
        {PROJECTS.map((project) => (
          <li key={project.slug} className="border-b border-border">
            <button
              type="button"
              ref={(node) => {
                if (node) triggerRefs.current.set(project.slug, node);
                else triggerRefs.current.delete(project.slug);
              }}
              onClick={() => setOpenSlug(project.slug)}
              aria-haspopup="dialog"
              className="group flex w-full items-center gap-5 py-7 text-left transition-colors duration-300 hover:bg-surface/40 md:gap-8 md:py-9"
            >
              <span className="font-mono text-xs text-faint">{project.index}</span>

              <span className="min-w-0 flex-1">
                <span className="mono-label block">{project.category}</span>
                <span className="mt-2 block text-xl text-fg transition-colors group-hover:text-primary-soft md:text-2xl">
                  {project.client}
                </span>
                <span className="mt-1.5 block max-w-xl text-sm text-muted">
                  {project.summary}
                </span>
              </span>

              <ArrowRight className="mr-1 flex-none text-muted transition-colors group-hover:text-primary-soft" />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open ? <CasePanel project={open} onClose={close} /> : null}
      </AnimatePresence>
    </>
  );
}

function CasePanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const duration = reduced ? 0 : 0.5;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-bg/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`case-${project.slug}-title`}
        tabIndex={-1}
        className="min-h-full outline-none"
        initial={reduced ? false : { y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduced ? undefined : { y: 16, opacity: 0 }}
        transition={{ duration, ease: EASE }}
      >
        <div className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur-sm">
          <div className="shell flex items-center justify-between py-4">
            <span className="mono-label">{project.category}</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-[0.625rem] tracking-[0.16em] text-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              FECHAR
            </button>
          </div>
        </div>

        <div className="shell-narrow py-14">
          <p className="mono-label text-primary-soft">{project.client}</p>
          <h2 id={`case-${project.slug}-title`} className="mt-4 text-3xl md:text-4xl">
            {project.title}
          </h2>
          <p className="mt-5 text-lg text-fg-soft">{project.summary}</p>

          <Block title="Contexto">
            <p className="text-fg-soft">{project.context}</p>
          </Block>

          <Block title="Desafio">
            <p className="text-fg-soft">{project.challenge}</p>
          </Block>

          <Block title="Restrições">
            <List items={project.constraints} />
          </Block>

          <Block title="Decisões">
            <List items={project.decisions} />
          </Block>

          <Block title="Arquitetura">
            <List items={project.architecture} />
          </Block>

          <Block title="Implementação">
            <List items={project.implementation} />
          </Block>

          <Block title="Resultado">
            <List items={project.outcome} />
          </Block>

          <Block title="Tecnologias">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[0.6875rem] text-fg-soft"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Aprendizado">
            <p className="text-fg-soft">{project.learned}</p>
          </Block>

          {project.note ? (
            <p className="mt-10 rounded-[--radius-card] border border-border bg-surface/60 p-5 text-sm text-muted">
              {project.note}
            </p>
          ) : null}

          {project.hasPage ? (
            <Link
              href={`/projetos/${project.slug}`}
              className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary-soft hover:text-primary"
            >
              Ver o case completo
              <ArrowRight />
            </Link>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h3 className="mono-label text-primary-soft">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-fg-soft">
          <span className="mt-2.5 h-1 w-1 flex-none rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}
