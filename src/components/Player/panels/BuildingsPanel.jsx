import React from 'react';
import { BuildingCard } from '../components/BuildingCard';

/**
 * BuildingsPanel - Displays the buildings list
 */
export function BuildingsPanel({ gameData, gameState, gameEngine, onBuyBuilding }) {
  // Get visible buildings (unlocked or affordable soon)
  const visibleBuildings = gameData.buildings.filter(building => {
    const owned = gameState.buildings[building.id].owned;
    if (owned > 0) return true;

    // Show if we can almost afford it (within 2x of cost)
    const cost = gameEngine.calculateBuildingCost(building, 0, 1);
    return cost.every(c => gameState.resources[c.resourceId]?.amount >= c.amount * 0.5);
  });

  return (
    <div className="buildings-list">
      {visibleBuildings.map(building => {
        const buildingState = gameState.buildings[building.id];
        const cost = gameEngine.calculateBuildingCost(building, buildingState.owned, 1);
        const canAfford = cost.every(c =>
          gameState.resources[c.resourceId]?.amount >= c.amount
        );

        return (
          <BuildingCard
            key={building.id}
            building={building}
            buildingState={buildingState}
            cost={cost}
            canAfford={canAfford}
            gameData={gameData}
            gameState={gameState}
            onBuy={onBuyBuilding}
          />
        );
      })}
    </div>
  );
}
