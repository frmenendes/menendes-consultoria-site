// Menendes Consulting — átomos compartilhados
import { useEffect, useRef, useState } from "react";

// ───────── Marca ─────────
// `light` só marca a variante; a cor vive no CSS para que o header possa
// invertê-la conforme rola sobre o hero escuro (estilo inline venceria a regra).
export function Wordmark({ light = false, size = 20 }) {
  return (
    <span className={`wordmark${light ? " light" : ""}`} style={{ fontSize: size }}>
      <Monogram size={size * 1.35} />
      <span className="wordmark-text">
        <b>MENENDES</b>
        <i>consulting</i>
      </span>
    </span>
  );
}

// Monograma "M" em chevrons — remete a código e a caminho ascendente.
export function Monogram({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.5" />
      <path
        d="M8 22V11l4 6 4-6 4 6 4-6v11"
        stroke="url(#mg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="mg" x1="8" y1="11" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ───────── Ícones ─────────
const I = ({ d, size = 20, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

export const Icon = {
  arrow: (p) => <I {...p} d={<><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>} />,
  arrowUpRight: (p) => <I {...p} d={<><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>} />,
  check: (p) => <I {...p} d={<path d="M20 6 9 17l-5-5" />} />,
  compass: (p) => <I {...p} d={<><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></>} />,
  chart: (p) => <I {...p} d={<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>} />,
  cloud: (p) => <I {...p} d={<><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.1 11 3.5 3.5 0 0 0 6.5 19Z" /></>} />,
  globe: (p) => <I {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>} />,
  layers: (p) => <I {...p} d={<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>} />,
  infinity: (p) => <I {...p} d={<path d="M6.5 15.5a3.5 3.5 0 1 1 0-7c2.5 0 3.5 3.5 5.5 3.5s3-3.5 5.5-3.5a3.5 3.5 0 1 1 0 7c-2.5 0-3.5-3.5-5.5-3.5s-3 3.5-5.5 3.5Z" />} />,
  shield: (p) => <I {...p} d={<><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></>} />,
  mail: (p) => <I {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 7 8.5-7" /></>} />,
  phone: (p) => <I {...p} d={<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />} />,
  pin: (p) => <I {...p} d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>} />,
  chat: (p) => <I {...p} d={<><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></>} />,
  menu: (p) => <I {...p} d={<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>} />,
  x: (p) => <I {...p} d={<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>} />,
  spark: (p) => <I {...p} d={<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6 8.4 8.4M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />} />,
};

// ───────── Cabeçalho de seção ─────────
export function SectionHead({ eyebrow, title, accent, sub, center = false, light = false }) {
  return (
    <div className={`section-head${center ? " center" : ""}${light ? " light" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>
        {title}
        {accent && <> <em>{accent}</em></>}
      </h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

// ───────── Revela ao entrar na viewport ─────────
export function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " in" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ───────── Número animado ─────────
export function Counter({ to, suffix = "", duration = 1100 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      let raf;
      const step = (t) => {
        const k = Math.min(1, (t - start) / duration);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{n}{suffix}</span>;
}
