import { cn } from "@/lib/utils";

/**
 * Barras de sinal em laço, como um gráfico de telemetria vivo.
 *
 * Cada barra tem duração e atraso próprios, então o conjunto nunca cai em
 * sincronia e não vira uma onda mecânica. É decorativo: transmite "isto está
 * sendo medido", sem afirmar nenhum número.
 *
 * CSS puro, sem JavaScript. Sob reduced motion as barras ficam paradas em
 * alturas diferentes, o que ainda lê como um gráfico.
 */
const BARS = [
  { height: "40%", duration: "2.1s", delay: "0s" },
  { height: "70%", duration: "2.8s", delay: "0.25s" },
  { height: "35%", duration: "1.9s", delay: "0.5s" },
  { height: "85%", duration: "3.1s", delay: "0.1s" },
  { height: "55%", duration: "2.4s", delay: "0.7s" },
  { height: "65%", duration: "2.6s", delay: "0.35s" },
  { height: "45%", duration: "2.2s", delay: "0.9s" },
  { height: "75%", duration: "3.0s", delay: "0.15s" },
];

export function SignalBars({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-10 items-end gap-1", className)}
    >
      {BARS.map((bar, index) => (
        <span
          key={index}
          className="signal-bar w-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
          style={{
            height: bar.height,
            animationDuration: bar.duration,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </div>
  );
}
