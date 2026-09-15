import { describe, expect, it } from 'vitest';
import type { GameImage } from '../../types/game';
import { createInitialState, gameReducer } from './gameReducer';

const rounds: GameImage[] = [
  { id: 'img-1', src: '1', alt: 'Scene', answer: 'ai' },
  { id: 'img-2', src: '2', alt: 'Scene', answer: 'real' },
];

describe('game reducer', () => {
  it('scores a correct answer only once', () => { let state = gameReducer(createInitialState(true, 0), { type: 'START_GAME', rounds }); state = gameReducer(state, { type: 'ANSWER', answer: 'ai' }); state = gameReducer(state, { type: 'ANSWER', answer: 'ai' }); expect(state.score).toBe(1); expect(state.correctCount).toBe(1); });
  it('counts timeout as incorrect', () => { let state = gameReducer(createInitialState(true, 0), { type: 'START_GAME', rounds }); state = gameReducer(state, { type: 'TIMEOUT' }); expect(state.score).toBe(0); expect(state.incorrectCount).toBe(1); expect(state.timeoutCount).toBe(1); });
  it('resets run state on replay while keeping the player', () => { let state = { ...createInitialState(true, 4), playerName: 'Maya' }; state = gameReducer(state, { type: 'START_GAME', rounds }); state = gameReducer(state, { type: 'ANSWER', answer: 'ai' }); state = gameReducer(state, { type: 'START_GAME', rounds: [...rounds].reverse() }); expect(state.playerName).toBe('Maya'); expect(state.score).toBe(0); expect(state.currentRoundIndex).toBe(0); expect(state.reveal).toBeNull(); expect(state.phase).toBe('playing'); });
});
