import clsx from "clsx";

/**
 * A country's mark: its ISO code set in mono inside a hairline square, the
 * way a chart labels territory. Deterministic on every platform — emoji flags
 * have no glyphs on Windows and render as bare letters, so ATLAS labels the
 * way a cartographer would instead.
 */
export function CountryMark({
  code,
  size = "sm",
  tone = "paper",
  className,
}: {
  code: string;
  size?: "sm" | "md" | "lg";
  tone?: "paper" | "stamp";
  className?: string;
}) {
  const dims = {
    sm: "h-8 w-8 text-[0.62rem] tracking-[0.12em]",
    md: "h-12 w-12 text-base tracking-[0.14em]",
    lg: "h-16 w-16 text-lg tracking-[0.16em] sm:h-20 sm:w-20 sm:text-2xl",
  }[size];
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-grid shrink-0 place-items-center border font-mono font-medium uppercase leading-none",
        tone === "paper" ? "border-ink/30 text-ink/80" : "border-current text-current",
        dims,
        className,
      )}
    >
      {code.toUpperCase().slice(0, 2)}
    </span>
  );
}
