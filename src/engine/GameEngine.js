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

    // Logic Engine Setup
    this.logic = gameData.logic || { nodes: [], edges: [] };
    this.nodeMap = new Map(this.logic.nodes.map(node => [node.id, node]));
    this.edgeMap = new Map();
    for (const edge of this.logic.edges) {
        if (!this.edgeMap.has(edge.source)) {
            this.edgeMap.set(edge.source, []);
        }
        this.edgeMap.get(edge.source).push(edge);
    }
  }

  initializeGameState() {
    return {
      // Ressourcen
      resources: this.gameData.resources.reduce((acc, res) => {
        acc[res.id] = {
          amount: res.startAmount || 0,
          total: res.startAmount || 0, // Lifetime total für Achievements
          totalProduced: 0, // Total produced (for production tracking)
          totalSpent: 0, // Total spent (for spending tracking)
          perSecond: 0,
          maxAmount: res.maxAmount || Infinity // For resource full/empty events
        };
        return acc;
      }, {}),

      // Gebäude
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

  // Startet den Game Loop
  start() {
    if (this.tickInterval) return;
    this.triggerEvent('onGameStart');

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
    this.triggerEvent('onTick');
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
    this.checkEventCounter('afterXSeconds', 'global', elapsedSeconds);

    // Check afterPlaytime events
    this.checkEventCounter('afterPlaytime', 'global', elapsedMinutes);
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

    const resource = this.gameState.resources[resourceId];
    const oldAmount = resource.amount;

    resource.amount += amount;
    resource.total += amount;

    if (amount > 0) {
      resource.totalProduced += amount;
    }

    // Check for resource full/empty events
    if (resource.amount >= resource.maxAmount && oldAmount < resource.maxAmount) {
      this.triggerEvent('onResourceFull', { resourceId });
    }
    if (resource.amount <= 0 && oldAmount > 0) {
      this.triggerEvent('onResourceEmpty', { resourceId });
    }

    // Check afterXResources event
    this.checkEventCounter('afterXResources', resourceId, resource.amount);

    // Check afterXProduction event
    this.checkEventCounter('afterXProduction', resourceId, resource.totalProduced);
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
    this.checkEventCounter('afterXResourcesSpent', resourceId, resource.totalSpent);

    // Check for resource empty event
    if (resource.amount <= 0 && oldAmount > 0) {
      this.triggerEvent('onResourceEmpty', { resourceId });
    }

    return true;
  }

  // Manual Click
  click() {
    this.gameState.totalClicks++;
    this.triggerEvent('onClick');

    // Check afterXClicks event
    this.checkEventCounter('afterXClicks', 'global', this.gameState.totalClicks);

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

    const buildingState = this.gameState.buildings[buildingId];
    const totalCost = this.calculateBuildingCost(building, buildingState.owned, amount);

    // Check ob genug Ressourcen
    const canAfford = totalCost.every(cost =>
      this.gameState.resources[cost.resourceId].amount >= cost.amount
    );

    if (!canAfford) return false;

    // Ressourcen abziehen
    totalCost.forEach(cost => {
      this.removeResource(cost.resourceId, cost.amount);
    });

    // Gebäude hinzufügen
    buildingState.owned += amount;
    buildingState.totalBought += amount;
    this.gameState.totalBuildingsPurchased += amount;

    // Trigger events
    this.triggerEvent('afterBoughtBuilding', { buildingId, amount });
    this.checkEventCounter('afterXBuildings', buildingId, buildingState.owned);

    // Check if building maxed
    if (buildingState.owned >= buildingState.maxOwned) {
      this.triggerEvent('onBuildingMaxed', { buildingId });
    }

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
      this.removeResource(cost.resourceId, cost.amount);
    });

    // Upgrade aktivieren
    upgradeState.purchased = true;
    this.gameState.totalUpgradesPurchased++;

    // Trigger events
    this.triggerEvent('afterBoughtUpgrade', { upgradeId });
    this.checkEventCounter('afterXBoughtUpgrades', 'global', this.gameState.totalUpgradesPurchased);

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
        this.gameState.totalAchievementsUnlocked++;

        // Trigger events
        this.triggerEvent('onAchievementUnlock', { achievementId: achievement.id });
        this.checkEventCounter('afterXAchievements', 'global', this.gameState.totalAchievementsUnlocked);
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
  
  // --- Logic Engine Methods ---

  triggerEvent(eventName, context = {}) {
    const eventNodes = this.logic.nodes.filter(
      node => node.type === 'event' && node.data.eventType === eventName
    );
    for (const eventNode of eventNodes) {
        // Check if event node has specific requirements (e.g., specific resourceId)
        const nodeData = eventNode.data;
        let shouldTrigger = true;

        // For events that target specific items, check if it matches
        if (context.resourceId && nodeData.resourceId && nodeData.resourceId !== context.resourceId) {
          shouldTrigger = false;
        }
        if (context.buildingId && nodeData.buildingId && nodeData.buildingId !== context.buildingId) {
          shouldTrigger = false;
        }
        if (context.upgradeId && nodeData.upgradeId && nodeData.upgradeId !== context.upgradeId) {
          shouldTrigger = false;
        }
        if (context.achievementId && nodeData.achievementId && nodeData.achievementId !== context.achievementId) {
          shouldTrigger = false;
        }

        if (shouldTrigger) {
          this.executeGraphFromNode(eventNode.id, context);
        }
    }
  }

  executeGraphFromNode(nodeId, context = {}) {
      const startNode = this.nodeMap.get(nodeId);
      if (!startNode) return;

      // Get all outgoing edges
      const outgoingEdges = this.edgeMap.get(nodeId) || [];

      for (const edge of outgoingEdges) {
          const targetNode = this.nodeMap.get(edge.target);
          if (!targetNode) continue;

          // Execute based on node type
          if (targetNode.type === 'action') {
            this.executeAction(targetNode, context);
            // Continue from this action node
            this.executeGraphFromNode(targetNode.id, context);
          } else if (targetNode.type === 'condition') {
            this.executeCondition(targetNode, context);
          } else if (targetNode.type === 'logic') {
            this.executeLogic(targetNode, context);
          }
      }
  }

  executeAction(node, context = {}) {
      const data = node.data;

      switch (data.actionType) {
          case 'addResource':
              if (data.resourceId && data.amount) {
                  this.addResource(data.resourceId, parseFloat(data.amount));
              }
              break;

          case 'removeResource':
              if (data.resourceId && data.amount) {
                  this.removeResource(data.resourceId, parseFloat(data.amount));
              }
              break;

          case 'setResource':
              if (data.resourceId && data.amount !== undefined) {
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.amount = parseFloat(data.amount);
                  }
              }
              break;

          case 'multiplyResource':
              if (data.resourceId && data.multiplier) {
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.amount *= parseFloat(data.multiplier);
                  }
              }
              break;

          case 'unlockUpgrade':
              if (data.upgradeId) {
                  const upgrade = this.gameState.upgrades[data.upgradeId];
                  if (upgrade) {
                    upgrade.unlocked = true;
                  }
              }
              break;

          case 'unlockBuilding':
              if (data.buildingId) {
                  const building = this.gameState.buildings[data.buildingId];
                  if (building) {
                    building.unlocked = true;
                  }
              }
              break;

          case 'showNotification':
              if (data.message) {
                  this.gameState.notifications.push({
                    message: data.message,
                    timestamp: Date.now(),
                    duration: data.duration || 3000
                  });
              }
              break;

          case 'addProduction':
              if (data.resourceId && data.amount) {
                  // This modifies the per-second production temporarily
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.perSecond += parseFloat(data.amount);
                  }
              }
              break;

          case 'multiplyProduction':
              if (data.resourceId && data.multiplier) {
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.perSecond *= parseFloat(data.multiplier);
                  }
              }
              break;

          case 'forcePrestige':
              this.performPrestige();
              break;

          case 'unlockAchievement':
              if (data.achievementId) {
                  const achievement = this.gameState.achievements[data.achievementId];
                  if (achievement && !achievement.unlocked) {
                    achievement.unlocked = true;
                    achievement.progress = 100;
                    this.gameState.totalAchievementsUnlocked++;
                  }
              }
              break;

          case 'setClickPower':
              if (data.amount !== undefined) {
                  const clickResource = this.gameData.resources.find(r => r.clickable);
                  if (clickResource) {
                    clickResource.clickAmount = parseFloat(data.amount);
                  }
              }
              break;

          default:
              break;
      }
  }

  executeCondition(node, context = {}) {
      const data = node.data;
      let conditionResult = false;

      switch (data.conditionType) {
          case 'ifResource':
              if (data.resourceId && data.amount !== undefined && data.comparison) {
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    conditionResult = this.compareValues(resource.amount, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifBuilding':
              if (data.buildingId && data.amount !== undefined && data.comparison) {
                  const building = this.gameState.buildings[data.buildingId];
                  if (building) {
                    conditionResult = this.compareValues(building.owned, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifUpgradeOwned':
              if (data.upgradeId) {
                  const upgrade = this.gameState.upgrades[data.upgradeId];
                  conditionResult = upgrade?.purchased || false;
              }
              break;

          case 'ifAchievementUnlocked':
              if (data.achievementId) {
                  const achievement = this.gameState.achievements[data.achievementId];
                  conditionResult = achievement?.unlocked || false;
              }
              break;

          case 'ifProductionRate':
              if (data.resourceId && data.amount !== undefined && data.comparison) {
                  const resource = this.gameState.resources[data.resourceId];
                  if (resource) {
                    conditionResult = this.compareValues(resource.perSecond, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifPrestigeLevel':
              if (data.level !== undefined && data.comparison) {
                  conditionResult = this.compareValues(this.gameState.prestige.level, data.comparison, parseFloat(data.level));
              }
              break;

          case 'ifPlaytime':
              if (data.minutes !== undefined && data.comparison) {
                  const playtimeMinutes = (Date.now() - this.gameState.startTime) / 60000;
                  conditionResult = this.compareValues(playtimeMinutes, data.comparison, parseFloat(data.minutes));
              }
              break;

          case 'ifBuildingOwned':
              if (data.buildingId) {
                  const building = this.gameState.buildings[data.buildingId];
                  conditionResult = building && building.owned > 0;
              }
              break;

          default:
              break;
      }

      // Follow the correct path based on condition result
      const outgoingEdges = this.edgeMap.get(node.id) || [];
      for (const edge of outgoingEdges) {
          // Check if this edge matches the condition result
          if ((conditionResult && edge.sourceHandle === 'true') ||
              (!conditionResult && edge.sourceHandle === 'false')) {
              const targetNode = this.nodeMap.get(edge.target);
              if (targetNode) {
                this.executeGraphFromNode(edge.target, context);
              }
          }
      }
  }

  executeLogic(node, context = {}) {
      const data = node.data;

      switch (data.logicType) {
          case 'delay':
              if (data.seconds) {
                  // Schedule continuation after delay
                  setTimeout(() => {
                    this.executeGraphFromNode(node.id, context);
                  }, parseFloat(data.seconds) * 1000);
              }
              return; // Don't continue immediately

          case 'random':
              if (data.chance) {
                  const roll = Math.random() * 100;
                  const success = roll < parseFloat(data.chance);

                  // Follow true or false path based on random result
                  const outgoingEdges = this.edgeMap.get(node.id) || [];
                  for (const edge of outgoingEdges) {
                      if ((success && edge.sourceHandle === 'true') ||
                          (!success && edge.sourceHandle === 'false')) {
                          this.executeGraphFromNode(edge.target, context);
                      }
                  }
              }
              return; // Don't continue normally

          case 'loop':
              if (data.iterations) {
                  const iterations = parseInt(data.iterations);
                  for (let i = 0; i < iterations; i++) {
                    this.executeGraphFromNode(node.id, { ...context, loopIteration: i });
                  }
              }
              return; // Don't continue normally

          case 'branch':
          case 'sequence':
              // These just pass through to all connected nodes
              this.executeGraphFromNode(node.id, context);
              break;

          default:
              break;
      }
  }

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

  // Helper method to check event counters for afterX events
  checkEventCounter(eventType, targetId, currentValue) {
      const eventNodes = this.logic.nodes.filter(
        node => node.type === 'event' && node.data.eventType === eventType
      );

      for (const eventNode of eventNodes) {
        const data = eventNode.data;

        // Check if this event applies to this target
        const targetMatch = !data.resourceId || data.resourceId === targetId ||
                           !data.buildingId || data.buildingId === targetId ||
                           targetId === 'global';

        if (!targetMatch) continue;

        const threshold = parseFloat(data.amount || data.count || 0);
        const counterKey = `${eventType}_${eventNode.id}`;

        // Check if we just crossed the threshold
        if (!this.gameState.eventCounters[counterKey] && currentValue >= threshold) {
          this.gameState.eventCounters[counterKey] = true;
          this.executeGraphFromNode(eventNode.id, { targetId, currentValue });
        }
      }
  }

  // Prestige function
  performPrestige() {
      // Calculate prestige currency based on current resources
      const prestigeCurrency = Math.floor(Math.sqrt(this.gameState.resources[Object.keys(this.gameState.resources)[0]]?.amount || 0));

      this.gameState.prestige.level++;
      this.gameState.prestige.currency += prestigeCurrency;

      // Trigger event
      this.triggerEvent('onPrestige');

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

  // Reset (für Prestige)
  reset(keepPrestige = false) {
    const oldPrestige = keepPrestige ? { ...this.gameState.prestige } : null;
    this.gameState = this.initializeGameState();
    if (oldPrestige) {
      this.gameState.prestige = oldPrestige;
    }
  }
}
