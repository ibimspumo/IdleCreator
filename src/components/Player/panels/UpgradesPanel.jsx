import React from 'react';
import { UpgradeCard } from '../components/UpgradeCard';

/**
 * UpgradesPanel - Displays the upgrades list
 */
export function UpgradesPanel({ gameData, gameState, onBuyUpgrade }) {
  // Get unlocked upgrades
  const unlockedUpgrades = gameData.upgrades.filter(
    up => gameState.upgrades[up.id]?.unlocked && !gameState.upgrades[up.id]?.purchased
  );

  if (unlockedUpgrades.length === 0) {
    return (
      <div className="upgrades-list">
        <div className="empty-state">
          <p>No upgrades available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrades-list">
      {unlockedUpgrades.map(upgrade => {
        const canAfford = upgrade.cost.every(c =>
          gameState.resources[c.resourceId]?.amount >= c.amount
        );

        return (
          <UpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            canAfford={canAfford}
            gameData={gameData}
            gameState={gameState}
            onBuy={onBuyUpgrade}
          />
        );
      })}
    </div>
  );
}
