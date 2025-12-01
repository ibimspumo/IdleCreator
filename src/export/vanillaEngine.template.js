// Vanilla JS Game Engine - No React/Dependencies
// This is a template that gets populated with game data during export

class GameEngine {
  constructor(gameData) {
    this.gameData = gameData;
    this.gameState = this.createInitialState();
    this.tickInterval = null;
    this.notificationTimeout = null;
  }

  createInitialState() {
    const state = {
      resources: {},
      buildings: {},
      upgrades: {},
      achievements: {},
      prestige: { level: 0, currency: 0 },
      totalClicks: 0,
      eventCounters: {},
      notifications: []
    };

    // Initialize resources
    this.gameData.resources.forEach(resource => {
      state.resources[resource.id] = {
        amount: resource.startAmount || 0,
        total: 0,
        perSecond: 0,
        totalProduced: 0,
        totalSpent: 0
      };
    });

    // Initialize buildings
    this.gameData.buildings.forEach(building => {
      state.buildings[building.id] = {
        owned: 0,
        totalBought: 0,
        unlocked: true
      };
    });

    // Initialize upgrades
    this.gameData.upgrades.forEach(upgrade => {
      state.upgrades[upgrade.id] = {
        purchased: false,
        unlocked: false
      };
    });

    // Initialize achievements
    this.gameData.achievements.forEach(achievement => {
      state.achievements[achievement.id] = {
        unlocked: false,
        progress: 0
      };
    });

    return state;
  }

  start() {
    this.tick();
    this.tickInterval = setInterval(() => this.tick(), 100); // 10 ticks per second
    this.render();
  }

  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }

  tick() {
    this.calculateProduction();
    this.checkAchievements();
    this.render();
  }

  calculateProduction() {
    // Calculate production for each resource
    this.gameData.resources.forEach(resource => {
      let perSecond = 0;

      // Add building production
      this.gameData.buildings.forEach(building => {
        const owned = this.gameState.buildings[building.id].owned;
        if (owned > 0) {
          building.produces.forEach(prod => {
            if (prod.resourceId === resource.id) {
              perSecond += prod.amount * owned;
            }
          });
        }
      });

      // Apply upgrade multipliers
      this.gameData.upgrades.forEach(upgrade => {
        if (this.gameState.upgrades[upgrade.id].purchased) {
          upgrade.effects.forEach(effect => {
            if (effect.type === 'multiply' && effect.target === 'production') {
              perSecond *= effect.value;
            }
          });
        }
      });

      this.gameState.resources[resource.id].perSecond = perSecond;

      // Add resources (100ms tick = 0.1 seconds)
      const amount = perSecond * 0.1;
      if (amount > 0) {
        this.addResource(resource.id, amount);
      }
    });
  }

  click() {
    const clickResource = this.gameData.resources.find(r => r.clickable);
    if (!clickResource) return;

    let amount = clickResource.clickAmount || 1;

    // Apply upgrade multipliers
    this.gameData.upgrades.forEach(upgrade => {
      if (this.gameState.upgrades[upgrade.id].purchased) {
        upgrade.effects.forEach(effect => {
          if (effect.type === 'multiply' && effect.target === 'click') {
            amount *= effect.value;
          }
        });
      }
    });

    this.addResource(clickResource.id, amount);
    this.gameState.totalClicks++;
    this.render();
  }

  addResource(resourceId, amount) {
    const resourceState = this.gameState.resources[resourceId];
    resourceState.amount += amount;
    resourceState.total += amount;
    resourceState.totalProduced += amount;
  }

  buyBuilding(buildingId, amount = 1) {
    const building = this.gameData.buildings.find(b => b.id === buildingId);
    if (!building) return false;

    const owned = this.gameState.buildings[buildingId].owned;
    const cost = this.calculateBuildingCost(building, owned, amount);

    // Check if can afford
    if (!this.canAfford(cost)) return false;

    // Deduct cost
    cost.forEach(({ resourceId, amount }) => {
      this.gameState.resources[resourceId].amount -= amount;
      this.gameState.resources[resourceId].totalSpent += amount;
    });

    // Add building
    this.gameState.buildings[buildingId].owned += amount;
    this.gameState.buildings[buildingId].totalBought += amount;

    this.render();
    return true;
  }

  calculateBuildingCost(building, owned, amount = 1) {
    return building.cost.map(costItem => {
      let totalCost = 0;
      for (let i = 0; i < amount; i++) {
        totalCost += costItem.baseAmount * Math.pow(building.costScaling, owned + i);
      }
      return {
        resourceId: costItem.resourceId,
        amount: totalCost
      };
    });
  }

  canAfford(cost) {
    return cost.every(({ resourceId, amount }) => {
      return this.gameState.resources[resourceId].amount >= amount;
    });
  }

  buyUpgrade(upgradeId) {
    const upgrade = this.gameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const upgradeState = this.gameState.upgrades[upgradeId];
    if (upgradeState.purchased || !upgradeState.unlocked) return false;

    // Check cost
    if (!this.canAfford(upgrade.cost)) return false;

    // Deduct cost
    upgrade.cost.forEach(({ resourceId, amount }) => {
      this.gameState.resources[resourceId].amount -= amount;
      this.gameState.resources[resourceId].totalSpent += amount;
    });

    upgradeState.purchased = true;
    this.showNotification(`Upgrade purchased: ${upgrade.name}`, 'success');
    this.render();
    return true;
  }

  checkAchievements() {
    this.gameData.achievements.forEach(achievement => {
      const state = this.gameState.achievements[achievement.id];
      if (state.unlocked) return;

      let unlocked = false;
      achievement.requirements.forEach(req => {
        if (req.type === 'resource') {
          const resourceState = this.gameState.resources[req.resourceId];
          unlocked = resourceState.amount >= req.amount;
        } else if (req.type === 'totalClicks') {
          unlocked = this.gameState.totalClicks >= req.amount;
        } else if (req.type === 'building') {
          const buildingState = this.gameState.buildings[req.buildingId];
          unlocked = buildingState.owned >= req.amount;
        }
      });

      if (unlocked) {
        state.unlocked = true;
        this.showNotification(`Achievement unlocked: ${achievement.name}`, 'achievement');
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = { message, type, id: Date.now() };
    this.gameState.notifications.push(notification);

    setTimeout(() => {
      const index = this.gameState.notifications.findIndex(n => n.id === notification.id);
      if (index >= 0) {
        this.gameState.notifications.splice(index, 1);
        this.render();
      }
    }, 3000);

    this.render();
  }

  formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
  }

  render() {
    // This method is overridden to render the UI
    // See htmlGenerator.js for the actual rendering logic
  }
}

// Export for use in generated HTML
if (typeof window !== 'undefined') {
  window.GameEngine = GameEngine;
}
