export type ImageAnswer = 'real' | 'ai';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameImage {
  id: string;
  src: string;
  answer: ImageAnswer;
  alt: string;
  clue?: string;
  category?: string;
  difficulty?: Difficulty;
  active?: boolean;
}

export interface AnswerReveal {
  selected: ImageAnswer | null;
  isCorrect: boolean;
  timedOut: boolean;
}

export type GamePhase = 'idle' | 'playing' | 'revealed' | 'finished';

export interface GameState {
  playerName: string;
  rounds: GameImage[];
  currentRoundIndex: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  timeoutCount: number;
  reveal: AnswerReveal | null;
  phase: GamePhase;
  soundEnabled: boolean;
  bestScore: number;
}
