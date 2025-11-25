/**
 * EffectEngine
 *
 * Führt vordefinierte Upgrade-Effekte aus
 * WICHTIG: Aus Sicherheitsgründen nur whitelisted effect types!
 * Kein eval() oder Function() - alles vordefiniert
 */

class EffectEngine {
    constructor() {
        // Registriere alle verfügbaren Effect Types
        this.effectTypes = new Map();
        this.registerDefaultEffects();
    }

    /**
     * Registriert alle Standard-Effekt-Typen
     */
    registerDefaultEffects() {
        // === ADDITIVE EFFECTS ===

        /**
         * Addiert zur Click Power
         * value: Wie viel pro Level hinzugefügt wird
         */
        this.register('add_click_power', (state, params, level) => {
            const value = params.value || 1;
            state.clickPower += value * level;
        });

        /**
         * Addiert zu Points per Second
         * value: Wie viel pro Level hinzugefügt wird
         */
        this.register('add_per_second', (state, params, level) => {
            const value = params.value || 1;
            state.pointsPerSecond += value * level;
        });

        /**
         * Addiert einen festen Wert zur Click Power
         * value: Fester Wert (nicht level-abhängig)
         */
        this.register('add_click_power_flat', (state, params, level) => {
            if (level > 0) {
                state.clickPower += params.value || 1;
            }
        });

        /**
         * Addiert einen festen Wert zu PPS
         * value: Fester Wert (nicht level-abhängig)
         */
        this.register('add_per_second_flat', (state, params, level) => {
            if (level > 0) {
                state.pointsPerSecond += params.value || 1;
            }
        });

        // === MULTIPLICATIVE EFFECTS ===

        /**
         * Multipliziert Click Power
         * multiplier: Multiplikator pro Level (z.B. 1.5 = +50% pro Level)
         */
        this.register('multiply_click_power', (state, params, level) => {
            if (level > 0) {
                const multiplier = params.multiplier || 1.5;
                state.clickPower *= Math.pow(multiplier, level);
            }
        });

        /**
         * Multipliziert Points per Second
         * multiplier: Multiplikator pro Level
         */
        this.register('multiply_per_second', (state, params, level) => {
            if (level > 0) {
                const multiplier = params.multiplier || 1.5;
                state.pointsPerSecond *= Math.pow(multiplier, level);
            }
        });

        /**
         * Multipliziert BEIDE (Click Power UND PPS)
         * multiplier: Multiplikator pro Level
         */
        this.register('multiply_all', (state, params, level) => {
            if (level > 0) {
                const multiplier = params.multiplier || 2.0;
                const mult = Math.pow(multiplier, level);
                state.clickPower = Math.floor(state.clickPower * mult);
                state.pointsPerSecond *= mult;
            }
        });

        /**
         * Prozentuale Erhöhung der Click Power
         * percent: Prozent pro Level (z.B. 10 = +10% pro Level)
         */
        this.register('increase_click_power_percent', (state, params, level) => {
            if (level > 0) {
                const percent = params.percent || 10;
                const multiplier = 1 + ((percent / 100) * level);
                state.clickPower = Math.floor(state.clickPower * multiplier);
            }
        });

        /**
         * Prozentuale Erhöhung der PPS
         * percent: Prozent pro Level
         */
        this.register('increase_per_second_percent', (state, params, level) => {
            if (level > 0) {
                const percent = params.percent || 10;
                const multiplier = 1 + ((percent / 100) * level);
                state.pointsPerSecond *= multiplier;
            }
        });

        // === EXPONENTIAL EFFECTS ===

        /**
         * Exponentielles Wachstum für Click Power
         * base: Basis-Wert
         * exponent: Exponent (Standard: 1.1)
         */
        this.register('exponential_click_power', (state, params, level) => {
            const base = params.base || 2;
            const exponent = params.exponent || 1.1;
            state.clickPower += Math.floor(base * Math.pow(level, exponent));
        });

        /**
         * Exponentielles Wachstum für PPS
         * base: Basis-Wert
         * exponent: Exponent
         */
        this.register('exponential_per_second', (state, params, level) => {
            const base = params.base || 2;
            const exponent = params.exponent || 1.1;
            state.pointsPerSecond += base * Math.pow(level, exponent);
        });

        // === COMPOUND EFFECTS ===

        /**
         * Kombiniert additive und multiplikative Effekte
         * addClickPower: Addiert zur Click Power
         * multiplyPPS: Multipliziert PPS
         */
        this.register('compound_click_and_idle', (state, params, level) => {
            if (params.addClickPower) {
                state.clickPower += params.addClickPower * level;
            }
            if (params.multiplyPPS) {
                state.pointsPerSecond *= Math.pow(params.multiplyPPS, level);
            }
        });

        // === SPECIAL EFFECTS ===

        /**
         * Click Power basierend auf aktueller PPS
         * ratio: Wie viel % der PPS zur Click Power addiert wird
         */
        this.register('click_power_from_pps', (state, params, level) => {
            if (level > 0) {
                const ratio = params.ratio || 0.1; // 10% default
                state.clickPower += Math.floor(state.pointsPerSecond * ratio * level);
            }
        });

        /**
         * PPS basierend auf aktueller Click Power
         * ratio: Wie viel % der Click Power zur PPS addiert wird
         */
        this.register('pps_from_click_power', (state, params, level) => {
            if (level > 0) {
                const ratio = params.ratio || 0.1;
                state.pointsPerSecond += state.clickPower * ratio * level;
            }
        });

        /**
         * Verdoppelt alles pro Level (sehr stark!)
         * Für späte-Game Upgrades
         */
        this.register('double_everything', (state, params, level) => {
            if (level > 0) {
                const mult = Math.pow(2, level);
                state.clickPower = Math.floor(state.clickPower * mult);
                state.pointsPerSecond *= mult;
            }
        });
    }

    /**
     * Registriert einen neuen Effect Type
     * @param {string} type - Type-Name
     * @param {Function} executor - Funktion die den Effekt ausführt
     */
    register(type, executor) {
        this.effectTypes.set(type, executor);
    }

    /**
     * Führt einen Effekt aus
     * @param {Object} state - Game State
     * @param {Object} effect - Effect Definition {type, ...params}
     * @param {number} level - Upgrade Level
     */
    execute(state, effect, level) {
        const executor = this.effectTypes.get(effect.type);

        if (!executor) {
            console.warn(`Unknown effect type: ${effect.type}`);
            return;
        }

        try {
            executor(state, effect, level);
        } catch (error) {
            console.error(`Error executing effect ${effect.type}:`, error);
        }
    }

    /**
     * Gibt alle verfügbaren Effect Types zurück
     * @returns {Array} Liste von Type-Namen
     */
    getAvailableTypes() {
        return Array.from(this.effectTypes.keys());
    }

    /**
     * Gibt Metadata zu einem Effect Type zurück
     * @param {string} type - Type-Name
     * @returns {Object} Metadata
     */
    getTypeMetadata(type) {
        const metadata = {
            'add_click_power': {
                name: 'Add Click Power',
                description: 'Adds value to click power per level',
                params: { value: 'Number: Amount per level' },
                category: 'additive'
            },
            'add_per_second': {
                name: 'Add Per Second',
                description: 'Adds value to points per second per level',
                params: { value: 'Number: Amount per level' },
                category: 'additive'
            },
            'multiply_click_power': {
                name: 'Multiply Click Power',
                description: 'Multiplies click power by multiplier^level',
                params: { multiplier: 'Number: Multiplier (e.g., 1.5)' },
                category: 'multiplicative'
            },
            'multiply_per_second': {
                name: 'Multiply Per Second',
                description: 'Multiplies points per second by multiplier^level',
                params: { multiplier: 'Number: Multiplier (e.g., 1.5)' },
                category: 'multiplicative'
            },
            'multiply_all': {
                name: 'Multiply Everything',
                description: 'Multiplies both click power and PPS',
                params: { multiplier: 'Number: Multiplier (e.g., 2.0)' },
                category: 'multiplicative'
            },
            'increase_click_power_percent': {
                name: 'Increase Click Power %',
                description: 'Increases click power by percent per level',
                params: { percent: 'Number: Percent per level (e.g., 10)' },
                category: 'multiplicative'
            },
            'exponential_click_power': {
                name: 'Exponential Click Power',
                description: 'Exponential growth for click power',
                params: { base: 'Number: Base value', exponent: 'Number: Exponent (e.g., 1.1)' },
                category: 'exponential'
            },
            'double_everything': {
                name: 'Double Everything',
                description: 'Doubles all production per level (very powerful!)',
                params: {},
                category: 'special'
            }
        };

        return metadata[type] || { name: type, description: 'No metadata available', params: {}, category: 'unknown' };
    }
}

// Singleton instance
const effectEngine = new EffectEngine();
