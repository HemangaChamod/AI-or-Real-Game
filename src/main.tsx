import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './app/providers/GameProvider';
import { AppRouter } from './app/router/AppRouter';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GameProvider>
        <AppRouter />
      </GameProvider>
    </BrowserRouter>
  </StrictMode>,
);
