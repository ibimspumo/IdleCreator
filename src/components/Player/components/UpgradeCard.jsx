import React from 'react';
import { RenderIcon } from '../../Editor/shared/RenderIcon';
import { FormatUtils } from '../../../utils/formatters';

/**
 * UpgradeCard - Displays an upgrade purchase card
 */
export function UpgradeCard({ upgrade, canAfford, gameData, gameState, onBuy }) {
  return (
    <div className={`purchase-card ${!canAfford ? 'disabled' : ''}`}>
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
          onClick={() => onBuy(upgrade.id)}
          disabled={!canAfford}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}
