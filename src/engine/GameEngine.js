/**
 * Core Game Engine
 * Verwaltet die gesamte Spiellogik: Ressourcen, Gebäude, Upgrades, Achievements
 */

export class GameEngine {
  constructor(gameData) {
    this.gameData = gameData;
    this.gameState = this.initializeGameState();
    this.tickInterval = null;
    this.tickRate = 100; // 100ms = 10 ticks per second
  }

  initializeGameState() {
    return {
      // Ressourcen
      resources: this.gameData.resources.reduce((acc, res) => {
        acc[res.id] = {
          amount: res.startAmount || 0,
          total: res.startAmount || 0, // Lifetime total für Achievements
          perSecond: 0
        };
        return acc;
      }, {}),

      // Gebäude
      buildings: this.gameData.buildings.reduce((acc, building) => {
        acc[building.id] = {
          owned: 0,
          totalProduction: 0
        };
        return acc;
      }, {}),

      // Upgrades (einmalig)
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

      // Meta
      startTime: Date.now(),
      totalClicks: 0
    };
  }

  // Startet den Game Loop
  start() {
    if (this.tickInterval) return;

    this.tickInterval = setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  // Stoppt den Game Loop
  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // Game Tick - wird 10x pro Sekunde aufgerufen
  tick() {
    this.calculateProduction();
    this.checkAchievements();
    this.updateUnlockedUpgrades();
  }

  // Berechnet Produktion pro Sekunde
  calculateProduction() {
    const dt = this.tickRate / 1000; // Delta time in Sekunden

    // Reset production
    Object.keys(this.gameState.resources).forEach(resId => {
      this.gameState.resources[resId].perSecond = 0;
    });

    // Gebäude-Produktion berechnen
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

  // Ressource hinzufügen
  addResource(resourceId, amount) {
    if (!this.gameState.resources[resourceId]) return;

    this.gameState.resources[resourceId].amount += amount;
    this.gameState.resources[resourceId].total += amount;
  }

  // Manual Click
  click() {
    this.gameState.totalClicks++;

    const clickResource = this.gameData.resources.find(r => r.clickable);
    if (!clickResource) return;

    const baseAmount = clickResource.clickAmount || 1;
    const multiplier = this.getTotalMultiplier(clickResource.id, 'click');
    const finalAmount = baseAmount * multiplier;

    this.addResource(clickResource.id, finalAmount);
  }

  // Gebäude kaufen
  buyBuilding(buildingId, amount = 1) {
    const building = this.gameData.buildings.find(b => b.id === buildingId);
    if (!building) return false;

    const owned = this.gameState.buildings[buildingId].owned;
    const totalCost = this.calculateBuildingCost(building, owned, amount);

    // Check ob genug Ressourcen
    const canAfford = totalCost.every(cost =>
      this.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Ressourcen abziehen
    totalCost.forEach(cost => {
      this.gameState.resources[cost.resourceId].amount -= cost.amount;
    });

    // Gebäude hinzufügen
    this.gameState.buildings[buildingId].owned += amount;

    return true;
  }

  // Berechnet Gebäude-Kosten mit Scaling
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

  // Skalierte Kosten berechnen (Summe von owned bis owned+amount)
  calculateScaledCost(baseCost, scaling, owned, amount) {
    let total = 0;
    for (let i = 0; i < amount; i++) {
      total += baseCost * Math.pow(scaling, owned + i);
    }
    return Math.floor(total);
  }

  // Upgrade kaufen
  buyUpgrade(upgradeId) {
    const upgrade = this.gameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    const upgradeState = this.gameState.upgrades[upgradeId];
    if (upgradeState.purchased || !upgradeState.unlocked) return false;

    // Check Kosten
    const canAfford = upgrade.cost.every(cost =>
      this.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Ressourcen abziehen
    upgrade.cost.forEach(cost => {
      this.gameState.resources[cost.resourceId].amount -= cost.amount;
    });

    // Upgrade aktivieren
    upgradeState.purchased = true;

    return true;
  }

  // Prüft Requirements
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

  // Update welche Upgrades unlocked sind
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
      }
    });
  }

  // Berechnet Multiplikator aus allen Upgrades
  getTotalMultiplier(resourceId, type) {
    let multiplier = 1;

    // Von gekauften Upgrades
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

    // Von Prestige
    multiplier *= this.getPrestigeMultiplier(resourceId);

    return multiplier;
  }

  // Prestige Multiplikator
  getPrestigeMultiplier(resourceId) {
    return 1 + (this.gameState.prestige.level * 0.1); // +10% pro Prestige Level
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

  // Reset (für Prestige)
  reset(keepPrestige = false) {
    const oldPrestige = keepPrestige ? { ...this.gameState.prestige } : null;
    this.gameState = this.initializeGameState();
    if (oldPrestige) {
      this.gameState.prestige = oldPrestige;
    }
  }
}
