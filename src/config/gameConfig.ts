export const gameConfig = {
  gameTitle: 'Real or AI?',
  subtitle: 'Can you tell reality from artificial intelligence?',
  totalRounds: 5,
  roundDurationSeconds: 25,
  warningSeconds: 5,
  maxPlayerNameLength: 24,
  enableSound: true,
  enableConfetti: true,
} as const;

export type GameConfig = typeof gameConfig;
