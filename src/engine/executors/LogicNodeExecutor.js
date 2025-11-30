/**
 * LogicNodeExecutor - Handles execution of logic nodes (delay, random, loop, etc.)
 */

export class LogicNodeExecutor {
  constructor(logicExecutor) {
    this.executor = logicExecutor;
    this.game = logicExecutor.game;
  }

  /**
   * Execute logic node
   */
  executeLogic(node, context = {}) {
    const data = node.data;

    switch (data.logicType) {
      case 'delay':
        if (data.seconds) {
          // Schedule continuation after delay
          setTimeout(() => {
            this.executor.executeGraphFromNode(node.id, context);
          }, parseFloat(data.seconds) * 1000);
        }
        return; // Don't continue immediately

      case 'random':
        if (data.chance) {
          const roll = Math.random() * 100;
          const success = roll < parseFloat(data.chance);

          // Follow true or false path based on random result
          const outgoingEdges = this.executor.edgeMap.get(node.id) || [];
          for (const edge of outgoingEdges) {
            if ((success && edge.sourceHandle === 'true') ||
                (!success && edge.sourceHandle === 'false')) {
              this.executor.executeGraphFromNode(edge.target, context);
            }
          }
        }
        return; // Don't continue normally

      case 'loop':
        if (data.iterations) {
          const iterations = parseInt(data.iterations);
          for (let i = 0; i < iterations; i++) {
            this.executor.executeGraphFromNode(node.id, { ...context, loopIteration: i });
          }
        }
        return; // Don't continue normally

      case 'branch':
      case 'sequence':
        // These just pass through to all connected nodes
        this.executor.executeGraphFromNode(node.id, context);
        break;

      default:
        break;
    }
  }
}
