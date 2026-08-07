import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,border-color,color,transform] duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-soft hover:text-bg " +
    "shadow-[0_10px_34px_-14px_var(--color-primary)]",
  outline:
    "border border-border-strong text-fg hover:border-primary hover:text-primary-soft",
  ghost: "text-fg-soft hover:text-fg",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ButtonProps & {
  href: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Seta usada nos CTAs. Anda um pouco no hover do botão que a contém. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("transition-transform duration-200 group-hover:translate-x-0.5", className)}
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
