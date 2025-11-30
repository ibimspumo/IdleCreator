import React from 'react';
import { RenderIcon } from '../../Editor/shared/RenderIcon';
import { FormatUtils } from '../../../utils/formatters';

/**
 * BuildingCard - Displays a building purchase card
 */
export function BuildingCard({ building, buildingState, cost, canAfford, gameData, gameState, onBuy }) {
  return (
    <div className={`purchase-card ${!canAfford ? 'disabled' : ''}`}>
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
            onClick={() => onBuy(building.id, 1)}
            disabled={!canAfford}
          >
            Buy 1
          </button>
          <button
            className="buy-button buy-10"
            onClick={() => onBuy(building.id, 10)}
            disabled={!canAfford}
            title="Buy 10"
          >
            10
          </button>
        </div>
      </div>
    </div>
  );
}
