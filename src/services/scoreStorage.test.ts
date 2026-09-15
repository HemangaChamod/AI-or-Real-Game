import { beforeEach, describe, expect, it } from 'vitest';
import { getBestScore, saveBestScore } from './scoreStorage';

describe('best score storage', () => {
  beforeEach(() => localStorage.clear());
  it('keeps the highest score', () => { expect(saveBestScore(3)).toBe(3); expect(saveBestScore(1)).toBe(3); expect(saveBestScore(5)).toBe(5); expect(getBestScore()).toBe(5); });
});
