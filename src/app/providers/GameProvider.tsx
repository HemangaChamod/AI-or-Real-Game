import { useCallback, useMemo, useReducer, type ReactNode } from 'react';
import { gameConfig } from '../../config/gameConfig';
import { imageCatalog } from '../../data/imageCatalog';
import { createInitialState, gameReducer } from '../../features/real-or-ai/gameReducer';
import { getBestScore, getSoundPreference, saveBestScore, saveSoundPreference } from '../../services/scoreStorage';
import type { ImageAnswer } from '../../types/game';
import { selectGameImages } from '../../utils/gameSelection';
import { GameContext } from './GameContext';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createInitialState(getSoundPreference(gameConfig.enableSound), getBestScore()),
  );

  const setPlayer = useCallback((name: string) => dispatch({ type: 'SET_PLAYER', name }), []);
  const startGame = useCallback(() => {
    try {
      dispatch({ type: 'START_GAME', rounds: selectGameImages(imageCatalog, gameConfig.totalRounds) });
      return { ok: true } as const;
    } catch (error) {
      console.error('Unable to create game selection', error);
      return { ok: false, message: 'The image collection is not ready for a new game. Please try again later.' } as const;
    }
  }, []);
  const answer = useCallback((value: ImageAnswer) => dispatch({ type: 'ANSWER', answer: value }), []);
  const timeOut = useCallback(() => dispatch({ type: 'TIMEOUT' }), []);
  const nextRound = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []);
  const finishGame = useCallback(() => {
    const best = saveBestScore(state.score);
    dispatch({ type: 'FINISH', bestScore: best });
  }, [state.score]);
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);
  const toggleSound = useCallback(() => {
    const enabled = !state.soundEnabled;
    saveSoundPreference(enabled);
    dispatch({ type: 'SET_SOUND', enabled });
  }, [state.soundEnabled]);

  const value = useMemo(() => ({ state, setPlayer, startGame, answer, timeOut, nextRound, finishGame, resetSession, toggleSound }),
    [state, setPlayer, startGame, answer, timeOut, nextRound, finishGame, resetSession, toggleSound]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
