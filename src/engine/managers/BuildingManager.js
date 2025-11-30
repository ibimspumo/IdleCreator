/**
 * BuildingManager - Manages building purchases, costs, and building-related logic
 */

export class BuildingManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  /**
   * Initialize building state
   */
  initializeBuildings(buildings) {
    return buildings.reduce((acc, building) => {
      acc[building.id] = {
        owned: 0,
        totalBought: 0,
        totalProduction: 0,
        unlocked: false,
        maxOwned: building.maxOwned || Infinity
      };
      return acc;
    }, {});
  }

  /**
   * Buy building
   */
  buyBuilding(buildingId, amount = 1) {
    const building = this.game.gameData.buildings.find(b => b.id === buildingId);
    if (!building) return false;

    const buildingState = this.game.gameState.buildings[buildingId];
    const totalCost = this.calculateBuildingCost(building, buildingState.owned, amount);

    // Check if enough resources
    const canAfford = totalCost.every(cost =>
      this.game.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Deduct resources
    totalCost.forEach(cost => {
      this.game.resourceManager.removeResource(cost.resourceId, cost.amount);
    });

    // Add building
    buildingState.owned += amount;
    buildingState.totalBought += amount;
    this.game.gameState.totalBuildingsPurchased += amount;

    // Trigger events
    this.game.logicExecutor.triggerEvent('afterBoughtBuilding', { buildingId, amount });
    this.game.logicExecutor.checkEventCounter('afterXBuildings', buildingId, buildingState.owned);

    // Check if building maxed
    if (buildingState.owned >= buildingState.maxOwned) {
      this.game.logicExecutor.triggerEvent('onBuildingMaxed', { buildingId });
    }

    return true;
  }

  /**
   * Calculate building cost with scaling
   */
  calculateBuildingCost(building, currentOwned, amount = 1) {
    return building.cost.map(cost => ({
      resourceId: cost.resourceId,
      amount: this.calculateScaledCost(
        cost.baseAmount,
        building.costScaling || 1.15,
        currentOwned,
        amount
      )
    }));
  }

  /**
   * Calculate scaled cost (sum from owned to owned+amount)
   */
  calculateScaledCost(baseCost, scaling, owned, amount) {
    let total = 0;
    for (let i = 0; i < amount; i++) {
      total += baseCost * Math.pow(scaling, owned + i);
    }
    return Math.floor(total);
  }

  /**
   * Get building state
   */
  getBuilding(buildingId) {
    return this.game.gameState.buildings[buildingId];
  }

  /**
   * Unlock building
   */
  unlockBuilding(buildingId) {
    const building = this.game.gameState.buildings[buildingId];
    if (building) {
      building.unlocked = true;
    }
  }
}
