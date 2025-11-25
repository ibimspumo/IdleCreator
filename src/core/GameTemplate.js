/**
 * GameTemplate Class
 *
 * Definiert und validiert ein vollständiges Idle-Game Template
 * Alle Spiele werden aus diesen Templates generiert
 */

class GameTemplate {
    /**
     * Erstellt ein neues Game Template
     * @param {Object} templateData - Template-Daten
     */
    constructor(templateData = null) {
        if (templateData) {
            this.load(templateData);
        } else {
            this.initializeDefault();
        }
    }

    /**
     * Initialisiert mit Default-Werten
     */
    initializeDefault() {
        this.meta = {
            id: this.generateId(),
            name: "New Idle Game",
            description: "A new idle clicker game",
            author: "Anonymous",
            version: "1.0.0",
            created: Date.now(),
            updated: Date.now()
        };

        this.resources = {
            primary: {
                name: "Point",
                namePlural: "Points",
                icon: "⭐",
                clickVerb: "Click"
            }
        };

        this.theme = {
            colors: {
                primary: "#000000",
                secondary: "#1a1a1a",
                accent: "#ffffff",
                text: "#ffffff",
                textSecondary: "#cccccc",
                border: "#ffffff",
                hoverBg: "#333333",
                disabledBg: "#0d0d0d",
                disabledText: "#666666"
            }
        };

        this.settings = {
            tickRate: 100,
            saveInterval: 5000,
            maxOfflineTime: 86400 // 24 hours in seconds
        };

        this.upgrades = [];
        this.achievements = [];
    }

    /**
     * Lädt Template-Daten
     * @param {Object} data - Template-Daten
     */
    load(data) {
        // Validiere zuerst
        const validation = this.validate(data);
        if (!validation.valid) {
            throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
        }

        // Lade Daten
        this.meta = { ...data.meta };
        this.resources = { ...data.resources };
        this.theme = JSON.parse(JSON.stringify(data.theme)); // Deep copy
        this.settings = { ...data.settings };
        this.upgrades = [...data.upgrades];
        this.achievements = data.achievements || [];

        // Update timestamp
        this.meta.updated = Date.now();
    }

    /**
     * Validiert Template-Daten
     * @param {Object} data - Zu validierende Daten
     * @returns {Object} Validation result {valid: boolean, errors: string[]}
     */
    validate(data) {
        const errors = [];

        // Meta validation
        if (!data.meta) {
            errors.push("Missing meta section");
        } else {
            if (!data.meta.name || data.meta.name.trim() === '') {
                errors.push("Meta: name is required");
            }
            if (!data.meta.version) {
                errors.push("Meta: version is required");
            }
        }

        // Resources validation
        if (!data.resources || !data.resources.primary) {
            errors.push("Missing resources.primary section");
        } else {
            const primary = data.resources.primary;
            if (!primary.name) errors.push("Resources: name is required");
            if (!primary.namePlural) errors.push("Resources: namePlural is required");
            if (!primary.clickVerb) errors.push("Resources: clickVerb is required");
        }

        // Theme validation
        if (!data.theme || !data.theme.colors) {
            errors.push("Missing theme.colors section");
        }

        // Settings validation
        if (!data.settings) {
            errors.push("Missing settings section");
        } else {
            if (typeof data.settings.tickRate !== 'number' || data.settings.tickRate < 10) {
                errors.push("Settings: tickRate must be >= 10");
            }
            if (typeof data.settings.saveInterval !== 'number' || data.settings.saveInterval < 1000) {
                errors.push("Settings: saveInterval must be >= 1000");
            }
        }

        // Upgrades validation
        if (!Array.isArray(data.upgrades)) {
            errors.push("Upgrades must be an array");
        } else {
            data.upgrades.forEach((upgrade, index) => {
                if (!upgrade.id) errors.push(`Upgrade ${index}: id is required`);
                if (!upgrade.name) errors.push(`Upgrade ${index}: name is required`);
                if (typeof upgrade.baseCost !== 'number' || upgrade.baseCost < 0) {
                    errors.push(`Upgrade ${index}: baseCost must be >= 0`);
                }
                if (!upgrade.effect) {
                    errors.push(`Upgrade ${index}: effect is required`);
                } else {
                    if (!upgrade.effect.type) {
                        errors.push(`Upgrade ${index}: effect.type is required`);
                    }
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Exportiert Template als JSON
     * @returns {Object} Template als Plain Object
     */
    export() {
        return {
            meta: { ...this.meta },
            resources: { ...this.resources },
            theme: JSON.parse(JSON.stringify(this.theme)),
            settings: { ...this.settings },
            upgrades: [...this.upgrades],
            achievements: [...this.achievements]
        };
    }

    /**
     * Erstellt eine Kopie des Templates
     * @returns {GameTemplate} Kopie
     */
    clone() {
        const data = this.export();
        data.meta.id = this.generateId();
        data.meta.name = `${data.meta.name} (Copy)`;
        return new GameTemplate(data);
    }

    /**
     * Fügt ein Upgrade hinzu
     * @param {Object} upgrade - Upgrade-Daten
     */
    addUpgrade(upgrade) {
        if (!upgrade.id) {
            upgrade.id = `upgrade_${this.generateId()}`;
        }
        this.upgrades.push(upgrade);
        this.meta.updated = Date.now();
    }

    /**
     * Entfernt ein Upgrade
     * @param {string} upgradeId - ID des zu entfernenden Upgrades
     */
    removeUpgrade(upgradeId) {
        this.upgrades = this.upgrades.filter(u => u.id !== upgradeId);
        this.meta.updated = Date.now();
    }

    /**
     * Aktualisiert ein Upgrade
     * @param {string} upgradeId - ID des Upgrades
     * @param {Object} updates - Zu aktualisierende Felder
     */
    updateUpgrade(upgradeId, updates) {
        const index = this.upgrades.findIndex(u => u.id === upgradeId);
        if (index !== -1) {
            this.upgrades[index] = { ...this.upgrades[index], ...updates };
            this.meta.updated = Date.now();
        }
    }

    /**
     * Generiert eine eindeutige ID
     * @returns {string} UUID-ähnliche ID
     */
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Erstellt ein Summary des Templates für die Anzeige
     * @returns {Object} Summary
     */
    getSummary() {
        return {
            name: this.meta.name,
            description: this.meta.description,
            author: this.meta.author,
            version: this.meta.version,
            upgradeCount: this.upgrades.length,
            achievementCount: this.achievements.length,
            primaryResource: this.resources.primary.name,
            created: new Date(this.meta.created).toLocaleDateString(),
            updated: new Date(this.meta.updated).toLocaleDateString()
        };
    }
}
