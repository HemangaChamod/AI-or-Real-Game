import type { AnswerReveal, GameImage, GameState, ImageAnswer } from '../../types/game';

export type GameAction =
  | { type: 'SET_PLAYER'; name: string }
  | { type: 'START_GAME'; rounds: GameImage[] }
  | { type: 'ANSWER'; answer: ImageAnswer }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_ROUND' }
  | { type: 'FINISH'; bestScore: number }
  | { type: 'SET_SOUND'; enabled: boolean }
  | { type: 'SET_BEST_SCORE'; score: number }
  | { type: 'RESET_SESSION' };

export const createInitialState = (soundEnabled: boolean, bestScore: number): GameState => ({
  playerName: '', rounds: [], currentRoundIndex: 0, score: 0, correctCount: 0,
  incorrectCount: 0, timeoutCount: 0, reveal: null, phase: 'idle', soundEnabled, bestScore,
});

function answerState(state: GameState, reveal: AnswerReveal): GameState {
  if (state.phase !== 'playing') return state;
  return {
    ...state,
    phase: 'revealed',
    reveal,
    score: state.score + (reveal.isCorrect ? 1 : 0),
    correctCount: state.correctCount + (reveal.isCorrect ? 1 : 0),
    incorrectCount: state.incorrectCount + (reveal.isCorrect ? 0 : 1),
    timeoutCount: state.timeoutCount + (reveal.timedOut ? 1 : 0),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER': return { ...state, playerName: action.name };
    case 'START_GAME': return { ...state, rounds: action.rounds, currentRoundIndex: 0, score: 0, correctCount: 0, incorrectCount: 0, timeoutCount: 0, reveal: null, phase: 'playing' };
    case 'ANSWER': {
      const current = state.rounds[state.currentRoundIndex];
      return current ? answerState(state, { selected: action.answer, isCorrect: action.answer === current.answer, timedOut: false }) : state;
    }
    case 'TIMEOUT': return answerState(state, { selected: null, isCorrect: false, timedOut: true });
    case 'NEXT_ROUND': return state.phase === 'revealed' && state.currentRoundIndex < state.rounds.length - 1
      ? { ...state, currentRoundIndex: state.currentRoundIndex + 1, reveal: null, phase: 'playing' }
      : state;
    case 'FINISH': return state.phase === 'revealed' ? { ...state, phase: 'finished', bestScore: Math.max(state.bestScore, action.bestScore) } : state;
    case 'SET_SOUND': return { ...state, soundEnabled: action.enabled };
    case 'SET_BEST_SCORE': return { ...state, bestScore: Math.max(state.bestScore, action.score) };
    case 'RESET_SESSION': return { ...createInitialState(state.soundEnabled, state.bestScore) };
    default: return state;
  }
}
