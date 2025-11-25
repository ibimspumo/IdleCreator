/**
 * Effect Builder Component
 *
 * Populates effect type dropdown and handles effect selection
 */

class EffectBuilder {
    /**
     * Populate effect type dropdown
     */
    static populateEffectTypes() {
        const select = document.getElementById('effect-type');
        if (!select) return;

        const types = effectEngine.getAvailableTypes();

        types.forEach(type => {
            const metadata = effectEngine.getTypeMetadata(type);
            const option = document.createElement('option');
            option.value = type;
            option.textContent = metadata.name;
            select.appendChild(option);
        });

        // Add change listener to show description
        select.addEventListener('change', () => {
            this.updateEffectDescription();
        });
    }

    /**
     * Update effect description based on selection
     */
    static updateEffectDescription() {
        const select = document.getElementById('effect-type');
        const descriptionEl = document.getElementById('effect-description');

        if (!select || !descriptionEl) return;

        const type = select.value;
        if (!type) {
            descriptionEl.textContent = '';
            return;
        }

        const metadata = effectEngine.getTypeMetadata(type);
        descriptionEl.textContent = metadata.description;
    }

    /**
     * Get current effect from form
     */
    static getCurrentEffect() {
        const type = document.getElementById('effect-type').value;
        const value = parseFloat(document.getElementById('effect-value').value);

        if (!type || isNaN(value)) {
            return null;
        }

        return { type, value };
    }

    /**
     * Reset effect form
     */
    static resetForm() {
        document.getElementById('effect-type').value = '';
        document.getElementById('effect-value').value = '1';
        document.getElementById('effect-description').textContent = '';
    }
}

// Auto-populate on load
if (typeof effectEngine !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        EffectBuilder.populateEffectTypes();
    });
}
