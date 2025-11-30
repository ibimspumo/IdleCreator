import React from 'react';
import { FormatUtils } from '../../../utils/formatters';

/**
 * StatsPanel - Displays game statistics
 */
export function StatsPanel({ gameData, gameState }) {
  // Get unlocked achievements count
  const unlockedAchievements = gameData.achievements.filter(
    ach => gameState.achievements[ach.id]?.unlocked
  );

  return (
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
  );
}
