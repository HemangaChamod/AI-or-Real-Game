import { describe, expect, it } from 'vitest';
import type { GameImage } from '../types/game';
import { selectGameImages, shuffle } from './gameSelection';

const makeCatalog = (): GameImage[] => Array.from({ length: 12 }, (_, index) => ({ id: `img-${index}`, src: `${index}`, alt: 'Scene', answer: index < 6 ? 'ai' : 'real', active: index !== 11 }));

describe('game selection', () => {
  it('selects five unique images containing both categories', () => { const result = selectGameImages(makeCatalog(), 5, () => 0.42); expect(result).toHaveLength(5); expect(new Set(result.map((x) => x.id)).size).toBe(5); expect(new Set(result.map((x) => x.answer))).toEqual(new Set(['ai', 'real'])); });
  it('creates a three/two mixture', () => { const result = selectGameImages(makeCatalog(), 5, () => 0.2); const ai = result.filter((x) => x.answer === 'ai').length; expect([2, 3]).toContain(ai); expect(result.filter((x) => x.answer === 'real')).toHaveLength(5 - ai); });
  it('excludes inactive images', () => { const result = selectGameImages(makeCatalog(), 5, () => 0.9); expect(result.some((x) => x.id === 'img-11')).toBe(false); });
  it('shuffles without mutating input', () => { const input = [1, 2, 3, 4]; const output = shuffle(input, () => 0); expect(input).toEqual([1, 2, 3, 4]); expect(output).not.toEqual(input); expect(output.sort()).toEqual(input); });
  it('reports an unbalanced catalogue', () => { expect(() => selectGameImages(makeCatalog().filter((x) => x.answer === 'ai'), 5)).toThrow(/both categories/); });
});
