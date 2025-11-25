/**
 * Theme Builder Component
 *
 * Handles theme color picker and live preview
 */

class ThemeBuilder {
    /**
     * Initialize theme builder
     */
    static initialize() {
        this.initializeColorPickers();
        this.initializePresets();
        this.updatePreview();
    }

    /**
     * Initialize color pickers with sync
     */
    static initializeColorPickers() {
        const colors = ['primary', 'secondary', 'background', 'text'];

        colors.forEach(colorType => {
            const colorInput = document.getElementById(`${colorType}-color`);
            const textInput = document.getElementById(`${colorType}-color-text`);

            if (!colorInput || !textInput) return;

            // Sync color picker with text input
            colorInput.addEventListener('input', () => {
                textInput.value = colorInput.value;
                this.updatePreview();
            });

            // Allow manual hex input (optional enhancement)
            textInput.addEventListener('change', () => {
                if (this.isValidHex(textInput.value)) {
                    colorInput.value = textInput.value;
                    this.updatePreview();
                }
            });
        });
    }

    /**
     * Initialize preset theme buttons
     */
    static initializePresets() {
        const presets = {
            dark: {
                primaryColor: '#4a90e2',
                secondaryColor: '#f39c12',
                backgroundColor: '#1a1a2e',
                textColor: '#ffffff'
            },
            light: {
                primaryColor: '#3498db',
                secondaryColor: '#e74c3c',
                backgroundColor: '#ecf0f1',
                textColor: '#2c3e50'
            },
            forest: {
                primaryColor: '#27ae60',
                secondaryColor: '#f39c12',
                backgroundColor: '#1e3a1e',
                textColor: '#ecf0f1'
            },
            ocean: {
                primaryColor: '#3498db',
                secondaryColor: '#1abc9c',
                backgroundColor: '#0a2463',
                textColor: '#e8f4f8'
            },
            sunset: {
                primaryColor: '#e74c3c',
                secondaryColor: '#f39c12',
                backgroundColor: '#2c1810',
                textColor: '#ffeaa7'
            }
        };

        document.querySelectorAll('.theme-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                if (presets[theme]) {
                    this.applyPreset(presets[theme]);
                }
            });
        });
    }

    /**
     * Apply a preset theme
     */
    static applyPreset(preset) {
        Object.keys(preset).forEach(key => {
            const colorType = key.replace('Color', '');
            const colorInput = document.getElementById(`${colorType}-color`);
            const textInput = document.getElementById(`${colorType}-color-text`);

            if (colorInput && textInput) {
                colorInput.value = preset[key];
                textInput.value = preset[key];
            }
        });

        this.updatePreview();
    }

    /**
     * Update live preview
     */
    static updatePreview() {
        const primary = document.getElementById('primary-color').value;
        const secondary = document.getElementById('secondary-color').value;
        const background = document.getElementById('background-color').value;
        const text = document.getElementById('text-color').value;

        const preview = document.getElementById('theme-preview');
        if (!preview) return;

        // Apply CSS custom properties to preview
        preview.style.setProperty('--preview-primary', primary);
        preview.style.setProperty('--preview-secondary', secondary);
        preview.style.setProperty('--preview-background', background);
        preview.style.setProperty('--preview-text', text);
    }

    /**
     * Validate hex color
     */
    static isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    /**
     * Get current theme
     */
    static getCurrentTheme() {
        return {
            primaryColor: document.getElementById('primary-color').value,
            secondaryColor: document.getElementById('secondary-color').value,
            backgroundColor: document.getElementById('background-color').value,
            textColor: document.getElementById('text-color').value
        };
    }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
    ThemeBuilder.initialize();
});
