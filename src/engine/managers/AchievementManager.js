/**
 * AchievementManager - Manages achievements and achievement checking
 */

export class AchievementManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  /**
   * Initialize achievement state
   */
  initializeAchievements(achievements) {
    return achievements.reduce((acc, achievement) => {
      acc[achievement.id] = {
        unlocked: false,
        progress: 0
      };
      return acc;
    }, {});
  }

  /**
   * Check all achievements
   */
  checkAchievements() {
    this.game.gameData.achievements.forEach(achievement => {
      if (this.game.gameState.achievements[achievement.id].unlocked) return;

      const unlocked = this.game.upgradeManager.checkRequirements(achievement.requirements);

      if (unlocked) {
        this.unlockAchievement(achievement.id);
      }
    });
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId) {
    const achievement = this.game.gameState.achievements[achievementId];
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.progress = 100;
      this.game.gameState.totalAchievementsUnlocked++;

      // Trigger events
      this.game.logicExecutor.triggerEvent('onAchievementUnlock', { achievementId });
      this.game.logicExecutor.checkEventCounter('afterXAchievements', 'global', this.game.gameState.totalAchievementsUnlocked);
    }
  }

  /**
   * Get achievement state
   */
  getAchievement(achievementId) {
    return this.game.gameState.achievements[achievementId];
  }
}
