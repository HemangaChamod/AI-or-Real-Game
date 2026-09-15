import { ArrowLeft, ScanFace, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../app/providers/GameContext';
import { PageFrame } from '../components/common/PageFrame';
import { SoundToggle } from '../components/common/SoundToggle';
import { gameConfig } from '../config/gameConfig';
import { playSound } from '../services/audio/gameAudio';

export function PlayerPage() {
  const navigate = useNavigate();
  const { state, setPlayer, startGame } = useGame();
  const [name, setName] = useState(state.playerName);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const cleanName = name.trim().replace(/\s+/g, ' ');
  const isValid = cleanName.length > 0 && cleanName.length <= gameConfig.maxPlayerNameLength;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!cleanName) { setError('Enter your name to begin.'); return; }
    if (cleanName.length > gameConfig.maxPlayerNameLength) { setError(`Keep your name to ${gameConfig.maxPlayerNameLength} characters or fewer.`); return; }
    setPlayer(cleanName);
    const result = startGame();
    if (!result.ok) { setError(result.message); return; }
    playSound('transition', state.soundEnabled);
    navigate('/play');
  };
  const visibleError = error || (touched && !cleanName ? 'Enter your name to begin.' : '') || (cleanName.length > gameConfig.maxPlayerNameLength ? `Keep your name to ${gameConfig.maxPlayerNameLength} characters or fewer.` : '');
  return (
    <PageFrame className="player-page">
      <header className="compact-header"><a className="brand" href="/" aria-label="Real or AI home"><ScanFace size={21} /><span>REALITY//CHECK</span></a><SoundToggle /></header>
      <section className="player-layout player-layout--centered">
        <motion.div className="player-heading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow"><Sparkles size={15} /> Player identification</span><h1>Ready to investigate?</h1><p>Enter your name to begin the five-round challenge.</p></motion.div>
        <motion.form className="player-card player-card--centered" onSubmit={submit} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.08 }} noValidate>
          <div className="player-avatar"><ScanFace /></div>
          <label htmlFor="player-name">Investigator name</label><p>What should we call you?</p>
          <div className={`input-shell${visibleError ? ' input-shell--error' : ''}`}><input id="player-name" value={name} onChange={(e) => { setName(e.target.value.slice(0, gameConfig.maxPlayerNameLength + 1)); setError(''); }} onBlur={() => setTouched(true)} maxLength={gameConfig.maxPlayerNameLength + 1} autoComplete="off" autoFocus placeholder="Enter your name" aria-describedby={visibleError ? 'name-error' : 'name-hint'} aria-invalid={Boolean(visibleError)} /><span>{cleanName.length}/{gameConfig.maxPlayerNameLength}</span></div>
          {visibleError ? <p className="form-error" id="name-error" role="alert">{visibleError}</p> : <p className="form-hint" id="name-hint">This is only used for your current game.</p>}
          <div className="player-card__actions"><button className="secondary-button" type="button" onClick={() => navigate('/')}><ArrowLeft size={18} /> Back</button><button className="primary-button" type="submit" disabled={!isValid}>Continue <span aria-hidden="true">→</span></button></div>
        </motion.form>
      </section>
    </PageFrame>
  );
}
