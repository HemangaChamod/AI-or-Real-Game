import { useEffect, useRef, useState } from 'react';

export function useRoundTimer(durationSeconds: number, active: boolean, resetKey: string | number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const expireRef = useRef(onExpire);
  const firedRef = useRef(false);
  expireRef.current = onExpire;

  useEffect(() => {
    if (!active) return;
    setRemaining(durationSeconds);
    firedRef.current = false;
    const deadline = Date.now() + durationSeconds * 1000;
    const update = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0 && !firedRef.current) {
        firedRef.current = true;
        expireRef.current();
      }
    };
    update();
    const timer = window.setInterval(update, 200);
    return () => window.clearInterval(timer);
  }, [active, durationSeconds, resetKey]);

  return remaining;
}
