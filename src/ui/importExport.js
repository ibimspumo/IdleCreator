/**
 * Import/Export UI
 *
 * UI-Komponenten für Template Import/Export
 */

class ImportExportUI {
    /**
     * Zeigt den Import-Dialog
     */
    static showImportDialog() {
        const dialog = this.createImportDialog();
        document.body.appendChild(dialog);

        // Focus auf Input
        setTimeout(() => {
            const input = dialog.querySelector('#import-text-input');
            if (input) input.focus();
        }, 100);
    }

    /**
     * Erstellt den Import-Dialog
     * @returns {HTMLElement}
     */
    static createImportDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'import-dialog';

        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Import Game Template</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>

                <div class="modal-body">
                    <div class="import-methods">
                        <div class="import-method active" data-method="text">
                            <h3>📋 Paste Code</h3>
                            <textarea
                                id="import-text-input"
                                placeholder="Paste Base64 code here..."
                                rows="5"
                            ></textarea>
                            <button class="btn-primary" id="import-text-btn">Import</button>
                        </div>

                        <div class="import-method" data-method="file">
                            <h3>📁 Upload File</h3>
                            <input
                                type="file"
                                id="import-file-input"
                                accept=".json"
                            />
                            <button class="btn-primary" id="import-file-btn">Import</button>
                        </div>

                        <div class="import-method" data-method="url">
                            <h3>🔗 From URL</h3>
                            <input
                                type="text"
                                id="import-url-input"
                                placeholder="Paste share URL here..."
                            />
                            <button class="btn-primary" id="import-url-btn">Import</button>
                        </div>
                    </div>

                    <div class="import-status" id="import-status" style="display: none;"></div>
                </div>
            </div>
        `;

        this.attachImportHandlers(overlay);

        return overlay;
    }

    /**
     * Fügt Event Handlers zum Import-Dialog hinzu
     * @param {HTMLElement} dialog
     */
    static attachImportHandlers(dialog) {
        // Text Import
        const textBtn = dialog.querySelector('#import-text-btn');
        const textInput = dialog.querySelector('#import-text-input');

        textBtn.addEventListener('click', () => {
            const base64 = textInput.value.trim();
            this.importFromBase64(base64, dialog);
        });

        // File Import
        const fileBtn = dialog.querySelector('#import-file-btn');
        const fileInput = dialog.querySelector('#import-file-input');

        fileBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) {
                this.showImportError('Please select a file', dialog);
                return;
            }
            await this.importFromFile(file, dialog);
        });

        // URL Import
        const urlBtn = dialog.querySelector('#import-url-btn');
        const urlInput = dialog.querySelector('#import-url-input');

        urlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            this.importFromUrl(url, dialog);
        });

        // Enter key in textarea
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                textBtn.click();
            }
        });
    }

    /**
     * Importiert von Base64
     * @param {string} base64
     * @param {HTMLElement} dialog
     */
    static importFromBase64(base64, dialog) {
        try {
            if (!base64) {
                this.showImportError('Please paste a code', dialog);
                return;
            }

            const template = CompressionUtils.importTemplate(base64);
            this.showImportSuccess(template, dialog);
        } catch (error) {
            this.showImportError('Invalid code: ' + error.message, dialog);
        }
    }

    /**
     * Importiert von File
     * @param {File} file
     * @param {HTMLElement} dialog
     */
    static async importFromFile(file, dialog) {
        try {
            const template = await CompressionUtils.importFromFile(file);
            this.showImportSuccess(template, dialog);
        } catch (error) {
            this.showImportError('Invalid file: ' + error.message, dialog);
        }
    }

    /**
     * Importiert von URL
     * @param {string} url
     * @param {HTMLElement} dialog
     */
    static importFromUrl(url, dialog) {
        try {
            if (!url) {
                this.showImportError('Please paste a URL', dialog);
                return;
            }

            // Extrahiere Base64 aus URL
            const match = url.match(/#game=(.+)$/);
            if (!match) {
                this.showImportError('Invalid URL format', dialog);
                return;
            }

            const base64 = match[1];
            this.importFromBase64(base64, dialog);
        } catch (error) {
            this.showImportError('Invalid URL: ' + error.message, dialog);
        }
    }

    /**
     * Zeigt Erfolgs-Nachricht und lädt Template
     * @param {GameTemplate} template
     * @param {HTMLElement} dialog
     */
    static showImportSuccess(template, dialog) {
        const status = dialog.querySelector('#import-status');
        const summary = template.getSummary();

        status.style.display = 'block';
        status.className = 'import-status success';
        status.innerHTML = `
            <h3>✅ Template Loaded!</h3>
            <div class="template-info">
                <p><strong>${summary.name}</strong></p>
                <p>${summary.description}</p>
                <p class="meta">By ${summary.author} • ${summary.upgradeCount} upgrades</p>
            </div>
            <div class="import-actions">
                <button class="btn-primary" id="load-template-btn">Load Game</button>
                <button class="btn-secondary" id="cancel-import-btn">Cancel</button>
            </div>
        `;

        // Load Handler
        status.querySelector('#load-template-btn').addEventListener('click', () => {
            TemplateLoader.switchTemplate(template, true);
        });

        // Cancel Handler
        status.querySelector('#cancel-import-btn').addEventListener('click', () => {
            dialog.remove();
        });
    }

    /**
     * Zeigt Fehler-Nachricht
     * @param {string} message
     * @param {HTMLElement} dialog
     */
    static showImportError(message, dialog) {
        const status = dialog.querySelector('#import-status');
        status.style.display = 'block';
        status.className = 'import-status error';
        status.innerHTML = `
            <p>❌ ${message}</p>
        `;

        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }

    /**
     * Zeigt den Export-Dialog
     * @param {GameTemplate} template
     */
    static showExportDialog(template) {
        const dialog = this.createExportDialog(template);
        document.body.appendChild(dialog);
    }

    /**
     * Erstellt den Export-Dialog
     * @param {GameTemplate} template
     * @returns {HTMLElement}
     */
    static createExportDialog(template) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'export-dialog';

        const base64 = CompressionUtils.exportTemplate(template);
        const shareUrl = CompressionUtils.createShareUrl(template);
        const size = CompressionUtils.calculateSize(template);

        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Export Game Template</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>

                <div class="modal-body">
                    <div class="export-info">
                        <h3>${template.meta.name}</h3>
                        <p>${template.meta.description}</p>
                        <p class="size-info">Size: ${size.base64Formatted}</p>
                    </div>

                    <div class="export-method">
                        <h4>🔗 Share URL</h4>
                        <div class="copy-field">
                            <input type="text" readonly value="${shareUrl}" id="share-url">
                            <button class="btn-copy" data-copy="share-url">Copy</button>
                        </div>
                    </div>

                    <div class="export-method">
                        <h4>📋 Base64 Code</h4>
                        <div class="copy-field">
                            <textarea readonly rows="3" id="base64-code">${base64}</textarea>
                            <button class="btn-copy" data-copy="base64-code">Copy</button>
                        </div>
                    </div>

                    <div class="export-method">
                        <h4>📁 Download</h4>
                        <button class="btn-primary" id="download-json-btn">Download as JSON</button>
                    </div>

                    <div class="export-status" id="export-status" style="display: none;"></div>
                </div>
            </div>
        `;

        this.attachExportHandlers(overlay, template);

        return overlay;
    }

    /**
     * Fügt Event Handlers zum Export-Dialog hinzu
     * @param {HTMLElement} dialog
     * @param {GameTemplate} template
     */
    static attachExportHandlers(dialog, template) {
        // Copy Buttons
        dialog.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', async () => {
                const targetId = btn.getAttribute('data-copy');
                const target = dialog.querySelector(`#${targetId}`);

                await CompressionUtils.copyToClipboard(target.value);

                const status = dialog.querySelector('#export-status');
                status.style.display = 'block';
                status.className = 'export-status success';
                status.textContent = '✅ Copied to clipboard!';

                setTimeout(() => {
                    status.style.display = 'none';
                }, 2000);
            });
        });

        // Download Button
        dialog.querySelector('#download-json-btn').addEventListener('click', () => {
            CompressionUtils.downloadAsJson(template);

            const status = dialog.querySelector('#export-status');
            status.style.display = 'block';
            status.className = 'export-status success';
            status.textContent = '✅ Download started!';

            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
        });
    }
}
