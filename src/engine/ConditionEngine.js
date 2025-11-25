/**
 * ConditionEngine
 *
 * Prüft vordefinierte Unlock-Bedingungen
 * WICHTIG: Aus Sicherheitsgründen nur whitelisted condition types!
 * Kein eval() oder Function() - alles vordefiniert
 */

class ConditionEngine {
    constructor() {
        // Registriere alle verfügbaren Condition Types
        this.conditionTypes = new Map();
        this.registerDefaultConditions();
    }

    /**
     * Registriert alle Standard-Bedingungen
     */
    registerDefaultConditions() {
        // === BASIC CONDITIONS ===

        /**
         * Immer erfüllt (kein Unlock nötig)
         */
        this.register('always', (game, params) => {
            return true;
        });

        /**
         * Nie erfüllt (für Testing oder disabled content)
         */
        this.register('never', (game, params) => {
            return false;
        });

        // === POINTS CONDITIONS ===

        /**
         * Erreiche X aktuelle Punkte
         * value: Anzahl der benötigten Punkte
         */
        this.register('points_current', (game, params) => {
            return game.state.points >= (params.value || 0);
        });

        /**
         * Erreiche X total verdiente Punkte
         * value: Anzahl der total benötigten Punkte
         */
        this.register('points_total', (game, params) => {
            return game.state.totalPointsEarned >= (params.value || 0);
        });

        // === CLICKS CONDITIONS ===

        /**
         * Klicke X mal
         * value: Anzahl der benötigten Klicks
         */
        this.register('total_clicks', (game, params) => {
            return game.state.totalClicks >= (params.value || 0);
        });

        // === PRODUCTION CONDITIONS ===

        /**
         * Erreiche X Punkte pro Sekunde
         * value: Benötigte PPS
         */
        this.register('points_per_second', (game, params) => {
            return game.state.pointsPerSecond >= (params.value || 0);
        });

        /**
         * Erreiche X Click Power
         * value: Benötigte Click Power
         */
        this.register('click_power', (game, params) => {
            return game.state.clickPower >= (params.value || 0);
        });

        // === UPGRADE CONDITIONS ===

        /**
         * Kaufe ein bestimmtes Upgrade X mal
         * upgradeId: ID des Upgrades
         * value: Benötigtes Level
         */
        this.register('upgrade_level', (game, params) => {
            if (!params.upgradeId) return false;
            return game.getUpgradeLevel(params.upgradeId) >= (params.value || 1);
        });

        /**
         * Kaufe irgendein Upgrade X mal gesamt
         * value: Gesamt-Anzahl gekaufter Upgrades
         */
        this.register('total_upgrades_bought', (game, params) => {
            let total = 0;
            game.upgrades.forEach(upgrade => {
                total += upgrade.level;
            });
            return total >= (params.value || 1);
        });

        /**
         * Besitze X verschiedene Upgrades (Level > 0)
         * value: Anzahl verschiedener Upgrades
         */
        this.register('unique_upgrades_owned', (game, params) => {
            let count = 0;
            game.upgrades.forEach(upgrade => {
                if (upgrade.level > 0) count++;
            });
            return count >= (params.value || 1);
        });

        /**
         * Ein bestimmtes Upgrade auf Max-Level
         * upgradeId: ID des Upgrades
         */
        this.register('upgrade_maxed', (game, params) => {
            if (!params.upgradeId) return false;
            const upgrade = game.upgrades.get(params.upgradeId);
            if (!upgrade) return false;
            return upgrade.level >= upgrade.maxLevel;
        });

        // === TIME CONDITIONS ===

        /**
         * Spiele X Sekunden
         * value: Benötigte Spielzeit in Sekunden
         */
        this.register('playtime', (game, params) => {
            const playTime = (Date.now() - game.state.startTime) / 1000;
            return playTime >= (params.value || 0);
        });

        // === ACHIEVEMENT CONDITIONS ===

        /**
         * Erreiche ein bestimmtes Achievement
         * achievementId: ID des Achievements
         */
        this.register('achievement_unlocked', (game, params) => {
            if (!params.achievementId) return false;
            return game.hasAchievement && game.hasAchievement(params.achievementId);
        });

        /**
         * Erreiche X Achievements gesamt
         * value: Anzahl der benötigten Achievements
         */
        this.register('total_achievements', (game, params) => {
            if (!game.achievements) return false;
            return game.achievements.size >= (params.value || 1);
        });

        // === COMPOUND CONDITIONS ===

        /**
         * UND-Verknüpfung mehrerer Bedingungen
         * conditions: Array von Conditions
         */
        this.register('and', (game, params) => {
            if (!params.conditions || !Array.isArray(params.conditions)) {
                return false;
            }
            return params.conditions.every(cond => this.check(game, cond));
        });

        /**
         * ODER-Verknüpfung mehrerer Bedingungen
         * conditions: Array von Conditions
         */
        this.register('or', (game, params) => {
            if (!params.conditions || !Array.isArray(params.conditions)) {
                return false;
            }
            return params.conditions.some(cond => this.check(game, cond));
        });

        /**
         * NICHT-Verknüpfung (invertiert Bedingung)
         * condition: Zu invertierende Condition
         */
        this.register('not', (game, params) => {
            if (!params.condition) return false;
            return !this.check(game, params.condition);
        });

        // === RATIO CONDITIONS ===

        /**
         * PPS ist X% der Click Power
         * ratio: Mindest-Ratio (z.B. 0.5 = 50%)
         */
        this.register('pps_click_ratio', (game, params) => {
            if (game.state.clickPower === 0) return false;
            const ratio = game.state.pointsPerSecond / game.state.clickPower;
            return ratio >= (params.ratio || 1.0);
        });

        /**
         * Click Power ist X% der PPS
         * ratio: Mindest-Ratio
         */
        this.register('click_pps_ratio', (game, params) => {
            if (game.state.pointsPerSecond === 0) return false;
            const ratio = game.state.clickPower / game.state.pointsPerSecond;
            return ratio >= (params.ratio || 1.0);
        });
    }

    /**
     * Registriert einen neuen Condition Type
     * @param {string} type - Type-Name
     * @param {Function} checker - Funktion die die Bedingung prüft
     */
    register(type, checker) {
        this.conditionTypes.set(type, checker);
    }

    /**
     * Prüft eine Bedingung
     * @param {Object} game - Game Instance
     * @param {Object} condition - Condition Definition {type, ...params}
     * @returns {boolean} True wenn erfüllt
     */
    check(game, condition) {
        if (!condition || !condition.type) {
            console.warn('Invalid condition:', condition);
            return false;
        }

        const checker = this.conditionTypes.get(condition.type);

        if (!checker) {
            console.warn(`Unknown condition type: ${condition.type}`);
            return false;
        }

        try {
            return checker(game, condition);
        } catch (error) {
            console.error(`Error checking condition ${condition.type}:`, error);
            return false;
        }
    }

    /**
     * Gibt alle verfügbaren Condition Types zurück
     * @returns {Array} Liste von Type-Namen
     */
    getAvailableTypes() {
        return Array.from(this.conditionTypes.keys());
    }

    /**
     * Gibt Metadata zu einem Condition Type zurück
     * @param {string} type - Type-Name
     * @returns {Object} Metadata
     */
    getTypeMetadata(type) {
        const metadata = {
            'always': {
                name: 'Always Available',
                description: 'Always unlocked, no condition',
                params: {},
                category: 'basic'
            },
            'points_current': {
                name: 'Current Points',
                description: 'Reach X current points',
                params: { value: 'Number: Required points' },
                category: 'points'
            },
            'points_total': {
                name: 'Total Points Earned',
                description: 'Earn X total points',
                params: { value: 'Number: Required total points' },
                category: 'points'
            },
            'total_clicks': {
                name: 'Total Clicks',
                description: 'Click X times',
                params: { value: 'Number: Required clicks' },
                category: 'clicks'
            },
            'points_per_second': {
                name: 'Points Per Second',
                description: 'Reach X points per second',
                params: { value: 'Number: Required PPS' },
                category: 'production'
            },
            'click_power': {
                name: 'Click Power',
                description: 'Reach X click power',
                params: { value: 'Number: Required click power' },
                category: 'production'
            },
            'upgrade_level': {
                name: 'Upgrade Level',
                description: 'Buy specific upgrade X times',
                params: { upgradeId: 'String: Upgrade ID', value: 'Number: Required level' },
                category: 'upgrades'
            },
            'total_upgrades_bought': {
                name: 'Total Upgrades Bought',
                description: 'Buy any upgrades X times total',
                params: { value: 'Number: Total upgrade levels' },
                category: 'upgrades'
            },
            'playtime': {
                name: 'Playtime',
                description: 'Play for X seconds',
                params: { value: 'Number: Required seconds' },
                category: 'time'
            },
            'and': {
                name: 'AND Combination',
                description: 'All conditions must be true',
                params: { conditions: 'Array: List of conditions' },
                category: 'compound'
            },
            'or': {
                name: 'OR Combination',
                description: 'At least one condition must be true',
                params: { conditions: 'Array: List of conditions' },
                category: 'compound'
            }
        };

        return metadata[type] || { name: type, description: 'No metadata available', params: {}, category: 'unknown' };
    }

    /**
     * Generiert eine menschenlesbare Beschreibung einer Bedingung
     * @param {Object} condition - Condition Definition
     * @returns {string} Beschreibung
     */
    describe(condition) {
        if (!condition || !condition.type) {
            return 'No condition';
        }

        switch (condition.type) {
            case 'always':
                return 'Always available';
            case 'points_total':
                return `Earn ${formatNumber(condition.value)} points total`;
            case 'total_clicks':
                return `Click ${condition.value} times`;
            case 'points_per_second':
                return `Reach ${condition.value} points/second`;
            case 'upgrade_level':
                return `Buy "${condition.upgradeId}" ${condition.value} times`;
            case 'and':
                return condition.conditions.map(c => this.describe(c)).join(' AND ');
            case 'or':
                return condition.conditions.map(c => this.describe(c)).join(' OR ');
            default:
                return `Unlock: ${condition.type}`;
        }
    }
}

// Singleton instance
const conditionEngine = new ConditionEngine();
