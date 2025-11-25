/**
 * TemplateLoader
 *
 * Lädt Templates aus verschiedenen Quellen:
 * - URL-Parameter (#game=...)
 * - LocalStorage
 * - Default Template
 */

class TemplateLoader {
    /**
     * Lädt ein Template aus der besten verfügbaren Quelle
     * Priorität: URL > LocalStorage > Default
     * @returns {GameTemplate} Geladenes Template
     */
    static load() {
        // 1. Versuche aus URL zu laden
        const urlTemplate = this.loadFromUrl();
        if (urlTemplate) {
            console.log('Template loaded from URL');
            this.saveToLocalStorage(urlTemplate);
            return urlTemplate;
        }

        // 2. Versuche aus LocalStorage zu laden
        const savedTemplate = this.loadFromLocalStorage();
        if (savedTemplate) {
            console.log('Template loaded from LocalStorage');
            return savedTemplate;
        }

        // 3. Fallback: Default Template
        console.log('Loading default template');
        return this.loadDefault();
    }

    /**
     * Lädt Template aus URL (#game=base64)
     * @returns {GameTemplate|null}
     */
    static loadFromUrl() {
        try {
            return CompressionUtils.loadFromUrl();
        } catch (error) {
            console.error('Failed to load template from URL:', error);
            return null;
        }
    }

    /**
     * Lädt das zuletzt verwendete Template aus LocalStorage
     * @returns {GameTemplate|null}
     */
    static loadFromLocalStorage() {
        try {
            const key = 'currentTemplate';
            const data = localStorage.getItem(key);

            if (!data) {
                return null;
            }

            const templateData = JSON.parse(data);
            return new GameTemplate(templateData);
        } catch (error) {
            console.error('Failed to load template from LocalStorage:', error);
            return null;
        }
    }

    /**
     * Speichert Template in LocalStorage
     * @param {GameTemplate} template - Zu speicherndes Template
     */
    static saveToLocalStorage(template) {
        try {
            const key = 'currentTemplate';
            const data = template.export();
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save template to LocalStorage:', error);
        }
    }

    /**
     * Lädt das Default-Template
     * @returns {GameTemplate}
     */
    static loadDefault() {
        if (typeof createDefaultTemplate === 'function') {
            return createDefaultTemplate();
        }

        // Fallback: Minimales Template
        return new GameTemplate();
    }

    /**
     * Löscht das URL-Fragment (nach dem Laden)
     */
    static clearUrlFragment() {
        if (window.location.hash) {
            // Entferne Hash ohne Reload
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }

    /**
     * Gibt Info über die Quelle des Templates
     * @returns {Object} {source: 'url'|'localStorage'|'default', template: GameTemplate}
     */
    static loadWithSource() {
        // URL Check
        const urlTemplate = this.loadFromUrl();
        if (urlTemplate) {
            this.saveToLocalStorage(urlTemplate);
            return { source: 'url', template: urlTemplate };
        }

        // LocalStorage Check
        const savedTemplate = this.loadFromLocalStorage();
        if (savedTemplate) {
            return { source: 'localStorage', template: savedTemplate };
        }

        // Default
        return { source: 'default', template: this.loadDefault() };
    }

    /**
     * Wechselt zu einem anderen Template
     * @param {GameTemplate} template - Neues Template
     * @param {boolean} reload - Seite neu laden?
     */
    static switchTemplate(template, reload = true) {
        this.saveToLocalStorage(template);

        if (reload) {
            window.location.reload();
        }
    }

    /**
     * Reset: Lädt Default-Template
     * @param {boolean} reload - Seite neu laden?
     */
    static resetToDefault(reload = true) {
        const defaultTemplate = this.loadDefault();
        this.switchTemplate(defaultTemplate, reload);
    }
}
