import { describe, expect, it } from 'vitest';
import { getPerformance } from './results';

describe('performance titles', () => {
  it.each([[5, 'REALITY MASTER'], [4, 'AI DETECTIVE'], [3, 'SHARP OBSERVER'], [2, 'KEEP INVESTIGATING'], [1, 'AI FOOLED YOU'], [0, 'AI FOOLED YOU']])('maps %i to %s', (score, title) => expect(getPerformance(score, 5).title).toBe(title));
});
