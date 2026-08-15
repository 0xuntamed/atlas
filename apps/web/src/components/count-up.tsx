"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

/** Animated number that counts up from 0 on mount. */
export function CountUp({
  value,
  duration = 1.2,
  format,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration]);

  const rounded = Math.round(display);
  return <>{format ? format(rounded) : rounded.toLocaleString()}</>;
}
