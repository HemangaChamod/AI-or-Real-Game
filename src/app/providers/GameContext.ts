import { createContext, useContext } from 'react';
import type { GameState, ImageAnswer } from '../../types/game';

export interface GameContextValue {
  state: GameState;
  setPlayer: (name: string) => void;
  startGame: () => { ok: true } | { ok: false; message: string };
  answer: (value: ImageAnswer) => void;
  timeOut: () => void;
  nextRound: () => void;
  finishGame: () => void;
  resetSession: () => void;
  toggleSound: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
}
