import type { SVGProps } from "react";

/**
 * The interior's icon set, drawn in one grammar: 1.5px round strokes on a
 * 16-unit grid, colored by `currentColor`. Small, quiet, and consistent — the
 * kind of marks a cartographer inks in a margin.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 8H3M7 4 3 8l4 4" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 8.5 3 3 7-7" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

/** Six-dot drag grip. */
export function Grip(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={0} fill="currentColor">
      <circle cx="6" cy="4" r="1.1" />
      <circle cx="10" cy="4" r="1.1" />
      <circle cx="6" cy="8" r="1.1" />
      <circle cx="10" cy="8" r="1.1" />
      <circle cx="6" cy="12" r="1.1" />
      <circle cx="10" cy="12" r="1.1" />
    </svg>
  );
}

/** Four-point compass — the wordmark's companion and the loading mark. */
export function Compass(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 2.5v1.6M8 11.9v1.6M2.5 8h1.6M11.9 8h1.6" />
      <path d="M8 4.6 9.4 8 8 11.4 6.6 8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Compass needle only, for the sweeping loader. */
export function CompassNeedle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 2.6 9.8 8 8 13.4 6.2 8Z" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="0.9" fill="#f6f3ec" stroke="none" />
    </svg>
  );
}

/** Stamp-ring mark for passport contexts. */
export function Stamp(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="5.75" strokeDasharray="1.6 1.9" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  );
}
