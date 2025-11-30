import { useEffect, useRef } from 'react';
import { GameEngine } from '../../../engine/GameEngine'; // Adjusted path
import { PrestigeEngine } from '../../../engine/PrestigeEngine'; // Adjusted path

export function useGameLifecycle(gameData, setGameEngine, setPrestigeEngine, setGameState, forceUpdate) {
  const saveIntervalRef = useRef(null);

  useEffect(() => {
    const engine = new GameEngine(gameData);
    const prestige = new PrestigeEngine(engine, gameData.prestige);

    // Load saved state from localStorage
    const savedState = localStorage.getItem(`game_${gameData.meta.title}`);
    if (savedState) {
      engine.importState(savedState);
    }

    engine.start();
    setGameEngine(engine);
    setPrestigeEngine(prestige);
    setGameState(engine.gameState);

    // Auto-save every 5 seconds
    saveIntervalRef.current = setInterval(() => {
      const state = engine.exportState();
      localStorage.setItem(`game_${gameData.meta.title}`, state);
    }, 5000);

    // Force UI update every 100ms
    const uiInterval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 100);

    return () => {
      engine.stop();
      clearInterval(saveIntervalRef.current);
      clearInterval(uiInterval);
    };
  }, [gameData, setGameEngine, setPrestigeEngine, setGameState, forceUpdate]);

  return { saveIntervalRef }; // Return ref if needed elsewhere, otherwise just manage internal lifecycle
}
