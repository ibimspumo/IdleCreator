/**
 * ResourceManager - Manages resources, production, and resource-related events
 */

export class ResourceManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  /**
   * Initialize resource state
   */
  initializeResources(resources) {
    return resources.reduce((acc, res) => {
      acc[res.id] = {
        amount: res.startAmount || 0,
        total: res.startAmount || 0,
        totalProduced: 0,
        totalSpent: 0,
        perSecond: 0,
        maxAmount: res.maxAmount || Infinity
      };
      return acc;
    }, {});
  }

  /**
   * Add resource and trigger events
   */
  addResource(resourceId, amount) {
    if (!this.game.gameState.resources[resourceId]) return;

    const resource = this.game.gameState.resources[resourceId];
    const oldAmount = resource.amount;

    resource.amount += amount;
    resource.total += amount;

    if (amount > 0) {
      resource.totalProduced += amount;
    }

    // Check for resource full/empty events
    if (resource.amount >= resource.maxAmount && oldAmount < resource.maxAmount) {
      this.game.logicExecutor.triggerEvent('onResourceFull', { resourceId });
    }
    if (resource.amount <= 0 && oldAmount > 0) {
      this.game.logicExecutor.triggerEvent('onResourceEmpty', { resourceId });
    }

    // Check afterXResources event
    this.game.logicExecutor.checkEventCounter('afterXResources', resourceId, resource.amount);

    // Check afterXProduction event
    this.game.logicExecutor.checkEventCounter('afterXProduction', resourceId, resource.totalProduced);
  }

  /**
   * Remove resource and trigger events
   */
  removeResource(resourceId, amount) {
    if (!this.game.gameState.resources[resourceId]) return false;

    const resource = this.game.gameState.resources[resourceId];
    if (resource.amount < amount) return false;

    const oldAmount = resource.amount;
    resource.amount -= amount;
    resource.totalSpent += amount;

    // Check afterXResourcesSpent event
    this.game.logicExecutor.checkEventCounter('afterXResourcesSpent', resourceId, resource.totalSpent);

    // Check for resource empty event
    if (resource.amount <= 0 && oldAmount > 0) {
      this.game.logicExecutor.triggerEvent('onResourceEmpty', { resourceId });
    }

    return true;
  }

  /**
   * Get resource by ID
   */
  getResource(resourceId) {
    return this.game.gameState.resources[resourceId];
  }

  /**
   * Set resource amount
   */
  setResource(resourceId, amount) {
    const resource = this.game.gameState.resources[resourceId];
    if (resource) {
      resource.amount = amount;
    }
  }

  /**
   * Multiply resource amount
   */
  multiplyResource(resourceId, multiplier) {
    const resource = this.game.gameState.resources[resourceId];
    if (resource) {
      resource.amount *= multiplier;
    }
  }

  /**
   * Reset production values
   */
  resetProduction() {
    Object.keys(this.game.gameState.resources).forEach(resId => {
      this.game.gameState.resources[resId].perSecond = 0;
    });
  }
}
