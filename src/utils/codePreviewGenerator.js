/**
 * CodePreviewGenerator - Generates human-readable code preview from logic nodes
 * Refactored to use modular generators and formatters
 */

import { HtmlFormatter } from './codePreview/formatters/HtmlFormatter.js';
import {
  EventGenerator,
  ActionGenerator,
  ConditionGenerator,
  LogicGenerator
} from './codePreview/generators/index.js';

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

    // Initialize generators
    this.eventGenerator = new EventGenerator(gameData);
    this.actionGenerator = new ActionGenerator(gameData);
    this.conditionGenerator = new ConditionGenerator(gameData);
  }

  generate() {
    this.visitedNodes.clear();
    this.indentLevel = 0;

    const lines = [];

    // Find all event nodes (entry points)
    const eventNodes = this.nodes.filter(node => node.type === 'event');

    if (eventNodes.length === 0) {
      return HtmlFormatter.comment('No logic defined yet') + '\n' + HtmlFormatter.comment('Add an Event node to get started!');
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
    const indent = HtmlFormatter.indent(this.indentLevel);

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
        lines.push(`${indent}${HtmlFormatter.comment(`Group: ${node.data.label || 'Unnamed'}`)}`);
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

    const eventDescription = this.eventGenerator.generate(data);
    lines.push(`${indent}${HtmlFormatter.comment(`Event: ${data.eventType || 'unknown'}`)}`);
    lines.push(`${indent}${HtmlFormatter.keyword('when')} ${eventDescription}:`);

    this.indentLevel++;
    const children = this.getChildNodes(node.id);
    if (children.length === 0) {
      lines.push(`${HtmlFormatter.indent(this.indentLevel)}${HtmlFormatter.comment('No actions defined')}`);
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
    const actionText = this.actionGenerator.generate(data);
    return [`${indent}${HtmlFormatter.symbol('→')} ${actionText}`];
  }

  generateConditionNode(node, indent) {
    const data = node.data;
    const lines = [];
    const conditionText = this.conditionGenerator.generate(data);

    lines.push(`${indent}${HtmlFormatter.keyword('if')} ${conditionText}:`);

    // Get true and false branches
    const trueBranch = this.getChildNodes(node.id, 'true');
    const falseBranch = this.getChildNodes(node.id, 'false');

    // True branch
    this.indentLevel++;
    if (trueBranch.length === 0) {
      lines.push(`${HtmlFormatter.indent(this.indentLevel)}${HtmlFormatter.symbol('✓', 'code-true')} ${HtmlFormatter.comment('No actions')}`);
    } else {
      trueBranch.forEach(childId => {
        const childLines = this.generateFromNode(childId);
        childLines[0] = childLines[0].replace(HtmlFormatter.symbol('→'), HtmlFormatter.symbol('✓', 'code-true'));
        lines.push(...childLines);
      });
    }
    this.indentLevel--;

    // False branch
    if (falseBranch.length > 0) {
      lines.push(`${indent}${HtmlFormatter.keyword('else')}:`);
      this.indentLevel++;
      falseBranch.forEach(childId => {
        const childLines = this.generateFromNode(childId);
        childLines[0] = childLines[0].replace(HtmlFormatter.symbol('→'), HtmlFormatter.symbol('✗', 'code-false'));
        lines.push(...childLines);
      });
      this.indentLevel--;
    }

    return lines;
  }

  generateLogicNode(node, indent) {
    const data = node.data;
    const lines = [];

    const result = LogicGenerator.generate(data);
    lines.push(`${indent}${result.line}`);

    if (result.type === 'branching') {
      // Handle branching logic (random)
      this.indentLevel++;
      const successBranch = this.getChildNodes(node.id, 'true');
      const failBranch = this.getChildNodes(node.id, 'false');

      if (successBranch.length > 0) {
        lines.push(`${HtmlFormatter.indent(this.indentLevel)}${result.branchLabels.true}`);
        this.indentLevel++;
        successBranch.forEach(childId => lines.push(...this.generateFromNode(childId)));
        this.indentLevel--;
      }

      if (failBranch.length > 0) {
        lines.push(`${HtmlFormatter.indent(this.indentLevel)}${result.branchLabels.false}`);
        this.indentLevel++;
        failBranch.forEach(childId => lines.push(...this.generateFromNode(childId)));
        this.indentLevel--;
      }
      this.indentLevel--;
      return lines;
    }

    if (result.type === 'container') {
      // Handle container logic (loop, branch, sequence)
      this.indentLevel++;
      this.getChildNodes(node.id).forEach(childId => {
        lines.push(...this.generateFromNode(childId));
      });
      this.indentLevel--;
      return lines;
    }

    // Simple logic (delay)
    this.getChildNodes(node.id).forEach(childId => {
      lines.push(...this.generateFromNode(childId));
    });

    return lines;
  }

  getChildNodes(nodeId, handleType = null) {
    const edges = this.edgeMap.get(nodeId) || [];
    return edges
      .filter(edge => handleType === null || edge.sourceHandle === handleType)
      .map(edge => edge.target);
  }
}

/**
 * Quick helper function to generate code preview
 */
export function generateCodePreview(nodes, edges, gameData) {
  const generator = new CodePreviewGenerator(nodes, edges, gameData);
  return generator.generate();
}
