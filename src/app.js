/**
 * Main Application Entry Point
 *
 * Initialisiert das Spiel und verbindet alle Module
 */

// ===== TEMPLATE LOADING =====

// Lade Template (URL > LocalStorage > Default)
const templateInfo = TemplateLoader.loadWithSource();
const template = templateInfo.template;

console.log(`Template loaded from: ${templateInfo.source}`);
console.log('Template:', template.getSummary());

// Zeige Benachrichtigung wenn von URL geladen
if (templateInfo.source === 'url') {
    setTimeout(() => {
        showNotification(`Loaded: ${template.meta.name}`, 'success');
        TemplateLoader.clearUrlFragment();
    }, 500);
}

// ===== GAME INITIALISIERUNG =====

// Erstelle Game-Instanz mit Template
const game = new IdleGame(template);

// ===== UI ELEMENTE =====
const pointsDisplay = document.getElementById('points');
const pointsPerSecondDisplay = document.getElementById('pointsPerSecond');
const clickButton = document.getElementById('clickButton');
const clickValueDisplay = document.getElementById('clickValue');
const upgradesContainer = document.getElementById('upgradesContainer');

// ===== DYNAMIC RENDERING =====

// Wenn Template-System aktiv, rendere UI dynamisch
if (game.renderer) {
    game.renderer.initialize();
}

// ===== UPGRADES REGISTRIEREN =====

// Wenn Legacy-Mode (kein Template), registriere alte Upgrades
if (!game.template && typeof upgradeDefinitions !== 'undefined') {
    upgradeDefinitions.forEach(def => {
        const upgrade = game.registerUpgrade(def);
        const card = createUpgradeCard(upgrade);
        upgradesContainer.appendChild(card);
    });
}

// Wenn Template-Mode, Upgrades sind bereits registriert
if (game.template) {
    game.upgrades.forEach(upgrade => {
        const upgradeData = template.upgrades.find(u => u.id === upgrade.id);
        const card = game.renderer
            ? game.renderer.createUpgradeCard(upgradeData, upgrade)
            : createUpgradeCard(upgrade);
        upgradesContainer.appendChild(card);
    });
}

// Lade gespeicherte Upgrade-Levels
game.loadUpgradeLevels();

// ===== UPDATE FUNKTIONEN =====

/**
 * Aktualisiert das gesamte UI
 */
function updateUI() {
    updatePointsDisplay(game, pointsDisplay);
    updateStatsDisplay(game, pointsPerSecondDisplay, clickValueDisplay);
    updateUpgradesDisplay(game);
}

// ===== EVENT LISTENERS =====

// Click Button
clickButton.addEventListener('click', () => {
    game.click();
    updateUI();
});

// Upgrade Buttons
game.upgrades.forEach(upgrade => {
    const button = document.getElementById(`btn-${upgrade.id}`);
    if (button) {
        button.addEventListener('click', () => {
            if (game.buyUpgrade(upgrade.id)) {
                updateUI();
            }
        });
    }
});

// Game Events
game.on('pointsChanged', () => {
    updatePointsDisplay(game, pointsDisplay);
    updateUpgradesDisplay(game);
});

game.on('statsChanged', () => {
    updateStatsDisplay(game, pointsPerSecondDisplay, clickValueDisplay);
});

game.on('tick', () => {
    updateUI();
});

game.on('idleProgress', (data) => {
    console.log(`Offline-Fortschritt: ${data.offlineTime.toFixed(0)}s, ${data.pointsEarned.toFixed(0)} Punkte verdient`);
});

game.on('gameSaved', () => {
    // Optional: Visuelles Feedback für Auto-Save
    // console.log('Spiel gespeichert');
});

game.on('upgradeUnlocked', (upgrade) => {
    console.log(`Neues Upgrade freigeschaltet: ${upgrade.name}!`);
    // Show unlock notification
    showUnlockNotification(upgrade);
    updateUI();
});

// ===== INITIALISIERUNG =====

// Erstes UI Update
updateUI();

// UI Update Interval (zusätzlich zu den Events)
setInterval(updateUI, 100);

// ===== DEBUG FUNKTIONEN =====

// Keyboard Shortcuts für Testing
document.addEventListener('keydown', (e) => {
    // 'R' für Reset (mit Bestätigung)
    if (e.key === 'r' || e.key === 'R') {
        if (confirm('Spiel wirklich zurücksetzen? Alle Fortschritte gehen verloren!')) {
            game.reset();
            updateUI();
        }
    }

    // 'S' für manuelles Speichern
    if (e.key === 's' || e.key === 'S') {
        game.saveGame();
        console.log('Spiel manuell gespeichert');
    }

    // '+' für 100 Bonus-Punkte (nur für Testing)
    if (e.key === '+') {
        game.addPoints(100);
        console.log('100 Bonus-Punkte hinzugefügt');
    }
});

// ===== IMPORT/EXPORT UI =====

// Füge Import/Export Buttons zum Footer hinzu
function addImportExportButtons() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'footer-buttons';
    buttonsContainer.innerHTML = `
        <button class="footer-btn" id="import-btn" title="Import Template">📥 Import</button>
        <button class="footer-btn" id="export-btn" title="Export Template">📤 Export</button>
        <button class="footer-btn" id="reset-template-btn" title="Reset to Default">🔄 Reset</button>
    `;

    footer.appendChild(buttonsContainer);

    // Event Handlers
    document.getElementById('import-btn').addEventListener('click', () => {
        ImportExportUI.showImportDialog();
    });

    document.getElementById('export-btn').addEventListener('click', () => {
        if (game.template) {
            ImportExportUI.showExportDialog(game.template);
        } else {
            showNotification('No template to export', 'error');
        }
    });

    document.getElementById('reset-template-btn').addEventListener('click', () => {
        if (confirm('Reset to default template? This will reload the page.')) {
            TemplateLoader.resetToDefault(true);
        }
    });
}

// Notification Helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialisiere Import/Export Buttons
addImportExportButtons();

// Expose game object für Console-Debugging
window.game = game;
window.template = template;
window.ImportExportUI = ImportExportUI;
window.TemplateLoader = TemplateLoader;

console.log('Idle Clicker Game geladen!');
console.log('Shortcuts: R = Reset, S = Save, + = 100 Bonus Points');
console.log('Template System: Active');
console.log('Use ImportExportUI.showImportDialog() or ImportExportUI.showExportDialog(template) for manual control');
