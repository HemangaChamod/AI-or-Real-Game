import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AmbientBackground } from './AmbientBackground';

export function PageFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <main className={`page-frame ${className}`}>
      <AmbientBackground />
      <motion.div className="page-content" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -12 }} transition={{ duration: reduced ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </main>
  );
}
