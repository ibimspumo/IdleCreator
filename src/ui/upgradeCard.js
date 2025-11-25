/**
 * Upgrade Card UI
 *
 * Funktionen zum Erstellen und Aktualisieren von Upgrade-Karten
 */

/**
 * Erstellt eine Upgrade-Karte im UI
 * @param {Upgrade} upgrade - Das Upgrade-Objekt
 * @returns {HTMLElement} Das erstellte DOM-Element
 */
function createUpgradeCard(upgrade) {
    const card = document.createElement('div');
    card.className = 'upgrade-card';
    card.id = `upgrade-${upgrade.id}`;

    card.innerHTML = `
        <div class="upgrade-header">
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-level">Lvl <span id="level-${upgrade.id}">0</span></span>
        </div>
        <p class="upgrade-description">${upgrade.description}</p>
        <div class="unlock-requirement" id="unlock-${upgrade.id}" style="display: none;">
            <span class="lock-icon">🔒</span>
            <span class="unlock-text"></span>
        </div>
        <div class="upgrade-stats" id="stats-${upgrade.id}">
            <div class="upgrade-stat">
                <span>Cost:</span>
                <span id="cost-${upgrade.id}">0</span>
            </div>
            <div class="upgrade-stat">
                <span>Next Cost:</span>
                <span id="nextCost-${upgrade.id}">0</span>
            </div>
        </div>
        <button class="upgrade-button" id="btn-${upgrade.id}">
            BUY
        </button>
    `;

    return card;
}

/**
 * Aktualisiert eine einzelne Upgrade-Karte
 * @param {Upgrade} upgrade - Das Upgrade-Objekt
 * @param {number} currentPoints - Aktuelle Punkte des Spielers
 */
function updateUpgradeCard(upgrade, currentPoints) {
    const info = upgrade.getInfo();
    const levelEl = document.getElementById(`level-${upgrade.id}`);
    const costEl = document.getElementById(`cost-${upgrade.id}`);
    const nextCostEl = document.getElementById(`nextCost-${upgrade.id}`);
    const buttonEl = document.getElementById(`btn-${upgrade.id}`);
    const cardEl = document.getElementById(`upgrade-${upgrade.id}`);
    const unlockEl = document.getElementById(`unlock-${upgrade.id}`);
    const statsEl = document.getElementById(`stats-${upgrade.id}`);

    // Check if upgrade is locked
    if (!info.unlocked) {
        // Show locked state
        if (cardEl) {
            cardEl.classList.add('locked');
            cardEl.classList.remove('disabled');
        }
        if (unlockEl) {
            unlockEl.style.display = 'block';
            const unlockText = unlockEl.querySelector('.unlock-text');
            if (unlockText) {
                unlockText.textContent = info.unlockDescription || 'Locked';
            }
        }
        if (statsEl) statsEl.style.display = 'none';
        if (buttonEl) {
            buttonEl.style.display = 'none';
        }
        return; // Skip weitere Updates für locked upgrades
    }

    // Upgrade is unlocked - show normal state
    if (cardEl) cardEl.classList.remove('locked');
    if (unlockEl) unlockEl.style.display = 'none';
    if (statsEl) statsEl.style.display = 'flex';
    if (buttonEl) buttonEl.style.display = 'block';

    // Update Werte
    if (levelEl) levelEl.textContent = info.level;
    if (costEl) costEl.textContent = formatNumber(info.currentCost);
    if (nextCostEl) {
        nextCostEl.textContent = info.nextCost ? formatNumber(info.nextCost) : 'MAX';
    }

    // Update Button State
    if (buttonEl) {
        const canAfford = upgrade.canAfford(currentPoints);
        buttonEl.disabled = !canAfford;

        if (info.level >= info.maxLevel) {
            buttonEl.textContent = 'MAX LEVEL';
            buttonEl.disabled = true;
        } else {
            buttonEl.textContent = 'BUY';
        }
    }

    // Update Card State
    if (cardEl) {
        if (upgrade.canAfford(currentPoints)) {
            cardEl.classList.remove('disabled');
        } else {
            cardEl.classList.add('disabled');
        }
    }
}
