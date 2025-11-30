/**
 * Generates a human-readable code preview from logic nodes and edges
 * This converts the visual flow into pseudo-code for better understanding
 */

export class CodePreviewGenerator {
  constructor(nodes, edges, gameData) {
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.gameData = gameData;
    this.nodeMap = new Map(this.nodes.map(node => [node.id, node]));
    this.edgeMap = new Map();

    // Build edge map for quick lookups
    for (const edge of this.edges) {
      if (!this.edgeMap.has(edge.source)) {
        this.edgeMap.set(edge.source, []);
      }
      this.edgeMap.get(edge.source).push(edge);
    }

    this.visitedNodes = new Set();
    this.indentLevel = 0;
  }

  generate() {
    this.visitedNodes.clear();
    this.indentLevel = 0;

    const lines = [];

    // Find all event nodes (entry points)
    const eventNodes = this.nodes.filter(node => node.type === 'event');

    if (eventNodes.length === 0) {
      return '<span class="code-comment">// No logic defined yet</span>\n<span class="code-comment">// Add an Event node to get started!</span>';
    }

    eventNodes.forEach((eventNode, index) => {
      if (index > 0) lines.push(''); // Empty line between events
      lines.push(...this.generateFromNode(eventNode.id));
    });

    return lines.join('\n');
  }

  generateFromNode(nodeId, context = {}) {
    const node = this.nodeMap.get(nodeId);
    if (!node) return [];

    const lines = [];
    const indent = '  '.repeat(this.indentLevel);

    // Generate code for this node
    switch (node.type) {
      case 'event':
        lines.push(...this.generateEventNode(node, indent));
        return lines; // Events handle their own children
      case 'action':
        lines.push(...this.generateActionNode(node, indent));
        break;
      case 'condition':
        lines.push(...this.generateConditionNode(node, indent));
        return lines; // Conditions handle their own children
      case 'logic':
        lines.push(...this.generateLogicNode(node, indent));
        return lines; // Logic nodes handle their own children
      case 'group':
        lines.push(`${indent}<span class="code-comment">// Group: ${this.escapeHtml(node.data.label || 'Unnamed')}</span>`);
        break;
    }

    // Get children and continue traversal (only for action and group nodes)
    if (node.type === 'action' || node.type === 'group') {
      const children = this.getChildNodes(nodeId);
      children.forEach(childId => {
        lines.push(...this.generateFromNode(childId, context));
      });
    }

    return lines;
  }

  generateEventNode(node, indent) {
    const data = node.data;
    const lines = [];

    let eventDescription = this.getEventDescription(data);
    lines.push(`${indent}<span class="code-comment">// Event: ${this.escapeHtml(data.eventType || 'unknown')}</span>`);
    lines.push(`${indent}<span class="code-keyword">when</span> ${eventDescription}:`);

    this.indentLevel++;
    const children = this.getChildNodes(node.id);
    if (children.length === 0) {
      lines.push(`${indent}  <span class="code-comment">// No actions defined</span>`);
    } else {
      children.forEach(childId => {
        lines.push(...this.generateFromNode(childId));
      });
    }
    this.indentLevel--;

    return lines;
  }

  generateActionNode(node, indent) {
    const data = node.data;
    const actionText = this.getActionDescription(data);
    return [`${indent}<span class="code-symbol">→</span> ${actionText}`];
  }

  escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  generateConditionNode(node, indent) {
    const data = node.data;
    const lines = [];
    const conditionText = this.getConditionDescription(data);

    lines.push(`${indent}<span class="code-keyword">if</span> ${conditionText}:`);

    // Get true and false branches
    const trueBranch = this.getChildNodes(node.id, 'true');
    const falseBranch = this.getChildNodes(node.id, 'false');

    // True branch
    this.indentLevel++;
    if (trueBranch.length === 0) {
      lines.push(`${indent}  <span class="code-symbol code-true">✓</span> <span class="code-comment">// No actions</span>`);
    } else {
      trueBranch.forEach(childId => {
        const childLines = this.generateFromNode(childId);
        childLines[0] = childLines[0].replace('<span class="code-symbol">→</span>', '<span class="code-symbol code-true">✓</span>');
        lines.push(...childLines);
      });
    }
    this.indentLevel--;

    // False branch
    if (falseBranch.length > 0) {
      lines.push(`${indent}<span class="code-keyword">else</span>:`);
      this.indentLevel++;
      falseBranch.forEach(childId => {
        const childLines = this.generateFromNode(childId);
        childLines[0] = childLines[0].replace('<span class="code-symbol">→</span>', '<span class="code-symbol code-false">✗</span>');
        lines.push(...childLines);
      });
      this.indentLevel--;
    }

    return lines;
  }

  generateLogicNode(node, indent) {
    const data = node.data;
    const lines = [];

    switch (data.logicType) {
      case 'delay':
        lines.push(`${indent}<span class="code-symbol">⏱</span> <span class="code-keyword">wait</span> <span class="code-number">${data.duration || 1}</span> seconds`);
        break;
      case 'random':
        lines.push(`${indent}<span class="code-symbol">🎲</span> random chance (<span class="code-number">${data.chance || 50}</span>%):`);
        this.indentLevel++;
        const successBranch = this.getChildNodes(node.id, 'true');
        const failBranch = this.getChildNodes(node.id, 'false');

        if (successBranch.length > 0) {
          lines.push(`${indent}  <span class="code-symbol code-true">✓</span> <span class="code-keyword">on success</span>:`);
          this.indentLevel++;
          successBranch.forEach(childId => lines.push(...this.generateFromNode(childId)));
          this.indentLevel--;
        }

        if (failBranch.length > 0) {
          lines.push(`${indent}  <span class="code-symbol code-false">✗</span> <span class="code-keyword">on failure</span>:`);
          this.indentLevel++;
          failBranch.forEach(childId => lines.push(...this.generateFromNode(childId)));
          this.indentLevel--;
        }
        this.indentLevel--;
        return lines;

      case 'loop':
        lines.push(`${indent}<span class="code-symbol">🔁</span> <span class="code-keyword">repeat</span> <span class="code-number">${data.repeatCount || 5}</span> times:`);
        this.indentLevel++;
        this.getChildNodes(node.id).forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        this.indentLevel--;
        return lines;

      case 'branch':
        lines.push(`${indent}<span class="code-symbol">🌳</span> <span class="code-keyword">branch</span> <span class="code-comment">(${data.outputCount || 3} parallel paths)</span>:`);
        this.indentLevel++;
        this.getChildNodes(node.id).forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        this.indentLevel--;
        return lines;

      case 'sequence':
        lines.push(`${indent}<span class="code-symbol">📝</span> <span class="code-keyword">sequence</span>:`);
        this.indentLevel++;
        this.getChildNodes(node.id).forEach(childId => {
          lines.push(...this.generateFromNode(childId));
        });
        this.indentLevel--;
        return lines;
    }

    this.getChildNodes(node.id).forEach(childId => {
      lines.push(...this.generateFromNode(childId));
    });

    return lines;
  }

  getEventDescription(data) {
    const type = data.eventType;

    switch (type) {
      // Simple events (no parameters)
      case 'onGameStart':
        return 'game starts';
      case 'onTick':
        return 'every tick (10x per second)';
      case 'onClick':
        return 'player clicks main resource';
      case 'onPrestige':
        return 'player prestiges';

      // Counter events (afterX...)
      case 'afterXClicks':
        return `player clicks <span class="code-number">${data.clickCount || 10}</span> times${data.repeat ? ' <span class="code-comment">(repeating)</span>' : ''}`;
      case 'afterXSeconds':
        return `<span class="code-number">${data.seconds || 10}</span> seconds pass${data.repeat ? ' <span class="code-comment">(repeating)</span>' : ''}`;
      case 'afterXResources':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> reaches <span class="code-number">${data.amount || 100}</span>`;
      case 'afterXBoughtUpgrades':
        return `player buys <span class="code-number">${data.upgradeCount || 5}</span> upgrades total`;
      case 'afterXResourcesSpent':
        return `player spends <span class="code-number">${data.amountSpent || 1000}</span> <span class="code-variable">${this.getResourceName(data.resourceId)}</span>`;
      case 'afterXBuildings':
        return `player owns <span class="code-number">${data.buildingCount || 10}</span> buildings total`;
      case 'afterXAchievements':
        return `player unlocks <span class="code-number">${data.achievementCount || 5}</span> achievements`;
      case 'afterXProduction':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> produces <span class="code-number">${data.totalProduced || 10000}</span> total`;
      case 'afterPlaytime':
        return `player plays for <span class="code-number">${data.minutes || 60}</span> minutes`;

      // Specific item events
      case 'afterBoughtUpgrade':
        return `player buys upgrade <span class="code-string">"${this.getUpgradeName(data.upgradeId)}"</span>`;
      case 'afterBoughtBuilding':
        return `player buys building <span class="code-string">"${this.getBuildingName(data.buildingId)}"</span>`;
      case 'onAchievementUnlock':
        return `achievement <span class="code-string">"${this.getAchievementName(data.achievementId)}"</span> unlocks`;
      case 'onResourceFull':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> reaches maximum`;
      case 'onResourceEmpty':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> reaches zero`;
      case 'onBuildingMaxed':
        return `building <span class="code-string">"${this.getBuildingName(data.buildingId)}"</span> reaches maximum`;

      default:
        return `<span class="code-error">${type || 'unknown event'}</span>`;
    }
  }

  getActionDescription(data) {
    const type = data.actionType;

    switch (type) {
      case 'addResource':
        return `<span class="code-keyword">add</span> <span class="code-number">${data.amount || 0}</span> to <span class="code-variable">${this.getResourceName(data.resourceId)}</span>`;
      case 'removeResource':
        return `<span class="code-keyword">remove</span> <span class="code-number">${data.amount || 0}</span> from <span class="code-variable">${this.getResourceName(data.resourceId)}</span>`;
      case 'setResource':
        return `<span class="code-keyword">set</span> <span class="code-variable">${this.getResourceName(data.resourceId)}</span> to <span class="code-number">${data.value || 0}</span>`;
      case 'multiplyResource':
        return `<span class="code-keyword">multiply</span> <span class="code-variable">${this.getResourceName(data.resourceId)}</span> by <span class="code-number">${data.multiplier || 1}x</span>`;
      case 'unlockUpgrade':
        return `<span class="code-keyword">unlock upgrade</span> <span class="code-string">"${this.getUpgradeName(data.upgradeId)}"</span>`;
      case 'unlockBuilding':
        return `<span class="code-keyword">unlock building</span> <span class="code-string">"${this.getBuildingName(data.buildingId)}"</span>`;
      case 'unlockAchievement':
        return `<span class="code-keyword">unlock achievement</span> <span class="code-string">"${this.getAchievementName(data.achievementId)}"</span>`;
      case 'showNotification':
        return `<span class="code-keyword">show notification</span> <span class="code-string">"${this.escapeHtml(data.message || 'Notification')}"</span> <span class="code-comment">(${data.duration || 3}s)</span>`;
      case 'addProduction':
        return `<span class="code-keyword">add</span> <span class="code-number">${data.perSecond || 0}/s</span> production to <span class="code-variable">${this.getResourceName(data.resourceId)}</span>`;
      case 'multiplyProduction':
        return `<span class="code-keyword">multiply</span> <span class="code-variable">${this.getResourceName(data.resourceId)}</span> production by <span class="code-number">${data.multiplier || 1}x</span>`;
      case 'forcePrestige':
        return '<span class="code-keyword">force prestige</span>';
      case 'setClickPower':
        return `<span class="code-keyword">set click power to</span> <span class="code-number">${data.clickAmount || 1}</span>`;
      default:
        return `<span class="code-error">${type || 'unknown action'}</span>`;
    }
  }

  getConditionDescription(data) {
    const type = data.conditionType;
    // Support both 'comparison' (old) and 'operator' (new)
    const comparison = this.getComparisonSymbol(data.operator || data.comparison);

    switch (type) {
      case 'ifResource':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> <span class="code-operator">${comparison}</span> <span class="code-number">${data.amount || 0}</span>`;
      case 'ifBuilding':
        return `<span class="code-variable">${this.getBuildingName(data.buildingId)}</span> count <span class="code-operator">${comparison}</span> <span class="code-number">${data.count || 0}</span>`;
      case 'ifUpgradeOwned':
        return `upgrade <span class="code-string">"${this.getUpgradeName(data.upgradeId)}"</span> is owned`;
      case 'ifAchievementUnlocked':
        return `achievement <span class="code-string">"${this.getAchievementName(data.achievementId)}"</span> is unlocked`;
      case 'ifProductionRate':
        return `<span class="code-variable">${this.getResourceName(data.resourceId)}</span> production <span class="code-operator">${comparison}</span> <span class="code-number">${data.perSecond || 0}/s</span>`;
      case 'ifPrestigeLevel':
        return `prestige level <span class="code-operator">${comparison}</span> <span class="code-number">${data.level || 0}</span>`;
      case 'ifPlaytime':
        return `playtime <span class="code-operator">${comparison}</span> <span class="code-number">${data.minutes || 0}</span> minutes`;
      case 'ifBuildingOwned':
        return `building <span class="code-string">"${this.getBuildingName(data.buildingId)}"</span> is owned`;
      default:
        return `<span class="code-error">${type || 'unknown condition'}</span>`;
    }
  }

  getComparisonSymbol(comparison) {
    switch (comparison) {
      case 'greater': return '>';
      case 'greaterEqual': return '≥';
      case 'less': return '<';
      case 'lessEqual': return '≤';
      case 'equal': return '=';
      case 'notEqual': return '≠';
      default: return '?';
    }
  }

  getChildNodes(nodeId, handleType = null) {
    const edges = this.edgeMap.get(nodeId) || [];
    return edges
      .filter(edge => handleType === null || edge.sourceHandle === handleType)
      .map(edge => edge.target);
  }

  getResourceName(resourceId) {
    if (!resourceId) return '<span class="code-error">Unknown Resource</span>';
    const resource = this.gameData?.resources?.find(r => r.id === resourceId);
    return resource?.name || `<span class="code-error">${resourceId}</span>`;
  }

  getBuildingName(buildingId) {
    if (!buildingId) return '<span class="code-error">Unknown Building</span>';
    const building = this.gameData?.buildings?.find(b => b.id === buildingId);
    return building?.name || `<span class="code-error">${buildingId}</span>`;
  }

  getUpgradeName(upgradeId) {
    if (!upgradeId) return '<span class="code-error">Unknown Upgrade</span>';
    const upgrade = this.gameData?.upgrades?.find(u => u.id === upgradeId);
    return upgrade?.name || `<span class="code-error">${this.escapeHtml(upgradeId)}</span>`;
  }

  getAchievementName(achievementId) {
    if (!achievementId) return '<span class="code-error">Unknown Achievement</span>';
    const achievement = this.gameData?.achievements?.find(a => a.id === achievementId);
    return achievement?.name || `<span class="code-error">${achievementId}</span>`;
  }
}

/**
 * Quick helper function to generate code preview
 */
export function generateCodePreview(nodes, edges, gameData) {
  const generator = new CodePreviewGenerator(nodes, edges, gameData);
  return generator.generate();
}
