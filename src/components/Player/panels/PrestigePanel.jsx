import React from 'react';

/**
 * PrestigePanel - Displays prestige information and button
 */
export function PrestigePanel({ prestigeEngine, onPrestige }) {
  const prestigeBonus = prestigeEngine.getPrestigeBonus();
  const canPrestige = prestigeEngine.canPrestige();
  const prestigeCurrency = prestigeEngine.calculatePrestigeCurrency();

  return (
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
          onClick={onPrestige}
          disabled={!canPrestige}
        >
          {canPrestige ? 'Prestige!' : 'Not Ready'}
        </button>
      </div>
    </div>
  );
}
