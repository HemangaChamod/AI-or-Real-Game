import {
  ArrowRight, Check, Clock3, Focus, Home, RotateCcw,
  ScanEye, ShieldCheck, Sparkles, Trophy, X,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../app/providers/GameContext';
import { SoundToggle } from '../components/common/SoundToggle';
import { gameConfig } from '../config/gameConfig';
import { playSound } from '../services/audio/gameAudio';
import { getPerformance } from '../utils/results';

export function ResultPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const allowMotion = reducedMotion === false;
  const { state, startGame, resetSession } = useGame();
  const [progress, setProgress] = useState(0);
  const [replayError, setReplayError] = useState('');
  const celebrated = useRef(false);
  const actionStarted = useRef(false);
  const ringId = `result-ring-${useId().replace(/:/g, '')}`;

  const total = state.rounds.length;
  const hasResult = total > 0;
  const score = Math.max(0, Math.min(state.score, total));
  const ratio = hasResult ? score / total : 0;
  const accuracy = Math.round(ratio * 100);
  const perfect = hasResult && score === total;
  const strongRun = hasResult && ratio >= 0.8;
  const performance = getPerformance(score, Math.max(total, 1));
  const bestScore = Math.max(state.bestScore, score);
  const incorrect = Math.max(0, state.incorrectCount - state.timeoutCount);
  const playerName = state.playerName?.trim() || 'Detective';
  const displayProgress = allowMotion ? progress : 1;
  const displayScore = Math.round(score * displayProgress);
  const ringLength = 2 * Math.PI * 112;

  const achievement = perfect ? 'PERFECT VISION' : strongRun ? 'SHARP INSTINCTS' : ratio >= 0.5 ? 'REALITY EXPLORER' : 'CURIOSITY UNLOCKED';
  const nextTitle = perfect
    ? 'A perfect score. Can you do it twice?'
    : strongRun
      ? 'So close. The perfect run is calling.'
      : ratio >= 0.5
        ? 'Your instincts are warming up.'
        : 'Every image teaches you where to look.';
  const nextMessage = perfect
    ? 'Take on another set and put that instinct to the test.'
    : strongRun
      ? 'One more challenge. A fresh chance to spot every fake.'
      : 'Look closer at textures, shadows, and the tiny details. Try again.';

  useEffect(() => {
    if (!allowMotion) return;
    setProgress(0);
    let frame = 0;
    let startedAt: number | undefined;
    const tick = (now: number) => {
      if (startedAt === undefined) startedAt = now;
      const elapsed = Math.min((now - startedAt) / 1100, 1);
      setProgress(1 - Math.pow(1 - elapsed, 3));
      if (elapsed < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [allowMotion, score, total]);

  useEffect(() => {
    if (!allowMotion || !gameConfig.enableConfetti || !strongRun || celebrated.current) return;
    // A delayed, finite burst; cleanup also prevents duplicate Strict Mode bursts.
    const timer = window.setTimeout(() => {
      celebrated.current = true;
      void confetti({
        particleCount: perfect ? 120 : 70,
        spread: 85,
        startVelocity: 32,
        gravity: 0.95,
        ticks: 180,
        scalar: 0.85,
        origin: { x: 0.5, y: 0.4 },
        colors: perfect ? ['#f8d68a', '#fff2cb', '#8be7ee'] : ['#77e3f3', '#a795ff', '#e5ecff'],
        disableForReducedMotion: true,
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [allowMotion, perfect, strongRun]);

  // A refreshed or cleared results route has no session to display.
  // Redirect instead of leaving the player on an empty page.
  if (!hasResult) {
    return <Navigate to="/" replace />;
  }

  const replay = () => {
    if (actionStarted.current) return;
    actionStarted.current = true;
    setReplayError('');
    try {
      const result = startGame();
      if (!result.ok) {
        actionStarted.current = false;
        setReplayError('The next challenge could not start. Please try again, or return to the start page.');
        return;
      }
      playSound('transition', state.soundEnabled);
      navigate('/play');
    } catch {
      actionStarted.current = false;
      setReplayError('Something interrupted the restart. Please try again, or return to the start page.');
    }
  };

  const home = () => {
    if (actionStarted.current) return;
    actionStarted.current = true;
    playSound('click', state.soundEnabled);

    // Reset and navigate in the same event. Delaying resetSession can clear
    // the result while this route is still mounted and cause a blank screen.
    resetSession();
    navigate('/', { replace: true });
  };

  const reveal = (delay = 0) => ({
    initial: allowMotion ? { opacity: 0, y: 16 } : false as const,
    animate: { opacity: 1, y: 0 },
    transition: { duration: allowMotion ? 0.55 : 0, delay: allowMotion ? delay : 0 },
  });

  return (
    <div className={`rr-page${perfect ? ' rr-page--perfect' : ''}`}>
      <style>{resultStyles}</style>
      <div className="rr-ambient" aria-hidden="true" />
      <header className="rr-header">
        <button type="button" className="rr-brand" onClick={home} aria-label="Reality Check home">
          <span className="rr-brand-icon"><Focus size={22} strokeWidth={1.7} /></span>
          <span>REALITY<span className="rr-brand-slash">//</span>CHECK</span>
        </button>
        <div className="rr-header-right">
          <span className="rr-session"><span /> {hasResult ? 'SESSION COMPLETE' : 'READY WHEN YOU ARE'}</span>
          <div className="rr-sound"><SoundToggle /></div>
        </div>
      </header>

      {hasResult ? (
        <main className="rr-main">
          <motion.div className="rr-intro" {...reveal()}>
            <div className="rr-eyebrow"><ShieldCheck size={13} /> CHALLENGE COMPLETE</div>
            <p className="rr-player">The results are in, <strong>{playerName}.</strong></p>
            <h1>{performance.title}</h1>
            <p className="rr-message">{performance.message}</p>
          </motion.div>

          <motion.section className="rr-report" aria-label="Your challenge results" {...reveal(0.12)}>
            <div className="rr-score-panel">
              <div className="rr-panel-label"><span /> HUMAN INSTINCT REPORT <span className="rr-label-line" /></div>

              <div className="rr-score-dial" role="img" aria-label={`Final score: ${score} out of ${total}. Accuracy: ${accuracy} percent.`}>
                <svg className="rr-ring" viewBox="0 0 280 280" fill="none" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id={ringId} x1="30" y1="30" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                      <stop stopColor={perfect ? '#fff0bb' : '#7bedf3'} />
                      <stop offset="0.5" stopColor={perfect ? '#efc773' : '#75afff'} />
                      <stop offset="1" stopColor={perfect ? '#dca16c' : '#b497ff'} />
                    </linearGradient>
                  </defs>
                  <circle cx="140" cy="140" r="134" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" strokeDasharray="1 12.4" />
                  <circle cx="140" cy="140" r="124" stroke="currentColor" strokeOpacity="0.09" />
                  <circle cx="140" cy="140" r="112" stroke="currentColor" strokeOpacity="0.09" strokeWidth="7" />
                  <circle cx="140" cy="140" r="112" stroke={`url(#${ringId})`} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={ringLength} strokeDashoffset={ringLength * (1 - ratio * displayProgress)}
                    opacity={score > 0 ? 1 : 0} transform="rotate(-90 140 140)" />
                  <circle cx="140" cy="140" r="101" stroke="currentColor" strokeOpacity="0.05" />
                </svg>
                <div className="rr-dial-content" aria-hidden="true">
                  <ScanEye size={26} strokeWidth={1.4} />
                  <div className="rr-score-number"><strong>{displayScore}</strong><span>/ {total}</span></div>
                  <span className="rr-score-caption">IMAGES IDENTIFIED</span>
                  <span className="rr-accuracy">{accuracy}% <span>accuracy</span></span>
                </div>
              </div>
              <p className="rr-score-note">{perfect ? 'Every image. Every call. Spot on.' : `${score} ${score === 1 ? 'correct call' : 'correct calls'}. Every detail counts.`}</p>
            </div>

            <div className="rr-detail-panel">
              <motion.div className="rr-achievement"
                initial={allowMotion ? { opacity: 0, scale: 0.9 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: allowMotion ? 0.3 : 0, duration: allowMotion ? 0.45 : 0 }}>
                <div className="rr-medal" aria-hidden="true"><Trophy size={30} strokeWidth={1.4} /><Sparkles className="rr-medal-spark" size={13} /></div>
                <div><span className="rr-small-label">YOUR ACHIEVEMENT</span><h2>{achievement}</h2><p>{perfect ? 'Nothing got past you this time.' : strongRun ? 'A keen eye for the almost-real.' : 'A little more curious. A little harder to fool.'}</p></div>
              </motion.div>

              <div className="rr-breakdown-title"><span>THE BREAKDOWN</span><span>{total} {total === 1 ? 'ROUND' : 'ROUNDS'}</span></div>
              <dl className="rr-stats">
                <div className="rr-stat rr-stat--correct"><dt><Check size={15} strokeWidth={2} /> Correct</dt><dd>{state.correctCount}</dd></div>
                <div className="rr-stat rr-stat--incorrect"><dt><X size={15} strokeWidth={2} /> Incorrect</dt><dd>{incorrect}</dd></div>
                <div className="rr-stat rr-stat--timeout"><dt><Clock3 size={15} strokeWidth={1.7} /> Timeouts</dt><dd>{state.timeoutCount}</dd></div>
              </dl>

              <div className="rr-best"><span className="rr-best-icon"><Trophy size={17} strokeWidth={1.6} /></span><div><span>Personal best</span><small>Your highest score so far</small></div><strong>{bestScore}<span> pts</span></strong></div>
            </div>
          </motion.section>

          <motion.section className="rr-next" aria-label="Your next challenge" {...reveal(0.25)}>
            <div className="rr-next-copy"><h2>{nextTitle}</h2><p>{nextMessage}</p></div>
            <div className="rr-actions">
              <motion.button type="button" className="rr-primary" onClick={replay}
                whileHover={allowMotion ? { y: -2 } : undefined} whileTap={allowMotion ? { scale: 0.98 } : undefined}>
                <RotateCcw size={17} /><span>Play Again</span><ArrowRight size={17} />
              </motion.button>
              <button type="button" className="rr-secondary" onClick={home}><Home size={16} /> Back to Start</button>
            </div>
            {replayError && <p className="rr-error" role="alert">{replayError}</p>}
          </motion.section>
          <motion.p className="rr-signoff" {...reveal(0.35)}><span /><Focus size={12} /> Reality isn't always obvious. Your curiosity makes the difference.<span /></motion.p>
        </main>
      ) : (
        <main className="rr-empty">
          <span className="rr-empty-icon"><ScanEye size={46} strokeWidth={1.3} /></span>
          <p className="rr-eyebrow">YOUR NEXT CHALLENGE AWAITS</p>
          <h1>Let's see what<br />your eyes can do.</h1>
          <p>Complete a challenge to reveal your score and achievement.</p>
          <button type="button" className="rr-primary" onClick={home}>Back to Start <ArrowRight size={17} /></button>
        </main>
      )}

      <footer className="rr-footer"><span>BUILT FOR <strong>OPEN UNIVERSITY OPEN DAY 2026</strong></span><span>Human instinct. Artificial intelligence.</span></footer>
    </div>
  );
}

const resultStyles = String.raw`
.rr-page {
  --rr-accent: #84dfea; --rr-violet: #b499fa; --rr-text: #eff4ff;
  --rr-muted: #97a5be; --rr-border: #b0c7ff1c;
  position: relative; isolation: isolate; display: flex; flex-direction: column;
  min-height: 100vh; min-height: 100svh; width: 100%; overflow: hidden;
  background: #050914; color: var(--rr-text); color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}
.rr-page--perfect { --rr-accent: #f1d390; --rr-violet: #eeb978; }
.rr-page *, .rr-page *::before, .rr-page *::after { box-sizing: border-box; }
.rr-page h1, .rr-page h2, .rr-page p, .rr-page dl, .rr-page dd { margin: 0; }
.rr-page button { font: inherit; -webkit-tap-highlight-color: transparent; cursor: pointer; }
.rr-page button:focus-visible { outline: 3px solid var(--rr-accent); outline-offset: 5px; }
.rr-page svg { flex-shrink: 0; }
.rr-page .rr-ambient { position: absolute; z-index: -1; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 48% 13%, #2d326332, transparent 51%), radial-gradient(ellipse at 5% 52%, #008bae13, transparent 43%), radial-gradient(ellipse at 100% 64%, #7942c91c, transparent 44%); }
.rr-page--perfect .rr-ambient { background: radial-gradient(ellipse at 48% 18%, #8e643321, transparent 48%), radial-gradient(ellipse at 5% 60%, #008bae10, transparent 43%), radial-gradient(ellipse at 100% 64%, #7942c916, transparent 44%); }
.rr-page .rr-ambient::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(#91abc345 .6px, transparent .6px); background-size: 32px 32px; mask-image: linear-gradient(transparent, #000 38%, transparent 95%); }
.rr-page .rr-header { width: min(1280px, calc(100% - 88px)); min-height: 90px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid #b0c7ff0c; }
.rr-page .rr-brand { display: inline-flex; align-items: center; gap: 11px; padding: 0; border: 0; background: transparent; color: #eef3ff; font-size: 13px; letter-spacing: 1.7px; font-weight: 800; }
.rr-page .rr-brand-icon { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid #6bcfe22e; border-radius: 11px; color: #56e5f5; background: #14253466; }
.rr-page .rr-brand-slash { color: #56e5f5; margin: 0 2px; }
.rr-page .rr-header-right { display: flex; align-items: center; gap: 25px; }
.rr-page .rr-session { display: flex; align-items: center; gap: 8px; color: #a5b4ca; font: 9px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.4px; }
.rr-page .rr-session > span { width: 5px; height: 5px; border-radius: 50%; background: #7ce5ca; box-shadow: 0 0 9px #7ce5ca55; }
.rr-page .rr-sound { display: flex; align-items: center; }
.rr-page .rr-sound button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 40px; min-height: 40px; padding: 9px; background: #101a2b; border: 1px solid #c4d7ff21; border-radius: 12px; color: #c7d6eb; }
.rr-page .rr-main { flex: 1; width: min(980px, 100%); margin: 0 auto; padding: 39px 28px 29px; }
.rr-page .rr-intro { text-align: center; }
.rr-page .rr-eyebrow { display: inline-flex; align-items: center; gap: 7px; padding: 7px 11px; border: 1px solid #839cce2b; border-radius: 30px; background: #15203965; color: #b9c9e6; font-size: 8px; font-weight: 600; letter-spacing: 1.7px; }
.rr-page .rr-eyebrow svg { color: var(--rr-accent); }
.rr-page .rr-player { margin-top: 19px; color: #9dabc2; font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
.rr-page .rr-player strong { color: #d9e4f7; font-weight: 600; }
.rr-page h1 { margin: 9px auto 13px; max-width: 850px; color: #c1dcff; font-size: clamp(35px, 4.5vw, 61px); font-weight: 800; line-height: 1.08; letter-spacing: -.05em; text-wrap: balance; overflow-wrap: anywhere; background: linear-gradient(110deg, #f1f6ff 12%, #bce8ff 45%, #bda7ff 87%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.rr-page--perfect h1 { background-image: linear-gradient(110deg, #fff8e4 12%, #f6dc9e 52%, #eebd89 87%); }
.rr-page .rr-message { max-width: 600px; margin: 0 auto; color: #a0adc4; font-size: 13px; line-height: 1.8; text-wrap: balance; }
.rr-page .rr-report { position: relative; display: grid; grid-template-columns: .92fr 1.08fr; margin-top: 31px; border: 1px solid #829ed632; border-radius: 24px; background: linear-gradient(135deg, #122137c9, #10172ace 48%, #14132ace); box-shadow: 0 24px 80px #00000035, inset 0 1px #e2eaff08; }
.rr-page .rr-report::before { content: ''; position: absolute; height: 1px; left: 18%; right: 18%; top: -1px; background: linear-gradient(90deg, transparent, var(--rr-accent), var(--rr-violet), transparent); opacity: .55; }
.rr-page .rr-score-panel { position: relative; display: flex; flex-direction: column; align-items: center; padding: 25px 27px 26px; border-right: 1px solid var(--rr-border); }
.rr-page .rr-panel-label { width: 100%; display: flex; align-items: center; gap: 8px; color: #97a9c6; font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.3px; }
.rr-page .rr-panel-label > span:first-child { width: 4px; height: 4px; background: var(--rr-accent); border-radius: 50%; }
.rr-page .rr-label-line { flex: 1; height: 1px; margin-left: 3px; background: #a9c4ef17; }
.rr-page .rr-score-dial { position: relative; width: 272px; max-width: 100%; aspect-ratio: 1; margin-top: 17px; color: var(--rr-accent); }
.rr-page .rr-score-dial::before { content: ''; position: absolute; inset: 22px; border-radius: 50%; background: radial-gradient(circle, #5c86ba10, transparent 68%); box-shadow: 0 0 55px #72b9ff08; }
.rr-page--perfect .rr-score-dial::before { background: radial-gradient(circle, #e4b4560c, transparent 68%); }
.rr-page .rr-ring { position: absolute; width: 100%; height: 100%; overflow: visible; }
.rr-page .rr-dial-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.rr-page .rr-dial-content > svg { color: var(--rr-accent); opacity: .8; margin: 3px 0 8px; }
.rr-page .rr-score-number { display: flex; align-items: baseline; gap: 8px; font-variant-numeric: tabular-nums; line-height: 1; }
.rr-page .rr-score-number strong { color: #f3f7ff; font-size: 79px; font-weight: 700; letter-spacing: -6px; }
.rr-page .rr-score-number > span { color: #8595b2; font-size: 25px; font-weight: 300; }
.rr-page .rr-score-caption { margin-top: 12px; color: #92a4c0; font: 7px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.7px; }
.rr-page .rr-accuracy { display: inline-flex; gap: 5px; margin-top: 15px; padding: 5px 10px; border: 1px solid #a9c4ef1c; border-radius: 20px; color: var(--rr-accent); background: #080d1b66; font-size: 10px; font-weight: 600; }
.rr-page .rr-accuracy > span { color: #a1aec5; font-weight: 400; }
.rr-page .rr-score-note { margin-top: 9px; color: #9aaac2; font-size: 10px; line-height: 1.8; text-align: center; }
.rr-page .rr-detail-panel { display: flex; flex-direction: column; justify-content: center; padding: 30px; min-width: 0; }
.rr-page .rr-achievement { display: flex; align-items: center; gap: 16px; }
.rr-page .rr-medal { position: relative; flex-shrink: 0; display: grid; place-items: center; width: 65px; height: 72px; border: 1px solid #8bb9d637; border-radius: 19px 19px 26px 26px; color: var(--rr-accent); background: linear-gradient(140deg, #7bb9d319, #6477b008); box-shadow: inset 0 1px #d5eaff0c, 0 6px 22px #00000024; }
.rr-page--perfect .rr-medal { border-color: #edc67642; background: linear-gradient(140deg, #e8bc6b1c, #b18d5608); }
.rr-page .rr-medal::after { content: ''; position: absolute; inset: 5px; border: 1px solid #c1d8ff0d; border-radius: 14px 14px 21px 21px; }
.rr-page .rr-medal-spark { position: absolute; right: -5px; top: -5px; color: var(--rr-accent); }
.rr-page .rr-small-label { display: block; color: #8e9db8; font-size: 7px; font-weight: 500; letter-spacing: 1.8px; }
.rr-page .rr-achievement h2 { margin-top: 7px; color: var(--rr-accent); font-size: clamp(15px, 1.5vw, 19px); letter-spacing: 1px; line-height: 1.3; font-weight: 700; }
.rr-page .rr-achievement p { margin-top: 7px; color: #9eabc3; font-size: 10px; line-height: 1.8; }
.rr-page .rr-breakdown-title { display: flex; justify-content: space-between; gap: 12px; margin: 28px 0 11px; color: #8b9cba; font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.2px; }
.rr-page .rr-breakdown-title > span:last-child { color: #8595af; font-size: 7px; }
.rr-page .rr-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.rr-page .rr-stat { padding: 12px 10px; border: 1px solid #9dbbe51a; border-radius: 11px; background: #040b1847; }
.rr-page .rr-stat dt { display: flex; align-items: center; gap: 4px; color: #a2b0c8; font-size: 9px; }
.rr-page .rr-stat dt svg { width: 12px; height: 12px; }
.rr-page .rr-stat--correct dt svg { color: #73dcb9; }
.rr-page .rr-stat--incorrect dt svg { color: #e692a4; }
.rr-page .rr-stat--timeout dt svg { color: #ddbb80; }
.rr-page .rr-stat dd { margin-top: 9px; color: #e4ecfb; font-size: 28px; font-weight: 600; letter-spacing: -1px; line-height: 1.2; font-variant-numeric: tabular-nums; }
.rr-page .rr-best { display: flex; align-items: center; gap: 11px; padding-top: 19px; margin-top: 20px; border-top: 1px solid #a0b9e31a; }
.rr-page .rr-best-icon { display: grid; place-items: center; width: 33px; height: 33px; background: #ebc98409; border: 1px solid #e9ca9615; border-radius: 9px; color: #d4b982; }
.rr-page .rr-best > div > span { color: #c9d5e8; font-size: 11px; }
.rr-page .rr-best small { display: block; color: #8798b4; font-size: 9px; margin-top: 4px; }
.rr-page .rr-best > strong { margin-left: auto; color: #e9d7b1; font-size: 23px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
.rr-page .rr-best > strong > span { color: #94a1b7; font-size: 10px; font-weight: 400; }
.rr-page .rr-next { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; margin-top: 25px; padding: 0 2px; }
.rr-page .rr-next-copy { flex: 1 1 260px; }
.rr-page .rr-next h2 { color: #dce5f8; font-size: 15px; font-weight: 600; letter-spacing: -.25px; line-height: 1.5; }
.rr-page .rr-next-copy p { max-width: 400px; margin-top: 5px; color: #95a4bd; font-size: 10px; line-height: 1.8; }
.rr-page .rr-actions { display: flex; align-items: center; gap: 10px; }
.rr-page .rr-primary { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 47px; padding: 13px 19px; border: 1px solid #d8edff42; border-radius: 11px; background: linear-gradient(110deg, #a6e9ee, #a7c4ff 65%, #b9adf6); color: #111c30; font-size: 11px; font-weight: 750; box-shadow: 0 5px 24px #7ca4f518, inset 0 1px #ffffff44; transition: box-shadow .2s, filter .2s; }
.rr-page--perfect .rr-primary { background: linear-gradient(110deg, #f5dfaa, #e9c38a); border-color: #fff3d855; box-shadow: 0 5px 24px #deb67412; }
.rr-page .rr-primary:hover { box-shadow: 0 6px 30px #9abcf92c; filter: brightness(1.06); }
.rr-page .rr-primary > svg:last-child { margin-left: 5px; }
.rr-page .rr-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 47px; padding: 13px 14px; border: 1px solid #a5bce52b; border-radius: 11px; background: #111a2b73; color: #b2c0d9; font-size: 11px; transition: background .2s, color .2s; }
.rr-page .rr-secondary:hover { color: #eef4ff; background: #1d294080; }
.rr-page .rr-error { flex-basis: 100%; border: 1px solid #e692a437; border-radius: 10px; padding: 12px 15px; background: #e692a40a; color: #f0b8c5; font-size: 12px; line-height: 1.7; }
.rr-page .rr-signoff { display: flex; justify-content: center; align-items: center; gap: 9px; margin-top: 34px; color: #8c9bb5; text-align: center; font-size: 9px; line-height: 1.8; }
.rr-page .rr-signoff > span { width: 35px; height: 1px; background: #b0c7ff1a; }
.rr-page .rr-signoff > svg { color: #8fafd0; }
.rr-page .rr-footer { display: flex; justify-content: space-between; align-items: center; gap: 18px; width: min(1280px, calc(100% - 88px)); margin: auto auto 0; padding: 20px 0; border-top: 1px solid #c5d7ff0c; color: #8a99b1; font-size: 9px; letter-spacing: 1px; }
.rr-page .rr-footer strong { color: #aab9d1; font-weight: 500; }
.rr-page .rr-footer > span:last-child { font-size: 10px; letter-spacing: 0; }
.rr-page .rr-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 60px 24px; text-align: center; }
.rr-page .rr-empty h1 { margin: 0; }
.rr-page .rr-empty > p:not(.rr-eyebrow) { max-width: 420px; color: #9caec8; font-size: 14px; line-height: 1.8; }
.rr-page .rr-empty-icon { color: var(--rr-accent); margin-bottom: 8px; }
@media (min-width: 1450px) and (min-height: 950px) {
  .rr-page .rr-main { padding-top: 55px; }
  .rr-page .rr-report { margin-top: 37px; }
  .rr-page .rr-score-panel { padding-top: 29px; padding-bottom: 30px; }
  .rr-page .rr-next { margin-top: 30px; }
}
@media (max-width: 900px) {
  .rr-page .rr-header, .rr-page .rr-footer { width: calc(100% - 48px); }
  .rr-page .rr-detail-panel { padding: 25px 20px; }
  .rr-page .rr-score-panel { padding-right: 20px; padding-left: 20px; }
  .rr-page .rr-achievement { gap: 12px; }
  .rr-page .rr-medal { width: 52px; height: 61px; border-radius: 15px 15px 22px 22px; }
  .rr-page .rr-achievement h2 { font-size: 15px; letter-spacing: .6px; }
  .rr-page .rr-stats { gap: 6px; }
  .rr-page .rr-stat { padding: 11px 8px; }
  .rr-page .rr-stat dt { font-size: 8px; }
  .rr-page .rr-next { flex-direction: column; text-align: center; }
  .rr-page .rr-next-copy { flex: none; }
  .rr-page .rr-next-copy p { max-width: 500px; }
}
@media (max-width: 640px) {
  .rr-page .rr-header { min-height: 74px; width: calc(100% - 36px); }
  .rr-page .rr-brand { font-size: 11px; letter-spacing: 1px; gap: 9px; }
  .rr-page .rr-brand-icon { width: 34px; height: 34px; }
  .rr-page .rr-session { display: none; }
  .rr-page .rr-main { padding: 29px 18px 26px; }
  .rr-page .rr-player { margin-top: 16px; font-size: 12px; }
  .rr-page h1 { font-size: clamp(33px, 8vw, 46px); margin-top: 8px; }
  .rr-page .rr-message { max-width: 360px; font-size: 12px; }
  .rr-page .rr-report { grid-template-columns: 1fr; margin-top: 24px; border-radius: 21px; }
  .rr-page .rr-score-panel { border-right: 0; border-bottom: 1px solid var(--rr-border); padding: 19px 22px 18px; }
  .rr-page .rr-panel-label { font-size: 7px; letter-spacing: 1.2px; }
  .rr-page .rr-score-dial { width: 232px; margin-top: 12px; }
  .rr-page .rr-score-number strong { font-size: 67px; letter-spacing: -4px; }
  .rr-page .rr-score-number > span { font-size: 23px; }
  .rr-page .rr-dial-content > svg { width: 22px; height: 22px; margin-bottom: 5px; }
  .rr-page .rr-score-caption { font-size: 6px; margin-top: 10px; }
  .rr-page .rr-accuracy { margin-top: 12px; font-size: 9px; }
  .rr-page .rr-score-note { margin-top: 7px; }
  .rr-page .rr-detail-panel { padding: 23px 22px; }
  .rr-page .rr-achievement { gap: 15px; }
  .rr-page .rr-achievement h2 { font-size: 17px; }
  .rr-page .rr-breakdown-title { margin-top: 23px; }
  .rr-page .rr-stats { gap: 8px; }
  .rr-page .rr-stat { padding: 12px; }
  .rr-page .rr-stat dt { font-size: 9px; }
  .rr-page .rr-stat dd { font-size: 27px; }
  .rr-page .rr-best { padding-top: 16px; margin-top: 17px; }
  .rr-page .rr-next { margin-top: 23px; gap: 18px; }
  .rr-page .rr-next h2 { font-size: 15px; }
  .rr-page .rr-next-copy p { font-size: 11px; }
  .rr-page .rr-actions { width: 100%; }
  .rr-page .rr-primary { flex: 1.1; min-height: 49px; padding: 13px 12px; }
  .rr-page .rr-secondary { flex: 1; min-height: 49px; padding: 13px 10px; }
  .rr-page .rr-signoff { margin-top: 25px; font-size: 8px; gap: 7px; }
  .rr-page .rr-signoff > span { display: none; }
  .rr-page .rr-footer { width: calc(100% - 36px); font-size: 8px; gap: 12px; }
  .rr-page .rr-footer > span:last-child { font-size: 8px; }
  .rr-page .rr-empty .rr-primary { flex: none; }
}
@media (max-width: 360px) {
  .rr-page .rr-main { padding-left: 12px; padding-right: 12px; }
  .rr-page .rr-detail-panel { padding: 20px 15px; }
  .rr-page .rr-achievement h2 { font-size: 15px; }
  .rr-page .rr-stat { padding: 10px 8px; }
  .rr-page .rr-actions { flex-direction: column; }
  .rr-page .rr-actions button { width: 100%; }
  .rr-page .rr-footer { flex-direction: column; gap: 8px; }
}
/* Readable supporting text at every viewport size. */
.rr-page .rr-session { font-size: 11px; }
.rr-page .rr-eyebrow { font-size: 10px; }
.rr-page .rr-panel-label { font-size: 10px; }
.rr-page .rr-score-caption { font-size: 9px; }
.rr-page .rr-accuracy { font-size: 12px; }
.rr-page .rr-score-note { font-size: 12px; }
.rr-page .rr-small-label { font-size: 10px; }
.rr-page .rr-achievement p { font-size: 12px; }
.rr-page .rr-breakdown-title,
.rr-page .rr-breakdown-title > span:last-child { font-size: 10px; }
.rr-page .rr-stat dt { font-size: 11px; }
.rr-page .rr-best > div > span { font-size: 12px; }
.rr-page .rr-best small { font-size: 11px; }
.rr-page .rr-best > strong > span { font-size: 12px; }
.rr-page .rr-next-copy p { font-size: 12px; }
.rr-page .rr-primary,
.rr-page .rr-secondary { font-size: 13px; }
.rr-page .rr-signoff { font-size: 11px; }
.rr-page .rr-footer,
.rr-page .rr-footer > span:last-child { font-size: 11px; }
@media (max-width: 640px) {
  .rr-page .rr-brand { font-size: 12px; }
  .rr-page .rr-player,
  .rr-page .rr-message { font-size: 13px; }
  .rr-page .rr-panel-label { font-size: 10px; }
  .rr-page .rr-score-caption { font-size: 10px; }
  .rr-page .rr-accuracy { font-size: 11px; }
  .rr-page .rr-signoff,
  .rr-page .rr-footer,
  .rr-page .rr-footer > span:last-child { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .rr-page *, .rr-page *::before, .rr-page *::after { animation: none !important; transition: none !important; }
}
`;
