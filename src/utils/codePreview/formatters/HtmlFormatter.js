/**
 * HtmlFormatter - Utilities for HTML escaping and formatting
 */

export class HtmlFormatter {
  /**
   * Escape HTML entities
   */
  static escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create indentation string
   */
  static indent(level) {
    return '  '.repeat(level);
  }

  /**
   * Wrap text in span with class
   */
  static span(className, text) {
    return `<span class="${className}">${text}</span>`;
  }

  /**
   * Format as keyword
   */
  static keyword(text) {
    return this.span('code-keyword', text);
  }

  /**
   * Format as symbol
   */
  static symbol(text, modifier = '') {
    const className = modifier ? `code-symbol ${modifier}` : 'code-symbol';
    return this.span(className, text);
  }

  /**
   * Format as number
   */
  static number(value) {
    return this.span('code-number', value);
  }

  /**
   * Format as string
   */
  static string(text) {
    return this.span('code-string', `"${this.escapeHtml(text)}"`);
  }

  /**
   * Format as variable
   */
  static variable(text) {
    return this.span('code-variable', text);
  }

  /**
   * Format as operator
   */
  static operator(text) {
    return this.span('code-operator', text);
  }

  /**
   * Format as comment
   */
  static comment(text) {
    return this.span('code-comment', `// ${this.escapeHtml(text)}`);
  }

  /**
   * Format as error
   */
  static error(text) {
    return this.span('code-error', text);
  }
}
