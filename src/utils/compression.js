/**
 * Compression Utilities
 *
 * Komprimiert und dekomprimiert Game Templates
 * Verwendet einfache Base64-Encoding (LZString kann später hinzugefügt werden)
 */

class CompressionUtils {
    /**
     * Exportiert ein Template als Base64-String
     * @param {GameTemplate} template - Zu exportierendes Template
     * @returns {string} Base64-kodierter String
     */
    static exportTemplate(template) {
        try {
            const data = template.export();
            const json = JSON.stringify(data);

            // Einfache Base64-Encoding (funktioniert ohne externe Libs)
            const base64 = btoa(unescape(encodeURIComponent(json)));

            return base64;
        } catch (error) {
            console.error('Error exporting template:', error);
            throw new Error('Failed to export template');
        }
    }

    /**
     * Importiert ein Template aus Base64-String
     * @param {string} base64 - Base64-kodierter String
     * @returns {GameTemplate} Importiertes Template
     */
    static importTemplate(base64) {
        try {
            // Dekodiere Base64
            const json = decodeURIComponent(escape(atob(base64)));
            const data = JSON.parse(json);

            // Erstelle Template aus Daten
            return new GameTemplate(data);
        } catch (error) {
            console.error('Error importing template:', error);
            throw new Error('Failed to import template: Invalid data');
        }
    }

    /**
     * Erstellt eine Share-URL mit dem Template
     * @param {GameTemplate} template - Zu teilendes Template
     * @returns {string} Share-URL
     */
    static createShareUrl(template) {
        const base64 = this.exportTemplate(template);

        // Check URL-Länge (Browser-Limits)
        const url = `${window.location.origin}/game.html#game=${base64}`;

        if (url.length > 2000) {
            console.warn('Share URL is very long, may cause issues in some browsers');
        }

        return url;
    }

    /**
     * Lädt Template aus URL-Hash
     * @returns {GameTemplate|null} Template oder null
     */
    static loadFromUrl() {
        try {
            const hash = window.location.hash;

            if (!hash || !hash.includes('#game=')) {
                return null;
            }

            const base64 = hash.split('#game=')[1];

            if (!base64) {
                return null;
            }

            return this.importTemplate(base64);
        } catch (error) {
            console.error('Error loading template from URL:', error);
            return null;
        }
    }

    /**
     * Exportiert Template als JSON-Datei (Download)
     * @param {GameTemplate} template - Zu exportierendes Template
     * @param {string} filename - Dateiname (optional)
     */
    static downloadAsJson(template, filename = null) {
        const data = template.export();
        const json = JSON.stringify(data, null, 2); // Pretty-print

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `${template.meta.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Importiert Template aus JSON-Datei
     * @param {File} file - JSON-Datei
     * @returns {Promise<GameTemplate>} Template
     */
    static async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = e.target.result;
                    const data = JSON.parse(json);
                    const template = new GameTemplate(data);
                    resolve(template);
                } catch (error) {
                    reject(new Error('Invalid template file'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Berechnet die Größe eines Templates in Bytes
     * @param {GameTemplate} template - Template
     * @returns {Object} Size info {json, base64, compressed}
     */
    static calculateSize(template) {
        const data = template.export();
        const json = JSON.stringify(data);
        const base64 = this.exportTemplate(template);

        return {
            json: json.length,
            base64: base64.length,
            jsonFormatted: this.formatBytes(json.length),
            base64Formatted: this.formatBytes(base64.length)
        };
    }

    /**
     * Formatiert Bytes in lesbare Form
     * @param {number} bytes - Anzahl Bytes
     * @returns {string} Formatierter String
     */
    static formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    /**
     * Kopiert Text in die Zwischenablage
     * @param {string} text - Zu kopierender Text
     * @returns {Promise<boolean>} True wenn erfolgreich
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback für ältere Browser
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }
}
