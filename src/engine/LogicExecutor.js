/**
 * LogicExecutor - Orchestrates execution of logic flow graphs
 */

import {
  EventExecutor,
  ActionExecutor,
  ConditionExecutor,
  LogicNodeExecutor
} from './executors/index.js';

export class LogicExecutor {
  constructor(gameEngineInstance) {
    this.game = gameEngineInstance;
    this.logic = this.game.gameData.logic || { nodes: [], edges: [] };
    this.nodeMap = new Map(this.logic.nodes.map(node => [node.id, node]));
    this.edgeMap = new Map();

    // Build edge map
    for (const edge of this.logic.edges) {
      if (!this.edgeMap.has(edge.source)) {
        this.edgeMap.set(edge.source, []);
      }
      this.edgeMap.get(edge.source).push(edge);
    }

    // Initialize executors
    this.eventExecutor = new EventExecutor(this);
    this.actionExecutor = new ActionExecutor(this);
    this.conditionExecutor = new ConditionExecutor(this);
    this.logicNodeExecutor = new LogicNodeExecutor(this);
  }

  /**
   * Trigger event by name
   */
  triggerEvent(eventName, context = {}) {
    return this.eventExecutor.triggerEvent(eventName, context);
  }

  /**
   * Check event counter for afterX events
   */
  checkEventCounter(eventType, targetId, currentValue) {
    return this.eventExecutor.checkEventCounter(eventType, targetId, currentValue);
  }

  /**
   * Execute graph starting from a node
   */
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

  /**
   * Execute action node (delegates to ActionExecutor)
   */
  executeAction(node, context = {}) {
    return this.actionExecutor.executeAction(node, context);
  }

  /**
   * Execute condition node (delegates to ConditionExecutor)
   */
  executeCondition(node, context = {}) {
    return this.conditionExecutor.executeCondition(node, context);
  }

  /**
   * Execute logic node (delegates to LogicNodeExecutor)
   */
  executeLogic(node, context = {}) {
    return this.logicNodeExecutor.executeLogic(node, context);
  }

  /**
   * Compare values (for backward compatibility)
   */
  compareValues(a, comparison, b) {
    return this.conditionExecutor.compareValues(a, comparison, b);
  }
}
