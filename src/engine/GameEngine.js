/**
 * Core Game Engine
 * Orchestrates all game managers and logic execution
 */

import { LogicExecutor } from './LogicExecutor.js';
import {
  ResourceManager,
  BuildingManager,
  UpgradeManager,
  AchievementManager,
  ProductionManager
} from './managers/index.js';

export class GameEngine {
  constructor(gameData) {
    this.gameData = gameData;
    this.gameState = this.initializeGameState();
    this.tickInterval = null;
    this.tickRate = 100; // 100ms = 10 ticks per second

    // Initialize Managers
    this.resourceManager = new ResourceManager(this);
    this.buildingManager = new BuildingManager(this);
    this.upgradeManager = new UpgradeManager(this);
    this.achievementManager = new AchievementManager(this);
    this.productionManager = new ProductionManager(this);

    // Initialize Logic Executor
    this.logicExecutor = new LogicExecutor(this);
  }

  initializeGameState() {
    return {
      // Resources
      resources: this.resourceManager ?
        this.resourceManager.initializeResources(this.gameData.resources) :
        this.gameData.resources.reduce((acc, res) => {
          acc[res.id] = {
            amount: res.startAmount || 0,
            total: res.startAmount || 0,
            totalProduced: 0,
            totalSpent: 0,
            perSecond: 0,
            maxAmount: res.maxAmount || Infinity
          };
          return acc;
        }, {}),

      // Buildings
      buildings: this.buildingManager ?
        this.buildingManager.initializeBuildings(this.gameData.buildings) :
        this.gameData.buildings.reduce((acc, building) => {
          acc[building.id] = {
            owned: 0,
            totalBought: 0,
            totalProduction: 0,
            unlocked: false,
            maxOwned: building.maxOwned || Infinity
          };
          return acc;
        }, {}),

      // Upgrades
      upgrades: this.upgradeManager ?
        this.upgradeManager.initializeUpgrades(this.gameData.upgrades) :
        this.gameData.upgrades.reduce((acc, upgrade) => {
          acc[upgrade.id] = {
            purchased: false,
            unlocked: false
          };
          return acc;
        }, {}),

      // Achievements
      achievements: this.achievementManager ?
        this.achievementManager.initializeAchievements(this.gameData.achievements) :
        this.gameData.achievements.reduce((acc, achievement) => {
          acc[achievement.id] = {
            unlocked: false,
            progress: 0
          };
          return acc;
        }, {}),

      // Prestige
      prestige: {
        level: 0,
        currency: 0,
        upgrades: []
      },

      // Meta - Event tracking
      startTime: Date.now(),
      totalClicks: 0,
      totalUpgradesPurchased: 0,
      totalBuildingsPurchased: 0,
      totalAchievementsUnlocked: 0,

      // Event state tracking
      eventCounters: {},
      notifications: []
    };
  }

  // Starts the Game Loop
  start() {
    if (this.tickInterval) return;
    this.logicExecutor.triggerEvent('onGameStart');

    this.tickInterval = setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  // Stops the Game Loop
  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // Game Tick - called 10x per second
  tick() {
    this.logicExecutor.triggerEvent('onTick');
    this.productionManager.calculateProduction();
    this.achievementManager.checkAchievements();
    this.upgradeManager.updateUnlockedUpgrades();
    this.productionManager.checkTimeBasedEvents();
  }

  // Delegate methods to managers
  addResource(resourceId, amount) {
    return this.resourceManager.addResource(resourceId, amount);
  }

  removeResource(resourceId, amount) {
    return this.resourceManager.removeResource(resourceId, amount);
  }

  click() {
    return this.productionManager.click();
  }

  buyBuilding(buildingId, amount = 1) {
    return this.buildingManager.buyBuilding(buildingId, amount);
  }

  buyUpgrade(upgradeId) {
    return this.upgradeManager.buyUpgrade(upgradeId);
  }

  // Prestige function
  performPrestige() {
    // Calculate prestige currency based on current resources
    const prestigeCurrency = Math.floor(Math.sqrt(this.gameState.resources[Object.keys(this.gameState.resources)[0]]?.amount || 0));

    this.gameState.prestige.level++;
    this.gameState.prestige.currency += prestigeCurrency;

    // Trigger event
    this.logicExecutor.triggerEvent('onPrestige');

    // Reset game but keep prestige
    this.reset(true);
  }

  // Export Game State
  exportState() {
    return JSON.stringify(this.gameState);
  }

  // Import Game State
  importState(stateJson) {
    try {
      this.gameState = JSON.parse(stateJson);
      return true;
    } catch (e) {
      console.error('Failed to import state:', e);
      return false;
    }
  }

  // Reset (for Prestige)
  reset(keepPrestige = false) {
    const oldPrestige = keepPrestige ? { ...this.gameState.prestige } : null;
    this.gameState = this.initializeGameState();
    if (oldPrestige) {
      this.gameState.prestige = oldPrestige;
    }
  }

  // Legacy methods for backward compatibility
  calculateProduction() {
    return this.productionManager.calculateProduction();
  }

  checkAchievements() {
    return this.achievementManager.checkAchievements();
  }

  updateUnlockedUpgrades() {
    return this.upgradeManager.updateUnlockedUpgrades();
  }

  checkRequirements(requirements, context) {
    return this.upgradeManager.checkRequirements(requirements, context);
  }

  getTotalMultiplier(resourceId, type) {
    return this.upgradeManager.getTotalMultiplier(resourceId, type);
  }

  getPrestigeMultiplier(resourceId) {
    return this.upgradeManager.getPrestigeMultiplier();
  }

  calculateBuildingCost(building, currentOwned, amount = 1) {
    return this.buildingManager.calculateBuildingCost(building, currentOwned, amount);
  }

  calculateScaledCost(baseCost, scaling, owned, amount) {
    return this.buildingManager.calculateScaledCost(baseCost, scaling, owned, amount);
  }

  checkTimeBasedEvents() {
    return this.productionManager.checkTimeBasedEvents();
  }
}
