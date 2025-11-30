/**
 * ExecutableCodeGenerator - Generates real, executable JavaScript code from logic nodes
 * This code mirrors exactly what the LogicExecutor runs
 */

export class ExecutableCodeGenerator {
  constructor(nodes, edges, gameData) {
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.gameData = gameData;
    this.nodeMap = new Map(this.nodes.map(node => [node.id, node]));
    this.edgeMap = new Map();

    // Build edge map
    for (const edge of this.edges) {
      if (!this.edgeMap.has(edge.source)) {
        this.edgeMap.set(edge.source, []);
      }
      this.edgeMap.get(edge.source).push(edge);
    }

    this.indentLevel = 0;
  }

  /**
   * Generate complete executable code
   */
  generate() {
    const lines = [];

    // Find all event nodes (entry points)
    const eventNodes = this.nodes.filter(node => node.type === 'event');

    if (eventNodes.length === 0) {
      return '// No logic defined';
    }

    // Group events by type for better organization
    const eventsByType = {};
    eventNodes.forEach(node => {
      const eventType = node.data.eventType;
      if (!eventsByType[eventType]) {
        eventsByType[eventType] = [];
      }
      eventsByType[eventType].push(node);
    });

    // Generate code for each event type
    Object.entries(eventsByType).forEach(([eventType, nodes], index) => {
      if (index > 0) lines.push('');
      lines.push(...this.generateEventHandler(eventType, nodes));
    });

    return lines.join('\n');
  }

  /**
   * Generate event handler function
   */
  generateEventHandler(eventType, eventNodes) {
    const lines = [];

    lines.push(`function handle_${eventType}(context) {`);

    this.indentLevel = 1;

    eventNodes.forEach((node, index) => {
      if (index > 0) lines.push('');

      // Check if event has specific target filters
      const filters = this.getEventFilters(node);
      if (filters.length > 0) {
        const indent = '  '.repeat(this.indentLevel);
        lines.push(`${indent}if (${filters.join(' && ')}) {`);
        this.indentLevel++;
      }

      // Generate children
      const children = this.getChildNodes(node.id);
      children.forEach(childId => {
        lines.push(...this.generateFromNode(childId));
      });

      if (filters.length > 0) {
        this.indentLevel--;
        const indent = '  '.repeat(this.indentLevel);
        lines.push(`${indent}}`);
      }
    });

    this.indentLevel = 0;
    lines.push('}');

    return lines;
  }

  /**
   * Get event filters (e.g., specific resourceId, buildingId)
   */
  getEventFilters(eventNode) {
    const data = eventNode.data;
    const filters = [];

    if (data.resourceId) {
      filters.push(`context.resourceId === '${data.resourceId}'`);
    }
    if (data.buildingId) {
      filters.push(`context.buildingId === '${data.buildingId}'`);
    }
    if (data.upgradeId) {
      filters.push(`context.upgradeId === '${data.upgradeId}'`);
    }
    if (data.achievementId) {
      filters.push(`context.achievementId === '${data.achievementId}'`);
    }

    return filters;
  }

  /**
   * Generate code from a node
   */
  generateFromNode(nodeId) {
    const node = this.nodeMap.get(nodeId);
    if (!node) return [];

    const lines = [];
    const indent = '  '.repeat(this.indentLevel);

    switch (node.type) {
      case 'action':
        lines.push(`${indent}${this.generateAction(node)}`);
        const actionChildren = this.getChildNodes(nodeId);
        actionChildren.forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        break;

      case 'condition':
        lines.push(...this.generateCondition(node));
        break;

      case 'logic':
        lines.push(...this.generateLogicNode(node));
        break;

      case 'group':
        const groupChildren = this.getChildNodes(nodeId);
        groupChildren.forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        break;
    }

    return lines;
  }

  /**
   * Generate action code
   */
  generateAction(node) {
    const data = node.data;

    switch (data.actionType) {
      case 'addResource':
        return `engine.resourceManager.addResource('${data.resourceId}', ${data.amount});`;

      case 'removeResource':
        return `engine.resourceManager.removeResource('${data.resourceId}', ${data.amount});`;

      case 'setResource':
        return `engine.resourceManager.setResource('${data.resourceId}', ${data.amount});`;

      case 'multiplyResource':
        return `engine.resourceManager.multiplyResource('${data.resourceId}', ${data.multiplier});`;

      case 'unlockBuilding':
        return `engine.buildingManager.unlockBuilding('${data.buildingId}');`;

      case 'unlockUpgrade':
        return `engine.upgradeManager.unlockUpgrade('${data.upgradeId}');`;

      case 'unlockAchievement':
        return `engine.achievementManager.unlockAchievement('${data.achievementId}');`;

      case 'showNotification':
        return `engine.gameState.notifications.push({ message: '${this.escapeString(data.message)}', timestamp: Date.now(), duration: ${data.duration || 3000} });`;

      case 'addProduction':
        return `engine.productionManager.addProduction('${data.resourceId}', ${data.amount});`;

      case 'multiplyProduction':
        const resourceTarget = data.resourceId || 'null';
        return `engine.productionManager.multiplyProduction(${resourceTarget === 'null' ? 'null' : `'${resourceTarget}'`}, ${data.multiplier});`;

      case 'setClickPower':
        return `engine.productionManager.setClickPower(${data.amount});`;

      case 'forcePrestige':
        return `engine.performPrestige();`;

      default:
        return `// Unknown action: ${data.actionType}`;
    }
  }

  /**
   * Generate condition code
   */
  generateCondition(node) {
    const data = node.data;
    const lines = [];
    const indent = '  '.repeat(this.indentLevel);

    const condition = this.getConditionExpression(data);

    lines.push(`${indent}if (${condition}) {`);
    this.indentLevel++;

    // Get true path (from 'true' handle)
    const trueEdges = this.edgeMap.get(node.id)?.filter(e =>
      e.sourceHandle === 'true' || e.sourceHandle === 'output-true'
    ) || [];

    if (trueEdges.length > 0) {
      trueEdges.forEach(edge => {
        lines.push(...this.generateFromNode(edge.target));
      });
    } else {
      lines.push(`${indent}  // No actions on true path`);
    }

    this.indentLevel--;

    // Get false path (from 'false' handle)
    const falseEdges = this.edgeMap.get(node.id)?.filter(e =>
      e.sourceHandle === 'false' || e.sourceHandle === 'output-false'
    ) || [];

    if (falseEdges.length > 0) {
      lines.push(`${indent}} else {`);
      this.indentLevel++;
      falseEdges.forEach(edge => {
        lines.push(...this.generateFromNode(edge.target));
      });
      this.indentLevel--;
    }

    lines.push(`${indent}}`);

    return lines;
  }

  /**
   * Get condition expression
   */
  getConditionExpression(data) {
    switch (data.conditionType) {
      case 'ifResource':
        return `engine.gameState.resources['${data.resourceId}']?.amount ${data.operator} ${data.amount}`;

      case 'ifBuilding':
        return `engine.gameState.buildings['${data.buildingId}']?.owned ${data.operator} ${data.amount}`;

      case 'ifUpgradeOwned':
        return `engine.gameState.upgrades['${data.upgradeId}']?.purchased === true`;

      case 'ifAchievementUnlocked':
        return `engine.gameState.achievements['${data.achievementId}']?.unlocked === true`;

      case 'ifProductionRate':
        return `engine.gameState.resources['${data.resourceId}']?.perSecond ${data.operator} ${data.amount}`;

      case 'ifPrestigeLevel':
        return `engine.gameState.prestige.level ${data.operator} ${data.level}`;

      case 'ifPlaytime':
        const playtimeSeconds = `Math.floor((Date.now() - engine.gameState.startTime) / 1000)`;
        return `${playtimeSeconds} ${data.operator} ${data.seconds}`;

      case 'ifBuildingOwned':
        return `engine.gameState.buildings['${data.buildingId}']?.owned > 0`;

      default:
        return 'false /* unknown condition */';
    }
  }

  /**
   * Generate logic node code
   */
  generateLogicNode(node) {
    const data = node.data;
    const lines = [];
    const indent = '  '.repeat(this.indentLevel);

    switch (data.logicType) {
      case 'delay':
        lines.push(`${indent}await new Promise(resolve => setTimeout(resolve, ${data.seconds * 1000}));`);
        const delayChildren = this.getChildNodes(node.id);
        delayChildren.forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        break;

      case 'loop':
        lines.push(`${indent}for (let i = 0; i < ${data.iterations}; i++) {`);
        this.indentLevel++;
        const loopChildren = this.getChildNodes(node.id);
        loopChildren.forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        this.indentLevel--;
        lines.push(`${indent}}`);
        break;

      case 'random':
        const randomChance = data.chance || 50;
        lines.push(`${indent}if (Math.random() * 100 < ${randomChance}) {`);
        this.indentLevel++;

        const successEdges = this.edgeMap.get(node.id)?.filter(e =>
          e.sourceHandle === 'true' || e.sourceHandle === 'output-success'
        ) || [];
        successEdges.forEach(edge => {
          lines.push(...this.generateFromNode(edge.target));
        });

        this.indentLevel--;
        lines.push(`${indent}} else {`);
        this.indentLevel++;

        const failEdges = this.edgeMap.get(node.id)?.filter(e =>
          e.sourceHandle === 'false' || e.sourceHandle === 'output-failure'
        ) || [];
        failEdges.forEach(edge => {
          lines.push(...this.generateFromNode(edge.target));
        });

        this.indentLevel--;
        lines.push(`${indent}}`);
        break;

      case 'branch':
        const branchChildren = this.getChildNodes(node.id);
        branchChildren.forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        break;

      case 'sequence':
        const seqChildren = this.getChildNodes(node.id);
        seqChildren.forEach((childId, index) => {
          if (index > 0) lines.push('');
          lines.push(...this.generateFromNode(childId));
        });
        break;

      default:
    }

    return lines;
  }

  /**
   * Get child nodes
   */
  getChildNodes(nodeId) {
    const edges = this.edgeMap.get(nodeId) || [];
    // Filter out handle-specific edges (those are handled separately)
    return edges
      .filter(e => !e.sourceHandle || e.sourceHandle === 'output')
      .map(e => e.target);
  }

  /**
   * Escape string for JavaScript
   */
  escapeString(str) {
    return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }
}
