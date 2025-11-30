/**
 * EventGenerator - Generates code preview for event nodes
 */

import { HtmlFormatter } from '../formatters/HtmlFormatter.js';
import { NameResolver } from '../formatters/NameResolver.js';

export class EventGenerator {
  constructor(gameData) {
    this.resolver = new NameResolver(gameData);
  }

  /**
   * Generate event description
   */
  generate(data) {
    const type = data.eventType;

    switch (type) {
      // Simple events
      case 'onGameStart':
        return 'game starts';
      case 'onTick':
        return 'every tick (10x per second)';
      case 'onClick':
        return 'player clicks main resource';
      case 'onPrestige':
        return 'player prestiges';

      // Counter events
      case 'afterXClicks':
        return `player clicks ${HtmlFormatter.number(data.clickCount || 10)} times${data.repeat ? ' ' + HtmlFormatter.comment('(repeating)') : ''}`;
      case 'afterXSeconds':
        return `${HtmlFormatter.number(data.seconds || 10)} seconds pass${data.repeat ? ' ' + HtmlFormatter.comment('(repeating)') : ''}`;
      case 'afterXResources':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} reaches ${HtmlFormatter.number(data.amount || 100)}`;
      case 'afterXBoughtUpgrades':
        return `player buys ${HtmlFormatter.number(data.upgradeCount || 5)} upgrades total`;
      case 'afterXResourcesSpent':
        return `player spends ${HtmlFormatter.number(data.amountSpent || 1000)} ${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))}`;
      case 'afterXBuildings':
        return `player owns ${HtmlFormatter.number(data.buildingCount || 10)} buildings total`;
      case 'afterXAchievements':
        return `player unlocks ${HtmlFormatter.number(data.achievementCount || 5)} achievements`;
      case 'afterXProduction':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} produces ${HtmlFormatter.number(data.totalProduced || 10000)} total`;
      case 'afterPlaytime':
        return `player plays for ${HtmlFormatter.number(data.minutes || 60)} minutes`;

      // Specific item events
      case 'afterBoughtUpgrade':
        return `player buys upgrade ${HtmlFormatter.string(this.resolver.getUpgradeName(data.upgradeId))}`;
      case 'afterBoughtBuilding':
        return `player buys building ${HtmlFormatter.string(this.resolver.getBuildingName(data.buildingId))}`;
      case 'onAchievementUnlock':
        return `achievement ${HtmlFormatter.string(this.resolver.getAchievementName(data.achievementId))} unlocks`;
      case 'onResourceFull':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} reaches maximum`;
      case 'onResourceEmpty':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} reaches zero`;
      case 'onBuildingMaxed':
        return `building ${HtmlFormatter.string(this.resolver.getBuildingName(data.buildingId))} reaches maximum`;

      default:
        return HtmlFormatter.error(type || 'unknown event');
    }
  }
}
