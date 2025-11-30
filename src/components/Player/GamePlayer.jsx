import { useState, useEffect } from 'react';
import { FormatUtils } from '../../utils/formatters';
import { RenderIcon } from '../Editor/shared/RenderIcon';
import { useNotification } from './hooks/useNotification';
import { useGameLifecycle } from './hooks/useGameLifecycle';
import { LogicDebug } from '../../utils/logicDebug';

// Import panels
import { BuildingsPanel } from './panels/BuildingsPanel';
import { UpgradesPanel } from './panels/UpgradesPanel';
import { AchievementsPanel } from './panels/AchievementsPanel';
import { StatsPanel } from './panels/StatsPanel';
import { PrestigePanel } from './panels/PrestigePanel';

// Import components
import { ResourceDisplay } from './components/ResourceDisplay';

import '../../styles/player.css';

function GamePlayer({ gameData }) {
  const [gameEngine, setGameEngine] = useState(null);
  const [prestigeEngine, setPrestigeEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [, forceUpdate] = useState(0);
  const [activeSection, setActiveSection] = useState('buildings');

  const { notification, showNotification } = useNotification();
  useGameLifecycle(gameData, setGameEngine, setPrestigeEngine, setGameState, forceUpdate);

  // Expose engine for debugging
  useEffect(() => {
    if (gameEngine) {
      window.gameEngine = gameEngine;
      window.LogicDebug = LogicDebug;
      console.log('🔧 Debug tools available:');
      console.log('  - window.gameEngine (GameEngine instance)');
      console.log('  - window.LogicDebug (Debug utilities)');
      console.log('💡 Try: LogicDebug.visualizeFlow(gameEngine.gameData)');
      console.log('💡 Try: LogicDebug.validateLogic(gameEngine.gameData)');
      console.log('💡 Try: LogicDebug.enableDebugMode(gameEngine)');
    }
  }, [gameEngine]);

  if (!gameData) {
    return <div className="loading">No game data provided...</div>;
  }

  if (!gameEngine || !gameState) {
    return <div className="loading">Loading game...</div>;
  }

  const handleClick = () => {
    gameEngine.click();
  };

  const handleBuyBuilding = (buildingId, amount = 1) => {
    const success = gameEngine.buyBuilding(buildingId, amount);
    if (!success) {
      showNotification('Not enough resources!', 'error');
    }
  };

  const handleBuyUpgrade = (upgradeId) => {
    const success = gameEngine.buyUpgrade(upgradeId);
    if (success) {
      showNotification('Upgrade purchased!', 'success');
    } else {
      showNotification('Cannot afford or not unlocked!', 'error');
    }
  };

  const handlePrestige = () => {
    if (confirm('Really prestige? This will reset your progress!')) {
      const success = prestigeEngine.performPrestige();
      if (success) {
        showNotification('Prestige successful! You now have permanent bonuses.', 'success');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Really reset all progress? This cannot be undone!')) {
      localStorage.removeItem(`game_${gameData.meta.title}`);
      gameEngine.reset(false);
      showNotification('Progress reset', 'info');
    }
  };

  const clickResource = gameData.resources.find(r => r.clickable);

  // Get unlocked achievements for showcase
  const unlockedAchievements = gameData.achievements.filter(
    ach => gameState.achievements[ach.id]?.unlocked
  );

  // Get unlocked upgrades count for badge
  const unlockedUpgrades = gameData.upgrades.filter(
    up => gameState.upgrades[up.id]?.unlocked && !gameState.upgrades[up.id]?.purchased
  );

  // Apply theme
  const themeStyle = {
    '--primary-color': gameData.theme.primaryColor,
    '--secondary-color': gameData.theme.secondaryColor,
    '--background-color': gameData.theme.backgroundColor,
    '--text-color': gameData.theme.textColor,
    '--accent-color': gameData.theme.accentColor,
    '--font-family': gameData.theme.fontFamily,
    '--border-radius': gameData.theme.borderRadius
  };

  return (
    <div className="game-player" style={themeStyle}>
      {/* Notification Toast */}
      {notification && (
        <div className={`game-notification game-notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Left Sidebar - Stats & Resources */}
      <aside className="game-sidebar game-sidebar-left">
        <div className="game-header">
          <h1 className="game-title">{gameData.meta.title}</h1>
          {gameData.meta.author && (
            <p className="game-author">by {gameData.meta.author}</p>
          )}
        </div>

        {/* Resources */}
        <div className="sidebar-section">
          <h2 className="section-title">Resources</h2>
          <div className="resources-list">
            {gameData.resources.map(resource => (
              <ResourceDisplay
                key={resource.id}
                resource={resource}
                resourceState={gameState.resources[resource.id]}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <StatsPanel gameData={gameData} gameState={gameState} />

        {/* Prestige */}
        {gameData.prestige.enabled && (
          <PrestigePanel
            prestigeEngine={prestigeEngine}
            onPrestige={handlePrestige}
          />
        )}

        {/* Settings */}
        <div className="sidebar-section">
          <button className="settings-button" onClick={handleReset}>
            Reset Progress
          </button>
        </div>
      </aside>

      {/* Center Area - Click & Main Display */}
      <main className="game-main">
        {clickResource && (
          <div className="click-section">
            <button className="click-button" onClick={handleClick}>
              <div className="click-icon">
                <RenderIcon icon={clickResource.icon} size={120} />
              </div>
            </button>
            <div className="click-info">
              <div className="click-value">
                +{FormatUtils.formatNumber(
                  (clickResource.clickAmount || 1) * gameEngine.getTotalMultiplier(clickResource.id, 'click')
                )} per click
              </div>
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="achievements-showcase">
            <h3>Recent Achievements</h3>
            <div className="achievements-list-horizontal">
              {unlockedAchievements.slice(-5).reverse().map(ach => (
                <div key={ach.id} className="achievement-badge" title={ach.description}>
                  <div className="achievement-icon">
                    <RenderIcon icon={ach.icon} size={32} />
                  </div>
                  <div className="achievement-name">{ach.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Purchases */}
      <aside className="game-sidebar game-sidebar-right">
        {/* Section Tabs */}
        <div className="section-tabs">
          <button
            className={`section-tab ${activeSection === 'buildings' ? 'active' : ''}`}
            onClick={() => setActiveSection('buildings')}
          >
            <span>🏠</span> Buildings
          </button>
          <button
            className={`section-tab ${activeSection === 'upgrades' ? 'active' : ''}`}
            onClick={() => setActiveSection('upgrades')}
          >
            <span>⬆️</span> Upgrades
            {unlockedUpgrades.length > 0 && (
              <span className="tab-badge">{unlockedUpgrades.length}</span>
            )}
          </button>
          <button
            className={`section-tab ${activeSection === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveSection('achievements')}
          >
            <span>🏆</span> Achievements
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="section-content">
          {activeSection === 'buildings' && (
            <BuildingsPanel
              gameData={gameData}
              gameState={gameState}
              gameEngine={gameEngine}
              onBuyBuilding={handleBuyBuilding}
            />
          )}

          {activeSection === 'upgrades' && (
            <UpgradesPanel
              gameData={gameData}
              gameState={gameState}
              onBuyUpgrade={handleBuyUpgrade}
            />
          )}

          {activeSection === 'achievements' && (
            <AchievementsPanel
              gameData={gameData}
              gameState={gameState}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

export default GamePlayer;
