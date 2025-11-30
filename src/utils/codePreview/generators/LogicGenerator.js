/**
 * LogicGenerator - Generates code preview for logic nodes (delay, random, loop, etc.)
 */

import { HtmlFormatter } from '../formatters/HtmlFormatter.js';

export class LogicGenerator {
  /**
   * Generate logic node description and handle children
   */
  static generateDelay(data) {
    return {
      line: `${HtmlFormatter.symbol('⏱')} ${HtmlFormatter.keyword('wait')} ${HtmlFormatter.number(data.duration || 1)} seconds`,
      type: 'simple'
    };
  }

  static generateRandom(data) {
    return {
      line: `${HtmlFormatter.symbol('🎲')} random chance (${HtmlFormatter.number(data.chance || 50)}%):`,
      type: 'branching',
      branches: ['true', 'false'],
      branchLabels: {
        true: `${HtmlFormatter.symbol('✓', 'code-true')} ${HtmlFormatter.keyword('on success')}:`,
        false: `${HtmlFormatter.symbol('✗', 'code-false')} ${HtmlFormatter.keyword('on failure')}:`
      }
    };
  }

  static generateLoop(data) {
    return {
      line: `${HtmlFormatter.symbol('🔁')} ${HtmlFormatter.keyword('repeat')} ${HtmlFormatter.number(data.repeatCount || 5)} times:`,
      type: 'container'
    };
  }

  static generateBranch(data) {
    return {
      line: `${HtmlFormatter.symbol('🌳')} ${HtmlFormatter.keyword('branch')} ${HtmlFormatter.comment(`(${data.outputCount || 3} parallel paths)`)}:`,
      type: 'container'
    };
  }

  static generateSequence() {
    return {
      line: `${HtmlFormatter.symbol('📝')} ${HtmlFormatter.keyword('sequence')}:`,
      type: 'container'
    };
  }

  /**
   * Main generate method
   */
  static generate(data) {
    const type = data.logicType;

    switch (type) {
      case 'delay':
        return this.generateDelay(data);
      case 'random':
        return this.generateRandom(data);
      case 'loop':
        return this.generateLoop(data);
      case 'branch':
        return this.generateBranch(data);
      case 'sequence':
        return this.generateSequence(data);
      default:
        return {
          line: HtmlFormatter.error(type || 'unknown logic'),
          type: 'simple'
        };
    }
  }
}
