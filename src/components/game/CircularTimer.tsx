import { motion } from 'framer-motion';
import { gameConfig } from '../../config/gameConfig';

export function CircularTimer({ remaining }: { remaining: number }) {
  const progress = remaining / gameConfig.roundDurationSeconds;
  const urgent = remaining <= gameConfig.warningSeconds;
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  return (
    <motion.div className={`timer${urgent ? ' timer--urgent' : ''}`} animate={urgent ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ repeat: urgent ? Infinity : 0, duration: 1 }} role="timer" aria-label={`${remaining} seconds remaining`}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="timer__track" cx="28" cy="28" r={radius} />
        <circle className="timer__progress" cx="28" cy="28" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
      </svg>
      <span className="timer__number">{remaining}</span>
      <span className="sr-only" aria-live="polite">{urgent ? `${remaining} seconds left` : ''}</span>
    </motion.div>
  );
}
