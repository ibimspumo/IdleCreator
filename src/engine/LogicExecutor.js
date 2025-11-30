// LogicExecutor.js
import { GameDataContext } from '../components/Editor/GameDataContext'; // Might be needed if components directly access it
// GameDataContext is usually accessed via useContext in React components.
// For a pure JS engine file, we'd pass necessary data directly or through context parameters.
// For now, I'll assume that `executeAction`, `executeCondition` will need access to the game engine instance itself.

export class LogicExecutor {
  constructor(gameEngineInstance) {
    this.game = gameEngineInstance; // Reference to the main GameEngine instance
    this.logic = this.game.gameData.logic || { nodes: [], edges: [] };
    this.nodeMap = new Map(this.logic.nodes.map(node => [node.id, node]));
    this.edgeMap = new Map();
    for (const edge of this.logic.edges) {
        if (!this.edgeMap.has(edge.source)) {
            this.edgeMap.set(edge.source, []);
        }
        this.edgeMap.get(edge.source).push(edge);
    }
  }

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
                  this.game.addResource(data.resourceId, parseFloat(data.amount));
              }
              break;

          case 'removeResource':
              if (data.resourceId && data.amount) {
                  this.game.removeResource(data.resourceId, parseFloat(data.amount));
              }
              break;

          case 'setResource':
              if (data.resourceId && data.amount !== undefined) {
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.amount = parseFloat(data.amount);
                  }
              }
              break;

          case 'multiplyResource':
              if (data.resourceId && data.multiplier) {
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.amount *= parseFloat(data.multiplier);
                  }
              }
              break;

          case 'unlockUpgrade':
              if (data.upgradeId) {
                  const upgrade = this.game.gameState.upgrades[data.upgradeId];
                  if (upgrade) {
                    upgrade.unlocked = true;
                  }
              }
              break;

          case 'unlockBuilding':
              if (data.buildingId) {
                  const building = this.game.gameState.buildings[data.buildingId];
                  if (building) {
                    building.unlocked = true;
                  }
              }
              break;

          case 'showNotification':
              if (data.message) {
                  this.game.gameState.notifications.push({
                    message: data.message,
                    timestamp: Date.now(),
                    duration: data.duration || 3000
                  });
              }
              break;

          case 'addProduction':
              if (data.resourceId && data.amount) {
                  // This modifies the per-second production temporarily
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.perSecond += parseFloat(data.amount);
                  }
              }
              break;

          case 'multiplyProduction':
              if (data.resourceId && data.multiplier) {
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    resource.perSecond *= parseFloat(data.multiplier);
                  }
              }
              break;

          case 'forcePrestige':
              this.game.performPrestige();
              break;

          case 'unlockAchievement':
              if (data.achievementId) {
                  const achievement = this.game.gameState.achievements[data.achievementId];
                  if (achievement && !achievement.unlocked) {
                    achievement.unlocked = true;
                    achievement.progress = 100;
                    this.game.gameState.totalAchievementsUnlocked++;
                  }
              }
              break;

          case 'setClickPower':
              if (data.amount !== undefined) {
                  const clickResource = this.game.gameData.resources.find(r => r.clickable);
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
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    conditionResult = this.compareValues(resource.amount, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifBuilding':
              if (data.buildingId && data.amount !== undefined && data.comparison) {
                  const building = this.game.gameState.buildings[data.buildingId];
                  if (building) {
                    conditionResult = this.compareValues(building.owned, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifUpgradeOwned':
              if (data.upgradeId) {
                  const upgrade = this.game.gameState.upgrades[data.upgradeId];
                  conditionResult = upgrade?.purchased || false;
              }
              break;

          case 'ifAchievementUnlocked':
              if (data.achievementId) {
                  const achievement = this.game.gameState.achievements[data.achievementId];
                  conditionResult = achievement?.unlocked || false;
              }
              break;

          case 'ifProductionRate':
              if (data.resourceId && data.amount !== undefined && data.comparison) {
                  const resource = this.game.gameState.resources[data.resourceId];
                  if (resource) {
                    conditionResult = this.compareValues(resource.perSecond, data.comparison, parseFloat(data.amount));
                  }
              }
              break;

          case 'ifPrestigeLevel':
              if (data.level !== undefined && data.comparison) {
                  conditionResult = this.compareValues(this.game.gameState.prestige.level, data.comparison, parseFloat(data.level));
              }
              break;

          case 'ifPlaytime':
              if (data.minutes !== undefined && data.comparison) {
                  const playtimeMinutes = (Date.now() - this.game.gameState.startTime) / 60000;
                  conditionResult = this.compareValues(playtimeMinutes, data.comparison, parseFloat(data.minutes));
              }
              break;

          case 'ifBuildingOwned':
              if (data.buildingId) {
                  const building = this.game.gameState.buildings[data.buildingId];
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
        if (!this.game.gameState.eventCounters[counterKey] && currentValue >= threshold) {
          this.game.gameState.eventCounters[counterKey] = true;
          this.executeGraphFromNode(eventNode.id, { targetId, currentValue });
        }
      }
  }
}
