/**
 * Upgrade Definitions
 *
 * Alle Upgrade-Definitionen für das Spiel
 */

const upgradeDefinitions = [
    // ===== BASIS UPGRADES (immer verfügbar) =====
    {
        id: 'clickPower',
        name: 'Click Power',
        description: 'Erhöht die Punkte pro Click',
        baseCost: 10,
        costMultiplier: 1.5,
        effect: (state, level) => {
            // Jedes Level fügt +1 Click Power hinzu
            state.clickPower += level;
        }
    },
    {
        id: 'autoClicker',
        name: 'Auto Clicker',
        description: 'Generiert automatisch Punkte pro Sekunde',
        baseCost: 25,
        costMultiplier: 1.3,
        effect: (state, level) => {
            // Jedes Level fügt +0.5 Punkte pro Sekunde hinzu
            state.pointsPerSecond += level * 0.5;
        }
    },
    {
        id: 'pointsMultiplier',
        name: 'Points Multiplier',
        description: 'Multipliziert alle Punktegewinne',
        baseCost: 100,
        costMultiplier: 2.0,
        effect: (state, level) => {
            // Jedes Level erhöht Click Power und PPS um 10%
            const multiplier = 1 + (level * 0.1);
            state.clickPower = Math.floor(state.clickPower * multiplier);
            state.pointsPerSecond = state.pointsPerSecond * multiplier;
        }
    },

    // ===== LOCKED UPGRADES (müssen freigeschaltet werden) =====
    {
        id: 'superClicker',
        name: 'Super Clicker',
        description: 'Massiv erhöhte Click Power (+5 pro Level)',
        baseCost: 500,
        costMultiplier: 1.8,
        effect: (state, level) => {
            state.clickPower += level * 5;
        },
        unlockCondition: (game) => {
            // Unlock: Erreiche 1000 Punkte
            return game.state.totalPointsEarned >= 1000;
        },
        unlockDescription: 'Erreiche 1000 Punkte insgesamt'
    },
    {
        id: 'clickMaster',
        name: 'Click Master',
        description: 'Meisterhafte Klick-Fähigkeiten (Click Power x1.5)',
        baseCost: 2000,
        costMultiplier: 2.5,
        effect: (state, level) => {
            const multiplier = 1 + (level * 0.5);
            state.clickPower = Math.floor(state.clickPower * multiplier);
        },
        unlockCondition: (game) => {
            // Unlock: Klicke 100 mal
            return game.state.totalClicks >= 100;
        },
        unlockDescription: 'Klicke 100 mal'
    },
    {
        id: 'autoFactory',
        name: 'Auto Factory',
        description: 'Produziert automatisch 5 Punkte/Sekunde',
        baseCost: 1500,
        costMultiplier: 1.6,
        effect: (state, level) => {
            state.pointsPerSecond += level * 5;
        },
        unlockCondition: (game) => {
            // Unlock: Kaufe Auto Clicker 10x
            return game.getUpgradeLevel('autoClicker') >= 10;
        },
        unlockDescription: 'Kaufe Auto Clicker 10x'
    },
    {
        id: 'megaMultiplier',
        name: 'Mega Multiplier',
        description: 'Verdoppelt alle Punktegewinne',
        baseCost: 5000,
        costMultiplier: 3.0,
        effect: (state, level) => {
            const multiplier = Math.pow(2, level); // 2x, 4x, 8x, etc.
            state.clickPower = Math.floor(state.clickPower * multiplier);
            state.pointsPerSecond = state.pointsPerSecond * multiplier;
        },
        unlockCondition: (game) => {
            // Unlock: Kaufe Points Multiplier 5x
            return game.getUpgradeLevel('pointsMultiplier') >= 5;
        },
        unlockDescription: 'Kaufe Points Multiplier 5x'
    },
    {
        id: 'idleMaster',
        name: 'Idle Master',
        description: 'Drastisch erhöhte passive Produktion (+20/s)',
        baseCost: 10000,
        costMultiplier: 2.2,
        effect: (state, level) => {
            state.pointsPerSecond += level * 20;
        },
        unlockCondition: (game) => {
            // Unlock: Erreiche 5 Punkte pro Sekunde
            return game.state.pointsPerSecond >= 5;
        },
        unlockDescription: 'Erreiche 5 Punkte pro Sekunde'
    }
];
