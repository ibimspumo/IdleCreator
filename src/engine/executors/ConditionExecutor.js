/**
 * ConditionExecutor - Handles execution of condition nodes
 */

export class ConditionExecutor {
  constructor(logicExecutor) {
    this.executor = logicExecutor;
    this.game = logicExecutor.game;
  }

  /**
   * Execute condition node
   */
  executeCondition(node, context = {}) {
    const data = node.data;
    let conditionResult = false;

    switch (data.conditionType) {
      case 'ifResource':
        if (data.resourceId && data.amount !== undefined && data.comparison) {
          const resource = this.game.gameState.resources[data.resourceId];
          if (resource) {
            conditionResult = this.compareValues(resource.amount, data.comparison, parseFloat(data.amount));
          }
        }
        break;

      case 'ifBuilding':
        if (data.buildingId && data.amount !== undefined && data.comparison) {
          const building = this.game.gameState.buildings[data.buildingId];
          if (building) {
            conditionResult = this.compareValues(building.owned, data.comparison, parseFloat(data.amount));
          }
        }
        break;

      case 'ifUpgradeOwned':
        if (data.upgradeId) {
          const upgrade = this.game.gameState.upgrades[data.upgradeId];
          conditionResult = upgrade?.purchased || false;
        }
        break;

      case 'ifAchievementUnlocked':
        if (data.achievementId) {
          const achievement = this.game.gameState.achievements[data.achievementId];
          conditionResult = achievement?.unlocked || false;
        }
        break;

      case 'ifProductionRate':
        if (data.resourceId && data.amount !== undefined && data.comparison) {
          const resource = this.game.gameState.resources[data.resourceId];
          if (resource) {
            conditionResult = this.compareValues(resource.perSecond, data.comparison, parseFloat(data.amount));
          }
        }
        break;

      case 'ifPrestigeLevel':
        if (data.level !== undefined && data.comparison) {
          conditionResult = this.compareValues(this.game.gameState.prestige.level, data.comparison, parseFloat(data.level));
        }
        break;

      case 'ifPlaytime':
        if (data.minutes !== undefined && data.comparison) {
          const playtimeMinutes = (Date.now() - this.game.gameState.startTime) / 60000;
          conditionResult = this.compareValues(playtimeMinutes, data.comparison, parseFloat(data.minutes));
        }
        break;

      case 'ifBuildingOwned':
        if (data.buildingId) {
          const building = this.game.gameState.buildings[data.buildingId];
          conditionResult = building && building.owned > 0;
        }
        break;

      default:
        break;
    }

    // Follow the correct path based on condition result
    const outgoingEdges = this.executor.edgeMap.get(node.id) || [];
    for (const edge of outgoingEdges) {
      // Check if this edge matches the condition result
      if ((conditionResult && edge.sourceHandle === 'true') ||
          (!conditionResult && edge.sourceHandle === 'false')) {
        const targetNode = this.executor.nodeMap.get(edge.target);
        if (targetNode) {
          this.executor.executeGraphFromNode(edge.target, context);
        }
      }
    }
  }

  /**
   * Compare values
   */
  compareValues(a, comparison, b) {
    switch (comparison) {
      case 'greater': return a > b;
      case 'greaterEqual': return a >= b;
      case 'less': return a < b;
      case 'lessEqual': return a <= b;
      case 'equal': return a === b;
      case 'notEqual': return a !== b;
      default: return false;
    }
  }
}
