/**
 * NameResolver - Resolves IDs to human-readable names from game data
 */

import { HtmlFormatter } from './HtmlFormatter.js';

export class NameResolver {
  constructor(gameData) {
    this.gameData = gameData;
  }

  /**
   * Get resource name by ID
   */
  getResourceName(resourceId) {
    if (!resourceId) return HtmlFormatter.error('Unknown Resource');
    const resource = this.gameData?.resources?.find(r => r.id === resourceId);
    return resource?.name || HtmlFormatter.error(resourceId);
  }

  /**
   * Get building name by ID
   */
  getBuildingName(buildingId) {
    if (!buildingId) return HtmlFormatter.error('Unknown Building');
    const building = this.gameData?.buildings?.find(b => b.id === buildingId);
    return building?.name || HtmlFormatter.error(buildingId);
  }

  /**
   * Get upgrade name by ID
   */
  getUpgradeName(upgradeId) {
    if (!upgradeId) return HtmlFormatter.error('Unknown Upgrade');
    const upgrade = this.gameData?.upgrades?.find(u => u.id === upgradeId);
    return upgrade?.name || HtmlFormatter.error(HtmlFormatter.escapeHtml(upgradeId));
  }

  /**
   * Get achievement name by ID
   */
  getAchievementName(achievementId) {
    if (!achievementId) return HtmlFormatter.error('Unknown Achievement');
    const achievement = this.gameData?.achievements?.find(a => a.id === achievementId);
    return achievement?.name || HtmlFormatter.error(achievementId);
  }

  /**
   * Get comparison symbol
   */
  getComparisonSymbol(comparison) {
    switch (comparison) {
      case 'greater': return '>';
      case 'greaterEqual': return '≥';
      case 'less': return '<';
      case 'lessEqual': return '≤';
      case 'equal': return '=';
      case 'notEqual': return '≠';
      default: return '?';
    }
  }
}
