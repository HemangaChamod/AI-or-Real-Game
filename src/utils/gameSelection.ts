import type { GameImage } from '../types/game';

export type RandomSource = () => number;

export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectGameImages(
  catalog: readonly GameImage[],
  roundCount: number,
  random: RandomSource = Math.random,
): GameImage[] {
  if (!Number.isInteger(roundCount) || roundCount < 2) {
    throw new Error('A game needs at least two rounds.');
  }

  const active = catalog.filter((image) => image.active !== false);
  const ai = active.filter((image) => image.answer === 'ai');
  const real = active.filter((image) => image.answer === 'real');

  if (active.length < roundCount || ai.length === 0 || real.length === 0) {
    throw new Error('There are not enough active images from both categories to start a game.');
  }

  const lower = Math.floor(roundCount / 2);
  const upper = Math.ceil(roundCount / 2);
  const preferAiMajority = roundCount % 2 === 1 ? random() < 0.5 : true;
  let aiCount = preferAiMajority ? upper : lower;
  aiCount = Math.min(aiCount, ai.length);
  aiCount = Math.max(aiCount, roundCount - real.length, 1);
  aiCount = Math.min(aiCount, roundCount - 1);
  const realCount = roundCount - aiCount;

  return shuffle(
    [...shuffle(ai, random).slice(0, aiCount), ...shuffle(real, random).slice(0, realCount)],
    random,
  );
}
