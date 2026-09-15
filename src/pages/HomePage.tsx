import { ArrowRight, Camera, Clock3, Cpu, Focus, Layers3, ScanEye, Sparkles, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../app/providers/GameContext';
import { SoundToggle } from '../components/common/SoundToggle';
import { gameConfig } from '../config/gameConfig';
import { playSound } from '../services/audio/gameAudio';

/** Complete replacement: styles are scoped to this page; no extra assets needed. */
export function HomePage() {
  const navigate = useNavigate();
  const { state, resetSession } = useGame();
  const reducedMotion = useReducedMotion();

  const start = () => {
    playSound('click', state.soundEnabled);
    resetSession();
    navigate('/player');
  };

  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : delay },
  });

  return (
    <div className="rc-home">
      <style>{homeStyles}</style>
      <div className="rc-ambient" aria-hidden="true" />

      <header className="rc-header">
        <Link className="rc-brand" to="/" aria-label="Reality Check home">
          <span className="rc-brand-icon"><Focus size={22} strokeWidth={1.7} /></span>
          <span>REALITY<span className="rc-brand-slash">//</span>CHECK</span>
        </Link>
        <div className="rc-header-right">
          <span className="rc-event"><span /> OPEN DAY 2026</span>
          <div className="rc-sound"><SoundToggle /></div>
        </div>
      </header>

      <main className="rc-main">
        <motion.div className="rc-intro" {...reveal()}>
          <div className="rc-eyebrow"><Sparkles size={13} /> A GAME OF HUMAN INSTINCT</div>
          <h1>Think you can<br /><span>spot the AI?</span></h1>
          <p className="rc-subtitle">Reality is getting harder to recognize.<br className="rc-mobile-break" /> Put your eyes to the test.</p>
        </motion.div>

        <motion.section className="rc-arena" aria-label="Start the Real or AI challenge" {...reveal(0.12)}>
          <div className="rc-arena-grid" aria-hidden="true" />
          <span className="rc-axis-label rc-axis-label--left" aria-hidden="true">OBSERVE / QUESTION / DECIDE</span>
          <span className="rc-axis-label rc-axis-label--right" aria-hidden="true">HUMAN INTUITION REQUIRED</span>

          <div className="rc-choice rc-choice--real" aria-hidden="true">
            <div className="rc-choice-top"><Camera size={16} /><span>01 / CAPTURED</span><i /></div>
            <div className="rc-landscape rc-landscape--real">
              <svg viewBox="0 0 240 138" fill="none" focusable="false">
                <circle cx="171" cy="36" r="16" fill="currentColor" opacity=".7" />
                <path d="M0 103 48 48 96 98 131 67 198 125 240 87V138H0Z" fill="currentColor" opacity=".14" />
                <path d="m0 121 66-74 64 76 43-31 67 40" stroke="currentColor" strokeWidth="1.2" opacity=".8" />
                <path d="m48 67 18-20 19 23-19-8-8 9Z" fill="currentColor" opacity=".5" />
                <path d="M0 133h240M15 138l48-11 51 7 53-8 48 12" stroke="currentColor" opacity=".2" />
              </svg>
              <span className="rc-image-corner rc-image-corner--tl" /><span className="rc-image-corner rc-image-corner--br" />
            </div>
            <div className="rc-choice-bottom"><div><span>THE WORLD AS IT IS</span><strong>Real.</strong></div><span className="rc-choice-symbol">↗</span></div>
          </div>

          <div className="rc-launch-wrap">
            <div className="rc-orbit rc-orbit--outer" aria-hidden="true"><i /></div>
            <div className="rc-orbit rc-orbit--inner" aria-hidden="true" />
            <span className="rc-orbit-dot" aria-hidden="true" />
            <motion.button
              type="button"
              className="rc-launch"
              onClick={start}
              whileHover={reducedMotion ? undefined : { scale: 1.035 }}
              whileTap={reducedMotion ? undefined : { scale: 0.975 }}
              aria-label="Start the Real or AI challenge"
            >
              <span className="rc-launch-kicker">TRUST YOUR INSTINCT</span>
              <span className="rc-launch-icon"><ScanEye size={52} strokeWidth={1.15} /></span>
              <span className="rc-launch-title">Real <em>or</em> AI?</span>
              <span className="rc-launch-action">Start Challenge <ArrowRight size={17} /></span>
            </motion.button>
            <span className="rc-launch-caption"><span /> YOUR EYES. YOUR CALL.</span>
          </div>

          <div className="rc-choice rc-choice--ai" aria-hidden="true">
            <div className="rc-choice-top"><Cpu size={16} /><span>02 / GENERATED</span><i /></div>
            <div className="rc-landscape rc-landscape--ai">
              <svg viewBox="0 0 240 138" fill="none" focusable="false">
                <path d="m120 19 56 32v64l-56 23-56-23V51Z" fill="currentColor" opacity=".07" />
                <path d="m120 19 56 32v64l-56 23-56-23V51l56-32Zm0 0v64m56-32-56 32-56-32m56 32v55" stroke="currentColor" strokeWidth="1.2" opacity=".85" />
                <path d="m120 38 39 23v44l-39 17-39-17V61l39-23Zm-39 23 39 23 39-23m-65 7v42m52-42v42M120 38v84M64 73l56 28 56-28M64 94l56 27 56-27" stroke="currentColor" opacity=".25" />
                <path d="M25 24v10m-5-5h10m178 71v10m-5-5h10M187 24h4M34 107h4" stroke="currentColor" opacity=".7" />
                <circle cx="120" cy="19" r="3" fill="currentColor" /><circle cx="176" cy="115" r="3" fill="currentColor" /><circle cx="64" cy="51" r="3" fill="currentColor" />
              </svg>
              <span className="rc-image-corner rc-image-corner--tl" /><span className="rc-image-corner rc-image-corner--br" />
            </div>
            <div className="rc-choice-bottom"><div><span>THE WORLD REIMAGINED</span><strong>AI.</strong></div><span className="rc-choice-symbol">✳</span></div>
          </div>
        </motion.section>

        <motion.div className="rc-below" {...reveal(0.24)}>
          <p className="rc-best"><Trophy size={14} />
            {state.bestScore > 0
              ? <>Your personal best <strong>{state.bestScore}<span> / {gameConfig.totalRounds}</span></strong></>
              : <>Fresh eyes. A clean slate. <strong>Make your first call.</strong></>}
          </p>

          <div className="rc-facts" aria-label="How the challenge works">
            <article className="rc-fact">
              <span className="rc-fact-icon rc-fact-icon--cyan"><Layers3 size={21} strokeWidth={1.6} /></span>
              <div><h2>{gameConfig.totalRounds} rounds</h2><p>A new image. A new mystery.</p></div>
              <span className="rc-fact-index" aria-hidden="true">01</span>
            </article>
            <article className="rc-fact">
              <span className="rc-fact-icon rc-fact-icon--blue"><Clock3 size={21} strokeWidth={1.6} /></span>
              <div><h2>{gameConfig.roundDurationSeconds} seconds each</h2><p>Look closer. Decide in time.</p></div>
              <span className="rc-fact-index" aria-hidden="true">02</span>
            </article>
            <article className="rc-fact">
              <span className="rc-fact-icon rc-fact-icon--purple"><ScanEye size={21} strokeWidth={1.6} /></span>
              <div><h2>Real or AI?</h2><p>Two possibilities. One choice.</p></div>
              <span className="rc-fact-index" aria-hidden="true">03</span>
            </article>
          </div>
          <p className="rc-how">Inspect the image <span>→</span> Choose real or AI <span>→</span> Discover the answer</p>
        </motion.div>
      </main>

      <footer className="rc-footer"><span>BUILT FOR <strong>OPEN UNIVERSITY OPEN DAY 2026</strong></span><span>Seeing isn't always believing.<Focus size={13} /></span></footer>
    </div>
  );
}

const homeStyles = String.raw`
.rc-home {
  --rc-bg: #050914;
  --rc-text: #f2f5ff;
  --rc-muted: #97a5be;
  --rc-cyan: #56e5f5;
  --rc-purple: #b58bff;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background: var(--rc-bg);
  color: var(--rc-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  color-scheme: dark;
}
.rc-home *, .rc-home *::before, .rc-home *::after { box-sizing: border-box; }
.rc-home h1, .rc-home h2, .rc-home p { margin: 0; }
.rc-home button, .rc-home a { -webkit-tap-highlight-color: transparent; }
.rc-home button { font: inherit; }
.rc-home a { color: inherit; text-decoration: none; }
.rc-home svg { flex-shrink: 0; }
.rc-home button:focus-visible, .rc-home a:focus-visible { outline: 3px solid #8becff; outline-offset: 7px; }
.rc-home .rc-ambient {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 40%, #17255350 0%, transparent 46%),
    radial-gradient(ellipse at 0% 56%, #00b9d313 0%, transparent 43%),
    radial-gradient(ellipse at 100% 66%, #8437d91c 0%, transparent 43%);
}
.rc-home .rc-ambient::after {
  content: ''; position: absolute; inset: 0; opacity: .15;
  background-image: radial-gradient(#90abd1 0.6px, transparent 0.6px);
  background-size: 36px 36px;
  mask-image: linear-gradient(transparent, #000 35%, transparent 88%);
}
.rc-home .rc-header {
  width: min(1280px, calc(100% - 88px)); margin: 0 auto; min-height: 94px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  border-bottom: 1px solid #c5d7ff0c;
}
.rc-home .rc-brand { display: inline-flex; align-items: center; gap: 11px; font-size: 13px; letter-spacing: 1.7px; font-weight: 800; }
.rc-home .rc-brand-icon { color: var(--rc-cyan); display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid #6bcfe22e; border-radius: 11px; background: #14253466; }
.rc-home .rc-brand-slash { color: var(--rc-cyan); margin: 0 2px; }
.rc-home .rc-header-right { display: flex; align-items: center; gap: 26px; }
.rc-home .rc-event { display: inline-flex; align-items: center; gap: 8px; color: #a9b6cb; font: 10px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.5px; }
.rc-home .rc-event > span, .rc-home .rc-launch-caption > span { width: 5px; height: 5px; border-radius: 50%; background: #66e5cb; box-shadow: 0 0 10px #66e5cb60; }
.rc-home .rc-sound { display: flex; align-items: center; }
.rc-home .rc-sound button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 40px; min-height: 40px; padding: 9px; background: #101a2b; border: 1px solid #c4d7ff21; border-radius: 12px; color: #c7d6eb; cursor: pointer; }
.rc-home .rc-main { flex: 1; width: min(1120px, 100%); margin: 0 auto; padding: 46px 28px 35px; }
.rc-home .rc-intro { position: relative; z-index: 1; text-align: center; }
.rc-home .rc-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 13px; border: 1px solid #7989e12e; border-radius: 30px; background: #15203e66; color: #b6c3e9; font-size: 9px; font-weight: 600; letter-spacing: 2px; }
.rc-home .rc-eyebrow svg { color: #b8a4ff; }
.rc-home h1 { margin: 20px 0 17px; font-size: clamp(48px, 5.8vw, 82px); font-weight: 800; line-height: 1.045; letter-spacing: -.055em; }
.rc-home h1 > span { color: #89baff; background: linear-gradient(105deg, #50e5f5 5%, #639aff 43%, #a17aff 73%, #d995ef 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.rc-home .rc-subtitle { color: #a7b3c9; font-size: 15px; line-height: 1.8; letter-spacing: .1px; }
.rc-home .rc-mobile-break { display: none; }
.rc-home .rc-arena { position: relative; display: flex; align-items: center; justify-content: center; gap: 66px; min-height: 366px; margin: 9px auto 0; }
.rc-home .rc-arena-grid {
  position: absolute; inset: 35px -20px 20px; pointer-events: none;
  background: linear-gradient(#92b7ed09 1px, transparent 1px), linear-gradient(90deg, #92b7ed09 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse, #000 5%, transparent 69%);
}
.rc-home .rc-arena::after { content: ''; position: absolute; z-index: -1; left: 12%; right: 12%; top: 49%; height: 1px; background: linear-gradient(90deg, transparent, #55d8f042 22%, #957cff60 76%, transparent); }
.rc-home .rc-axis-label { position: absolute; top: 49%; color: #8191b4; font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.8px; writing-mode: vertical-rl; }
.rc-home .rc-axis-label--left { left: 0; transform: translateY(-50%) rotate(180deg); }
.rc-home .rc-axis-label--right { right: 0; transform: translateY(-50%); }
.rc-home .rc-choice { position: relative; width: 206px; flex-shrink: 0; padding: 15px; border: 1px solid #75d9ed36; border-radius: 19px; background: linear-gradient(145deg, #122638e6, #091220f5 75%); box-shadow: 0 25px 50px #00000038, inset 0 1px #ffffff07; color: #6fdfed; transform: rotate(-8deg) translateY(3px); animation: rc-float-real 7s ease-in-out infinite; }
.rc-home .rc-choice--ai { color: #b69bff; border-color: #ab87ff3d; background: linear-gradient(145deg, #211d3ae6, #101122f5 75%); transform: rotate(8deg) translateY(3px); animation: rc-float-ai 8s ease-in-out infinite; }
.rc-home .rc-choice-top { display: flex; align-items: center; gap: 8px; margin-bottom: 13px; }
.rc-home .rc-choice-top > span { font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1px; }
.rc-home .rc-choice-top > i { margin-left: auto; width: 4px; height: 4px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
.rc-home .rc-landscape { position: relative; display: grid; place-items: center; height: 116px; overflow: hidden; background: radial-gradient(ellipse at 60% 70%, #2ca8b415, transparent), #050d1899; border: 1px solid #81c6e214; border-radius: 8px; }
.rc-home .rc-landscape--ai { background: radial-gradient(ellipse, #8c55f218, transparent), #0a091999; border-color: #b592f817; }
.rc-home .rc-landscape svg { width: 100%; height: 100%; }
.rc-home .rc-image-corner { position: absolute; width: 10px; height: 10px; opacity: .65; }
.rc-home .rc-image-corner--tl { left: 7px; top: 7px; border-left: 1px solid; border-top: 1px solid; }
.rc-home .rc-image-corner--br { right: 7px; bottom: 7px; border-right: 1px solid; border-bottom: 1px solid; }
.rc-home .rc-choice-bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 17px; }
.rc-home .rc-choice-bottom > div > span { display: block; font-size: 7px; letter-spacing: 1.3px; color: #97aec2; }
.rc-home .rc-choice-bottom strong { display: block; color: #e1f8ff; font-size: 34px; line-height: 1.2; letter-spacing: -1.5px; margin-top: 4px; font-weight: 650; }
.rc-home .rc-choice--ai .rc-choice-bottom strong { color: #eee5ff; }
.rc-home .rc-choice-symbol { font-size: 27px; line-height: 1.3; font-weight: 300; }
.rc-home .rc-launch-wrap { position: relative; width: 250px; height: 250px; flex-shrink: 0; display: grid; place-items: center; }
.rc-home .rc-launch-wrap::before { content: ''; position: absolute; inset: -75px; border-radius: 50%; background: radial-gradient(circle, #6777fc1c, #3889da0b 48%, transparent 70%); pointer-events: none; }
.rc-home .rc-orbit { position: absolute; border-radius: 50%; pointer-events: none; }
.rc-home .rc-orbit--outer { inset: -30px; border: 1px solid #8296d422; animation: rc-orbit-turn 32s linear infinite; }
.rc-home .rc-orbit--outer::before { content: ''; position: absolute; inset: -1px; border: 1px solid transparent; border-top-color: #73d9f480; border-bottom-color: #a786ff70; border-radius: 50%; transform: rotate(-35deg); }
.rc-home .rc-orbit--outer > i { position: absolute; top: 44px; right: 44px; width: 6px; height: 6px; border-radius: 50%; background: #8fe5ff; box-shadow: 0 0 15px #63d2ff; }
.rc-home .rc-orbit--inner { inset: -15px; border: 1px dashed #8a9fe230; }
.rc-home .rc-orbit-dot { position: absolute; left: -8px; bottom: 3px; width: 5px; height: 5px; border-radius: 50%; background: #b089ff; box-shadow: 0 0 14px #a077ff; }
.rc-home .rc-launch {
  position: relative; width: 250px; height: 250px; display: flex; align-items: center; justify-content: center; flex-direction: column;
  padding: 26px 14px; border: 1px solid transparent; border-radius: 50%; cursor: pointer;
  color: #f1f5ff;
  background: linear-gradient(145deg, #15283e, #101a35 48%, #19142e) padding-box, linear-gradient(135deg, #80e7f7b3, #719aff66 42%, #ad7df6a6) border-box;
  box-shadow: inset 0 0 30px #82a4ff09, 0 0 35px #5683e51a, 0 18px 65px #00000055;
  transition: box-shadow .25s;
}
.rc-home .rc-launch::before { content: ''; position: absolute; inset: 7px; border: 1px solid #92a8da12; border-radius: 50%; pointer-events: none; }
.rc-home .rc-launch:hover { box-shadow: inset 0 0 36px #82a4ff16, 0 0 55px #648bff30, 0 18px 65px #00000055; }
.rc-home .rc-launch-kicker { color: #a8bad8; font-size: 7px; font-weight: 600; letter-spacing: 2px; }
.rc-home .rc-launch-icon { display: flex; margin: 18px 0 9px; color: #9fe9ff; filter: drop-shadow(0 0 13px #6bb4ff60); }
.rc-home .rc-launch-title { font-size: 29px; font-weight: 750; letter-spacing: -1px; line-height: 1.2; }
.rc-home .rc-launch-title em { font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #a8aec9; margin: 0 2px; }
.rc-home .rc-launch-action { display: flex; align-items: center; gap: 10px; margin-top: 16px; color: #c8d9f5; font-size: 11px; font-weight: 600; }
.rc-home .rc-launch-action svg { color: #8addf4; transition: transform .2s; }
.rc-home .rc-launch:hover .rc-launch-action svg { transform: translateX(3px); }
.rc-home .rc-launch-caption { position: absolute; top: calc(100% + 41px); display: flex; align-items: center; gap: 7px; white-space: nowrap; color: #93a2bf; font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 1.6px; }
.rc-home .rc-launch-caption > span { width: 4px; height: 4px; }
.rc-home .rc-below { position: relative; z-index: 1; }
.rc-home .rc-best { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 7px; color: #95a3bc; font-size: 11px; line-height: 1.8; margin: 13px 0 25px; }
.rc-home .rc-best > svg { color: #c3a777; margin-right: 2px; }
.rc-home .rc-best strong { color: #d0daed; font-weight: 500; }
.rc-home .rc-best strong > span { color: #8695b0; }
.rc-home .rc-facts { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rc-home .rc-fact { position: relative; display: flex; align-items: center; gap: 13px; padding: 20px 18px; min-width: 0; border: 1px solid #8098d226; border-radius: 14px; background: linear-gradient(130deg, #13213b8c, #0d14268c); }
.rc-home .rc-fact-icon { width: 42px; height: 42px; flex-shrink: 0; display: grid; place-items: center; border-radius: 12px; }
.rc-home .rc-fact-icon--cyan { color: #5adbed; background: #2dc8e412; }
.rc-home .rc-fact-icon--blue { color: #84b4ff; background: #6295fa14; }
.rc-home .rc-fact-icon--purple { color: #b9a0ff; background: #a378f615; }
.rc-home .rc-fact h2 { font-size: 13px; font-weight: 600; line-height: 1.5; letter-spacing: -.15px; }
.rc-home .rc-fact p { margin-top: 4px; color: #94a2bc; font-size: 10px; line-height: 1.6; }
.rc-home .rc-fact-index { position: absolute; right: 11px; top: 9px; color: #7b90b352; font: 8px ui-monospace, SFMono-Regular, Consolas, monospace; }
.rc-home .rc-how { display: flex; align-items: center; justify-content: center; gap: 13px; margin-top: 20px; color: #99a6bd; font-size: 10px; line-height: 1.8; }
.rc-home .rc-how > span { color: #526787; }
.rc-home .rc-footer { display: flex; justify-content: space-between; align-items: center; gap: 18px; width: min(1280px, calc(100% - 88px)); margin: auto auto 0; padding: 20px 0; border-top: 1px solid #c5d7ff0c; color: #8a99b1; font-size: 9px; letter-spacing: 1px; }
.rc-home .rc-footer strong { color: #aab9d1; font-weight: 500; }
.rc-home .rc-footer > span:last-child { display: flex; align-items: center; gap: 13px; font-size: 10px; letter-spacing: 0; }
.rc-home .rc-footer svg { color: #739ab7; }
@keyframes rc-orbit-turn { to { transform: rotate(360deg); } }
@keyframes rc-float-real { 0%, 100% { transform: rotate(-8deg) translateY(3px); } 50% { transform: rotate(-6deg) translateY(-5px); } }
@keyframes rc-float-ai { 0%, 100% { transform: rotate(8deg) translateY(3px); } 50% { transform: rotate(6deg) translateY(-6px); } }
@media (min-width: 1500px) and (min-height: 950px) {
  .rc-home .rc-main { padding-top: 58px; }
  .rc-home .rc-arena { margin-top: 22px; min-height: 400px; }
}
@media (max-width: 1000px) {
  .rc-home .rc-arena { gap: 42px; }
  .rc-home .rc-choice { width: 180px; padding: 13px; }
  .rc-home .rc-axis-label { display: none; }
  .rc-home .rc-fact { padding: 18px 13px; gap: 10px; }
}
@media (max-width: 760px) {
  .rc-home .rc-header { width: calc(100% - 36px); min-height: 76px; }
  .rc-home .rc-header-right { gap: 12px; }
  .rc-home .rc-event { display: none; }
  .rc-home .rc-brand { font-size: 11px; letter-spacing: 1px; gap: 9px; }
  .rc-home .rc-brand-icon { width: 34px; height: 34px; }
  .rc-home .rc-main { padding: 35px 20px 28px; }
  .rc-home h1 { font-size: clamp(46px, 9vw, 66px); }
  .rc-home .rc-subtitle { font-size: 13px; }
  .rc-home .rc-arena { min-height: 340px; gap: 24px; }
  .rc-home .rc-choice { width: 140px; padding: 11px; border-radius: 14px; }
  .rc-home .rc-choice-top { gap: 5px; }
  .rc-home .rc-choice-top > span { font-size: 6px; letter-spacing: .2px; }
  .rc-home .rc-choice-top svg { width: 12px; }
  .rc-home .rc-landscape { height: 84px; }
  .rc-home .rc-choice-bottom > div > span { font-size: 5px; letter-spacing: .5px; }
  .rc-home .rc-choice-bottom strong { font-size: 28px; }
  .rc-home .rc-launch-wrap, .rc-home .rc-launch { width: 214px; height: 214px; }
  .rc-home .rc-orbit--outer { inset: -21px; }
  .rc-home .rc-orbit--inner { inset: -11px; }
  .rc-home .rc-launch-caption { top: calc(100% + 33px); }
  .rc-home .rc-launch-icon { margin-top: 13px; }
  .rc-home .rc-launch-icon svg { width: 44px; height: 44px; }
  .rc-home .rc-launch-title { font-size: 26px; }
  .rc-home .rc-launch-kicker { font-size: 6px; }
  .rc-home .rc-facts { gap: 8px; }
  .rc-home .rc-fact { flex-direction: column; text-align: center; padding: 16px 8px; gap: 10px; }
  .rc-home .rc-fact h2 { font-size: 11px; }
  .rc-home .rc-fact p { font-size: 9px; }
  .rc-home .rc-footer { width: calc(100% - 36px); font-size: 8px; }
}
@media (max-width: 600px) {
  .rc-home .rc-mobile-break { display: block; }
  .rc-home .rc-eyebrow { font-size: 8px; letter-spacing: 1.4px; }
  .rc-home .rc-arena { min-height: 318px; margin-top: 14px; }
  .rc-home .rc-choice { position: absolute; width: 116px; padding: 9px; opacity: .55; top: 89px; }
  .rc-home .rc-choice--real { left: -38px; }
  .rc-home .rc-choice--ai { right: -38px; }
  .rc-home .rc-choice-top > span { font-size: 5px; }
  .rc-home .rc-choice-top > i { display: none; }
  .rc-home .rc-landscape { height: 68px; }
  .rc-home .rc-choice-bottom { margin-top: 9px; }
  .rc-home .rc-choice-bottom > div > span { display: none; }
  .rc-home .rc-launch-wrap { z-index: 2; }
  .rc-home .rc-best { font-size: 10px; margin: 7px 0 22px; gap: 5px; }
  .rc-home .rc-how { gap: 7px; font-size: 8px; flex-wrap: wrap; }
  .rc-home .rc-footer { padding: 17px 0; }
  .rc-home .rc-footer > span:last-child { font-size: 8px; }
  .rc-home .rc-footer svg { display: none; }
}
@media (max-width: 360px) {
  .rc-home .rc-main { padding-right: 14px; padding-left: 14px; }
  .rc-home h1 { font-size: 43px; }
  .rc-home .rc-choice { opacity: .3; }
  .rc-home .rc-facts { grid-template-columns: 1fr; }
  .rc-home .rc-fact { flex-direction: row; text-align: left; padding: 12px 16px; }
  .rc-home .rc-fact h2 { font-size: 12px; }
  .rc-home .rc-fact p { font-size: 10px; }
  .rc-home .rc-footer { flex-direction: column; gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .rc-home *, .rc-home *::before, .rc-home *::after { animation: none !important; transition: none !important; }
}
`;
