import { Bot, Check, Clock3, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AnswerReveal, GameImage } from '../../types/game';

export function RevealPanel({ reveal, image, score, isFinal, onContinue }: { reveal: AnswerReveal; image: GameImage; score: number; isFinal: boolean; onContinue: () => void }) {
  const state = reveal.timedOut ? 'timeout' : reveal.isCorrect ? 'correct' : 'incorrect';
  const Icon = reveal.timedOut ? Clock3 : reveal.isCorrect ? Check : X;
  const label = reveal.timedOut ? 'Time’s Up' : reveal.isCorrect ? 'Correct' : 'Incorrect';
  return (
    <motion.section className={`reveal reveal--${state}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} role="status" aria-live="polite">
      <div className="reveal__headline"><span className="reveal__icon"><Icon /></span><div><p>{label}</p><h2>The answer is {image.answer === 'real' ? 'Real Photo' : 'AI-Generated'}</h2></div><motion.span className="reveal__score" key={score} initial={{ scale: reveal.isCorrect ? 0.6 : 1 }} animate={{ scale: 1 }}>{reveal.isCorrect ? '+1' : '+0'}</motion.span></div>
      <motion.p className="reveal__pick" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>{reveal.timedOut ? 'No answer locked' : <>Your pick: <strong>{reveal.selected === 'real' ? 'Real Photo' : 'AI-Generated'}</strong></>}</motion.p>
      {image.answer === 'ai' && image.clue && <div className="clue"><Bot size={19} /><p><strong>Detection clue</strong>{image.clue}</p></div>}
      <div className="reveal__footer"><span>Score <strong>{score}</strong></span><button className="primary-button primary-button--small" onClick={onContinue}>{isFinal ? 'View My Result' : 'Next Round'}<span aria-hidden="true">→</span></button></div>
    </motion.section>
  );
}
