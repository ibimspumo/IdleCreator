import { useState, useEffect, useRef } from 'react';
import { GameEngine } from '../../engine/GameEngine';
import { PrestigeEngine } from '../../engine/PrestigeEngine';
import { FormatUtils } from '../../utils/formatters';
import { PixelArtUtils } from '../Editor/PixelArtEditor';
import '../../styles/player.css';

// Helper: Render icon (pixel art or emoji)
function RenderIcon({ icon, size = 24 }) {
  if (icon && icon.startsWith('8x8:')) {
    const grid = PixelArtUtils.decompress(icon);
    return (
      <canvas
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle' }}
        ref={canvas => {
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const ps = size / 8;
            for (let y = 0; y < 8; y++) {
              for (let x = 0; x < 8; x++) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(x * ps, y * ps, ps, ps);
              }
            }
          }
        }}
      />
    );
  }
  return <span style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block', verticalAlign: 'middle' }}>{icon || '📦'}</span>;
}

function GamePlayer({ gameData }) {
  const [gameEngine, setGameEngine] = useState(null);
  const [prestigeEngine, setPrestigeEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [, forceUpdate] = useState(0);
  const [activeTab, setActiveTab] = useState('main');
  const [notification, setNotification] = useState(null);
  const saveIntervalRef = useRef(null);

  // Initialize Game Engine
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
  }, [gameData]);

  if (!gameEngine || !gameState) {
    return <div className="loading">Lade Spiel...</div>;
  }

  const handleClick = () => {
    gameEngine.click();
  };

  const handleBuyBuilding = (buildingId) => {
    const success = gameEngine.buyBuilding(buildingId);
    if (!success) {
      showNotification('Nicht genug Ressourcen!', 'error');
    }
  };

  const handleBuyUpgrade = (upgradeId) => {
    const success = gameEngine.buyUpgrade(upgradeId);
    if (success) {
      showNotification('Upgrade gekauft!', 'success');
    } else {
      showNotification('Nicht genug Ressourcen oder noch nicht freigeschaltet!', 'error');
    }
  };

  const handlePrestige = () => {
    if (confirm('Wirklich Prestige durchführen? Dies setzt das Spiel zurück!')) {
      const success = prestigeEngine.performPrestige();
      if (success) {
        showNotification('Prestige erfolgreich! Du hast jetzt permanente Boni.', 'success');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Spielstand wirklich komplett zurücksetzen? Dies kann nicht rückgängig gemacht werden!')) {
      localStorage.removeItem(`game_${gameData.meta.title}`);
      gameEngine.reset(false);
      showNotification('Spielstand zurückgesetzt', 'info');
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

  return (
    <div className="game-player" style={themeStyle}>
      <header className="game-header">
        <h1>{gameData.meta.title}</h1>
        {gameData.meta.author && <p className="author">von {gameData.meta.author}</p>}
      </header>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="game-tabs">
        <button
          className={`tab ${activeTab === 'main' ? 'active' : ''}`}
          onClick={() => setActiveTab('main')}
        >
          Spiel
        </button>
        <button
          className={`tab ${activeTab === 'buildings' ? 'active' : ''}`}
          onClick={() => setActiveTab('buildings')}
        >
          Gebäude
        </button>
        <button
          className={`tab ${activeTab === 'upgrades' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          Upgrades
        </button>
        <button
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Erfolge
        </button>
        {gameData.prestige.enabled && (
          <button
            className={`tab ${activeTab === 'prestige' ? 'active' : ''}`}
            onClick={() => setActiveTab('prestige')}
          >
            Prestige
          </button>
        )}
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistik
        </button>
      </div>

      <div className="game-content">
        {activeTab === 'main' && (
          <div className="main-tab">
            <div className="resources">
              {gameData.resources.map(resource => (
                <div key={resource.id} className="resource">
                  <span className="resource-icon"><RenderIcon icon={resource.icon} size={24} /></span>
                  <span className="resource-name">{resource.name}</span>
                  <span className="resource-amount">
                    {FormatUtils.formatNumber(gameState.resources[resource.id]?.amount || 0)}
                  </span>
                  {gameState.resources[resource.id]?.perSecond > 0 && (
                    <span className="resource-rate">
                      ({FormatUtils.formatPerSecond(gameState.resources[resource.id].perSecond)})
                    </span>
                  )}
                </div>
              ))}
            </div>

            {clickResource && (
              <div className="click-area">
                <button onClick={handleClick} className="click-button">
                  <span className="click-icon"><RenderIcon icon={clickResource.icon} size={48} /></span>
                  <span className="click-text">Click!</span>
                </button>
                <div className="click-info">
                  +{FormatUtils.formatNumber(
                    (clickResource.clickAmount || 1) * gameEngine.getTotalMultiplier(clickResource.id, 'click')
                  )} pro Click
                </div>
              </div>
            )}

            <div className="quick-buildings">
              <h3>Gebäude (Schnellkauf)</h3>
              {gameData.buildings.slice(0, 3).map(building => {
                const cost = gameEngine.calculateBuildingCost(building, gameState.buildings[building.id].owned);
                const canAfford = cost.every(c =>
                  gameState.resources[c.resourceId]?.amount >= c.amount
                );

                return (
                  <div key={building.id} className="quick-building">
                    <button
                      onClick={() => handleBuyBuilding(building.id)}
                      disabled={!canAfford}
                      className="buy-button"
                    >
                      <span className="building-icon"><RenderIcon icon={building.icon} size={24} /></span>
                      <span className="building-name">{building.name}</span>
                      <span className="building-owned">({gameState.buildings[building.id].owned})</span>
                    </button>
                    <div className="building-cost">
                      {cost.map(c => {
                        const res = gameData.resources.find(r => r.id === c.resourceId);
                        return (
                          <span key={c.resourceId}>
                            <RenderIcon icon={res?.icon} size={16} /> {FormatUtils.formatNumber(c.amount)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'buildings' && (
          <div className="buildings-tab">
            <h2>Gebäude</h2>
            <div className="buildings-list">
              {gameData.buildings.map(building => {
                const cost = gameEngine.calculateBuildingCost(building, gameState.buildings[building.id].owned);
                const canAfford = cost.every(c =>
                  gameState.resources[c.resourceId]?.amount >= c.amount
                );

                return (
                  <div key={building.id} className="building-card">
                    <div className="building-header">
                      <span className="building-icon">{building.icon}</span>
                      <div className="building-info">
                        <h3>{building.name}</h3>
                        <p>{building.description}</p>
                      </div>
                    </div>

                    <div className="building-stats">
                      <div>Besitzt: {gameState.buildings[building.id].owned}</div>
                      <div>Produziert:</div>
                      {building.produces.map(prod => {
                        const res = gameData.resources.find(r => r.id === prod.resourceId);
                        const amount = prod.amount * gameState.buildings[building.id].owned;
                        return (
                          <div key={prod.resourceId}>
                            <RenderIcon icon={res?.icon} size={16} /> {FormatUtils.formatPerSecond(amount)}
                          </div>
                        );
                      })}
                    </div>

                    <div className="building-actions">
                      <div className="building-cost">
                        Kosten:
                        {cost.map(c => {
                          const res = gameData.resources.find(r => r.id === c.resourceId);
                          return (
                            <span key={c.resourceId}>
                              <RenderIcon icon={res?.icon} size={16} /> {FormatUtils.formatNumber(c.amount)}
                            </span>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handleBuyBuilding(building.id)}
                        disabled={!canAfford}
                        className="buy-button"
                      >
                        Kaufen (x1)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'upgrades' && (
          <div className="upgrades-tab">
            <h2>Upgrades</h2>
            <div className="upgrades-list">
              {gameData.upgrades.map(upgrade => {
                const upgradeState = gameState.upgrades[upgrade.id];
                const canAfford = upgrade.cost.every(c =>
                  gameState.resources[c.resourceId]?.amount >= c.amount
                );

                if (upgradeState.purchased) {
                  return (
                    <div key={upgrade.id} className="upgrade-card purchased">
                      <span className="upgrade-icon"><RenderIcon icon={upgrade.icon} size={32} /></span>
                      <div className="upgrade-info">
                        <h3>{upgrade.name}</h3>
                        <p>{upgrade.description}</p>
                        <div className="purchased-badge">✓ Gekauft</div>
                      </div>
                    </div>
                  );
                }

                if (!upgradeState.unlocked) {
                  return (
                    <div key={upgrade.id} className="upgrade-card locked">
                      <span className="upgrade-icon">🔒</span>
                      <div className="upgrade-info">
                        <h3>???</h3>
                        <p>Noch nicht freigeschaltet</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={upgrade.id} className="upgrade-card">
                    <span className="upgrade-icon"><RenderIcon icon={upgrade.icon} size={32} /></span>
                    <div className="upgrade-info">
                      <h3>{upgrade.name}</h3>
                      <p>{upgrade.description}</p>
                      <div className="upgrade-cost">
                        Kosten:
                        {upgrade.cost.map(c => {
                          const res = gameData.resources.find(r => r.id === c.resourceId);
                          return (
                            <span key={c.resourceId}>
                              <RenderIcon icon={res?.icon} size={16} /> {FormatUtils.formatNumber(c.amount)}
                            </span>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className="buy-button"
                      >
                        Kaufen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <h2>Erfolge</h2>
            <div className="achievements-grid">
              {gameData.achievements.map(achievement => {
                const unlocked = gameState.achievements[achievement.id].unlocked;

                return (
                  <div
                    key={achievement.id}
                    className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <span className="achievement-icon">
                      {unlocked ? <RenderIcon icon={achievement.icon} size={32} /> : '🔒'}
                    </span>
                    <div className="achievement-info">
                      <h3>{unlocked ? achievement.name : '???'}</h3>
                      <p>{unlocked ? achievement.description : 'Noch nicht freigeschaltet'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'prestige' && gameData.prestige.enabled && (
          <div className="prestige-tab">
            <h2>Prestige</h2>
            <div className="prestige-info">
              <div className="prestige-stats">
                <div>Prestige Level: {prestigeBonus.level}</div>
                <div>Prestige Währung: {prestigeBonus.currency}</div>
                <div>Produktions-Multiplikator: x{prestigeBonus.productionMultiplier.toFixed(2)}</div>
                <div>Click-Multiplikator: x{prestigeBonus.clickMultiplier.toFixed(2)}</div>
              </div>

              <div className="prestige-action">
                <h3>Prestige durchführen</h3>
                <p>Du würdest erhalten: {prestigeCurrency} Prestige-Währung</p>
                <button
                  onClick={handlePrestige}
                  disabled={!canPrestige}
                  className="prestige-button"
                >
                  {canPrestige ? 'Prestige!' : 'Noch nicht verfügbar'}
                </button>
                {!canPrestige && (
                  <p className="prestige-hint">
                    Du benötigst mehr {gameData.resources.find(r => r.id === gameData.prestige.baseResource)?.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab">
            <h2>Statistiken</h2>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">Gesamte Clicks:</span>
                <span className="stat-value">{FormatUtils.formatNumber(gameState.totalClicks)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Spielzeit:</span>
                <span className="stat-value">
                  {FormatUtils.formatTime((Date.now() - gameState.startTime) / 1000)}
                </span>
              </div>
              {gameData.resources.map(resource => (
                <div key={resource.id} className="stat">
                  <span className="stat-label">
                    <RenderIcon icon={resource.icon} size={16} /> {resource.name} (Total):
                  </span>
                  <span className="stat-value">
                    {FormatUtils.formatNumber(gameState.resources[resource.id]?.total || 0)}
                  </span>
                </div>
              ))}
              <div className="stat">
                <span className="stat-label">Achievements:</span>
                <span className="stat-value">
                  {Object.values(gameState.achievements).filter(a => a.unlocked).length} / {gameData.achievements.length}
                </span>
              </div>
            </div>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <button onClick={handleReset} className="reset-button">
                Spielstand komplett zurücksetzen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePlayer;
