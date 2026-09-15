import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGame } from '../../app/providers/GameContext';
import { playSound } from '../../services/audio/gameAudio';

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const { state, toggleSound } = useGame();
  const handleToggle = () => {
    if (!state.soundEnabled) playSound('click', true);
    toggleSound();
  };
  return (
    <motion.button whileTap={{ scale: 0.94 }} className={`icon-button${compact ? ' icon-button--compact' : ''}`} onClick={handleToggle} aria-label={state.soundEnabled ? 'Turn sound off' : 'Turn sound on'} title={state.soundEnabled ? 'Sound on' : 'Sound off'}>
      {state.soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
      {!compact && <span>{state.soundEnabled ? 'Sound on' : 'Sound off'}</span>}
    </motion.button>
  );
}
