import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useGame } from '../providers/GameContext';
import { GamePage } from '../../pages/GamePage';
import { HomePage } from '../../pages/HomePage';
import { PlayerPage } from '../../pages/PlayerPage';
import { ResultPage } from '../../pages/ResultPage';

function PlayGuard() {
  const { state } = useGame();
  if (!state.playerName) return <Navigate to="/" replace />;
  if (state.phase === 'finished') return <Navigate to="/results" replace />;
  if (!state.rounds.length || !['playing', 'revealed'].includes(state.phase)) return <Navigate to="/player" replace />;
  return <GamePage />;
}

function ResultGuard() {
  const { state } = useGame();
  if (!state.playerName || !state.rounds.length) return <Navigate to="/" replace />;
  if (state.phase === 'playing' || state.phase === 'revealed') return <Navigate to="/play" replace />;
  if (state.phase !== 'finished') return <Navigate to="/" replace />;
  return <ResultPage />;
}

export function AppRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/play" element={<PlayGuard />} />
        <Route path="/results" element={<ResultGuard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
