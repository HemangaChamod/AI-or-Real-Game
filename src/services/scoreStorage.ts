const BEST_SCORE_KEY = 'real-or-ai-best-score';
const SOUND_KEY = 'real-or-ai-sound';

export function getBestScore(): number {
  try {
    const value = Number(localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number): number {
  const best = Math.max(score, getBestScore());
  try { localStorage.setItem(BEST_SCORE_KEY, String(best)); } catch { /* storage is optional */ }
  return best;
}

export function getSoundPreference(defaultValue = true): boolean {
  try {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored === null ? defaultValue : stored === 'true';
  } catch {
    return defaultValue;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try { localStorage.setItem(SOUND_KEY, String(enabled)); } catch { /* storage is optional */ }
}
