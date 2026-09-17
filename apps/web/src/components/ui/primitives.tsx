import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

/*
 * Interior primitives for the journal pages. Together they are the whole
 * container vocabulary of the app: a ruled page header, a cartouche plate,
 * ruled sections, and controls — no cards, no tiles.
 */

/** Small uppercase mono label: marginalia, field names, table heads. */
export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "dt" | "th" | "h2" | "h3";
}) {
  return (
    <Tag
      className={clsx(
        "font-mono text-[0.68rem] font-medium uppercase tracking-label text-ink/70",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Page header: an engraved title over a brass rule, with mono marginalia
 * beneath it (counts, coordinates, dates — data, never a kicker) and an
 * optional action on the right.
 */
export function PageHeader({
  title,
  marginalia,
  corner,
  action,
  back,
}: {
  title: ReactNode;
  marginalia?: ReactNode;
  /** Sheet-corner note (coordinates, a reference) set top-right in mono. */
  corner?: ReactNode;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="space-y-3">
      {(back || corner) && (
        <div className="flex items-center justify-between gap-4">
          {back ? (
            <Link
              href={back.href}
              className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-label text-ink/70 transition hover:text-brass-ink"
            >
              <BackArrow />
              {back.label}
            </Link>
          ) : (
            <span />
          )}
          {corner && (
            <span className="font-mono text-[0.62rem] uppercase tabular-nums tracking-[0.12em] text-ink/70">
              {corner}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-brass/60 pb-4">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.85rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0.025em] text-ink [text-wrap:balance]">
            {title}
          </h1>
          {marginalia && (
            <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-label text-ink/70">
              {marginalia}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

function BackArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13 8H3M7 4 3 8l4 4" />
    </svg>
  );
}

/**
 * Cartouche plate: the one container the interior uses when content needs a
 * frame — a hairline with four brass corner ticks, the way a chart's title
 * block is drawn. `tone="chart"` gives the dark night-chart ground for globes.
 */
export function Plate({
  children,
  className,
  tone = "paper",
  dashed = false,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "chart";
  dashed?: boolean;
  padded?: boolean;
}) {
  const chart = tone === "chart";
  return (
    <div
      className={clsx(
        "relative",
        chart
          ? "chart-graticule border border-graticule/25 bg-chart text-parchment"
          : "border border-ink/15 bg-white/35",
        dashed && "border-dashed",
        padded && "p-6 sm:p-8",
        className,
      )}
    >
      <CornerTicks tone={chart ? "bright" : "paper"} />
      {children}
    </div>
  );
}

/** The four brass corner ticks — shared by plates and the primary button. */
export function CornerTicks({
  tone = "paper",
  inset = 2,
}: {
  tone?: "paper" | "bright";
  inset?: number;
}) {
  const color = tone === "bright" ? "#d8b25a" : "#a8853a";
  const pos = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];
  return (
    <>
      {pos.map((p) => (
        <span
          key={p}
          aria-hidden
          className={clsx("pointer-events-none absolute h-2.5 w-2.5", p)}
          style={{ borderColor: color, margin: -inset }}
        />
      ))}
    </>
  );
}

/**
 * Ruled section: a mono heading sitting on a hairline, the way a journal
 * divides a page. Use instead of cards to group content.
 */
export function Section({
  heading,
  aside,
  children,
  className,
}: {
  heading: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("space-y-4", className)}>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-2">
        <Label as="h2">{heading}</Label>
        {aside && (
          <span className="font-mono text-[0.68rem] tabular-nums text-ink/60">
            {aside}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

/* ── Controls ── */

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  primary:
    "relative bg-ink text-parchment hover:bg-[#2a2622] disabled:hover:bg-ink",
  secondary:
    "border border-ink/25 text-ink hover:border-brass-ink hover:text-brass-ink",
  ghost: "text-ink/70 hover:text-brass-ink",
  danger: "text-ink/60 hover:text-[#9b2c2c]",
};

const sizeClass = {
  sm: "px-3 py-1.5 text-[0.62rem]",
  md: "px-5 py-2.5 text-[0.68rem]",
  lg: "px-7 py-3.5 text-[0.72rem]",
};

const baseButton =
  "inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-label transition disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "secondary",
  size = "md",
  cartouche = false,
  className,
  children,
  ...rest
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: keyof typeof sizeClass;
  /** Brass corner ticks — for the one primary action on a page. */
  cartouche?: boolean;
}) {
  return (
    <button
      className={clsx(baseButton, variantClass[variant], sizeClass[size], className)}
      {...rest}
    >
      {cartouche && <CornerTicks tone="bright" inset={3} />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  cartouche = false,
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: keyof typeof sizeClass;
  cartouche?: boolean;
}) {
  return (
    <Link
      className={clsx(baseButton, variantClass[variant], sizeClass[size], className)}
      {...rest}
    >
      {cartouche && <CornerTicks tone="bright" inset={3} />}
      {children}
    </Link>
  );
}

/** Form field: mono label over a ruled input (`className="field"`). */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <Label as="span" className="block">
        {label}
      </Label>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </label>
  );
}

/** Inline status/feedback line in the page's own voice. */
export function Note({
  tone = "muted",
  children,
  className,
}: {
  tone?: "muted" | "error";
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "text-sm",
        tone === "error" ? "text-[#9b2c2c]" : "text-ink/60",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Empty state: a blank page with a ruled prompt — the plate, dashed, with the
 * message set like a note to self and one next action.
 */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: ReactNode;
  body: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Plate dashed className="text-center">
      <p className="font-display text-xl font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Plate>
  );
}
