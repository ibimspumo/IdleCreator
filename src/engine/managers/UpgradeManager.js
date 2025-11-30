/**
 * UpgradeManager - Manages upgrades, unlocking, and purchasing
 */

export class UpgradeManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  /**
   * Initialize upgrade state
   */
  initializeUpgrades(upgrades) {
    return upgrades.reduce((acc, upgrade) => {
      acc[upgrade.id] = {
        purchased: false,
        unlocked: false
      };
      return acc;
    }, {});
  }

  /**
   * Buy upgrade
   */
  buyUpgrade(upgradeId) {
    const upgrade = this.game.gameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const upgradeState = this.game.gameState.upgrades[upgradeId];
    if (upgradeState.purchased || !upgradeState.unlocked) return false;

    // Check cost
    const canAfford = upgrade.cost.every(cost =>
      this.game.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Deduct resources
    upgrade.cost.forEach(cost => {
      this.game.resourceManager.removeResource(cost.resourceId, cost.amount);
    });

    // Activate upgrade
    upgradeState.purchased = true;
    this.game.gameState.totalUpgradesPurchased++;

    // Trigger events
    this.game.logicExecutor.triggerEvent('afterBoughtUpgrade', { upgradeId });
    this.game.logicExecutor.checkEventCounter('afterXBoughtUpgrades', 'global', this.game.gameState.totalUpgradesPurchased);

    return true;
  }

  /**
   * Update which upgrades are unlocked based on requirements
   */
  updateUnlockedUpgrades() {
    this.game.gameData.upgrades.forEach(upgrade => {
      if (!this.game.gameState.upgrades[upgrade.id].purchased) {
        this.game.gameState.upgrades[upgrade.id].unlocked =
          this.checkRequirements(upgrade.unlockRequirements);
      }
    });
  }

  /**
   * Check requirements
   */
  checkRequirements(requirements) {
    if (!requirements || requirements.length === 0) return true;

    return requirements.every(req => {
      switch (req.type) {
        case 'resource':
          return this.game.gameState.resources[req.resourceId]?.amount >= req.amount;

        case 'building':
          return this.game.gameState.buildings[req.buildingId]?.owned >= req.amount;

        case 'upgrade':
          return this.game.gameState.upgrades[req.upgradeId]?.purchased;

        case 'achievement':
          return this.game.gameState.achievements[req.achievementId]?.unlocked;

        case 'prestige':
          return this.game.gameState.prestige.level >= req.level;

        case 'totalClicks':
          return this.game.gameState.totalClicks >= req.amount;

        default:
          return true;
      }
    });
  }

  /**
   * Get total multiplier from upgrades
   */
  getTotalMultiplier(resourceId, type) {
    let multiplier = 1;

    // From purchased upgrades
    this.game.gameData.upgrades.forEach(upgrade => {
      if (!this.game.gameState.upgrades[upgrade.id].purchased) return;

      upgrade.effects.forEach(effect => {
        if (effect.type === 'multiply' && effect.target === type) {
          if (!effect.resourceId || effect.resourceId === resourceId) {
            multiplier *= effect.value;
          }
        }
      });
    });

    // From Prestige
    multiplier *= this.getPrestigeMultiplier();

    return multiplier;
  }

  /**
   * Get prestige multiplier
   */
  getPrestigeMultiplier() {
    return 1 + (this.game.gameState.prestige.level * 0.1);
  }

  /**
   * Unlock upgrade
   */
  unlockUpgrade(upgradeId) {
    const upgrade = this.game.gameState.upgrades[upgradeId];
    if (upgrade) {
      upgrade.unlocked = true;
    }
  }

  /**
   * Get upgrade state
   */
  getUpgrade(upgradeId) {
    return this.game.gameState.upgrades[upgradeId];
  }
}
