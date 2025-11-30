/**
 * EventExecutor - Handles event triggering and event counter checking
 */

export class EventExecutor {
  constructor(logicExecutor) {
    this.executor = logicExecutor;
    this.game = logicExecutor.game;
  }

  /**
   * Trigger event by name
   */
  triggerEvent(eventName, context = {}) {
    const eventNodes = this.executor.logic.nodes.filter(
      node => node.type === 'event' && node.data.eventType === eventName
    );

    for (const eventNode of eventNodes) {
      // Check if event node has specific requirements
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
        this.executor.executeGraphFromNode(eventNode.id, context);
      }
    }
  }

  /**
   * Check event counter for afterX events
   */
  checkEventCounter(eventType, targetId, currentValue) {
    const eventNodes = this.executor.logic.nodes.filter(
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
        this.executor.executeGraphFromNode(eventNode.id, { targetId, currentValue });
      }
    }
  }
}
