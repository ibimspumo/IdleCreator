/**
 * Prestige Engine
 * Verwaltet Prestige-System: Reset mit Boni
 */

export class PrestigeEngine {
  constructor(gameEngine, prestigeData) {
    this.gameEngine = gameEngine;
    this.prestigeData = prestigeData;
  }

  // Berechnet wie viel Prestige-Currency der Spieler bekommen würde
  calculatePrestigeCurrency() {
    if (!this.prestigeData || !this.prestigeData.enabled) return 0;

    const resource = this.gameEngine.gameState.resources[this.prestigeData.baseResource];
    if (!resource) return 0;

    const baseAmount = resource.total;
    const formula = this.prestigeData.formula || 'sqrt'; // 'sqrt', 'log', 'linear'

    let currency = 0;

    switch (formula) {
      case 'sqrt':
        currency = Math.floor(Math.sqrt(baseAmount / this.prestigeData.divisor));
        break;

      case 'log':
        currency = Math.floor(Math.log10(baseAmount) * this.prestigeData.multiplier);
        break;

      case 'linear':
        currency = Math.floor(baseAmount / this.prestigeData.divisor);
        break;

      default:
        currency = Math.floor(Math.sqrt(baseAmount / 1000));
    }

    return Math.max(0, currency);
  }

  // Kann Prestige durchgeführt werden?
  canPrestige() {
    if (!this.prestigeData || !this.prestigeData.enabled) return false;

    const currency = this.calculatePrestigeCurrency();
    return currency > this.gameEngine.gameState.prestige.currency;
  }

  // Prestige durchführen
  performPrestige() {
    if (!this.canPrestige()) return false;

    const newCurrency = this.calculatePrestigeCurrency();

    // Speichere Prestige-Daten
    const currentPrestige = this.gameEngine.gameState.prestige;
    currentPrestige.level += 1;
    currentPrestige.currency = newCurrency;

    // Reset Game
    this.gameEngine.reset(true);

    return true;
  }

  // Berechnet Prestige-Multiplikator
  getPrestigeBonus() {
    const level = this.gameEngine.gameState.prestige.level;
    const currency = this.gameEngine.gameState.prestige.currency;

    return {
      level,
      currency,
      productionMultiplier: 1 + (level * 0.1), // +10% pro Level
      clickMultiplier: 1 + (currency * 0.05) // +5% pro Currency
    };
  }
}
