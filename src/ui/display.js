/**
 * Display Updates
 *
 * Funktionen zum Aktualisieren der Display-Elemente
 */

/**
 * Aktualisiert die Punkte-Anzeige
 * @param {IdleGame} game - Referenz zum Spiel
 * @param {HTMLElement} pointsDisplay - Das Punkte-Display Element
 */
function updatePointsDisplay(game, pointsDisplay) {
    pointsDisplay.textContent = formatNumber(game.state.points);
}

/**
 * Aktualisiert die Points-per-Second Anzeige
 * @param {IdleGame} game - Referenz zum Spiel
 * @param {HTMLElement} pointsPerSecondDisplay - Das PPS-Display Element
 * @param {HTMLElement} clickValueDisplay - Das Click-Value Element
 */
function updateStatsDisplay(game, pointsPerSecondDisplay, clickValueDisplay) {
    pointsPerSecondDisplay.textContent = game.state.pointsPerSecond.toFixed(1);
    clickValueDisplay.textContent = game.state.clickPower;
}

/**
 * Aktualisiert alle Upgrade-Karten
 * @param {IdleGame} game - Referenz zum Spiel
 */
function updateUpgradesDisplay(game) {
    game.upgrades.forEach(upgrade => {
        updateUpgradeCard(upgrade, game.state.points);
    });
}
