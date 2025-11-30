/**
 * Formatter Utilities
 * Formatting numbers for better readability
 */

export const FormatUtils = {
  // Formatiert große Zahlen (1000 -> 1K, 1000000 -> 1M, etc.)
  formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier <= 0) return Math.floor(num).toString();

    const suffix = suffixes[tier] || `e${tier * 3}`;
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(2) + suffix;
  },

  // Formatiert Zahlen mit Dezimalstellen
  formatDecimal(num, decimals = 2) {
    return num.toFixed(decimals);
  },

  // Formatiert Zeit (Sekunden -> mm:ss oder hh:mm:ss)
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  // Formatiert Prozent
  formatPercent(value) {
    return `${Math.floor(value * 100)}%`;
  },

  // Formatiert Ressourcen-Anzeige mit Icon
  formatResource(amount, resource) {
    return `${resource.icon || ''} ${this.formatNumber(amount)}`;
  },

  // Formatiert "pro Sekunde"
  formatPerSecond(amount) {
    return `${this.formatNumber(amount)}/s`;
  }
};
