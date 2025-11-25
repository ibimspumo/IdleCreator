/**
 * Upgrade-Klasse
 * Repräsentiert ein einzelnes Upgrade im Spiel
 */
class Upgrade {
    /**
     * Erstellt ein neues Upgrade
     * @param {Object} config - Upgrade-Konfiguration
     * @param {IdleGame} game - Referenz zum Spiel
     */
    constructor(config, game) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.baseCost = config.baseCost;
        this.costMultiplier = config.costMultiplier || 1.15;
        this.level = 0;
        this.maxLevel = config.maxLevel || Infinity;
        this.game = game;

        // Icon (optional, für Templates)
        this.icon = config.icon || null;

        // Effect System
        // Kann entweder eine Funktion sein (alte Methode) oder ein Effect-Object (Template-Methode)
        if (typeof config.effect === 'function') {
            // Alte Methode: Direkte Funktion
            this.effect = config.effect;
            this.effectData = null;
        } else if (typeof config.effect === 'object') {
            // Neue Methode: Effect-Object mit type
            this.effect = null;
            this.effectData = config.effect;
        } else {
            this.effect = null;
            this.effectData = null;
        }

        // Unlock System
        // Kann entweder eine Funktion sein (alte Methode) oder ein Condition-Object (Template-Methode)
        if (typeof config.unlockCondition === 'function') {
            // Alte Methode: Direkte Funktion
            this.unlockCondition = config.unlockCondition;
            this.unlockConditionData = null;
            this.unlockDescription = config.unlockDescription || null;
        } else if (typeof config.unlockCondition === 'object') {
            // Neue Methode: Condition-Object mit type
            this.unlockCondition = null;
            this.unlockConditionData = config.unlockCondition;
            // Generiere Beschreibung automatisch
            this.unlockDescription = config.unlockDescription || this.generateUnlockDescription();
        } else {
            this.unlockCondition = null;
            this.unlockConditionData = null;
            this.unlockDescription = null;
        }

        this.unlocked = (this.unlockCondition || this.unlockConditionData) ? false : true;
    }

    /**
     * Berechnet die aktuellen Kosten
     * @returns {number} Kosten für nächstes Level
     */
    getCurrentCost() {
        return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
    }

    /**
     * Kauft das Upgrade (erhöht Level)
     */
    purchase() {
        if (this.level < this.maxLevel) {
            this.level++;
        }
    }

    /**
     * Wendet den Upgrade-Effekt auf den Spielzustand an
     * @param {Object} state - Spielzustand
     */
    applyEffect(state) {
        if (this.effect) {
            // Alte Methode: Direkte Funktion
            this.effect(state, this.level);
        } else if (this.effectData && typeof effectEngine !== 'undefined') {
            // Neue Methode: Effect-Object über EffectEngine
            effectEngine.execute(state, this.effectData, this.level);
        }
    }

    /**
     * Prüft ob das Upgrade verfügbar ist
     * @param {number} currentPoints - Aktuelle Punkte
     * @returns {boolean} True wenn kaufbar
     */
    canAfford(currentPoints) {
        return this.unlocked && currentPoints >= this.getCurrentCost() && this.level < this.maxLevel;
    }

    /**
     * Prüft ob die Unlock-Bedingung erfüllt ist
     * @returns {boolean} True wenn die Bedingung erfüllt ist
     */
    checkUnlockCondition() {
        if (this.unlockCondition) {
            // Alte Methode: Direkte Funktion
            return this.unlockCondition(this.game);
        } else if (this.unlockConditionData && typeof conditionEngine !== 'undefined') {
            // Neue Methode: Condition-Object über ConditionEngine
            return conditionEngine.check(this.game, this.unlockConditionData);
        }
        return true; // Keine Bedingung = immer unlocked
    }

    /**
     * Generiert eine Unlock-Beschreibung aus unlockConditionData
     * @returns {string} Beschreibung
     */
    generateUnlockDescription() {
        if (this.unlockConditionData && typeof conditionEngine !== 'undefined') {
            return conditionEngine.describe(this.unlockConditionData);
        }
        return null;
    }

    /**
     * Schaltet das Upgrade frei
     */
    unlock() {
        this.unlocked = true;
    }

    /**
     * Prüft ob das Upgrade freigeschaltet ist
     * @returns {boolean} True wenn freigeschaltet
     */
    isUnlocked() {
        return this.unlocked;
    }

    /**
     * Gibt Upgrade-Info zurück
     * @returns {Object} Upgrade-Informationen
     */
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            level: this.level,
            maxLevel: this.maxLevel,
            currentCost: this.getCurrentCost(),
            nextCost: this.level < this.maxLevel ?
                Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level + 1)) :
                null,
            unlocked: this.unlocked,
            unlockDescription: this.unlockDescription
        };
    }
}
