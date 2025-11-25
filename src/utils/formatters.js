/**
 * Utility functions for formatting numbers and other data
 */

/**
 * Formatiert Zahlen für die Anzeige
 * @param {number} num - Die zu formatierende Zahl
 * @returns {string} Formatierte Zahl
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
}
