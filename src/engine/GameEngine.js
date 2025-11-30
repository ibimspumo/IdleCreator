/**
 * Core Game Engine
 * Manages all game logic: resources, buildings, upgrades, achievements
 */

import { LogicExecutor } from './LogicExecutor'; // Import the new LogicExecutor

export class GameEngine {
  constructor(gameData) {
    this.gameData = gameData;
    this.gameState = this.initializeGameState();
    this.tickInterval = null;
    this.tickRate = 100; // 100ms = 10 ticks per second

    // Initialize Logic Executor
    this.logicExecutor = new LogicExecutor(this);
  }

  initializeGameState() {
    return {
      // Resources
      resources: this.gameData.resources.reduce((acc, res) => {
        acc[res.id] = {
          amount: res.startAmount || 0,
          total: res.startAmount || 0, // Lifetime total for Achievements
          totalProduced: 0, // Total produced (for production tracking)
          totalSpent: 0, // Total spent (for spending tracking)
          perSecond: 0,
          maxAmount: res.maxAmount || Infinity // For resource full/empty events
        };
        return acc;
      }, {}),

      // Buildings
      buildings: this.gameData.buildings.reduce((acc, building) => {
        acc[building.id] = {
          owned: 0,
          totalBought: 0, // Track total purchased for events
          totalProduction: 0,
          unlocked: false,
          maxOwned: building.maxOwned || Infinity // For building maxed event
        };
        return acc;
      }, {}),

      // Upgrades (one-time)
      upgrades: this.gameData.upgrades.reduce((acc, upgrade) => {
        acc[upgrade.id] = {
          purchased: false,
          unlocked: false // Will be updated in first tick
        };
        return acc;
      }, {}),

      // Achievements
      achievements: this.gameData.achievements.reduce((acc, achievement) => {
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
      eventCounters: {}, // For afterX events
      notifications: [] // For notification system
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
    this.calculateProduction();
    this.checkAchievements();
    this.updateUnlockedUpgrades();
    this.checkTimeBasedEvents();
  }

  // Check time-based events
  checkTimeBasedEvents() {
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - this.gameState.startTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;

    // Check afterXSeconds events
    this.logicExecutor.checkEventCounter('afterXSeconds', 'global', elapsedSeconds);

    // Check afterPlaytime events
    this.logicExecutor.checkEventCounter('afterPlaytime', 'global', elapsedMinutes);
  }

  // Calculates production per second
  calculateProduction() {
    const dt = this.tickRate / 1000; // Delta time in seconds

    // Reset production
    Object.keys(this.gameState.resources).forEach(resId => {
      this.gameState.resources[resId].perSecond = 0;
    });

    // Calculate building production
    this.gameData.buildings.forEach(building => {
      const owned = this.gameState.buildings[building.id].owned;
      if (owned === 0) return;

      building.produces.forEach(production => {
        const baseAmount = production.amount * owned;
        const multiplier = this.getTotalMultiplier(production.resourceId, 'production');
        const finalAmount = baseAmount * multiplier;

        this.gameState.resources[production.resourceId].perSecond += finalAmount;
        this.addResource(production.resourceId, finalAmount * dt);
      });
    });
  }

  // Add resource
  addResource(resourceId, amount) {
    if (!this.gameState.resources[resourceId]) return;

    const resource = this.gameState.resources[resourceId];
    const oldAmount = resource.amount;

    resource.amount += amount;
    resource.total += amount;

    if (amount > 0) {
      resource.totalProduced += amount;
    }

    // Check for resource full/empty events
    if (resource.amount >= resource.maxAmount && oldAmount < resource.maxAmount) {
      this.logicExecutor.triggerEvent('onResourceFull', { resourceId });
    }
    if (resource.amount <= 0 && oldAmount > 0) {
      this.logicExecutor.triggerEvent('onResourceEmpty', { resourceId });
    }

    // Check afterXResources event
    this.logicExecutor.checkEventCounter('afterXResources', resourceId, resource.amount);

    // Check afterXProduction event
    this.logicExecutor.checkEventCounter('afterXProduction', resourceId, resource.totalProduced);
  }

  // Remove Resource
  removeResource(resourceId, amount) {
    if (!this.gameState.resources[resourceId]) return false;

    const resource = this.gameState.resources[resourceId];
    if (resource.amount < amount) return false;

    const oldAmount = resource.amount;
    resource.amount -= amount;
    resource.totalSpent += amount;

    // Check afterXResourcesSpent event
    this.logicExecutor.checkEventCounter('afterXResourcesSpent', resourceId, resource.totalSpent);

    // Check for resource empty event
    if (resource.amount <= 0 && oldAmount > 0) {
      this.logicExecutor.triggerEvent('onResourceEmpty', { resourceId });
    }

    return true;
  }

  // Manual Click
  click() {
    this.gameState.totalClicks++;
    this.logicExecutor.triggerEvent('onClick');

    // Check afterXClicks event
    this.logicExecutor.checkEventCounter('afterXClicks', 'global', this.gameState.totalClicks);

    const clickResource = this.gameData.resources.find(r => r.clickable);
    if (!clickResource) return;

    const baseAmount = clickResource.clickAmount || 1;
    const multiplier = this.getTotalMultiplier(clickResource.id, 'click');
    const finalAmount = baseAmount * multiplier;

    this.addResource(clickResource.id, finalAmount);
  }

  // Buy building
  buyBuilding(buildingId, amount = 1) {
    const building = this.gameData.buildings.find(b => b.id === buildingId);
    if (!building) return false;

    const buildingState = this.gameState.buildings[buildingId];
    const totalCost = this.calculateBuildingCost(building, buildingState.owned, amount);

    // Check if enough resources
    const canAfford = totalCost.every(cost =>
      this.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Deduct resources
    totalCost.forEach(cost => {
      this.removeResource(cost.resourceId, cost.amount);
    });

    // Add building
    buildingState.owned += amount;
    buildingState.totalBought += amount;
    this.gameState.totalBuildingsPurchased += amount;

    // Trigger events
    this.logicExecutor.triggerEvent('afterBoughtBuilding', { buildingId, amount });
    this.logicExecutor.checkEventCounter('afterXBuildings', buildingId, buildingState.owned);

    // Check if building maxed
    if (buildingState.owned >= buildingState.maxOwned) {
      this.logicExecutor.triggerEvent('onBuildingMaxed', { buildingId });
    }

    return true;
  }

  // Calculates building cost with scaling
  calculateBuildingCost(building, currentOwned, amount = 1) {
    return building.cost.map(cost => ({
      resourceId: cost.resourceId,
      amount: this.calculateScaledCost(
        cost.baseAmount,
        building.costScaling || 1.15,
        currentOwned,
        amount
      )
    }));
  }

  // Calculate scaled cost (sum from owned to owned+amount)
  calculateScaledCost(baseCost, scaling, owned, amount) {
    let total = 0;
    for (let i = 0; i < amount; i++) {
      total += baseCost * Math.pow(scaling, owned + i);
    }
    return Math.floor(total);
  }

  // Buy upgrade
  buyUpgrade(upgradeId) {
    const upgrade = this.gameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const upgradeState = this.gameState.upgrades[upgradeId];
    if (upgradeState.purchased || !upgradeState.unlocked) return false;

    // Check cost
    const canAfford = upgrade.cost.every(cost =>
      this.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Deduct resources
    upgrade.cost.forEach(cost => {
      this.removeResource(cost.resourceId, cost.amount);
    });

    // Activate upgrade
    upgradeState.purchased = true;
    this.gameState.totalUpgradesPurchased++;

    // Trigger events
    this.logicExecutor.triggerEvent('afterBoughtUpgrade', { upgradeId });
    this.logicExecutor.checkEventCounter('afterXBoughtUpgrades', 'global', this.gameState.totalUpgradesPurchased);

    return true;
  }

  // Checks Requirements
  checkRequirements(requirements, context) {
    if (!requirements || requirements.length === 0) return true;

    return requirements.every(req => {
      switch (req.type) {
        case 'resource':
          return this.gameState.resources[req.resourceId]?.amount >= req.amount;

        case 'building':
          return this.gameState.buildings[req.buildingId]?.owned >= req.amount;

        case 'upgrade':
          return this.gameState.upgrades[req.upgradeId]?.purchased;

        case 'achievement':
          return this.gameState.achievements[req.achievementId]?.unlocked;

        case 'prestige':
          return this.gameState.prestige.level >= req.level;

        case 'totalClicks':
          return this.gameState.totalClicks >= req.amount;

        default:
          return true;
      }
    });
  }

  // Update which upgrades are unlocked
  updateUnlockedUpgrades() {
    this.gameData.upgrades.forEach(upgrade => {
      if (!this.gameState.upgrades[upgrade.id].purchased) {
        this.gameState.upgrades[upgrade.id].unlocked =
          this.checkRequirements(upgrade.unlockRequirements, null);
      }
    });
  }

  // Check Achievements
  checkAchievements() {
    this.gameData.achievements.forEach(achievement => {
      if (this.gameState.achievements[achievement.id].unlocked) return;

      const unlocked = this.checkRequirements(achievement.requirements, null);

      if (unlocked) {
        this.gameState.achievements[achievement.id].unlocked = true;
        this.gameState.achievements[achievement.id].progress = 100;
        this.gameState.totalAchievementsUnlocked++;

        // Trigger events
        this.logicExecutor.triggerEvent('onAchievementUnlock', { achievementId: achievement.id });
        this.logicExecutor.checkEventCounter('afterXAchievements', 'global', this.gameState.totalAchievementsUnlocked);
      }
    });
  }

  // Calculates multiplier from all upgrades
  getTotalMultiplier(resourceId, type) {
    let multiplier = 1;

    // From purchased upgrades
    this.gameData.upgrades.forEach(upgrade => {
      if (!this.gameState.upgrades[upgrade.id].purchased) return;

      upgrade.effects.forEach(effect => {
        if (effect.type === 'multiply' && effect.target === type) {
          if (!effect.resourceId || effect.resourceId === resourceId) {
            multiplier *= effect.value;
          }
        }
      });
    });

    // From Prestige
    multiplier *= this.getPrestigeMultiplier(resourceId);

    return multiplier;
  }

  // Prestige Multiplier
  getPrestigeMultiplier(resourceId) {
    return 1 + (this.gameState.prestige.level * 0.1); // +10% per Prestige Level
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
}
