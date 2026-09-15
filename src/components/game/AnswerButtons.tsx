import { Bot, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ImageAnswer } from '../../types/game';

export function AnswerButtons({ disabled, onAnswer }: { disabled: boolean; onAnswer: (answer: ImageAnswer) => void }) {
  return (
    <div className="answer-buttons" aria-label="Choose an answer">
      <motion.button whileHover={disabled ? undefined : { y: -3 }} whileTap={disabled ? undefined : { scale: 0.98 }} className="answer-button answer-button--real" onClick={() => onAnswer('real')} disabled={disabled}>
        <span className="answer-button__icon"><Camera /></span><span><strong>Real Photo</strong><small>Captured by a camera</small></span>
      </motion.button>
      <motion.button whileHover={disabled ? undefined : { y: -3 }} whileTap={disabled ? undefined : { scale: 0.98 }} className="answer-button answer-button--ai" onClick={() => onAnswer('ai')} disabled={disabled}>
        <span className="answer-button__icon"><Bot /></span><span><strong>AI-Generated</strong><small>Created by a model</small></span>
      </motion.button>
    </div>
  );
}
