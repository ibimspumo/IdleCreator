/**
 * ConditionGenerator - Generates code preview for condition nodes
 */

import { HtmlFormatter } from '../formatters/HtmlFormatter.js';
import { NameResolver } from '../formatters/NameResolver.js';

export class ConditionGenerator {
  constructor(gameData) {
    this.resolver = new NameResolver(gameData);
  }

  /**
   * Generate condition description
   */
  generate(data) {
    const type = data.conditionType;
    // Support both 'comparison' (old) and 'operator' (new)
    const comparison = this.resolver.getComparisonSymbol(data.operator || data.comparison);

    switch (type) {
      case 'ifResource':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} ${HtmlFormatter.operator(comparison)} ${HtmlFormatter.number(data.amount || 0)}`;

      case 'ifBuilding':
        return `${HtmlFormatter.variable(this.resolver.getBuildingName(data.buildingId))} count ${HtmlFormatter.operator(comparison)} ${HtmlFormatter.number(data.count || 0)}`;

      case 'ifUpgradeOwned':
        return `upgrade ${HtmlFormatter.string(this.resolver.getUpgradeName(data.upgradeId))} is owned`;

      case 'ifAchievementUnlocked':
        return `achievement ${HtmlFormatter.string(this.resolver.getAchievementName(data.achievementId))} is unlocked`;

      case 'ifProductionRate':
        return `${HtmlFormatter.variable(this.resolver.getResourceName(data.resourceId))} production ${HtmlFormatter.operator(comparison)} ${HtmlFormatter.number(data.perSecond || 0)}/s`;

      case 'ifPrestigeLevel':
        return `prestige level ${HtmlFormatter.operator(comparison)} ${HtmlFormatter.number(data.level || 0)}`;

      case 'ifPlaytime':
        return `playtime ${HtmlFormatter.operator(comparison)} ${HtmlFormatter.number(data.minutes || 0)} minutes`;

      case 'ifBuildingOwned':
        return `building ${HtmlFormatter.string(this.resolver.getBuildingName(data.buildingId))} is owned`;

      default:
        return HtmlFormatter.error(type || 'unknown condition');
    }
  }
}
