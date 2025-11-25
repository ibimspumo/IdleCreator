/**
 * DynamicRenderer
 *
 * Rendert das Game-UI dynamisch basierend auf einem Template
 * Ersetzt statische Texte mit Template-Werten
 */

class DynamicRenderer {
    constructor(template, game) {
        this.template = template;
        this.game = game;
    }

    /**
     * Initialisiert das dynamische UI
     */
    initialize() {
        this.applyTheme();
        this.updateTexts();
        this.updateTitle();
    }

    /**
     * Wendet das Theme (Farben) an
     */
    applyTheme() {
        const colors = this.template.theme.colors;
        const root = document.documentElement;

        // Setze CSS Custom Properties
        root.style.setProperty('--bg-primary', colors.primary);
        root.style.setProperty('--bg-secondary', colors.secondary);
        root.style.setProperty('--text-primary', colors.text);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--border-color', colors.border);
        root.style.setProperty('--hover-bg', colors.hoverBg);
        root.style.setProperty('--disabled-bg', colors.disabledBg);
        root.style.setProperty('--disabled-text', colors.disabledText);
    }

    /**
     * Aktualisiert alle Texte basierend auf dem Template
     */
    updateTexts() {
        const resource = this.template.resources.primary;

        // Header Title
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) {
            headerTitle.textContent = this.template.meta.name;
        }

        // Points Label
        const pointsLabel = document.querySelector('.stat-label');
        if (pointsLabel && pointsLabel.textContent.includes('Points')) {
            pointsLabel.textContent = `${resource.namePlural}:`;
        }

        // Click Button Text
        const clickButton = document.querySelector('.click-button .click-text');
        if (clickButton) {
            clickButton.textContent = resource.clickVerb.toUpperCase();
        }

        // Footer (optional: add game description)
        const footer = document.querySelector('.footer p');
        if (footer && this.template.meta.description) {
            footer.textContent = `${this.template.meta.description} • Auto-Save aktiviert`;
        }
    }

    /**
     * Aktualisiert den Browser-Titel
     */
    updateTitle() {
        document.title = this.template.meta.name;
    }

    /**
     * Erstellt eine Upgrade-Karte aus Template-Daten
     * @param {Object} upgradeData - Upgrade aus Template
     * @param {Upgrade} upgradeInstance - Upgrade-Instanz
     * @returns {HTMLElement} Upgrade-Karte
     */
    createUpgradeCard(upgradeData, upgradeInstance) {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.id = `upgrade-${upgradeInstance.id}`;

        // Icon (falls vorhanden)
        const icon = upgradeData.icon ? `<span class="upgrade-icon">${upgradeData.icon}</span>` : '';

        card.innerHTML = `
            <div class="upgrade-header">
                <span class="upgrade-name">${icon}${upgradeInstance.name}</span>
                <span class="upgrade-level">Lvl <span id="level-${upgradeInstance.id}">0</span></span>
            </div>
            <p class="upgrade-description">${upgradeInstance.description}</p>
            <div class="unlock-requirement" id="unlock-${upgradeInstance.id}" style="display: none;">
                <span class="lock-icon">🔒</span>
                <span class="unlock-text"></span>
            </div>
            <div class="upgrade-stats" id="stats-${upgradeInstance.id}">
                <div class="upgrade-stat">
                    <span>Cost:</span>
                    <span id="cost-${upgradeInstance.id}">0</span>
                </div>
                <div class="upgrade-stat">
                    <span>Next Cost:</span>
                    <span id="nextCost-${upgradeInstance.id}">0</span>
                </div>
            </div>
            <button class="upgrade-button" id="btn-${upgradeInstance.id}">
                BUY
            </button>
        `;

        return card;
    }

    /**
     * Formatiert Zahlen mit dem Resource-Namen
     * @param {number} value - Wert
     * @param {boolean} plural - Plural verwenden?
     * @returns {string} Formatierter String
     */
    formatWithResource(value, plural = true) {
        const resource = this.template.resources.primary;
        const name = plural ? resource.namePlural : resource.name;
        return `${formatNumber(value)} ${name}`;
    }

    /**
     * Erstellt eine Unlock-Beschreibung aus Condition
     * @param {Object} condition - Unlock Condition
     * @returns {string} Beschreibung
     */
    createUnlockDescription(condition) {
        if (!condition) {
            return '';
        }

        // Verwende ConditionEngine für Beschreibung
        return conditionEngine.describe(condition);
    }

    /**
     * Aktualisiert die Punkte-Anzeige mit Resource-Namen
     * @param {HTMLElement} element - Display-Element
     * @param {number} points - Punktzahl
     */
    updatePointsDisplay(element, points) {
        element.textContent = formatNumber(points);
    }

    /**
     * Gibt Resource-Icon zurück (falls definiert)
     * @returns {string} Icon oder leerer String
     */
    getResourceIcon() {
        return this.template.resources.primary.icon || '';
    }

    /**
     * Gibt den Click-Verb zurück
     * @returns {string} Click-Verb
     */
    getClickVerb() {
        return this.template.resources.primary.clickVerb;
    }

    /**
     * Erstellt eine Achievement-Karte (für später)
     * @param {Object} achievementData - Achievement aus Template
     * @returns {HTMLElement} Achievement-Karte
     */
    createAchievementCard(achievementData) {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.id = `achievement-${achievementData.id}`;

        const icon = achievementData.icon || '🏆';

        card.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievementData.name}</div>
                <div class="achievement-description">${achievementData.description}</div>
            </div>
        `;

        return card;
    }

    /**
     * Update Icon CSS (für Custom Icons später)
     */
    updateIconStyles() {
        // Für später: Wenn Custom Icon-Support gewünscht
        const icon = this.template.resources.primary.icon;
        if (icon && icon.startsWith('http')) {
            // Custom Image Icon
            // Implementierung später
        }
    }
}
