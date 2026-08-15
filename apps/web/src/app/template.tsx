"use client";

import { motion } from "framer-motion";

/**
 * App-wide page transition. `template.tsx` remounts on every navigation, so this
 * gives each route a quiet fade-and-rise entrance — motion that signals "you've
 * arrived somewhere", not decoration.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
