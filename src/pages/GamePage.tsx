import { LogOut, Sparkles, Target } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGame } from '../app/providers/GameContext';
import { PageFrame } from '../components/common/PageFrame';
import { SoundToggle } from '../components/common/SoundToggle';
import { AnswerButtons } from '../components/game/AnswerButtons';
import { CircularTimer } from '../components/game/CircularTimer';
import { GameImage } from '../components/game/GameImage';
import { RevealPanel } from '../components/game/RevealPanel';
import { gameConfig } from '../config/gameConfig';
import { useRoundTimer } from '../hooks/useRoundTimer';
import { playSound } from '../services/audio/gameAudio';

export function GamePage() {
  const navigate = useNavigate();

  const {
    state,
    answer,
    timeOut,
    nextRound,
    finishGame,
    resetSession,
  } = useGame();

  const image = state.rounds[state.currentRoundIndex];
  const nextImage = state.rounds[state.currentRoundIndex + 1];

  const lastTick = useRef<number | null>(null);
  const actionInProgress = useRef(false);

  const handleTimeout = useCallback(() => {
    playSound('timeout', state.soundEnabled);
    timeOut();
  }, [state.soundEnabled, timeOut]);

  const remaining = useRoundTimer(
    gameConfig.roundDurationSeconds,
    state.phase === 'playing',
    image?.id ?? 'none',
    handleTimeout,
  );

  useEffect(() => {
    const shouldPlayWarningTick =
      state.phase === 'playing' &&
      remaining <= gameConfig.warningSeconds &&
      remaining > 0 &&
      lastTick.current !== remaining;

    if (shouldPlayWarningTick) {
      lastTick.current = remaining;
      playSound('tick', state.soundEnabled);
    }
  }, [remaining, state.phase, state.soundEnabled]);

  /*
   * If the player directly visits /play, refreshes after the game state
   * has been cleared, or exits while this page is still mounted,
   * redirect to the home page instead of rendering a blank screen.
   */
  if (!image) {
    return <Navigate to="/" replace />;
  }

  const submitAnswer = (value: 'real' | 'ai') => {
    if (state.phase !== 'playing' || actionInProgress.current) {
      return;
    }

    const correct = value === image.answer;

    playSound(
      correct ? 'correct' : 'incorrect',
      state.soundEnabled,
    );

    answer(value);
  };

  const continueGame = () => {
    if (actionInProgress.current) {
      return;
    }

    const isFinalRound =
      state.currentRoundIndex === state.rounds.length - 1;

    if (isFinalRound) {
      actionInProgress.current = true;

      playSound('result', state.soundEnabled);
      finishGame();
      navigate('/results');

      return;
    }

    playSound('transition', state.soundEnabled);

    lastTick.current = null;
    nextRound();
  };

  const exit = () => {
    if (actionInProgress.current) {
      return;
    }

    actionInProgress.current = true;

    playSound('click', state.soundEnabled);

    /*
     * Reset and navigate in the same React event.
     * Do not use setTimeout here because it can clear the rounds
     * while GamePage is still mounted, causing a blank screen.
     */
    resetSession();
    navigate('/', { replace: true });
  };

  const completedRounds =
    state.currentRoundIndex +
    (state.phase === 'revealed' ? 1 : 0);

  const progressPercentage =
    state.rounds.length > 0
      ? Math.round(
          (completedRounds / state.rounds.length) * 100,
        )
      : 0;

  return (
    <PageFrame className="game-page">
      <header className="game-hud">
        <div className="hud-player">
          <span>Player</span>
          <strong>{state.playerName}</strong>
        </div>

        <div className="hud-progress">
          <div>
            <span>
              ROUND {state.currentRoundIndex + 1} /{' '}
              {state.rounds.length}
            </span>

            <strong>{progressPercentage}%</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Challenge progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
          >
            <span
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="hud-actions">
          <div className="hud-score">
            <Target size={17} />
            <span>Score</span>
            <strong>{state.score}</strong>
          </div>

          <SoundToggle compact />

          <button
            type="button"
            className="icon-button icon-button--compact"
            onClick={exit}
            aria-label="Exit game"
            title="Exit game"
          >
            <LogOut size={19} />
          </button>
        </div>
      </header>

      <section className="game-stage">
        <div className="challenge-header">
          <div>
            <h1>Real photo or AI?</h1>
          </div>

          <CircularTimer remaining={remaining} />
        </div>

        <GameImage
          image={image}
          nextImage={nextImage}
        />

        {state.reveal ? (
          <RevealPanel
            reveal={state.reveal}
            image={image}
            score={state.score}
            isFinal={
              state.currentRoundIndex ===
              state.rounds.length - 1
            }
            onContinue={continueGame}
          />
        ) : (
          <div className="answer-zone">
            <p>
              <Sparkles size={15} />
              Lock in your answer
            </p>

            <AnswerButtons
              disabled={state.phase !== 'playing'}
              onAnswer={submitAnswer}
            />
          </div>
        )}
      </section>
    </PageFrame>
  );
}