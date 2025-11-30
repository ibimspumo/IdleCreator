/**
 * ActionGenerator - Generates code preview for action nodes
 */

import { HtmlFormatter } from '../formatters/HtmlFormatter.js';
import { NameResolver } from '../formatters/NameResolver.js';

export class ActionGenerator {
  constructor(gameData) {
    this.resolver = new NameResolver(gameData);
  }

  /**
   * Generate action description
   */
  generate(data) {
    const type = data.actionType;

    switch (type) {
      case 'addResource':
        return `${HtmlFormatter.keyword('add')} ${HtmlFormatter.number(data.amount || 0)} to ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))}`;

      case 'removeResource':
        return `${HtmlFormatter.keyword('remove')} ${HtmlFormatter.number(data.amount || 0)} from ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))}`;

      case 'setResource':
        return `${HtmlFormatter.keyword('set')} ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} to ${HtmlFormatter.number(data.value || 0)}`;

      case 'multiplyResource':
        return `${HtmlFormatter.keyword('multiply')} ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} by ${HtmlFormatter.number(data.multiplier || 1)}x`;

      case 'unlockUpgrade':
        return `${HtmlFormatter.keyword('unlock upgrade')} ${HtmlFormatter.string(this.resolver.getUpgradeName(data.upgradeId))}`;

      case 'unlockBuilding':
        return `${HtmlFormatter.keyword('unlock building')} ${HtmlFormatter.string(this.resolver.getBuildingName(data.buildingId))}`;

      case 'unlockAchievement':
        return `${HtmlFormatter.keyword('unlock achievement')} ${HtmlFormatter.string(this.resolver.getAchievementName(data.achievementId))}`;

      case 'showNotification':
        return `${HtmlFormatter.keyword('show notification')} ${HtmlFormatter.string(data.message || 'Notification')} ${HtmlFormatter.comment(`(${data.duration || 3}s)`)}`;

      case 'addProduction':
        return `${HtmlFormatter.keyword('add')} ${HtmlFormatter.number(data.perSecond || 0)}/s production to ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))}`;

      case 'multiplyProduction':
        return `${HtmlFormatter.keyword('multiply')} ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} production by ${HtmlFormatter.number(data.multiplier || 1)}x`;

      case 'forcePrestige':
        return HtmlFormatter.keyword('force prestige');

      case 'setClickPower':
        return `${HtmlFormatter.keyword('set click power to')} ${HtmlFormatter.number(data.clickAmount || 1)}`;

      default:
        return HtmlFormatter.error(type || 'unknown action');
    }
  }
}
