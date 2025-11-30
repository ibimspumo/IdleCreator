/**
 * ProductionManager - Manages production calculation and clicks
 */

export class ProductionManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  /**
   * Calculate production per second
   */
  calculateProduction() {
    const dt = this.game.tickRate / 1000; // Delta time in seconds

    // Reset production
    this.game.resourceManager.resetProduction();

    // Calculate building production
    this.game.gameData.buildings.forEach(building => {
      const owned = this.game.gameState.buildings[building.id].owned;
      if (owned === 0) return;

      building.produces.forEach(production => {
        const baseAmount = production.amount * owned;
        const multiplier = this.game.upgradeManager.getTotalMultiplier(production.resourceId, 'production');
        const finalAmount = baseAmount * multiplier;

        this.game.gameState.resources[production.resourceId].perSecond += finalAmount;
        this.game.resourceManager.addResource(production.resourceId, finalAmount * dt);
      });
    });
  }

  /**
   * Handle manual click
   */
  click() {
    this.game.gameState.totalClicks++;
    this.game.logicExecutor.triggerEvent('onClick');

    // Check afterXClicks event
    this.game.logicExecutor.checkEventCounter('afterXClicks', 'global', this.game.gameState.totalClicks);

    const clickResource = this.game.gameData.resources.find(r => r.clickable);
    if (!clickResource) return;

    const baseAmount = clickResource.clickAmount || 1;
    const multiplier = this.game.upgradeManager.getTotalMultiplier(clickResource.id, 'click');
    const finalAmount = baseAmount * multiplier;

    this.game.resourceManager.addResource(clickResource.id, finalAmount);
  }

  /**
   * Check time-based events
   */
  checkTimeBasedEvents() {
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - this.game.gameState.startTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;

    // Check afterXSeconds events
    this.game.logicExecutor.checkEventCounter('afterXSeconds', 'global', elapsedSeconds);

    // Check afterPlaytime events
    this.game.logicExecutor.checkEventCounter('afterPlaytime', 'global', elapsedMinutes);
  }

  /**
   * Set click power
   */
  setClickPower(amount) {
    const clickResource = this.game.gameData.resources.find(r => r.clickable);
    if (clickResource) {
      clickResource.clickAmount = amount;
    }
  }

  /**
   * Add production modifier
   */
  addProduction(resourceId, amount) {
    const resource = this.game.gameState.resources[resourceId];
    if (resource) {
      resource.perSecond += amount;
    }
  }

  /**
   * Multiply production
   */
  multiplyProduction(resourceId, multiplier) {
    const resource = this.game.gameState.resources[resourceId];
    if (resource) {
      resource.perSecond *= multiplier;
    }
  }
}
