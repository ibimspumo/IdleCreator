/**
 * ActionExecutor - Handles execution of action nodes
 */

export class ActionExecutor {
  constructor(logicExecutor) {
    this.executor = logicExecutor;
    this.game = logicExecutor.game;
  }

  /**
   * Execute action node
   */
  executeAction(node, context = {}) {
    const data = node.data;

    switch (data.actionType) {
      case 'addResource':
        if (data.resourceId && data.amount) {
          this.game.resourceManager.addResource(data.resourceId, parseFloat(data.amount));
        }
        break;

      case 'removeResource':
        if (data.resourceId && data.amount) {
          this.game.resourceManager.removeResource(data.resourceId, parseFloat(data.amount));
        }
        break;

      case 'setResource':
        if (data.resourceId && data.amount !== undefined) {
          this.game.resourceManager.setResource(data.resourceId, parseFloat(data.amount));
        }
        break;

      case 'multiplyResource':
        if (data.resourceId && data.multiplier) {
          this.game.resourceManager.multiplyResource(data.resourceId, parseFloat(data.multiplier));
        }
        break;

      case 'unlockUpgrade':
        if (data.upgradeId) {
          this.game.upgradeManager.unlockUpgrade(data.upgradeId);
        }
        break;

      case 'unlockBuilding':
        if (data.buildingId) {
          this.game.buildingManager.unlockBuilding(data.buildingId);
        }
        break;

      case 'showNotification':
        if (data.message) {
          this.game.gameState.notifications.push({
            message: data.message,
            timestamp: Date.now(),
            duration: data.duration || 3000
          });
        }
        break;

      case 'addProduction':
        if (data.resourceId && data.amount) {
          this.game.productionManager.addProduction(data.resourceId, parseFloat(data.amount));
        }
        break;

      case 'multiplyProduction':
        if (data.resourceId && data.multiplier) {
          this.game.productionManager.multiplyProduction(data.resourceId, parseFloat(data.multiplier));
        }
        break;

      case 'forcePrestige':
        this.game.performPrestige();
        break;

      case 'unlockAchievement':
        if (data.achievementId) {
          this.game.achievementManager.unlockAchievement(data.achievementId);
        }
        break;

      case 'setClickPower':
        if (data.amount !== undefined) {
          this.game.productionManager.setClickPower(parseFloat(data.amount));
        }
        break;

      default:
        break;
    }
  }
}
