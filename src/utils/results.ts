export interface PerformanceResult {
  title: string;
  message: string;
  badge: 'master' | 'detective' | 'observer' | 'investigator' | 'fooled';
}

export function getPerformance(score: number, total: number): PerformanceResult {
  const normalized = total > 0 ? Math.round((score / total) * 5) : 0;
  if (normalized >= 5) return { title: 'REALITY MASTER', message: 'Flawless. Your eye for detail is exceptional.', badge: 'master' };
  if (normalized === 4) return { title: 'AI DETECTIVE', message: 'Excellent instincts—you spotted almost every signal.', badge: 'detective' };
  if (normalized === 3) return { title: 'SHARP OBSERVER', message: 'Strong work. Reality only slipped past you twice.', badge: 'observer' };
  if (normalized === 2) return { title: 'KEEP INVESTIGATING', message: 'A promising start. Another round will sharpen your eye.', badge: 'investigator' };
  return { title: 'AI FOOLED YOU', message: 'These images were convincing. Try again and trust the tiny details.', badge: 'fooled' };
}
