import { useState, useEffect, useRef } from 'react';
import { GameEngine } from '../../engine/GameEngine';
import { PrestigeEngine } from '../../engine/PrestigeEngine';
import { FormatUtils } from '../../utils/formatters';
import { RenderIcon } from '../Editor/shared/RenderIcon'; // Import shared RenderIcon
import { useNotification } from './hooks/useNotification'; // Import useNotification hook
import { useGameLifecycle } from './hooks/useGameLifecycle'; // Import useGameLifecycle hook
import '../../styles/player.css';

function GamePlayer({ gameData }) {
  const [gameEngine, setGameEngine] = useState(null);
  const [prestigeEngine, setPrestigeEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [, forceUpdate] = useState(0);
  const [activeSection, setActiveSection] = useState('buildings'); // buildings, upgrades, achievements, stats

  const { notification, showNotification } = useNotification();
  useGameLifecycle(gameData, setGameEngine, setPrestigeEngine, setGameState, forceUpdate);


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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clickResource = gameData.resources.find(r => r.clickable);
  const prestigeBonus = prestigeEngine.getPrestigeBonus();
  const canPrestige = prestigeEngine.canPrestige();
  const prestigeCurrency = prestigeEngine.calculatePrestigeCurrency();

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

  // Get unlocked achievements
  const unlockedAchievements = gameData.achievements.filter(
    ach => gameState.achievements[ach.id]?.unlocked
  );

  // Get visible buildings (unlocked or affordable soon)
  const visibleBuildings = gameData.buildings.filter(building => {
    const owned = gameState.buildings[building.id].owned;
    if (owned > 0) return true;

    // Show if we can almost afford it (within 2x of cost)
    const cost = gameEngine.calculateBuildingCost(building, 0, 1);
    return cost.every(c => gameState.resources[c.resourceId]?.amount >= c.amount * 0.5);
  });

  // Get unlocked upgrades
  const unlockedUpgrades = gameData.upgrades.filter(
    up => gameState.upgrades[up.id]?.unlocked && !gameState.upgrades[up.id]?.purchased
  );

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
            {gameData.resources.map(resource => {
              const resState = gameState.resources[resource.id];
              return (
                <div key={resource.id} className="resource-item">
                  <div className="resource-header">
                    <span className="resource-icon">
                      <RenderIcon icon={resource.icon} size={20} />
                    </span>
                    <span className="resource-name">{resource.name}</span>
                  </div>
                  <div className="resource-amount">
                    {FormatUtils.formatNumber(resState?.amount || 0)}
                  </div>
                  {resState?.perSecond > 0 && (
                    <div className="resource-rate">
                      +{FormatUtils.formatPerSecond(resState.perSecond)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="sidebar-section">
          <h2 className="section-title">Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{FormatUtils.formatNumber(gameState.totalClicks)}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {Object.values(gameState.buildings).reduce((sum, b) => sum + b.owned, 0)}
              </div>
              <div className="stat-label">Buildings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{unlockedAchievements.length}/{gameData.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
            {gameData.prestige.enabled && (
              <div className="stat-item">
                <div className="stat-value">{gameState.prestige.level}</div>
                <div className="stat-label">Prestige Level</div>
              </div>
            )}
          </div>
        </div>

        {/* Prestige */}
        {gameData.prestige.enabled && (
          <div className="sidebar-section">
            <h2 className="section-title">Prestige</h2>
            <div className="prestige-info">
              <div className="prestige-bonus">
                Current Bonus: <span className="accent">+{Math.round((prestigeBonus - 1) * 100)}%</span>
              </div>
              {canPrestige && (
                <div className="prestige-gain">
                  Next: <span className="accent">+{prestigeCurrency}</span> prestige points
                </div>
              )}
              <button
                className="prestige-button"
                onClick={handlePrestige}
                disabled={!canPrestige}
              >
                {canPrestige ? 'Prestige!' : 'Not Ready'}
              </button>
            </div>
          </div>
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
            <div className="buildings-list">
              {visibleBuildings.map(building => {
                const buildingState = gameState.buildings[building.id];
                const cost = gameEngine.calculateBuildingCost(building, buildingState.owned, 1);
                const canAfford = cost.every(c =>
                  gameState.resources[c.resourceId]?.amount >= c.amount
                );

                return (
                  <div key={building.id} className={`purchase-card ${!canAfford ? 'disabled' : ''}`}>
                    <div className="card-header">
                      <div className="card-icon">
                        <RenderIcon icon={building.icon} size={32} />
                      </div>
                      <div className="card-info">
                        <h3 className="card-title">{building.name}</h3>
                        <p className="card-description">{building.description}</p>
                      </div>
                    </div>

                    <div className="card-stats">
                      <div className="stat-row">
                        <span className="stat-label">Owned:</span>
                        <span className="stat-value">{buildingState.owned}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Produces:</span>
                        <span className="stat-value">
                          {building.produces.map(prod => {
                            const res = gameData.resources.find(r => r.id === prod.resourceId);
                            return (
                              <span key={prod.resourceId}>
                                <RenderIcon icon={res?.icon} size={14} />
                                {' '}{FormatUtils.formatPerSecond(prod.amount)}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <div className="card-cost">
                        {cost.map(c => {
                          const res = gameData.resources.find(r => r.id === c.resourceId);
                          const hasEnough = gameState.resources[c.resourceId]?.amount >= c.amount;
                          return (
                            <span key={c.resourceId} className={!hasEnough ? 'insufficient' : ''}>
                              <RenderIcon icon={res?.icon} size={16} />
                              {' '}{FormatUtils.formatNumber(c.amount)}
                            </span>
                          );
                        })}
                      </div>
                      <div className="buy-buttons">
                        <button
                          className="buy-button buy-1"
                          onClick={() => handleBuyBuilding(building.id, 1)}
                          disabled={!canAfford}
                        >
                          Buy 1
                        </button>
                        <button
                          className="buy-button buy-10"
                          onClick={() => handleBuyBuilding(building.id, 10)}
                          disabled={!canAfford}
                          title="Buy 10"
                        >
                          10
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeSection === 'upgrades' && (
            <div className="upgrades-list">
              {unlockedUpgrades.length === 0 && (
                <div className="empty-state">
                  <p>No upgrades available yet</p>
                </div>
              )}
              {unlockedUpgrades.map(upgrade => {
                const canAfford = upgrade.cost.every(c =>
                  gameState.resources[c.resourceId]?.amount >= c.amount
                );

                return (
                  <div key={upgrade.id} className={`purchase-card ${!canAfford ? 'disabled' : ''}`}>
                    <div className="card-header">
                      <div className="card-icon">
                        <RenderIcon icon={upgrade.icon} size={32} />
                      </div>
                      <div className="card-info">
                        <h3 className="card-title">{upgrade.name}</h3>
                        <p className="card-description">{upgrade.description}</p>
                      </div>
                    </div>

                    <div className="card-actions">
                      <div className="card-cost">
                        {upgrade.cost.map(c => {
                          const res = gameData.resources.find(r => r.id === c.resourceId);
                          const hasEnough = gameState.resources[c.resourceId]?.amount >= c.amount;
                          return (
                            <span key={c.resourceId} className={!hasEnough ? 'insufficient' : ''}>
                              <RenderIcon icon={res?.icon} size={16} />
                              {' '}{FormatUtils.formatNumber(c.amount)}
                            </span>
                          );
                        })}
                      </div>
                      <button
                        className="buy-button buy-upgrade"
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="achievements-list">
              {gameData.achievements.map(ach => {
                const achState = gameState.achievements[ach.id];
                const isUnlocked = achState?.unlocked;

                return (
                  <div
                    key={ach.id}
                    className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">
                      <RenderIcon icon={ach.icon} size={40} />
                    </div>
                    <div className="achievement-info">
                      <h3 className="achievement-title">{ach.name}</h3>
                      <p className="achievement-description">{ach.description}</p>
                      {isUnlocked && (
                        <div className="achievement-unlocked">✓ Unlocked</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default GamePlayer;
