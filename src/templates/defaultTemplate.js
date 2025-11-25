/**
 * Default Template
 *
 * Dies ist das Standard "Idle Clicker" Template
 * Wird verwendet wenn kein Custom-Template geladen wird
 */

function createDefaultTemplate() {
    const template = new GameTemplate();

    // === META ===
    template.meta.name = "Idle Clicker";
    template.meta.description = "Click to earn points and buy upgrades!";
    template.meta.author = "Claude Code";

    // === RESOURCES ===
    template.resources.primary = {
        name: "Point",
        namePlural: "Points",
        icon: "⭐",
        clickVerb: "Click"
    };

    // === THEME (Black & White) ===
    template.theme.colors = {
        primary: "#000000",
        secondary: "#1a1a1a",
        accent: "#ffffff",
        text: "#ffffff",
        textSecondary: "#cccccc",
        border: "#ffffff",
        hoverBg: "#333333",
        disabledBg: "#0d0d0d",
        disabledText: "#666666"
    };

    // === SETTINGS ===
    template.settings = {
        tickRate: 100,
        saveInterval: 5000,
        maxOfflineTime: 86400
    };

    // === UPGRADES ===

    // Basis-Upgrades (always available)
    template.addUpgrade({
        id: 'clickPower',
        name: 'Click Power',
        description: 'Increases points per click',
        icon: '👆',
        baseCost: 10,
        costMultiplier: 1.5,
        effect: {
            type: 'add_click_power',
            value: 1
        }
    });

    template.addUpgrade({
        id: 'autoClicker',
        name: 'Auto Clicker',
        description: 'Automatically generates points per second',
        icon: '🤖',
        baseCost: 25,
        costMultiplier: 1.3,
        effect: {
            type: 'add_per_second',
            value: 0.5
        }
    });

    template.addUpgrade({
        id: 'pointsMultiplier',
        name: 'Points Multiplier',
        description: 'Multiplies all point gains',
        icon: '✖️',
        baseCost: 100,
        costMultiplier: 2.0,
        effect: {
            type: 'increase_click_power_percent',
            percent: 10
        }
    });

    // Locked Upgrades

    template.addUpgrade({
        id: 'superClicker',
        name: 'Super Clicker',
        description: 'Massively increased click power (+5 per level)',
        icon: '💪',
        baseCost: 500,
        costMultiplier: 1.8,
        effect: {
            type: 'add_click_power',
            value: 5
        },
        unlockCondition: {
            type: 'points_total',
            value: 1000
        }
    });

    template.addUpgrade({
        id: 'clickMaster',
        name: 'Click Master',
        description: 'Master clicking skills (Click Power x1.5)',
        icon: '🎯',
        baseCost: 2000,
        costMultiplier: 2.5,
        effect: {
            type: 'multiply_click_power',
            multiplier: 1.5
        },
        unlockCondition: {
            type: 'total_clicks',
            value: 100
        }
    });

    template.addUpgrade({
        id: 'autoFactory',
        name: 'Auto Factory',
        description: 'Automatically produces 5 points/second',
        icon: '🏭',
        baseCost: 1500,
        costMultiplier: 1.6,
        effect: {
            type: 'add_per_second',
            value: 5
        },
        unlockCondition: {
            type: 'upgrade_level',
            upgradeId: 'autoClicker',
            value: 10
        }
    });

    template.addUpgrade({
        id: 'megaMultiplier',
        name: 'Mega Multiplier',
        description: 'Doubles all point gains',
        icon: '⚡',
        baseCost: 5000,
        costMultiplier: 3.0,
        effect: {
            type: 'double_everything'
        },
        unlockCondition: {
            type: 'upgrade_level',
            upgradeId: 'pointsMultiplier',
            value: 5
        }
    });

    template.addUpgrade({
        id: 'idleMaster',
        name: 'Idle Master',
        description: 'Drastically increased passive production (+20/s)',
        icon: '😴',
        baseCost: 10000,
        costMultiplier: 2.2,
        effect: {
            type: 'add_per_second',
            value: 20
        },
        unlockCondition: {
            type: 'points_per_second',
            value: 5
        }
    });

    return template;
}
